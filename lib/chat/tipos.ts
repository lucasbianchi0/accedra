/**
 * Lo que comparten el panel del asistente y su API.
 *
 * El modelo no dibuja tarjetas: pide mostrarlas con una herramienta, el
 * servidor arma los datos desde la MISMA fuente que las páginas (soluciones y
 * casos) y el panel las pinta. Así una tarjeta nunca trae un número, un nombre
 * de cliente o un link que el modelo se haya inventado.
 */

export type TarjetaSolucion = {
  tipo: "solucion";
  slug: string;
  nombre: string;
  /** Por qué le sirve a esta persona, en una línea (lo escribe el modelo). */
  motivo: string;
  accent: string;
  href: string;
};

export type TarjetaCaso = {
  tipo: "caso";
  id: string;
  cliente: string;
  industria: string;
  titulo: string;
  imagen: string;
  cifras: { value: string; label: string }[];
  href: string;
  accent: string;
};

export type TarjetaContacto = {
  tipo: "contacto";
  /** El caso en dos líneas, para el especialista. Lo arma el modelo. */
  resumen: string;
  solucion: string | null;
  nombre: string;
  empresa: string;
};

export type TarjetaHumano = {
  tipo: "humano";
  /** El texto precargado del WhatsApp: la persona no tiene que repetir nada. */
  resumen: string;
};

export type Tarjeta = TarjetaSolucion | TarjetaCaso | TarjetaContacto | TarjetaHumano;

export type Parte = { tipo: "texto"; texto: string } | { tipo: "tarjeta"; tarjeta: Tarjeta };

export type Mensaje = {
  id: string;
  rol: "user" | "assistant";
  partes: Parte[];
  error?: string;
};

/** Lo que viaja al servidor por mensaje. */
export type Entrada = { role: "user" | "assistant"; content: string };

export const LIMITES_CHAT = {
  /** Lo que puede escribir la persona en un mensaje. */
  mensaje: 1200,
  /** Lo que puede pesar una respuesta del asistente al volver en el historial. */
  respuesta: 6000,
  /** Mensajes del historial que se mandan (el navegador recorta los viejos). */
  historial: 24,
  /** Techo de caracteres del historial entero. */
  total: 24_000,
} as const;

/**
 * Cómo vuelve una tarjeta al historial que lee el modelo.
 *
 * El modelo sólo recibe texto: sin esta nota no sabría que ya mostró el caso
 * de Andreani y lo mostraría de nuevo en el mensaje siguiente.
 */
export function notaDeTarjeta(t: Tarjeta): string {
  switch (t.tipo) {
    case "solucion":
      return `[Mostré la tarjeta de la solución ${t.nombre}]`;
    case "caso":
      return `[Mostré el caso de éxito de ${t.cliente}]`;
    case "contacto":
      return "[Mostré el formulario para dejar los datos de contacto]";
    case "humano":
      return "[Mostré el botón para hablar por WhatsApp con una persona]";
  }
}
