"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Img } from "@/lib/types";
import { lockScroll } from "@/lib/scroll";
import { Logo } from "./Logo";
import { Pic } from "./Pic";

const EASE = [0.16, 1, 0.3, 1] as const;

export type ChromeItem = { id: string; label: string; img?: Img; href?: string };

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

/** Tono (claro/oscuro) de la sección que queda bajo el logo, para elegir la versión legible. */
function useToneUnderLogo() {
  const [tone, setTone] = useState<"dark" | "light">("dark");
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-tone]"));
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setTone((e.target as HTMLElement).dataset.tone === "light" ? "light" : "dark");
        }),
      { rootMargin: "0px 0px -92% 0px" }, // franja superior de la pantalla, donde vive el logo
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
  return tone;
}

/** Sustituye la barra de navegación: logo flotante sin fondo, botón de menú, menú a pantalla completa y puntos de sección. */
export function SiteChrome({ items }: { items: ChromeItem[] }) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(0);
  const dots = useMemo(() => [{ id: "top", label: "Inicio" }, ...items.filter((i) => !i.href).map((i) => ({ id: i.id, label: i.label }))], [items]);
  const dotIds = useMemo(() => dots.map((d) => d.id), [dots]);
  const active = useActiveSection(dotIds);
  const tone = useToneUnderLogo();
  const lightLogo = open || tone === "dark";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    lockScroll(true);
    window.addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <motion.div
        className="fixed left-[max(1rem,env(safe-area-inset-left))] top-[max(1rem,env(safe-area-inset-top))] z-50 md:left-8 md:top-7"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 3.2, ease: EASE }}
      >
        <a href="#top" aria-label="Constructora 4:44, inicio" onClick={() => setOpen(false)} className="relative block">
          <Logo height={34} className={`transition-opacity duration-500 [filter:drop-shadow(0_0_10px_rgba(255,255,255,0.9))] ${lightLogo ? "opacity-0" : "opacity-100"}`} />
          <Logo
            variant="claro"
            height={34}
            className={`absolute inset-0 transition-opacity duration-500 [filter:drop-shadow(0_1px_10px_rgba(0,0,0,0.55))] ${lightLogo ? "opacity-100" : "opacity-0"}`}
          />
        </a>
      </motion.div>

      <motion.div
        className="fixed right-[max(1rem,env(safe-area-inset-right))] top-[max(1rem,env(safe-area-inset-top))] z-50 flex items-center gap-3 md:right-8 md:top-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 3.3, ease: EASE }}
      >
        <a
          href="#contacto"
          onClick={() => setOpen(false)}
          className="hidden bg-white px-6 py-4 text-[0.75rem] font-bold uppercase tracking-[0.16em] text-ink shadow-[0_10px_30px_-12px_rgba(0,0,0,0.45)] transition-colors duration-500 hover:bg-ink hover:text-white sm:block"
        >
          Cotizar
        </a>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="menu"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((v) => !v)}
          className="group relative h-[3.25rem] w-[3.25rem] bg-orange shadow-[0_10px_30px_-12px_rgba(0,0,0,0.45)] transition-transform duration-500 [transition-timing-function:var(--ease)] hover:scale-105"
        >
          <span className={`absolute left-3.5 right-3.5 h-0.5 bg-ink transition-all duration-500 ${open ? "top-[1.5625rem] rotate-45" : "top-[1.1875rem]"}`} />
          <span className={`absolute left-3.5 right-3.5 h-0.5 bg-ink transition-all duration-500 ${open ? "top-[1.5625rem] -rotate-45" : "top-[1.9375rem] group-hover:left-6"}`} />
        </button>
      </motion.div>

      {/* Puntos de sección */}
      <nav aria-label="Secciones" className="fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
        {dots.map(({ id, label }) => (
          <a key={id} href={`#${id}`} aria-label={label} aria-current={active === id} className="group relative flex h-4 w-4 items-center justify-center">
            <span className={`block rounded-full ring-1 ring-ink/50 transition-all duration-500 ${active === id ? "h-3 w-3 bg-orange" : "h-1.5 w-1.5 bg-white/80 group-hover:bg-orange"}`} />
            <span className="pointer-events-none absolute right-7 whitespace-nowrap bg-ink px-2 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {label}
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
            data-lenis-prevent
            className="fixed inset-0 z-40 flex h-dvh overflow-y-auto overscroll-contain bg-ink text-white"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <ul className="flex min-h-full flex-1 flex-col justify-center px-6 pb-8 pt-24 md:px-16">
              {items.map((it, i) => (
                <motion.li
                  key={it.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.25 + i * 0.07, ease: EASE }}
                >
                  <a
                    href={it.href ?? `#${it.id}`}
                    onClick={() => setOpen(false)}
                    onPointerEnter={() => setHover(i)}
                    onFocus={() => setHover(i)}
                    className={`group flex items-center gap-5 py-[min(0.5rem,1.2svh)] font-display text-[clamp(1.9rem,min(6.2vw,9svh),5rem)] font-extrabold leading-[1.05] tracking-[-0.03em] transition-colors duration-500 ${hover === i ? "text-orange" : "text-white/85"}`}
                  >
                    <span className="text-[0.75rem] font-bold tracking-[0.2em] text-orange">{String(i + 1).padStart(2, "0")}</span>
                    {it.label}
                  </a>
                </motion.li>
              ))}
            </ul>

            <div className="relative hidden w-[42%] shrink-0 md:block" aria-hidden>
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={hover}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: EASE }}
                >
                  {items[hover]?.img && <Pic img={items[hover].img} alt="" sizes="42vw" quality={75} className="object-cover" />}
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
