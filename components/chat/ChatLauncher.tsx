"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import Robot from "./Robot";
import { useChat } from "./ChatProvider";
import { track } from "@/lib/track";

/**
 * El robotito flotante, apilado arriba de la burbuja de WhatsApp.
 *
 * Dos canales a la vista y no uno que esconda al otro: quien ya sabe que
 * quiere una persona va directo a WhatsApp; quien todavía está entendiendo qué
 * necesita, conversa con el asistente. En las páginas sin burbuja de WhatsApp
 * baja a la esquina.
 *
 * El globo de "¿Te ayudo?" aparece una sola vez por sesión, sólo en
 * escritorio, después de unos segundos, y se va solo: invita sin tapar nada.
 * En el teléfono un globo flotante tapa contenido justo donde se lee.
 *
 * Mientras la tarjeta del chat de la portada está a la vista, el botón se
 * esconde: es la misma conversación, y aparece recién al bajar.
 */

const CLAVE_GLOBO = "accedra-chat-globo";

export default function ChatLauncher() {
  const { abierto, abrir, abrirHoja, precargar, precargarHoja, heroVisible } = useChat();
  const pathname = usePathname();
  const [tapada, setTapada] = useState(false);
  const [conWhatsApp, setConWhatsApp] = useState(true);
  const [globo, setGlobo] = useState(false);

  // Mismo criterio que la burbuja de WhatsApp: con el menú mobile abierto (el
  // body bloquea el scroll) o con la barra del popup, se esconde.
  useEffect(() => {
    const sync = () =>
      setTapada(document.body.style.overflow === "hidden" || document.body.dataset.popupBarra === "1");
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { attributes: true, attributeFilter: ["style", "data-popup-barra"] });
    return () => observer.disconnect();
  }, []);

  // La burbuja de WhatsApp la monta cada página; se mira después de navegar.
  useEffect(() => {
    const t = setTimeout(() => setConWhatsApp(Boolean(document.querySelector(".wa-bubble"))), 50);
    return () => clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    if (!window.matchMedia("(min-width: 768px)").matches) return;
    try {
      if (sessionStorage.getItem(CLAVE_GLOBO)) return;
    } catch {}
    const mostrar = setTimeout(() => {
      setGlobo(true);
      try {
        sessionStorage.setItem(CLAVE_GLOBO, "1");
      } catch {}
    }, 7000);
    const ocultar = setTimeout(() => setGlobo(false), 7000 + 9000);
    return () => {
      clearTimeout(mostrar);
      clearTimeout(ocultar);
    };
  }, []);

  // Con la tarjeta del chat de la portada en pantalla, el botón sobra.
  const visible = !abierto && !tapada && !heroVisible;

  return (
    <div
      className={`chat-launcher fixed right-5 z-50 flex items-center gap-3 ${conWhatsApp ? "bottom-[84px] sm:bottom-[86px]" : "bottom-6"}`}
      data-shown={visible ? "true" : "false"}
    >
      {globo && visible && (
        <div className="chat-globo relative hidden md:flex items-center gap-2 rounded-2xl border border-white/10 bg-navy-700/95 py-2.5 pl-4 pr-2 text-sm text-gray-200 shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
          <button type="button" onClick={() => { setGlobo(false); abrir(undefined, "globo"); }} className="text-left">
            ¿Me contás qué necesita tu operación?
          </button>
          <button
            type="button"
            onClick={() => setGlobo(false)}
            aria-label="Cerrar"
            className="rounded-full p-1 text-gray-500 transition-colors hover:bg-white/5 hover:text-gray-300"
          >
            <X size={14} />
          </button>
        </div>
      )}
      <button
        type="button"
        onClick={() => {
          setGlobo(false);
          track({ type: "click", name: "chat", target: "flotante" });
          // En el teléfono no hay "costado": el robotito despierta la misma
          // hoja que el menú y la portada. En escritorio abre el chat clásico.
          if (window.matchMedia("(max-width: 767px)").matches) abrirHoja(undefined, "flotante");
          else abrir(undefined, "flotante");
        }}
        onPointerEnter={precargar}
        onFocus={precargar}
        onTouchStart={precargarHoja}
        aria-label="Abrir el asistente de Accedra"
        className="chat-boton group relative grid h-[46px] w-[46px] place-items-center rounded-full text-white"
      >
        <span aria-hidden className="chat-boton-halo absolute -inset-1 rounded-full" />
        <span
          aria-hidden
          className="absolute inset-0 rounded-full border border-white/15"
          style={{
            background: "linear-gradient(145deg, #2f78e0 0%, #1c4f9c 100%)",
            boxShadow: "0 8px 28px rgba(43,111,212,0.45), inset 0 1px 0 rgba(255,255,255,0.3)",
          }}
        />
        <span className="relative transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
          <Robot size={26} />
        </span>
      </button>
    </div>
  );
}
