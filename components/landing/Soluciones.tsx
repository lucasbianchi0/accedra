"use client";

import Link from "next/link";
import { track } from "@/lib/track";
import { useT } from "@/lib/i18n/useT";
import { Entra, Palabras } from "./Entra";
import { FlechaCirculo } from "./Cta";
import Ilustracion from "./Ilustraciones";

// Mismo orden que t.services.columns.
const SOLUCIONES = [
  { slug: "networking" },
  { slug: "firma-biometrica", destacada: true },
  { slug: "consultoria" },
  { slug: "seguridad" },
  { slug: "software-ai" },
];

export default function Soluciones() {
  const t = useT();

  return (
    <section id="servicios" className="lp-seccion lp-contenedor">
      <div className="lp-cabeza">
        <div>
          <Entra as="span" tipo="funde" className="lp-rotulo">{t.landing.soluciones.eyebrow}</Entra>
          <Entra as="h2" tipo="titulo" className="lp-h2">
            <Palabras texto={t.services.title} />
          </Entra>
        </div>
        <Entra as="p" demora={200} className="lp-sub">{t.services.subtitle}</Entra>
      </div>

      <div className="lp-soluciones">
        {SOLUCIONES.map((s, i) => {
          const c = t.services.columns[i];
          return (
            <Entra key={s.slug} demora={(i % 3) * 90} className="lp-tarjeta-celda">
              <Link
                href={`/soluciones/${s.slug}`}
                aria-label={`${t.services.viewSolution}: ${c.title}`}
                onClick={() => track({ type: "click", name: "solucion_card", target: s.slug })}
                className="lp-tarjeta"
              >
                <div className="lp-tarjeta-tope">
                  <span className="lp-numero">{String(i + 1).padStart(2, "0")}</span>
                  {s.destacada && <span className="lp-insignia">{t.services.featuredBadge}</span>}
                </div>
                <div className="lp-tarjeta-arte">
                  <Ilustracion slug={s.slug} />
                </div>
                <div className="lp-tarjeta-pie">
                  <div>
                    <h3 className="lp-h3">{c.title}</h3>
                    <p>{c.desc}</p>
                  </div>
                  <FlechaCirculo />
                </div>
              </Link>
            </Entra>
          );
        })}
      </div>
    </section>
  );
}
