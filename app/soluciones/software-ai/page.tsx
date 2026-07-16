import SolutionPage from "@/components/solutions/SolutionPage";
import { SOLUTIONS } from "@/components/solutions/solutionsData";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollProgress from "@/components/ScrollProgress";

const data = SOLUTIONS["software-ai"];

export const metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function Page() {
  return (
    <>
      <ScrollProgress />
      <SolutionPage slug="software-ai" />
      <Footer />
      <WhatsAppButton />
    </>
  );
}
