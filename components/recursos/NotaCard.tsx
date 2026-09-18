import Link from "next/link";

import {
  CATEGORIA_COLOR,
  CATEGORIA_LABEL,
  TIPO_LABEL,
  fechaCorta,
  urlDeNota,
  type NotaSitio,
} from "@/lib/notas";

/** La miniatura del optimizador de Next: la portada se sube a 1600 px y en una
 *  card se ve a 400. Mismo criterio que la portada de un evento. */
const miniatura = (url: string, w = 768) => `/_next/image?url=${encodeURIComponent(url)}&w=${w}&q=75`;

function Portada({ nota, alto, ancho }: { nota: NotaSitio; alto: string; ancho: number }) {
  const color = nota.categoria ? CATEGORIA_COLOR[nota.categoria] : "#2b6fd4";
  return (
    <div
      className={`relative overflow-hidden ${alto}`}
      style={{ background: `linear-gradient(135deg, ${color}40 0%, #0B1A2E 60%)` }}
    >
      {nota.portadaUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={miniatura(nota.portadaUrl, ancho)}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
      ) : (
        // Sin portada, la trama de marca: la nota se publica igual, y una card
        // vacía se ve peor que una con textura.
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.65) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            maskImage: "radial-gradient(circle at 75% 25%, #000, transparent 70%)",
            WebkitMaskImage: "radial-gradient(circle at 75% 25%, #000, transparent 70%)",
          }}
        />
      )}
    </div>
  );
}

function Etiquetas({ nota }: { nota: NotaSitio }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-medium text-gray-300">
        {TIPO_LABEL[nota.tipo]}
      </span>
      {nota.categoria && (
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium text-[#E3ECF9]"
          style={{
            background: `${CATEGORIA_COLOR[nota.categoria]}24`,
            border: `1px solid ${CATEGORIA_COLOR[nota.categoria]}55`,
          }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: CATEGORIA_COLOR[nota.categoria] }} />
          {CATEGORIA_LABEL[nota.categoria]}
        </span>
      )}
    </div>
  );
}

/**
 * La card de una nota en el hub.
 *
 * `grande` es la variante de la nota destacada: ocupa el ancho completo y pone
 * la portada al costado. El resto de la información es la misma —no hay datos
 * que aparezcan sólo en una variante— para que destacar una nota sea una
 * decisión de diseño y no de contenido.
 */
export default function NotaCard({ nota, grande = false }: { nota: NotaSitio; grande?: boolean }) {
  const pie = [fechaCorta(nota.publicadoEn), nota.autor].filter(Boolean).join(" · ");

  if (grande) {
    return (
      <Link
        href={urlDeNota(nota.slug)}
        className="group grid overflow-hidden rounded-card border border-white/10 bg-white/[0.03] transition-colors hover:border-white/20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]"
      >
        <Portada nota={nota} alto="h-52 lg:h-full lg:min-h-[280px]" ancho={1080} />
        <div className="p-6 lg:p-9">
          <Etiquetas nota={nota} />
          <h2 className="mt-4 text-[26px] font-bold leading-[1.18] text-white lg:text-[32px]">{nota.titulo}</h2>
          {nota.resumen && <p className="mt-3 text-[15px] leading-relaxed text-gray-400">{nota.resumen}</p>}
          {pie && <p className="mt-5 text-[12px] uppercase tracking-[0.12em] text-gray-500">{pie}</p>}
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={urlDeNota(nota.slug)}
      className="group flex flex-col overflow-hidden rounded-card border border-white/10 bg-white/[0.03] transition-colors hover:border-white/20"
    >
      <Portada nota={nota} alto="h-44" ancho={768} />
      <div className="flex flex-1 flex-col p-5">
        <Etiquetas nota={nota} />
        <h3 className="mt-3 text-[18px] font-bold leading-snug text-white">{nota.titulo}</h3>
        {nota.resumen && <p className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-gray-400">{nota.resumen}</p>}
        {pie && <p className="mt-4 pt-1 text-[11.5px] uppercase tracking-[0.12em] text-gray-500">{pie}</p>}
      </div>
    </Link>
  );
}
