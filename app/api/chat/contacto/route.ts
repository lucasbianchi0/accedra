/**
 * Los datos que alguien deja desde el asistente.
 *
 * Entran en la MISMA tabla `leads` que el formulario de contacto, con la
 * atribución de campaña y `metadata.tipo = "chatbot"`, así el backoffice los ve
 * en la misma bandeja y se pueden cruzar con lo que se gastó en traerlos. Lo
 * que el especialista necesita para retomar sin volver a preguntar —el resumen
 * del caso que armó el asistente y la conversación— va en `message`.
 *
 * EL TELÉFONO ES LO OBLIGATORIO, NO EL MAIL
 *
 * Al que conversa con un chat le resulta natural dejar un WhatsApp; pedirle
 * también el mail es un campo más que hace abandonar. Pero `leads.email` es
 * NOT NULL con un check de no vacío, y cambiar la tabla toca también al
 * backoffice. Mientras tanto, sin mail se guarda el teléfono en esa columna
 * —es el dato de contacto real de ese lead, y es lo que el comercial va a usar—
 * y `metadata.sin_email` lo marca para que nadie le mande un correo.
 */

import type { NextRequest } from "next/server";

import { EMAIL_RE, extractAttribution, type ContactData, type Service } from "@/lib/contact/schema";
import { clientIp } from "@/lib/contact/clientIp";
import { consume } from "@/lib/contact/rateLimit";
import { buildHtml, buildText } from "@/lib/contact/emailTemplate";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { SOLUTIONS } from "@/components/solutions/solutionsData";

export const runtime = "nodejs";

const LIMITE_IP = [
  { suffix: "burst", limit: 4, windowSec: 10 * 60 },
  { suffix: "day", limit: 10, windowSec: 24 * 60 * 60 },
] as const;
const LIMITE_GLOBAL = [
  { suffix: "minute", limit: 20, windowSec: 60 },
  { suffix: "day", limit: 400, windowSec: 24 * 60 * 60 },
] as const;

/** La solución del sitio → el `service` que usa el formulario de contacto. */
const SERVICIO: Record<string, Service> = {
  networking: "networking",
  seguridad: "seguridad",
  "firma-biometrica": "biometrica",
  consultoria: "consultoria",
  "software-ai": "otro",
};

const MAX_BODY = 24 * 1024;
const MAX_CONVERSACION = 6000;

function limpio(v: unknown, max: number): string {
  return typeof v === "string" ? v.replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, "").trim().slice(0, max) : "";
}

function error(mensaje: string, status: number) {
  return Response.json({ error: mensaje }, { status });
}

export async function POST(req: NextRequest) {
  const raw = await req.text();
  if (raw.length > MAX_BODY) return error("Pedido demasiado grande", 413);
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return error("Pedido inválido", 400);
  }

  // Honeypot, como en el formulario de contacto: se finge éxito.
  if (typeof body.website === "string" && body.website.trim() !== "") return Response.json({ ok: true });

  const nombre = limpio(body.nombre, 80);
  const empresa = limpio(body.empresa, 80);
  const telefono = limpio(body.telefono, 30);
  const email = limpio(body.email, 254);
  const resumen = limpio(body.resumen, 800);
  const conversacion = limpio(body.conversacion, MAX_CONVERSACION);
  const solucion = limpio(body.solucion, 40);

  if (nombre.length < 2) return error("Contanos tu nombre.", 400);
  const digitos = telefono.replace(/\D/g, "");
  if (digitos.length < 8 || digitos.length > 15) return error("Revisá el teléfono: parece que falta algo.", 400);
  if (email && !EMAIL_RE.test(email)) return error("Revisá el email: parece que falta algo.", 400);

  const ip = clientIp(req);
  const porIp = await consume("chat-lead", ip, LIMITE_IP);
  const global = await consume("chat-lead-global", "todos", LIMITE_GLOBAL);
  if (!porIp.allowed || !global.allowed) return error("Ya recibimos tus datos. ¡Gracias!", 429);

  const servicio = SOLUTIONS[solucion] ? SERVICIO[solucion] ?? "otro" : "";
  const mensaje = [
    `Llegó por el asistente del sitio.`,
    `Teléfono / WhatsApp: ${telefono}`,
    resumen ? `\nResumen del caso:\n${resumen}` : "",
    conversacion ? `\n— Conversación —\n${conversacion}` : "",
  ]
    .filter(Boolean)
    .join("\n")
    .slice(0, 8000);

  const datos: ContactData = {
    name: nombre,
    company: empresa,
    email: email || telefono,
    message: mensaje,
    service: servicio,
  };
  const attribution = extractAttribution(body);

  const [persistido, enviado] = await Promise.all([
    guardar(datos, { telefono, solucion: SOLUTIONS[solucion] ? solucion : null, sinEmail: !email }, attribution, ip, req.headers.get("user-agent")),
    avisar(datos, email, ip),
  ]);

  if (!persistido && !enviado) return error("No se pudo guardar. Probá de nuevo o escribinos por WhatsApp.", 502);
  if (!persistido) console.error("[chat lead] enviado por mail pero NO persistido");
  return Response.json({ ok: true });
}

async function guardar(
  datos: ContactData,
  extra: { telefono: string; solucion: string | null; sinEmail: boolean },
  attribution: ReturnType<typeof extractAttribution>,
  ip: string,
  userAgent: string | null,
): Promise<boolean> {
  const db = getSupabaseAdmin();
  if (!db) return false;

  // `leads.session_id` tiene FK a `sessions`: si el beacon del pageview no
  // llegó, el insert fallaría y se perdería el lead.
  if (attribution.session_id) {
    const { error: errSesion } = await db
      .from("sessions")
      .upsert({ id: attribution.session_id }, { onConflict: "id", ignoreDuplicates: true });
    if (errSesion) delete attribution.session_id;
  }

  const { error } = await db.from("leads").insert({
    name: datos.name,
    company: datos.company,
    email: datos.email,
    message: datos.message,
    service: datos.service || null,
    ...attribution,
    ip: ip === "unknown" ? null : ip,
    user_agent: userAgent?.slice(0, 512) ?? null,
    metadata: { tipo: "chatbot", telefono: extra.telefono, solucion: extra.solucion, sin_email: extra.sinEmail },
  });
  if (error) {
    console.error("[chat lead] no se pudo persistir:", error.message);
    return false;
  }
  return true;
}

async function avisar(datos: ContactData, email: string, ip: string): Promise<boolean> {
  const to = process.env.CONTACT_TO;
  const from = process.env.CONTACT_FROM;
  const apiKey = process.env.RESEND_API_KEY;
  if (!to || !from || !apiKey) return false;

  const meta = { ip, receivedAt: new Date() };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        ...(email ? { reply_to: email } : {}),
        subject: `Asistente web — ${datos.name}${datos.company ? ` (${datos.company})` : ""}`,
        text: buildText(datos, meta),
        html: buildHtml(datos, meta),
      }),
    });
    if (!res.ok) {
      console.error("[chat lead] Resend respondió", res.status);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[chat lead] fallo al enviar:", err);
    return false;
  }
}
