export function HolyMosquesIcon({ size = 48, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      className={className}
    >
      <g>
        <rect x="8" y="52" width="28" height="20" rx="1" fill="hsl(150, 45%, 32%)" opacity="0.15" />
        <rect x="44" y="52" width="28" height="20" rx="1" fill="hsl(150, 45%, 32%)" opacity="0.15" />

        <path d="M22 52 Q22 38 22 36 A12 12 0 0 1 22 24" stroke="hsl(43, 72%, 52%)" strokeWidth="2" fill="none" />
        <ellipse cx="22" cy="40" rx="12" ry="12" fill="hsl(150, 45%, 32%)" opacity="0.2" />
        <path d="M10 52 A12 12 0 0 1 34 52" fill="hsl(150, 45%, 32%)" />

        <rect x="10" y="52" width="3" height="20" fill="hsl(43, 72%, 52%)" opacity="0.7" />
        <rect x="31" y="52" width="3" height="20" fill="hsl(43, 72%, 52%)" opacity="0.7" />

        <circle cx="22" cy="34" r="3" fill="hsl(43, 72%, 52%)" />
        <path d="M21 31 L22 26 L23 31" fill="hsl(43, 72%, 52%)" />

        <line x1="8" y1="22" x2="8" y2="52" stroke="hsl(43, 72%, 52%)" strokeWidth="1.5" />
        <line x1="36" y1="22" x2="36" y2="52" stroke="hsl(43, 72%, 52%)" strokeWidth="1.5" />
        <circle cx="8" cy="20" r="2" fill="hsl(43, 72%, 52%)" />
        <path d="M7 18 L8 14 L9 18" fill="hsl(43, 72%, 52%)" />
        <circle cx="36" cy="20" r="2" fill="hsl(43, 72%, 52%)" />
        <path d="M35 18 L36 14 L37 18" fill="hsl(43, 72%, 52%)" />

        <path d="M46 52 Q52 30 58 24 Q64 30 70 52" fill="hsl(150, 45%, 32%)" />

        <rect x="46" y="52" width="3" height="20" fill="hsl(43, 72%, 52%)" opacity="0.7" />
        <rect x="67" y="52" width="3" height="20" fill="hsl(43, 72%, 52%)" opacity="0.7" />

        <circle cx="58" cy="28" r="3" fill="hsl(43, 72%, 52%)" />
        <path d="M57 25 L58 20 L59 25" fill="hsl(43, 72%, 52%)" />

        <path d="M50 52 A6 8 0 0 1 62 52" fill="hsl(150, 45%, 32%)" opacity="0.6" />
        <path d="M54 52 A3 4 0 0 1 62 52" fill="hsl(150, 45%, 32%)" opacity="0.3" />

        <line x1="44" y1="26" x2="44" y2="52" stroke="hsl(43, 72%, 52%)" strokeWidth="1.5" />
        <line x1="72" y1="26" x2="72" y2="52" stroke="hsl(43, 72%, 52%)" strokeWidth="1.5" />
        <circle cx="44" cy="24" r="2" fill="hsl(43, 72%, 52%)" />
        <path d="M43 22 L44 18 L45 22" fill="hsl(43, 72%, 52%)" />
        <circle cx="72" cy="24" r="2" fill="hsl(43, 72%, 52%)" />
        <path d="M71 22 L72 18 L73 22" fill="hsl(43, 72%, 52%)" />

        <line x1="0" y1="72" x2="80" y2="72" stroke="hsl(43, 72%, 52%)" strokeWidth="1" opacity="0.4" />

        <path d="M36 10 A5 5 0 0 0 44 10" fill="hsl(43, 72%, 52%)" opacity="0.6" />
        <circle cx="44" cy="10" r="1.5" fill="hsl(43, 72%, 52%)" opacity="0.6" />
      </g>
    </svg>
  );
}
