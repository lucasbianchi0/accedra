import type { NextRequest } from "next/server";

/**
 * IP real del visitante a partir de los headers de proxy.
 *
 * `request.ip` fue removido en Next 15, así que sale del header. Vercel antepone
 * la IP del cliente en x-forwarded-for; el resto de la lista son los proxies
 * intermedios, por eso se toma sólo el primer elemento.
 *
 * Vive acá y no en una route porque lo usan las dos que reciben formularios
 * (/api/contact y /api/brochure) para alimentar el mismo rate limit: si cada una
 * derivara la IP a su manera, los límites se contarían por separado.
 */
export function clientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

/**
 * La IP con la que se cuentan los límites.
 *
 * Una conexión IPv6 hogareña recibe un /64 entero: más direcciones de las que
 * nadie va a usar, y rotar entre ellas es gratis. Contar por dirección exacta
 * dejaría que un solo equipo saltee cualquier límite por IP, así que en IPv6 se
 * cuenta por el /64. En IPv4 la dirección tal cual.
 */
export function ipParaLimite(req: NextRequest): string {
  const ip = clientIp(req);
  if (!ip.includes(":")) return ip;
  // "::ffff:1.2.3.4" es una IPv4 escrita como IPv6.
  const v4 = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/i.exec(ip);
  if (v4) return v4[1];
  const [cabeza, cola = ""] = ip.toLowerCase().split("::");
  const izq = cabeza ? cabeza.split(":") : [];
  const der = cola ? cola.split(":") : [];
  const grupos = ip.includes("::") ? [...izq, ...Array(Math.max(0, 8 - izq.length - der.length)).fill("0"), ...der] : izq;
  return `${grupos.slice(0, 4).map((g) => g.replace(/^0+(?=.)/, "")).join(":")}::/64`;
}

/**
 * El bloque de red, para un segundo cupo más holgado: el /48 en IPv6 (lo que
 * suele tener un servidor o una empresa, con miles de /64 adentro) y la IP tal
 * cual en IPv4, para no castigar a los que comparten la del celular.
 */
export function bloqueDeRed(req: NextRequest): string {
  const ip = ipParaLimite(req);
  if (!ip.endsWith("::/64")) return ip;
  return `${ip.slice(0, -5).split(":").slice(0, 3).join(":")}::/48`;
}
