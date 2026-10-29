import type { NextRequest } from "next/server";

import { verificar } from "@/lib/chat/relevamiento";
import { nombreArchivo, pdfRelevamiento } from "@/lib/chat/pdf-relevamiento";
import { clientIp } from "@/lib/contact/clientIp";
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

export async function POST(req: NextRequest) {
  const raw = await req.text();
  if (raw.length > 32 * 1024) return Response.json({ error: "Pedido demasiado grande" }, { status: 413 });
  let body: { datos?: unknown; firma?: unknown };
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json({ error: "Pedido inválido" }, { status: 400 });
  }
  if (!verificar(body.datos, body.firma)) return Response.json({ error: "Pedido inválido" }, { status: 400 });

  const permitido = await consume("relevamiento", clientIp(req), LIMITE);
  if (!permitido.allowed) return Response.json({ error: "Probá de nuevo en un rato." }, { status: 429 });

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
