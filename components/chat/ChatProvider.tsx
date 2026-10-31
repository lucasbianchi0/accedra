"use client";

import dynamic from "next/dynamic";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import ChatLauncher from "./ChatLauncher";
import { enviar } from "@/lib/chat/store";

/**
 * El asistente, disponible en todo el sitio. Se abra desde donde se abra —el
 * robotito, los guiños, "Accedra AI" en el menú o el botón de las portadas—
 * despierta la misma hoja ancha que sube desde abajo (HojaAsistente). Antes el
 * robotito abría en escritorio un chat chico a la derecha; quedó una sola
 * forma, la grande.
 *
 * La hoja se carga recién cuando hace falta —es código que la mayoría de las
 * visitas no usa y no tiene por qué competir con el LCP— y se precarga en el
 * primer gesto de intención (hover o foco). Cuando la página ya está libre,
 * además, se monta cerrada (ver `ChatLauncher`): abrirla es sólo cambiar un
 * atributo, sin montar nada en el toque. Una vez montada no se desmonta al
 * cerrarla, así corre la animación de salida.
 */

const cargarHoja = () => import("./HojaAsistente");
const HojaAsistente = dynamic(cargarHoja, { ssr: false });

type Ctx = {
  /** La hoja del asistente está abierta. */
  abierto: boolean;
  /** Despierta la hoja ancha desde abajo. Con texto, lo manda como mensaje. */
  abrir: (texto?: string, origen?: string) => void;
  /** Lo mismo que `abrir`; queda por los llamados que ya lo usan. */
  abrirHoja: (texto?: string, origen?: string) => void;
  cerrar: () => void;
  precargar: () => void;
  precargarHoja: () => void;
  /** Baja la hoja y la deja montada y cerrada, lista para abrir al instante. */
  montarCerrada: () => void;
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
  const [montada, setMontada] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  const abrir = useCallback((texto?: string, origen = "flotante") => {
    setMontada(true);
    setAbierto(true);
    if (texto?.trim()) void enviar(texto, origen);
  }, []);
  const cerrar = useCallback(() => setAbierto(false), []);
  const precargar = useCallback(() => void cargarHoja(), []);
  // Baja el código y la deja montada y cerrada, con la imagen ya cargada.
  const montarCerrada = useCallback(() => void cargarHoja().then(() => setMontada(true)), []);

  const valor = useMemo(
    () => ({
      abierto,
      abrir,
      abrirHoja: abrir,
      cerrar,
      precargar,
      precargarHoja: precargar,
      montarCerrada,
      heroVisible,
      setHeroVisible,
    }),
    [abierto, abrir, cerrar, precargar, montarCerrada, heroVisible],
  );

  return (
    <ChatCtx.Provider value={valor}>
      {children}
      <ChatLauncher />
      {montada && <HojaAsistente abierto={abierto} onCerrar={cerrar} />}
    </ChatCtx.Provider>
  );
}
