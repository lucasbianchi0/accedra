/**
 * El popup vigente, o nada.
 *
 * POR QUE UN ENDPOINT Y NO LEERLO EN EL LAYOUT
 *
 * Leer la tabla desde el layout haría dinámica TODA la página: la portada y las
 * 43 landings dejarían de servirse estáticas desde el CDN para consultar
 * Supabase en cada visita, y eso se paga en el LCP de cada una. Un aviso no
 * puede costar eso.
 *
 * Así, las páginas siguen siendo estáticas y el popup es un JSON de menos de un
 * kilobyte que el navegador pide cuando está ocioso, después de que la página ya
 * pintó. Si el pedido falla o tarda, no se ve ningún popup y no pasa nada más.
 *
 * La respuesta se cachea un minuto en el CDN: prender o apagar tarda como mucho
 * eso en verse. Sin caché, cada visitante del sitio sería una consulta a la base
 * para preguntar por algo que el 95% del tiempo es `null`.
 */

import { getSupabaseAdmin } from "@/lib/supabase/server";
import { COLUMNAS_SITIO, aPopupSitio } from "@/lib/popup";

export const runtime = "nodejs";

/**
 * Un minuto fresco en el CDN, diez más sirviendo lo viejo mientras revalida.
 *
 * `max-age=0` es para el NAVEGADOR y no sobra: sin él, ante una respuesta
 * `public` sin vencimiento explícito Chrome aplica su caché heurística y se
 * queda con la copia vieja. Pasó probando esto —se cambió el formato en la
 * base, el endpoint ya devolvía lo nuevo y la página seguía dibujando lo
 * anterior—. El que tiene que cachear es el CDN, que es uno; el navegador de
 * cada visitante, no.
 */
const CACHE = "public, max-age=0, s-maxage=60, stale-while-revalidate=600";

/** Nombre del bucket público donde el backoffice deja las imágenes. */
const BUCKET = "popup";

function json(cuerpo: unknown) {
  return Response.json(cuerpo, { headers: { "Cache-Control": CACHE } });
}

export async function GET() {
  const db = getSupabaseAdmin();
  // Sin Supabase configurado el sitio funciona igual, sólo que sin popups. Es
  // el mismo criterio que el formulario de contacto: perder el aviso es malo,
  // romper la página es peor.
  if (!db) return json({ popup: null });

  const ahora = new Date().toISOString();

  // Los dos `.or()` se combinan con AND: activo Y (ya empezó) Y (no terminó).
  // Las fechas se resuelven acá y no en Postgres para que la condición sea la
  // misma que muestra el backoffice, que también compara contra el reloj.
  const { data, error } = await db
    .from("popups")
    .select(COLUMNAS_SITIO)
    .eq("activo", true)
    .or(`desde.is.null,desde.lte.${ahora}`)
    .or(`hasta.is.null,hasta.gt.${ahora}`)
    // El último que se tocó gana. Se muestra UNO: dos popups a la vez es un
    // sitio roto, y esta regla hace que prender el nuevo alcance para
    // reemplazar al anterior sin tener que acordarse de apagarlo.
    .order("updated_at", { ascending: false })
    .limit(1);

  if (error) {
    console.error("[popup GET]", error);
    return json({ popup: null });
  }

  const fila = data?.[0];
  if (!fila) return json({ popup: null });

  const popup = aPopupSitio(
    fila as Record<string, unknown>,
    (ruta) => db.storage.from(BUCKET).getPublicUrl(ruta).data.publicUrl
  );

  return json({ popup });
}
