"use client";

import { motion } from "framer-motion";
import { Award, Handshake, Layers, Clock } from "lucide-react";

const BLUE = "#2B6FD4";
const BLUE_RGB = "43,111,212";

const pillars = [
  {
    icon: Award,
    step: "01",
    metric: "400+",
    metricLabel: "proyectos",
    title: "Experiencia comprobada",
    description: "15 años entregando infraestructura crítica para YPF, Accenture, Banco Provincia y más de 100 empresas líderes.",
  },
  {
    icon: Handshake,
    step: "02",
    metric: "12+",
    metricLabel: "partners cert.",
    title: "Ecosistema tecnológico",
    description: "Distribuidores certificados por Cisco, Microsoft, Palo Alto, Dell EMC y Nutanix. La mejor tecnología con soporte local.",
  },
  {
    icon: Layers,
    step: "03",
    metric: "1",
    metricLabel: "proveedor",
    title: "Soluciones end-to-end",
    description: "Cableado, red, seguridad, cloud y firma digital. Un solo interlocutor que cubre cada capa de tu infraestructura.",
  },
  {
    icon: Clock,
    step: "04",
    metric: "24/7",
    metricLabel: "disponibilidad",
    title: "Soporte y continuidad",
    description: "Mesa de ayuda, monitoreo proactivo y SLA garantizado para que tu operación nunca se detenga.",
  },
];

export default function WhyUs() {
  return (
    <section id="nosotros" className="py-20 lg:py-28 bg-[#07101D] relative overflow-hidden">
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(${BLUE_RGB},0.15) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
          opacity: 0.45,
        }}
      />
      {/* Ambient glows */}
      <div
        className="absolute -top-40 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, rgba(${BLUE_RGB},0.10) 0%, transparent 65%)` }}
      />
      <div
        className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, rgba(${BLUE_RGB},0.07) 0%, transparent 70%)` }}
      />

      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold tracking-[0.22em] uppercase mb-3 text-blue-400"
          >
            Por qué Accedra
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.07 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            El partner IT que tu empresa merece
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12 }}
            className="text-gray-400 text-[15px] max-w-xl mx-auto"
          >
            No somos un proveedor más. Somos el equipo de IT que se convierte en parte de tu organización.
          </motion.p>
        </div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.09 }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = `rgba(${BLUE_RGB},0.4)`;
                  el.style.boxShadow = `0 0 0 1px rgba(${BLUE_RGB},0.15), 0 24px 60px rgba(${BLUE_RGB},0.18)`;
                  el.style.transform = "translateY(-6px)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(255,255,255,0.07)";
                  el.style.boxShadow = "none";
                  el.style.transform = "translateY(0)";
                }}
                className="relative flex flex-col rounded-2xl p-6 lg:p-8 cursor-default transition-all duration-300 overflow-hidden"
                style={{
                  background: "linear-gradient(145deg, rgba(13,26,50,0.9) 0%, rgba(6,14,28,0.95) 100%)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                {/* Left accent bar */}
                <div
                  className="absolute left-0 top-8 bottom-8 w-[3px] rounded-full"
                  style={{ background: `linear-gradient(to bottom, ${BLUE}, rgba(${BLUE_RGB},0.2))` }}
                />

                {/* Top row: step + icon */}
                <div className="flex items-center justify-between mb-8">
                  <span
                    className="text-[11px] font-bold tracking-[0.2em] tabular-nums"
                    style={{ color: `rgba(${BLUE_RGB},0.5)` }}
                  >
                    {p.step}
                  </span>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: `rgba(${BLUE_RGB},0.12)`,
                      border: `1px solid rgba(${BLUE_RGB},0.25)`,
                    }}
                  >
                    <Icon size={18} style={{ color: BLUE }} />
                  </div>
                </div>

                {/* Metric — hero number */}
                <div className="mb-6">
                  <span
                    className="block text-[44px] lg:text-[56px] font-black leading-none tabular-nums tracking-tight"
                    style={{
                      background: `linear-gradient(135deg, #fff 0%, rgba(${BLUE_RGB},0.7) 100%)`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {p.metric}
                  </span>
                  <span className="text-[13px] font-medium text-gray-500 mt-1 block tracking-wide">
                    {p.metricLabel}
                  </span>
                </div>

                {/* Divider */}
                <div
                  className="w-8 h-px mb-6"
                  style={{ background: `rgba(${BLUE_RGB},0.35)` }}
                />

                {/* Title + description */}
                <h3 className="text-white font-bold text-[16px] leading-snug mb-3">{p.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed flex-1">{p.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
