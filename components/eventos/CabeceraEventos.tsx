"use client";

import { ZONA } from "@/lib/eventos";
import { useT } from "@/lib/i18n/useT";

/**
 * El encabezado de /eventos.
 *
 * NO ES UNA PORTADA, ES UN ENCABEZADO
 *
 * Mismo criterio que /recursos: quien entra ya sabe a qué vino y lo que busca
 * es la agenda, así que media pantalla de título centrado antes del primer
 * evento es una aduana. El encabezado anterior —«Aprendé con quienes lo
 * implementan», centrado, con `section-title`— era el de una landing de venta y
 * empujaba el primer evento debajo del pliegue.
 *
 * Queda un encabezado editorial: filete, volanta, título en la display y, a la
 * derecha, el dato que esta página sí tiene y la biblioteca no — cuántos
 * eventos vienen y cuándo es el próximo. Una agenda que dice «el próximo es en
 * 12 días» ya está vendiendo.
 *
 * ES DE CLIENTE POR EL IDIOMA
 *
 * No por interactividad: no tiene estado ni maneja un solo evento. Los textos
 * salen del diccionario, y el diccionario vive en un contexto de cliente. El
 * costo es el markup; el beneficio es que la página no queda con la lista
 * traducida y el título en castellano.
 */

function diasHasta(iso: string): number {
  const dia = 86_400_000;
  // Contra el arranque del día, no contra la hora exacta: un evento mañana a
  // las 9 está «en 0 días» si se mide en horas, y eso se lee como «es hoy».
  const hoy = new Date(new Date().toLocaleDateString("en-US", { timeZone: ZONA }));
  const cuando = new Date(new Date(iso).toLocaleDateString("en-US", { timeZone: ZONA }));
  return Math.max(0, Math.round((cuando.getTime() - hoy.getTime()) / dia));
}

export default function CabeceraEventos({
  proximos,
  realizados,
  /** ISO del primer evento que viene, para el contador. */
  proximoInicio,
}: {
  proximos: number;
  realizados: number;
  proximoInicio?: string;
}) {
  const t = useT().events.agenda;
  const dias = proximoInicio ? diasHasta(proximoInicio) : null;
  const cuando =
    dias === null ? null : dias === 0 ? t.today : dias === 1 ? t.tomorrow : t.inDays.replace("{n}", String(dias));

  return (
    <header className="container-x pb-9 pt-32 lg:pb-11 lg:pt-40">
      <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-px w-9 bg-gradient-to-r from-accent-300 to-accent-300/10" />
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.3em] text-accent-300">{t.kicker}</p>
          </div>
          <h1 className="mt-5 font-display text-[46px] font-bold leading-[0.95] tracking-[-0.035em] text-white lg:text-[58px]">
            {t.title}
          </h1>
          <p className="mt-5 max-w-[470px] text-[15px] leading-[1.7] text-gray-400">{t.lead}</p>
        </div>

        {/* El estado de la agenda, alineado al pie del título. Son dos datos y
            un separador: cualquier cosa más grande vuelve a ser una portada. */}
        {proximos > 0 && (
          <div className="flex items-center gap-5 lg:pb-3">
            <Dato numero={proximos} etiqueta={proximos === 1 ? t.upcomingOne : t.upcomingMany} vivo />
            <span className="h-8 w-px bg-white/10" />
            <Dato numero={realizados} etiqueta={t.doneMany} />
            {cuando && (
              <>
                <span className="hidden h-8 w-px bg-white/10 sm:block" />
                <p className="hidden text-[13px] leading-tight text-gray-400 sm:block">
                  {t.nextOne}
                  <br />
                  <span className="text-white">{cuando}</span>
                </p>
              </>
            )}
          </div>
        )}
      </div>

      <div className="mt-9 h-px bg-gradient-to-r from-white/[0.14] via-white/[0.05] to-transparent" />
    </header>
  );
}

function Dato({ numero, etiqueta, vivo }: { numero: number; etiqueta: string; vivo?: boolean }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-display text-[30px] font-bold leading-none tabular-nums text-white">{numero}</span>
      <span className="flex items-center gap-1.5 text-[12px] uppercase tracking-[0.14em] text-gray-500">
        {vivo && <span className="h-1.5 w-1.5 rounded-full bg-accent-300 shadow-[0_0_8px_#7fb3f8]" />}
        {etiqueta}
      </span>
    </div>
  );
}
