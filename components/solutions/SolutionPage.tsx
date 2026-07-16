"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SOLUTIONS } from "./solutionsData";
import { INDUSTRIES } from "./industriesData";
import { TECH_LOGOS } from "./techLogos";
import Navbar from "@/components/Navbar";
import Contact from "@/components/Contact";
import MobileCTA from "@/components/MobileCTA";
import CountUp from "@/components/CountUp";
import CapabilitiesBento from "./CapabilitiesBento";
import ProcessSection from "./ProcessSection";
import CasesSection from "./CasesSection";
import { useLang } from "@/lib/i18n/LangProvider";
import { useT } from "@/lib/i18n/useT";
import { es } from "@/lib/i18n/dictionaries/es";
import { getLocalizedSolution } from "@/lib/i18n/solutions";

const BLUE = "#2B6FD4";
const BLUE_RGB = "43,111,212";

// Stats de credibilidad (a nivel empresa, iguales en todas las soluciones).
const STATS = [
  { value: "17+", label: "Años de experiencia" },
  { value: "400+", label: "Proyectos entregados" },
  { value: "26+", label: "Partners tecnológicos" },
  { value: "100+", label: "Clientes activos" },
];

export default function SolutionPage({ slug, industria }: { slug: string; industria?: string }) {
  const { lang } = useLang();
  const t = useT();
  const raw = SOLUTIONS[slug];
  const Icon = raw.icon;

  // Contenido efectivo: si hay industria con override, lo usa; si no, cae al base.
  // Las páginas de industria NO se traducen: quedan siempre en español.
  const industry = industria ? INDUSTRIES[industria] : null;
  const data = industry ? raw : getLocalizedSolution(raw, lang);
  const st = industry ? es.solution : t.solution;
  const override = industry ? raw.industryContent?.[industry.slug] : undefined;
  const subtitle = override?.subtitle ?? data.subtitle;
  const heroImage = industry?.heroImage ?? data.heroImage;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // En mobile no cargamos el video (ahorra datos y mejora LCP): solo el poster.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = 0.75;
    // Try to autoplay. In Low Power Mode / when autoplay is blocked this rejects
    // silently and the static poster stays visible (no black frame, no play button).
    const p = v.play();
    if (p !== undefined) p.catch(() => {});
  }, [slug, isMobile]);

  return (
    <main className="bg-[#07101D] min-h-screen">
      {/* Navbar principal (igual que el home) */}
      <Navbar />

      {/* ── Hero (full-bleed video cover, like the home) ── */}
      <section className="relative flex flex-col justify-center overflow-hidden min-h-[600px] lg:min-h-[80vh] pt-20 pb-20 lg:pt-24 lg:pb-28">
        {/* Video background with a static poster fallback that always renders */}
        <div className="absolute inset-0 z-0 bg-[#0D1A2D]">
          {/* Static fallback — always visible; covers Low Power Mode / blocked autoplay */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage}
            alt=""
            aria-hidden="true"
            className="hero-zoom absolute inset-0 w-full h-full object-cover"
          />
          {/* Video solo en la página base y en desktop; industria/mobile usan poster */}
          {!industry && !isMobile && (
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={data.heroImage}
              onPlaying={() => setVideoPlaying(true)}
              className={`hero-zoom absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                videoPlaying ? "opacity-100" : "opacity-0"
              }`}
            >
              <source src={data.heroVideo} type="video/mp4" />
            </video>
          )}
          {/* Gradient overlays for legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#07101D]/95 via-[#07101D]/80 to-[#07101D]/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07101D] via-transparent to-[#07101D]/40" />
        </div>

        {/* Blue glow orbs */}
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl z-1 pointer-events-none animate-float" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blue-500/8 rounded-full blur-3xl z-1 pointer-events-none animate-float-slow" />

        <div className="relative z-10 max-w-[1280px] w-full mx-auto px-5 sm:px-8 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="max-w-2xl">
            {industry && (
              <div className="inline-flex items-center gap-2 mb-5 px-3.5 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-100"
                style={{ background: `rgba(${BLUE_RGB},0.18)`, border: `1px solid rgba(${BLUE_RGB},0.4)` }}>
                Solución {industry.forLabel}
              </div>
            )}
            {!industry && (
              <div className="inline-flex items-center gap-2.5 mb-6">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: `rgba(${BLUE_RGB},0.14)`, border: `1px solid rgba(${BLUE_RGB},0.3)` }}>
                  <Icon size={20} style={{ color: "#3B8EF0" }} />
                </div>
                <span className="text-xs font-semibold tracking-[0.22em] uppercase text-blue-400">{data.eyebrow}</span>
              </div>
            )}
            <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-white leading-[1.05] mb-6">
              {data.title}{" "}
              <span className="gradient-text">{data.highlight}</span>
            </h1>
            {industry && (
              <p className="text-2xl md:text-3xl lg:text-[34px] font-bold leading-tight -mt-2 mb-7">
                <span className="text-white/55">para </span>
                <span className="gradient-text">{industry.name}</span>
              </p>
            )}
            <p className="text-gray-300 text-lg leading-relaxed max-w-xl mb-9">{subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#contacto"
                className="relative overflow-hidden shine inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full text-[15px] font-semibold text-white transition-all duration-200 hover:gap-3 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30"
                style={{ background: BLUE, boxShadow: `0 8px 28px rgba(${BLUE_RGB},0.35)` }}>
                {st.ctaPrimary} <ArrowRight size={17} />
              </Link>
              <a href="#capacidades"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full text-[15px] font-semibold text-white border border-white/15 hover:bg-white/5 hover:gap-3 transition-all">
                {st.ctaSeeSolution}
              </a>
            </div>
          </motion.div>

          {/* Stats — barra centrada dentro de la portada */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-14 lg:mt-16 mx-auto max-w-3xl grid grid-cols-2 sm:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-white/10"
            style={{ background: "rgba(255,255,255,0.1)" }}>
            {STATS.map((s, i) => (
              <div key={i}
                className="px-4 py-5 flex flex-col items-center text-center"
                style={{ background: "rgba(13,26,45,0.55)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}>
                <CountUp value={s.value} className="text-2xl md:text-[28px] font-bold text-white leading-none" />
                <span className="text-[11px] text-gray-400 font-medium mt-1.5 leading-tight">{s.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Marcas con las que trabajamos — debajo de las stats */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.55 }}
            className="mt-10 lg:mt-12 max-w-3xl mx-auto">
            <p className="text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500 mb-5">
              {data.brandsLabel ?? "Partner certificado de"}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-9 sm:gap-x-12 gap-y-5">
              {data.brands.map((key) => {
                const b = TECH_LOGOS[key];
                if (!b) return null;
                // Isotipos de color (Power BI, Azure, SharePoint, Power Automate):
                // el logo a color sobre un chip claro + el nombre, para que se
                // reconozcan (blanquearlos los volvía manchas grises ilegibles).
                if (b.color) {
                  return (
                    <div key={key} className="flex items-center gap-2.5 opacity-85 hover:opacity-100 transition-opacity duration-200">
                      {b.logo && (
                        <span className="inline-flex items-center justify-center rounded-lg bg-white p-1.5 shadow-[0_4px_14px_rgba(0,0,0,0.25)]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={b.logo} alt="" aria-hidden="true" className="h-5 w-5 object-contain" />
                        </span>
                      )}
                      <span className="text-white text-[15px] sm:text-base font-medium whitespace-nowrap">{b.name}</span>
                    </div>
                  );
                }
                // Isotipos monocromos con nombre al lado.
                if (b.showName) {
                  return (
                    <div key={key} className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity duration-200">
                      {b.logo && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={b.logo} alt="" aria-hidden="true"
                          className="h-6 sm:h-7 w-auto max-w-[120px] object-contain"
                          style={{ filter: "brightness(0) invert(1)" }} />
                      )}
                      <span className="text-white text-[15px] sm:text-base font-medium whitespace-nowrap">{b.name}</span>
                    </div>
                  );
                }
                return (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={key} src={b.logo} alt={b.name} title={b.name}
                    className="h-7 sm:h-9 w-auto max-w-[140px] object-contain opacity-60 hover:opacity-95 transition-opacity duration-200"
                    style={{ filter: "brightness(0) invert(1)" }} />
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Capabilities (bento con ilustraciones) ── */}
      <CapabilitiesBento slug={slug} eyebrow={st.capsEyebrow} title={st.capsTitle} items={data.capabilities} />

      {/* ── Cómo trabajamos (bento) ── */}
      <ProcessSection />

      {/* ── Casos de éxito (solo páginas de solución) ── */}
      {!industry && <CasesSection cases={data.cases} slug={slug} />}


      {/* ── Form de contacto (igual que el home) ── */}
      <Contact />
      {!industry && <MobileCTA />}
    </main>
  );
}
