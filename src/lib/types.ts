/** Imagen del sitio: ruta, medidas, texto alternativo y miniatura borrosa para la carga progresiva. */
export type Img = { src: string; w: number; h: number; alt: string; blur?: string };

export type Fact = { label: string; value: string };

export type Project = {
  id: string;
  slug: string;
  published: boolean;
  featured: boolean;
  name: string;
  status: string;
  kind: string;
  location: string;
  tagline: string;
  summary: string;
  /** Landing externa del proyecto (vacío si aún no existe). */
  landingUrl: string;
  facts: Fact[];
  cover: Img;
  gallery: { label: string; img: Img }[];
  facade: { title: string; day: Img; night: Img } | null;
  concept: { title: string; img: Img }[];
  terrace: { title: string; subtitle: string; hero: Img; card?: Img } | null;
  tour: { title: string; stops: { name: string; img: Img; model?: string }[] };
};

export type Company = {
  name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  instagram: string;
  facebook: string;
  address: string;
};

export type Content = {
  company: Company;
  hero: { eyebrow: string; lines: string[]; projectSlug: string; cta1: string; cta2: string };
  services: { id: string; title: string; short: string }[];
  projects: Project[];
  portfolio: { id: string; name: string; type: string; tag: string; img: Img }[];
  faq: { id: string; q: string; a: string }[];
  form: { title: string; interests: string[]; submitLabel: string; successMessage: string };
};

export type Lead = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
};
