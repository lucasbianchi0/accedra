"use client";

import dynamic from "next/dynamic";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import ChatLauncher from "./ChatLauncher";

/**
 * El asistente, disponible en todo el sitio.
 *
 * Acá vive sólo el estado de "abierto" y el mensaje con el que se abre (el que
 * escribieron en la portada). El panel —streaming, formato, tarjetas,
 * formulario— se carga recién cuando hace falta: es código que la mayoría de
 * las visitas no usa y no tiene por qué competir con el LCP de cada página.
 * Se precarga en el primer gesto de intención (hover o foco en el botón o en el
 * campo de la portada), así que al abrir ya está.
 *
 * Una vez montado el panel no se desmonta al cerrarlo: una respuesta a medio
 * llegar sigue llegando, y la conversación está ahí al volver.
 */

const cargarPanel = () => import("./ChatPanel");
const ChatPanel = dynamic(cargarPanel, { ssr: false });

type Ctx = {
  abierto: boolean;
  /** Abre el panel. Con texto, lo manda como primer mensaje. */
  abrir: (texto?: string, origen?: string) => void;
  cerrar: () => void;
  precargar: () => void;
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
  const [pendiente, setPendiente] = useState<{ texto: string; origen: string; n: number } | null>(null);

  const abrir = useCallback((texto?: string, origen = "flotante") => {
    setMontado(true);
    setAbierto(true);
    const limpio = texto?.trim();
    if (limpio) setPendiente((p) => ({ texto: limpio, origen, n: (p?.n ?? 0) + 1 }));
  }, []);
  const cerrar = useCallback(() => setAbierto(false), []);
  const precargar = useCallback(() => void cargarPanel(), []);

  const valor = useMemo(() => ({ abierto, abrir, cerrar, precargar }), [abierto, abrir, cerrar, precargar]);

  return (
    <ChatCtx.Provider value={valor}>
      {children}
      <ChatLauncher />
      {montado && (
        <ChatPanel
          abierto={abierto}
          onCerrar={cerrar}
          pendiente={pendiente}
          onPendienteUsado={() => setPendiente(null)}
        />
      )}
    </ChatCtx.Provider>
  );
}
