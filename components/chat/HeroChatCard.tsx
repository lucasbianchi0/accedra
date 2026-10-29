"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ArrowUp, RotateCcw, Sparkles } from "lucide-react";
import { useChat } from "./ChatProvider";
import { enviar, reiniciar, useConversacion } from "@/lib/chat/store";
import { sugerenciasPara } from "@/lib/chat/sugerencias";

/**
 * El asistente a la derecha de cada portada (escritorio).
 *
 * La conversación pasa acá mismo, sin abrir nada: la persona escribe donde
 * está mirando. Es la misma charla que la del panel flotante —vive en
 * `lib/chat/store`—, así que al bajar por la página aparece el robotito y
 * sigue desde ahí.
 *
 * El primer estado (saludo, atajos y campo) es HTML liviano que sale con el
 * SSR. La conversación con sus tarjetas se carga recién con el primer mensaje,
 * o antes si hay intención (foco o mouse encima): no compite con el LCP.
 *
 * Sólo desde `lg`. En el teléfono no entra al lado del título, y abajo empuja
 * el resto de la portada: ahí el canal es el robotito (y en las soluciones,
 * el botón de WhatsApp, que es lo que la medición respalda).
 */

const cargarConversacion = () => import("./Conversacion");
const Conversacion = dynamic(cargarConversacion, {
  ssr: false,
  loading: () => <div className="flex-1" />,
});

export default function HeroChatCard({ solucion, accent = "#2560BC" }: { solucion?: string; accent?: string }) {
  const { setHeroVisible } = useChat();
  const { mensajes } = useConversacion();
  const { saludo, atajos } = sugerenciasPara(solucion);
  const [texto, setTexto] = useState("");
  const tarjeta = useRef<HTMLDivElement>(null);
  const origen = solucion ? `portada:${solucion}` : "portada";

  // Mientras se ve, el robotito flotante se esconde (sería el mismo chat dos veces).
  useEffect(() => {
    const el = tarjeta.current;
    if (!el) return;
    // Oculta (en el teléfono) mide 0 de ancho y no opina: si no, le pisaría el
    // aviso al campo compacto de la portada, que en ese tamaño sí se ve.
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.boundingClientRect.width > 0) setHeroVisible(e.isIntersecting);
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      setHeroVisible(false);
    };
  }, [setHeroVisible]);

  const precargar = () => void cargarConversacion();
  const mandar = (t: string) => {
    if (!t.trim()) return;
    void enviar(t, origen);
    setTexto("");
  };

  const vacio = mensajes.length === 0;

  return (
    <div
      ref={tarjeta}
      onPointerEnter={precargar}
      // Sin conversación no hay caja: la esfera, el título y el campo flotan
      // sobre la portada como un elemento más de ella. El marco aparece recién
      // cuando hay mensajes que contener.
      className={`relative hidden h-[clamp(460px,calc(100svh-220px),560px)] w-full flex-col rounded-[28px] border transition-[background-color,border-color,box-shadow] duration-500 lg:flex ${
        vacio ? "border-transparent" : "overflow-hidden border-white/10"
      }`}
      style={
        vacio
          ? undefined
          : {
              background: "radial-gradient(120% 70% at 50% 0%, rgba(37,96,188,0.16) 0%, rgba(7,14,26,0) 60%), rgba(7,14,26,0.82)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 40px 100px rgba(0,0,0,0.5)",
            }
      }
    >
      {vacio ? (
        <>
          {/* Sombra fuerte detrás del texto: va sobre el video de la portada, sin caja. */}
          <div
            className="flex flex-1 flex-col items-center justify-center px-8 text-center"
            style={{ textShadow: "0 2px 18px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.6)" }}
          >
            <Esfera accent={accent} />
            <p className="mt-6 text-[15px] font-medium text-gray-400">Asistente Accedra</p>
            <h2 className="font-display mt-1 text-[26px] font-semibold leading-tight tracking-tight text-white">
              ¿En qué podemos ayudarte?
            </h2>
            <p className="mt-3 max-w-[36ch] text-[13.5px] leading-relaxed text-gray-300">{saludo}</p>
          </div>

          <div className="px-4 pb-4">
            <div className="rounded-[20px] border border-white/10 bg-white/[0.04]">
              <p className="flex items-center gap-1.5 px-4 py-2 text-[11.5px] text-gray-400">
                <Sparkles size={12} style={{ color: accent }} />
                Un especialista sigue tu caso, sin costo
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  mandar(texto);
                }}
                className="rounded-[18px] border border-white/10 bg-[#060c17]/85 px-4 pb-3 pt-3.5 shadow-[0_24px_60px_rgba(0,0,0,0.45)] transition-colors focus-within:border-white/20"
              >
                <input
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  onFocus={precargar}
                  maxLength={1200}
                  autoComplete="off"
                  placeholder="Contanos tu caso…"
                  aria-label="Contale tu caso al asistente"
                  className="chat-campo w-full bg-transparent text-[14px] text-white placeholder:text-gray-500 outline-none"
                />
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
                    {atajos.map((a) => (
                      <button
                        key={a.label}
                        type="button"
                        onClick={() => mandar(a.texto)}
                        title={a.texto}
                        className="rounded-full border border-white/10 px-3 py-1.5 text-[12px] text-gray-300 transition-colors hover:border-white/25 hover:text-white"
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                  <button
                    type="submit"
                    disabled={!texto.trim()}
                    aria-label="Enviar"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-white transition-opacity disabled:opacity-40"
                    style={{ background: accent }}
                  >
                    <ArrowUp size={17} />
                  </button>
                </div>
              </form>
            </div>
            <p className="mt-2.5 text-center text-[11px] text-gray-600">Asistente con IA · puede equivocarse</p>
          </div>
        </>
      ) : (
        <>
          <header className="flex items-center justify-between border-b border-white/[0.07] px-5 py-3">
            <p className="flex items-center gap-2 text-[13px] font-medium text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Asistente Accedra
            </p>
            <button
              type="button"
              onClick={reiniciar}
              aria-label="Empezar de nuevo"
              title="Empezar de nuevo"
              className="rounded-full p-2 text-gray-500 transition-colors hover:bg-white/5 hover:text-white"
            >
              <RotateCcw size={15} />
            </button>
          </header>
          <Conversacion origen={origen} onNavegar={() => {}} />
        </>
      )}
    </div>
  );
}

/**
 * La esfera del asistente: un degradé cónico en los colores de la página que
 * gira despacio, con un brillo encima para que se lea como volumen y no como un
 * círculo plano. Sin animación si la persona pidió menos movimiento.
 */
function Esfera({ accent }: { accent: string }) {
  return (
    <div aria-hidden className="relative h-[92px] w-[92px]">
      <div className="absolute -inset-8 rounded-full opacity-60 blur-3xl" style={{ background: accent }} />
      {/* clip-path y no sólo overflow-hidden: Chrome deja escapar el blur por las esquinas. */}
      <div className="absolute inset-0 overflow-hidden rounded-full bg-[#0b1630]" style={{ clipPath: "circle(50%)" }}>
        <div
          className="absolute -inset-1/4 motion-safe:animate-[spin_12s_linear_infinite]"
          style={{
            background: `conic-gradient(from 0deg, ${accent}, #5fb4ff, #c084fc, #f0abfc, #38bdf8, #1e3a8a, ${accent})`,
            filter: "blur(6px)",
          }}
        />
        <div
          className="absolute -inset-1/4 mix-blend-screen motion-safe:animate-[spin_9s_linear_infinite_reverse]"
          style={{
            background:
              "conic-gradient(from 120deg, transparent 0deg, rgba(255,255,255,0.55) 40deg, transparent 90deg, transparent 200deg, rgba(125,211,252,0.6) 240deg, transparent 300deg)",
            filter: "blur(8px)",
          }}
        />
      </div>
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 32% 26%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 30%), radial-gradient(circle at 50% 90%, rgba(3,8,20,0.6) 0%, rgba(3,8,20,0) 55%)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.18), inset 0 -10px 24px rgba(0,0,0,0.35)",
        }}
      />
    </div>
  );
}
