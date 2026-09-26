import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ClientsBar from "@/components/ClientsBar";
import Services from "@/components/Services";
import WhyUs from "@/components/WhyUs";
import Partners from "@/components/Partners";
import EventosLateral from "@/components/EventosLateral";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import WhatsAppButton from "@/components/WhatsAppButton";
import BlogLateral from "@/components/BlogLateral";
import AmbientLight from "@/components/AmbientLight";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

export default function Home() {
  return (
    // Canvas único. `relative` es lo que ancla la capa de luz al documento
    // entero; sin eso las aureolas se posicionarían contra el viewport.
    // Nada de `overflow-hidden` acá: rompería cualquier `position: sticky`
    // que se use más adelante dentro de una sección.
    // El canvas de la portada es el mismo casi negro del blog (#04070d) y no
    // el navy de marca. Sobre el navy, el azul de las lámparas se suma al azul
    // del fondo y la página entera flota en un tono medio; sobre casi negro la
    // misma luz se lee como luz, porque hay contra qué medirla.
    <main className="canvas-oscuro relative bg-[#04070d]">
      <AmbientLight />
      {/* Los elementos fijos quedan FUERA del wrapper: adentro crearían un
          contexto de apilamiento propio y sus z-index (navbar 50, progreso 60)
          pasarían a medirse contra el z-10 del wrapper, no contra la página.
          Resultado: MobileCTA, que es hermano, se pintaría sobre el navbar. */}
      <ScrollProgress />
      <Navbar />
      {/* El contenido va por encima de la luz, por debajo de los fijos. */}
      <div className="relative z-10">
        <Hero />
        <ClientsBar />
        <Services />
        <Partners />
        <WhyUs />
        <Contact />
        <Footer />
      </div>
      <WhatsAppButton />
      {/* Los eventos no ocupan la portada: una pestaña fija en el borde derecho
          abre el panel con la lista. No pinta nada si no hay próximos eventos. */}
      <EventosLateral />
      {/* Y debajo, la misma idea para el blog: la pestaña sólo aparece si hay
          notas publicadas, y se corre sola si la de eventos está ocupando el
          centro del borde. */}
      <BlogLateral />
    </main>
  );
}
