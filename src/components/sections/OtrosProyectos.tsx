import Link from "next/link";
import type { Project } from "@/lib/types";
import { Pic } from "../Pic";
import { EYEBROW, H2, PAD, WRAP } from "./styles";

/** Continúa el viaje: enlaces a los demás proyectos. */
export function OtrosProyectos({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;
  return (
    <section id="otros" data-tone="light" className={`bg-paper ${PAD}`}>
      <div className={WRAP}>
        <p className={EYEBROW}>Sigue explorando</p>
        <h2 className={`${H2} mt-6`}>
          Otros <span className="text-orange-strong">proyectos.</span>
        </h2>
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <li key={p.id}>
              <Link href={`/proyectos/${p.slug}`} className="group relative block aspect-[4/3] overflow-hidden bg-stone">
                <Pic img={p.cover} sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-[1600ms] [transition-timing-function:var(--ease)] group-hover:scale-[1.07]" />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <span className="text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-orange">{p.status}</span>
                  <h3 className="mt-1 font-display text-2xl font-extrabold">{p.name}</h3>
                  <span aria-hidden className="mt-3 block h-0.5 w-8 bg-orange transition-all duration-700 [transition-timing-function:var(--ease)] group-hover:w-full" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
