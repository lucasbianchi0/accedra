"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const BLUE_RGB = "43,111,212";

// ⚠️ Fotos de avatar de ejemplo (mock) — reemplazar por fotos reales autorizadas.
const testimonials = [
  {
    quote:
      "Se puede ver que todos los integrantes de Accedra buscan dar valor agregado en cada proyecto. Se convirtieron en nuestro socio estratégico de confianza.",
    name: "Germán C.",
    role: "Gerente de IT · Mapfre Argentina",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    color: "#ef4444",
  },
  {
    quote:
      "Hemos logrado incorporar tecnología para sostener el negocio de manera óptima. La calidad de servicio y el compromiso del equipo es excepcional.",
    name: "Sebastián S.",
    role: "Director de Tecnología · Andreani",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    color: "#f97316",
  },
  {
    quote:
      "Entienden nuestras necesidades técnicas y las traducen en soluciones que realmente funcionan para el negocio. Socios estratégicos de verdad.",
    name: "Gustavo I.",
    role: "IT Manager · Finning Argentina",
    image: "https://randomuser.me/api/portraits/men/76.jpg",
    color: "#d97706",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden bg-[#080F1C]">
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(${BLUE_RGB},0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(${BLUE_RGB},0.08) 1px, transparent 1px)`,
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse 85% 75% at 50% 40%, #000 15%, transparent 88%)",
          WebkitMaskImage: "radial-gradient(ellipse 85% 75% at 50% 40%, #000 15%, transparent 88%)",
        }}
      />
      {/* Glows */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[760px] h-[520px] rounded-full pointer-events-none blur-3xl"
        style={{ background: `radial-gradient(circle, rgba(${BLUE_RGB},0.13) 0%, transparent 65%)` }} />
      {/* Top hairline */}
      <div className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent, rgba(${BLUE_RGB},0.35), transparent)` }} />

      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }}
            className="text-xs font-semibold tracking-[0.2em] uppercase text-blue-400 mb-3">
            Testimonios
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.08 }}
            className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            La voz de{" "}
            <span className="gradient-text">nuestros clientes</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.14 }}
            className="text-gray-400 text-[15px] max-w-md mx-auto">
            Empresas líderes que confían su infraestructura crítica a nuestro equipo.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-7">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="group relative pt-8"
            >
              {/* Avatar — overlaps the top-left of the card */}
              <div className="absolute top-0 left-8 z-20">
                <div
                  className="w-16 h-16 rounded-full overflow-hidden"
                  style={{ border: "4px solid #0B1422", boxShadow: `0 10px 30px ${t.color}55` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.image} alt={t.name} className="w-full h-full object-cover" draggable={false} />
                </div>
              </div>

              {/* Hover glow */}
              <div
                className="absolute -inset-1.5 top-6 rounded-[26px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-xl"
                style={{ background: `radial-gradient(circle at 50% 0%, rgba(${BLUE_RGB},0.22), transparent 70%)` }}
              />

              {/* Card */}
              <div
                className="relative h-full rounded-3xl px-7 pt-14 pb-7 border transition-all duration-300 group-hover:-translate-y-1.5 flex flex-col"
                style={{
                  background: "rgba(255,255,255,0.035)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  borderColor: "rgba(255,255,255,0.09)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 30px rgba(0,0,0,0.3)",
                }}
              >
                <Quote size={30} className="text-blue-500/25 absolute top-6 right-6" />

                <p className="text-gray-200 text-[15px] leading-relaxed flex-1 mb-7">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div className="pt-5 border-t border-white/[0.07] flex items-end justify-between gap-3">
                  <div>
                    <p className="text-white font-semibold text-[15px] leading-tight">{t.name}</p>
                    <p className="text-gray-500 text-[12.5px] mt-0.5">{t.role}</p>
                  </div>
                  <div className="flex gap-0.5 flex-shrink-0">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <span key={s} className="text-amber-400 text-sm">★</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
