import type { CSSProperties } from "react";

/* Las ilustraciones de cada solución, redibujadas para fondo claro: mismos
 * objetos que las de `public/ilustraciones`, en SVG para poder animarlos.
 * Quietas en reposo; se mueven al entrar y al pasar el mouse (landing.css). */

const TINTA = "#0D1A2D";
// Toman el color de identidad de la tarjeta (--c, landing.css).
const AZUL = "var(--c)";
const CIELO = "var(--c-medio)";
const TINTE = "var(--c-tinte)";
const ROJO = "#E5484D";
const VERDE = "#10B981";
const AMBAR = "#F5A524";
const LINEA = "#DCE3EC";

const i = (n: number) => ({ "--i": n }) as CSSProperties;

function Lienzo({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 320 210" className="lp-ilu" aria-hidden fill="none">
      {children}
    </svg>
  );
}

function Networking() {
  const cables = [
    { d: "M104 96 C104 60 84 44 70 -6", c: "#60A5FA" },
    { d: "M160 96 C160 58 160 40 160 -6", c: VERDE },
    { d: "M216 96 C216 60 236 44 250 -6", c: "#7C6CF6" },
  ];
  return (
    <Lienzo>
      {cables.map((cable, k) => (
        <g key={k}>
          <path d={cable.d} stroke={cable.c} strokeWidth="5" strokeLinecap="round" />
          <path d={cable.d} stroke="#fff" strokeWidth="2" strokeLinecap="round" pathLength={1} className="lp-flujo" style={i(k)} />
        </g>
      ))}
      <rect x="40" y="92" width="240" height="106" rx="14" fill={TINTA} />
      <circle cx="58" cy="112" r="3.5" fill={AZUL} className="lp-led" />
      <text x="70" y="116" fontSize="11" fontWeight="600" fill="#fff" letterSpacing=".04em">CORE-SW-48</text>
      <text x="264" y="116" fontSize="9" fill={CIELO} textAnchor="end">99.9% uptime</text>
      {[0, 1].map((fila) =>
        Array.from({ length: 12 }).map((_, k) => {
          const encendido = [1, 4, 5, 9].includes((k + fila) % 12);
          return (
            <g key={`${fila}-${k}`}>
              <rect x={54 + k * 18} y={130 + fila * 22} width="14" height="16" rx="3" fill="#1A2B45" stroke="#2B3F5F" />
              <circle cx={61 + k * 18} cy={141 + fila * 22} r="1.8" fill={encendido ? (k % 2 ? VERDE : AZUL) : "#C6D0DD"} className={encendido ? "lp-led" : undefined} style={i(k)} />
            </g>
          );
        }),
      )}
      <rect x="96" y="88" width="16" height="10" rx="2.5" fill="#60A5FA" />
      <rect x="152" y="88" width="16" height="10" rx="2.5" fill={VERDE} />
      <rect x="208" y="88" width="16" height="10" rx="2.5" fill="#7C6CF6" />
    </Lienzo>
  );
}

function Firma() {
  return (
    <Lienzo>
      <rect x="34" y="52" width="252" height="146" rx="20" fill={TINTA} />
      {[0, 1, 2].map((k) => (
        <rect key={k} x="48" y={76 + k * 28} width="12" height="12" rx="4" fill={k === 0 ? AZUL : "#23344E"} />
      ))}
      <rect x="72" y="66" width="200" height="118" rx="10" fill="#fff" />
      <text x="88" y="90" fontSize="10.5" fontWeight="600" fill="#45546A">Firma biométrica</text>
      <path
        d="M90 136 C104 104 116 150 132 122 S162 104 180 130 S216 100 252 124"
        stroke={AZUL}
        strokeWidth="3"
        strokeLinecap="round"
        pathLength={1}
        className="lp-dibuja"
      />
      <line x1="88" y1="156" x2="256" y2="156" stroke={LINEA} strokeDasharray="4 4" />
      <text x="88" y="172" fontSize="8.5" fill="#6B7A90">Presión · velocidad · trazo</text>
      <g className="lp-aparece" style={i(5)}>
        <path d="M222 168l3.4 3.4 6-7" stroke="#0E9F6E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <text x="236" y="172" fontSize="8.5" fontWeight="600" fill="#0E9F6E">Válida</text>
      </g>
      <g className="lp-lapiz">
        <g transform="rotate(26 252 124)">
          <path d="M252 124 L246 108 L258 108 Z" fill="#45546A" />
          <rect x="246" y="-14" width="12" height="122" rx="5" fill="#23344E" />
          <rect x="246" y="34" width="12" height="9" fill={AZUL} />
        </g>
      </g>
    </Lienzo>
  );
}

function Consultoria() {
  const barras = [34, 52, 44, 72];
  return (
    <Lienzo>
      <rect x="28" y="18" width="264" height="180" rx="16" fill="#fff" stroke={LINEA} />
      <text x="46" y="44" fontSize="11.5" fontWeight="600" fill={TINTA}>Panel de ventas</text>
      <text x="274" y="44" fontSize="11" fontWeight="600" fill={AZUL} textAnchor="end">+24%</text>
      <line x1="28" y1="56" x2="292" y2="56" stroke={LINEA} />
      <rect x="44" y="68" width="110" height="38" rx="9" fill={TINTE} />
      <rect x="166" y="68" width="110" height="38" rx="9" fill={TINTA} />
      <text x="54" y="83" fontSize="8" fill="#6B7A90">Ingresos</text>
      <text x="54" y="98" fontSize="12" fontWeight="600" fill={TINTA}>$ 1.24M</text>
      <text x="176" y="83" fontSize="8" fill="#B8C4D4">Clientes</text>
      <text x="176" y="98" fontSize="12" fontWeight="600" fill="#fff">3.480</text>
      <path d="M46 176 L78 158 L104 166 L136 136 L164 146" stroke={AZUL} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" pathLength={1} className="lp-dibuja" />
      {barras.map((h, k) => (
        <rect key={k} x={196 + k * 20} y={184 - h} width="13" height={h} rx="3" fill={k === 3 ? AZUL : CIELO} className="lp-barra" style={i(k)} />
      ))}
    </Lienzo>
  );
}

function Seguridad() {
  return (
    <Lienzo>
      <rect x="28" y="20" width="264" height="178" rx="16" fill="#fff" stroke={LINEA} />
      <rect x="44" y="36" width="36" height="36" rx="10" fill={AZUL} />
      <path d="M62 44l11 4v8c0 7-5 11-11 13-6-2-11-6-11-13v-8z" stroke="#fff" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M57.5 56l3.2 3.2 6-6.4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" pathLength={1} className="lp-dibuja" />
      <text x="92" y="51" fontSize="12" fontWeight="600" fill={TINTA}>Firewall · Zero Trust</text>
      <text x="92" y="66" fontSize="9" fill="#6B7A90">Monitoreo en tiempo real</text>
      {[
        ["203.0.113.5", "Fuerza bruta"],
        ["45.148.10.2", "Port scan"],
      ].map(([ip, tipo], k) => (
        <g key={ip} className="lp-aparece" style={i(k + 1)}>
          <rect x="44" y={86 + k * 32} width="232" height="26" rx="7" fill="#FDF0F0" />
          <text x="56" y={103 + k * 32} fontSize="9.5" fontWeight="600" fill={TINTA}>{ip}</text>
          <text x="124" y={103 + k * 32} fontSize="8.5" fill="#6B7A90">{tipo}</text>
          <text x="264" y={103 + k * 32} fontSize="8.5" fontWeight="600" fill={ROJO} textAnchor="end">Bloqueado</text>
        </g>
      ))}
      <g className="lp-aparece" style={i(3)}>
        <rect x="44" y="150" width="232" height="30" rx="7" fill={TINTE} />
        <path d="M56 165l3.4 3.4 6-7" stroke={AZUL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <text x="74" y="169" fontSize="9.5" fontWeight="600" fill="var(--c-texto)">12 amenazas neutralizadas hoy</text>
      </g>
      <rect x="29" y="20" width="262" height="30" className="lp-escaner" fill="url(#lp-escaner)" />
      <defs>
        <linearGradient id="lp-escaner" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={AZUL} stopOpacity="0" />
          <stop offset="1" stopColor={AZUL} stopOpacity=".14" />
        </linearGradient>
      </defs>
    </Lienzo>
  );
}

function SoftwareAI() {
  const lineas = [
    { y: 74, x: 62, tramos: [[0, 34, "#F472B6"], [42, 62, AZUL]] },
    { y: 96, x: 74, tramos: [[0, 48, "#60A5FA"], [56, 40, VERDE]] },
    { y: 140, x: 74, tramos: [[0, 30, AMBAR], [38, 54, LINEA]] },
    { y: 162, x: 62, tramos: [[0, 26, "#F472B6"], [34, 42, "#60A5FA"]] },
  ] as const;
  return (
    <Lienzo>
      <rect x="28" y="20" width="264" height="178" rx="16" fill="#fff" stroke={LINEA} />
      {[ROJO, AMBAR, VERDE].map((c) => (
        <circle key={c} cx={46 + [ROJO, AMBAR, VERDE].indexOf(c) * 13} cy="40" r="4" fill={c} />
      ))}
      <text x="96" y="44" fontSize="10.5" fill="#6B7A90">app.tsx</text>
      <rect x="240" y="30" width="38" height="20" rx="7" fill={AZUL} />
      <text x="259" y="44" fontSize="9.5" fontWeight="600" fill="#fff" textAnchor="middle">AI</text>
      <line x1="28" y1="58" x2="292" y2="58" stroke={LINEA} />
      {[74, 96, 118, 140, 162].map((y, k) => (
        <text key={y} x="42" y={y + 4} fontSize="9" fill="#AEB9C8">{k + 1}</text>
      ))}
      {lineas.map((l, k) =>
        l.tramos.map(([x, w, c], j) => (
          <rect key={`${k}-${j}`} x={l.x + x} y={l.y - 4} width={w} height="7" rx="3.5" fill={c} className="lp-linea-codigo" style={i(k)} />
        )),
      )}
      <rect x="54" y="106" width="224" height="24" rx="6" fill={TINTE} />
      <rect x="62" y="114" width="58" height="7" rx="3.5" fill={AZUL} className="lp-linea-codigo" style={i(2)} />
      <rect x="128" y="114" width="42" height="7" rx="3.5" fill={CIELO} className="lp-linea-codigo" style={i(2)} />
      <rect x="176" y="112" width="2" height="11" fill={TINTA} className="lp-cursor" />
      <text x="268" y="121" fontSize="9" fontWeight="600" fill="var(--c-texto)" textAnchor="end">Copilot</text>
    </Lienzo>
  );
}

export default function Ilustracion({ slug }: { slug: string }) {
  if (slug === "networking") return <Networking />;
  if (slug === "firma-biometrica") return <Firma />;
  if (slug === "consultoria") return <Consultoria />;
  if (slug === "software-ai") return <SoftwareAI />;
  return <Seguridad />;
}
