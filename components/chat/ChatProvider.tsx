"use client";

import dynamic from "next/dynamic";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import ChatLauncher from "./ChatLauncher";
import { enviar } from "@/lib/chat/store";

/**
 * El asistente, disponible en todo el sitio.
 *
 * La conversación vive en `lib/chat/store`; acá sólo se decide si el panel
 * flotante está abierto y si la tarjeta de la portada está a la vista (con la
 * tarjeta en pantalla, el robotito flotante sobra: sería el mismo chat dos
 * veces).
 *
 * El panel —formato, tarjetas, formulario— se carga recién cuando hace falta:
 * es código que la mayoría de las visitas no usa y no tiene por qué competir
 * con el LCP. Se precarga en el primer gesto de intención (hover o foco). Una
 * vez montado no se desmonta al cerrarlo, así la animación de salida corre y
 * al volver está como quedó.
 */

const cargarPanel = () => import("./ChatPanel");
const ChatPanel = dynamic(cargarPanel, { ssr: false });

type Ctx = {
  abierto: boolean;
  /** Abre el panel. Con texto, lo manda como mensaje. */
  abrir: (texto?: string, origen?: string) => void;
  cerrar: () => void;
  precargar: () => void;
  heroVisible: boolean;
  setHeroVisible: (v: boolean) => void;
};

const ChatCtx = createContext<Ctx | null>(null);

export function useChat(): Ctx {
  const ctx = useContext(ChatCtx);
  if (!ctx) throw new Error("useChat fuera de ChatProvider");
  return ctx;
}

export default function ChatProvider({ children }: { children: React.ReactNode }) {
  const [abierto, setAbierto] = useState(false);
  const [montado, setMontado] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  const abrir = useCallback((texto?: string, origen = "flotante") => {
    setMontado(true);
    setAbierto(true);
    if (texto?.trim()) void enviar(texto, origen);
  }, []);
  const cerrar = useCallback(() => setAbierto(false), []);
  const precargar = useCallback(() => void cargarPanel(), []);

  const valor = useMemo(
    () => ({ abierto, abrir, cerrar, precargar, heroVisible, setHeroVisible }),
    [abierto, abrir, cerrar, precargar, heroVisible],
  );

  return (
    <ChatCtx.Provider value={valor}>
      {children}
      <ChatLauncher />
      {montado && <ChatPanel abierto={abierto} onCerrar={cerrar} />}
    </ChatCtx.Provider>
  );
}
