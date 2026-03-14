import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Moon, BookOpen, PlayCircle, BarChart3, Compass, HelpCircle,
  Settings, Book, Star, ChevronDown, ChevronRight, Bug, MessageSquare,
  Clock, Award, Repeat, Bell, Palette, Globe
} from "lucide-react";
import { SlideUpPanel } from "./SlideUpPanel";

interface GuideSection {
  title: string;
  icon: any;
  content: string[];
}

const GUIDE_SECTIONS: GuideSection[] = [
  {
    title: "Home",
    icon: Home,
    content: [
      "Your main dashboard showing a greeting, Islamic date, and prayer times based on your location.",
      "Quick access icons let you jump to Qibla, Quran, Stats, Quiz, Guide, and Settings.",
      "Quick Duas cards give fast access to Morning, Evening, After Prayer, and Bedtime supplications.",
      "Featured Dhikr card shows the current dhikr with its goal count.",
    ],
  },
  {
    title: "Dhikr Counter",
    icon: Repeat,
    content: [
      "Tap the large circle to count. Each tap adds one to your counter with haptic feedback.",
      "Swipe left/right to switch between 12 different dhikr.",
      "Each dhikr has three levels: Beginner, Intermediate, Advanced with increasing targets.",
      "Reaching milestones (multiples of 33) triggers a celebration and earns achievements.",
      "Your progress syncs to your account if signed in.",
    ],
  },
  {
    title: "Prayers (Salah)",
    icon: Moon,
    content: [
      "Log each of the 5 daily prayers: Fajr, Dhuhr, Asr, Maghrib, Isha.",
      "Tap a prayer card to mark it. Choose quality (Excellent/Good/Rushed/Distracted) and whether you did post-prayer dhikr.",
      "Enter the time you actually prayed for accurate tracking.",
      "View your weekly/monthly prayer stats and completion streaks in the Stats tab.",
      "The How to Pray tab has a step-by-step guide for learning salah.",
    ],
  },
  {
    title: "Prayer Times",
    icon: Clock,
    content: [
      "Prayer times are calculated using the adhan library based on your GPS location.",
      "Choose from 12 calculation methods (Muslim World League, Egyptian, ISNA, Umm Al-Qura, etc.).",
      "Select your Asr method: Shafi/Hanbali/Maliki or Hanafi.",
      "Fine-tune each prayer time with +/- 5 minute offsets.",
      "The sun arc shows the current time relative to prayers.",
      "Each prayer card shows a sun stage icon representing the time of day.",
    ],
  },
  {
    title: "Duas Library",
    icon: BookOpen,
    content: [
      "Browse 33 categories of authentic duas organized in Main and Other tabs.",
      "Categories include Morning Adhkar, Evening Adhkar, Food & Drink, Travel, Hajj & Umrah, Protection, and many more.",
      "Tap any category to see its duas in a slide-up panel with Arabic text, transliteration, and English translation.",
      "Use the search bar to quickly find specific duas or categories.",
      "Islamic Stories tab has stories of Prophets, Companions, Hadith gems, and Quran narratives.",
    ],
  },
  {
    title: "Videos",
    icon: PlayCircle,
    content: [
      "Watch curated Islamic videos from scholars like Mufti Menk, Nouman Ali Khan, Omar Suleiman, and Yasir Qadhi.",
      "6 categories: Daily Reminders, Hadith Explanations, Prophet Stories, Quran Recitations, Night Prayers, and Community & Brotherhood.",
      "Track your watch progress — the app shows how many of the 31 videos you've completed.",
      "Videos open in a slide-up player panel.",
    ],
  },
  {
    title: "Stats Dashboard",
    icon: BarChart3,
    content: [
      "See your total dhikr count, current streak, and milestones reached.",
      "Prayer completion rate with daily breakdown bars.",
      "Toggle between weekly and monthly views.",
      "Track achievements and spiritual growth over time.",
    ],
  },
  {
    title: "Qibla Compass",
    icon: Compass,
    content: [
      "Points toward the Kaaba in Makkah using your device compass and GPS.",
      "On mobile: uses the device orientation sensor for real-time direction.",
      "On desktop: uses a manual slider to set your heading direction.",
      "Shows your bearing to Makkah in degrees and cardinal direction (N/NE/E/etc.).",
    ],
  },
  {
    title: "Quran Tracker",
    icon: Book,
    content: [
      "Log your daily Quran reading by surah, ayah, and pages.",
      "Track memorisation progress with strength ratings.",
      "Keep a record of your Quran journey over time.",
    ],
  },
  {
    title: "Islamic Quiz",
    icon: HelpCircle,
    content: [
      "Test your Islamic knowledge with 12 questions.",
      "Unlocked by reaching dhikr milestones — keep counting to unlock more!",
      "Questions cover Quran, Hadith, Fiqh, and Islamic history.",
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    content: [
      "Choose from 6 color themes: Sage Green, Royal Purple, Ocean Blue, Rose, Dark Forest, Warm Sand.",
      "Toggle large font size for easier reading.",
      "Toggle always-show Arabic text.",
      "Sign in to sync progress across devices or continue as a guest.",
    ],
  },
  {
    title: "Notifications",
    icon: Bell,
    content: [
      "Enable browser push notifications to get reminders before each prayer time.",
      "Tap the bell icon on any prayer time card to enable.",
      "Works in the background even when the app is closed (on supported browsers).",
    ],
  },
];

function GuideSectionItem({ section }: { section: GuideSection }) {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = section.icon;

  return (
    <div className="frosted-card rounded-2xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
      >
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="w-4.5 h-4.5 text-primary" strokeWidth={1.8} />
        </div>
        <span className="flex-1 text-sm font-bold text-foreground">{section.title}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2.5 border-t border-border pt-3">
              {section.content.map((line, i) => (
                <div key={i} className="flex gap-2.5 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-1.5 shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">{line}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function HelpGuide({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [showBugReport, setShowBugReport] = useState(false);
  const [bugText, setBugText] = useState("");
  const [bugSubmitted, setBugSubmitted] = useState(false);

  function handleSubmitBug() {
    if (!bugText.trim()) return;
    const existing = JSON.parse(localStorage.getItem("kun_bug_reports") || "[]");
    existing.push({
      id: Date.now(),
      text: bugText.trim(),
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    });
    localStorage.setItem("kun_bug_reports", JSON.stringify(existing));
    setBugSubmitted(true);
    setBugText("");
    setTimeout(() => {
      setBugSubmitted(false);
      setShowBugReport(false);
    }, 2000);
  }

  return (
    <SlideUpPanel isOpen={isOpen} onClose={onClose} title="Help & Guide">
      <div className="space-y-3 pt-2">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Learn how to use every feature of Kun Fayakun. Tap any section to expand.
        </p>

        {GUIDE_SECTIONS.map((section) => (
          <GuideSectionItem key={section.title} section={section} />
        ))}

        <div className="pt-4 border-t border-border space-y-3">
          <h3 className="text-sm font-bold text-foreground">Found an issue?</h3>

          {!showBugReport ? (
            <button
              onClick={() => setShowBugReport(true)}
              className="w-full frosted-card rounded-2xl px-4 py-3.5 flex items-center gap-3 text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                <Bug className="w-4.5 h-4.5 text-red-500" strokeWidth={1.8} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground">Report a Bug</p>
                <p className="text-[10px] text-muted-foreground">Help us improve by reporting issues</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="frosted-card rounded-2xl p-4 space-y-3"
            >
              {bugSubmitted ? (
                <div className="py-4 text-center">
                  <p className="text-primary font-bold text-sm">Thank you!</p>
                  <p className="text-xs text-muted-foreground mt-1">Your report has been saved.</p>
                </div>
              ) : (
                <>
                  <label className="text-xs font-bold text-muted-foreground uppercase">Describe the issue</label>
                  <textarea
                    value={bugText}
                    onChange={(e) => setBugText(e.target.value)}
                    placeholder="What went wrong? What did you expect to happen?"
                    rows={4}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowBugReport(false)}
                      className="flex-1 py-2.5 bg-muted text-muted-foreground rounded-xl text-sm font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitBug}
                      disabled={!bugText.trim()}
                      className="flex-[2] py-2.5 bg-primary text-white rounded-xl text-sm font-bold disabled:opacity-50"
                    >
                      Submit Report
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </div>

        <div className="pt-2 text-center">
          <p className="text-[10px] text-muted-foreground">Kun Fayakun v2.0.0</p>
        </div>
      </div>
    </SlideUpPanel>
  );
}
