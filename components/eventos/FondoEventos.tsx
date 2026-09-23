/**
 * El fondo de la sección de eventos — tres climas para elegir uno.
 *
 * POR QUÉ NO SIRVE `AmbientLight` ACÁ
 *
 * Es el mismo problema que llevó a /recursos a su propio fondo: las siete
 * lámparas están calibradas para una página de venta larga, y acá el contenido
 * son portadas de fotos distintas más los colores de las cinco soluciones. Sobre
 * el navy iluminado las portadas se ensucian y las pastillas violeta y cian
 * pierden el color. Sobre casi negro conviven todas.
 *
 * POR QUÉ TAMPOCO ES EL DE /recursos
 *
 * Recursos es una biblioteca: quieta, sin tiempo, el fondo se corre del medio.
 * Eventos es una cartelera: hay una fecha, hay una sala y hay algo que empieza.
 * Comparten el canvas casi negro —son la misma casa— pero el clima cambia.
 *
 * TODO ES CSS Y UN SVG DE 140 px
 *
 * Sin JavaScript, sin `filter: blur` (que obliga al compositor a rasterizar
 * superficies de 1500 px en cada scroll): el desenfoque está horneado en las
 * paradas del degradé. El grano es una textura de 140 px que el navegador pinta
 * una vez y repite.
 *
 * El `bg-[#04070d]` va en el `<main>` de la página, no acá: es el color del
 * canvas, no una capa que se pinta encima.
 */

export const FONDOS = ["haz", "aurora", "topografia"] as const;
export type Fondo = (typeof FONDOS)[number];

/** Cómo se llama cada uno en el switcher del preview. */
export const FONDO_LABEL: Record<Fondo, string> = {
  haz: "Haz de sala",
  aurora: "Aurora en banda",
  topografia: "Topografía",
};

const AZUL = "43,111,212";
const INDIGO = "124,108,246";
const CIAN = "56,189,248";

export default function FondoEventos({ variante = "haz", alto = 900 }: { variante?: Fondo; alto?: number }) {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-0 overflow-hidden"
      style={{ height: alto }}
      aria-hidden="true"
    >
      {variante === "haz" && <Haz />}
      {variante === "aurora" && <Aurora />}
      {variante === "topografia" && <Topografia />}
      <Grano />
    </div>
  );
}

/**
 * HAZ DE SALA — una sala antes de que prendan las luces.
 *
 * Dos haces caen desde arriba en ángulos distintos y mueren antes de llegar al
 * contenido, y una línea de luz marca el borde del escenario justo debajo del
 * encabezado. Es la metáfora más directa de lo que se vende en esta página —un
 * auditorio— y la que más se distingue del amanecer plano de /recursos.
 *
 * Los haces son rectángulos rotados con el degradé en el eje largo: un cono de
 * luz de verdad necesitaría `clip-path` y bordes duros, y lo que hace que esto
 * se lea como luz y no como un triángulo azul es el desenfoque de los bordes.
 */
function Haz() {
  return (
    <>
      {/* El cielo detrás de todo: el mismo amanecer de marca, más alto y más
          angosto que en /recursos para que el haz tenga de dónde salir. */}
      <div
        className="absolute -top-[460px] left-1/2 h-[900px] w-[1300px] -translate-x-1/2"
        style={{ background: `radial-gradient(ellipse at center, rgba(${AZUL},0.22) 0%, transparent 66%)` }}
      />

      {/* Haz principal y su eco. El segundo es más angosto, más frío y cae al
          revés: dos luces distintas, no una duplicada. */}
      <Rayo left="58%" ancho={520} angulo={15} rgb={AZUL} alpha={0.13} />
      <Rayo left="34%" ancho={300} angulo={-11} rgb={CIAN} alpha={0.07} />
      <Rayo left="76%" ancho={220} angulo={24} rgb={INDIGO} alpha={0.06} />

      {/* El borde del escenario: una línea que se enciende en el centro y se
          apaga hacia los lados, con su propio resplandor por debajo. Cae a la
          altura donde termina el encabezado. */}
      <div
        className="absolute inset-x-0 top-[430px]"
        // La misma máscara para la línea Y para su resplandor. Sin esto el
        // degradé de abajo llega entero hasta los bordes de la pantalla y se ve
        // el escalón: una línea que se apaga sobre una banda que no.
        style={{
          maskImage: "linear-gradient(90deg, transparent, #000 28%, #000 72%, transparent)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, #000 28%, #000 72%, transparent)",
        }}
      >
        <div
          className="h-px w-full"
          style={{ background: `linear-gradient(90deg, transparent, rgba(${CIAN},0.45) 35%, rgba(255,255,255,0.28) 50%, rgba(${CIAN},0.45) 65%, transparent)` }}
        />
        <div
          className="h-[180px] w-full"
          style={{ background: `linear-gradient(180deg, rgba(${AZUL},0.16), transparent 70%)` }}
        />
      </div>
    </>
  );
}

function Rayo({ left, ancho, angulo, rgb, alpha }: { left: string; ancho: number; angulo: number; rgb: string; alpha: number }) {
  return (
    <div
      className="absolute -top-[120px] h-[1150px] origin-top"
      style={{
        left,
        width: ancho,
        transform: `translateX(-50%) rotate(${angulo}deg)`,
        // El ancho se apaga hacia los costados (el borde difuso del haz) y el
        // largo se apaga hacia abajo (la luz que se pierde en el aire).
        background: `linear-gradient(90deg, transparent, rgba(${rgb},${alpha}) 45%, rgba(${rgb},${alpha}) 55%, transparent)`,
        maskImage: "linear-gradient(180deg, #000 0%, rgba(0,0,0,0.55) 45%, transparent 88%)",
        WebkitMaskImage: "linear-gradient(180deg, #000 0%, rgba(0,0,0,0.55) 45%, transparent 88%)",
      }}
    />
  );
}

/**
 * AURORA EN BANDA — una cinta de color que cruza el encabezado en diagonal.
 *
 * Es el más neutro de los tres y el único que serviría igual de bien en
 * /recursos: no dice "evento", dice "acá arriba pasa algo". A cambio es el que
 * mejor sostiene cualquier color de portada, porque la banda pasa por el azul,
 * el índigo y el cian de marca sin instalar ninguno.
 *
 * Las hairlines diagonales son lo que lo saca de "degradé de plantilla": dan
 * una textura de papel impreso a contraluz.
 */
function Aurora() {
  return (
    <>
      <div
        className="absolute -left-[10%] top-[-220px] h-[760px] w-[120%] origin-top-left"
        style={{
          transform: "rotate(-9deg)",
          background: `linear-gradient(180deg, transparent 0%, rgba(${AZUL},0.20) 28%, rgba(${INDIGO},0.17) 52%, rgba(${CIAN},0.10) 70%, transparent 100%)`,
          maskImage: "linear-gradient(90deg, transparent, #000 22%, #000 78%, transparent)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, #000 22%, #000 78%, transparent)",
        }}
      />
      {/* Una segunda cinta, más angosta y cruzada al revés: el cruce es lo que
          hace que se lea como aurora y no como una franja. */}
      <div
        className="absolute -left-[10%] top-[60px] h-[420px] w-[120%] origin-top-left"
        style={{
          transform: "rotate(6deg)",
          background: `linear-gradient(180deg, transparent, rgba(${CIAN},0.10) 50%, transparent)`,
          maskImage: "linear-gradient(90deg, transparent, #000 35%, transparent 85%)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, #000 35%, transparent 85%)",
        }}
      />
      {/* Hairlines en el mismo ángulo que la banda. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-9deg, rgba(255,255,255,0.028) 0px, rgba(255,255,255,0.028) 1px, transparent 1px, transparent 58px)",
          maskImage: "radial-gradient(ellipse 70% 55% at 50% 18%, #000 10%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 55% at 50% 18%, #000 10%, transparent 80%)",
        }}
      />
    </>
  );
}

/**
 * TOPOGRAFÍA — curvas de nivel, como un mapa.
 *
 * El más silencioso y el más "editorial premium": no hay luz de color
 * dominante, hay un dibujo. Envejece mejor que un degradé y es el que menos
 * pelea con las portadas, pero también el que menos energía aporta — si la
 * cartelera tiene que gritar "esto pasa el jueves", este no ayuda.
 *
 * Son elipses, no un ruido Perlin: doce trazos alcanzan para que se lea como
 * relieve, y el archivo pesa lo que pesa un párrafo.
 */
function Topografia() {
  return (
    <>
      <div
        className="absolute -top-[380px] left-1/2 h-[820px] w-[1500px] -translate-x-1/2"
        style={{ background: `radial-gradient(ellipse at center, rgba(${AZUL},0.18) 0%, transparent 68%)` }}
      />
      <svg
        className="absolute inset-x-0 top-0 h-[760px] w-full"
        viewBox="0 0 1440 760"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <radialGradient id="fe-topo-fade" cx="52%" cy="26%" r="62%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id="fe-topo-m">
            <rect width="1440" height="760" fill="url(#fe-topo-fade)" />
          </mask>
        </defs>
        <g mask="url(#fe-topo-m)" stroke="#8fb6ef" strokeWidth="1">
          {Array.from({ length: 12 }, (_, i) => (
            <ellipse
              key={i}
              cx={760 - i * 9}
              cy={200 + i * 6}
              rx={110 + i * 78}
              ry={62 + i * 41}
              transform={`rotate(${-8 + i * 0.9} 760 200)`}
              strokeOpacity={0.3 - i * 0.02}
            />
          ))}
        </g>
      </svg>
    </>
  );
}

/**
 * El grano. Es lo que separa "degradé de Tailwind" de "pieza impresa": rompe el
 * banding de los degradés grandes y le saca el plástico al azul.
 */
function Grano() {
  return (
    <div
      className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  );
}
