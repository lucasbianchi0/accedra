"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useT } from "@/lib/i18n/useT";
import CountUp from "@/components/CountUp";
import Image from "next/image";
import { enter } from "@/components/Reveal";

const stats = ["17+", "400+", "26+", "100+"];

/* Cascada de entrada del hero — mismos valores que tenía con framer-motion. */
const ENTER = {
  title: enter("40px", "1.3s", "0.15s", "12px"),
  subtitle: enter("16px", "1.1s", "0.42s"),
  ctas: enter("16px", "1.1s", "0.66s"),
  stats: enter("30px", "1.2s", "0.9s"),
};

// Poster = PRIMER FRAME del propio video (local). Antes era una foto de Pexels
// distinta del video, y por eso se veía "otra cosa un segundo" y después el
// video. Al coincidir poster y primer frame, el video sólo cobra vida, sin salto.
const HERO_POSTER = "/videos/5028622.jpg";
const HERO_VIDEO = "/videos/5028622.mp4";

export default function Hero() {
  const t = useT();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);

  // El video ahora es local y liviano → se reproduce también en mobile.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = 0.75;
    const p = v.play();
    if (p !== undefined) p.catch(() => {});
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Video background (with a static image fallback that always renders) */}
      <div className="absolute inset-0 z-0 bg-[#0D1A2D]">
        {/* priority: es la imagen visible del hero mientras el video carga, o sea
            lo que se pinta primero. Sin priority Next la trata como lazy y llega
            tarde al LCP. */}
        <Image
          src={HERO_POSTER}
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="hero-zoom object-cover"
        />
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          // "metadata" en vez de "auto": con "auto" el navegador se llevaba el
          // ancho de banda bajando el video ANTES de terminar de pintar el texto
          // del hero, que es el elemento LCP. Como el poster es el primer frame
          // exacto del video, no hay salto visual; el video sólo entra un
          // instante después.
          preload="metadata"
          poster={HERO_POSTER}
          onPlaying={() => setVideoPlaying(true)}
          className={`hero-zoom absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            videoPlaying ? "opacity-100" : "opacity-0"
          }`}
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
        {/* Gradient overlay. El borde INFERIOR funde al canvas de la página
            (navy-800 #0a1424), no a navy-700: así el hero se derrite en el fondo
            único en vez de cerrar un tono más claro y marcar una costura contra
            la barra de clientes. */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D1A2D]/95 via-[#0D1A2D]/80 to-[#0D1A2D]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1424] via-transparent to-[#0D1A2D]/30" />
      </div>

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
