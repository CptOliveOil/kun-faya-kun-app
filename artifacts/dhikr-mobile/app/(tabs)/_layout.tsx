import { BlurView } from "expo-blur";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { SymbolView } from "expo-symbols";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, Text, View, useColorScheme } from "react-native";
import Colors from "@/constants/colors";

const GOLD = "#C9A84C";

function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: "house", selected: "house.fill" }} />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="dhikr">
        <Icon sf={{ default: "circle.hexagongrid", selected: "circle.hexagongrid.fill" }} />
        <Label>Dhikr</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="prayers">
        <Icon sf={{ default: "moon.stars", selected: "moon.stars.fill" }} />
        <Label>Prayers</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="halaltok">
        <Icon sf={{ default: "play.circle.fill", selected: "play.circle.fill" }} />
        <Label>HalalTok</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="library">
        <Icon sf={{ default: "books.vertical", selected: "books.vertical.fill" }} />
        <Label>Library</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="videos">
        <Icon sf={{ default: "video", selected: "video.fill" }} />
        <Label>Videos</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <Icon sf={{ default: "gearshape", selected: "gearshape.fill" }} />
        <Label>Settings</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const isIOS = Platform.OS === "ios";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabIconDefault,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: isIOS ? "transparent" : colors.card,
          borderTopWidth: 1,
          borderTopColor: colors.separator,
          elevation: 0,
          height: 60,
        },
        tabBarLabelStyle: {
          fontFamily: "Inter_500Medium",
          fontSize: 10,
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={100}
              tint={isDark ? "dark" : "extraLight"}
              style={StyleSheet.absoluteFill}
            />
          ) : null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) =>
            isIOS ? (
              <SymbolView name="house" tintColor={color} size={size - 2} />
            ) : (
              <Feather name="home" size={size - 2} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="dhikr"
        options={{
          title: "Dhikr",
          tabBarIcon: ({ color, size }) =>
            isIOS ? (
              <SymbolView name="circle.hexagongrid" tintColor={color} size={size - 2} />
            ) : (
              <Feather name="rotate-cw" size={size - 2} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="prayers"
        options={{
          title: "Prayers",
          tabBarIcon: ({ color, size }) =>
            isIOS ? (
              <SymbolView name="moon.stars" tintColor={color} size={size - 2} />
            ) : (
              <Feather name="moon" size={size - 2} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="halaltok"
        options={{
          title: "HalalTok",
          tabBarActiveTintColor: GOLD,
          tabBarIcon: ({ focused, size }) => (
            <View
              style={{
                width: size + 10,
                height: size + 10,
                borderRadius: (size + 10) / 2,
                backgroundColor: focused ? GOLD : GOLD + "22",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1.5,
                borderColor: focused ? GOLD : GOLD + "55",
                marginBottom: 2,
              }}
            >
              <Feather name="play" size={size - 4} color={focused ? "#fff" : GOLD} />
            </View>
          ),
          tabBarLabelStyle: {
            fontFamily: "Inter_700Bold",
            fontSize: 10,
            color: GOLD,
          },
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: "Library",
          tabBarIcon: ({ color, size }) =>
            isIOS ? (
              <SymbolView name="books.vertical" tintColor={color} size={size - 2} />
            ) : (
              <Feather name="book-open" size={size - 2} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="videos"
        options={{
          title: "Videos",
          tabBarIcon: ({ color, size }) =>
            isIOS ? (
              <SymbolView name="video" tintColor={color} size={size - 2} />
            ) : (
              <Feather name="video" size={size - 2} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) =>
            isIOS ? (
              <SymbolView name="gearshape" tintColor={color} size={size - 2} />
            ) : (
              <Feather name="settings" size={size - 2} color={color} />
            ),
        }}
      />
      {/* Hidden tabs – still reachable via router.push */}
      <Tabs.Screen name="quran" options={{ href: null }} />
    </Tabs>
  );
}

export default function TabLayout() {
  if (isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}
