import { Feather } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";

// ── Types ─────────────────────────────────────────────────────────────────────
interface VideoItem {
  id: string;
  videoId: string;
  title: string;
  speaker: string;
  duration: string;
}
interface VideoSection {
  title: string;
  color: string;
  data: VideoItem[];
}

// ── Data ──────────────────────────────────────────────────────────────────────
const SECTIONS: VideoSection[] = [
  {
    title: "Daily Reminders",
    color: "#7CB99E",
    data: [
      { id: "r1", videoId: "1Rl0mhSGbOU", title: "The Power of Bismillah", speaker: "Mufti Menk", duration: "8:42" },
      { id: "r2", videoId: "dQHfaUhMx0E", title: "Why Does Allah Test Us?", speaker: "Nouman Ali Khan", duration: "15:20" },
      { id: "r3", videoId: "6NkWfE5mZCM", title: "Be Grateful to Allah", speaker: "Mufti Menk", duration: "12:05" },
      { id: "r4", videoId: "JznXSbFj3Qo", title: "Trust Allah's Plan", speaker: "Omar Suleiman", duration: "10:33" },
      { id: "r5", videoId: "VEH7JePxC34", title: "Don't Be Sad – Allah Knows", speaker: "Mufti Menk", duration: "9:48" },
    ],
  },
  {
    title: "Quran & Tafsir",
    color: "#5B8DB8",
    data: [
      { id: "q1", videoId: "7sP_0v3KZWQ", title: "Most Powerful Duas from Quran", speaker: "FreeQuranEducation", duration: "15:30" },
      { id: "q2", videoId: "PGrLgp-GNmg", title: "Beautiful Hadith on Kindness", speaker: "Mufti Menk", duration: "11:30" },
      { id: "q3", videoId: "Ow5d54nwEfk", title: "Hadith on Sincerity of Actions", speaker: "Omar Suleiman", duration: "14:22" },
    ],
  },
  {
    title: "Quran Recitations",
    color: "#C9A84C",
    data: [
      { id: "qr1", videoId: "ORoeZjXs6qI", title: "Surah Ar-Rahman — Full Recitation", speaker: "Mishary Rashid Alafasy", duration: "12:05" },
      { id: "qr2", videoId: "HlYqJEDlKMU", title: "Surah Al-Mulk — Heart Touching", speaker: "Abdul Rahman Al Sudais", duration: "8:30" },
    ],
  },
  {
    title: "Dhikr & Dua",
    color: "#9B8EC4",
    data: [
      { id: "d1", videoId: "XnP6TnYn3Zs", title: "Powerful Dhikr for Daily Life", speaker: "Omar Suleiman", duration: "18:25" },
      { id: "d2", videoId: "FGtUNYrqM3o", title: "Dua That Changed My Life", speaker: "Mufti Menk", duration: "12:40" },
    ],
  },
];

// ── Video card ────────────────────────────────────────────────────────────────
function VideoCard({ item, sectionColor }: { item: VideoItem; sectionColor: string }) {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const [thumbOk, setThumbOk] = useState(true);

  async function open() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await WebBrowser.openBrowserAsync(`https://www.youtube.com/watch?v=${item.videoId}`);
  }

  const styles = cardStyles(colors);
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={open}>
      {/* Thumbnail */}
      <View style={styles.thumb}>
        {thumbOk ? (
          <Image
            source={{ uri: `https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg` }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
            onError={() => setThumbOk(false)}
          />
        ) : (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: "#111" }]} />
        )}
        <View style={styles.thumbOverlay} />
        <View style={styles.playCircle}>
          <Feather name="play" size={18} color="#fff" />
        </View>
        <View style={styles.durChip}>
          <Text style={styles.durText}>{item.duration}</Text>
        </View>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={[styles.videoTitle, { color: colors.text }]} numberOfLines={2}>{item.title}</Text>
        <View style={styles.speakerRow}>
          <View style={[styles.dot, { backgroundColor: sectionColor }]} />
          <Text style={[styles.speaker, { color: colors.textSecondary }]}>{item.speaker}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────
export default function VideosScreen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const tabHeight = useBottomTabBarHeight();
  const styles = makeStyles(colors);

  const allVideos = SECTIONS.flatMap((s) => s.data);
  const totalWatched = 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Videos</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>{allVideos.length} Islamic videos</Text>
        </View>
        <View style={[styles.ytBadge, { backgroundColor: "#EF444422" }]}>
          <Feather name="youtube" size={14} color="#EF4444" />
          <Text style={styles.ytBadgeText}>YouTube</Text>
        </View>
      </View>

      <SectionList
        sections={SECTIONS}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: tabHeight + 24 }}
        renderSectionHeader={({ section }) => (
          <View style={[styles.sectionHeader, { borderLeftColor: section.color }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
            <Text style={[styles.sectionCount, { color: colors.textMuted }]}>{section.data.length} videos</Text>
          </View>
        )}
        renderItem={({ item, section }) => (
          <VideoCard item={item} sectionColor={section.color} />
        )}
      />
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
function makeStyles(colors: typeof Colors.light) {
  return StyleSheet.create({
    container: { flex: 1 },
    header: {
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingBottom: 12,
    },
    title: { fontFamily: "Inter_700Bold", fontSize: 28, letterSpacing: -0.5 },
    subtitle: { fontFamily: "Inter_400Regular", fontSize: 13, marginTop: 2 },
    ytBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 12,
    },
    ytBadgeText: {
      fontFamily: "Inter_600SemiBold",
      fontSize: 12,
      color: "#EF4444",
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginHorizontal: 16,
      marginTop: 20,
      marginBottom: 10,
      paddingLeft: 12,
      borderLeftWidth: 3,
    },
    sectionTitle: { fontFamily: "Inter_700Bold", fontSize: 16 },
    sectionCount: { fontFamily: "Inter_400Regular", fontSize: 12 },
  });
}

function cardStyles(colors: typeof Colors.light) {
  return StyleSheet.create({
    card: {
      flexDirection: "row",
      marginHorizontal: 16,
      marginBottom: 10,
      backgroundColor: colors.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      overflow: "hidden",
    },
    thumb: {
      width: 110,
      height: 78,
      backgroundColor: "#111",
    },
    thumbOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.3)",
    },
    playCircle: {
      position: "absolute",
      top: "50%",
      left: "50%",
      marginLeft: -16,
      marginTop: -16,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: "rgba(0,0,0,0.6)",
      borderWidth: 1.5,
      borderColor: "rgba(255,255,255,0.6)",
      alignItems: "center",
      justifyContent: "center",
    },
    durChip: {
      position: "absolute",
      bottom: 5,
      right: 5,
      backgroundColor: "rgba(0,0,0,0.75)",
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 5,
    },
    durText: {
      fontFamily: "Inter_600SemiBold",
      fontSize: 10,
      color: "#fff",
    },
    info: {
      flex: 1,
      padding: 10,
      gap: 4,
      justifyContent: "center",
    },
    videoTitle: {
      fontFamily: "Inter_600SemiBold",
      fontSize: 13,
      lineHeight: 18,
    },
    speakerRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginTop: 2,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    speaker: {
      fontFamily: "Inter_400Regular",
      fontSize: 12,
    },
  });
}
