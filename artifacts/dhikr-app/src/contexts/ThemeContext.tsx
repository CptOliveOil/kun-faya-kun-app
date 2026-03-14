import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type ThemePreset = "sage" | "purple" | "ocean" | "rose" | "forest" | "sand" | "teal" | "midnight" | "olive" | "maroon" | "amber" | "slate";
type FontSize = "normal" | "large" | "extra-large";
type Language = "en" | "ar" | "ur" | "fr" | "tr" | "ms" | "id" | "bn";

interface ThemeContextType {
  theme: ThemePreset;
  setTheme: (theme: ThemePreset) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  highContrast: boolean;
  setHighContrast: (hc: boolean) => void;
  alwaysShowArabic: boolean;
  setAlwaysShowArabic: (show: boolean) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  largeFont: boolean;
  setLargeFont: (large: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const THEMES: Record<ThemePreset, { primary: string; background: string; foreground: string; card: string; border: string; secondary: string }> = {
  sage:     { primary: "145 42% 36%", background: "138 28% 93%", foreground: "148 22% 11%", card: "42 32% 96%",  border: "43 55% 70%",  secondary: "43 78% 50%"  },
  purple:   { primary: "259 45% 55%", background: "260 20% 90%", foreground: "260 15% 12%", card: "260 15% 94%", border: "43 50% 65%",  secondary: "43 72% 52%"  },
  ocean:    { primary: "198 57% 42%", background: "200 25% 88%", foreground: "200 15% 12%", card: "200 15% 94%", border: "43 50% 65%",  secondary: "43 72% 52%"  },
  rose:     { primary: "355 54% 64%", background: "355 20% 90%", foreground: "355 15% 12%", card: "355 15% 94%", border: "43 50% 65%",  secondary: "43 72% 52%"  },
  forest:   { primary: "150 45% 38%", background: "150 20% 8%",  foreground: "140 10% 92%", card: "150 18% 12%", border: "43 35% 30%",  secondary: "43 72% 52%"  },
  sand:     { primary: "43 72% 52%",  background: "38 30% 88%",  foreground: "35 15% 12%",  card: "38 20% 93%",  border: "43 50% 65%",  secondary: "150 45% 28%" },
  teal:     { primary: "174 50% 35%", background: "174 25% 88%", foreground: "174 20% 12%", card: "174 15% 93%", border: "43 45% 62%",  secondary: "43 72% 52%"  },
  midnight: { primary: "220 55% 45%", background: "220 30% 14%", foreground: "220 10% 90%", card: "220 28% 18%", border: "220 30% 35%", secondary: "43 72% 52%"  },
  olive:    { primary: "78 38% 32%",  background: "80 22% 86%",  foreground: "78 18% 12%",  card: "78 15% 92%",  border: "43 45% 60%",  secondary: "43 72% 52%"  },
  maroon:   { primary: "350 52% 38%", background: "350 20% 90%", foreground: "350 15% 12%", card: "350 12% 94%", border: "43 45% 62%",  secondary: "43 72% 52%"  },
  amber:    { primary: "35 80% 42%",  background: "38 30% 90%",  foreground: "35 20% 12%",  card: "38 22% 94%",  border: "43 50% 65%",  secondary: "150 45% 32%" },
  slate:    { primary: "215 22% 42%", background: "215 15% 88%", foreground: "215 12% 12%", card: "215 12% 93%", border: "215 20% 65%", secondary: "43 72% 52%"  },
};

export const LANGUAGES: Record<Language, string> = {
  en: "English",
  ar: "العربية",
  ur: "اردو",
  fr: "Français",
  tr: "Türkçe",
  ms: "Bahasa Melayu",
  id: "Bahasa Indonesia",
  bn: "বাংলা",
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemePreset>(() => {
    return (localStorage.getItem("dhikr_theme") as ThemePreset) || "sage";
  });
  const [fontSize, setFontSize] = useState<FontSize>(() => {
    return (localStorage.getItem("dhikr_font_size") as FontSize) || "normal";
  });
  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem("dhikr_high_contrast") === "true";
  });
  const [alwaysShowArabic, setAlwaysShowArabic] = useState(() => {
    return localStorage.getItem("dhikr_show_arabic") !== "false";
  });
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem("dhikr_language") as Language) || "en";
  });

  const largeFont = fontSize === "large" || fontSize === "extra-large";
  const setLargeFont = (large: boolean) => {
    setFontSize(large ? "large" : "normal");
  };

  useEffect(() => {
    localStorage.setItem("dhikr_theme", theme);
    const root = document.documentElement;
    const colors = THEMES[theme];
    
    root.style.setProperty("--primary", colors.primary);
    root.style.setProperty("--background", colors.background);
    root.style.setProperty("--foreground", colors.foreground);
    root.style.setProperty("--card", colors.card);
    root.style.setProperty("--border", colors.border);
    root.style.setProperty("--secondary", colors.secondary);
    
    if (theme === "forest") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("dhikr_font_size", fontSize);
    const root = document.documentElement;
    root.classList.remove("text-large", "text-extra-large");
    if (fontSize === "large") root.classList.add("text-large");
    if (fontSize === "extra-large") root.classList.add("text-extra-large");
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem("dhikr_high_contrast", highContrast.toString());
    if (highContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem("dhikr_show_arabic", alwaysShowArabic.toString());
  }, [alwaysShowArabic]);

  useEffect(() => {
    localStorage.setItem("dhikr_language", language);
  }, [language]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, fontSize, setFontSize, highContrast, setHighContrast, alwaysShowArabic, setAlwaysShowArabic, language, setLanguage, largeFont, setLargeFont }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
