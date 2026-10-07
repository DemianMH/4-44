import { PROJECTS, SERVICES, SITE } from "@/lib/site";

export function Sections() {
  return (
    <>
      <section id="servicios" className="bg-obsidian px-5 py-[clamp(6rem,14vw,14rem)] md:px-10">
        <div className="mx-auto grid max-w-[1600px] grid-cols-12 gap-x-4 gap-y-16">
          <h2 className="col-span-12 font-display text-[clamp(2rem,5vw,4.4rem)] font-black leading-none tracking-[-0.03em] md:col-span-5">
            Cuatro líneas.
            <br />
            <span className="text-corten">Un estándar.</span>
          </h2>
          <ul className="col-span-12 md:col-span-7 md:col-start-6">
            {SERVICES.map((s) => (
              <li key={s.id} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-[var(--line)] py-8">
                <span className="text-xs text-corten">{s.id}</span>
                <div>
                  <h3 className="font-display text-xl font-bold md:text-2xl">{s.title}</h3>
                  <p className="mt-3 max-w-[56ch] text-sm leading-relaxed text-dim">{s.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="proyectos" className="bg-concrete px-5 py-[clamp(6rem,14vw,14rem)] md:px-10">
        <div className="mx-auto max-w-[1600px]">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.3em] text-corten">
            Portafolio / {String(PROJECTS.length).padStart(2, "0")}
          </h2>
          <ul className="mt-10">
            {PROJECTS.map((p, i) => (
              <li
                key={p}
                className="group flex items-baseline justify-between gap-6 border-t border-[var(--line)] py-6 transition-[padding] duration-700 [transition-timing-function:var(--ease)] hover:pl-4 md:py-8"
              >
                <h3 className="font-display text-[clamp(1.4rem,4vw,3.4rem)] font-bold tracking-[-0.02em] transition-colors duration-500 group-hover:text-corten">
                  {p}
                </h3>
                <span className="text-xs text-dim">{String(i + 1).padStart(2, "0")}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer id="contacto" className="bg-obsidian px-5 py-24 md:px-10">
        <div className="mx-auto flex max-w-[1600px] flex-col justify-between gap-10 md:flex-row md:items-end">
          <p className="font-display text-[clamp(1.8rem,4vw,3.4rem)] font-black leading-[1.05] tracking-[-0.03em]">
            ¿Construimos
            <br />
            juntos?
          </p>
          <div className="text-sm leading-relaxed text-dim">
            <p>{SITE.name}</p>
            <p>{SITE.city}</p>
            <p className="mt-4 text-xs">
              © 2026 {SITE.name}. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
