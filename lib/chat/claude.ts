import Anthropic from "@anthropic-ai/sdk";

/**
 * El cliente de Claude del asistente del sitio.
 *
 * Mismo esquema que el backoffice: con OPENROUTER_API_KEY todo va por
 * OpenRouter (que habla el formato de mensajes de Anthropic); sin ella, directo
 * a Anthropic con ANTHROPIC_API_KEY. OpenRouter nombra los modelos distinto
 * ("anthropic/claude-sonnet-5.5"), así que el nombre se traduce al salir.
 */
const OPENROUTER_URL = "https://openrouter.ai/api";

function modeloOpenRouter(modelo: string): string {
  if (modelo.includes("/")) return modelo;
  return `anthropic/${modelo.replace(/-(\d+)-(\d+)$/, "-$1.$2")}`;
}

const fetchOpenRouter: typeof fetch = async (url, init) => {
  if (init?.body && typeof init.body === "string") {
    try {
      const cuerpo = JSON.parse(init.body);
      if (typeof cuerpo.model === "string") cuerpo.model = modeloOpenRouter(cuerpo.model);
      // OpenRouter reparte Claude entre varios proveedores y la caché de uno
      // no le sirve a otro: un mensaje que cae en otro proveedor vuelve a
      // escribir el prompt entero, que cuesta más que diez respuestas.
      // Siempre Anthropic primero; los demás sólo si se cae.
      cuerpo.provider ??= { order: ["anthropic"], allow_fallbacks: true };
      init = { ...init, body: JSON.stringify(cuerpo) };
    } catch {
      // No es JSON: va tal cual.
    }
  }
  return fetch(url, init);
};

/**
 * Un reintento como mucho (el SDK hace dos): cada uno se paga entero, y con el
 * proveedor caído los reintentos sólo multiplican la cuenta y la espera.
 */
const OPCIONES = { maxRetries: 1, timeout: 50_000 } as const;

export function crearClienteClaude(): Anthropic {
  const claveOpenRouter = process.env.OPENROUTER_API_KEY;
  if (claveOpenRouter) {
    return new Anthropic({ ...OPCIONES, apiKey: claveOpenRouter, baseURL: OPENROUTER_URL, fetch: fetchOpenRouter });
  }
  return new Anthropic({ ...OPCIONES, apiKey: process.env.ANTHROPIC_API_KEY });
}

export const hayClaveClaude = () => Boolean(process.env.OPENROUTER_API_KEY || process.env.ANTHROPIC_API_KEY);
