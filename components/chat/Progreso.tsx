"use client";

import { Check } from "lucide-react";
import type { Mensaje } from "@/lib/chat/tipos";

/**
 * Cuánto falta: la línea de progreso del relevamiento.
 *
 * Sin esto una conversación con un asistente parece no tener fin, y la gente
 * abandona antes del PDF y del formulario, que es justo donde está el valor.
 * Son cinco pasos fijos que el prompt también conoce (ver "El recorrido" en
 * lib/chat/prompt.ts), y el avance se deduce de lo que ya pasó en la charla
 * —las tarjetas que se mostraron, cuántas veces respondió la persona— en vez
 * de pedírselo al modelo: no cuesta nada y no puede mentir.
 */

export type Estado = "hecho" | "actual" | "pendiente";
export type Paso = { id: string; label: string; estado: Estado };

const PASOS = [
  { id: "caso", label: "Tu caso" },
  { id: "contexto", label: "Contexto" },
  { id: "diagnostico", label: "Diagnóstico" },
  { id: "relevamiento", label: "Relevamiento PDF" },
  { id: "especialista", label: "Especialista" },
];

export function calcularPasos(mensajes: Mensaje[], leadEnviado: boolean): { pasos: Paso[]; actual: number } {
  const tarjetas = new Set(
    mensajes.flatMap((m) => m.partes.flatMap((p) => (p.tipo === "tarjeta" ? [p.tarjeta.tipo] : []))),
  );
  const respuestas = mensajes.filter((m) => m.rol === "user").length;
  const relevamiento = tarjetas.has("relevamiento");
  const diagnostico = relevamiento || tarjetas.has("solucion") || tarjetas.has("caso");

  const hechos = [
    respuestas >= 1,
    // Contestada la tanda de preguntas (el segundo mensaje), el contexto está.
    relevamiento || respuestas >= 2,
    diagnostico,
    relevamiento,
    leadEnviado,
  ];
  // En orden estricto: el actual es el primero sin hacer, aunque alguno
  // posterior ya se haya cumplido (un caso mostrado al primer mensaje no
  // saltea el contexto). Así la barra nunca promete que falta menos.
  const primeroPendiente = hechos.indexOf(false);
  // Con los datos enviados, el recorrido está completo aunque no haya PDF.
  const terminado = leadEnviado || primeroPendiente === -1;
  const actual = terminado ? PASOS.length - 1 : primeroPendiente;

  return {
    actual,
    pasos: PASOS.map((p, i) => ({
      ...p,
      estado: terminado || i < actual ? "hecho" : i === actual ? "actual" : "pendiente",
    })),
  };
}

/** Vertical, a la izquierda de la conversación en la hoja (escritorio ancho). */
export function ProgresoVertical({ mensajes, leadEnviado }: { mensajes: Mensaje[]; leadEnviado: boolean }) {
  const { pasos, actual } = calcularPasos(mensajes, leadEnviado);
  const faltan = pasos.filter((p) => p.estado !== "hecho").length;
  return (
    <nav aria-label="Progreso del relevamiento" className="w-[150px]">
      <p className="text-[11px] font-medium text-gray-500">Tu relevamiento</p>
      <ol className="mt-4">
        {pasos.map((p, i) => (
          <li key={p.id} className="relative flex gap-3 pb-5 last:pb-0">
            {i < pasos.length - 1 && (
              <span
                aria-hidden
                className={`absolute left-[9px] top-[22px] h-[calc(100%-18px)] w-px ${
                  p.estado === "hecho" ? "bg-gradient-to-b from-[#9F8CFB] to-[#2B6FD4]" : "bg-white/10"
                }`}
              />
            )}
            <Punto estado={p.estado} />
            <span
              className={`pt-px text-[13px] leading-[19px] ${
                p.estado === "actual" ? "font-semibold text-white" : p.estado === "hecho" ? "text-gray-400" : "text-gray-600"
              }`}
              aria-current={p.estado === "actual" ? "step" : undefined}
            >
              {p.label}
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-5 text-[11.5px] leading-snug text-gray-500">
        {faltan === 0 ? "¡Listo! Un especialista sigue tu caso." : `Paso ${actual + 1} de ${pasos.length}`}
      </p>
    </nav>
  );
}

function Punto({ estado }: { estado: Estado }) {
  if (estado === "hecho") {
    return (
      <span className="relative z-10 grid h-[19px] w-[19px] shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#9F6CF6] to-[#2B6FD4] text-white shadow-[0_0_12px_rgba(124,108,246,0.45)]">
        <Check size={11} strokeWidth={3} />
      </span>
    );
  }
  if (estado === "actual") {
    return (
      <span className="progreso-actual relative z-10 grid h-[19px] w-[19px] shrink-0 place-items-center rounded-full border-2 border-[#B9A5FB] bg-navy-800">
        <span className="h-[7px] w-[7px] rounded-full bg-[#B9A5FB]" />
      </span>
    );
  }
  return <span className="relative z-10 h-[19px] w-[19px] shrink-0 rounded-full border-2 border-white/10 bg-navy-800" />;
}

/** Horizontal y compacta: celular, hoja angosta y el chat de la derecha. */
export function ProgresoBarra({ mensajes, leadEnviado }: { mensajes: Mensaje[]; leadEnviado: boolean }) {
  const { pasos, actual } = calcularPasos(mensajes, leadEnviado);
  const listo = pasos.every((p) => p.estado === "hecho");
  return (
    <div aria-label="Progreso del relevamiento" className="flex items-center gap-3">
      <div className="flex flex-1 gap-1">
        {pasos.map((p) => (
          <span
            key={p.id}
            className={`h-1 flex-1 rounded-full ${
              p.estado === "hecho"
                ? "bg-gradient-to-r from-[#9F6CF6] to-[#2B6FD4]"
                : p.estado === "actual"
                  ? "progreso-actual bg-[#B9A5FB]/60"
                  : "bg-white/10"
            }`}
          />
        ))}
      </div>
      <span className="shrink-0 text-[11.5px] text-gray-400">
        {listo ? (
          "Listo"
        ) : (
          <>
            <span className="font-semibold text-white">{pasos[actual].label}</span> · {actual + 1}/{pasos.length}
          </>
        )}
      </span>
    </div>
  );
}

/**
 * La promesa del principio: qué se lleva la persona a cambio de contar su
 * caso. Sin esto, el PDF aparecía de sorpresa al final y nadie sabía que
 * existía hasta llegar.
 */
export function PromesaPdf({ className = "" }: { className?: string }) {
  return (
    <p
      className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1.5 pl-2 pr-3.5 text-[11.5px] text-gray-300 sm:text-[12.5px] ${className}`}
    >
      <svg width="14" height="17" viewBox="0 0 38 46" aria-hidden>
        <path d="M6 1h19l12 12v26a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6V7a6 6 0 0 1 6-6Z" fill="#9F8CFB" />
        <path d="M25 1v8a4 4 0 0 0 4 4h8" fill="#fff" fillOpacity="0.4" />
      </svg>
      {/* Un solo span: dentro del flex con gap, cada trozo de texto suelto
          quedaba separado ("PDF , sin costo"). */}
      <span>
        En 2 minutos te llevás un <span className="font-semibold text-white">relevamiento en PDF</span>, sin costo
      </span>
    </p>
  );
}
