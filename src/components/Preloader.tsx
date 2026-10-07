"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "./Logo";

const EASE = [0.16, 1, 0.3, 1] as const;
const DURATION_MS = 3000;

const draw = (delay: number, duration = 1.4) => ({
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
  transition: { duration, delay, ease: EASE },
});

/** Intro: líneas guía de plano técnico que se dibujan solas y revelan el isotipo. */
export function Preloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    const t = window.setTimeout(() => setVisible(false), DURATION_MS);
    return () => {
      window.clearTimeout(t);
      document.documentElement.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!visible) document.documentElement.style.overflow = "";
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          role="status"
          aria-label="Cargando Constructora 4:44"
          className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian text-limestone"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 1, ease: EASE }}
        >
          <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100" aria-hidden>
            {[11, 50, 89].map((x, i) => (
              <motion.line
                key={`v${x}`}
                x1={x}
                x2={x}
                y1={0}
                y2={100}
                vectorEffect="non-scaling-stroke"
                stroke="rgba(241,238,231,.22)"
                strokeWidth={1}
                {...draw(0.1 + i * 0.15)}
              />
            ))}
            {[22, 50, 78].map((y, i) => (
              <motion.line
                key={`h${y}`}
                x1={0}
                x2={100}
                y1={y}
                y2={y}
                vectorEffect="non-scaling-stroke"
                stroke="rgba(241,238,231,.22)"
                strokeWidth={1}
                {...draw(0.25 + i * 0.15)}
              />
            ))}
            <motion.rect
              x={30}
              y={36}
              width={40}
              height={28}
              fill="none"
              vectorEffect="non-scaling-stroke"
              stroke="var(--corten)"
              strokeWidth={1}
              {...draw(0.7, 1.2)}
            />
          </svg>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5, ease: EASE }}
            className="relative flex flex-col items-center gap-5"
          >
            <Logo className="w-[min(60vw,22rem)] text-limestone" />
            <span className="text-[11px] uppercase tracking-[0.35em] text-dim">Desarrollo y construcción</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
