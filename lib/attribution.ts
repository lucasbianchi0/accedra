/**
 * Atribución de origen de visita.
 *
 * El problema que resuelve: el `gclid` (identificador del clic en un anuncio de
 * Google) llega en la URL de aterrizaje, pero la persona puede navegar varias
 * páginas antes de escribir — o volver una semana después. Si se lee la URL
 * recién en el submit, se pierde en casi todos los casos.
 *
 * Por eso se captura apenas entra y se persiste en localStorage, no en
 * sessionStorage: en B2B el ciclo es largo y la visita rara vez se resuelve de
 * una sentada.
 *
 * Modelo de atribución: LAST CLICK, igual que el que usa Google Ads por
 * defecto. Si la URL trae parámetros nuevos, pisan a los guardados; si no trae
 * nada, se conserva lo anterior mientras no haya vencido.
 */

const STORAGE_KEY = "accedra:attr";

/** Ventana de conversión por defecto de Google Ads. */
const TTL_DIAS = 90;
const TTL_MS = TTL_DIAS * 24 * 60 * 60 * 1000;

/**
 * Tope de longitud por campo. Son valores que vienen de la URL, o sea que
 * cualquiera puede escribir lo que quiera: se recortan acá y se vuelven a
 * validar en el servidor, porque esto es sólo la primera barrera.
 */
const MAX_LEN = 512;

/** Parámetros de click id de las plataformas publicitarias. */
const CLICK_IDS = ["gclid", "gbraid", "wbraid"] as const;
/** Parámetros UTM estándar. */
const UTMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

export type Attribution = {
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  /** Referente externo de la primera visita de este ciclo. */
  referrer?: string;
  /** Primera página vista en este ciclo de atribución. */
  landing_page?: string;
  /** Marca temporal del guardado, para calcular el vencimiento. */
  saved_at?: number;
};

type Stored = Attribution & { saved_at: number };

const clean = (v: string | null): string | undefined => {
  if (!v) return undefined;
  // Se descartan caracteres de control: no aparecen en parámetros legítimos y
  // ensucian tanto el log como la base.
  const t = v.replace(/[\u0000-\u001F\u007F]/g, "").trim();
  return t ? t.slice(0, MAX_LEN) : undefined;
};

/** Lee los parámetros de atribución presentes en una query string. */
function fromQuery(search: string): Attribution {
  const p = new URLSearchParams(search);
  const out: Attribution = {};
  for (const k of [...CLICK_IDS, ...UTMS]) {
    const v = clean(p.get(k));
    if (v) out[k] = v;
  }
  return out;
}

/** ¿La URL actual trae señal publicitaria propia? */
function tieneSenal(a: Attribution): boolean {
  return [...CLICK_IDS, ...UTMS].some((k) => Boolean(a[k]));
}

function leerGuardado(): Stored | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Stored;
    if (typeof parsed?.saved_at !== "number") return null;
    if (Date.now() - parsed.saved_at > TTL_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    // localStorage bloqueado (modo privado, políticas del navegador) o JSON
    // corrupto: se trata como "no hay nada guardado".
    return null;
  }
}

/**
 * Registra la atribución de la visita actual. Idempotente: se puede llamar en
 * cada cambio de ruta sin efectos raros.
 *
 * @param search   query string actual (window.location.search)
 * @param pathname ruta actual
 * @param referrer document.referrer
 */
export function capture(search: string, pathname: string, referrer: string): void {
  const enUrl = fromQuery(search);
  const guardado = leerGuardado();

  // Sin señal nueva en la URL y con algo vigente guardado: no se toca nada.
  // Pisarlo con un referrer interno rompería la atribución del anuncio original.
  if (!tieneSenal(enUrl) && guardado) return;

  // Referente externo únicamente: si viene del propio sitio no aporta origen.
  let ref: string | undefined;
  try {
    ref = referrer && new URL(referrer).host !== location.host ? referrer : undefined;
  } catch {
    ref = undefined;
  }

  const dato: Stored = {
    ...enUrl,
    referrer: clean(ref ?? null),
    landing_page: pathname,
    saved_at: Date.now(),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dato));
  } catch {
    /* almacenamiento no disponible — se sigue sin atribución */
  }
}

/** Devuelve la atribución vigente, o un objeto vacío si no hay o venció. */
export function read(): Attribution {
  const s = leerGuardado();
  if (!s) return {};
  const { saved_at, ...resto } = s;
  void saved_at;
  return resto;
}

/**
 * Atribución lista para adjuntar a un envío, con la página desde la que se
 * envía. Es lo que consume el formulario de contacto.
 */
export function forSubmit(pathname: string): Attribution & { submitted_from: string } {
  return { ...read(), submitted_from: pathname };
}
