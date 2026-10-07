"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, animate, motion } from "framer-motion";
import { Logo } from "./Logo";

const EASE = [0.16, 1, 0.3, 1] as const;
const DURATION_MS = 3300;
const FLOORS = 6;

/** Intro: un edificio se levanta piso por piso mientras avanza la "obra" de 0 a 100 %. */
export function Preloader() {
  const [visible, setVisible] = useState(true);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    const counter = animate(0, 100, {
      duration: 2.6,
      ease: "easeInOut",
      onUpdate: (v) => setPct(Math.round(v)),
    });
    const t = window.setTimeout(() => {
      setVisible(false);
      document.documentElement.style.overflow = "";
    }, DURATION_MS);
    return () => {
      counter.stop();
      window.clearTimeout(t);
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          role="status"
          aria-label={`Cargando Constructora 4:44, ${pct}%`}
          className="bg-blueprint fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-white"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 1, ease: EASE }}
        >
          <svg viewBox="0 0 240 260" className="h-[min(46vh,22rem)] w-auto" fill="none" aria-hidden>
            {/* Terreno */}
            <motion.path
              d="M10 232H230"
              stroke="#464a4b"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.7, ease: EASE }}
            />
            {/* Pisos del edificio */}
            {Array.from({ length: FLOORS }, (_, i) => {
              const y = 232 - (i + 1) * 28;
              return (
                <motion.g
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + i * 0.32, ease: EASE }}
                >
                  <rect x="40" y={y} width="110" height="28" fill={i === FLOORS - 1 ? "#f57e25" : "#f5f3ef"} stroke="#464a4b" strokeWidth="1.5" />
                  {[56, 84, 112, 134].map((x) => (
                    <rect key={x} x={x - 6} y={y + 8} width="10" height="12" fill="white" stroke="#464a4b" strokeWidth="1" />
                  ))}
                </motion.g>
              );
            })}
            {/* Grúa torre */}
            <g>
              <motion.path
                d="M196 232V30M208 232V30M196 232L208 206L196 180L208 154L196 128L208 102L196 76L208 50L196 30"
                stroke="#f57e25"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.8, delay: 0.3, ease: EASE }}
              />
              <motion.path
                d="M120 30H236M120 30L202 12L236 30M226 30V70"
                stroke="#464a4b"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, delay: 1.5, ease: EASE }}
              />
              <motion.rect
                x="221"
                y="70"
                width="10"
                height="9"
                fill="#f57e25"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: [0, 60, 0] }}
                transition={{ duration: 2.4, delay: 1.6, ease: "easeInOut" }}
              />
            </g>
          </svg>

          <div className="flex flex-col items-center gap-4">
            <motion.div
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: 1, delay: 1.9, ease: EASE }}
            >
              <Logo height={46} />
            </motion.div>
            <div className="flex w-64 items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-graphite">
              <span>Avance de obra</span>
              <span className="ml-auto tabular-nums text-orange-ink">{String(pct).padStart(3, "0")}%</span>
            </div>
            <div className="h-1 w-64 bg-stone">
              <div className="h-full bg-orange" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
