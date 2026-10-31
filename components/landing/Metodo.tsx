"use client";

import { useEffect, useRef, useState } from "react";
import { useT } from "@/lib/i18n/useT";
import { Entra, Palabras } from "./Entra";

// Un video por etapa. Solo el activo se descarga y reproduce.
const MEDIOS = ["3252919", "3141210", "5028622", "6963744"];

export default function Metodo() {
  const t = useT();
  const m = t.landing.metodo;
  const [activo, setActivo] = useState(0);
  const [visible, setVisible] = useState(false);
  const pista = useRef<HTMLDivElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);

  // Cada tramo de la pista ocupa un alto de pantalla; manda el que cruza el centro.
  useEffect(() => {
    const raiz = pista.current;
    if (!raiz) return;
    const tramos = Array.from(raiz.querySelectorAll<HTMLElement>("[data-tramo]"));
    const etapas = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) setActivo(Number((e.target as HTMLElement).dataset.tramo));
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    tramos.forEach((el) => etapas.observe(el));
    const seccion = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "200px" });
    seccion.observe(raiz);
    return () => {
      etapas.disconnect();
      seccion.disconnect();
    };
  }, []);

  useEffect(() => {
    const quieto =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !window.matchMedia("(min-width: 1024px)").matches;
    videos.current.forEach((v, i) => {
      if (!v) return;
      if (!quieto && visible && i === activo) {
        if (!v.getAttribute("src")) v.src = `/videos/${MEDIOS[i]}.mp4`;
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [activo, visible]);

  // Mobile: deslizar con el dedo pasa de etapa, igual que tocar una tab.
  const inicioToque = useRef(0);
  const deslizar = (hasta: number) => {
    const dx = hasta - inicioToque.current;
    if (Math.abs(dx) < 40) return;
    setActivo((a) => Math.min(m.pasos.length - 1, Math.max(0, a + (dx < 0 ? 1 : -1))));
  };

  const irA = (i: number) => {
    const tramo = pista.current?.querySelector<HTMLElement>(`[data-tramo="${i}"]`);
    if (!tramo) return;
    // La etapa se activa cuando su tramo cruza el centro de la pantalla.
    const destino = tramo.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2 + 4;
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: destino, behavior: quieto ? "auto" : "smooth" });
  };

  return (
    <section id="metodo" className="lp-capitulo">
      <div className="lp-capitulo-panel">
        <div ref={pista} className="lp-metodo-pista">
          {m.pasos.map((_, i) => (
            <div key={i} data-tramo={i} className="lp-metodo-tramo" aria-hidden />
          ))}

          <div className="lp-metodo-fijo">
            <div className="lp-metodo-texto">
              <Entra as="span" tipo="funde" className="lp-rotulo lp-rotulo-claro">{m.eyebrow}</Entra>
              <Entra as="h2" tipo="titulo" className="lp-h2 text-white">
                <Palabras texto={m.titulo} />
              </Entra>

              <ol className="lp-pasos">
                {m.pasos.map((p, i) => (
                  <li key={p.titulo} data-activo={i === activo || undefined}>
                    <button type="button" onClick={() => irA(i)} aria-current={i === activo ? "step" : undefined}>
                      <span className="lp-numero">{String(i + 1).padStart(2, "0")}</span>
                      <span className="lp-paso-titulo">{p.titulo}</span>
                    </button>
                    <div className="lp-paso-detalle">
                      <div>
                        <p>{p.desc}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>

              {/* Mobile: una etapa a la vez, con tabs en lugar de scroll fijo. */}
              <div className="lp-tabs-bloque">
                <div className="lp-tabs" role="tablist" aria-label={m.eyebrow} >
                  {m.pasos.map((p, i) => (
                    <button
                      key={p.titulo}
                      type="button"
                      role="tab"
                      id={`lp-tab-${i}`}
                      aria-selected={i === activo}
                      aria-label={p.titulo}
                      aria-controls="lp-tab-panel"
                      onClick={() => setActivo(i)}
                    >
                      <span className="lp-numero">{String(i + 1).padStart(2, "0")}</span>
                      <span className="lp-tab-nombre">{p.titulo}</span>
                    </button>
                  ))}
                </div>
                <div
                  id="lp-tab-panel"
                  role="tabpanel"
                  aria-labelledby={`lp-tab-${activo}`}
                  className="lp-tab-panel"
                  onTouchStart={(e) => (inicioToque.current = e.touches[0].clientX)}
                  onTouchEnd={(e) => deslizar(e.changedTouches[0].clientX)}
                >
                  <div className="lp-tab-fotos">
                    {MEDIOS.map((id, i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={id}
                        src={`/_opt/videos/${id}-1080.webp`}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        data-activo={i === activo || undefined}
                      />
                    ))}
                  </div>
                  <div key={activo} className="lp-tab-texto">
                    <h3>{m.pasos[activo].titulo}</h3>
                    <p>{m.pasos[activo].desc}</p>
                  </div>
                </div>
              </div>
            </div>

            <Entra tipo="foto" className="lp-metodo-medios" aria-hidden>
              {MEDIOS.map((id, i) => (
                <div key={id} data-activo={i === activo || undefined} className="lp-metodo-medio">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/_opt/videos/${id}-1080.webp`} alt="" loading="lazy" decoding="async" />
                  <video
                    ref={(el) => {
                      videos.current[i] = el;
                    }}
                    muted
                    loop
                    playsInline
                    preload="none"
                    tabIndex={-1}
                  />
                </div>
              ))}
            </Entra>
          </div>
        </div>
      </div>
    </section>
  );
}
