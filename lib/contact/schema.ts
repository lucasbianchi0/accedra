// Límites del formulario de contacto.
//
// El cliente usa LIMITS para `maxLength` (sólo UX). El servidor revalida SIEMPRE:
// un scraper postea directo a /api/contact y nunca ejecuta el React, así que
// cualquier control que viva únicamente en el componente no existe para él.

export const LIMITS = {
  name: 80,
  company: 80,
  email: 254, // RFC 5321
  message: 2000,
  /** Corte duro del body antes de intentar parsear JSON. */
  maxBodyBytes: 8 * 1024,
} as const;

export const SERVICES = [
  "networking",
  "seguridad",
  "biometrica",
  "consultoria",
  "otro",
] as const;
export type Service = (typeof SERVICES)[number];

/**
 * Tiempo mínimo entre que se pinta el form y se envía. Una persona no completa
 * cinco campos en menos de esto; los bots postean instantáneamente.
 * Señal débil: frena bots ingenuos, no a alguien que la mire dos minutos.
 */
export const MIN_FILL_MS = 3_000;

export type ContactData = {
  name: string;
  company: string;
  email: string;
  message: string;
  service: Service | "";
};

export type ValidationResult =
  | { ok: true; data: ContactData }
  | { ok: false; reason: string };

const EMAIL_RE = /^[^\s@<>()[\],;:]+@[^\s@<>()[\],;:.]+(\.[^\s@<>()[\],;:.]+)+$/;

/**
 * Saltos de línea y caracteres de control en campos de una sola línea son la
 * firma clásica del header injection, y además ensucian el asunto del mail.
 */
const hasControlChars = (s: string) => {
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c < 32 || c === 127) return true;
  }
  return false;
};

export function validate(raw: unknown): ValidationResult {
  if (typeof raw !== "object" || raw === null) return { ok: false, reason: "payload" };
  const body = raw as Record<string, unknown>;

  const str = (k: string) =>
    typeof body[k] === "string" ? (body[k] as string).trim() : null;

  const name = str("name");
  const company = str("company");
  const email = str("email");
  const message = str("message");
  const service = str("service") ?? "";

  if (name === null || company === null || email === null || message === null) {
    return { ok: false, reason: "missing" };
  }
  if (!name || !company || !email || !message) return { ok: false, reason: "empty" };

  if (
    name.length > LIMITS.name ||
    company.length > LIMITS.company ||
    email.length > LIMITS.email ||
    message.length > LIMITS.message
  ) {
    return { ok: false, reason: "length" };
  }

  if (hasControlChars(name) || hasControlChars(company) || hasControlChars(email)) {
    return { ok: false, reason: "control" };
  }
  if (!EMAIL_RE.test(email)) return { ok: false, reason: "email" };

  // El <select> es cerrado: cualquier valor fuera del enum viene de un POST armado a mano.
  if (service && !(SERVICES as readonly string[]).includes(service)) {
    return { ok: false, reason: "service" };
  }

  // Heurística: los envíos automáticos suelen ser un muro de links.
  const links = (message.match(/https?:\/\//gi) ?? []).length;
  if (links > 2) return { ok: false, reason: "links" };

  return {
    ok: true,
    data: { name, company, email, message, service: service as Service | "" },
  };
}
