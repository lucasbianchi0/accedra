"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowRight, CalendarDays, Check, Clock, Loader2, MapPin, Tag, Users, X } from "lucide-react";

import { BloqueFecha, CategoriaTags, LOCALE, Portada, fecha } from "@/components/EventosPiezas";
import { useT } from "@/lib/i18n/useT";
import { useLang } from "@/lib/i18n/LangProvider";
import { terminado, type EventoSitio } from "@/lib/eventos";
import { forSubmit } from "@/lib/attribution";
import { currentSessionId, track } from "@/lib/track";

type Estado = "idle" | "enviando" | "listo" | "error";

/** Lo que dura la salida. Tiene que coincidir con `evento-modal-out` en globals.css. */
const SALIDA_MS = 240;

/** El índice de cascada de cada bloque del contenido. */
const sube = (i: number) => ({ "--i": i }) as CSSProperties;

/**
 * El popup de un evento: la información completa y el mail para anotarse.
 *
 * Reemplaza a la página de detalle. Quien entra a un evento viene a decidir si
 * va, y la decisión se toma mejor sin cambiar de página: lee, deja el mail y
 * sigue donde estaba.
 *
 * ESTRUCTURA
 *
 * El contenido scrollea y el formulario queda fijo abajo: en un evento con
 * descripción larga, el campo del mail no puede quedar escondido al final.
 *
 * SEGURIDAD DEL LADO DEL CLIENTE (la real está en el endpoint)
 *
 *  · Honeypot: un campo invisible que las personas no ven ni completan.
 *  · Tiempo desde que se abrió el popup: un bot postea al instante.
 *  · El mail que se muestra en el mensaje de éxito lo pinta React como texto,
 *    nunca como HTML.
 *
 * Se monta al abrir y se desmonta al cerrar (quien lo usa le pone `key`), así
 * cada evento arranca con el formulario limpio sin sincronizar estado a mano.
 */
export default function EventoModal({
  evento: e,
  enfocarForm,
  onCerrar,
}: {
  evento: EventoSitio;
  /** "Participar" lo abre con el foco en el mail; "Ver detalle", arriba. */
  enfocarForm?: boolean;
  onCerrar: () => void;
}) {
  const t = useT();
  const { lang } = useLang();
  const locale = LOCALE[lang] ?? "es-AR";

  const dialogo = useRef<HTMLDialogElement>(null);
  const inputMail = useRef<HTMLInputElement>(null);
  const abiertoEn = useRef(0);

  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [estado, setEstado] = useState<Estado>("idle");
  const [error, setError] = useState("");
  const [mailEnviado, setMailEnviado] = useState(true);
  const [cerrando, setCerrando] = useState(false);

  // Cierra con la animación de salida y recién después avisa: quien lo montó lo
  // desmonta, y desmontarlo de golpe cortaría la animación a la mitad.
  const cerrar = () => {
    if (cerrando) return;
    setCerrando(true);
    window.setTimeout(onCerrar, SALIDA_MS);
  };

  useEffect(() => {
    const d = dialogo.current;
    if (!d) return;
    abiertoEn.current = Date.now();
    if (!d.open) d.showModal();
    if (enfocarForm) inputMail.current?.focus();
    track({ type: "click", name: "evento_detalle", target: e.slug });
  }, [e.slug, enfocarForm]);

  const f = fecha(e.inicio, locale);
  const horaFin = e.fin ? fecha(e.fin, locale).hora : null;
  const paso = terminado(e);

  async function enviar(ev: React.FormEvent) {
    ev.preventDefault();
    if (estado === "enviando") return;
    setEstado("enviando");
    setError("");

    try {
      const res = await fetch("/api/eventos/inscripcion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          evento_id: e.id,
          email: email.trim(),
          website,
          elapsedMs: Date.now() - abiertoEn.current,
          ...forSubmit(window.location.pathname),
          session_id: currentSessionId(),
        }),
      });
      const d = (await res.json().catch(() => ({}))) as { error?: string; mail?: boolean };

      if (res.ok) {
        setMailEnviado(d.mail !== false);
        setEstado("listo");
        track({ type: "form", name: "evento_inscripcion", target: e.slug });
        return;
      }

      setError(
        d.error === "full"
          ? t.events.errorFull
          : d.error === "closed"
            ? t.events.errorClosed
            : d.error === "rate_limited"
              ? t.events.errorRate
              : d.error === "email"
                ? t.events.errorEmail
                : t.events.errorGeneric
      );
      setEstado("error");
    } catch {
      setError(t.events.errorGeneric);
      setEstado("error");
    }
  }

  return (
    <dialog
      ref={dialogo}
      data-lenis-prevent
      aria-labelledby={`evento-titulo-${e.id}`}
      // Esc y el clic en el fondo cierran; el cierre lo hace quien lo montó.
      onCancel={(ev) => {
        ev.preventDefault();
        cerrar();
      }}
      onClick={(ev) => {
        if (ev.target === dialogo.current) cerrar();
      }}
      className={`evento-modal m-auto max-h-none w-[min(94vw,580px)] max-w-none overflow-visible bg-transparent p-0 ${cerrando ? "evento-modal--cerrando" : ""}`}
    >
      <div
        className="evento-modal-panel flex max-h-[92dvh] flex-col overflow-hidden rounded-panel border border-white/[0.12]"
        style={{
          background: "linear-gradient(180deg, #16263F 0%, #0F1C30 55%, #0A1424 100%)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 40px 100px rgba(0,0,0,0.6)",
        }}
      >
        {/* ── Información ── */}
        <div data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="evento-modal-portada relative aspect-[16/7] overflow-hidden">
            <Portada e={e} className="absolute inset-0" />
            <span
              className="absolute left-4 top-4 rounded-full px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-wider"
              style={{ background: "rgba(10,18,32,0.72)", color: "#DCE9FB", border: "1px solid rgba(255,255,255,0.12)" }}
            >
              {t.events.types[e.tipo]} · {t.events.modes[e.modalidad]}
            </span>
            <button
              type="button"
              onClick={cerrar}
              aria-label={t.events.close}
              className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-[#0A1220]/70 text-white/80 transition-[color,background-color,transform] duration-300 hover:rotate-90 hover:bg-[#0A1220]/90 hover:text-white"
            >
              <X size={18} />
            </button>
            <div className="absolute bottom-4 left-4">
              <BloqueFecha iso={e.inicio} locale={locale} grande />
            </div>
          </div>

          <div className="px-6 pb-6 pt-5">
            <div data-sube style={sube(0)}>
              <CategoriaTags categorias={e.categorias} tags={e.tags} />
            </div>

            <h2
              id={`evento-titulo-${e.id}`}
              data-sube
              style={sube(1)}
              className="mt-3 text-[23px] font-bold leading-tight text-white sm:text-[25px]"
            >
              {e.titulo}
            </h2>

            <ul data-sube style={sube(2)} className="mt-4 grid gap-x-5 gap-y-2 text-[13.5px] text-[#C9D6E8] sm:grid-cols-2">
              <li className="flex items-center gap-2">
                <CalendarDays size={15} className="flex-shrink-0 text-[#7FB3F8]" />
                {f.larga}
              </li>
              <li className="flex items-center gap-2">
                <Clock size={15} className="flex-shrink-0 text-[#7FB3F8]" />
                {f.hora}
                {horaFin ? ` – ${horaFin}` : ""} h
              </li>
              {e.lugar && (
                <li className="flex items-center gap-2">
                  <MapPin size={15} className="flex-shrink-0 text-[#7FB3F8]" />
                  {e.lugar}
                </li>
              )}
              {e.cupo && (
                <li className="flex items-center gap-2">
                  <Users size={15} className="flex-shrink-0 text-[#7FB3F8]" />
                  {t.events.seats}: {e.cupo}
                </li>
              )}
              {e.precio && (
                <li className="flex items-center gap-2">
                  <Tag size={15} className="flex-shrink-0 text-[#7FB3F8]" />
                  {e.precio}
                </li>
              )}
            </ul>

            {e.resumen && (
              <p data-sube style={sube(3)} className="mt-5 text-[15px] leading-relaxed text-white/85">
                {e.resumen}
              </p>
            )}
            {e.descripcion && (
              <p className="mt-3 whitespace-pre-line text-[14px] leading-relaxed text-[#9FB0C7]">{e.descripcion}</p>
            )}

            {e.oradores.length > 0 && (
              <div className="mt-6">
                <h3 className="text-[11.5px] font-semibold uppercase tracking-[0.18em] text-[#7FB3F8]">{t.events.speakers}</h3>
                <ul className="mt-2.5 space-y-2">
                  {e.oradores.map((o) => (
                    <li key={o.nombre} className="flex items-center gap-3">
                      <span
                        className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full font-display text-[12.5px] font-bold text-white"
                        style={{ background: "linear-gradient(135deg,#1640A0,#2F79E0)" }}
                      >
                        {o.nombre
                          .split(" ")
                          .map((p) => p[0])
                          .slice(0, 2)
                          .join("")}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[14px] font-semibold text-white">{o.nombre}</span>
                        <span className="block text-[12.5px] text-[#9FB0C7]">{[o.cargo, o.empresa].filter(Boolean).join(" · ")}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {e.marcas.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {e.marcas.map((m) => (
                  <div key={m.id} title={m.nombre} className="grid h-10 min-w-14 place-items-center rounded-xl bg-white px-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.logoUrl} alt={m.nombre} className="max-h-5 max-w-[84px] object-contain" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Inscripción ── */}
        <div data-sube style={sube(4)} className="relative border-t border-white/10 bg-[#0A1424]/85 px-6 py-5">
          {paso ? (
            <p className="text-[14px] text-[#9FB0C7]">{t.events.doneMessage}</p>
          ) : estado === "listo" ? (
            <div role="status" className="flex items-start gap-3">
              <span className="mt-0.5 grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-emerald-400/15 text-emerald-300">
                <Check size={17} strokeWidth={2.5} />
              </span>
              <div className="min-w-0">
                <p className="text-[15px] font-semibold text-white">{t.events.successTitle}</p>
                <p className="mt-0.5 break-words text-[13.5px] text-[#9FB0C7]">
                  {mailEnviado ? (
                    <>
                      {t.events.successMail} <span className="font-medium text-white">{email.trim()}</span>
                    </>
                  ) : (
                    t.events.successNoMail
                  )}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={enviar}>
              <label htmlFor={`evento-mail-${e.id}`} className="text-[14px] font-semibold text-white">
                {t.events.registerTitle}
              </label>
              <p className="mt-0.5 text-[12.5px] leading-relaxed text-[#9FB0C7]">{t.events.registerSub}</p>

              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input
                  ref={inputMail}
                  id={`evento-mail-${e.id}`}
                  type="email"
                  name="email"
                  required
                  maxLength={254}
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                  placeholder={t.events.emailPlaceholder}
                  aria-invalid={estado === "error"}
                  className="h-12 min-w-0 flex-1 rounded-full border border-white/15 bg-white/[0.06] px-5 text-[15px] text-white outline-none transition-colors placeholder:text-white/35 focus:border-[#7FB3F8]"
                />
                <button
                  type="submit"
                  disabled={estado === "enviando"}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[14.5px] font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-70"
                  style={{ background: "#2560BC", boxShadow: "0 10px 28px rgba(43,111,212,0.4)" }}
                >
                  {estado === "enviando" ? <Loader2 size={16} className="animate-spin" /> : null}
                  {estado === "enviando" ? t.events.sending : t.events.submit}
                  {estado !== "enviando" && <ArrowRight size={16} />}
                </button>
              </div>

              {/* Honeypot: fuera de pantalla, sin tabulación y sin autocompletar.
                  Una persona nunca lo completa; un bot que llena todo, sí. */}
              <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
                <label>
                  Website
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(ev) => setWebsite(ev.target.value)}
                  />
                </label>
              </div>

              {estado === "error" && (
                <p role="alert" className="mt-2 text-[13px] text-amber-300">
                  {error}
                </p>
              )}
              <p className="mt-2.5 text-[11.5px] text-white/45">{t.events.privacy}</p>
            </form>
          )}
        </div>
      </div>
    </dialog>
  );
}
