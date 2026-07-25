import type { ContactData } from "./schema";

/**
 * Escapa TODO valor que venga del formulario antes de interpolarlo.
 *
 * El cuerpo del mail se armaba en texto plano justamente para que nadie pudiera
 * inyectar markup; al pasar a HTML esa garantía hay que reponerla a mano. Sin
 * esto, un `<img src=x onerror=...>` en el campo mensaje se ejecutaría en el
 * cliente de correo de quien lo abra.
 */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Escapado + saltos de línea a <br> (en ese orden: si no, se escaparía el <br>). */
function escMultiline(value: string): string {
  return esc(value).replace(/\r?\n/g, "<br />");
}

const SERVICE_LABELS: Record<string, string> = {
  networking: "Networking",
  seguridad: "Seguridad IT",
  biometrica: "Firma Biométrica",
  consultoria: "Consultoría Microsoft",
  otro: "Otro",
};

const BLUE = "#2B6FD4";
const INK = "#0F1F39";

type Meta = { ip: string; receivedAt: Date };

export function buildText(d: ContactData, meta: Meta): string {
  return [
    `Nombre:   ${d.name}`,
    `Empresa:  ${d.company}`,
    `Email:    ${d.email}`,
    `Servicio: ${SERVICE_LABELS[d.service] ?? "(sin especificar)"}`,
    "",
    "Mensaje:",
    d.message,
    "",
    "—",
    `IP: ${meta.ip}`,
    `Recibido: ${meta.receivedAt.toISOString()}`,
  ].join("\n");
}

/**
 * Layout con tablas y estilos inline: Outlook y Gmail ignoran flex/grid y suelen
 * descartar el <style> del <head>, así que esto es lo único que renderiza igual
 * en todos lados.
 */
export function buildHtml(d: ContactData, meta: Meta): string {
  const fecha = new Intl.DateTimeFormat("es-AR", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(meta.receivedAt);

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:14px 0;border-bottom:1px solid #E8EDF5;font:600 11px/1.4 Arial,Helvetica,sans-serif;letter-spacing:1px;text-transform:uppercase;color:#8A97A8;width:110px;vertical-align:top;">${label}</td>
      <td style="padding:14px 0;border-bottom:1px solid #E8EDF5;font:400 15px/1.5 Arial,Helvetica,sans-serif;color:${INK};">${value}</td>
    </tr>`;

  const mailto = `mailto:${encodeURIComponent(d.email)}?subject=${encodeURIComponent(
    `Re: tu consulta en Accedra`,
  )}`;

  return `<!doctype html>
<html lang="es">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><title>Nueva consulta</title></head>
<body style="margin:0;padding:0;background:#F1F5F9;">
  <!-- Preheader: el texto que Gmail muestra junto al asunto, oculto en el cuerpo -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(d.name)} de ${esc(d.company)} — ${esc(
    SERVICE_LABELS[d.service] ?? "consulta general",
  )}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F1F5F9;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(15,31,57,0.08);">

        <!-- Cabecera -->
        <tr><td style="background:${INK};padding:28px 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td style="font:700 18px/1 Arial,Helvetica,sans-serif;color:#FFFFFF;letter-spacing:-0.3px;">ACCEDRA</td>
            <td align="right" style="font:600 11px/1 Arial,Helvetica,sans-serif;color:#7FB3F8;letter-spacing:1.5px;text-transform:uppercase;">Nueva consulta</td>
          </tr></table>
        </td></tr>

        <!-- Titular -->
        <tr><td style="padding:32px 32px 8px;">
          <p style="margin:0 0 6px;font:700 22px/1.3 Arial,Helvetica,sans-serif;color:${INK};">${esc(d.name)}</p>
          <p style="margin:0;font:400 15px/1.4 Arial,Helvetica,sans-serif;color:#6B7A8F;">${esc(d.company)}</p>
        </td></tr>

        <!-- Datos -->
        <tr><td style="padding:20px 32px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${row("Email", `<a href="mailto:${esc(d.email)}" style="color:${BLUE};text-decoration:none;">${esc(d.email)}</a>`)}
            ${row("Servicio", esc(SERVICE_LABELS[d.service] ?? "Sin especificar"))}
          </table>
        </td></tr>

        <!-- Mensaje -->
        <tr><td style="padding:26px 32px 0;">
          <p style="margin:0 0 10px;font:600 11px/1.4 Arial,Helvetica,sans-serif;letter-spacing:1px;text-transform:uppercase;color:#8A97A8;">Mensaje</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F9FC;border-left:3px solid ${BLUE};border-radius:0 8px 8px 0;">
            <tr><td style="padding:18px 20px;font:400 15px/1.65 Arial,Helvetica,sans-serif;color:${INK};">${escMultiline(d.message)}</td></tr>
          </table>
        </td></tr>

        <!-- Acción -->
        <tr><td style="padding:28px 32px 32px;">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td style="background:${BLUE};border-radius:999px;">
              <a href="${mailto}" style="display:inline-block;padding:13px 28px;font:600 14px/1 Arial,Helvetica,sans-serif;color:#FFFFFF;text-decoration:none;">Responder a ${esc(d.name)}</a>
            </td>
          </tr></table>
        </td></tr>

        <!-- Pie -->
        <tr><td style="background:#F7F9FC;border-top:1px solid #E8EDF5;padding:18px 32px;font:400 12px/1.6 Arial,Helvetica,sans-serif;color:#98A4B5;">
          Enviado desde el formulario de accedra.com.ar · ${esc(fecha)}<br />IP de origen: ${esc(meta.ip)}
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
