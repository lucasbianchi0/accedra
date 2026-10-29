"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import Robot from "./Robot";
import { useChat } from "./ChatProvider";

/**
 * El asistente en la portada: el campo principal del hero.
 *
 * La puerta de entrada pasa de "elegí una solución" a "contanos tu problema":
 * quien llega no siempre sabe si lo suyo es networking, seguridad o firma, pero
 * sí sabe qué le está frenando la operación. Lo que escribe acá abre el panel
 * con ese mensaje ya mandado.
 *
 * Es HTML liviano —un input y tres botones— que se pinta con el SSR: el panel
 * entero se carga recién cuando alguien hace foco o pasa el mouse.
 */

// Cortos a propósito: en un teléfono de 360 px entran unos 30 caracteres.
const EJEMPLOS = [
  "la red de los depósitos se cae…",
  "queremos firmar sin papel…",
  "los datos viven en Excel…",
  "hay que cablear una planta…",
];

const ATAJOS = [
  { label: "La red se cae o es lenta", texto: "Tenemos cortes y lentitud en la red y nadie lo resuelve de fondo." },
  { label: "Firmar sin papel", texto: "Queremos digitalizar la firma de documentos y dejar de imprimir." },
  { label: "Datos y tableros", texto: "Tenemos los datos dispersos en planillas y necesitamos tableros para decidir." },
  { label: "Seguridad", texto: "Nos preocupa la ciberseguridad de la empresa, ¿por dónde arrancamos?" },
];

export default function HeroChat() {
  const { abrir, precargar } = useChat();
  const [texto, setTexto] = useState("");
  const [ejemplo, setEjemplo] = useState(0);

  // El ejemplo del placeholder rota: muestra el tipo de mensaje que funciona
  // mejor (empresa + problema) sin un párrafo de instrucciones.
  useEffect(() => {
    if (texto) return;
    const t = setInterval(() => setEjemplo((i) => (i + 1) % EJEMPLOS.length), 3800);
    return () => clearInterval(t);
  }, [texto]);

  const mandar = (t: string, origen: string) => {
    if (!t.trim()) {
      abrir(undefined, origen);
      return;
    }
    abrir(t, origen);
    setTexto("");
  };

  return (
    <div className="w-full max-w-xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mandar(texto, "portada");
        }}
        className="hero-chat group relative flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] py-2 pl-3 pr-2 transition-colors focus-within:border-accent-300/50 focus-within:bg-white/[0.09]"
        style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 18px 50px rgba(0,0,0,0.35)" }}
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-accent to-[#1c4f9c] text-white">
          <Robot size={24} />
        </span>
        <label htmlFor="hero-chat" className="sr-only">
          Contanos qué problema tiene tu operación
        </label>
        <input
          id="hero-chat"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onFocus={precargar}
          onPointerEnter={precargar}
          maxLength={1200}
          autoComplete="off"
          placeholder={`Ej.: ${EJEMPLOS[ejemplo]}`}
          className="min-w-0 flex-1 bg-transparent py-2 text-[16px] text-white placeholder:text-gray-400 outline-none chat-campo"
        />
        <button
          type="submit"
          aria-label="Contarle al asistente"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-white transition-transform hover:-translate-y-0.5"
          style={{ background: "#2560BC", boxShadow: "0 8px 24px rgba(43,111,212,0.45)" }}
        >
          <ArrowUp size={18} />
        </button>
      </form>

      {/* Atajos: en el teléfono se deslizan de costado en vez de apilarse. */}
      <div className="no-scrollbar -mx-5 mt-3 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
        {ATAJOS.map((a) => (
          <button
            key={a.label}
            type="button"
            onPointerEnter={precargar}
            onClick={() => mandar(a.texto, "portada_atajo")}
            className="shrink-0 rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-1.5 text-[13px] text-gray-300 transition-colors hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
          >
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}
