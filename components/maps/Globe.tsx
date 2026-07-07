"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";
import { GLOBE_MARKERS, GLOBE_HOME } from "./mapData";

// From Cobe's interactive example — maps a lat/lng to [phi, theta].
function locationToAngles(lat: number, lng: number): [number, number] {
  return [Math.PI - ((lng * Math.PI) / 180 - Math.PI / 2), (lat * Math.PI) / 180];
}

const HOME_ANGLES = locationToAngles(GLOBE_HOME[0], GLOBE_HOME[1]);

// Arcs from HQ (Buenos Aires) out to a few cities — the glowing lines.
const ARC_TARGETS = ["cordoba", "mendoza", "neuquen", "tucuman"];

export default function Globe({ activeId }: { activeId?: string | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef<string | null>(activeId ?? null);

  useEffect(() => {
    activeRef.current = activeId ?? null;
  }, [activeId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let width = canvas.offsetWidth || 400;
    const onResize = () => { width = canvas.offsetWidth || width; };
    window.addEventListener("resize", onResize);

    let phi = HOME_ANGLES[0];
    let theta = HOME_ANGLES[1];

    const hq = GLOBE_MARKERS.find((m) => m.hq)!;
    const arcs = ARC_TARGETS.map((id) => {
      const m = GLOBE_MARKERS.find((x) => x.id === id);
      return m ? { from: [hq.lat, hq.lng] as [number, number], to: [m.lat, m.lng] as [number, number] } : null;
    }).filter(Boolean) as { from: [number, number]; to: [number, number] }[];

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi,
      theta,
      dark: 1,
      // No shading gradient → the sphere reads flat, so only the dots define shape.
      diffuse: 0,
      mapSamples: 22000,
      // Brighter land dots, ocean dots nearly invisible → "solo los dots".
      mapBrightness: 6,
      mapBaseBrightness: 0,
      // Fill color matches the page background so the sphere body disappears.
      baseColor: [0.027, 0.063, 0.114],
      markerColor: [1, 1, 1],
      glowColor: [0.027, 0.063, 0.114],
      markers: GLOBE_MARKERS.map((m) => ({ location: [m.lat, m.lng], size: m.hq ? 0.1 : 0.06 })),
      arcs,
      arcColor: [0.35, 0.75, 1],
      arcWidth: 0.5,
      arcHeight: 0.4,
    });

    let raf = 0;
    const render = () => {
      width = canvas.offsetWidth || width; // keep in sync with layout
      const act = activeRef.current
        ? GLOBE_MARKERS.find((m) => m.id === activeRef.current)
        : null;
      const [tp, tt] = act ? locationToAngles(act.lat, act.lng) : HOME_ANGLES;

      // shortest-path easing for phi (wraps at 2π)
      let dp = tp - phi;
      dp = ((dp % (2 * Math.PI)) + 3 * Math.PI) % (2 * Math.PI) - Math.PI;
      phi += dp * 0.06;
      theta += (tt - theta) * 0.06;

      globe.update({ phi, theta, width: width * 2, height: width * 2 });
      raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="relative w-full max-w-[560px] mx-auto aspect-square">
      {/* Soft glow behind the globe */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(43,111,212,0.10) 0%, transparent 62%)" }}
      />
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ contain: "layout paint size" }}
      />
    </div>
  );
}
