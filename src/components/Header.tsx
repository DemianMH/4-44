"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "./Logo";
import { Magnetic } from "./Magnetic";

const LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#proceso", label: "Proceso" },
  { href: "#maquinaria", label: "Maquinaria" },
  { href: "#proyectos", label: "Proyectos" },
  { href: "#faq", label: "Preguntas" },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[var(--line)] bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] max-w-[1600px] items-center justify-between px-5 md:px-10">
        <a href="#top" aria-label="Constructora 4:44, inicio" onClick={() => setOpen(false)}>
          <Logo height={34} />
        </a>

        <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <Magnetic key={l.href} strength={0.4}>
              <a
                href={l.href}
                className="block px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-graphite transition-colors duration-500 [transition-timing-function:var(--ease)] hover:text-orange-ink"
              >
                {l.label}
              </a>
            </Magnetic>
          ))}
          <Magnetic strength={0.3} className="ml-3">
            <a
              href="#contacto"
              className="block bg-orange px-5 py-3 text-[12px] font-bold uppercase tracking-[0.16em] text-ink transition-colors duration-500 hover:bg-ink hover:text-white"
            >
              Cotizar
            </a>
          </Magnetic>
        </nav>

        <button
          type="button"
          className="relative h-11 w-11 lg:hidden"
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`absolute left-2.5 right-2.5 h-0.5 bg-ink transition-all duration-500 ${open ? "top-[21px] rotate-45" : "top-4"}`} />
          <span className={`absolute left-2.5 right-2.5 h-0.5 bg-orange transition-all duration-500 ${open ? "top-[21px] -rotate-45" : "top-[26px]"}`} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="menu-movil"
            aria-label="Menú móvil"
            className="overflow-hidden border-t border-[var(--line)] bg-white lg:hidden"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <ul className="px-5 py-4">
              {[...LINKS, { href: "#contacto", label: "Contacto" }].map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-[var(--line)] py-4 font-display text-2xl font-extrabold text-ink"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
