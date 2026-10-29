"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUp } from "lucide-react";
import Robot from "./Robot";
import { useChat } from "./ChatProvider";
import { IconoWhatsApp, enlaceWhatsApp } from "./Tarjetas";
import { reiniciar, useConversacion } from "@/lib/chat/store";
import { sugerenciasPara } from "@/lib/chat/sugerencias";
import { track } from "@/lib/track";

/**
 * El asistente en la portada, abajo y al centro, donde antes iba la barra de
 * números (que pasó a la derecha del título).
 *
 * Una pregunta, un campo grande y una fila de acciones: la forma que ya
 * reconoce cualquiera que usó un asistente, con el material de la portada —el
 * mismo vidrio que el bloque de números, sin `backdrop-filter` para que el
 * fade de entrada no haga saltar el color—.
 *
 * Lo que se escribe abre el panel con el mensaje ya mandado; la conversación
 * no pasa acá, así la portada no cambia de forma mientras alguien la usa.
 */

/** El ejemplo del campo se escribe solo, con los casos de la página. */
function useMaquina(frases: string[], activa: boolean): string {
  const [e, setE] = useState({ i: 0, n: 0, borrando: false, pausa: 0 });

  useEffect(() => {
    if (!activa || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => {
      setE((s) => {
        const frase = frases[s.i % frases.length];
        if (s.pausa > 0) return { ...s, pausa: s.pausa - 1 };
        if (!s.borrando) return s.n < frase.length ? { ...s, n: s.n + 1 } : { ...s, borrando: true, pausa: 40 };
        return s.n > 0 ? { ...s, n: Math.max(0, s.n - 3) } : { i: s.i + 1, n: 0, borrando: false, pausa: 6 };
      });
    }, 45);
    return () => clearInterval(t);
  }, [activa, frases]);

  const frase = frases[e.i % frases.length];
  return activa ? frase.slice(0, e.n) : frase;
}

const VIDRIO = {
  borderColor: "rgba(255,255,255,0.18)",
  background: "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 100%), rgba(14,26,46,0.6)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), 0 24px 60px rgba(0,0,0,0.42)",
} as const;

export default function HeroAsistente({
  solucion,
  accent = "#2560BC",
  className = "",
}: {
  solucion?: string;
  accent?: string;
  className?: string;
}) {
  const { abrir, precargar, setHeroVisible } = useChat();
  const { mensajes } = useConversacion();
  const { titulo, atajos } = sugerenciasPara(solucion);
  const [texto, setTexto] = useState("");
  const [enfocado, setEnfocado] = useState(false);
  const [frases] = useState(() => atajos.map((a) => a.texto));
  const raiz = useRef<HTMLDivElement>(null);
  const origen = solucion ? `portada:${solucion}` : "portada";
  const escribiendo = useMaquina(frases, !texto && !enfocado);

  // Mientras se ve, el robotito flotante se esconde: sería la misma puerta dos
  // veces. Oculto (display: none) mide 0 de ancho y no opina.
  useEffect(() => {
    const el = raiz.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.boundingClientRect.width > 0) setHeroVisible(e.isIntersecting);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      setHeroVisible(false);
    };
  }, [setHeroVisible]);

  const mandar = (t: string, de = origen) => {
    if (!t.trim()) return;
    abrir(t, de);
    setTexto("");
  };

  return (
    <div ref={raiz} onPointerEnter={precargar} className={`relative mx-auto w-full max-w-[880px] ${className}`}>
      {/* Luz detrás de la pregunta, como un foco sobre el campo */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[260px] w-[min(900px,120%)] -translate-x-1/2 -translate-y-16 rounded-[50%] opacity-60 blur-3xl"
        style={{ background: `radial-gradient(closest-side, ${accent}40, transparent)` }}
      />

      <h2
        className="font-display relative text-center text-[26px] font-semibold leading-tight tracking-[-0.01em] text-white sm:text-[34px]"
        style={{ textShadow: "0 2px 18px rgba(0,0,0,0.7)" }}
      >
        {titulo}
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          mandar(texto);
        }}
        className="relative mt-6 overflow-hidden rounded-[24px] border transition-colors focus-within:!border-white/35"
        style={VIDRIO}
      >
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)" }} />

        <label htmlFor={`hero-caso-${origen}`} className="sr-only">
          Contanos tu caso
        </label>
        <div className="relative">
          <textarea
            id={`hero-caso-${origen}`}
            rows={2}
            value={texto}
            maxLength={1200}
            onChange={(e) => setTexto(e.target.value)}
            onFocus={() => {
              setEnfocado(true);
              precargar();
            }}
            onBlur={() => setEnfocado(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                mandar(texto);
              }
            }}
            placeholder={enfocado ? "Contanos tu caso: qué hace tu empresa y qué te está frenando…" : undefined}
            className="chat-campo block w-full resize-none bg-transparent px-5 pt-4 text-[16px] leading-relaxed text-white placeholder:text-gray-500 outline-none sm:px-6 sm:pt-5"
          />
          {/* El ejemplo que se escribe solo va encima y no como placeholder:
              un placeholder que cambia cada 45 ms lo releen los lectores de
              pantalla en cada cambio. */}
          {!texto && !enfocado && (
            <p aria-hidden className="pointer-events-none absolute inset-x-5 top-4 truncate text-[16px] leading-relaxed text-gray-500 sm:inset-x-6 sm:top-5">
              {escribiendo}
              <span className="hero-cursor ml-px inline-block h-[1.05em] w-px translate-y-[3px] bg-gray-400" />
            </p>
          )}
        </div>

        {/* Barra inferior del campo */}
        <div className="flex items-center gap-2 px-3 pb-3 pt-2 sm:px-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1.5 pl-2 pr-3 text-[12.5px] text-gray-300">
            <span className="text-accent-300">
              <Robot size={18} />
            </span>
            Asistente Accedra
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-label="En línea" />
          </span>
          <span className="ml-auto hidden text-[12px] text-gray-500 md:inline">
            Responde al instante · un especialista sigue tu caso
          </span>
          <a
            href={enlaceWhatsApp("Hola, quisiera hablar con un especialista de Accedra.")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track({ type: "click", name: "whatsapp", target: `asistente:${origen}` })}
            aria-label="Hablar con una persona por WhatsApp"
            title="Hablar con una persona"
            className="ml-auto grid h-9 w-9 place-items-center rounded-full border border-white/10 text-gray-400 transition-colors hover:border-[#25D366]/50 hover:text-[#25D366] md:ml-2"
          >
            <IconoWhatsApp size={15} />
          </a>
          <button
            type="submit"
            disabled={!texto.trim()}
            aria-label="Enviar al asistente"
            className="grid h-9 w-9 place-items-center rounded-full text-white transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
            style={{ background: accent }}
          >
            <ArrowUp size={17} />
          </button>
        </div>
      </form>

      {/* Acciones: en el teléfono se deslizan de costado en vez de apilarse. */}
      <div className="no-scrollbar relative -mx-5 mt-4 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
        {atajos.map(({ label, texto: t, icono: Icono }) => (
          <button
            key={label}
            type="button"
            onClick={() => mandar(t, `${origen}:atajo`)}
            title={t}
            className="inline-flex shrink-0 items-center gap-2 rounded-[12px] border border-white/[0.14] bg-[rgba(14,26,46,0.55)] px-3.5 py-2 text-[13px] text-gray-300 transition-colors hover:border-white/30 hover:text-white"
          >
            <Icono size={15} className="text-gray-400" />
            {label}
          </button>
        ))}
      </div>

      {mensajes.length > 0 && (
        <div className="relative mt-4 flex items-center justify-center gap-5 text-[13px]">
          <button
            type="button"
            onClick={() => abrir(undefined, origen)}
            className="inline-flex items-center gap-1.5 font-semibold text-white transition-all hover:gap-2.5"
          >
            Seguir tu conversación
            <ArrowRight size={14} />
          </button>
          <button type="button" onClick={reiniciar} className="text-gray-500 transition-colors hover:text-gray-300">
            Empezar de nuevo
          </button>
        </div>
      )}
    </div>
  );
}
