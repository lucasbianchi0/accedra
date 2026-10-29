"use client";

import { useChat } from "./ChatProvider";
import { LogoAccedraAI } from "./AccedraAI";
import { track } from "@/lib/track";

/**
 * "Preguntale a nuestro asistente": el botón secundario de las portadas.
 *
 * Ocupa el lugar de "Ver servicios" / "Ver soluciones" con el mismo tamaño y
 * el mismo borde que tenían, más un filo violeta de Accedra AI para que se
 * distinga sin competirle al botón principal. Despierta la hoja ancha de
 * Accedra AI (el robotito, en cambio, abre el chat de la derecha).
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
      className={`boton-ai group relative inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-4 text-[13.5px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/5 ${className}`}
    >
      <span className="transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-110">
        <LogoAccedraAI size={19} />
      </span>
      Preguntale a nuestro asistente
    </button>
  );
}
