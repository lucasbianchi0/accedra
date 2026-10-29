/**
 * La cara del asistente: una cabecita con antena y dos ojos que parpadean.
 *
 * SVG propio y no un ícono de librería: es la identidad del asistente en el
 * botón, el panel y la portada, y tiene que poder animarse (parpadeo, antena
 * que late) sólo con CSS. Las animaciones viven en globals.css (`.robot-*`) y
 * se apagan con `prefers-reduced-motion`.
 */
export default function Robot({ size = 24, vivo = true }: { size?: number; vivo?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className={vivo ? "robot-vivo" : undefined}
    >
      {/* Antena */}
      <path d="M16 7.5V4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle className="robot-antena" cx="16" cy="3.6" r="2" fill="#7FB3F8" />
      {/* Cabeza */}
      <rect x="5" y="8" width="22" height="18" rx="7" fill="currentColor" fillOpacity="0.14" stroke="currentColor" strokeWidth="1.8" />
      {/* Orejas */}
      <path d="M3 15v4M29 15v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      {/* Ojos */}
      <g className="robot-ojos">
        <rect x="10.5" y="14" width="3.2" height="5" rx="1.6" fill="currentColor" />
        <rect x="18.3" y="14" width="3.2" height="5" rx="1.6" fill="currentColor" />
      </g>
    </svg>
  );
}
