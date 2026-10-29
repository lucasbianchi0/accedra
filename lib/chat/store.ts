"use client";

import { useSyncExternalStore } from "react";
import { LIMITES_CHAT, notaDeTarjeta, type Entrada, type Mensaje, type Parte, type Tarjeta } from "./tipos";
import { track } from "@/lib/track";

/**
 * La conversación con el asistente: una sola en todo el sitio.
 *
 * La misma charla se ve en la tarjeta de la portada y en el panel flotante, y
 * sigue al navegar de una página a otra. Por eso vive en un store de módulo y
 * no en el estado de un componente: la tarjeta del hero se desmonta al cambiar
 * de página, el panel puede no haberse montado nunca, y los dos tienen que ver
 * lo mismo mientras llega una respuesta.
 *
 * Se guarda en `sessionStorage`: sobrevive a navegar y se borra al cerrar la
 * pestaña. En el servidor el snapshot es siempre la conversación vacía, así el
 * HTML del SSR coincide con la hidratación y lo guardado aparece después.
 */

/** `preparando`: la herramienta que el modelo está escribiendo (ver "preparando" en la API). */
export type Estado = { mensajes: Mensaje[]; leadEnviado: boolean; enCurso: boolean; preparando: string | null };

const CLAVE = "accedra-chat";
const VACIO: Estado = { mensajes: [], leadEnviado: false, enCurso: false, preparando: null };

let estado: Estado = VACIO;
let cargado = false;
let abortar: AbortController | null = null;
const oyentes = new Set<() => void>();

function cargar() {
  if (cargado || typeof window === "undefined") return;
  cargado = true;
  try {
    const g = JSON.parse(sessionStorage.getItem(CLAVE) ?? "null") as Partial<Estado> | null;
    if (g && Array.isArray(g.mensajes)) {
      estado = { mensajes: g.mensajes, leadEnviado: Boolean(g.leadEnviado), enCurso: false, preparando: null };
    }
  } catch {}
}

function set(f: (e: Estado) => Estado) {
  cargar();
  estado = f(estado);
  try {
    if (estado.mensajes.length) {
      sessionStorage.setItem(CLAVE, JSON.stringify({ mensajes: estado.mensajes, leadEnviado: estado.leadEnviado }));
    } else {
      sessionStorage.removeItem(CLAVE);
    }
  } catch {}
  oyentes.forEach((o) => o());
}

const suscribir = (o: () => void) => {
  oyentes.add(o);
  return () => oyentes.delete(o);
};
const snapshot = () => {
  cargar();
  return estado;
};
const snapshotServidor = () => VACIO;

export function useConversacion(): Estado {
  return useSyncExternalStore(suscribir, snapshot, snapshotServidor);
}

/* ── Utilidades ───────────────────────────────────────────────────────────── */

export const textoDe = (m: Mensaje) =>
  m.partes
    .map((p) => (p.tipo === "texto" ? p.texto : notaDeTarjeta(p.tarjeta)))
    .join("\n\n")
    .trim();

/** La charla en texto, para que el especialista la reciba con el lead. */
export const conversacionEnTexto = () =>
  estado.mensajes
    .map((m) => `${m.rol === "user" ? "Visitante" : "Asistente"}: ${textoDe(m)}`)
    .join("\n\n")
    .slice(-6000);

/** El último relevamiento armado, para mandarlo con el lead. */
export function ultimoRelevamiento(): { datos: unknown; firma: string } | null {
  for (let i = estado.mensajes.length - 1; i >= 0; i--) {
    for (const p of estado.mensajes[i].partes) {
      if (p.tipo === "tarjeta" && p.tarjeta.tipo === "relevamiento") return { datos: p.tarjeta.datos, firma: p.tarjeta.firma };
    }
  }
  return null;
}

/** El historial que va al servidor: los últimos mensajes con contenido. */
function historial(mensajes: Mensaje[]): Entrada[] {
  const entradas = mensajes
    .filter((m) => !m.error)
    .map((m): Entrada => ({
      role: m.rol,
      content: textoDe(m).slice(0, m.rol === "user" ? LIMITES_CHAT.mensaje : LIMITES_CHAT.respuesta),
      // Sin la firma del servidor, el asistente no lee su propia respuesta.
      ...(m.firma ? { firma: m.firma } : {}),
    }))
    .filter((e) => e.content);
  let recortado = entradas.slice(-LIMITES_CHAT.historial);
  while (recortado.reduce((n, e) => n + e.content.length, 0) > LIMITES_CHAT.total && recortado.length > 1) {
    recortado = recortado.slice(1);
  }
  while (recortado.length && recortado[0].role !== "user") recortado = recortado.slice(1);
  return recortado;
}

const nuevoId = () => Math.random().toString(36).slice(2, 10);

const actualizar = (id: string, f: (m: Mensaje) => Mensaje) =>
  set((e) => ({ ...e, mensajes: e.mensajes.map((m) => (m.id === id ? f(m) : m)) }));

/* ── Acciones ─────────────────────────────────────────────────────────────── */

export async function enviar(crudo: string, origen = "panel") {
  cargar();
  const limpio = crudo.trim().slice(0, LIMITES_CHAT.mensaje);
  if (!limpio || estado.enCurso) return;

  const usuario: Mensaje = { id: nuevoId(), rol: "user", partes: [{ tipo: "texto", texto: limpio }] };
  const respuesta: Mensaje = { id: nuevoId(), rol: "assistant", partes: [] };
  // Una respuesta que falló sin escribir nada no vuelve a la conversación.
  const base = [...estado.mensajes.filter((m) => !(m.rol === "assistant" && m.error && !m.partes.length)), usuario];
  set((e) => ({ ...e, mensajes: [...base, respuesta], enCurso: true }));
  track({ type: "click", name: "chat_mensaje", target: origen, metadata: { n: base.filter((m) => m.rol === "user").length } });

  const ctrl = new AbortController();
  abortar = ctrl;
  const agregarTexto = (crudo: string) => {
    // Caracteres invisibles que a veces manda el modelo: un párrafo hecho
    // sólo de eso se dibuja como un hueco.
    const t = crudo.replace(/[\u200B-\u200D\uFEFF]/g, "");
    if (!t) return;
    actualizar(respuesta.id, (m) => {
      const partes = [...m.partes];
      const ultima = partes[partes.length - 1];
      if (ultima?.tipo === "texto") partes[partes.length - 1] = { tipo: "texto", texto: ultima.texto + t };
      else if (t.trim()) partes.push({ tipo: "texto", texto: t.replace(/^\s+/, "") });
      return { ...m, partes };
    });
  };
  const agregarTarjeta = (tarjeta: Tarjeta) => {
    actualizar(respuesta.id, (m) => ({ ...m, partes: [...m.partes, { tipo: "tarjeta", tarjeta } as Parte] }));
    set((e) => ({ ...e, preparando: null }));
  };
  const fallar = (error: string) => actualizar(respuesta.id, (m) => ({ ...m, error }));

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // La página desde la que escribe: no es lo mismo preguntar "¿esto sirve
      // para bancos?" en la home que en la landing de firma para bancos.
      body: JSON.stringify({ messages: historial(base), pagina: window.location.pathname }),
      signal: ctrl.signal,
    });
    if (!res.ok || !res.body) {
      const cuerpo = (await res.json().catch(() => null)) as { error?: string } | null;
      fallar(cuerpo?.error ?? "No pude responder. Probá de nuevo.");
      return;
    }

    const lector = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    for (;;) {
      const { value, done } = await lector.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const eventos = buffer.split("\n\n");
      buffer = eventos.pop() ?? "";
      for (const crudoEvento of eventos) {
        const evento = /^event: (.+)$/m.exec(crudoEvento)?.[1];
        const dato = /^data: (.*)$/m.exec(crudoEvento)?.[1];
        if (!evento || dato === undefined) continue;
        const valor = JSON.parse(dato);
        if (evento === "texto") agregarTexto(valor as string);
        else if (evento === "preparando") set((e) => ({ ...e, preparando: String(valor) }));
        else if (evento === "tarjeta") agregarTarjeta(valor as Tarjeta);
        else if (evento === "error") fallar((valor as { mensaje: string }).mensaje);
        else if (evento === "fin" && typeof (valor as { firma?: unknown })?.firma === "string") {
          const firma = (valor as { firma: string }).firma;
          actualizar(respuesta.id, (m) => ({ ...m, firma }));
        }
      }
    }
  } catch (e) {
    if ((e as Error).name !== "AbortError") fallar("Se cortó la conexión. Probá de nuevo.");
  } finally {
    set((e) => ({ ...e, enCurso: false, preparando: null }));
    if (abortar === ctrl) abortar = null;
  }
}

export function detener() {
  abortar?.abort();
}

export function reiniciar() {
  abortar?.abort();
  set(() => VACIO);
  track({ type: "click", name: "chat_reiniciar" });
}

export function marcarLeadEnviado() {
  set((e) => ({ ...e, leadEnviado: true }));
}
