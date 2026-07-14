"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, MessageCircle, HelpCircle } from "lucide-react";
import { SOLUTIONS } from "./solutionsData";
import { INDUSTRIES } from "./industriesData";
import { whatsappLink } from "@/lib/whatsapp";
import Navbar from "@/components/Navbar";
import { useLang } from "@/lib/i18n/LangProvider";
import { useT } from "@/lib/i18n/useT";
import { es } from "@/lib/i18n/dictionaries/es";
import { getLocalizedSolution } from "@/lib/i18n/solutions";

const BLUE = "#2B6FD4";
const BLUE_RGB = "43,111,212";

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
  const painsTitle = override?.painsTitle ?? data.painsTitle;
  const pains = override?.pains ?? data.pains;
  const waContext = industry ? `${data.name} ${industry.forLabel}` : data.name;
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
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Video solo en la página base; las de industria usan su portada propia */}
          {!industry && (
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster={data.heroImage}
              onPlaying={() => setVideoPlaying(true)}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
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
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl z-1 pointer-events-none" />

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
              <Link href="/#contacto"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full text-[15px] font-semibold text-white transition-all hover:gap-3"
                style={{ background: BLUE, boxShadow: `0 8px 28px rgba(${BLUE_RGB},0.35)` }}>
                {st.ctaPrimary} <ArrowRight size={17} />
              </Link>
              <a href={whatsappLink(waContext)} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full text-[15px] font-semibold text-white border border-white/15 hover:bg-white/5 transition-all">
                <MessageCircle size={17} className="text-blue-400" /> {st.whatsapp}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Intro ── */}
      <section className="relative py-16 lg:py-20 border-y border-white/[0.06] bg-[#0A1424]">
        <div className="max-w-[900px] mx-auto px-5 sm:px-8 lg:px-12 text-center">
          {industry && (
            <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }}
              className="text-blue-300 text-sm font-semibold mb-4">
              Pensado {industry.forLabel}, {industry.context}
            </motion.p>
          )}
          <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-white mb-6">
            {data.introTitle}
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.08 }}
            className="text-gray-400 text-lg leading-relaxed">
            {data.intro}
          </motion.p>
        </div>
      </section>

      {/* ── Problemas / dolores del cliente ── */}
      <section className="relative py-20 lg:py-24 overflow-hidden bg-[#080F1C]">
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(${BLUE_RGB},0.12) 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
            maskImage: "radial-gradient(ellipse 80% 70% at 50% 40%, #000 20%, transparent 85%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 40%, #000 20%, transparent 85%)",
          }} />
        <div className="relative z-10 max-w-[1000px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }}
              className="text-xs font-semibold tracking-[0.22em] uppercase text-blue-400 mb-3">
              {st.painsEyebrow}
            </motion.p>
            <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.06 }}
              className="text-3xl md:text-4xl font-bold text-white">
              {painsTitle}
            </motion.h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 lg:gap-5">
            {pains.map((pain, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: (i % 2) * 0.08 }}
                className="flex items-start gap-4 rounded-2xl p-5 sm:p-6 border"
                style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: `rgba(${BLUE_RGB},0.14)`, border: `1px solid rgba(${BLUE_RGB},0.28)` }}>
                  <HelpCircle size={18} style={{ color: "#3B8EF0" }} />
                </div>
                <p className="text-gray-200 text-[15px] leading-relaxed">{pain}</p>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
            <p className="text-gray-400 text-[15px]">{st.painsFooter}</p>
            <Link href="/#contacto"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white px-6 py-3 rounded-full transition-all hover:gap-3"
              style={{ background: BLUE, boxShadow: `0 8px 28px rgba(${BLUE_RGB},0.35)` }}>
              {st.painsCta} <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Capabilities ── */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-b from-[#07101D] to-[#0A1424]">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full pointer-events-none blur-3xl"
          style={{ background: `radial-gradient(circle, rgba(${BLUE_RGB},0.1) 0%, transparent 65%)` }} />
        <div className="relative z-10 max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-[0.22em] uppercase mb-3 text-blue-400">{st.capsEyebrow}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">{st.capsTitle}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.capabilities.map((c, i) => (
              <motion.div key={c.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
                className="group relative rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1.5"
                style={{
                  background: "rgba(255,255,255,0.035)",
                  backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
                  borderColor: "rgba(255,255,255,0.09)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07)",
                }}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-4 text-sm font-bold tabular-nums"
                  style={{ background: `rgba(${BLUE_RGB},0.14)`, border: `1px solid rgba(${BLUE_RGB},0.28)`, color: "#7FB3F8" }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="text-white font-bold text-[17px] mb-2">{c.title}</h3>
                <p className="text-gray-400 text-[14px] leading-relaxed">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech ── */}
      <section className="py-16 lg:py-20 bg-[#0A1424] border-y border-white/[0.06]">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 text-center">
          <p className="text-xs font-semibold tracking-[0.22em] uppercase mb-8 text-gray-500">{st.techLabel}</p>
          <div className="flex flex-wrap justify-center gap-3">
            {data.tech.map((t) => (
              <span key={t}
                className="px-5 py-2.5 rounded-full text-sm font-medium text-gray-300"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="py-20 lg:py-28 relative overflow-hidden bg-[#07101D]">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className="text-xs font-semibold tracking-[0.22em] uppercase mb-3 text-blue-400">{data.benefitsTitle}</p>
              <h2 className="text-3xl md:text-4xl lg:text-[44px] font-bold text-white leading-tight mb-6">
                {st.benefitsHeading}
              </h2>
              <p className="text-gray-400 text-[15px] leading-relaxed max-w-md">
                {st.benefitsBody}
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
              {data.benefits.map((b, i) => (
                <motion.div key={b}
                  initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className="flex items-start gap-3 py-2">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: `rgba(${BLUE_RGB},0.16)`, border: `1px solid rgba(${BLUE_RGB},0.35)` }}>
                    <Check size={11} style={{ color: "#7FB3F8" }} />
                  </span>
                  <span className="text-gray-300 text-[14.5px] leading-snug">{b}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-[#07101D]">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 60% 90% at 50% 100%, rgba(${BLUE_RGB},0.16) 0%, transparent 70%)` }} />
        <div className="relative z-10 max-w-[760px] mx-auto px-5 sm:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5">
            {st.ctaTitlePre}{" "}
            <span className="gradient-text">{data.name}?</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
            {st.ctaBody}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#contacto"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-[15px] font-semibold text-white transition-all hover:gap-3"
              style={{ background: BLUE, boxShadow: `0 8px 28px rgba(${BLUE_RGB},0.4)` }}>
              {st.ctaPrimary2} <ArrowRight size={17} />
            </Link>
            <Link href="/#servicios"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-[15px] font-semibold text-white border border-white/15 hover:bg-white/5 transition-all">
              {st.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
