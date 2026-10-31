import { jsonLdString } from "@/lib/seo/jsonLd";

// Inyecta uno o más objetos schema.org como <script type="application/ld+json">.
// Es un Server Component: el script llega en el HTML del SSR (lo que leen Google
// y los crawlers de IA), sin depender de JS del cliente.
export default function JsonLd({ data }: { data: unknown | unknown[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <script
      type="application/ld+json"
      // Parte del dato sale de la base: `jsonLdString` escapa lo que cerraría el <script>.
      dangerouslySetInnerHTML={{ __html: jsonLdString(...items) }}
    />
  );
}
