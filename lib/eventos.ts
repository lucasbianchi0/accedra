/**
 * Los eventos del sitio: lo que llega del backoffice.
 *
 * Igual que el popup, el contenido no se edita acá. Se carga en el backoffice
 * (Marketing → Eventos y certificados), se guarda en `eventos` y `marcas` en la
 * misma base que los leads, y este archivo sólo lo lee y lo da forma.
 *
 * Los textos se muestran como se cargaron en las tres versiones del sitio, por
 * el mismo motivo que el popup: son anuncios con fecha, y pedir tres
 * traducciones de algo que dura dos semanas termina en que no se carga nada.
 *
 * Sin imports de servidor: lo usan las rutas y los componentes cliente.
 */

export type Tipo = "workshop" | "webinar" | "capacitacion" | "charla" | "meetup" | "lanzamiento";
export type Modalidad = "presencial" | "online" | "hibrido";

/**
 * A qué solución pertenece el evento: los mismos slugs de /soluciones/<slug>.
 * Un evento puede tener varias. Se cargan en el backoffice.
 */
export const CATEGORIAS = ["networking", "firma-biometrica", "consultoria", "seguridad", "software-ai"] as const;
export type Categoria = (typeof CATEGORIAS)[number];

/** El color de identidad de cada solución (el `accent` de solutionsData). */
export const CATEGORIA_COLOR: Record<Categoria, string> = {
  networking: "#3B82F6",
  "firma-biometrica": "#7C6CF6",
  consultoria: "#06B6D4",
  seguridad: "#10B981",
  "software-ai": "#B45CF2",
};

export type MarcaSitio = { id: string; nombre: string; logoUrl: string };

export type EventoSitio = {
  id: string;
  slug: string;
  destacado: boolean;
  tipo: Tipo;
  modalidad: Modalidad;
  titulo: string;
  resumen: string;
  descripcion: string;
  tags: string[];
  categorias: Categoria[];
  inicio: string;
  fin: string;
  lugar: string;
  inscripcionUrl: string;
  cupo: number | null;
  precio: string;
  oradores: { nombre: string; cargo: string; empresa: string }[];
  marcas: MarcaSitio[];
  portadaUrl: string | null;
};

/** Nombre del bucket público donde el backoffice deja portadas y logos. */
export const BUCKET_EVENTOS = "eventos";

export const COLUMNAS_EVENTO_SITIO =
  "id, slug, destacado, tipo, modalidad, titulo, resumen, descripcion, tags, categorias, inicio, fin, lugar, inscripcion_url, cupo, precio, oradores, marca_ids, portada_ruta";

export const ZONA = "America/Argentina/Buenos_Aires";

const TIPOS: Tipo[] = ["workshop", "webinar", "capacitacion", "charla", "meetup", "lanzamiento"];
const MODALIDADES: Modalidad[] = ["presencial", "online", "hibrido"];

function texto(v: unknown): string {
  return typeof v === "string" ? v : "";
}

/**
 * Fila → evento del sitio. Las marcas se resuelven contra el mapa que arma
 * quien llama (una sola consulta para todos los eventos, no una por fila), y un
 * id que ya no existe en la biblioteca simplemente no se dibuja.
 */
export function aEventoSitio(
  fila: Record<string, unknown>,
  marcas: Map<string, MarcaSitio>,
  urlPublica: (ruta: string) => string
): EventoSitio {
  const ids = Array.isArray(fila.marca_ids) ? fila.marca_ids.map(String) : [];
  const oradores = Array.isArray(fila.oradores) ? fila.oradores : [];
  const portada = texto(fila.portada_ruta);

  return {
    id: String(fila.id),
    slug: texto(fila.slug),
    destacado: fila.destacado === true,
    tipo: TIPOS.includes(fila.tipo as Tipo) ? (fila.tipo as Tipo) : "workshop",
    modalidad: MODALIDADES.includes(fila.modalidad as Modalidad) ? (fila.modalidad as Modalidad) : "presencial",
    titulo: texto(fila.titulo),
    resumen: texto(fila.resumen),
    descripcion: texto(fila.descripcion),
    tags: Array.isArray(fila.tags) ? fila.tags.map(String) : [],
    categorias: Array.isArray(fila.categorias) ? CATEGORIAS.filter((c) => (fila.categorias as unknown[]).includes(c)) : [],
    inicio: texto(fila.inicio),
    fin: texto(fila.fin),
    lugar: texto(fila.lugar),
    inscripcionUrl: texto(fila.inscripcion_url),
    cupo: typeof fila.cupo === "number" ? fila.cupo : null,
    precio: texto(fila.precio),
    oradores: oradores
      .map((o) => (o && typeof o === "object" ? (o as Record<string, unknown>) : {}))
      .map((o) => ({ nombre: texto(o.nombre), cargo: texto(o.cargo), empresa: texto(o.empresa) }))
      .filter((o) => o.nombre),
    marcas: ids.map((id) => marcas.get(id)).filter((m): m is MarcaSitio => Boolean(m)),
    portadaUrl: portada ? urlPublica(portada) : null,
  };
}

/**
 * Si el evento ya terminó. Sin hora de fin se lo da por terminado a las tres
 * horas del inicio — misma regla que el backoffice (`estadoDe`), para que la
 * lista del equipo y el sitio nunca digan cosas distintas.
 */
export function terminado(e: Pick<EventoSitio, "inicio" | "fin">, ahora = new Date()): boolean {
  const inicio = new Date(e.inicio);
  const fin = e.fin ? new Date(e.fin) : new Date(inicio.getTime() + 3 * 60 * 60 * 1000);
  return ahora >= fin;
}

export function enCurso(e: Pick<EventoSitio, "inicio" | "fin">, ahora = new Date()): boolean {
  return new Date(e.inicio) <= ahora && !terminado(e, ahora);
}
