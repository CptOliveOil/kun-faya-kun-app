import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Sun, Sunset, Moon as MoonIcon, Star, ChevronRight, Compass, HelpCircle, BookOpen, BarChart3, PlayCircle, Book, Search, CircleHelp, Flame, Sparkles, Settings, Puzzle, SlidersHorizontal } from "lucide-react";
import { AppLogoIcon } from "@/components/NavIcons";
import { useDhikrData } from "@/hooks/use-app-data";
import { PrayerTimesCard } from "@/components/PrayerTimesCard";
import { AuthBanner, CompactAuthPrompt } from "@/components/AuthBanner";
import { useAuthContext } from "@/contexts/AuthContext";
import { hasChosenGuestMode } from "@/hooks/use-session";
import { GlobalSearch } from "@/components/GlobalSearch";
import { HelpGuide } from "@/components/HelpGuide";

const DAILY_REMINDERS = [
  { arabic: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ", text: "Actions are judged by intentions.", source: "Sahih al-Bukhari 1" },
  { arabic: "تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ صَدَقَةٌ", text: "Your smile in your brother's face is charity.", source: "Tirmidhi 1956" },
  { arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا", text: "Allah does not burden a soul beyond that it can bear.", source: "Quran 2:286" },
  { arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", text: "Indeed, with hardship comes ease.", source: "Quran 94:5" },
  { arabic: "أَسْتَغْفِرُ اللهَ وَأَتُوبُ إِلَيْهِ", text: "I seek forgiveness from Allah and repent to Him.", source: "Sahih Muslim 2702" },
  { arabic: "الرَّاحِمُونَ يَرْحَمُهُمُ الرَّحْمَنُ", text: "The merciful are shown mercy by the Most Merciful.", source: "Tirmidhi 1924" },
  { arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ", text: "The best of you are those who learn the Quran and teach it.", source: "Bukhari 5027" },
  { arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", text: "Whoever relies upon Allah — He is sufficient for him.", source: "Quran 65:3" },
  { arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", text: "Indeed, Allah is with the patient ones.", source: "Quran 2:153" },
  { arabic: "ادْعُونِي أَسْتَجِبْ لَكُمْ", text: "Call upon Me; I will respond to you.", source: "Quran 40:60" },
  { arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", text: "Verily, in the remembrance of Allah do hearts find rest.", source: "Quran 13:28" },
  { arabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ", text: "When My servants ask about Me — indeed I am near.", source: "Quran 2:186" },
  { arabic: "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ", text: "If you are grateful, I will surely increase you in blessing.", source: "Quran 14:7" },
  { arabic: "رَبِّ زِدْنِي عِلْمًا", text: "My Lord, increase me in knowledge.", source: "Quran 20:114" },
  { arabic: "لَا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ", text: "There is no god but You. Glory be to You.", source: "Quran 21:87 — Dua of Yunus (AS)" },
];

function getDailyReminder() {
  const dayIndex = Math.floor(Date.now() / 86400000);
  return DAILY_REMINDERS[dayIndex % DAILY_REMINDERS.length];
}

function useServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("[SW] Registered", reg.scope))
        .catch((err) => console.warn("[SW] Failed", err));
    }
  }, []);
}

const quickLinks = [
  { href: "/qibla",               icon: Compass,           label: "Qibla",    color: "text-primary"      },
  { href: "/qurandle",            icon: Puzzle,            label: "Qurandle", color: "text-[#C9A84C]"    },
  { href: "/quran",               icon: Book,              label: "Quran",    color: "text-[#C9A84C]"    },
  { href: "/stats",               icon: BarChart3,         label: "Stats",    color: "text-primary"      },
  { href: "/quiz",                icon: HelpCircle,        label: "Quiz",     color: "text-[#2563EB]"    },
  { href: "/settings",            icon: SlidersHorizontal, label: "Settings", color: "text-muted-foreground" },
];

export default function Home() {
  useServiceWorker();

  const { data: dhikrList } = useDhikrData();
  const { isAuthenticated, user } = useAuthContext();
  const [greeting, setGreeting] = useState("Good Morning");
  const [islamicDate, setIslamicDate] = useState("");
  const [, forceUpdate] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const needsAuth = !isAuthenticated && !hasChosenGuestMode();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    try {
      const formatter = new Intl.DateTimeFormat("en-US-u-ca-islamic", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      setIslamicDate(formatter.format(new Date()));
    } catch {}
  }, []);

  const featuredDhikr = dhikrList?.[0];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      {needsAuth && (
        <AuthBanner onChoiceMade={() => forceUpdate((n) => n + 1)} />
      )}

      <div className="flex-1 px-4 pt-5 pb-8 flex flex-col space-y-4">
        <div className="flex flex-col items-center pt-2 pb-1">
          <AppLogoIcon size={56} />
          <h1 className="text-lg font-bold text-foreground mt-1.5 tracking-tight">Kun Fayakun</h1>
        </div>

        <header className="flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="arabic-text text-xl text-primary leading-tight">السلام عليكم</p>
            <h2 className="text-muted-foreground font-medium text-xs">As-salamu alaykum</h2>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              {greeting}{user?.username ? `, ${user.username}` : ""}
            </h1>
            {islamicDate && <p className="text-[#C9A84C] font-medium text-sm mt-0.5">{islamicDate}</p>}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSearch(true)}
              className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center shadow-sm"
            >
              <Search className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={() => setShowHelp(true)}
              className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center shadow-sm"
            >
              <CircleHelp className="w-4 h-4 text-muted-foreground" />
            </button>
            {!needsAuth && <CompactAuthPrompt />}
          </div>
        </header>

        <PrayerTimesCard />

        <section className="flex gap-2 overflow-x-auto scrollbar-hide py-1 -mx-1 px-1">
          {quickLinks.map((item) => (
            <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-2xl frosted-card border border-border/60 shadow-sm cursor-pointer min-w-[62px] active:scale-95 transition-transform shrink-0">
              <item.icon className={`w-5 h-5 ${item.color}`} strokeWidth={1.8} />
              <span className="text-[10px] font-semibold text-foreground/70 leading-none">{item.label}</span>
            </Link>
          ))}
        </section>

        {/* Daily Reminder Card */}
        {(() => {
          const reminder = getDailyReminder();
          return (
            <Link href="/halaltok">
              <div className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-5 shadow-md relative overflow-hidden cursor-pointer active:scale-[0.98] transition-transform">
                <div className="absolute top-3 right-4 flex items-center gap-1.5 bg-white/15 px-2.5 py-1 rounded-full">
                  <Sparkles className="w-3 h-3 text-[#C9A84C]" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">Today's Reminder</span>
                </div>
                <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
                  <Star className="w-24 h-24 text-white" />
                </div>
                <div className="mt-5 space-y-2 z-10 relative">
                  <p className="arabic-text text-2xl text-white/90 leading-relaxed">{reminder.arabic}</p>
                  <p className="text-sm font-medium text-white/80 leading-relaxed">{reminder.text}</p>
                  <p className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-wider">— {reminder.source}</p>
                </div>
                <div className="flex items-center gap-1 mt-3 z-10 relative">
                  <span className="text-xs font-bold text-white/60">Swipe more in HalalTok</span>
                  <ChevronRight className="w-3.5 h-3.5 text-white/60" />
                </div>
              </div>
            </Link>
          );
        })()}

        <section className="space-y-3">
          <h3 className="font-semibold text-foreground text-sm">Quick Duas</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/library/duas/morning" className="frosted-card rounded-2xl p-4 flex flex-col items-start gap-2.5 cursor-pointer gold-border-rounded active:scale-[0.97] transition-transform">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Sun className="w-5 h-5 text-primary" />
              </div>
              <span className="font-semibold text-sm text-foreground">Morning</span>
            </Link>
            <Link href="/library/duas/evening" className="frosted-card rounded-2xl p-4 flex flex-col items-start gap-2.5 cursor-pointer gold-border-rounded active:scale-[0.97] transition-transform">
              <div className="p-2 bg-[#C9A84C]/10 rounded-xl">
                <Sunset className="w-5 h-5 text-[#C9A84C]" />
              </div>
              <span className="font-semibold text-sm text-foreground">Evening</span>
            </Link>
            <Link href="/library/duas/after-prayer" className="frosted-card rounded-2xl p-4 flex flex-col items-start gap-2.5 cursor-pointer gold-border-rounded active:scale-[0.97] transition-transform">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Star className="w-5 h-5 text-primary" />
              </div>
              <span className="font-semibold text-sm text-foreground">After Prayer</span>
            </Link>
            <Link href="/library/duas/sleep" className="frosted-card rounded-2xl p-4 flex flex-col items-start gap-2.5 cursor-pointer gold-border-rounded active:scale-[0.97] transition-transform">
              <div className="p-2 bg-[#6B4C9A]/10 rounded-xl">
                <MoonIcon className="w-5 h-5 text-[#6B4C9A]" />
              </div>
              <span className="font-semibold text-sm text-foreground">Bedtime</span>
            </Link>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground text-sm">Islamic Videos</h3>
            <Link href="/videos" className="text-xs font-bold text-primary flex items-center gap-0.5">
              See all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <Link href="/videos" className="frosted-card rounded-2xl p-4 flex items-center gap-4 cursor-pointer gold-border-rounded active:scale-[0.98] transition-transform">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <PlayCircle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-foreground">Reminders, Hadith & Stories</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Watch curated Islamic content</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
          </Link>
        </section>

        {featuredDhikr && (
          <section className="space-y-3 pb-6">
            <h3 className="font-semibold text-foreground text-sm">Featured Dhikr</h3>
            <Link href="/dhikr" className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-5 shadow-md flex justify-between items-center text-white relative overflow-hidden cursor-pointer active:scale-[0.98] transition-transform">
              <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-4 -translate-y-4">
                <Star className="w-32 h-32" />
              </div>
              <div className="flex flex-col gap-1 z-10">
                <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">Goal: {featuredDhikr.targetCount}</span>
                <span className="text-xl font-bold arabic-text leading-relaxed">{featuredDhikr.arabic}</span>
                <span className="text-sm text-white/90">{featuredDhikr.translation}</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-card/20 flex items-center justify-center shrink-0 z-10">
                <ChevronRight className="w-5 h-5 text-white" />
              </div>
            </Link>
          </section>
        )}
      </div>

      <GlobalSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
      <HelpGuide isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}
