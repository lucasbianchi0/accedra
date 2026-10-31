import type { CSSProperties } from "react";

/* Las ilustraciones de cada solución, redibujadas para fondo claro: mismos
 * objetos que las de `public/ilustraciones`, en SVG para poder animarlos.
 * Quietas en reposo; se mueven al entrar y al pasar el mouse (landing.css). */

const TINTA = "#0D1A2D";
// Toman el color de identidad de la tarjeta (--c, landing.css).
const AZUL = "var(--c)";
const TINTE = "var(--c-tinte)";
const ROJO = "#E5484D";
const VERDE = "#10B981";
const AMBAR = "#F5A524";
const LINEA = "#DCE3EC";

const i = (n: number) => ({ "--i": n }) as CSSProperties;

function Lienzo({
  children,
  caja = "0 0 320 210",
  clase = "",
}: {
  children: React.ReactNode;
  caja?: string;
  clase?: string;
}) {
  return (
    <svg viewBox={caja} className={`lp-ilu ${clase}`} aria-hidden fill="none">
      {children}
    </svg>
  );
}

function Networking() {
  const cordones = ["#60A5FA", VERDE, AMBAR, "#7C6CF6", ROJO, "#22D3EE"];
  const unidades = [
    { y: 66, nombre: "CORE-SW-48" },
    { y: 92, nombre: "ACCESS-SW-24" },
  ];
  return (
    <Lienzo caja="8 -14 262 252">
      <defs>
        <linearGradient id="lp-rack-frente" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1B2C47" />
          <stop offset="1" stopColor="#0B1524" />
        </linearGradient>
        <linearGradient id="lp-rack-lado" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0A1424" />
          <stop offset="1" stopColor="#1A2A44" />
        </linearGradient>
        <linearGradient id="lp-rack-tapa" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#24395A" />
          <stop offset="1" stopColor="#32496E" />
        </linearGradient>
        <radialGradient id="lp-rack-piso">
          <stop offset="0" stopColor="#0D1A2D" stopOpacity=".26" />
          <stop offset="1" stopColor="#0D1A2D" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="176" cy="229" rx="120" ry="10" fill="url(#lp-rack-piso)" />

      {/* Cables que suben del gabinete: la red sigue fuera de cuadro. */}
      {["#60A5FA", VERDE, "#7C6CF6"].map((c, k) => {
        const d = `M${150 + k * 30} 14 C${150 + k * 30} -4 ${120 + k * 44} 2 ${112 + k * 52} -14`;
        return (
          <g key={c}>
            <path d={d} stroke={c} strokeWidth="4" strokeLinecap="round" />
            <path d={d} stroke="#fff" strokeWidth="1.6" strokeLinecap="round" pathLength={1} className="lp-flujo" style={i(k)} />
          </g>
        );
      })}

      {/* Gabinete */}
      <path d="M92 22 L126 8 H262 L228 22 Z" fill="url(#lp-rack-tapa)" />
      <path d="M228 22 L262 8 V210 L228 226 Z" fill="url(#lp-rack-lado)" />
      {Array.from({ length: 9 }).map((_, k) => (
        <line key={k} x1="236" y1={44 + k * 17} x2="254" y2={36 + k * 17} stroke="#2B3F5F" strokeWidth="1.5" />
      ))}
      <rect x="92" y="22" width="136" height="204" rx="3" fill="url(#lp-rack-frente)" />
      <rect x="99" y="29" width="122" height="190" rx="2" fill="#070F1B" />
      {[0, 1].map((k) => (
        <g key={k}>
          {Array.from({ length: 19 }).map((_, f) => (
            <circle key={f} cx={103 + k * 114} cy={33 + f * 10} r=".9" fill="#3A506F" />
          ))}
        </g>
      ))}

      {/* Patch panel con cordones de colores */}
      <rect x="107" y="33" width="106" height="28" rx="2" fill="#16253C" stroke="#2B3F5F" />
      {Array.from({ length: 12 }).map((_, k) => (
        <g key={k}>
          <rect x={111 + k * 8.2} y="37" width="6" height="6" rx="1" fill="#0A1424" stroke="#3A506F" strokeWidth=".6" />
          <path
            d={`M${114 + k * 8.2} 41 C${114 + k * 8.2} 56 ${122 + k * 8.2} 56 ${122 + k * 8.2} 41`}
            stroke={cordones[k % cordones.length]}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>
      ))}

      {/* Switches */}
      {unidades.map((u, f) => (
        <g key={u.nombre}>
          <rect x="107" y={u.y} width="106" height="22" rx="2" fill="#13233A" stroke="var(--c)" strokeOpacity=".55" />
          <text x="112" y={u.y + 8.5} fontSize="5.4" fontWeight="600" fill="#C8D6E8" letterSpacing=".04em">{u.nombre}</text>
          {Array.from({ length: 16 }).map((_, k) => {
            const luz = (k * 3 + f) % 4 !== 0;
            return (
              <g key={k}>
                <rect x={112 + k * 6} y={u.y + 12} width="4.6" height="6" rx=".8" fill="#0A1424" />
                <circle
                  cx={114.3 + k * 6}
                  cy={u.y + 14}
                  r=".95"
                  fill={luz ? (k % 3 ? VERDE : "#60A5FA") : "#2B3F5F"}
                  className={luz ? "lp-led" : undefined}
                  style={i(k + f * 3)}
                />
              </g>
            );
          })}
          <circle cx="207" cy={u.y + 7} r="1.6" fill={VERDE} className="lp-led" style={i(f)} />
        </g>
      ))}

      {/* Servidores */}
      {[118, 140].map((y, f) => (
        <g key={y}>
          <rect x="107" y={y} width="106" height="18" rx="2" fill="#16253C" stroke="#2B3F5F" />
          {Array.from({ length: 22 }).map((_, k) => (
            <line key={k} x1={112 + k * 3} y1={y + 5} x2={112 + k * 3} y2={y + 13} stroke="#2B3F5F" strokeWidth="1.2" />
          ))}
          <rect x="182" y={y + 5} width="14" height="8" rx="1" fill="#0A1424" />
          <circle cx="202" cy={y + 9} r="1.6" fill="#60A5FA" className="lp-led" style={i(f + 4)} />
          <circle cx="207" cy={y + 9} r="1.6" fill={VERDE} className="lp-led" style={i(f + 7)} />
        </g>
      ))}

      {/* UPS */}
      <rect x="107" y="162" width="106" height="50" rx="2" fill="#13233A" stroke="#2B3F5F" />
      <rect x="114" y="170" width="46" height="20" rx="2" fill="#0A1E33" stroke="var(--c)" strokeOpacity=".6" />
      <text x="119" y="183" fontSize="8" fontWeight="600" fill="var(--c-medio)">UPS 100%</text>
      {[0, 1, 2, 3, 4].map((k) => (
        <rect key={k} x={168 + k * 8} y={172} width="6" height="16" rx="1" fill={k < 4 ? VERDE : "#2B3F5F"} className={k < 4 ? "lp-led" : undefined} style={i(k)} />
      ))}
      <rect x="114" y="196" width="92" height="9" rx="1.5" fill="#0A1424" />

      {/* Estado */}
      <g className="lp-aparece" style={i(4)}>
        <rect x="14" y="146" width="96" height="30" rx="10" fill="#fff" stroke={LINEA} />
        <circle cx="29" cy="161" r="4" fill={VERDE} className="lp-led" />
        <text x="39" y="158" fontSize="9.5" fontWeight="600" fill={TINTA}>99.9% uptime</text>
        <text x="39" y="169" fontSize="7.5" fill="#5B6A80">Red operativa</text>
      </g>
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

// Los logos son los oficiales de public/logos. La idea no es un listado sino un
// ecosistema: todo gira alrededor de Microsoft.
const ECOSISTEMA = [
  { nombre: "Power BI", logo: "/logos/new-power-bi-logo.png", x: 62, y: 52 },
  { nombre: "Azure", logo: "/logos/microsoft-azure-icon.png", x: 278, y: 52 },
  { nombre: "SharePoint", logo: "/logos/microsoft-office-sharepoint-2025-present.png", x: 40, y: 150 },
  { nombre: "Power Automate", logo: "/logos/microsoft-power-automate.png", x: 300, y: 150 },
  { nombre: "Dynamics 365", logo: "/landing/dynamics-365.png", x: 170, y: 196 },
];

function Consultoria() {
  const centro = { x: 170, y: 100 };
  const ventanas = ["#F25022", "#7FBA00", "#00A4EF", "#FFB900"];
  return (
    <Lienzo caja="0 0 340 240">
      <ellipse cx="170" cy="122" rx="146" ry="86" stroke="var(--c-medio)" strokeDasharray="3 6" strokeOpacity=".7" />
      <ellipse cx="170" cy="112" rx="88" ry="52" stroke="var(--c-medio)" strokeDasharray="3 6" strokeOpacity=".45" />
      {ECOSISTEMA.map((e, k) => {
        const d = `M${centro.x} ${centro.y} Q${(centro.x + e.x) / 2} ${(centro.y + e.y) / 2 + (k % 2 ? -14 : 14)} ${e.x} ${e.y}`;
        return (
          <g key={e.nombre}>
            <path d={d} stroke="var(--c-medio)" strokeWidth="1.4" />
            <path d={d} stroke="var(--c)" strokeWidth="2.6" strokeLinecap="round" pathLength={1} className="lp-flujo" style={i(k)} />
          </g>
        );
      })}

      <g className="lp-orbita" style={i(0)}>
        <rect x="128" y="58" width="84" height="84" rx="22" fill="#fff" stroke={LINEA} />
        {ventanas.map((c, k) => (
          <rect key={c} x={148 + (k % 2) * 23} y={78 + Math.floor(k / 2) * 23} width="21" height="21" fill={c} />
        ))}
      </g>

      {ECOSISTEMA.map((e, k) => (
        <g key={e.nombre} className="lp-orbita" style={i(k + 1)}>
          <rect x={e.x - 27} y={e.y - 27} width="54" height="54" rx="15" fill="#fff" stroke={LINEA} />
          <image href={e.logo} x={e.x - 16} y={e.y - 16} width="32" height="32" preserveAspectRatio="xMidYMid meet" />
          <text x={e.x} y={e.y + 39} fontSize="8.5" fontWeight="600" fill="#45546A" textAnchor="middle">{e.nombre}</text>
        </g>
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
  const rosa = "#F472B6";
  const celeste = "#60A5FA";
  const codigo: [number, number, number, string][][] = [
    [[0, 0, 22, rosa], [26, 0, 34, celeste]],
    [[10, 11, 30, VERDE], [44, 11, 22, "#3A506F"]],
    [[10, 22, 18, AMBAR], [32, 22, 40, "var(--c-medio)"]],
    [[20, 33, 44, celeste], [68, 33, 16, rosa]],
    [[20, 44, 30, VERDE]],
    [[10, 55, 26, "#3A506F"], [40, 55, 28, AMBAR]],
    [[0, 66, 14, rosa]],
    [[0, 88, 22, rosa], [26, 88, 30, "var(--c-medio)"]],
    [[10, 99, 38, celeste], [52, 99, 20, VERDE]],
  ];
  return (
    <Lienzo caja="0 0 340 240" clase="lp-ilu-giro">
      <defs>
        <linearGradient id="lp-base" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#EEF1F5" />
          <stop offset="1" stopColor="#BFC8D4" />
        </linearGradient>
        <radialGradient id="lp-base-piso">
          <stop offset="0" stopColor="#0D1A2D" stopOpacity=".22" />
          <stop offset="1" stopColor="#0D1A2D" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="170" cy="226" rx="160" ry="9" fill="url(#lp-base-piso)" />

      {/* Tapa y pantalla */}
      <rect x="32" y="8" width="276" height="188" rx="12" fill="#0B1322" stroke="#2B3F5F" />
      <rect x="40" y="16" width="260" height="170" rx="5" fill="#0D1A2D" />

      {/* Barra de título */}
      <rect x="40" y="16" width="260" height="16" rx="5" fill="#101F36" />
      {[ROJO, AMBAR, VERDE].map((c, k) => (
        <circle key={c} cx={50 + k * 9} cy="24" r="2.6" fill={c} />
      ))}
      <rect x="86" y="19" width="48" height="11" rx="3" fill="#0D1A2D" />
      <text x="92" y="27.5" fontSize="6.5" fill="#C8D6E8">app.tsx</text>

      {/* Explorador */}
      <rect x="40" y="32" width="44" height="154" fill="#0A1424" />
      {[0, 1, 2, 3, 4, 5, 6].map((k) => (
        <rect key={k} x={k % 3 ? 52 : 46} y={42 + k * 11} width={k % 3 ? 24 : 30} height="4" rx="2" fill={k === 2 ? "var(--c)" : "#2B3F5F"} />
      ))}

      {/* Editor */}
      {codigo.map((linea, k) => (
        <g key={k}>
          <text x="89" y={46 + linea[0][1] + 3} fontSize="6" fill="#4A5F7E">{k + 1}</text>
          {linea.map(([x, y, w, c], j) => (
            <rect key={j} x={100 + x} y={42 + y} width={w} height="5" rx="2.5" fill={c} className="lp-linea-codigo" style={i(k)} />
          ))}
        </g>
      ))}
      <rect x="84" y="115" width="124" height="15" fill="var(--c)" fillOpacity=".16" />
      <rect x="100" y="120" width="46" height="5" rx="2.5" fill="var(--c-medio)" />
      <rect x="149" y="117" width="1.6" height="11" fill="#fff" className="lp-cursor" />
      <text x="202" y="125.5" fontSize="6" fontWeight="600" fill="var(--c-medio)" textAnchor="end">IA sugiere</text>

      {/* Terminal */}
      <rect x="84" y="158" width="124" height="28" fill="#0A1424" />
      <path d="M90 168l3 2.5-3 2.5" stroke={VERDE} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <text x="98" y="173" fontSize="6.5" fill={VERDE}>Build OK · 1.2s</text>

      {/* Panel de IA */}
      <rect x="208" y="32" width="92" height="154" fill="#101F36" />
      <rect x="216" y="40" width="16" height="16" rx="5" fill="var(--c)" />
      <path d="M224 44l1.3 3.1 3.1 1.3-3.1 1.3-1.3 3.1-1.3-3.1-3.1-1.3 3.1-1.3z" fill="#fff" />
      <text x="237" y="46" fontSize="7" fontWeight="600" fill="#fff">Copiloto</text>
      <text x="237" y="54" fontSize="5.5" fill="#8EA3BF">Modelo activo</text>
      <g className="lp-aparece" style={i(1)}>
        <rect x="216" y="64" width="76" height="26" rx="6" fill="#0D1A2D" />
        <rect x="222" y="70" width="58" height="4" rx="2" fill="#3A506F" />
        <rect x="222" y="79" width="42" height="4" rx="2" fill="#3A506F" />
      </g>
      <g className="lp-aparece" style={i(3)}>
        <rect x="216" y="96" width="76" height="52" rx="6" fill="var(--c)" fillOpacity=".2" />
        {[20, 32, 26, 42].map((h, k) => (
          <rect key={k} x={224 + k * 14} y={142 - h} width="9" height={h} rx="2" fill={k === 3 ? "var(--c)" : "var(--c-medio)"} className="lp-barra" style={i(k)} />
        ))}
      </g>
      <rect x="216" y="156" width="76" height="20" rx="6" fill="#0D1A2D" stroke="#2B3F5F" />
      <text x="222" y="169" fontSize="6.5" fill="#8EA3BF">Preguntá algo…</text>

      {/* Base */}
      <path d="M32 196 H308 L334 214 Q336 222 326 222 H14 Q4 222 6 214 Z" fill="url(#lp-base)" />
      <path d="M140 196 H200 Q198 203 190 203 H150 Q142 203 140 196 Z" fill="#AEB8C5" />
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
