"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { capture } from "@/lib/attribution";
import { track } from "@/lib/track";

/**
 * Registra el origen de la visita, emite el pageview en cada navegación y mide
 * cuánto se miró cada página. No renderiza nada.
 *
 * El orden importa: `capture` tiene que correr ANTES que `track`, porque el
 * primer evento de la sesión es el que lleva la atribución al servidor. Si se
 * invirtiera, la sesión se daría de alta sin saber de qué anuncio vino.
 *
 * Lee `window.location.search` a mano en lugar de usar `useSearchParams()`: ese
 * hook obliga a envolver el árbol en <Suspense> y saca las páginas del
 * prerenderizado estático, y no compensa para un efecto que corre sólo en el
 * cliente después de montar.
 *
 * ── POR QUE LA PERMANENCIA SE MIDE ACA Y NO SE DEDUCE DESPUES ──
 *
 * El tiempo en página se puede estimar restando pageviews consecutivos de la
 * misma sesión, y así se venía haciendo. El problema es la última página de cada
 * visita: no tiene un pageview siguiente del cual restar, así que queda sin
 * medir. Con un 81% de sesiones de una sola página, eso es no medir nada en 8 de
 * cada 10 visitas — justo las que más importan, porque son las que se van.
 *
 * El evento `salida` cierra ese agujero: lo emite el navegador cuando la página
 * deja de mirarse, con el tiempo que estuvo VISIBLE —no el de reloj: una pestaña
 * abierta de fondo tres horas no es lectura— y hasta qué altura se scrolleó, que
 * en una landing larga es la medida real de si la propuesta se leyó o se
 * abandonó en el hero.
 *
 * ── POR QUE PUEDE HABER VARIOS `salida` POR PAGINA ──
 *
 * Si alguien cambia de pestaña y vuelve, se emite uno al ocultarse y otro al
 * irse en serio. Es deliberado: la alternativa —mandar uno solo al final—
 * depende de un `pagehide` que en mobile no siempre llega, y perder el evento
 * entero es peor que partirlo en dos. El panel suma los `ms` de cada página y
 * toma el MAXIMO de `scroll`; con esa regla los tramos se reconstruyen exactos.
 */
export default function Attribution() {
  const pathname = usePathname();

  useEffect(() => {
    capture(window.location.search, pathname, document.referrer);
    track({ type: "pageview" });

    /* ── Permanencia y scroll ──────────────────────────────────────────── */

    // Momento desde el que se viene contando tiempo visible. 0 = la página no
    // está a la vista, o sea que el reloj está detenido.
    let desde = document.visibilityState === "visible" ? Date.now() : 0;
    let acumulado = 0;
    let profundidad = 0;
    let enviado = false;
    let pendiente = 0;

    const medirScroll = () => {
      const alto = document.documentElement.scrollHeight;
      if (alto <= 0) return;
      // Cuánto del documento llegó a entrar en el viewport. Una página que entra
      // entera sin scrollear da 100, y es correcto: se vio completa.
      const visto = window.scrollY + window.innerHeight;
      const pct = Math.max(0, Math.min(100, Math.round((visto / alto) * 100)));
      if (pct > profundidad) profundidad = pct;
    };

    // El scroll dispara decenas de veces por segundo y leer `scrollHeight`
    // fuerza un reflow. Con rAF se mide una vez por cuadro como mucho.
    const alScrollear = () => {
      if (pendiente) return;
      pendiente = requestAnimationFrame(() => {
        pendiente = 0;
        medirScroll();
      });
    };

    const enviar = () => {
      if (enviado) return;
      if (desde) {
        acumulado += Date.now() - desde;
        desde = 0;
      }
      if (acumulado <= 0 && profundidad <= 0) return;
      enviado = true;
      // `path` explícito: en una navegación del App Router la URL ya cambió a la
      // página siguiente cuando corre esta limpieza, así que dejar que track()
      // lea `location.pathname` le adjudicaría este tiempo a la página nueva.
      track({
        type: "salida",
        path: pathname,
        metadata: { ms: acumulado, scroll: profundidad },
      });
    };

    const alCambiarVisibilidad = () => {
      if (document.visibilityState === "hidden") {
        enviar();
        return;
      }
      // Volvió a la vista: empieza un tramo nuevo. El acumulador se reinicia
      // porque lo anterior ya viajó, y se habilita otro envío. Ver el
      // encabezado: el panel suma los tramos de la misma página.
      desde = Date.now();
      acumulado = 0;
      enviado = false;
    };

    // La primera medición va después del primer cuadro: al montar, el layout
    // todavía no tomó su altura final y `scrollHeight` puede ser el del
    // esqueleto, lo que daría una profundidad inflada.
    const inicial = requestAnimationFrame(medirScroll);

    window.addEventListener("scroll", alScrollear, { passive: true });
    window.addEventListener("pagehide", enviar);
    document.addEventListener("visibilitychange", alCambiarVisibilidad);

    return () => {
      enviar();
      cancelAnimationFrame(inicial);
      if (pendiente) cancelAnimationFrame(pendiente);
      window.removeEventListener("scroll", alScrollear);
      window.removeEventListener("pagehide", enviar);
      document.removeEventListener("visibilitychange", alCambiarVisibilidad);
    };
  }, [pathname]);

  return null;
}
