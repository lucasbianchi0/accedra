import { SOLUTIONS } from "@/components/solutions/solutionsData";
import { nivelDe, type Relevamiento } from "./tipos";

/**
 * El mail que le llega al equipo comercial cuando alguien deja sus datos en
 * el asistente.
 *
 * Pensado para leerse en diez segundos y llamar: quién es y cómo contactarlo
 * arriba (con el WhatsApp a un toque), después el caso resumido y lo que
 * identificó el asistente, y al final la conversación entera. El relevamiento
 * va adjunto en PDF, el mismo que se llevó la persona.
 *
 * Todo lo que viene del formulario o del modelo se escapa antes de entrar al
 * HTML: es texto de un desconocido que se abre en el cliente de correo del
 * equipo.
 */

export type LeadAsistente = {
  nombre: string;
  empresa: string;
  telefono: string;
  email: string;
  /** El caso en 2-3 oraciones, como lo resumió el asistente. */
  resumen: string;
  solucion: string | null;
  conversacion: string;
  relevamiento: Relevamiento | null;
  /** Página donde arrancó y de dónde vino (utm/referrer), si se sabe. */
  origen: string;
};

const esc = (v: string) =>
  v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const conSaltos = (v: string) => esc(v).replace(/\r?\n/g, "<br>");

const soloDigitos = (t: string) => t.replace(/\D/g, "");

/** "11 5555-1234" → "5491155551234" para wa.me. Si ya trae país, se respeta. */
function whatsapp(tel: string): string {
  const d = soloDigitos(tel);
  if (d.startsWith("54")) return d;
  return `549${d.replace(/^0/, "").replace(/^15/, "")}`;
}

/** Lo que el asistente no llegó a saber: lo primero que tiene que preguntar el comercial. */
const faltantes = (r: Relevamiento | null) => (r?.datosCotizacion ?? []).filter((d) => !d.valor).map((d) => d.dato);

export function asuntoEquipo(l: LeadAsistente): string {
  const sol = l.solucion && SOLUTIONS[l.solucion] ? ` · ${SOLUTIONS[l.solucion].name}` : "";
  const nivel = l.relevamiento?.puntaje != null ? ` · Relevamiento ${nivelDe(l.relevamiento.puntaje).toLowerCase()}` : "";
  return `Lead del asistente — ${l.empresa || l.nombre}${sol}${nivel}`;
}

export function textoEquipo(l: LeadAsistente): string {
  const r = l.relevamiento;
  return [
    `Nuevo lead del asistente Accedra AI`,
    ``,
    `Nombre:    ${l.nombre}`,
    `Empresa:   ${l.empresa || "—"}`,
    `Teléfono:  ${l.telefono}  (WhatsApp: https://wa.me/${whatsapp(l.telefono)})`,
    `Email:     ${l.email || "— (no dejó)"}`,
    l.solucion && SOLUTIONS[l.solucion] ? `Solución:  ${SOLUTIONS[l.solucion].name}` : "",
    r ? `Relevamiento: ${r.referencia} (PDF adjunto)` : "Relevamiento: no se llegó a armar",
    r?.puntaje != null ? `Nivel:     ${nivelDe(r.puntaje)} (${r.puntaje}%)` : "",
    faltantes(r).length ? `Falta para cotizar: ${faltantes(r).join(", ")}` : "",
    `Origen:    ${l.origen}`,
    ``,
    `— El caso —`,
    l.resumen || r?.resumen || "",
    r ? `\n— Lo que identificó —\n${r.hallazgos.map((h) => `• [${h.prioridad}] ${h.texto}`).join("\n")}` : "",
    ``,
    `— Conversación (enviada por el navegador, sin verificar) —`,
    l.conversacion,
  ]
    .filter((x) => x !== "")
    .join("\n");
}

export function htmlEquipo(l: LeadAsistente): string {
  const r = l.relevamiento;
  const sol = l.solucion && SOLUTIONS[l.solucion] ? SOLUTIONS[l.solucion] : null;
  const fila = (label: string, valor: string) =>
    `<tr><td style="padding:7px 0;width:110px;font-size:12px;color:#6b7a90;vertical-align:top">${label}</td><td style="padding:7px 0;font-size:14px;color:#0b1626">${valor}</td></tr>`;
  const prioridad: Record<string, string> = { alta: "#b4471b", media: "#9a6a12", baja: "#6b7a90" };

  return `<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:28px 12px;background:#f3f5f9;font-family:Helvetica,Arial,sans-serif;color:#26354a">
<div style="max-width:620px;margin:0 auto;background:#fff;border:1px solid #e1e7ef;border-radius:10px;overflow:hidden">
  <div style="padding:26px 30px 20px;border-bottom:1px solid #e9edf3">
    <div style="font-size:12px;color:#6b7a90">Lead del asistente Accedra AI${r ? ` · ${esc(r.referencia)}` : ""}</div>
    <div style="margin-top:6px;font-size:22px;font-weight:bold;color:#0b1626">${esc(l.empresa || l.nombre)}</div>
    ${sol ? `<div style="margin-top:4px;font-size:14px;color:#6b7a90"><span style="display:inline-block;width:8px;height:8px;background:${sol.accent};margin-right:6px"></span>${esc(sol.name)}</div>` : ""}
    <div style="margin-top:18px">
      <a href="https://wa.me/${whatsapp(l.telefono)}" style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;font-weight:bold;font-size:13px;padding:9px 16px;border-radius:20px">Escribir por WhatsApp</a>
      <a href="tel:${esc(soloDigitos(l.telefono))}" style="display:inline-block;margin-left:6px;color:#2b6fd4;text-decoration:none;font-weight:bold;font-size:13px;padding:9px 12px">Llamar</a>
      ${l.email ? `<a href="mailto:${esc(l.email)}" style="display:inline-block;color:#2b6fd4;text-decoration:none;font-weight:bold;font-size:13px;padding:9px 12px">Responder por mail</a>` : ""}
    </div>
  </div>

  <div style="padding:20px 30px">
    <table style="border-collapse:collapse;width:100%">
      ${fila("Nombre", esc(l.nombre))}
      ${fila("Empresa", esc(l.empresa || "—"))}
      ${fila("Teléfono", esc(l.telefono))}
      ${fila("Email", l.email ? esc(l.email) : '<span style="color:#9aa8bd">No dejó</span>')}
      ${r ? fila("Industria", esc(r.industria || "—")) : ""}
      ${r ? fila("Tamaño", esc(r.tamano || "—")) : ""}
      ${r?.puntaje != null ? fila("Relevamiento", `<b>${nivelDe(r.puntaje)}</b> · ${r.puntaje}% de los datos para cotizar`) : ""}
      ${faltantes(r).length ? fila("Preguntale", esc(faltantes(r).join(", "))) : ""}
      ${fila("Origen", esc(l.origen))}
    </table>
  </div>

  <div style="padding:4px 30px 22px">
    <div style="font-size:12px;color:#6b7a90;margin-bottom:6px">El caso</div>
    <div style="font-size:14px;line-height:1.6;color:#0b1626;border-left:2px solid #0b1626;padding-left:12px">${conSaltos(l.resumen || r?.resumen || "—")}</div>
  </div>

  ${
    r
      ? `<div style="padding:0 30px 22px">
    <div style="font-size:12px;color:#6b7a90;margin-bottom:6px">Lo que identificó el asistente</div>
    <table style="border-collapse:collapse;width:100%">${r.hallazgos
      .map(
        (h) =>
          `<tr><td style="padding:6px 0;border-bottom:1px solid #eef1f5;font-size:13.5px;line-height:1.5">${esc(h.texto)}</td><td style="padding:6px 0 6px 12px;border-bottom:1px solid #eef1f5;font-size:11.5px;white-space:nowrap;vertical-align:top;color:${prioridad[h.prioridad]}">${h.prioridad}</td></tr>`,
      )
      .join("")}</table>
    <div style="margin-top:12px;font-size:12.5px;color:#6b7a90">El relevamiento completo va adjunto en PDF: es el mismo que se llevó la persona.</div>
  </div>`
      : ""
  }

  <div style="padding:18px 30px 26px;background:#f8fafc;border-top:1px solid #e9edf3">
    <div style="font-size:12px;color:#6b7a90;margin-bottom:8px">Conversación · enviada por el navegador, sin verificar</div>
    <div style="font-size:12.5px;line-height:1.6;color:#3b4a60">${conSaltos(l.conversacion || "—")}</div>
  </div>
</div>
</body></html>`;
}
