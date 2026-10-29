// Rate limiting de los endpoints que reciben formularios.
//
// Cada endpoint cuenta en su propio NAMESPACE. Antes la clave era
// `contact:<regla>:<ip>` sin importar quién llamara, así que pedir el brochure
// consumía el cupo del formulario de contacto y viceversa: tres interacciones
// en diez minutos —probando la página, por ejemplo— y la siguiente consulta
// comercial legítima se rechazaba.
//
// En Vercel cada request puede caer en una instancia distinta y las instancias se
// reciclan, así que un contador en memoria NO frena a un atacante: le alcanza con
// espaciar los envíos o simplemente tener suerte con el routing.
//
// El contador durable sale, en orden:
//   1. Upstash, si están UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN.
//   2. Supabase (`site_rate_limit_hit`, migración 007), que ya está en todos los
//      entornos donde hay leads. Es el que corre hoy en producción.
//   3. Memoria, sólo en desarrollo o si los otros dos fallan.
//
// Ante un error del backend durable NO se deja pasar todo: se cuenta en memoria.
// Es un límite peor, pero un límite; rechazar todo convertiría una caída de
// infra en pérdida de consultas, y dejar pasar todo la convertiría en factura.

const URL_BASE = process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const backend: "upstash" | "supabase" | "memoria" =
  URL_BASE && TOKEN ? "upstash" : SUPABASE_URL && SUPABASE_KEY ? "supabase" : "memoria";

export const isDurable = backend !== "memoria";

export type Rule = { suffix: string; limit: number; windowSec: number };

/** Reglas acumulativas: se aplican todas, alcanza que una falle. */
export const RULES: readonly Rule[] = [
  { suffix: "burst", limit: 3, windowSec: 10 * 60 }, // 3 cada 10 min
  { suffix: "day", limit: 12, windowSec: 24 * 60 * 60 }, // 12 por día
];

/**
 * Brochure, por IP. Más holgado que contacto en la ráfaga —bajar un PDF dos
 * veces seguidas es normal, mandar tres consultas comerciales en diez minutos
 * no— y más estricto en el día, porque una persona necesita el archivo una vez.
 */
export const BROCHURE_IP_RULES: readonly Rule[] = [
  { suffix: "burst", limit: 5, windowSec: 10 * 60 },
  { suffix: "day", limit: 10, windowSec: 24 * 60 * 60 },
];

/**
 * Brochure, por dirección de mail (con la IP dando igual).
 *
 * Es lo que impide que el endpoint se use de relay: sin esto, alguien detrás de
 * IPs rotativas puede hacer que le mandemos correo a cualquier casilla que
 * elija, tantas veces como quiera. Con la IP sola no alcanza.
 */
export const BROCHURE_EMAIL_RULES: readonly Rule[] = [
  { suffix: "day", limit: 3, windowSec: 24 * 60 * 60 },
];

/**
 * Techo global del endpoint, sumando todo el tráfico.
 *
 * Los dos límites de arriba se evaden con suficientes IPs y suficientes
 * casillas. Este no: es el que protege la cuota de Resend y la reputación del
 * dominio de un ataque distribuido. Los números están MUY por encima del
 * tráfico real del sitio, así que sólo cortan cuando algo está claramente mal.
 */
export const BROCHURE_GLOBAL_RULES: readonly Rule[] = [
  { suffix: "minute", limit: 20, windowSec: 60 },
  { suffix: "day", limit: 400, windowSec: 24 * 60 * 60 },
];

/**
 * Inscripción a eventos, por IP. Anotarse a dos o tres eventos seguidos es
 * normal; quince en un día desde la misma conexión, no.
 */
export const EVENTO_IP_RULES: readonly Rule[] = [
  { suffix: "burst", limit: 6, windowSec: 10 * 60 },
  { suffix: "day", limit: 15, windowSec: 24 * 60 * 60 },
];

/**
 * Inscripción a eventos, por dirección de mail. Es la que impide usar el
 * endpoint para mandarle confirmaciones a una casilla ajena una y otra vez: una
 * persona se anota a pocos eventos por día.
 */
export const EVENTO_EMAIL_RULES: readonly Rule[] = [
  { suffix: "day", limit: 5, windowSec: 24 * 60 * 60 },
];

/** Techo global de inscripciones: protege la cuota de Resend y el dominio. */
export const EVENTO_GLOBAL_RULES: readonly Rule[] = [
  { suffix: "minute", limit: 20, windowSec: 60 },
  { suffix: "day", limit: 400, windowSec: 24 * 60 * 60 },
];

async function redisIncr(key: string, windowSec: number, cantidad: number): Promise<number> {
  const res = await fetch(`${URL_BASE}/incrby/${encodeURIComponent(key)}/${cantidad}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
    cache: "no-store",
    signal: AbortSignal.timeout(2500),
  });
  if (!res.ok) throw new Error(`upstash incrby ${res.status}`);
  const count = Number((await res.json()).result);

  // Sólo el primer hit de la ventana define el TTL; si no, la ventana se
  // renovaría en cada request y el contador nunca expiraría.
  if (count === cantidad) {
    await fetch(`${URL_BASE}/expire/${encodeURIComponent(key)}/${windowSec}`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      cache: "no-store",
      signal: AbortSignal.timeout(2500),
    });
  }
  return count;
}

/**
 * Todas las reglas de un `consume` en una sola ida y vuelta a Postgres. Por
 * fetch directo a PostgREST y no con supabase-js: es un POST y nada más, y así
 * se le puede poner un timeout corto.
 */
async function supabaseIncr(claves: string[], ventanas: number[], cantidad: number): Promise<number[]> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/site_rate_limit_hit`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY!,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ keys: claves, windows: ventanas, amounts: claves.map(() => cantidad) }),
    cache: "no-store",
    signal: AbortSignal.timeout(2500),
  });
  if (!res.ok) throw new Error(`supabase rate ${res.status}`);
  const valores = (await res.json()) as unknown;
  if (!Array.isArray(valores) || valores.length !== claves.length) throw new Error("supabase rate: respuesta inesperada");
  return valores.map(Number);
}

// Fallback en memoria: [timestamp, cantidad] por clave, podados por ventana.
const memory = new Map<string, [number, number][]>();

function memoryIncr(key: string, windowSec: number, now: number, cantidad: number): number {
  const cutoff = now - windowSec * 1000;
  const hits = (memory.get(key) ?? []).filter(([t]) => t > cutoff);
  if (cantidad !== 0) hits.push([now, cantidad]);
  memory.set(key, hits);

  // Poda perezosa para que el Map no crezca sin techo en un proceso largo.
  if (memory.size > 5_000) {
    for (const [k, v] of memory) {
      if (v.every(([t]) => t <= cutoff)) memory.delete(k);
    }
  }
  return Math.max(0, hits.reduce((n, [, c]) => n + c, 0));
}

/** Un aviso por minuto y por instancia: lo bastante para verlo, sin inundar el log. */
let ultimoAviso = 0;

async function contar(claves: string[], rules: readonly Rule[], cantidad: number): Promise<number[]> {
  const now = Date.now();
  const enMemoria = () => claves.map((k, i) => memoryIncr(k, rules[i].windowSec, now, cantidad));
  try {
    if (backend === "supabase") return await supabaseIncr(claves, rules.map((r) => r.windowSec), cantidad);
    if (backend === "upstash") return await Promise.all(claves.map((k, i) => redisIncr(k, rules[i].windowSec, cantidad)));
  } catch (err) {
    // En serverless la memoria es por instancia: con el backend caído los
    // límites casi no frenan. Tiene que verse en el log.
    if (now - ultimoAviso > 60_000) {
      console.error(`[rate] el backend ${backend} falló, se cuenta en memoria (límites débiles):`, (err as Error).message);
      ultimoAviso = now;
    }
  }
  return enMemoria();
}

export type RateVerdict = { allowed: boolean; rule?: string };

/**
 * Consume una cuota y dice si el pedido pasa.
 *
 * `scope` separa endpoints y dimensiones ("contact", "brochure:ip",
 * "brochure:email"…); `id` es el sujeto contado (una IP, un mail hasheado, o
 * "all" para un techo global).
 *
 * `cantidad` es cuánto se descuenta: 1 por pedido, o tokens para un
 * presupuesto. Con 0 sólo se mira el saldo (y pasa mientras no se haya pasado
 * del límite). Negativa devuelve parte de una reserva.
 */
export async function consume(
  scope: string,
  id: string,
  rules: readonly Rule[],
  cantidad = 1,
): Promise<RateVerdict> {
  const claves = rules.map((r) => `${scope}:${r.suffix}:${id}`);
  const totales = await contar(claves, rules, cantidad);
  if (cantidad < 0) return { allowed: true };
  const excedida = rules.findIndex((r, i) => (cantidad === 0 ? totales[i] >= r.limit : totales[i] > r.limit));
  return excedida === -1 ? { allowed: true } : { allowed: false, rule: `${scope}:${rules[excedida].suffix}` };
}

/** Cuota del formulario de contacto. Mismas claves y límites que antes. */
export function checkRateLimit(ip: string): Promise<RateVerdict> {
  return consume("contact", ip, RULES);
}
