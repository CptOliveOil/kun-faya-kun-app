import { useId } from "react";

interface PrayerManProps {
  position: "standing" | "bowing" | "prostrating" | "sitting" | "hands-up" | "isha-moon";
  size?: number;
  fillPercent?: number;
}

export function PrayerManIcon({ position, size = 40, fillPercent = 0 }: PrayerManProps) {
  const uid = useId().replace(/:/g, "");
  const done = fillPercent >= 100;
  const s = done ? "#C9A84C" : "#2E7D5E";
  const f = done ? "#C9A84C" : "none";
  const fo = done ? 0.3 : 0;
  const sw = 2;

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <mask id={`cm-${uid}`}>
          <rect width="48" height="48" fill="black"/>
          {/* outer circle white */}
          <circle cx="22" cy="23" r="10" fill="white"/>
          {/* inner offset circle black — cuts out crescent */}
          <circle cx="27" cy="21" r="8.5" fill="black"/>
        </mask>
      </defs>

      {/* Fajr — Crescent + star (dawn) */}
      {position === "hands-up" && (
        <>
          {/* crescent using mask */}
          <circle cx="22" cy="23" r="10" stroke={s} strokeWidth={sw} fill={f} fillOpacity={fo} mask={`url(#cm-${uid})`}/>
          {/* stroke the crescent outline separately */}
          <path
            d="M22 13 C14 15 9 23 11 32 C13 41 22 46 30 42 C23 46 14 42 11 33 C8 23 14 13 23 11 Z"
            stroke={s} strokeWidth={sw} strokeLinejoin="round" fill={f} fillOpacity={fo}
          />
          {/* small 5-point star */}
          <path
            d="M37 11 L38.2 14.6 L42 14.6 L39 16.9 L40.1 20.5 L37 18.2 L33.9 20.5 L35 16.9 L32 14.6 L35.8 14.6 Z"
            stroke={s} strokeWidth="1.2" strokeLinejoin="round"
            fill={done ? "#C9A84C" : s} fillOpacity={done ? 1 : 0.2}
          />
        </>
      )}

      {/* Sunrise — Half-sun above horizon */}
      {position === "standing" && (
        <>
          <line x1="5" y1="31" x2="43" y2="31" stroke={s} strokeWidth={sw} strokeLinecap="round"/>
          <path d="M14 31 A10 10 0 0 1 34 31"
            stroke={s} strokeWidth={sw} strokeLinecap="round"
            fill={f} fillOpacity={fo}
          />
          <line x1="24" y1="16" x2="24" y2="12" stroke={s} strokeWidth={sw} strokeLinecap="round"/>
          <line x1="32" y1="20" x2="35" y2="17" stroke={s} strokeWidth={sw} strokeLinecap="round"/>
          <line x1="16" y1="20" x2="13" y2="17" stroke={s} strokeWidth={sw} strokeLinecap="round"/>
          <line x1="37" y1="27" x2="41" y2="25" stroke={s} strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="11" y1="27" x2="7"  y2="25" stroke={s} strokeWidth="1.5" strokeLinecap="round"/>
        </>
      )}

      {/* Dhuhr — Full sun at peak, 8 rays */}
      {position === "bowing" && (
        <>
          <circle cx="24" cy="23" r="8" stroke={s} strokeWidth={sw} fill={f} fillOpacity={fo}/>
          <line x1="24" y1="9"  x2="24" y2="13" stroke={s} strokeWidth={sw} strokeLinecap="round"/>
          <line x1="24" y1="33" x2="24" y2="37" stroke={s} strokeWidth={sw} strokeLinecap="round"/>
          <line x1="10" y1="23" x2="14" y2="23" stroke={s} strokeWidth={sw} strokeLinecap="round"/>
          <line x1="34" y1="23" x2="38" y2="23" stroke={s} strokeWidth={sw} strokeLinecap="round"/>
          <line x1="14" y1="13" x2="16.8" y2="15.8" stroke={s} strokeWidth={sw} strokeLinecap="round"/>
          <line x1="34" y1="33" x2="31.2" y2="30.2" stroke={s} strokeWidth={sw} strokeLinecap="round"/>
          <line x1="34" y1="13" x2="31.2" y2="15.8" stroke={s} strokeWidth={sw} strokeLinecap="round"/>
          <line x1="14" y1="33" x2="16.8" y2="30.2" stroke={s} strokeWidth={sw} strokeLinecap="round"/>
        </>
      )}

      {/* Asr — Sun lower in the sky */}
      {position === "prostrating" && (
        <>
          <circle cx="24" cy="29" r="8" stroke={s} strokeWidth={sw} fill={f} fillOpacity={fo}/>
          <line x1="24" y1="15" x2="24" y2="19" stroke={s} strokeWidth={sw} strokeLinecap="round"/>
          <line x1="11" y1="29" x2="15" y2="29" stroke={s} strokeWidth={sw} strokeLinecap="round"/>
          <line x1="33" y1="29" x2="37" y2="29" stroke={s} strokeWidth={sw} strokeLinecap="round"/>
          <line x1="14.5" y1="18.5" x2="17.2" y2="21.2" stroke={s} strokeWidth={sw} strokeLinecap="round"/>
          <line x1="33.5" y1="18.5" x2="30.8" y2="21.2" stroke={s} strokeWidth={sw} strokeLinecap="round"/>
          {/* ground shadow lines */}
          <line x1="9"  y1="41" x2="39" y2="41" stroke={s} strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.35"/>
          <line x1="14" y1="45" x2="34" y2="45" stroke={s} strokeWidth="0.7" strokeLinecap="round" strokeOpacity="0.18"/>
        </>
      )}

      {/* Maghrib — Sun half-set, horizon glow */}
      {position === "sitting" && (
        <>
          <line x1="5" y1="28" x2="43" y2="28" stroke={s} strokeWidth={sw} strokeLinecap="round"/>
          <path d="M14 28 A10 10 0 0 1 34 28"
            stroke={s} strokeWidth={sw} strokeLinecap="round"
            fill={f} fillOpacity={fo}
          />
          <line x1="24" y1="13" x2="24" y2="17" stroke={s} strokeWidth={sw} strokeLinecap="round"/>
          <line x1="14" y1="18" x2="16.8" y2="20.8" stroke={s} strokeWidth={sw} strokeLinecap="round"/>
          <line x1="34" y1="18" x2="31.2" y2="20.8" stroke={s} strokeWidth={sw} strokeLinecap="round"/>
          <line x1="8"  y1="25" x2="12" y2="25" stroke={s} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5"/>
          <line x1="40" y1="25" x2="36" y2="25" stroke={s} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5"/>
          {/* Horizon afterglow */}
          <line x1="7"  y1="33" x2="41" y2="33" stroke={s} strokeWidth="1"   strokeLinecap="round" strokeOpacity="0.3"/>
          <line x1="11" y1="38" x2="37" y2="38" stroke={s} strokeWidth="0.7" strokeLinecap="round" strokeOpacity="0.15"/>
        </>
      )}

      {/* Isha — Moon crescent + stars (night) */}
      {position === "isha-moon" && (
        <>
          {/* Crescent path: outer large arc left-side, inner arc back */}
          <path
            d="M23 12 C13 14 7 22 10 31 C13 40 23 45 32 41 C24 45 15 41 12 32 C9 23 15 13 24 11 Z"
            stroke={s} strokeWidth={sw} strokeLinejoin="round"
            fill={f} fillOpacity={fo}
          />
          {/* Stars */}
          <circle cx="37" cy="12" r="1.8" fill={s} opacity="0.9"/>
          <circle cx="40" cy="24" r="1.2" fill={s} opacity="0.6"/>
          <circle cx="12" cy="42" r="1.4" fill={s} opacity="0.5"/>
          <circle cx="36" cy="38" r="1"   fill={s} opacity="0.4"/>
          <circle cx="8"  cy="18" r="0.9" fill={s} opacity="0.35"/>
        </>
      )}

    </svg>
  );
}

const PRAYER_POSITIONS: Record<string, PrayerManProps["position"]> = {
  fajr:    "hands-up",
  sunrise: "standing",
  dhuhr:   "bowing",
  asr:     "prostrating",
  maghrib: "sitting",
  isha:    "isha-moon",
};

export function getPrayerPosition(prayerName: string): PrayerManProps["position"] {
  return PRAYER_POSITIONS[prayerName.toLowerCase()] || "standing";
}
