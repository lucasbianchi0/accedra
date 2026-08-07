"use client";

import { useEffect, useRef } from "react";

const BLUE = "43,111,212";
const INDIGO = "96,110,220";
const CYAN = "90,162,245";
// Azul eléctrico (cyan-blue brillante, #38BDF8) — SÓLO para los acentos "tech":
// beams, grilla en perspectiva y núcleos de mesh. Los washes de ambiente siguen
// en los azules de marca (más apagados); este es el que da la chispa eléctrica.
const ELECTRIC = "56,189,248";

/**
 * FONDO ÚNICO DE PÁGINA — pensado de punta a punta, no por sección.
 *
 * Todo el clima visual (lámparas de color, spotlight, textura, grano) vive acá,
 * en UNA capa anclada al documento entero. Las secciones ya no traen fondo propio:
 * son transparentes y dejan pasar esta luz. Así no hay costuras — no existe un
 * borde donde un fondo termina y otro empieza, porque hay un solo fondo.
 *
 * La grilla de lámparas se coloca en el CENTRO aproximado de cada sección (no en
 * sus bordes): la intensidad hace pico dentro de la sección y llega apagada a la
 * unión con la vecina. Es lo contrario a recortar un glow en la costura.
 *
 * `top` va en porcentaje del alto TOTAL del documento — si se agrega o saca una
 * sección grande, recalibrar estos valores.
 * `depth` es el factor de parallax: cuanto más alto, más "lejos" se percibe.
 */
// `mob: false` = la lámpara no se pinta en mobile. Cada una es una superficie de
// ~1500×1100 que el compositor tiene que sostener; en un teléfono el conjunto se
// paga en Style & Layout, que es el rubro más caro del hilo principal ahí. Se
// conservan las de mayor alpha (las que realmente se ven) y se descartan las de
// relleno: la onda de luz sigue leyéndose, con la mitad de superficie.
const PRESETS = {
  // Home: portada · clientes · servicios · partners · nosotros · testimonios ·
  // contacto · footer. Lados alternados para que la luz "serpentee" hacia abajo
  // y el ojo la lea como una sola onda continua, no como manchas sueltas.
  home: [
    { top: "8%",  left: "64%", w: 1600, h: 1150, rgb: BLUE,   alpha: 0.14, depth: 0.05,  mob: true },
    { top: "22%", left: "14%", w: 1250, h: 950,  rgb: CYAN,   alpha: 0.08, depth: 0.03,  mob: false },
    { top: "36%", left: "82%", w: 1350, h: 1050, rgb: INDIGO, alpha: 0.11, depth: 0.055, mob: true },
    { top: "50%", left: "26%", w: 1300, h: 1000, rgb: BLUE,   alpha: 0.10, depth: 0.04,  mob: true },
    { top: "64%", left: "80%", w: 1250, h: 950,  rgb: CYAN,   alpha: 0.08, depth: 0.03,  mob: false },
    { top: "78%", left: "20%", w: 1350, h: 1050, rgb: INDIGO, alpha: 0.10, depth: 0.05,  mob: true },
    { top: "91%", left: "68%", w: 1500, h: 1150, rgb: BLUE,   alpha: 0.06, depth: 0.045, mob: false },
  ],
  // Solución: portada · capacidades · proceso · casos · form. Página más corta,
  // misma lógica de onda alternada.
  solution: [
    { top: "12%", left: "62%", w: 1500, h: 1100, rgb: BLUE,   alpha: 0.13, depth: 0.05,  mob: true },
    { top: "32%", left: "16%", w: 1200, h: 920,  rgb: CYAN,   alpha: 0.08, depth: 0.03,  mob: false },
    { top: "50%", left: "84%", w: 1300, h: 1000, rgb: INDIGO, alpha: 0.10, depth: 0.05,  mob: true },
    { top: "68%", left: "24%", w: 1250, h: 960,  rgb: CYAN,   alpha: 0.07, depth: 0.035, mob: false },
    { top: "88%", left: "70%", w: 1450, h: 1100, rgb: BLUE,   alpha: 0.13, depth: 0.045, mob: true },
  ],
} as const;

// Franjas diagonales suaves: un segundo estrato de "mesh" que cruza toda la
// página en oblicuo. Le da al fondo el aire de un gradiente pintado (no de
// círculos apilados) y refuerza la continuidad de arriba a abajo. Van fijas al
// documento (sin parallax) para que sostengan el clima general mientras las
// lámparas se mueven por encima.
const STREAKS = [
  { rgb: BLUE,   alpha: 0.05, top: "6%",  angle: 150 },
  { rgb: INDIGO, alpha: 0.045, top: "58%", angle: 205 },
] as const;

/**
 * ACENTOS "que rompen" — los momentos premium sobre el clima continuo.
 *
 * `cores`: focos de mesh eléctrico (más saturados y brillantes que las lámparas).
 * `grid` : un piso en perspectiva (horizonte tech) que aparece una vez por página,
 *          como firma. Todos van con bordes enmascarados → acentúan sin cortar.
 *
 * `top`/`left` siguen siendo % del alto TOTAL del documento.
 */
const ACCENTS = {
  home: {
    cores: [
      { top: "38%", left: "80%", size: 640 },
      { top: "72%", left: "22%", size: 560 },
    ],
    grid: { top: "80%" },
  },
  solution: {
    cores: [
      { top: "30%", left: "78%", size: 600 },
    ],
    grid: { top: "83%" },
  },
} as const;

export default function AmbientLight({
  variant = "home",
}: {
  variant?: keyof typeof PRESETS;
}) {
  const AURORAS = PRESETS[variant];
  const ACC = ACCENTS[variant];
  const docRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // El seguimiento del cursor sólo tiene sentido con un puntero fino: en touch
    // no hay cursor que seguir. Y si el visitante pidió menos movimiento, las
    // capas quedan estáticas (siguen viéndose, sólo no se mueven).
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    // En touch NO corre nada de esto. El parallax escribe `--sy` en cada evento
    // de scroll, y cada escritura obliga al compositor a rehacer las lámparas
    // (superficies de ~1500px) justo mientras el dedo arrastra. Es el mismo
    // criterio que ya se aplica al spotlight del cursor unas líneas más abajo:
    // el efecto se paga donde se aprecia. La página queda idéntica, sólo que la
    // luz no deriva con el scroll.
    if (!fine) return;

    const doc = docRef.current;
    const spot = spotRef.current;
    let raf = 0;
    // Objetivo (dónde está el mouse) vs actual (dónde está la luz).
    let tx = 0, ty = 0, cx = 0, cy = 0;
    let scrollY = 0;
    let needsFrame = false;

    const request = () => {
      if (!needsFrame) {
        needsFrame = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const tick = () => {
      needsFrame = false;

      // Interpolación: la luz persigue al cursor con retraso en vez de pegarse a
      // él. Es la diferencia entre que se sienta como una lámpara con inercia o
      // como un sticker enganchado al puntero.
      cx += (tx - cx) * 0.07;
      cy += (ty - cy) * 0.07;
      spot?.style.setProperty("--mx", `${cx}px`);
      spot?.style.setProperty("--my", `${cy}px`);

      // El parallax se aplica como variable y cada aureola la multiplica por su
      // propia profundidad, así una sola escritura mueve las cinco capas.
      doc?.style.setProperty("--sy", `${scrollY}px`);

      if (Math.abs(tx - cx) > 0.4 || Math.abs(ty - cy) > 0.4) request();
    };

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      request();
    };
    const onScroll = () => {
      scrollY = window.scrollY;
      request();
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* ── Capa anclada al documento: se mueve con el scroll ── */}
      <div ref={docRef} className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Franjas diagonales: el estrato base del mesh. Cruzan a lo ancho y se
            funden por arriba y por abajo, sosteniendo un clima continuo sobre el
            que flotan las lámparas. */}
        {/* `hidden md:block`: éstas son la excepción a la regla de al lado — usan
            `filter: blur(40px)` sobre una franja de 70vh, que es exactamente la
            rasterización cara que las lámparas evitan. En desktop se paga sin
            drama; en mobile es de lo más caro que hay en la página, y con alpha
            0,05 sobre un fondo casi negro es lo que menos se ve. */}
        {STREAKS.map((s, i) => (
          <div
            key={`streak-${i}`}
            className="hidden md:block absolute -left-[20%] -right-[20%] h-[70vh]"
            style={{
              top: s.top,
              background: `linear-gradient(${s.angle}deg, transparent 0%, rgba(${s.rgb},${s.alpha}) 45%, transparent 78%)`,
              filter: "blur(40px)",
            }}
          />
        ))}

        {AURORAS.map((a, i) => (
          <div
            key={i}
            // `aurora-layer` pone el will-change SÓLO en desktop: prometerle al
            // compositor que esto se va a mover lo obliga a reservarle una capa
            // propia a cada lámpara, y en mobile ya no se mueve nada (el parallax
            // no corre en touch), así que sería memoria de GPU a cambio de nada.
            className={`aurora-layer absolute -translate-x-1/2${a.mob ? "" : " hidden md:block"}`}
            style={{
              top: a.top,
              left: a.left,
              width: a.w,
              height: a.h,
              // Radial-gradient y no `filter: blur()`: desenfocar una superficie de
              // 1500px obliga a rasterizarla en cada repintado. Esto es casi gratis.
              background: `radial-gradient(ellipse at center, rgba(${a.rgb},${a.alpha}) 0%, transparent 70%)`,
              transform: `translate3d(-50%, calc(var(--sy, 0px) * ${-a.depth}), 0)`,
            }}
          />
        ))}

        {/* ── ACENTOS PREMIUM (los momentos "que rompen") ── */}

        {/* Piso tecnológico en perspectiva: un horizonte de datos, firma de la
            página. Va enmascarado arriba/abajo y a los lados para fundirse en el
            fondo sin dibujar borde. Sólo desktop (perf + no aporta en pantallas
            chicas). Se mueve con el scroll como una capa más. */}
        <div
          className="hidden md:block absolute inset-x-0"
          style={{
            top: ACC.grid.top,
            height: 760,
            perspective: "720px",
            perspectiveOrigin: "50% 0%",
            transform: `translate3d(0, calc(var(--sy, 0px) * -0.03), 0)`,
            maskImage: "linear-gradient(to bottom, transparent, #000 42%, #000 76%, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 42%, #000 76%, transparent)",
          }}
        >
          <div
            className="tech-grid-plane absolute inset-x-[-40%] bottom-0 h-[150%]"
            style={{
              transform: "rotateX(75deg)",
              transformOrigin: "50% 100%",
              backgroundImage: `linear-gradient(rgba(${ELECTRIC},0.30) 1px, transparent 1px), linear-gradient(90deg, rgba(${ELECTRIC},0.22) 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
              maskImage: "radial-gradient(ellipse 52% 68% at 50% 100%, #000 4%, transparent 72%)",
              WebkitMaskImage: "radial-gradient(ellipse 52% 68% at 50% 100%, #000 4%, transparent 72%)",
            }}
          />
          {/* Línea de horizonte encendida (fuga del piso). */}
          <div
            className="tech-horizon absolute inset-x-[26%] h-px"
            style={{
              top: "40%",
              background: `linear-gradient(90deg, transparent, rgba(${ELECTRIC},0.6), transparent)`,
              boxShadow: `0 0 26px rgba(${ELECTRIC},0.55)`,
            }}
          />
        </div>

        {/* Núcleos de mesh eléctrico: focos de energía más saturados que las
            lámparas suaves. Respiran para dar vida sin distraer. */}
        {ACC.cores.map((c, i) => (
          <div
            key={`core-${i}`}
            className="mesh-core hidden sm:block absolute rounded-full"
            style={{
              top: c.top,
              left: c.left,
              width: c.size,
              height: c.size,
              background: `radial-gradient(circle at center, rgba(${ELECTRIC},0.16) 0%, rgba(${BLUE},0.13) 38%, transparent 68%)`,
            }}
          />
        ))}

        {/* Matriz de puntos: una sola textura para toda la página, en vez de las
            tres grillas distintas que tenía cada sección. La máscara la desvanece
            hacia los bordes para que nunca se vea dónde empieza y dónde termina. */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "34px 34px",
            maskImage: "radial-gradient(ellipse 70% 55% at 50% 40%, #000 10%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 55% at 50% 40%, #000 10%, transparent 80%)",
          }}
        />

        {/* Grano: sin esto, degradados tan amplios muestran banding en pantallas
            de 8 bits — que es lo que delata un fondo hecho a mano. */}
        {/* `hidden md:block`: el `mix-blend-soft-light` obliga al compositor a
            releer lo que hay debajo en TODA la altura del documento para poder
            mezclar. El banding que esto corrige aparece en degradados grandes
            sobre pantallas de 8 bits — un escenario de monitor, no de teléfono. */}
        <div
          className="hidden md:block absolute inset-0 opacity-[0.035] mix-blend-soft-light"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      {/* ── Capa anclada al VIEWPORT: la luz que sigue al cursor ──
          Va aparte y en `fixed` porque debe seguir al puntero, no al documento.
          Arranca fuera de pantalla (-100%) para que no aparezca un foco en la
          esquina superior izquierda antes del primer movimiento del mouse. */}
      <div
        ref={spotRef}
        className="hidden lg:block fixed inset-0 z-0 pointer-events-none"
        aria-hidden="true"
        style={
          {
            "--mx": "-100%",
            "--my": "-100%",
            background: `radial-gradient(600px circle at var(--mx) var(--my), rgba(${BLUE},0.07), transparent 65%)`,
          } as React.CSSProperties
        }
      />
    </>
  );
}
