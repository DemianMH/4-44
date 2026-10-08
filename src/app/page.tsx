import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Preloader } from "@/components/Preloader";
import { SiteChrome, type ChromeItem } from "@/components/SiteChrome";
import { Constructora } from "@/components/sections/Constructora";
import { Contact, Footer } from "@/components/sections/Contact";
import { Entregados } from "@/components/sections/Entregados";
import { Faq } from "@/components/sections/Faq";
import { ProyectosHub } from "@/components/sections/ProyectosHub";
import { Recorridos } from "@/components/sections/Recorridos";
import { getContent, siteView } from "@/lib/content";

export default async function Home() {
  const content = siteView(await getContent());
  const { projects } = content;
  const heroProject = projects.find((p) => p.slug === content.hero.projectSlug) ?? projects[0];
  const toured = projects.filter((p) => p.tour.stops.length > 0);
  const anyTerrace = projects.find((p) => p.terrace)?.terrace?.hero;

  const items: ChromeItem[] = [
    { id: "proyectos", label: "Proyectos", img: projects[0]?.cover },
    ...(toured.length ? [{ id: "recorridos", label: "Recorridos", img: toured[0].tour.stops[0].img }] : []),
    { id: "constructora", label: "Constructora", img: anyTerrace ?? projects[0]?.cover },
    ...(content.portfolio.length ? [{ id: "entregados", label: "Entregados", img: content.portfolio[0].img }] : []),
    { id: "contacto", label: "Contacto", img: projects[1]?.cover ?? projects[0]?.cover },
  ];

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const contactImage = (projects[1] ?? projects[0])?.gallery[0]?.img ?? projects[0]?.cover ?? content.portfolio[0]?.img;

  return (
    <>
      {content.faq.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}
      <Preloader />
      <SiteChrome items={items} />
      <main>
        {heroProject ? (
          <Hero hero={content.hero} project={heroProject} projectCount={projects.length} deliveredCount={content.portfolio.length} />
        ) : (
          <section id="top" data-tone="dark" className="grid min-h-svh place-items-center bg-ink px-6 text-center text-white">
            <h1 className="font-display text-[clamp(2.4rem,7vw,6rem)] font-extrabold">{content.company.name}</h1>
          </section>
        )}
        <Marquee items={content.services.map((s) => s.title)} />
        {projects.length > 0 && <ProyectosHub projects={projects} />}
        <Recorridos projects={projects} />
        <Constructora services={content.services} />
        <Entregados items={content.portfolio} />
        <Faq items={content.faq} />
        {contactImage && <Contact content={content} image={contactImage} />}
      </main>
      <Footer company={content.company} />
    </>
  );
}
