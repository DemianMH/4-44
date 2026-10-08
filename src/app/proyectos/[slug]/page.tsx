import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteChrome, type ChromeItem } from "@/components/SiteChrome";
import { Concepto } from "@/components/sections/Concepto";
import { Contact, Footer } from "@/components/sections/Contact";
import { DiaNoche } from "@/components/sections/DiaNoche";
import { Galeria } from "@/components/sections/Galeria";
import { OtrosProyectos } from "@/components/sections/OtrosProyectos";
import { ProjectHero } from "@/components/sections/ProjectHero";
import { Recorridos } from "@/components/sections/Recorridos";
import { Terraza } from "@/components/sections/Terraza";
import { getContent, projectBySlug, siteView } from "@/lib/content";
import { SITE } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const { projects } = siteView(await getContent());
  return projects.length ? projects.map((p) => ({ slug: p.slug })) : [{ slug: "coronado-869" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug(siteView(await getContent()), slug);
  if (!project) return { title: "Proyecto no encontrado", robots: { index: false } };
  const title = `${project.name} | ${project.kind} en ${project.location}`;
  return {
    title,
    description: project.summary || `${project.name}: ${project.tagline}`,
    alternates: { canonical: `/proyectos/${project.slug}` },
    openGraph: { type: "website", title, description: project.summary || project.tagline, url: `${SITE.url}/proyectos/${project.slug}`, images: [{ url: project.cover.src, width: project.cover.w, height: project.cover.h, alt: project.cover.alt }] },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const content = siteView(await getContent());
  const project = projectBySlug(content, slug);
  if (!project) notFound();

  const others = content.projects.filter((p) => p.id !== project.id);
  const items: ChromeItem[] = [
    ...(project.gallery.length ? [{ id: "galeria", label: "Galería", img: project.gallery[0].img }] : []),
    ...(project.tour.stops.length ? [{ id: "recorrido", label: "Recorrido", img: project.tour.stops[0].img }] : []),
    ...(project.terrace ? [{ id: "terraza", label: project.terrace.title.replace(/\.$/, ""), img: project.terrace.hero }] : []),
    { id: "contacto", label: "Contacto", img: project.cover },
    { id: "todos", label: "Todos los proyectos", href: "/#proyectos", img: others[0]?.cover },
  ];

  const ld = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: project.name,
    description: project.summary,
    image: `${SITE.url}${project.cover.src}`,
    url: `${SITE.url}/proyectos/${project.slug}`,
    address: { "@type": "PostalAddress", addressLocality: project.location, addressCountry: "MX" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <SiteChrome items={items} />
      <main>
        <ProjectHero project={project} />
        <Galeria project={project} />
        {project.facade && <DiaNoche facade={project.facade} />}
        <Concepto items={project.concept} name={project.name} />
        <Recorridos projects={[project]} single id="recorrido" />
        {project.terrace && <Terraza terrace={project.terrace} />}
        <OtrosProyectos projects={others} />
        <Contact content={content} image={project.gallery[0]?.img ?? project.cover} defaultInterest={project.name} />
      </main>
      <Footer company={content.company} />
    </>
  );
}
