"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import Robot from "./Robot";
import { useChat } from "./ChatProvider";
import { enviar, reiniciar, useConversacion } from "@/lib/chat/store";
import { sugerenciasPara } from "@/lib/chat/sugerencias";

/**
 * El chat a la derecha de la portada (escritorio).
 *
 * Es la misma ventana que el panel flotante —mismo encabezado, mismos
 * mensajes, mismas tarjetas— y la conversación pasa acá mismo. Vive en
 * `lib/chat/store`, así que al bajar por la página el robotito la retoma donde
 * quedó.
 *
 * La conversación (formato, tarjetas, formulario) se carga aparte: mientras
 * llega se pinta el saludo y un campo igual al real, así la portada no salta y
 * no compite con el LCP del título.
 *
 * Sólo desde `lg`: en el teléfono no entra al lado del título y abajo empuja
 * la portada entera. Ahí está el robotito.
 */

const Conversacion = dynamic(() => import("./Conversacion"), {
  ssr: false,
  loading: () => (
    <>
      <div className="flex-1" />
      <div className="border-t border-white/[0.06] px-3 pb-3 pt-3">
        <div className="h-[46px] rounded-[22px] border border-white/10 bg-white/[0.04]" />
        <div className="mt-2 h-[17px]" />
      </div>
    </>
  ),
});

export default function ChatPortada({ solucion }: { solucion?: string }) {
  const { setHeroVisible } = useChat();
  const { mensajes } = useConversacion();
  const { titulo, atajos } = sugerenciasPara(solucion);
  const ventana = useRef<HTMLDivElement>(null);
  const origen = solucion ? `portada:${solucion}` : "portada";

  // Con el chat de la portada a la vista, el robotito flotante sobra. Oculto
  // (en el teléfono) mide 0 de ancho y no opina.
  useEffect(() => {
    const el = ventana.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.boundingClientRect.width > 0) setHeroVisible(e.isIntersecting);
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      setHeroVisible(false);
    };
  }, [setHeroVisible]);

  return (
    <div
      ref={ventana}
      className="relative hidden h-[clamp(470px,calc(100svh-190px),580px)] w-full flex-col overflow-hidden rounded-[26px] border border-white/10 bg-navy-800/[0.94] shadow-[0_30px_90px_rgba(0,0,0,0.55)] lg:flex"
    >
      <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 h-56 w-[120%] -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />

      <header className="relative flex items-center gap-3 border-b border-white/[0.06] px-4 py-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-gradient-to-br from-accent to-[#1c4f9c] text-white">
          <Robot size={22} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-[15px] font-semibold leading-tight text-white">Asistente Accedra</p>
          <p className="flex items-center gap-1.5 text-[11.5px] text-gray-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Responde al instante · un especialista sigue tu caso
          </p>
        </div>
        {mensajes.length > 0 && (
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

      <Conversacion
        origen={origen}
        onNavegar={() => {}}
        placeholder="Contanos tu caso…"
        inicio={
          <div className="flex min-h-full flex-col">
            <div className="flex gap-2.5">
              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/[0.06] text-accent-300">
                <Robot size={17} vivo={false} />
              </span>
              <div className="text-[14px] leading-relaxed text-gray-200">
                <p className="font-semibold text-white">{titulo}</p>
                <p className="mt-1 text-gray-400">
                  Contame tu caso y te digo cómo lo resolveríamos, con ejemplos de empresas donde ya lo hicimos.
                </p>
              </div>
            </div>
            <div className="mt-auto space-y-2 pt-5">
              {atajos.slice(0, 4).map(({ label, texto, icono: Icono }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => void enviar(texto, `${origen}:atajo`)}
                  className="group flex w-full items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-left text-[13.5px] text-gray-300 transition-all hover:border-accent-300/30 hover:bg-white/[0.06] hover:text-white"
                >
                  <Icono size={16} className="shrink-0 text-gray-500 transition-colors group-hover:text-accent-300" />
                  <span className="flex-1">{texto}</span>
                  <ArrowRight size={14} className="shrink-0 text-gray-600 transition-colors group-hover:text-accent-300" />
                </button>
              ))}
            </div>
          </div>
        }
      />
    </div>
  );
}
