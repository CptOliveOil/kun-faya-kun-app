import { motion } from "framer-motion";
import { Flame, Target, Star, Award, TrendingUp } from "lucide-react";
import { useUserProgress } from "@/hooks/use-app-data";
import { cn } from "@/lib/utils";

export default function Progress() {
  const { data: progress, isLoading } = useUserProgress();

  if (isLoading) {
    return <div className="p-8 text-center text-primary mt-20">Loading your journey...</div>;
  }

  // Fallback defaults if API returns null structure initially
  const stats = {
    total: progress?.totalTasbeehat || 0,
    streak: progress?.streak || 0,
    completedMilestones: progress?.completedMilestones?.length || 0,
    dhikrCounts: progress?.dhikrCounts || {}
  };

  const MOCK_ACHIEVEMENTS = [
    { id: 1, title: "First Step", desc: "Complete 33 Dhikr", unlocked: stats.total >= 33, icon: Star },
    { id: 2, title: "Century Club", desc: "Complete 100 Dhikr", unlocked: stats.total >= 100, icon: Target },
    { id: 3, title: "Consistent", desc: "3 Day Streak", unlocked: stats.streak >= 3, icon: Flame },
    { id: 4, title: "Knowledge Seeker", desc: "Unlock 5 Questions", unlocked: (progress?.unlockedQuestionIds?.length || 0) >= 5, icon: Award },
  ];

  return (
    <div className="flex-1 px-5 pt-2 pb-6 min-h-full flex flex-col relative z-10 bg-background">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Your Journey</h1>
        <p className="text-muted-foreground text-sm font-medium">Every remembrance is a seed planted in Jannah.</p>
      </header>

      {/* Hero Stats Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary rounded-[2rem] p-6 mb-8 shadow-md relative overflow-hidden"
      >
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-6 translate-y-6">
          <TrendingUp className="w-40 h-40 text-white" />
        </div>
        
        <div className="relative z-10">
          <p className="text-primary-foreground/80 font-bold text-xs uppercase tracking-widest mb-1">Total Tasbeehat</p>
          <p className="text-5xl font-bold text-white mb-2">{stats.total.toLocaleString()}</p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border p-5 rounded-3xl flex flex-col gap-3 shadow-sm"
        >
          <div className="p-2 w-12 h-12 rounded-2xl bg-orange-100 text-orange-500 flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-3xl font-bold text-foreground">{stats.streak}</p>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mt-1">Day Streak</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border p-5 rounded-3xl flex flex-col gap-3 shadow-sm"
        >
          <div className="p-2 w-12 h-12 rounded-2xl bg-blue-100 text-blue-500 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-3xl font-bold text-foreground">{stats.completedMilestones}</p>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mt-1">Milestones</p>
          </div>
        </motion.div>
      </div>

      {/* Achievements Section */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-4">
          Achievements
        </h2>
        
        <div className="space-y-3 pb-8">
          {MOCK_ACHIEVEMENTS.map((ach, i) => (
            <motion.div 
              key={ach.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (i * 0.1) }}
              className={cn(
                "flex items-center gap-4 p-4 rounded-[1.5rem] border transition-colors shadow-sm",
                ach.unlocked 
                  ? "bg-card border-border" 
                  : "bg-slate-50 border-slate-100 opacity-60 grayscale"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                ach.unlocked ? "bg-secondary/10 text-secondary" : "bg-slate-200 text-slate-400"
              )}>
                <ach.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground text-base">{ach.title}</h3>
                <p className="text-sm text-muted-foreground font-medium">{ach.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
