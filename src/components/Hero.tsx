"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { R } from "@/assets/images";
import { CountUp } from "./CountUp";
import { Magnetic } from "./Magnetic";

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
  { to: 4, label: "Líneas" },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 55, damping: 20 });
  const sy = useSpring(my, { stiffness: 55, damping: 20 });
  const bgX = useTransform(sx, [-0.5, 0.5], ["1.8%", "-1.8%"]);
  const bgY = useTransform(sy, [-0.5, 0.5], ["1.2%", "-1.2%"]);
  const rotY = useTransform(sx, [-0.5, 0.5], [12, -12]);
  const rotX = useTransform(sy, [-0.5, 0.5], [-8, 8]);

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <section ref={ref} id="top" data-tone="dark" onPointerMove={onMove} className="relative min-h-svh overflow-hidden bg-ink text-white">
      {/* Render de fachada con parallax de scroll (capa externa) y de mouse (capa interna) */}
      <motion.div className="absolute -inset-[7%]" style={{ y: imgY }} aria-hidden>
        <motion.div className="relative h-full w-full" style={{ x: bgX, y: bgY }} initial={{ scale: 1.18 }} animate={{ scale: 1 }} transition={{ duration: 3, delay: 2.2, ease: EASE }}>
          <Image src={R.fachadaNoche} alt="" fill priority sizes="100vw" quality={90} className="object-cover object-[62%_50%] md:object-center" placeholder="blur" />
        </motion.div>
      </motion.div>
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,rgba(29,32,33,0.7)_0%,rgba(29,32,33,0.4)_45%,rgba(29,32,33,0.04)_100%)]" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink/90 to-transparent" />

      <motion.div className="relative mx-auto flex min-h-svh max-w-[100rem] flex-col justify-end px-5 pb-10 pt-32 md:px-10" style={{ y: textY, opacity: fade }}>
        <div className="grid grid-cols-12 items-end gap-x-4">
          <div className="col-span-12 lg:col-span-8">
            <motion.p {...rise(0)} className="mb-7 flex items-center gap-4 text-[0.75rem] font-bold uppercase tracking-[0.24em] text-orange">
              <span className="h-0.5 w-12 bg-orange" /> Inmobiliaria y constructora · Guadalajara
            </motion.p>

            <h1 className="font-display text-[clamp(2.4rem,min(7.6vw,13svh),7.4rem)] font-extrabold leading-[0.95] tracking-[-0.04em]">
              {WORDS.map((w, i) => (
                <span key={w} className="block overflow-hidden pb-[0.1em]">
                  <motion.span
                    className={`block ${i === 2 ? "text-orange" : ""}`}
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1.3, delay: T0 + 0.4 + i * 0.14, ease: EASE }}
                  >
                    {w}
                  </motion.span>
                </span>
              ))}
              <span className="sr-only"> Constructora e inmobiliaria 4:44, casas y departamentos en Guadalajara</span>
            </h1>

            <motion.div {...rise(4)} className="mt-9 flex flex-wrap items-center gap-4">
              <Magnetic>
                <a
                  href="#desarrollo"
                  className="group inline-flex items-center gap-3 bg-orange px-8 py-4 text-[0.8125rem] font-bold uppercase tracking-[0.16em] text-ink transition-colors duration-500 [transition-timing-function:var(--ease)] hover:bg-white"
                >
                  Ver el desarrollo
                  <span aria-hidden className="transition-transform duration-500 [transition-timing-function:var(--ease)] group-hover:translate-x-1">
                    →
                  </span>
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href="#contacto"
                  className="inline-flex border-2 border-white px-8 py-[14px] text-[0.8125rem] font-bold uppercase tracking-[0.16em] text-white transition-colors duration-500 [transition-timing-function:var(--ease)] hover:bg-white hover:text-ink"
                >
                  Cotizar
                </a>
              </Magnetic>
            </motion.div>
          </div>

          {/* Tarjeta flotante 3D con la terraza */}
          <motion.div {...rise(5)} className="col-span-4 col-start-9 hidden lg:block" style={{ perspective: 1100 }}>
            <motion.a
              href="#constructora"
              aria-label="Ver terraza del desarrollo"
              style={{ rotateY: rotY, rotateX: rotX, transformStyle: "preserve-3d" }}
              className="relative block aspect-[4/3] overflow-hidden border border-white/30 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]"
            >
              <Image src={R.terrazaA} alt="Terraza en azotea del nuevo desarrollo" fill sizes="30vw" className="object-cover" placeholder="blur" />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em]">
                Nuevo desarrollo · Terraza
              </span>
            </motion.a>
          </motion.div>
        </div>

        <motion.div {...rise(6)} className="mt-12 flex items-end justify-between gap-6 border-t border-white/25 pt-5">
          <dl className="flex gap-10">
            {STATS.map((s) => (
              <div key={s.label}>
                <dd className="font-display text-3xl font-extrabold">
                  <CountUp to={s.to} />
                </dd>
                <dt className="mt-1 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-white/80">{s.label}</dt>
              </div>
            ))}
          </dl>
          <a href="#desarrollo" aria-label="Desliza para ver más" className="flex items-center gap-3 text-[0.6875rem] font-bold uppercase tracking-[0.24em] text-white/90">
            Desliza
            <span className="relative block h-10 w-px overflow-hidden bg-white/30">
              <motion.span className="absolute inset-x-0 top-0 h-1/2 bg-orange" animate={{ y: ["-100%", "200%"] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} />
            </span>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
