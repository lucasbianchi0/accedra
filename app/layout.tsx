import type { Metadata, Viewport } from "next";
import { Inter, Montserrat, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { LangProvider } from "@/lib/i18n/LangProvider";
import MotionProvider from "@/components/MotionProvider";
import SmoothScroll from "@/components/SmoothScroll";
import JsonLd from "@/components/seo/JsonLd";
import Attribution from "@/components/Attribution";
import { organizationLd, websiteLd } from "@/lib/seo/jsonLd";
import { SITE_URL, DEFAULT_TITLE, DEFAULT_DESCRIPTION, ORG } from "@/lib/seo/site";

/* Las tres familias suman ~105 KB y viajan con `<link rel="preload">`, o sea
   ANTES del elemento LCP. En mobile, contra 1,6 Mbps, eso es medio segundo de
   caño ocupado justo cuando se está decidiendo la métrica. De ahí que cada
   familia declare explícitamente si merece o no ese lugar. */

// Cuerpo de toda la página: es lo que se pinta primero. Preload sí.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// `preload: false` a propósito. Montserrat NO pinta contenido: sus dos únicos
// usos son `.logo-word` y `.logo-sub` (el "IT SOLUTIONS" bajo el logo), que son
// etiquetas decorativas de 11px. Precargarla le sacaba turno a la fuente del
// <h1>, que es el elemento LCP. Sin preload se descarga igual, pero cuando hay
// caño libre en vez de compitiendo con lo que decide el score.
// Sin `weight` toma la variante variable: un archivo en lugar de dos.
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  preload: false,
});

// Display corporativa/tech para títulos (fuerte, geométrica). El cuerpo sigue en
// Inter para máxima legibilidad; los títulos toman esta vía --font-display.
// Esta SÍ va con preload: el <h1> del hero es el elemento LCP de la home y la
// usa en peso 700. Sin `weight` viene como fuente variable — un solo archivo
// cubre 500/600/700 en vez de tres.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
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
          {/* SmoothScroll monta el reset de scroll que corresponda a cada rama
              (Lenis en desktop, nativo en el resto): el de Lenis necesita el
              contexto de la librería y por eso no puede vivir acá afuera. */}
          <SmoothScroll>
            <LangProvider>{children}</LangProvider>
          </SmoothScroll>
        </MotionProvider>
      </body>
    </html>
  );
}
