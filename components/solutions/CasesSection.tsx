"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Building2, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Case } from "./solutionsData";
import { imgFor } from "@/components/cases/caseImage";

const BLUE = "#2B6FD4";
const BLUE_RGB = "43,111,212";

export default function CasesSection({ cases, slug }: { cases: Case[]; slug: string }) {
  const items = cases.slice(0, 3);

  return (
    <section id="casos" className="scroll-mt-24 relative py-20 lg:py-28 overflow-hidden bg-gradient-to-b from-[#07101D] to-[#0A1424]">
      <div className="absolute -top-24 right-0 w-[600px] h-[400px] rounded-full pointer-events-none blur-3xl"
        style={{ background: `radial-gradient(circle, rgba(${BLUE_RGB},0.1) 0%, transparent 65%)` }} />
      <div className="relative z-10 max-w-[1180px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.22em] uppercase mb-3 text-blue-400">Casos de éxito</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Resultados que hablan por nosotros</h2>
          <p className="text-gray-400 text-[15px] leading-relaxed">
            Proyectos reales, en empresas líderes, con resultados concretos.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
          {items.map((c, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="h-full">
              <Link href={`/casos/${slug}/${i}`}
                className="group relative flex h-full text-left rounded-2xl border overflow-hidden flex-col transition-all duration-300 hover:-translate-y-1.5"
                style={{ background: "#0D1A2D", borderColor: "rgba(255,255,255,0.09)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), 0 10px 34px rgba(0,0,0,0.35)" }}>
                <div className="absolute inset-0 z-10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ boxShadow: `inset 0 0 0 1px rgba(${BLUE_RGB},0.4), 0 24px 60px rgba(${BLUE_RGB},0.18)` }} />
                <div className="relative h-44">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.image ?? imgFor(c.industry)} alt="" aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ maskImage: "linear-gradient(to bottom, #000 50%, transparent 96%)", WebkitMaskImage: "linear-gradient(to bottom, #000 50%, transparent 96%)" }} />
                  <span className="absolute bottom-3 left-4 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full"
                    style={{ background: `rgba(${BLUE_RGB},0.35)`, color: "#EAF2FE", border: `1px solid rgba(${BLUE_RGB},0.5)`, backdropFilter: "blur(4px)" }}>
                    <Building2 size={12} /> {c.industry}
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-white font-bold text-[17px] leading-snug mb-2.5">{c.result}</h3>
                  <p className="text-gray-400 text-[14px] leading-relaxed mb-4 flex-1">{c.challenge}</p>
                  <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-blue-400 group-hover:text-blue-300 transition-colors">
                    Ver caso <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <p className="text-gray-400 text-[15px]">¿Querés que el próximo caso sea el tuyo?</p>
          <Link href="/#contacto"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white px-6 py-3 rounded-full transition-all hover:gap-3"
            style={{ background: BLUE, boxShadow: `0 8px 28px rgba(${BLUE_RGB},0.35)` }}>
            Solicitar un diagnóstico <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
