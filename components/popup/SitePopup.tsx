"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

import {
  correspondeA,
  esperarImagen,
  marcarVisto,
  precargarImagen,
  yaLoVio,
  type PopupSitio,
} from "@/lib/popup";
import { forSubmit } from "@/lib/attribution";
import { currentSessionId, track } from "@/lib/track";

/**
 * La pieza se carga aparte y sólo cuando hay algo que mostrar.
 *
 * Es el mismo criterio que el botón de WhatsApp con framer: este componente vive
 * en el layout, o sea que su JavaScript entra en el bundle de arranque de las 43
 * páginas del sitio. Lo que tiene que entrar ahí es la decisión —cuatro efectos
 * y dos lecturas de storage—, no el marcado del modal, que el 95% de las visitas
 * no va a ver nunca.
 *
 * `ssr: false` es correcto acá: el popup no existe hasta que el navegador pide
 * la configuración, así que no hay nada que renderizar en el servidor.
 */
const PopupPieza = dynamic(
  () => import("@/components/popup/PopupPieza").then((m) => m.PopupPieza),
  { ssr: false }
);

/**
 * Decide si el popup se muestra, cuándo, y lo saca cuando corresponde.
 *
 * Vive en el layout, así que existe en todas las páginas y sobrevive a la
 * navegación entre ellas. Todo lo visual está en PopupPieza —que es el mismo
 * archivo que usa el backoffice para la vista previa—; acá está sólo la
 * decisión.
 *
 * TRES REGLAS QUE NO SE NEGOCIAN
 *
 *  1. **Nada antes de que la página esté usable.** La configuración se pide
 *     recién cuando el navegador está ocioso: el popup no puede competir por el
 *     caño con las fuentes y la imagen del hero, que son las que deciden el LCP.
 *
 *  2. **Una sola vez por visita.** `mostrado` es un ref y no un estado: navegar
 *     de la portada a una landing no puede volver a abrirlo. Sin esto, un popup
 *     con alcance "todo el sitio" aparece en cada clic del menú y el visitante
 *     se va.
 *
 *  3. **Si algo falla, no se ve nada.** No hay estados de error ni reintentos.
 *     Un aviso que no aparece es un problema del aviso; una página rota por un
 *     aviso es un problema del sitio.
 */
/**
 * Cuánto se espera a la foto antes de mostrar el popup igual.
 *
 * Dos segundos y medio: por encima de eso, el aviso llega tan tarde que ya no
 * sirve, y es preferible mostrarlo con la imagen entrando un instante después.
 */
const ESPERA_IMAGEN_MS = 2500;

export default function SitePopup() {
  const pathname = usePathname();

  const [popup, setPopup] = useState<PopupSitio | null>(null);
  const [abierto, setAbierto] = useState(false);
  const [saliendo, setSaliendo] = useState(false);

  /** Ya se abrió en esta carga: no se vuelve a abrir aunque se navegue. */
  const mostrado = useRef(false);

  /* ── 1. Traer la configuración, sin estorbar ────────────────────────────── */

  useEffect(() => {
    let vivo = true;

    const pedir = () => {
      fetch("/api/popup")
        .then((r) => (r.ok ? r.json() : null))
        .then((d: { popup?: PopupSitio | null } | null) => {
          if (vivo && d?.popup) setPopup(d.popup);
        })
        .catch(() => {
          /* sin popup y sin ruido */
        });
    };

    // requestIdleCallback no existe en Safari viejo: el timeout hace de piso y
    // de fallback a la vez.
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
      .requestIdleCallback;
    if (ric) {
      const id = ric(pedir, { timeout: 3000 });
      return () => {
        vivo = false;
        (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback?.(id);
      };
    }

    const t = window.setTimeout(pedir, 1500);
    return () => {
      vivo = false;
      clearTimeout(t);
    };
  }, []);

  /* ── 2. Decidir si toca en esta página ──────────────────────────────────── */

  useEffect(() => {
    if (!popup || mostrado.current) return;
    if (!correspondeA(popup, pathname)) return;
    if (yaLoVio(popup)) return;

    let cancelado = false;

    const abrir = () => {
      if (cancelado) return;
      mostrado.current = true;
      // La marca se deja al ABRIR y no al cerrar: si se esperara al cierre,
      // quien navega con el popup abierto lo vuelve a ver en la página
      // siguiente, y en la siguiente.
      marcarVisto(popup);
      setAbierto(true);
      track({ type: "popup", name: "ver", target: popup.id });
    };

    const t = window.setTimeout(() => {
      // El popup NO se abre con el hueco de la foto vacío.
      //
      // La imagen ya se viene precargando desde que llegó la configuración, así
      // que acá normalmente no se espera nada. El `await` es el seguro para la
      // conexión lenta: sin él, el modal aparecía con un rectángulo negro
      // arriba y la foto entraba un segundo después, que se ve exactamente como
      // un popup roto.
      if (!popup.imagenUrl) {
        abrir();
        return;
      }
      void esperarImagen(popup.imagenUrl, ESPERA_IMAGEN_MS).then(abrir);
    }, popup.demoraS * 1000);

    return () => {
      cancelado = true;
      clearTimeout(t);
    };
  }, [popup, pathname]);

  /**
   * Lo que hace falta para dibujarlo, traído durante la demora.
   *
   * El código de la pieza y la imagen se piden apenas se sabe QUE hay un popup,
   * no cuando llega el momento de mostrarlo. Con seis segundos de demora
   * siempre llegan; con la demora en cero, al menos arrancan antes.
   */
  useEffect(() => {
    if (!popup) return;
    void import("@/components/popup/PopupPieza");
    if (popup.imagenUrl) precargarImagen(popup.imagenUrl);
  }, [popup]);

  /* ── 3. Cerrar ──────────────────────────────────────────────────────────── */

  const cerrar = useCallback(
    (motivo: "boton" | "escape" | "cta") => {
      if (!popup || saliendo) return;

      if (motivo !== "cta") {
        track({ type: "popup", name: "cerrar", target: popup.id, metadata: { motivo } });
      }

      setSaliendo(true);
      // El desmontaje espera a que termine la transición de salida. El número
      // tiene que coincidir con la duración de .popup-raiz en globals.css: si
      // acá fuera menor, el popup desaparecería de golpe.
      window.setTimeout(() => {
        setAbierto(false);
        setSaliendo(false);
      }, 260);
    },
    [popup, saliendo]
  );

  /* ── 4. El mail ─────────────────────────────────────────────────────────── */

  /**
   * Guarda la dirección que dejó el visitante.
   *
   * Viaja con la misma atribución que el formulario de contacto —el gclid, las
   * UTM, la sesión de navegación—, porque el sentido de capturar el mail acá no
   * es tener una dirección más: es poder decir en tres meses que ese contrato
   * salió de este aviso y de esa campaña.
   *
   * El popup NO se cierra al enviar. La pieza reemplaza el formulario por el
   * mensaje de gracias y quien lo cierra es la persona: cerrarlo de golpe deja
   * la duda de si se envió, y esa duda termina en el mail mandado dos veces.
   */
  const enviarMail = useCallback(
    async (email: string): Promise<{ ok: boolean; error?: string }> => {
      if (!popup) return { ok: false };

      try {
        const r = await fetch("/api/popup/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            popup_id: popup.id,
            ...forSubmit(window.location.pathname),
            session_id: currentSessionId(),
          }),
        });

        if (r.ok) {
          // Se emite recién con el 200: contar intentos fallidos como conversión
          // le enseñaría a Ads a optimizar hacia tráfico que no convierte.
          track({ type: "popup", name: "mail", target: popup.id });
          return { ok: true };
        }

        const d = (await r.json().catch(() => ({}))) as { error?: string };
        return { ok: false, error: d.error };
      } catch {
        return { ok: false, error: "No se pudo enviar. ¿Estás conectado?" };
      }
    },
    [popup]
  );

  /* ── 5. Teclado y scroll ────────────────────────────────────────────────── */

  useEffect(() => {
    if (!abierto) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrar("escape");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [abierto, cerrar]);

  useEffect(() => {
    // La barra no bloquea el scroll: avisa sin interrumpir, y esa es toda su
    // razón de ser.
    if (!abierto || popup?.formato !== "modal") return;

    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previo;
    };
  }, [abierto, popup?.formato]);

  /**
   * Mientras la barra está en pantalla, la burbuja de WhatsApp se aparta.
   *
   * Las dos viven abajo: la barra cruza todo el ancho y la burbuja está fija en
   * la esquina derecha, así que en escritorio se superponen y la burbuja queda a
   * medias tapada e imposible de clickear en esa mitad. El modal no tiene el
   * problema porque bloquea el scroll y la burbuja ya se escondía por eso.
   *
   * Se comunica por un atributo en el `body` y no por un contexto de React
   * porque son dos ramas del árbol que no se conocen —una vive dentro de
   * SmoothScroll y la otra no— y montar un provider en la raíz para esto sería
   * cargar código en las 43 páginas por un caso que casi nunca ocurre.
   */
  useEffect(() => {
    if (!abierto || popup?.formato !== "barra") return;

    document.body.dataset.popupBarra = "1";
    return () => {
      delete document.body.dataset.popupBarra;
    };
  }, [abierto, popup?.formato]);

  if (!popup || !abierto) return null;

  return (
    <PopupPieza
      popup={popup}
      animacion={saliendo ? "saliendo" : "entrando"}
      onEnviarMail={enviarMail}
      onCerrar={() => cerrar("boton")}
      onCta={() => {
        track({ type: "popup", name: "clic", target: popup.id });
        // Si el destino abre en la misma pestaña, la página se va de todos
        // modos; cerrarlo evita que quede abierto atrás cuando el visitante
        // vuelve con el botón de atrás y la página sale de la caché.
        if (!popup.ctaNuevaPestana) cerrar("cta");
      }}
    />
  );
}
