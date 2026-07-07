"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, MessageCircle, ChevronRight } from "lucide-react";
import { SOLUTIONS } from "./solutionsData";

const BLUE = "#2B6FD4";
const BLUE_RGB = "43,111,212";
const WHATSAPP = "https://wa.link/78b9n9";

export default function SolutionPage({ slug }: { slug: string }) {
  const data = SOLUTIONS[slug];
  const Icon = data.icon;

  return (
    <main className="bg-[#07101D] min-h-screen">
      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06]"
        style={{ background: "rgba(7,16,29,0.72)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}>
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
          <Link href="/" className="flex flex-col leading-none">
            <span className="logo-word text-lg text-white tracking-widest">ACCEDRA</span>
            <span className="logo-sub text-[9px] tracking-[0.25em] text-blue-400 uppercase mt-0.5">IT Solutions</span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-5">
            <Link href="/#servicios" className="hidden sm:inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors">
              <ArrowLeft size={15} /> Volver a soluciones
            </Link>
            <Link href="/#contacto"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-full transition-all hover:brightness-110"
              style={{ background: BLUE, boxShadow: `0 8px 24px rgba(${BLUE_RGB},0.3)` }}>
              Hablar con un experto
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-20 lg:pb-28">
        <div className="absolute inset-x-0 top-0 h-[560px] pointer-events-none"
          style={{ background: `radial-gradient(ellipse 55% 100% at 30% 0%, rgba(${BLUE_RGB},0.18) 0%, transparent 70%)` }} />
        <div className="absolute -top-32 right-0 w-[560px] h-[560px] rounded-full pointer-events-none blur-3xl"
          style={{ background: `radial-gradient(circle, rgba(96,140,240,0.10) 0%, transparent 68%)` }} />

        <div className="relative z-10 max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
          {/* Breadcrumb */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
            className="flex items-center gap-1.5 text-xs text-gray-500 mb-8">
            <Link href="/" className="hover:text-gray-300 transition-colors">Inicio</Link>
            <ChevronRight size={12} />
            <Link href="/#servicios" className="hover:text-gray-300 transition-colors">Soluciones</Link>
            <ChevronRight size={12} />
            <span className="text-blue-400">{data.name}</span>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2.5 mb-6">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: `rgba(${BLUE_RGB},0.14)`, border: `1px solid rgba(${BLUE_RGB},0.3)` }}>
                  <Icon size={20} style={{ color: "#3B8EF0" }} />
                </div>
                <span className="text-xs font-semibold tracking-[0.22em] uppercase text-blue-400">{data.eyebrow}</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-white leading-[1.05] mb-6">
                {data.title}{" "}
                <span className="gradient-text">{data.highlight}</span>
              </h1>
              <p className="text-gray-300 text-lg leading-relaxed max-w-xl mb-9">{data.subtitle}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/#contacto"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full text-[15px] font-semibold text-white transition-all hover:gap-3"
                  style={{ background: BLUE, boxShadow: `0 8px 28px rgba(${BLUE_RGB},0.35)` }}>
                  Solicitar asesoramiento <ArrowRight size={17} />
                </Link>
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full text-[15px] font-semibold text-white border border-white/15 hover:bg-white/5 transition-all">
                  <MessageCircle size={17} className="text-blue-400" /> WhatsApp
                </a>
              </div>
            </motion.div>

            {/* Right: framed image */}
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }}
              className="relative">
              <div className="rounded-[26px] p-px"
                style={{ background: `linear-gradient(150deg, rgba(${BLUE_RGB},0.5), rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.02))` }}>
                <div className="rounded-[25px] overflow-hidden relative h-[320px] sm:h-[420px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={data.heroImage} alt={data.name} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(7,16,29,0.7), rgba(7,16,29,0.1))" }} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Intro ── */}
      <section className="relative py-16 lg:py-20 border-y border-white/[0.06] bg-[#0A1424]">
        <div className="max-w-[900px] mx-auto px-5 sm:px-8 lg:px-12 text-center">
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

      {/* ── Capabilities ── */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-b from-[#07101D] to-[#0A1424]">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full pointer-events-none blur-3xl"
          style={{ background: `radial-gradient(circle, rgba(${BLUE_RGB},0.1) 0%, transparent 65%)` }} />
        <div className="relative z-10 max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-[0.22em] uppercase mb-3 text-blue-400">Qué incluye</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Capacidades de la solución</h2>
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
          <p className="text-xs font-semibold tracking-[0.22em] uppercase mb-8 text-gray-500">Trabajamos con</p>
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
                El respaldo de un integrador que se involucra.
              </h2>
              <p className="text-gray-400 text-[15px] leading-relaxed max-w-md">
                No entregamos una caja y nos vamos. Diseñamos, implementamos y sostenemos la solución
                junto a tu equipo, con soporte local y estándares enterprise.
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

      {/* ── Industries (optional) ── */}
      {data.industries && (
        <section className="py-16 lg:py-20 bg-[#0A1424] border-t border-white/[0.06]">
          <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 text-center">
            <p className="text-xs font-semibold tracking-[0.22em] uppercase mb-3 text-blue-400">Industrias</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Sectores que ya lo usan</h2>
            <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
              {data.industries.map((ind) => (
                <span key={ind}
                  className="px-5 py-2.5 rounded-full text-sm font-medium text-gray-300"
                  style={{ background: `rgba(${BLUE_RGB},0.08)`, border: `1px solid rgba(${BLUE_RGB},0.22)` }}>
                  {ind}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-[#07101D]">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 60% 90% at 50% 100%, rgba(${BLUE_RGB},0.16) 0%, transparent 70%)` }} />
        <div className="relative z-10 max-w-[760px] mx-auto px-5 sm:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5">
            ¿Listo para avanzar con{" "}
            <span className="gradient-text">{data.name}?</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
            Contanos tu desafío y un experto de Accedra te contacta en menos de 24 horas hábiles.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#contacto"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-[15px] font-semibold text-white transition-all hover:gap-3"
              style={{ background: BLUE, boxShadow: `0 8px 28px rgba(${BLUE_RGB},0.4)` }}>
              Hablar con un experto <ArrowRight size={17} />
            </Link>
            <Link href="/#servicios"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-[15px] font-semibold text-white border border-white/15 hover:bg-white/5 transition-all">
              Ver otras soluciones
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
