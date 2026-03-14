import { Feather } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { usePrayerTimes, formatPrayerTime } from "@/hooks/usePrayerTimes";
import { useAppData } from "@/contexts/AppDataContext";

const PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
const STATUSES = ["completed", "missed", "late", "jamaah"] as const;

const STATUS_LABELS: Record<string, string> = {
  completed: "On Time",
  jamaah: "Jamaah",
  late: "Late",
  missed: "Missed",
};

const STATUS_COLORS: Record<string, string> = {
  completed: "#4CAF7D",
  jamaah: "#7CB99E",
  late: "#F0A94A",
  missed: "#E57373",
};

function dateKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

function getLast7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });
}

export default function PrayersScreen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const tabHeight = useBottomTabBarHeight();
  const { data: prayerTimes, loading } = usePrayerTimes();
  const { prayerLog, logPrayer } = useAppData();
  const [selectedDay, setSelectedDay] = useState(dateKey(new Date()));
  const styles = makeStyles(colors);
  const days = getLast7Days();

  function getStatus(date: string, prayer: string): string | undefined {
    return (prayerLog.find((p) => p.date === date) as any)?.[prayer.toLowerCase()];
  }

  function cycleStatus(date: string, prayer: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const current = getStatus(date, prayer);
    const idx = current ? STATUSES.indexOf(current as any) : -1;
    const next = STATUSES[(idx + 1) % STATUSES.length];
    logPrayer(date, prayer.toLowerCase(), next);
  }

  // Stats for the week
  const totalPossible = 7 * 5;
  const totalDone = days.reduce((acc, d) => {
    const log = prayerLog.find((p) => p.date === dateKey(d));
    if (!log) return acc;
    return acc + PRAYERS.filter((p) => (log as any)[p.toLowerCase()] === "completed" || (log as any)[p.toLowerCase()] === "jamaah").length;
  }, 0);
  const streak = (() => {
    let s = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      const d = dateKey(days[i]);
      const log = prayerLog.find((p) => p.date === d);
      if (!log) break;
      const done = PRAYERS.every((p) => (log as any)[p.toLowerCase()]);
      if (done) s++;
      else break;
    }
    return s;
  })();

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <ScrollView
      style={[{ flex: 1, backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: tabHeight + 24 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Prayer Tracker</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>Tap to log prayer status</Text>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: colors.primary }]}>
          <Text style={styles.statNum}>{streak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.cardBorder, borderWidth: 1 }]}>
          <Text style={[styles.statNum, { color: colors.text }]}>{totalDone}</Text>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>This Week</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.cardBorder, borderWidth: 1 }]}>
          <Text style={[styles.statNum, { color: colors.text }]}>
            {totalPossible > 0 ? Math.round((totalDone / totalPossible) * 100) : 0}%
          </Text>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>Completion</Text>
        </View>
      </View>

      {/* Day selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayRow}>
        {days.map((d) => {
          const key = dateKey(d);
          const isSelected = key === selectedDay;
          const isToday = key === dateKey(new Date());
          const log = prayerLog.find((p) => p.date === key);
          const done = log ? PRAYERS.filter((p) => (log as any)[p.toLowerCase()]).length : 0;
          return (
            <TouchableOpacity
              key={key}
              style={[styles.dayChip, { backgroundColor: isSelected ? colors.primary : colors.card, borderColor: colors.cardBorder }]}
              onPress={() => setSelectedDay(key)}
            >
              <Text style={[styles.dayName, { color: isSelected ? "rgba(255,255,255,0.8)" : colors.textMuted }]}>
                {dayNames[d.getDay()]}
              </Text>
              <Text style={[styles.dayNum, { color: isSelected ? "#fff" : colors.text }]}>{d.getDate()}</Text>
              {done > 0 && (
                <View style={[styles.dayDot, { backgroundColor: isSelected ? "rgba(255,255,255,0.7)" : colors.primary }]} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Prayer Times for selected day */}
      <View style={{ paddingHorizontal: 16, gap: 10, marginTop: 4 }}>
        {PRAYERS.map((prayer) => {
          const status = getStatus(selectedDay, prayer);
          const prayerTime = prayerTimes?.prayers.find((p) => p.name === prayer);
          const statusColor = status ? STATUS_COLORS[status] : colors.backgroundTertiary;
          const islamicColors: Record<string, string> = {
            Fajr: colors.islamic.fajr,
            Dhuhr: colors.islamic.dhuhr,
            Asr: colors.islamic.asr,
            Maghrib: colors.islamic.maghrib,
            Isha: colors.islamic.isha,
          };

          return (
            <TouchableOpacity
              key={prayer}
              style={[styles.prayerRow2, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
              onPress={() => cycleStatus(selectedDay, prayer)}
              activeOpacity={0.8}
            >
              <View style={[styles.prayerDot, { backgroundColor: islamicColors[prayer] + "30" }]}>
                <View style={[styles.prayerDotInner, { backgroundColor: islamicColors[prayer] }]} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.prayerName, { color: colors.text }]}>{prayer}</Text>
                {prayerTime && (
                  <Text style={[styles.prayerTime, { color: colors.textMuted }]}>{formatPrayerTime(prayerTime.time)}</Text>
                )}
              </View>
              <View style={[styles.statusBadge, { backgroundColor: statusColor + "20" }]}>
                <Text style={[styles.statusText, { color: status ? statusColor : colors.textMuted }]}>
                  {status ? STATUS_LABELS[status] : "Tap to log"}
                </Text>
              </View>
              {status && (
                <Feather name="check-circle" size={18} color={statusColor} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

function makeStyles(colors: typeof Colors.light) {
  return StyleSheet.create({
    header: { paddingHorizontal: 20, marginBottom: 16 },
    title: { fontFamily: "Inter_700Bold", fontSize: 28, letterSpacing: -0.5 },
    subtitle: { fontFamily: "Inter_400Regular", fontSize: 14, marginTop: 2 },
    statsRow: { flexDirection: "row", paddingHorizontal: 16, gap: 10, marginBottom: 20 },
    statCard: {
      flex: 1,
      borderRadius: 16,
      padding: 14,
      alignItems: "center",
    },
    statNum: {
      fontFamily: "Inter_700Bold",
      fontSize: 24,
      color: "#fff",
      letterSpacing: -0.5,
    },
    statLabel: {
      fontFamily: "Inter_400Regular",
      fontSize: 11,
      color: "rgba(255,255,255,0.8)",
      marginTop: 2,
    },
    dayRow: { paddingHorizontal: 16, gap: 8, marginBottom: 16 },
    dayChip: {
      width: 52,
      paddingVertical: 10,
      borderRadius: 16,
      alignItems: "center",
      borderWidth: 1,
      gap: 2,
    },
    dayName: { fontFamily: "Inter_400Regular", fontSize: 11 },
    dayNum: { fontFamily: "Inter_700Bold", fontSize: 16 },
    dayDot: { width: 5, height: 5, borderRadius: 2.5, marginTop: 2 },
    prayerRow2: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 18,
      padding: 16,
      gap: 12,
      borderWidth: 1,
    },
    prayerDot: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
    },
    prayerDotInner: { width: 12, height: 12, borderRadius: 6 },
    prayerName: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
    prayerTime: { fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 2 },
    statusBadge: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 10,
    },
    statusText: { fontFamily: "Inter_500Medium", fontSize: 12 },
  });
}
