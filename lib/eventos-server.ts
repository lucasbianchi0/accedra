/**
 * Lecturas de eventos contra Supabase. Sólo servidor: usa la service key.
 */

import { getSupabaseAdmin } from "@/lib/supabase/server";
import {
  BUCKET_EVENTOS,
  COLUMNAS_EVENTO_SITIO,
  aEventoSitio,
  terminado,
  type EventoSitio,
  type MarcaSitio,
} from "@/lib/eventos";

type Db = NonNullable<ReturnType<typeof getSupabaseAdmin>>;

function urlPublicaDe(db: Db) {
  return (ruta: string) => db.storage.from(BUCKET_EVENTOS).getPublicUrl(ruta).data.publicUrl;
}

/** Las marcas de estos ids, en un mapa. Una consulta para todos los eventos. */
async function marcasDe(db: Db, filas: Record<string, unknown>[]): Promise<Map<string, MarcaSitio>> {
  const ids = [...new Set(filas.flatMap((f) => (Array.isArray(f.marca_ids) ? f.marca_ids.map(String) : [])))];
  if (ids.length === 0) return new Map();
  const { data } = await db.from("marcas").select("id, nombre, logo_ruta").in("id", ids);
  const url = urlPublicaDe(db);
  return new Map(
    (data ?? []).map((m) => [String(m.id), { id: String(m.id), nombre: String(m.nombre), logoUrl: url(String(m.logo_ruta)) }])
  );
}

/**
 * Los próximos (del más cercano al más lejano) y los últimos realizados (del más
 * nuevo al más viejo). "Próximo" incluye al que está en curso: un evento que
 * empezó hace media hora sigue siendo noticia.
 *
 * `limite` es por grupo: la pestaña de la portada pide pocos; la página
 * /eventos, todos.
 */
export async function leerEventosPublicados(limite = 6): Promise<{ proximos: EventoSitio[]; pasados: EventoSitio[] }> {
  const db = getSupabaseAdmin();
  if (!db) return { proximos: [], pasados: [] };

  // El corte es "empezó hace menos de 12 horas": cubre los que están en curso sin
  // depender de que tengan hora de fin. El filtro fino lo hace `terminado()`.
  const corte = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString();

  const [prox, pas] = await Promise.all([
    db.from("eventos").select(COLUMNAS_EVENTO_SITIO).eq("publicado", true).gte("inicio", corte).order("inicio", { ascending: true }).limit(limite * 2),
    db.from("eventos").select(COLUMNAS_EVENTO_SITIO).eq("publicado", true).lt("inicio", new Date().toISOString()).order("inicio", { ascending: false }).limit(limite * 2),
  ]);

  if (prox.error || pas.error) {
    console.error("[eventos leer]", prox.error ?? pas.error);
    return { proximos: [], pasados: [] };
  }

  const filas = [...(prox.data ?? []), ...(pas.data ?? [])] as Record<string, unknown>[];
  const marcas = await marcasDe(db, filas);
  const url = urlPublicaDe(db);
  const ahora = new Date();

  const proximos = (prox.data ?? [])
    .map((f) => aEventoSitio(f as Record<string, unknown>, marcas, url))
    .filter((e) => !terminado(e, ahora))
    .slice(0, limite);

  const idsProximos = new Set(proximos.map((e) => e.id));
  const pasados = (pas.data ?? [])
    .map((f) => aEventoSitio(f as Record<string, unknown>, marcas, url))
    .filter((e) => terminado(e, ahora) && !idsProximos.has(e.id))
    .slice(0, limite);

  return { proximos, pasados };
}

export async function leerEventoPorSlug(slug: string): Promise<EventoSitio | null> {
  const db = getSupabaseAdmin();
  if (!db) return null;
  const { data, error } = await db
    .from("eventos")
    .select(COLUMNAS_EVENTO_SITIO)
    .eq("slug", slug)
    .eq("publicado", true)
    .maybeSingle();
  if (error || !data) return null;
  const fila = data as Record<string, unknown>;
  return aEventoSitio(fila, await marcasDe(db, [fila]), urlPublicaDe(db));
}

export type CertificadoVerificado = {
  nombre: string;
  codigo: string;
  horas: number;
  emitido: string;
  evento: { titulo: string; slug: string; tipo: string; modalidad: string; inicio: string; publicado: boolean };
  fechaTexto: string;
  cursoTexto: string;
};

/**
 * Un certificado por su código, para la página de verificación.
 *
 * Responde aunque el evento esté despublicado: el certificado sigue siendo
 * válido aunque el evento ya no se anuncie. Lo único que lo invalida es que se
 * haya borrado la fila del asistente.
 *
 * Devuelve sólo lo que ya está impreso en el papel —nombre, curso, fecha,
 * horas—. El email y la empresa no salen: quien tiene el código tiene el papel,
 * no necesariamente permiso para ver los datos de contacto de esa persona.
 */
export async function verificarCertificado(codigo: string): Promise<CertificadoVerificado | null> {
  const db = getSupabaseAdmin();
  if (!db) return null;
  const limpio = codigo.trim().toUpperCase();
  if (!/^[A-Z0-9-]{8,20}$/.test(limpio)) return null;

  const { data, error } = await db
    .from("evento_asistentes")
    .select("nombre, codigo, horas, created_at, eventos(titulo, slug, tipo, modalidad, inicio, publicado, certificado)")
    .eq("codigo", limpio)
    .maybeSingle();

  if (error || !data) return null;

  const fila = data as Record<string, unknown>;
  const ev = (Array.isArray(fila.eventos) ? fila.eventos[0] : fila.eventos) as Record<string, unknown> | null;
  if (!ev) return null;

  const cert = (ev.certificado && typeof ev.certificado === "object" ? ev.certificado : {}) as Record<string, unknown>;
  const horasCert = Number(cert.horas) > 0 ? Number(cert.horas) : 0;
  const horas = fila.horas !== null && Number(fila.horas) > 0 ? Number(fila.horas) : horasCert;
  const inicio = String(ev.inicio ?? "");

  return {
    nombre: String(fila.nombre),
    codigo: String(fila.codigo),
    horas,
    emitido: String(fila.created_at ?? ""),
    evento: {
      titulo: String(ev.titulo ?? ""),
      slug: String(ev.slug ?? ""),
      tipo: String(ev.tipo ?? ""),
      modalidad: String(ev.modalidad ?? ""),
      inicio,
      publicado: ev.publicado === true,
    },
    fechaTexto:
      (typeof cert.fechaTexto === "string" && cert.fechaTexto.trim()) ||
      new Date(inicio).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric", timeZone: "America/Argentina/Buenos_Aires" }),
    cursoTexto: (typeof cert.tituloCurso === "string" && cert.tituloCurso.trim()) || String(ev.titulo ?? ""),
  };
}
