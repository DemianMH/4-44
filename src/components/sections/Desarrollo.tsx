"use client";

import { useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { R } from "@/assets/images";

type Panel = { img: StaticImageData; label: string; alt: string; portrait?: boolean };

const PANELS: Panel[] = [
  { img: R.salaA, label: "Sala", alt: "Sala con muebles en tonos grises y madera" },
  { img: R.cocinaA, label: "Cocina", alt: "Cocina integral con isla y comedor" },
  { img: R.recamaraA, label: "Recámara", alt: "Recámara principal con iluminación cálida" },
  { img: R.bano, label: "Baño", alt: "Baño con regadera y acabados de concreto", portrait: true },
  { img: R.salaD, label: "Estancia", alt: "Sala y comedor con ventanal" },
  { img: R.cocinaB, label: "Comedor", alt: "Cocina y comedor con lámparas colgantes" },
];

/** Galería de renders con scroll horizontal fijado: el scroll vertical desplaza la pista. */
export function Desarrollo() {
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

  return (
    <section ref={section} id="desarrollo" data-tone="dark" className="relative bg-ink text-white" style={{ height: `calc(100svh + ${dist}px)` }}>
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <motion.div ref={track} style={{ x }} className="flex w-max items-center gap-[4vw] pl-[6vw] pr-[10vw] will-change-transform">
          <div className="w-[82vw] shrink-0 md:w-[34vw]">
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.24em] text-orange">Inmobiliaria · Nuevo desarrollo</p>
            <h2 className="mt-6 font-display text-[clamp(2.2rem,5vw,4.6rem)] font-extrabold leading-[1.02] tracking-[-0.035em]">
              Departamentos para <span className="text-orange">vivir bien.</span>
            </h2>
            <p className="mt-6 max-w-[34ch] text-base text-white/85">Madera, concreto y luz natural. Desliza para recorrerlos.</p>
          </div>

          {PANELS.map((p, i) => (
            <figure
              key={p.label}
              className={`relative h-[52svh] shrink-0 overflow-hidden shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] md:h-[66svh] ${p.portrait ? "aspect-[4/5]" : "aspect-[16/10]"}`}
            >
              <motion.div className="absolute -inset-x-[6%] inset-y-0" style={{ x: inner }}>
                <Image src={p.img} alt={p.alt} fill sizes="(min-width:768px) 60vw, 90vw" className="object-cover" placeholder="blur" />
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
