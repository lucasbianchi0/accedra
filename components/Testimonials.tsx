"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "Se puede ver que todos los integrantes de ACCEDRA buscan dar valor agregado en cada proyecto. Se convirtieron en nuestro socio estratégico de confianza.",
    name: "Germán C.",
    role: "Gerente de IT",
    company: "Mapfre Argentina",
    initial: "M",
    color: "#ef4444",
  },
  {
    quote:
      "Hemos logrado incorporar tecnología para sostener el negocio de manera óptima. La calidad de servicio y el compromiso del equipo de Accedra es excepcional.",
    name: "Sebastian S.",
    role: "Director de Tecnología",
    company: "Andreani",
    initial: "A",
    color: "#f97316",
  },
  {
    quote:
      "Se han convertido en nuestros socios estratégicos. Entienden nuestras necesidades técnicas y las traducen en soluciones que realmente funcionan para el negocio.",
    name: "Gustavo I.",
    role: "IT Manager",
    company: "Finning Argentina",
    initial: "F",
    color: "#d97706",
  },
];

// Pre-computed deterministic ghost card data (avoids SSR hydration issues)
const GHOST_COLORS = [
  "#ef4444","#f97316","#f59e0b","#10b981","#3b82f6",
  "#8b5cf6","#ec4899","#06b6d4","#84cc16","#f43f5e",
  "#6366f1","#14b8a6","#a855f7","#22c55e","#0ea5e9",
];
const GHOST_INITIALS = "MABCDFGHJKLNPRSTUVWXYZ";
const LINE_SETS = [
  [100, 82, 55], [88, 70, 48], [95, 65, 52], [80, 75, 60],
  [92, 68, 45], [85, 78, 58], [90, 72, 50], [97, 60, 42],
];
const GHOST_CARDS = Array.from({ length: 56 }, (_, i) => ({
  color: GHOST_COLORS[i % GHOST_COLORS.length],
  initial: GHOST_INITIALS[i % GHOST_INITIALS.length],
  lines: LINE_SETS[i % LINE_SETS.length],
  stars: i % 7 === 0 ? 4 : 5,
}));

function GhostReviews() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Ghost card grid */}
      <div
        className="grid gap-3 p-4 absolute inset-0"
        style={{
          gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
          gridTemplateRows: "repeat(7, minmax(0, 1fr))",
          filter: "blur(3px)",
          opacity: 0.45,
        }}
      >
        {GHOST_CARDS.map((card, i) => (
          <div
            key={i}
            className="rounded-xl p-2.5 flex flex-col gap-1.5"
            style={{
              background: "#0F2040",
              border: "1px solid #1a3560",
            }}
          >
            {/* Stars */}
            <div className="flex gap-px">
              {Array.from({ length: card.stars }).map((_, s) => (
                <span key={s} style={{ color: "#f59e0b", fontSize: 6 }}>★</span>
              ))}
            </div>
            {/* Text lines */}
            <div className="space-y-1 flex-1">
              <div className="h-1 rounded-full" style={{ width: `${card.lines[0]}%`, background: "#2a4a7a" }} />
              <div className="h-1 rounded-full" style={{ width: `${card.lines[1]}%`, background: "#1f3d6a" }} />
              <div className="h-1 rounded-full" style={{ width: `${card.lines[2]}%`, background: "#193260" }} />
            </div>
            {/* Avatar row */}
            <div className="flex items-center gap-1">
              <div
                className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center"
                style={{ background: card.color, fontSize: 5, color: "#fff", fontWeight: 700 }}
              >
                {card.initial}
              </div>
              <div className="space-y-0.5 flex-1">
                <div className="h-1 rounded-full w-3/4" style={{ background: "#2a4a7a" }} />
                <div className="h-0.5 rounded-full w-1/2" style={{ background: "#1f3d6a" }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edge fades — hide outer rows/cols cleanly */}
      <div className="absolute inset-0"
        style={{ background: "linear-gradient(to right, #0D1A2D 0%, transparent 12%, transparent 88%, #0D1A2D 100%)" }} />
      <div className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, #0D1A2D 0%, transparent 14%, transparent 82%, #0D1A2D 100%)" }} />
      {/* Center radial — slightly darkens behind the 3 cards so they pop */}
      <div className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 65% 55% at 50% 58%, rgba(13,26,45,0.7) 0%, transparent 100%)" }} />
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-16 lg:py-24 bg-[#0D1A2D] relative overflow-hidden">
      <GhostReviews />

      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold tracking-[0.2em] uppercase text-blue-400 mb-3"
          >
            Lo que dicen de nosotros
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-5"
          >
            La voz de nuestros clientes
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.18 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full"
            style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)" }}
          >
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-amber-400 text-sm">★</span>
              ))}
            </div>
            <span className="text-amber-300/80 text-xs font-semibold tracking-wide">100+ clientes satisfechos</span>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative rounded-3xl p-8 flex flex-col transition-all duration-300 group"
              style={{ background: "#0D1E38", border: "1px solid #1a3560" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(43,111,212,0.5)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#1a3560"; }}
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <span key={s} className="text-amber-400 text-base">★</span>
                ))}
              </div>

              <Quote size={28} className="text-blue-500/30 mb-4 flex-shrink-0" />

              <p className="text-gray-200 leading-relaxed text-lg flex-1 mb-8 italic">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="w-12 h-px bg-blue-500/30 mb-6" />

              <div className="flex items-center gap-4">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg text-white font-bold text-base"
                  style={{ background: t.color }}
                >
                  {t.initial}
                </div>
                <div>
                  <p className="text-white font-semibold text-base">{t.name}</p>
                  <p className="text-gray-500 text-sm">{t.role}</p>
                  <p className="text-blue-400 text-sm font-medium">{t.company}</p>
                </div>
              </div>

              <div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ boxShadow: "inset 0 0 40px rgba(43,111,212,0.06)" }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
