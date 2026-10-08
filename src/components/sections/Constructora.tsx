"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useInView } from "framer-motion";
import type { Content } from "@/lib/types";
import { Reveal } from "../Reveal";
import { EYEBROW, H2, PAD, WRAP } from "./styles";

const Scene = dynamic(() => import("../Scene"), { ssr: false });

const ICONS: string[][] = [
  ["M6 32L32 10L58 32", "M14 27V56H50V27", "M26 56V40H38V56"],
  ["M12 56H52", "M24 56V10", "M24 10H58", "M24 10L10 20", "M46 10V30", "M42 30H50V36H42Z"],
  ["M10 42A22 22 0 0 1 54 42", "M5 42H59", "M28 18V30", "M36 18V30", "M24 50H40"],
  ["M12 56V12H36V56", "M4 56H60", "M44 56V30H56V56", "M18 22H30", "M18 32H30", "M18 42H30"],
];

function Icon({ index }: { index: number }) {
  return (
    <svg viewBox="0 0 64 64" className="h-12 w-12 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" aria-hidden>
      {ICONS[index % ICONS.length].map((d, i) => (
        <motion.path
          key={d}
          d={d}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.2 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
    </svg>
  );
}

export function Constructora({ services }: { services: Content["services"] }) {
  const box = useRef<HTMLDivElement>(null);
  // El 3D solo se monta cuando la sección está por entrar en pantalla (ahorra carga inicial)
  const near = useInView(box, { once: true, margin: "300px" });

  return (
    <section id="constructora" data-tone="light" className={`bg-blueprint bg-paper ${PAD}`}>
      <div className={`${WRAP} grid grid-cols-12 items-center gap-x-0 gap-y-14 lg:gap-x-8`}>
        <div ref={box} className="relative col-span-12 aspect-[5/6] w-full overflow-hidden border border-[var(--line)] bg-white/70 lg:col-span-6">
          {near && <Scene />}
          <span className="pointer-events-none absolute bottom-4 left-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-graphite">Obra en curso · 3D</span>
        </div>

        <div className="col-span-12 lg:col-span-5 lg:col-start-8">
          <p className={EYEBROW}>Constructora</p>
          <h2 className={`${H2} mt-6`}>
            Obra propia, <span className="text-orange-strong">de cimientos a llaves.</span>
          </h2>
          <ul className="mt-10">
            {services.map((s, i) => (
              <li key={s.id}>
                <Reveal delay={i * 0.06} className="flex items-center gap-5 border-t border-[var(--line)] py-5 text-ink">
                  <Icon index={i} />
                  <div>
                    <h3 className="font-display text-lg font-extrabold">{s.title}</h3>
                    <p className="mt-1 text-sm text-graphite">{s.short}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
