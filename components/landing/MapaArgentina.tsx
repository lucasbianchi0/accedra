"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useT } from "@/lib/i18n/useT";

type Provincia = (typeof import("./provincias"))["PROVINCIAS"][number];

const MAPA = { w: 560, h: 1196 };
const SEDE = { x: 418.8, y: 402.9 };
export const CODIGO_SEDE = "ciudad-de-buenos-aires";

// Provincias con un caso publicado; el texto sale de `landing.presencia.detalles`.
export const CON_CASO = ["buenos-aires", "catamarca", "jujuy", "san-juan", "santa-cruz"];

function arco(x: number, y: number) {
  const lejos = Math.abs(y - SEDE.y) > 200;
  const cx = (SEDE.x + x) / 2 + (lejos ? (y < SEDE.y ? 70 : 150) : 20);
  return `M${SEDE.x} ${SEDE.y} Q${cx} ${(SEDE.y + y) / 2} ${x} ${y}`;
}

export default function MapaArgentina({
  resaltadas,
  alCambiar,
}: {
  /** Provincias marcadas desde afuera: las de la fila activa de la lista. */
  resaltadas: readonly string[];
  alCambiar: (codigo: string | null) => void;
}) {
  const t = useT();
  const p = t.landing.presencia;
  const caja = useRef<HTMLDivElement>(null);
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [foco, setFoco] = useState<string | null>(null);

  // Los trazados pesan 40 KB: se bajan cuando el mapa se acerca, no en la carga.
  // El mismo observer apaga los pulsos en bucle cuando el mapa sale de pantalla.
  useEffect(() => {
    const el = caja.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) import("./provincias").then((m) => setProvincias(m.PROVINCIAS));
        if (e.isIntersecting) el.dataset.cerca = "1";
        else delete el.dataset.cerca;
      },
      { rootMargin: "700px 0px" },
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);

  const activa = useMemo(() => provincias.find((x) => x.code === foco), [provincias, foco]);
  const destinos = useMemo(() => provincias.filter((x) => CON_CASO.includes(x.code)), [provincias]);

  const cambiar = (codigo: string | null) => {
    setFoco(codigo);
    alCambiar(codigo);
  };

  const hayFoco = foco !== null || resaltadas.length > 0;
  const detalle = foco ? (p.detalles as Record<string, string>)[foco] : undefined;

  return (
    <div ref={caja} className="lp-mapa-lienzo" onPointerLeave={() => cambiar(null)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/landing/argentina.svg" alt="" loading="lazy" decoding="async" />
      {provincias.length > 0 && (
        <svg viewBox={`0 0 ${MAPA.w} ${MAPA.h}`} role="img" aria-label={p.mapaAria} data-foco={hayFoco || undefined}>
          <g>
            {provincias.map((x) => (
              <path
                key={x.code}
                d={x.path}
                className="lp-prov"
                data-caso={CON_CASO.includes(x.code) || x.code === CODIGO_SEDE || undefined}
                data-activa={x.code === foco || resaltadas.includes(x.code) || undefined}
                style={{ "--ola": x.ola } as CSSProperties}
                onPointerEnter={() => cambiar(x.code)}
                onClick={() => cambiar(x.code)}
              />
            ))}
          </g>
          {/* Las islas son chicas: el blanco del mouse es toda la zona. */}
          <rect
            x={335}
            y={1000}
            width={112}
            height={72}
            fill="transparent"
            onPointerEnter={() => cambiar("malvinas")}
            onClick={() => cambiar("malvinas")}
          />
          <g className="lp-contorno">
            {provincias.map((x) => (
              <path key={x.code} d={x.path} pathLength={1} style={{ "--ola": x.ola } as CSSProperties} />
            ))}
          </g>
          {/* La provincia activa se repite arriba: si no, sus vecinas la tapan. */}
          {activa && <path key={activa.code} d={activa.path} className="lp-prov-alza" />}

          {destinos.map((d, i) => (
            <g key={d.code} style={{ "--i": i } as CSSProperties} className="lp-ruta">
              <path d={arco(d.cx, d.cy)} pathLength={1} className="lp-arco" />
              <path d={arco(d.cx, d.cy)} pathLength={1} className="lp-senal" />
              <circle cx={d.cx} cy={d.cy} r={9} className="lp-punto" />
            </g>
          ))}
          <circle cx={SEDE.x} cy={SEDE.y} r={13} className="lp-sede-pulso" />
          <circle cx={SEDE.x} cy={SEDE.y} r={13} className="lp-sede-pulso lp-sede-pulso-2" />
          {/* CABA es chica para el mouse: el punto de la sede hace de blanco. */}
          <circle
            cx={SEDE.x}
            cy={SEDE.y}
            r={13}
            className="lp-sede"
            onPointerEnter={() => cambiar(CODIGO_SEDE)}
            onClick={() => cambiar(CODIGO_SEDE)}
          />
          <text x={392} y={1086} textAnchor="middle" className="lp-mapa-malvinas">Islas Malvinas</text>
        </svg>
      )}

      {activa && (
        <div
          className="lp-mapa-globo"
          data-lado={activa.cx > 300 ? "izq" : "der"}
          style={{ left: `${(activa.cx / MAPA.w) * 100}%`, top: `${(activa.cy / MAPA.h) * 100}%` }}
        >
          <strong>{activa.name}</strong>
          {detalle && <span>{detalle}</span>}
        </div>
      )}
    </div>
  );
}
