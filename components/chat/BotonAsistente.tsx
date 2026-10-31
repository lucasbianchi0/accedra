"use client";

import { useChat } from "./ChatProvider";
import { LogoAccedraAI } from "./AccedraAI";
import { track } from "@/lib/track";

/**
 * "Preguntale a nuestro asistente": el botón secundario de las portadas.
 *
 * Ocupa el lugar de "Ver servicios" / "Ver soluciones" con el mismo tamaño y
 * el mismo borde que tenían; el logo de Accedra AI es lo que lo distingue. Despierta la hoja ancha de
 * Accedra AI, igual que el robotito.
 */
export default function BotonAsistente({ origen, className = "" }: { origen: string; className?: string }) {
  const { abrirHoja, precargarHoja } = useChat();
  return (
    <button
      type="button"
      onClick={() => {
        track({ type: "click", name: "asistente", target: origen });
        abrirHoja(undefined, origen);
      }}
      onPointerEnter={precargarHoja}
      onFocus={precargarHoja}
      // La misma forma que tenía "Ver servicios" —padding, borde, alto de 56px
      // como el botón principal, contando el borde—: al lado del principal tiene que leerse como
      // su par, no como otra pieza. Lo único propio es el logo.
      className={`group inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-8 py-[15px] text-[15px] font-semibold leading-6 text-white transition-[border-color,background-color] duration-200 hover:border-white/40 hover:bg-white/5 ${className}`}
    >
      <span className="transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-110">
        <LogoAccedraAI size={19} />
      </span>
      Preguntale a nuestro asistente
    </button>
  );
}
