import type { Content, Img } from "@/lib/types";
import { whatsappUrl } from "@/lib/content";
import { ContactForm } from "../ContactForm";
import { Logo } from "../Logo";
import { Magnetic } from "../Magnetic";
import { Pic } from "../Pic";
import { H2, WRAP } from "./styles";

type ContactProps = { content: Content; image: Img; defaultInterest?: string };

export function Contact({ content, image, defaultInterest }: ContactProps) {
  const { company, form } = content;
  const names = content.projects.filter((p) => p.published).map((p) => p.name);
  const wa = whatsappUrl(content, defaultInterest ? `Hola, me interesa ${defaultInterest}.` : "Hola, me gustaría recibir información.");
  const phoneHref = company.phone ? `tel:${company.phone.replace(/[^\d+]/g, "")}` : null;
  const [first, ...rest] = form.title.split(/(?<=\.)\s+|\s+(?=empieza)/);

  return (
    <section id="contacto" data-tone="dark" className="relative bg-ink text-white">
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[60svh] overflow-hidden">
          <Pic img={image} sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-ink/10" />
          <div className="relative flex h-full min-h-[60svh] flex-col justify-end gap-8 p-6 md:p-12">
            <h2 className={`${H2} max-w-[14ch]`}>
              {first} {rest.length > 0 && <span className="text-orange">{rest.join(" ")}</span>}
            </h2>
            <ul className="grid gap-2 text-base text-white/90">
              {phoneHref && (
                <li>
                  <a href={phoneHref} className="transition-colors duration-500 hover:text-orange">
                    {company.phone}
                  </a>
                </li>
              )}
              {company.email && (
                <li>
                  <a href={`mailto:${company.email}`} className="transition-colors duration-500 hover:text-orange">
                    {company.email}
                  </a>
                </li>
              )}
              {company.address && <li>{company.address}</li>}
            </ul>
            {wa && (
              <Magnetic className="self-start">
                <a href={wa} target="_blank" rel="noopener" className="inline-flex items-center gap-3 bg-orange px-7 py-4 text-[0.8125rem] font-bold uppercase tracking-[0.16em] text-ink transition-colors duration-500 hover:bg-white">
                  Escribir por WhatsApp →
                </a>
              </Magnetic>
            )}
          </div>
        </div>

        <div className="bg-white p-6 text-ink md:p-14">
          <p className="mb-8 text-[0.75rem] font-bold uppercase tracking-[0.24em] text-orange-ink">Contacto</p>
          <ContactForm form={form} projects={names} defaultInterest={defaultInterest} />
        </div>
      </div>
    </section>
  );
}

export function Footer({ company }: { company: Content["company"] }) {
  const links = [
    company.instagram && { label: "Instagram", href: `https://instagram.com/${company.instagram}` },
    company.facebook && { label: "Facebook", href: company.facebook },
  ].filter(Boolean) as { label: string; href: string }[];
  return (
    <footer data-tone="dark" className="relative bg-graphite px-5 pb-14 pt-20 text-white md:px-10">
      <div aria-hidden className="hazard absolute inset-x-0 top-0 h-2" />
      <div className={`${WRAP} flex flex-col justify-between gap-10 md:flex-row md:items-end`}>
        <div>
          <Logo variant="claro" height={46} />
          <p className="mt-6 max-w-[34ch] text-sm leading-relaxed text-white/85">{company.tagline}</p>
          {links.length > 0 && (
            <ul className="mt-5 flex gap-5 text-[0.75rem] font-bold uppercase tracking-[0.18em]">
              {links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} target="_blank" rel="noopener" className="transition-colors duration-500 hover:text-orange">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex flex-col gap-6 md:items-end">
          <Magnetic>
            <a href="#top" className="inline-flex items-center gap-3 border-2 border-white px-6 py-3 text-[0.75rem] font-bold uppercase tracking-[0.18em] transition-colors duration-500 hover:border-orange hover:bg-orange hover:text-ink">
              Volver arriba <span aria-hidden>↑</span>
            </a>
          </Magnetic>
          <div className="text-sm leading-relaxed text-white/80 md:text-right">
            <p>{company.address}</p>
            <p className="mt-3 text-xs">© 2026 {company.name}. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
