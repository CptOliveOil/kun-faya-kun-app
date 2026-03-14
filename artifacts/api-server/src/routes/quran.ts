import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { quranLogsTable, memorisationTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { randomUUID } from "crypto";
import { resolveSessionId } from "../lib/session.js";

const router: IRouter = Router();

function getTodayDate() {
  return new Date().toISOString().split("T")[0]!;
}

router.get("/quran/log", async (req, res) => {
  const { sessionId: querySid } = req.query as { sessionId?: string };
  const sessionId = resolveSessionId(req, querySid);

  if (!sessionId) {
    return res.json({ sessionId: "anonymous", entries: [], totalPages: 0, totalJuz: 0, streak: 0, lastRead: null });
  }

  const entries = await db
    .select()
    .from(quranLogsTable)
    .where(eq(quranLogsTable.sessionId, sessionId))
    .orderBy(desc(quranLogsTable.createdAt));

  const totalPages = entries.reduce((sum, e) => sum + (e.pages || 0), 0);
  const totalJuz = +(totalPages / 20).toFixed(2);

  const readDates = [...new Set(entries.map(e => e.date))].sort().reverse();
  let streak = 0;
  let checkDate = getTodayDate();

  for (const d of readDates) {
    if (d === checkDate) {
      streak++;
      const prev = new Date(checkDate);
      prev.setDate(prev.getDate() - 1);
      checkDate = prev.toISOString().split("T")[0]!;
    } else {
      break;
    }
  }

  return res.json({
    sessionId,
    entries: entries.map(e => ({
      id: e.id,
      date: e.date,
      surahFrom: e.surahFrom,
      ayahFrom: e.ayahFrom,
      surahTo: e.surahTo,
      ayahTo: e.ayahTo,
      pages: e.pages,
      duration: e.duration,
      notes: e.notes,
    })),
    totalPages,
    totalJuz,
    streak,
    lastRead: entries[0]?.date || null,
  });
});

router.post("/quran/log", async (req, res) => {
  const { sessionId: bodySid, surahFrom, ayahFrom, surahTo, ayahTo, pages, duration, notes } = req.body;
  const sessionId = resolveSessionId(req, bodySid);

  if (!sessionId || !surahFrom || !ayahFrom || !surahTo || !ayahTo) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  await db.insert(quranLogsTable).values({
    id: randomUUID(),
    sessionId,
    date: getTodayDate(),
    surahFrom: Number(surahFrom),
    ayahFrom: Number(ayahFrom),
    surahTo: Number(surahTo),
    ayahTo: Number(ayahTo),
    pages: Number(pages) || 0,
    duration: duration ? Number(duration) : null,
    notes: notes || null,
  });

  const entries = await db
    .select()
    .from(quranLogsTable)
    .where(eq(quranLogsTable.sessionId, sessionId))
    .orderBy(desc(quranLogsTable.createdAt));

  const totalPages = entries.reduce((sum, e) => sum + (e.pages || 0), 0);
  const totalJuz = +(totalPages / 20).toFixed(2);

  return res.json({
    sessionId,
    entries: entries.map(e => ({
      id: e.id,
      date: e.date,
      surahFrom: e.surahFrom,
      ayahFrom: e.ayahFrom,
      surahTo: e.surahTo,
      ayahTo: e.ayahTo,
      pages: e.pages,
      duration: e.duration,
      notes: e.notes,
    })),
    totalPages,
    totalJuz,
    streak: 1,
    lastRead: entries[0]?.date || null,
  });
});

router.get("/quran/memorisation", async (req, res) => {
  const { sessionId: querySid } = req.query as { sessionId?: string };
  const sessionId = resolveSessionId(req, querySid);

  if (!sessionId) {
    return res.json({ sessionId: "anonymous", memorisedAyahs: [], totalAyahs: 0, currentSurah: 1, currentAyah: 1, lastReviewed: null });
  }

  const ayahs = await db
    .select()
    .from(memorisationTable)
    .where(eq(memorisationTable.sessionId, sessionId))
    .orderBy(memorisationTable.surah, memorisationTable.ayah);

  return res.json({
    sessionId,
    memorisedAyahs: ayahs.map(a => ({
      surah: a.surah,
      ayah: a.ayah,
      surahName: a.surahName,
      strength: a.strength,
      lastReviewed: a.lastReviewed?.toISOString(),
    })),
    totalAyahs: ayahs.length,
    currentSurah: ayahs[ayahs.length - 1]?.surah || 1,
    currentAyah: ayahs[ayahs.length - 1]?.ayah || 1,
    lastReviewed: ayahs[ayahs.length - 1]?.lastReviewed?.toISOString() || null,
  });
});

router.post("/quran/memorisation", async (req, res) => {
  const { sessionId: bodySid, surah, ayah, surahName, strength } = req.body;
  const sessionId = resolveSessionId(req, bodySid);

  if (!sessionId || !surah || !ayah || !surahName) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const [existing] = await db
    .select()
    .from(memorisationTable)
    .where(
      and(
        eq(memorisationTable.sessionId, sessionId),
        eq(memorisationTable.surah, Number(surah)),
        eq(memorisationTable.ayah, Number(ayah))
      )
    )
    .limit(1);

  if (existing) {
    await db
      .update(memorisationTable)
      .set({ strength: strength || "new", lastReviewed: new Date() })
      .where(eq(memorisationTable.id, existing.id));
  } else {
    await db.insert(memorisationTable).values({
      id: randomUUID(),
      sessionId,
      surah: Number(surah),
      ayah: Number(ayah),
      surahName,
      strength: strength || "new",
    });
  }

  const ayahs = await db
    .select()
    .from(memorisationTable)
    .where(eq(memorisationTable.sessionId, sessionId))
    .orderBy(memorisationTable.surah, memorisationTable.ayah);

  return res.json({
    sessionId,
    memorisedAyahs: ayahs.map(a => ({
      surah: a.surah,
      ayah: a.ayah,
      surahName: a.surahName,
      strength: a.strength,
      lastReviewed: a.lastReviewed?.toISOString(),
    })),
    totalAyahs: ayahs.length,
    currentSurah: ayahs[ayahs.length - 1]?.surah || 1,
    currentAyah: ayahs[ayahs.length - 1]?.ayah || 1,
    lastReviewed: ayahs[ayahs.length - 1]?.lastReviewed?.toISOString() || null,
  });
});

export default router;
