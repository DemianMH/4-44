"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { Project } from "@/lib/types";
import { Pic } from "../Pic";

/** La fachada pasa de día a noche con el scroll: una cortina de luz recorre el render. */
export function DiaNoche({ facade }: { facade: NonNullable<Project["facade"]> }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const reveal = useTransform(scrollYProgress, [0.1, 0.9], [0, 100]);
  const clip = useTransform(reveal, (v) => `inset(0 ${100 - v}% 0 0)`);
  const edge = useTransform(reveal, (v) => `${v}%`);
  const scale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);

  const [first, ...rest] = facade.title.split(/(?<=\.)\s+/);

  return (
    <section ref={ref} aria-label={facade.title} data-tone="dark" className="relative h-[240svh] bg-ink">
      <div className="sticky top-0 h-svh overflow-hidden">
        <motion.div className="absolute inset-0" style={{ scale }}>
          <Pic img={facade.day} sizes="100vw" quality={90} className="object-cover" />
        </motion.div>
        <motion.div className="absolute inset-0" style={{ clipPath: clip, scale }}>
          <Pic img={facade.night} alt="" sizes="100vw" quality={90} className="object-cover" />
        </motion.div>
        <motion.div aria-hidden className="absolute inset-y-0 w-px bg-white shadow-[0_0_24px_4px_rgba(245,126,37,0.8)]" style={{ left: edge }} />

        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/30" />
        <div className="absolute inset-x-0 bottom-0 px-5 pb-12 text-white md:px-10">
          <h2 className="font-display text-[clamp(2rem,5vw,4.4rem)] font-extrabold leading-[1] tracking-[-0.035em]">
            {first}
            {rest.length > 0 && (
              <>
                <br />
                <span className="text-orange">{rest.join(" ")}</span>
              </>
            )}
          </h2>
        </div>
      </div>
    </section>
  );
}
