import { cn } from "@/lib/utils";

export type SunStage = "fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha";

const STAGE_COLORS: Record<SunStage, { sun: string; sky: string; rays: string; horizon: string }> = {
  fajr:    { sun: "#F59E0B", sky: "#FEF3C7", rays: "#FBBF24", horizon: "#93C5FD" },
  sunrise: { sun: "#F59E0B", sky: "#FDE68A", rays: "#F59E0B", horizon: "#86EFAC" },
  dhuhr:   { sun: "#EAB308", sky: "#FEF9C3", rays: "#EAB308", horizon: "#86EFAC" },
  asr:     { sun: "#F59E0B", sky: "#FED7AA", rays: "#FB923C", horizon: "#6EE7B7" },
  maghrib: { sun: "#F97316", sky: "#FECACA", rays: "#EF4444", horizon: "#A78BFA" },
  isha:    { sun: "#A78BFA", sky: "#312E81", rays: "#818CF8", horizon: "#1E1B4B" },
};

function FajrSvg({ size }: { size: number }) {
  const c = STAGE_COLORS.fajr;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <rect width="40" height="40" rx="8" fill={c.sky} />
      <rect x="0" y="26" width="40" height="14" rx="0" fill={c.horizon} opacity="0.3" />
      <circle cx="20" cy="28" r="7" fill={c.sun} opacity="0.8" />
      <line x1="20" y1="18" x2="20" y2="14" stroke={c.rays} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="13" y1="22" x2="10" y2="19" stroke={c.rays} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <line x1="27" y1="22" x2="30" y2="19" stroke={c.rays} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <path d="M5 26 Q10 24 15 26 Q20 28 25 26 Q30 24 35 26" fill="none" stroke={c.horizon} strokeWidth="1" opacity="0.4" />
    </svg>
  );
}

function SunriseSvg({ size }: { size: number }) {
  const c = STAGE_COLORS.sunrise;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <rect width="40" height="40" rx="8" fill={c.sky} />
      <rect x="0" y="24" width="40" height="16" rx="0" fill={c.horizon} opacity="0.25" />
      <circle cx="20" cy="24" r="8" fill={c.sun} />
      <line x1="20" y1="12" x2="20" y2="8" stroke={c.rays} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <line x1="12" y1="16" x2="9" y2="13" stroke={c.rays} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <line x1="28" y1="16" x2="31" y2="13" stroke={c.rays} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <line x1="8" y1="24" x2="5" y2="24" stroke={c.rays} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <line x1="32" y1="24" x2="35" y2="24" stroke={c.rays} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

function DhuhrSvg({ size }: { size: number }) {
  const c = STAGE_COLORS.dhuhr;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <rect width="40" height="40" rx="8" fill={c.sky} />
      <rect x="0" y="30" width="40" height="10" rx="0" fill={c.horizon} opacity="0.2" />
      <circle cx="20" cy="16" r="8" fill={c.sun} />
      <line x1="20" y1="4" x2="20" y2="1" stroke={c.rays} strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
      <line x1="20" y1="28" x2="20" y2="31" stroke={c.rays} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <line x1="8" y1="16" x2="5" y2="16" stroke={c.rays} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="32" y1="16" x2="35" y2="16" stroke={c.rays} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="12" y1="8" x2="9" y2="5" stroke={c.rays} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <line x1="28" y1="8" x2="31" y2="5" stroke={c.rays} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <line x1="12" y1="24" x2="9" y2="27" stroke={c.rays} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <line x1="28" y1="24" x2="31" y2="27" stroke={c.rays} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

function AsrSvg({ size }: { size: number }) {
  const c = STAGE_COLORS.asr;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <rect width="40" height="40" rx="8" fill={c.sky} />
      <rect x="0" y="26" width="40" height="14" rx="0" fill={c.horizon} opacity="0.25" />
      <circle cx="28" cy="20" r="8" fill={c.sun} opacity="0.9" />
      <line x1="28" y1="8" x2="28" y2="5" stroke={c.rays} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="36" y1="14" x2="38" y2="12" stroke={c.rays} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <line x1="36" y1="26" x2="38" y2="28" stroke={c.rays} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <line x1="20" y1="14" x2="18" y2="12" stroke={c.rays} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <path d="M3 26 Q10 24 17 26 Q24 28 31 26 Q35 25 38 26" fill="none" stroke={c.horizon} strokeWidth="1" opacity="0.3" />
    </svg>
  );
}

function MaghribSvg({ size }: { size: number }) {
  const c = STAGE_COLORS.maghrib;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <defs>
        <linearGradient id="maghrib-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FED7AA" />
          <stop offset="60%" stopColor="#FECACA" />
          <stop offset="100%" stopColor="#C4B5FD" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="8" fill="url(#maghrib-sky)" />
      <circle cx="20" cy="30" r="7" fill={c.sun} opacity="0.7" />
      <line x1="20" y1="20" x2="20" y2="17" stroke={c.rays} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <line x1="13" y1="25" x2="10" y2="22" stroke={c.rays} strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      <line x1="27" y1="25" x2="30" y2="22" stroke={c.rays} strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      <rect x="0" y="30" width="40" height="10" rx="0" fill={c.horizon} opacity="0.2" />
    </svg>
  );
}

function IshaSvg({ size }: { size: number }) {
  const c = STAGE_COLORS.isha;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <rect width="40" height="40" rx="8" fill={c.sky} />
      <rect x="0" y="30" width="40" height="10" rx="0" fill={c.horizon} opacity="0.3" />
      <path d="M22 10 A8 8 0 1 0 22 26 A6 6 0 1 1 22 10" fill={c.sun} opacity="0.8" />
      <circle cx="12" cy="10" r="1" fill={c.rays} opacity="0.6" />
      <circle cx="32" cy="8" r="0.8" fill={c.rays} opacity="0.5" />
      <circle cx="8" cy="20" r="0.8" fill={c.rays} opacity="0.4" />
      <circle cx="35" cy="18" r="1" fill={c.rays} opacity="0.5" />
      <circle cx="15" cy="6" r="0.6" fill={c.rays} opacity="0.3" />
      <circle cx="30" cy="28" r="0.7" fill={c.rays} opacity="0.3" />
    </svg>
  );
}

export function SunStageIcon({ stage, size = 32 }: { stage: SunStage; size?: number }) {
  switch (stage) {
    case "fajr": return <FajrSvg size={size} />;
    case "sunrise": return <SunriseSvg size={size} />;
    case "dhuhr": return <DhuhrSvg size={size} />;
    case "asr": return <AsrSvg size={size} />;
    case "maghrib": return <MaghribSvg size={size} />;
    case "isha": return <IshaSvg size={size} />;
    default: return <DhuhrSvg size={size} />;
  }
}

export function getSunStage(prayerName: string): SunStage {
  const name = prayerName.toLowerCase();
  if (name === "fajr") return "fajr";
  if (name === "sunrise") return "sunrise";
  if (name === "dhuhr") return "dhuhr";
  if (name === "asr") return "asr";
  if (name === "maghrib") return "maghrib";
  if (name === "isha") return "isha";
  return "dhuhr";
}
