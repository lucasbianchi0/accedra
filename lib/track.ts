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
/**
 * El navegador, más allá de la visita. A diferencia de `SESSION_KEY` no vence
 * nunca: es lo que permite saber que las tres visitas de esta semana son de la
 * misma persona y no de tres personas distintas.
 *
 * Sigue sin ser una cookie y sin identificar a nadie —es un UUID aleatorio que
 * no sale de este dominio—, pero es la única forma de medir recurrencia. Y en
 * B2B la recurrencia es media película: casi nadie pide una propuesta en la
 * primera visita, así que contar cada regreso como una persona nueva hace que
 * el sitio parezca peor de lo que es.
 */
const VISITOR_KEY = "accedra:vid";
/**
 * Marca de "esta computadora es del equipo". La setea quien entra una vez a
 * `?interno=1` y persiste hasta que entre a `?interno=0`.
 *
 * Por navegador y no por IP porque el equipo trabaja desde la oficina, desde
 * casa y desde el celular — una lista de IPs no los cubriría. Y guardar IPs de
 * visitas anónimas contradice la decisión de `sessions`, que a propósito no las
 * almacena.
 */
const INTERNO_KEY = "accedra:interno";
/** Inactividad tras la cual se considera una visita nueva. Convención estándar. */
const SESSION_IDLE_MS = 30 * 60 * 1000;

type Guardado = { id: string; last: number };

/** Familias de evento. `type` agrupa, `name` distingue dentro del grupo. */
// `popup` es su propia familia y no un `click` más: sus tres momentos —se
// mostró, se cerró, se hizo clic— sólo sirven comparados entre sí. Mezclados
// con los clics de WhatsApp y de las cards, la tasa de conversión del popup hay
// que reconstruirla a mano cada vez.
// `salida` cierra el pageview: lo emite Attribution cuando la página deja de
// mirarse, con cuánto tiempo estuvo visible y hasta dónde se scrolleó. Sin él,
// el tiempo de permanencia sólo se puede deducir restando pageviews
// consecutivos — y la última página de cada visita queda sin medir, que con un
// 81% de rebote significa no medir casi nada.
export type EventType = "pageview" | "click" | "form" | "popup" | "salida";

export type TrackInput = {
  type: EventType;
  /** Evento concreto: "whatsapp", "telefono", "solucion_card", "start"… */
  name?: string;
  /** Objeto sobre el que ocurrió: slug de la solución, del caso, etc. */
  target?: string;
  /**
   * Página a la que corresponde el evento. Por defecto la actual.
   *
   * Lo usa `salida`, que se emite mientras se está saliendo: en una navegación
   * del App Router la URL ya cambió a la página siguiente cuando corre la
   * limpieza del efecto, así que leer `location.pathname` ahí le adjudicaría el
   * tiempo de la página vieja a la nueva.
   */
  path?: string;
  metadata?: Record<string, unknown>;
};

/**
 * Id de la sesión vigente, sin crear una nueva si no existe.
 *
 * Lo usa el formulario de contacto para poder vincular el lead con su
 * recorrido de navegación. Devuelve null si no hay sesión: el lead se guarda
 * igual, sólo queda sin cruzar.
 */
export function currentSessionId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const g = JSON.parse(raw) as Guardado;
    if (!g?.id || typeof g.last !== "number") return null;
    return Date.now() - g.last < SESSION_IDLE_MS ? g.id : null;
  } catch {
    return null;
  }
}

/**
 * Lee el parámetro `?interno=` y persiste la marca. Devuelve si este navegador
 * es del equipo.
 *
 * Se evalúa en cada evento y no una sola vez al cargar: la marca se puede
 * activar a mitad de una sesión y lo esperable es que valga desde ahí.
 */
function esInterno(): boolean {
  try {
    const p = new URLSearchParams(window.location.search).get("interno");
    if (p === "1") localStorage.setItem(INTERNO_KEY, "1");
    else if (p === "0") localStorage.removeItem(INTERNO_KEY);
    return localStorage.getItem(INTERNO_KEY) === "1";
  } catch {
    // localStorage bloqueado: se asume visitante real. Contar de más a un
    // interno es menos grave que descartar a alguien que sí es tráfico.
    return false;
  }
}

function uuid(): string {
  // randomUUID no existe en contextos no seguros (http en LAN, WebViews viejos).
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/**
 * Id de este navegador, creándolo la primera vez. No vence.
 *
 * Devuelve null si el almacenamiento está bloqueado. Null y no un id efímero a
 * propósito: un id nuevo en cada carga inflaría el conteo de visitantes únicos
 * y haría que la recurrencia se lea como cero. Es preferible que esas visitas
 * queden sin visitante a que mientan.
 */
function visitante(): string | null {
  try {
    const guardado = localStorage.getItem(VISITOR_KEY);
    if (guardado) return guardado;
    const id = uuid();
    localStorage.setItem(VISITOR_KEY, id);
    return id;
  } catch {
    return null;
  }
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
      path: input.path ?? window.location.pathname,
      metadata: input.metadata,
      // La atribución viaja sólo al abrir la sesión: repetirla en cada evento
      // sería mandar los mismos bytes decenas de veces por visita.
      ...(nueva
        ? {
            session: {
              ...leerAtribucion(),
              device: dispositivo(),
              interno: esInterno(),
              visitor_id: visitante(),
            },
          }
        : {}),
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
