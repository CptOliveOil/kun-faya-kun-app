import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getQuranLog, saveQuranLog, getMemorisation, saveMemorisation } from "@workspace/api-client-react";
import { useEffectiveSession } from "./use-effective-session";

export function useQuranLog() {
  const sessionId = useEffectiveSession();
  return useQuery({
    queryKey: ["quran-log", sessionId],
    queryFn: () => getQuranLog({ sessionId: sessionId || "" }),
    enabled: !!sessionId,
  });
}

export function useMemorisation() {
  const sessionId = useEffectiveSession();
  return useQuery({
    queryKey: ["memorisation", sessionId],
    queryFn: () => getMemorisation({ sessionId: sessionId || "" }),
    enabled: !!sessionId,
  });
}

export function useSaveQuranLog() {
  const queryClient = useQueryClient();
  const sessionId = useEffectiveSession();
  return useMutation({
    mutationFn: (data: any) => saveQuranLog({ ...data, sessionId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["quran-log", sessionId] }),
  });
}

export function useSaveMemorisation() {
  const queryClient = useQueryClient();
  const sessionId = useEffectiveSession();
  return useMutation({
    mutationFn: (data: any) => saveMemorisation({ ...data, sessionId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["memorisation", sessionId] }),
  });
}
