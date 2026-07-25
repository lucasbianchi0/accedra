import { jsonLdString } from "@/lib/seo/jsonLd";

// Inyecta uno o más objetos schema.org como <script type="application/ld+json">.
// Es un Server Component: el script llega en el HTML del SSR (lo que leen Google
// y los crawlers de IA), sin depender de JS del cliente.
export default function JsonLd({ data }: { data: unknown | unknown[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <script
      type="application/ld+json"
      // schema.org es data controlada por nosotros (no input de usuario), así que
      // el JSON serializado es seguro de inyectar.
      dangerouslySetInnerHTML={{ __html: jsonLdString(...items) }}
    />
  );
}
