import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Award, Calendar, Clock, Activity, Star, ThumbsUp, Zap, Brain, Flame } from "lucide-react";
import { usePrayersData, useMarkPrayerMutation, usePrayerStats } from "@/hooks/use-prayers";
import { useEffectiveSession } from "@/hooks/use-effective-session";
import { cn } from "@/lib/utils";
import { SlideUpPanel } from "@/components/SlideUpPanel";
import { haptic } from "@/lib/haptics";
import { playAchievementChime } from "@/lib/sounds";

const PRAYERS = [
  { id: "fajr", name: "Fajr", arabic: "الفجر", timeDesc: "Dawn" },
  { id: "dhuhr", name: "Dhuhr", arabic: "الظهر", timeDesc: "Midday" },
  { id: "asr", name: "Asr", arabic: "العصر", timeDesc: "Afternoon" },
  { id: "maghrib", name: "Maghrib", arabic: "المغرب", timeDesc: "Sunset" },
  { id: "isha", name: "Isha", arabic: "العشاء", timeDesc: "Night" },
];

export default function Prayers() {
  // Use a query param to control default tab if needed
  const searchParams = new URLSearchParams(window.location.search);
  const initialTab = searchParams.get('tab') as any || "today";
  const [activeTab, setActiveTab] = useState<"today" | "stats" | "how-to-pray">(initialTab);

  return (
    <div className="flex-1 px-5 pt-4 pb-6 min-h-full flex flex-col bg-background">
      <header className="mb-6 z-10">
        <h1 className="text-3xl font-bold text-foreground mb-2">Salah</h1>
        <p className="text-muted-foreground text-sm font-medium">Your daily connection with Allah.</p>
      </header>

      {/* Internal Tabs */}
      <div className="flex p-1 bg-muted rounded-full mb-6 z-10 shadow-inner shrink-0 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setActiveTab("today")}
          className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-bold rounded-full transition-all whitespace-nowrap ${
            activeTab === "today" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Today
        </button>
        <button
          onClick={() => setActiveTab("stats")}
          className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-bold rounded-full transition-all whitespace-nowrap ${
            activeTab === "stats" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Stats
        </button>
        <button
          onClick={() => setActiveTab("how-to-pray")}
          className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-bold rounded-full transition-all whitespace-nowrap ${
            activeTab === "how-to-pray" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          How to Pray
        </button>
      </div>

      <div className="flex-1 z-10 overflow-y-auto pb-12">
        <AnimatePresence mode="wait">
          {activeTab === "today" && <motion.div key="today" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><TodayTab /></motion.div>}
          {activeTab === "stats" && <motion.div key="stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><StatsTab /></motion.div>}
          {activeTab === "how-to-pray" && <motion.div key="how-to" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><HowToPrayTab /></motion.div>}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TodayTab() {
  const [date] = useState(new Date().toISOString().split('T')[0]);
  const sessionId = useEffectiveSession();
  
  const { data: log, isLoading } = usePrayersData(date);
  const { mutate: markPrayer } = useMarkPrayerMutation();

  const [selectedPrayer, setSelectedPrayer] = useState<typeof PRAYERS[0] | null>(null);
  const [formQuality, setFormQuality] = useState("good");
  const [formDhikr, setFormDhikr] = useState(true);
  const [formTime, setFormTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });

  const handleMark = (status: 'completed' | 'missed' | 'late') => {
    if (!sessionId || !selectedPrayer) return;
    if (status === 'completed') {
      haptic("success");
      playAchievementChime();
    } else {
      haptic("tap");
    }
    markPrayer({
      prayerName: selectedPrayer.id,
      status,
      date,
      quality: formQuality,
      didDhikr: formDhikr,
      notes: status === 'completed' ? `Prayed at ${formTime}` : ""
    });
    setSelectedPrayer(null);
  };

  const getStatusInfo = (id: string) => {
    const p = log?.prayers?.[id];
    if (!p) return { status: 'pending', time: null, quality: null, dhikr: null };
    return { status: p.status, time: p.loggedAt, quality: p.quality, dhikr: p.didDhikr };
  };

  if (isLoading) {
    return <div className="p-8 text-center text-primary mt-10">Loading Prayers...</div>;
  }

  const streak = log?.streak || 0;
  const completedCount = log?.totalCompleted || 0;
  const isAllCompleted = completedCount === 5;
  const today = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date(date));

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground text-sm font-bold flex items-center gap-2 bg-card px-4 py-2 rounded-full border border-border shadow-sm">
          <Calendar className="w-4 h-4" /> {today}
        </p>
        <div className="flex items-center gap-1.5 bg-secondary/10 px-3 py-1.5 rounded-full border border-secondary/20">
          <Award className="w-4 h-4 text-secondary" />
          <span className="text-xs font-bold text-secondary">{streak} Day Streak</span>
        </div>
      </div>

      {isAllCompleted && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary text-white rounded-[2rem] p-5 mb-6 shadow-md flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-card/20 rounded-full flex items-center justify-center shrink-0">
            <Check className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight">Alhamdulillah!</h3>
            <p className="text-sm text-primary-foreground/90 font-medium">All 5 prayers completed today.</p>
          </div>
        </motion.div>
      )}

      <div className="space-y-4">
        {PRAYERS.map((prayer, index) => {
          const info = getStatusInfo(prayer.id);
          const isPending = info.status === 'pending';
          const isCompleted = info.status === 'completed';
          const isMissed = info.status === 'missed';
          
          return (
            <motion.div
              key={prayer.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => isPending && setSelectedPrayer(prayer)}
              className={cn(
                "frosted-card rounded-3xl p-5 flex flex-col gap-3 transition-all",
                isPending ? "cursor-pointer active:scale-[0.98] hover:border-primary/50 hover:shadow-md" : "opacity-90",
                isCompleted ? "border-primary/40 bg-primary/5" : "border-border",
                isMissed ? "border-red-200 bg-red-50/50" : ""
              )}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center",
                    isPending ? "bg-slate-100 text-slate-400" :
                    isCompleted ? "bg-primary text-white shadow-sm" : "bg-red-100 text-red-500"
                  )}>
                    {isPending ? <Clock className="w-5 h-5" /> : isCompleted ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                      {prayer.name}
                      {info.quality === 'excellent' && <Star className="w-4 h-4 text-secondary" />}
                      {info.quality === 'distracted' && <X className="w-4 h-4 text-orange-400" />}
                      {info.quality === 'rushed' && <Activity className="w-4 h-4 text-amber-500" />}
                    </h3>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-0.5">{prayer.timeDesc}</p>
                  </div>
                </div>
                
                <span className="text-2xl arabic-text text-secondary opacity-70 font-bold">{prayer.arabic}</span>
              </div>
              
              {isCompleted && (
                <div className="mt-2 pt-3 border-t border-border flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs font-semibold text-muted-foreground">
                      {(() => {
                        const p = log?.prayers?.[prayer.id];
                        if (p?.notes?.startsWith("Prayed at ")) return p.notes;
                        if (info.time) return `Logged ${new Date(info.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
                        return "Logged";
                      })()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {info.quality && info.quality !== 'good' && (
                      <span className="text-[10px] font-bold text-muted-foreground capitalize bg-muted px-2 py-0.5 rounded-full">{info.quality}</span>
                    )}
                    {info.dhikr
                      ? <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">+ Dhikr ✓</span>
                      : <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">No Dhikr</span>
                    }
                  </div>
                </div>
              )}
              {isMissed && (
                <div className="mt-1 pt-2 border-t border-border/50">
                  <span className="text-[10px] font-bold text-red-400">Marked as missed — may Allah forgive us</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <SlideUpPanel
        isOpen={!!selectedPrayer}
        onClose={() => setSelectedPrayer(null)}
        title={selectedPrayer ? `Log ${selectedPrayer.name}` : ""}
      >
        {selectedPrayer && (
          <div className="space-y-8 pt-4">
            <div className="text-center space-y-2">
              <p className="text-4xl arabic-text text-secondary leading-relaxed">{selectedPrayer.arabic}</p>
              <p className="text-lg font-bold text-foreground">{selectedPrayer.name} Prayer</p>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-foreground pl-1">How was your prayer?</label>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setFormQuality('excellent')} className={cn("py-5 rounded-3xl text-base font-bold border-2 transition-all flex flex-col items-center gap-2", formQuality === 'excellent' ? "bg-primary/15 border-primary text-primary scale-[1.02] shadow-md" : "bg-card border-border text-muted-foreground")}>
                  <Star className="w-6 h-6" strokeWidth={formQuality === 'excellent' ? 2.5 : 1.5} />
                  Excellent
                </button>
                <button onClick={() => setFormQuality('good')} className={cn("py-5 rounded-3xl text-base font-bold border-2 transition-all flex flex-col items-center gap-2", formQuality === 'good' ? "bg-primary/15 border-primary text-primary scale-[1.02] shadow-md" : "bg-card border-border text-muted-foreground")}>
                  <ThumbsUp className="w-6 h-6" strokeWidth={formQuality === 'good' ? 2.5 : 1.5} />
                  Good
                </button>
                <button onClick={() => setFormQuality('rushed')} className={cn("py-5 rounded-3xl text-base font-bold border-2 transition-all flex flex-col items-center gap-2", formQuality === 'rushed' ? "bg-orange-100 border-orange-400 text-orange-600 scale-[1.02] shadow-md" : "bg-card border-border text-muted-foreground")}>
                  <Zap className="w-6 h-6" strokeWidth={formQuality === 'rushed' ? 2.5 : 1.5} />
                  Rushed
                </button>
                <button onClick={() => setFormQuality('distracted')} className={cn("py-5 rounded-3xl text-base font-bold border-2 transition-all flex flex-col items-center gap-2", formQuality === 'distracted' ? "bg-red-100 border-red-400 text-red-600 scale-[1.02] shadow-md" : "bg-card border-border text-muted-foreground")}>
                  <Brain className="w-6 h-6" strokeWidth={formQuality === 'distracted' ? 2.5 : 1.5} />
                  Distracted
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-foreground pl-1">Did you do Dhikr after?</label>
              <div className="flex gap-3">
                <button onClick={() => setFormDhikr(true)} className={cn("flex-1 py-5 rounded-3xl text-lg font-bold border-2 transition-all flex flex-col items-center gap-2", formDhikr ? "bg-primary/15 border-primary text-primary scale-[1.02] shadow-md" : "bg-card border-border text-muted-foreground")}>
                  <Check className="w-7 h-7" strokeWidth={formDhikr ? 2.5 : 1.5} />
                  Yes
                </button>
                <button onClick={() => setFormDhikr(false)} className={cn("flex-1 py-5 rounded-3xl text-lg font-bold border-2 transition-all flex flex-col items-center gap-2", !formDhikr ? "bg-red-100 border-red-400 text-red-600 scale-[1.02] shadow-md" : "bg-card border-border text-muted-foreground")}>
                  <X className="w-7 h-7" strokeWidth={!formDhikr ? 2.5 : 1.5} />
                  No
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-foreground pl-1">What time did you pray?</label>
              <input
                type="time"
                value={formTime}
                onChange={(e) => setFormTime(e.target.value)}
                className="w-full py-4 px-6 rounded-3xl border-2 border-border bg-card text-foreground text-lg font-bold text-center focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button onClick={() => handleMark('missed')} className="flex-1 py-5 bg-muted text-muted-foreground rounded-3xl text-lg font-bold shadow-sm active:scale-95 transition-transform flex items-center justify-center gap-2">
                <X className="w-5 h-5" /> Missed
              </button>
              <button onClick={() => handleMark('completed')} className="flex-[2] py-5 bg-primary text-white rounded-3xl text-lg font-bold shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2">
                <Check className="w-5 h-5" /> I Prayed
              </button>
            </div>
          </div>
        )}
      </SlideUpPanel>
    </>
  );
}

function PrayerDots({ completed, total = 5 }: { completed: number; total?: number }) {
  const PRAYER_ABBR = ["F", "D", "A", "M", "I"];
  return (
    <div className="flex gap-1">
      {[...Array(total)].map((_, i) => (
        <div
          key={i}
          title={["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"][i]}
          className={cn(
            "w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-black transition-all",
            i < completed
              ? "bg-primary text-white shadow-sm"
              : "bg-muted text-muted-foreground/50"
          )}
        >
          {PRAYER_ABBR[i]}
        </div>
      ))}
    </div>
  );
}

function StatsTab() {
  const [period, setPeriod] = useState<"week" | "month">("week");
  const { data: stats, isLoading } = usePrayerStats(period);

  if (isLoading) {
    return <div className="p-8 text-center text-primary mt-10">Loading Stats...</div>;
  }

  const s = stats || { totalPrayers: 0, completedPrayers: 0, missedPrayers: 0, streak: 0, bestStreak: 0, dhikrAfterPrayer: 0, dailyBreakdown: [] };
  const totalPossible = s.dailyBreakdown.length * 5 || 35;
  const completionRate = totalPossible > 0 ? Math.round((s.completedPrayers / totalPossible) * 100) : 0;
  const circumference = 2 * Math.PI * 26;

  return (
    <div className="space-y-5">
      <div className="flex bg-muted p-1 rounded-full w-full max-w-[200px] mx-auto">
        <button onClick={() => setPeriod("week")} className={cn("flex-1 py-2 text-xs font-bold rounded-full", period === "week" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground")}>Week</button>
        <button onClick={() => setPeriod("month")} className={cn("flex-1 py-2 text-xs font-bold rounded-full", period === "month" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground")}>Month</button>
      </div>

      {/* Streak banner */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-3xl p-5 flex items-center justify-between text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
            <Flame className="w-6 h-6 text-orange-300" />
          </div>
          <div>
            <p className="text-3xl font-black tabular-nums">{s.streak}</p>
            <p className="text-xs font-bold text-white/80 uppercase tracking-wider">Day Streak</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-white/60 uppercase tracking-wider mb-1">Best Streak</p>
          <p className="text-xl font-black">{s.bestStreak || s.streak} days</p>
        </div>
      </div>

      {/* Completion ring + stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-1 bg-card rounded-3xl border border-border shadow-sm flex items-center justify-center p-4">
          <div className="relative">
            <svg width="68" height="68" viewBox="0 0 68 68">
              <circle cx="34" cy="34" r="26" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
              <circle
                cx="34" cy="34" r="26" fill="none"
                stroke="hsl(var(--primary))" strokeWidth="6"
                strokeDasharray={`${(completionRate / 100) * circumference} ${circumference}`}
                strokeLinecap="round"
                transform="rotate(-90 34 34)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-black text-primary">{completionRate}%</span>
            </div>
          </div>
        </div>
        <div className="col-span-2 grid grid-cols-2 gap-3">
          <div className="bg-card p-4 rounded-3xl border border-border shadow-sm">
            <p className="text-2xl font-black text-primary mb-0.5">{s.completedPrayers}</p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Prayed</p>
          </div>
          <div className="bg-card p-4 rounded-3xl border border-border shadow-sm">
            <p className="text-2xl font-black text-red-500 mb-0.5">{s.missedPrayers}</p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Missed</p>
          </div>
          <div className="bg-card p-4 rounded-3xl border border-border shadow-sm col-span-2">
            <p className="text-2xl font-black text-purple-500 mb-0.5">{s.dhikrAfterPrayer}</p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Post-Prayer Dhikr</p>
          </div>
        </div>
      </div>

      {/* Prayer timeline chart */}
      <div className="bg-card p-5 rounded-3xl border border-border shadow-sm">
        <h3 className="text-sm font-bold text-foreground mb-1 flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" /> Prayer Timeline
        </h3>
        <div className="flex gap-1.5 mb-3 pl-12">
          {["F", "D", "A", "M", "I"].map((p) => (
            <span key={p} className="w-7 text-center text-[9px] font-black text-muted-foreground">{p}</span>
          ))}
        </div>
        {s.dailyBreakdown.length > 0 ? (
          <div className="space-y-2.5">
            {s.dailyBreakdown.map((day: any, i: number) => {
              const date = new Date(day.date);
              const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
              const isToday = new Date().toDateString() === date.toDateString();
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className={cn("text-xs font-black w-9 text-right", isToday ? "text-primary" : "text-muted-foreground")}>
                    {isToday ? "Today" : dayName}
                  </span>
                  <PrayerDots completed={day.completed} />
                  <span className={cn(
                    "text-xs font-black ml-1 w-6",
                    day.completed === 5 ? "text-primary" : day.completed === 0 ? "text-muted-foreground/40" : "text-foreground"
                  )}>
                    {day.completed}/5
                  </span>
                  {day.completed === 5 && <Check className="w-3 h-3 text-primary" />}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 flex flex-col items-center gap-2">
            <p className="text-sm text-muted-foreground text-center">No prayer data yet.</p>
            <p className="text-xs text-muted-foreground text-center">Log your first prayer on the Today tab.</p>
          </div>
        )}

        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-full bg-primary" /><span className="text-[10px] text-muted-foreground font-medium">Prayed</span></div>
          <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-full bg-muted" /><span className="text-[10px] text-muted-foreground font-medium">Not logged</span></div>
        </div>
      </div>
    </div>
  );
}

function HowToPrayTab() {
  const steps = [
    { num: 1, title: "Niyyah (Intention)", arabic: "النِّيَّة", text: "Make the intention in your heart for the specific prayer you are about to perform." },
    { num: 2, title: "Takbiratul Ihram", arabic: "اللهُ أَكْبَر", text: "Raise hands to ears and say Allahu Akbar (Allah is the Greatest)." },
    { num: 3, title: "Qiyam (Standing)", arabic: "الْقِيَام", text: "Place right hand over left on chest. Recite Surah Al-Fatiha, then another Surah." },
    { num: 4, title: "Ruku (Bowing)", arabic: "سُبْحَانَ رَبِّيَ الْعَظِيمِ", text: "Bow with hands on knees, back flat. Say SubhanAllah Rabbial Azeem 3 times." },
    { num: 5, title: "I'tidal (Rising)", arabic: "سَمِعَ اللهُ لِمَنْ حَمِدَهُ", text: "Stand straight up and say Sami'Allahu liman hamidah." },
    { num: 6, title: "Sujud (Prostration)", arabic: "سُبْحَانَ رَبِّيَ الْأَعْلَى", text: "Prostrate with forehead, nose, hands, knees, and toes on ground. Say SubhanAllah Rabbial A'la 3 times." },
    { num: 7, title: "Jalsah (Sitting)", arabic: "رَبِّ اغْفِرْ لِي", text: "Sit up briefly and say Rabbighfir li (Lord, forgive me)." },
    { num: 8, title: "Tashahhud", arabic: "التَّشَهُّد", text: "Final sitting. Recite At-Tahiyyat and Salawat on Prophet Muhammad ﷺ." },
    { num: 9, title: "Salam", arabic: "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ", text: "Turn head right then left, saying As-salamu alaykum wa rahmatullah each time." }
  ];

  return (
    <div className="space-y-4">
      {steps.map((step) => (
        <div key={step.num} className="bg-card rounded-[2rem] p-6 shadow-sm border border-border flex gap-5 items-start">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl shrink-0 font-bold">
            {step.num}
          </div>
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg text-foreground">
                {step.title}
              </h3>
            </div>
            <p className="text-xl arabic-text text-secondary mb-3">{step.arabic}</p>
            <p className="text-sm text-foreground/80 leading-relaxed font-medium">{step.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
