import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

import { CATEGORIA_LABEL, type NotaSitio } from "@/lib/notas";
import { INDUSTRIES } from "@/components/solutions/industriesData";
import { getIndustrySeo } from "@/components/solutions/industrySeo";
import { ORG } from "@/lib/seo/site";

/**
 * Los llamados a la acción de una nota.
 *
 * POR QUÉ SON DOS Y NO UNO
 *
 * El cierre de abajo sólo lo ve quien llegó al final, y en una nota de cinco
 * minutos eso es una minoría. La banda del medio agarra al que ya entendió el
 * problema —está justo después de la sección que lo explica— y todavía no
 * terminó de leer la solución: es el momento en que la pregunta "¿y esto quién
 * me lo hace?" aparece sola.
 *
 * SON BOTONES, NO LINKS DE TEXTO
 *
 * Antes el cierre era un párrafo con un link azul. Un link subrayado en un mar
 * de texto es parte del texto; un botón sólido es una salida. Se usa el mismo
 * botón que el navbar —relleno #2560BC, `rounded-full`, el barrido de `.shine`
 * al pasar— para que quien lo ve sepa que es el mismo botón que viene mirando
 * en todo el sitio.
 *
 * A DÓNDE VAN
 *
 * El primario lleva al formulario de contacto, que es la conversión real. El
 * secundario, a la página de la solución de la que habla la nota, para quien
 * todavía está mirando. Las landings de industria aparecen sólo en el cierre:
 * en el medio serían cuatro botones y ninguna decisión.
 */

/** El botón lleno del sitio. Mismo relleno, radio y sombra que el del navbar. */
function BotonPrimario({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="shine relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3 text-[14.5px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
      style={{ background: "#2560BC", boxShadow: "0 8px 28px rgba(43,111,212,0.35)" }}
    >
      {children}
      <ArrowRight className="h-4 w-4 shrink-0" />
    </Link>
  );
}

function BotonSecundario({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3 text-[14.5px] font-medium text-gray-200 transition-colors hover:border-white/30 hover:bg-white/[0.06] hover:text-white"
    >
      {children}
    </Link>
  );
}

/**
 * La banda del medio del cuerpo.
 *
 * Es angosta y de una sola idea: interrumpe la lectura lo mínimo necesario
 * para dejar una salida. En mobile los botones pasan a ancho completo y
 * apilados — dos botones de 150 px uno al lado del otro en una pantalla de 390
 * son dos blancos que nadie acierta con el pulgar.
 */
export function CtaMedio({ nota }: { nota: NotaSitio }) {
  const etiqueta = nota.categoria ? CATEGORIA_LABEL[nota.categoria] : "esto";

  return (
    <aside className="not-prose my-12 overflow-hidden rounded-card border border-white/10 bg-gradient-to-br from-accent/[0.13] via-white/[0.03] to-transparent p-6 sm:p-7">
      <p className="text-[17px] font-semibold leading-snug text-white sm:text-[18px]">
        ¿Querés saber cómo queda esto en tu empresa?
      </p>
      <p className="mt-2 max-w-[54ch] text-[14.5px] leading-relaxed text-gray-400">
        Te decimos qué aplica a tu caso y qué no, sin compromiso. Una llamada de quince minutos
        alcanza para saber por dónde empezar.
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <BotonPrimario href="/#contacto">Hablar con un experto</BotonPrimario>
        {nota.categoria && (
          <BotonSecundario href={`/soluciones/${nota.categoria}`}>Ver {etiqueta}</BotonSecundario>
        )}
      </div>
    </aside>
  );
}

/**
 * El cierre de la nota.
 *
 * Más grande que la banda del medio porque acá no interrumpe nada: la nota ya
 * terminó y esto es lo único que queda para hacer. Suma las landings de
 * industria que la nota declara, que es el destino más específico que tenemos
 * para alguien que llegó hasta el final leyendo sobre su propio sector.
 */
export function CtaCierre({ nota }: { nota: NotaSitio }) {
  const landings = nota.categoria
    ? nota.industrias
        .filter((ind) => getIndustrySeo(nota.categoria!, ind))
        .map((ind) => ({
          href: `/soluciones/${nota.categoria}/${ind}`,
          label: INDUSTRIES[ind]?.name ?? ind,
        }))
    : [];

  return (
    <aside className="relative mt-14 overflow-hidden rounded-card border border-white/10 bg-white/[0.03] p-7 lg:p-9">
      {/* El mismo amanecer azul del fondo de la sección, a escala de una caja:
          hace que el cierre se lea como un bloque del sitio y no como un
          anuncio pegado abajo de la nota. */}
      <div
        className="pointer-events-none absolute -right-20 -top-28 h-72 w-72"
        aria-hidden="true"
        style={{ background: "radial-gradient(circle, rgba(43,111,212,0.28) 0%, transparent 70%)" }}
      />

      <div className="relative">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent-300">
          {ORG.shortName}
        </p>
        <p className="mt-3.5 max-w-[24ch] font-display text-[24px] font-bold leading-[1.15] tracking-[-0.02em] text-white sm:max-w-none sm:text-[28px]">
          Esto lo implementamos todos los días.
        </p>
        <p className="mt-3 max-w-[58ch] text-[15.5px] leading-relaxed text-gray-400">
          Si te quedó una duda concreta sobre tu caso, la respondemos sin vueltas: qué necesitás,
          qué no, y cuánto lleva. Sin cotización de por medio.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <BotonPrimario href="/#contacto">
            <MessageCircle className="h-4 w-4 shrink-0" />
            Hablar con un experto
          </BotonPrimario>
          {nota.categoria && (
            <BotonSecundario href={`/soluciones/${nota.categoria}`}>
              Ver {CATEGORIA_LABEL[nota.categoria]}
            </BotonSecundario>
          )}
        </div>

        {landings.length > 0 && (
          <div className="mt-6 border-t border-white/[0.08] pt-5">
            <p className="text-[12px] uppercase tracking-[0.14em] text-gray-500">Para tu sector</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {landings.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-[13px] text-gray-300 transition-colors hover:border-white/25 hover:text-white"
                >
                  {l.label}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
