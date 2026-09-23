import Image from "next/image";

import { CATEGORIA_COLOR, type EventoSitio } from "@/lib/eventos";

/**
 * La portada de un evento en las piezas nuevas.
 *
 * QUÉ CAMBIA RESPECTO DE LA ACTUAL
 *
 * Hoy, un evento sin foto cargada cae en un degradé azul brillante con los
 * logos encima. Sobre el navy de la página anterior pasaba; sobre casi negro,
 * es el rectángulo más claro de la pantalla y se lleva el ojo — justo el evento
 * que menos material tiene es el que más grita.
 *
 * Acá el fallback es el mismo recurso que /recursos: un dibujo de marca en el
 * color de la solución del evento, determinista a partir del slug, en SVG y
 * dentro del mismo HTML. Una fila donde dos eventos tienen foto y uno no se lee
 * como una familia, no como una grilla rota.
 *
 * Los logos de las marcas siguen apareciendo sobre el dibujo: cuando no hay
 * foto, las tecnologías SON la portada.
 *
 * ES UN COMPONENTE DE SERVIDOR: no hay estado ni eventos: nada que hidratar.
 */

/**
 * CUÁNTO MIDE LA PORTADA EN PANTALLA (`sizes`).
 *
 * Es lo que le permite al navegador elegir del `srcset`; sin el dato asume que
 * la imagen ocupa el ancho de la ventana y baja la versión más grande que
 * exista. Cada lugar donde se usa esta portada mide distinto, así que el dato
 * lo pone quien la usa y acá sólo hay un valor por defecto honesto.
 *
 * Acá había una URL de `/_next/image` escrita a mano. Servía el mismo archivo a
 * un teléfono y a un monitor 4K, y el ancho tenía que ser uno de los declarados
 * en next.config (16·32·48·64·96·128·256·384 y 640·750·828·1080·1200·1920·
 * 2048·3840): cualquier otro —768, el número obvio— devuelve 400 y deja la
 * portada en negro. Con `next/image` los dos problemas desaparecen.
 */

/** djb2 sobre el slug: sólo hay que repartir en cuatro cajones. */
function hash(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h;
}

export default function PortadaEvento({
  e,
  className = "absolute inset-0",
  /** Cuánto mide en pantalla: lo pone quien la usa. */
  sizes = "100vw",
  /** Los logos de las marcas sobre el dibujo (no sobre la foto). */
  conMarcas = true,
  /**
   * La portada que se ve sin scrollear. La marquesina es el elemento más grande
   * de la primera pantalla, o sea el LCP: con `lazy` el navegador la descubre
   * recién al terminar el layout y la métrica se paga entera.
   */
  prioridad = false,
}: {
  e: EventoSitio;
  className?: string;
  sizes?: string;
  conMarcas?: boolean;
  prioridad?: boolean;
}) {
  const color = e.categorias[0] ? CATEGORIA_COLOR[e.categorias[0]] : "#2b6fd4";

  if (e.portadaUrl) {
    return (
      <div className={`overflow-hidden bg-[#05090f] ${className}`}>
        <Image
          src={e.portadaUrl}
          alt=""
          fill
          sizes={sizes}
          loading={prioridad ? "eager" : "lazy"}
          fetchPriority={prioridad ? "high" : undefined}
          className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
        />
      </div>
    );
  }

  return (
    <div className={`overflow-hidden bg-[#05090f] ${className}`}>
      <Dibujo slug={e.slug} color={color} />
      {conMarcas && e.marcas.length > 0 && (
        <div className="absolute inset-0 flex items-center justify-center gap-2 px-4">
          {e.marcas.slice(0, 3).map((m) => (
            <div
              key={m.id}
              title={m.nombre}
              className="grid h-9 min-w-11 place-items-center rounded-lg bg-white/95 px-2.5 shadow-[0_10px_26px_rgba(0,0,0,0.45)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.logoUrl} alt="" loading="lazy" className="max-h-4 max-w-[54px] object-contain" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * El dibujo. Cuatro variantes repartidas por el hash del slug, con el foco de
 * luz en un lugar distinto cada vez: dos eventos seguidos de la misma solución
 * tendrían la misma portada si no.
 */
function Dibujo({ slug, color }: { slug: string; color: string }) {
  const h = hash(slug);
  const variante = h % 4;
  const fx = 24 + (h % 5) * 13;
  const fy = 20 + ((h >> 3) % 4) * 12;
  const id = `ev-${(h % 100000).toString(36)}`;

  return (
    <svg viewBox="0 0 400 225" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="55%" stopColor="#0a1424" />
          <stop offset="100%" stopColor="#05090f" />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx={`${fx}%`} cy={`${fy}%`} r="62%">
          <stop offset="0%" stopColor={color} stopOpacity="0.5" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-fade`} cx={`${fx}%`} cy={`${fy}%`} r="75%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id={`${id}-m`}>
          <rect width="400" height="225" fill={`url(#${id}-fade)`} />
        </mask>
      </defs>

      <rect width="400" height="225" fill={`url(#${id}-bg)`} />
      <rect width="400" height="225" fill={`url(#${id}-glow)`} />

      <g mask={`url(#${id}-m)`} stroke={color} fill="none">
        {variante === 0 && <Agenda />}
        {variante === 1 && <Anillos h={h} />}
        {variante === 2 && <Asientos />}
        {variante === 3 && <Ondas h={h} />}
      </g>
    </svg>
  );
}

/** Una retícula de calendario: columnas de semana y filas de día. */
function Agenda() {
  return (
    <g strokeOpacity="0.3" strokeWidth="0.9">
      {Array.from({ length: 9 }, (_, i) => (
        <line key={`v${i}`} x1={40 + i * 44} y1={-10} x2={40 + i * 44} y2={235} />
      ))}
      {Array.from({ length: 6 }, (_, i) => (
        <line key={`h${i}`} x1={-10} y1={22 + i * 42} x2={410} y2={22 + i * 42} />
      ))}
    </g>
  );
}

/** Anillos concéntricos: la onda de una convocatoria. */
function Anillos({ h }: { h: number }) {
  const cx = 60 + (h % 3) * 130;
  const cy = h % 2 === 0 ? 40 : 185;
  return (
    <g strokeWidth="1">
      {Array.from({ length: 9 }, (_, i) => (
        <circle key={i} cx={cx} cy={cy} r={22 + i * 26} strokeOpacity={0.42 - i * 0.035} />
      ))}
    </g>
  );
}

/** Filas de asientos en perspectiva: una sala vista desde el escenario. */
function Asientos() {
  return (
    <g strokeWidth="1">
      {Array.from({ length: 7 }, (_, i) => {
        const y = 60 + i * 26 + i * i * 1.6;
        const ancho = 60 + i * 34;
        return <path key={i} d={`M ${200 - ancho} ${y} Q 200 ${y + 16} ${200 + ancho} ${y}`} strokeOpacity={0.34 - i * 0.03} />;
      })}
    </g>
  );
}

/** Arcos apilados: el mismo recurso que en /recursos, para que las dos
 *  secciones se reconozcan como la misma casa. */
function Ondas({ h }: { h: number }) {
  const base = h % 2 === 0 ? 235 : -10;
  const dir = h % 2 === 0 ? -1 : 1;
  return (
    <g strokeWidth="1.1">
      {Array.from({ length: 10 }, (_, i) => {
        const y = base + dir * i * 24;
        return <path key={i} d={`M -20 ${y} Q 200 ${y + dir * -70} 420 ${y}`} strokeOpacity={0.4 - i * 0.032} />;
      })}
    </g>
  );
}
