"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

type CountUpProps = { to: number; suffix?: string; pad?: number; className?: string };

/** Contador que sube hasta su valor al entrar en pantalla. */
export function CountUp({ to, suffix = "", pad = 2, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.8, ease: [0.16, 1, 0.3, 1], onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to]);

  return (
    <span ref={ref} className={className}>
      {String(v).padStart(pad, "0")}
      {suffix}
    </span>
  );
}
