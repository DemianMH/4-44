"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";

/** "Avance de obra": una columna que se llena con el scroll, como el edificio. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const [pct, setPct] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setPct(Math.round(v * 100)));

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-3 2xl:flex"
    >
      <span className="text-[10px] font-bold tabular-nums tracking-[0.18em] text-graphite">{String(pct).padStart(2, "0")}%</span>
      <div className="relative h-[34vh] w-2 border border-graphite/50 bg-white/70 backdrop-blur-sm">
        <motion.div className="absolute inset-x-0 bottom-0 h-full origin-bottom bg-orange" style={{ scaleY: scrollYProgress }} />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(180deg,transparent_0_21px,rgba(29,32,33,0.4)_21px_22px)]" />
      </div>
      <span className="[writing-mode:vertical-rl] text-[10px] font-bold uppercase tracking-[0.24em] text-graphite">Avance de obra</span>
    </div>
  );
}
