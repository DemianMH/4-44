"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { R } from "@/assets/images";

/** La fachada pasa de día a noche con el scroll: una cortina de luz recorre el render. */
export function DiaNoche() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const reveal = useTransform(scrollYProgress, [0.1, 0.9], [0, 100]);
  const clip = useTransform(reveal, (v) => `inset(0 ${100 - v}% 0 0)`);
  const edge = useTransform(reveal, (v) => `${v}%`);
  const scale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);

  return (
    <section ref={ref} aria-label="La fachada de día y de noche" data-tone="dark" className="relative h-[240svh] bg-ink">
      <div className="sticky top-0 h-svh overflow-hidden">
        <motion.div className="absolute inset-0" style={{ scale }}>
          <Image src={R.fachadaDia} alt="Fachada de ladrillo del desarrollo, de día" fill sizes="100vw" quality={90} className="object-cover" placeholder="blur" />
        </motion.div>
        <motion.div className="absolute inset-0" style={{ clipPath: clip, scale }}>
          <Image src={R.fachadaNoche} alt="" fill sizes="100vw" quality={90} className="object-cover" placeholder="blur" aria-hidden />
        </motion.div>
        <motion.div aria-hidden className="absolute inset-y-0 w-px bg-white shadow-[0_0_24px_4px_rgba(245,126,37,0.8)]" style={{ left: edge }} />

        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/30" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-5 pb-12 text-white md:px-10">
          <h2 className="font-display text-[clamp(2rem,5vw,4.4rem)] font-extrabold leading-[1] tracking-[-0.035em]">
            De día.
            <br />
            <span className="text-orange">De noche.</span>
          </h2>
          <p className="hidden max-w-[28ch] text-sm text-white/90 md:block">Fachada de ladrillo, balcones con vegetación y azotea habitable.</p>
        </div>
      </div>
    </section>
  );
}
