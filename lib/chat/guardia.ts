import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { checkBotId } from "botid/server";

/**
 * Las defensas que comparten los endpoints del asistente.
 *
 * El asistente es la parte más cara del sitio de abusar: cada mensaje es una
 * llamada a Claude que paga Accedra, y lo que deja la persona termina en
 * `leads` y en el mail del equipo. Todo lo que llega es hostil hasta que se
 * demuestre lo contrario, y cada capa asume que la anterior se puede saltear:
 *
 *   1. Origen: sólo el propio sitio, desde un navegador (`mismoOrigen`).
 *   2. Bots: Vercel BotID, el desafío invisible (`esBot`).
 *   3. Tamaño: el cuerpo se lee con tope, sin cargarlo entero antes (`leerJson`).
 *   4. Cupos por IP, techos globales y presupuesto de tokens (en cada ruta).
 *   5. Firmas: lo que vuelve del navegador y dice ser del servidor —una
 *      respuesta del asistente, un formulario de contacto, un relevamiento—
 *      se verifica antes de creerle (`firmar` / `firmaValida`).
 *
 * Sólo server: usa `node:crypto` y las claves.
 */

/* ── Origen ───────────────────────────────────────────────────────────────── */

/**
 * El pedido viene de una página de este mismo sitio.
 *
 * Un navegador siempre manda `Origin` en un POST con fetch y no deja que una
 * página lo falsee: esto corta a otro sitio que quiera usar nuestro asistente
 * desde los navegadores de sus visitantes. Un script puede inventarlo, para eso
 * están las capas de abajo. Exigir `application/json` además obliga a cualquier
 * pedido de otro origen a pasar por un preflight CORS que nadie contesta.
 */
export function mismoOrigen(req: NextRequest): boolean {
  if (!(req.headers.get("content-type") ?? "").toLowerCase().startsWith("application/json")) return false;
  const origen = req.headers.get("origin");
  if (!origen) return false;
  let host: string;
  try {
    host = new URL(origen).host;
  } catch {
    return false;
  }
  const propio = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? req.nextUrl.host;
  if (host === propio) return true;
  // `next dev` en otra máquina de la red o con el puerto cambiado.
  return process.env.NODE_ENV !== "production" && /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host);
}

/* ── Bots ─────────────────────────────────────────────────────────────────── */

/**
 * Vercel BotID: el navegador resuelve un desafío invisible al cargar el sitio
 * (`instrumentation-client.ts`) y adjunta el resultado a los POST protegidos.
 * Un script que pega directo al endpoint no lo trae.
 *
 * Si la verificación misma falla (red, Vercel, configuración), se deja pasar
 * con un error en el log: los cupos y el presupuesto siguen en pie, y perder el
 * asistente entero por una caída de un tercero es peor.
 */
export async function esBot(): Promise<boolean> {
  try {
    const v = await checkBotId();
    // Los bots "verificados" (buscadores, agentes de IA) también quedan
    // afuera: ninguno tiene por qué conversar con el asistente ni dejar un lead.
    if (typeof v?.isBot !== "boolean") {
      console.error("[guardia] BotID devolvió algo inesperado, se deja pasar — revisar la configuración");
      return false;
    }
    return v.isBot;
  } catch (e) {
    // En producción esto suele ser configuración (falta OIDC en el proyecto de
    // Vercel): BotID queda apagado hasta arreglarlo. Tiene que verse.
    console.error("[guardia] BotID falló, se deja pasar — revisar la configuración:", (e as Error).message);
    return false;
  }
}

/* ── Cuerpo ───────────────────────────────────────────────────────────────── */

/**
 * Lee el cuerpo como JSON sin pasar de `max` bytes.
 *
 * `req.text()` carga todo antes de que se pueda medir: con un cuerpo de varios
 * megas el daño (memoria, tiempo de la función) ya está hecho. Acá se mira el
 * Content-Length y, por si miente, se corta la lectura al pasarse.
 *
 * Devuelve el objeto, "grande" o null si no es JSON de objeto.
 */
export async function leerJson(req: NextRequest, max: number): Promise<Record<string, unknown> | "grande" | null> {
  const declarado = Number(req.headers.get("content-length") ?? "0");
  if (declarado > max) return "grande";
  if (!req.body) return null;

  const lector = req.body.getReader();
  const partes: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { value, done } = await lector.read();
    if (done) break;
    total += value.byteLength;
    if (total > max) {
      await lector.cancel().catch(() => {});
      return "grande";
    }
    partes.push(value);
  }
  try {
    const dato = JSON.parse(Buffer.concat(partes).toString("utf8")) as unknown;
    return dato && typeof dato === "object" && !Array.isArray(dato) ? (dato as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/* ── Firmas ───────────────────────────────────────────────────────────────── */

/**
 * La clave de firma. CHAT_SECRET si está; si no RELEVAMIENTO_SECRET (la que
 * usaba sólo el PDF); si no, una derivada de la clave de servicio de Supabase,
 * que existe en todos los entornos donde hay leads. Sin ninguna no se firma
 * nada: sin firma no hay PDF ni formulario, que es lo seguro.
 */
export function claveDeFirma(): string | null {
  const propia = process.env.CHAT_SECRET ?? process.env.RELEVAMIENTO_SECRET;
  if (propia) return propia;
  const base = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.OPENROUTER_API_KEY;
  return base ? createHmac("sha256", base).update("accedra:relevamiento").digest("hex") : null;
}

/**
 * HMAC con propósito. El propósito va adelante del contenido para que una firma
 * de un tipo no sirva para otro (la de una respuesta del asistente no puede
 * hacerse pasar por la de un formulario de contacto).
 */
export function firmar(proposito: string, contenido: string): string | null {
  const k = claveDeFirma();
  return k ? createHmac("sha256", k).update(`${proposito}\n${contenido}`).digest("base64url") : null;
}

export function iguales(esperada: string | null, recibida: unknown): boolean {
  if (!esperada || typeof recibida !== "string") return false;
  const a = Buffer.from(esperada);
  const b = Buffer.from(recibida);
  return a.length === b.length && timingSafeEqual(a, b);
}

export const firmaValida = (proposito: string, contenido: string, firma: unknown) =>
  iguales(firmar(proposito, contenido), firma);

/* ── Texto del modelo ─────────────────────────────────────────────────────── */

/** El WhatsApp de Accedra: el único teléfono que puede quedar en un documento nuestro. */
const TELEFONO_ACCEDRA = "1133001233";

/**
 * Saca de un texto que escribió el modelo (o la persona) y va a salir con la
 * marca de Accedra —el PDF, el mail a la persona, las tarjetas— todo lo que
 * sirve para mandar a alguien a otro lado: enlaces y dominios (también
 * disfrazados, "evil[.]com"), direcciones de mail, IPs, teléfonos que no son
 * los nuestros y datos de cobro (alias, CBU).
 *
 * Si alguien logra torcer al modelo, lo peor que puede hacer con un documento
 * nuestro es meterle un "pagá en tal link" o "transferí a tal alias": un PDF
 * de phishing con nuestro logo. Sin a dónde mandar a la víctima, no sirve.
 */
export function sinEnlaces(texto: string): string {
  return texto
    .replace(/\s*[[({]\s*(?:\.|punto|dot)\s*[\])}]\s*/gi, ".")
    .replace(/\b(?:https?|ftp):\/\/\S+/gi, "")
    .replace(/\bwww\.\S+/gi, "")
    .replace(/[\w.+-]+\s*(?:@|\[at\]|\(at\))\s*[\w-]+(?:\.[\w-]+)+/gi, "")
    .replace(/\b\d{1,3}(?:\.\d{1,3}){3}\b(?:[:/]\S*)?/g, "")
    .replace(/\b[a-z0-9][\w-]*(?:\.[\w-]+)*\.[a-z]{2,24}\b(?:\/\S*)?/gi, (m) => (/^accedra\.com(?:\.ar)?$/i.test(m) ? m : ""))
    .replace(/\+?\d[\d\s().-]{6,}\d/g, (m) => {
      const digitos = m.replace(/\D/g, "");
      return digitos.length >= 8 && !digitos.endsWith(TELEFONO_ACCEDRA) ? "" : m;
    })
    .replace(/\b(?:alias|cbu|cvu|iban|swift)\b\s*:?\s*[\w.-]*/gi, "")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

/**
 * Un campo de una línea del formulario (nombre, empresa): sin saltos (en el
 * asunto de un mail rompen el envío), sólo letras, números y puntuación común,
 * y sin enlaces. El nombre va en el "Hola …" del mail a la persona: ahí no
 * puede entrar un "Juan, pagá en tal sitio".
 */
export const unaLinea = (texto: string, max: number) =>
  sinEnlaces(limpiarInvisibles(texto).replace(/[\r\n\t]+/g, " ").replace(/[^\p{L}\p{M}\p{N} .,'&()-]/gu, ""))
    .replace(/\s{2,}/g, " ")
    .trim()
    .slice(0, max);

/**
 * Caracteres que no se ven pero cambian lo que se lee: controles, de ancho cero
 * y los que invierten la dirección del texto (con ellos un "gratis" se puede
 * esconder detrás de un "pago"). Fuera de lo que escribe la persona.
 */
export const limpiarInvisibles = (texto: string) =>
  texto.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F​-‏‪-‮⁠-⁩﻿]/g, "");
