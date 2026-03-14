import { useState } from "react";
import { motion } from "framer-motion";
import { Flame, Target, Star, Award, TrendingUp, BookOpen, Clock, CheckCircle, BookHeart, Play, Zap } from "lucide-react";
import { useUserProgress } from "@/hooks/use-app-data";
import { usePrayerStats } from "@/hooks/use-prayers";
import { useQuranLog } from "@/hooks/use-quran";
import { cn } from "@/lib/utils";

export default function Stats() {
  const { data: progress } = useUserProgress();
  const [prayerPeriod, setPrayerPeriod] = useState<"week" | "month">("week");
  const { data: prayerStats } = usePrayerStats(prayerPeriod);
  const { data: quranLog } = useQuranLog();
  const [activeSection, setActiveSection] = useState<"dhikr" | "prayers" | "quran">("dhikr");

  const dhikr = {
    total: progress?.totalTasbeehat || 0,
    streak: progress?.streak || 0,
    milestones: progress?.completedMilestones?.length || 0,
  };

  const prayer = prayerStats || {
    totalPrayers: 0,
    completedPrayers: 0,
    missedPrayers: 0,
    streak: 0,
    dhikrAfterPrayer: 0,
    dailyBreakdown: [],
  };

  const prayerRate = prayer.totalPrayers > 0
    ? Math.round((prayer.completedPrayers / prayer.totalPrayers) * 100)
    : 0;

  const lastEntry = quranLog?.entries?.[0];
  const quran = {
    lastSurah: lastEntry?.surahTo ? `Surah ${lastEntry.surahTo}` : "—",
    lastAyah: lastEntry?.ayahTo || 0,
    totalPages: quranLog?.totalPages || 0,
    juzCompleted: Math.floor(quranLog?.totalJuz || 0),
    totalJuz: quranLog?.totalJuz || 0,
    streak: quranLog?.streak || 0,
  };

  const videoWatched = (() => {
    let count = 0;
    const cats = ["r", "h", "s", "q", "l", "d"];
    for (const prefix of cats) {
      for (let i = 1; i <= 10; i++) {
        try {
          const d = localStorage.getItem(`dhikr_video_progress_${prefix}${i}`);
          if (d && JSON.parse(d).percent >= 90) count++;
        } catch {}
      }
    }
    return count;
  })();

  const sections = [
    { id: "dhikr" as const, label: "Dhikr", icon: Zap },
    { id: "prayers" as const, label: "Salah", icon: Clock },
    { id: "quran" as const, label: "Quran", icon: BookHeart },
  ];

  const totalStreak = Math.max(dhikr.streak, prayer.streak, quran.streak);

  return (
    <div className="flex-1 px-5 pt-2 pb-6 min-h-full flex flex-col bg-background">
      <header className="mb-4 z-10">
        <h1 className="text-2xl font-bold text-foreground">Your Journey</h1>
        <p className="text-muted-foreground text-xs mt-1">Track your spiritual progress</p>
      </header>

      {/* Overview hero */}
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-4 text-white flex flex-col items-center justify-center gap-1.5 shadow-md">
          <Flame className="w-5 h-5 text-orange-300" />
          <p className="text-2xl font-black">{totalStreak}</p>
          <p className="text-[9px] font-bold text-white/70 uppercase tracking-wider text-center">Best Streak</p>
        </div>
        <div className="bg-gradient-to-br from-secondary to-secondary/80 rounded-3xl p-4 flex flex-col items-center justify-center gap-1.5 shadow-md">
          <Star className="w-5 h-5 text-white" />
          <p className="text-2xl font-black text-white">{dhikr.milestones}</p>
          <p className="text-[9px] font-bold text-white/70 uppercase tracking-wider text-center">Milestones</p>
        </div>
        <div className="bg-gradient-to-br from-silver to-silver/80 rounded-3xl p-4 flex flex-col items-center justify-center gap-1.5 shadow-md">
          <Target className="w-5 h-5 text-white" />
          <p className="text-2xl font-black text-white">{prayer.completedPrayers + dhikr.milestones + quran.juzCompleted}</p>
          <p className="text-[9px] font-bold text-white/70 uppercase tracking-wider text-center">Achievements</p>
        </div>
      </div>

      <div className="flex p-1 bg-muted rounded-full mb-5 z-10 shadow-inner shrink-0">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={cn(
                "flex-1 py-2.5 px-3 text-xs font-bold rounded-full transition-all flex items-center justify-center gap-1.5",
                activeSection === s.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {s.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-5 z-10 pb-20 overflow-y-auto flex-1">
        {activeSection === "dhikr" && (
          <motion.div key="dhikr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-6 shadow-md relative overflow-hidden"
            >
              <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-6 translate-y-6">
                <TrendingUp className="w-32 h-32 text-white" />
              </div>
              <p className="text-primary-foreground/70 font-bold text-[10px] uppercase tracking-widest mb-1">Total Tasbeehat</p>
              <p className="text-5xl font-bold text-white">{dhikr.total.toLocaleString()}</p>
              <div className="flex gap-8 mt-4">
                <div>
                  <p className="text-white font-bold text-xl">{dhikr.streak}</p>
                  <p className="text-white/60 text-[10px] font-semibold uppercase">Day Streak</p>
                </div>
                <div>
                  <p className="text-white font-bold text-xl">{dhikr.milestones}</p>
                  <p className="text-white/60 text-[10px] font-semibold uppercase">Milestones</p>
                </div>
                <div>
                  <p className="text-white font-bold text-xl">{videoWatched}</p>
                  <p className="text-white/60 text-[10px] font-semibold uppercase">Videos</p>
                </div>
              </div>
            </motion.div>

            <section>
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 text-secondary" /> Achievements
              </h2>
              <div className="space-y-2.5">
                {[
                  { title: "First Step", desc: "Complete 33 Dhikr", unlocked: dhikr.total >= 33, icon: Star },
                  { title: "Century Club", desc: "Complete 100 Dhikr", unlocked: dhikr.total >= 100, icon: Target },
                  { title: "Thousand!", desc: "Complete 1,000 Dhikr", unlocked: dhikr.total >= 1000, icon: TrendingUp },
                  { title: "Consistent", desc: "3 Day Streak", unlocked: dhikr.streak >= 3, icon: Flame },
                  { title: "Week Warrior", desc: "7 Day Streak", unlocked: dhikr.streak >= 7, icon: Flame },
                  { title: "Scholar", desc: "Read 10 Duas", unlocked: dhikr.milestones >= 2, icon: BookOpen },
                  { title: "Video Learner", desc: "Watch 5 videos", unlocked: videoWatched >= 5, icon: Play },
                ].map((ach, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + (i * 0.04) }}
                    className={cn(
                      "flex items-center gap-3 p-3.5 rounded-2xl border shadow-sm",
                      ach.unlocked ? "bg-card border-border" : "bg-muted/50 border-muted opacity-50 grayscale"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      ach.unlocked ? "bg-secondary/10 text-secondary" : "bg-muted text-muted-foreground"
                    )}>
                      <ach.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm text-foreground">{ach.title}</h3>
                      <p className="text-xs text-muted-foreground">{ach.desc}</p>
                    </div>
                    {ach.unlocked && <CheckCircle className="w-5 h-5 text-primary shrink-0" />}
                  </motion.div>
                ))}
              </div>
            </section>
          </motion.div>
        )}

        {activeSection === "prayers" && (
          <motion.div key="prayers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            <div className="flex items-center justify-end mb-1">
              <div className="flex bg-muted p-0.5 rounded-full">
                <button onClick={() => setPrayerPeriod("week")} className={cn("px-3 py-1.5 text-[10px] font-bold rounded-full", prayerPeriod === "week" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground")}>Week</button>
                <button onClick={() => setPrayerPeriod("month")} className={cn("px-3 py-1.5 text-[10px] font-bold rounded-full", prayerPeriod === "month" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground")}>Month</button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-card p-5 rounded-3xl border border-border shadow-sm text-center">
                <p className="text-3xl font-bold text-primary">{prayer.completedPrayers}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Completed</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card p-5 rounded-3xl border border-border shadow-sm text-center">
                <p className="text-3xl font-bold text-destructive">{prayer.missedPrayers}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Missed</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card p-5 rounded-3xl border border-border shadow-sm text-center">
                <p className="text-3xl font-bold text-secondary">{prayerRate}%</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Success Rate</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card p-5 rounded-3xl border border-border shadow-sm text-center">
                <p className="text-3xl font-bold text-purple-500">{prayer.dhikrAfterPrayer}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Post-Dhikr</p>
              </motion.div>
            </div>

            <div className="bg-card p-5 rounded-3xl border border-border shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                <Flame className="w-7 h-7 text-secondary" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{prayer.streak}</p>
                <p className="text-xs text-muted-foreground font-bold">Day Streak</p>
              </div>
            </div>

            {prayer.dailyBreakdown?.length > 0 && (
              <div className="bg-card p-5 rounded-3xl border border-border shadow-sm">
                <h3 className="text-sm font-bold text-foreground mb-4">Daily Breakdown</h3>
                <div className="space-y-3">
                  {prayer.dailyBreakdown.map((day: any, i: number) => {
                    const date = new Date(day.date);
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-muted-foreground w-8">{dayName}</span>
                        <div className="flex-1 flex gap-1">
                          {[...Array(5)].map((_, j) => (
                            <div key={j} className={cn("h-3 flex-1 rounded-full transition-colors", j < day.completed ? "bg-primary" : "bg-muted")} />
                          ))}
                        </div>
                        <span className="text-[10px] font-bold text-foreground w-6 text-right">{day.completed}/5</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeSection === "quran" && (
          <motion.div key="quran" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-[#1D4E89] to-[#1D4E89]/80 rounded-3xl p-6 shadow-md relative overflow-hidden"
            >
              <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-6 translate-y-6">
                <BookHeart className="w-32 h-32 text-white" />
              </div>
              <p className="text-white/70 font-bold text-[10px] uppercase tracking-widest mb-1">Quran Reading</p>
              <p className="text-lg font-bold text-white mt-2">
                Last Read: {quran.lastSurah}{quran.lastAyah > 0 ? `, Ayah ${quran.lastAyah}` : ""}
              </p>
              <div className="flex gap-8 mt-4">
                <div>
                  <p className="text-white font-bold text-xl">{quran.totalPages}</p>
                  <p className="text-white/60 text-[10px] font-semibold uppercase">Pages Read</p>
                </div>
                <div>
                  <p className="text-white font-bold text-xl">{quran.totalJuz.toFixed(1)}</p>
                  <p className="text-white/60 text-[10px] font-semibold uppercase">Juz Done</p>
                </div>
                <div>
                  <p className="text-white font-bold text-xl">{quran.streak}</p>
                  <p className="text-white/60 text-[10px] font-semibold uppercase">Day Streak</p>
                </div>
              </div>
            </motion.div>

            <div className="bg-card p-5 rounded-3xl border border-border shadow-sm">
              <h3 className="text-sm font-bold text-foreground mb-4">Quran Completion</h3>
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20">
                  <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                    <circle cx="18" cy="18" r="15" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="15" fill="none"
                      stroke="#1D4E89" strokeWidth="3"
                      strokeDasharray={`${(quran.juzCompleted / 30) * 94.25} 94.25`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-foreground">
                    {quran.juzCompleted}/30
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground">Juz Completed</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {quran.juzCompleted > 0
                      ? `${Math.round((quran.juzCompleted / 30) * 100)}% of the Quran`
                      : "Start reading to track your progress"}
                  </p>
                  <div className="w-full h-2 bg-muted rounded-full mt-3 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#1D4E89] transition-all"
                      style={{ width: `${(quran.totalPages / 604) * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">{quran.totalPages} / 604 pages</p>
                </div>
              </div>
            </div>

            <div className="bg-card p-5 rounded-3xl border border-border shadow-sm">
              <h3 className="text-sm font-bold text-foreground mb-3">Achievements</h3>
              <div className="space-y-2.5">
                {[
                  { title: "First Page", desc: "Read your first page", unlocked: quran.totalPages >= 1, icon: BookOpen },
                  { title: "First Juz", desc: "Complete 1 Juz", unlocked: quran.juzCompleted >= 1, icon: BookHeart },
                  { title: "Halfway", desc: "Complete 15 Juz", unlocked: quran.juzCompleted >= 15, icon: Star },
                  { title: "Khatm!", desc: "Complete all 30 Juz", unlocked: quran.juzCompleted >= 30, icon: Award },
                  { title: "Daily Reader", desc: "3 day reading streak", unlocked: quran.streak >= 3, icon: Flame },
                ].map((ach, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-2xl border",
                      ach.unlocked ? "bg-card border-border" : "bg-muted/50 border-muted opacity-50 grayscale"
                    )}
                  >
                    <div className={cn(
                      "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                      ach.unlocked ? "bg-[#1D4E89]/10 text-[#1D4E89]" : "bg-muted text-muted-foreground"
                    )}>
                      <ach.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-xs text-foreground">{ach.title}</h3>
                      <p className="text-[10px] text-muted-foreground">{ach.desc}</p>
                    </div>
                    {ach.unlocked && <CheckCircle className="w-4 h-4 text-[#1D4E89] shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
