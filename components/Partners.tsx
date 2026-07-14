"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { useT } from "@/lib/i18n/useT";

const partners = [
  { name: "Cisco",              logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Cisco_logo_blue_2016.svg/250px-Cisco_logo_blue_2016.svg.png",                                              filter: "brightness(1.1) saturate(1.1)", blurb: "Líder mundial en redes empresariales: switching, routing y conectividad de alta disponibilidad." },
  { name: "Microsoft",          logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/250px-Microsoft_logo_%282012%29.svg.png",                                    filter: "brightness(1.1) saturate(1.1)", blurb: "Nube Azure, identidad y productividad corporativa con gobernanza y seguridad integradas." },
  { name: "Palo Alto Networks", logo: "https://commons.wikimedia.org/wiki/Special:FilePath/Palo-Alto-Networks-logo.svg?width=240",     filter: "brightness(1.1) saturate(1.1)", blurb: "Firewalls de nueva generación y seguridad Zero Trust para proteger toda la red." },
  { name: "Nutanix",            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Nutanix-Logo-Charcoal-Gray-Digital.svg/250px-Nutanix-Logo-Charcoal-Gray-Digital.svg.png", filter: "brightness(0) invert(1)", blurb: "Infraestructura hiperconvergente y nube híbrida que simplifica el datacenter." },
  { name: "Wacom",              logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Wacom_logo.svg/250px-Wacom_logo.svg.png",                                                 filter: "brightness(0) invert(1)", blurb: "Tabletas de firma y digitalización biométrica para trámites 100% digitales." },
  { name: "Pure Storage",       logo: "https://commons.wikimedia.org/wiki/Special:FilePath/Pure-storage-vector-logo.svg?width=240",     filter: "brightness(0) invert(1)", blurb: "Almacenamiento all-flash de alto rendimiento con eficiencia y simplicidad de gestión." },
  { name: "Vicarius",           logo: "https://www.google.com/s2/favicons?domain=vicarius.io&sz=128",                                    filter: "brightness(1.1) saturate(1.1)", blurb: "Gestión y remediación automática de vulnerabilidades en tiempo real." },
  { name: "Verge.IO",           logo: "https://www.google.com/s2/favicons?domain=verge.io&sz=128",                                       filter: "brightness(1.1) saturate(1.1)", blurb: "Virtualización e infraestructura definida por software en una sola plataforma." },
  { name: "APC by Schneider",   logo: "https://commons.wikimedia.org/wiki/Special:FilePath/APC%20by%20Schneider%20Electric.png?width=240", filter: "brightness(1.1) saturate(1.1)", blurb: "Energía ininterrumpida (UPS) y protección eléctrica para infraestructura crítica." },
  { name: "HPE Aruba",          logo: "https://commons.wikimedia.org/wiki/Special:FilePath/Hpe-aruba-networking-logo.svg?width=240",     filter: "brightness(1.1) saturate(1.1)", blurb: "Redes Wi-Fi empresariales y acceso seguro con inteligencia en el borde." },
  { name: "CommScope",          logo: "https://commons.wikimedia.org/wiki/Special:FilePath/Commscope-logo.png?width=240",                filter: "brightness(0) invert(1)", blurb: "Cableado estructurado e infraestructura de conectividad de misión crítica." },
  { name: "Dahua",              logo: "https://commons.wikimedia.org/wiki/Special:FilePath/Dahua%20Technology%20logo.svg?width=240",     filter: "brightness(1.1) saturate(1.1)", blurb: "Videovigilancia y soluciones de seguridad electrónica basadas en IA." },
  { name: "Hikvision",          logo: "https://commons.wikimedia.org/wiki/Special:FilePath/Hikvision%20logo.svg?width=240",             filter: "brightness(1.1) saturate(1.1)", blurb: "Cámaras IP y sistemas de videovigilancia inteligente para todo tipo de entorno." },
  { name: "TP-Link",            logo: "https://www.google.com/s2/favicons?domain=tp-link.com&sz=128",                                    filter: "brightness(1.1) saturate(1.1)", blurb: "Networking y conectividad Wi-Fi confiable para empresas y sucursales." },
  { name: "Namirial",           logo: "https://www.google.com/s2/favicons?domain=namirial.com&sz=128",                                   filter: "brightness(1.1) saturate(1.1)", blurb: "Firma electrónica y digitalización de procesos con validez legal." },
  { name: "Check Point",        logo: "https://commons.wikimedia.org/wiki/Special:FilePath/Check%20Point%20logo%202022.svg?width=240",  filter: "brightness(1.1) saturate(1.1)", blurb: "Ciberseguridad y protección perimetral de red con prevención de amenazas avanzada." },
];

const canHover = () => window.matchMedia("(hover: hover)").matches;

export default function Partners() {
  const t = useT();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canHover() || !gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <section id="partners" className="py-16 lg:py-24 bg-[#07101D] relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">

        {/* Header */}
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold tracking-[0.2em] uppercase text-blue-400 mb-3"
          >
            {t.partners.eyebrow}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            {t.partners.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-xl mx-auto"
          >
            {t.partners.subtitle}
          </motion.p>
        </div>

        {/* Spotlight glass grid */}
        <div
          ref={gridRef}
          className="relative grid grid-cols-2 lg:grid-cols-4 gap-4"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setActive(true)}
          onMouseLeave={() => setActive(false)}
        >
          {/* Spotlight glow */}
          <div
            className="absolute inset-0 pointer-events-none z-0 rounded-3xl transition-opacity duration-300"
            style={{
              opacity: active ? 1 : 0,
              background: active
                ? `radial-gradient(500px circle at ${mouse.x}px ${mouse.y}px, rgba(43,111,212,0.12), transparent 65%)`
                : "transparent",
            }}
          />

          {partners.map((partner, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 14, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="flip-card relative z-10 h-[132px] md:h-[168px] cursor-default"
            >
              <div className="flip-inner">
                {/* Front — logo */}
                <div
                  className="flip-face flip-front border border-white/[0.08]"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.04)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                  }}
                >
                  <div className="h-14 flex items-center justify-center w-full px-5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="max-h-10 max-w-[130px] w-auto h-auto object-contain"
                      style={{ filter: partner.filter }}
                    />
                  </div>
                </div>

                {/* Back — descripción (solo desktop, en hover) */}
                <div
                  className="flip-face flip-back flex-col text-center px-5 md:px-6 border border-blue-500/30"
                  style={{
                    background: "linear-gradient(160deg, rgba(43,111,212,0.18), rgba(13,26,45,0.92))",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), 0 20px 60px rgba(43,111,212,0.2)",
                  }}
                >
                  <p className="text-sm font-semibold text-white mb-1.5">{partner.name}</p>
                  <p className="text-[13px] text-gray-300 leading-relaxed">{t.partners.blurbs[i]}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 flex justify-center"
        >
          <div
            className="pill-premium inline-flex items-center gap-2.5 pl-3.5 pr-4 py-2 rounded-full border border-blue-500/20"
            style={{
              background: "linear-gradient(135deg, rgba(43,111,212,0.10), rgba(255,255,255,0.02))",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            <ShieldCheck size={16} className="text-blue-400 flex-shrink-0 relative z-10" />
            <span className="relative z-10 text-gray-300 text-[13px] font-medium">
              {t.partners.pill}
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
