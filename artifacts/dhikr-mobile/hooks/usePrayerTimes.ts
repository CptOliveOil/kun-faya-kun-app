import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { Coordinates, CalculationMethod, PrayerTimes, Prayer, SunnahTimes } from "adhan";

export interface PrayerTime {
  name: string;
  arabicName: string;
  time: Date;
  key: string;
  icon: string;
}

export interface PrayerData {
  prayers: PrayerTime[];
  nextPrayer: PrayerTime | null;
  coords: { latitude: number; longitude: number } | null;
  city: string | null;
  sunrise: Date;
}

const ARABIC_NAMES: Record<string, string> = {
  Fajr: "الفجر",
  Sunrise: "الشروق",
  Dhuhr: "الظهر",
  Asr: "العصر",
  Maghrib: "المغرب",
  Isha: "العشاء",
};

const ICONS: Record<string, string> = {
  Fajr: "🌄",
  Sunrise: "🌅",
  Dhuhr: "☀️",
  Asr: "🌤",
  Maghrib: "🌇",
  Isha: "🌙",
};

export function formatPrayerTime(d: Date): string {
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

export function getTimeUntil(d: Date): string {
  const diff = d.getTime() - Date.now();
  if (diff <= 0) return "Now";
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function usePrayerTimes(): { data: PrayerData | null; error: string | null; loading: boolean } {
  const [data, setData] = useState<PrayerData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Location permission needed for prayer times");
          setLoading(false);
          return;
        }

        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
        if (cancelled) return;

        const coords = new Coordinates(loc.coords.latitude, loc.coords.longitude);
        const params = CalculationMethod.MuslimWorldLeague();
        const date = new Date();
        const times = new PrayerTimes(coords, date, params);
        const sunnah = new SunnahTimes(times);

        let city: string | null = null;
        try {
          const rev = await Location.reverseGeocodeAsync(loc.coords);
          city = rev[0]?.city || rev[0]?.region || null;
        } catch {}

        if (cancelled) return;

        const prayerList: PrayerTime[] = [
          { name: "Fajr", arabicName: ARABIC_NAMES.Fajr, time: times.fajr, key: "fajr", icon: ICONS.Fajr },
          { name: "Dhuhr", arabicName: ARABIC_NAMES.Dhuhr, time: times.dhuhr, key: "dhuhr", icon: ICONS.Dhuhr },
          { name: "Asr", arabicName: ARABIC_NAMES.Asr, time: times.asr, key: "asr", icon: ICONS.Asr },
          { name: "Maghrib", arabicName: ARABIC_NAMES.Maghrib, time: times.maghrib, key: "maghrib", icon: ICONS.Maghrib },
          { name: "Isha", arabicName: ARABIC_NAMES.Isha, time: times.isha, key: "isha", icon: ICONS.Isha },
        ];

        const now = new Date();
        const next = prayerList.find((p) => p.time > now) || prayerList[0];

        setData({
          prayers: prayerList,
          nextPrayer: next,
          coords: { latitude: loc.coords.latitude, longitude: loc.coords.longitude },
          city,
          sunrise: times.sunrise,
        });
        setLoading(false);
      } catch (e) {
        if (!cancelled) {
          setError("Could not get prayer times");
          setLoading(false);
        }
      }
    }

    load();
    const interval = setInterval(load, 60000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return { data, error, loading };
}
