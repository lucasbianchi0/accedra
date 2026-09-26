/**
 * Las últimas notas del blog, para el panel lateral de la portada.
 *
 * Mismo motivo que /api/eventos: la portada es estática y se sirve desde el
 * CDN. Leer la tabla en el render la volvería dinámica y le costaría TTFB a
 * cada visita para un panel que vive detrás de una pestaña, cerrado, y que la
 * mayoría de los visitantes nunca abre. El navegador lo pide cuando está en
 * reposo.
 *
 * Cinco minutos de caché en el CDN: es el mismo ISR que tiene /blog, así que
 * publicar una nota tarda lo mismo en verse en los dos lados.
 */

import { leerNotasPublicadas } from "@/lib/notas-server";

export const runtime = "nodejs";

const CACHE = "public, max-age=0, s-maxage=300, stale-while-revalidate=1800";

/** Las que entran en el panel sin que haya que scrollear tres pantallas. */
const CUANTAS = 6;

export async function GET() {
  const notas = await leerNotasPublicadas({ limite: CUANTAS });
  return Response.json({ notas }, { headers: { "Cache-Control": CACHE } });
}
