// Genera public/maps/argentina-cobertura.svg: Argentina en grilla de puntos con
// límites provinciales y nodos grandes repartidos por el país. El mapa descansa
// apagado y en cada ciclo la bandera aparece con un fundido largo y un halo de
// luz (celeste arriba y abajo, una franja blanca centrada en Buenos Aires, donde
// está el sol), respira un instante y se desvanece. Nada se desplaza.
//
// Se genera una vez y se sirve como archivo estático (<img>) a propósito: la
// animación va en CSS dentro del propio SVG, así que en la portada no suma ni
// un byte de JS ni ~2.000 nodos al DOM hidratado.
//
// Uso: node scripts/maps/build-coverage-map.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const data = JSON.parse(readFileSync(new URL("../../components/maps/argProvinces.json", import.meta.url)));
const { W, H, provinces, cities } = data;

const STEP = 12; // separación de la grilla (unidades del viewBox)
const R = 3.6; // radio de cada punto
const CYCLE = 7; // segundos del ciclo completo
const WHITE_SHARE = 0.18; // alto de la franja blanca, como fracción del país

const APAGADO = "#74ACDF"; // mismo celeste, con poca opacidad
const CELESTE = "#9ADCFF"; // franjas de arriba y abajo prendidas
const BLANCO = "#FFFFFF"; // franja del medio prendida
const SOL = "#F6B40E";

// Ciudades para los nodos grandes, de norte a sur, en lon/lat.
const NODES = {
  Salta: [-65.41, -24.79], Posadas: [-55.9, -27.37], Tucumán: [-65.22, -26.81],
  Córdoba: [-64.18, -31.42], Rosario: [-60.64, -32.95], Mendoza: [-68.83, -32.89],
  "Bahía Blanca": [-62.27, -38.72], Neuquén: [-68.06, -38.95], "Puerto Madryn": [-65.04, -42.77],
  "Comodoro Rivadavia": [-67.48, -45.86], "Río Gallegos": [-69.22, -51.62], Ushuaia: [-68.3, -54.8],
};

// Paths "M…L…Z" → lista de anillos [[x,y],…]
const rings = (path) =>
  path.split(/(?=M)/).map((seg) =>
    seg.replace(/Z/g, "").slice(1).split("L").map((pt) => pt.split(",").map(Number)),
  );

const f = (n) => Math.round(n * 10) / 10;

// ── Proyección ─────────────────────────────────────────────────────────────
// Se recupera la Mercator del mapa ajustando las ciudades que ya trae el JSON:
// sirve para ubicar las Malvinas (Natural Earth las trae filtradas) y los nodos.
const CITY_LONLAT = {
  "Buenos Aires": [-58.38, -34.6], "La Plata": [-57.95, -34.92], "Mar del Plata": [-57.55, -38.0],
  "Córdoba": [-64.18, -31.42], "Rosario": [-60.64, -32.95], "Santa Fe": [-60.7, -31.63],
  "Mendoza": [-68.83, -32.89], "Tucumán": [-65.22, -26.81], "Neuquén": [-68.06, -38.95],
};
const merc = (lat) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
const fit = (pairs) => {
  const n = pairs.length;
  const sx = pairs.reduce((s, [a]) => s + a, 0), sy = pairs.reduce((s, [, b]) => s + b, 0);
  const sxx = pairs.reduce((s, [a]) => s + a * a, 0), sxy = pairs.reduce((s, [a, b]) => s + a * b, 0);
  const k = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  return [k, (sy - k * sx) / n];
};
const names = Object.keys(CITY_LONLAT);
const [kx, bx] = fit(names.map((c) => [CITY_LONLAT[c][0], cities[c][0]]));
const [ky, by] = fit(names.map((c) => [merc(CITY_LONLAT[c][1]), cities[c][1]]));
const project = ([lon, lat]) => [kx * lon + bx, ky * merc(lat) + by];

const MALVINAS = [
  // Isla Soledad
  [[-59.25, -51.35], [-58.95, -51.25], [-58.4, -51.3], [-57.85, -51.45], [-57.7, -51.62], [-58.1, -51.75],
   [-58.35, -51.95], [-58.7, -52.18], [-59.1, -52.25], [-59.45, -52.1], [-59.2, -51.85], [-59.6, -51.7], [-59.35, -51.5]],
  // Isla Gran Malvina
  [[-60.2, -51.3], [-59.75, -51.45], [-59.55, -51.7], [-59.9, -51.95], [-60.3, -52.2], [-60.95, -52.05],
   [-61.3, -51.85], [-61.05, -51.55], [-60.6, -51.35]],
].map((ring) => ring.map(project));
const MALVINAS_PATH = MALVINAS.map((r) => "M" + r.map(([x, y]) => `${f(x)},${f(y)}`).join("L") + "Z").join("");

// Even-odd sobre todos los anillos: resuelve islas y huecos sin distinguirlos.
const inside = (x, y, rs) => {
  let c = false;
  for (const ring of rs) {
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i];
      const [xj, yj] = ring[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
    }
  }
  return c;
};

const polys = [
  ...provinces.map((p) => ({ path: p.path, rings: rings(p.path), dots: [] })),
  { path: MALVINAS_PATH, rings: MALVINAS, dots: [] },
];

// Grilla hexagonal (filas alternadas corridas medio paso): se lee más orgánica
// que una cuadrícula y dibuja mejor la costa patagónica.
for (let row = 0, y = STEP / 2; y < H; row++, y += STEP * 0.866) {
  for (let x = (row % 2 ? STEP : STEP / 2); x < W; x += STEP) {
    const hit = polys.find((p) => inside(x, y, p.rings));
    if (hit) hit.dots.push([x, y]);
  }
}

const [hqX, hqY] = cities["Buenos Aires"];
const allDots = polys.flatMap((p) => p.dots);

// Franja blanca CENTRADA en Buenos Aires (el sol queda en el medio del blanco,
// como en la bandera). Lo que queda arriba y abajo es celeste. Punto por punto,
// para que el corte sea una línea recta.
const minY = Math.min(...allDots.map((d) => d[1]));
const maxY = Math.max(...allDots.map((d) => d[1]));
const HALF_BAND = ((maxY - minY) * WHITE_SHARE) / 2;
const isWhite = (y) => Math.abs(y - hqY) < HALF_BAND;

const circles = (dots) => dots.map(([x, y]) => `<circle cx="${f(x)}" cy="${f(y)}" r="${R}"/>`).join("");
const groups = [
  `<g class="p c">${circles(allDots.filter(([, y]) => !isWhite(y)))}</g>`,
  `<g class="p w">${circles(allDots.filter(([, y]) => isWhite(y)))}</g>`,
].join("\n");

const borders = polys.map((p) => `<path d="${p.path}"/>`).join("\n");

// Nodos grandes: halo + punto con aro. Fijos; sólo el halo acompaña el encendido.
const nodes = Object.values(NODES)
  .map(project)
  .map(([x, y]) => `<circle class="nh" cx="${f(x)}" cy="${f(y)}" r="15"/><circle class="n" cx="${f(x)}" cy="${f(y)}" r="6.5"/>`)
  .join("\n");

// Sol de mayo sobre el HQ: 16 rayos alternando largos y cortos (fijo).
const SUN_CORE = 14;
const rays = Array.from({ length: 16 }, (_, i) => {
  const a = (i / 16) * Math.PI * 2 - Math.PI / 2;
  const r1 = SUN_CORE + 4, r2 = i % 2 ? SUN_CORE + 13 : SUN_CORE + 21;
  return `M${f(hqX + Math.cos(a) * r1)},${f(hqY + Math.sin(a) * r1)}L${f(hqX + Math.cos(a) * r2)},${f(hqY + Math.sin(a) * r2)}`;
}).join("");

// Ciclo de 7 s: apagado (0–18%) → aparece (18–52%, ~2,4 s) → prendido
// (52–62%) → se desvanece (62–100%, ~2,7 s). Curva seno en cada tramo: sin
// arranques ni frenadas bruscas, la luz entra y sale como una respiración.
const EASE = "cubic-bezier(.37,0,.63,1)";
const flag = (color) =>
  `{0%,18%{opacity:.28;fill:${APAGADO}}52%,62%{opacity:1;fill:${color}}100%{opacity:.28;fill:${APAGADO}}}`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Mapa de Argentina: cobertura nacional">
<defs>
<filter id="bloom" x="-10%" y="-10%" width="120%" height="120%">
<feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="b"/>
<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
</filter>
<radialGradient id="hq"><stop offset="0" stop-color="#fde68a" stop-opacity=".95"/><stop offset=".4" stop-color="${SOL}" stop-opacity=".4"/><stop offset="1" stop-color="${SOL}" stop-opacity="0"/></radialGradient>
</defs>
<style>
.p{fill:${APAGADO};opacity:.28;animation:${CYCLE}s ${EASE} infinite}
.c{animation-name:flagC}
.w{animation-name:flagW}
@keyframes flagC${flag(CELESTE)}
@keyframes flagW${flag(BLANCO)}
.b{fill:none;stroke:#fff;stroke-opacity:.28;stroke-width:1.3;stroke-linejoin:round}
.nh{fill:${CELESTE};opacity:.12;animation:halo ${CYCLE}s ${EASE} infinite}
@keyframes halo{0%,18%{opacity:.12}52%,62%{opacity:.38}100%{opacity:.12}}
.n{fill:#fff;stroke:${CELESTE};stroke-width:3}
.s{stroke:${SOL};stroke-width:3.4;stroke-linecap:round}
@media (prefers-reduced-motion:reduce){.p,.nh{animation:none}.p{opacity:1}.c{fill:${CELESTE}}.w{fill:${BLANCO}}.nh{opacity:.38}}
</style>
<g filter="url(#bloom)">
${groups}
</g>
<g class="b">
${borders}
</g>
${nodes}
<circle cx="${f(hqX)}" cy="${f(hqY)}" r="${SUN_CORE + 42}" fill="url(#hq)"/>
<path class="s" d="${rays}"/>
<circle cx="${f(hqX)}" cy="${f(hqY)}" r="${SUN_CORE}" fill="${SOL}" stroke="#fde68a" stroke-width="2"/>
</svg>
`;

mkdirSync(new URL("../../public/maps/", import.meta.url), { recursive: true });
writeFileSync(new URL("../../public/maps/argentina-cobertura.svg", import.meta.url), svg);
console.log(`argentina-cobertura.svg: ${allDots.length} puntos, ${Object.keys(NODES).length} nodos, ${(svg.length / 1024).toFixed(1)} KB`);
