"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Project } from "@/lib/site";

/** Plano abstracto único por proyecto (determinista a partir del índice). */
function Plan({ seed }: { seed: number }) {
  const a = 20 + ((seed * 37) % 40);
  const b = 30 + ((seed * 53) % 50);
  const c = 15 + ((seed * 29) % 35);
  return (
    <svg viewBox="0 0 200 140" className="h-full w-full" fill="none" aria-hidden>
      <g stroke="rgba(241,238,231,.35)" strokeWidth="1" vectorEffect="non-scaling-stroke">
        <rect x="14" y="14" width="172" height="112" />
        <path d={`M${a + 14} 14V126M14 ${b + 14}H186`} />
        <rect x={a + 14} y={b + 14} width={c + 40} height={50 - (seed % 3) * 8} />
        <path d={`M14 126L${a + 14} ${b + 14}M186 14L${a + c + 54} ${b + 14}`} strokeDasharray="3 4" />
      </g>
      <circle cx={a + 14} cy={b + 14} r="3" fill="var(--corten)" />
    </svg>
  );
}

type Props = { project: Project; index: number };

export function ProjectCard({ project, index }: Props) {
  const ref = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 160, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), { stiffness: 160, damping: 18 });

  const onMove = (e: React.PointerEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div style={{ perspective: 900 }}>
      <motion.article
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={reset}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="group relative flex aspect-[4/5] flex-col justify-between overflow-hidden border border-[var(--line)] bg-obsidian p-5 transition-colors duration-700 hover:border-corten"
      >
        <div className="flex items-start justify-between text-[10px] uppercase tracking-[0.25em] text-dim">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span>{project.type}</span>
        </div>
        <div className="absolute inset-x-4 top-12 h-[48%] opacity-80 transition-opacity duration-700 group-hover:opacity-100" style={{ transform: "translateZ(30px)" }}>
          <Plan seed={index + 1} />
        </div>
        <div style={{ transform: "translateZ(50px)" }}>
          <h3 className="font-display text-xl font-bold leading-tight tracking-[-0.02em] md:text-2xl">{project.name}</h3>
          <p className="mt-2 text-xs text-dim">{project.tag}</p>
        </div>
      </motion.article>
    </div>
  );
}
