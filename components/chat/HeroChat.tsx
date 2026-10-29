"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import Robot from "./Robot";
import { useChat } from "./ChatProvider";
import { sugerenciasPara } from "@/lib/chat/sugerencias";

/**
 * El asistente en la portada: una pastilla más en la fila de botones.
 *
 * Mismo alto, mismo radio y mismo borde que los CTA de al lado, para que se
 * lea como parte de la portada y no como un widget pegado encima. Lo que se
 * escribe abre el panel con ese mensaje ya mandado; la conversación no pasa
 * acá, así la portada no cambia de forma mientras alguien la usa.
 *
 * Debajo, una sola línea de ejemplos en texto: la invitación a contar el caso
 * sin sumar otra fila de botones. Son los de la solución de la página.
 *
 * Mientras está a la vista, el robotito flotante se esconde: sería la misma
 * puerta dos veces.
 */

const EJEMPLOS = [
  "la red de los depósitos se cae…",
  "queremos firmar sin papel…",
  "los datos viven en Excel…",
  "hay que cablear una planta…",
];

export default function HeroChat({
  solucion,
  accent = "#2560BC",
  className = "",
}: {
  solucion?: string;
  accent?: string;
  className?: string;
}) {
  const { abrir, precargar, setHeroVisible } = useChat();
  const { atajos } = sugerenciasPara(solucion);
  const [texto, setTexto] = useState("");
  const [ejemplo, setEjemplo] = useState(0);
  const raiz = useRef<HTMLDivElement>(null);
  const origen = solucion ? `portada:${solucion}` : "portada";

  // El ejemplo del placeholder rota: muestra el tipo de mensaje que funciona
  // mejor (empresa + problema) sin un párrafo de instrucciones.
  useEffect(() => {
    if (texto) return;
    const t = setInterval(() => setEjemplo((i) => (i + 1) % EJEMPLOS.length), 3800);
    return () => clearInterval(t);
  }, [texto]);

  useEffect(() => {
    const el = raiz.current;
    if (!el) return;
    // Oculto (en escritorio, donde está la tarjeta) mide 0 de ancho y no opina.
    const io = new IntersectionObserver(([e]) => {
      if (e.boundingClientRect.width > 0) setHeroVisible(e.isIntersecting);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      setHeroVisible(false);
    };
  }, [setHeroVisible]);

  const mandar = (t: string, de: string) => {
    abrir(t.trim() || undefined, de);
    setTexto("");
  };

  return (
    <div ref={raiz} className={`w-full sm:max-w-[460px] ${className}`}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mandar(texto, origen);
        }}
        onPointerEnter={precargar}
        className="flex h-[56px] items-center gap-3 rounded-full border border-white/20 bg-white/[0.05] pl-5 pr-2 transition-colors hover:border-white/30 focus-within:border-white/40 focus-within:bg-white/[0.08]"
      >
        <span className="shrink-0 text-accent-300" aria-hidden>
          <Robot size={22} />
        </span>
        <label htmlFor={`hero-chat-${origen}`} className="sr-only">
          Contanos tu caso al asistente
        </label>
        <input
          id={`hero-chat-${origen}`}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onFocus={precargar}
          maxLength={1200}
          autoComplete="off"
          placeholder={`Contanos tu caso: ${EJEMPLOS[ejemplo]}`}
          className="chat-campo min-w-0 flex-1 bg-transparent text-[16px] text-white placeholder:text-gray-400 outline-none sm:text-[15px]"
        />
        <button
          type="submit"
          aria-label="Contarle al asistente"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-white transition-transform hover:-translate-y-0.5"
          style={{ background: accent }}
        >
          <ArrowUp size={18} />
        </button>
      </form>

      <p className="mt-3 flex flex-wrap items-center gap-x-1 gap-y-1 pl-5 text-[13px] text-gray-500">
        <span className="mr-1">Por ejemplo:</span>
        {atajos.map((a, i) => (
          <span key={a.label} className="inline-flex items-center">
            {i > 0 && <span aria-hidden className="mr-1 text-gray-600">·</span>}
            <button
              type="button"
              onPointerEnter={precargar}
              onClick={() => mandar(a.texto, `${origen}:atajo`)}
              className="text-gray-400 underline decoration-white/15 underline-offset-4 transition-colors hover:text-white hover:decoration-white/50"
            >
              {a.label}
            </button>
          </span>
        ))}
      </p>
    </div>
  );
}
