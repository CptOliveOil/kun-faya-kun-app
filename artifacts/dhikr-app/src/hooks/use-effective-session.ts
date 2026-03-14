import { useAuthContext } from "@/contexts/AuthContext";
import { useSession } from "./use-session";

export function useEffectiveSession(): string | null {
  const { user } = useAuthContext();
  return useSession(user?.id);
}
