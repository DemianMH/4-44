"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { Project } from "@/lib/types";
import { Pic } from "../Pic";

type GaleriaProps = { project: Project };

/** Galería con scroll horizontal fijado: el scroll vertical desplaza la pista de imágenes. */
export function Galeria({ project }: GaleriaProps) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);

  useEffect(() => {
    const t = track.current;
    if (!t) return;
    const measure = () => setDist(Math.max(0, t.scrollWidth - window.innerWidth));
    const ro = new ResizeObserver(measure);
    ro.observe(t);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, (v) => -v * dist);
  const inner = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  if (project.gallery.length === 0) return null;

  return (
    <section ref={section} id="galeria" data-tone="dark" className="relative bg-ink text-white" style={{ height: `calc(100svh + ${dist}px)` }}>
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <motion.div ref={track} style={{ x }} className="flex w-max items-center gap-[4vw] pl-[6vw] pr-[10vw] will-change-transform">
          <div className="w-[82vw] shrink-0 md:w-[34vw]">
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.24em] text-orange">
              {project.kind} · {project.name}
            </p>
            <h2 className="mt-6 font-display text-[clamp(2.2rem,5vw,4.6rem)] font-extrabold leading-[1.02] tracking-[-0.035em]">
              {project.tagline.replace(/\.$/, "")}
              <span className="text-orange">.</span>
            </h2>
            {project.summary && <p className="mt-6 max-w-[38ch] text-base text-white/85">{project.summary}</p>}
            <p className="mt-6 text-[0.75rem] font-bold uppercase tracking-[0.2em] text-white/70">Desliza para recorrerlo →</p>
          </div>

          {project.gallery.map((p, i) => (
            <figure
              key={`${p.label}-${i}`}
              style={{ aspectRatio: `${p.img.w} / ${p.img.h}` }}
              className="relative h-[52svh] max-w-[88vw] shrink-0 overflow-hidden shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] md:h-[66svh]"
            >
              <motion.div className="absolute -inset-x-[6%] inset-y-0" style={{ x: inner }}>
                <Pic img={p.img} sizes="(min-width:768px) 70vw, 92vw" className="object-cover" />
              </motion.div>
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-ink/85 to-transparent p-5">
                <span className="font-display text-xl font-extrabold">{p.label}</span>
                <span className="text-xs font-bold tracking-[0.2em] text-orange">{String(i + 1).padStart(2, "0")}</span>
              </figcaption>
            </figure>
          ))}
        </motion.div>

        <div aria-hidden className="absolute inset-x-[6vw] bottom-8 h-px bg-white/25">
          <motion.div className="h-full origin-left bg-orange" style={{ scaleX: scrollYProgress }} />
        </div>
      </div>
    </section>
  );
}
