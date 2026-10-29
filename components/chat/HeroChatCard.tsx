"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUp } from "lucide-react";
import Robot from "./Robot";
import { useChat } from "./ChatProvider";
import { reiniciar, useConversacion } from "@/lib/chat/store";
import { sugerenciasPara } from "@/lib/chat/sugerencias";

/**
 * El asistente a la derecha de cada portada (escritorio).
 *
 * Es del MISMO material que la barra de estadísticas de abajo —capa
 * translúcida, brillo interior, línea de luz arriba— para que se lea como una
 * pieza de la portada y no como un widget pegado encima. Tipografía alineada a
 * la izquierda como el título, alto automático: no compite con el h1.
 *
 * Acá no pasa la conversación: lo que se escribe abre el panel con el mensaje
 * ya mandado. Así la portada no cambia de forma mientras alguien la usa.
 *
 * Sin `backdrop-filter`, por lo mismo que la barra de estadísticas: el blur
 * real hace saltar el color durante el fade de entrada.
 *
 * Sólo desde `lg`. En el teléfono queda la pastilla compacta (home) o
 * WhatsApp (soluciones), que es lo que la medición respalda.
 */

/** El placeholder se escribe solo con los casos de la página. */
function useMaquina(frases: string[], activa: boolean): string {
  const [estado, setEstado] = useState({ i: 0, n: 0, borrando: false, pausa: 0 });

  useEffect(() => {
    if (!activa || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => {
      setEstado((e) => {
        const frase = frases[e.i % frases.length];
        if (e.pausa > 0) return { ...e, pausa: e.pausa - 1 };
        if (!e.borrando) {
          return e.n < frase.length ? { ...e, n: e.n + 1 } : { ...e, borrando: true, pausa: 40 };
        }
        return e.n > 0 ? { ...e, n: Math.max(0, e.n - 3) } : { i: e.i + 1, n: 0, borrando: false, pausa: 6 };
      });
    }, 45);
    return () => clearInterval(t);
  }, [activa, frases]);

  const frase = frases[estado.i % frases.length];
  return activa ? frase.slice(0, estado.n) : frase;
}

export default function HeroChatCard({ solucion, accent = "#2560BC" }: { solucion?: string; accent?: string }) {
  const { abrir, precargar, setHeroVisible } = useChat();
  const { mensajes } = useConversacion();
  const { titulo, atajos } = sugerenciasPara(solucion);
  const [texto, setTexto] = useState("");
  const [enfocado, setEnfocado] = useState(false);
  const [frases] = useState(() => atajos.map((a) => a.texto));
  const raiz = useRef<HTMLDivElement>(null);
  const origen = solucion ? `portada:${solucion}` : "portada";
  const escribiendo = useMaquina(frases, !texto && !enfocado);

  // Mientras se ve, el robotito flotante se esconde (sería la misma puerta dos
  // veces). Oculta (en el teléfono) mide 0 de ancho y no opina.
  useEffect(() => {
    const el = raiz.current;
    if (!el) return;
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

  const mandar = (t: string, de = origen) => {
    if (!t.trim()) return;
    abrir(t, de);
    setTexto("");
  };

  const hayCharla = mensajes.length > 0;

  return (
    <div
      ref={raiz}
      onPointerEnter={precargar}
      className="relative hidden w-full overflow-hidden rounded-[24px] border p-7 lg:block"
      style={{
        borderColor: "rgba(255,255,255,0.18)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 100%), rgba(14,26,46,0.62)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), 0 24px 60px rgba(0,0,0,0.42)",
      }}
    >
      {/* Línea de luz superior, como en la barra de estadísticas */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)" }}
      />

      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-[13px] font-medium text-gray-300">
          <span className="text-accent-300">
            <Robot size={20} />
          </span>
          Asistente Accedra
        </p>
        <p className="flex items-center gap-1.5 text-[12px] text-gray-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Responde al instante
        </p>
      </div>

      <h2 className="font-display mt-5 text-[28px] font-semibold leading-[1.1] tracking-[-0.01em] text-white">{titulo}</h2>
      <p className="mt-2.5 text-[14.5px] leading-relaxed text-gray-300">
        Contanos tu caso y te decimos cómo lo resolveríamos. Si querés, un especialista lo analiza sin costo.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          mandar(texto);
        }}
        className="relative mt-6 rounded-2xl border border-white/[0.12] bg-[rgba(7,16,29,0.55)] transition-colors focus-within:border-white/30"
      >
        <label htmlFor={`hero-caso-${origen}`} className="sr-only">
          Contanos tu caso
        </label>
        <textarea
          id={`hero-caso-${origen}`}
          rows={3}
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
          placeholder={enfocado ? "Ej.: somos una clínica con 3 sedes y…" : undefined}
          className="chat-campo block w-full resize-none bg-transparent px-4 pb-12 pt-3.5 text-[15px] leading-relaxed text-white placeholder:text-gray-500 outline-none"
        />
        {/* El ejemplo que se escribe solo. Va encima del campo y no como
            placeholder: un placeholder que cambia cada 45 ms lo releen los
            lectores de pantalla en cada cambio. */}
        {!texto && !enfocado && (
          <p aria-hidden className="pointer-events-none absolute left-4 right-14 top-3.5 text-[15px] leading-relaxed text-gray-500">
            {escribiendo}
            <span className="hero-cursor ml-px inline-block h-[1.05em] w-px translate-y-[3px] bg-gray-400" />
          </p>
        )}
        <button
          type="submit"
          disabled={!texto.trim()}
          aria-label="Enviar al asistente"
          className="absolute bottom-2.5 right-2.5 grid h-9 w-9 place-items-center rounded-full text-white transition-all hover:-translate-y-0.5 disabled:opacity-35 disabled:hover:translate-y-0"
          style={{ background: accent }}
        >
          <ArrowUp size={17} />
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {atajos.map((a) => (
          <button
            key={a.label}
            type="button"
            onClick={() => mandar(a.texto, `${origen}:atajo`)}
            title={a.texto}
            className="rounded-full border border-white/15 px-3.5 py-1.5 text-[12.5px] text-gray-300 transition-colors hover:border-white/35 hover:bg-white/[0.05] hover:text-white"
          >
            {a.label}
          </button>
        ))}
      </div>

      {hayCharla && (
        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-[13px]">
          <button
            type="button"
            onClick={() => abrir(undefined, origen)}
            className="group inline-flex items-center gap-1.5 font-semibold text-white transition-all hover:gap-2.5"
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
