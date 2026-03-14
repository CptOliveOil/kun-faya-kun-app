import { useState, useEffect } from "react";
import {
  Coordinates,
  CalculationMethod,
  CalculationParameters,
  PrayerTimes,
  SunnahTimes,
  Prayer,
  Madhab,
} from "adhan";

export type CalcMethodKey =
  | "MuslimWorldLeague"
  | "Egyptian"
  | "Karachi"
  | "UmmAlQura"
  | "Dubai"
  | "MoonsightingCommittee"
  | "NorthAmerica"
  | "Kuwait"
  | "Qatar"
  | "Singapore"
  | "Tehran"
  | "Turkey";

export type AsrMethodKey = "Standard" | "Hanafi";

export const CALC_METHODS: { key: CalcMethodKey; label: string }[] = [
  { key: "MuslimWorldLeague", label: "Muslim World League" },
  { key: "Egyptian", label: "Egyptian General Authority" },
  { key: "Karachi", label: "University of Islamic Sciences, Karachi" },
  { key: "UmmAlQura", label: "Umm Al-Qura University, Makkah" },
  { key: "Dubai", label: "Dubai" },
  { key: "MoonsightingCommittee", label: "Moonsighting Committee" },
  { key: "NorthAmerica", label: "ISNA (North America)" },
  { key: "Kuwait", label: "Kuwait" },
  { key: "Qatar", label: "Qatar" },
  { key: "Singapore", label: "Singapore" },
  { key: "Tehran", label: "Institute of Geophysics, Tehran" },
  { key: "Turkey", label: "Diyanet, Turkey" },
];

export const ASR_METHODS: { key: AsrMethodKey; label: string }[] = [
  { key: "Standard", label: "Shafi / Hanbali / Maliki" },
  { key: "Hanafi", label: "Hanafi" },
];

function getCalcParams(method: CalcMethodKey, asrMethod: AsrMethodKey): CalculationParameters {
  const methodMap: Record<CalcMethodKey, () => CalculationParameters> = {
    MuslimWorldLeague: () => CalculationMethod.MuslimWorldLeague(),
    Egyptian: () => CalculationMethod.Egyptian(),
    Karachi: () => CalculationMethod.Karachi(),
    UmmAlQura: () => CalculationMethod.UmmAlQura(),
    Dubai: () => CalculationMethod.Dubai(),
    MoonsightingCommittee: () => CalculationMethod.MoonsightingCommittee(),
    NorthAmerica: () => CalculationMethod.NorthAmerica(),
    Kuwait: () => CalculationMethod.Kuwait(),
    Qatar: () => CalculationMethod.Qatar(),
    Singapore: () => CalculationMethod.Singapore(),
    Tehran: () => CalculationMethod.Tehran(),
    Turkey: () => CalculationMethod.Turkey(),
  };

  const params = (methodMap[method] || methodMap.MuslimWorldLeague)();
  params.madhab = asrMethod === "Hanafi" ? Madhab.Hanafi : Madhab.Shafi;
  return params;
}

export function usePrayerCalcSettings() {
  const [calcMethod, setCalcMethod] = useState<CalcMethodKey>(() => {
    return (localStorage.getItem("dhikr_calc_method") as CalcMethodKey) || "MuslimWorldLeague";
  });
  const [asrMethod, setAsrMethod] = useState<AsrMethodKey>(() => {
    return (localStorage.getItem("dhikr_asr_method") as AsrMethodKey) || "Standard";
  });

  const updateCalcMethod = (m: CalcMethodKey) => {
    setCalcMethod(m);
    localStorage.setItem("dhikr_calc_method", m);
  };

  const updateAsrMethod = (m: AsrMethodKey) => {
    setAsrMethod(m);
    localStorage.setItem("dhikr_asr_method", m);
  };

  return { calcMethod, asrMethod, updateCalcMethod, updateAsrMethod };
}

export interface PrayerTime {
  name: string;
  arabicName: string;
  time: Date;
  key: Prayer | "sunrise" | "midnight";
}

export interface PrayerTimesData {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
  midnight: Date;
  prayers: PrayerTime[];
  nextPrayer: PrayerTime | null;
  currentPrayer: PrayerTime | null;
  coords: { latitude: number; longitude: number } | null;
}

export function usePrayerTimes(offsets: Record<string, number> = {}) {
  const [data, setData] = useState<PrayerTimesData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const calcMethod = (localStorage.getItem("dhikr_calc_method") as CalcMethodKey) || "MuslimWorldLeague";
  const asrMethod = (localStorage.getItem("dhikr_asr_method") as AsrMethodKey) || "Standard";

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = new Coordinates(
          position.coords.latitude,
          position.coords.longitude
        );
        const date = new Date();
        const params = getCalcParams(calcMethod, asrMethod);

        const times = new PrayerTimes(coords, date, params);
        const sunnah = new SunnahTimes(times);

        function applyOffset(time: Date, prayerKey: string): Date {
          const offset = offsets[prayerKey] || 0;
          if (offset === 0) return time;
          return new Date(time.getTime() + offset * 60 * 1000);
        }

        const fajr = applyOffset(times.fajr, "fajr");
        const sunrise = applyOffset(times.sunrise, "sunrise");
        const dhuhr = applyOffset(times.dhuhr, "dhuhr");
        const asr = applyOffset(times.asr, "asr");
        const maghrib = applyOffset(times.maghrib, "maghrib");
        const isha = applyOffset(times.isha, "isha");
        const midnight = sunnah.middleOfTheNight;

        const prayerList: PrayerTime[] = [
          { key: Prayer.Fajr, name: "Fajr", arabicName: "الفجر", time: fajr },
          { key: "sunrise", name: "Sunrise", arabicName: "الشروق", time: sunrise },
          { key: Prayer.Dhuhr, name: "Dhuhr", arabicName: "الظهر", time: dhuhr },
          { key: Prayer.Asr, name: "Asr", arabicName: "العصر", time: asr },
          { key: Prayer.Maghrib, name: "Maghrib", arabicName: "المغرب", time: maghrib },
          { key: Prayer.Isha, name: "Isha", arabicName: "العشاء", time: isha },
        ];

        const now = new Date();
        const nextPrayer = prayerList.find((p) => p.time > now) || null;
        const currentIdx = nextPrayer ? prayerList.indexOf(nextPrayer) - 1 : prayerList.length - 1;
        const currentPrayer = currentIdx >= 0 ? prayerList[currentIdx]! : prayerList[prayerList.length - 1]!;

        setData({
          fajr,
          sunrise,
          dhuhr,
          asr,
          maghrib,
          isha,
          midnight,
          prayers: prayerList,
          nextPrayer,
          currentPrayer,
          coords: { latitude: position.coords.latitude, longitude: position.coords.longitude },
        });
        setLoading(false);
      },
      (err) => {
        setError("Location access denied. Enable location for prayer times.");
        setLoading(false);
      },
      { timeout: 10000 }
    );
  }, [JSON.stringify(offsets), calcMethod, asrMethod]);

  return { data, error, loading };
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function getTimeUntil(date: Date): string {
  const diff = date.getTime() - Date.now();
  if (diff <= 0) return "Now";
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const remainMins = mins % 60;
  if (hours > 0) return `${hours}h ${remainMins}m`;
  return `${mins}m`;
}
