"use client";

import { motion } from "framer-motion";
import { MAP_VIEWBOX, PROVINCES, POINTS } from "./mapData";

const BLUE = "#2B6FD4";

export default function ArgentinaMap({
  activeId,
  onHover,
}: {
  activeId: string | null;
  onHover?: (id: string | null) => void;
}) {
  return (
    <svg viewBox={MAP_VIEWBOX} className="h-[440px] sm:h-[520px] w-auto mx-auto overflow-visible">
      <defs>
        <filter id="arg-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="3.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Provinces — borders only, no fill colors */}
      {PROVINCES.map((p) => (
        <path
          key={p.code}
          d={p.path}
          fill="rgba(43,111,212,0.04)"
          stroke="rgba(130,170,235,0.4)"
          strokeWidth={0.7}
          strokeLinejoin="round"
        />
      ))}

      {/* Project points */}
      {POINTS.map((pt) => {
        const active = activeId === pt.id;
        const r = pt.hq ? 5 : 4;
        const showLabel = active || pt.hq;
        return (
          <g
            key={pt.id}
            style={{ cursor: onHover ? "pointer" : "default" }}
            onMouseEnter={() => onHover?.(pt.id)}
          >
            <motion.circle
              cx={pt.x}
              cy={pt.y}
              r={r}
              fill="none"
              stroke={BLUE}
              strokeWidth={1.4}
              initial={{ opacity: 0.6, scale: 1 }}
              animate={{ opacity: [0.6, 0], scale: [1, 3.2] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeOut" }}
              style={{ transformOrigin: `${pt.x}px ${pt.y}px` }}
            />
            <circle cx={pt.x} cy={pt.y} r={r + 2.5} fill={BLUE} opacity={active ? 0.6 : 0.28} filter="url(#arg-glow)" />
            <circle
              cx={pt.x}
              cy={pt.y}
              r={active ? r + 1.5 : r}
              fill="#EAF2FE"
              stroke={BLUE}
              strokeWidth={active ? 2 : 1}
              style={{ transition: "r 0.2s" }}
            />
            {showLabel && (
              <text
                x={pt.x + r + 6}
                y={pt.y + 4}
                fontSize={pt.hq ? 13 : 12}
                fontWeight={pt.hq ? 700 : 600}
                fill="#EAF2FE"
                style={{ paintOrder: "stroke", stroke: "#0D1A2D", strokeWidth: 3, strokeLinejoin: "round" }}
              >
                {pt.city}
                {pt.hq ? "  · HQ" : ""}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
