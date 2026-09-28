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
 * A QUÉ ALTURA CORTA
 *
 * No a la mitad: a un tercio. Apuntaba al medio exacto y en notas de cuatro
 * secciones eso empujaba el llamado a la acción a la tercera, que en una nota
 * que se lee en dos minutos queda a un párrafo del cierre — y el cierre ya
 * tiene el suyo. Los dos terminaban en la misma pantalla y se leían como el
 * mismo aviso repetido.
 *
 * A un tercio cae después de que la nota planteó el problema y antes de que lo
 * termine de desarmar, que es el momento en que la persona ya entendió qué le
 * pasa y todavía no sabe qué hacer. Ahí un "hablemos" es una respuesta, no una
 * interrupción.
 */
const ALTURA = 1 / 3;

/**
 * Devuelve `[antes, después]` cortando en el `<h2>` más cercano a `ALTURA`.
 *
 * `después` viene vacío cuando la nota es demasiado corta para partirla, y en
 * ese caso quien llama no dibuja nada en el medio.
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
  const objetivo = html.length * ALTURA;
  const corte = candidatos.reduce((mejor, p) =>
    Math.abs(p - objetivo) < Math.abs(mejor - objetivo) ? p : mejor
  );

  return [html.slice(0, corte), html.slice(corte)];
}
