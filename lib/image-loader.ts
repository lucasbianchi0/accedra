// Loader de <Image> sin el optimizador de Vercel.
//
// Las fotos de /public ya están pregeneradas en WebP a 640, 1080 y 1600 px
// (scripts/optimizar-imagenes.mjs). Para cada ancho que pide Next se devuelve
// la variante más chica que lo cubra. Lo que no está en el manifiesto —fotos
// remotas, logos, una foto nueva sin procesar— se sirve tal cual: nunca se
// arma una ruta que podría no existir.
//
// Por qué no el optimizador: con la cuota del plan agotada responde 402 y la
// foto sale rota. Ver el script para el detalle.
import manifiesto from "./imagenes-optimizadas.json";

const VARIANTES = manifiesto as Record<string, number[]>;

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }): string {
  const limpio = src.split("?")[0];
  const anchos = VARIANTES[limpio];
  if (!anchos?.length) return src;
  const elegido = anchos.find((w) => w >= width) ?? anchos[anchos.length - 1];
  const base = limpio.slice(0, limpio.lastIndexOf("."));
  return `/_opt${base}-${elegido}.webp`;
}
