import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { userProgressTable, quizAttemptsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { DHIKR_LIST, QUIZ_QUESTIONS } from "../data/dhikr.js";
import { randomUUID } from "crypto";
import { resolveSessionId } from "../lib/session.js";

const router: IRouter = Router();

router.get("/dhikr", (_req, res) => {
  res.json(DHIKR_LIST);
});

router.get("/progress", async (req, res) => {
  const { sessionId: querySid } = req.query as { sessionId?: string };
  const sessionId = resolveSessionId(req, querySid);

  if (!sessionId) {
    const newSession = {
      sessionId: randomUUID(),
      totalTasbeehat: 0,
      dhikrCounts: {},
      unlockedQuestionIds: [],
      completedMilestones: [],
      streak: 0,
      lastActive: new Date().toISOString(),
    };
    return res.json(newSession);
  }

  const [existing] = await db
    .select()
    .from(userProgressTable)
    .where(eq(userProgressTable.sessionId, sessionId))
    .limit(1);

  if (!existing) {
    const newSession = {
      sessionId,
      totalTasbeehat: 0,
      dhikrCounts: {},
      unlockedQuestionIds: [],
      completedMilestones: [],
      streak: 0,
      lastActive: new Date().toISOString(),
    };
    return res.json(newSession);
  }

  return res.json({
    sessionId: existing.sessionId,
    totalTasbeehat: existing.totalTasbeehat,
    dhikrCounts: existing.dhikrCounts as Record<string, number>,
    unlockedQuestionIds: existing.unlockedQuestionIds as string[],
    completedMilestones: existing.completedMilestones as string[],
    streak: existing.streak,
    lastActive: existing.lastActive.toISOString(),
  });
});

router.post("/progress", async (req, res) => {
  const { sessionId: bodySid, dhikrId, count } = req.body;
  const sessionId = resolveSessionId(req, bodySid);

  if (!sessionId || !dhikrId || count == null) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const [existing] = await db
    .select()
    .from(userProgressTable)
    .where(eq(userProgressTable.sessionId, sessionId))
    .limit(1);

  const now = new Date();
  const todayStr = now.toDateString();

  let totalTasbeehat = count;
  let dhikrCounts: Record<string, number> = { [dhikrId]: count };
  let unlockedQuestionIds: string[] = [];
  let completedMilestones: string[] = [];
  let streak = 1;

  if (existing) {
    const prevCounts = (existing.dhikrCounts as Record<string, number>) || {};
    const prevTotal = existing.totalTasbeehat;
    const prevDhikrCount = prevCounts[dhikrId] || 0;
    const addedCount = Math.max(0, count - prevDhikrCount);

    totalTasbeehat = prevTotal + addedCount;
    dhikrCounts = { ...prevCounts, [dhikrId]: count };
    unlockedQuestionIds = (existing.unlockedQuestionIds as string[]) || [];
    completedMilestones = (existing.completedMilestones as string[]) || [];

    const lastActive = existing.lastActive;
    const lastStr = lastActive.toDateString();
    if (lastStr === todayStr) {
      streak = existing.streak;
    } else {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastStr === yesterday.toDateString()) {
        streak = existing.streak + 1;
      } else {
        streak = 1;
      }
    }
  }

  const newlyUnlocked: string[] = [];
  QUIZ_QUESTIONS.forEach((q) => {
    if (
      totalTasbeehat >= q.unlockedAt &&
      !unlockedQuestionIds.includes(q.id)
    ) {
      unlockedQuestionIds.push(q.id);
      newlyUnlocked.push(q.id);
    }
  });

  const MILESTONES = [33, 66, 100, 133, 166, 200, 333, 500, 1000];
  MILESTONES.forEach((m) => {
    const milestoneKey = `total_${m}`;
    if (totalTasbeehat >= m && !completedMilestones.includes(milestoneKey)) {
      completedMilestones.push(milestoneKey);
    }
  });

  if (existing) {
    await db
      .update(userProgressTable)
      .set({
        totalTasbeehat,
        dhikrCounts,
        unlockedQuestionIds,
        completedMilestones,
        streak,
        lastActive: now,
      })
      .where(eq(userProgressTable.sessionId, sessionId));
  } else {
    await db.insert(userProgressTable).values({
      sessionId,
      totalTasbeehat,
      dhikrCounts,
      unlockedQuestionIds,
      completedMilestones,
      streak,
      lastActive: now,
    });
  }

  return res.json({
    sessionId,
    totalTasbeehat,
    dhikrCounts,
    unlockedQuestionIds,
    completedMilestones,
    streak,
    lastActive: now.toISOString(),
  });
});

router.get("/quiz/unlocked", async (req, res) => {
  const { sessionId: querySid } = req.query as { sessionId?: string };
  const sessionId = resolveSessionId(req, querySid);

  if (!sessionId) {
    const basic = QUIZ_QUESTIONS.filter((q) => q.unlockedAt <= 0);
    return res.json(basic);
  }

  const [existing] = await db
    .select()
    .from(userProgressTable)
    .where(eq(userProgressTable.sessionId, sessionId))
    .limit(1);

  if (!existing) {
    return res.json([]);
  }

  const unlockedIds = (existing.unlockedQuestionIds as string[]) || [];
  const unlockedQuestions = QUIZ_QUESTIONS.filter((q) =>
    unlockedIds.includes(q.id)
  );

  return res.json(unlockedQuestions);
});

router.post("/quiz/answer", async (req, res) => {
  const { sessionId: bodySid, questionId, selectedIndex } = req.body;
  const sessionId = resolveSessionId(req, bodySid);

  if (!sessionId || !questionId || selectedIndex == null) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const question = QUIZ_QUESTIONS.find((q) => q.id === questionId);
  if (!question) {
    return res.status(404).json({ error: "Question not found" });
  }

  const correct = selectedIndex === question.correctIndex;
  const pointsEarned = correct ? 10 : 0;

  await db.insert(quizAttemptsTable).values({
    id: randomUUID(),
    sessionId,
    questionId,
    selectedIndex,
    correct: correct ? 1 : 0,
    attemptedAt: new Date(),
  });

  return res.json({
    correct,
    correctIndex: question.correctIndex,
    explanation: question.explanation,
    pointsEarned,
  });
});

export default router;
