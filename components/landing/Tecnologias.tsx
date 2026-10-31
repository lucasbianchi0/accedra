"use client";

import { ShieldCheck } from "lucide-react";
import { partners } from "@/components/partnersData";
import { useT } from "@/lib/i18n/useT";
import { Entra, Palabras } from "./Entra";

export default function Tecnologias() {
  const t = useT();

  return (
    <section id="partners" className="lp-seccion lp-contenedor">
      <div className="lp-cabeza">
        <div>
          <Entra as="span" tipo="funde" className="lp-rotulo">{t.landing.tecnologias.eyebrow}</Entra>
          <Entra as="h2" tipo="titulo" className="lp-h2">
            <Palabras texto={t.partners.title} />
          </Entra>
        </div>
        <Entra as="p" demora={200} className="lp-sub lp-sello">
          <ShieldCheck size={19} strokeWidth={1.6} aria-hidden />
          {t.partners.pill}
        </Entra>
      </div>

      <div className="lp-logos">
        {partners.map((p, i) => (
          <Entra key={p.name} tipo="funde" demora={(i % 5) * 60} className="lp-logo" title={p.blurb}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.name === "Namirial" ? "/logos/namirial-logo.png" : p.logo}
              alt={p.name}
              loading="lazy"
              decoding="async"
            />
          </Entra>
        ))}
      </div>
    </section>
  );
}
