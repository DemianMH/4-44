"use client";

import { motion } from "framer-motion";
import type { Project } from "@/lib/types";
import { Pic } from "../Pic";
import { EYEBROW, H2, PAD, WRAP } from "./styles";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Tarjetas editoriales con el concepto y los detalles del proyecto. */
export function Concepto({ items, name }: { items: Project["concept"]; name: string }) {
  if (items.length === 0) return null;
  return (
    <section id="concepto" data-tone="light" className={`bg-white ${PAD}`}>
      <div className={WRAP}>
        <p className={EYEBROW}>Concepto</p>
        <h2 className={`${H2} mt-6 max-w-[16ch]`}>
          Detalles que <span className="text-orange-strong">hacen a {name}.</span>
        </h2>
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((c, i) => (
            <motion.li
              key={`${c.title}-${i}`}
              className={i % 2 === 1 ? "lg:translate-y-12" : ""}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 1, delay: i * 0.1, ease: EASE }}
            >
              <figure className="group relative aspect-[4/5] overflow-hidden bg-stone">
                <Pic img={c.img} sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-[1600ms] [transition-timing-function:var(--ease)] group-hover:scale-[1.07]" />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <span className="font-display text-xl font-extrabold leading-tight">{c.title}</span>
                  <span aria-hidden className="mt-3 block h-0.5 w-8 bg-orange transition-all duration-700 [transition-timing-function:var(--ease)] group-hover:w-full" />
                </figcaption>
              </figure>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
