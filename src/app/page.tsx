import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Preloader } from "@/components/Preloader";
import { SiteChrome } from "@/components/SiteChrome";
import { Constructora } from "@/components/sections/Constructora";
import { Contact, Footer } from "@/components/sections/Contact";
import { Desarrollo } from "@/components/sections/Desarrollo";
import { DiaNoche } from "@/components/sections/DiaNoche";
import { Faq } from "@/components/sections/Faq";
import { Machinery } from "@/components/sections/Machinery";
import { Plantas } from "@/components/sections/Plantas";
import { Proyectos } from "@/components/sections/Proyectos";
import { Terraza } from "@/components/sections/Terraza";
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
      <SiteChrome />
      <main>
        <Hero />
        <Marquee />
        <Desarrollo />
        <DiaNoche />
        <Plantas />
        <Terraza />
        <Constructora />
        <Machinery />
        <Proyectos />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
