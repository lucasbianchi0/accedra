"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/track";

/**
 * Los guiños del robotito: cuando la persona llega a una sección donde decide
 * algo, el botón se levanta de su esquina y dice una frase de esa sección.
 *
 * No persigue el scroll ni cruza la pantalla: vive en su esquina y sale en los
 * momentos que importan. El borde derecho, además, ya lo ocupan las pestañas
 * de Eventos y Blog.
 *
 * Para que no moleste:
 * - sólo en escritorio y en la home (en el celular un globo tapa lo que se lee);
 * - nada en los primeros 8 segundos, y 20 entre uno y otro;
 * - cada sección una vez y tres por sesión como mucho;
 * - si la persona cierra uno, no hay más en la sesión;
 * - nunca con el chat abierto ni mientras escribe en un campo.
 *
 * Las secciones se miran con IntersectionObserver (sin escuchar el scroll) y
 * el movimiento es CSS: no mueve el layout ni pesa en el arranque.
 */

export type Guino = { id: string; texto: string };

const GUINOS: Guino[] = [
  { id: "servicios", texto: "¿Cuál de estos problemas se parece al tuyo?" },
  { id: "nosotros", texto: "¿Querés ver un caso parecido al tuyo?" },
  { id: "contacto", texto: "¿Preferís contármelo? Te armo el relevamiento en PDF." },
];

const CLAVE = "accedra-guinos";
const ESPERA_INICIAL = 8_000;
const ENTRE_GUINOS = 20_000;
const DURACION = 9_000;
const MAXIMO = 3;

type Registro = { vistos: string[]; apagado: boolean };

function leer(): Registro {
  try {
    const r = JSON.parse(sessionStorage.getItem(CLAVE) ?? "null") as Registro | null;
    if (r && Array.isArray(r.vistos)) return r;
  } catch {}
  return { vistos: [], apagado: false };
}

function guardar(r: Registro) {
  try {
    sessionStorage.setItem(CLAVE, JSON.stringify(r));
  } catch {}
}

/** `habilitado`: el botón está a la vista y el chat cerrado. */
export function useGuinos(activo: boolean, habilitado: boolean) {
  const [guino, setGuino] = useState<Guino | null>(null);
  const puede = useRef(habilitado);

  useEffect(() => {
    puede.current = habilitado;
  }, [habilitado]);

  useEffect(() => {
    if (!activo || !window.matchMedia("(min-width: 1024px)").matches) return;
    const inicio = Date.now();
    let ultimo = 0;
    let ocultar: ReturnType<typeof setTimeout> | undefined;

    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          const g = GUINOS.find((x) => x.id === e.target.id);
          const r = leer();
          if (!g || r.apagado || r.vistos.includes(g.id) || r.vistos.length >= MAXIMO) continue;
          const ahora = Date.now();
          if (!puede.current || ahora - inicio < ESPERA_INICIAL || ahora - ultimo < ENTRE_GUINOS) continue;
          const foco = document.activeElement;
          if (foco && /^(INPUT|TEXTAREA|SELECT)$/.test(foco.tagName)) continue;

          guardar({ ...r, vistos: [...r.vistos, g.id] });
          ultimo = ahora;
          setGuino(g);
          track({ type: "click", name: "chat_guino", target: g.id });
          clearTimeout(ocultar);
          ocultar = setTimeout(() => setGuino(null), DURACION);
        }
      },
      // La franja del medio de la pantalla: la sección cuenta cuando se está
      // leyendo, no cuando asoma el borde.
      { rootMargin: "-35% 0px -45% 0px" },
    );
    for (const g of GUINOS) {
      const el = document.getElementById(g.id);
      if (el) io.observe(el);
    }
    return () => {
      io.disconnect();
      clearTimeout(ocultar);
    };
  }, [activo]);

  // Si se abre el chat o se esconde el botón, el guiño se va.
  const visible = habilitado ? guino : null;

  return {
    guino: visible,
    soltar: () => setGuino(null),
    descartar: () => {
      if (guino) track({ type: "click", name: "chat_guino_cerrar", target: guino.id });
      guardar({ ...leer(), apagado: true });
      setGuino(null);
    },
  };
}
