import type { Parte } from "./tipos";

/**
 * Saca la pregunta con la que termina una respuesta para dibujarla aparte.
 *
 * El modelo escribe primero y después muestra las tarjetas, así que la
 * pregunta quedaba en el medio: entre la explicación y una solución o un caso.
 * Sólo se toma el último párrafo del último texto, y sólo si es una pregunta;
 * lo demás queda donde estaba.
 */
export function separarPregunta(partes: Parte[]): { partes: Parte[]; pregunta: string | null } {
  let ultimo = -1;
  for (let i = partes.length - 1; i >= 0; i--) {
    if (partes[i].tipo === "texto") {
      ultimo = i;
      break;
    }
  }
  if (ultimo < 0) return { partes, pregunta: null };

  const texto = (partes[ultimo] as Extract<Parte, { tipo: "texto" }>).texto.trimEnd();
  const corte = texto.lastIndexOf("\n");
  const parrafo = texto.slice(corte + 1).trim();
  // Una viñeta que termina en "?" es parte de una lista, no la pregunta.
  if (!/\?\**\s*$/.test(parrafo) || /^([-*•]|\d+[.)])\s/.test(parrafo)) return { partes, pregunta: null };

  const resto = corte < 0 ? "" : texto.slice(0, corte).trim();
  const nuevas = partes.flatMap((p, i) =>
    i !== ultimo ? [p] : resto ? [{ ...p, texto: resto } as Parte] : [],
  );
  return { partes: nuevas, pregunta: parrafo };
}

/**
 * La pregunta de la respuesta: la de las opciones si el modelo la puso ahí
 * (lo que pide el prompt) y si no, la que escribió al final del texto.
 */
export function preguntaDe(partes: Parte[]): string | null {
  for (const p of partes) {
    if (p.tipo === "tarjeta" && p.tarjeta.tipo === "opciones" && p.tarjeta.pregunta) return p.tarjeta.pregunta;
  }
  return separarPregunta(partes).pregunta;
}
