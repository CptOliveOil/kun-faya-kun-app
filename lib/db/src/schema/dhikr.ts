import { pgTable, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const userProgressTable = pgTable("user_progress", {
  sessionId: text("session_id").primaryKey(),
  totalTasbeehat: integer("total_tasbeehat").notNull().default(0),
  dhikrCounts: jsonb("dhikr_counts").notNull().default({}),
  unlockedQuestionIds: jsonb("unlocked_question_ids").notNull().default([]),
  completedMilestones: jsonb("completed_milestones").notNull().default([]),
  streak: integer("streak").notNull().default(0),
  lastActive: timestamp("last_active").notNull().defaultNow(),
});

export const quizAttemptsTable = pgTable("quiz_attempts", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  questionId: text("question_id").notNull(),
  selectedIndex: integer("selected_index").notNull(),
  correct: integer("correct").notNull().default(0),
  attemptedAt: timestamp("attempted_at").notNull().defaultNow(),
});

export const insertUserProgressSchema = createInsertSchema(userProgressTable);
export const insertQuizAttemptSchema = createInsertSchema(quizAttemptsTable);

export type UserProgress = typeof userProgressTable.$inferSelect;
export type InsertUserProgress = typeof userProgressTable.$inferInsert;
export type QuizAttempt = typeof quizAttemptsTable.$inferSelect;
export type InsertQuizAttempt = typeof quizAttemptsTable.$inferInsert;
