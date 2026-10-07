"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Magnetic } from "./Magnetic";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

const EASE = [0.16, 1, 0.3, 1] as const;
const T0 = 2.7; // el hero entra mientras el preloader se retira

const rise = (i: number) => ({
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.2, delay: T0 + 0.5 + i * 0.12, ease: EASE },
});

const DATA = [
  ["Ubicación", "Guadalajara, MX"],
  ["Líneas", "04"],
  ["Proyectos", "08+"],
  ["Coord.", "20.6597° N"],
];

const WORDS = ["Construimos", "lo que", "permanece."];

export function Hero() {
  return (
    <section id="top" className="relative min-h-svh overflow-hidden bg-concrete">
      <div className="absolute inset-0" aria-hidden>
        <Scene />
      </div>
      {/* Overlays de legibilidad: degradado lateral y de base */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(23,24,26,0.92)_0%,rgba(23,24,26,0.78)_38%,rgba(23,24,26,0.15)_80%)]"
      />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-obsidian to-transparent" />

      {/* Líneas guía 1px, rejilla asimétrica 4 / 44 */}
      <div aria-hidden className="pointer-events-none absolute inset-0 mx-auto max-w-[1600px]">
        <span className="absolute inset-y-0 left-[4%] w-px bg-[var(--line)]" />
        <span className="absolute inset-y-0 left-[44%] w-px bg-[var(--line)]" />
        <span className="absolute inset-x-0 top-[44%] h-px bg-[var(--line)]" />
      </div>

      <div className="relative mx-auto grid min-h-svh max-w-[1600px] grid-cols-12 gap-x-4 px-5 pb-12 pt-32 md:px-10">
        <div className="col-span-12 flex flex-col justify-end md:col-span-9 lg:col-span-8">
          <motion.p {...rise(0)} className="mb-8 flex items-center gap-4 text-[11px] uppercase tracking-[0.3em] text-corten">
            <span className="h-px w-12 bg-corten" /> 4:44 / Desarrollo y construcción
          </motion.p>

          <h1 className="font-display text-[clamp(2rem,6.4vw,6.5rem)] font-black leading-[0.92] tracking-[-0.045em] text-limestone">
            {WORDS.map((w, i) => (
              <span key={w} className="block overflow-hidden pb-[0.08em]">
                <motion.span
                  className={`block ${i === 2 ? "text-corten" : ""}`}
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.3, delay: T0 + 0.4 + i * 0.14, ease: EASE }}
                >
                  {w}
                </motion.span>
              </span>
            ))}
            <span className="sr-only"> Constructora 4:44, desarrollo y construcción de inmuebles en Guadalajara</span>
          </h1>

          <motion.p {...rise(4)} className="mt-10 max-w-[44ch] text-[15px] leading-relaxed text-dim md:ml-[10%]">
            Casas, edificios y proyectos de inversión en Guadalajara. Diseño con rigor técnico, obra supervisada y maquinaria propia.
          </motion.p>

          <motion.div {...rise(5)} className="mt-10 flex flex-wrap items-center gap-4 md:ml-[10%]">
            <Magnetic>
              <a
                href="#proyectos"
                className="group inline-flex items-center gap-3 bg-corten px-7 py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-obsidian transition-colors duration-500 [transition-timing-function:var(--ease)] hover:bg-limestone"
              >
                Ver proyectos
                <span aria-hidden className="transition-transform duration-500 [transition-timing-function:var(--ease)] group-hover:translate-x-1">
                  →
                </span>
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#contacto"
                className="inline-flex border border-limestone/50 px-7 py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-limestone backdrop-blur-sm transition-colors duration-500 [transition-timing-function:var(--ease)] hover:border-corten hover:text-corten"
              >
                Iniciar proyecto
              </a>
            </Magnetic>
          </motion.div>
        </div>

        <motion.dl
          {...rise(6)}
          className="col-span-12 mt-16 grid grid-cols-2 gap-px self-end border border-[var(--line)] bg-[var(--line)] backdrop-blur-md md:col-span-4 md:col-start-9 md:mt-0 lg:col-span-3 lg:col-start-10"
        >
          {DATA.map(([k, v]) => (
            <div key={k} className="bg-obsidian/70 p-4">
              <dt className="text-[10px] uppercase tracking-[0.25em] text-dim">{k}</dt>
              <dd className="mt-1 text-sm text-limestone">{v}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
