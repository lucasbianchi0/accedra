import { useId } from "react";

/**
 * La marca de Accedra AI: un cuadrado redondeado con degradé violeta → índigo
 * → azul y una chispa de cuatro puntas.
 *
 * Los colores salen de la paleta del sitio: el violeta de Software & AI
 * (#B45CF2), el índigo de Firma (#7C6CF6) y el azul de marca (#2B6FD4). Así
 * se lee como parte de Accedra y no como el logo de otro producto.
 *
 * `useId` en los degradés: el logo aparece varias veces en la misma página
 * (menú, botón de la portada, hoja), y dos SVG con el mismo id se pisan.
 */
export function LogoAccedraAI({ size = 24, brillo = false }: { size?: number; brillo?: boolean }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden className={brillo ? "ai-logo-brillo" : undefined}>
      <defs>
        <linearGradient id={`ai-fondo-${id}`} x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C26CF5" />
          <stop offset="0.5" stopColor="#7C6CF6" />
          <stop offset="1" stopColor="#2B6FD4" />
        </linearGradient>
        <radialGradient id={`ai-luz-${id}`} cx="0" cy="0" r="1" gradientTransform="translate(10 7) rotate(50) scale(20)" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" stopOpacity="0.45" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="1" y="1" width="30" height="30" rx="9" fill={`url(#ai-fondo-${id})`} />
      <rect x="1" y="1" width="30" height="30" rx="9" fill={`url(#ai-luz-${id})`} />
      <rect x="1.5" y="1.5" width="29" height="29" rx="8.5" stroke="#fff" strokeOpacity="0.25" />
      {/* Chispa principal */}
      <path
        d="M15 8.5c.5 3.6 2.4 5.5 6 6-3.6.5-5.5 2.4-6 6-.5-3.6-2.4-5.5-6-6 3.6-.5 5.5-2.4 6-6Z"
        fill="#fff"
      />
      {/* Chispa chica */}
      <path d="M22.5 19.5c.2 1.5 1 2.3 2.5 2.5-1.5.2-2.3 1-2.5 2.5-.2-1.5-1-2.3-2.5-2.5 1.5-.2 2.3-1 2.5-2.5Z" fill="#fff" fillOpacity="0.85" />
    </svg>
  );
}

/** "Accedra AI" con el "AI" en el degradé de la marca. */
export function NombreAccedraAI({ className = "" }: { className?: string }) {
  return (
    <span className={className}>
      Accedra{" "}
      <span
        style={{
          background: "linear-gradient(90deg, #D58BFA 0%, #9F8CFB 50%, #7FB3F8 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        AI
      </span>
    </span>
  );
}
