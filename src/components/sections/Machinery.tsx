import { MACHINERY, RENTAL_TERMS } from "@/lib/site";
import { H2, PAD, WRAP } from "./styles";

function Excavator() {
  return (
    <svg viewBox="0 0 340 220" className="h-full w-full" fill="none" aria-hidden>
      <path d="M0 184H340" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="2" />
      <path d="M262 184L284 160L304 184Z" fill="#ffffff" fillOpacity="0.18" stroke="#ffffff" strokeOpacity="0.5" />
      {/* Orugas */}
      <rect x="36" y="150" width="156" height="34" rx="17" fill="#2c2f30" stroke="#ffffff" strokeWidth="2" />
      <path d="M52 167H176" stroke="#f57e25" strokeWidth="3" strokeDasharray="10 14" className="track-move" />
      {[56, 114, 172].map((x) => (
        <circle key={x} cx={x} cy={167} r="8" fill="#464a4b" stroke="#ffffff" strokeWidth="1.5" />
      ))}
      {/* Torreta */}
      <rect x="64" y="104" width="104" height="46" fill="#f57e25" stroke="#ffffff" strokeWidth="2" />
      <rect x="44" y="112" width="26" height="38" fill="#464a4b" stroke="#ffffff" strokeWidth="2" />
      <path d="M118 104V70H166V104" fill="#2c2f30" stroke="#ffffff" strokeWidth="2" />
      <path d="M126 76H158V98H126Z" fill="#ffffff" fillOpacity="0.5" />
      {/* Pluma → brazo → cucharón */}
      <g className="arm arm-boom">
        <path d="M160 112L214 52L262 40" stroke="#f57e25" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
        <g className="arm arm-stick">
          <path d="M262 40L296 108" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />
          <g className="arm arm-bucket">
            <path d="M296 108L320 118L312 92Z" fill="#f57e25" stroke="#ffffff" strokeWidth="2" strokeLinejoin="round" />
          </g>
          <circle cx="296" cy="108" r="4" fill="#ffffff" />
        </g>
        <circle cx="262" cy="40" r="5" fill="#ffffff" />
      </g>
      <circle cx="160" cy="112" r="6" fill="#ffffff" />
    </svg>
  );
}

export function Machinery() {
  return (
    <section id="maquinaria" className={`relative overflow-hidden bg-graphite text-white ${PAD}`}>
      <div aria-hidden className="hazard absolute inset-x-0 top-0 h-2" />
      <div className={`${WRAP} grid grid-cols-12 items-center gap-x-8 gap-y-14`}>
        <div className="col-span-12 lg:col-span-5">
          <p className="text-[12px] font-bold uppercase tracking-[0.24em] text-orange">4:44 Maquinaria</p>
          <h2 className={`${H2} mt-6`}>
            Renta de equipo <span className="text-orange">para tu obra.</span>
          </h2>
          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Periodos de renta">
            {RENTAL_TERMS.map((t) => (
              <li key={t} className="border-2 border-white/60 px-4 py-2 text-[12px] font-bold uppercase tracking-[0.18em] transition-colors duration-500 hover:border-orange hover:bg-orange hover:text-ink">
                Por {t.toLowerCase()}
              </li>
            ))}
          </ul>
          <ul className="mt-8 grid gap-2 text-base text-white/90">
            {MACHINERY.map((m) => (
              <li key={m} className="flex items-center gap-3">
                <span aria-hidden className="h-2 w-2 rotate-45 bg-orange" />
                {m}
              </li>
            ))}
          </ul>
          <a href="#contacto" className="mt-10 inline-block bg-orange px-8 py-4 text-[13px] font-bold uppercase tracking-[0.16em] text-ink transition-colors duration-500 hover:bg-white">
            Cotizar renta →
          </a>
        </div>

        <div className="col-span-12 lg:col-span-7">
          <div className="bg-blueprint-dark relative aspect-[340/240] w-full border border-white/25 p-6">
            <Excavator />
          </div>
        </div>
      </div>
    </section>
  );
}
