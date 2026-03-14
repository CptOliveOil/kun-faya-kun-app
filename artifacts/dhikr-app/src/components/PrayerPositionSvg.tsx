import { cn } from "@/lib/utils";

export type PrayerPosition = "qiyam" | "ruku" | "sujud" | "jalsah" | "tasleem" | "jummah";

const POSITION_LABELS: Record<PrayerPosition, string> = {
  qiyam: "Standing",
  ruku: "Bowing",
  sujud: "Prostrating",
  jalsah: "Sitting",
  tasleem: "Salam",
  jummah: "Jumu'ah",
};

const PRAYER_POSITIONS: Record<string, PrayerPosition> = {
  fajr: "qiyam",
  dhuhr: "ruku",
  asr: "sujud",
  maghrib: "jalsah",
  isha: "tasleem",
};

export function getPrayerPosition(prayerName: string): PrayerPosition {
  return PRAYER_POSITIONS[prayerName.toLowerCase()] || "qiyam";
}

function QiyamSvg({ fillPercent, className }: { fillPercent: number; className?: string }) {
  const id = "qiyam-grad";
  return (
    <svg viewBox="0 0 60 120" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={id} x1="0" y1="1" x2="0" y2="0">
          <stop offset={`${fillPercent}%`} stopColor="#C9A84C" stopOpacity="0.85" />
          <stop offset={`${fillPercent}%`} stopColor="currentColor" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <circle cx="30" cy="14" r="10" fill={`url(#${id})`} stroke="#C9A84C" strokeWidth="1.5" />
      <rect x="20" y="26" width="20" height="35" rx="6" fill={`url(#${id})`} stroke="#C9A84C" strokeWidth="1.5" />
      <line x1="20" y1="36" x2="8" y2="52" stroke="#C9A84C" strokeWidth="3" strokeLinecap="round" />
      <line x1="40" y1="36" x2="52" y2="52" stroke="#C9A84C" strokeWidth="3" strokeLinecap="round" />
      <line x1="25" y1="61" x2="20" y2="95" stroke="#C9A84C" strokeWidth="3" strokeLinecap="round" />
      <line x1="35" y1="61" x2="40" y2="95" stroke="#C9A84C" strokeWidth="3" strokeLinecap="round" />
      <line x1="20" y1="95" x2="15" y2="105" stroke="#C9A84C" strokeWidth="3" strokeLinecap="round" />
      <line x1="40" y1="95" x2="45" y2="105" stroke="#C9A84C" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function RukuSvg({ fillPercent, className }: { fillPercent: number; className?: string }) {
  const id = "ruku-grad";
  return (
    <svg viewBox="0 0 80 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={id} x1="0" y1="1" x2="0" y2="0">
          <stop offset={`${fillPercent}%`} stopColor="#C9A84C" stopOpacity="0.85" />
          <stop offset={`${fillPercent}%`} stopColor="currentColor" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <circle cx="55" cy="28" r="9" fill={`url(#${id})`} stroke="#C9A84C" strokeWidth="1.5" />
      <rect x="20" y="32" width="30" height="14" rx="5" fill={`url(#${id})`} stroke="#C9A84C" strokeWidth="1.5" transform="rotate(-10 35 39)" />
      <line x1="15" y1="40" x2="15" y2="58" stroke="#C9A84C" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="40" x2="60" y2="52" stroke="#C9A84C" strokeWidth="3" strokeLinecap="round" />
      <line x1="25" y1="50" x2="20" y2="80" stroke="#C9A84C" strokeWidth="3" strokeLinecap="round" />
      <line x1="40" y1="50" x2="45" y2="80" stroke="#C9A84C" strokeWidth="3" strokeLinecap="round" />
      <line x1="20" y1="80" x2="15" y2="90" stroke="#C9A84C" strokeWidth="3" strokeLinecap="round" />
      <line x1="45" y1="80" x2="50" y2="90" stroke="#C9A84C" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function SujudSvg({ fillPercent, className }: { fillPercent: number; className?: string }) {
  const id = "sujud-grad";
  return (
    <svg viewBox="0 0 90 70" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={id} x1="0" y1="1" x2="0" y2="0">
          <stop offset={`${fillPercent}%`} stopColor="#C9A84C" stopOpacity="0.85" />
          <stop offset={`${fillPercent}%`} stopColor="currentColor" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <circle cx="15" cy="50" r="8" fill={`url(#${id})`} stroke="#C9A84C" strokeWidth="1.5" />
      <path d="M 22 48 Q 40 20 60 30" fill="none" stroke="#C9A84C" strokeWidth="3" strokeLinecap="round" />
      <line x1="12" y1="56" x2="8" y2="60" stroke="#C9A84C" strokeWidth="3" strokeLinecap="round" />
      <line x1="60" y1="30" x2="75" y2="22" stroke="#C9A84C" strokeWidth="3" strokeLinecap="round" />
      <line x1="55" y1="35" x2="65" y2="55" stroke="#C9A84C" strokeWidth="3" strokeLinecap="round" />
      <line x1="65" y1="55" x2="75" y2="55" stroke="#C9A84C" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function JalsahSvg({ fillPercent, className }: { fillPercent: number; className?: string }) {
  const id = "jalsah-grad";
  return (
    <svg viewBox="0 0 70 90" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={id} x1="0" y1="1" x2="0" y2="0">
          <stop offset={`${fillPercent}%`} stopColor="#C9A84C" stopOpacity="0.85" />
          <stop offset={`${fillPercent}%`} stopColor="currentColor" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <circle cx="35" cy="14" r="9" fill={`url(#${id})`} stroke="#C9A84C" strokeWidth="1.5" />
      <rect x="25" y="25" width="20" height="28" rx="5" fill={`url(#${id})`} stroke="#C9A84C" strokeWidth="1.5" />
      <line x1="25" y1="35" x2="12" y2="48" stroke="#C9A84C" strokeWidth="3" strokeLinecap="round" />
      <line x1="45" y1="35" x2="58" y2="48" stroke="#C9A84C" strokeWidth="3" strokeLinecap="round" />
      <path d="M 30 53 Q 25 70 20 80" fill="none" stroke="#C9A84C" strokeWidth="3" strokeLinecap="round" />
      <path d="M 40 53 Q 50 65 55 68" fill="none" stroke="#C9A84C" strokeWidth="3" strokeLinecap="round" />
      <line x1="20" y1="80" x2="35" y2="82" stroke="#C9A84C" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function TasleemSvg({ fillPercent, className }: { fillPercent: number; className?: string }) {
  const id = "tasleem-grad";
  return (
    <svg viewBox="0 0 70 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={id} x1="0" y1="1" x2="0" y2="0">
          <stop offset={`${fillPercent}%`} stopColor="#C9A84C" stopOpacity="0.85" />
          <stop offset={`${fillPercent}%`} stopColor="currentColor" stopOpacity="0.15" />
        </linearGradient>
        <filter id="glow-tasleem">
          <feGaussianBlur stdDeviation="2" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle cx="35" cy="14" r="9" fill={`url(#${id})`} stroke="#C9A84C" strokeWidth="1.5" filter={fillPercent >= 80 ? "url(#glow-tasleem)" : undefined} />
      <rect x="25" y="25" width="20" height="28" rx="5" fill={`url(#${id})`} stroke="#C9A84C" strokeWidth="1.5" />
      <line x1="25" y1="35" x2="12" y2="48" stroke="#C9A84C" strokeWidth="3" strokeLinecap="round" />
      <line x1="45" y1="35" x2="58" y2="48" stroke="#C9A84C" strokeWidth="3" strokeLinecap="round" />
      <path d="M 30 53 Q 25 70 20 80" fill="none" stroke="#C9A84C" strokeWidth="3" strokeLinecap="round" />
      <path d="M 40 53 Q 50 65 55 68" fill="none" stroke="#C9A84C" strokeWidth="3" strokeLinecap="round" />
      <line x1="20" y1="80" x2="35" y2="82" stroke="#C9A84C" strokeWidth="3" strokeLinecap="round" />
      <path d="M 28 12 Q 35 5 42 12" fill="none" stroke="#C9A84C" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

export function PrayerPositionIcon({
  position,
  fillPercent = 0,
  size = 40,
  className,
}: {
  position: PrayerPosition;
  fillPercent?: number;
  size?: number;
  className?: string;
}) {
  const clamp = Math.max(0, Math.min(100, fillPercent));
  const style = { width: size, height: size };
  const svgClass = cn("text-silver", className);

  switch (position) {
    case "qiyam":
      return <div style={style}><QiyamSvg fillPercent={clamp} className={svgClass} /></div>;
    case "ruku":
      return <div style={style}><RukuSvg fillPercent={clamp} className={svgClass} /></div>;
    case "sujud":
      return <div style={style}><SujudSvg fillPercent={clamp} className={svgClass} /></div>;
    case "jalsah":
      return <div style={style}><JalsahSvg fillPercent={clamp} className={svgClass} /></div>;
    case "tasleem":
    case "jummah":
      return <div style={style}><TasleemSvg fillPercent={clamp} className={svgClass} /></div>;
    default:
      return <div style={style}><QiyamSvg fillPercent={clamp} className={svgClass} /></div>;
  }
}

export { POSITION_LABELS };
