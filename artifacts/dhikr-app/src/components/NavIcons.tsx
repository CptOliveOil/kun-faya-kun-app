import { cn } from "@/lib/utils";

interface IconProps {
  className?: string;
  active?: boolean;
}

export function HomeIcon({ className, active }: IconProps) {
  const c = active ? "#2E7D5E" : "#C9A84C";
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("w-6 h-6", className)}>
      <path d="M3 10.5L12 3L21 10.5V20C21 20.55 20.55 21 20 21H4C3.45 21 3 20.55 3 20V10.5Z" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 21V14H15V21" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DhikrBeadsIcon({ className, active }: IconProps) {
  const c = active ? "#2E7D5E" : "#C9A84C";
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("w-6 h-6", className)}>
      <circle cx="12" cy="4.5" r="2.5" stroke={c} strokeWidth="1.5" />
      <circle cx="6" cy="9" r="2" stroke={c} strokeWidth="1.5" />
      <circle cx="18" cy="9" r="2" stroke={c} strokeWidth="1.5" />
      <circle cx="4.5" cy="15" r="2" stroke={c} strokeWidth="1.5" />
      <circle cx="19.5" cy="15" r="2" stroke={c} strokeWidth="1.5" />
      <circle cx="8" cy="20" r="2" stroke={c} strokeWidth="1.5" />
      <circle cx="16" cy="20" r="2" stroke={c} strokeWidth="1.5" />
    </svg>
  );
}

export function PrayerIcon({ className, active }: IconProps) {
  const c = active ? "#2E7D5E" : "#C9A84C";
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("w-6 h-6", className)}>
      {/* Main building base */}
      <path d="M4 21V13H20V21" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Central dome */}
      <path d="M9 13V10C9 7.79 10.34 6 12 6C13.66 6 15 7.79 15 10V13" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      {/* Left minaret */}
      <path d="M4 13V9H6V13" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Left minaret top */}
      <path d="M5 9V7" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      {/* Right minaret */}
      <path d="M18 13V9H20V13" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Right minaret top */}
      <path d="M19 9V7" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      {/* Crescent on dome */}
      <path d="M12 5.5C11 5.5 10.3 4.7 10.5 3.7C11 4 11.6 4.1 12.2 3.9C12.7 3.7 13 3.3 13 2.9C13.7 3.4 13.8 4.4 13.3 5C13 5.3 12.5 5.5 12 5.5Z" fill={c} />
    </svg>
  );
}

export function LibraryBookIcon({ className, active }: IconProps) {
  const c = active ? "#2E7D5E" : "#C9A84C";
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("w-6 h-6", className)}>
      <path d="M4 4H10C11.1 4 12 4.9 12 6V20C12 19.17 11.33 18.5 10.5 18.5H4V4Z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M20 4H14C12.9 4 12 4.9 12 6V20C12 19.17 12.67 18.5 13.5 18.5H20V4Z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function VideoPlayIcon({ className, active }: IconProps) {
  const c = active ? "#2E7D5E" : "#C9A84C";
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("w-6 h-6", className)}>
      <rect x="3" y="5" width="18" height="14" rx="2" stroke={c} strokeWidth="1.5" />
      <path d="M10 8.5V15.5L16 12L10 8.5Z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function StatsChartIcon({ className, active }: IconProps) {
  const c = active ? "#2E7D5E" : "#C9A84C";
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("w-6 h-6", className)}>
      <path d="M4 20V14" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 20V10" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 20V6" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M19 20V3" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function SettingsGearIcon({ className, active }: IconProps) {
  const c = active ? "#2E7D5E" : "#C9A84C";
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("w-6 h-6", className)}>
      <circle cx="12" cy="12" r="3" stroke={c} strokeWidth="1.5" />
      <path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function HalalTokIcon({ className, active }: IconProps) {
  const c = active ? "#2E7D5E" : "#C9A84C";
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("w-7 h-7", className)}>
      <rect x="5" y="2" width="14" height="20" rx="3" stroke={c} strokeWidth="1.5" />
      <path d="M10 8L16 12L10 16V8Z" fill={c} stroke={c} strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}

export function QurandleIcon({ className, active }: IconProps) {
  const c = active ? "#2E7D5E" : "#C9A84C";
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("w-6 h-6", className)}>
      {/* Q letter: circle body */}
      <circle cx="10" cy="13" r="6.5" stroke={c} strokeWidth="1.6" />
      {/* Q letter: tail */}
      <path d="M14.5 16.5L18 20" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
      {/* Crescent moon accent at top-right */}
      <path d="M22 5.5C22 5.5 19.5 4 17.5 6C15.5 8 16.5 10.5 18.5 11.5C16 10.5 14.5 8.5 15 6.5C15.5 4.5 17.5 3 22 5.5Z" fill={c} />
    </svg>
  );
}

export function AppLogoIcon({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="30" fill="#2E7D5E" stroke="#C9A84C" strokeWidth="2.5" />
      <path d="M38 14C30 14 24 22 24 32C24 42 30 50 38 50C28 48 22 40 22 32C22 24 28 16 38 14Z" fill="#C9A84C" />
      <circle cx="42" cy="22" r="3.5" fill="#C9A84C" />
      <path d="M18 52L22 42L26 52" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
      <path d="M32 52L34 46L36 52" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
      <path d="M42 52L44 48L46 52" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
    </svg>
  );
}
