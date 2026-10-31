import Image from "next/image";

/**
 * El personaje de Accedra AI: un robot 3D amigable, con el visor violeta y los
 * auriculares azules de la marca.
 *
 * Se generó una vez (OpenRouter, openai/gpt-image-2) sobre el mismo azul noche
 * del sitio, porque el modelo no da fondo transparente: sobre la interfaz
 * oscura se funde solo, y en el retrato grande el borde se difumina con una
 * máscara radial. Los archivos están en public/asistente, ya en WebP y a su
 * tamaño (la cara pesa 3–5 KB).
 */

/** La cara, recortada en círculo: botón flotante, avatares, "pensando". */
export function MascotaCara({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <Image
      src={size > 48 ? "/asistente/robot-cara-160.webp" : "/asistente/robot-cara-96.webp"}
      alt=""
      aria-hidden
      width={size}
      height={size}
      className={`shrink-0 rounded-full object-cover ${className}`}
    />
  );
}

/** El retrato de la bienvenida: flota despacio y se funde con el fondo. */
export function MascotaRetrato({ size = 132, className = "" }: { size?: number; className?: string }) {
  return (
    <div className={`mascota-flota relative ${className}`} style={{ width: size, height: size }}>
      {/* El halo de la marca detrás, para que no quede un recorte sobre el vidrio. */}
      <div aria-hidden className="absolute inset-[12%] rounded-full bg-[#7C6CF6]/30 blur-2xl" />
      <Image
        src="/asistente/robot-480.webp"
        alt="El asistente de Accedra"
        width={size}
        height={size}
        // Sin `lazy`: la hoja se monta cerrada de antemano y la imagen tiene
        // que estar cargada cuando se abre, no aparecer después.
        loading="eager"
        // `closest-side`: el fundido termina antes del borde del cuadro. Con el
        // radio por defecto (la esquina más lejana) el fondo azul se cortaba
        // en línea recta arriba y a los costados.
        className="relative h-full w-full object-cover [mask-image:radial-gradient(circle_closest-side_at_50%_50%,#000_72%,transparent_100%)]"
      />
    </div>
  );
}
