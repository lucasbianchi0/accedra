import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import PortadaGenerada from "@/components/recursos/PortadaGenerada";
import {
  CATEGORIA_COLOR,
  CATEGORIA_LABEL,
  TIPO_LABEL,
  fechaCorta,
  urlDeNota,
  type NotaSitio,
} from "@/lib/notas";

/**
 * CUÁNTO MIDE LA PORTADA EN CADA PANTALLA.
 *
 * Es lo que el navegador necesita para elegir del `srcset` sin adivinar: sin
 * `sizes` asume que la imagen ocupa el ancho de la ventana y se baja la versión
 * más grande de todas. La grilla es de tres columnas arriba de 1024, dos arriba
 * de 640 y una abajo; el contenedor llega a 1280 con 48 px de aire a cada lado.
 *
 * Antes acá había una URL de `/_next/image` escrita a mano con UN ancho fijo:
 * la misma foto de 640 px viajaba a un monitor de escritorio (donde se veía
 * pixelada en pantallas retina) y a un teléfono de 390 px (donde sobraba la
 * mitad). Y como el ancho tenía que ser uno de los `deviceSizes`, cualquier
 * número «razonable» que no estuviera en la lista —768, por ejemplo— devolvía
 * 400 y dejaba la card en negro. Con `next/image` los dos problemas
 * desaparecen: el srcset lo arma Next.
 */
const SIZES_CARD = "(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw";
/** La destacada ocupa dos columnas de las tres. */
const SIZES_ANCHA = "(min-width: 1024px) 800px, (min-width: 640px) 100vw, 100vw";

/**
 * La portada de la card.
 *
 * Siempre hay imagen: la foto si el backoffice la cargó, y si no el dibujo de
 * marca de `PortadaGenerada`. Nunca un hueco — una grilla donde tres cards
 * tienen foto y dos no se lee como una grilla rota, no como una grilla mixta.
 *
 * El degradé de abajo no es decoración: sostiene las etiquetas, que se apoyan
 * sobre la portada y tienen que leerse tanto contra una foto clara como contra
 * el dibujo oscuro.
 */
function Portada({ nota, ratio, ancha, arriba }: { nota: NotaSitio; ratio: string; ancha: boolean; arriba: boolean }) {
  const color = nota.categoria ? CATEGORIA_COLOR[nota.categoria] : "#2b6fd4";

  return (
    // El degradé de la solución va en el contenedor, debajo de la foto: es lo
    // que se ve mientras la imagen baja —y lo que queda si nunca baja, porque
    // el storage no responde o la portada se borró del bucket—. Un rectángulo
    // negro en ese hueco parece una card rota; esto parece una card de la que
    // todavía no llegó la foto, que es lo que pasa.
    <div
      className={`relative overflow-hidden ${ratio}`}
      style={{ background: `linear-gradient(135deg, ${color}2e 0%, #0a1424 55%, #05090f 100%)` }}
    >
      {nota.portadaUrl ? (
        <Image
          src={nota.portadaUrl}
          alt=""
          fill
          sizes={ancha ? SIZES_ANCHA : SIZES_CARD}
          // La primera fila entra con la página: es la candidata a LCP y con
          // `lazy` el navegador la descubre recién cuando terminó el layout.
          loading={arriba ? "eager" : "lazy"}
          fetchPriority={arriba ? "high" : undefined}
          className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
        />
      ) : (
        <div className="absolute inset-0 transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]">
          <PortadaGenerada nota={nota} color={color} />
        </div>
      )}

      {/* Velo inferior: de la portada al cuerpo de la card sin costura. */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#05090f] via-[#05090f]/55 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-2 p-4">
        <Etiquetas nota={nota} />
      </div>
    </div>
  );
}

function Etiquetas({ nota }: { nota: NotaSitio }) {
  return (
    <>
      {nota.categoria && (
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm"
          style={{
            background: `${CATEGORIA_COLOR[nota.categoria]}2e`,
            border: `1px solid ${CATEGORIA_COLOR[nota.categoria]}66`,
          }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              background: CATEGORIA_COLOR[nota.categoria],
              boxShadow: `0 0 8px ${CATEGORIA_COLOR[nota.categoria]}`,
            }}
          />
          {CATEGORIA_LABEL[nota.categoria]}
        </span>
      )}
      <span className="rounded-full border border-white/12 bg-black/45 px-2.5 py-1 text-[11px] font-medium text-gray-300 backdrop-blur-sm">
        {TIPO_LABEL[nota.tipo]}
      </span>
      {nota.destacada && (
        <span className="rounded-full border border-white/20 bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-[#05090f]">
          Destacada
        </span>
      )}
    </>
  );
}

/**
 * La card de una nota en el hub.
 *
 * `ancha` es la variante que ocupa dos columnas de la misma grilla: la nota
 * destacada pesa más sin salirse del ritmo. Antes era una fila aparte de ancho
 * completo, y con pocas notas dejaba media pantalla vacía arriba de la grilla.
 *
 * La información es la misma en las dos variantes —no hay datos que aparezcan
 * sólo en una— para que destacar una nota sea una decisión de diseño y no de
 * contenido.
 */
export default function NotaCard({
  nota,
  ancha = false,
  /** Está en la primera fila de la grilla: se carga sin esperar al scroll. */
  arriba = false,
}: {
  nota: NotaSitio;
  ancha?: boolean;
  arriba?: boolean;
}) {
  // El autor sólo en la card ancha: en una de 390 px, "15 de sept de 2026 ·
  // Carlos Omar Bianchi" se parte en dos líneas y choca con la flecha. Y el
  // autor casi siempre es el mismo — no es lo que distingue una nota de otra.
  const pie = ancha
    ? [fechaCorta(nota.publicadoEn), nota.autor].filter(Boolean).join(" · ")
    : fechaCorta(nota.publicadoEn);
  const color = nota.categoria ? CATEGORIA_COLOR[nota.categoria] : "#2b6fd4";

  return (
    <Link
      href={urlDeNota(nota.slug)}
      className={`group relative overflow-hidden rounded-card border border-white/[0.07] bg-white/[0.02] transition duration-300 hover:-translate-y-1 hover:border-white/15 hover:bg-white/[0.04] hover:shadow-[0_24px_70px_-20px_rgba(0,0,0,0.8)] ${
        ancha
          ? "flex flex-col md:col-span-2 md:grid md:grid-cols-2 md:items-stretch"
          : "flex flex-col"
      }`}
    >
      {/* El halo del color de la solución, sólo al pasar por encima: es lo que
          hace que la grilla no se sienta un tablero de rectángulos iguales. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />

      <Portada
        nota={nota}
        ratio={ancha ? "aspect-[16/9] md:aspect-auto md:h-full" : "aspect-[16/9]"}
        ancha={ancha}
        arriba={arriba}
      />

      <div className="flex flex-1 flex-col p-5 lg:p-6">
        <h3
          className={`font-display font-bold leading-[1.22] text-white transition-colors group-hover:text-white ${
            ancha ? "text-[22px] lg:text-[28px]" : "text-[18px]"
          }`}
        >
          {nota.titulo}
        </h3>

        {nota.resumen && (
          <p
            className={`mt-2.5 text-[14px] leading-relaxed text-gray-400 ${
              ancha ? "line-clamp-3 lg:text-[15px]" : "line-clamp-2"
            }`}
          >
            {nota.resumen}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          {pie && <span className="truncate text-[11px] uppercase tracking-[0.14em] text-gray-500">{pie}</span>}
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 text-gray-400 transition-all duration-300 group-hover:border-white/25 group-hover:bg-white/10 group-hover:text-white"
            aria-hidden="true"
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
