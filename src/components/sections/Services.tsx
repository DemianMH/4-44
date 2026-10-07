"use client";

import { motion } from "framer-motion";
import { SERVICES } from "@/lib/site";
import { Reveal } from "../Reveal";
import { EYEBROW, H2, PAD, WRAP } from "./styles";

const ICONS: Record<string, string[]> = {
  "01": ["M6 32L32 10L58 32", "M14 27V56H50V27", "M26 56V40H38V56"],
  "02": ["M10 42A22 22 0 0 1 54 42", "M5 42H59", "M28 18V30", "M36 18V30", "M24 50H40"],
  "03": ["M6 50H40V42H6Z", "M10 42V32H26L30 42", "M26 32L46 14L58 28", "M58 28L52 38L46 32"],
  "04": ["M12 56V12H36V56", "M4 56H60", "M44 56V30H56V56", "M18 22H30", "M18 32H30", "M18 42H30"],
};

function Icon({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 64 64" className="h-16 w-16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" aria-hidden>
      {ICONS[id].map((d, i) => (
        <motion.path
          key={d}
          d={d}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.2 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
    </svg>
  );
}

export function Services() {
  return (
    <section id="servicios" className={`bg-paper ${PAD}`}>
      <div className={WRAP}>
        <div className="grid grid-cols-12 gap-x-4 gap-y-6">
          <div className="col-span-12 md:col-span-7">
            <p className={EYEBROW}>Servicios / 04</p>
            <h2 className={`${H2} mt-6`}>
              Cuatro líneas.
              <br />
              <span className="text-orange-strong">Un solo estándar.</span>
            </h2>
          </div>
        </div>

        <ul className="mt-16 grid gap-px border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, i) => (
            <li key={s.id} className="bg-paper">
              <Reveal delay={i * 0.08} className="h-full">
                <article className="group relative flex h-full min-h-[22rem] flex-col justify-between overflow-hidden p-7">
                  {/* Concreto que se vierte desde abajo al hacer hover */}
                  <span
                    aria-hidden
                    className="absolute inset-0 origin-bottom scale-y-0 bg-orange transition-transform duration-700 [transition-timing-function:var(--ease)] group-hover:scale-y-100"
                  />
                  <div className="relative flex items-start justify-between text-ink">
                    <Icon id={s.id} />
                    <span className="text-xs font-bold text-orange-ink transition-colors duration-500 group-hover:text-ink">{s.id}</span>
                  </div>
                  <div className="relative">
                    <h3 className="font-display text-xl font-extrabold leading-tight text-ink">{s.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-graphite transition-colors duration-500 group-hover:text-ink">{s.body}</p>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
