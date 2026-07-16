"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Capability } from "./solutionsData";

const BLUE = "#2B6FD4";
const BLUE_RGB = "43,111,212";

// Fade de la foto hacia el fondo de la card (sin borde/línea dura).
const PHOTO_MASK = "linear-gradient(to bottom, #000 62%, transparent 100%)";

export default function CapabilitiesBento({
  slug, eyebrow, title, items,
}: {
  slug: string;
  eyebrow: string;
  title: string;
  items: Capability[];
}) {
  return (
    <section id="capacidades" data-solution={slug} className="scroll-mt-24 py-14 lg:py-20 relative overflow-hidden bg-gradient-to-b from-[#07101D] to-[#0A1424]">
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[380px] rounded-full pointer-events-none blur-3xl"
        style={{ background: `radial-gradient(circle, rgba(${BLUE_RGB},0.1) 0%, transparent 65%)` }} />
      <div className="relative z-10 max-w-[1120px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold tracking-[0.22em] uppercase mb-3 text-blue-400">{eyebrow}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">{title}</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div key={c.title}
                initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
                className="group relative rounded-2xl overflow-hidden flex flex-col border transition-all duration-300 hover:-translate-y-1.5"
                style={{ background: "#0D1A2D", borderColor: "rgba(255,255,255,0.09)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), 0 8px 30px rgba(0,0,0,0.3)" }}
              >
                {/* Glow azul en hover */}
                <div className="absolute inset-0 z-20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ boxShadow: `inset 0 0 0 1px rgba(${BLUE_RGB},0.4), 0 24px 60px rgba(${BLUE_RGB},0.18)` }} />

                {/* Foto */}
                <div className="relative h-44">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.photo} alt="" aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
                    style={{ maskImage: PHOTO_MASK, WebkitMaskImage: PHOTO_MASK }} />
                  {/* Tinte azul + oscurecido inferior para legibilidad */}
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: `linear-gradient(155deg, rgba(${BLUE_RGB},0.30) 0%, rgba(13,26,45,0) 52%), linear-gradient(to bottom, transparent 42%, rgba(13,26,45,0.85) 100%)` }} />
                  {/* Chip de ícono */}
                  <div className="absolute bottom-3 left-4 z-10 w-11 h-11 rounded-xl flex items-center justify-center text-white"
                    style={{ background: `linear-gradient(135deg, #5AA2F5, ${BLUE})`, boxShadow: `0 10px 24px rgba(${BLUE_RGB},0.5)`, border: "1px solid rgba(255,255,255,0.18)" }}>
                    <Icon size={20} />
                  </div>
                </div>

                {/* Texto */}
                <div className="relative z-10 px-5 pb-5 pt-3 flex-1">
                  <h3 className="text-white font-bold text-[16px] mb-1.5">{c.title}</h3>
                  <p className="text-gray-400 text-[13.5px] leading-relaxed">{c.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <Link href="#contacto"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-[15px] font-semibold text-white transition-all hover:gap-3"
            style={{ background: BLUE, boxShadow: `0 10px 30px rgba(${BLUE_RGB},0.4)` }}>
            Solicitar un diagnóstico <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
