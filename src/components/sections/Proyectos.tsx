"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { PROJECTS } from "@/lib/site";
import { EYEBROW, H2, PAD, WRAP } from "./styles";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Proyectos() {
  return (
    <section id="proyectos" className={`bg-white ${PAD}`}>
      <div className={WRAP}>
        <p className={EYEBROW}>Portafolio / {String(PROJECTS.length).padStart(2, "0")}</p>
        <h2 className={`${H2} mt-6`}>
          Obra <span className="text-orange-strong">entregada.</span>
        </h2>

        <ul className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {PROJECTS.map((p, i) => (
            <motion.li
              key={p.name}
              className={i % 2 === 1 ? "md:translate-y-12" : ""}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 1, delay: (i % 4) * 0.08, ease: EASE }}
            >
              <article className="group relative aspect-[4/5] overflow-hidden bg-stone">
                <Image
                  src={p.img}
                  alt={`${p.name}, ${p.tag}`}
                  fill
                  sizes="(min-width:768px) 25vw, 50vw"
                  className="object-cover transition-transform duration-[1400ms] [transition-timing-function:var(--ease)] group-hover:scale-[1.07]"
                  placeholder="blur"
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
                <span className="absolute left-3 top-3 bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-ink">{p.type}</span>
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <h3 className="font-display text-lg font-extrabold leading-tight md:text-xl">{p.name}</h3>
                  <span aria-hidden className="mt-3 block h-0.5 w-8 bg-orange transition-all duration-700 [transition-timing-function:var(--ease)] group-hover:w-full" />
                </div>
              </article>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
