import type { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";

/** Cuerpo máximo. Un evento legítimo pesa unos cientos de bytes. */
const MAX_BODY = 4 * 1024;
/** Tope por campo de texto. */
const MAX_LEN = 512;

const TIPOS = new Set(["pageview", "click", "form"]);

/**
 * Detección gruesa de bots por user agent. No pretende ser exhaustiva —
 * eso es imposible — sino filtrar el ruido evidente de crawlers.
 *
 * Los bots se MARCAN, no se rechazan: en campañas de Ads el volumen de tráfico
 * automatizado es la evidencia para reclamar clic fraudulento a Google.
 */
const BOT_RE =
  /bot|crawler|spider|crawling|slurp|bingpreview|headless|lighthouse|pagespeed|gtmetrix|pingdom|curl|wget|python-requests|axios|node-fetch|monitor|preview|facebookexternalhit|whatsapp|telegram/i;

/** Recorta y limpia un texto que viene del cliente. */
function txt(v: unknown, max = MAX_LEN): string | null {
  if (typeof v !== "string") return null;
  const t = v.replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, max);
  return t || null;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Recibe eventos de navegación del sitio.
 *
 * Responde 204 SIEMPRE, incluso ante entrada inválida. Es un endpoint de
 * telemetría al que se le pega con sendBeacon: el navegador ignora la
 * respuesta, y devolver detalle de errores sólo le daría información a quien
 * quiera sondearlo.
 */
export async function POST(req: NextRequest) {
  const nada = new Response(null, { status: 204 });

  try {
    const declared = Number(req.headers.get("content-length") ?? 0);
    if (declared > MAX_BODY) return nada;

    const raw = await req.text();
    if (raw.length > MAX_BODY) return nada;

    const body = JSON.parse(raw) as Record<string, unknown>;

    const sessionId = txt(body.session_id, 36);
    const type = txt(body.type, 32);
    const path = txt(body.path, 255);

    // El id lo genera el cliente, así que se valida el formato: sin esto
    // cualquiera podría ensuciar la tabla con claves arbitrarias.
    if (!sessionId || !UUID_RE.test(sessionId)) return nada;
    if (!type || !TIPOS.has(type)) return nada;
    if (!path) return nada;

    const db = getSupabaseAdmin();
    if (!db) return nada;

    const ua = req.headers.get("user-agent") ?? "";
    const esBot = !ua || BOT_RE.test(ua);

    // Alta de sesión: sólo llega en el primer evento de la visita.
    const s = body.session as Record<string, unknown> | undefined;
    if (s && typeof s === "object") {
      const device = txt(s.device, 16);
      await db.from("sessions").upsert(
        {
          id: sessionId,
          gclid: txt(s.gclid),
          gbraid: txt(s.gbraid),
          wbraid: txt(s.wbraid),
          utm_source: txt(s.utm_source),
          utm_medium: txt(s.utm_medium),
          utm_campaign: txt(s.utm_campaign),
          utm_term: txt(s.utm_term),
          utm_content: txt(s.utm_content),
          referrer: txt(s.referrer),
          landing_page: txt(s.landing_page, 255),
          device: device && ["mobile", "tablet", "desktop"].includes(device) ? device : null,
          // El edge de Vercel resuelve el país sin que tengamos que guardar la IP.
          country: req.headers.get("x-vercel-ip-country"),
          is_bot: esBot,
          last_seen_at: new Date().toISOString(),
        },
        // Si la sesión ya existe no se pisa su atribución: la del primer evento
        // es la buena. Un reintento no debe reescribir el origen.
        { onConflict: "id", ignoreDuplicates: true }
      );
    } else {
      // Sesión ya abierta: se crea si no existe (por si se perdió el primer
      // evento) y se refresca la última actividad.
      await db
        .from("sessions")
        .upsert({ id: sessionId, is_bot: esBot, last_seen_at: new Date().toISOString() }, { onConflict: "id" });
    }

    const meta = body.metadata;
    await db.from("events").insert({
      session_id: sessionId,
      type,
      name: txt(body.name, 64),
      target: txt(body.target, 128),
      path,
      metadata: meta && typeof meta === "object" ? meta : {},
    });
  } catch {
    /* la telemetría nunca puede devolver error al navegador */
  }

  return nada;
}
