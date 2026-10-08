"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import type { Project } from "@/lib/types";
import { Magnetic } from "../Magnetic";
import { Pic } from "../Pic";

const EASE = [0.16, 1, 0.3, 1] as const;

const rise = (i: number) => ({
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.1, delay: 0.25 + i * 0.12, ease: EASE },
});

/** Portada de la página de un proyecto: render a pantalla completa con parallax y datos clave. */
export function ProjectHero({ project }: { project: Project }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 55, damping: 20 });
  const sy = useSpring(my, { stiffness: 55, damping: 20 });
  const bgX = useTransform(sx, [-0.5, 0.5], ["1.8%", "-1.8%"]);
  const bgY = useTransform(sy, [-0.5, 0.5], ["1.2%", "-1.2%"]);

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <section ref={ref} id="top" data-tone="dark" onPointerMove={onMove} className="relative min-h-svh overflow-hidden bg-ink text-white">
      <motion.div className="absolute -inset-[7%]" style={{ y: imgY }} aria-hidden>
        <motion.div className="relative h-full w-full" style={{ x: bgX, y: bgY }} initial={{ scale: 1.18 }} animate={{ scale: 1 }} transition={{ duration: 3, ease: EASE }}>
          <Pic img={project.cover} alt="" priority sizes="100vw" quality={90} className="object-cover" />
        </motion.div>
      </motion.div>
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,rgba(29,32,33,0.7)_0%,rgba(29,32,33,0.35)_50%,rgba(29,32,33,0.05)_100%)]" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/90 to-transparent" />

      <motion.div className="relative mx-auto flex min-h-svh max-w-[100rem] flex-col justify-end px-5 pb-10 pt-32 md:px-10" style={{ y: textY, opacity: fade }}>
        <motion.div {...rise(0)}>
          <Link href="/#proyectos" className="inline-flex items-center gap-2 text-[0.75rem] font-bold uppercase tracking-[0.2em] text-white/85 transition-colors duration-500 hover:text-orange">
            <span aria-hidden>←</span> Todos los proyectos
          </Link>
        </motion.div>

        <motion.p {...rise(1)} className="mb-5 mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.75rem] font-bold uppercase tracking-[0.22em] text-orange">
          <span className="bg-orange px-3 py-1.5 text-ink">{project.status}</span>
          <span>
            {project.kind} · {project.location}
          </span>
        </motion.p>

        <motion.h1 {...rise(2)} className="font-display text-[clamp(2.6rem,min(9vw,16svh),8.6rem)] font-extrabold leading-[0.95] tracking-[-0.04em]">
          {project.name}
        </motion.h1>
        <motion.p {...rise(3)} className="mt-6 max-w-[40ch] text-[clamp(1.05rem,1.6vw,1.5rem)] leading-snug text-white/90">
          {project.tagline}
        </motion.p>

        <motion.div {...rise(4)} className="mt-9 flex flex-wrap items-center gap-4">
          {project.landingUrl && (
            <Magnetic>
              <a
                href={project.landingUrl}
                target="_blank"
                rel="noopener"
                className="inline-flex bg-orange px-8 py-4 text-[0.8125rem] font-bold uppercase tracking-[0.16em] text-ink transition-colors duration-500 hover:bg-white"
              >
                Ir a la landing ↗
              </a>
            </Magnetic>
          )}
          <Magnetic>
            <a
              href="#contacto"
              className={`inline-flex px-8 py-4 text-[0.8125rem] font-bold uppercase tracking-[0.16em] transition-colors duration-500 ${
                project.landingUrl ? "border-2 border-white text-white hover:bg-white hover:text-ink" : "bg-orange text-ink hover:bg-white"
              }`}
            >
              Solicitar información
            </a>
          </Magnetic>
        </motion.div>

        {project.facts.length > 0 && (
          <motion.dl {...rise(5)} className="mt-12 flex flex-wrap gap-x-12 gap-y-5 border-t border-white/25 pt-5">
            {project.facts.map((f) => (
              <div key={f.label}>
                <dd className="font-display text-2xl font-extrabold md:text-3xl">{f.value}</dd>
                <dt className="mt-1 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-white/80">{f.label}</dt>
              </div>
            ))}
          </motion.dl>
        )}
      </motion.div>
    </section>
  );
}
