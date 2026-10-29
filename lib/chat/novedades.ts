import { leerNotasParaIndice } from "@/lib/notas-server";
import { leerEventosPublicados } from "@/lib/eventos-server";
import { SOLUTIONS } from "@/components/solutions/solutionsData";
import { ZONA } from "@/lib/eventos";
import type { TarjetaEvento, TarjetaNota } from "./tipos";

/**
 * Lo que el asistente sabe del blog y de los eventos: lo que publica el
 * backoffice, leído de la misma tabla que el sitio.
 *
 * Cinco minutos en memoria, como el ISR de /blog: publicar una nota tarda lo
 * mismo en llegar al chat que al sitio, y una conversación no le pega a la
 * base en cada mensaje. Si la base no responde, el asistente sigue sin blog ni
 * eventos: no es motivo para trabar el chat.
 *
 * Sólo servidor.
 */

const VIGENCIA_MS = 5 * 60 * 1000;
/** Las más nuevas: con más, el contexto crece y el modelo no elige mejor. */
const NOTAS_MAX = 40;
const EVENTOS_MAX = 6;

type Novedades = { notas: TarjetaNota[]; eventos: TarjetaEvento[]; texto: string };

let cache: { valor: Novedades; hasta: number } | null = null;
let enCurso: Promise<Novedades> | null = null;

const area = (c: string | null | undefined) => (c && SOLUTIONS[c] ? SOLUTIONS[c].name : "General");

const fechaEvento = (iso: string) =>
  new Date(iso).toLocaleString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: ZONA,
  });

async function leer(): Promise<Novedades> {
  const [notasCrudas, eventosCrudos] = await Promise.all([
    leerNotasParaIndice().catch(() => []),
    leerEventosPublicados(EVENTOS_MAX).catch(() => ({ proximos: [], pasados: [] })),
  ]);

  const notas: TarjetaNota[] = notasCrudas.slice(0, NOTAS_MAX).map((n) => ({
    tipo: "nota",
    slug: n.slug,
    titulo: n.titulo,
    resumen: n.resumen.slice(0, 220),
    categoria: n.categoria ?? null,
    href: `/blog/${n.slug}`,
  }));

  const eventos: TarjetaEvento[] = eventosCrudos.proximos
    .filter((e) => Date.parse(e.inicio) > Date.now() - 2 * 60 * 60 * 1000)
    .map((e) => ({
      tipo: "evento",
      slug: e.slug,
      titulo: e.titulo,
      resumen: e.resumen.slice(0, 220),
      categoria: e.categorias[0] ?? null,
      fecha: fechaEvento(e.inicio),
      inicio: e.inicio,
      modalidad: e.modalidad === "hibrido" ? "Híbrido" : e.modalidad === "online" ? "Online" : "Presencial",
      lugar: e.modalidad === "online" ? "" : e.lugar,
      href: `/eventos/${e.slug}`,
    }));

  const partes = ["# Blog y eventos de Accedra (lo publicado hoy; no conocés otros)"];
  partes.push(
    notas.length
      ? `## Notas del blog (id · área · título — resumen)\n${notas
          .map((n) => `- ${n.slug} · ${area(n.categoria)} · ${n.titulo} — ${n.resumen}`)
          .join("\n")}`
      : "## Notas del blog\nNo hay notas publicadas.",
  );
  partes.push(
    eventos.length
      ? `## Próximos eventos (id · área · fecha · modalidad · título — resumen)\n${eventos
          .map((e) => `- ${e.slug} · ${area(e.categoria)} · ${e.fecha} · ${e.modalidad} · ${e.titulo} — ${e.resumen}`)
          .join("\n")}`
      : "## Próximos eventos\nNo hay eventos próximos: no ofrezcas ninguno.",
  );

  return { notas, eventos, texto: partes.join("\n\n") };
}

/** Lo publicado, desde la caché o leído de nuevo si venció. */
export async function cargarNovedades(): Promise<Novedades> {
  if (cache && cache.hasta > Date.now()) return cache.valor;
  enCurso ??= leer()
    .then((valor) => {
      cache = { valor, hasta: Date.now() + VIGENCIA_MS };
      return valor;
    })
    .finally(() => {
      enCurso = null;
    });
  return enCurso;
}

/** Lo último que se cargó. Para validar lo que pide el modelo sin volver a leer. */
export function novedadesCargadas(): Novedades {
  return cache?.valor ?? { notas: [], eventos: [], texto: "" };
}

export const notaPorSlug = (slug: string) => novedadesCargadas().notas.find((n) => n.slug === slug) ?? null;
export const eventoPorSlug = (slug: string) => novedadesCargadas().eventos.find((e) => e.slug === slug) ?? null;
