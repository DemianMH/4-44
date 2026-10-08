"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Project } from "@/lib/types";
import { Pic } from "../Pic";
import { EYEBROW, H2, PAD, WRAP } from "./styles";

const EASE = [0.16, 1, 0.3, 1] as const;

type Stop = Project["tour"]["stops"][number];

/** Imagen del recorrido con perspectiva 3D que responde al cursor. */
function TiltView({ stop }: { stop: Stop }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 120, damping: 16 });
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), { stiffness: 120, damping: 16 });

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
    <div ref={ref} onPointerMove={onMove} onPointerLeave={reset} style={{ perspective: 1200 }} className="flex h-full items-center justify-center">
      <motion.div
        style={{ rotateX: rotX, rotateY: rotY }}
        initial={{ opacity: 0, y: 50, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.9, ease: EASE }}
        className="bg-white p-3 shadow-[0_50px_80px_-40px_rgba(29,32,33,0.55)]"
      >
        <Pic img={stop.img} fill={false} sizes="(min-width:1024px) 45vw, 92vw" className="h-auto max-h-[68svh] w-auto max-w-full object-contain" />
      </motion.div>
    </div>
  );
}

type RecorridosProps = {
  projects: Project[];
  /** En la página de un proyecto se oculta el selector de proyectos. */
  single?: boolean;
  id?: string;
};

/** Recorridos virtuales: elige proyecto y viaja por sus espacios, plantas y modelos. */
export function Recorridos({ projects, single = false, id = "recorridos" }: RecorridosProps) {
  const withTour = projects.filter((p) => p.tour.stops.length > 0);
  const [pi, setPi] = useState(0);
  const [si, setSi] = useState(0);
  if (withTour.length === 0) return null;

  const project = withTour[Math.min(pi, withTour.length - 1)];
  const stop = project.tour.stops[Math.min(si, project.tour.stops.length - 1)];

  return (
    <section id={id} data-tone="light" className={`bg-blueprint bg-paper ${PAD}`}>
      <div className={`${WRAP} grid grid-cols-12 items-center gap-x-0 gap-y-12 lg:gap-x-6`}>
        <div className="col-span-12 lg:col-span-5">
          <p className={EYEBROW}>{project.tour.title}</p>
          <h2 className={`${H2} mt-6`}>
            {single ? (
              <>
                Recorre cada <span className="text-orange-strong">espacio.</span>
              </>
            ) : (
              <>
                Entra al proyecto <span className="text-orange-strong">sin salir de casa.</span>
              </>
            )}
          </h2>

          {!single && withTour.length > 1 && (
            <div role="tablist" aria-label="Proyectos con recorrido virtual" className="mt-9 flex flex-wrap gap-2">
              {withTour.map((p, idx) => (
                <button
                  key={p.id}
                  role="tab"
                  aria-selected={pi === idx}
                  onClick={() => {
                    setPi(idx);
                    setSi(0);
                  }}
                  className={`border-2 px-4 py-2 text-[0.75rem] font-bold uppercase tracking-[0.16em] transition-colors duration-500 ${
                    pi === idx ? "border-ink bg-ink text-white" : "border-ink/30 text-graphite hover:border-orange hover:text-orange-ink"
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          )}

          <div role="tablist" aria-label="Espacios del recorrido" className="mt-8 flex flex-wrap gap-2 lg:flex-col lg:gap-0">
            {project.tour.stops.map((s, idx) => (
              <button
                key={`${project.id}-${idx}`}
                role="tab"
                aria-selected={si === idx}
                onClick={() => setSi(idx)}
                className={`group flex items-center gap-4 border-2 px-4 py-2.5 text-left transition-colors duration-500 lg:border-0 lg:border-t lg:px-0 lg:py-4 ${
                  si === idx ? "border-ink bg-ink text-white lg:bg-transparent lg:text-ink" : "border-ink/25 text-graphite hover:border-orange lg:border-[var(--line)]"
                }`}
              >
                <span className={`font-display text-xl font-extrabold lg:text-3xl ${si === idx ? "text-orange lg:text-orange-strong" : "text-graphite/50"}`}>{String(idx + 1).padStart(2, "0")}</span>
                <span className="text-[0.75rem] font-bold uppercase tracking-[0.16em]">{s.name}</span>
                <span aria-hidden className={`ml-auto hidden h-0.5 bg-orange transition-all duration-700 lg:block ${si === idx ? "w-12" : "w-0"}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="col-span-12 min-h-[55svh] lg:col-span-7" role="tabpanel">
          <AnimatePresence mode="wait">
            <TiltView key={`${project.id}-${si}`} stop={stop} />
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
