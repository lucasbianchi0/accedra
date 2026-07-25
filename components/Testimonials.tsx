"use client";

import { useEffect, useRef, useState } from "react";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useT } from "@/lib/i18n/useT";

const BLUE_RGB = "43,111,212";

// El nombre no se traduce; quote/role salen del diccionario por índice.
const testimonials = [
  { name: "Germán C." },
  { name: "Sebastián S." },
  { name: "Gustavo I." },
];

const N = testimonials.length;
// Track con clones a los extremos → SIEMPRE hay peek a ambos lados (loop infinito):
// [clon del último, ...reales, clon del primero]. Posiciones 0..N+1.
const track = [testimonials[N - 1], ...testimonials, testimonials[0]];

export default function Testimonials() {
  const t = useT();
  const [pos, setPos] = useState(1); // posición en el track (arranca en el primer real)
  const [anim, setAnim] = useState(true);
  const [ready, setReady] = useState(false);
  const [w, setW] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setW(el.clientWidth);
      setReady(true);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Tras un salto sin animación (reset de clon), reactiva la animación al frame siguiente.
  useEffect(() => {
    if (anim) return;
    const id = requestAnimationFrame(() => setAnim(true));
    return () => cancelAnimationFrame(id);
  }, [anim]);

  // Ancho de cada slot según viewport (ahora el carrusel es full-bleed): en mobile
  // la card central domina con peeks chicos; en desktop entran ~3 y llenan el ancho.
  const frac = w < 700 ? 0.9 : w < 1100 ? 0.62 : 0.46;
  const slot = w ? w * frac : 560;
  const offset = w / 2 - (pos + 0.5) * slot;
  const go = (d: number) => { setAnim(true); setPos((p) => p + d); };

  // Al terminar el desplazamiento hacia un clon, salta (sin animación) a su real.
  const onEnd = () => {
    if (pos === 0) { setAnim(false); setPos(N); }
    else if (pos === N + 1) { setAnim(false); setPos(1); }
  };

  return (
    // Embebido dentro de WhyUs (cierra el bloque de confianza): sin <section> ni
    // container propios. Solo el separador superior + header + carrusel.
    <div className="mt-12 lg:mt-14 pt-12 lg:pt-14 pb-10 lg:pb-16 border-t border-white/10">
      <div>
        {/* Carrusel: card central enfocada, laterales difuminados (peek a ambos lados). */}
        <div
          ref={wrapRef}
          // overflow-x-clip (no overflow-hidden): oculta las cards de los costados
          // SIN recortar en vertical → la sombra/borde de la card activa no se corta.
          className="relative overflow-x-clip py-6"
          style={{
            width: "100vw",
            marginLeft: "calc(50% - 50vw)", // full-bleed: rompe el container y ocupa todo el ancho
            opacity: ready ? 1 : 0,
            transition: "opacity 400ms ease-out",
          }}
          onTouchStart={(e) => (startX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            const dx = e.changedTouches[0].clientX - startX.current;
            if (dx < -40) go(1);
            else if (dx > 40) go(-1);
          }}
        >
          <div
            className="flex items-center"
            style={{
              transform: `translate3d(${offset}px, 0, 0)`,
              transition: anim ? "transform 560ms cubic-bezier(0.22,1,0.36,1)" : "none",
            }}
            onTransitionEnd={onEnd}
          >
            {track.map((tm, k) => {
              const active = k === pos;
              return (
                <div key={k} className="shrink-0 px-3 sm:px-4" style={{ width: slot }}>
                  <div
                    onClick={() => !active && go(k > pos ? 1 : -1)}
                    className="transition-all duration-500 ease-out"
                    style={{
                      opacity: active ? 1 : 0.38,
                      filter: active ? "none" : "blur(3px)",
                      transform: active ? "scale(1)" : "scale(0.9)",
                      cursor: active ? "default" : "pointer",
                    }}
                  >
                    <div
                      className="relative rounded-card px-9 sm:px-11 pt-9 pb-9 border flex flex-col justify-center min-h-[240px] sm:min-h-[268px]"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        backdropFilter: "blur(16px)",
                        WebkitBackdropFilter: "blur(16px)",
                        borderColor: active ? `rgba(${BLUE_RGB},0.35)` : "rgba(255,255,255,0.09)",
                        boxShadow: active
                          ? `inset 0 1px 0 rgba(255,255,255,0.10), 0 28px 66px rgba(0,0,0,0.44), 0 0 0 1px rgba(${BLUE_RGB},0.12)`
                          : "inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 30px rgba(0,0,0,0.25)",
                      }}
                    >
                      {/* Comilla decorativa */}
                      <Quote size={34} className="text-blue-500/25 mb-5" />

                      {/* Lo que dice */}
                      <p className="text-gray-100 text-[18px] sm:text-[19px] leading-relaxed mb-7">
                        &ldquo;{t.testimonials.items[logicalOf(k)].quote}&rdquo;
                      </p>

                      {/* Autor: nombre + puesto (sin avatar) */}
                      <div>
                        <p className="text-white font-semibold text-[16px] leading-tight">{tm.name}</p>
                        <p className="text-gray-400 text-[13px] mt-0.5">{t.testimonials.items[logicalOf(k)].role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Controles: flechas + contador */}
        <div className="mt-8 flex items-center justify-center gap-5">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Anterior"
            className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-gray-300 transition-colors hover:border-blue-400/50 hover:text-white"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Siguiente"
            className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-gray-300 transition-colors hover:border-blue-400/50 hover:text-white"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

// El track tiene clones en 0 y N+1 → mapea cualquier posición del track a su
// índice real del diccionario.
function logicalOf(k: number) {
  return ((k - 1) % N + N) % N;
}
