"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ArrowUp, RotateCcw } from "lucide-react";
import Robot from "./Robot";
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
    const io = new IntersectionObserver(([e]) => setHeroVisible(e.isIntersecting && e.boundingClientRect.width > 0), {
      threshold: 0.25,
    });
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
      className="relative hidden h-[clamp(440px,calc(100svh-220px),540px)] w-full flex-col overflow-hidden rounded-[28px] border border-white/[0.12] lg:flex"
      style={{
        background: "linear-gradient(180deg, rgba(17,34,64,0.88) 0%, rgba(7,16,29,0.92) 100%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.14), 0 40px 100px rgba(0,0,0,0.5)",
      }}
    >
      {/* Brillo superior en el color de la página */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-28 left-1/2 h-56 w-[130%] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{ background: accent }}
      />

      <header className="relative flex items-center gap-3 border-b border-white/[0.06] px-5 py-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-gradient-to-br from-accent to-[#1c4f9c] text-white">
          <Robot size={24} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-[15px] font-semibold leading-tight text-white">Asistente Accedra</p>
          <p className="flex items-center gap-1.5 text-[11.5px] text-gray-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            En línea · un especialista sigue tu caso
          </p>
        </div>
        {!vacio && (
          <button
            type="button"
            onClick={reiniciar}
            aria-label="Empezar de nuevo"
            title="Empezar de nuevo"
            className="rounded-full p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <RotateCcw size={16} />
          </button>
        )}
      </header>

      {vacio ? (
        <>
          <div className="relative flex flex-1 flex-col px-5 py-5">
            <div className="flex gap-2.5">
              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/[0.06] text-accent-300">
                <Robot size={17} vivo={false} />
              </span>
              <div className="rounded-[20px] rounded-tl-md bg-white/[0.06] px-4 py-3 text-[14px] leading-relaxed text-gray-200">
                <p>Hola 👋 {saludo}</p>
                <p className="mt-1.5 text-[12.5px] text-gray-400">
                  Te muestro casos parecidos y, si querés, un especialista analiza tu proceso sin costo.
                </p>
              </div>
            </div>
            <div className="mt-auto space-y-2">
              <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">Por ejemplo</p>
              {atajos.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => mandar(a)}
                  className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-left text-[13px] text-gray-300 transition-all hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                >
                  {a}
                  <ArrowUp size={14} className="shrink-0 rotate-45 text-gray-600 transition-colors group-hover:text-white" />
                </button>
              ))}
            </div>
          </div>
          <div className="relative border-t border-white/[0.06] px-3 pb-3 pt-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                mandar(texto);
              }}
              className="flex items-center gap-2 rounded-[22px] border border-white/10 bg-white/[0.04] py-1.5 pl-4 pr-1.5 transition-colors focus-within:border-accent-300/40"
            >
              <input
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                onFocus={precargar}
                maxLength={1200}
                autoComplete="off"
                placeholder="Contanos tu caso…"
                aria-label="Contale tu caso al asistente"
                className="chat-campo min-w-0 flex-1 bg-transparent py-2 text-[14px] text-white placeholder:text-gray-500 outline-none"
              />
              <button
                type="submit"
                disabled={!texto.trim()}
                aria-label="Enviar"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-white transition-all disabled:opacity-40"
                style={{ background: accent }}
              >
                <ArrowUp size={17} />
              </button>
            </form>
            <p className="mt-2 px-1 text-[11px] text-gray-600">Asistente con IA · puede equivocarse</p>
          </div>
        </>
      ) : (
        <Conversacion origen={origen} onNavegar={() => {}} />
      )}
    </div>
  );
}
