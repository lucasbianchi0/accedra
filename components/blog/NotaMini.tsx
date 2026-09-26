import Image from "next/image";
import Link from "next/link";

import PortadaGenerada from "@/components/blog/PortadaGenerada";
import { CATEGORIA_COLOR, CATEGORIA_LABEL, urlDeNota, type NotaSitio } from "@/lib/notas";

/**
 * Una nota en la columna lateral: portada y título, nada más.
 *
 * POR QUÉ NO ES UNA `NotaCard` CHICA
 *
 * En la columna de una nota que se está leyendo, el resumen no ayuda: son tres
 * líneas de texto compitiendo con el texto que la persona vino a leer. Lo único
 * que decide si hace clic es el título, y por eso se lleva el tamaño.
 *
 * EL TÍTULO SE CORTA A DOS LÍNEAS
 *
 * Los títulos de las notas van hasta 110 caracteres. Sin recorte, uno largo
 * empuja la columna y las cuatro filas dejan de tener el mismo peso. Con
 * `line-clamp-2` el recorte lo hace el navegador según el ancho real, así que
 * los puntos suspensivos aparecen sólo cuando hacen falta.
 */
export default function NotaMini({ nota }: { nota: NotaSitio }) {
  const color = nota.categoria ? CATEGORIA_COLOR[nota.categoria] : "#2b6fd4";

  return (
    <Link href={urlDeNota(nota.slug)} className="group flex items-center gap-4 py-4">
      <div
        className="relative h-[92px] w-[92px] shrink-0 overflow-hidden rounded-xl border border-white/[0.07]"
        style={{ background: `linear-gradient(135deg, ${color}2e 0%, #0a1424 55%, #05090f 100%)` }}
      >
        {nota.portadaUrl ? (
          <Image
            src={nota.portadaUrl}
            alt=""
            fill
            // Mide 92 px siempre, en cualquier pantalla: el `srcset` que arma
            // Next para esto son dos archivos chicos (96 y 128 px) en vez del
            // de 384 que se bajaba antes para verse a un cuarto de tamaño.
            sizes="92px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
            <PortadaGenerada nota={nota} color={color} />
          </div>
        )}
      </div>

      <div className="min-w-0">
        <h3 className="line-clamp-2 text-[16px] font-semibold leading-[1.3] text-gray-100 transition-colors group-hover:text-white">
          {nota.titulo}
        </h3>
        {/* Sólo la solución. La fecha en castellano ("18 de sept de 2026") no
            entra sin truncarse, y en una columna de "seguir leyendo" no es el
            dato que decide el clic. */}
        {nota.categoria && (
          <p className="mt-2 truncate text-[11px] uppercase tracking-[0.12em]" style={{ color: `${color}cc` }}>
            {CATEGORIA_LABEL[nota.categoria]}
          </p>
        )}
      </div>
    </Link>
  );
}
