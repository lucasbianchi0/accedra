import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ClientsBar from "@/components/ClientsBar";
import Services from "@/components/Services";
import WhyUs from "@/components/WhyUs";
import Partners from "@/components/Partners";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import WhatsAppButton from "@/components/WhatsAppButton";
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
    <main className="relative bg-navy-800">
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
    </main>
  );
}
