"use client";

import { motion } from "framer-motion";

/** Cinta métrica que se extiende al entrar en pantalla. */
export function Ruler({ className = "" }: { className?: string }) {
  return (
    <motion.div
      aria-hidden
      className={`ruler origin-left ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}
