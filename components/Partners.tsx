"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { useT } from "@/lib/i18n/useT";
import { partners } from "./partnersData";

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
          className="relative"
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

          {/* Grid — en mobile muestra 8 logos (4 filas); el resto se oculta */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {partners.map((partner, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 14, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className={`relative z-10 h-full ${i >= 8 ? "max-md:hidden" : ""}`}
            >
              {/* Desktop: flip card (logo → descripción en hover) */}
              <div className="hidden md:block flip-card h-[168px] cursor-default">
                <div className="flip-inner">
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
              </div>

              {/* Mobile: sólo el logo */}
              <div
                className="md:hidden h-[84px] rounded-2xl border border-white/[0.08] px-4 flex items-center justify-center"
                style={{ backgroundColor: "rgba(255,255,255,0.04)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-8 max-w-[120px] w-auto h-auto object-contain"
                  style={{ filter: partner.filter }}
                />
              </div>
            </motion.div>
          ))}
          </div>

          {/* Mobile: la última fila se disuelve de a poco hacia el mensaje */}
          <div
            className="md:hidden relative z-20 -mt-28 pt-28 pb-2 flex items-end justify-center pointer-events-none"
            style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(7,16,29,0.92) 52%, #07101D 66%)" }}
          >
            <div
              className="pill-premium pointer-events-auto inline-flex items-center gap-2.5 pl-3.5 pr-4 py-2.5 rounded-full border border-blue-500/30"
              style={{ background: "linear-gradient(135deg, #17335A, #0C1A31)", boxShadow: "0 14px 34px rgba(43,111,212,0.28)" }}
            >
              <ShieldCheck size={15} className="text-blue-400 flex-shrink-0 relative z-10" />
              <span className="relative z-10 text-white text-[13.5px] font-semibold">{t.partners.mobileMore}</span>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 hidden md:flex justify-center"
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
