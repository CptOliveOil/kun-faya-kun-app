import { Feather } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { usePrayerTimes, formatPrayerTime, getTimeUntil } from "@/hooks/usePrayerTimes";
import { useAppData } from "@/contexts/AppDataContext";

const QUICK_DUAS = [
  { id: "morning", label: "Morning Adhkar", icon: "sunrise" as const, arabic: "أَذْكَار الصَّبَاح" },
  { id: "evening", label: "Evening Adhkar", icon: "sunset" as const, arabic: "أَذْكَار المَسَاء" },
  { id: "sleep", label: "Before Sleep", icon: "moon" as const, arabic: "قَبْلَ النَّوْم" },
  { id: "waking", label: "Upon Waking", icon: "sun" as const, arabic: "عِنْدَ الاسْتِيقَاظ" },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const tabHeight = useBottomTabBarHeight();
  const { data, loading, error } = usePrayerTimes();
  const { dhikrList } = useAppData();
  const [greeting, setGreeting] = useState("As-salamu alaykum");
  const [islamicDate, setIslamicDate] = useState("");

  useEffect(() => {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) setGreeting("Sabah al-khair");
    else if (h >= 12 && h < 17) setGreeting("As-salamu alaykum");
    else setGreeting("Masaa al-khair");

    try {
      const f = new Intl.DateTimeFormat("en-US-u-ca-islamic", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      setIslamicDate(f.format(new Date()));
    } catch {}
  }, []);

  const featuredDhikr = dhikrList[0];
  const styles = makeStyles(colors);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: tabHeight + 24 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting}</Text>
          {islamicDate ? <Text style={styles.islamicDate}>{islamicDate}</Text> : null}
        </View>
        <View style={[styles.logoCircle, { backgroundColor: colors.primaryLight }]}>
          <Text style={styles.logoArabic}>ذ</Text>
        </View>
      </View>

      {/* Next Prayer Banner */}
      <View style={[styles.section]}>
        {loading ? (
          <View style={[styles.nextPrayerCard, { backgroundColor: colors.primary }]}>
            <ActivityIndicator color="#fff" />
            <Text style={styles.nextPrayerLoading}>Getting prayer times…</Text>
          </View>
        ) : error || !data ? (
          <View style={[styles.nextPrayerCard, { backgroundColor: colors.card, borderColor: colors.cardBorder, borderWidth: 1 }]}>
            <Feather name="map-pin" size={20} color={colors.textMuted} />
            <Text style={[styles.nextPrayerEmpty, { color: colors.textMuted }]}>Enable location for prayer times</Text>
          </View>
        ) : (
          <View style={[styles.nextPrayerCard, { backgroundColor: colors.primary }]}>
            <View>
              <Text style={styles.nextPrayerLabel}>Next Prayer</Text>
              <Text style={styles.nextPrayerName}>{data.nextPrayer?.name}</Text>
              {data.city ? <Text style={styles.nextPrayerCity}>{data.city}</Text> : null}
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.nextPrayerTime}>{data.nextPrayer ? formatPrayerTime(data.nextPrayer.time) : ""}</Text>
              <View style={styles.nextPrayerUntil}>
                <Feather name="clock" size={12} color="rgba(255,255,255,0.8)" />
                <Text style={styles.nextPrayerUntilText}>{data.nextPrayer ? getTimeUntil(data.nextPrayer.time) : ""}</Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Prayer times mini row */}
      {!loading && data && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.prayerRow}>
          {data.prayers.map((p) => {
            const isNext = p.name === data.nextPrayer?.name;
            const isPast = p.time < new Date();
            return (
              <View
                key={p.key}
                style={[
                  styles.prayerChip,
                  { backgroundColor: isNext ? colors.primary : colors.card, borderColor: isNext ? colors.primary : colors.cardBorder },
                ]}
              >
                <Text style={[styles.prayerChipName, { color: isNext ? "#fff" : colors.textSecondary }]}>{p.name}</Text>
                <Text style={[styles.prayerChipTime, { color: isNext ? "#fff" : isPast ? colors.textMuted : colors.text }]}>
                  {formatPrayerTime(p.time)}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      )}

      {/* Explore shortcuts */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Explore</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.exploreRow}>
        {[
          { label: "HalalTok", icon: "play" as const, color: "#C9A84C", route: "/(tabs)/halaltok" },
          { label: "Duas", icon: "book-open" as const, color: "#7CB99E", route: "/(tabs)/library" },
          { label: "Videos", icon: "video" as const, color: "#5B8DB8", route: "/(tabs)/videos" },
          { label: "Prayers", icon: "moon" as const, color: "#8B7EC8", route: "/(tabs)/prayers" },
          { label: "Dhikr", icon: "rotate-cw" as const, color: "#E8826A", route: "/(tabs)/dhikr" },
        ].map((item) => (
          <TouchableOpacity
            key={item.label}
            style={[styles.exploreChip, { backgroundColor: item.color + "18", borderColor: item.color + "44" }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push(item.route as any);
            }}
            activeOpacity={0.75}
          >
            <View style={[styles.exploreIcon, { backgroundColor: item.color + "28" }]}>
              <Feather name={item.icon} size={20} color={item.color} />
            </View>
            <Text style={[styles.exploreLabel, { color: colors.text }]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Quick Duas */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Adhkar</Text>
      </View>
      <View style={styles.duaGrid}>
        {QUICK_DUAS.map((d) => (
          <TouchableOpacity
            key={d.id}
            style={[styles.duaCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push({ pathname: "/dua/[category]", params: { category: d.id } });
            }}
            activeOpacity={0.75}
          >
            <View style={[styles.duaIconCircle, { backgroundColor: colors.primaryLight }]}>
              <Feather name={d.icon} size={18} color={colors.primary} />
            </View>
            <Text style={[styles.duaLabel, { color: colors.text }]}>{d.label}</Text>
            <Text style={[styles.duaArabic, { color: colors.textMuted }]}>{d.arabic}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Featured Dhikr */}
      {featuredDhikr && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured Dhikr</Text>
          <TouchableOpacity
            style={[styles.featuredCard, { backgroundColor: colors.primary }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push({ pathname: "/dhikr/[id]", params: { id: featuredDhikr.id } });
            }}
            activeOpacity={0.85}
          >
            <View style={styles.featuredContent}>
              <Text style={styles.featuredArabic}>{featuredDhikr.arabic}</Text>
              <Text style={styles.featuredTranslation}>{featuredDhikr.translation}</Text>
              <Text style={styles.featuredCount}>Goal: {featuredDhikr.targetCount} times</Text>
            </View>
            <View style={styles.featuredArrow}>
              <Feather name="arrow-right" size={20} color="rgba(255,255,255,0.9)" />
            </View>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

function makeStyles(colors: typeof Colors.light) {
  return StyleSheet.create({
    container: { flex: 1 },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    greeting: {
      fontFamily: "Inter_700Bold",
      fontSize: 26,
      color: colors.text,
      letterSpacing: -0.5,
    },
    islamicDate: {
      fontFamily: "Inter_400Regular",
      fontSize: 13,
      color: colors.primary,
      marginTop: 2,
    },
    logoCircle: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
    },
    logoArabic: {
      fontFamily: "Amiri_700Bold",
      fontSize: 24,
      color: colors.primary,
    },
    section: { paddingHorizontal: 20, marginBottom: 20 },
    sectionHeader: { paddingHorizontal: 20, marginBottom: 12 },
    sectionTitle: { fontFamily: "Inter_600SemiBold", fontSize: 17, letterSpacing: -0.3 },
    exploreRow: { paddingHorizontal: 16, paddingBottom: 20, gap: 12 },
    exploreChip: {
      alignItems: "center",
      borderRadius: 18,
      borderWidth: 1,
      padding: 14,
      gap: 8,
      minWidth: 78,
    },
    exploreIcon: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
    },
    exploreLabel: {
      fontFamily: "Inter_600SemiBold",
      fontSize: 12,
      textAlign: "center",
    },
    nextPrayerCard: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderRadius: 20,
      padding: 20,
      gap: 12,
    },
    nextPrayerLoading: { color: "#fff", fontFamily: "Inter_500Medium", marginLeft: 12 },
    nextPrayerEmpty: { fontFamily: "Inter_500Medium", marginLeft: 12 },
    nextPrayerLabel: {
      fontFamily: "Inter_500Medium",
      fontSize: 12,
      color: "rgba(255,255,255,0.75)",
      letterSpacing: 0.5,
      textTransform: "uppercase",
    },
    nextPrayerName: {
      fontFamily: "Inter_700Bold",
      fontSize: 28,
      color: "#fff",
      letterSpacing: -0.5,
    },
    nextPrayerCity: {
      fontFamily: "Inter_400Regular",
      fontSize: 12,
      color: "rgba(255,255,255,0.7)",
      marginTop: 2,
    },
    nextPrayerTime: {
      fontFamily: "Inter_700Bold",
      fontSize: 22,
      color: "#fff",
    },
    nextPrayerUntil: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginTop: 4,
    },
    nextPrayerUntilText: {
      fontFamily: "Inter_500Medium",
      fontSize: 12,
      color: "rgba(255,255,255,0.8)",
    },
    prayerRow: {
      paddingHorizontal: 20,
      gap: 8,
      marginBottom: 24,
    },
    prayerChip: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 14,
      alignItems: "center",
      borderWidth: 1,
      minWidth: 72,
    },
    prayerChipName: {
      fontFamily: "Inter_500Medium",
      fontSize: 11,
      marginBottom: 3,
    },
    prayerChipTime: {
      fontFamily: "Inter_700Bold",
      fontSize: 13,
    },
    duaGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      paddingHorizontal: 16,
      gap: 10,
      marginBottom: 24,
    },
    duaCard: {
      width: "47%",
      borderRadius: 18,
      padding: 16,
      borderWidth: 1,
      gap: 8,
    },
    duaIconCircle: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    duaLabel: {
      fontFamily: "Inter_600SemiBold",
      fontSize: 14,
    },
    duaArabic: {
      fontFamily: "Amiri_400Regular",
      fontSize: 13,
      textAlign: "right",
    },
    featuredCard: {
      borderRadius: 20,
      padding: 20,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginTop: 12,
    },
    featuredContent: { flex: 1 },
    featuredArabic: {
      fontFamily: "Amiri_700Bold",
      fontSize: 22,
      color: "#fff",
      textAlign: "right",
      lineHeight: 36,
    },
    featuredTranslation: {
      fontFamily: "Inter_500Medium",
      fontSize: 14,
      color: "rgba(255,255,255,0.85)",
      marginTop: 4,
    },
    featuredCount: {
      fontFamily: "Inter_400Regular",
      fontSize: 12,
      color: "rgba(255,255,255,0.65)",
      marginTop: 6,
    },
    featuredArrow: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: "rgba(255,255,255,0.2)",
      alignItems: "center",
      justifyContent: "center",
    },
  });
}
