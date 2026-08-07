"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  type CSSProperties,
  type ElementType,
  type ReactElement,
  type ReactNode,
} from "react";

/* ── Reveals de scroll, en CSS ─────────────────────────────────────────────
 *
 * Esto ANTES era framer-motion. El cambio no es estético: las animaciones, las
 * curvas y los tiempos son exactamente los mismos. Es de costo.
 *
 * framer-motion viajaba en el bundle de arranque porque `Reveal` lo usan trece
 * componentes repartidos por toda la página, o sea que estaba en el camino
 * crítico de CADA ruta. En mobile, donde Lighthouse estrangula la CPU 4×, ese
 * JS es el que produce el TBT — el rubro más pesado del score (30%, más que el
 * LCP). Un fade con desplazamiento no necesita un motor de animación por JS:
 * `opacity` y `transform` los resuelve el compositor solo, sin tocar el hilo
 * principal. Lo único que hace falta de JS es saber CUÁNDO disparar, y para eso
 * alcanza un IntersectionObserver compartido.
 *
 * El mismo razonamiento que ya estaba escrito en globals.css para `.hero-enter`
 * (el <h1> del hero, que es LCP): esto lo extiende al resto de la página.
 *
 * Sobre no-JS y crawlers: el estado inicial oculto vive dentro de
 * `@media (scripting: enabled)`. Si no hay JS —o si el navegador es viejo y
 * ignora la media query— el contenido se ve igual, sólo que sin animación.
 * Nunca queda una página en blanco por un observer que no corrió. Importa para
 * accesibilidad y para los crawlers de IA, que leen el HTML sin ejecutar nada.
 */

// Ease "expo-out": sale rápido y desacelera largo → la sensación cara/suave.
// Un único ease + duración para toda la página da coherencia de ritmo: todas las
// apariciones "hablan el mismo idioma" y se sienten conectadas.
// Se exporta el array porque los pocos componentes que siguen usando framer
// (parallax, menús con AnimatePresence) comparten esta curva.
export const EASE = [0.16, 1, 0.3, 1] as const;
const EASE_CSS = "cubic-bezier(0.16, 1, 0.3, 1)";

/* Variante para las entradas del hero, que NO son de scroll: arrancan solas al
   cargar. Esas no pueden depender de un observer ni de framer — el <h1> es el
   elemento LCP y tiene que pintarse en el primer frame. La clase `.hero-enter`
   de globals.css corre la animación; este helper arma las variables. */
export const enter = (
  y: string,
  dur: string,
  delay: string,
  blur?: string
): CSSProperties =>
  ({
    "--enter-y": y,
    "--enter-dur": dur,
    "--enter-delay": delay,
    ...(blur ? { "--enter-blur": blur } : {}),
  }) as CSSProperties;

/* ── Presets ───────────────────────────────────────────────────────────────
 * Cada uno reproduce una de las variantes que antes eran objetos de framer.
 * Los valores son literalmente los que tenían; si se tocan, cambia el ritmo de
 * toda la página desde un solo lugar.
 *
 *  block     — bloques de sección (títulos, párrafos): fade + rise + desenfoque.
 *  item      — cards de grilla con SU PROPIO trigger. Sin blur a propósito: en
 *              grillas el costo del filtro se multiplica por ítem.
 *  itemFade  — igual pero sin desplazamiento, para bloques con hairlines donde
 *              un `y` desalinearía las divisiones al entrar.
 *  groupItem / groupItemFade — hijos de <RevealGroup>, disparados en cascada
 *              por el contenedor en vez de individualmente.
 */
const PRESETS = {
  block:         { y: 46, scale: 1,    blur: 16, dur: 1.5,  amount: 0.3, margin: "-10%" },
  item:          { y: 34, scale: 1,    blur: 0,  dur: 0.85, amount: 0.2, margin: "-8%" },
  itemFade:      { y: 0,  scale: 1,    blur: 0,  dur: 0.8,  amount: 0.2, margin: "-8%" },
  groupItem:     { y: 40, scale: 0.96, blur: 0,  dur: 1.25, amount: 0.2, margin: "-10%" },
  groupItemFade: { y: 0,  scale: 1,    blur: 0,  dur: 1.2,  amount: 0.2, margin: "-10%" },
} as const;

export type RevealPreset = keyof typeof PRESETS;

/* ── El observer ───────────────────────────────────────────────────────────
 * Uno COMPARTIDO por combinación de (threshold, margin, once), no uno por
 * elemento. Con ~40 reveals en una página de solución, cuarenta observers
 * significan cuarenta callbacks y cuarenta registros de layout; con este cache
 * quedan tres o cuatro. El observer entrega el estado inicial apenas se observa
 * un elemento, así que lo que ya está en pantalla al cargar entra solo —
 * el mismo comportamiento que tenía `whileInView` de framer.
 */
const observers = new Map<string, IntersectionObserver>();

function getObserver(threshold: number, margin: string, once: boolean) {
  const key = `${threshold}|${margin}|${once}`;
  let ob = observers.get(key);
  if (!ob) {
    ob = new IntersectionObserver(
      (entries, self) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).dataset.rvState = "in";
            if (once) self.unobserve(e.target);
          } else if (!once) {
            delete (e.target as HTMLElement).dataset.rvState;
          }
        }
      },
      { threshold, rootMargin: `0px 0px ${margin} 0px` }
    );
    observers.set(key, ob);
  }
  return ob;
}

function useReveal(threshold: number, margin: string, once: boolean) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Sin IntersectionObserver mostramos directamente: es preferible perder la
    // animación a dejar la sección invisible.
    if (typeof IntersectionObserver === "undefined") {
      el.dataset.rvState = "in";
      return;
    }

    const ob = getObserver(threshold, margin, once);
    ob.observe(el);
    return () => ob.unobserve(el);
  }, [threshold, margin, once]);

  return ref;
}

function vars(
  p: (typeof PRESETS)[RevealPreset],
  delay: number,
  blur: boolean,
  y: number,
  dur: number,
  scale: number
) {
  return {
    "--rv-y": y ? `${y}px` : "0px",
    "--rv-scale": scale,
    "--rv-blur": blur && p.blur ? `${p.blur}px` : "0px",
    "--rv-dur": `${dur}s`,
    "--rv-delay": `${delay}s`,
    "--rv-ease": EASE_CSS,
  } as CSSProperties;
}

/* ── Reveal ────────────────────────────────────────────────────────────────
 * Revela un elemento cuando entra en viewport. Reemplazo directo del componente
 * que antes envolvía un `motion.*`: misma API salvo `preset`, que es lo que
 * antes se elegía spreando `revealOnScroll` sobre un `motion.div`.
 */
export function Reveal({
  children,
  className,
  style,
  delay = 0,
  blur = true,
  once = true,
  amount,
  y,
  dur,
  scale,
  as = "div",
  preset = "block",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  blur?: boolean;
  once?: boolean;
  /** Umbral de visibilidad para disparar. Por defecto, el del preset. */
  amount?: number;
  /** Desplazamiento de entrada en px. Por defecto, el del preset. */
  y?: number;
  /** Duración en segundos. Por defecto, la del preset. */
  dur?: number;
  /** Escala inicial (1 = sin zoom). Por defecto, la del preset. */
  scale?: number;
  as?: ElementType;
  preset?: RevealPreset;
} & Record<string, unknown>) {
  const p = PRESETS[preset];
  const ref = useReveal(amount ?? p.amount, p.margin, once);
  const Tag = as as ElementType;

  return (
    <Tag
      ref={ref}
      data-rv=""
      className={className}
      style={{
        ...vars(p, delay, blur, y ?? p.y, dur ?? p.dur, scale ?? p.scale),
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ── RevealGroup ───────────────────────────────────────────────────────────
 * Revela sus hijos en cascada. El stagger es lo que da la sensación de "van
 * apareciendo las cosas a medida que scrolleo".
 *
 * A diferencia de <Reveal>, acá el trigger es UNO SOLO —el contenedor— y los
 * hijos se escalonan por índice. Es el equivalente de `staggerChildren` /
 * `delayChildren` de framer: el contenedor se marca al entrar y el CSS calcula
 * el delay de cada hijo como `delay + i × stagger`.
 *
 * Usar sólo cuando el grupo entra entero en pantalla a la vez (el footer). Para
 * grillas altas conviene `<Reveal preset="item">` por ítem: si el contenedor es
 * más alto que el viewport, con el grupo las cards de abajo ya terminaron de
 * animar cuando llegás a ellas.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.19,
  delay = 0.08,
  once = true,
  amount = 0.2,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  once?: boolean;
  amount?: number;
  as?: ElementType;
}) {
  const ref = useReveal(amount, "-10%", once);
  const Tag = as as ElementType;

  // `Children.map` aplana los arrays de un `.map()` interno, así que la
  // numeración sale correlativa aunque los hijos vengan de fuentes distintas.
  const numbered = Children.map(children, (child, i) => {
    if (!isValidElement(child)) return child;
    const el = child as ReactElement<{ style?: CSSProperties }>;
    return cloneElement(el, {
      style: { ...el.props.style, "--rv-i": i } as CSSProperties,
    });
  });

  return (
    <Tag
      ref={ref}
      data-rv-group=""
      className={className}
      style={
        {
          "--rv-stagger": `${stagger}s`,
          "--rv-delay": `${delay}s`,
          "--rv-ease": EASE_CSS,
        } as CSSProperties
      }
    >
      {numbered}
    </Tag>
  );
}

/* Hijo de <RevealGroup>. No observa nada: espera a que el contenedor se marque.
   El índice se lo inyecta el grupo. */
export function RevealItem({
  children,
  className,
  style,
  as = "div",
  preset = "groupItem",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: ElementType;
  preset?: Extract<RevealPreset, "groupItem" | "groupItemFade">;
} & Record<string, unknown>) {
  const p = PRESETS[preset];
  const Tag = as as ElementType;

  return (
    <Tag
      data-rv-child=""
      className={className}
      style={
        {
          "--rv-y": `${p.y}px`,
          "--rv-scale": p.scale,
          "--rv-dur": `${p.dur}s`,
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      {children}
    </Tag>
  );
}
