/**
 * Los eventos publicados: próximos y últimos realizados.
 *
 * Por qué un endpoint y no leerlo en la portada: mismo motivo que /api/popup.
 * La home es estática y se sirve desde el CDN; leer la tabla en el render la
 * volvería dinámica y le costaría LCP a cada visita. La sección de eventos está
 * abajo de todo, así que el navegador la pide cuando se acerca a ella.
 *
 * Un minuto de caché en el CDN: publicar un evento tarda como mucho eso en verse.
 *
 * `?muestra=1` devuelve eventos de ejemplo, sólo en desarrollo: ver
 * lib/eventos-muestra.ts.
 */

import { leerEventosPublicados } from "@/lib/eventos-server";
import { eventosMuestra } from "@/lib/eventos-muestra";

export const runtime = "nodejs";

const CACHE = "public, max-age=0, s-maxage=60, stale-while-revalidate=600";

export async function GET(req: Request) {
  if (new URL(req.url).searchParams.has("muestra") && process.env.NODE_ENV !== "production") {
    return Response.json(eventosMuestra(), { headers: { "Cache-Control": "no-store" } });
  }
  const eventos = await leerEventosPublicados();
  return Response.json(eventos, { headers: { "Cache-Control": CACHE } });
}
