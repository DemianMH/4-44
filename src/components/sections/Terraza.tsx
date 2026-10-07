"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { R } from "@/assets/images";

/** Banda a sangre con parallax: la terraza en azotea. */
export function Terraza() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const cardY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section ref={ref} aria-label="Terraza en azotea" data-tone="dark" className="relative h-[90svh] overflow-hidden bg-ink text-white">
      <motion.div className="absolute -inset-y-[12%] inset-x-0" style={{ y }}>
        <Image src={R.terrazaB} alt="Terraza en azotea con pérgola, sillones y sombrilla al atardecer" fill sizes="100vw" quality={90} className="object-cover" placeholder="blur" />
      </motion.div>
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-ink/30" />

      <div className="relative mx-auto flex h-full max-w-[100rem] items-end justify-between gap-8 px-5 pb-14 md:px-10">
        <h2 className="font-display text-[clamp(2.2rem,6vw,5.6rem)] font-extrabold leading-[0.98] tracking-[-0.04em]">
          Terraza
          <br />
          <span className="text-orange">en azotea.</span>
        </h2>
        <motion.div style={{ y: cardY }} className="relative hidden aspect-[4/3] w-[22vw] shrink-0 overflow-hidden border border-white/40 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)] md:block">
          <Image src={R.terrazaTecho} alt="Detalle de la pérgola con luces cálidas" fill sizes="22vw" className="object-cover" placeholder="blur" />
        </motion.div>
      </div>
    </section>
  );
}
