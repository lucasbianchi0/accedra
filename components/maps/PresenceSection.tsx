"use client";

import { motion } from "framer-motion";
import Globe from "./Globe";

const STATS = [
  {
    value: "+7 países",
    detail:
      "Presencia regional que nos permite conectar personas, ciudades y empresas a gran escala.",
  },
  {
    value: "+45 años",
    detail:
      "Evolucionando junto a nuestros clientes y acompañando la transformación tecnológica del continente.",
  },
  {
    value: "+10 oficinas",
    detail:
      "Equipos locales que aseguran soporte inmediato y conocimiento profundo de cada mercado.",
  },
];

export default function PresenceSection() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden bg-gradient-to-b from-[#0A1424] via-[#08111F] to-[#070F1B]">
      {/* Soft radial light behind the headline, like the reference */}
      <div
        className="absolute -top-40 -left-20 w-[900px] h-[900px] rounded-full pointer-events-none blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(43,111,212,0.14) 0%, transparent 62%)" }}
      />

      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left: copy + stats ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm font-semibold tracking-[0.22em] uppercase mb-6 text-blue-400">
              Presencia regional
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-[56px] font-bold leading-[1.08] mb-14 text-white">
              En Accedra integramos{" "}
              <span className="gradient-text">soluciones tecnológicas</span> para
              transformar empresas en América Latina
            </h2>

            <div className="grid sm:grid-cols-3 gap-8 sm:gap-6">
              {STATS.map((s) => (
                <div key={s.value}>
                  <div className="text-2xl md:text-3xl font-bold text-white mb-3">
                    {s.value}
                  </div>
                  <p className="text-gray-400 text-[13px] leading-relaxed max-w-[220px]">
                    {s.detail}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Right: dotted globe focused on Argentina ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6 }}
            className="order-first lg:order-last"
          >
            <Globe />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
