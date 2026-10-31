import type { CSSProperties } from "react";

/* Las ilustraciones de cada solución, redibujadas para fondo claro: mismos
 * objetos que las de `public/ilustraciones`, en SVG para poder animarlos.
 * Quietas en reposo; se mueven al entrar y al pasar el mouse (landing.css). */

const TINTA = "#0D1A2D";
// Toman el color de identidad de la tarjeta (--c, landing.css).
const AZUL = "var(--c)";
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

/* El metal: un solo juego de degradés para todos los objetos. Se monta una vez
 * por página (Soluciones) y cada SVG lo referencia por id. */
export function Metal() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden>
      <defs>
        <linearGradient id="lp-m-frente" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F3F5F8" />
          <stop offset=".38" stopColor="#D0D6DE" />
          <stop offset=".58" stopColor="#E6EAEF" />
          <stop offset="1" stopColor="#AEB7C4" />
        </linearGradient>
        <linearGradient id="lp-m-lado" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8E99A8" />
          <stop offset="1" stopColor="#BAC2CD" />
        </linearGradient>
        <linearGradient id="lp-m-tapa" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#D5DBE3" />
          <stop offset="1" stopColor="#F4F6F8" />
        </linearGradient>
        <linearGradient id="lp-m-panel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FAFBFC" />
          <stop offset="1" stopColor="#D9DFE6" />
        </linearGradient>
        <linearGradient id="lp-m-hueco" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#AAB3C0" />
          <stop offset="1" stopColor="#C4CBD5" />
        </linearGradient>
        <radialGradient id="lp-m-piso">
          <stop offset="0" stopColor="#0D1A2D" stopOpacity=".5" />
          <stop offset="1" stopColor="#0D1A2D" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

function Networking() {
  const cordones = ["#60A5FA", VERDE, "#7C6CF6", "#60A5FA", VERDE, "#22D3EE"];
  const unidades = [
    { y: 66, nombre: "CORE-SW-48" },
    { y: 92, nombre: "ACCESS-SW-24" },
  ];
  return (
    <Lienzo caja="8 -14 262 252">
      <ellipse cx="172" cy="228" rx="104" ry="9" fill="url(#lp-m-piso)" />

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
      <path d="M92 22 L126 8 H262 L228 22 Z" fill="url(#lp-m-tapa)" stroke="#8E99A8" strokeWidth=".9" />
      <path d="M228 22 L262 8 V210 L228 226 Z" fill="url(#lp-m-lado)" />
      {Array.from({ length: 9 }).map((_, k) => (
        <line key={k} x1="236" y1={44 + k * 17} x2="254" y2={36 + k * 17} stroke="#8E99A8" strokeOpacity=".7" strokeWidth="1.5" />
      ))}
      <rect x="92" y="22" width="136" height="204" rx="3" fill="url(#lp-m-frente)" stroke="#8E99A8" strokeWidth=".9" />
      <rect x="99" y="29" width="122" height="190" rx="2" fill="url(#lp-m-hueco)" />
      {[0, 1].map((k) => (
        <g key={k}>
          {Array.from({ length: 19 }).map((_, f) => (
            <circle key={f} cx={103 + k * 114} cy={33 + f * 10} r=".9" fill="#7D8999" />
          ))}
        </g>
      ))}

      {/* Patch panel con cordones de colores */}
      <rect x="107" y="33" width="106" height="28" rx="2" fill="url(#lp-m-panel)" stroke="#fff" strokeWidth=".7" />
      {Array.from({ length: 12 }).map((_, k) => (
        <g key={k}>
          <rect x={111 + k * 8.2} y="37" width="6" height="6" rx="1" fill="#2A3647" />
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
          <rect x="107" y={u.y} width="106" height="22" rx="2" fill="url(#lp-m-panel)" stroke="#fff" strokeWidth=".7" />
          <text x="112" y={u.y + 8.5} fontSize="5.4" fontWeight="600" fill="#45546A" letterSpacing=".04em">{u.nombre}</text>
          {Array.from({ length: 16 }).map((_, k) => {
            const luz = (k * 3 + f) % 4 !== 0;
            return (
              <g key={k}>
                <rect x={112 + k * 6} y={u.y + 12} width="4.6" height="6" rx=".8" fill="#2A3647" />
                <circle
                  cx={114.3 + k * 6}
                  cy={u.y + 14}
                  r=".95"
                  fill={luz ? (k % 3 ? "#34D399" : "#60A5FA") : "#55637A"}
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
          <rect x="107" y={y} width="106" height="18" rx="2" fill="url(#lp-m-panel)" stroke="#fff" strokeWidth=".7" />
          {Array.from({ length: 22 }).map((_, k) => (
            <line key={k} x1={112 + k * 3} y1={y + 5} x2={112 + k * 3} y2={y + 13} stroke="#9AA5B4" strokeWidth="1.2" />
          ))}
          <rect x="182" y={y + 5} width="14" height="8" rx="1" fill="#2A3647" />
          <circle cx="202" cy={y + 9} r="1.6" fill="#3B82F6" className="lp-led" style={i(f + 4)} />
          <circle cx="207" cy={y + 9} r="1.6" fill={VERDE} className="lp-led" style={i(f + 7)} />
        </g>
      ))}

      {/* UPS */}
      <rect x="107" y="162" width="106" height="50" rx="2" fill="url(#lp-m-panel)" stroke="#fff" strokeWidth=".7" />
      <rect x="114" y="170" width="46" height="20" rx="2" fill="#2A3647" />
      <text x="119" y="183" fontSize="8" fontWeight="600" fill="#8DBBF5">UPS 100%</text>
      {[0, 1, 2, 3, 4].map((k) => (
        <rect key={k} x={168 + k * 8} y={172} width="6" height="16" rx="1" fill={k < 4 ? VERDE : "#AAB3C0"} className={k < 4 ? "lp-led" : undefined} style={i(k)} />
      ))}
      <rect x="114" y="196" width="92" height="9" rx="1.5" fill="#AAB3C0" />

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
    <Lienzo caja="0 0 320 240" clase="lp-ilu-giro">
      <ellipse cx="192" cy="231" rx="84" ry="7" fill="url(#lp-m-piso)" />

      {/* Tableta */}
      <rect x="126" y="4" width="134" height="222" rx="15" fill="url(#lp-m-frente)" stroke="#8E99A8" strokeWidth=".9" />
      <rect x="126.5" y="4.5" width="133" height="221" rx="14.5" stroke="#8E99A8" strokeWidth="1" />
      <rect x="135" y="15" width="116" height="200" rx="5" fill="#fff" stroke="#AEB7C4" strokeWidth=".8" />
      <circle cx="193" cy="9.5" r="1.5" fill="#8E99A8" />

      {/* Documento */}
      <text x="145" y="33" fontSize="8.5" fontWeight="700" fill={TINTA}>Solicitud de crédito</text>
      <line x1="145" y1="40" x2="241" y2="40" stroke={LINEA} />
      {[50, 60, 70, 88, 98, 108].map((y, k) => (
        <rect key={y} x="145" y={y} width={[96, 88, 64, 96, 80, 90][k]} height="4" rx="2" fill="#E6EBF2" className="lp-linea-codigo" style={i(k)} />
      ))}
      <rect x="145" y="124" width="96" height="58" rx="5" fill="#F5F7FA" stroke={LINEA} />
      <text x="152" y="136" fontSize="6.5" fontWeight="600" fill="#5B6A80">Firma del titular</text>
      <path
        d="M154 164 C162 142 168 174 178 152 S194 144 202 162 S218 146 232 156"
        stroke={AZUL}
        strokeWidth="2.6"
        strokeLinecap="round"
        pathLength={1}
        className="lp-dibuja"
      />
      <rect x="145" y="192" width="96" height="14" rx="4" fill={AZUL} />
      <text x="193" y="201.5" fontSize="7" fontWeight="600" fill="#fff" textAnchor="middle">Confirmar firma</text>

      {/* Lápiz */}
      <g className="lp-lapiz">
        <g transform="rotate(30 232 156)">
          <path d="M232 156 L226 140 L238 140 Z" fill="#8E99A8" />
          <rect x="226" y="18" width="12" height="122" rx="5" fill="url(#lp-m-lado)" stroke="#fff" strokeWidth=".6" />
          <rect x="226" y="66" width="12" height="8" fill={AZUL} />
        </g>
      </g>

      {/* Estado */}
      <g className="lp-aparece" style={i(5)}>
        <rect x="6" y="150" width="108" height="30" rx="10" fill="#fff" stroke={LINEA} />
        <path d="M19 165l3.2 3.2 5.6-6.6" stroke={VERDE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <text x="33" y="162" fontSize="9.5" fontWeight="600" fill={TINTA}>Firma válida</text>
        <text x="33" y="173" fontSize="7" fill="#5B6A80">Presión y trazo</text>
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
        <rect x="128" y="58" width="84" height="84" rx="22" fill="url(#lp-m-frente)" stroke="#8E99A8" strokeWidth=".9" />
        {["#F25022", "#7FBA00", "#00A4EF", "#FFB900"].map((c, k) => (
          <rect key={c} x={148 + (k % 2) * 23} y={78 + Math.floor(k / 2) * 23} width="21" height="21" fill={c} />
        ))}
      </g>

      {ECOSISTEMA.map((e, k) => (
        <g key={e.nombre} className="lp-orbita" style={i(k + 1)}>
          <rect x={e.x - 27} y={e.y - 27} width="54" height="54" rx="15" fill="url(#lp-m-frente)" stroke="#8E99A8" strokeWidth=".9" />
          <image href={e.logo} x={e.x - 16} y={e.y - 16} width="32" height="32" preserveAspectRatio="xMidYMid meet" />
          <text x={e.x} y={e.y + 39} fontSize="8.5" fontWeight="600" fill="#45546A" textAnchor="middle">{e.nombre}</text>
        </g>
      ))}
    </Lienzo>
  );
}

// Lo que se vende es visibilidad y protección por capas: la consola es el
// producto, y el firewall al lado es el equipo que la sostiene.
const CAPAS = ["Red", "Endpoints", "Email", "Nube", "Acceso remoto"];

function Seguridad() {
  return (
    <Lienzo caja="0 0 340 240">
      <ellipse cx="172" cy="229" rx="150" ry="9" fill="url(#lp-m-piso)" />

      {/* Pie del monitor */}
      <path d="M150 166 H190 L196 208 H144 Z" fill="url(#lp-m-lado)" />
      <path d="M108 208 H232 Q238 208 238 214 V216 H102 V214 Q102 208 108 208 Z" fill="url(#lp-m-frente)" stroke="#8E99A8" strokeWidth=".9" />

      {/* Monitor */}
      <rect x="30" y="4" width="280" height="166" rx="10" fill="url(#lp-m-frente)" stroke="#8E99A8" strokeWidth=".9" />
      <rect x="38" y="12" width="264" height="150" rx="4" fill="#FDFDFE" stroke="#AEB7C4" strokeWidth=".8" />

      {/* Barra de la consola */}
      <rect x="38" y="12" width="264" height="17" rx="4" fill="#EFF2F6" />
      <text x="47" y="23.5" fontSize="7.5" fontWeight="700" fill={TINTA}>Consola de seguridad</text>
      <circle cx="268" cy="20.5" r="2.4" fill={VERDE} className="lp-led" />
      <text x="274" y="23.5" fontSize="6.5" fontWeight="600" fill="#047857">En vivo</text>

      {/* Estado general */}
      <circle cx="84" cy="70" r="27" stroke={LINEA} strokeWidth="6" />
      <circle
        cx="84"
        cy="70"
        r="27"
        stroke={VERDE}
        strokeWidth="6"
        strokeLinecap="round"
        pathLength={1}
        className="lp-dibuja"
        transform="rotate(-90 84 70)"
      />
      <path d="M84 56 l11 4 v8 c0 8 -5 12 -11 15 c-6 -3 -11 -7 -11 -15 v-8 z" fill={AZUL} />
      <path d="M78.5 69 l4 4 l7 -8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <text x="84" y="114" fontSize="8.5" fontWeight="700" fill={TINTA} textAnchor="middle">Protegido</text>
      <text x="84" y="125" fontSize="6.5" fill="#5B6A80" textAnchor="middle">12 amenazas</text>
      <text x="84" y="134" fontSize="6.5" fill="#5B6A80" textAnchor="middle">bloqueadas hoy</text>

      {/* Capas */}
      {CAPAS.map((capa, k) => (
        <g key={capa} className="lp-aparece" style={i(k)}>
          <rect x="126" y={36 + k * 24} width="86" height="20" rx="5" fill="#F5F7FA" />
          <text x="133" y={49 + k * 24} fontSize="7.5" fontWeight="500" fill="#45546A">{capa}</text>
          <circle cx="201" cy={46 + k * 24} r="5" fill="var(--c)" fillOpacity=".16" />
          <path d={`M198.6 ${46 + k * 24}l1.8 1.8 3-3.4`} stroke="#047857" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}

      {/* Tráfico */}
      <rect x="220" y="36" width="74" height="116" rx="6" fill="#F5F7FA" />
      <text x="227" y="49" fontSize="7" fontWeight="600" fill="#45546A">Tráfico</text>
      <path d="M227 112 L238 100 L248 106 L259 86 L269 94 L287 68" stroke="var(--c)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" pathLength={1} className="lp-dibuja" />
      <path d="M227 128 H287" stroke={LINEA} />
      <circle cx="259" cy="86" r="3" fill={ROJO} className="lp-aparece" style={i(4)} />
      <text x="227" y="143" fontSize="6.5" fill="#5B6A80">Tráfico verificado</text>

      {/* Firewall */}
      <g>
        <path d="M216 186 L228 176 H330 L318 186 Z" fill="url(#lp-m-tapa)" stroke="#8E99A8" strokeWidth=".9" />
        <path d="M318 186 L330 176 V206 L318 218 Z" fill="url(#lp-m-lado)" />
        <rect x="216" y="186" width="102" height="32" rx="2" fill="url(#lp-m-frente)" stroke="#8E99A8" strokeWidth=".9" />
        <text x="223" y="197" fontSize="6.5" fontWeight="700" fill={TINTA} letterSpacing=".04em">NGFW-01</text>
        {Array.from({ length: 7 }).map((_, k) => (
          <g key={k}>
            <rect x={223 + k * 12.5} y="202" width="9.5" height="9" rx="1.4" fill="#2A3647" />
            <circle cx={227.75 + k * 12.5} cy="206.5" r="1.3" fill={k % 3 === 2 ? "#55637A" : "#34D399"} className={k % 3 === 2 ? undefined : "lp-led"} style={i(k)} />
          </g>
        ))}
      </g>

      {/* Estado */}
      <g className="lp-aparece" style={i(5)}>
        <rect x="6" y="180" width="96" height="30" rx="10" fill="#fff" stroke={LINEA} />
        <circle cx="21" cy="195" r="4" fill={VERDE} className="lp-led" />
        <text x="31" y="192" fontSize="9.5" fontWeight="600" fill={TINTA}>Zero Trust</text>
        <text x="31" y="203" fontSize="7.5" fill="#5B6A80">Acceso seguro</text>
      </g>
    </Lienzo>
  );
}

function SoftwareAI() {
  const rosa = "#EC6FAE";
  const celeste = "#5B9BF2";
  const gris = "#D5DBE3";
  const codigo: [number, number, number, string][][] = [
    [[0, 0, 22, rosa], [26, 0, 34, celeste]],
    [[10, 11, 30, VERDE], [44, 11, 22, gris]],
    [[10, 22, 18, AMBAR], [32, 22, 40, "var(--c-medio)"]],
    [[20, 33, 44, celeste], [68, 33, 16, rosa]],
    [[20, 44, 30, VERDE]],
    [[10, 55, 26, gris], [40, 55, 28, AMBAR]],
    [[0, 66, 14, rosa]],
    [[0, 88, 22, rosa], [26, 88, 30, "var(--c-medio)"]],
    [[10, 99, 38, celeste], [52, 99, 20, VERDE]],
  ];
  return (
    <Lienzo caja="0 0 340 240" clase="lp-ilu-giro">
      <defs>
        <linearGradient id="lp-base" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F3F5F8" />
          <stop offset=".55" stopColor="#D0D6DE" />
          <stop offset="1" stopColor="#9AA5B4" />
        </linearGradient>
      </defs>
      <ellipse cx="170" cy="227" rx="164" ry="9" fill="url(#lp-m-piso)" />

      {/* Tapa y pantalla */}
      <rect x="32" y="8" width="276" height="188" rx="12" fill="url(#lp-m-frente)" stroke="#8E99A8" strokeWidth=".9" />
      <rect x="32.5" y="8.5" width="275" height="187" rx="11.5" stroke="#AEB7C4" strokeWidth=".6" />
      <rect x="40" y="16" width="260" height="170" rx="5" fill="#FDFDFE" stroke="#D5DBE3" strokeWidth=".6" />

      {/* Barra de título */}
      <rect x="40" y="16" width="260" height="16" rx="5" fill="#EFF2F6" />
      {[ROJO, AMBAR, VERDE].map((c, k) => (
        <circle key={c} cx={50 + k * 9} cy="24" r="2.6" fill={c} />
      ))}
      <rect x="86" y="19" width="48" height="11" rx="3" fill="#fff" />
      <text x="92" y="27.5" fontSize="6.5" fill="#45546A">app.tsx</text>

      {/* Explorador */}
      <rect x="40" y="32" width="44" height="154" fill="#F5F7FA" />
      {[0, 1, 2, 3, 4, 5, 6].map((k) => (
        <rect key={k} x={k % 3 ? 52 : 46} y={42 + k * 11} width={k % 3 ? 24 : 30} height="4" rx="2" fill={k === 2 ? "var(--c)" : gris} />
      ))}

      {/* Editor */}
      {codigo.map((linea, k) => (
        <g key={k}>
          <text x="89" y={46 + linea[0][1] + 3} fontSize="6" fill="#AEB9C8">{k + 1}</text>
          {linea.map(([x, y, w, c], j) => (
            <rect key={j} x={100 + x} y={42 + y} width={w} height="5" rx="2.5" fill={c} className="lp-linea-codigo" style={i(k)} />
          ))}
        </g>
      ))}
      <rect x="84" y="115" width="124" height="15" fill="var(--c)" fillOpacity=".12" />
      <rect x="100" y="120" width="46" height="5" rx="2.5" fill="var(--c)" />
      <rect x="149" y="117" width="1.6" height="11" fill={TINTA} className="lp-cursor" />
      <text x="202" y="125.5" fontSize="6" fontWeight="600" fill="var(--c-texto)" textAnchor="end">IA sugiere</text>

      {/* Terminal */}
      <rect x="84" y="158" width="124" height="28" fill="#F5F7FA" />
      <path d="M90 168l3 2.5-3 2.5" stroke="#047857" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <text x="98" y="173" fontSize="6.5" fill="#047857">Build OK · 1.2s</text>

      {/* Panel de IA */}
      <rect x="208" y="32" width="92" height="154" fill="#F1F4F8" />
      <rect x="216" y="40" width="16" height="16" rx="5" fill="var(--c)" />
      <path d="M224 44l1.3 3.1 3.1 1.3-3.1 1.3-1.3 3.1-1.3-3.1-3.1-1.3 3.1-1.3z" fill="#fff" />
      <text x="237" y="46" fontSize="7" fontWeight="600" fill={TINTA}>Copiloto</text>
      <text x="237" y="54" fontSize="5.5" fill="#5B6A80">Modelo activo</text>
      <g className="lp-aparece" style={i(1)}>
        <rect x="216" y="64" width="76" height="26" rx="6" fill="#fff" />
        <rect x="222" y="70" width="58" height="4" rx="2" fill={gris} />
        <rect x="222" y="79" width="42" height="4" rx="2" fill={gris} />
      </g>
      <g className="lp-aparece" style={i(3)}>
        <rect x="216" y="96" width="76" height="52" rx="6" fill="var(--c)" fillOpacity=".12" />
        {[20, 32, 26, 42].map((h, k) => (
          <rect key={k} x={224 + k * 14} y={142 - h} width="9" height={h} rx="2" fill={k === 3 ? "var(--c)" : "var(--c-medio)"} className="lp-barra" style={i(k)} />
        ))}
      </g>
      <rect x="216" y="156" width="76" height="20" rx="6" fill="#fff" stroke={gris} />
      <text x="222" y="169" fontSize="6.5" fill="#5B6A80">Preguntá algo…</text>


      {/* Base */}
      <path d="M32 196 H308 L334 214 Q336 222 326 222 H14 Q4 222 6 214 Z" fill="url(#lp-base)" stroke="#8E99A8" strokeWidth=".9" />
      <path d="M140 196 H200 Q198 203 190 203 H150 Q142 203 140 196 Z" fill="#B4BDC9" />
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
