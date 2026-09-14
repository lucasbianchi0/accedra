import type { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";

/** Cuerpo máximo. Un evento legítimo pesa unos cientos de bytes. */
const MAX_BODY = 4 * 1024;
/** Tope por campo de texto. */
const MAX_LEN = 512;

const TIPOS = new Set(["pageview", "click", "form", "popup", "salida", "interaccion"]);

/** Tope de permanencia que se acepta en un `salida`: seis horas. */
const MAX_MS = 6 * 60 * 60 * 1000;

/**
 * Detección gruesa de bots por user agent. No pretende ser exhaustiva —
 * eso es imposible — sino filtrar el ruido evidente de crawlers.
 *
 * Los bots se MARCAN, no se rechazan: en campañas de Ads el volumen de tráfico
 * automatizado es la evidencia para reclamar clic fraudulento a Google.
 *
 * Los que se hacen pasar por un Chrome común no caen acá: para esos está
 * `sessions.interactuo` (ver el evento `interaccion` más abajo).
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
 * Normaliza el `metadata` de un `salida`.
 *
 * Se acota acá y no sólo en el navegador porque estos dos números se promedian
 * y se comparan entre páginas: un solo valor absurdo —o negativo, o un string—
 * mueve el promedio de una landing entera. El resto de las familias de evento
 * guardan su metadata tal cual, que para un motivo de cierre o un slug alcanza.
 */
function permanencia(meta: unknown): { ms: number; scroll: number } {
  const m = (meta ?? {}) as Record<string, unknown>;
  const num = (v: unknown, max: number) => {
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n) && n > 0 ? Math.min(Math.round(n), max) : 0;
  };
  return { ms: num(m.ms, MAX_MS), scroll: num(m.scroll, 100) };
}

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

    // Primer gesto humano de la visita. No es un evento de navegación: no se
    // guarda en `events`, sólo marca la sesión.
    //
    // `update` y no `upsert` a propósito: este beacon puede llegar antes que el
    // pageview que abre la sesión, y un upsert crearía la fila sin atribución —
    // después el alta con `ignoreDuplicates` no la completaría nunca. Perder
    // la marca en esa carrera es mucho menos grave que perder el gclid.
    if (type === "interaccion") {
      await db.from("sessions").update({ interactuo: true }).eq("id", sessionId);
      return nada;
    }

    const ua = req.headers.get("user-agent") ?? "";
    const esBot = !ua || BOT_RE.test(ua);

    // Alta de sesión: sólo llega en el primer evento de la visita.
    const s = body.session as Record<string, unknown> | undefined;
    if (s && typeof s === "object") {
      const device = txt(s.device, 16);
      // Mismo trato que el id de sesión: lo genera el cliente, así que sin
      // formato válido no entra. La columna es uuid y un valor arbitrario haría
      // fallar el upsert entero, o sea que se perdería la sesión completa.
      const visitor = txt(s.visitor_id, 36);
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
          visitor_id: visitor && UUID_RE.test(visitor) ? visitor : null,
          // El edge de Vercel resuelve el país sin que tengamos que guardar la IP.
          country: req.headers.get("x-vercel-ip-country"),
          // `navigator.webdriver` es true en Puppeteer, Playwright y Selenium
          // salvo que el bot se tome el trabajo de ocultarlo. Lo declara el
          // cliente, así que sólo sirve para marcar, nunca para desmarcar.
          is_bot: esBot || s.webdriver === true,
          // Hasta que llegue un `interaccion`. Se escribe acá y no como default
          // de la columna: ver la migración 20260913_006.
          interactuo: false,
          // Tráfico del propio equipo. Se marca igual que los bots y por el
          // mismo motivo: descartarlo perdería el dato, y las consultas de
          // analítica ya filtran por el índice de sesiones humanas.
          is_internal: s.interno === true,
          last_seen_at: new Date().toISOString(),
        },
        // Si la sesión ya existe no se pisa su atribución: la del primer evento
        // es la buena. Un reintento no debe reescribir el origen.
        { onConflict: "id", ignoreDuplicates: true }
      );
    } else {
      // Sesión ya abierta: se crea si no existe (por si se perdió el primer
      // evento) y se refresca la última actividad. `is_bot` sólo se escribe
      // cuando es true: mandarlo en false borraría la marca que puso el alta
      // (por webdriver) con el primer evento que no la repite.
      await db
        .from("sessions")
        .upsert(
          { id: sessionId, ...(esBot ? { is_bot: true } : {}), last_seen_at: new Date().toISOString() },
          { onConflict: "id" }
        );
    }

    const meta = body.metadata;
    await db.from("events").insert({
      session_id: sessionId,
      type,
      name: txt(body.name, 64),
      target: txt(body.target, 128),
      path,
      metadata:
        type === "salida"
          ? permanencia(meta)
          : meta && typeof meta === "object"
            ? meta
            : {},
    });
  } catch {
    /* la telemetría nunca puede devolver error al navegador */
  }

  return nada;
}
