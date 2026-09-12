/**
 * El mail que alguien deja en el popup.
 *
 * Un solo campo. Entra en la MISMA tabla `leads` que el formulario de contacto y
 * que la descarga del brochure, con la atribución de campaña pegada: sin eso,
 * los mails del popup serían una lista suelta imposible de cruzar con lo que se
 * gastó en traer a esa persona, que es justamente la pregunta que la tabla
 * existe para contestar.
 *
 * NO MANDA NINGUN MAIL
 *
 * A diferencia de /api/brochure, acá no sale correo automático: lo que se
 * prometió en el popup lo escribió alguien de marketing y lo cumple alguien de
 * marketing. Que este endpoint no toque Resend también significa que no se lo
 * puede usar de relay para mandarle correo a terceros, así que alcanza con un
 * límite por IP y el techo global.
 *
 * EL TEXTO DEL LEAD SALE DE LA BASE, NO DEL NAVEGADOR
 *
 * El título del popup se lee de `popups` con el id que mandó el cliente. Si se
 * copiara lo que manda el navegador, cualquiera podría escribir el texto que
 * quiera dentro de la bandeja comercial del equipo.
 */

import type { NextRequest } from "next/server";

import { EMAIL_RE, LIMITS, extractAttribution, type AttributionData } from "@/lib/contact/schema";
import { clientIp } from "@/lib/contact/clientIp";
import { consume } from "@/lib/contact/rateLimit";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * Por IP. Más holgado que el del formulario de contacto —dejar el mail es un
 * gesto barato y alguien puede equivocarse de dirección y reintentar— pero con
 * un techo diario bajo: una persona deja el mail una vez.
 */
const POPUP_IP = [
  { suffix: "burst", limit: 5, windowSec: 10 * 60 },
  { suffix: "day", limit: 15, windowSec: 24 * 60 * 60 },
] as const;

/** Techo del endpoint entero. Muy por encima del tráfico real: sólo corta
 *  cuando algo está claramente mal. */
const POPUP_GLOBAL = [
  { suffix: "minute", limit: 30, windowSec: 60 },
  { suffix: "day", limit: 600, windowSec: 24 * 60 * 60 },
] as const;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function error(mensaje: string, status: number) {
  return Response.json({ error: mensaje }, { status });
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    const raw = await req.text();
    if (raw.length > LIMITS.maxBodyBytes) return error("Pedido demasiado grande", 413);
    body = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return error("Pedido inválido", 400);
  }

  const email = typeof body.email === "string" ? body.email.trim().slice(0, LIMITS.email) : "";
  if (!EMAIL_RE.test(email)) {
    return error("Revisá la dirección: parece que falta algo.", 400);
  }

  const popupId = typeof body.popup_id === "string" && UUID_RE.test(body.popup_id) ? body.popup_id : null;
  if (!popupId) return error("Pedido inválido", 400);

  const ip = clientIp(req);

  const porIp = await consume("popup", ip, POPUP_IP);
  const global = await consume("popup-global", "todos", POPUP_GLOBAL);
  if (!porIp.allowed || !global.allowed) {
    // El mensaje es amable a propósito: el caso frecuente no es un ataque, es
    // alguien que tocó dos veces o que comparte la IP de su oficina.
    return error("Ya recibimos tu dirección. ¡Gracias!", 429);
  }

  const db = getSupabaseAdmin();
  // Sin base configurada se pierde el lead. Se devuelve error y no un "listo"
  // falso: prometerle a alguien que le vamos a escribir sin haber guardado su
  // dirección es peor que pedirle que reintente.
  if (!db) return error("No se pudo guardar. Probá de nuevo en un momento.", 503);

  const { data: popup } = await db
    .from("popups")
    .select("titulo, nombre")
    .eq("id", popupId)
    .maybeSingle();

  if (!popup) return error("Pedido inválido", 400);

  const attribution: AttributionData = extractAttribution(body);

  // Mismo cuidado que en /api/contact: `leads.session_id` tiene FK a `sessions`
  // y si el beacon del pageview no llegó, el insert fallaría y se perdería el
  // lead por no poder anotar de dónde vino.
  if (attribution.session_id) {
    const { error: errSesion } = await db
      .from("sessions")
      .upsert({ id: attribution.session_id }, { onConflict: "id", ignoreDuplicates: true });
    if (errSesion) {
      console.warn("[popup lead] no se pudo asegurar la sesión:", errSesion.message);
      delete attribution.session_id;
    }
  }

  const { error: errInsert } = await db.from("leads").insert({
    // Vacíos y no inventados: el popup pide una sola cosa, y rellenar con
    // "—" ensucia las columnas reales de la bandeja comercial.
    name: "",
    company: "",
    email,
    message: `Dejó el mail en el popup “${popup.titulo}”.`,
    service: null,
    ...attribution,
    ip: ip === "unknown" ? null : ip,
    user_agent: req.headers.get("user-agent")?.slice(0, 512) ?? null,
    metadata: { tipo: "popup", popup_id: popupId, popup: popup.nombre },
  });

  if (errInsert) {
    console.error("[popup lead] no se pudo persistir:", errInsert.message);
    return error("No se pudo guardar. Probá de nuevo en un momento.", 500);
  }

  return Response.json({ ok: true });
}
