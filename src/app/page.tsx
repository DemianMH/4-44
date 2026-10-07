import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Preloader } from "@/components/Preloader";
import { Contact, Faq, Footer, Machinery, Manifesto, Process, Projects, Services } from "@/components/Sections";
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
      <main>
        <Hero />
        <Manifesto />
        <Services />
        <Machinery />
        <Projects />
        <Process />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
