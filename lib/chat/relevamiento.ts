import { createHmac, randomBytes } from "node:crypto";
import { SOLUTIONS } from "@/components/solutions/solutionsData";
import { tarjetaCaso } from "./conocimiento";
import { claveDeFirma, iguales, sinEnlaces } from "./guardia";
import type { Prioridad, Relevamiento, TarjetaRelevamiento } from "./tipos";

/**
 * El relevamiento que arma el asistente y se descarga en PDF.
 *
 * El modelo propone el contenido con la herramienta `armar_relevamiento`; acá
 * se valida contra el catálogo —una solución que no existe o un caso que no
 * es nuestro no entran, por más que el modelo los nombre— y se firma. El PDF
 * lleva la marca de Accedra, así que el endpoint que lo genera sólo acepta
 * datos firmados por este servidor.
 *
 * Sólo server: usa `node:crypto` y la clave de firma.
 */

function firmar(datos: Relevamiento): string | null {
  const k = claveDeFirma();
  return k ? createHmac("sha256", k).update(JSON.stringify(datos)).digest("base64url") : null;
}

/**
 * Cuánto vale una firma. El relevamiento se descarga y se manda con el lead en
 * la misma visita; uno de hace un mes no tiene por qué seguir generando PDFs
 * con nuestra marca.
 */
const VIGENCIA_MS = 7 * 24 * 60 * 60 * 1000;

export function verificar(datos: unknown, firma: unknown): datos is Relevamiento {
  if (!datos || typeof datos !== "object" || typeof firma !== "string") return false;
  if (!iguales(firmar(datos as Relevamiento), firma)) return false;
  const fecha = Date.parse(String((datos as Relevamiento).fecha));
  return Number.isFinite(fecha) && Date.now() - fecha < VIGENCIA_MS && fecha - Date.now() < 60_000;
}

/** Sale con la marca de Accedra: sin enlaces ni casillas (ver `sinEnlaces`). */
const texto = (v: unknown, max: number) =>
  typeof v === "string"
    ? sinEnlaces(v.replace(/[\u0000-\u001F\u007F\u200B-\u200F\u202A-\u202E\u2060-\u2069\uFEFF]/g, " ").replace(/\s+/g, " ")).slice(0, max)
    : "";

const lista = (v: unknown, max: number, largo: number) =>
  (Array.isArray(v) ? v : []).map((x) => texto(x, largo)).filter(Boolean).slice(0, max);

const PRIORIDADES: Prioridad[] = ["alta", "media", "baja"];

/** Acepta el hallazgo como objeto {texto, prioridad} o como texto suelto. */
function hallazgos(v: unknown) {
  return (Array.isArray(v) ? v : [])
    .map((h) => {
      const o = (typeof h === "string" ? { texto: h } : (h ?? {})) as Record<string, unknown>;
      const prioridad = PRIORIDADES.includes(o.prioridad as Prioridad) ? (o.prioridad as Prioridad) : "media";
      return { texto: texto(o.texto, 220), prioridad };
    })
    .filter((h) => h.texto)
    .slice(0, 5);
}

function referencia(): string {
  const hoy = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `REL-${hoy}-${randomBytes(2).toString("hex").toUpperCase()}`;
}

/** De lo que pidió el modelo a la tarjeta firmada. Null si no alcanza para un PDF serio. */
export function armarRelevamiento(entrada: Record<string, unknown>): TarjetaRelevamiento | null {
  const areas = (Array.isArray(entrada.areas) ? entrada.areas : [])
    .map((a) => {
      const r = (a ?? {}) as Record<string, unknown>;
      const slug = texto(r.solucion, 40);
      const sol = SOLUTIONS[slug];
      if (!sol) return null;
      return {
        solucion: slug,
        nombre: sol.name,
        accent: sol.accent,
        porque: texto(r.porque, 260),
        propuesta: texto(r.propuesta, 320),
      };
    })
    .filter((a): a is NonNullable<typeof a> => Boolean(a && a.porque && a.propuesta))
    .slice(0, 3);

  const casos = lista(entrada.casos, 2, 40)
    .map((id) => tarjetaCaso(id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .map((c) => ({
      id: c.id,
      cliente: c.cliente,
      titulo: c.titulo,
      // La frase y no "5→<1 caídas": en el PDF se lee como resultado.
      cifra: c.logro,
    }));

  const datos: Relevamiento = {
    referencia: referencia(),
    empresa: texto(entrada.empresa, 80) || "Tu empresa",
    industria: texto(entrada.industria, 60),
    tamano: texto(entrada.tamano, 60),
    resumen: texto(entrada.resumen, 420),
    nota:
      texto(entrada.nota, 320) ||
      "Lo que nos contaste tiene solución, y no hace falta empezar comprando equipos: primero hay que ver el problema en el lugar. Para eso estamos.",
    situacion: texto(entrada.situacion, 700),
    hallazgos: hallazgos(entrada.hallazgos),
    areas,
    casos,
    proximosPasos: lista(entrada.proximos_pasos, 4, 200),
    fecha: new Date().toISOString(),
  };

  if (!datos.situacion || datos.hallazgos.length === 0 || datos.areas.length === 0) return null;
  if (!datos.resumen) datos.resumen = `${datos.areas[0].propuesta}`;
  if (datos.proximosPasos.length === 0) {
    datos.proximosPasos = [
      "Relevamiento técnico sin costo con un especialista de Accedra.",
      "Propuesta con alcance, plazos y prioridades.",
    ];
  }
  const firma = firmar(datos);
  return firma ? { tipo: "relevamiento", datos, firma } : null;
}
