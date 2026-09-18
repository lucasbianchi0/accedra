/**
 * Lecturas de notas contra Supabase. Sólo servidor: usa la service key.
 *
 * Todas filtran por `publicado` Y por fecha: una nota publicada con fecha
 * futura está programada y no existe todavía para el sitio. El filtro va en la
 * consulta y no en el render para que una nota programada no viaje al HTML —
 * lo que llega al navegador se puede leer, aunque no se dibuje.
 */

import { getSupabaseAdmin } from "@/lib/supabase/server";
import {
  BUCKET_NOTAS,
  COLUMNAS_LISTA_SITIO,
  COLUMNAS_NOTA_SITIO,
  aNotaSitio,
  type Categoria,
  type NotaSitio,
} from "@/lib/notas";

type Db = NonNullable<ReturnType<typeof getSupabaseAdmin>>;

function urlPublicaDe(db: Db) {
  return (ruta: string) => db.storage.from(BUCKET_NOTAS).getPublicUrl(ruta).data.publicUrl;
}

/**
 * Las notas publicadas, de la más nueva a la más vieja.
 *
 * `categoria` acota a una solución (es el filtro del hub). `limite` existe
 * porque la misma función alimenta el hub entero y las tres notas relacionadas
 * del pie de una nota.
 */
export async function leerNotasPublicadas(opciones?: {
  categoria?: Categoria;
  limite?: number;
  excepto?: string;
}): Promise<NotaSitio[]> {
  const db = getSupabaseAdmin();
  if (!db) return [];

  let consulta = db
    .from("notas")
    .select(COLUMNAS_LISTA_SITIO)
    .eq("publicado", true)
    .lte("publicado_en", new Date().toISOString())
    .order("publicado_en", { ascending: false });

  if (opciones?.categoria) consulta = consulta.eq("categoria", opciones.categoria);
  if (opciones?.excepto) consulta = consulta.neq("id", opciones.excepto);
  if (opciones?.limite) consulta = consulta.limit(opciones.limite);

  const { data, error } = await consulta;
  if (error) {
    console.error("[notas leer]", error);
    return [];
  }

  const url = urlPublicaDe(db);
  return (data ?? []).map((f) => aNotaSitio(f as Record<string, unknown>, url));
}

export async function leerNotaPorSlug(slug: string): Promise<NotaSitio | null> {
  const db = getSupabaseAdmin();
  if (!db) return null;

  const { data, error } = await db
    .from("notas")
    .select(COLUMNAS_NOTA_SITIO)
    .eq("slug", slug)
    .eq("publicado", true)
    .lte("publicado_en", new Date().toISOString())
    .maybeSingle();

  if (error || !data) return null;
  return aNotaSitio(data as Record<string, unknown>, urlPublicaDe(db));
}

/**
 * Sólo lo que el sitemap y el llms.txt necesitan: la dirección y las dos
 * fechas. Se lee aparte de `leerNotasPublicadas` porque el sitemap se arma en
 * cada revalidación y no tiene por qué traer resúmenes ni portadas.
 */
export async function leerNotasParaIndice(): Promise<
  { slug: string; titulo: string; resumen: string; publicadoEn: string; revisadoEn: string; categoria: Categoria | null }[]
> {
  const db = getSupabaseAdmin();
  if (!db) return [];

  const { data, error } = await db
    .from("notas")
    .select("slug, titulo, resumen, publicado_en, revisado_en, categoria")
    .eq("publicado", true)
    .lte("publicado_en", new Date().toISOString())
    .order("publicado_en", { ascending: false });

  if (error) {
    console.error("[notas indice]", error);
    return [];
  }

  return (data ?? []).map((f) => ({
    slug: String(f.slug),
    titulo: String(f.titulo ?? ""),
    resumen: String(f.resumen ?? ""),
    publicadoEn: String(f.publicado_en ?? ""),
    revisadoEn: String(f.revisado_en ?? ""),
    categoria: (f.categoria as Categoria | null) ?? null,
  }));
}
