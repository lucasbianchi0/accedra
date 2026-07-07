"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, MapPin, ArrowUpRight } from "lucide-react";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

const BLUE = "#2B6FD4";
const BLUE_RGB = "43,111,212";

const px = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1100`;

// ⚠️ CONTENIDO DE EJEMPLO — reemplazar por fotos y trabajos reales de Accedra.
const works = [
  {
    tag: "Capacitación",
    title: "Jornada de capacitación en ciberseguridad",
    text: "Formamos al equipo de IT de un cliente enterprise en prevención de amenazas y buenas prácticas de seguridad.",
    location: "Buenos Aires",
    image: px(3184291),
  },
  {
    tag: "Seguridad IT",
    title: "Firewall perimetral de nueva generación",
    text: "Diseño e implementación de una arquitectura Zero Trust con Palo Alto para proteger la operación crítica.",
    location: "CABA",
    image: px(1181244),
  },
  {
    tag: "Infraestructura",
    title: "Cableado estructurado certificado",
    text: "Instalación completa de cableado y networking en la nueva sede corporativa, lista para escalar.",
    location: "Córdoba",
    image: px(4682189),
  },
  {
    tag: "Firma Digital",
    title: "Despliegue de firma biométrica",
    text: "Digitalización documental con validez legal para miles de operaciones mensuales, sin papel ni demoras.",
    location: "Rosario",
    image: px(9929279),
  },
  {
    tag: "Networking",
    title: "Renovación de red corporativa",
    text: "Wireless de alta densidad y switching Cisco para conectar todas las sucursales con SLA garantizado.",
    location: "Mendoza",
    image: px(256381),
  },
];

const AUTO_MS = 5000;

export default function WhyUs() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const len = works.length;

  const go = useCallback((next: number) => setIndex((next + len) % len), [len]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % len), AUTO_MS);
    return () => clearInterval(t);
  }, [paused, len]);

  const w = works[index];

  return (
    <section id="nosotros" className="py-20 lg:py-28 bg-[#0D1A2D] relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(${BLUE_RGB},0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(${BLUE_RGB},0.05) 1px, transparent 1px)`,
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 80% 60% at 35% 40%, #000 0%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 35% 40%, #000 0%, transparent 85%)",
        }}
      />
      <div className="absolute -top-40 -left-24 w-[560px] h-[560px] rounded-full pointer-events-none blur-3xl"
        style={{ background: `radial-gradient(circle, rgba(${BLUE_RGB},0.12) 0%, transparent 65%)` }} />
      <div className="absolute bottom-[-120px] right-[-60px] w-[560px] h-[560px] rounded-full pointer-events-none blur-3xl"
        style={{ background: `radial-gradient(circle, rgba(96,110,220,0.10) 0%, transparent 68%)` }} />

      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left: authority text ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm font-semibold tracking-[0.22em] uppercase mb-5 text-blue-400">
              Nuestro trabajo
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-white leading-[1.06] mb-6">
              Los proyectos{" "}
              <span className="gradient-text">hablan por nosotros.</span>
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed max-w-lg mb-9">
              15 años y más de 400 proyectos: capacitaciones, despliegues de seguridad,
              redes e infraestructura crítica para las empresas líderes de Argentina.
              Esto es una muestra de lo que hacemos cada día.
            </p>
            <a
              href="#contacto"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full text-[15px] font-semibold text-white transition-all duration-200 hover:gap-3"
              style={{ background: BLUE, boxShadow: `0 8px 28px rgba(${BLUE_RGB},0.35)` }}
            >
              Hablemos de tu proyecto
              <ArrowRight size={17} />
            </a>
          </motion.div>

          {/* ── Right: works carousel ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55 }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div
              className="relative rounded-3xl overflow-hidden h-[440px] sm:h-[480px]"
              style={{ border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 40px 90px rgba(0,0,0,0.45)" }}
            >
              <AnimatePresence>
                <motion.div
                  key={index}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={w.image} alt={w.title} className="absolute inset-0 w-full h-full object-cover" draggable={false} />
                  <div className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgba(7,14,26,0.96) 8%, rgba(7,14,26,0.55) 45%, rgba(7,14,26,0.15) 100%)" }} />

                  {/* Content */}
                  <div className="absolute inset-x-0 bottom-0 p-7 sm:p-8">
                    <div className="flex items-center gap-2.5 mb-3">
                      <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full"
                        style={{ background: `rgba(${BLUE_RGB},0.25)`, color: "#CFE2FF", border: `1px solid rgba(${BLUE_RGB},0.5)`, backdropFilter: "blur(4px)" }}>
                        {w.tag}
                      </span>
                      <span className="text-gray-400 text-xs flex items-center gap-1">
                        <MapPin size={11} /> {w.location}
                      </span>
                    </div>
                    <h3 className="text-white text-2xl sm:text-[26px] font-bold leading-tight mb-2.5 max-w-lg">
                      {w.title}
                    </h3>
                    <p className="text-gray-300 text-[14px] leading-relaxed max-w-md">{w.text}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Arrows */}
              <button
                aria-label="Anterior"
                onClick={() => go(index - 1)}
                className="absolute top-5 right-16 z-10 w-9 h-9 rounded-full flex items-center justify-center text-white/85 hover:text-white transition-colors"
                style={{ background: "rgba(10,18,33,0.6)", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(6px)" }}
              >
                <ArrowLeft size={15} />
              </button>
              <button
                aria-label="Siguiente"
                onClick={() => go(index + 1)}
                className="absolute top-5 right-5 z-10 w-9 h-9 rounded-full flex items-center justify-center text-white/85 hover:text-white transition-colors"
                style={{ background: "rgba(10,18,33,0.6)", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(6px)" }}
              >
                <ArrowRight size={15} />
              </button>

              {/* Dots */}
              <div className="absolute top-7 left-7 z-10 flex gap-2">
                {works.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Trabajo ${i + 1}`}
                    onClick={() => go(i)}
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{ width: i === index ? 26 : 8, background: i === index ? "#EAF2FE" : "rgba(255,255,255,0.35)" }}
                  />
                ))}
              </div>
            </div>

            {/* Follow on LinkedIn */}
            <div className="flex justify-between items-center mt-5 gap-4">
              <p className="text-gray-500 text-[13px] hidden sm:block">
                Seguí todos nuestros proyectos en LinkedIn.
              </p>
              <a
                href="https://www.linkedin.com/company/accedra-s.a."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:bg-white/[0.08] hover:border-blue-500/40 group"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                <LinkedInIcon className="text-blue-400" />
                Seguinos en LinkedIn
                <ArrowUpRight size={14} className="text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
