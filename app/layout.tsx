import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

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
    "15 años transformando la infraestructura IT de las empresas líderes de Argentina. Networking, Seguridad, Firma Biométrica y Consultoría Microsoft.",
  keywords: "IT, infraestructura, networking, seguridad, Cisco, Microsoft, firma biométrica, Argentina",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${montserrat.variable} scroll-smooth antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
