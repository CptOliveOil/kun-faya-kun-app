import { useState, useEffect, useCallback } from "react";
import type { PrayerTime } from "./use-prayer-times";
import { formatTime } from "./use-prayer-times";

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) return;
    const result = await Notification.requestPermission();
    setPermission(result);

    if (result === "granted" && "serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((sw) => {
        sw.active?.postMessage({ type: "NOTIFICATION_ENABLED" });
      });
    }
    return result;
  }, []);

  const scheduleNotification = useCallback(
    (prayers: PrayerTime[], offsetMinutes: number = 0) => {
      if (permission !== "granted") return;
      if (!("serviceWorker" in navigator)) return;

      navigator.serviceWorker.ready.then((sw) => {
        sw.active?.postMessage({
          type: "SCHEDULE_PRAYERS",
          prayers: prayers.map((p) => ({
            name: p.name,
            time: p.time.getTime(),
            offsetMs: offsetMinutes * 60 * 1000,
            displayTime: formatTime(p.time),
          })),
        });
      });
    },
    [permission]
  );

  const sendTestNotification = useCallback(() => {
    if (permission !== "granted") return;
    new Notification("Kun Fayakun", {
      body: "Prayer reminders are enabled!",
      icon: "/icon.png",
      badge: "/icon.png",
    });
  }, [permission]);

  return { permission, requestPermission, scheduleNotification, sendTestNotification };
}
