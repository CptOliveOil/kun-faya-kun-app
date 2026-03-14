import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffectiveSession } from "./use-effective-session";
import { useGetPrayerLog, useMarkPrayer, getPrayerStats, markPrayer, MarkPrayerRequest } from "@workspace/api-client-react";

export function usePrayersData(date?: string) {
  const sessionId = useEffectiveSession();
  const today = date || new Date().toISOString().split('T')[0];
  
  return useGetPrayerLog(
    { sessionId: sessionId || "", date: today },
    { query: { enabled: !!sessionId } }
  );
}

export function useMarkPrayerMutation() {
  const queryClient = useQueryClient();
  const sessionId = useEffectiveSession();
  return useMutation({
    mutationFn: (data: Omit<MarkPrayerRequest, "sessionId">) =>
      markPrayer({ ...data, sessionId: sessionId! }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prayers"] });
      queryClient.invalidateQueries({ queryKey: ["prayer-stats"] });
    },
  });
}

export function usePrayerStats(period: "week" | "month" = "week") {
  const sessionId = useEffectiveSession();
  return useQuery({
    queryKey: ["prayer-stats", sessionId, period],
    queryFn: () => getPrayerStats({ sessionId: sessionId || "", period }),
    enabled: !!sessionId,
  });
}
