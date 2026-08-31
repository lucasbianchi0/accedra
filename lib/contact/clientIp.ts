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
