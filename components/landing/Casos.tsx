"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, Landmark, Mountain, Package, type LucideIcon } from "lucide-react";
import { HOME_CASES } from "@/components/homeCases";
import { track } from "@/lib/track";
import { useT } from "@/lib/i18n/useT";
import { Entra, Palabras } from "./Entra";
import { Cta } from "./Cta";

const ICONOS: Record<string, LucideIcon> = { "Logística": Package, "Minería": Mountain, "Banca": Landmark };
const LINKEDIN = "https://www.linkedin.com/company/accedra-s.a.";

export default function Casos() {
  const t = useT();
  const [abierto, setAbierto] = useState(0);
  const pre = t.whyUs.titlePre.split(/\s+/).length;

  return (
    <section id="nosotros" className="lp-seccion lp-contenedor">
      <div className="lp-cabeza">
        <div>
          <Entra as="span" tipo="funde" className="lp-rotulo">{t.landing.casos.eyebrow}</Entra>
          <Entra as="h2" tipo="titulo" className="lp-h2">
            <Palabras texto={t.whyUs.titlePre} />
            <Palabras texto={t.whyUs.titleHighlight} desde={pre} className="lp-acento" />
          </Entra>
        </div>
        <Entra demora={200}>
          <p className="lp-sub">{t.whyUs.followText}</p>
          <Cta tono="azul" href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="mt-5">
            {t.whyUs.followButton}
          </Cta>
        </Entra>
      </div>

      <Entra tipo="foto" className="lp-casos" onMouseLeave={() => setAbierto(0)}>
        {HOME_CASES.map((c, i) => {
          const Icono = ICONOS[c.tag] ?? Building2;
          const dato = c.stats[0];
          return (
            <Link
              key={c.title}
              href={`/casos/home/${i}`}
              aria-label={`${t.landing.casos.ver}: ${c.title}`}
              data-abierto={i === abierto}
              onMouseEnter={() => setAbierto(i)}
              onFocus={() => setAbierto(i)}
              onClick={() => track({ type: "click", name: "caso_card", target: `home/${i}` })}
              className="lp-caso"
            >
              <Image src={c.image} alt="" fill sizes="(max-width: 1024px) 85vw, 800px" className="lp-caso-foto" draggable={false} />
              <div className="lp-caso-sombra" />
              <span className="lp-caso-etiqueta">
                <Icono size={13} aria-hidden />
                {c.tag}
              </span>
              <div className="lp-caso-texto">
                <div className="lp-caso-dato">{dato.value}</div>
                <div className="lp-caso-rotulo">{dato.label}</div>
                <h3 className="lp-caso-titulo">{c.title}</h3>
                <div className="lp-caso-mas">
                  <div>
                    <span className="lp-pastilla-caso">
                      {t.landing.casos.ver}
                      <ArrowRight size={15} aria-hidden />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </Entra>
    </section>
  );
}
