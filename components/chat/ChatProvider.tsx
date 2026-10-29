"use client";

import dynamic from "next/dynamic";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import ChatLauncher from "./ChatLauncher";
import { enviar } from "@/lib/chat/store";

/**
 * El asistente, disponible en todo el sitio, con dos formas de abrirse:
 *
 *  - El robotito flotante abre el chat clásico a la derecha (ChatPanel).
 *  - "Accedra AI" en el menú y "Preguntale a nuestro asistente" en las
 *    portadas despiertan la hoja ancha que sube desde abajo (HojaAsistente).
 *
 * Son dos piezas distintas que hacen lo mismo: la conversación vive en
 * `lib/chat/store`, así que lo que se habló en una aparece en la otra.
 *
 * Las dos se cargan recién cuando hace falta —es código que la mayoría de las
 * visitas no usa y no tiene por qué competir con el LCP— y se precargan en el
 * primer gesto de intención (hover o foco). Una vez montadas no se desmontan
 * al cerrarlas, así corre la animación de salida.
 */

const cargarPanel = () => import("./ChatPanel");
const cargarHoja = () => import("./HojaAsistente");
const ChatPanel = dynamic(cargarPanel, { ssr: false });
const HojaAsistente = dynamic(cargarHoja, { ssr: false });

type Ctx = {
  /** Algo del asistente está abierto (panel u hoja). */
  abierto: boolean;
  /** Abre el chat de la derecha. Con texto, lo manda como mensaje. */
  abrir: (texto?: string, origen?: string) => void;
  /** Despierta la hoja ancha desde abajo. */
  abrirHoja: (texto?: string, origen?: string) => void;
  cerrar: () => void;
  precargar: () => void;
  precargarHoja: () => void;
  heroVisible: boolean;
  setHeroVisible: (v: boolean) => void;
};

const ChatCtx = createContext<Ctx | null>(null);

export function useChat(): Ctx {
  const ctx = useContext(ChatCtx);
  if (!ctx) throw new Error("useChat fuera de ChatProvider");
  return ctx;
}

type Vista = "panel" | "hoja" | null;

export default function ChatProvider({ children }: { children: React.ReactNode }) {
  const [vista, setVista] = useState<Vista>(null);
  const [montados, setMontados] = useState({ panel: false, hoja: false });
  const [heroVisible, setHeroVisible] = useState(false);

  const abrirEn = useCallback((v: "panel" | "hoja", texto?: string, origen = "flotante") => {
    setMontados((m) => (m[v] ? m : { ...m, [v]: true }));
    setVista(v);
    if (texto?.trim()) void enviar(texto, origen);
  }, []);
  const abrir = useCallback((texto?: string, origen?: string) => abrirEn("panel", texto, origen), [abrirEn]);
  const abrirHoja = useCallback((texto?: string, origen?: string) => abrirEn("hoja", texto, origen), [abrirEn]);
  const cerrar = useCallback(() => setVista(null), []);
  const precargar = useCallback(() => void cargarPanel(), []);
  const precargarHoja = useCallback(() => void cargarHoja(), []);

  const valor = useMemo(
    () => ({
      abierto: vista !== null,
      abrir,
      abrirHoja,
      cerrar,
      precargar,
      precargarHoja,
      heroVisible,
      setHeroVisible,
    }),
    [vista, abrir, abrirHoja, cerrar, precargar, precargarHoja, heroVisible],
  );

  return (
    <ChatCtx.Provider value={valor}>
      {children}
      <ChatLauncher />
      {montados.panel && <ChatPanel abierto={vista === "panel"} onCerrar={cerrar} />}
      {montados.hoja && <HojaAsistente abierto={vista === "hoja"} onCerrar={cerrar} />}
    </ChatCtx.Provider>
  );
}
