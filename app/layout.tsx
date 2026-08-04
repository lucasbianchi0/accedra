import type { Metadata, Viewport } from "next";
import { Inter, Montserrat, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { LangProvider } from "@/lib/i18n/LangProvider";
import ScrollToTop from "@/components/ScrollToTop";
import MotionProvider from "@/components/MotionProvider";
import SmoothScroll from "@/components/SmoothScroll";
import JsonLd from "@/components/seo/JsonLd";
import Attribution from "@/components/Attribution";
import { organizationLd, websiteLd } from "@/lib/seo/jsonLd";
import { SITE_URL, DEFAULT_TITLE, DEFAULT_DESCRIPTION, ORG } from "@/lib/seo/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "500"],
  variable: "--font-montserrat",
});

// Display corporativa/tech para títulos (fuerte, geométrica). El cuerpo sigue en
// Inter para máxima legibilidad; los títulos toman esta vía --font-display.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  // metadataBase resuelve las URLs relativas de OG/canonical a absolutas.
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    // Las páginas hijas definen su título y Next lo compone con la marca.
    template: `%s | ${ORG.name}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: ORG.name,
  authors: [{ name: ORG.name, url: SITE_URL }],
  creator: ORG.name,
  publisher: ORG.legalName,
  keywords: [
    "infraestructura IT", "networking", "ciberseguridad", "firma biométrica",
    "firma digital", "consultoría Microsoft", "Power BI", "Cisco", "Zero Trust",
    "soporte IT", "software a medida", "inteligencia artificial", "Argentina", "CABA",
  ],
  category: "technology",
  openGraph: {
    type: "website",
    siteName: ORG.name,
    locale: "es_AR",
    url: SITE_URL,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  // Verificación de Google Search Console por meta tag. Se setea el token en
  // NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION (Vercel → Settings → Environment
  // Variables); sin la variable no se emite ningún meta.
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  themeColor: "#07101d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${montserrat.variable} ${spaceGrotesk.variable} antialiased`}>
      {/* suppressHydrationWarning: extensiones del navegador (ColorZilla, Grammarly,
          etc.) inyectan atributos en el <body> antes de que React hidrate
          (p. ej. cz-shortcut-listen). Eso dispara un warning de hidratación que no
          es un bug del código. Suprimirlo acá (solo un nivel) es lo recomendado. */}
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {/* Structured data global: la empresa (ProfessionalService/LocalBusiness)
            y el sitio. Va en el SSR, disponible para Google y crawlers de IA. */}
        <JsonLd data={[organizationLd(), websiteLd()]} />
        {/* Captura el origen de la visita (gclid, UTMs, referente) apenas entra
            y lo conserva mientras navega: sin esto el identificador del anuncio
            se pierde entre la página de aterrizaje y el formulario. */}
        <Attribution />
        <MotionProvider>
          <SmoothScroll>
            {/* Dentro de SmoothScroll para que useLenis() tenga el contexto de
                Lenis y pueda resetear el scroll al cambiar de ruta. */}
            <ScrollToTop />
            <LangProvider>{children}</LangProvider>
          </SmoothScroll>
        </MotionProvider>
      </body>
    </html>
  );
}
