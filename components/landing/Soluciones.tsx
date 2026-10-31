"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { LayoutDashboard, Network, ShieldCheck, Sparkles, SquarePen } from "lucide-react";
import { track } from "@/lib/track";
import { useT } from "@/lib/i18n/useT";
import { Entra, Palabras } from "./Entra";
import { FlechaCirculo } from "./Cta";
import Ilustracion from "./Ilustraciones";

// Mismo orden que t.services.columns.
// `c` es el color de identidad de cada solución (el mismo de Services.tsx);
// `texto` es su versión oscura, la que llega a AA sobre blanco.
const SOLUCIONES = [
  { slug: "networking", icono: Network, c: "#3B82F6", texto: "#1D5FD1" },
  { slug: "firma-biometrica", icono: SquarePen, c: "#7C6CF6", texto: "#5B48DB", destacada: true },
  { slug: "consultoria", icono: LayoutDashboard, c: "#06B6D4", texto: "#0B7285" },
  { slug: "seguridad", icono: ShieldCheck, c: "#10B981", texto: "#047857" },
  { slug: "software-ai", icono: Sparkles, c: "#B45CF2", texto: "#8B2FD0" },
];

export default function Soluciones() {
  const t = useT();

  return (
    <section id="servicios" className="lp-seccion lp-contenedor lp-soluciones-seccion">
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
          const Icono = s.icono;
          return (
            <Entra key={s.slug} demora={(i % 3) * 90} className="lp-tarjeta-celda">
              <Link
                href={`/soluciones/${s.slug}`}
                aria-label={`${t.services.viewSolution}: ${c.title}`}
                onClick={() => track({ type: "click", name: "solucion_card", target: s.slug })}
                className="lp-tarjeta"
                style={{ "--c": s.c, "--c-texto": s.texto } as CSSProperties}
              >
                <div className="lp-tarjeta-tope">
                  <span className="lp-numero">{String(i + 1).padStart(2, "0")}</span>
                  <div className="lp-tarjeta-marca">
                    <span className="lp-azulejo" aria-hidden>
                      <Icono size={24} strokeWidth={1.7} />
                    </span>
                    {s.destacada && <span className="lp-insignia">{t.services.featuredBadge}</span>}
                  </div>
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
