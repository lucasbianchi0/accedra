import { redirect } from "next/navigation";

/**
 * Los eventos ya no tienen página propia: el detalle es un popup dentro de
 * /eventos, con la información y el mail para anotarse.
 *
 * Esta ruta queda sólo para no romper los links que ya se compartieron: lleva a
 * /eventos?evento=<slug>, que abre ese popup. El slug se valida antes de ir a
 * la query; cualquier otra cosa termina en la lista.
 */
type Props = { params: Promise<{ slug: string }> };

export default async function EventoPage({ params }: Props) {
  const { slug } = await params;
  redirect(/^[a-z0-9-]{1,80}$/.test(slug) ? `/eventos?evento=${slug}` : "/eventos");
}
