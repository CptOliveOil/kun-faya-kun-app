import { Feather } from "@expo/vector-icons";
import React, { useRef, useState, useEffect } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
  Vibration,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { useAppData } from "@/contexts/AppDataContext";

export default function DhikrDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { dhikrList, incrementDhikr, resetDhikr } = useAppData();
  const dhikr = dhikrList.find((d) => d.id === id);
  const scale = useRef(new Animated.Value(1)).current;
  const [justCompleted, setJustCompleted] = useState(false);
  const styles = makeStyles(colors);

  if (!dhikr) {
    return (
      <View style={[{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background }]}>
        <Text style={[{ color: colors.text, fontFamily: "Inter_600SemiBold" }]}>Not found</Text>
      </View>
    );
  }

  const progress = dhikr.targetCount > 0 ? dhikr.count / dhikr.targetCount : 0;
  const circumference = 2 * Math.PI * 70;
  const levelColors = ["#7CB99E", "#C9A84C", "#E8826A", "#8B7EC8", "#5873B1"];
  const levelColor = levelColors[(dhikr.level - 1) % levelColors.length];

  function handleTap() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Animated.sequence([
      Animated.spring(scale, { toValue: 0.92, useNativeDriver: true, speed: 50 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20 }),
    ]).start();

    const willComplete = dhikr.count + 1 >= dhikr.targetCount;
    if (willComplete) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setJustCompleted(true);
      setTimeout(() => setJustCompleted(false), 2000);
    }

    incrementDhikr(dhikr.id);
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }]}>
      {/* Nav */}
      <View style={styles.nav}>
        <TouchableOpacity style={[styles.navBtn, { backgroundColor: colors.card }]} onPress={() => router.back()}>
          <Feather name="x" size={18} color={colors.text} />
        </TouchableOpacity>
        <View style={[styles.levelBadge, { backgroundColor: levelColor + "20" }]}>
          <Text style={[styles.levelText, { color: levelColor }]}>Level {dhikr.level} · {dhikr.category}</Text>
        </View>
        <TouchableOpacity
          style={[styles.navBtn, { backgroundColor: colors.card }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            resetDhikr(dhikr.id);
          }}
        >
          <Feather name="rotate-ccw" size={16} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Arabic text */}
      <View style={styles.arabicContainer}>
        <Text style={[styles.arabic, { color: colors.text }]}>{dhikr.arabic}</Text>
        <Text style={[styles.transliteration, { color: colors.primary }]}>{dhikr.transliteration}</Text>
        <Text style={[styles.translation, { color: colors.textSecondary }]}>{dhikr.translation}</Text>
      </View>

      {/* Progress ring + counter */}
      <View style={styles.counterContainer}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <TouchableOpacity
            style={[styles.counterBtn, { backgroundColor: levelColor }]}
            onPress={handleTap}
            activeOpacity={0.85}
          >
            <Text style={styles.counterNum}>{dhikr.count}</Text>
            <Text style={styles.counterTarget}>/ {dhikr.targetCount}</Text>
          </TouchableOpacity>
        </Animated.View>

        {justCompleted && (
          <View style={[styles.completedBadge, { backgroundColor: levelColor }]}>
            <Text style={styles.completedText}>MashAllah! 🎉 Set Complete</Text>
          </View>
        )}

        <Text style={[styles.tapHint, { color: colors.textMuted }]}>Tap to count · {dhikr.totalCount.toLocaleString()} total</Text>
      </View>

      {/* Reward & Meaning */}
      <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <View style={styles.infoRow}>
          <View style={[styles.infoIcon, { backgroundColor: colors.goldLight }]}>
            <Feather name="star" size={14} color={colors.gold} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Reward</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{dhikr.reward}</Text>
          </View>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.separator }]} />
        <View style={styles.infoRow}>
          <View style={[styles.infoIcon, { backgroundColor: colors.primaryLight }]}>
            <Feather name="info" size={14} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Meaning</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{dhikr.meaning}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function makeStyles(colors: typeof Colors.light) {
  return StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 20 },
    nav: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 32 },
    navBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    levelBadge: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
    levelText: { fontFamily: "Inter_600SemiBold", fontSize: 12 },
    arabicContainer: { alignItems: "center", marginBottom: 40, gap: 8 },
    arabic: { fontFamily: "Amiri_700Bold", fontSize: 36, textAlign: "center", lineHeight: 56 },
    transliteration: { fontFamily: "Inter_600SemiBold", fontSize: 16, textAlign: "center" },
    translation: { fontFamily: "Inter_400Regular", fontSize: 14, textAlign: "center" },
    counterContainer: { alignItems: "center", gap: 16, marginBottom: 40 },
    counterBtn: {
      width: 160,
      height: 160,
      borderRadius: 80,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
    counterNum: { fontFamily: "Inter_700Bold", fontSize: 56, color: "#fff", letterSpacing: -2 },
    counterTarget: { fontFamily: "Inter_400Regular", fontSize: 16, color: "rgba(255,255,255,0.7)" },
    completedBadge: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
    },
    completedText: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: "#fff" },
    tapHint: { fontFamily: "Inter_400Regular", fontSize: 13 },
    infoCard: { borderRadius: 20, padding: 16, borderWidth: 1, gap: 12 },
    infoRow: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
    infoIcon: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
    infoLabel: { fontFamily: "Inter_500Medium", fontSize: 11, marginBottom: 2 },
    infoValue: { fontFamily: "Inter_400Regular", fontSize: 14, lineHeight: 20 },
    divider: { height: 1, marginVertical: 4 },
  });
}
