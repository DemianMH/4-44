import type { Content } from "@/lib/types";
import { Reveal } from "../Reveal";
import { EYEBROW, H2, PAD, WRAP } from "./styles";

export function Faq({ items }: { items: Content["faq"] }) {
  if (items.length === 0) return null;
  return (
    <section id="faq" data-tone="light" className={`bg-white ${PAD}`}>
      <div className={`${WRAP} grid grid-cols-12 gap-x-4 gap-y-12`}>
        <div className="col-span-12 md:col-span-4">
          <p className={EYEBROW}>Preguntas frecuentes</p>
          <h2 className={`${H2} mt-6`}>
            Lo <span className="text-orange-strong">esencial.</span>
          </h2>
        </div>
        <div className="col-span-12 md:col-span-7 md:col-start-6">
          {items.map((f, i) => (
            <Reveal key={f.id} delay={i * 0.05}>
              <details className="group border-t border-[var(--line)] py-6 last:border-b">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-lg font-extrabold text-ink [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center bg-orange text-xl leading-none text-ink transition-transform duration-500 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-graphite">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
