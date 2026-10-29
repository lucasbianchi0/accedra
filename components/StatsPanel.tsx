import type { CSSProperties } from "react";
import CountUp from "@/components/CountUp";

/**
 * Los números de la portada, en bloque 2×2 a la derecha del título.
 *
 * Antes eran una barra ancha debajo; ese lugar ahora es del asistente. El
 * material es el mismo de siempre —capa translúcida, brillo interior, línea de
 * luz arriba— y SIN backdrop-filter a propósito: el blur real es incompatible
 * con un fade-in (haría saltar el color), y así el bloque entero aparece junto
 * con los números contando.
 */
export default function StatsPanel({
  stats,
  className = "",
  style,
}: {
  stats: { value: string; label: string }[];
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`relative grid grid-cols-2 gap-px overflow-hidden rounded-[24px] border ${className}`}
      style={{
        ...style,
        borderColor: "rgba(255,255,255,0.18)",
        background: "rgba(255,255,255,0.14)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), 0 24px 60px rgba(0,0,0,0.42)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)" }}
      />
      {stats.map((s) => (
        <div
          key={s.label}
          className="flex flex-col justify-end px-5 py-6 transition-colors duration-300 hover:bg-white/[0.04] lg:px-7 lg:py-8"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 100%), rgba(14,26,46,0.42)",
          }}
        >
          <CountUp
            value={s.value}
            className="font-display text-3xl font-bold leading-none tracking-tight text-white lg:text-[42px]"
          />
          <span className="mt-2.5 text-[12px] font-medium leading-tight tracking-wide text-gray-400">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
