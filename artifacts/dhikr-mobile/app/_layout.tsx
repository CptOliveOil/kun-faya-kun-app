import {
  Amiri_400Regular,
  Amiri_700Bold,
} from "@expo-google-fonts/amiri";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

SplashScreen.preventAutoHideAsync();

const WEB_APP_URL = `https://${process.env.EXPO_PUBLIC_DOMAIN}/`;

function AppWebView() {
  const insets = useSafeAreaInsets();
  const webRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === "android" ? insets.top : 0 }]}>
      <StatusBar style="dark" />

      {loading && !error && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <Text style={styles.loadingArabic}>كُن فَيَكُونُ</Text>
            <Text style={styles.loadingText}>Kun Fayakun</Text>
            <ActivityIndicator color="#7CB99E" size="large" style={{ marginTop: 20 }} />
            <Text style={styles.loadingSubtext}>Loading your Islamic companion…</Text>
          </View>
        </View>
      )}

      {error && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <Text style={styles.loadingArabic}>كُن فَيَكُونُ</Text>
            <Text style={styles.loadingText}>Connection Error</Text>
            <Text style={styles.errorText}>
              Could not connect to the app server.{"\n"}
              Make sure your Replit workspace is running.
            </Text>
            <TouchableOpacity
              style={styles.retryBtn}
              onPress={() => {
                setError(false);
                setLoading(true);
                webRef.current?.reload();
              }}
            >
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <WebView
        ref={webRef}
        source={{ uri: WEB_APP_URL }}
        style={[styles.webview, (loading || error) && { opacity: 0 }]}
        onLoadEnd={() => setLoading(false)}
        onError={() => { setError(true); setLoading(false); }}
        onHttpError={(e) => {
          if (e.nativeEvent.statusCode >= 500) {
            setError(true);
            setLoading(false);
          }
        }}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled
        domStorageEnabled
        allowsBackForwardNavigationGestures
        pullToRefreshEnabled
        cacheEnabled
        startInLoadingState={false}
        userAgent="KunFayakunApp/1.0 Mobile Safari"
      />
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Amiri_400Regular,
    Amiri_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <AppWebView />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF4F0",
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#EEF4F0",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  loadingCard: {
    alignItems: "center",
    padding: 40,
    gap: 8,
  },
  loadingArabic: {
    fontSize: 42,
    color: "#7CB99E",
    fontFamily: "Amiri_700Bold",
    textAlign: "center",
    lineHeight: 60,
  },
  loadingText: {
    fontSize: 22,
    color: "#1A2420",
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
    textAlign: "center",
  },
  loadingSubtext: {
    fontSize: 13,
    color: "#9CA8A4",
    fontFamily: "Inter_400Regular",
    marginTop: 8,
    textAlign: "center",
  },
  errorText: {
    fontSize: 13,
    color: "#6B7A76",
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 12,
  },
  retryBtn: {
    marginTop: 20,
    backgroundColor: "#7CB99E",
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 14,
  },
  retryText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 15,
  },
});
