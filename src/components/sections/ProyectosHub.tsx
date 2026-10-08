"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Project } from "@/lib/types";
import { Magnetic } from "../Magnetic";
import { Pic } from "../Pic";
import { EYEBROW, H2, PAD, WRAP } from "./styles";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Hub de proyectos: cada uno se explora en su propia página y, si existe, en su landing. */
export function ProyectosHub({ projects }: { projects: Project[] }) {
  return (
    <section id="proyectos" data-tone="light" className={`bg-paper ${PAD}`}>
      <div className={WRAP}>
        <p className={EYEBROW}>Proyectos / {String(projects.length).padStart(2, "0")}</p>
        <h2 className={`${H2} mt-6 max-w-[18ch]`}>
          Elige un proyecto <span className="text-orange-strong">y recórrelo.</span>
        </h2>

        <ul className="mt-16 grid gap-y-[clamp(4rem,9vw,8rem)]">
          {projects.map((p, i) => {
            const flip = i % 2 === 1;
            return (
              <li key={p.id}>
                <motion.article
                  className="grid grid-cols-12 items-center gap-x-0 gap-y-8 lg:gap-x-8"
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 1.1, ease: EASE }}
                >
                  <Link
                    href={`/proyectos/${p.slug}`}
                    aria-label={`Explorar ${p.name}`}
                    className={`group relative col-span-12 block aspect-[16/11] overflow-hidden bg-stone shadow-[0_50px_80px_-50px_rgba(29,32,33,0.6)] lg:col-span-7 ${flip ? "lg:order-2" : ""}`}
                  >
                    <Pic img={p.cover} sizes="(min-width:1024px) 58vw, 100vw" className="object-cover transition-transform duration-[1600ms] [transition-timing-function:var(--ease)] group-hover:scale-[1.06]" />
                    <span className="absolute left-4 top-4 bg-orange px-3 py-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-ink">{p.status}</span>
                    <span className="absolute bottom-4 right-4 grid h-14 w-14 place-items-center bg-white text-2xl text-ink transition-all duration-500 group-hover:bg-orange" aria-hidden>
                      →
                    </span>
                  </Link>

                  <div className={`col-span-12 lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
                    <p className="font-display text-6xl font-extrabold text-stone">{String(i + 1).padStart(2, "0")}</p>
                    <p className="mt-4 text-[0.75rem] font-bold uppercase tracking-[0.2em] text-graphite">
                      {p.kind} · {p.location}
                    </p>
                    <h3 className="mt-3 font-display text-[clamp(2rem,4vw,3.6rem)] font-extrabold leading-[1] tracking-[-0.03em] text-ink">{p.name}</h3>
                    <p className="mt-4 max-w-[34ch] text-base leading-relaxed text-graphite">{p.tagline}</p>

                    {p.facts.length > 0 && (
                      <dl className="mt-7 flex flex-wrap gap-x-8 gap-y-4 border-t border-[var(--line)] pt-5">
                        {p.facts.map((f) => (
                          <div key={f.label}>
                            <dd className="font-display text-xl font-extrabold text-ink">{f.value}</dd>
                            <dt className="mt-0.5 text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-graphite">{f.label}</dt>
                          </div>
                        ))}
                      </dl>
                    )}

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                      <Magnetic>
                        <Link
                          href={`/proyectos/${p.slug}`}
                          className="inline-flex bg-orange px-7 py-4 text-[0.8125rem] font-bold uppercase tracking-[0.16em] text-ink transition-colors duration-500 hover:bg-ink hover:text-white"
                        >
                          Explorar proyecto →
                        </Link>
                      </Magnetic>
                      {p.landingUrl && (
                        <Magnetic>
                          <a
                            href={p.landingUrl}
                            target="_blank"
                            rel="noopener"
                            className="inline-flex border-2 border-ink px-7 py-[0.875rem] text-[0.8125rem] font-bold uppercase tracking-[0.16em] text-ink transition-colors duration-500 hover:bg-ink hover:text-white"
                          >
                            Ir a la landing ↗
                          </a>
                        </Magnetic>
                      )}
                    </div>
                  </div>
                </motion.article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
