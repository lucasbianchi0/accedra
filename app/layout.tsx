import type { Metadata, Viewport } from "next";
import { Inter, Montserrat, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { LangProvider } from "@/lib/i18n/LangProvider";
import SmoothScroll from "@/components/SmoothScroll";
import JsonLd from "@/components/seo/JsonLd";
import Attribution from "@/components/Attribution";
import { organizationLd, websiteLd } from "@/lib/seo/jsonLd";
import { SITE_URL, DEFAULT_TITLE, DEFAULT_DESCRIPTION, ORG } from "@/lib/seo/site";

/* Las tres familias van con `<link rel="preload">`, o sea que compiten por el
   caño justo cuando se deciden FCP y LCP. Se probó recortar esa lista y el
   resultado fue peor en las tres: las tres pintan algo en el primer viewport
   (Inter el cuerpo, Space Grotesk el <h1>, Montserrat el logo del navbar).
   Lo que sí rindió fue bajar el NÚMERO DE ARCHIVOS: sin `weight` explícito
   next/font sirve la variante variable de cada familia, un archivo por familia
   en vez de uno por peso. */

// Cuerpo de toda la página: es lo que se pinta primero. Preload sí.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Montserrat pinta sólo `.logo-word` y `.logo-sub` (el "IT SOLUTIONS" bajo el
// logo). Parece candidata obvia a `preload: false`... y NO lo es: medido, sacarle
// el preload empeoraba el FCP 300 ms en TODAS las páginas, y el LCP heredaba el
// retraso. El motivo es que el logo del navbar es lo primero que se pinta, así
// que esta fuente está en el camino del primer pintado aunque el texto sea
// chiquito. Queda precargada. Si alguien vuelve a intentar quitarla, medir FCP
// antes y después — la intuición acá miente.
// Sin `weight` toma la variante variable: un archivo en lugar de dos.
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
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
        {/* Acá vivía MotionProvider (LazyMotion + MotionConfig de framer). Se fue
            con la librería: montarlo en la raíz metía framer en el bundle de
            arranque de TODAS las páginas, que es justo lo que se estaba tratando
            de evitar. El único consumidor que queda —el overlay del menú mobile—
            monta su propio LazyMotion cuando se lo abre. */}
        {/* SmoothScroll monta el reset de scroll que corresponda a cada rama
            (Lenis en desktop, nativo en el resto): el de Lenis necesita el
            contexto de la librería y por eso no puede vivir acá afuera. */}
        <SmoothScroll>
          <LangProvider>{children}</LangProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
