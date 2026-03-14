import { useState, useEffect } from "react";

const STORAGE_KEY = "dhikr_prayer_offsets";

const DEFAULT_OFFSETS: Record<string, number> = {
  fajr: 0,
  sunrise: 0,
  dhuhr: 0,
  asr: 0,
  maghrib: 0,
  isha: 0,
};

export function usePrayerOffsets() {
  const [offsets, setOffsets] = useState<Record<string, number>>(DEFAULT_OFFSETS);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setOffsets({ ...DEFAULT_OFFSETS, ...JSON.parse(stored) });
    } catch {}
  }, []);

  function updateOffset(prayer: string, delta: number) {
    setOffsets((prev) => {
      const next = { ...prev, [prayer]: (prev[prayer] || 0) + delta };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }

  function resetOffsets() {
    setOffsets(DEFAULT_OFFSETS);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }

  return { offsets, updateOffset, resetOffsets };
}
