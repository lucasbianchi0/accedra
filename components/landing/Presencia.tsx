"use client";

import { useState } from "react";
import { CalendarDays, Rocket, Handshake, Building2 } from "lucide-react";
import { useT } from "@/lib/i18n/useT";
import Cuenta from "./Cuenta";
import { Entra, Palabras } from "./Entra";
import MapaArgentina, { CODIGO_SEDE, TODAS } from "./MapaArgentina";

const CIFRAS = [
  { valor: 17, icono: CalendarDays },
  { valor: 400, icono: Rocket },
  { valor: 26, icono: Handshake },
  { valor: 100, icono: Building2 },
];

// Mismo orden que `despliegues`; la primera fila es la casa central.
const FILAS = [[CODIGO_SEDE], [TODAS], ["catamarca", "jujuy", "san-juan", "santa-cruz"], [TODAS]];

export default function Presencia() {
  const t = useT();
  const p = t.landing.presencia;
  const palabras1 = p.titulo1.split(/\s+/).length;
  const [fila, setFila] = useState<number | null>(null);
  const [provincia, setProvincia] = useState<string | null>(null);
  const filaDeProvincia = FILAS.findIndex((codigos) => provincia !== null && codigos.includes(provincia));

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
                <Cuenta valor={valor} />
                <sup>+</sup>
              </div>
            </Entra>
          ))}
        </div>
      </div>

      <div className="lp-mapa-col">
        <Entra tipo="funde" className="lp-mapa">
          <MapaArgentina resaltadas={fila === null ? [] : FILAS[fila]} alCambiar={setProvincia} />
        </Entra>

        <Entra demora={260} className="lp-mapa-lista">
          <p className="lp-mapa-lista-titulo">{p.listaTitulo}</p>
          <ul onPointerLeave={() => setFila(null)}>
            {[{ lugar: p.sedeLugar, detalle: p.casaCentral }, ...p.despliegues].map((d, i) => (
              <li
                key={d.lugar}
                data-activo={i === fila || i === filaDeProvincia || undefined}
                onPointerEnter={() => setFila(i)}
              >
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
