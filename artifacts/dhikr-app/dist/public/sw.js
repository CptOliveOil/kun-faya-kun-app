// Kun Fayakun Service Worker — Prayer Notifications
const CACHE_NAME = "dhikr-dua-v1";
const scheduledTimers = [];

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("message", (event) => {
  const { type, prayers } = event.data || {};

  if (type === "SCHEDULE_PRAYERS" && Array.isArray(prayers)) {
    // Clear existing timers
    scheduledTimers.forEach((t) => clearTimeout(t));
    scheduledTimers.length = 0;

    const now = Date.now();

    for (const prayer of prayers) {
      const fireAt = prayer.time - (prayer.offsetMs || 0);
      const delay = fireAt - now;

      if (delay > 0 && delay < 24 * 60 * 60 * 1000) {
        const timer = setTimeout(() => {
          self.registration.showNotification(`${prayer.name} Prayer Time`, {
            body: `It is time for ${prayer.name} — ${prayer.displayTime}`,
            icon: "/icon.png",
            badge: "/icon.png",
            tag: `prayer-${prayer.name}`,
            requireInteraction: false,
            vibrate: [200, 100, 200],
            actions: [
              { action: "log", title: "Log Prayer" },
              { action: "dismiss", title: "Dismiss" },
            ],
          });
        }, delay);
        scheduledTimers.push(timer);
      }
    }

    console.log(`[SW] Scheduled ${scheduledTimers.length} prayer notifications`);
  }

  if (type === "NOTIFICATION_ENABLED") {
    self.registration.showNotification("Prayer Reminders On", {
      body: "You'll be notified for each prayer time. JazakAllahu Khayran!",
      icon: "/icon.png",
      tag: "enabled",
    });
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "log") {
    event.waitUntil(
      clients.matchAll({ type: "window" }).then((clientList) => {
        if (clientList.length > 0) {
          clientList[0].focus();
          clientList[0].navigate("/prayers");
        } else {
          clients.openWindow("/prayers");
        }
      })
    );
  }
});
