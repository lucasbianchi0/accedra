"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Network, Shield, PenTool, BarChart3, ArrowRight, X, Check } from "lucide-react";

const BASE3D = "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets";

const services = [
  {
    id: "networking",
    icon: Network,
    num: "01",
    title: "Networking",
    tagline: "Infraestructura de red",
    summary: "Redes de alta disponibilidad con switching Cisco/Meraki, wireless corporativo y VoIP. Monitoreo 24/7 y SLA garantizado.",
    description: "Diseñamos, instalamos y mantenemos infraestructuras de red robustas adaptadas a las exigencias operativas de cada cliente. Trabajamos con los fabricantes líderes para garantizar performance, seguridad y escalabilidad sin interrupciones.",
    features: ["Cableado estructurado certificado", "Switching & Routing Cisco / Meraki", "Wireless corporativo de alta densidad", "VoIP y telefonía IP", "Monitoreo proactivo 24/7", "SLA garantizado y soporte on-site"],
    illustration: `${BASE3D}/Desktop%20computer/3D/desktop_computer_3d.png`,
    photo: "https://images.pexels.com/photos/4682189/pexels-photo-4682189.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    id: "seguridad",
    icon: Shield,
    num: "02",
    title: "Seguridad IT",
    tagline: "Protección nivel bancario",
    summary: "Firewalls Cisco y Palo Alto, Zero Trust y seguridad en la nube. La ciberseguridad que eligen los bancos y grandes corporaciones.",
    description: "Protegemos cada capa de tu organización con soluciones de clase empresarial: firewalls de última generación, seguridad en la nube y arquitecturas Zero Trust que eliminan la brecha entre perímetros físicos y digitales.",
    features: ["Next-Gen Firewalls Cisco & Palo Alto", "Cloud Security con Cisco Umbrella", "Protección endpoint con Cisco AMP", "Arquitectura Zero Trust", "Gestión de identidades y accesos", "Auditorías y respuesta ante incidentes"],
    illustration: `${BASE3D}/Shield/3D/shield_3d.png`,
    photo: "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    id: "biometrica",
    icon: PenTool,
    num: "03",
    title: "Firma Biométrica",
    tagline: "Documentos con validez legal",
    summary: "Contratos digitales en segundos con tabletas Wacom. Plena validez ante AFIP y BCRA, sin papel ni demoras.",
    description: "Digitalizamos los procesos documentales de bancos, aseguradoras y el sector salud con soluciones certificadas. Eliminamos el papel manteniendo trazabilidad completa y cumplimiento normativo vigente.",
    features: ["Tabletas Wacom STU certificadas", "Software eSignAnywhere", "Integración con Namirial", "Validez legal y trazabilidad total", "Cumplimiento AFIP / BCRA / ANMAT", "Auditoría y registro de firmas"],
    illustration: `${BASE3D}/Identification%20card/3D/identification_card_3d.png`,
    photo: "https://images.pexels.com/photos/9929279/pexels-photo-9929279.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    id: "consultoria",
    icon: BarChart3,
    num: "04",
    title: "Consultoría Microsoft",
    tagline: "Productividad y datos",
    summary: "Power BI, Microsoft 365 y Azure por consultores certificados. Tu tecnología convertida en ventaja competitiva real.",
    description: "Convertimos la tecnología Microsoft que ya tiene tu empresa en una ventaja competitiva real. Consultores certificados que implementan y optimizan el ecosistema completo, desde la colaboración diaria hasta la analítica ejecutiva.",
    features: ["Microsoft 365 & Teams", "Power BI — dashboards ejecutivos", "Dynamics 365 & SharePoint", "Azure Cloud & migración", "Power Automate & flujos de trabajo", "Licenciamiento y gestión CSP"],
    illustration: `${BASE3D}/Laptop/3D/laptop_3d.png`,
    photo: "https://images.pexels.com/photos/577210/pexels-photo-577210.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
];

const BLUE = "#2B6FD4";
const BLUE_RGB = "43,111,212";

type Service = (typeof services)[number];

// Circuit-board style cable paths: straight segments with 90° corners
// viewBox 1440×620 — paths start/end outside bounds so energy appears to enter/exit
// Top zone (y<240): cables only on sides of the title — left (x<380) and right (x>1060)
// Center stays clear. Below y=240 cables spread freely across full width.
const CABLE_PATHS = [
  // Left side of title — visible next to the text
  { d: "M 300,-20  L 300,640",                    length: 660,  duration: 4.5, delays: [0,    2.4] },
  { d: "M -20,95   L 370,95   L 370,640",         length: 935,  duration: 5.2, delays: [1.2,  3.8] },
  { d: "M 130,-20  L 130,170  L -20,170",         length: 320,  duration: 2.8, delays: [0.6,  2.0] },
  // Right side of title — visible next to the text
  { d: "M 1140,-20 L 1140,640",                   length: 660,  duration: 4.5, delays: [0.9,  3.2] },
  { d: "M 1460,95  L 1070,95  L 1070,640",        length: 935,  duration: 5.2, delays: [2.0,  4.5] },
  { d: "M 1310,-20 L 1310,170 L 1460,170",        length: 320,  duration: 2.8, delays: [1.5,  3.0] },
  // Middle — full width, below title zone (y >= 240)
  { d: "M -20,280  L 600,280  L 600,640",         length: 980,  duration: 5.5, delays: [0.4,  3.0] },
  { d: "M 1460,260 L 840,260  L 840,640",         length: 1000, duration: 5.8, delays: [1.9,  4.3] },
  { d: "M 200,640  L 200,300  L 1460,300",        length: 1560, duration: 8.0, delays: [0.9,  4.5] },
  { d: "M 1260,640 L 1260,245 L -20,245",         length: 1540, duration: 8.0, delays: [2.3,  5.8] },
  // Lower zone
  { d: "M -20,430  L 440,430  L 440,640",         length: 670,  duration: 4.2, delays: [0.5,  2.6] },
  { d: "M 1460,470 L 700,470  L 700,640",         length: 930,  duration: 5.2, delays: [3.1,  5.6] },
  { d: "M 700,640  L 700,510  L -20,510",         length: 1420, duration: 7.5, delays: [1.3,  4.8] },
  { d: "M 1020,640 L 1020,375 L 1460,375",        length: 705,  duration: 4.5, delays: [2.6,  5.1] },
];

function CableGrid() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1440 620"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      <defs>
        <filter id="pulse-glow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="1.8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {CABLE_PATHS.map((cable, i) => (
        <g key={i}>
          {/* Structural cable body */}
          <path
            d={cable.d}
            stroke={`rgba(${BLUE_RGB},0.25)`}
            strokeWidth="1.5"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
          {/* Energy pulses — 2 per cable, staggered */}
          {cable.delays.map((delay, j) => (
            <motion.path
              key={j}
              d={cable.d}
              stroke={j === 0 ? "rgba(120,190,255,0.9)" : `rgba(${BLUE_RGB},0.65)`}
              strokeWidth={j === 0 ? "2.5" : "1.5"}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={`${j === 0 ? 50 : 28} ${cable.length + 200}`}
              animate={{ strokeDashoffset: [j === 0 ? 50 : 28, -(cable.length + 10)] }}
              transition={{ duration: cable.duration * 2.2, delay, repeat: Infinity, ease: "linear" }}
              filter={j === 0 ? "url(#pulse-glow)" : undefined}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}

export default function Services() {
  const [selected, setSelected] = useState<Service | null>(null);

  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selected]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.3)";
  };

  return (
    <>
      <section id="servicios" className="py-20 lg:py-28 relative overflow-hidden bg-[#07101D]">

        {/* Circuit-board cable grid — luminous on dark */}
        <CableGrid />

        {/* Ambient blue glow corners */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, rgba(${BLUE_RGB},0.12) 0%, transparent 70%)` }} />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, rgba(${BLUE_RGB},0.1) 0%, transparent 70%)` }} />

        <div className="relative z-10 max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">

          {/* Header */}
          <div className="text-center mb-14">
            <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-xs font-semibold tracking-[0.22em] uppercase mb-3 text-blue-400">
              Lo que hacemos
            </motion.p>
            <motion.h2 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.07 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4">
              Soluciones IT end-to-end
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.12 }}
              className="text-gray-400 text-[15px] max-w-md mx-auto">
              Desde el cableado hasta la nube, cubrimos cada capa de tu infraestructura.
            </motion.p>
          </div>

          {/* Card block */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  onClick={() => setSelected(s)}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = `0 24px 60px rgba(${BLUE_RGB},0.3), 0 8px 24px rgba(0,0,0,0.4)`; }}
                  onMouseLeave={handleMouseLeave}
                  className="group relative flex flex-col rounded-2xl cursor-pointer overflow-hidden border transition-all duration-300 hover:scale-[1.03]"
                  style={{
                    backgroundColor: "#0D1A2D",
                    borderColor: "rgba(255,255,255,0.09)",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
                  }}
                >
                  {/* Photo */}
                  <div className="relative overflow-hidden flex-shrink-0" style={{ height: 220 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.photo}
                      alt={s.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      draggable={false}
                    />
                    <div className="absolute inset-0" style={{ background: "rgba(7,16,29,0.25)" }} />
                    {/* Fade into dark card body */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-[#0D1A2D]" />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 px-6 pt-5 pb-6">
                    {/* Title */}
                    <h3 className="text-white text-[20px] font-bold leading-snug mb-3">
                      {s.title}
                    </h3>

                    {/* Summary */}
                    <p className="text-gray-400 text-[14px] leading-relaxed flex-1 mb-5">
                      {s.summary}
                    </p>

                    {/* CTA */}
                    <div>
                      <div
                        className="inline-flex items-center gap-2 text-[13px] font-semibold py-2.5 px-6 rounded-full transition-all duration-200 group-hover:gap-3"
                        style={{ backgroundColor: BLUE, color: "#fff" }}
                      >
                        <span>Ver más</span>
                        <ArrowRight size={11} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── MODAL ─── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6 md:p-8"
            style={{ background: "rgba(7,16,29,0.75)", backdropFilter: "blur(14px)" }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-3xl sm:rounded-3xl w-full shadow-2xl overflow-hidden flex flex-col md:flex-row sm:max-w-[1100px]"
              style={{ maxHeight: "92vh" }}
            >
              {/* Mobile drag handle */}
              <div className="sm:hidden flex justify-center pt-3 pb-1 bg-white flex-shrink-0">
                <div className="w-10 h-1 rounded-full bg-gray-200" />
              </div>
              {/* Left: image */}
              <div className="relative md:w-[42%] h-40 sm:h-52 md:h-auto flex-shrink-0 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selected.photo} alt={selected.title} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: BLUE }} />
                <div className="absolute bottom-7 left-7 right-7">
                  <span
                    className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full mb-3"
                    style={{ backgroundColor: `rgba(${BLUE_RGB},0.85)`, color: "#fff" }}
                  >
                    <selected.icon size={10} strokeWidth={2} />
                    {selected.tagline}
                  </span>
                  <h2 className="text-white text-2xl font-bold leading-snug">{selected.title}</h2>
                </div>
              </div>

              {/* Right: content */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="h-1 flex-shrink-0" style={{ backgroundColor: BLUE }} />
                <div className="flex justify-end px-7 pt-5 flex-shrink-0">
                  <button
                    onClick={() => setSelected(null)}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    <X size={14} className="text-gray-500" />
                  </button>
                </div>
                <div className="overflow-y-auto flex-1 px-7 pb-8">
                  <p className="text-gray-500 text-[14.5px] leading-relaxed mb-7">{selected.description}</p>

                  <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-300 mb-4">
                    Qué incluye
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                    {selected.features.map((f, fi) => (
                      <div key={fi} className="flex items-start gap-3">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-px"
                          style={{ background: `rgba(${BLUE_RGB},0.1)` }}
                        >
                          <Check size={11} style={{ color: BLUE }} strokeWidth={2.5} />
                        </div>
                        <span className="text-gray-600 text-[13px] leading-snug">{f}</span>
                      </div>
                    ))}
                  </div>

                  <a
                    href="#contacto"
                    onClick={() => setSelected(null)}
                    className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl text-[14.5px] font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: BLUE, boxShadow: `0 6px 24px rgba(${BLUE_RGB},0.3)` }}
                  >
                    Consultar sobre {selected.title}
                    <ArrowRight size={14} />
                  </a>
                  <p className="text-center text-gray-400 text-xs mt-3">
                    Un especialista te responde en menos de 24 horas.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
