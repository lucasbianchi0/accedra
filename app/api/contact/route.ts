import type { NextRequest } from "next/server";
import {
  LIMITS, MIN_FILL_MS, validate, extractAttribution,
  type ContactData, type AttributionData,
} from "@/lib/contact/schema";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { checkRateLimit, isDurable } from "@/lib/contact/rateLimit";
import { buildHtml, buildText } from "@/lib/contact/emailTemplate";

// Envío de mail vía la API REST de Resend — sin SDK, así no sumamos dependencias.
const RESEND_ENDPOINT = "https://api.resend.com/emails";

export const runtime = "nodejs";

function json(status: number, body: Record<string, unknown>) {
  return Response.json(body, { status });
}

/**
 * `request.ip` fue removido en Next 15, así que la IP sale del header.
 * Vercel antepone la IP real del cliente en x-forwarded-for; el resto de la
 * lista son los proxies intermedios, por eso tomamos sólo el primer elemento.
 */
function clientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

export async function POST(req: NextRequest) {
  const to = process.env.CONTACT_TO;
  const from = process.env.CONTACT_FROM;
  const apiKey = process.env.RESEND_API_KEY;

  const puedeMandarMail = Boolean(to && from && apiKey);
  const puedePersistir = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

  // Falla ruidosamente en vez de responder 200: el bug original era justamente
  // simular un envío exitoso. Ahora hay dos destinos, así que sólo se aborta si
  // no hay NINGUNO configurado — con uno solo el lead no se pierde.
  if (!puedeMandarMail && !puedePersistir) {
    console.error(
      "[contact] sin destino configurado: faltan CONTACT_TO/CONTACT_FROM/RESEND_API_KEY y SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY"
    );
    return json(500, { error: "server" });
  }

  // Corte por Content-Length antes de leer el cuerpo.
  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > LIMITS.maxBodyBytes) return json(413, { error: "too_large" });

  const raw = await req.text();
  // Content-Length puede mentir o no venir, así que revalidamos sobre lo leído.
  if (raw.length > LIMITS.maxBodyBytes) return json(413, { error: "too_large" });

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return json(400, { error: "invalid" });
  }

  const body = parsed as Record<string, unknown>;

  // Honeypot: campo oculto por CSS que una persona nunca ve ni completa.
  // Se responde 200 a propósito — que el bot crea que funcionó y no reintente.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    console.warn("[contact] honeypot activado", { ip: clientIp(req) });
    return json(200, { ok: true });
  }

  // Señal débil de automatización: el form completado demasiado rápido.
  const elapsed = Number(body.elapsedMs);
  if (!Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) {
    return json(200, { ok: true });
  }

  const result = validate(parsed);
  if (!result.ok) {
    // El motivo se loguea pero no se devuelve: decirle a un bot qué regla falló
    // es darle el mapa para evadirla.
    console.warn("[contact] validación rechazada:", result.reason);
    return json(400, { error: "invalid" });
  }

  const ip = clientIp(req);
  const verdict = await checkRateLimit(ip);
  if (!verdict.allowed) {
    console.warn(`[contact] rate limit "${verdict.rule}" para ${ip}`);
    return json(429, { error: "rate_limited" });
  }

  if (!isDurable) {
    console.warn("[contact] rate limit en memoria — poco fiable en serverless");
  }

  const meta = { ip, receivedAt: new Date() };
  const attribution = extractAttribution(parsed);

  // Los dos destinos se intentan por separado y ninguno aborta al otro. Antes
  // un fallo de Resend devolvía 502 y el lead se evaporaba; ahora sólo se
  // considera fallido el envío si NO llegó a ningún lado.
  const [persistido, enviado] = await Promise.all([
    guardarLead(result.data, attribution, ip, req.headers.get("user-agent")),
    puedeMandarMail
      ? enviarMail({ to: to!, from: from!, apiKey: apiKey!, data: result.data, meta })
      : Promise.resolve(false),
  ]);

  if (!persistido && !enviado) return json(502, { error: "delivery" });

  // Un destino caído es un incidente operativo, no un error del visitante: el
  // lead está a salvo en el otro lado, así que se responde 200 y queda el log.
  if (!persistido) console.error("[contact] lead enviado por mail pero NO persistido");
  if (!enviado) console.error("[contact] lead persistido pero NO enviado por mail");

  return json(200, { ok: true });
}

/** Persiste el lead con su atribución. Devuelve si pudo guardarlo. */
async function guardarLead(
  data: ContactData,
  attribution: AttributionData,
  ip: string,
  userAgent: string | null
): Promise<boolean> {
  const db = getSupabaseAdmin();
  if (!db) {
    console.warn("[contact] Supabase sin configurar — no se persiste el lead");
    return false;
  }

  // leads.session_id tiene FK a sessions. Si el beacon del pageview no llegó
  // —ad blocker, pestaña cerrada, red caída— la sesión no existe y el insert
  // fallaría por violación de clave foránea, perdiendo el lead entero.
  // Se da de alta primero: si ya estaba, el upsert no la toca.
  if (attribution.session_id) {
    const { error: errSesion } = await db
      .from("sessions")
      .upsert({ id: attribution.session_id }, { onConflict: "id", ignoreDuplicates: true });
    if (errSesion) {
      console.warn("[contact] no se pudo asegurar la sesión:", errSesion.message);
      // Se sigue sin el vínculo antes que arriesgar el lead.
      delete attribution.session_id;
    }
  }

  const { error } = await db.from("leads").insert({
    name: data.name,
    company: data.company,
    email: data.email,
    message: data.message,
    service: data.service || null,
    ...attribution,
    // clientIp() devuelve "unknown" cuando no hay headers de proxy, y esa
    // cadena no es un inet válido: se guarda null en vez de romper el insert.
    ip: ip === "unknown" ? null : ip,
    user_agent: userAgent?.slice(0, 512) ?? null,
  });

  if (error) {
    console.error("[contact] error al persistir en Supabase:", error.message);
    return false;
  }
  return true;
}

/** Envía la notificación por mail. Devuelve si Resend la aceptó. */
async function enviarMail({
  to,
  from,
  apiKey,
  data,
  meta,
}: {
  to: string;
  from: string;
  apiKey: string;
  data: ContactData;
  meta: { ip: string; receivedAt: Date };
}): Promise<boolean> {
  try {
    // Se mandan las dos versiones: la de texto es el fallback para clientes que
    // bloquean HTML y además mejora la reputación anti-spam del envío.
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        // El From queda en tu dominio verificado (si no, DMARC lo rebota);
        // responder desde el mail va al remitente real.
        reply_to: data.email,
        subject: `Consulta web — ${data.name} (${data.company})`,
        text: buildText(data, meta),
        html: buildHtml(data, meta),
      }),
    });

    if (!res.ok) {
      console.error("[contact] Resend respondió", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[contact] fallo al enviar:", err);
    return false;
  }
}
