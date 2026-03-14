import { useQueryClient } from "@tanstack/react-query";
import { 
  useGetDhikrList, 
  useGetProgress, 
  useSaveProgress, 
  useGetUnlockedQuestions, 
  useSubmitAnswer 
} from "@workspace/api-client-react";
import { useEffectiveSession } from "./use-effective-session";
import { useToast } from "./use-toast";
import confetti from "canvas-confetti";

// Fallback data in case the API is completely empty
const FALLBACK_DHIKR = [
  { id: "1", arabic: "سُبْحَانَ ٱللَّٰهِ", transliteration: "SubhanAllah", translation: "Glory be to Allah", virtue: "Purifies the soul", targetCount: 33, color: "#10b981" },
  { id: "2", arabic: "ٱلْحَمْدُ لِلَّٰهِ", transliteration: "Alhamdulillah", translation: "Praise be to Allah", virtue: "Fills the scales of good deeds", targetCount: 33, color: "#3b82f6" },
  { id: "3", arabic: "ٱللَّٰهُ أَكْبَرُ", transliteration: "Allahu Akbar", translation: "Allah is the Greatest", virtue: "Greater than everything else", targetCount: 34, color: "#f59e0b" },
  { id: "4", arabic: "أَسْتَغْفِرُ اللَّهَ", transliteration: "Astaghfirullah", translation: "I seek forgiveness from Allah", virtue: "Opens doors of mercy and provision", targetCount: 100, color: "#8b5cf6" },
];

export function useDhikrData() {
  const query = useGetDhikrList({
    query: {
      staleTime: 1000 * 60 * 60, // 1 hour
    }
  });

  return {
    ...query,
    data: query.data && query.data.length > 0 ? query.data : FALLBACK_DHIKR,
  };
}

export function useUserProgress() {
  const sessionId = useEffectiveSession();
  
  return useGetProgress({
    query: {
      enabled: !!sessionId,
      queryKey: ["/api/progress", sessionId],
      queryFn: async () => {
        const url = sessionId ? `/api/progress?sessionId=${sessionId}` : "/api/progress";
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch progress");
        return res.json();
      },
    }
  });
}

export function useSaveUserProgress() {
  const queryClient = useQueryClient();
  const sessionId = useEffectiveSession();
  const { toast } = useToast();

  return useSaveProgress({
    mutation: {
      onSuccess: () => {
        // Invalidate to refresh dashboard
        queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
        queryClient.invalidateQueries({ queryKey: ["/api/quiz/unlocked"] });
      },
      onError: () => {
        toast({
          title: "Error saving progress",
          description: "Your progress is saved locally, but couldn't sync.",
          variant: "destructive"
        });
      }
    }
  });
}

export function useQuizData() {
  const sessionId = useEffectiveSession();
  return useGetUnlockedQuestions(
    { sessionId: sessionId || "" }, 
    {
      query: { enabled: !!sessionId }
    }
  );
}

export function useAnswerQuiz() {
  const queryClient = useQueryClient();
  return useSubmitAnswer({
    mutation: {
      onSuccess: () => {
        // Refresh unlocked questions to update their state if needed
        queryClient.invalidateQueries({ queryKey: ["/api/quiz/unlocked"] });
        queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
      }
    }
  });
}

// Utility to trigger celebratory confetti
export function triggerMilestoneCelebration() {
  const count = 200;
  const defaults = { origin: { y: 0.7 }, zIndex: 1000, colors: ['#FBBF24', '#FCD34D', '#10B981', '#047857'] };

  function fire(particleRatio: number, opts: any) {
    confetti(Object.assign({}, defaults, opts, {
      particleCount: Math.floor(count * particleRatio)
    }));
  }

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
}
