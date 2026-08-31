"use client";

/**
 * Link del hero + popup para pedir el brochure de la solución.
 *
 * Los PDF ya existían en `/public/brochures` (los genera `app/brochure/[slug]`)
 * pero no estaban enlazados desde ninguna página: se descargaban cero veces.
 *
 * En el hero va un LINK y no un botón: un tercer botón ahí arriba le competiría
 * la atención a "hablar con un experto", que es la conversión que más vale. El
 * campo vive en un popup y no desplegado en la portada porque ahí tiene lugar
 * para mostrar QUÉ se está pidiendo — sin eso, "dejá tu mail" es un formulario
 * a cambio de nada.
 *
 * El diálogo es un <dialog> nativo con showModal(): la trampa de foco, el cierre
 * con Escape y el fondo inerte los hace el navegador. Hechos a mano son cien
 * líneas más y siempre les falta un caso.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Download, X } from "lucide-react";
import { LIMITS } from "@/lib/contact/schema";
import { forSubmit } from "@/lib/attribution";
import { track, currentSessionId } from "@/lib/track";

type Textos = {
  brochureCta: string;
  brochureEmail: string;
  brochureSend: string;
  brochureNote: string;
  brochureReady: string;
  brochureSentTo: string;
  brochureError: string;
  brochureRate: string;
  brochureEyebrow: string;
  brochureBody: string;
  brochureChips: readonly string[];
  brochureClose: string;
};

/* ── La hoja ───────────────────────────────────────────────────────────────
 * Un PDF dibujado, no un ícono de librería: tiene la barra de acento de la
 * solución adentro y la esquina se despega al pasar el mouse. Es lo que hace
 * que el popup muestre algo en vez de sólo pedir.
 */
function Hoja({ listo }: { listo: boolean }) {
  return (
    <div className="relative shrink-0 w-[64px] h-[78px]">
      <svg
        viewBox="0 0 48 60"
        className="w-full h-full transition-transform duration-500 ease-out
                   [transform:rotate(-5deg)] group-hover/hoja:[transform:rotate(-2deg)_translateY(-3px)]"
        style={{ filter: "drop-shadow(0 12px 22px rgba(0,0,0,0.5))" }}
        aria-hidden="true"
      >
        <path
          d="M4.5 3.5h25.2L43.5 17.3V56a3 3 0 0 1-3 3h-33a3 3 0 0 1-3-3V6.5a3 3 0 0 1 3-3Z"
          fill="rgba(255,255,255,0.09)"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1"
        />
        {[30, 37, 44].map((y, i) => (
          <rect key={y} x="11" y={y} width={i === 2 ? 16 : 26} height="2.4" rx="1.2"
            fill="rgba(255,255,255,0.22)" />
        ))}
        <rect x="11" y="21" width="13" height="3.4" rx="1.7"
          fill="rgba(var(--accent-rgb,43,111,212),0.95)" />
        {/* La esquina doblada. transform-origin en el pliegue para que gire
            desde ahí y parezca papel levantándose, no un triángulo moviéndose. */}
        <g className="transition-transform duration-500 ease-out origin-[30px_17px]
                      group-hover/hoja:[transform:rotate(-11deg)_translate(1px,-1px)]">
          <path d="M29.7 3.5 43.5 17.3H32.7a3 3 0 0 1-3-3V3.5Z"
            fill="rgba(var(--accent-rgb,43,111,212),0.85)" />
          <path d="M29.7 3.5 43.5 17.3H32.7a3 3 0 0 1-3-3V3.5Z" fill="url(#pliegue)" />
        </g>
        <defs>
          <linearGradient id="pliegue" x1="30" y1="4" x2="44" y2="18" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fff" stopOpacity="0.45" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <span
        className={`absolute -right-1.5 -bottom-1 w-[28px] h-[28px] rounded-full flex items-center justify-center
                    transition-all duration-300 ${listo ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
        style={{
          background: "rgb(var(--accent-rgb,43,111,212))",
          boxShadow: "0 6px 16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.3)",
        }}
        aria-hidden="true"
      >
        <Check size={16} strokeWidth={3} className="text-white" />
      </span>
    </div>
  );
}

export default function BrochureLink({
  slug,
  name,
  accent,
  t,
}: {
  slug: string;
  name: string;
  accent: string;
  t: Textos;
}) {
  const [abierto, setAbierto] = useState(false);
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState<"idle" | "enviando" | "listo">("idle");
  // Se distingue el límite de cuota del fallo de envío: son problemas
  // distintos y "probá de nuevo" es un consejo inútil para el primero.
  const [error, setError] = useState<"rate" | "generic" | null>(null);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Honeypot + sello de montaje, igual que en Contact: el endpoint es el mismo
  // tipo de puerta abierta y está repetido en 40 páginas.
  const [website, setWebsite] = useState("");
  const mountedAt = useRef(0);
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  const listo = estado === "listo";
  const pdf = `/brochures/accedra-${slug}.pdf`;

  const cerrar = useCallback(() => setAbierto(false), []);

  // Apertura y cierre del <dialog>. El estado de React manda.
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (abierto && !d.open) d.showModal();
    if (!abierto && d.open) d.close();
  }, [abierto]);

  // Resincronización cuando el cierre lo dispara el navegador y no nosotros
  // (Escape, o el gesto de retroceso). Sin esto el estado queda en "abierto" con
  // el diálogo ya cerrado, y el bloqueo de scroll del fondo no se levanta nunca.
  //
  // Listener nativo: `close` no burbujea, así que no depende de cómo React
  // resuelva la delegación de un evento que no sube por el árbol.
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    const alCerrar = () => setAbierto(false);
    d.addEventListener("close", alCerrar);
    return () => d.removeEventListener("close", alCerrar);
  }, []);

  // Bloqueo del scroll de fondo mientras el popup está abierto.
  //
  // showModal() vuelve inerte el resto de la página pero NO frena el scroll, y
  // acá abajo hay un Lenis manejando la rueda. No se lo puede pausar desde este
  // archivo: `lenis/react` se carga con import() dinámico justamente para que un
  // teléfono no lo baje (ver LenisRoot), e importarlo acá lo devolvería al
  // bundle de arranque. Con overflow:hidden en <html> el scroll nativo se corta
  // y Lenis, que scrollea la ventana, se queda sin nada que mover.
  //
  // El padding compensa el ancho de la barra de scroll: sin eso el contenido
  // salta unos píxeles a la derecha al abrir y vuelve al cerrar.
  useEffect(() => {
    if (!abierto) return;
    const html = document.documentElement;
    const barra = window.innerWidth - html.clientWidth;
    const overflowPrevio = html.style.overflow;
    const paddingPrevio = html.style.paddingRight;
    html.style.overflow = "hidden";
    if (barra > 0) html.style.paddingRight = `${barra}px`;
    return () => {
      html.style.overflow = overflowPrevio;
      html.style.paddingRight = paddingPrevio;
    };
  }, [abierto]);

  // El foco entra al campo una vez que terminó la animación de apertura.
  useEffect(() => {
    if (!abierto || listo) return;
    const id = setTimeout(() => inputRef.current?.focus(), 260);
    return () => clearTimeout(id);
  }, [abierto, listo]);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setEstado("enviando");
    setError(null);
    try {
      const res = await fetch("/api/brochure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          slug,
          website, // honeypot
          elapsedMs: Date.now() - mountedAt.current,
          ...forSubmit(window.location.pathname),
          session_id: currentSessionId(),
        }),
      });
      if (res.ok) {
        // Recién con el 200, mismo criterio que el submit de contacto: contar
        // intentos fallidos como conversión desvía el bidding de Ads.
        track({ type: "form", name: "brochure", target: slug });
        setEstado("listo");
      } else {
        setError(res.status === 429 ? "rate" : "generic");
        setEstado("idle");
      }
    } catch {
      setError("generic");
      setEstado("idle");
    }
  };

  const abrir = () => {
    setAbierto(true);
    track({ type: "click", name: "brochure_abrir", target: slug });
  };

  return (
    <>
      {/* ── El disparador en el hero ──
          Después de descargar queda como link directo al PDF: si la persona
          vuelve a la página no tiene que dejar el mail otra vez. */}
      <div className="mt-7">
        {listo ? (
          <a
            href={pdf}
            download
            onClick={() => track({ type: "click", name: "brochure_descarga", target: slug })}
            className="group inline-flex items-center gap-2.5 text-[14px] font-semibold text-white"
          >
            <span
              className="inline-flex items-center justify-center w-[22px] h-[22px] rounded-full shrink-0"
              style={{ background: accent, boxShadow: `0 4px 14px rgba(var(--accent-rgb,43,111,212),0.5)` }}
            >
              <Check size={13} strokeWidth={3} className="text-white" />
            </span>
            <span className="underline decoration-white/25 underline-offset-[5px] group-hover:decoration-white/70 transition-colors">
              {t.brochureReady}
            </span>
            <Download size={15} className="text-white/60 transition-transform duration-200 group-hover:translate-y-0.5" />
          </a>
        ) : (
          <button
            type="button"
            onClick={abrir}
            className="group inline-flex items-center gap-2.5 text-[14px] font-medium text-gray-300
                       hover:text-white transition-colors duration-200"
          >
            <ArrowRight
              size={15}
              className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
              style={{ color: accent }}
            />
            <span className="underline decoration-white/20 underline-offset-[5px] group-hover:decoration-white/60 transition-colors">
              {t.brochureCta}
            </span>
          </button>
        )}
      </div>

      {/* ── El popup ──
          `data-brochure` es el gancho de las animaciones de globals.css (el panel
          entra, el fondo funde). `data-lenis-prevent` evita que la rueda dentro
          del diálogo llegue al scroll suave de la página. */}
      <dialog
        ref={dialogRef}
        data-brochure
        data-lenis-prevent
        // Cierre al hacer clic afuera: el <dialog> ocupa toda la pantalla y el
        // panel es un hijo, así que un clic cuyo target sea el diálogo mismo
        // cayó en el fondo.
        onClick={(e) => { if (e.target === dialogRef.current) cerrar(); }}
        aria-labelledby="brochure-titulo"
        className="m-auto w-[min(92vw,460px)] max-h-[92dvh] overflow-y-auto p-0 bg-transparent text-left"
      >
        <div
          className="group/hoja relative w-full overflow-hidden rounded-panel p-7 sm:p-9"
          style={{
            background:
              "linear-gradient(180deg, rgba(28,44,72,0.98) 0%, rgba(13,24,42,0.99) 100%)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.14), 0 40px 90px rgba(0,0,0,0.6)",
          }}
        >
          {/* Glow de acento arriba a la izquierda, detrás de la hoja */}
          <div className="absolute -top-16 -left-10 w-[260px] h-[200px] rounded-full blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(var(--accent-rgb,43,111,212),0.22), transparent 70%)" }} />
          <div className="absolute inset-x-12 top-0 h-px pointer-events-none"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)" }} />

          <button
            type="button"
            onClick={cerrar}
            aria-label={t.brochureClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full inline-flex items-center justify-center
                       text-gray-400 hover:text-white hover:bg-white/10 transition-colors duration-200"
          >
            <X size={18} />
          </button>

          <div className="relative z-[1] flex items-start gap-5 mb-6">
            <Hoja listo={listo} />
            <div className="min-w-0 pt-1">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] mb-1.5"
                style={{ color: "rgb(var(--accent-rgb,43,111,212))" }}>
                {t.brochureEyebrow}
              </p>
              <h2 id="brochure-titulo" className="text-white text-[23px] font-bold leading-tight text-balance">
                {name}
              </h2>
            </div>
          </div>

          <p className="relative z-[1] text-gray-300 text-[14.5px] leading-relaxed mb-5">
            {t.brochureBody}
          </p>

          {/* Qué trae adentro. Sin esto el popup pide un mail a cambio de una
              palabra ("brochure"), que es exactamente lo que nadie completa. */}
          <ul className="relative z-[1] flex flex-wrap gap-2 mb-7">
            {t.brochureChips.map((chip) => (
              <li key={chip}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium text-gray-300"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}>
                <Check size={12} strokeWidth={3} style={{ color: "rgb(var(--accent-rgb,43,111,212))" }} />
                {chip}
              </li>
            ))}
          </ul>

          {listo ? (
            <div className="relative z-[1]">
              <a
                href={pdf}
                download
                onClick={() => track({ type: "click", name: "brochure_descarga", target: slug })}
                className="shine relative overflow-hidden flex w-full items-center justify-center gap-2.5
                           px-6 py-3.5 rounded-full text-[15px] font-semibold text-white
                           transition-transform duration-200 hover:-translate-y-0.5"
                style={{ background: accent, boxShadow: `0 8px 28px rgba(var(--accent-rgb,43,111,212),0.45)` }}
              >
                <Download size={17} /> {t.brochureReady}
              </a>
              <p className="text-[12.5px] text-gray-400 mt-3.5 text-center">
                {t.brochureSentTo} <span className="text-gray-200">{email}</span>.
              </p>
            </div>
          ) : (
            <form onSubmit={enviar} className="relative z-[1]">
              {/* Honeypot: fuera de pantalla y fuera del orden de tabulación. El
                  id lleva prefijo porque Contact usa "website" en la misma página. */}
              <div className="absolute -left-[9999px] top-0 w-px h-px overflow-hidden" aria-hidden="true">
                <label htmlFor="brochure-website">No completar</label>
                <input id="brochure-website" name="website" type="text" tabIndex={-1}
                  autoComplete="off" value={website}
                  onChange={(e) => setWebsite(e.target.value)} />
              </div>

              <label htmlFor="brochure-email" className="sr-only">{t.brochureEmail}</label>
              <input
                ref={inputRef}
                id="brochure-email"
                type="email"
                required
                autoComplete="email"
                maxLength={LIMITS.email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.brochureEmail}
                className="w-full px-5 py-3.5 text-[14.5px] text-white border transition-colors duration-200
                           bg-white/[0.07] border-white/[0.16] placeholder:text-gray-500
                           hover:border-white/25 focus:border-white/40 focus:bg-white/[0.11]
                           shadow-[inset_0_1px_1px_rgba(0,0,0,0.2)]"
                // El radio va inline y no como `rounded-full`.
                //
                // La regla de foco de globals.css (:focus-visible, línea ~95) hace
                // `border-radius: inherit` sobre el propio elemento, y al estar
                // FUERA de todo @layer le gana a cualquier utilidad de Tailwind
                // por más específica que sea. Con la clase, el campo se
                // convertía en rectángulo justo al enfocarlo. El estilo inline
                // gana sin necesidad de !important.
                //
                // Es un defecto general —le pasa a todo input o botón redondeado
                // del sitio al recibir foco—, pero arreglarlo es tocar el foco de
                // todas las páginas, así que acá sólo se cubre este campo.
                style={{ borderRadius: "9999px" }}
              />

              <button
                type="submit"
                disabled={estado === "enviando"}
                className="shine relative overflow-hidden mt-3 flex w-full items-center justify-center gap-2
                           px-6 py-3.5 rounded-full text-[15px] font-semibold text-white
                           transition-transform duration-200 hover:-translate-y-0.5
                           disabled:opacity-60 disabled:hover:translate-y-0"
                style={{ background: accent, boxShadow: `0 8px 28px rgba(var(--accent-rgb,43,111,212),0.4)` }}
              >
                {estado === "enviando" ? (
                  <span className="w-[17px] h-[17px] rounded-full border-2 border-white/35 border-t-white animate-spin" />
                ) : (
                  <>{t.brochureSend} <ArrowRight size={16} /></>
                )}
              </button>

              <p className="text-[12px] leading-relaxed mt-3.5 text-center" role="status">
                {error ? (
                  <span className="text-amber-300/90">
                    {error === "rate" ? t.brochureRate : t.brochureError}
                  </span>
                ) : (
                  <span className="text-gray-400">
                    {t.brochureNote}{" "}
                    <Link href="/privacidad" className="underline underline-offset-2 hover:text-gray-300 transition-colors">
                      Privacidad
                    </Link>
                  </span>
                )}
              </p>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}
