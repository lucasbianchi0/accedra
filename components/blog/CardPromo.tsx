"use client";

import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

import { CATEGORIA_COLOR, CATEGORIA_LABEL, type Categoria } from "@/lib/notas";
import { track } from "@/lib/track";

/**
 * El llamado a la acción intercalado en la grilla del blog.
 *
 * POR QUÉ ES UNA CARD Y NO UNA BANDA
 *
 * Una banda de ancho completo entre dos filas parte la grilla en dos y se lee
 * como un aviso pegado encima del contenido — que es exactamente lo que la
 * gente aprendió a saltear. Ocupando una celda entra en el mismo ritmo que las
 * notas: se la mira porque está en el lugar donde el ojo ya iba.
 *
 * Por eso copia la geometría de `NotaCard` hasta en el `aspect-[16/9]` de
 * arriba: si midiera distinto, la fila quedaría despareja y el truco se
 * rompería.
 *
 * NO SE DISFRAZA DE NOTA
 *
 * Que entre en el ritmo no significa que se haga pasar por una. Va sin foto,
 * con el color de la solución de fondo y un botón sólido: a un metro de
 * distancia ya se ve que es otra cosa. Hacerla indistinguible sería ganar un
 * clic y perder la confianza que la nota de al lado se ganó.
 *
 * SIGUE AL FILTRO
 *
 * Con una solución filtrada, el texto y el destino son los de esa solución
 * —quien está leyendo sobre ciberseguridad no quiere "hablemos de IT"—. Sin
 * filtro, el destino es el contacto.
 */
export default function CardPromo({ categoria }: { categoria: Categoria | null }) {
  const color = categoria ? CATEGORIA_COLOR[categoria] : "#2b6fd4";
  const etiqueta = categoria ? CATEGORIA_LABEL[categoria] : null;

  // En minúscula: la etiqueta viene capitalizada porque en un filtro es un
  // nombre propio ("Firma biométrica"), pero en el medio de una oración esa
  // mayúscula se lee como un error de tipeo.
  const enFrase = etiqueta ? etiqueta[0].toLowerCase() + etiqueta.slice(1) : null;

  const titulo = enFrase
    ? `¿Estás resolviendo algo de ${enFrase}?`
    : "¿Tenés un proyecto dando vueltas?";

  const bajada = etiqueta
    ? `Contanos en qué estás y te decimos qué aplica a tu caso y qué no. Sin cotización de por medio.`
    : `Quince minutos alcanzan para saber por dónde empezar. Sin cotización de por medio.`;

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-card border border-white/10"
      style={{ background: `linear-gradient(160deg, ${color}1f 0%, rgba(255,255,255,0.02) 55%)` }}
    >
      {/* El mismo alto que la portada de una nota, para que la fila no cojee.
          En lugar de foto, el halo de la solución. */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <div
          className="absolute -right-10 -top-16 h-56 w-56"
          aria-hidden="true"
          style={{ background: `radial-gradient(circle, ${color}4d 0%, transparent 70%)` }}
        />
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.10) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage: "radial-gradient(ellipse 70% 70% at 30% 40%, #000, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 30% 40%, #000, transparent 75%)",
          }}
        />
        <div className="absolute inset-0 flex items-center px-5 lg:px-6">
          <div className="flex items-center gap-2.5">
            <span
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border"
              style={{ borderColor: `${color}55`, background: `${color}1f`, color }}
            >
              <MessageCircle className="h-4 w-4" />
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color }}>
              {etiqueta ?? "Accedra"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 lg:p-6">
        <p className="font-display text-[18px] font-bold leading-[1.25] text-white">{titulo}</p>
        <p className="mt-2.5 text-[14px] leading-relaxed text-gray-400">{bajada}</p>

        <div className="mt-auto flex flex-wrap items-center gap-2.5 pt-5">
          <Link
            href="/#contacto"
            onClick={() => track({ type: "click", name: "blog_promo_contacto", target: categoria ?? "" })}
            className="shine relative inline-flex items-center gap-2 overflow-hidden rounded-full px-5 py-2.5 text-[13.5px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: "#2560BC", boxShadow: "0 8px 24px rgba(43,111,212,0.32)" }}
          >
            Hablar con un experto
            <ArrowRight className="h-3.5 w-3.5 shrink-0" />
          </Link>
          {/* El segundo destino va como link y no como botón: dos botones
              apilados estiraban la card por encima de las notas de su fila, y
              además competían entre sí. Uno sólido manda, el otro acompaña. */}
          {categoria && (
            <Link
              href={`/soluciones/${categoria}`}
              onClick={() => track({ type: "click", name: "blog_promo_solucion", target: categoria })}
              className="inline-flex items-center gap-1 text-[13px] font-medium text-gray-400 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              Ver {etiqueta}
              <ArrowRight className="h-3 w-3 shrink-0" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
