// Pregenera las fotos del sitio en WebP a 640, 1080 y 1600 px.
//
// ── POR QUÉ ──
//
// El plan de Vercel tiene una cuota de optimización de imágenes, y cuando se
// agota `/_next/image` responde 402: la foto sale rota. Pasó el 7/10 con las
// portadas del blog y el 16/10 con las cards de las soluciones (cualquier
// tamaño que no estuviera ya en caché). Desactivar el optimizador sin más
// tampoco sirve: las fotos de /public pesan 230 KB de promedio a 1600 px y una
// grilla de seis cards cargaría 1,5 MB.
//
// Así que se optimizan UNA vez, acá, y `lib/image-loader.ts` le pide a cada
// <Image> la variante más chica que alcance para el ancho que necesita. Cero
// llamadas al optimizador, mismo peso que antes.
//
// ── USO ──
//
//   node scripts/optimizar-imagenes.mjs
//
// Correrlo después de agregar o cambiar una foto en public/. Lo que no esté en
// el manifiesto se sirve tal cual (el loader no inventa rutas), así que una
// foto nueva sin procesar se ve igual, sólo que más pesada.

import { readdir, mkdir, stat, writeFile } from "node:fs/promises";
import { join, relative, extname } from "node:path";
import sharp from "sharp";

const PUBLIC = new URL("../public/", import.meta.url).pathname;
const DESTINO = join(PUBLIC, "_opt");
// logos/ e icons/ quedan afuera: son chicos, muchos PNG con transparencia y se
// muestran casi siempre con <img>.
const CARPETAS = ["images", "cases", "hero", "videos", "ilustraciones", "illustrations"];
const ANCHOS = [640, 1080, 1600];
const CALIDAD = 72;

async function* archivos(dir) {
  let entradas;
  try {
    entradas = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entradas) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* archivos(p);
    else if (/\.(jpe?g|png|webp)$/i.test(e.name)) yield p;
  }
}

const manifiesto = {};
let generados = 0;

for (const carpeta of CARPETAS) {
  for await (const origen of archivos(join(PUBLIC, carpeta))) {
    const rel = "/" + relative(PUBLIC, origen); // "/images/123.jpg"
    const base = rel.slice(0, -extname(rel).length); // "/images/123"
    const { width = 0 } = await sharp(origen).metadata();
    // Nunca agrandar: si la foto mide 900 px, la variante máxima es 900.
    const anchos = [...new Set(ANCHOS.map((w) => Math.min(w, width)))].filter(Boolean);

    for (const w of anchos) {
      const salida = join(DESTINO, `${base}-${w}.webp`);
      await mkdir(join(salida, ".."), { recursive: true });
      const ya = await stat(salida).catch(() => null);
      const fuente = await stat(origen);
      if (ya && ya.mtimeMs >= fuente.mtimeMs) continue;
      await sharp(origen).resize({ width: w, withoutEnlargement: true }).webp({ quality: CALIDAD }).toFile(salida);
      generados++;
    }
    manifiesto[rel] = anchos;
  }
}

await writeFile(
  new URL("../lib/imagenes-optimizadas.json", import.meta.url),
  JSON.stringify(manifiesto, null, 2) + "\n",
);
console.log(`${Object.keys(manifiesto).length} fotos en el manifiesto, ${generados} variantes nuevas.`);
