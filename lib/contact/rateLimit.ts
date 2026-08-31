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
// espaciar los envíos o simplemente tener suerte con el routing. Sirve sólo como
// red de contención en desarrollo.
//
// Con UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN definidas el contador pasa
// a ser compartido entre instancias y el límite se vuelve real. `isDurable` expone
// cuál de los dos modos está activo para poder loguearlo.

const URL_BASE = process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export const isDurable = Boolean(URL_BASE && TOKEN);

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
 * Consume una cuota y dice si el pedido pasa.
 *
 * `scope` separa endpoints y dimensiones ("contact", "brochure:ip",
 * "brochure:email"…); `id` es el sujeto contado (una IP, un mail hasheado, o
 * "all" para un techo global).
 *
 * Ante un error de Upstash deja pasar (fail-open) en vez de bloquear: si Redis se
 * cae, rechazar todo convertiría una caída de infra en pérdida de consultas
 * comerciales. El costo es que durante esa ventana el límite no aplica.
 */
export async function consume(
  scope: string,
  id: string,
  rules: readonly Rule[]
): Promise<RateVerdict> {
  const now = Date.now();

  for (const rule of rules) {
    const key = `${scope}:${rule.suffix}:${id}`;
    try {
      const count = isDurable
        ? await redisIncr(key, rule.windowSec)
        : memoryIncr(key, rule.windowSec, now);
      if (count > rule.limit) return { allowed: false, rule: `${scope}:${rule.suffix}` };
    } catch (err) {
      console.error(`[rate] "${scope}:${rule.suffix}" falló, se deja pasar:`, err);
    }
  }
  return { allowed: true };
}

/** Cuota del formulario de contacto. Mismas claves y límites que antes. */
export function checkRateLimit(ip: string): Promise<RateVerdict> {
  return consume("contact", ip, RULES);
}
