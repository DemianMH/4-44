"use client";

import { useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { R } from "@/assets/images";
import { EYEBROW, H2, PAD, WRAP } from "./styles";

const EASE = [0.16, 1, 0.3, 1] as const;

const PLANS: { id: string; name: string; img: StaticImageData; alt: string }[] = [
  { id: "A", name: "Planta A", img: R.planoA, alt: "Planta amueblada A: recámara y comedor vistos desde arriba" },
  { id: "B", name: "Planta B", img: R.planoB, alt: "Planta amueblada B: cocina, baño y sala vistos desde arriba" },
  { id: "C", name: "Planta C", img: R.planoC, alt: "Planta amueblada C: estancia con baño vista desde arriba" },
  { id: "D", name: "Planta D", img: R.planoD, alt: "Planta amueblada D: sala y recámara vistas desde arriba" },
  { id: "T", name: "Terraza", img: R.planoTerraza, alt: "Planta de la terraza en azotea vista desde arriba" },
];

/** Planta amueblada con perspectiva 3D que responde al cursor. */
function TiltPlan({ plan }: { plan: (typeof PLANS)[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), { stiffness: 120, damping: 16 });
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [14, -14]), { stiffness: 120, damping: 16 });

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
        <Image src={plan.img} alt={plan.alt} sizes="(min-width:1024px) 40vw, 90vw" placeholder="blur" className="h-auto max-h-[68svh] w-auto object-contain" />
      </motion.div>
    </div>
  );
}

export function Plantas() {
  const [i, setI] = useState(0);

  return (
    <section id="plantas" className={`bg-blueprint bg-paper ${PAD}`}>
      <div className={`${WRAP} grid grid-cols-12 items-center gap-x-6 gap-y-12`}>
        <div className="col-span-12 lg:col-span-5">
          <p className={EYEBROW}>Plantas</p>
          <h2 className={`${H2} mt-6`}>
            Cada metro, <span className="text-orange-strong">resuelto.</span>
          </h2>
          <div role="tablist" aria-label="Plantas del desarrollo" className="mt-10 flex flex-wrap gap-2 lg:flex-col lg:gap-0">
            {PLANS.map((p, idx) => (
              <button
                key={p.id}
                role="tab"
                aria-selected={i === idx}
                onClick={() => setI(idx)}
                className={`group flex items-center gap-5 border-2 px-5 py-3 text-left transition-colors duration-500 lg:border-0 lg:border-t lg:px-0 lg:py-5 ${
                  i === idx ? "border-ink bg-ink text-white lg:bg-transparent lg:text-ink" : "border-ink/25 text-graphite hover:border-orange lg:border-[var(--line)]"
                }`}
              >
                <span className={`font-display text-2xl font-extrabold transition-colors duration-500 lg:text-4xl ${i === idx ? "text-orange lg:text-orange-strong" : "text-graphite/50"}`}>{p.id}</span>
                <span className="text-[12px] font-bold uppercase tracking-[0.18em]">{p.name}</span>
                <span aria-hidden className={`ml-auto hidden h-0.5 bg-orange transition-all duration-700 lg:block ${i === idx ? "w-12" : "w-0"}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="col-span-12 min-h-[60svh] lg:col-span-7" role="tabpanel">
          <AnimatePresence mode="wait">
            <TiltPlan key={PLANS[i].id} plan={PLANS[i]} />
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
