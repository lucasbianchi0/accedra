"use client";

import { Reveal } from "@/components/Reveal";
import { clients } from "@/components/clientsData";


/*
 * LA BANDA DE CLIENTES, EN OSCURO.
 *
 * Era una franja blanca (#F1F5F9) con los logos en su color original. Sobre el
 * navy pasaba; sobre el casi negro de la portada es un tajo de luz en el medio
 * de la página, y el ojo va ahí antes que al mensaje.
 *
 * Ahora la banda no pinta nada —deja ver el canvas— y los logos se normalizan a
 * blanco con `brightness(0) invert(1)`. Eso hace dos cosas: saca el ruido de
 * nueve paletas distintas peleándose, y pone a todas las marcas en el mismo
 * plano, que es exactamente lo que comunica una banda de clientes. Es el mismo
 * recurso que usan las consultoras grandes para su fila de logos.
 *
 * Los logos quedan al 55% y suben al 90% cuando el cursor pasa por la fila: se
 * leen como una textura hasta que alguien decide mirarlos.
 */
export default function ClientsBar() {
  const doubled = [...clients, ...clients];

  return (
    <section
      id="clientes"
      className="group/banda overflow-hidden border-y border-white/[0.06] py-8"
    >
      <Reveal as="div" y={14} blur={false} amount={0.4} className="relative overflow-hidden">
        {/* Los velos de los bordes ahora son del color del canvas: la fila
            aparece y desaparece en la nada, sin un corte contra un rectángulo. */}
        <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-32 bg-gradient-to-r from-[#04070d] to-transparent" />
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-32 bg-gradient-to-l from-[#04070d] to-transparent" />

        <div className="flex w-max animate-marquee">
          {doubled.map((client, i) => (
            <div key={i} className="flex-shrink-0 mx-4 sm:mx-7">
              <div className="h-12 sm:h-16 flex items-center justify-center w-36 sm:w-48">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={client.logo}
                  alt={client.name}
                  // lazy + async: sin esto React emite un <link rel="preload"> por
                  // cada logo y en mobile veintipico de preloads le pelean el caño
                  // al poster del hero, que es el elemento LCP.
                  loading="lazy"
                  decoding="async"
                  className={`w-auto object-contain transition-opacity duration-500 ${
                    "conFondo" in client && client.conFondo
                      ? "rounded-[3px] opacity-70 group-hover/banda:opacity-100"
                      : "opacity-55 group-hover/banda:opacity-90"
                  }`}
                  style={{
                    height: `calc(clamp(26px, 3.8vw, 42px) * ${client.scale ?? 1})`,
                    maxWidth: "185px",
                    // Todas las marcas al mismo blanco: el color de cada logo es
                    // del dueño de la marca, la jerarquía de esta fila es nuestra.
                    //
                    // Menos las que traen fondo sólido: invertirlas las deja como
                    // un rectángulo blanco. Esas van con su arte, un punto más
                    // opacas para que no se pierdan contra el casi negro.
                    filter: "conFondo" in client && client.conFondo ? undefined : "brightness(0) invert(1)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
