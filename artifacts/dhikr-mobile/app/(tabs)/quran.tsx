import { Feather } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { useAppData, QuranLog } from "@/contexts/AppDataContext";

const SURA_NAMES: Record<number, string> = {
  1: "Al-Fatihah", 2: "Al-Baqarah", 3: "Al-Imran", 4: "An-Nisa", 5: "Al-Maidah",
  6: "Al-Anam", 7: "Al-Araf", 36: "Ya-Sin", 55: "Ar-Rahman", 56: "Al-Waqiah",
  67: "Al-Mulk", 112: "Al-Ikhlas", 113: "Al-Falaq", 114: "An-Nas",
};

export default function QuranScreen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const tabHeight = useBottomTabBarHeight();
  const { quranLog, addQuranLog } = useAppData();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ sura: "1", ayat: "", notes: "", type: "reading" as "reading" | "memorising" });
  const styles = makeStyles(colors);

  const totalVerses = quranLog.reduce((acc, e) => {
    const range = e.ayat.split("-");
    if (range.length === 2) return acc + (parseInt(range[1]) - parseInt(range[0]) + 1);
    return acc + 1;
  }, 0);

  const memorised = quranLog.filter((e) => e.type === "memorising").length;

  function handleAdd() {
    if (!form.sura || !form.ayat) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const suraNum = parseInt(form.sura);
    addQuranLog({
      sura: suraNum,
      suraName: SURA_NAMES[suraNum] || `Surah ${suraNum}`,
      ayat: form.ayat,
      notes: form.notes,
      date: new Date().toISOString(),
      type: form.type,
    });
    setForm({ sura: "1", ayat: "", notes: "", type: "reading" });
    setShowModal(false);
  }

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Quran Log</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>Track your reading & memorisation</Text>
        </View>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: colors.primary }]}
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setShowModal(true); }}
        >
          <Feather name="plus" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={[styles.stat, { backgroundColor: colors.primaryLight }]}>
          <Text style={[styles.statNum, { color: colors.primary }]}>{quranLog.length}</Text>
          <Text style={[styles.statLabel, { color: colors.primary }]}>Sessions</Text>
        </View>
        <View style={[styles.stat, { backgroundColor: colors.goldLight }]}>
          <Text style={[styles.statNum, { color: colors.gold }]}>{totalVerses}</Text>
          <Text style={[styles.statLabel, { color: colors.gold }]}>Verses Read</Text>
        </View>
        <View style={[styles.stat, { backgroundColor: colors.card, borderColor: colors.cardBorder, borderWidth: 1 }]}>
          <Text style={[styles.statNum, { color: colors.text }]}>{memorised}</Text>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>Memorised</Text>
        </View>
      </View>

      {/* Log List */}
      <FlatList
        data={quranLog}
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: tabHeight + 24, gap: 10 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="book-open" size={40} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No sessions yet</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>Log your first reading session above</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View style={[styles.typeBadge, { backgroundColor: item.type === "memorising" ? colors.goldLight : colors.primaryLight }]}>
              <Feather name={item.type === "memorising" ? "star" : "book"} size={12} color={item.type === "memorising" ? colors.gold : colors.primary} />
              <Text style={[styles.typeText, { color: item.type === "memorising" ? colors.gold : colors.primary }]}>
                {item.type === "memorising" ? "Memorising" : "Reading"}
              </Text>
            </View>
            <View style={styles.cardMain}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.suraName, { color: colors.text }]}>{item.suraName}</Text>
                <Text style={[styles.ayat, { color: colors.primary }]}>Ayat {item.ayat}</Text>
                {item.notes ? <Text style={[styles.notes, { color: colors.textMuted }]} numberOfLines={2}>{item.notes}</Text> : null}
              </View>
              <Text style={[styles.date, { color: colors.textMuted }]}>
                {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </Text>
            </View>
          </View>
        )}
      />

      {/* Add Modal */}
      <Modal visible={showModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowModal(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          <View style={[styles.modal, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Log Session</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Feather name="x" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
              {/* Type toggle */}
              <View style={[styles.typeRow, { backgroundColor: colors.backgroundSecondary }]}>
                {(["reading", "memorising"] as const).map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.typeBtn, form.type === t && { backgroundColor: colors.card }]}
                    onPress={() => setForm((f) => ({ ...f, type: t }))}
                  >
                    <Text style={[styles.typeBtnText, { color: form.type === t ? colors.text : colors.textMuted }]}>
                      {t === "reading" ? "Reading" : "Memorising"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={[styles.inputGroup, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                <Text style={[styles.inputLabel, { color: colors.textMuted }]}>Surah Number</Text>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={form.sura}
                  onChangeText={(v) => setForm((f) => ({ ...f, sura: v }))}
                  keyboardType="number-pad"
                  placeholder="e.g. 36"
                  placeholderTextColor={colors.textMuted}
                />
              </View>

              <View style={[styles.inputGroup, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                <Text style={[styles.inputLabel, { color: colors.textMuted }]}>Ayat / Range</Text>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={form.ayat}
                  onChangeText={(v) => setForm((f) => ({ ...f, ayat: v }))}
                  placeholder="e.g. 1-20 or 5"
                  placeholderTextColor={colors.textMuted}
                />
              </View>

              <View style={[styles.inputGroup, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                <Text style={[styles.inputLabel, { color: colors.textMuted }]}>Notes (optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea, { color: colors.text }]}
                  value={form.notes}
                  onChangeText={(v) => setForm((f) => ({ ...f, notes: v }))}
                  placeholder="Reflections, revision notes…"
                  placeholderTextColor={colors.textMuted}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: colors.primary, opacity: form.sura && form.ayat ? 1 : 0.5 }]}
                onPress={handleAdd}
                disabled={!form.sura || !form.ayat}
              >
                <Text style={styles.saveBtnText}>Save Session</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

function makeStyles(colors: typeof Colors.light) {
  return StyleSheet.create({
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingBottom: 16,
    },
    title: { fontFamily: "Inter_700Bold", fontSize: 28, letterSpacing: -0.5 },
    subtitle: { fontFamily: "Inter_400Regular", fontSize: 14, marginTop: 2 },
    addBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
    },
    statsRow: { flexDirection: "row", paddingHorizontal: 16, gap: 10, marginBottom: 20 },
    stat: { flex: 1, borderRadius: 16, padding: 14, alignItems: "center" },
    statNum: { fontFamily: "Inter_700Bold", fontSize: 22, letterSpacing: -0.5 },
    statLabel: { fontFamily: "Inter_400Regular", fontSize: 11, marginTop: 2 },
    card: { borderRadius: 18, padding: 16, borderWidth: 1, gap: 10 },
    typeBadge: { flexDirection: "row", alignItems: "center", gap: 5, alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
    typeText: { fontFamily: "Inter_500Medium", fontSize: 11 },
    cardMain: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
    suraName: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
    ayat: { fontFamily: "Inter_500Medium", fontSize: 13, marginTop: 2 },
    notes: { fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 4 },
    date: { fontFamily: "Inter_400Regular", fontSize: 12 },
    empty: { alignItems: "center", paddingTop: 80, gap: 12 },
    emptyTitle: { fontFamily: "Inter_600SemiBold", fontSize: 18 },
    emptySubtitle: { fontFamily: "Inter_400Regular", fontSize: 14, textAlign: "center" },
    modal: { flex: 1, padding: 24 },
    modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
    modalTitle: { fontFamily: "Inter_700Bold", fontSize: 22 },
    typeRow: { flexDirection: "row", borderRadius: 14, padding: 4, gap: 4 },
    typeBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: "center" },
    typeBtnText: { fontFamily: "Inter_500Medium", fontSize: 14 },
    inputGroup: { borderRadius: 16, padding: 16, borderWidth: 1, gap: 8 },
    inputLabel: { fontFamily: "Inter_500Medium", fontSize: 12 },
    input: { fontFamily: "Inter_400Regular", fontSize: 16, padding: 0 },
    textArea: { minHeight: 80, textAlignVertical: "top" },
    saveBtn: { borderRadius: 16, padding: 16, alignItems: "center" },
    saveBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: "#fff" },
  });
}
