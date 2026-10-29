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
 *
 * SÓLO CON UNA TARJETA DEL ASISTENTE
 *
 * El formulario trae la firma de la tarjeta `pedir_contacto` que emitió el
 * chat. Sin ella no entra: para cargar un lead hay que haber pasado por el
 * asistente (con sus cupos y su BotID), así que no se puede llenar `leads`
 * pegándole directo a este endpoint. Y el resumen del caso que recibe el equipo
 * es el firmado, no uno que alguien escribió a mano.
 */

import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";

import { EMAIL_RE, extractAttribution, type ContactData, type Service } from "@/lib/contact/schema";
import { clientIp, ipParaLimite } from "@/lib/contact/clientIp";
import { consume } from "@/lib/contact/rateLimit";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { SOLUTIONS } from "@/components/solutions/solutionsData";
import { verificar } from "@/lib/chat/relevamiento";
import { esBot, firmaValida, leerJson, limpiarInvisibles, mismoOrigen, unaLinea } from "@/lib/chat/guardia";
import { nombreArchivo, pdfRelevamiento } from "@/lib/chat/pdf-relevamiento";
import type { Relevamiento } from "@/lib/chat/tipos";
import { asuntoEquipo, htmlEquipo, textoEquipo, type LeadAsistente } from "@/lib/chat/emailEquipo";

export const runtime = "nodejs";

const LIMITE_IP = [
  { suffix: "burst", limit: 4, windowSec: 10 * 60 },
  { suffix: "day", limit: 10, windowSec: 24 * 60 * 60 },
] as const;
/**
 * Muy por encima de lo real (hoy son unos pocos leads por semana): sólo corta
 * cuando algo está claramente mal, y protege la base, la cuota de Resend y la
 * reputación del dominio.
 */
const LIMITE_GLOBAL = [
  { suffix: "minute", limit: 10, windowSec: 60 },
  { suffix: "day", limit: 150, windowSec: 24 * 60 * 60 },
] as const;
/** Por tarjeta firmada: corregir un dato y reenviar es normal; diez veces, no. */
const LIMITE_TARJETA = [{ suffix: "day", limit: 3, windowSec: 24 * 60 * 60 }] as const;
/** La tarjeta vale lo que dura una visita larga. */
const VIGENCIA_TARJETA_MS = 24 * 60 * 60 * 1000;

/** La solución del sitio → el `service` que usa el formulario de contacto. */
const SERVICIO: Record<string, Service> = {
  networking: "networking",
  seguridad: "seguridad",
  "firma-biometrica": "biometrica",
  consultoria: "consultoria",
  "software-ai": "otro",
};

// Con el relevamiento firmado adentro el cuerpo crece: hasta 48 KB.
const MAX_BODY = 48 * 1024;
const MAX_CONVERSACION = 6000;

function limpio(v: unknown, max: number): string {
  return typeof v === "string" ? limpiarInvisibles(v).replace(/\t/g, " ").trim().slice(0, max) : "";
}

/** La tarjeta de contacto la emitió el asistente y no venció. */
function tarjetaValida(resumen: unknown, solucion: unknown, emitido: unknown, firma: unknown): boolean {
  if (typeof resumen !== "string" || (solucion !== null && typeof solucion !== "string") || typeof emitido !== "number") {
    return false;
  }
  const edad = Date.now() - emitido;
  if (!(edad >= -60_000 && edad < VIGENCIA_TARJETA_MS)) return false;
  return firmaValida("contacto", JSON.stringify([resumen, solucion, emitido]), firma);
}

function error(mensaje: string, status: number) {
  return Response.json({ error: mensaje }, { status });
}

export async function POST(req: NextRequest) {
  if (!mismoOrigen(req)) return error("Pedido inválido", 403);
  if (await esBot()) return error("No pudimos verificar el navegador. Escribinos por WhatsApp.", 403);

  const body = await leerJson(req, MAX_BODY);
  if (body === "grande") return error("Pedido demasiado grande", 413);
  if (!body) return error("Pedido inválido", 400);

  // Honeypot, como en el formulario de contacto: se finge éxito.
  if (typeof body.website === "string" && body.website.trim() !== "") return Response.json({ ok: true });

  if (!tarjetaValida(body.resumen, body.solucion ?? null, body.emitido, body.firma)) {
    return error("No pudimos validar el formulario. Reiniciá la conversación o escribinos por WhatsApp.", 400);
  }

  const nombre = unaLinea(typeof body.nombre === "string" ? body.nombre : "", 80);
  const empresa = unaLinea(typeof body.empresa === "string" ? body.empresa : "", 80);
  const telefono = limpio(body.telefono, 30).replace(/[^\d +()-]/g, "");
  const email = limpio(body.email, 254);
  const resumen = limpio(body.resumen, 800);
  const conversacion = limpio(body.conversacion, MAX_CONVERSACION);
  const solucion = limpio(body.solucion, 40);

  if (nombre.length < 2) return error("Contanos tu nombre.", 400);
  const digitos = telefono.replace(/\D/g, "");
  if (digitos.length < 8 || digitos.length > 15) return error("Revisá el teléfono: parece que falta algo.", 400);
  if (email && !EMAIL_RE.test(email)) return error("Revisá el email: parece que falta algo.", 400);

  const ip = clientIp(req);
  // La IP y la tarjeta antes que el global: si no, alguien bloqueado igual
  // sumaría al techo global hasta cerrarle el formulario a los clientes reales.
  const porIp = await consume("chat-lead", ipParaLimite(req), LIMITE_IP);
  if (!porIp.allowed) return error("Ya recibimos tus datos. ¡Gracias!", 429);
  // Por tarjeta y por teléfono: ni la misma tarjeta ni el mismo número sirven
  // para cargar leads repetidos desde muchas IPs.
  const [porTarjeta, porTelefono] = await Promise.all([
    consume("chat-lead-tarjeta", String(body.firma).slice(0, 64), LIMITE_TARJETA),
    consume("chat-lead-tel", createHash("sha256").update(digitos).digest("hex").slice(0, 32), LIMITE_TARJETA),
  ]);
  if (!porTarjeta.allowed || !porTelefono.allowed) return error("Ya recibimos tus datos. ¡Gracias!", 429);
  const global = await consume("chat-lead-global", "todos", LIMITE_GLOBAL);
  if (!global.allowed) {
    console.error("[chat lead] techo global alcanzado");
    return error("No pudimos guardar tus datos ahora. Escribinos por WhatsApp, así no se pierde nada.", 429);
  }

  const servicio = SOLUTIONS[solucion] ? SERVICIO[solucion] ?? "otro" : "";
  const mensaje = [
    `Llegó por el asistente del sitio.`,
    `Teléfono / WhatsApp: ${telefono}`,
    resumen ? `\nResumen del caso:\n${resumen}` : "",
    // La transcripción la manda el navegador: puede estar editada. Lo firmado es el resumen.
    conversacion ? `\n— Conversación (enviada por el navegador, sin verificar) —\n${conversacion}` : "",
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

  // El relevamiento sólo se acepta firmado por el asistente: va adjunto al
  // mail del equipo con la marca de Accedra.
  const rel = body.relevamiento as { datos?: unknown; firma?: unknown } | null | undefined;
  const relevamiento = rel && verificar(rel.datos, rel.firma) ? rel.datos : null;

  const [persistido, enviado] = await Promise.all([
    guardar(
      datos,
      { telefono, solucion: SOLUTIONS[solucion] ? solucion : null, sinEmail: !email, relevamiento: Boolean(relevamiento) },
      attribution,
      ip,
      req.headers.get("user-agent"),
    ),
    avisar(
      {
        nombre,
        empresa,
        telefono,
        email,
        resumen,
        solucion: SOLUTIONS[solucion] ? solucion : null,
        conversacion,
        relevamiento,
        origen:
          [attribution.utm_source, attribution.utm_campaign].filter(Boolean).join(" / ") ||
          attribution.referrer ||
          attribution.submitted_from ||
          "directo",
      },
      ip,
      new URL(req.url).origin,
    ),
  ]);

  if (!persistido && !enviado) return error("No se pudo guardar. Probá de nuevo o escribinos por WhatsApp.", 502);
  if (!persistido) console.error("[chat lead] enviado por mail pero NO persistido");
  return Response.json({ ok: true });
}

async function guardar(
  datos: ContactData,
  extra: { telefono: string; solucion: string | null; sinEmail: boolean; relevamiento: boolean },
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
    metadata: {
      tipo: "chatbot",
      telefono: extra.telefono,
      solucion: extra.solucion,
      sin_email: extra.sinEmail,
      relevamiento: extra.relevamiento,
    },
  });
  if (error) {
    console.error("[chat lead] no se pudo persistir:", error.message);
    return false;
  }
  return true;
}

/** El PDF en base64 para Resend. Si falla, el mail sale igual: el lead importa más que el adjunto. */
async function pdfAdjunto(relevamiento: Relevamiento | null, origen: string) {
  if (!relevamiento) return [];
  try {
    const pdf = await pdfRelevamiento(relevamiento, origen);
    return [{ filename: nombreArchivo(relevamiento), content: pdf.toString("base64") }];
  } catch (e) {
    console.error("[chat lead] no se pudo generar el PDF:", (e as Error).message);
    return [];
  }
}

/**
 * Avisa al equipo comercial y, si la persona dejó su email y hay relevamiento,
 * le manda su PDF.
 *
 * El mail a la persona sólo sale con un relevamiento firmado (el texto es
 * nuestro, no lo que alguien escribió en el formulario) y con un tope por
 * dirección: este endpoint no puede servir para mandarle correo a terceros.
 */
async function avisar(lead: LeadAsistente, ip: string, origen: string): Promise<boolean> {
  const to = process.env.CONTACT_TO;
  const from = process.env.CONTACT_FROM;
  const apiKey = process.env.RESEND_API_KEY;
  if (!to || !from || !apiKey) return false;

  const { email, nombre, relevamiento } = lead;
  const adjunto = await pdfAdjunto(relevamiento, origen);
  const resend = (cuerpo: Record<string, unknown>) =>
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, ...cuerpo, ...(adjunto.length ? { attachments: adjunto } : {}) }),
    });

  if (email && relevamiento && adjunto.length) {
    const hash = createHash("sha256").update(email.toLowerCase()).digest("hex").slice(0, 32);
    const permitido = await consume("chat-lead-email", hash, [{ suffix: "day", limit: 1, windowSec: 24 * 60 * 60 }]);
    if (permitido.allowed) {
      await resend({
        to: [email],
        reply_to: to,
        subject: `Tu relevamiento — ${relevamiento.empresa}`,
        text: textoAlCliente(nombre, relevamiento),
        html: htmlAlCliente(nombre, relevamiento),
      }).catch((e) => console.error("[chat lead] no salió el mail a la persona:", (e as Error).message));
    }
  }

  // Al equipo: su propio formato (contacto arriba, el caso, lo identificado y
  // la conversación) con el mismo PDF adjunto.
  try {
    const res = await resend({
      to: [to],
      ...(email ? { reply_to: email } : {}),
      subject: asuntoEquipo(lead),
      text: textoEquipo(lead),
      html: htmlEquipo(lead),
    });
    if (!res.ok) {
      console.error("[chat lead] Resend respondió", res.status, "ip", ip);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[chat lead] fallo al enviar:", err);
    return false;
  }
}

const escapar = (t: string) =>
  t.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function textoAlCliente(nombre: string, r: Relevamiento): string {
  return [
    `Hola ${nombre},`,
    "",
    `Te dejamos adjunto el relevamiento preliminar para ${r.empresa} (${r.referencia}), con lo que identificamos en la conversación y dónde te podemos ayudar.`,
    "",
    "Un especialista de Accedra lo revisa y te contacta para coordinar el relevamiento técnico en sitio, sin costo. Si querés adelantarlo, respondé este correo o escribinos por WhatsApp al +54 11 3300-1233.",
    "",
    "Equipo Accedra",
    "accedra.com.ar",
  ].join("\n");
}

/** Sobrio a propósito: el contenido está en el PDF; el mail sólo lo entrega. */
function htmlAlCliente(nombre: string, r: Relevamiento): string {
  const p = "margin:0 0 16px;font-size:15px;line-height:1.6;color:#26354a";
  return `<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:32px 16px;background:#f5f7fa;font-family:Helvetica,Arial,sans-serif">
<div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e3e8ef;border-radius:10px;padding:36px 36px 28px">
<p style="margin:0 0 28px;font-size:13px;letter-spacing:4px;color:#0b1626">ACCEDRA</p>
<p style="${p}">Hola ${escapar(nombre)},</p>
<p style="${p}">Te dejamos adjunto el <strong>relevamiento preliminar para ${escapar(r.empresa)}</strong>, con lo que identificamos en la conversación y dónde te podemos ayudar.</p>
<p style="${p}">Un especialista de Accedra lo revisa y te contacta para coordinar el <strong>relevamiento técnico en sitio, sin costo</strong>. Si querés adelantarlo, respondé este correo o escribinos por WhatsApp al <a href="https://wa.me/541133001233" style="color:#2b6fd4">+54 11 3300-1233</a>.</p>
<p style="margin:28px 0 0;font-size:13px;color:#6b7a90">Equipo Accedra · <a href="https://accedra.com.ar" style="color:#6b7a90">accedra.com.ar</a><br>Referencia ${escapar(r.referencia)}</p>
</div></body></html>`;
}
