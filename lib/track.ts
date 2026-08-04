/**
 * Tracking propio de sesiones y eventos.
 *
 * No hay librería de terceros: los datos van a nuestro Supabase para poder
 * cruzarlos por SQL con los leads, que es la única forma de responder "qué
 * keyword trae clientes que cierran".
 *
 * Sin cookies. La sesión es un UUID aleatorio en localStorage, que no
 * identifica a una persona ni se comparte entre sitios.
 */

import { read as leerAtribucion } from "@/lib/attribution";

const SESSION_KEY = "accedra:sid";
/** Inactividad tras la cual se considera una visita nueva. Convención estándar. */
const SESSION_IDLE_MS = 30 * 60 * 1000;

type Guardado = { id: string; last: number };

/** Familias de evento. `type` agrupa, `name` distingue dentro del grupo. */
export type EventType = "pageview" | "click" | "form";

export type TrackInput = {
  type: EventType;
  /** Evento concreto: "whatsapp", "telefono", "solucion_card", "start"… */
  name?: string;
  /** Objeto sobre el que ocurrió: slug de la solución, del caso, etc. */
  target?: string;
  metadata?: Record<string, unknown>;
};

function uuid(): string {
  // randomUUID no existe en contextos no seguros (http en LAN, WebViews viejos).
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/**
 * Devuelve el id de sesión vigente, creando uno nuevo si no hay o si venció
 * por inactividad. `nueva` indica si hay que dar de alta la sesión en el
 * servidor: sólo entonces se manda la atribución completa.
 */
function sesion(): { id: string; nueva: boolean } {
  const ahora = Date.now();
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      const g = JSON.parse(raw) as Guardado;
      if (g?.id && typeof g.last === "number" && ahora - g.last < SESSION_IDLE_MS) {
        localStorage.setItem(SESSION_KEY, JSON.stringify({ id: g.id, last: ahora }));
        return { id: g.id, nueva: false };
      }
    }
    const id = uuid();
    localStorage.setItem(SESSION_KEY, JSON.stringify({ id, last: ahora }));
    return { id, nueva: true };
  } catch {
    // localStorage bloqueado: se emite igual con una sesión efímera. Se pierde
    // la continuidad entre páginas, pero no el evento.
    return { id: uuid(), nueva: true };
  }
}

/**
 * Emite un evento. No bloquea, no lanza, y nunca rompe la navegación: si el
 * tracking falla, la página tiene que seguir funcionando igual.
 */
export function track(input: TrackInput): void {
  if (typeof window === "undefined") return;

  try {
    const { id, nueva } = sesion();
    const payload = {
      session_id: id,
      type: input.type,
      name: input.name,
      target: input.target,
      path: window.location.pathname,
      metadata: input.metadata,
      // La atribución viaja sólo al abrir la sesión: repetirla en cada evento
      // sería mandar los mismos bytes decenas de veces por visita.
      ...(nueva ? { session: { ...leerAtribucion(), device: dispositivo() } } : {}),
    };

    const body = JSON.stringify(payload);

    // sendBeacon sobrevive a que la pestaña se cierre o se navegue a otro sitio
    // — imprescindible para el clic a WhatsApp, que se lleva al usuario fuera.
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
      return;
    }

    void fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* el tracking nunca puede romper la página */
  }
}

/** Clasificación gruesa por ancho de viewport: alcanza para segmentar campañas. */
function dispositivo(): "mobile" | "tablet" | "desktop" {
  const w = window.innerWidth;
  if (w < 640) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}
