import { useMemo } from "react";
import type { PrayerTimesData } from "@/hooks/use-prayer-times";
import { formatTime } from "@/hooks/use-prayer-times";

interface SunArcProps {
  data: PrayerTimesData;
}

function timeToMinutes(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

function minutesToProgress(minutes: number, startMin: number, endMin: number): number {
  return Math.max(0, Math.min(1, (minutes - startMin) / (endMin - startMin)));
}

function arcPoint(cx: number, cy: number, r: number, progress: number) {
  const angle = Math.PI * progress; // 0 = left end, 0.5 = top, 1 = right end
  return {
    x: cx - r * Math.cos(angle),
    y: cy - r * Math.sin(angle),
  };
}

export function SunArc({ data }: SunArcProps) {
  // All elements must fit strictly inside this viewBox — no overflow
  const W = 320;
  const H = 178;
  // Horizon sits 38px from bottom to leave room for time labels below it
  const cy = H - 38; // 140
  // cx centred, with left/right margins so arc ends don't clip
  const cx = W / 2;  // 160
  // radius: top of arc = cy - r = 140 - 90 = 50 (room for Dhuhr label below arc)
  const r = 90;

  const startMin = timeToMinutes(data.fajr);
  const endMin   = timeToMinutes(data.isha);
  const nowMin   = timeToMinutes(new Date());

  const progress  = minutesToProgress(nowMin, startMin, endMin);
  const sunPos    = arcPoint(cx, cy, r, progress);

  const isSunVisible = nowMin >= timeToMinutes(data.sunrise) &&
                       nowMin <= timeToMinutes(data.maghrib);
  const isPreDawn    = nowMin < startMin;
  const isPostIsha   = nowMin > endMin;
  const isNight      = isPreDawn || isPostIsha;

  const prayerMarkers = useMemo(() => {
    const prayers = [
      { name: "Fajr",    time: data.fajr    },
      { name: "Dhuhr",   time: data.dhuhr   },
      { name: "Asr",     time: data.asr     },
      { name: "Maghrib", time: data.maghrib },
      { name: "Isha",    time: data.isha    },
    ];
    return prayers.map(({ name, time }, idx) => {
      const min      = timeToMinutes(time);
      const prog     = minutesToProgress(min, startMin, endMin);
      const pos      = arcPoint(cx, cy, r, prog);
      const isPast   = nowMin >= min;
      // Dhuhr (idx 1) sits at the top — put its label BELOW the dot
      // All others (near horizon) — label ABOVE the dot
      const labelBelow = idx === 1;
      const labelY     = labelBelow ? pos.y + 14 : pos.y - 12;
      return { name, pos, min, isPast, labelBelow, labelY };
    });
  }, [data, startMin, endMin, nowMin, cx, cy, r]);

  // Elapsed arc endpoint
  const elapsedProg     = Math.min(progress, 1);
  const elapsedPt       = arcPoint(cx, cy, r, elapsedProg);
  const elapsedLargeArc = elapsedProg > 0.5 ? 1 : 0;

  // Moon x position: pre-dawn = near left, post-isha = near right
  const moonX = isPreDawn ? cx - r + 8 : cx + r - 8;
  const moonY = cy + 20;

  return (
    <div className="w-full select-none">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ display: "block" }}
      >
        <defs>
          <linearGradient id="sunarc-sky" x1="0" y1="0" x2="0" y2="1">
            {isSunVisible ? (
              <>
                <stop offset="0%" stopColor="#FEF9C3" />
                <stop offset="100%" stopColor="#FEF3C7" stopOpacity="0.1" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#DDD6FE" />
                <stop offset="100%" stopColor="#EDE9FE" stopOpacity="0.1" />
              </>
            )}
          </linearGradient>
          {/* Clip to above-horizon area only for the sky fill */}
          <clipPath id="sunarc-above">
            <rect x={cx - r - 2} y={0} width={(r + 2) * 2} height={cy} />
          </clipPath>
        </defs>

        {/* Sky fill inside arc */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="url(#sunarc-sky)"
          stroke="none"
          clipPath="url(#sunarc-above)"
        />

        {/* Dashed arc track */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="#D1D5DB"
          strokeWidth={1.5}
          strokeDasharray="5 4"
        />

        {/* Horizon line */}
        <line
          x1={cx - r - 10} y1={cy}
          x2={cx + r + 10} y2={cy}
          stroke="#E5E7EB"
          strokeWidth={1.5}
        />

        {/* Coloured elapsed arc */}
        {nowMin > startMin && progress > 0 && (
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 ${elapsedLargeArc} 1 ${elapsedPt.x} ${elapsedPt.y}`}
            fill="none"
            stroke={isSunVisible ? "#F59E0B" : "#818CF8"}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        )}

        {/* Prayer markers */}
        {prayerMarkers.map(({ name, pos, isPast, labelBelow, labelY }) => (
          <g key={name}>
            <text
              x={pos.x}
              y={labelY}
              textAnchor="middle"
              fontSize={8}
              fontWeight="700"
              fill={isPast ? "#5da882" : "#9CA3AF"}
            >
              {name}
            </text>
            <line
              x1={pos.x} y1={pos.y + (labelBelow ? 5 : -5)}
              x2={pos.x} y2={pos.y + (labelBelow ? 9 : -9)}
              stroke={isPast ? "#5da88240" : "#E5E7EB"}
              strokeWidth={1}
            />
            <circle
              cx={pos.x} cy={pos.y}
              r={isPast ? 5 : 4}
              fill={isPast ? "#5da882" : "white"}
              stroke={isPast ? "#5da882" : "#D1D5DB"}
              strokeWidth={1.5}
            />
          </g>
        ))}

        {/* Sun (daytime) */}
        {!isNight && isSunVisible && (
          <g>
            <circle cx={sunPos.x} cy={sunPos.y} r={11} fill="#F59E0B" opacity={0.15} />
            <circle cx={sunPos.x} cy={sunPos.y} r={7}  fill="#F59E0B" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
              const rad = (deg * Math.PI) / 180;
              return (
                <line
                  key={deg}
                  x1={sunPos.x + 9  * Math.cos(rad)} y1={sunPos.y + 9  * Math.sin(rad)}
                  x2={sunPos.x + 13 * Math.cos(rad)} y2={sunPos.y + 13 * Math.sin(rad)}
                  stroke="#F59E0B" strokeWidth={1.5} strokeLinecap="round"
                />
              );
            })}
          </g>
        )}

        {/* Sun on arc during dawn/dusk (not daytime, not full night) */}
        {!isNight && !isSunVisible && (
          <g>
            <circle cx={sunPos.x} cy={sunPos.y} r={11} fill="#FB923C" opacity={0.15} />
            <circle cx={sunPos.x} cy={sunPos.y} r={7}  fill="#FB923C" />
          </g>
        )}

        {/* Moon (nighttime — pinned below horizon on the correct side) */}
        {isNight && (
          <g>
            <circle cx={moonX} cy={moonY} r={9} fill="#818CF8" opacity={0.2} />
            <circle cx={moonX} cy={moonY} r={6} fill="#818CF8" />
            <circle cx={moonX + 3} cy={moonY - 2} r={4} fill="#A5B4FC" />
          </g>
        )}

        {/* Bottom row: Fajr time — Day/Night label — Isha time */}
        <text x={cx - r}      y={cy + 16} textAnchor="middle" fontSize={8} fill="#9CA3AF" fontWeight="600">
          {formatTime(data.fajr)}
        </text>
        <text x={cx}          y={cy + 16} textAnchor="middle" fontSize={8.5} fontWeight="700"
          fill={isSunVisible ? "#D97706" : "#818CF8"}>
          {isSunVisible ? "Daytime" : "Nighttime"}
        </text>
        <text x={cx + r}      y={cy + 16} textAnchor="middle" fontSize={8} fill="#9CA3AF" fontWeight="600">
          {formatTime(data.isha)}
        </text>
      </svg>
    </div>
  );
}
