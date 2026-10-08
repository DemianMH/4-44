"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { Project } from "@/lib/types";
import { Pic } from "../Pic";

/** Banda a sangre con parallax: terraza, jardín o área de convivencia del proyecto. */
export function Terraza({ terrace }: { terrace: NonNullable<Project["terrace"]> }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const cardY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const [first, ...rest] = terrace.title.split(/\s+/);

  return (
    <section ref={ref} aria-label={terrace.title} data-tone="dark" className="relative h-[90svh] overflow-hidden bg-ink text-white">
      <motion.div className="absolute -inset-y-[12%] inset-x-0" style={{ y }}>
        <Pic img={terrace.hero} sizes="100vw" quality={90} className="object-cover" />
      </motion.div>
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-ink/30" />

      <div className="relative mx-auto flex h-full max-w-[100rem] items-end justify-between gap-8 px-5 pb-14 md:px-10">
        <div>
          <h2 className="font-display text-[clamp(2.2rem,6vw,5.6rem)] font-extrabold leading-[0.98] tracking-[-0.04em]">
            {first}
            {rest.length > 0 && (
              <>
                <br />
                <span className="text-orange">{rest.join(" ")}</span>
              </>
            )}
          </h2>
          {terrace.subtitle && <p className="mt-5 text-base text-white/90">{terrace.subtitle}</p>}
        </div>
        {terrace.card && (
          <motion.div style={{ y: cardY }} className="relative hidden aspect-[4/3] w-[22vw] shrink-0 overflow-hidden border border-white/40 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)] md:block">
            <Pic img={terrace.card} sizes="22vw" className="object-cover" />
          </motion.div>
        )}
      </div>
    </section>
  );
}
