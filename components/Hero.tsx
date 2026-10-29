"use client";

import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { useT } from "@/lib/i18n/useT";
import HeroMedia from "@/components/HeroMedia";
import { enter } from "@/components/Reveal";
import HeroAsistente from "@/components/chat/HeroAsistente";
import StatsPanel from "@/components/StatsPanel";

const stats = ["17+", "400+", "26+", "100+"];

/* Cascada de entrada del hero — mismos valores que tenía con framer-motion. */
const ENTER = {
  // El <h1> arranca en 0s, sin demora. Es el elemento LCP: Chrome no lo cuenta
  // como candidato mientras esté en `opacity: 0`, así que el `animation-delay`
  // se suma tal cual a la métrica. Medido: la animación completa (1,3s) cuesta
  // 0,2s de LCP, no 1,3s — Chrome sella la métrica al primer frame con opacidad
  // > 0, no al final del fade. Por eso la animación se conserva y sólo se quitó
  // la demora inicial, que era gratis.
  // `--enter-from` lo deja en 0.01 y no en 0: ver el keyframe en globals.css.
  title: { ...enter("40px", "1.3s", "0s", "12px"), "--enter-from": "0.01" } as CSSProperties,
  subtitle: enter("16px", "1.1s", "0.42s"),
  ctas: enter("16px", "1.1s", "0.66s"),
  chat: enter("24px", "1.2s", "0.75s"),
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
        {/* Arriba, dos columnas desde `lg`: el título a la izquierda y los
            números a la derecha. Abajo, a todo el ancho, el asistente: "contanos
            tu caso" es la entrada principal de la portada.
            En el teléfono el orden es título → asistente → números (con
            `order`), así el campo queda a la vista sin scrollear. */}
        <div className="flex flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(360px,420px)] lg:items-center lg:gap-x-14 xl:gap-x-20">
          <div className="max-w-3xl">
            {/* Headline — animado por CSS (.hero-enter), no por framer: es el
                elemento LCP y con framer no se pintaba hasta después de hidratar.
                Los valores son los mismos que tenía la versión con motion. */}
            <h1
              className="hero-enter text-[40px] md:text-[54px] lg:text-[64px] font-bold text-white leading-[1.05] tracking-[-0.02em] mb-6"
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

          <StatsPanel
            className="hero-enter order-3 mt-12 lg:order-none lg:mt-0"
            style={ENTER.stats}
            stats={stats.map((value, i) => ({ value, label: t.hero.stats[i] }))}
          />

          <div className="hero-enter order-2 mt-14 lg:order-none lg:col-span-2 lg:mt-20" style={ENTER.chat}>
            <HeroAsistente />
          </div>
        </div>
      </div>
    </section>
  );
}
