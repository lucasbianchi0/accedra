/**
 * El fondo de /recursos y de cada nota.
 *
 * POR QUÉ NO SE USA `AmbientLight` ACÁ
 *
 * El resto del sitio vende: siete lámparas azules, franjas diagonales, piso en
 * perspectiva y grano. Es un clima calibrado para páginas largas donde el
 * contenido flota sobre la luz.
 *
 * Estas páginas son lo contrario. El contenido son portadas y cuerpos de texto
 * con el color de cinco soluciones distintas —azul, violeta, cian, verde,
 * magenta— y cada una compite con el fondo. Sobre casi negro las cinco
 * conviven; sobre el navy iluminado, la violeta y la cian se ensucian. Es la
 * misma razón por la que una galería se pinta de gris oscuro y no de azul.
 *
 * Queda entonces un solo amanecer detrás del encabezado y la trama de puntos
 * de marca, para que la página siga siendo de este sitio y no de otro. `color`
 * lo tiñe con el de la solución de la nota — en el hub, donde conviven todas,
 * se queda en el azul de marca.
 *
 * El `bg-[#04070d]` va en el `<main>` de cada página y no acá: es el color del
 * canvas, no una capa que se pinta encima.
 */
export default function FondoRecursos({ color = "43,111,212" }: { color?: string }) {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[760px] overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="absolute -top-[380px] left-1/2 h-[900px] w-[1500px] -translate-x-1/2"
        style={{ background: `radial-gradient(ellipse at center, rgba(${color},0.20) 0%, transparent 68%)` }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
          maskImage: "radial-gradient(ellipse 65% 60% at 50% 22%, #000 5%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(ellipse 65% 60% at 50% 22%, #000 5%, transparent 78%)",
        }}
      />
    </div>
  );
}

/** El hex de una solución (`#7C6CF6`) como triplete `r,g,b` para el halo. */
export function rgbDe(hex: string): string {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}
