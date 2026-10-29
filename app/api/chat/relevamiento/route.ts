import type { NextRequest } from "next/server";

import { verificar } from "@/lib/chat/relevamiento";
import { nombreArchivo, pdfRelevamiento } from "@/lib/chat/pdf-relevamiento";
import { esBot, leerJson, mismoOrigen } from "@/lib/chat/guardia";
import { ipParaLimite } from "@/lib/contact/clientIp";
import { consume } from "@/lib/contact/rateLimit";

/**
 * Descarga del PDF de relevamiento.
 *
 * Recibe los datos del relevamiento tal como los mandó el asistente, con su
 * firma. Sin firma válida no hay PDF: el documento lleva la marca de Accedra y
 * no se puede usar para generar uno con cualquier texto.
 *
 * POST y no GET: los datos no entran cómodos en una URL, y una URL con el
 * caso de una empresa terminaría en el historial y en los logs.
 */

export const runtime = "nodejs";

const LIMITE = [
  { suffix: "burst", limit: 10, windowSec: 10 * 60 },
  { suffix: "day", limit: 40, windowSec: 24 * 60 * 60 },
] as const;
const LIMITE_DOCUMENTO = [{ suffix: "day", limit: 10, windowSec: 24 * 60 * 60 }] as const;
const LIMITE_GLOBAL = [
  { suffix: "minute", limit: 30, windowSec: 60 },
  { suffix: "day", limit: 1000, windowSec: 24 * 60 * 60 },
] as const;

export async function POST(req: NextRequest) {
  if (!mismoOrigen(req)) return Response.json({ error: "Pedido inválido" }, { status: 403 });
  if (await esBot()) return Response.json({ error: "No pudimos verificar el navegador." }, { status: 403 });

  const body = await leerJson(req, 32 * 1024);
  if (body === "grande") return Response.json({ error: "Pedido demasiado grande" }, { status: 413 });
  if (!body || !verificar(body.datos, body.firma)) {
    return Response.json({ error: "El relevamiento venció. Pedile al asistente que lo arme de nuevo." }, { status: 400 });
  }

  // Por IP, por documento y en total: armar un PDF cuesta CPU, y un mismo
  // relevamiento firmado no puede servir para pedir miles desde muchas IPs.
  const [porIp, porDocumento] = await Promise.all([
    consume("relevamiento", ipParaLimite(req), LIMITE),
    consume("relevamiento-doc", String(body.firma).slice(0, 64), LIMITE_DOCUMENTO),
  ]);
  const permitido = porIp.allowed && porDocumento.allowed ? await consume("relevamiento-global", "todos", LIMITE_GLOBAL) : porIp;
  if (!porIp.allowed || !porDocumento.allowed || !permitido.allowed) {
    return Response.json({ error: "Probá de nuevo en un rato." }, { status: 429 });
  }

  try {
    const pdf = await pdfRelevamiento(body.datos, new URL(req.url).origin);
    return new Response(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${nombreArchivo(body.datos)}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    console.error("[relevamiento] no se pudo generar el PDF:", (e as Error).message);
    return Response.json({ error: "No se pudo generar el PDF." }, { status: 500 });
  }
}
