import { Feather } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import React, { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { useAppData } from "@/contexts/AppDataContext";

const CATEGORIES = ["All", "Tasbih", "Tahmid", "Takbir", "Hawqala", "Istighfar", "Salawat"];

export default function DhikrScreen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const tabHeight = useBottomTabBarHeight();
  const { dhikrList, incrementDhikr, resetDhikr } = useAppData();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const styles = makeStyles(colors);

  const filtered = selectedCategory === "All" ? dhikrList : dhikrList.filter((d) => d.category === selectedCategory);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={[styles.title, { color: colors.text }]}>Dhikr Counter</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          {dhikrList.reduce((a, d) => a + d.totalCount, 0).toLocaleString()} total
        </Text>
      </View>

      {/* Category Filter */}
      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryRow}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryChip,
              { backgroundColor: item === selectedCategory ? colors.primary : colors.card, borderColor: colors.cardBorder },
            ]}
            onPress={() => setSelectedCategory(item)}
          >
            <Text style={[styles.categoryText, { color: item === selectedCategory ? "#fff" : colors.textSecondary }]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Dhikr List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: tabHeight + 24, gap: 12 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const progress = item.targetCount > 0 ? item.count / item.targetCount : 0;
          const levelColors = ["#7CB99E", "#C9A84C", "#E8826A", "#8B7EC8", "#5873B1"];
          const levelColor = levelColors[(item.level - 1) % levelColors.length];

          return (
            <TouchableOpacity
              style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push({ pathname: "/dhikr/[id]", params: { id: item.id } });
              }}
              activeOpacity={0.85}
            >
              {/* Level badge */}
              <View style={[styles.levelBadge, { backgroundColor: levelColor + "20" }]}>
                <Text style={[styles.levelText, { color: levelColor }]}>Lv {item.level}</Text>
              </View>

              <View style={styles.cardContent}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.arabic, { color: colors.text }]}>{item.arabic}</Text>
                  <Text style={[styles.transliteration, { color: colors.primary }]}>{item.transliteration}</Text>
                  <Text style={[styles.translation, { color: colors.textSecondary }]} numberOfLines={1}>{item.translation}</Text>
                </View>

                <View style={styles.counterSection}>
                  {/* Progress circle visual */}
                  <View style={[styles.countCircle, { borderColor: levelColor }]}>
                    <Text style={[styles.countNum, { color: levelColor }]}>{item.count}</Text>
                    <Text style={[styles.countTarget, { color: colors.textMuted }]}>/{item.targetCount}</Text>
                  </View>

                  <View style={styles.countActions}>
                    <TouchableOpacity
                      style={[styles.tapBtn, { backgroundColor: colors.primary }]}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        incrementDhikr(item.id);
                      }}
                    >
                      <Feather name="plus" size={20} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.resetBtn, { backgroundColor: colors.backgroundSecondary }]}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        resetDhikr(item.id);
                      }}
                    >
                      <Feather name="rotate-ccw" size={14} color={colors.textMuted} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Progress bar */}
              <View style={[styles.progressBg, { backgroundColor: colors.backgroundSecondary }]}>
                <View style={[styles.progressFill, { width: `${Math.min(progress * 100, 100)}%`, backgroundColor: levelColor }]} />
              </View>

              {/* Total count */}
              <Text style={[styles.totalCount, { color: colors.textMuted }]}>
                {item.totalCount.toLocaleString()} total recitations
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

function makeStyles(colors: typeof Colors.light) {
  return StyleSheet.create({
    container: { flex: 1 },
    header: { paddingHorizontal: 20, paddingBottom: 12 },
    title: { fontFamily: "Inter_700Bold", fontSize: 28, letterSpacing: -0.5 },
    subtitle: { fontFamily: "Inter_400Regular", fontSize: 14, marginTop: 2 },
    categoryRow: { paddingHorizontal: 16, paddingBottom: 16, gap: 8 },
    categoryChip: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
    },
    categoryText: { fontFamily: "Inter_500Medium", fontSize: 13 },
    card: {
      borderRadius: 20,
      padding: 16,
      borderWidth: 1,
      gap: 12,
    },
    levelBadge: {
      alignSelf: "flex-start",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
    },
    levelText: { fontFamily: "Inter_600SemiBold", fontSize: 11 },
    cardContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 12 },
    arabic: { fontFamily: "Amiri_700Bold", fontSize: 22, textAlign: "right", lineHeight: 34 },
    transliteration: { fontFamily: "Inter_600SemiBold", fontSize: 13, marginTop: 4 },
    translation: { fontFamily: "Inter_400Regular", fontSize: 12, color: "#9CA8A4", marginTop: 2 },
    counterSection: { alignItems: "center", gap: 8 },
    countCircle: {
      width: 64,
      height: 64,
      borderRadius: 32,
      borderWidth: 2.5,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 1,
    },
    countNum: { fontFamily: "Inter_700Bold", fontSize: 20 },
    countTarget: { fontFamily: "Inter_400Regular", fontSize: 12, alignSelf: "flex-end", marginBottom: 2 },
    countActions: { flexDirection: "row", gap: 8, alignItems: "center" },
    tapBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
    },
    resetBtn: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
    },
    progressBg: { height: 4, borderRadius: 2, overflow: "hidden" },
    progressFill: { height: 4, borderRadius: 2 },
    totalCount: { fontFamily: "Inter_400Regular", fontSize: 11 },
  });
}
