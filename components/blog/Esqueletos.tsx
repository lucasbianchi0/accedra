/**
 * Los esqueletos de /recursos y de una nota.
 *
 * QUÉ TIENEN QUE CUMPLIR
 *
 * Un esqueleto que no ocupa el mismo lugar que el contenido real no ahorra
 * nada: la página salta cuando llegan los datos, que es justo lo que se quería
 * evitar. Por eso cada pieza de acá copia la geometría de su contrapartida
 * —`aspect-[16/9]`, los mismos `p-5 lg:p-6`, el mismo `rounded-card`— y
 * responde a los mismos breakpoints. Si `NotaCard` cambia de proporción, esto
 * cambia con ella.
 *
 * LO QUE ES ESTÁTICO NO SE DIBUJA GRIS
 *
 * El encabezado del hub, las migas y el pie no dependen de la base: se
 * renderizan de verdad en el `loading.tsx`. Poner una barra gris donde va una
 * palabra que ya conocemos hace que la página parpadee al reemplazarla.
 *
 * LOS ANCHOS DE LAS LÍNEAS SON FIJOS
 *
 * Nada de anchos al azar: el servidor y el cliente tienen que pintar lo mismo,
 * y además un esqueleto que cambia de forma en cada carga se nota.
 */

/** Una barra. `w` y `h` son clases de Tailwind para que el llamador mande sus
 *  propios breakpoints (`h-5 lg:h-6`). */
export function Barra({ className = "" }: { className?: string }) {
  return <div className={`esqueleto rounded-md ${className}`} />;
}

/** Una pastilla del mismo alto que un filtro real (`h-9`). */
export function Pastilla({ className = "w-28" }: { className?: string }) {
  return <div className={`esqueleto h-9 rounded-full ${className}`} />;
}

/**
 * Una card del hub.
 *
 * `ancha` reproduce la variante destacada: dos columnas de la grilla a partir
 * de `md`, con la portada al costado. Debajo de `md` se apila, igual que la
 * real.
 */
export function CardEsqueleto({ ancha = false }: { ancha?: boolean }) {
  return (
    <div
      className={`overflow-hidden rounded-card border border-white/[0.07] bg-white/[0.02] ${
        ancha ? "flex flex-col md:col-span-2 md:grid md:grid-cols-2 md:items-stretch" : "flex flex-col"
      }`}
    >
      <div className={`esqueleto ${ancha ? "aspect-[16/9] md:aspect-auto md:h-full" : "aspect-[16/9]"}`} />

      <div className="flex flex-1 flex-col p-5 lg:p-6">
        {/* El título real es de una a tres líneas; dos es la moda. */}
        <Barra className={ancha ? "h-6 w-[85%] lg:h-8" : "h-[18px] w-[90%]"} />
        <Barra className={`mt-2.5 ${ancha ? "h-6 w-[55%] lg:h-8" : "h-[18px] w-[60%]"}`} />

        <Barra className="mt-4 h-3.5 w-full" />
        <Barra className="mt-2 h-3.5 w-[80%]" />

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <Barra className="h-2.5 w-24" />
          <div className="esqueleto h-7 w-7 shrink-0 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/** Una fila de la columna "Seguir leyendo": misma miniatura de 92 px. */
export function MiniEsqueleto() {
  return (
    <div className="flex items-center gap-4 py-4">
      <div className="esqueleto h-[92px] w-[92px] shrink-0 rounded-xl" />
      <div className="min-w-0 flex-1">
        <Barra className="h-4 w-full" />
        <Barra className="mt-2 h-4 w-[70%]" />
        <Barra className="mt-3 h-2.5 w-24" />
      </div>
    </div>
  );
}

/** Un párrafo del cuerpo de la nota: cuatro renglones y el último corto. */
export function ParrafoEsqueleto({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <Barra className="h-3.5 w-full" />
      <Barra className="mt-2.5 h-3.5 w-full" />
      <Barra className="mt-2.5 h-3.5 w-[96%]" />
      <Barra className="mt-2.5 h-3.5 w-[62%]" />
    </div>
  );
}
