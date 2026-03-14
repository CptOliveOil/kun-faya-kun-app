import { pgTable, text, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const prayerLogsTable = pgTable("prayer_logs", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  date: text("date").notNull(),
  prayers: jsonb("prayers").notNull().default({}),
  streak: integer("streak").notNull().default(0),
  totalCompleted: integer("total_completed").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const quranLogsTable = pgTable("quran_logs", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  date: text("date").notNull(),
  surahFrom: integer("surah_from").notNull(),
  ayahFrom: integer("ayah_from").notNull(),
  surahTo: integer("surah_to").notNull(),
  ayahTo: integer("ayah_to").notNull(),
  pages: integer("pages").notNull().default(0),
  duration: integer("duration").default(0),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const memorisationTable = pgTable("memorisation", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  surah: integer("surah").notNull(),
  ayah: integer("ayah").notNull(),
  surahName: text("surah_name").notNull(),
  strength: text("strength").notNull().default("new"),
  lastReviewed: timestamp("last_reviewed").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPrayerLogSchema = createInsertSchema(prayerLogsTable);
export const insertQuranLogSchema = createInsertSchema(quranLogsTable);
export const insertMemorisationSchema = createInsertSchema(memorisationTable);

export type PrayerLog = typeof prayerLogsTable.$inferSelect;
export type InsertPrayerLog = typeof prayerLogsTable.$inferInsert;
export type QuranLog = typeof quranLogsTable.$inferSelect;
export type InsertQuranLog = typeof quranLogsTable.$inferInsert;
export type Memorisation = typeof memorisationTable.$inferSelect;
export type InsertMemorisation = typeof memorisationTable.$inferInsert;
