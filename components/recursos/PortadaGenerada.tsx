import { type NotaSitio } from "@/lib/notas";

/**
 * La portada de una nota que todavía no tiene foto.
 *
 * NO ES UN PLACEHOLDER
 *
 * Un hueco gris con un ícono de imagen rota dice "acá falta algo". Esto dice
 * otra cosa: es una portada de marca, dibujada con el color de la solución a
 * la que pertenece la nota. Una card con esto al lado de una con foto se leen
 * como dos piezas de la misma familia, no como una terminada y una a medio
 * hacer — que es el estado real del hub mientras se cargan las fotos en el
 * backoffice.
 *
 * ES SVG Y NO UNA IMAGEN
 *
 * No hay request, no hay layout shift, no hay generación en el servidor que
 * cachear ni invalidar: la portada viaja en el mismo HTML que la card y es
 * nítida en cualquier tamaño. El costo es un puñado de nodos por nota.
 *
 * EL DIBUJO ES DETERMINISTA
 *
 * La variante y los ángulos salen de un hash del slug, no de `Math.random()`:
 * el servidor y el cliente tienen que pintar lo mismo o React se queja, y la
 * misma nota tiene que verse igual cada vez que alguien vuelve al hub. Cuatro
 * variantes alcanzan para que una grilla de nueve no se vea repetida.
 */

/** djb2 sobre el slug. Alcanza: sólo hay que repartir en cuatro cajones. */
function hash(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h;
}

type Props = { nota: NotaSitio; color: string };

export default function PortadaGenerada({ nota, color }: Props) {
  const h = hash(nota.slug);
  const variante = h % 4;
  // El foco de luz no cae siempre en el mismo lugar: dos notas seguidas de la
  // misma solución tendrían el mismo dibujo si no.
  const fx = 22 + (h % 5) * 14;
  const fy = 18 + ((h >> 3) % 4) * 12;
  const id = `p-${nota.id.slice(0, 8)}`;

  return (
    <svg
      viewBox="0 0 400 225"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.30" />
          <stop offset="55%" stopColor="#0a1424" stopOpacity="1" />
          <stop offset="100%" stopColor="#05090f" stopOpacity="1" />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx={`${fx}%`} cy={`${fy}%`} r="62%">
          <stop offset="0%" stopColor={color} stopOpacity="0.55" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
        {/* La misma máscara para las cuatro variantes: el dibujo se apaga hacia
            los bordes para que nunca se vea dónde termina el patrón. */}
        <radialGradient id={`${id}-fade`} cx={`${fx}%`} cy={`${fy}%`} r="75%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id={`${id}-m`}>
          <rect width="400" height="225" fill={`url(#${id}-fade)`} />
        </mask>
      </defs>

      <rect width="400" height="225" fill={`url(#${id}-bg)`} />
      <rect width="400" height="225" fill={`url(#${id}-glow)`} />

      <g mask={`url(#${id}-m)`} stroke={color} fill="none">
        {variante === 0 && <Malla h={h} />}
        {variante === 1 && <Anillos h={h} />}
        {variante === 2 && <Grilla />}
        {variante === 3 && <Ondas h={h} />}
      </g>

    </svg>
  );
}

/** Diagonales paralelas con separación creciente: un degradé hecho de líneas. */
function Malla({ h }: { h: number }) {
  const inclina = h % 2 === 0 ? 1 : -1;
  return (
    <g strokeOpacity="0.32" strokeWidth="1">
      {Array.from({ length: 16 }, (_, i) => {
        const x = -120 + i * 34 + (i * i) / 5;
        return <line key={i} x1={x} y1={-20} x2={x + inclina * 160} y2={245} />;
      })}
    </g>
  );
}

/** Anillos concéntricos: la onda de una señal. */
function Anillos({ h }: { h: number }) {
  const cx = 60 + (h % 3) * 130;
  const cy = h % 2 === 0 ? 40 : 185;
  return (
    <g strokeWidth="1">
      {Array.from({ length: 9 }, (_, i) => (
        <circle key={i} cx={cx} cy={cy} r={22 + i * 26} strokeOpacity={0.42 - i * 0.035} />
      ))}
    </g>
  );
}

/** Retícula ortogonal: infraestructura, un rack visto de frente. */
function Grilla() {
  return (
    <g strokeOpacity="0.28" strokeWidth="0.9">
      {Array.from({ length: 13 }, (_, i) => (
        <line key={`v${i}`} x1={i * 34} y1={0} x2={i * 34} y2={225} />
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <line key={`h${i}`} x1={0} y1={i * 34} x2={400} y2={i * 34} />
      ))}
    </g>
  );
}

/** Arcos apilados: una huella dactilar abstracta. */
function Ondas({ h }: { h: number }) {
  const base = h % 2 === 0 ? 235 : -10;
  const dir = h % 2 === 0 ? -1 : 1;
  return (
    <g strokeWidth="1.1">
      {Array.from({ length: 10 }, (_, i) => {
        const y = base + dir * i * 24;
        return (
          <path
            key={i}
            d={`M -20 ${y} Q 200 ${y + dir * -70} 420 ${y}`}
            strokeOpacity={0.4 - i * 0.032}
          />
        );
      })}
    </g>
  );
}
