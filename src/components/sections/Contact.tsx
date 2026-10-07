import Image from "next/image";
import { R } from "@/assets/images";
import { SITE } from "@/lib/site";
import { ContactForm } from "../ContactForm";
import { Logo } from "../Logo";
import { Magnetic } from "../Magnetic";
import { H2, WRAP } from "./styles";

export function Contact() {
  return (
    <section id="contacto" data-tone="dark" className="relative bg-ink text-white">
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[60svh] overflow-hidden">
          <Image src={R.salaB} alt="Sala del desarrollo con luz cálida" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" placeholder="blur" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-ink/10" />
          <div className="relative flex h-full min-h-[60svh] flex-col justify-end p-6 md:p-12">
            <h2 className={`${H2} max-w-[12ch]`}>
              Tu nuevo hogar <span className="text-orange">empieza aquí.</span>
            </h2>
          </div>
        </div>

        <div className="bg-white p-6 text-ink md:p-14">
          <p className="mb-8 text-[0.75rem] font-bold uppercase tracking-[0.24em] text-orange-ink">Contacto</p>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer data-tone="dark" className="relative bg-graphite px-5 pb-14 pt-20 text-white md:px-10">
      <div aria-hidden className="hazard absolute inset-x-0 top-0 h-2" />
      <div className={`${WRAP} flex flex-col justify-between gap-10 md:flex-row md:items-end`}>
        <div>
          <Logo variant="claro" height={46} />
          <p className="mt-6 max-w-[34ch] text-sm leading-relaxed text-white/85">{SITE.tagline}</p>
        </div>
        <div className="flex flex-col gap-6 md:items-end">
          <Magnetic>
            <a href="#top" className="inline-flex items-center gap-3 border-2 border-white px-6 py-3 text-[0.75rem] font-bold uppercase tracking-[0.18em] transition-colors duration-500 hover:border-orange hover:bg-orange hover:text-ink">
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
