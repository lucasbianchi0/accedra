import { Plus } from "lucide-react";

import type { Faq } from "@/lib/notas";

/**
 * Las preguntas frecuentes de una nota, plegadas.
 *
 * `<details>` NATIVO Y NO UN ACORDEÓN DE REACT
 *
 * Esta sección es el nodo que más rinde en GEO: es lo que un motor generativo
 * cita casi textual. Un acordeón hecho con `useState` monta la respuesta recién
 * cuando alguien hace clic, y lo que no está en el HTML no lo lee nadie —ni un
 * crawler, ni Ctrl+F, ni un lector de pantalla buscando en la página—.
 *
 * Con `<details>` las respuestas viajan SIEMPRE en el HTML, plegadas por CSS.
 * De yapa: funciona sin JavaScript, el teclado ya sabe operarlo, y el navegador
 * abre solo el panel correcto cuando alguien llega desde una búsqueda con
 * Ctrl+F o desde un ancla.
 *
 * Este archivo no lleva "use client": no hay estado ni handlers, así que es un
 * componente de servidor y no suma un byte de JS a la nota.
 *
 * LA ANIMACIÓN
 *
 * `::details-content` con `interpolate-size: allow-keywords` deja transicionar
 * de 0 a `auto`, que es lo que hace falta para desplegar una altura que no se
 * conoce de antemano (ver globals.css). Donde no exista, el panel abre de
 * golpe: se pierde la animación, no el contenido.
 *
 * NO HAY UNO ABIERTO POR DEFECTO
 *
 * La tentación es dejar la primera desplegada para que "se vea que hay algo".
 * Pero entonces la lista deja de leerse como un índice de preguntas —que es
 * para lo que sirve— y la primera respuesta empuja las otras cinco fuera de
 * pantalla.
 */
export default function Faqs({ faqs, color }: { faqs: Faq[]; color: string }) {
  if (faqs.length === 0) return null;

  return (
    <section className="mt-14 border-t border-white/10 pt-10">
      <h2 className="font-display text-[26px] font-bold tracking-[-0.02em] text-white md:text-[30px]">
        Preguntas frecuentes
      </h2>

      <div className="mt-6 space-y-2.5">
        {faqs.map((f, i) => (
          <details
            key={i}
            className="faq group overflow-hidden rounded-card border border-white/[0.08] bg-white/[0.02] transition-colors hover:border-white/15 open:border-white/15 open:bg-white/[0.035]"
          >
            <summary
              // `list-none` y el `::-webkit-details-marker` de globals.css sacan
              // el triangulito del navegador: el signo de abajo es el indicador.
              className="flex cursor-pointer list-none items-start gap-4 p-5 lg:p-6"
            >
              {/* h3 adentro del summary: la pregunta es un encabezado real y
                  entra en el esquema de la página, no es sólo un botón. */}
              <h3 className="min-w-0 flex-1 text-[16px] font-semibold leading-snug text-gray-100 transition-colors group-open:text-white md:text-[17px]">
                {f.q}
              </h3>
              <span
                aria-hidden="true"
                className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-all duration-300 group-open:rotate-45"
                style={{ borderColor: `${color}55`, color, background: `${color}1a` }}
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
              </span>
            </summary>

            <div className="px-5 pb-5 lg:px-6 lg:pb-6">
              {/* El texto arranca alineado con la pregunta y termina antes que
                  el signo: una respuesta que pasa por debajo del + se lee como
                  si el panel estuviera roto. */}
              <p className="max-w-[62ch] pr-10 text-[15px] leading-[1.75] text-gray-400">{f.a}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
