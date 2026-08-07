"use client";

import { ArrowRight } from "lucide-react";
import { useT } from "@/lib/i18n/useT";
import CountUp from "@/components/CountUp";
import HeroMedia from "@/components/HeroMedia";
import { enter } from "@/components/Reveal";

const stats = ["17+", "400+", "26+", "100+"];

/* Cascada de entrada del hero — mismos valores que tenía con framer-motion. */
const ENTER = {
  // El <h1> arranca en 0s, sin demora. Es el elemento LCP: Chrome no lo cuenta
  // como candidato mientras esté en `opacity: 0`, así que cualquier
  // `animation-delay` acá se suma tal cual a la métrica. 0,15s de retraso es
  // 0,15s peor de LCP a cambio de nada que se perciba — el resto de la cascada
  // conserva sus tiempos y el escalonado se sigue leyendo igual.
  title: enter("40px", "1.3s", "0s", "12px"),
  subtitle: enter("16px", "1.1s", "0.42s"),
  ctas: enter("16px", "1.1s", "0.66s"),
  stats: enter("30px", "1.2s", "0.9s"),
};

export default function Hero() {
  const t = useT();

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Poster + video de fondo. Toda la lógica de carga vive en HeroMedia:
          es lo que decide el LCP de la página y merece su propio archivo. */}
      <HeroMedia />

      {/* Blue glow orbs (decorativos — se ocultan en mobile por performance) */}
      <div className="hidden sm:block absolute top-1/3 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl z-1 pointer-events-none animate-float" />
      <div className="hidden sm:block absolute bottom-1/3 left-1/4 w-64 h-64 bg-blue-500/8 rounded-full blur-3xl z-1 pointer-events-none animate-float-slow" />

      {/* Content */}
      {/* `px-5` en mobile como el resto del sitio: con `px-8` quedaban 296px
          útiles en un iPhone de 360 y el h1 no entraba. */}
      <div className="relative z-10 container-x pt-28 pb-20">
        <div className="max-w-3xl">
          {/* Headline — animado por CSS (.hero-enter), no por framer: es el
              elemento LCP y con framer no se pintaba hasta después de hidratar.
              Los valores son los mismos que tenía la versión con motion. */}
          <h1
            className="text-[40px] md:text-[54px] lg:text-[64px] font-bold text-white leading-[1.05] tracking-[-0.02em] mb-6"
            style={ENTER.title}
          >
            {t.hero.titlePre}<br className="hidden sm:block" />{" "}
            <span className="gradient-text">{t.hero.titleHighlight}</span>
            <br className="hidden sm:block" />{" "}
            {t.hero.titlePost}
          </h1>

          {/* Subheadline */}
          <p
            className="hero-enter text-gray-300 text-lg leading-relaxed mb-10 max-w-xl"
            style={ENTER.subtitle}
          >
            {t.hero.subtitlePre}
            <span className="text-gray-200 font-medium">{t.hero.subtitleStrong}</span>.
          </p>

          {/* CTAs */}
          <div
            className="hero-enter flex flex-col sm:flex-row gap-4"
            style={ENTER.ctas}
          >
            <a
              href="#contacto"
              className="relative overflow-hidden shine inline-flex items-center justify-center gap-2 text-white font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:gap-3 group text-base"
              style={{ background: "#2560BC", boxShadow: "0 8px 28px rgba(43,111,212,0.35)" }}
            >
              {t.services.ctaButton}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#servicios"
              className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-white font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:bg-white/5 text-base"
            >
              {t.hero.ctaServices}
            </a>
          </div>
        </div>

        {/* Stats bar — panel de vidrio (glassmorphism).
            SIN backdrop-filter a propósito: el blur real es incompatible con un fade-in
            (haría saltar el color). El look vidriado se logra con capa translúcida +
            sheen + brillo interior, y así TODA la barra aparece junta (fade + slide) con
            los números contando, sin ningún cambio de color. */}
        <div
          className="hero-enter relative mt-16 lg:mt-20 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-px rounded-[20px] overflow-hidden border"
          style={{
            ...ENTER.stats,
            borderColor: "rgba(255,255,255,0.18)",
            background: "rgba(255,255,255,0.14)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), 0 24px 60px rgba(0,0,0,0.42)",
          }}
        >
          <div className="absolute inset-x-0 top-0 h-px z-10 pointer-events-none"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)" }} />
          {stats.map((s, i) => (
            <div
              key={i}
              className="px-4 py-6 md:px-8 md:py-7 flex flex-col items-center text-center transition-colors duration-300 hover:bg-white/[0.04]"
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 100%), rgba(14,26,46,0.42)",
              }}
            >
              <CountUp value={s} className="font-display text-3xl md:text-4xl font-bold text-white mb-1.5 tracking-tight" />
              <div className="text-xs text-gray-400 font-medium tracking-wide">{t.hero.stats[i]}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
