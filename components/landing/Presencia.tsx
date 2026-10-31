"use client";

import type { CSSProperties } from "react";
import { CalendarDays, Rocket, Handshake, Building2 } from "lucide-react";
import CountUp from "@/components/CountUp";
import { useT } from "@/lib/i18n/useT";
import { Entra, Palabras } from "./Entra";
import { MAPA, PROVINCIAS } from "./provincias";

const CIFRAS = [
  { valor: "17", icono: CalendarDays },
  { valor: "400", icono: Rocket },
  { valor: "26", icono: Handshake },
  { valor: "100", icono: Building2 },
];

// Coordenadas sobre el mapa de argProvinces (viewBox 560×1196).
const SEDE = { x: 418.8, y: 402.9 };
const DESTINOS = [
  { x: 352, y: 500 }, // Buenos Aires
  { x: 190, y: 181 }, // Catamarca
  { x: 224, y: 65 }, // Jujuy
  { x: 138, y: 280 }, // San Juan
  { x: 121, y: 928 }, // Santa Cruz
];

function arco(x: number, y: number) {
  const lejos = Math.abs(y - SEDE.y) > 200;
  const cx = (SEDE.x + x) / 2 + (lejos ? (y < SEDE.y ? 70 : 150) : 20);
  const cy = (SEDE.y + y) / 2;
  return `M${SEDE.x} ${SEDE.y} Q${cx} ${cy} ${x} ${y}`;
}

export default function Presencia() {
  const t = useT();
  const p = t.landing.presencia;
  const palabras1 = p.titulo1.split(/\s+/).length;

  return (
    <section className="lp-seccion lp-contenedor lp-presencia">
      <div className="lp-presencia-texto">
        <Entra as="span" tipo="funde" className="lp-rotulo">{p.eyebrow}</Entra>
        <Entra as="h2" tipo="titulo" className="lp-h2">
          <Palabras texto={p.titulo1} className="block" />
          <Palabras texto={p.titulo2} desde={palabras1} className="block" />
        </Entra>
        <Entra as="p" demora={200} className="lp-sub">{p.sub}</Entra>

        <div className="lp-cifras">
          {CIFRAS.map(({ valor, icono: Icono }, i) => (
            <Entra key={valor} demora={i * 90} className="lp-cifra">
              <div className="lp-cifra-cabeza">
                <span>{t.hero.stats[i]}</span>
                <Icono size={17} strokeWidth={1.6} aria-hidden />
              </div>
              <div className="lp-cifra-valor">
                <CountUp value={valor} />
                <sup>+</sup>
              </div>
            </Entra>
          ))}
        </div>
      </div>

      <div className="lp-mapa-col">
        <Entra tipo="funde" className="lp-mapa" style={{ aspectRatio: `${MAPA.w} / ${MAPA.h}` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/landing/argentina.svg" alt="" loading="lazy" decoding="async" />
          <svg viewBox={`0 0 ${MAPA.w} ${MAPA.h}`} role="img" aria-label={p.titulo2}>
            {PROVINCIAS.map((prov, i) => (
              <path key={prov.code} d={prov.path} className="lp-prov" style={{ "--i": i } as CSSProperties} />
            ))}
            {DESTINOS.map((d, i) => (
              <g key={i} style={{ "--i": i } as CSSProperties}>
                <path d={arco(d.x, d.y)} pathLength={1} className="lp-arco" />
                <circle cx={d.x} cy={d.y} r={9} className="lp-punto" />
              </g>
            ))}
            <circle cx={SEDE.x} cy={SEDE.y} r={13} className="lp-sede-pulso" />
            <circle cx={SEDE.x} cy={SEDE.y} r={13} className="lp-sede" />
          </svg>
        </Entra>

        <Entra demora={260} className="lp-mapa-lista">
          <p className="lp-mapa-lista-titulo">{p.listaTitulo}</p>
          <ul>
            <li className="lp-mapa-sede">
              <strong>{p.sedeLugar}</strong>
              <span>{p.casaCentral}</span>
            </li>
            {p.despliegues.map((d) => (
              <li key={d.lugar}>
                <strong>{d.lugar}</strong>
                <span>{d.detalle}</span>
              </li>
            ))}
          </ul>
        </Entra>
      </div>
    </section>
  );
}
