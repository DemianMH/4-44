import type Lenis from "lenis";

/** Instancia de scroll suave compartida (la crea SmoothScroll). */
export const smooth: { lenis: Lenis | null } = { lenis: null };

/** Bloquea o libera el scroll de la página (menú abierto, preloader). */
export function lockScroll(lock: boolean) {
  document.documentElement.style.overflow = lock ? "hidden" : "";
  if (lock) smooth.lenis?.stop();
  else smooth.lenis?.start();
}
