import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

export interface DhikrEntry {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  meaning: string;
  targetCount: number;
  count: number;
  totalCount: number;
  level: number;
  category: string;
  reward: string;
}

export interface PrayerLog {
  date: string;
  fajr?: string;
  dhuhr?: string;
  asr?: string;
  maghrib?: string;
  isha?: string;
}

export interface QuranLog {
  sura: number;
  suraName: string;
  ayat: string;
  notes: string;
  date: string;
  type: "reading" | "memorising";
}

const DEFAULT_DHIKR: DhikrEntry[] = [
  {
    id: "subhanallah",
    arabic: "سُبْحَانَ اللّٰهِ",
    transliteration: "SubhanAllah",
    translation: "Glory be to Allah",
    meaning: "Praising Allah and declaring Him free from all imperfections",
    targetCount: 33,
    count: 0,
    totalCount: 0,
    level: 1,
    category: "Tasbih",
    reward: "A date palm tree planted for you in Jannah",
  },
  {
    id: "alhamdulillah",
    arabic: "الْحَمْدُ لِلّٰهِ",
    transliteration: "Alhamdulillah",
    translation: "All praise is for Allah",
    meaning: "Expressing gratitude and praise for Allah",
    targetCount: 33,
    count: 0,
    totalCount: 0,
    level: 1,
    category: "Tahmid",
    reward: "Fills the scales of good deeds",
  },
  {
    id: "allahuakbar",
    arabic: "اللّٰهُ أَكْبَرُ",
    transliteration: "Allahu Akbar",
    translation: "Allah is the Greatest",
    meaning: "Declaring the greatness and supremacy of Allah",
    targetCount: 34,
    count: 0,
    totalCount: 0,
    level: 1,
    category: "Takbir",
    reward: "Fills what is between the heavens and the earth",
  },
  {
    id: "lahaula",
    arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللّٰهِ",
    transliteration: "La hawla wa la quwwata illa billah",
    translation: "There is no power except with Allah",
    meaning: "Acknowledging that all strength comes from Allah alone",
    targetCount: 100,
    count: 0,
    totalCount: 0,
    level: 1,
    category: "Hawqala",
    reward: "A treasure from the treasures of Jannah",
  },
  {
    id: "astaghfirullah",
    arabic: "أَسْتَغْفِرُ اللّٰهَ",
    transliteration: "Astaghfirullah",
    translation: "I seek forgiveness from Allah",
    meaning: "Seeking Allah's forgiveness and mercy",
    targetCount: 100,
    count: 0,
    totalCount: 0,
    level: 1,
    category: "Istighfar",
    reward: "Opens the doors of mercy and provision",
  },
  {
    id: "salawat",
    arabic: "اللّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ",
    transliteration: "Allahumma salli ala Muhammad",
    translation: "O Allah, send blessings upon Muhammad",
    meaning: "Sending blessings upon the Prophet ﷺ",
    targetCount: 10,
    count: 0,
    totalCount: 0,
    level: 1,
    category: "Salawat",
    reward: "Allah sends ten blessings upon you in return",
  },
];

interface AppDataContextValue {
  dhikrList: DhikrEntry[];
  prayerLog: PrayerLog[];
  quranLog: QuranLog[];
  incrementDhikr: (id: string) => void;
  resetDhikr: (id: string) => void;
  logPrayer: (date: string, prayer: string, status: string) => void;
  addQuranLog: (entry: QuranLog) => void;
  isLoading: boolean;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [dhikrList, setDhikrList] = useState<DhikrEntry[]>(DEFAULT_DHIKR);
  const [prayerLog, setPrayerLog] = useState<PrayerLog[]>([]);
  const [quranLog, setQuranLog] = useState<QuranLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [d, p, q] = await Promise.all([
        AsyncStorage.getItem("dhikr_data"),
        AsyncStorage.getItem("prayer_log"),
        AsyncStorage.getItem("quran_log"),
      ]);
      if (d) setDhikrList(JSON.parse(d));
      if (p) setPrayerLog(JSON.parse(p));
      if (q) setQuranLog(JSON.parse(q));
    } catch {}
    setIsLoading(false);
  }

  const incrementDhikr = useCallback((id: string) => {
    setDhikrList((prev) => {
      const next = prev.map((d) => {
        if (d.id !== id) return d;
        const newCount = d.count + 1;
        const completed = newCount >= d.targetCount;
        const newTotal = d.totalCount + 1;
        const newLevel = Math.floor(newTotal / (d.targetCount * 10)) + 1;
        return {
          ...d,
          count: completed ? 0 : newCount,
          totalCount: newTotal,
          level: newLevel,
        };
      });
      AsyncStorage.setItem("dhikr_data", JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const resetDhikr = useCallback((id: string) => {
    setDhikrList((prev) => {
      const next = prev.map((d) => (d.id === id ? { ...d, count: 0 } : d));
      AsyncStorage.setItem("dhikr_data", JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const logPrayer = useCallback((date: string, prayer: string, status: string) => {
    setPrayerLog((prev) => {
      const existing = prev.find((p) => p.date === date);
      let next: PrayerLog[];
      if (existing) {
        next = prev.map((p) => (p.date === date ? { ...p, [prayer]: status } : p));
      } else {
        next = [...prev, { date, [prayer]: status } as PrayerLog];
      }
      AsyncStorage.setItem("prayer_log", JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const addQuranLog = useCallback((entry: QuranLog) => {
    setQuranLog((prev) => {
      const next = [entry, ...prev].slice(0, 100);
      AsyncStorage.setItem("quran_log", JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  return (
    <AppDataContext.Provider value={{ dhikrList, prayerLog, quranLog, incrementDhikr, resetDhikr, logPrayer, addQuranLog, isLoading }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}
