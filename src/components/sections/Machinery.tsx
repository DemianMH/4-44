"use client";

import { motion } from "framer-motion";
import { MACHINERY, RENTAL_TERMS } from "@/lib/site";
import { Reveal } from "../Reveal";
import { H2, PAD, WRAP } from "./styles";

const SWING = { duration: 3.4, repeat: Infinity, repeatType: "mirror" as const, ease: "easeInOut" as const };

/** Retroexcavadora/excavadora animada: pluma, brazo y cucharón articulados + orugas en movimiento. */
function Excavator() {
  return (
    <svg viewBox="0 0 340 220" className="h-full w-full" fill="none" aria-hidden>
      {/* Suelo y montículo de tierra */}
      <path d="M0 184H340" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="2" />
      <path d="M262 184L284 160L304 184Z" fill="#ffffff" fillOpacity="0.18" stroke="#ffffff" strokeOpacity="0.5" />
      {/* Orugas */}
      <rect x="36" y="150" width="156" height="34" rx="17" fill="#2c2f30" stroke="#ffffff" strokeWidth="2" />
      <path d="M52 167H176" stroke="#f57e25" strokeWidth="3" strokeDasharray="10 14" className="track-move" />
      {[56, 114, 172].map((x) => (
        <circle key={x} cx={x} cy={167} r="8" fill="#464a4b" stroke="#ffffff" strokeWidth="1.5" />
      ))}
      {/* Torreta */}
      <rect x="64" y="104" width="104" height="46" fill="#f57e25" stroke="#ffffff" strokeWidth="2" />
      <rect x="44" y="112" width="26" height="38" fill="#464a4b" stroke="#ffffff" strokeWidth="2" />
      <path d="M118 104V70H166V104" fill="#2c2f30" stroke="#ffffff" strokeWidth="2" />
      <path d="M126 76H158V98H126Z" fill="#ffffff" fillOpacity="0.5" />
      {/* Pluma → brazo → cucharón (rotaciones anidadas) */}
      <motion.g style={{ transformOrigin: "160px 112px" }} animate={{ rotate: [-6, 8] }} transition={SWING}>
        <path d="M160 112L214 52L262 40" stroke="#f57e25" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
        <motion.g style={{ transformOrigin: "262px 40px" }} animate={{ rotate: [-14, 16] }} transition={{ ...SWING, duration: 2.6 }}>
          <path d="M262 40L296 108" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />
          <motion.g style={{ transformOrigin: "296px 108px" }} animate={{ rotate: [-22, 24] }} transition={{ ...SWING, duration: 1.9 }}>
            <path d="M296 108L320 118L312 92Z" fill="#f57e25" stroke="#ffffff" strokeWidth="2" strokeLinejoin="round" />
          </motion.g>
        </motion.g>
      </motion.g>
      <circle cx="160" cy="112" r="6" fill="#ffffff" />
      <circle cx="262" cy="40" r="5" fill="#ffffff" />
    </svg>
  );
}

export function Machinery() {
  return (
    <section id="maquinaria" className={`relative overflow-hidden bg-graphite text-white ${PAD}`}>
      <div aria-hidden className="absolute inset-x-0 top-0 h-2 hazard" />
      <div className={`${WRAP} grid grid-cols-12 gap-x-4 gap-y-14`}>
        <div className="col-span-12 md:col-span-6">
          <p className="text-[12px] font-bold uppercase tracking-[0.24em] text-orange">4:44 Maquinaria</p>
          <h2 className={`${H2} mt-6`}>
            Equipo para obra, <span className="text-orange">por el tiempo que lo necesites.</span>
          </h2>
          <ul className="mt-10 flex flex-wrap gap-2" aria-label="Periodos de renta">
            {RENTAL_TERMS.map((t) => (
              <li key={t} className="border-2 border-white/60 px-4 py-2 text-[12px] font-bold uppercase tracking-[0.18em] transition-colors duration-500 hover:border-orange hover:bg-orange hover:text-ink">
                Por {t.toLowerCase()}
              </li>
            ))}
          </ul>

          <dl className="mt-12 border-t border-white/25">
            {MACHINERY.map((m) => (
              <Reveal key={m.name} className="grid gap-1 border-b border-white/25 py-5">
                <dt className="font-display text-lg font-extrabold">{m.name}</dt>
                <dd className="text-sm text-white/80">{m.use}</dd>
              </Reveal>
            ))}
          </dl>

          <a
            href="#contacto"
            className="mt-10 inline-block bg-orange px-8 py-4 text-[13px] font-bold uppercase tracking-[0.16em] text-ink transition-colors duration-500 hover:bg-white"
          >
            Cotizar renta →
          </a>
        </div>

        <div className="col-span-12 md:col-span-6">
          <div className="bg-blueprint-dark relative aspect-[340/260] w-full border border-white/25 p-6">
            <Excavator />
            <span className="absolute bottom-3 left-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">Movimiento de tierra · Excavación</span>
          </div>
        </div>
      </div>
    </section>
  );
}
