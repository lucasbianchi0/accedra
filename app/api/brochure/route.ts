/**
 * Entrega del brochure a cambio del mail.
 *
 * No reusa /api/contact porque su `validate()` exige nombre, empresa y mensaje:
 * el sentido de este bloque es que cueste UN campo. Sí reusa todo lo que protege
 * al otro —honeypot, tiempo mínimo de llenado, rate limit por IP, atribución— y
 * escribe en la misma tabla `leads`, para que un pedido de brochure y una
 * consulta convivan en el mismo pipeline comercial.
 *
 * El PDF va ADJUNTO y además como enlace. El adjunto es lo que se pidió; el
 * enlace queda igual porque muchos servidores corporativos recortan adjuntos
 * grandes, y en ese caso el mail tiene que seguir sirviendo para algo.
 */

import type { NextRequest } from "next/server";
import { EMAIL_RE, LIMITS, MIN_FILL_MS, extractAttribution, type AttributionData } from "@/lib/contact/schema";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import {
  consume, BROCHURE_IP_RULES, BROCHURE_EMAIL_RULES, BROCHURE_GLOBAL_RULES,
} from "@/lib/contact/rateLimit";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { buildHtml, buildText, type DatosBrochure } from "@/lib/brochure/emailTemplate";
import { clientIp } from "@/lib/contact/clientIp";
import { SERVICES, ORG, abs } from "@/lib/seo/site";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export const runtime = "nodejs";

/**
 * Slug de solución → valor de `leads.service`.
 *
 * La columna usa el vocabulario del <select> de contacto, que no coincide del
 * todo con las rutas. Sin este mapa, "firma-biometrica" y "biometrica" serían
 * dos servicios distintos al agrupar leads por origen.
 */
const SERVICE_POR_SLUG: Record<string, string> = {
  networking: "networking",
  seguridad: "seguridad",
  "firma-biometrica": "biometrica",
  consultoria: "consultoria",
  "software-ai": "otro",
};

const NOMBRE_POR_SLUG = new Map(SERVICES.map((s) => [s.slug, s.name] as const));

/**
 * Color de identidad de cada solución — el único acento del mail.
 *
 * Duplicado de `solutionsData.ts` a propósito: ese archivo importa medio
 * lucide-react para los íconos de las capacidades, y arrastrar eso al bundle de
 * una API route por cinco cadenas de color no tiene sentido. Si cambia un color
 * allá, hay que tocarlo acá.
 */
const ACCENT_POR_SLUG: Record<string, string> = {
  networking: "#3B82F6",
  "firma-biometrica": "#7C6CF6",
  consultoria: "#06B6D4",
  seguridad: "#10B981",
  "software-ai": "#B45CF2",
};

/** Peso legible del adjunto, en la convención local (coma decimal). */
function pesoLegible(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(1).replace(".", ",")} MB`;
}

/**
 * Lee el PDF del disco para adjuntarlo.
 *
 * Devuelve null ante cualquier problema en vez de lanzar: si el archivo no está,
 * el mail igual sale con el enlace — perder el adjunto es molesto, perder el
 * mail entero es perder el lead.
 */
async function leerBrochure(slug: string): Promise<{ base64: string; bytes: number } | null> {
  try {
    const buf = await readFile(join(process.cwd(), "public", "brochures", `accedra-${slug}.pdf`));
    return { base64: buf.toString("base64"), bytes: buf.byteLength };
  } catch (err) {
    console.error(`[brochure] no se pudo leer el PDF de ${slug}:`, err);
    return null;
  }
}

function json(status: number, body: Record<string, unknown>) {
  return Response.json(body, { status });
}

export async function POST(req: NextRequest) {
  const to = process.env.CONTACT_FROM; // remitente; el destinatario es el visitante
  const apiKey = process.env.RESEND_API_KEY;
  const puedeMandarMail = Boolean(to && apiKey);
  const puedePersistir = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

  if (!puedeMandarMail && !puedePersistir) {
    console.error("[brochure] sin destino configurado: faltan CONTACT_FROM/RESEND_API_KEY y SUPABASE_*");
    return json(500, { error: "server" });
  }

  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > LIMITS.maxBodyBytes) return json(413, { error: "too_large" });

  const raw = await req.text();
  if (raw.length > LIMITS.maxBodyBytes) return json(413, { error: "too_large" });

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return json(400, { error: "invalid" });
  }
  const body = parsed as Record<string, unknown>;

  // Honeypot y tiempo mínimo: 200 a propósito, para que el bot no reintente.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    console.warn("[brochure] honeypot activado", { ip: clientIp(req) });
    return json(200, { ok: true });
  }
  const elapsed = Number(body.elapsedMs);
  if (!Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) return json(200, { ok: true });

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const slug = typeof body.slug === "string" ? body.slug.trim() : "";

  if (!email || email.length > LIMITS.email || !EMAIL_RE.test(email)) {
    return json(400, { error: "invalid" });
  }
  // El slug decide qué archivo se sirve, así que se valida contra la lista
  // cerrada de soluciones: interpolarlo tal cual en una ruta de /public sería
  // un path traversal servido por nosotros mismos.
  const solucion = NOMBRE_POR_SLUG.get(slug as (typeof SERVICES)[number]["slug"]);
  if (!solucion) return json(400, { error: "invalid" });

  const ip = clientIp(req);

  // Tres cuotas independientes, en este orden a propósito: primero la barata de
  // esquivar (IP), después la que impide usarnos de relay (el mail), y al final
  // el techo global. Alcanza que una corte.
  //
  // El mail se hashea antes de usarlo como clave: el contador vive en un Redis
  // de terceros y no hay ninguna razón para que ahí queden direcciones legibles
  // de gente que sólo pidió un PDF. Para contar, el hash sirve igual.
  const emailKey = createHash("sha256").update(email.toLowerCase()).digest("hex").slice(0, 32);

  for (const [scope, id, rules] of [
    ["brochure:ip", ip, BROCHURE_IP_RULES],
    ["brochure:email", emailKey, BROCHURE_EMAIL_RULES],
    ["brochure:global", "all", BROCHURE_GLOBAL_RULES],
  ] as const) {
    const verdict = await consume(scope, id, rules);
    if (!verdict.allowed) {
      console.warn(`[brochure] rate limit "${verdict.rule}" (ip ${ip})`);
      return json(429, { error: "rate_limited" });
    }
  }

  const attribution = extractAttribution(parsed);
  const pdf = abs(`/brochures/accedra-${slug}.pdf`);

  const [persistido, enviado] = await Promise.all([
    guardarLead({ email, slug, solucion, attribution, ip, userAgent: req.headers.get("user-agent") }),
    puedeMandarMail
      ? enviarBrochure({ from: to!, apiKey: apiKey!, email, slug, solucion, pdf })
      : Promise.resolve(false),
  ]);

  if (!persistido && !enviado) return json(502, { error: "delivery" });
  if (!persistido) console.error("[brochure] brochure enviado pero lead NO persistido");
  if (!enviado) console.error("[brochure] lead persistido pero brochure NO enviado por mail");

  return json(200, { ok: true });
}

/**
 * Persiste el pedido como un lead más.
 *
 * `name` y `company` van vacíos porque son NOT NULL en la tabla y acá no se
 * piden: lo que distingue a estos leads es `metadata.tipo`, no un placeholder
 * inventado en las columnas de datos reales.
 */
async function guardarLead({
  email, slug, solucion, attribution, ip, userAgent,
}: {
  email: string;
  slug: string;
  solucion: string;
  attribution: AttributionData;
  ip: string;
  userAgent: string | null;
}): Promise<boolean> {
  const db = getSupabaseAdmin();
  if (!db) {
    console.warn("[brochure] Supabase sin configurar — no se persiste el lead");
    return false;
  }

  // Mismo cuidado que en /api/contact: leads.session_id tiene FK a sessions y si
  // el beacon del pageview no llegó, el insert fallaría y se perdería el lead.
  if (attribution.session_id) {
    const { error: errSesion } = await db
      .from("sessions")
      .upsert({ id: attribution.session_id }, { onConflict: "id", ignoreDuplicates: true });
    if (errSesion) {
      console.warn("[brochure] no se pudo asegurar la sesión:", errSesion.message);
      delete attribution.session_id;
    }
  }

  const { error } = await db.from("leads").insert({
    name: "",
    company: "",
    email,
    message: `Descargó el brochure de ${solucion}.`,
    service: SERVICE_POR_SLUG[slug] ?? null,
    ...attribution,
    ip: ip === "unknown" ? null : ip,
    user_agent: userAgent?.slice(0, 512) ?? null,
    metadata: { tipo: "brochure", solucion: slug },
  });

  if (error) {
    console.error("[brochure] error al persistir en Supabase:", error.message);
    return false;
  }
  return true;
}

/** Manda el brochure al visitante, adjunto. Devuelve si Resend lo aceptó. */
async function enviarBrochure({
  from, apiKey, email, slug, solucion, pdf,
}: {
  from: string;
  apiKey: string;
  email: string;
  slug: string;
  solucion: string;
  pdf: string;
}): Promise<boolean> {
  const archivo = `accedra-${slug}.pdf`;
  const adjunto = await leerBrochure(slug);

  const datos: DatosBrochure = {
    solucion,
    accent: ACCENT_POR_SLUG[slug] ?? "#2B6FD4",
    pdf,
    archivo,
    peso: adjunto ? pesoLegible(adjunto.bytes) : null,
    slug,
  };

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [email],
        // Responder al mail cae en la casilla del equipo, no en el remitente
        // técnico: si alguien contesta "me interesa", eso es un lead caliente.
        reply_to: ORG.email,
        subject: `Tu brochure de ${solucion} — ${ORG.shortName}`,
        text: buildText(datos),
        html: buildHtml(datos),
        ...(adjunto
          ? { attachments: [{ filename: archivo, content: adjunto.base64 }] }
          : {}),
      }),
    });
    if (!res.ok) {
      console.error("[brochure] Resend respondió", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[brochure] fallo al enviar:", err);
    return false;
  }
}
