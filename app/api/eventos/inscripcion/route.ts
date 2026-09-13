/**
 * Inscripción a un evento: el mail que se deja en el popup del evento.
 *
 * QUE PROTEGE, EN ORDEN
 *
 *  1. Tamaño del body antes de parsear, y JSON válido.
 *  2. Honeypot y tiempo mínimo de llenado: al bot se le contesta 200 para que
 *     no reintente, y no se hace nada.
 *  3. El mail: largo, sin caracteres de control (header injection) y con la
 *     misma expresión que contacto y brochure.
 *  4. Tres cuotas: por IP, por mail (hasheado) y global. La del mail es la que
 *     impide usar esto de relay para mandarle correo a una casilla ajena.
 *  5. La inscripción la decide la base, en una función con lock
 *     (`inscribir_en_evento`): evento publicado, no terminado, cupo y mail
 *     repetido. Nada de eso se confía al navegador.
 *  6. El mail de confirmación sale SÓLO en una inscripción nueva, con datos
 *     leídos de la base y escapados. Del navegador no entra texto al correo.
 *  7. "Ya estabas anotado" se contesta igual que "te anotamos": la respuesta no
 *     revela qué direcciones están en la lista de un evento.
 *
 * Además se guarda como lead en `leads`, con su atribución de campaña, igual
 * que el brochure y el popup: una inscripción es una conversión.
 */

import type { NextRequest } from "next/server";
import { createHash } from "node:crypto";

import { EMAIL_RE, LIMITS, MIN_FILL_MS, extractAttribution } from "@/lib/contact/schema";
import { clientIp } from "@/lib/contact/clientIp";
import { consume, EVENTO_EMAIL_RULES, EVENTO_GLOBAL_RULES, EVENTO_IP_RULES } from "@/lib/contact/rateLimit";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { CATEGORIAS, CATEGORIA_COLOR, ZONA, type Categoria } from "@/lib/eventos";
import { buildHtml, buildIcs, buildText, type DatosInscripcion } from "@/lib/eventos/emailInscripcion";
import { ORG } from "@/lib/seo/site";

export const runtime = "nodejs";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const TIPO: Record<string, string> = {
  workshop: "Workshop",
  webinar: "Webinar",
  capacitacion: "Capacitación",
  charla: "Charla",
  meetup: "Meetup",
  lanzamiento: "Lanzamiento",
};
const MODALIDAD: Record<string, string> = { presencial: "Presencial", online: "Online", hibrido: "Híbrido" };

/** Categoría del evento → `leads.service`, el vocabulario del form de contacto. */
const SERVICE_POR_CATEGORIA: Record<Categoria, string> = {
  networking: "networking",
  seguridad: "seguridad",
  "firma-biometrica": "biometrica",
  consultoria: "consultoria",
  "software-ai": "otro",
};

function json(status: number, body: Record<string, unknown>) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function tieneControl(s: string): boolean {
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c < 32 || c === 127) return true;
  }
  return false;
}

export async function POST(req: NextRequest) {
  // ── 1. Body ──
  const declarado = Number(req.headers.get("content-length") ?? 0);
  if (declarado > LIMITS.maxBodyBytes) return json(413, { error: "too_large" });
  const raw = await req.text();
  if (raw.length > LIMITS.maxBodyBytes) return json(413, { error: "too_large" });

  let body: Record<string, unknown>;
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) throw new Error();
    body = parsed as Record<string, unknown>;
  } catch {
    return json(400, { error: "invalid" });
  }

  // ── 2. Bots ──
  if (typeof body.website === "string" && body.website.trim() !== "") {
    console.warn("[evento inscripcion] honeypot activado");
    return json(200, { ok: true, mail: true });
  }
  const tardo = Number(body.elapsedMs);
  if (!Number.isFinite(tardo) || tardo < MIN_FILL_MS) return json(200, { ok: true, mail: true });

  // ── 3. Datos ──
  const emailCrudo = typeof body.email === "string" ? body.email.trim() : "";
  if (!emailCrudo || emailCrudo.length > LIMITS.email || tieneControl(emailCrudo) || !EMAIL_RE.test(emailCrudo)) {
    return json(400, { error: "email" });
  }
  const email = emailCrudo.toLowerCase();

  const eventoId = typeof body.evento_id === "string" ? body.evento_id.trim() : "";

  // Eventos de ejemplo (?muestra=1): en desarrollo la UI se prueba de punta a
  // punta sin tocar la base ni mandar correo. En producción no existen.
  if (process.env.NODE_ENV !== "production" && /^muestra-[a-z0-9-]{1,80}$/.test(eventoId)) {
    return json(200, { ok: true, mail: true });
  }
  if (!UUID_RE.test(eventoId)) return json(400, { error: "invalid" });

  // ── 4. Cuotas ──
  const ip = clientIp(req);
  // El mail se hashea antes de usarlo de clave: el contador vive en un Redis de
  // terceros y ahí no tienen por qué quedar direcciones legibles.
  const emailKey = createHash("sha256").update(email).digest("hex").slice(0, 32);

  for (const [scope, id, reglas] of [
    ["evento:ip", ip, EVENTO_IP_RULES],
    ["evento:email", emailKey, EVENTO_EMAIL_RULES],
    ["evento:global", "all", EVENTO_GLOBAL_RULES],
  ] as const) {
    const veredicto = await consume(scope, id, reglas);
    if (!veredicto.allowed) {
      console.warn(`[evento inscripcion] rate limit "${veredicto.rule}"`);
      return json(429, { error: "rate_limited" });
    }
  }

  const db = getSupabaseAdmin();
  if (!db) return json(503, { error: "server" });

  // ── 5. La inscripción ──
  const { data: estado, error: errRpc } = await db.rpc("inscribir_en_evento", { p_evento: eventoId, p_email: email });
  if (errRpc) {
    console.error("[evento inscripcion] rpc:", errRpc.message);
    return json(500, { error: "server" });
  }

  switch (estado) {
    case "inexistente":
      return json(404, { error: "not_found" });
    case "cerrado":
      return json(410, { error: "closed" });
    case "completo":
      return json(409, { error: "full" });
    case "repetido":
      // Igual que una inscripción nueva, a propósito (ver el punto 7). Sin mail:
      // repetir el pedido no puede servir para mandar correo otra vez.
      return json(200, { ok: true, mail: true });
    case "nuevo":
      break;
    default:
      console.error("[evento inscripcion] estado inesperado:", estado);
      return json(500, { error: "server" });
  }

  // ── 6. Lead y confirmación ──
  const { data: evento } = await db
    .from("eventos")
    .select("id, slug, titulo, tipo, modalidad, inicio, fin, lugar, resumen, categorias")
    .eq("id", eventoId)
    .maybeSingle();

  if (!evento) return json(200, { ok: true, mail: false });

  const categorias = CATEGORIAS.filter((c) => Array.isArray(evento.categorias) && evento.categorias.includes(c));
  const [, mailOk] = await Promise.all([
    guardarLead(db, { email, evento, categorias, body, ip, userAgent: req.headers.get("user-agent") }),
    enviarConfirmacion(email, datosDelMail(evento, categorias)),
  ]);

  return json(200, { ok: true, mail: mailOk });
}

/* ── Partes ───────────────────────────────────────────────────────────────── */

type FilaEvento = {
  id: string;
  slug: string;
  titulo: string;
  tipo: string;
  modalidad: string;
  inicio: string;
  fin: string | null;
  lugar: string | null;
  resumen: string | null;
  categorias: string[] | null;
};

function datosDelMail(e: FilaEvento, categorias: Categoria[]): DatosInscripcion {
  const inicio = new Date(e.inicio);
  const fin = e.fin ? new Date(e.fin) : new Date(inicio.getTime() + 3 * 60 * 60 * 1000);
  const hora = (d: Date) => d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: ZONA });
  const fecha = inicio.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: ZONA });

  return {
    id: e.id,
    slug: e.slug,
    titulo: e.titulo,
    tipoTexto: `${TIPO[e.tipo] ?? "Evento"} · ${MODALIDAD[e.modalidad] ?? ""}`,
    fechaTexto: fecha.charAt(0).toUpperCase() + fecha.slice(1),
    horarioTexto: `${hora(inicio)} a ${hora(fin)} h (hora de Buenos Aires)`,
    lugar: e.lugar ?? "",
    resumen: e.resumen ?? "",
    inicio: inicio.toISOString(),
    fin: fin.toISOString(),
    accent: categorias[0] ? CATEGORIA_COLOR[categorias[0]] : "#2B6FD4",
  };
}

async function guardarLead(
  db: NonNullable<ReturnType<typeof getSupabaseAdmin>>,
  {
    email,
    evento,
    categorias,
    body,
    ip,
    userAgent,
  }: {
    email: string;
    evento: FilaEvento;
    categorias: Categoria[];
    body: Record<string, unknown>;
    ip: string;
    userAgent: string | null;
  }
): Promise<void> {
  const attribution = extractAttribution(body);

  // leads.session_id tiene FK a sessions: si el beacon del pageview no llegó,
  // el insert fallaría. Mismo cuidado que contacto, brochure y popup.
  if (attribution.session_id) {
    const { error } = await db.from("sessions").upsert({ id: attribution.session_id }, { onConflict: "id", ignoreDuplicates: true });
    if (error) delete attribution.session_id;
  }

  const { error } = await db.from("leads").insert({
    name: "",
    company: "",
    email,
    message: `Se anotó al evento “${evento.titulo}”.`,
    service: categorias[0] ? SERVICE_POR_CATEGORIA[categorias[0]] : null,
    ...attribution,
    ip: ip === "unknown" ? null : ip,
    user_agent: userAgent?.slice(0, 512) ?? null,
    metadata: { tipo: "evento", evento_id: evento.id, evento: evento.slug },
  });
  // La inscripción ya quedó guardada: perder el lead no invalida la respuesta.
  if (error) console.error("[evento inscripcion] lead no persistido:", error.message);
}

async function enviarConfirmacion(email: string, datos: DatosInscripcion): Promise<boolean> {
  const from = process.env.CONTACT_FROM;
  const apiKey = process.env.RESEND_API_KEY;
  if (!from || !apiKey) {
    console.warn("[evento inscripcion] sin CONTACT_FROM/RESEND_API_KEY: no sale la confirmación");
    return false;
  }

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [email],
        reply_to: ORG.email,
        // El asunto lleva el título de la base, sin saltos de línea.
        subject: `Quedaste anotado: ${datos.titulo.replace(/[\r\n]+/g, " ").slice(0, 120)}`,
        text: buildText(datos),
        html: buildHtml(datos),
        attachments: [
          {
            filename: "evento-accedra.ics",
            content: Buffer.from(buildIcs(datos), "utf8").toString("base64"),
            content_type: "text/calendar; charset=utf-8; method=PUBLISH",
          },
        ],
      }),
    });
    if (!res.ok) {
      console.error("[evento inscripcion] Resend respondió", res.status);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[evento inscripcion] fallo al enviar:", err instanceof Error ? err.message : err);
    return false;
  }
}
