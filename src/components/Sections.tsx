import { FAQ, MACHINERY, PROCESS, PROJECTS, RENTAL_TERMS, SERVICES, SITE } from "@/lib/site";
import { ContactForm } from "./ContactForm";
import { Logo } from "./Logo";
import { ProjectCard } from "./ProjectCard";
import { Reveal } from "./Reveal";

const PAD = "px-5 py-[clamp(6rem,14vw,13rem)] md:px-10";
const WRAP = "mx-auto max-w-[1600px]";
const EYEBROW = "text-[11px] font-medium uppercase tracking-[0.3em] text-corten";
const H2 = "font-display text-[clamp(2rem,5vw,4.4rem)] font-black leading-[1] tracking-[-0.035em]";

export function Manifesto() {
  return (
    <section aria-label="Manifiesto" className="bg-concrete px-5 py-[clamp(5rem,12vw,11rem)] md:px-10">
      <div className={`${WRAP} grid grid-cols-12 gap-x-4`}>
        <Reveal className="col-span-12 md:col-span-10 md:col-start-3">
          <p className="font-display text-[clamp(1.5rem,3.6vw,3.2rem)] font-bold leading-[1.15] tracking-[-0.03em]">
            Desarrollamos y construimos inmuebles con la precisión de un plano y la{" "}
            <span className="text-corten">paciencia de la obra bien hecha</span>. Cada proyecto nace de medir dos veces y cuidar el valor de quien lo habita o invierte en él.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export function Services() {
  return (
    <section id="servicios" className={`bg-obsidian ${PAD}`}>
      <div className={`${WRAP} grid grid-cols-12 gap-x-4 gap-y-16`}>
        <div className="col-span-12 md:col-span-5">
          <p className={EYEBROW}>Servicios / 04</p>
          <h2 className={`${H2} mt-6`}>
            Cuatro líneas.
            <br />
            <span className="text-corten">Un estándar.</span>
          </h2>
        </div>
        <ul className="col-span-12 md:col-span-6 md:col-start-7">
          {SERVICES.map((s, i) => (
            <li key={s.id}>
              <Reveal delay={i * 0.05} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-[var(--line)] py-8">
                <span className="text-xs text-corten">{s.id}</span>
                <div>
                  <h3 className="font-display text-xl font-bold md:text-2xl">{s.title}</h3>
                  <p className="mt-3 max-w-[56ch] text-sm leading-relaxed text-dim">{s.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Machinery() {
  return (
    <section id="maquinaria" className={`bg-concrete ${PAD}`}>
      <div className={`${WRAP} grid grid-cols-12 gap-x-4 gap-y-12`}>
        <div className="col-span-12 md:col-span-6">
          <p className={EYEBROW}>4:44 Maquinaria</p>
          <h2 className={`${H2} mt-6`}>
            Equipo para obra, <span className="text-corten">por el tiempo que lo necesites.</span>
          </h2>
          <ul className="mt-10 flex flex-wrap gap-2" aria-label="Periodos de renta">
            {RENTAL_TERMS.map((t) => (
              <li key={t} className="border border-limestone/40 px-4 py-2 text-[11px] uppercase tracking-[0.22em]">
                Por {t.toLowerCase()}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-12 md:col-span-5 md:col-start-8">
          <dl className="border-t border-[var(--line)]">
            {MACHINERY.map((m) => (
              <Reveal key={m.name} className="grid gap-1 border-b border-[var(--line)] py-6">
                <dt className="font-display text-lg font-bold">{m.name}</dt>
                <dd className="text-sm text-dim">{m.use}</dd>
              </Reveal>
            ))}
          </dl>
          <a
            href="#contacto"
            className="mt-8 inline-block border-b border-corten pb-1 text-[12px] uppercase tracking-[0.2em] text-corten transition-colors duration-500 hover:text-limestone"
          >
            Cotizar renta →
          </a>
        </div>
      </div>
    </section>
  );
}

export function Projects() {
  return (
    <section id="proyectos" className={`bg-obsidian ${PAD}`}>
      <div className={WRAP}>
        <p className={EYEBROW}>Portafolio / {String(PROJECTS.length).padStart(2, "0")}</p>
        <h2 className={`${H2} mt-6 max-w-[16ch]`}>Obra que se puede recorrer.</h2>
        <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROJECTS.map((p, i) => (
            <li key={p.name} className={i % 3 === 1 ? "lg:translate-y-10" : ""}>
              <ProjectCard project={p} index={i} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Process() {
  return (
    <section id="proceso" className={`bg-concrete ${PAD}`}>
      <div className={WRAP}>
        <p className={EYEBROW}>Proceso / 04</p>
        <h2 className={`${H2} mt-6`}>De la línea al inmueble.</h2>
        <ol className="mt-16 grid gap-px border border-[var(--line)] bg-[var(--line)] md:grid-cols-4">
          {PROCESS.map((s) => (
            <li key={s.id} className="bg-concrete p-6 md:min-h-72 md:p-8">
              <span className="text-xs text-corten">{s.id}</span>
              <h3 className="mt-10 font-display text-xl font-bold">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-dim">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section id="faq" className={`bg-obsidian ${PAD}`}>
      <div className={`${WRAP} grid grid-cols-12 gap-x-4 gap-y-12`}>
        <div className="col-span-12 md:col-span-4">
          <p className={EYEBROW}>Preguntas frecuentes</p>
          <h2 className={`${H2} mt-6`}>Lo esencial.</h2>
        </div>
        <div className="col-span-12 md:col-span-7 md:col-start-6">
          {FAQ.map((f) => (
            <details key={f.q} className="group border-t border-[var(--line)] py-6 last:border-b">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-lg font-bold [&::-webkit-details-marker]:hidden">
                {f.q}
                <span aria-hidden className="text-corten transition-transform duration-500 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-[60ch] text-sm leading-relaxed text-dim">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contacto" className={`bg-concrete ${PAD}`}>
      <div className={`${WRAP} grid grid-cols-12 gap-x-4 gap-y-16`}>
        <div className="col-span-12 md:col-span-5">
          <p className={EYEBROW}>Contacto</p>
          <h2 className={`${H2} mt-6`}>
            ¿Construimos
            <br />
            <span className="text-corten">juntos?</span>
          </h2>
          <p className="mt-8 max-w-[40ch] text-sm leading-relaxed text-dim">
            Cuéntanos qué quieres construir, rentar o supervisar. Respondemos con una propuesta clara.
          </p>
        </div>
        <div className="col-span-12 md:col-span-6 md:col-start-7">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-obsidian px-5 py-16 md:px-10">
      <div className={`${WRAP} flex flex-col justify-between gap-10 md:flex-row md:items-end`}>
        <Logo className="h-8 w-auto text-limestone" />
        <div className="text-sm leading-relaxed text-dim">
          <p>{SITE.tagline}</p>
          <p>{SITE.city}</p>
          <p className="mt-4 text-xs">© 2026 {SITE.name}. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
