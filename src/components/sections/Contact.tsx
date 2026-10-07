import { SITE } from "@/lib/site";
import { ContactForm } from "../ContactForm";
import { Logo } from "../Logo";
import { Magnetic } from "../Magnetic";
import { EYEBROW, H2, PAD, WRAP } from "./styles";

export function Contact() {
  return (
    <section id="contacto" className={`bg-paper ${PAD}`}>
      <div className={`${WRAP} grid grid-cols-12 gap-x-4 gap-y-16`}>
        <div className="col-span-12 md:col-span-5">
          <p className={EYEBROW}>Contacto</p>
          <h2 className={`${H2} mt-6`}>
            ¿Construimos
            <br />
            <span className="text-orange-strong">juntos?</span>
          </h2>
          <p className="mt-8 max-w-[40ch] text-base leading-relaxed text-graphite">
            Cuéntanos qué quieres construir, rentar o supervisar. Respondemos con una propuesta clara.
          </p>
        </div>
        <div className="col-span-12 border border-[var(--line)] bg-white p-6 md:col-span-6 md:col-start-7 md:p-10">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative bg-graphite px-5 pb-14 pt-20 text-white md:px-10">
      <div aria-hidden className="hazard absolute inset-x-0 top-0 h-2" />
      <div className={`${WRAP} flex flex-col justify-between gap-10 md:flex-row md:items-end`}>
        <div>
          <Logo variant="claro" height={46} />
          <p className="mt-6 max-w-[34ch] text-sm leading-relaxed text-white/85">{SITE.tagline}</p>
        </div>
        <div className="flex flex-col gap-6 md:items-end">
          <Magnetic>
            <a href="#top" className="inline-flex items-center gap-3 border-2 border-white px-6 py-3 text-[12px] font-bold uppercase tracking-[0.18em] transition-colors duration-500 hover:border-orange hover:bg-orange hover:text-ink">
              Volver arriba <span aria-hidden>↑</span>
            </a>
          </Magnetic>
          <div className="text-sm leading-relaxed text-white/80 md:text-right">
            <p>{SITE.city}</p>
            <p className="mt-3 text-xs">© 2026 {SITE.name}. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
