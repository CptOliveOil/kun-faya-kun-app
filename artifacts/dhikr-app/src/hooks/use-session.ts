import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const SESSION_KEY = 'dhikr_app_session_id';
const GUEST_CHOSEN_KEY = 'dhikr_app_guest_chosen';

export function useSession(userId?: string | null) {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      setSessionId(userId);
      return;
    }
    try {
      let storedId = localStorage.getItem(SESSION_KEY);
      if (!storedId) {
        storedId = uuidv4();
        localStorage.setItem(SESSION_KEY, storedId);
      }
      setSessionId(storedId);
    } catch {
      setSessionId(uuidv4());
    }
  }, [userId]);

  return sessionId;
}

export function hasChosenGuestMode(): boolean {
  try {
    return localStorage.getItem(GUEST_CHOSEN_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setGuestMode() {
  try {
    localStorage.setItem(GUEST_CHOSEN_KEY, 'true');
  } catch {}
}
