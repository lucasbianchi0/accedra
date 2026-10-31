"use client";

import HeroMedia, { SERVIDORES } from "@/components/HeroMedia";
import BotonAsistente from "@/components/chat/BotonAsistente";
import { useT } from "@/lib/i18n/useT";
import { Palabras } from "./Entra";
import { Cta } from "./Cta";

export default function Portada() {
  const t = useT();
  const pre = t.hero.titlePre.split(/\s+/).length;
  const medio = t.hero.titleHighlight.split(/\s+/).length;

  return (
    <section id="inicio" className="lp-portada">
      <span data-lp-tope aria-hidden />
      <div className="lp-marco">
        <div className="lp-marco-media">
          <HeroMedia capa="liviana" video={SERVIDORES.video} imagen={SERVIDORES.imagen} />
        </div>

        <div className="lp-portada-texto">
          {/* Sin observer: entra al cargar, por CSS, para no demorar el LCP. */}
          <h1 className="lp-h1">
            <Palabras texto={t.hero.titlePre} className="block" />
            <Palabras texto={t.hero.titleHighlight} desde={pre} className="block" />
            <Palabras texto={t.hero.titlePost} desde={pre + medio} className="block" />
          </h1>
          <p className="lp-portada-sub lp-carga" style={{ "--d": "420ms" } as React.CSSProperties}>
            {t.landing.portada.sub}
          </p>
          <div className="lp-portada-ctas lp-carga hero-capa" style={{ "--d": "560ms" } as React.CSSProperties}>
            <Cta href="#contacto">{t.services.ctaButton}</Cta>
            <BotonAsistente origen="portada" />
          </div>
        </div>

        <p className="lp-portada-prueba lp-carga" style={{ "--d": "760ms" } as React.CSSProperties}>
          <strong>{t.landing.portada.pruebaCifra}</strong>
          <span>{t.landing.portada.pruebaClientes}</span>
        </p>
      </div>
    </section>
  );
}
