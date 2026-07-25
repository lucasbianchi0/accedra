import SolutionPage from "@/components/solutions/SolutionPage";
import { SOLUTIONS } from "@/components/solutions/solutionsData";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollProgress from "@/components/ScrollProgress";

const data = SOLUTIONS["firma-biometrica"];

export const metadata = {
  // `absolute` evita que el template `| Accedra` del layout duplique la marca
  // (metaTitle ya la incluye como "· Accedra").
  title: { absolute: data.metaTitle },
  description: data.metaDescription,
  alternates: { canonical: "/soluciones/firma-biometrica" },
  openGraph: {
    type: "website",
    url: "/soluciones/firma-biometrica",
    title: data.metaTitle,
    description: data.metaDescription,
  },
};

export default function Page() {
  return (
    <>
      <ScrollProgress />
      <SolutionPage slug="firma-biometrica" />
      <Footer />
      <WhatsAppButton />
    </>
  );
}
