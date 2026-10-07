type LogoProps = { className?: string; title?: string };

/** Isotipo 4:44 — el colon se resuelve como dos módulos cuadrados de acero corten. */
export function Logo({ className, title = "Constructora 4:44" }: LogoProps) {
  return (
    <svg viewBox="0 0 150 40" className={className} role="img" aria-label={title} fill="none">
      <g stroke="currentColor" strokeWidth="3.2" strokeLinejoin="miter" strokeLinecap="butt">
        <path d="M24 38V2L2 26h30" />
        <path d="M100 38V2L78 26h30" />
        <path d="M144 38V2L122 26h28" />
      </g>
      <rect x="48" y="12" width="5" height="5" fill="var(--corten)" />
      <rect x="48" y="25" width="5" height="5" fill="var(--corten)" />
    </svg>
  );
}
