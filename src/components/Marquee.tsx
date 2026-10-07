const ITEMS = ["Casas residenciales", "Supervisión de obra", "4:44 Maquinaria", "Crowdfunding inmobiliario", "Guadalajara, Jalisco"];

/** Cinta de obra: franja de señalización + letrero deslizante. */
export function Marquee() {
  const row = ITEMS.map((t) => (
    <span key={t} className="flex items-center gap-8 px-4">
      <span className="text-[13px] font-bold uppercase tracking-[0.22em] text-white">{t}</span>
      <span aria-hidden className="h-2.5 w-2.5 rotate-45 bg-orange" />
    </span>
  ));
  return (
    <div className="relative z-10" aria-hidden>
      <div className="hazard h-2" />
      <div className="overflow-hidden bg-ink py-4">
        <div className="marquee-track flex w-max whitespace-nowrap">
          <div className="flex">{row}</div>
          <div className="flex">{row}</div>
        </div>
      </div>
    </div>
  );
}
