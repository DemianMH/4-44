import { Logo } from "./Logo";
import { Magnetic } from "./Magnetic";

const LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#proyectos", label: "Proyectos" },
  { href: "#contacto", label: "Contacto" },
];

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-[var(--line)] bg-concrete/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 md:px-10">
        <a href="#top" aria-label="Constructora 4:44, inicio">
          <Logo className="h-6 w-auto text-limestone" />
        </a>
        <nav aria-label="Principal" className="flex items-center gap-1 md:gap-3">
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
      </div>
    </header>
  );
}
