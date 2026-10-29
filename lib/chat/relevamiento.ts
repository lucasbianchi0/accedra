import { createHmac, timingSafeEqual } from "node:crypto";
import { SOLUTIONS } from "@/components/solutions/solutionsData";
import { tarjetaCaso } from "./conocimiento";
import type { Relevamiento, TarjetaRelevamiento } from "./tipos";

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

/**
 * La clave de firma. RELEVAMIENTO_SECRET si está; si no, una derivada de la
 * clave de servicio de Supabase, que existe en todos los entornos donde hay
 * leads. Sin ninguna de las dos no se firma nada y no hay PDF.
 */
function clave(): string | null {
  const propia = process.env.RELEVAMIENTO_SECRET;
  if (propia) return propia;
  const base = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.OPENROUTER_API_KEY;
  return base ? createHmac("sha256", base).update("accedra:relevamiento").digest("hex") : null;
}

function firmar(datos: Relevamiento): string | null {
  const k = clave();
  return k ? createHmac("sha256", k).update(JSON.stringify(datos)).digest("base64url") : null;
}

export function verificar(datos: unknown, firma: unknown): datos is Relevamiento {
  if (!datos || typeof datos !== "object" || typeof firma !== "string") return false;
  const esperada = firmar(datos as Relevamiento);
  if (!esperada) return false;
  const a = Buffer.from(esperada);
  const b = Buffer.from(firma);
  return a.length === b.length && timingSafeEqual(a, b);
}

const texto = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim().slice(0, max) : "";

const lista = (v: unknown, max: number, largo: number) =>
  (Array.isArray(v) ? v : []).map((x) => texto(x, largo)).filter(Boolean).slice(0, max);

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
      cifra: c.cifras[0] ? `${c.cifras[0].value} ${c.cifras[0].label}` : "",
    }));

  const datos: Relevamiento = {
    empresa: texto(entrada.empresa, 80) || "Tu empresa",
    industria: texto(entrada.industria, 60),
    tamano: texto(entrada.tamano, 60),
    situacion: texto(entrada.situacion, 700),
    hallazgos: lista(entrada.hallazgos, 5, 220),
    areas,
    casos,
    proximosPasos: lista(entrada.proximos_pasos, 4, 200),
    fecha: new Date().toISOString(),
  };

  if (!datos.situacion || datos.hallazgos.length === 0 || datos.areas.length === 0) return null;
  if (datos.proximosPasos.length === 0) {
    datos.proximosPasos = [
      "Relevamiento técnico sin costo con un especialista de Accedra.",
      "Propuesta con alcance, plazos y prioridades.",
    ];
  }
  const firma = firmar(datos);
  return firma ? { tipo: "relevamiento", datos, firma } : null;
}
