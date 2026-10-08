import type { MetadataRoute } from "next";
import { getContent, siteView } from "@/lib/content";
import { SITE } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { projects } = siteView(await getContent());
  return [
    { url: SITE.url, changeFrequency: "monthly", priority: 1 },
    ...projects.map((p) => ({ url: `${SITE.url}/proyectos/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
