import type { Content, Img, Project } from "./types";
import { normalize } from "./content";

type R = Record<string, unknown>;
const isObj = (v: unknown): v is R => typeof v === "object" && v !== null && !Array.isArray(v);
const str = (v: unknown, max = 600): string => (typeof v === "string" ? v.slice(0, max) : "");
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const bool = (v: unknown, d = false) => (typeof v === "boolean" ? v : d);

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

const rid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 8)}`;

function img(v: unknown): Img {
  const o = isObj(v) ? v : {};
  const src = str(o.src, 400);
  const okSrc = src.startsWith("/p/") || src.startsWith("/media/") || /^https:\/\//.test(src);
  return {
    src: okSrc ? src : "",
    w: Number(o.w) > 0 ? Math.round(Number(o.w)) : 1600,
    h: Number(o.h) > 0 ? Math.round(Number(o.h)) : 900,
    alt: str(o.alt, 220),
    blur: typeof o.blur === "string" && o.blur.startsWith("data:image/") ? o.blur.slice(0, 4000) : undefined,
  };
}

const url = (v: unknown) => {
  const s = str(v, 300).trim();
  return /^https?:\/\//i.test(s) ? s : "";
};

function project(v: unknown, used: Set<string>): Project {
  const o = isObj(v) ? v : {};
  const name = str(o.name, 90) || "Proyecto sin nombre";
  let slug = slugify(str(o.slug, 90) || name) || rid("proyecto");
  while (used.has(slug)) slug = `${slug}-${Math.random().toString(36).slice(2, 4)}`;
  used.add(slug);
  const facade = isObj(o.facade) ? o.facade : null;
  const terrace = isObj(o.terrace) ? o.terrace : null;
  const tour = isObj(o.tour) ? o.tour : {};
  return {
    id: str(o.id, 40) || rid("p"),
    slug,
    published: bool(o.published, true),
    featured: bool(o.featured, true),
    name,
    status: str(o.status, 60),
    kind: str(o.kind, 80),
    location: str(o.location, 120),
    tagline: str(o.tagline, 160),
    summary: str(o.summary, 600),
    landingUrl: url(o.landingUrl),
    facts: arr(o.facts).filter(isObj).slice(0, 8).map((f) => ({ label: str(f.label, 40), value: str(f.value, 60) })),
    cover: img(o.cover),
    gallery: arr(o.gallery).filter(isObj).slice(0, 30).map((g) => ({ label: str(g.label, 60), img: img(g.img) })),
    facade: facade ? { title: str(facade.title, 80), day: img(facade.day), night: img(facade.night) } : null,
    concept: arr(o.concept).filter(isObj).slice(0, 12).map((g) => ({ title: str(g.title, 80), img: img(g.img) })),
    terrace: terrace
      ? { title: str(terrace.title, 80), subtitle: str(terrace.subtitle, 120), hero: img(terrace.hero), card: terrace.card ? img(terrace.card) : undefined }
      : null,
    tour: {
      title: str(tour.title, 80) || "Recorrido virtual",
      stops: arr(tour.stops).filter(isObj).slice(0, 30).map((s) => ({ name: str(s.name, 80), img: img(s.img) })),
    },
  };
}

/** Valida y sanea el contenido enviado desde el panel antes de guardarlo. */
export function validateContent(raw: unknown): Content | null {
  if (!isObj(raw)) return null;
  const c = raw;
  const company = isObj(c.company) ? c.company : {};
  const hero = isObj(c.hero) ? c.hero : {};
  const form = isObj(c.form) ? c.form : {};
  const used = new Set<string>();
  const out: Content = {
    company: {
      name: str(company.name, 80),
      tagline: str(company.tagline, 160),
      phone: str(company.phone, 40),
      whatsapp: str(company.whatsapp, 30).replace(/[^\d]/g, ""),
      email: str(company.email, 120),
      instagram: str(company.instagram, 60).replace(/^@/, ""),
      facebook: url(company.facebook),
      address: str(company.address, 200),
    },
    hero: {
      eyebrow: str(hero.eyebrow, 120),
      lines: arr(hero.lines).map((l) => str(l, 40)).filter(Boolean).slice(0, 4),
      projectSlug: str(hero.projectSlug, 90),
      cta1: str(hero.cta1, 40),
      cta2: str(hero.cta2, 40),
    },
    services: arr(c.services).filter(isObj).slice(0, 8).map((s) => ({ id: str(s.id, 40) || rid("s"), title: str(s.title, 80), short: str(s.short, 160) })),
    projects: arr(c.projects).slice(0, 40).map((p) => project(p, used)),
    portfolio: arr(c.portfolio).filter(isObj).slice(0, 60).map((p) => ({
      id: str(p.id, 40) || rid("e"),
      name: str(p.name, 90),
      type: str(p.type, 40),
      tag: str(p.tag, 80),
      img: img(p.img),
    })),
    faq: arr(c.faq).filter(isObj).slice(0, 40).map((f) => ({ id: str(f.id, 40) || rid("f"), q: str(f.q, 200), a: str(f.a, 1200) })),
    form: {
      title: str(form.title, 120),
      interests: arr(form.interests).map((i) => str(i, 60)).filter(Boolean).slice(0, 12),
      submitLabel: str(form.submitLabel, 40) || "Enviar mensaje",
      successMessage: str(form.successMessage, 200),
    },
  };
  return normalize(out);
}
