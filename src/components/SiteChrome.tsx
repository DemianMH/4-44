"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { R, P } from "@/assets/images";
import { Logo } from "./Logo";

const EASE = [0.16, 1, 0.3, 1] as const;

const ITEMS = [
  { id: "desarrollo", label: "Desarrollo", img: R.salaA },
  { id: "plantas", label: "Plantas", img: R.planoA },
  { id: "constructora", label: "Constructora", img: R.terrazaB },
  { id: "maquinaria", label: "Maquinaria", img: P.edificioSanPaulo },
  { id: "proyectos", label: "Proyectos", img: P.casaSanIsidro },
  { id: "contacto", label: "Contacto", img: R.fachadaDia },
] as const;

const DOT_IDS = ["top", ...ITEMS.map((i) => i.id)];
const DOT_LABELS: Record<string, string> = { top: "Inicio", ...Object.fromEntries(ITEMS.map((i) => [i.id, i.label])) };

function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

/** Sustituye la barra de navegación: logo flotante, botón de menú, menú a pantalla completa y puntos de sección. */
export function SiteChrome() {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(0);
  const active = useActiveSection(DOT_IDS);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <motion.div
        className="fixed left-4 top-4 z-50 md:left-8 md:top-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 3.2, ease: EASE }}
      >
        <a
          href="#top"
          aria-label="Constructora 4:44, inicio"
          onClick={() => setOpen(false)}
          className="block bg-white/95 px-4 py-2.5 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.45)] backdrop-blur-md"
        >
          <Logo height={28} />
        </a>
      </motion.div>

      <motion.div
        className="fixed right-4 top-4 z-50 flex items-center gap-3 md:right-8 md:top-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 3.3, ease: EASE }}
      >
        <a
          href="#contacto"
          onClick={() => setOpen(false)}
          className="hidden bg-white px-6 py-4 text-[12px] font-bold uppercase tracking-[0.16em] text-ink shadow-[0_10px_30px_-12px_rgba(0,0,0,0.45)] transition-colors duration-500 hover:bg-ink hover:text-white sm:block"
        >
          Cotizar
        </a>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="menu"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((v) => !v)}
          className="group relative h-[52px] w-[52px] bg-orange shadow-[0_10px_30px_-12px_rgba(0,0,0,0.45)] transition-transform duration-500 [transition-timing-function:var(--ease)] hover:scale-105"
        >
          <span className={`absolute left-3.5 right-3.5 h-0.5 bg-ink transition-all duration-500 ${open ? "top-[25px] rotate-45" : "top-[19px]"}`} />
          <span className={`absolute left-3.5 right-3.5 h-0.5 bg-ink transition-all duration-500 ${open ? "top-[25px] -rotate-45" : "top-[31px] group-hover:left-6"}`} />
        </button>
      </motion.div>

      {/* Puntos de sección */}
      <nav aria-label="Secciones" className="fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
        {DOT_IDS.map((id) => (
          <a key={id} href={`#${id}`} aria-label={DOT_LABELS[id]} aria-current={active === id} className="group relative flex h-4 w-4 items-center justify-center">
            <span
              className={`block rounded-full ring-1 ring-ink/50 transition-all duration-500 ${active === id ? "h-3 w-3 bg-orange" : "h-1.5 w-1.5 bg-white/80 group-hover:bg-orange"}`}
            />
            <span className="pointer-events-none absolute right-7 whitespace-nowrap bg-ink px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {DOT_LABELS[id]}
            </span>
          </a>
        ))}
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menú"
            className="fixed inset-0 z-40 flex bg-ink text-white"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <ul className="flex flex-1 flex-col justify-center px-6 pt-24 md:px-16">
              {ITEMS.map((it, i) => (
                <motion.li
                  key={it.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.25 + i * 0.07, ease: EASE }}
                >
                  <a
                    href={`#${it.id}`}
                    onClick={() => setOpen(false)}
                    onPointerEnter={() => setHover(i)}
                    onFocus={() => setHover(i)}
                    className={`group flex items-center gap-5 py-2 font-display text-[clamp(2.2rem,6.2vw,5rem)] font-extrabold leading-[1.05] tracking-[-0.03em] transition-colors duration-500 md:py-3 ${hover === i ? "text-orange" : "text-white/85"}`}
                  >
                    <span className="text-xs font-bold tracking-[0.2em] text-orange">{String(i + 1).padStart(2, "0")}</span>
                    {it.label}
                  </a>
                </motion.li>
              ))}
            </ul>

            <div className="relative hidden w-[42%] md:block" aria-hidden>
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={hover}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: EASE }}
                >
                  <Image src={ITEMS[hover].img} alt="" fill sizes="42vw" className="object-cover" placeholder="blur" />
                  <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/20 to-transparent" />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
