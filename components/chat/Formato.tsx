import type React from "react";
import Link from "next/link";

/**
 * Lo que escribe el modelo, dibujado.
 *
 * Formateador propio y no una librería de markdown, por el mismo motivo que en
 * el backoffice: un parser genérico interpreta HTML, imágenes y enlaces a
 * cualquier dominio, y acá el texto lo genera un modelo que habla con
 * desconocidos. Este reconoce negrita, enlace a una ruta del sitio, viñeta y
 * numeral, y nada más. Nada de `dangerouslySetInnerHTML`.
 */

const EN_LINEA = /\*\*(.+?)\*\*|\[([^\]\n]+)\]\(([^)\s]+)\)/g;

/** Sólo rutas del sitio. Un link a otro dominio queda como texto. */
const rutaPermitida = (href: string) => /^\/(?!\/)[\w\-/#?=&.%]*$/.test(href);

function enLinea(texto: string, onNavegar: () => void, clave = "l"): React.ReactNode[] {
  const nodos: React.ReactNode[] = [];
  let desde = 0;
  let n = 0;
  for (const m of texto.matchAll(EN_LINEA)) {
    const i = m.index ?? 0;
    if (i > desde) nodos.push(texto.slice(desde, i));
    const k = `${clave}-${n++}`;
    if (m[1] !== undefined) {
      nodos.push(
        <strong key={k} className="font-semibold text-white">
          {enLinea(m[1], onNavegar, k)}
        </strong>,
      );
    } else if (rutaPermitida(m[3])) {
      nodos.push(
        <Link
          key={k}
          href={m[3]}
          onClick={onNavegar}
          className="font-medium text-accent-300 underline decoration-accent-300/40 underline-offset-2 transition-colors hover:decoration-accent-300"
        >
          {m[2]}
        </Link>,
      );
    } else {
      nodos.push(<span key={k}>{m[2]}</span>);
    }
    desde = i + m[0].length;
  }
  if (desde < texto.length) nodos.push(texto.slice(desde));
  return nodos;
}

export default function Formato({ texto, onNavegar }: { texto: string; onNavegar: () => void }) {
  const bloques: React.ReactNode[] = [];
  let lista: { tipo: "ul" | "ol"; items: string[] } | null = null;

  const cerrarLista = () => {
    if (!lista) return;
    const k = `b-${bloques.length}`;
    const items = lista.items.map((it, i) => (
      <li key={i} className="pl-1">
        {enLinea(it, onNavegar, `${k}-${i}`)}
      </li>
    ));
    bloques.push(
      lista.tipo === "ul" ? (
        <ul key={k} className="list-disc space-y-1 pl-5 marker:text-accent-300/60">
          {items}
        </ul>
      ) : (
        <ol key={k} className="list-decimal space-y-1 pl-5 marker:text-gray-500">
          {items}
        </ol>
      ),
    );
    lista = null;
  };

  for (const cruda of texto.split("\n")) {
    const linea = cruda.trim();
    const vineta = /^[-*•]\s+(.*)$/.exec(linea);
    const numeral = /^\d+[.)]\s+(.*)$/.exec(linea);
    if (vineta || numeral) {
      const tipo = vineta ? "ul" : "ol";
      if (lista && lista.tipo !== tipo) cerrarLista();
      if (!lista) lista = { tipo, items: [] };
      lista.items.push((vineta ?? numeral)![1]);
      continue;
    }
    cerrarLista();
    if (!linea) continue;
    // El prompt pide no usar títulos; si aparece uno, se lee como negrita.
    const titulo = /^#{1,6}\s+(.*)$/.exec(linea);
    bloques.push(
      <p key={`b-${bloques.length}`} className={titulo ? "font-semibold text-white" : undefined}>
        {enLinea(titulo ? titulo[1] : linea, onNavegar, `b-${bloques.length}`)}
      </p>,
    );
  }
  cerrarLista();

  return <div className="space-y-2.5 break-words">{bloques}</div>;
}
