"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Project } from "@/lib/site";

const DRAW = "[stroke-dasharray:1] [stroke-dashoffset:0.55] transition-[stroke-dashoffset] duration-[1400ms] [transition-timing-function:var(--ease)] group-hover:[stroke-dashoffset:0]";

/** Plano en planta abstracto, único por proyecto; se termina de dibujar al pasar el cursor. */
function Plan({ seed }: { seed: number }) {
  const a = 24 + ((seed * 37) % 44);
  const b = 28 + ((seed * 53) % 46);
  const c = 22 + ((seed * 29) % 30);
  return (
    <svg viewBox="0 0 200 140" className="h-full w-full" fill="none" aria-hidden>
      <g stroke="#464a4b" strokeWidth="1.5" vectorEffect="non-scaling-stroke">
        <rect x="14" y="14" width="172" height="112" pathLength={1} className={DRAW} />
        <path d={`M${a + 14} 14V126M14 ${b + 14}H186`} pathLength={1} className={DRAW} />
        <rect x={a + 14} y={b + 14} width={c + 40} height={50 - (seed % 3) * 8} pathLength={1} className={DRAW} />
        <path d={`M14 126L${a + 14} ${b + 14}M186 14L${a + c + 54} ${b + 14}`} strokeDasharray="3 4" />
      </g>
      <rect x={a + 14} y={b + 14} width={c + 40} height={50 - (seed % 3) * 8} fill="#f57e25" fillOpacity="0.16" className="transition-[fill-opacity] duration-700 group-hover:[fill-opacity:0.4]" />
      <circle cx={a + 14} cy={b + 14} r="4" fill="#f57e25" />
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
        className="group relative flex aspect-[4/5] flex-col justify-between overflow-hidden border border-[var(--line)] bg-white p-5 transition-[border-color,box-shadow] duration-700 hover:border-orange hover:shadow-[0_40px_70px_-40px_rgba(29,32,33,0.5)]"
      >
        <div className="flex items-start justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-graphite">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span className="bg-paper px-2 py-1 text-orange-ink">{project.type}</span>
        </div>
        <div className="bg-blueprint absolute inset-x-4 top-12 h-[48%] border border-[var(--line)] bg-paper" style={{ transform: "translateZ(24px)" }}>
          <Plan seed={index + 1} />
        </div>
        <div style={{ transform: "translateZ(46px)" }}>
          <h3 className="font-display text-xl font-extrabold leading-tight tracking-[-0.02em] text-ink md:text-2xl">{project.name}</h3>
          <p className="mt-2 text-xs font-medium text-graphite">{project.tag}</p>
        </div>
        <span aria-hidden className="absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 bg-orange transition-transform duration-700 [transition-timing-function:var(--ease)] group-hover:scale-x-100" />
      </motion.article>
    </div>
  );
}
