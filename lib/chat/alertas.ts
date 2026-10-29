import { after, type NextRequest } from "next/server";

import { bloqueDeRed, ipParaLimite } from "@/lib/contact/clientIp";
import { consume } from "@/lib/contact/rateLimit";
import { firmaValida, firmar } from "./guardia";

/**
 * Avisos al equipo cuando pasa algo raro en el asistente o en la telemetría:
 * un bot, una firma falsificada, una IP que llega al tope, el presupuesto que
 * se consume. Las defensas ya frenaron el pedido; esto es para enterarse en
 * el momento y, si se repite, bloquear la IP en el Firewall de Vercel.
 *
 * Nunca se avisa de lo que hace el propio equipo: los navegadores del equipo
 * llevan una cookie firmada (ver `/api/equipo`). Tampoco desde `next dev` ni
 * desde los previews: sólo producción.
 *
 * Para no inundar la casilla —que es justo lo que querría un atacante—, cada
 * alerta sale una vez por día por tipo y sujeto (la IP, el presupuesto…) y no
 * más de ALERTAS_POR_DIA en total; al pasarse sale un único aviso de que se
 * cortaron.
 *
 * Sólo servidor.
 */

const ALERTAS_POR_DIA = 15;
const DIA = 24 * 60 * 60;

export type TipoAlerta =
  | "bot"
  | "botid-falla"
  | "firma-falsa"
  | "cuerpo-grande"
  | "honeypot"
  | "limite-ip"
  | "presupuesto-ip"
  | "presupuesto-mitad"
  | "presupuesto-agotado"
  | "techo-global";

const TITULOS: Record<TipoAlerta, string> = {
  bot: "BotID bloqueó un bot",
  "botid-falla": "BotID no está funcionando",
  "firma-falsa": "Alguien falsificó datos firmados",
  "cuerpo-grande": "Pedido gigante rechazado",
  honeypot: "Un bot completó el formulario de contacto",
  "limite-ip": "Una IP llegó a su tope",
  "presupuesto-ip": "Una IP agotó su presupuesto de tokens",
  "presupuesto-mitad": "Se usó la mitad del presupuesto diario del asistente",
  "presupuesto-agotado": "Se agotó el presupuesto diario del asistente",
  "techo-global": "Se alcanzó un techo global",
};

const QUE_HACER: Record<TipoAlerta, string> = {
  bot: "Nada, ya se bloqueó. Si llegan muchas de la misma red, bloqueala en Vercel → Firewall.",
  "botid-falla": "Revisar en Vercel que el proyecto tenga OIDC activo (Settings → Security). Mientras tanto BotID deja pasar todo; los cupos siguen frenando.",
  "firma-falsa": "No es un error de un usuario: alguien modificó a mano lo que manda el navegador. Ya se rechazó. Si se repite, bloqueá la IP en Vercel → Firewall.",
  "cuerpo-grande": "Ya se rechazó. Un navegador nunca manda algo así: si se repite, bloqueá la IP en Vercel → Firewall.",
  honeypot: "Ya se descartó sin guardar nada.",
  "limite-ip": "Ya se frenó. Puede ser alguien muy insistente o un script; si se repite, bloqueá la IP en Vercel → Firewall.",
  "presupuesto-ip": "Ya se frenó: esa IP no puede gastar más hoy. Una persona real no llega a esto.",
  "presupuesto-mitad": "Mirar en los logs de Vercel ([chat] uso) si es tráfico real (campañas) o un ataque. Si es un ataque, activar Attack Challenge Mode en Vercel → Firewall.",
  "presupuesto-agotado": "El asistente quedó derivando a WhatsApp hasta mañana. Si es un ataque, activar Attack Challenge Mode en Vercel → Firewall; si es tráfico real, subir PRESUPUESTO_GLOBAL.",
  "techo-global": "Ese endpoint quedó cerrado para todos hasta que venza la ventana. Si es un ataque, activar Attack Challenge Mode en Vercel → Firewall.",
};

/* ── El equipo ────────────────────────────────────────────────────────────── */

export const COOKIE_EQUIPO = "accedra_equipo";

/**
 * La clave del enlace que marca un navegador como del equipo (ver
 * `/api/equipo`). La elige el equipo en `EQUIPO_CLAVE`; sin ella, o si es
 * corta, el enlace no existe.
 */
export const claveDeEquipo = () => {
  const clave = process.env.EQUIPO_CLAVE?.trim();
  return clave && clave.length >= 16 ? clave : null;
};

/** Valor de la cookie: hasta cuándo vale y su firma. */
export function cookieDeEquipo(vence: number): string | null {
  const f = firmar("equipo", String(vence));
  return f ? `${vence}.${f}` : null;
}

export function esDelEquipo(req: NextRequest): boolean {
  const [vence, firma] = (req.cookies.get(COOKIE_EQUIPO)?.value ?? "").split(".");
  return Number(vence) > Date.now() && firmaValida("equipo", vence, firma);
}

/* ── El aviso ─────────────────────────────────────────────────────────────── */

const activas = () => process.env.VERCEL_ENV === "production" || process.env.ALERTAS_SIEMPRE === "1";

/**
 * Agenda el aviso para después de responder: el pedido no espera al mail.
 * `sujeto` es lo que se deduplica (por defecto la IP).
 */
export function alertar(req: NextRequest, tipo: TipoAlerta, detalle: string, sujeto?: string): void {
  if (!activas() || esDelEquipo(req)) return;
  const ip = ipParaLimite(req);
  const datos = {
    tipo,
    detalle,
    sujeto: sujeto ?? ip,
    ip,
    red: bloqueDeRed(req),
    pais: [req.headers.get("x-vercel-ip-city"), req.headers.get("x-vercel-ip-country")]
      .filter(Boolean)
      .map((v) => decodeURIComponent(v as string))
      .join(", "),
    navegador: (req.headers.get("user-agent") ?? "(sin user agent)").slice(0, 300),
    ruta: req.nextUrl.pathname,
  };
  try {
    after(() => enviar(datos).catch((e) => console.error("[alerta] no salió:", (e as Error).message)));
  } catch {
    // Fuera de un pedido (no debería pasar): se manda igual, sin esperar.
    void enviar(datos).catch(() => {});
  }
}

type Datos = {
  tipo: TipoAlerta;
  detalle: string;
  sujeto: string;
  ip: string;
  red: string;
  pais: string;
  navegador: string;
  ruta: string;
};

async function enviar(d: Datos): Promise<void> {
  console.warn("[alerta]", d.tipo, d.ruta, d.detalle);
  const to = process.env.CONTACT_TO;
  const from = process.env.CONTACT_FROM;
  const apiKey = process.env.RESEND_API_KEY;
  if (!to || !from || !apiKey) return;

  if (!(await consume("alerta", `${d.tipo}:${d.sujeto}`, [{ suffix: "day", limit: 1, windowSec: DIA }])).allowed) return;
  const cupo = await consume("alerta-global", "todos", [{ suffix: "day", limit: ALERTAS_POR_DIA, windowSec: DIA }]);
  let asunto = `[Accedra · alerta] ${TITULOS[d.tipo]}`;
  let cuerpo = textoDe(d);
  if (!cupo.allowed) {
    // Una sola vez: el aviso de que se cortaron los avisos.
    if (!(await consume("alerta-tope", "todos", [{ suffix: "day", limit: 1, windowSec: DIA }])).allowed) return;
    asunto = "[Accedra · alerta] Demasiadas alertas hoy: se pausan hasta mañana";
    cuerpo = `Hoy hubo más de ${ALERTAS_POR_DIA} alertas distintas y se dejaron de mandar para no llenar la casilla. Puede ser un ataque en curso: revisá los logs de Vercel (buscar "[alerta]") y, si hace falta, activá Attack Challenge Mode en Vercel → Firewall.\n\nLa última:\n\n${cuerpo}`;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject: asunto, text: cuerpo }),
  });
  if (!res.ok) console.error("[alerta] Resend respondió", res.status);
}

function textoDe(d: Datos): string {
  const hora = new Date().toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" });
  return [
    TITULOS[d.tipo],
    "",
    d.detalle,
    "",
    `Cuándo: ${hora}`,
    `Dónde: ${d.ruta}`,
    `IP: ${d.ip}${d.red !== d.ip ? ` (red ${d.red})` : ""}`,
    ...(d.pais ? [`Desde: ${d.pais}`] : []),
    `Navegador: ${d.navegador}`,
    "",
    `Qué hacer: ${QUE_HACER[d.tipo]}`,
    "",
    "Este aviso sale una vez por día por tipo y por IP. Los navegadores del equipo no generan avisos.",
  ].join("\n");
}
