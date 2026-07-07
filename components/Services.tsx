"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Network, SquarePen, LayoutDashboard, ShieldCheck, ArrowRight } from "lucide-react";

const BLUE_RGB = "43,111,212";

const photo = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=900`;

const columns = [
  {
    icon: Network,
    title: "Networking",
    slug: "networking",
    photo: photo(4682189),
    items: [
      "Switching & Routing",
      "Wireless",
      "Telefonía IP",
      "Seguridad",
      "Contingencia & Entorno",
      "Cableado estructurado",
    ],
  },
  {
    icon: SquarePen,
    title: "Firma Biométrica",
    slug: "firma-biometrica",
    featured: true,
    photo: photo(9929279),
    items: [
      "Transformación Digital",
      "Soluciones de Factoring Digital",
      "Firma Digital Biométrica",
      "eSignAnyWhere",
      "Soluciones Mobile",
      "Multi biometría",
    ],
  },
  {
    icon: LayoutDashboard,
    title: "Consultoría",
    slug: "consultoria",
    photo: photo(577210),
    items: [
      "Colaboración",
      "Power BI",
      "Dynamics 365",
      "SharePoint",
      "Office 365",
      "Gestión Documental",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Seguridad",
    slug: "seguridad",
    photo: photo(1181244),
    items: ["Cisco", "Palo Alto", "Umbrella", "AMP", "Cloud Security"],
  },
];

export default function Services() {
  return (
    <section id="servicios" className="py-20 lg:py-28 relative overflow-hidden bg-gradient-to-b from-[#0A1424] to-[#07101D]">

      {/* Premium aurora background */}
      <div className="absolute inset-x-0 top-0 h-[520px] pointer-events-none"
        style={{ background: `radial-gradient(ellipse 60% 100% at 50% 0%, rgba(${BLUE_RGB},0.15) 0%, transparent 70%)` }} />
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full pointer-events-none blur-2xl animate-float"
        style={{ background: `radial-gradient(circle, rgba(80,140,240,0.10) 0%, transparent 70%)` }} />
      <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full pointer-events-none blur-2xl animate-float-slow"
        style={{ background: `radial-gradient(circle, rgba(${BLUE_RGB},0.09) 0%, transparent 70%)` }} />

      <div className="relative z-10 max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }}
            className="text-xs font-semibold tracking-[0.22em] uppercase mb-3 text-blue-400">
            Lo que hacemos
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.06 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4">
            Soluciones IT end-to-end
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.11 }}
            className="text-gray-400 text-[15px] max-w-md mx-auto">
            Desde el cableado hasta la nube, cubrimos cada capa de tu infraestructura.
          </motion.p>
        </div>

        {/* Glass cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
          {columns.map((col, i) => {
            const Icon = col.icon;
            return (
              <motion.div
                key={col.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, delay: i * 0.09 }}
                className="group relative h-full"
              >
                {/* Hover glow */}
                <div
                  className="absolute -inset-1.5 rounded-[26px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-xl"
                  style={{ background: `radial-gradient(circle at 50% 0%, rgba(${BLUE_RGB},0.28), transparent 70%)` }}
                />

                {/* Lift wrapper — transforms (no clipping) so the rounded+overflow card never transforms */}
                <div className="relative h-full transition-transform duration-300 group-hover:-translate-y-1.5 transform-gpu">
                {/* Card — clips (no transform), solid bg so the image fade meets the body seamlessly */}
                <div
                  className="relative h-full rounded-3xl overflow-hidden border flex flex-col"
                  style={{
                    background: "#0D1A2D",
                    borderColor: col.featured ? `rgba(${BLUE_RGB},0.4)` : "rgba(255,255,255,0.09)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), 0 8px 30px rgba(0,0,0,0.3)",
                  }}
                >
                  {/* Featured blue tint (over solid bg, fades out before the seam) */}
                  {col.featured && (
                    <div className="absolute inset-0 pointer-events-none z-[1]"
                      style={{ background: `linear-gradient(160deg, rgba(${BLUE_RGB},0.14) 0%, transparent 38%)` }} />
                  )}

                  {/* Floating photo — a single masked image that fades to transparent into the card's
                      solid bg. No wrapper box and no fade layer, so there is no edge to reveal. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={col.photo}
                    alt={col.title}
                    draggable={false}
                    className="absolute top-0 inset-x-0 h-44 w-full object-cover pointer-events-none z-[1] transition-transform duration-500 group-hover:scale-105"
                    style={{
                      maskImage: "linear-gradient(to bottom, #000 42%, transparent 92%)",
                      WebkitMaskImage: "linear-gradient(to bottom, #000 42%, transparent 92%)",
                    }}
                  />

                  {/* Featured badge */}
                  {col.featured && (
                    <span
                      className="absolute top-4 right-4 z-10 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full"
                      style={{ background: `rgba(${BLUE_RGB},0.3)`, color: "#EAF2FE", border: `1px solid rgba(${BLUE_RGB},0.5)`, backdropFilter: "blur(4px)" }}
                    >
                      Diferencial
                    </span>
                  )}

                  {/* Content — flows over the card's continuous solid surface */}
                  <div className="relative z-[2] pt-[116px] px-6 pb-6 flex-1 flex flex-col">
                    {/* Icon chip */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-105"
                      style={{
                        background: `rgba(${BLUE_RGB},0.15)`,
                        border: `1px solid rgba(${BLUE_RGB},0.3)`,
                        backdropFilter: "blur(8px)",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
                      }}
                    >
                      <Icon size={22} strokeWidth={1.7} style={{ color: "#3B8EF0" }} />
                    </div>

                    {/* Title (clickable → solution page) */}
                    <Link href={`/soluciones/${col.slug}`} className="w-fit">
                      <h3 className="text-white text-xl font-bold tracking-tight uppercase mb-4 hover:text-blue-200 transition-colors">
                        {col.title}
                      </h3>
                    </Link>

                    {/* Items (each clickable → solution page) */}
                    <ul className="divide-y divide-white/[0.06] mb-5">
                      {col.items.map((item) => (
                        <li key={item}>
                          <Link
                            href={`/soluciones/${col.slug}`}
                            className="flex items-center gap-2.5 py-2.5 group/item"
                          >
                            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors duration-200"
                              style={{ background: `rgba(${BLUE_RGB},0.55)` }} />
                            <span className="text-gray-400 text-[14px] leading-none transition-colors duration-200 group-hover/item:text-blue-200">
                              {item}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>

                    {/* Ver solución */}
                    <Link
                      href={`/soluciones/${col.slug}`}
                      className="mt-auto inline-flex items-center gap-1.5 text-[13px] font-semibold text-blue-300 hover:text-white transition-colors group/link"
                    >
                      Ver solución
                      <ArrowRight size={13} className="transition-transform group-hover/link:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 text-center"
        >
          <p className="text-gray-500 text-[15px]">¿No sabés por dónde empezar?</p>
          <a
            href="#contacto"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white group px-6 py-3 rounded-full transition-all duration-200 hover:gap-3"
            style={{ background: "#2B6FD4", boxShadow: `0 8px 28px rgba(${BLUE_RGB},0.35)` }}
          >
            Hablá con un experto
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
          </a>
        </motion.div>

      </div>
    </section>
  );
}
