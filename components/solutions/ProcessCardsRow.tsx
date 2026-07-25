"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Search, PencilRuler, ServerCog, Headset, ArrowRight } from "lucide-react";
import { Reveal, revealOnScroll } from "@/components/Reveal";


// Las 4 fases del método son las mismas (relevar → diseñar → implementar →
// operar); lo que cambia por solución es el nombre y la descripción de cada una.
const PHASE_ICONS = [Search, PencilRuler, ServerCog, Headset];

type Step = { title: string; desc: string };

// Pasos por solución — lenguaje corporativo, tono de metodología. Sin números ni
// datos duros inventados: describe CÓMO se trabaja en cada disciplina.
const BY_SLUG: Record<string, { name: string; steps: [Step, Step, Step, Step] }> = {
  networking: {
    name: "Networking",
    steps: [
      { title: "Relevamiento", desc: "Auditamos tu red, el tráfico y los puntos críticos de la operación." },
      { title: "Arquitectura", desc: "Diseñamos topología, redundancia y capacidad dimensionada a tu demanda real." },
      { title: "Despliegue", desc: "Implementamos con ventanas de cambio coordinadas y mínima interrupción." },
      { title: "Operación", desc: "Monitoreo proactivo y soporte gestionado, con un único responsable." },
    ],
  },
  seguridad: {
    name: "Seguridad",
    steps: [
      { title: "Evaluación", desc: "Mapeamos la superficie de ataque, vulnerabilidades y brechas de cumplimiento." },
      { title: "Arquitectura Zero Trust", desc: "Definimos políticas, segmentación y controles por capa según tu operación." },
      { title: "Implementación", desc: "Desplegamos perímetro, endpoints y accesos con cronograma acordado." },
      { title: "Monitoreo", desc: "Vigilancia continua y respuesta ante incidentes, de punta a punta." },
    ],
  },
  "firma-biometrica": {
    name: "Firma Biométrica",
    steps: [
      { title: "Relevamiento", desc: "Analizamos tus circuitos de firma y los requisitos de validez legal." },
      { title: "Diseño", desc: "Definimos dispositivos, integración y flujo documental a medida." },
      { title: "Integración", desc: "Implementamos e integramos con tus sistemas, con puesta en marcha guiada." },
      { title: "Soporte", desc: "Acompañamiento y mejora continua del circuito, con un único responsable." },
    ],
  },
  consultoria: {
    name: "Consultoría",
    steps: [
      { title: "Diagnóstico", desc: "Relevamos tu ecosistema Microsoft, licencias y madurez de datos." },
      { title: "Estrategia", desc: "Trazamos la hoja de ruta, el gobierno y las prioridades del negocio." },
      { title: "Implementación", desc: "Configuramos y desplegamos con adopción guiada de tus equipos." },
      { title: "Optimización", desc: "Mejora continua y soporte, con un único responsable de tu cuenta." },
    ],
  },
  "software-ai": {
    name: "Software & AI",
    steps: [
      { title: "Descubrimiento", desc: "Entendemos tu problema, tus datos y tus objetivos antes de construir." },
      { title: "Diseño", desc: "Definimos arquitectura, modelo y alcance del producto a medida." },
      { title: "Desarrollo", desc: "Construimos por iteraciones, con entregas frecuentes y validación continua." },
      { title: "Evolución", desc: "Mantenimiento, monitoreo de modelos y evolución del producto." },
    ],
  },
};

const FALLBACK: { name: string; steps: [Step, Step, Step, Step] } = {
  name: "",
  steps: [
    { title: "Diagnóstico", desc: "Relevamos infraestructura, operación y riesgos antes de proponer una solución." },
    { title: "Diseño", desc: "Arquitectura y plan a medida, dimensionado a tu operación real y documentado." },
    { title: "Implementación", desc: "Ejecución con cronograma acordado y ventanas de cambio coordinadas." },
    { title: "Soporte", desc: "Monitoreo continuo, con un único responsable de tu cuenta de punta a punta." },
  ],
};

export default function ProcessCardsRow({ slug = "" }: { slug?: string }) {
  const data = BY_SLUG[slug] ?? FALLBACK;

  // Spotlight que sigue al cursor: se escriben --mx/--my directo en el nodo de la
  // card (sin estado de React → sin re-render por cada movimiento del mouse).
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <section className="section relative overflow-hidden">
      <div className="container-x relative z-10">
        {/* Header con línea que se extiende a la derecha */}
        <div className="flex items-end gap-6 mb-14 lg:mb-16">
          <div className="min-w-0 max-w-2xl">
            <Reveal as="h2" delay={0.08} className="section-title text-left mt-0 text-balance">
              {/* Prefijo en blanco pleno, nombre de la solución en azul sólido:
                  una palabra de acento, sin el gradiente ni el gris lavado. */}
              Cómo trabajamos{data.name ? " en " : ""}
              {data.name && <span style={{ color: "rgb(var(--accent-rgb,43,111,212))" }}>{data.name}</span>}
            </Reveal>
          </div>
          <div className="hidden sm:block flex-1 h-px mb-3.5"
            style={{ background: `linear-gradient(90deg, rgba(var(--accent-rgb,43,111,212),0.5), transparent)` }} />
        </div>

        {/* 4 cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {data.steps.map((s, i) => {
            const Ic = PHASE_ICONS[i];
            return (
              <motion.div
                key={s.title}
                {...revealOnScroll}
                onMouseMove={handleMove}
                className="group relative flex flex-col items-start text-left rounded-panel p-8 overflow-hidden transition-transform duration-300 hover:-translate-y-1.5"
                style={{
                  // Profundidad de vidrio: gradiente vertical (más claro arriba) en
                  // vez de un fill plano, para que lea como panel translúcido real.
                  background: "linear-gradient(180deg, rgba(255,255,255,0.065) 0%, rgba(255,255,255,0.02) 60%, rgba(255,255,255,0.012) 100%)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.13), 0 18px 48px rgba(0,0,0,0.38)",
                }}
              >
                {/* Hairline de luz en el borde superior (canto biselado del vidrio) */}
                <div className="absolute inset-x-6 top-0 h-px pointer-events-none z-10"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)" }} />
                {/* Glow suave arriba: da volumen, como luz cayendo sobre el panel */}
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[240px] h-[160px] rounded-full blur-3xl pointer-events-none"
                  style={{ background: `radial-gradient(circle, rgba(var(--accent-rgb,43,111,212),0.12), transparent 70%)` }} />

                {/* Spotlight que sigue el cursor (opción 5) */}
                <div className="absolute inset-0 rounded-panel opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: `radial-gradient(340px circle at var(--mx, 50%) var(--my, 50%), rgba(var(--accent-rgb,43,111,212),0.16), transparent 60%)` }} />

                {/* Hover de borde azul, como en Capacidades y Casos */}
                <div className="absolute inset-0 z-20 rounded-panel opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ boxShadow: `inset 0 0 0 1px rgba(var(--accent-rgb,43,111,212),0.5), 0 30px 70px rgba(var(--accent-rgb,43,111,212),0.22)` }} />

                {/* Ícono en tile de vidrio */}
                <div className="relative z-10 mb-6 w-[52px] h-[52px] rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-105"
                  style={{ background: `rgba(var(--accent-rgb,43,111,212),0.14)`, border: `1px solid rgba(var(--accent-rgb,43,111,212),0.3)`, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)" }}>
                  <Ic size={24} strokeWidth={1.7} className="text-accent" />
                </div>

                {/* Título */}
                <h3 className="relative z-10 text-white text-[21px] font-bold mb-3">{s.title}</h3>

                {/* Descripción */}
                <p className="relative z-10 text-gray-400 text-[14.5px] leading-relaxed">{s.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Cierre en banda de marca: azul pleno + botón blanco invertido. Remata la
            sección oscura con un golpe de color intencional y jerarquiza el CTA. */}
        <Reveal as="div" delay={0.28} className="mt-6">
          <div className="cta-ocean relative overflow-hidden rounded-panel px-8 sm:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-6"
            style={{ border: `1px solid rgba(var(--accent-rgb,43,111,212),0.35)`, boxShadow: "0 24px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -50px 80px rgba(0,0,0,0.4)" }}>
            {/* Reflejos de luz que derivan sobre la superficie oscura, a distinto
                ritmo → la superficie ondula, encima del gradiente que se desplaza. */}
            <div className="absolute -top-24 -right-10 w-80 h-80 rounded-full blur-3xl pointer-events-none cta-drift-a"
              style={{ background: "radial-gradient(circle, rgba(90,162,245,0.28), transparent 70%)" }} />
            <div className="absolute -bottom-28 left-1/4 w-72 h-72 rounded-full blur-3xl pointer-events-none cta-drift-b"
              style={{ background: "radial-gradient(circle, rgba(43,111,212,0.32), transparent 70%)" }} />
            {/* Trama de puntos que se desvanece: llena el vacío del medio sin ruido */}
            <div className="absolute inset-0 opacity-[0.14] pointer-events-none"
              style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)", backgroundSize: "22px 22px", maskImage: "linear-gradient(90deg, transparent, #000 60%)", WebkitMaskImage: "linear-gradient(90deg, transparent, #000 60%)" }} />

            <div className="relative text-center sm:text-left">
              <p className="text-white text-[19px] sm:text-[21px] font-bold mb-1.5 leading-snug">Agendemos una reunión y contanos tu desafío.</p>
              <p className="text-white/80 text-[14px]">Sin costo y sin compromiso · te respondemos en 24 h hábiles.</p>
            </div>
            <Link href="#contacto"
              className="relative flex-shrink-0 inline-flex items-center gap-2 pl-6 pr-2 py-2.5 rounded-full text-[15px] font-semibold transition-all hover:gap-3"
              style={{ background: "#ffffff", color: "#1E4C97", boxShadow: "0 10px 30px rgba(0,0,0,0.28)" }}>
              Agendar una reunión
              <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(30,76,151,0.12)" }}>
                <ArrowRight size={15} />
              </span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
