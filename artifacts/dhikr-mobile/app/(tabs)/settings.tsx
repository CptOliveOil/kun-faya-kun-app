import { Feather } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { useAppData } from "@/contexts/AppDataContext";

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const tabHeight = useBottomTabBarHeight();
  const { dhikrList, prayerLog, quranLog } = useAppData();
  const [notifyPrayers, setNotifyPrayers] = useState(true);
  const styles = makeStyles(colors);

  const totalDhikr = dhikrList.reduce((a, d) => a + d.totalCount, 0);
  const totalPrayers = prayerLog.length;
  const totalSessions = quranLog.length;

  function SettingRow({
    icon,
    label,
    value,
    onPress,
    isToggle,
    toggleValue,
    onToggle,
    danger,
  }: {
    icon: string;
    label: string;
    value?: string;
    onPress?: () => void;
    isToggle?: boolean;
    toggleValue?: boolean;
    onToggle?: (v: boolean) => void;
    danger?: boolean;
  }) {
    return (
      <TouchableOpacity
        style={[styles.settingRow, { backgroundColor: colors.card }]}
        onPress={onPress}
        activeOpacity={onPress ? 0.7 : 1}
        disabled={!onPress && !isToggle}
      >
        <View style={[styles.settingIcon, { backgroundColor: danger ? "#FFE4E4" : colors.primaryLight }]}>
          <Feather name={icon as any} size={16} color={danger ? colors.error : colors.primary} />
        </View>
        <Text style={[styles.settingLabel, { color: danger ? colors.error : colors.text }]}>{label}</Text>
        <View style={{ marginLeft: "auto" }}>
          {isToggle ? (
            <Switch
              value={toggleValue}
              onValueChange={(v) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onToggle?.(v);
              }}
              trackColor={{ false: colors.backgroundTertiary, true: colors.primary }}
              thumbColor="#fff"
            />
          ) : value ? (
            <Text style={[styles.settingValue, { color: colors.textMuted }]}>{value}</Text>
          ) : (
            <Feather name="chevron-right" size={16} color={colors.textMuted} />
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <ScrollView
      style={[{ flex: 1, backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: tabHeight + 24 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
      </View>

      {/* Profile */}
      <View style={[styles.profileCard, { backgroundColor: colors.primary }]}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>ذ</Text>
        </View>
        <View>
          <Text style={styles.profileName}>Dhikr & Dua</Text>
          <Text style={styles.profileSub}>Your spiritual companion</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { label: "Dhikr", value: totalDhikr.toLocaleString() },
          { label: "Prayer Days", value: totalPrayers.toString() },
          { label: "Quran Sessions", value: totalSessions.toString() },
        ].map((s) => (
          <View key={s.label} style={[styles.stat, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Text style={[styles.statNum, { color: colors.text }]}>{s.value}</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Notifications */}
      <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Notifications</Text>
      <View style={[styles.group, { borderColor: colors.separator }]}>
        <SettingRow
          icon="bell"
          label="Prayer Reminders"
          isToggle
          toggleValue={notifyPrayers}
          onToggle={setNotifyPrayers}
        />
      </View>

      {/* App */}
      <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>App</Text>
      <View style={[styles.group, { borderColor: colors.separator }]}>
        <SettingRow
          icon="info"
          label="App Version"
          value="1.0.0"
        />
        <SettingRow
          icon="heart"
          label="Rate the App"
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        />
        <SettingRow
          icon="share-2"
          label="Share with Friends"
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        />
      </View>

      {/* Danger */}
      <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Data</Text>
      <View style={[styles.group, { borderColor: colors.separator }]}>
        <SettingRow
          icon="trash-2"
          label="Reset All Data"
          danger
          onPress={() => {
            Alert.alert("Reset Data", "This will delete all your dhikr counts, prayer logs, and Quran sessions. This cannot be undone.", [
              { text: "Cancel", style: "cancel" },
              { text: "Reset", style: "destructive" },
            ]);
          }}
        />
      </View>

      <Text style={[styles.footer, { color: colors.textMuted }]}>
        Made with ❤️ for the Muslim Ummah{"\n"}
        بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
      </Text>
    </ScrollView>
  );
}

function makeStyles(colors: typeof Colors.light) {
  return StyleSheet.create({
    header: { paddingHorizontal: 20, marginBottom: 20 },
    title: { fontFamily: "Inter_700Bold", fontSize: 28, letterSpacing: -0.5 },
    profileCard: {
      marginHorizontal: 16,
      borderRadius: 20,
      padding: 20,
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      marginBottom: 16,
    },
    avatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: "rgba(255,255,255,0.25)",
      alignItems: "center",
      justifyContent: "center",
    },
    avatarText: { fontFamily: "Amiri_700Bold", fontSize: 28, color: "#fff" },
    profileName: { fontFamily: "Inter_700Bold", fontSize: 18, color: "#fff" },
    profileSub: { fontFamily: "Inter_400Regular", fontSize: 13, color: "rgba(255,255,255,0.8)", marginTop: 2 },
    statsRow: { flexDirection: "row", paddingHorizontal: 16, gap: 10, marginBottom: 24 },
    stat: { flex: 1, borderRadius: 16, padding: 12, alignItems: "center", borderWidth: 1 },
    statNum: { fontFamily: "Inter_700Bold", fontSize: 18, letterSpacing: -0.5 },
    statLabel: { fontFamily: "Inter_400Regular", fontSize: 10, marginTop: 2, textAlign: "center" },
    sectionTitle: {
      fontFamily: "Inter_500Medium",
      fontSize: 12,
      textTransform: "uppercase",
      letterSpacing: 0.8,
      paddingHorizontal: 20,
      marginBottom: 8,
    },
    group: {
      marginHorizontal: 16,
      borderRadius: 20,
      overflow: "hidden",
      marginBottom: 24,
    },
    settingRow: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      gap: 14,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: "rgba(0,0,0,0.06)",
    },
    settingIcon: {
      width: 34,
      height: 34,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    settingLabel: { fontFamily: "Inter_500Medium", fontSize: 15 },
    settingValue: { fontFamily: "Inter_400Regular", fontSize: 14 },
    footer: {
      fontFamily: "Inter_400Regular",
      fontSize: 13,
      textAlign: "center",
      paddingHorizontal: 40,
      lineHeight: 22,
      paddingTop: 8,
    },
  });
}
