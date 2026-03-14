import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, RotateCcw, Info, Gift, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDhikrData, useSaveUserProgress, triggerMilestoneCelebration } from "@/hooks/use-app-data";
import { useEffectiveSession } from "@/hooks/use-effective-session";
import { CounterRing } from "@/components/tasbeeh/CounterRing";
import { useToast } from "@/hooks/use-toast";
import { haptic } from "@/lib/haptics";
import { playAchievementChime } from "@/lib/sounds";

export default function Counter() {
  const { data: dhikrList, isLoading } = useDhikrData();
  const sessionId = useEffectiveSession();
  const { mutate: saveProgress } = useSaveUserProgress();
  const { toast } = useToast();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [isPressing, setIsPressing] = useState(false);
  const [activeTab, setActiveTab] = useState<"meaning" | "virtue" | "reward">("meaning");
  const clickCountRef = useRef(0);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentDhikr = dhikrList?.[currentIndex];

  const syncToBackend = (amount: number, id: string) => {
    if (!sessionId || amount === 0) return;
    saveProgress({
      data: {
        sessionId,
        dhikrId: id,
        count: amount
      }
    });
  };

  const handleTap = () => {
    if (!currentDhikr) return;
    
    haptic("tap");

    const newCount = count + 1;
    setCount(newCount);
    clickCountRef.current += 1;

    if (newCount > 0 && newCount % 33 === 0) {
      triggerMilestoneCelebration();
      haptic("success");
      playAchievementChime();
      
      toast({
        title: "Mashallah! Milestone reached.",
        description: "You've unlocked a new quiz question!",
        className: "bg-primary border-primary/30 text-white",
        duration: 3000,
      });

      syncToBackend(clickCountRef.current, currentDhikr.id);
      clickCountRef.current = 0;
    } else {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        syncToBackend(clickCountRef.current, currentDhikr.id);
        clickCountRef.current = 0;
      }, 3000);
    }
  };

  const handleReset = () => {
    haptic("light");
    if (clickCountRef.current > 0 && currentDhikr) {
      syncToBackend(clickCountRef.current, currentDhikr.id);
      clickCountRef.current = 0;
    }
    setCount(0);
  };

  const changeDhikr = (direction: 'next' | 'prev') => {
    if (!dhikrList) return;
    haptic("light");
    
    if (clickCountRef.current > 0 && currentDhikr) {
      syncToBackend(clickCountRef.current, currentDhikr.id);
      clickCountRef.current = 0;
    }

    if (direction === 'next') {
      setCurrentIndex((prev) => (prev + 1) % dhikrList.length);
    } else {
      setCurrentIndex((prev) => (prev - 1 + dhikrList.length) % dhikrList.length);
    }
    setCount(0);
  };

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      if (clickCountRef.current > 0 && currentDhikr) {
        syncToBackend(clickCountRef.current, currentDhikr.id);
      }
    };
  }, [currentDhikr]);

  if (isLoading || !currentDhikr) {
    return <div className="flex-1 flex items-center justify-center animate-pulse text-primary font-medium">Loading...</div>;
  }

  const isTargetReached = count >= currentDhikr.targetCount;

  const getLevelInfo = (level: number) => {
    switch (level) {
      case 1: return { text: "Level 1 — Beginner", color: "bg-green-100 text-green-700 border-green-200", ring: "#10b981", points: 1 };
      case 2: return { text: "Level 2 — Intermediate", color: "bg-amber-100 text-amber-700 border-amber-200", ring: "#f59e0b", points: 2 };
      case 3: return { text: "Level 3 — Advanced", color: "bg-purple-100 text-purple-700 border-purple-200", ring: "#8b5cf6", points: 3 };
      default: return { text: "Level 1 — Beginner", color: "bg-green-100 text-green-700 border-green-200", ring: "#10b981", points: 1 };
    }
  };

  const levelInfo = getLevelInfo(currentDhikr.level || 1);

  return (
    <div className="flex-1 flex flex-col pt-4 pb-6 px-4 h-full relative overflow-x-hidden overflow-y-auto bg-background">
      
      {/* Top Header */}
      <header className="flex justify-between items-center z-10 mb-4 shrink-0">
        <button 
          onClick={handleReset}
          className="p-3 rounded-full bg-card shadow-sm border border-border text-muted-foreground hover:text-primary transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        <div className={cn("px-4 py-1.5 rounded-full border text-xs font-bold tracking-wider uppercase", levelInfo.color)}>
          {levelInfo.text}
        </div>
        <div className="text-xs font-bold text-muted-foreground bg-slate-100 px-3 py-1.5 rounded-full">
          {currentIndex + 1} / {dhikrList?.length}
        </div>
      </header>

      {/* Dhikr Information Panel */}
      <div className="shrink-0 z-10 mb-6">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentDhikr.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center justify-center text-center space-y-4"
          >
            <h2 className="text-4xl md:text-5xl font-bold arabic-text text-foreground leading-tight px-4 py-4 min-h-[100px] flex items-center justify-center">
              {currentDhikr.arabic}
            </h2>
            <div className="space-y-2 bg-card/50 p-4 rounded-3xl w-full">
              <p className="text-lg font-medium text-primary italic">{currentDhikr.transliteration}</p>
              <p className="text-sm text-foreground/80 font-medium">{currentDhikr.translation}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Main Counter Interaction Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 mb-6 min-h-[260px]">
        
        {/* Navigation arrows */}
        <button 
          onClick={() => changeDhikr('prev')}
          className="absolute left-0 top-1/2 -translate-y-1/2 p-3 text-muted-foreground hover:text-primary transition-colors z-20 bg-card rounded-full shadow-sm border border-border"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <button 
          onClick={() => changeDhikr('next')}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-3 text-muted-foreground hover:text-primary transition-colors z-20 bg-card rounded-full shadow-sm border border-border"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* The Button & Ring */}
        <div className="relative flex items-center justify-center scale-95 md:scale-100">
          <CounterRing 
            count={count} 
            target={currentDhikr.targetCount} 
            isComplete={isTargetReached}
            className="text-slate-100"
            color={levelInfo.ring}
          />
          
          <motion.button
            onPointerDown={() => setIsPressing(true)}
            onPointerUp={() => {
              setIsPressing(false);
              handleTap();
            }}
            onPointerLeave={() => setIsPressing(false)}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "absolute w-48 h-48 md:w-56 md:h-56 rounded-full flex flex-col items-center justify-center outline-none select-none",
              "bg-card border-[6px]",
              "shadow-[0_10px_30px_rgba(0,0,0,0.08),_inset_0_-5px_15px_rgba(0,0,0,0.02)]",
              "transition-shadow duration-200 overflow-hidden group"
            )}
            style={{ borderColor: `${levelInfo.ring}30` }}
          >
            {/* Inner dynamic highlight based on state */}
            <div className={cn(
              "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
            )} style={{ background: `radial-gradient(circle at 50% 0%, ${levelInfo.ring}20, transparent 70%)` }} />
            
            <motion.span 
              key={count}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-6xl font-bold font-sans text-foreground z-10 tracking-tighter"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {count}
            </motion.span>
            
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1 z-10">
              / {currentDhikr.targetCount}
            </span>

            {/* Tap ripple effect pseudo-element */}
            <AnimatePresence>
              {isPressing && (
                <motion.div
                  initial={{ scale: 0, opacity: 0.5 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 rounded-full z-0 pointer-events-none"
                  style={{ backgroundColor: `${levelInfo.ring}20` }}
                />
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
      
      {/* Details Tabs */}
      <div className="shrink-0 bg-card rounded-3xl p-4 shadow-sm border border-border z-10">
        <div className="flex p-1 bg-slate-100 rounded-full mb-4">
          <button
            onClick={() => setActiveTab("meaning")}
            className={cn(
              "flex-1 py-2 text-xs font-bold rounded-full transition-all flex items-center justify-center gap-1.5",
              activeTab === "meaning" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            )}
          >
            <Info className="w-3.5 h-3.5" /> Meaning
          </button>
          <button
            onClick={() => setActiveTab("virtue")}
            className={cn(
              "flex-1 py-2 text-xs font-bold rounded-full transition-all flex items-center justify-center gap-1.5",
              activeTab === "virtue" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            )}
          >
            <Award className="w-3.5 h-3.5" /> Virtue
          </button>
          <button
            onClick={() => setActiveTab("reward")}
            className={cn(
              "flex-1 py-2 text-xs font-bold rounded-full transition-all flex items-center justify-center gap-1.5",
              activeTab === "reward" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            )}
          >
            <Gift className="w-3.5 h-3.5" /> Reward
          </button>
        </div>
        
        <div className="px-2 pb-2 min-h-[80px]">
          <AnimatePresence mode="wait">
            <motion.p
              key={activeTab + currentDhikr.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="text-sm text-foreground/80 leading-relaxed font-medium"
            >
              {activeTab === "meaning" && (currentDhikr.meaning || "No meaning provided.")}
              {activeTab === "virtue" && (currentDhikr.virtue || "No virtue provided.")}
              {activeTab === "reward" && (currentDhikr.reward || "No specific reward recorded.")}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
