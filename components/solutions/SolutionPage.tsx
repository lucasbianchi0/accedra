"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SOLUTIONS } from "./solutionsData";
import { INDUSTRIES } from "./industriesData";
import { TECH_LOGOS } from "./techLogos";
import Navbar from "@/components/Navbar";
import Contact from "@/components/Contact";
import CountUp from "@/components/CountUp";
import CapabilitiesBento from "./CapabilitiesBento";
import ProcessCardsRow from "./ProcessCardsRow";
import CasesSection from "./CasesSection";
import { useLang } from "@/lib/i18n/LangProvider";
import { useT } from "@/lib/i18n/useT";
import { es } from "@/lib/i18n/dictionaries/es";
import { getLocalizedSolution } from "@/lib/i18n/solutions";
import AmbientLight from "@/components/AmbientLight";
import JsonLd from "@/components/seo/JsonLd";
import { serviceLd, breadcrumbLd } from "@/lib/seo/jsonLd";
import { EASE } from "@/components/Reveal";


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

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = 0.75;
    // Try to autoplay. In Low Power Mode / when autoplay is blocked this rejects
    // silently and the static poster stays visible (no black frame, no play button).
    const p = v.play();
    if (p !== undefined) p.catch(() => {});
  }, [slug]);

  // El video se muestra en la página base (también en mobile: ahora es local y
  // liviano). Las páginas de industria siguen con poster. Donde hay video, el
  // poster y la imagen de respaldo son el PRIMER FRAME del propio video
  // (/videos/{id}.jpg) para que no haya salto de contenido al arrancar.
  const showVideo = !industry;
  const heroVideoPoster = data.heroVideo.replace(/\.mp4$/, ".jpg");
  const staticHeroSrc = showVideo ? heroVideoPoster : heroImage;

  // Highlight del título en el color de la solución (reemplaza .gradient-text,
  // que es azul global). Blanco → acento para que el degradado se lea premium.
  const accentHighlight: CSSProperties = {
    background: `linear-gradient(100deg, #fff 8%, ${data.accent} 118%)`,
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
  };

  return (
    <main className="relative bg-navy-800 min-h-screen" style={{ "--accent-rgb": data.accentRgb } as CSSProperties}>
      {/* Structured data: sólo en la página base de la solución (las de industria
          son noindex → no aportan al índice y ensuciarían el grafo). */}
      {!industry && (() => {
        const svc = serviceLd(slug);
        const crumbs = breadcrumbLd([
          { name: "Inicio", path: "/" },
          { name: data.name, path: `/soluciones/${slug}` },
        ]);
        return <JsonLd data={svc ? [svc, crumbs] : [crumbs]} />;
      })()}
      {/* Misma capa de luz que el home: sin ella el canvas queda plano.
          Va antes del Navbar para quedar por debajo de todo el contenido. */}
      <AmbientLight variant="solution" />
      {/* Navbar principal (igual que el home) */}
      <Navbar />

      {/* ── Hero (full-bleed video cover, like the home) ── */}
      <section className="relative flex flex-col justify-center overflow-hidden min-h-[600px] lg:min-h-[80vh] pt-20 pb-20 lg:pt-24 lg:pb-28">
        {/* Video background with a static poster fallback that always renders */}
        <div className="absolute inset-0 z-0 bg-[#0D1A2D]">
          {/* Static fallback — always visible; covers Low Power Mode / blocked autoplay */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={staticHeroSrc}
            alt=""
            aria-hidden="true"
            className="hero-zoom absolute inset-0 w-full h-full object-cover"
          />
          {/* Video solo en la página base y en desktop; industria/mobile usan poster */}
          {showVideo && (
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster={heroVideoPoster}
              onPlaying={() => setVideoPlaying(true)}
              className={`hero-zoom absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                videoPlaying ? "opacity-100" : "opacity-0"
              }`}
            >
              <source src={data.heroVideo} type="video/mp4" />
            </video>
          )}
          {/* Gradient overlays for legibility.
              El borde INFERIOR del hero se funde con el canvas (navy-800 #0a1424),
              no con navy-900: así el hero melta en el fondo de la página en vez de
              cerrar un tono más oscuro y dibujar una costura contra Capacidades. */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#07101D]/95 via-[#07101D]/80 to-[#07101D]/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1424] via-transparent to-[#07101D]/40" />
        </div>

        {/* Glow orbs — color de identidad de la solución */}
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl z-1 pointer-events-none animate-float"
          style={{ background: "rgba(var(--accent-rgb,43,111,212),0.12)" }} />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full blur-3xl z-1 pointer-events-none animate-float-slow"
          style={{ background: "rgba(var(--accent-rgb,43,111,212),0.09)" }} />

        <div className="relative z-10 max-w-[1320px] w-full mx-auto px-5 sm:px-8 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 34, filter: "blur(12px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 1.2, ease: EASE }}
            className="max-w-2xl">
            {industry && (
              <div className="inline-flex items-center gap-2 mb-5 px-3.5 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.14em] text-white/90"
                style={{ background: `rgba(var(--accent-rgb,43,111,212),0.18)`, border: `1px solid rgba(var(--accent-rgb,43,111,212),0.4)` }}>
                Solución {industry.forLabel}
              </div>
            )}
            <h1 className="text-[40px] md:text-[54px] lg:text-[64px] font-bold text-white leading-[1.05] mb-6">
              {data.title}{" "}
              <span style={accentHighlight}>{data.highlight}</span>
            </h1>
            {industry && (
              <p className="text-2xl md:text-3xl lg:text-[34px] font-bold leading-tight -mt-2 mb-7">
                <span className="text-white/55">para </span>
                <span style={accentHighlight}>{industry.name}</span>
              </p>
            )}
            <p className="text-gray-300 text-lg leading-relaxed max-w-xl mb-9">{subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#contacto"
                className="relative overflow-hidden shine inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full text-[15px] font-semibold text-white transition-all duration-200 hover:gap-3 hover:-translate-y-0.5"
                style={{ background: data.accent, boxShadow: `0 8px 28px rgba(var(--accent-rgb,43,111,212),0.4)` }}>
                {st.ctaPrimary} <ArrowRight size={17} />
              </Link>
              <a href="#capacidades"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full text-[15px] font-semibold text-white border border-white/15 hover:bg-white/5 hover:gap-3 transition-all">
                {st.ctaSeeSolution}
              </a>
            </div>
          </motion.div>

          {/* Stats — panel de vidrio (glassmorphism) dentro de la portada.
              SIN backdrop-filter a propósito: el blur real es incompatible con un
              fade-in (haría saltar el color). El look vidriado se logra con capa
              translúcida + sheen + brillo interior, y así TODA la barra aparece junta
              (fade + slide) con los números contando, sin ningún cambio de color. */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.55, ease: EASE }}
            className="relative mt-14 lg:mt-16 mx-auto max-w-3xl grid grid-cols-2 sm:grid-cols-4 gap-px rounded-[20px] overflow-hidden border"
            style={{
              borderColor: "rgba(255,255,255,0.18)",
              background: "rgba(255,255,255,0.14)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), 0 24px 60px rgba(0,0,0,0.42)",
            }}>
            {/* sheen superior */}
            <div className="absolute inset-x-0 top-0 h-px z-10 pointer-events-none"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)" }} />
            {STATS.map((s, i) => (
              <div key={i}
                className="group/stat px-4 py-6 flex flex-col items-center text-center transition-colors duration-300 hover:bg-white/[0.04]"
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 100%), rgba(14,26,46,0.42)",
                }}>
                <CountUp value={s.value} className="font-display text-2xl md:text-[30px] font-bold text-white leading-none tracking-tight" />
                <span className="text-[11px] text-gray-400 font-medium mt-2 leading-tight">{s.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Marcas con las que trabajamos — debajo de las stats */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.0, delay: 0.8, ease: EASE }}
            className="mt-10 lg:mt-12 max-w-3xl mx-auto">
            <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-400 mb-5">
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

      {/* ── Capabilities ── */}
      <CapabilitiesBento slug={slug} eyebrow={st.capsEyebrow} title={st.capsTitle} items={data.capabilities} consultable={!industry} />

      {/* ── Cómo trabajamos (pasos por solución) ── */}
      <ProcessCardsRow slug={slug} />

      {/* ── Casos de éxito (solo páginas de solución) ── */}
      {!industry && data.cases.length > 0 && <CasesSection cases={data.cases} slug={slug} />}


      {/* ── Form de contacto (igual que el home) ── */}
      <Contact />
    </main>
  );
}
