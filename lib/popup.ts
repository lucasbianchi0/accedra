/**
 * El popup del sitio: lo que llega del backoffice y las reglas de cuándo se ve.
 *
 * El contenido no se edita acá. Se carga en el backoffice (Marketing → Popup del
 * sitio), se guarda en la tabla `popups` de la misma base que ya usan los leads
 * y la analítica, y este archivo sólo lo lee. Prender un aviso de un evento no
 * puede necesitar un deploy: cuando lo necesita, el aviso queda publicado tres
 * semanas después del evento porque nadie quiere hacer otro deploy para sacarlo.
 *
 * SOBRE EL IDIOMA
 *
 * El popup se muestra tal como se cargó, en las tres versiones del sitio. Es
 * deliberado: son anuncios puntuales y con fecha —un evento, un corte de
 * servicio— y pedir tres traducciones para algo que dura una semana termina en
 * que no se carga nada. Si alguna vez hace falta, se agregan columnas por
 * idioma, no se traduce en vivo.
 *
 * Sin imports de servidor: lo usan el handler de la API y el componente cliente.
 */

import type { PiezaPopup } from "@/components/popup/PopupPieza";

/** Lo que viaja al navegador: la pieza más las reglas de cuándo mostrarla. */
export type PopupSitio = PiezaPopup & {
  id: string;
  /** Segundos desde que carga la página hasta que aparece. */
  demoraS: number;
  frecuencia: "siempre" | "sesion" | "dia" | "unica";
  alcance: "todas" | "home" | "rutas";
  rutas: string[];
  /**
   * `updated_at` en ISO. Entra en la clave de "ya lo vi", así que editar el
   * popup se lo vuelve a mostrar a todos. Es lo que se espera al corregir una
   * fecha equivocada: que la corrección llegue también a quien ya lo había
   * cerrado.
   */
  actualizado: string;
};

/* ── Dónde se muestra ─────────────────────────────────────────────────────── */

/**
 * Si este popup corresponde a la página en la que está el visitante.
 *
 * Las rutas se comparan por prefijo: cargar "/soluciones/networking" alcanza
 * las páginas por industria que cuelgan de ahí. Es lo que se espera al escribir
 * una ruta padre, y evita tener que enumerar las cuatro hijas a mano.
 */
export function correspondeA(popup: PopupSitio, pathname: string): boolean {
  if (popup.alcance === "todas") return true;
  if (popup.alcance === "home") return pathname === "/";
  return popup.rutas.some(
    (r) => pathname === r || pathname.startsWith(r.endsWith("/") ? r : `${r}/`)
  );
}

/* ── Cada cuánto se muestra ───────────────────────────────────────────────── */

const CLAVE = "accedra:popup";

/** La marca es por popup Y por versión: ver el comentario de `actualizado`. */
function claveDe(popup: PopupSitio): string {
  return `${CLAVE}:${popup.id}:${popup.actualizado}`;
}

const UN_DIA_MS = 24 * 60 * 60 * 1000;

/**
 * Si a esta persona ya se le mostró y todavía no le toca de nuevo.
 *
 * Todo va envuelto en try/catch y ante cualquier falla devuelve `false`: con el
 * almacenamiento bloqueado —modo privado, cookies de terceros restringidas— la
 * consecuencia de equivocarse es mostrar el popup de más, que es infinitamente
 * mejor que romper la página por un aviso.
 */
export function yaLoVio(popup: PopupSitio): boolean {
  if (popup.frecuencia === "siempre") return false;

  try {
    if (popup.frecuencia === "sesion") {
      return sessionStorage.getItem(claveDe(popup)) !== null;
    }

    const marca = localStorage.getItem(claveDe(popup));
    if (marca === null) return false;
    if (popup.frecuencia === "unica") return true;

    const cuando = Number(marca);
    // Marca ilegible (otra versión del código, alguien tocando el storage): se
    // trata como no visto en vez de esconder el popup para siempre.
    if (!Number.isFinite(cuando)) return false;
    return Date.now() - cuando < UN_DIA_MS;
  } catch {
    return false;
  }
}

/** Deja la marca de que se mostró. Se llama al ABRIRLO, no al cerrarlo: si se
 *  esperara al cierre, quien navega a otra página con el popup abierto lo vería
 *  otra vez, y otra. */
export function marcarVisto(popup: PopupSitio): void {
  if (popup.frecuencia === "siempre") return;

  try {
    if (popup.frecuencia === "sesion") {
      sessionStorage.setItem(claveDe(popup), "1");
      return;
    }
    localStorage.setItem(claveDe(popup), String(Date.now()));
  } catch {
    /* almacenamiento bloqueado: se muestra de más y no pasa nada */
  }
}

/* ── La imagen ────────────────────────────────────────────────────────────── */

/**
 * Deja la imagen en la caché del navegador antes de que haga falta.
 *
 * Se llama apenas llega la configuración, o sea durante los segundos de demora:
 * para cuando el popup se abre, la foto ya está bajada y aparece junto con el
 * resto de la pieza.
 */
export function precargarImagen(url: string): void {
  const img = new window.Image();
  img.src = url;
}

/**
 * Resuelve cuando la imagen terminó de cargar, o cuando se acabó la paciencia.
 *
 * El tope es la parte importante: si la conexión está mal, el aviso se muestra
 * igual —con el hueco de la foto vacío un momento— en vez de no mostrarse nunca.
 * Un popup que espera indefinidamente a una imagen es un popup que no existe.
 *
 * Si ya está en caché (que es el caso normal, porque se precargó durante la
 * demora), `onload` dispara en el mismo tick y no se espera nada.
 */
export function esperarImagen(url: string, topeMs: number): Promise<void> {
  return new Promise((resolve) => {
    const img = new window.Image();
    const listo = () => {
      clearTimeout(reloj);
      resolve();
    };
    const reloj = setTimeout(resolve, topeMs);
    img.onload = listo;
    // Un error también resuelve: el popup se abre sin foto, que es mucho mejor
    // que no abrirse.
    img.onerror = listo;
    img.src = url;
  });
}

/* ── Lectura de la base ───────────────────────────────────────────────────── */

/**
 * Las columnas que necesita el sitio. Deliberadamente menos que las de la
 * tabla: el nombre interno, el autor y las fechas de auditoría no tienen por qué
 * viajar al navegador de un visitante.
 */
export const COLUMNAS_SITIO =
  "id, formato, etiqueta, titulo, descripcion, imagen_ruta, imagen_alt, accion, cta_texto, cta_url, cta_nueva_pestana, mail_gracias, cerrar_texto, demora_s, frecuencia, alcance, rutas, updated_at";

type Fila = Record<string, unknown>;

function txt(v: unknown): string {
  return typeof v === "string" ? v : "";
}

/** Fila de `popups` → lo que se le manda al navegador. */
export function aPopupSitio(fila: Fila, urlPublica: (ruta: string) => string): PopupSitio {
  const ruta = txt(fila.imagen_ruta);
  const formato = txt(fila.formato);
  const accion = txt(fila.accion);
  const frecuencia = txt(fila.frecuencia);
  const alcance = txt(fila.alcance);

  return {
    id: String(fila.id),
    formato: formato === "barra" ? "barra" : "modal",
    etiqueta: txt(fila.etiqueta),
    titulo: txt(fila.titulo),
    descripcion: txt(fila.descripcion),
    imagenUrl: ruta ? urlPublica(ruta) : null,
    imagenAlt: txt(fila.imagen_alt),
    accion: accion === "enlace" ? "enlace" : "mail",
    ctaTexto: txt(fila.cta_texto),
    ctaUrl: txt(fila.cta_url),
    ctaNuevaPestana: fila.cta_nueva_pestana !== false,
    mailGracias: txt(fila.mail_gracias),
    cerrarTexto: txt(fila.cerrar_texto),
    demoraS: typeof fila.demora_s === "number" ? fila.demora_s : 6,
    frecuencia:
      frecuencia === "siempre" || frecuencia === "dia" || frecuencia === "unica"
        ? frecuencia
        : "sesion",
    alcance: alcance === "home" || alcance === "rutas" ? alcance : "todas",
    rutas: Array.isArray(fila.rutas) ? fila.rutas.map(String) : [],
    actualizado: txt(fila.updated_at),
  };
}
