"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { smooth } from "@/lib/scroll";

/** Scroll con inercia suave; se desactiva en el panel y si el usuario prefiere menos movimiento. */
export function SmoothScroll() {
  const pathname = usePathname();
  const enabled = !pathname.startsWith("/admin");

  useEffect(() => {
    if (!enabled || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 4), anchors: true });
    smooth.lenis = lenis;
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      smooth.lenis = null;
    };
  }, [enabled]);

  // Al cambiar de página, empezar arriba (o en el ancla indicada)
  useEffect(() => {
    if (window.location.hash) return;
    smooth.lenis?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}
