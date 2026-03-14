import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { prayerLogsTable } from "@workspace/db";
import { eq, and, gte, lte } from "drizzle-orm";
import { randomUUID } from "crypto";
import { resolveSessionId } from "../lib/session.js";

const router: IRouter = Router();

const PRAYER_NAMES = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

function getTodayDate() {
  return new Date().toISOString().split("T")[0]!;
}

function getDateRange(period: "week" | "month") {
  const end = new Date();
  const start = new Date();
  if (period === "week") {
    start.setDate(start.getDate() - 6);
  } else {
    start.setDate(start.getDate() - 29);
  }
  return {
    start: start.toISOString().split("T")[0]!,
    end: end.toISOString().split("T")[0]!,
  };
}

// POST-PRAYER DUAS for when dhikr is not done
export const POST_PRAYER_DUAS = [
  {
    arabic: "أَسْتَغْفِرُ اللهَ (×3)",
    transliteration: "Astaghfirullah (3 times)",
    translation: "I seek forgiveness from Allah",
    reference: "Muslim 591",
  },
  {
    arabic: "اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ",
    transliteration: "Allahumma antas-salam wa minkas-salam, tabarakta ya dhal-jalali wal-ikram",
    translation: "O Allah, You are Peace and from You is peace. Blessed are You, O Owner of Majesty and Honour.",
    reference: "Muslim 591",
  },
  {
    arabic: "لَا إِلَٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِير",
    transliteration: "La ilaha illallah wahdahu la sharika lah, lahul mulku wa lahul hamdu wa huwa ala kulli shay'in qadir",
    translation: "None has the right to be worshipped but Allah, alone, without partner. To Him belongs all sovereignty and praise. He is over all things omnipotent.",
    reference: "Muslim 594",
  },
  {
    arabic: "سُبْحَانَ اللهِ × ٣٣ | الْحَمْدُ لِلَّهِ × ٣٣ | اللهُ أَكْبَرُ × ٣٤",
    transliteration: "SubhanAllah x33 | Alhamdulillah x33 | Allahu Akbar x34",
    translation: "Glory be to Allah (33) | All praise to Allah (33) | Allah is Greatest (34) — Tasbih of Fatimah",
    reference: "Muslim 597",
  },
  {
    arabic: "اللهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...",
    transliteration: "Ayatul Kursi — Allahu la ilaha illa Huwal Hayyul Qayyum...",
    translation: "Ayatul Kursi (2:255) — The greatest verse in the Quran. Whoever recites it after every prayer, only death prevents them from entering Jannah.",
    reference: "Nasa'i, Ibn Sunni",
  },
];

router.get("/prayers", async (req, res) => {
  const { sessionId: querySid, date } = req.query as { sessionId?: string; date?: string };
  const sessionId = resolveSessionId(req, querySid);
  const targetDate = date || getTodayDate();

  const defaultPrayers: Record<string, { status: string; loggedAt?: string; quality?: string; didDhikr?: boolean; notes?: string }> = {
    Fajr: { status: "pending" },
    Dhuhr: { status: "pending" },
    Asr: { status: "pending" },
    Maghrib: { status: "pending" },
    Isha: { status: "pending" },
  };

  if (!sessionId) {
    return res.json({
      sessionId: "anonymous",
      date: targetDate,
      prayers: defaultPrayers,
      streak: 0,
      totalCompleted: 0,
    });
  }

  const [existing] = await db
    .select()
    .from(prayerLogsTable)
    .where(and(eq(prayerLogsTable.sessionId, sessionId), eq(prayerLogsTable.date, targetDate)))
    .limit(1);

  if (!existing) {
    return res.json({ sessionId, date: targetDate, prayers: defaultPrayers, streak: 0, totalCompleted: 0 });
  }

  return res.json({
    sessionId: existing.sessionId,
    date: existing.date,
    prayers: existing.prayers as Record<string, { status: string }>,
    streak: existing.streak,
    totalCompleted: existing.totalCompleted,
  });
});

router.post("/prayers", async (req, res) => {
  const { sessionId: bodySid, prayerName, status, quality, didDhikr, notes, date } = req.body;
  const sessionId = resolveSessionId(req, bodySid);

  if (!sessionId || !prayerName || !status) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const targetDate = date || getTodayDate();

  const [existing] = await db
    .select()
    .from(prayerLogsTable)
    .where(and(eq(prayerLogsTable.sessionId, sessionId), eq(prayerLogsTable.date, targetDate)))
    .limit(1);

  const prayers: Record<string, { status: string; loggedAt?: string; quality?: string; didDhikr?: boolean; notes?: string }> =
    (existing?.prayers as Record<string, { status: string }>) || {
      Fajr: { status: "pending" },
      Dhuhr: { status: "pending" },
      Asr: { status: "pending" },
      Maghrib: { status: "pending" },
      Isha: { status: "pending" },
    };

  prayers[prayerName] = {
    status,
    loggedAt: new Date().toISOString(),
    quality: quality || undefined,
    didDhikr: didDhikr !== undefined ? didDhikr : undefined,
    notes: notes || undefined,
  };

  const totalCompleted = PRAYER_NAMES.filter(p => prayers[p]?.status === "completed").length;

  let streak = existing?.streak || 0;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0]!;

  if (totalCompleted === 5) {
    const [yesterdayLog] = await db
      .select()
      .from(prayerLogsTable)
      .where(and(eq(prayerLogsTable.sessionId, sessionId), eq(prayerLogsTable.date, yesterdayStr)))
      .limit(1);
    streak = yesterdayLog && yesterdayLog.totalCompleted === 5 ? (yesterdayLog.streak || 0) + 1 : 1;
  }

  if (existing) {
    await db
      .update(prayerLogsTable)
      .set({ prayers, totalCompleted, streak, updatedAt: new Date() })
      .where(eq(prayerLogsTable.id, existing.id));
  } else {
    await db.insert(prayerLogsTable).values({ id: randomUUID(), sessionId, date: targetDate, prayers, totalCompleted, streak });
  }

  const responseData: { sessionId: string; date: string; prayers: typeof prayers; streak: number; totalCompleted: number; postPrayerDuas?: typeof POST_PRAYER_DUAS } = {
    sessionId,
    date: targetDate,
    prayers,
    streak,
    totalCompleted,
  };

  if (didDhikr === false) {
    responseData.postPrayerDuas = POST_PRAYER_DUAS;
  }

  return res.json(responseData);
});

router.get("/prayers/stats", async (req, res) => {
  const { sessionId: querySid, period = "week" } = req.query as { sessionId?: string; period?: "week" | "month" };
  const sessionId = resolveSessionId(req, querySid);

  if (!sessionId) {
    return res.json({
      sessionId: "anonymous",
      period,
      totalPrayers: 0,
      completedPrayers: 0,
      missedPrayers: 0,
      latePrayers: 0,
      streak: 0,
      bestStreak: 0,
      dhikrAfterPrayer: 0,
      dailyBreakdown: [],
    });
  }

  const { start, end } = getDateRange(period as "week" | "month");

  const logs = await db
    .select()
    .from(prayerLogsTable)
    .where(
      and(
        eq(prayerLogsTable.sessionId, sessionId),
        gte(prayerLogsTable.date, start),
        lte(prayerLogsTable.date, end)
      )
    );

  let totalPrayers = 0;
  let completedPrayers = 0;
  let missedPrayers = 0;
  let latePrayers = 0;
  let dhikrAfterPrayer = 0;
  let bestStreak = 0;
  const dailyBreakdown: { date: string; completed: number; total: number }[] = [];

  for (const log of logs) {
    const prayers = (log.prayers as Record<string, { status: string; didDhikr?: boolean }>) || {};
    let dayCompleted = 0;

    for (const pName of PRAYER_NAMES) {
      const p = prayers[pName];
      if (!p || p.status === "pending") continue;
      totalPrayers++;
      if (p.status === "completed") { completedPrayers++; dayCompleted++; }
      if (p.status === "missed") missedPrayers++;
      if (p.status === "late") { latePrayers++; dayCompleted++; }
      if (p.didDhikr) dhikrAfterPrayer++;
    }

    if ((log.streak || 0) > bestStreak) bestStreak = log.streak || 0;

    dailyBreakdown.push({ date: log.date, completed: dayCompleted, total: 5 });
  }

  const latestLog = logs.sort((a, b) => b.date.localeCompare(a.date))[0];
  const streak = latestLog?.streak || 0;

  return res.json({
    sessionId,
    period,
    totalPrayers,
    completedPrayers,
    missedPrayers,
    latePrayers,
    streak,
    bestStreak,
    dhikrAfterPrayer,
    dailyBreakdown: dailyBreakdown.sort((a, b) => a.date.localeCompare(b.date)),
  });
});

export default router;
