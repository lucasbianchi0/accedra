"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Capability } from "./solutionsData";
import { Reveal, RevealGroup, revealItem } from "@/components/Reveal";


// Fade de la foto hacia el fondo de la card (sin borde/línea dura).
// Empieza al 62%: arrancando al 42% el difuminado se comía media foto y las
// imágenes perdían definición. El oscurecido extra que necesita el texto al
// subir en hover NO se resuelve acá —`mask-image` no se puede transicionar de
// forma confiable— sino con la capa de opacidad de abajo.
const PHOTO_MASK = "linear-gradient(to bottom, #000 62%, transparent 100%)";

export default function CapabilitiesBento({
  slug, title, items, consultable = false,
}: {
  slug: string;
  eyebrow: string;
  title: string;
  items: Capability[];
  consultable?: boolean; // muestra el botón "Consultar" en hover (solo páginas base, no industria)
}) {
  return (
    <section id="capacidades" data-solution={slug} className="section scroll-mt-24 relative">
      {/* Sin fondo ni spotlight propios: el clima (luz + grano) lo pone
          AmbientLight a nivel de página. El spotlight central que había acá
          convertía la sección en un bloque más iluminado que sus vecinas y marcaba
          las costuras arriba y abajo. */}
      <div className="relative z-10 w-full max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="section-head">
          <Reveal as="h2" delay={0.08} className="section-title mt-0">{title}</Reveal>
        </div>

        <RevealGroup className="grid md:grid-cols-2 lg:grid-cols-3 gap-5" stagger={0.15} amount={0.12}>
          {items.map((c) => {
            return (
              <motion.div key={c.title}
                variants={revealItem}
                className="group relative rounded-card overflow-hidden flex flex-col border border-white/10 transition-colors duration-300"
                style={{
                  // Vidrio premium (mismo material que Testimonials/bento/proceso):
                  // fill translúcido + blur + brillo interior, no un navy sólido.
                  background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.025) 60%, rgba(255,255,255,0.015) 100%)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 8px 30px rgba(0,0,0,0.3)",
                }}
              >
                {/* Glow azul + borde que se enciende en hover (solo desktop) */}
                <div className="absolute inset-0 z-30 rounded-card opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ boxShadow: `inset 0 0 0 1px rgba(var(--accent-rgb,43,111,212),0.55), 0 34px 80px rgba(var(--accent-rgb,43,111,212),0.28)` }} />
                {/* Foto */}
                <div className="relative h-44">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.photo} alt="" aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ maskImage: PHOTO_MASK, WebkitMaskImage: PHOTO_MASK }} />
                  {/* Tinte de marca: se atenúa en hover para que la foto se encienda. */}
                  <div className="absolute inset-0 pointer-events-none transition-opacity duration-500 lg:group-hover:opacity-60"
                    style={{ background: `linear-gradient(155deg, rgba(var(--accent-rgb,43,111,212),0.22) 0%, rgba(13,26,45,0) 52%)` }} />
                  {/* Oscurecido inferior, en capa aparte del tinte porque va en la
                      dirección CONTRARIA: sube en hover. En reposo apenas apoya la
                      base de la foto; al pasar el mouse el texto sube 52px sobre la
                      imagen y necesita ese respaldo para seguir siendo legible. */}
                  <div className="absolute inset-0 pointer-events-none opacity-60 transition-opacity duration-500 lg:group-hover:opacity-100"
                    style={{ background: `linear-gradient(to bottom, transparent 30%, rgba(13,26,45,0.55) 68%, rgba(13,26,45,0.78) 100%)` }} />
                </div>

                {/* Texto (tamaño original). En hover TODO (texto + botón) sube con el mismo
                    transform, y el botón va pegado a 12px del texto → misma distancia en toda card. */}
                {/* `z-40` y no `z-10`: el glow del borde vive en z-30, así que el
                    texto quedaba por debajo. En hover el bloque sube 52px y se apoya
                    sobre la foto, donde tiene que leerse por encima de TODA capa. */}
                <div className="relative z-40 px-5 pb-5 pt-4 lg:pt-3 lg:pb-4 flex-1">
                  <div className="relative transition-transform duration-[600ms] ease-out lg:group-hover:-translate-y-[52px]">
                    <h3 className="text-white font-bold text-[21px] lg:text-[19px] leading-snug mb-2 lg:mb-1.5">{c.title}</h3>
                    {/* En reposo gris (jerarquía); en hover blanco, porque pasa a
                        leerse contra la foto y no contra el fondo plano de la card. */}
                    <p className="text-gray-400 lg:group-hover:text-white transition-colors duration-300 text-[13.5px] leading-relaxed">{c.desc}</p>
                    {/* Botón Consultar → form local: siempre 12px debajo del texto (mismo bloque) */}
                    {consultable && (
                      <Link href="#contacto" aria-label={`Consultar sobre ${c.title}`}
                        className="hidden lg:inline-flex items-center gap-1.5 absolute left-0 top-full mt-3 text-[13px] font-semibold text-white px-4 py-2 rounded-full opacity-0 transition-opacity duration-[600ms] ease-out group-hover:opacity-100 hover:gap-2.5"
                        style={{ background: "rgb(var(--accent-rgb,43,111,212))", boxShadow: `0 10px 26px rgba(var(--accent-rgb,43,111,212),0.5)` }}>
                        Consultar <ArrowRight size={14} />
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </RevealGroup>

      </div>
    </section>
  );
}
