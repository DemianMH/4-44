"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { WRAP } from "./styles";
import { Ruler } from "./shared";

const TEXT =
  "Desarrollamos y construimos inmuebles con la precisión de un plano y la paciencia de la obra bien hecha. Cada proyecto empieza midiendo dos veces.";
const ACCENT_FROM = 12; // índice de palabra desde el que se resalta en naranja

function Word({ word, i, n, progress, accent }: { word: string; i: number; n: number; progress: MotionValue<number>; accent: boolean }) {
  const opacity = useTransform(progress, [i / n, (i + 1) / n], [0.18, 1]);
  const y = useTransform(progress, [i / n, (i + 1) / n], [10, 0]);
  return (
    <motion.span style={{ opacity, y }} className={`mr-[0.28em] inline-block ${accent ? "text-orange-strong" : ""}`}>
      {word}
    </motion.span>
  );
}

export function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.55"] });
  const words = TEXT.split(" ");

  return (
    <section aria-label="Manifiesto" className="bg-white px-5 py-[clamp(5rem,12vw,10rem)] md:px-10">
      <div className={WRAP}>
        <Ruler className="mb-12" />
        <div className="grid grid-cols-12 gap-x-4">
          <p
            ref={ref}
            className="col-span-12 font-display text-[clamp(1.6rem,3.8vw,3.4rem)] font-extrabold leading-[1.15] tracking-[-0.03em] text-ink md:col-span-11 md:col-start-2"
          >
            {words.map((w, i) => (
              <Word key={`${w}-${i}`} word={w} i={i} n={words.length} progress={scrollYProgress} accent={i >= ACCENT_FROM && i < ACCENT_FROM + 6} />
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
