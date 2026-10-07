import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Preloader } from "@/components/Preloader";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Contact, Footer } from "@/components/sections/Contact";
import { Faq } from "@/components/sections/Faq";
import { Machinery } from "@/components/sections/Machinery";
import { Manifesto } from "@/components/sections/Manifesto";
import { Process } from "@/components/sections/Process";
import { Projects } from "@/components/sections/Projects";
import { Services } from "@/components/sections/Services";
import { FAQ } from "@/lib/site";

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <Preloader />
      <Header />
      <ScrollProgress />
      <main>
        <Hero />
        <Manifesto />
        <Services />
        <Process />
        <Machinery />
        <Projects />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
