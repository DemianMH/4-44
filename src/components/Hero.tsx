"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { CountUp } from "./CountUp";
import { Magnetic } from "./Magnetic";
import { Marquee } from "./Marquee";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

const EASE = [0.16, 1, 0.3, 1] as const;
const T0 = 2.9; // el hero entra mientras el preloader se retira

const rise = (i: number) => ({
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.2, delay: T0 + 0.5 + i * 0.12, ease: EASE },
});

const WORDS = ["Construimos", "lo que", "permanece."];

const STATS = [
  { to: 8, label: "Proyectos" },
  { to: 4, label: "Líneas de servicio" },
  { to: 4, label: "Modalidades de renta" },
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-paper">
      <div className="bg-blueprint absolute inset-0" aria-hidden />
      <div className="absolute inset-0" aria-hidden>
        <Scene />
      </div>
      {/* Overlay de legibilidad: el texto siempre va sobre blanco casi sólido */}
      <div aria-hidden className="absolute inset-0 bg-white/80 md:hidden" />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.96)_0%,rgba(255,255,255,0.88)_40%,rgba(255,255,255,0)_78%)]"
      />

      <div className="relative mx-auto grid min-h-svh max-w-[1600px] grid-cols-12 gap-x-4 px-5 pb-10 pt-32 md:px-10">
        <div className="col-span-12 flex flex-col justify-center md:col-span-8 lg:col-span-7">
          <motion.p {...rise(0)} className="mb-8 flex items-center gap-4 text-[12px] font-bold uppercase tracking-[0.24em] text-orange-ink">
            <span className="h-0.5 w-12 bg-orange" /> Desarrollo y construcción · Guadalajara
          </motion.p>

          <h1 className="font-display text-[clamp(2.4rem,6.6vw,6.6rem)] font-extrabold leading-[0.96] tracking-[-0.035em] text-ink">
            {WORDS.map((w, i) => (
              <span key={w} className="block overflow-hidden pb-[0.1em]">
                <motion.span
                  className={`block ${i === 2 ? "text-orange-strong" : ""}`}
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

          {/* Cota de plano animada */}
          <motion.div
            aria-hidden
            className="mt-8 flex max-w-md origin-left items-center text-[10px] font-semibold uppercase tracking-[0.2em] text-graphite"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.4, delay: T0 + 1, ease: EASE }}
          >
            <span className="h-3 w-px bg-graphite" />
            <span className="h-px flex-1 bg-graphite" />
            <span className="px-3">4:44</span>
            <span className="h-px flex-1 bg-graphite" />
            <span className="h-3 w-px bg-graphite" />
          </motion.div>

          <motion.p {...rise(4)} className="mt-8 max-w-[46ch] text-base leading-relaxed text-graphite">
            Casas, edificios y proyectos de inversión en Guadalajara. Diseño con rigor técnico, obra supervisada y maquinaria propia.
          </motion.p>

          <motion.div {...rise(5)} className="mt-8 flex flex-wrap items-center gap-4">
            <Magnetic>
              <a
                href="#proyectos"
                className="group inline-flex items-center gap-3 bg-orange px-8 py-4 text-[13px] font-bold uppercase tracking-[0.16em] text-ink transition-colors duration-500 [transition-timing-function:var(--ease)] hover:bg-ink hover:text-white"
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
                className="inline-flex border-2 border-ink px-8 py-[14px] text-[13px] font-bold uppercase tracking-[0.16em] text-ink transition-colors duration-500 [transition-timing-function:var(--ease)] hover:bg-ink hover:text-white"
              >
                Iniciar proyecto
              </a>
            </Magnetic>
          </motion.div>
        </div>

        <motion.dl
          {...rise(6)}
          className="col-span-12 mt-14 grid grid-cols-3 gap-px self-end border border-[var(--line)] bg-[var(--line)] md:col-span-6 md:col-start-1 lg:col-span-5"
        >
          {STATS.map((s) => (
            <div key={s.label} className="bg-white/90 p-4 backdrop-blur-sm">
              <dd className="font-display text-3xl font-extrabold text-ink">
                <CountUp to={s.to} />
              </dd>
              <dt className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-graphite">{s.label}</dt>
            </div>
          ))}
        </motion.dl>
      </div>

      <Marquee />
    </section>
  );
}
