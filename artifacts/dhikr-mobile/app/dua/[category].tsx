import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";

const DUA_DATA: Record<string, { title: string; duas: { arabic: string; transliteration: string; translation: string; source: string }[] }> = {
  morning: {
    title: "Morning Adhkar",
    duas: [
      {
        arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ",
        transliteration: "Asbahna wa asbahal mulku lillah",
        translation: "We have entered a new morning and with it all dominion belongs to Allah.",
        source: "Muslim",
      },
      {
        arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
        transliteration: "Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namutu, wa ilaikan-nushur",
        translation: "O Allah, by Your leave we have reached the morning and by Your leave we have reached the evening, by Your leave we live and die and unto You is our resurrection.",
        source: "Tirmidhi",
      },
      {
        arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
        transliteration: "SubhanAllahi wa bihamdihi",
        translation: "Glory and praise be to Allah. (100 times)",
        source: "Muslim",
      },
    ],
  },
  evening: {
    title: "Evening Adhkar",
    duas: [
      {
        arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ",
        transliteration: "Amsayna wa amsal mulku lillah",
        translation: "We have entered the evening and with it all dominion belongs to Allah.",
        source: "Muslim",
      },
      {
        arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ",
        transliteration: "Allahumma inni a'udhu bika minal-hammi wal-hazan",
        translation: "O Allah, I seek refuge in You from worry and grief.",
        source: "Bukhari",
      },
    ],
  },
  sleep: {
    title: "Before Sleep",
    duas: [
      {
        arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
        transliteration: "Bismika Allahumma amutu wa ahya",
        translation: "In Your name, O Allah, I die and I live.",
        source: "Bukhari",
      },
      {
        arabic: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ",
        transliteration: "Allahumma qini 'adhabaka yawma tab'athu 'ibadak",
        translation: "O Allah, protect me from Your punishment on the Day You resurrect Your servants.",
        source: "Abu Dawud",
      },
    ],
  },
  waking: {
    title: "Upon Waking",
    duas: [
      {
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
        transliteration: "Alhamdulillahil-ladhi ahyana ba'da ma amatana wa ilayhin-nushur",
        translation: "All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection.",
        source: "Bukhari",
      },
    ],
  },
};

export default function DuaScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const [expanded, setExpanded] = useState<number | null>(null);
  const styles = makeStyles(colors);

  const catData = DUA_DATA[category] || DUA_DATA.morning;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: colors.card }]} onPress={() => router.back()}>
          <Feather name="x" size={18} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>{catData.title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={catData.duas}
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 40, gap: 12 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setExpanded(expanded === index ? null : index);
            }}
            activeOpacity={0.85}
          >
            <Text style={[styles.arabic, { color: colors.text }]}>{item.arabic}</Text>
            {expanded === index && (
              <>
                <View style={[styles.divider, { backgroundColor: colors.separator }]} />
                <Text style={[styles.transliteration, { color: colors.primary }]}>{item.transliteration}</Text>
                <Text style={[styles.translation, { color: colors.textSecondary }]}>{item.translation}</Text>
                <View style={[styles.source, { backgroundColor: colors.primaryLight }]}>
                  <Feather name="book" size={12} color={colors.primary} />
                  <Text style={[styles.sourceText, { color: colors.primary }]}>{item.source}</Text>
                </View>
              </>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

function makeStyles(colors: typeof Colors.light) {
  return StyleSheet.create({
    container: { flex: 1 },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingBottom: 16,
    },
    backBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    title: { fontFamily: "Inter_700Bold", fontSize: 20 },
    card: { borderRadius: 20, padding: 18, borderWidth: 1, gap: 10 },
    arabic: { fontFamily: "Amiri_700Bold", fontSize: 20, textAlign: "right", lineHeight: 34 },
    divider: { height: 1 },
    transliteration: { fontFamily: "Inter_500Medium", fontSize: 13, fontStyle: "italic" },
    translation: { fontFamily: "Inter_400Regular", fontSize: 14, lineHeight: 22 },
    source: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      alignSelf: "flex-start",
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 10,
    },
    sourceText: { fontFamily: "Inter_500Medium", fontSize: 12 },
  });
}
