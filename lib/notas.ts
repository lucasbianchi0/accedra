/**
 * Las notas del sitio: lo que llega del backoffice.
 *
 * Igual que los eventos y el popup, el contenido no se edita acá. Se escribe en
 * el backoffice (Marketing → Notas del sitio), se guarda en la tabla `notas` de
 * la misma base que los leads, y este archivo sólo lo lee y lo da forma.
 *
 * QUÉ SON ESTAS PÁGINAS Y POR QUÉ EXISTEN
 *
 * El resto del sitio compite por búsquedas de alguien que ya quiere contratar
 * ("firma biométrica para aseguradoras"). Las notas son el otro lado: las
 * preguntas que alguien escribe en Google o le hace a una IA antes de saber que
 * necesita un proveedor. De ahí que la nota tenga `respuesta` y `faqs` como
 * campos propios: son los dos bloques que un modelo generativo puede citar sin
 * leer el resto de la página.
 *
 * Se muestran sólo en español, como los eventos: traducir una biblioteca que
 * crece dos veces por semana termina en que no se publica nada.
 *
 * Sin imports de servidor: lo usan las rutas y los componentes.
 */

export type Tipo = "guia" | "nota" | "caso";

export const TIPO_LABEL: Record<Tipo, string> = {
  guia: "Guía",
  nota: "Nota",
  caso: "Caso",
};

/** La solución a la que pertenece: los mismos slugs de /soluciones/<slug>. */
export const CATEGORIAS = ["networking", "firma-biometrica", "consultoria", "seguridad", "software-ai"] as const;
export type Categoria = (typeof CATEGORIAS)[number];

export const CATEGORIA_LABEL: Record<Categoria, string> = {
  networking: "Networking",
  "firma-biometrica": "Firma biométrica",
  consultoria: "Consultoría",
  seguridad: "Ciberseguridad",
  "software-ai": "IA & Software",
};

/** El color de identidad de cada solución (el `accent` de solutionsData). */
export const CATEGORIA_COLOR: Record<Categoria, string> = {
  networking: "#3B82F6",
  "firma-biometrica": "#7C6CF6",
  consultoria: "#06B6D4",
  seguridad: "#10B981",
  "software-ai": "#B45CF2",
};

/** Las industrias con landing propia: /soluciones/<solucion>/<industria>. */
export const INDUSTRIAS = [
  "bancos",
  "seguros",
  "juridicos",
  "laboratorios",
  "logistica",
  "retail",
  "mineria",
] as const;
export type Industria = (typeof INDUSTRIAS)[number];

export type Faq = { q: string; a: string };
export type Fuente = { titulo: string; url: string };

export type NotaSitio = {
  id: string;
  slug: string;
  destacada: boolean;
  tipo: Tipo;
  titulo: string;
  tituloSeo: string;
  resumen: string;
  respuesta: string;
  cuerpo: string;
  categoria: Categoria | null;
  industrias: Industria[];
  tags: string[];
  faqs: Faq[];
  fuentes: Fuente[];
  autor: string;
  autorCargo: string;
  portadaUrl: string | null;
  /** ISO. La fecha pública: `datePublished`. */
  publicadoEn: string;
  /** ISO o vacío. `dateModified`, sólo si alguien revisó el contenido. */
  revisadoEn: string;
};

/** La dirección del hub. Una sola constante: si mañana pasa a /blog o /guias,
 *  cambia acá y el sitemap, el llms.txt y los links internos la siguen. */
export const BASE_RECURSOS = "/recursos";

export function urlDeNota(slug: string): string {
  return `${BASE_RECURSOS}/${slug}`;
}

/** Nombre del bucket público donde el backoffice deja las portadas. */
export const BUCKET_NOTAS = "notas";

export const COLUMNAS_NOTA_SITIO =
  "id, slug, destacada, tipo, titulo, titulo_seo, resumen, respuesta, cuerpo, categoria, industrias, tags, faqs, fuentes, autor, autor_cargo, portada_ruta, publicado_en, revisado_en";

/** La lista del hub no necesita el cuerpo de cada nota: son hasta 60 kB por
 *  fila que no se dibujan en una card. */
export const COLUMNAS_LISTA_SITIO =
  "id, slug, destacada, tipo, titulo, resumen, categoria, industrias, tags, autor, portada_ruta, publicado_en, revisado_en";

export const ZONA = "America/Argentina/Buenos_Aires";

const TIPOS: Tipo[] = ["guia", "nota", "caso"];

function texto(v: unknown): string {
  return typeof v === "string" ? v : "";
}

/** Fila → nota del sitio. Lo que falta queda vacío; lo que sobra se descarta. */
export function aNotaSitio(fila: Record<string, unknown>, urlPublica: (ruta: string) => string): NotaSitio {
  const portada = texto(fila.portada_ruta);
  const faqs = Array.isArray(fila.faqs) ? fila.faqs : [];
  const fuentes = Array.isArray(fila.fuentes) ? fila.fuentes : [];

  return {
    id: String(fila.id),
    slug: texto(fila.slug),
    destacada: fila.destacada === true,
    tipo: TIPOS.includes(fila.tipo as Tipo) ? (fila.tipo as Tipo) : "nota",
    titulo: texto(fila.titulo),
    tituloSeo: texto(fila.titulo_seo),
    resumen: texto(fila.resumen),
    respuesta: texto(fila.respuesta),
    cuerpo: texto(fila.cuerpo),
    categoria: CATEGORIAS.find((c) => c === fila.categoria) ?? null,
    industrias: Array.isArray(fila.industrias)
      ? INDUSTRIAS.filter((i) => (fila.industrias as unknown[]).includes(i))
      : [],
    tags: Array.isArray(fila.tags) ? fila.tags.map(String) : [],
    faqs: faqs
      .map((f) => (f && typeof f === "object" ? (f as Record<string, unknown>) : {}))
      .map((f) => ({ q: texto(f.q), a: texto(f.a) }))
      .filter((f) => f.q && f.a),
    fuentes: fuentes
      .map((f) => (f && typeof f === "object" ? (f as Record<string, unknown>) : {}))
      .map((f) => ({ titulo: texto(f.titulo), url: texto(f.url) }))
      .filter((f) => f.titulo && f.url),
    autor: texto(fila.autor),
    autorCargo: texto(fila.autor_cargo),
    portadaUrl: portada ? urlPublica(portada) : null,
    publicadoEn: texto(fila.publicado_en),
    revisadoEn: texto(fila.revisado_en),
  };
}

/* ── Lectura ──────────────────────────────────────────────────────────────── */

/** Palabras del cuerpo, ya sin la marcación. Misma cuenta que el backoffice. */
export function palabrasDe(cuerpo: string): number {
  const limpio = cuerpo
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`\-[\]()]/g, " ")
    .trim();
  return limpio ? limpio.split(/\s+/).length : 0;
}

/** Minutos de lectura, a 200 palabras por minuto. Nunca menos de uno. */
export function minutosDe(cuerpo: string): number {
  return Math.max(1, Math.round(palabrasDe(cuerpo) / 200));
}

/* ── Fechas ───────────────────────────────────────────────────────────────── */

/** "18 de septiembre de 2026". En hora de Buenos Aires también en el servidor
 *  de Vercel, que corre en UTC. */
export function fechaLarga(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric", timeZone: ZONA });
}

/** "18 sep 2026". */
export function fechaCorta(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric", timeZone: ZONA }).replace(".", "");
}
