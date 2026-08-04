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

/**
 * Campos de atribución que acompañan al envío. Vienen del cliente (los arma
 * lib/attribution.ts desde la URL), o sea que son ENTRADA HOSTIL: cualquiera
 * puede mandar un POST con lo que quiera acá. Por eso se sanean en vez de
 * rechazarse — un gclid inválido no debe hacer que se pierda un lead legítimo.
 */
export const ATTRIBUTION_FIELDS = [
  "gclid", "gbraid", "wbraid",
  "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
  "referrer", "landing_page", "submitted_from",
] as const;

export type AttributionField = (typeof ATTRIBUTION_FIELDS)[number];
export type AttributionData = Partial<Record<AttributionField, string>> & {
  /** Sesión de navegación que originó el lead. */
  session_id?: string;
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Tope por campo de atribución. Las URLs largas se recortan, no se descartan. */
const ATTR_MAX_LEN = 512;

/**
 * Extrae y limpia la atribución de un payload arbitrario. Nunca falla: lo que
 * no sirve se descarta en silencio y el lead se guarda igual.
 */
export function extractAttribution(raw: unknown): AttributionData {
  if (typeof raw !== "object" || raw === null) return {};
  const body = raw as Record<string, unknown>;
  const out: AttributionData = {};

  for (const k of ATTRIBUTION_FIELDS) {
    const v = body[k];
    if (typeof v !== "string") continue;
    // Se quitan los caracteres de control por el mismo motivo que en el resto
    // del formulario: ensucian logs y son la firma de intentos de inyección.
    const limpio = v.replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, ATTR_MAX_LEN);
    if (limpio) out[k] = limpio;
  }

  // El id de sesión lo genera el navegador: se valida el formato para no
  // ensuciar la tabla con claves arbitrarias. Si no sirve, se descarta y el
  // lead se guarda igual, sólo que sin cruzar con su navegación.
  const sid = body.session_id;
  if (typeof sid === "string" && UUID_RE.test(sid.trim())) out.session_id = sid.trim();

  return out;
}

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
