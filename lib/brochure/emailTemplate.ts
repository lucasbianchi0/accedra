/**
 * El mail que recibe quien pide el brochure.
 *
 * Todo lo visual sale del brand kit, no de criterio propio:
 *
 *   · Fondo #F4F6F9 y tarjeta blanca encima — "nunca blanco puro de punta a
 *     punta". Titulares en Navy Accedra #0D1F3A.
 *   · UN SOLO acento por pieza. Acá es el color de la solución (#3B82F6
 *     networking, #7C6CF6 biométrica, …), que en el kit no es decoración sino
 *     identidad. Por eso NO se mezcla además el Azul Accedra.
 *   · Logo en su variante navy sobre fondo claro, a 140 px (el mínimo del kit
 *     es 120) y con la zona de seguridad respetada. Sin sombra, sin caja.
 *   · Escala del kit: 11 px labels · 13 px secundario · 15 px cuerpo · 26 px
 *     título. Eyebrow en versalita con tracking 0.11em, títulos en -0.02em,
 *     interlineado del cuerpo 1.6.
 *
 * Layout con tablas y estilos inline por el mismo motivo que la plantilla de
 * contacto: Outlook y Gmail ignoran flex/grid y suelen descartar el <style>
 * del <head>. Space Grotesk e Inter no existen en un cliente de correo, así que
 * la pila de fuentes cae en las de sistema — es lo único del kit que no se
 * puede respetar acá.
 */

import { ORG, abs } from "@/lib/seo/site";

/* ── Marca ─────────────────────────────────────────────────────────────────
 * Copiados del brand kit. Van como literales y no importados desde el proyecto
 * del kit porque son repos distintos; si el kit cambia, esto se actualiza a mano.
 */
const NAVY = "#0D1F3A";   // Navy Accedra — titulares
const CUERPO = "#3A4A63"; // el gris de texto de la firma de correo en producción
const MUTED = "#7A8699";  // Gris muted del kit — pies y labels
const SUPERFICIE = "#F4F6F9"; // Gris superficie del kit — el fondo
const LINEA = "#E3E8F0";
const LOGO = "https://www.accedra.com.ar/logos/accedra-firma-email.png";

const FUENTE =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif";

export type DatosBrochure = {
  /** Nombre de la solución, tal como lo dice el sitio. */
  solucion: string;
  /** Color de identidad de la solución: el único acento de la pieza. */
  accent: string;
  /** URL absoluta del PDF, por si el adjunto se pierde en el camino. */
  pdf: string;
  /** Nombre del archivo adjunto, para nombrarlo en el cuerpo. */
  archivo: string;
  /** Peso del adjunto ya formateado ("2,2 MB"), o null si no se pudo adjuntar. */
  peso: string | null;
  slug: string;
};

const QUE_TRAE = ["Qué incluye la solución", "Entregables de cada etapa", "Casos reales de implementación"];

export function buildText(d: DatosBrochure): string {
  return [
    `Tu brochure de ${d.solucion}`,
    "",
    d.peso
      ? `Va adjunto a este mail (${d.archivo}, ${d.peso}).`
      : "Podés descargarlo desde el enlace de abajo.",
    `También podés descargarlo acá: ${d.pdf}`,
    "",
    "Adentro vas a encontrar:",
    ...QUE_TRAE.map((x) => `  · ${x}`),
    "",
    `Si querés que lo veamos sobre tu caso, respondé este mail o escribinos al ${ORG.phoneDisplay}.`,
    "",
    "—",
    `${ORG.legalName} · ${ORG.address.street} · ${ORG.address.region}`,
    abs(`/soluciones/${d.slug}`),
  ].join("\n");
}

export function buildHtml(d: DatosBrochure): string {
  const filas = QUE_TRAE.map(
    (item) => `
            <tr>
              <td width="22" valign="top" style="padding:0 0 9px 0;font-size:15px;line-height:22px;color:${d.accent};font-weight:700;">&#10003;</td>
              <td style="padding:0 0 9px 0;font-family:${FUENTE};font-size:15px;line-height:22px;color:${CUERPO};">${item}</td>
            </tr>`
  ).join("");

  // La tapa del PDF, clickeable.
  //
  // Es lo más cerca que se puede estar de "ver el brochure en el mail": ningún
  // cliente de correo renderiza un PDF en el cuerpo, así que se muestra su
  // primera página como imagen y se enlaza al archivo.
  //
  // 300 px de ancho para una imagen de 700: el doble largo, que es lo que
  // necesita una pantalla retina. Alto declarado en el atributo además del
  // style, porque Outlook ignora el CSS y sin eso deforma la imagen.
  //
  // El pie sólo dice "adjunto" si el adjunto viajó de verdad: prometer un
  // archivo que no está es peor que no mencionarlo.
  // La tapa vive en /images/ y NO en /brochures/ a propósito: esa carpeta está
  // en el disallow del robots.txt para que Google no indexe los PDF y saltee el
  // formulario. Gmail no carga las imágenes directo —las pide desde su propio
  // proxy— y si ese proxy respeta el robots.txt, la tapa no se ve nunca.
  const tapa = abs(`/images/brochures/${d.slug}.jpg`);
  const pie = d.peso ? `${d.archivo} &middot; ${d.peso} &middot; adjunto a este mail` : d.archivo;

  const bloqueTapa = `
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
            <tr>
              <td align="center" style="padding:0 0 12px 0;">
                <a href="${d.pdf}" style="text-decoration:none;">
                  <img src="${tapa}" alt="Tapa del brochure de ${d.solucion}" width="300" height="424"
                       style="display:block;width:300px;height:424px;border:1px solid ${LINEA};border-radius:10px;outline:none;text-decoration:none;">
                </a>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:0 0 24px 0;font-family:${FUENTE};font-size:11px;line-height:16px;color:${MUTED};letter-spacing:0.02em;">
                ${pie}
              </td>
            </tr>
          </table>`;

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Tu brochure de ${d.solucion}</title>
</head>
<body style="margin:0;padding:0;background-color:${SUPERFICIE};">
  <!-- Preheader: es el texto que la bandeja muestra al lado del asunto. Sin esto
       el cliente de correo agarra la primera línea que encuentre. -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Tu brochure de ${d.solucion}, con el detalle de la solución, los entregables y casos reales.</div>

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;background-color:${SUPERFICIE};">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="border-collapse:collapse;width:560px;max-width:100%;background-color:#FFFFFF;border-radius:14px;overflow:hidden;">

          <!-- Filete del color de la solución. El radio va también acá: un
               overflow hidden sobre una tabla no recorta de forma fiable, y sin
               esto la barra se pasa de las esquinas de la tarjeta. Donde el
               cliente ignora border-radius quedan las dos escuadradas, que es
               coherente igual. -->
          <tr><td height="3" style="height:3px;line-height:3px;font-size:0;background-color:${d.accent};border-radius:14px 14px 0 0;">&nbsp;</td></tr>

          <!-- Logo. Variante navy sobre fondo claro, 140px, zona de seguridad
               respetada por el padding. -->
          <tr>
            <td style="padding:30px 36px 0 36px;">
              <img src="${LOGO}" alt="Accedra" width="140" height="21" style="display:block;width:140px;height:21px;border:0;outline:none;text-decoration:none;">
            </td>
          </tr>

          <tr>
            <td style="padding:26px 36px 0 36px;font-family:${FUENTE};">
              <div style="font-size:11px;line-height:16px;font-weight:700;letter-spacing:0.11em;text-transform:uppercase;color:${d.accent};padding-bottom:8px;">Brochure</div>
              <h1 style="margin:0;font-size:26px;line-height:32px;font-weight:700;letter-spacing:-0.02em;color:${NAVY};">${d.solucion}</h1>
            </td>
          </tr>

          <tr>
            <td style="padding:14px 36px 24px 36px;font-family:${FUENTE};font-size:15px;line-height:24px;color:${CUERPO};">
              Gracias por tu interés. Acá tenés el material completo de la solución.
            </td>
          </tr>

          <tr><td style="padding:0 36px;">${bloqueTapa}</td></tr>

          <!-- CTA. El adjunto puede quedar bloqueado por el servidor de correo
               del destinatario, así que el enlace va siempre. -->
          <tr>
            <!-- Centrado, para que la tapa, su pie y el botón lean como un solo
                 bloque. Con el botón a la izquierda quedaba colgando. -->
            <td align="center" style="padding:0 36px 26px 36px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="border-collapse:collapse;">
                <tr>
                  <td align="center" style="background-color:${d.accent};border-radius:999px;">
                    <a href="${d.pdf}" style="display:inline-block;padding:14px 30px;font-family:${FUENTE};font-size:15px;line-height:18px;font-weight:600;color:#FFFFFF;text-decoration:none;">Descargar el PDF</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 36px 4px 36px;font-family:${FUENTE};font-size:11px;line-height:16px;font-weight:700;letter-spacing:0.11em;text-transform:uppercase;color:${MUTED};">
              Qué vas a encontrar
            </td>
          </tr>
          <tr>
            <td style="padding:12px 36px 26px 36px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">${filas}
              </table>
            </td>
          </tr>

          <tr><td style="padding:0 36px;"><div style="height:1px;line-height:1px;font-size:0;background-color:${LINEA};">&nbsp;</div></td></tr>

          <tr>
            <td style="padding:22px 36px 32px 36px;font-family:${FUENTE};font-size:14px;line-height:22px;color:${CUERPO};">
              ¿Querés que lo veamos sobre tu caso? Respondé este mail o escribinos al
              <a href="tel:${ORG.phone}" style="color:${d.accent};text-decoration:none;font-weight:600;">${ORG.phoneDisplay}</a>.
            </td>
          </tr>

        </table>

        <!-- Pie, fuera de la tarjeta -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="border-collapse:collapse;width:560px;max-width:100%;">
          <tr>
            <td align="center" style="padding:20px 16px 0 16px;font-family:${FUENTE};font-size:11px;line-height:18px;color:${MUTED};">
              ${ORG.legalName} &middot; ${ORG.address.street} &middot; ${ORG.address.region}<br>
              <a href="${abs(`/soluciones/${d.slug}`)}" style="color:${MUTED};text-decoration:underline;">Ver la solución en el sitio</a>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
}
