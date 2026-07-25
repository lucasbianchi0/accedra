// Rate limiting por IP para /api/contact.
//
// En Vercel cada request puede caer en una instancia distinta y las instancias se
// reciclan, así que un contador en memoria NO frena a un atacante: le alcanza con
// espaciar los envíos o simplemente tener suerte con el routing. Sirve sólo como
// red de contención en desarrollo.
//
// Con UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN definidas el contador pasa
// a ser compartido entre instancias y el límite se vuelve real. `isDurable` expone
// cuál de los dos modos está activo para poder loguearlo.

const URL_BASE = process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export const isDurable = Boolean(URL_BASE && TOKEN);

/** Reglas acumulativas: se aplican todas, alcanza que una falle. */
export const RULES = [
  { suffix: "burst", limit: 3, windowSec: 10 * 60 }, // 3 cada 10 min
  { suffix: "day", limit: 12, windowSec: 24 * 60 * 60 }, // 12 por día
] as const;

async function redisIncr(key: string, windowSec: number): Promise<number> {
  const res = await fetch(`${URL_BASE}/incr/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`upstash incr ${res.status}`);
  const count = Number((await res.json()).result);

  // Sólo el primer hit de la ventana define el TTL; si no, la ventana se
  // renovaría en cada request y el contador nunca expiraría.
  if (count === 1) {
    await fetch(`${URL_BASE}/expire/${encodeURIComponent(key)}/${windowSec}`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      cache: "no-store",
    });
  }
  return count;
}

// Fallback en memoria: timestamps por clave, podados por ventana.
const memory = new Map<string, number[]>();

function memoryIncr(key: string, windowSec: number, now: number): number {
  const cutoff = now - windowSec * 1000;
  const hits = (memory.get(key) ?? []).filter((t) => t > cutoff);
  hits.push(now);
  memory.set(key, hits);

  // Poda perezosa para que el Map no crezca sin techo en un proceso largo.
  if (memory.size > 5_000) {
    for (const [k, v] of memory) {
      if (v.every((t) => t <= cutoff)) memory.delete(k);
    }
  }
  return hits.length;
}

export type RateVerdict = { allowed: boolean; rule?: string };

/**
 * Devuelve `allowed: false` si la IP superó alguna regla.
 *
 * Ante un error de Upstash deja pasar (fail-open) en vez de bloquear: si Redis se
 * cae, rechazar todo convertiría una caída de infra en pérdida de consultas
 * comerciales. El costo es que durante esa ventana el límite no aplica.
 */
export async function checkRateLimit(ip: string): Promise<RateVerdict> {
  const now = Date.now();

  for (const rule of RULES) {
    const key = `contact:${rule.suffix}:${ip}`;
    try {
      const count = isDurable
        ? await redisIncr(key, rule.windowSec)
        : memoryIncr(key, rule.windowSec, now);
      if (count > rule.limit) return { allowed: false, rule: rule.suffix };
    } catch (err) {
      console.error(`[contact] rate limit "${rule.suffix}" falló, se deja pasar:`, err);
    }
  }
  return { allowed: true };
}
