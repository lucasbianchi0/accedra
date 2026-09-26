/**
 * EL FARO: la luz que se abre hacia abajo sobre el encabezado del blog.
 *
 * NACE ARRIBA DE TODO Y BAJA SOBRE EL CONTENIDO
 *
 * El origen está en el borde mismo de la página, detrás del navbar, y la
 * campana se abre desde ahí hasta pasar el buscador. Lo que ilumina es el
 * título y la caja de búsqueda, pero la luz viene de más arriba: es lo que la
 * hace parecer una lámpara colgada y no un degradé pegado al texto.
 *
 * LA FORMA ES UNA CAMPANA, NO UN CONO
 *
 * La luz nace en ese punto y se va abriendo a medida que baja: angosta y
 * apenas más clara arriba, ancha y casi disuelta abajo.
 *
 * Quedaron descartados los dos caminos habituales para dibujar eso —gradientes
 * cónicos y rectángulos girados— y por el mismo motivo: tienen BORDE. Ampliados
 * se ven las diagonales rectas cruzando el navbar, y la pieza deja de leerse
 * como luz para leerse como paneles translúcidos encimados.
 *
 * Esto son cinco elipses apiladas, cada una más ancha y más baja que la
 * anterior, y cada una más tenue. Una elipse se apaga sola en todas las
 * direcciones: la silueta que arman entre todas es la campana, y no hay una
 * sola línea dura en la pieza. El perfil de anchos crece más rápido que el de
 * alturas, que es lo que la hace abrirse en vez de estirarse.
 *
 * DÓNDE ESTÁ EL FOCO
 *
 * La campana ilumina el encabezado entero, pero la luz termina de cerrarse
 * sobre el buscador. Ese charco de luz NO vive acá: vive pegado a la caja de
 * búsqueda, en `HubNotas`. Estuvo un rato acá, con la altura pasada como
 * número, y el problema apareció al angostar la ventana: el título envuelve en
 * más líneas, la caja se mueve y la luz quedaba 44 px arriba de donde tenía que
 * caer. Un número no puede seguir a un layout.
 *
 * DE MENOS A MÁS
 *
 * Los anillos no entran todos con la misma fuerza: los de arriba son los más
 * intensos y cada uno que baja pesa menos, así que la campana se lee como una
 * luz que gana cuerpo a medida que se abre. El escalonado de la animación va en
 * el mismo sentido —de arriba hacia abajo— y el conjunto tarda dos segundos y
 * medio en asentarse: lo suficiente para que se vea crecer y no aparecer.
 *
 * Aun así ninguna capa llega a 0,2 de alfa. Tiene que imponerse por tamaño y
 * por movimiento, no por brillo: el momento en que se lee "el efecto" en vez
 * del título es el momento en que está de más.
 *
 * QUÉ SE ANIMA
 *
 * `transform` y `opacity`, nada más: las dos las resuelve el compositor sin
 * pedir layout, así que la animación no le cuesta nada al hilo principal en la
 * primera pantalla, que es la que miden las métricas.
 *
 * Cada anillo entra un poco después que el de arriba y escala desde 0,7: la luz
 * se abre de arriba hacia abajo, como enciende una lámpara de verdad. Dos
 * segundos de punta a punta.
 *
 * `prefers-reduced-motion` salta al estado final: la luz está, no se mueve.
 *
 * Todo el CSS vive en globals.css (`faro-*`). Sin JavaScript y sin nada que
 * hidratar: es un componente de servidor.
 */

/** Azul de marca. En rgb suelto para graduar el alfa en cada anillo. */
const AZUL = "43, 111, 212";

/**
 * El perfil de la campana: cada anillo con su ancho, su alto, dónde cae su
 * centro y cuánto alfa lleva. Lo que importa no son los números sino la
 * relación: el ancho crece más rápido que el alto, y el alfa baja a medida que
 * la luz se abre.
 */
const ANILLOS = [
  { w: 460, h: 210, y: -105, a: 0.19 },
  { w: 780, h: 360, y: -50, a: 0.15 },
  { w: 1180, h: 520, y: 40, a: 0.11 },
  { w: 1620, h: 700, y: 170, a: 0.075 },
  { w: 2100, h: 880, y: 330, a: 0.05 },
];

/** Dónde nace la luz, medido desde el borde de arriba de la página: arriba de
 *  todo, detrás del navbar. */
const ORIGEN = 0;

export default function FaroBlog({ alto = 820, color = AZUL }: { alto?: number; color?: string }) {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-0 overflow-hidden"
      style={{ height: alto }}
      aria-hidden="true"
    >
      {ANILLOS.map((r, i) => (
        <div
          key={i}
          className="faro-anillo absolute left-1/2 rounded-[50%]"
          style={{
            width: r.w,
            height: r.h,
            top: ORIGEN + r.y,
            marginLeft: -r.w / 2,
            background: `radial-gradient(ellipse at center, rgba(${color},${r.a}) 0%, rgba(${color},${r.a * 0.4}) 45%, transparent 70%)`,
            // Cada anillo arranca un poco después que el de arriba: eso es lo
            // que se lee como "se abre hacia abajo" y no como "aparece".
            animationDelay: `${0.1 + i * 0.16}s`,
          }}
        />
      ))}

      {/* El nacimiento de la luz: una línea finísima en el punto de origen. Es
          lo único con contorno de toda la pieza, y mide un píxel. */}
      <div
        className="faro-origen absolute left-1/2 h-px w-[520px] max-w-[76vw] -translate-x-1/2"
        data-origen=""
        style={{
          top: ORIGEN,
          background: `linear-gradient(90deg, transparent, rgba(${color},0.55) 50%, transparent)`,
        }}
      />
    </div>
  );
}

/** El hex de una solución (`#7C6CF6`) como triplete `r,g,b` para teñir la luz. */
export function rgbDe(hex: string): string {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}
