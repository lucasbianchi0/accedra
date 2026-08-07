"use client";

import { useEffect, useRef, useState } from "react";

/* ── Fondo del hero: poster + video ────────────────────────────────────────
 *
 * El poster es el elemento LCP de la página, así que todo acá está ordenado
 * alrededor de una sola idea: que el poster se pinte lo antes posible y que
 * NADA compita con él por ancho de banda hasta que haya terminado.
 *
 * Tres decisiones que valen la explicación:
 *
 * 1) `<picture>` a mano en vez de next/image. El hero necesita ART DIRECTION,
 *    no sólo resize: en desktop el frame apaisado entra entero, pero en un
 *    teléfono vertical `object-cover` recorta a los costados y deja visible
 *    ~27% del ancho. Servir el apaisado en mobile significa descargar 4 px por
 *    cada 1 que se ve, y encima estirado (se veía blando). next/image no hace
 *    art direction — `sizes` elige TAMAÑO, no ENCUADRE. Con <picture> + media
 *    servimos un recorte vertical propio: menos bytes Y mejor imagen.
 *
 * 2) El video NO tiene `autoPlay` ni atributo `poster`.
 *    - `autoPlay` arrancaba la descarga en el primer frame, peleándole el caño
 *      al poster. El `preload="metadata"` que había no lo frenaba: autoplay
 *      manda sobre el hint. (Además había un `.play()` explícito en un efecto,
 *      así que ni siquiera dependía del atributo.)
 *    - `poster` era 155 KB tirados: el <video> vive en `opacity: 0` hasta que
 *      dispara `onPlaying`, así que su poster no se ve NUNCA. El que se ve es
 *      el <picture> de abajo.
 *
 * 3) El `src` se asigna por JS después del LCP. Mientras el <source> no tenga
 *    src, el navegador no pide un solo byte de video. Eso deja el caño entero
 *    para el poster, las fuentes y el JS durante los segundos que deciden las
 *    métricas. Recién cuando el poster ya pintó entra el video.
 *
 * Como el poster de cada breakpoint es el frame 0 EXACTO del video de ese
 * breakpoint (extraído del mp4 ya encodeado, no del master), el cambio de
 * imagen fija a video no produce ningún salto: la escena sólo cobra vida.
 */

const MOBILE_MQ = "(max-width: 767px)";

const VIDEO = {
  mobile: "/videos/hero-mobile.mp4", // 720x1280 vertical, 8s, 315 KB
  desktop: "/videos/5028622.mp4", // 1920x1080, 31s, 2,8 MB
};

export default function HeroMedia() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // Respetamos "reducir movimiento": queda el poster fijo, sin video.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Ahorro de datos declarado por el usuario o conexión pobre → sin video.
    const conn = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    if (conn?.saveData) return;
    if (conn?.effectiveType && /^(slow-)?2g$/.test(conn.effectiveType)) return;

    let cancelled = false;

    const start = () => {
      if (cancelled || !videoRef.current) return;
      const el = videoRef.current;
      el.src = window.matchMedia(MOBILE_MQ).matches
        ? VIDEO.mobile
        : VIDEO.desktop;
      el.playbackRate = 0.75;
      el.load();
      el.play().catch(() => {
        /* autoplay bloqueado: queda el poster, que es la misma imagen */
      });
    };

    // Esperamos al LCP real en vez de adivinar con un timeout. Si el navegador
    // no soporta la API (Safari), caemos a `load` + idle, que llega parecido.
    let idleId: number | undefined;
    const armFallback = () => {
      idleId = window.setTimeout(start, 300);
    };

    if (typeof PerformanceObserver !== "undefined") {
      let po: PerformanceObserver | undefined;
      try {
        po = new PerformanceObserver(() => {
          po?.disconnect();
          // Un respiro después del LCP para no robarle el hilo al primer input.
          idleId = window.setTimeout(start, 200);
        });
        po.observe({ type: "largest-contentful-paint", buffered: true });
      } catch {
        armFallback();
      }
      // Red de seguridad: si el LCP nunca reporta, arrancamos igual.
      const hardStop = window.setTimeout(start, 2500);
      return () => {
        cancelled = true;
        po?.disconnect();
        clearTimeout(hardStop);
        if (idleId) clearTimeout(idleId);
      };
    }

    armFallback();
    return () => {
      cancelled = true;
      if (idleId) clearTimeout(idleId);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 bg-[#0D1A2D]">
      {/* Preload del poster: es lo que `priority` de next/image hacía. Cada
          `media` apunta a un archivo distinto, así el teléfono precarga sólo el
          recorte vertical y el desktop sólo el apaisado — nunca los dos.
          React 19 sube estos <link> al <head> solo. */}
      <link
        rel="preload"
        as="image"
        href="/hero/hero-mobile.avif"
        type="image/avif"
        media={MOBILE_MQ}
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        href="/hero/hero-desktop-1280.avif"
        imageSrcSet="/hero/hero-desktop-1280.avif 1280w, /hero/hero-desktop-1920.avif 1920w"
        imageSizes="100vw"
        type="image/avif"
        media="(min-width: 768px)"
        fetchPriority="high"
      />

      <picture>
        <source
          type="image/avif"
          media={MOBILE_MQ}
          srcSet="/hero/hero-mobile.avif"
        />
        <source
          type="image/webp"
          media={MOBILE_MQ}
          srcSet="/hero/hero-mobile.webp"
        />
        <source
          type="image/avif"
          srcSet="/hero/hero-desktop-1280.avif 1280w, /hero/hero-desktop-1920.avif 1920w"
          sizes="100vw"
        />
        <source
          type="image/webp"
          srcSet="/hero/hero-desktop-1280.webp 1280w, /hero/hero-desktop-1920.webp 1920w"
          sizes="100vw"
        />
        {/* El <img> es el que realmente cuenta como LCP. `decoding="sync"` +
            `fetchPriority="high"` le piden al navegador que no lo posponga. */}
        <img
          src="/hero/hero-desktop.jpg"
          alt=""
          aria-hidden="true"
          width={1920}
          height={1080}
          decoding="sync"
          fetchPriority="high"
          className="hero-zoom absolute inset-0 h-full w-full object-cover"
        />
      </picture>

      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
        onPlaying={() => setPlaying(true)}
        className={`hero-zoom absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
          playing ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Gradient overlay. El borde INFERIOR funde al canvas de la página
          (navy-800 #0a1424), no a navy-700: así el hero se derrite en el fondo
          único en vez de cerrar un tono más claro y marcar una costura contra
          la barra de clientes. */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0D1A2D]/95 via-[#0D1A2D]/80 to-[#0D1A2D]/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a1424] via-transparent to-[#0D1A2D]/30" />
    </div>
  );
}
