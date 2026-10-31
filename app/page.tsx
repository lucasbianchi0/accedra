import type { Metadata, Viewport } from "next";
import { Inter_Tight } from "next/font/google";
import Nav from "@/components/landing/Nav";
import Portada from "@/components/landing/Portada";
import Clientes from "@/components/landing/Clientes";
import Manifiesto from "@/components/landing/Manifiesto";
import Presencia from "@/components/landing/Presencia";
import Soluciones from "@/components/landing/Soluciones";
import Metodo from "@/components/landing/Metodo";
import Casos from "@/components/landing/Casos";
import Testimonios from "@/components/landing/Testimonios";
import Tecnologias from "@/components/landing/Tecnologias";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import EventosLateral from "@/components/EventosLateral";
import BlogLateral from "@/components/BlogLateral";
import "./landing.css";

// Va acá y no en el layout: solo la home usa esta familia.
const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-tight",
});

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

export const viewport: Viewport = {
  themeColor: "#f6f7f9",
};

export default function Home() {
  return (
    <main className={`lp ${interTight.variable}`}>
      <Nav />
      <Portada />
      <Clientes />
      <Manifiesto />
      <Presencia />
      <Soluciones />
      <Metodo />
      <Casos />
      <Testimonios />
      <Tecnologias />
      {/* Contact y Footer son los del resto del sitio, sobre navy: mismo
          formulario, misma atribución y mismos eventos. */}
      <div className="lp-cierre">
        <Contact />
        <Footer />
      </div>
      <WhatsAppButton />
      <EventosLateral />
      <BlogLateral />
    </main>
  );
}
