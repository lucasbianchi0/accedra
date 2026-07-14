// Número de WhatsApp real de Accedra (detrás del antiguo wa.link/78b9n9).
export const WHATSAPP_PHONE = "541133001233";

/**
 * Genera un link de WhatsApp con el mensaje precargado redactado desde el
 * punto de vista del prospecto (no de Accedra). Los placeholders [nombre] y
 * [empresa] invitan a que el visitante los complete antes de enviar.
 *
 * @param context - tema opcional para contextualizar la consulta (ej. el nombre
 *                  de la solución). Si se omite, usa un texto genérico.
 */
export function whatsappLink(context?: string): string {
  const need = context
    ? `la solución de ${context}`
    : "infraestructura, seguridad o soporte IT";
  const text = `Hola, soy [nombre] de [empresa]. Quisiera consultar por una necesidad relacionada con ${need}.`;
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
}
