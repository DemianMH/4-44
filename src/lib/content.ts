import { cacheLife, cacheTag } from "next/cache";
import defaults from "@/data/content.default.json";
import { getJSON } from "./store";
import type { Content, Project } from "./types";

export const CONTENT_TAG = "content";

const EMPTY_TOUR = { title: "Recorrido virtual", stops: [] };

/** Rellena campos opcionales para que el sitio nunca falle por contenido incompleto. */
export function normalize(raw: Content): Content {
  const c = raw;
  return {
    ...c,
    hero: { ...defaults.hero, ...c.hero, lines: c.hero?.lines?.length ? c.hero.lines : defaults.hero.lines },
    company: { ...defaults.company, ...c.company },
    services: c.services ?? [],
    portfolio: c.portfolio ?? [],
    faq: c.faq ?? [],
    form: { ...defaults.form, ...c.form, interests: c.form?.interests ?? defaults.form.interests },
    projects: (c.projects ?? []).map((p) => ({
      ...p,
      facts: p.facts ?? [],
      gallery: p.gallery ?? [],
      concept: p.concept ?? [],
      facade: p.facade ?? null,
      terrace: p.terrace ?? null,
      tour: { ...EMPTY_TOUR, ...p.tour, stops: p.tour?.stops ?? [] },
    })),
  };
}

/** Contenido del sitio (en caché; se invalida desde el panel con la etiqueta `content`). */
export async function getContent(): Promise<Content> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  const stored = await getJSON<Content>("cms", "content");
  return normalize(stored ?? (defaults as unknown as Content));
}

/** Vista pública: solo proyectos publicados y sin elementos a medio llenar (sin imagen). */
export function siteView(c: Content): Content {
  return {
    ...c,
    portfolio: c.portfolio.filter((e) => e.img.src),
    projects: c.projects
      .filter((p) => p.published && p.cover.src)
      .map((p) => ({
        ...p,
        gallery: p.gallery.filter((g) => g.img.src),
        concept: p.concept.filter((g) => g.img.src),
        facade: p.facade?.day.src && p.facade.night.src ? p.facade : null,
        terrace: p.terrace?.hero.src ? { ...p.terrace, card: p.terrace.card?.src ? p.terrace.card : undefined } : null,
        tour: { ...p.tour, stops: p.tour.stops.filter((s) => s.img.src) },
      })),
  };
}

export function publishedProjects(c: Content): Project[] {
  return c.projects.filter((p) => p.published);
}

export function projectBySlug(c: Content, slug: string): Project | undefined {
  return c.projects.find((p) => p.slug === slug && p.published);
}

export function whatsappUrl(c: Content, text?: string): string | null {
  const n = c.company.whatsapp.replace(/\D/g, "");
  return n ? `https://wa.me/${n}${text ? `?text=${encodeURIComponent(text)}` : ""}` : null;
}
