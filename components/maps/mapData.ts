// Argentina by province — Mercator-projected SVG paths, one color per province.
// Generated from Natural Earth 10m admin-1 (Antarctic claims & Malvinas filtered out).
import argData from "./argProvinces.json";

export type Province = {
  name: string;
  code: string;
  path: string;
  color: string;
  cx: number;
  cy: number;
};

export const MAP_VIEWBOX: string = argData.viewBox;
export const MAP_W: number = argData.W;
export const MAP_H: number = argData.H;
export const PROVINCES: Province[] = argData.provinces as Province[];

const CITY = argData.cities as Record<string, number[]>;

export type Point = {
  id: string;
  city: string;
  province: string;
  x: number;
  y: number;
  hq?: boolean;
  client: string;
  service: string;
  detail: string;
  color: string;
  image: string;
};

const px = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=900`;

// ⚠️ CONTENIDO DE EJEMPLO — reemplazar por proyectos/clientes/fotos reales.
// "Varios puntos por provincia": múltiples ubicaciones repartidas por el país.
const raw: Omit<Point, "x" | "y">[] = [
  { id: "caba",   city: "Buenos Aires",  province: "Ciudad de Buenos Aires", hq: true, client: "Mapfre",        service: "Firma biométrica", detail: "Rediseño de la red de sucursales y despliegue de firma biométrica con validez legal, digitalizando la operación documental de punta a punta.", color: "#ef4444", image: px(9929279) },
  { id: "laplata", city: "La Plata",      province: "Buenos Aires",           client: "Organismo público", service: "Networking",      detail: "Infraestructura de red de alta disponibilidad y cableado estructurado certificado para edificios administrativos.", color: "#3B8EF0", image: px(4682189) },
  { id: "mardel",  city: "Mar del Plata", province: "Buenos Aires",           client: "Retail regional",   service: "Seguridad IT",    detail: "Arquitectura Zero Trust y protección de endpoints para la red de locales sobre la costa atlántica.", color: "#22c55e", image: px(1181244) },
  { id: "rosario", city: "Rosario",       province: "Santa Fe",               client: "Andreani",          service: "Networking",      detail: "Conectividad y ciberseguridad para el centro logístico, con monitoreo proactivo y foco en la continuidad operativa.", color: "#f97316", image: px(4682189) },
  { id: "santafe", city: "Santa Fe",      province: "Santa Fe",               client: "Agroindustria",     service: "Consultoría",     detail: "Implementación de Power BI y Microsoft 365 para reporting ejecutivo y colaboración entre plantas.", color: "#8b5cf6", image: px(577210) },
  { id: "cordoba", city: "Córdoba",       province: "Córdoba",                client: "Finning",           service: "Consultoría",     detail: "Ecosistema Microsoft 365 y capa de ciberseguridad gestionada para las operaciones regionales.", color: "#d97706", image: px(1181244) },
  { id: "mendoza", city: "Mendoza",       province: "Mendoza",                client: "Bodega premium",    service: "Firma biométrica", detail: "Digitalización documental y firma digital para procesos de exportación, sin papel y con trazabilidad total.", color: "#ec4899", image: px(9929279) },
  { id: "tucuman", city: "Tucumán",       province: "Tucumán",                client: "Sector salud",      service: "Seguridad IT",    detail: "Segmentación de red y seguridad perimetral Palo Alto para infraestructura crítica hospitalaria.", color: "#06b6d4", image: px(1181244) },
  { id: "neuquen", city: "Neuquén",       province: "Neuquén",                client: "Energía",           service: "Networking",      detail: "Enlaces redundantes y contingencia para operación de misión crítica en yacimientos.", color: "#eab308", image: px(4682189) },
];

export const POINTS: Point[] = raw.map((p) => ({
  ...p,
  x: CITY[p.city]?.[0] ?? 0,
  y: CITY[p.city]?.[1] ?? 0,
}));

export const HQ = POINTS.find((p) => p.hq)!;

// ── Geographic coordinates [lat, lng] for the 3D globe (Cobe) ──
const COORDS: Record<string, [number, number]> = {
  "Buenos Aires": [-34.6037, -58.3816],
  "La Plata": [-34.9215, -57.9545],
  "Mar del Plata": [-38.0055, -57.5575],
  "Córdoba": [-31.4201, -64.1888],
  "Rosario": [-32.9442, -60.6393],
  "Santa Fe": [-31.6333, -60.7],
  "Mendoza": [-32.8895, -68.8458],
  "Tucumán": [-26.8083, -65.2226],
  "Neuquén": [-38.9516, -68.0591],
};

export type GlobeMarker = { id: string; lat: number; lng: number; hq?: boolean };

export const GLOBE_MARKERS: GlobeMarker[] = POINTS.map((p) => ({
  id: p.id,
  lat: COORDS[p.city]?.[0] ?? 0,
  lng: COORDS[p.city]?.[1] ?? 0,
  hq: p.hq,
}));

// Argentina viewpoint (centered a bit south to frame the whole country)
export const GLOBE_HOME: [number, number] = [-38, -63];
