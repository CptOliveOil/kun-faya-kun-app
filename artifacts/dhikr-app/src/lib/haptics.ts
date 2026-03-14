type HapticType = "tap" | "success" | "light";

const PATTERNS: Record<HapticType, number | number[]> = {
  light: 5,
  tap: 12,
  success: [20, 60, 20],
};

export function haptic(type: HapticType = "tap"): void {
  try {
    if (typeof window !== "undefined" && window.navigator?.vibrate) {
      window.navigator.vibrate(PATTERNS[type]);
    }
  } catch {}
}
