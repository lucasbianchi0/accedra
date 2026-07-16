import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ClientsBar from "@/components/ClientsBar";
import Services from "@/components/Services";
import WhyUs from "@/components/WhyUs";
import Partners from "@/components/Partners";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import WhatsAppButton from "@/components/WhatsAppButton";
import MobileCTA from "@/components/MobileCTA";

export default function Home() {
  return (
    <main>
      <ScrollProgress />
      <Navbar />
      <Hero />
      <ClientsBar />
      <Services />
      <Partners />
      <WhyUs />
      <Testimonials />
      <Contact />
      <Footer />
      <WhatsAppButton />
      <MobileCTA />
    </main>
  );
}
