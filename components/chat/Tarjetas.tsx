"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays, Check, Download, Loader2 } from "lucide-react";
import { nivelDe } from "@/lib/chat/tipos";
import type {
  TarjetaCaso,
  TarjetaEvento,
  TarjetaNota,
  TarjetaContacto,
  TarjetaHumano,
  TarjetaOpciones,
  TarjetaRelevamiento,
  TarjetaSolucion,
} from "@/lib/chat/tipos";
import { WHATSAPP_PHONE } from "@/lib/whatsapp";
import { forSubmit } from "@/lib/attribution";
import { currentSessionId, track } from "@/lib/track";
import { ultimoRelevamiento } from "@/lib/chat/store";
import { CATEGORIA_COLOR, type Categoria } from "@/lib/eventos";

/**
 * Las tarjetas que el asistente muestra dentro de la conversación.
 *
 * Todas siguen el lenguaje del resto del sitio: foto grande sangrada y pocos
 * campos en el caso, un dato por pieza, y "Ver X" como botón pastilla. Los
 * datos llegan armados del servidor desde la misma fuente que las páginas.
 */

const pastilla =
  "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold text-white transition-all hover:gap-2.5";

export function Solucion({ t, onNavegar }: { t: TarjetaSolucion; onNavegar: () => void }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4"
      style={{ boxShadow: `inset 3px 0 0 ${t.accent}` }}
    >
      <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: t.accent }}>
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: t.accent }} />
        Solución
      </div>
      <p className="font-display text-[15px] font-semibold text-white">{t.nombre}</p>
      <p className="mt-1 text-[13px] leading-relaxed text-gray-400">{t.motivo}</p>
      <Link
        href={t.href}
        onClick={() => {
          track({ type: "click", name: "chat_tarjeta", target: t.slug });
          onNavegar();
        }}
        className={`${pastilla} mt-3`}
        style={{ background: t.accent }}
      >
        Ver {t.nombre}
        <ArrowRight size={13} />
      </Link>
    </div>
  );
}

export function Caso({ t, onNavegar }: { t: TarjetaCaso; onNavegar: () => void }) {
  return (
    <Link
      href={t.href}
      onClick={() => {
        track({ type: "click", name: "chat_caso", target: t.id });
        onNavegar();
      }}
      className="group flex overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] transition-colors hover:border-white/20"
    >
      <div className="relative w-[38%] shrink-0 overflow-hidden">
        <Image src={t.imagen} alt="" fill sizes="160px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-navy-800/40" />
      </div>
      <div className="min-w-0 flex-1 p-3.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: t.accent }}>
          Caso de éxito · {t.industria}
        </p>
        <p className="mt-1 text-[13.5px] font-semibold leading-snug text-white">{t.titulo}</p>
        {(t.logro ?? "") && <p className="mt-2 text-[12.5px] leading-snug text-gray-300">{t.logro}</p>}
        <span className={`${pastilla} mt-2.5`} style={{ background: t.accent }}>
          Ver caso
          <ArrowRight size={13} />
        </span>
      </div>
    </Link>
  );
}

/** Ícono de PDF en los colores de Accedra AI. */
const colorDe = (c: string | null) => CATEGORIA_COLOR[c as Categoria] ?? "#7FB3F8";

/** Una nota del blog: para profundizar después de la devolución. */
export function Nota({ t, onNavegar }: { t: TarjetaNota; onNavegar: () => void }) {
  const color = colorDe(t.categoria);
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color }}>
        <BookOpen size={12} />
        Del blog
      </div>
      <p className="font-display text-[15px] font-semibold leading-snug text-white">{t.titulo}</p>
      {t.resumen && <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-gray-400">{t.resumen}</p>}
      <Link
        href={t.href}
        onClick={() => {
          track({ type: "click", name: "chat_nota", target: t.slug });
          onNavegar();
        }}
        className={`${pastilla} mt-3 border border-white/15 bg-white/[0.06] hover:bg-white/[0.1]`}
      >
        Leer nota
        <ArrowRight size={13} />
      </Link>
    </div>
  );
}

/** Un evento próximo: la otra puerta para quien todavía está explorando. */
export function Evento({ t, onNavegar }: { t: TarjetaEvento; onNavegar: () => void }) {
  const color = colorDe(t.categoria);
  return (
    <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div
        className="grid h-12 w-12 shrink-0 place-items-center rounded-xl"
        style={{ background: `${color}22`, color }}
      >
        <CalendarDays size={20} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color }}>
          Próximo evento · {t.modalidad}
        </p>
        <p className="font-display mt-0.5 text-[15px] font-semibold leading-snug text-white">{t.titulo}</p>
        <p className="mt-1 text-[12.5px] capitalize text-gray-400">
          {t.fecha}
          {t.lugar ? ` · ${t.lugar}` : ""}
        </p>
        <Link
          href={t.href}
          onClick={() => {
            track({ type: "click", name: "chat_evento", target: t.slug });
            onNavegar();
          }}
          className={`${pastilla} mt-3`}
          style={{ background: color }}
        >
          Quiero ir
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}

function IconoPdf() {
  return (
    <svg width="38" height="46" viewBox="0 0 38 46" fill="none" aria-hidden>
      <defs>
        <linearGradient id="pdf-hoja" x1="0" y1="0" x2="38" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C26CF5" />
          <stop offset="0.55" stopColor="#7C6CF6" />
          <stop offset="1" stopColor="#2B6FD4" />
        </linearGradient>
      </defs>
      <path d="M6 1h19l12 12v26a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6V7a6 6 0 0 1 6-6Z" fill="url(#pdf-hoja)" />
      <path d="M25 1v8a4 4 0 0 0 4 4h8" fill="#fff" fillOpacity="0.35" />
      <text x="18.5" y="34" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff" fontFamily="system-ui, sans-serif">
        PDF
      </text>
    </svg>
  );
}

/**
 * El relevamiento: breve a propósito. Ícono, para quién es, cuánto encontramos
 * y el botón. El contenido está en el PDF; acá sólo se anuncia.
 */
export function Relevamiento({ t }: { t: TarjetaRelevamiento }) {
  const [estado, setEstado] = useState<"listo" | "bajando" | "error">("listo");

  const descargar = async () => {
    if (estado === "bajando") return;
    setEstado("bajando");
    track({ type: "click", name: "relevamiento_pdf" });
    try {
      const res = await fetch("/api/chat/relevamiento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ datos: t.datos, firma: t.firma }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const nombre = /filename="([^"]+)"/.exec(res.headers.get("content-disposition") ?? "")?.[1] ?? "relevamiento.pdf";
      const url = URL.createObjectURL(await res.blob());
      const a = document.createElement("a");
      a.href = url;
      a.download = nombre;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
      setEstado("listo");
    } catch {
      setEstado("error");
    }
  };

  const resumen = [
    t.datos.puntaje != null ? `Nivel ${nivelDe(t.datos.puntaje).toLowerCase()}` : "",
    `${t.datos.hallazgos.length} hallazgos`,
    `${t.datos.areas.length} ${t.datos.areas.length === 1 ? "área" : "áreas"} para ayudarte`,
    t.datos.casos.length ? `${t.datos.casos.length} ${t.datos.casos.length === 1 ? "caso" : "casos"}` : "",
  ].filter(Boolean);

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-[#7C6CF6]/[0.12] to-[#2B6FD4]/[0.06] p-4">
      <IconoPdf />
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#B9A5FB]">Relevamiento</p>
        <p className="truncate text-[14px] font-semibold text-white">{t.datos.empresa}</p>
        <p className="mt-0.5 text-[12px] text-gray-400">{resumen.join(" · ")}</p>
        {estado === "error" && <p className="mt-1 text-[12px] text-red-300">No se pudo descargar. Probá de nuevo.</p>}
      </div>
      <button
        type="button"
        onClick={descargar}
        disabled={estado === "bajando"}
        className="enviar-ai inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-[12.5px] font-semibold text-white"
      >
        {estado === "bajando" ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
        PDF
      </button>
    </div>
  );
}

/**
 * Opciones de respuesta. Una: se manda al tocarla. Varias: se marcan y se
 * confirman. Escribir sigue valiendo: las opciones no reemplazan al campo.
 */
/**
 * "No lo sé" va siempre: una pregunta que la persona no sabe contestar no
 * puede trabar la conversación. Si el modelo ya puso algo parecido, no se
 * repite.
 */
const NO_SE = "No lo sé";
const yaTieneNoSe = (opciones: string[]) => opciones.some((o) => /no (lo )?s[eé]|no sabemos|no lo tenemos|no tengo claro|no est[aá] claro|ni idea/i.test(o));

export function Opciones({ t, onElegir }: { t: TarjetaOpciones; onElegir: (texto: string) => void }) {
  const [elegidas, setElegidas] = useState<string[]>([]);
  return (
    <div className="flex flex-wrap gap-2">
      {t.opciones.map((o) => {
        const activa = elegidas.includes(o);
        return (
          <button
            key={o}
            type="button"
            data-activa={activa ? "true" : "false"}
            onClick={() => {
              if (!t.multiple) return onElegir(o);
              setElegidas((e) => (activa ? e.filter((x) => x !== o) : [...e, o]));
            }}
            className="chip-ai rounded-full px-3.5 py-1.5 text-[13px]"
          >
            {o}
          </button>
        );
      })}
      {!yaTieneNoSe(t.opciones) && (
        <button
          type="button"
          onClick={() => onElegir(NO_SE)}
          className="rounded-full border border-dashed border-white/15 px-3.5 py-1.5 text-[13px] text-gray-400 transition-colors hover:border-white/30 hover:text-gray-200"
        >
          {NO_SE}
        </button>
      )}
      {t.multiple && elegidas.length > 0 && (
        <button
          type="button"
          onClick={() => onElegir(elegidas.join(", "))}
          className="enviar-ai inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-semibold text-white"
        >
          Listo <ArrowRight size={13} />
        </button>
      )}
    </div>
  );
}

export function enlaceWhatsApp(texto: string): string {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(texto)}`;
}

const IconoWhatsApp = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);
export { IconoWhatsApp };

export function Humano({ t }: { t: TarjetaHumano }) {
  return (
    <div className="rounded-2xl border border-[#25D366]/25 bg-[#25D366]/[0.07] p-4">
      <p className="text-[13.5px] font-semibold text-white">Seguimos con una persona del equipo</p>
      <p className="mt-1 text-[12.5px] leading-relaxed text-gray-400">
        Te dejamos el caso ya escrito para que no tengas que repetir nada. Lunes a viernes de 9 a 18.
      </p>
      <a
        href={enlaceWhatsApp(t.resumen)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track({ type: "click", name: "whatsapp", target: "chat_derivacion" })}
        className={`${pastilla} mt-3`}
        style={{ background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)" }}
      >
        <IconoWhatsApp size={14} />
        Abrir WhatsApp
      </a>
    </div>
  );
}

const campo =
  "chat-campo w-full rounded-xl border border-white/10 bg-navy-900/60 px-3 py-2.5 text-[16px] sm:text-[13.5px] text-white placeholder:text-gray-500 outline-none transition-[border-color,box-shadow] focus:border-[#9F8CFB]/60 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)]";

export function Contacto({
  t,
  conversacion,
  enviado,
  onEnviado,
}: {
  t: TarjetaContacto;
  /** La charla en texto, para que el especialista la tenga entera. */
  conversacion: () => string;
  enviado: boolean;
  onEnviado: () => void;
}) {
  const [form, setForm] = useState({ nombre: t.nombre, empresa: t.empresa, telefono: "", email: "" });
  const [estado, setEstado] = useState<"listo" | "enviando" | "error">("listo");
  const [mensajeError, setMensajeError] = useState("");
  const trampa = useRef<HTMLInputElement>(null);

  if (enviado) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.07] p-4">
        <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-400/20 text-emerald-300">
          <Check size={14} />
        </span>
        <div>
          <p className="text-[13.5px] font-semibold text-white">¡Listo! Ya tenemos tu caso.</p>
          <p className="mt-0.5 text-[12.5px] leading-relaxed text-gray-400">
            Un especialista lo analiza y te contacta en horario hábil. Si es urgente, escribinos por WhatsApp.
          </p>
        </div>
      </div>
    );
  }

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (estado === "enviando") return;
    setEstado("enviando");
    setMensajeError("");
    try {
      const res = await fetch("/api/chat/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          // La tarjeta tal como la firmó el asistente: sin esto no se acepta.
          resumen: t.resumen,
          solucion: t.solucion,
          emitido: t.emitido,
          firma: t.firma,
          conversacion: conversacion(),
          // Si el asistente armó el relevamiento, viaja firmado y le llega al
          // equipo comercial como PDF adjunto.
          relevamiento: ultimoRelevamiento(),
          website: trampa.current?.value ?? "",
          ...forSubmit(window.location.pathname),
          session_id: currentSessionId(),
        }),
      });
      if (res.ok) {
        // Con el 200 y no antes: es la conversión que optimizan las campañas.
        track({ type: "form", name: "submit", target: "chatbot" });
        onEnviado();
        return;
      }
      const cuerpo = (await res.json().catch(() => null)) as { error?: string } | null;
      setMensajeError(cuerpo?.error ?? "No se pudo enviar. Probá de nuevo.");
      setEstado("error");
    } catch {
      setMensajeError("No hay conexión. Probá de nuevo en un momento.");
      setEstado("error");
    }
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <form onSubmit={enviar} autoComplete="off" className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-[13.5px] font-semibold text-white">Dejanos tus datos y un especialista sigue tu caso</p>
      <p className="mt-0.5 text-[12px] text-gray-500">Le pasamos esta conversación para que no tengas que repetir nada.</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <input className={campo} placeholder="Nombre" name="ai-nombre" autoComplete="off" required maxLength={80} value={form.nombre} onChange={set("nombre")} />
        <input className={campo} placeholder="Empresa" name="ai-empresa" autoComplete="off" maxLength={80} value={form.empresa} onChange={set("empresa")} />
        <input className={`${campo} col-span-2`} placeholder="Teléfono / WhatsApp" type="tel" inputMode="tel" name="ai-telefono" autoComplete="off" required maxLength={30} value={form.telefono} onChange={set("telefono")} />
        <input className={`${campo} col-span-2`} placeholder="Email (opcional)" type="email" name="ai-email" autoComplete="off" maxLength={254} value={form.email} onChange={set("email")} />
      </div>
      {/* Honeypot: una persona no lo ve ni lo completa. */}
      <input ref={trampa} tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" name="website" />
      {mensajeError && <p className="mt-2 text-[12px] text-red-300">{mensajeError}</p>}
      <button
        type="submit"
        disabled={estado === "enviando"}
        className="enviar-ai mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-[13.5px] font-semibold text-white"
      >
        {estado === "enviando" ? <Loader2 size={15} className="animate-spin" /> : null}
        Enviar a un especialista
      </button>
      <p className="mt-2 text-center text-[11px] text-gray-600">
        Usamos tus datos sólo para contactarte. <Link href="/privacidad" className="underline hover:text-gray-400">Privacidad</Link>
      </p>
    </form>
  );
}
