"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { PROCESS } from "@/lib/site";
import { EYEBROW, H2, PAD, WRAP } from "./styles";
import { Ruler } from "./shared";

type Range = [number, number];

function Draw({ d, p, range, stroke = "#464a4b", width = 2 }: { d: string; p: MotionValue<number>; range: Range; stroke?: string; width?: number }) {
  const pathLength = useTransform(p, range, [0, 1]);
  return <motion.path d={d} stroke={stroke} strokeWidth={width} fill="none" style={{ pathLength }} />;
}

function Fill({ x, y, w, h, p, range, fill, stroke = "#464a4b" }: { x: number; y: number; w: number; h: number; p: MotionValue<number>; range: Range; fill: string; stroke?: string }) {
  const opacity = useTransform(p, range, [0, 1]);
  return <motion.rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} style={{ opacity }} />;
}

/** Edificio que se construye por etapas según el scroll: cimentación → estructura → muros → acabados. */
function Building({ p }: { p: MotionValue<number> }) {
  const cols = [70, 130, 190, 250];
  const slabs = [240, 180, 120];
  return (
    <svg viewBox="0 0 320 340" className="h-full w-full" aria-hidden>
      <Draw d="M10 300H310" p={p} range={[0, 0.08]} width={2.5} />
      {/* 1. Cimentación */}
      <Draw d="M50 300V320H270V300" p={p} range={[0.05, 0.2]} />
      <Draw d="M70 320V300M130 320V300M190 320V300M250 320V300" p={p} range={[0.1, 0.22]} stroke="#f57e25" />
      <Draw d="M56 308H264M56 314H264" p={p} range={[0.12, 0.25]} stroke="#f57e25" width={1.5} />
      {/* 2. Estructura */}
      {cols.map((x, i) => (
        <Draw key={x} d={`M${x} 300V108`} p={p} range={[0.25 + i * 0.03, 0.38 + i * 0.03]} stroke="#f57e25" width={4} />
      ))}
      {slabs.map((y, i) => (
        <Draw key={y} d={`M56 ${y}H264`} p={p} range={[0.36 + i * 0.05, 0.5 + i * 0.05]} width={4} />
      ))}
      <Draw d="M56 300H264" p={p} range={[0.3, 0.4]} width={4} />
      {/* 3. Muros y ventanas */}
      {[0, 1, 2].map((f) => {
        const y = slabs[f] + 4;
        const h = (f === 0 ? 300 : slabs[f - 1]) - y - 4;
        return [0, 1, 2].map((c) => (
          <g key={`${f}-${c}`}>
            <Fill x={cols[c] + 6} y={y} w={cols[c + 1] - cols[c] - 12} h={h} p={p} range={[0.52 + f * 0.04, 0.66 + f * 0.04]} fill="#f5f3ef" />
            <Fill x={cols[c] + 22} y={y + 14} w={cols[c + 1] - cols[c] - 44} h={h - 30} p={p} range={[0.62 + f * 0.04, 0.74 + f * 0.04]} fill="#ffffff" />
          </g>
        ));
      })}
      {/* 4. Acabados */}
      <Fill x={52} y={104} w={216} h={12} p={p} range={[0.76, 0.84]} fill="#464a4b" />
      <Fill x={cols[1] + 6} y={slabs[2] + 4} w={cols[2] - cols[1] - 12} h={slabs[1] - slabs[2] - 8} p={p} range={[0.82, 0.9]} fill="#f57e25" />
      <Fill x={cols[2] + 26} y={248} w={26} h={52} p={p} range={[0.86, 0.94]} fill="#f57e25" />
      <Draw d="M52 104L160 74L268 104" p={p} range={[0.84, 0.96]} stroke="#f57e25" width={3} />
    </svg>
  );
}

export function Process() {
  const list = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: list, offset: ["start 0.55", "end 0.75"] });
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.min(PROCESS.length - 1, Math.max(0, Math.floor(v * PROCESS.length)))));

  return (
    <section id="proceso" className={`bg-white ${PAD}`}>
      <div className={WRAP}>
        <Ruler className="mb-16" />
        <p className={EYEBROW}>Proceso / 04</p>
        <h2 className={`${H2} mt-6 max-w-[18ch]`}>
          De los cimientos <span className="text-orange-strong">a la entrega.</span>
        </h2>

        <div className="mt-16 grid grid-cols-12 gap-x-4 gap-y-10">
          <div className="col-span-12 md:col-span-6">
            <div className="bg-blueprint sticky top-24 aspect-[320/340] max-h-[72vh] w-full border border-[var(--line)] bg-paper p-4">
              <Building p={scrollYProgress} />
              <span className="absolute left-4 top-4 text-[10px] font-bold uppercase tracking-[0.2em] text-graphite">
                Etapa {String(active + 1).padStart(2, "0")} / 04
              </span>
            </div>
          </div>

          <ol ref={list} className="col-span-12 md:col-span-5 md:col-start-8">
            {PROCESS.map((s, i) => (
              <li key={s.id} className="flex min-h-[44vh] flex-col justify-center border-t border-[var(--line)] py-10 md:min-h-[62vh]">
                <span className={`font-display text-6xl font-extrabold transition-colors duration-700 ${active === i ? "text-orange-strong" : "text-stone"}`}>{s.id}</span>
                <h3 className={`mt-6 font-display text-3xl font-extrabold transition-colors duration-700 ${active === i ? "text-ink" : "text-graphite/60"}`}>{s.title}</h3>
                <p className={`mt-4 max-w-[44ch] text-base leading-relaxed transition-colors duration-700 ${active === i ? "text-graphite" : "text-graphite/50"}`}>{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
