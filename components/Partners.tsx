"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";

const partners = [
  { name: "Cisco",              logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Cisco_logo_blue_2016.svg/250px-Cisco_logo_blue_2016.svg.png",                                              filter: "brightness(1.1) saturate(1.1)" },
  { name: "Microsoft",          logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/250px-Microsoft_logo_%282012%29.svg.png",                                    filter: "brightness(1.1) saturate(1.1)" },
  { name: "Palo Alto Networks", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/PaloAltoNetworks_2020_Logo.svg/250px-PaloAltoNetworks_2020_Logo.svg.png",                                  filter: "brightness(1.1) saturate(1.1)" },
  { name: "Dell EMC",           logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Dell_EMC_logo.svg/250px-Dell_EMC_logo.svg.png",                                                            filter: "brightness(1.3) saturate(1.1)" },
  { name: "Nutanix",            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Nutanix-Logo-Charcoal-Gray-Digital.svg/250px-Nutanix-Logo-Charcoal-Gray-Digital.svg.png",                  filter: "brightness(0) invert(1)" },
  { name: "IBM",                logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/250px-IBM_logo.svg.png",                                                                      filter: "brightness(1.2) saturate(1.1)" },
  { name: "Cisco Meraki",       logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Meraki_Logo_2016.svg/250px-Meraki_Logo_2016.svg.png",                                                      filter: "brightness(1.1) saturate(0.9)" },
  { name: "Wacom",              logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Wacom_logo.svg/250px-Wacom_logo.svg.png",                                                                  filter: "brightness(0) invert(1)" },
  { name: "VMware",             logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Vmware.svg/250px-Vmware.svg.png",                                                                          filter: "brightness(1.1) saturate(1.1)" },
  { name: "Oracle",             logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Oracle_logo.svg/250px-Oracle_logo.svg.png",                                                                filter: "brightness(1.1) saturate(1.1)" },
  { name: "Power BI",           logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/New_Power_BI_Logo.svg/250px-New_Power_BI_Logo.svg.png",                                                    filter: "brightness(1.1) saturate(1.1)" },
  { name: "Fortinet",           logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Fortinet_logo.svg/250px-Fortinet_logo.svg.png",                                                            filter: "brightness(1.1) saturate(1.1)" },
];

export default function Partners() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!gridRef.current) return;
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
            Ecosistema tecnológico
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Integramos las mejores tecnologías
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-xl mx-auto"
          >
            Partners certificados y distribuidores autorizados de las marcas líderes del mercado IT.
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="relative z-10 group flex flex-col items-center justify-center p-5 md:p-8 rounded-2xl border border-white/[0.08] cursor-default transition-all duration-300 hover:border-blue-500/30"
              style={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.08)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.1), 0 20px 60px rgba(43,111,212,0.15)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.04)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.06)";
              }}
            >
              <div className="h-14 flex items-center justify-center w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-10 max-w-[130px] w-auto h-auto object-contain transition-all duration-300 group-hover:scale-110"
                  style={{ filter: partner.filter }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-gray-600 text-xs mt-10"
        >
          Relaciones certificadas y distribuciones autorizadas.
        </motion.p>

      </div>
    </section>
  );
}
