"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PROJECTS } from "@/lib/site";
import { ProjectCard } from "../ProjectCard";
import { EYEBROW, H2, PAD, WRAP } from "./styles";

const TYPES = ["Todos", ...Array.from(new Set(PROJECTS.map((p) => p.type)))];

export function Projects() {
  const [filter, setFilter] = useState("Todos");
  const shown = PROJECTS.map((p, i) => ({ p, i })).filter(({ p }) => filter === "Todos" || p.type === filter);

  return (
    <section id="proyectos" className={`bg-paper ${PAD}`}>
      <div className={WRAP}>
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className={EYEBROW}>Portafolio / {String(PROJECTS.length).padStart(2, "0")}</p>
            <h2 className={`${H2} mt-6 max-w-[16ch]`}>
              Obra que se puede <span className="text-orange-strong">recorrer.</span>
            </h2>
          </div>
          <div role="group" aria-label="Filtrar proyectos" className="flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={filter === t}
                onClick={() => setFilter(t)}
                className={`border-2 px-4 py-2 text-[12px] font-bold uppercase tracking-[0.16em] transition-colors duration-500 ${
                  filter === t ? "border-ink bg-ink text-white" : "border-ink/30 text-graphite hover:border-orange hover:text-orange-ink"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <motion.ul layout className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {shown.map(({ p, i }) => (
              <motion.li
                key={p.name}
                layout
                initial={{ opacity: 0, scale: 0.92, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProjectCard project={p} index={i} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  );
}
