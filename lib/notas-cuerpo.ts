/**
 * Partir el cuerpo de una nota en dos, para meter algo en el medio.
 *
 * POR QUÉ ACÁ Y NO EN `notas-markdown.ts`
 *
 * Ese archivo es gemelo del backoffice y tiene que seguir siéndolo: lo que se
 * escribe en el editor y lo que se publica en el sitio son el mismo HTML. Esto
 * es una decisión de maquetado del sitio —dónde va un llamado a la acción— que
 * el editor no tiene por qué conocer.
 *
 * EL CORTE VA EN UN `<h2>`
 *
 * Partir por cantidad de caracteres dejaría el bloque en la mitad de un
 * párrafo o, peor, adentro de una tabla. Un `<h2>` es el único lugar donde el
 * lector ya cerró una idea, así que es el único corte que no se siente como
 * una interrupción.
 */

/** Los `<h2>` del HTML renderizado, en orden, con su posición. */
function posicionesDeH2(html: string): number[] {
  const posiciones: number[] = [];
  const re = /<h2\b/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) posiciones.push(m.index);
  return posiciones;
}

/**
 * Devuelve `[antes, después]` cortando en el `<h2>` más cercano a la mitad.
 *
 * `después` viene vacío cuando la nota es demasiado corta para partirla, y en
 * ese caso quien llama no dibuja nada en el medio: en una nota de tres
 * secciones, un bloque intercalado y el cierre quedarían a dos pantallas uno
 * del otro y se leen como el mismo aviso repetido.
 *
 * Nunca corta en el primer `<h2>` —sería un llamado a la acción antes de haber
 * contado nada— ni en el último, que ya está cerca del cierre.
 */
export function partirCuerpo(html: string): [string, string] {
  const h2 = posicionesDeH2(html);

  // Con menos de cuatro secciones no hay un "medio" que no sea el principio o
  // el final de la nota.
  if (h2.length < 4) return [html, ""];

  const candidatos = h2.slice(1, -1);
  const mitad = html.length / 2;
  const corte = candidatos.reduce((mejor, p) =>
    Math.abs(p - mitad) < Math.abs(mejor - mitad) ? p : mejor
  );

  return [html.slice(0, corte), html.slice(corte)];
}
