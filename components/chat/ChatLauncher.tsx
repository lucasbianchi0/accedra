"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { MascotaCara } from "./Mascota";
import { useChat } from "./ChatProvider";
import { useGuinos } from "./guinos";
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

  // En la home saluda con los guiños de cada sección (ver guinos.ts); en las
  // demás páginas queda el globo de siempre.
  const enHome = pathname === "/";

  useEffect(() => {
    if (enHome || !window.matchMedia("(min-width: 768px)").matches) return;
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
  }, [enHome]);

  // Con la tarjeta del chat de la portada en pantalla, el botón sobra.
  const visible = !abierto && !tapada && !heroVisible;
  const { guino, soltar, descartar } = useGuinos(enHome, visible);

  return (
    <div
      className={`chat-launcher fixed right-5 z-50 flex items-center gap-3 ${conWhatsApp ? "bottom-[96px]" : "bottom-6"}`}
      data-shown={visible ? "true" : "false"}
      data-guino={guino ? "true" : "false"}
    >
      {guino && (
        <div
          key={guino.id}
          role="status"
          className="chat-globo relative flex max-w-[300px] items-center gap-2 rounded-2xl border border-white/10 bg-navy-700/95 py-2.5 pl-4 pr-2 text-sm text-gray-200 shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
        >
          <button
            type="button"
            onClick={() => {
              soltar();
              abrir(undefined, `guino:${guino.id}`);
            }}
            className="text-left leading-snug"
          >
            {guino.texto}
          </button>
          <button
            type="button"
            onClick={descartar}
            aria-label="No mostrar más"
            className="shrink-0 rounded-full p-1 text-gray-500 transition-colors hover:bg-white/5 hover:text-gray-300"
          >
            <X size={14} />
          </button>
        </div>
      )}
      {globo && visible && !guino && (
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
          // En celular y tablet no hay "costado": el robotito despierta la misma
          // hoja a pantalla completa que el menú y la portada. En escritorio
          // abre el chat clásico de la derecha.
          if (window.matchMedia("(max-width: 1023px)").matches) abrirHoja(undefined, "flotante");
          else abrir(undefined, "flotante");
        }}
        onPointerEnter={precargar}
        onFocus={precargar}
        onTouchStart={precargarHoja}
        aria-label="Abrir el asistente de Accedra"
        className="chat-boton group relative grid h-[60px] w-[60px] place-items-center rounded-full text-white"
      >
        <span aria-hidden className="chat-boton-halo absolute -inset-1.5 rounded-full" />
        {/* La cara del personaje con un aro en el degradé de Accedra AI. */}
        <span
          aria-hidden
          className="absolute inset-0 rounded-full p-[2px]"
          style={{
            background: "linear-gradient(140deg, #B99CFB 0%, #7C6CF6 45%, #2B6FD4 100%)",
            boxShadow: "0 10px 30px rgba(124,108,246,0.45)",
          }}
        >
          <span className="block h-full w-full overflow-hidden rounded-full bg-navy-900">
            <MascotaCara
              size={56}
              className="h-full w-full transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
            />
          </span>
        </span>
      </button>
    </div>
  );
}
