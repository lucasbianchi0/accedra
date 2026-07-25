"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Package, Mountain, Landmark, Building2, type LucideIcon } from "lucide-react";
import { useT } from "@/lib/i18n/useT";
import Link from "next/link";
import { HOME_CASES } from "./homeCases";
import { Reveal, revealOnScroll } from "@/components/Reveal";
import Testimonials from "@/components/Testimonials";

const BLUE_RGB = "43,111,212";
const LINKEDIN = "https://www.linkedin.com/company/accedra-s.a.";

const INDUSTRY_ICONS: Record<string, LucideIcon> = {
  "Logística": Package, "Minería": Mountain, "Banca": Landmark,
};

// Casos de éxito: header centrado + cards con chip de industria, descripción y
// 3 métricas duras + banner de cierre. Debajo, testimonios.
export default function WhyUs() {
  const t = useT();
  const cases = HOME_CASES;

  return (
    <section id="nosotros" className="section relative">
        <div className="container-x relative z-10">

          {/* ── Header centrado ── */}
          <Reveal className="title-halo text-center max-w-3xl mx-auto mb-12">
            <h2 className="section-title mt-3">
              {t.whyUs.titlePre}{" "}
              <span className="gradient-text">{t.whyUs.titleHighlight}</span>
            </h2>
            <div className="mx-auto mt-6 h-px w-28"
              style={{ background: `linear-gradient(90deg, transparent, rgba(${BLUE_RGB},0.7), transparent)` }} />
          </Reveal>

          {/* ── Cards de casos ── */}
          {cases.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {cases.map((c, i) => {
                const TagIcon = INDUSTRY_ICONS[c.tag] ?? Building2;
                return (
                  <motion.div key={c.title} {...revealOnScroll} className="group h-full">
                    <Link href={`/casos/home/${i}`} aria-label={`Ver caso: ${c.title}`}
                      className="relative flex h-full flex-col rounded-panel overflow-hidden border border-white/[0.12] focus-visible:outline-none transition-all duration-500 hover:-translate-y-2"
                      style={{
                        // Superficie navy definida (no casi-transparente) → la card se
                        // separa del fondo y flota. Top más claro = profundidad.
                        background: "linear-gradient(180deg, #1B2D49 0%, #13223A 50%, #0C1826 100%)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.14), 0 26px 66px rgba(0,0,0,0.55)",
                      }}>
                      {/* Ring azul en hover/foco */}
                      <div className="absolute inset-0 z-[4] rounded-[inherit] opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300 pointer-events-none"
                        style={{ boxShadow: `inset 0 0 0 1px rgba(${BLUE_RGB},0.55), 0 0 40px rgba(${BLUE_RGB},0.2)` }} />

                      {/* Imagen + chip de industria */}
                      <div className="relative h-48 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={c.image} alt={c.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]" draggable={false} />
                        <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full"
                          style={{ background: "rgba(10,18,32,0.72)", color: "#DCE9FB", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(6px)" }}>
                          <TagIcon size={12} className="text-blue-300" />
                          {c.tag}
                        </span>
                      </div>

                      {/* Cuerpo */}
                      <div className="relative z-[2] flex flex-1 flex-col p-6">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <h3 className="text-white text-[19px] sm:text-[17px] font-bold leading-snug group-hover:text-blue-100 transition-colors">{c.title}</h3>
                          <ArrowUpRight size={18} className="flex-shrink-0 mt-1 text-gray-500 transition-all duration-300 group-hover:text-blue-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>

                        {/* Descripción: una línea de contexto del caso */}
                        <p className="text-gray-400 text-[15px] sm:text-[13.5px] leading-relaxed mb-6 line-clamp-3">{c.desc}</p>

                        {/* Divisor con acento azul */}
                        <div className="mt-auto h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(43,111,212,0.4) 18%, rgba(255,255,255,0.10) 50%, rgba(43,111,212,0.4) 82%, transparent)" }} />

                        {/* Métricas */}
                        <div className="grid grid-cols-3 gap-3 pt-5">
                          {c.stats.map((s) => (
                            <div key={s.label}>
                              <div className="font-bold text-[17px] sm:text-[16px] leading-none whitespace-nowrap" style={{ color: "#5AA2F5", textShadow: "0 0 18px rgba(90,162,245,0.45)" }}>{s.value}</div>
                              <div className="text-gray-400 text-[12px] sm:text-[11px] mt-1.5 leading-tight">{s.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* ── Banner de cierre — banda de marca con gradiente animado (cta-ocean),
              reflejos que derivan y botón blanco invertido, igual que el CTA de
              soluciones para que la página cierre coherente. ── */}
          <Reveal delay={0.1} className="mt-8">
            <div className="cta-ocean relative overflow-hidden rounded-panel px-8 sm:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-6"
              style={{ border: `1px solid rgba(${BLUE_RGB},0.35)`, boxShadow: "0 24px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -50px 80px rgba(0,0,0,0.4)" }}>
              {/* Reflejos que derivan sobre la superficie a distinto ritmo */}
              <div className="absolute -top-24 -right-10 w-80 h-80 rounded-full blur-3xl pointer-events-none cta-drift-a"
                style={{ background: "radial-gradient(circle, rgba(90,162,245,0.28), transparent 70%)" }} />
              <div className="absolute -bottom-28 left-1/4 w-72 h-72 rounded-full blur-3xl pointer-events-none cta-drift-b"
                style={{ background: "radial-gradient(circle, rgba(43,111,212,0.32), transparent 70%)" }} />
              {/* Trama de puntos que se desvanece */}
              <div className="absolute inset-0 opacity-[0.14] pointer-events-none"
                style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)", backgroundSize: "22px 22px", maskImage: "linear-gradient(90deg, transparent, #000 60%)", WebkitMaskImage: "linear-gradient(90deg, transparent, #000 60%)" }} />

              <div className="relative text-center sm:text-left">
                <p className="text-white text-[19px] sm:text-[21px] font-bold mb-1.5 leading-snug">Más de 400 empresas confían en Accedra IT Solutions</p>
                <p className="text-white/80 text-[14px]">Somos el partner tecnológico para proyectos que mueven al país.</p>
              </div>
              <a href={LINKEDIN} target="_blank" rel="noopener noreferrer"
                className="relative flex-shrink-0 inline-flex items-center gap-2 pl-6 pr-2 py-2.5 rounded-full text-[15px] font-semibold transition-all hover:gap-3"
                style={{ background: "#ffffff", color: "#1E4C97", boxShadow: "0 10px 30px rgba(0,0,0,0.28)" }}>
                Ver todos los casos de éxito
                <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(30,76,151,0.12)" }}>
                  <ArrowRight size={15} />
                </span>
              </a>
            </div>
          </Reveal>

          {/* Testimonios: cierran el bloque de confianza, pegados a los casos */}
          <Testimonials />

        </div>
      </section>
  );
}
