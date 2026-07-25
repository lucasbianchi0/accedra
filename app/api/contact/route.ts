import type { NextRequest } from "next/server";
import { LIMITS, MIN_FILL_MS, validate } from "@/lib/contact/schema";
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

  // Sin configuración no se puede entregar el mensaje. Falla ruidosamente en vez
  // de responder 200: el bug original era justamente simular un envío exitoso.
  if (!to || !from || !apiKey) {
    console.error("[contact] faltan CONTACT_TO / CONTACT_FROM / RESEND_API_KEY");
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

  const { name, company, email } = result.data;
  const meta = { ip, receivedAt: new Date() };

  // Se mandan las dos versiones: la de texto es el fallback para clientes que
  // bloquean HTML y además mejora la reputación anti-spam del envío.
  const text = buildText(result.data, meta);
  const html = buildHtml(result.data, meta);

  try {
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
        reply_to: email,
        subject: `Consulta web — ${name} (${company})`,
        text,
        html,
      }),
    });

    if (!res.ok) {
      console.error("[contact] Resend respondió", res.status, await res.text());
      return json(502, { error: "delivery" });
    }
  } catch (err) {
    console.error("[contact] fallo al enviar:", err);
    return json(502, { error: "delivery" });
  }

  return json(200, { ok: true });
}
