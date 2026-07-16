"use client";

import { motion } from "framer-motion";
import { Search, DraftingCompass, Rocket, Headset, Check } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    title: "Diagnóstico",
    desc: "Relevamos tu entorno, tu operación y tus objetivos.",
    deliver: "Diagnóstico inicial sin costo",
    free: true,
  },
  {
    icon: DraftingCompass,
    title: "Diseño",
    desc: "Diseñamos la arquitectura y el plan a medida, sin sobre-dimensionar.",
    deliver: "Propuesta técnica y económica",
  },
  {
    icon: Rocket,
    title: "Implementación",
    desc: "Desplegamos con cronograma claro y mínima interrupción.",
    deliver: "Puesta en marcha llave en mano",
  },
  {
    icon: Headset,
    title: "Soporte",
    desc: "Monitoreo y mantenimiento continuos, de punta a punta.",
    deliver: "SLA y un único responsable",
  },
];

export default function ProcessSection() {
  return (
    <section className="relative py-14 lg:py-20 overflow-hidden bg-[#080F1C]">
      {/* Fondo premium: grilla técnica sutil (máscara radial) + auroras */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(90,162,245,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(90,162,245,0.055) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
            maskImage: "radial-gradient(ellipse 78% 68% at 50% 42%, #000 12%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse 78% 68% at 50% 42%, #000 12%, transparent 80%)",
          }} />
        <div className="absolute -top-20 left-[16%] w-[540px] h-[440px] rounded-full blur-3xl animate-float"
          style={{ background: "radial-gradient(circle, rgba(43,111,212,0.16), transparent 66%)" }} />
        <div className="absolute -bottom-24 right-[12%] w-[480px] h-[420px] rounded-full blur-3xl animate-float-slow"
          style={{ background: "radial-gradient(circle, rgba(96,110,220,0.12), transparent 66%)" }} />
        <div className="absolute inset-x-0 top-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(43,111,212,0.35), transparent)" }} />
      </div>
      <div className="relative z-10 max-w-[1180px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.22em] uppercase mb-3 text-blue-400">El proceso</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Cómo trabajamos</h2>
          <p className="text-gray-400 text-[15px] leading-relaxed">
            Un proceso claro y sin sorpresas: sabés qué pasa —y qué recibís— en cada etapa.
          </p>
        </div>

        <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 items-stretch">
          {/* Línea de continuidad + luz que la recorre (aparece tras el reveal de las cards) */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0.85 }} whileInView={{ opacity: 1, scaleX: 1 }} viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            className="hidden lg:block absolute left-[14%] right-[14%] top-[54px] h-px z-0 overflow-visible origin-center"
            style={{ background: "linear-gradient(90deg, transparent, rgba(43,111,212,0.45) 10%, rgba(43,111,212,0.45) 90%, transparent)" }}>
            <span className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full beam-travel"
              style={{ background: "#8FC0FF", boxShadow: "0 0 14px 4px rgba(90,162,245,0.9), 0 0 4px 1px rgba(255,255,255,0.9)", animationDelay: "0.8s" }} />
          </motion.div>
          {STEPS.map((s, i) => {
            const Ic = s.icon;
            return (
              <motion.div key={s.title}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, delay: i * 0.09 }}
                className="group relative z-10 rounded-2xl p-6 lg:p-7 border flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1.5"
                style={{ background: "#0D1A2D", borderColor: "rgba(255,255,255,0.09)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), 0 10px 34px rgba(0,0,0,0.35)" }}
              >
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: "linear-gradient(160deg, rgba(43,111,212,0.14) 0%, transparent 48%)" }} />

                {/* Número gigante fantasma */}
                <span className="absolute -top-3 right-3 text-[86px] font-black leading-none tracking-tight select-none pointer-events-none"
                  style={{ color: "rgba(90,162,245,0.07)" }}>{i + 1}</span>

                {/* Emblema del ícono */}
                <div className="relative w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-105"
                  style={{ background: "linear-gradient(135deg, #5AA2F5, #2B6FD4)", boxShadow: "0 10px 26px rgba(43,111,212,0.45), inset 0 1px 0 rgba(255,255,255,0.25)" }}>
                  <Ic size={22} strokeWidth={1.8} className="text-white" />
                </div>

                <h3 className="relative text-white font-bold text-[17px] mb-2">{s.title}</h3>
                <p className="relative text-gray-400 text-[13.5px] leading-relaxed mb-6 flex-1">{s.desc}</p>

                {/* Entregable destacado */}
                <div className="relative">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500 mb-2">Recibís</p>
                  <span className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold px-3 py-1.5 rounded-full leading-snug"
                    style={s.free
                      ? { background: "rgba(16,185,129,0.14)", border: "1px solid rgba(16,185,129,0.4)", color: "#6ee7b7" }
                      : { background: "rgba(43,111,212,0.16)", border: "1px solid rgba(43,111,212,0.4)", color: "#93c5fd" }}>
                    <Check size={13} strokeWidth={3} /> {s.deliver}
                  </span>
                </div>

              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
