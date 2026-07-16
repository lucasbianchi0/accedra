import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { LangProvider } from "@/lib/i18n/LangProvider";
import ScrollToTop from "@/components/ScrollToTop";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "500"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Accedra IT Solutions | Infraestructura y Servicios Tecnológicos",
  description:
    "17 años transformando la infraestructura IT de las empresas líderes de Argentina. Networking, Seguridad, Firma Biométrica y Consultoría Microsoft.",
  keywords: "IT, infraestructura, networking, seguridad, Cisco, Microsoft, firma biométrica, Argentina",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${montserrat.variable} antialiased`}>
      <body className="min-h-full flex flex-col">
        <ScrollToTop />
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
