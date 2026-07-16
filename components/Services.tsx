"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useT } from "@/lib/i18n/useT";
import ServiceIllustration from "@/components/ServiceIllustration";

const BLUE_RGB = "43,111,212";

// Metadatos no traducibles (slug, destacado). El título y los items salen del
// diccionario por índice (t.services.columns[i]); la ilustración custom se
// resuelve por slug en <ServiceIllustration />.
const columns = [
  { slug: "networking" },
  { slug: "firma-biometrica", featured: true },
  { slug: "consultoria" },
  { slug: "seguridad" },
  { slug: "software-ai" },
];

export default function Services() {
  const t = useT();

  return (
    <section id="servicios" className="py-20 lg:py-28 relative overflow-hidden bg-gradient-to-b from-[#0A1424] to-[#07101D]">

      {/* Premium aurora background */}
      <div className="absolute inset-x-0 top-0 h-[520px] pointer-events-none"
        style={{ background: `radial-gradient(ellipse 60% 100% at 50% 0%, rgba(${BLUE_RGB},0.15) 0%, transparent 70%)` }} />
      <div className="hidden sm:block absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full pointer-events-none blur-2xl animate-float"
        style={{ background: `radial-gradient(circle, rgba(80,140,240,0.10) 0%, transparent 70%)` }} />
      <div className="hidden sm:block absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full pointer-events-none blur-2xl animate-float-slow"
        style={{ background: `radial-gradient(circle, rgba(${BLUE_RGB},0.09) 0%, transparent 70%)` }} />

      <div className="relative z-10 max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }}
            className="text-xs font-semibold tracking-[0.22em] uppercase mb-3 text-blue-400">
            {t.services.eyebrow}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.06 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t.services.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.11 }}
            className="text-gray-400 text-[15px] max-w-md mx-auto">
            {t.services.subtitle}
          </motion.p>
        </div>

        {/* Bento — 3 arriba (tercios) + 2 abajo (mitades, más anchas). Cards compactas. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5">
          {columns.map((col, i) => {
            const cd = t.services.columns[i];
            const featured = !!col.featured;
            const wide = i >= 3; // las 2 de abajo ocupan media fila cada una
            return (
              <motion.div
                key={col.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className={`group relative ${wide ? "lg:col-span-3" : "lg:col-span-2"}`}
              >
                {/* Hover glow */}
                <div
                  className="absolute -inset-1.5 rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-2xl"
                  style={{ background: `radial-gradient(circle at 50% 0%, rgba(${BLUE_RGB},0.26), transparent 70%)` }}
                />

                <Link
                  href={`/soluciones/${col.slug}`}
                  aria-label={`${t.services.viewSolution}: ${cd.title}`}
                  className="relative block h-full transition-transform duration-300 group-hover:-translate-y-1.5 transform-gpu"
                >
                  <div
                    className="relative h-full rounded-[24px] overflow-hidden border flex flex-col transition-colors duration-300 group-hover:border-blue-500/40"
                    style={{
                      background: "#0D1A2D",
                      borderColor: featured ? `rgba(${BLUE_RGB},0.45)` : "rgba(255,255,255,0.09)",
                      boxShadow: featured
                        ? `inset 0 1px 0 rgba(255,255,255,0.08), 0 18px 48px rgba(0,0,0,0.38), 0 0 0 1px rgba(${BLUE_RGB},0.15)`
                        : "inset 0 1px 0 rgba(255,255,255,0.06), 0 10px 30px rgba(0,0,0,0.3)",
                    }}
                  >
                    {/* Featured: tinte + glow superior */}
                    {featured && (
                      <>
                        <div className="absolute inset-0 pointer-events-none z-[1]"
                          style={{ background: `linear-gradient(160deg, rgba(${BLUE_RGB},0.15) 0%, transparent 44%)` }} />
                        <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-[320px] h-[180px] rounded-full pointer-events-none blur-3xl z-[1]"
                          style={{ background: `radial-gradient(circle, rgba(${BLUE_RGB},0.18) 0%, transparent 70%)` }} />
                      </>
                    )}

                    {/* Ilustración custom (mini-panel de producto) */}
                    <div
                      className="relative z-[2] h-40 flex items-center justify-center overflow-hidden"
                      style={{ background: `linear-gradient(160deg, rgba(${BLUE_RGB},0.30) 0%, rgba(13,26,45,0) 78%)` }}
                    >
                      <div
                        className="scale-[0.72] transition-transform duration-500 group-hover:scale-[0.78]"
                        style={{ filter: "drop-shadow(0 16px 26px rgba(0,0,0,0.28))", "--seq-delay": `${i}s` } as CSSProperties}
                      >
                        <ServiceIllustration slug={col.slug} />
                      </div>
                    </div>

                    {/* Badge Diferencial */}
                    {featured && (
                      <span
                        className="absolute top-4 right-4 z-10 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                        style={{ background: `rgba(${BLUE_RGB},0.32)`, color: "#EAF2FE", border: `1px solid rgba(${BLUE_RGB},0.55)`, backdropFilter: "blur(6px)" }}
                      >
                        {t.services.featuredBadge}
                      </span>
                    )}

                    {/* Contenido — título + lista de servicios (2 columnas en las anchas) */}
                    <div className="relative z-[2] px-6 pt-5 pb-6 flex-1 flex flex-col">
                      <h3 className="text-white text-lg font-bold tracking-tight uppercase mb-3 group-hover:text-blue-200 transition-colors">
                        {cd.title}
                      </h3>
                      <ul className="mb-5 grid grid-cols-2 gap-x-6 gap-y-3.5">
                        {cd.items.map((item) => (
                          <li key={item} className="flex items-center gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: `rgba(${BLUE_RGB},0.6)` }} />
                            <span className="text-gray-300 text-[14px] leading-tight group-hover:text-blue-100 transition-colors">{item}</span>
                          </li>
                        ))}
                      </ul>
                      <span className="mt-auto inline-flex items-center gap-1.5 text-[13px] font-semibold text-blue-300 group-hover:text-white transition-colors">
                        {t.services.viewSolution}
                        <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 text-center"
        >
          <p className="text-gray-500 text-[15px]">{t.services.ctaText}</p>
          <a
            href="#contacto"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white group px-6 py-3 rounded-full transition-all duration-200 hover:gap-3"
            style={{ background: "#2B6FD4", boxShadow: `0 8px 28px rgba(${BLUE_RGB},0.35)` }}
          >
            {t.services.ctaButton}
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
          </a>
        </motion.div>

      </div>
    </section>
  );
}
