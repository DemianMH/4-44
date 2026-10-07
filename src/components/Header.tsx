"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "./Logo";
import { Magnetic } from "./Magnetic";

const LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#maquinaria", label: "Maquinaria" },
  { href: "#proyectos", label: "Proyectos" },
  { href: "#proceso", label: "Proceso" },
  { href: "#contacto", label: "Contacto" },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[var(--line)] bg-concrete/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 md:px-10">
        <a href="#top" aria-label="Constructora 4:44, inicio" onClick={() => setOpen(false)}>
          <Logo className="h-6 w-auto text-limestone" />
        </a>

        <nav aria-label="Principal" className="hidden items-center gap-3 md:flex">
          {LINKS.map((l) => (
            <Magnetic key={l.href} strength={0.4}>
              <a
                href={l.href}
                className="block px-3 py-2 text-[11px] uppercase tracking-[0.22em] text-limestone transition-colors duration-500 [transition-timing-function:var(--ease)] hover:text-corten"
              >
                {l.label}
              </a>
            </Magnetic>
          ))}
        </nav>

        <button
          type="button"
          className="relative h-10 w-10 md:hidden"
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`absolute left-2 right-2 h-px bg-limestone transition-all duration-500 ${open ? "top-5 rotate-45" : "top-4"}`} />
          <span className={`absolute left-2 right-2 h-px bg-limestone transition-all duration-500 ${open ? "top-5 -rotate-45" : "top-6"}`} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="menu-movil"
            aria-label="Menú móvil"
            className="overflow-hidden border-t border-[var(--line)] bg-obsidian md:hidden"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <ul className="px-5 py-6">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-[var(--line)] py-4 font-display text-2xl font-bold"
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
