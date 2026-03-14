import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, CheckCircle2, XCircle, Award } from "lucide-react";
import { useQuizData, useAnswerQuiz } from "@/hooks/use-app-data";
import { useEffectiveSession } from "@/hooks/use-effective-session";
import { QuizQuestion } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";

// Mock locked questions to make the grid look full and gamified
const MOCK_LOCKED = Array.from({ length: 4 }).map((_, i) => ({
  id: `locked-${i}`,
  isLocked: true,
  unlockText: `Unlock at ${33 * (i + 2)} Dhikr`
}));

export default function Quiz() {
  const { data: unlockedQuestions, isLoading } = useQuizData();
  const sessionId = useEffectiveSession();
  const [activeQuestion, setActiveQuestion] = useState<QuizQuestion | null>(null);
  
  if (isLoading) {
    return <div className="p-8 text-center text-primary mt-20">Loading knowledge...</div>;
  }

  const items = [...(unlockedQuestions || []), ...MOCK_LOCKED];

  return (
    <div className="flex-1 px-5 pt-2 pb-6 min-h-full flex flex-col bg-background">
      <header className="mb-6 z-10">
        <h1 className="text-3xl font-bold text-foreground mb-2">Knowledge</h1>
        <p className="text-muted-foreground text-sm font-medium">Learn more through daily practice.</p>
      </header>

      <div className="grid grid-cols-2 gap-4 pb-12 z-10">
        {items.map((item, index) => {
          const isLocked = 'isLocked' in item;
          const q = !isLocked ? (item as QuizQuestion) : null;

          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => !isLocked && setActiveQuestion(q as QuizQuestion)}
              className={cn(
                "relative p-5 rounded-3xl text-left flex flex-col aspect-square overflow-hidden outline-none transition-all duration-300",
                isLocked 
                  ? "bg-slate-100 border border-slate-200 opacity-70 cursor-not-allowed" 
                  : "bg-card shadow-sm border border-border hover:shadow-md group active:scale-95"
              )}
            >
              {isLocked ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
                  <Lock className="w-8 h-8 text-slate-300" strokeWidth={2} />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{(item as any).unlockText}</span>
                </div>
              ) : (
                <>
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Unlock className="w-16 h-16 text-secondary -translate-y-4 translate-x-4 transform" strokeWidth={1.5} />
                  </div>
                  <span className="text-[10px] font-bold text-secondary mb-2 uppercase tracking-wider">
                    {q?.category || "General"}
                  </span>
                  <p className="text-sm font-bold text-foreground line-clamp-4 mt-1 relative z-10 leading-snug">
                    {q?.question}
                  </p>
                </>
              )}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {activeQuestion && (
          <QuizModal 
            question={activeQuestion} 
            sessionId={sessionId}
            onClose={() => setActiveQuestion(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function QuizModal({ question, sessionId, onClose }: { question: QuizQuestion, sessionId: string | null, onClose: () => void }) {
  const { mutate: submitAnswer, isPending } = useAnswerQuiz();
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
  
  const handleSelect = (idx: number) => {
    if (result || isPending) return;
    setSelectedIdx(idx);
    
    const isCorrect = idx === question.correctIndex;
    setResult(isCorrect ? 'correct' : 'incorrect');

    submitAnswer({
      data: {
        sessionId: sessionId || "anonymous",
        questionId: question.id,
        selectedIndex: idx
      }
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-foreground/20 backdrop-blur-sm sm:p-4"
    >
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-full max-w-md bg-card sm:border border-border rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6 shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />
        
        <div className="flex-1 overflow-y-auto scrollbar-hide pb-6 space-y-6">
          <div className="space-y-2 text-center">
            <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-wider rounded-full">
              {question.category}
            </span>
            <h2 className="text-xl font-bold text-foreground leading-snug pt-2">
              {question.question}
            </h2>
            {question.arabicVerse && (
              <p className="text-3xl arabic-text text-foreground py-4 text-center">
                {question.arabicVerse}
              </p>
            )}
          </div>

          <div className="space-y-3">
            {question.options.map((opt, idx) => {
              const isSelected = selectedIdx === idx;
              const isActualCorrect = idx === question.correctIndex;
              const showStatus = result !== null;
              
              let stateClass = "bg-slate-50 border-slate-200 hover:bg-slate-100 text-foreground";
              if (showStatus) {
                if (isActualCorrect) {
                  stateClass = "bg-[#F2FAF6] border-primary text-primary font-bold";
                } else if (isSelected && !isActualCorrect) {
                  stateClass = "bg-red-50 border-red-200 text-red-600";
                } else {
                  stateClass = "bg-slate-50 border-slate-100 text-muted-foreground opacity-50";
                }
              } else if (isSelected) {
                stateClass = "bg-secondary/10 border-secondary text-secondary font-bold";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={showStatus}
                  className={cn(
                    "w-full p-4 rounded-2xl border-2 text-left flex items-center justify-between transition-all duration-300 outline-none active:scale-[0.98]",
                    stateClass
                  )}
                >
                  <span className="font-semibold text-sm sm:text-base pr-4">{opt}</span>
                  {showStatus && isActualCorrect && <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />}
                  {showStatus && isSelected && !isActualCorrect && <XCircle className="w-6 h-6 text-red-500 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation Area */}
          <AnimatePresence>
            {result && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                className={cn(
                  "p-5 rounded-3xl border flex gap-4",
                  result === 'correct' ? "bg-[#F2FAF6] border-primary/20" : "bg-orange-50 border-orange-200"
                )}
              >
                <div className="shrink-0">
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", result === 'correct' ? "bg-primary/20 text-primary" : "bg-orange-200 text-orange-600")}>
                    <Award className="w-5 h-5" />
                  </div>
                </div>
                <div className="space-y-1 pt-1">
                  <p className={cn("text-sm font-bold", result === 'correct' ? "text-primary" : "text-orange-700")}>
                    {result === 'correct' ? "Excellent!" : "Not quite, but here's why:"}
                  </p>
                  <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                    {question.explanation}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="pt-4 shrink-0">
          <button 
            onClick={onClose}
            className="w-full py-4 rounded-2xl font-bold text-white bg-foreground hover:bg-foreground/90 transition-colors shadow-md"
          >
            {result ? "Continue" : "Cancel"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
