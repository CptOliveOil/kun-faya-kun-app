import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  Search, X, Home, Moon, BookOpen, PlayCircle, BarChart3, Compass,
  HelpCircle, Settings, Book, Clock, Star, Heart, Award, Mic,
  BookHeart, Users, Shield, Landmark, Plane, Coins, Shirt, Droplets,
  Utensils, Building, Send, MessageCircle, Leaf, Feather,
  Sunrise, Sunset, Activity, CheckCircle, Crown, AlarmClock, CloudMoon,
  Sparkles, Repeat, Globe, ChevronRight
} from "lucide-react";
import { SlideUpPanel } from "./SlideUpPanel";

interface SearchItem {
  label: string;
  description: string;
  href: string;
  icon: any;
  category: string;
}

const SEARCH_ITEMS: SearchItem[] = [
  { label: "Home", description: "Main dashboard", href: "/", icon: Home, category: "Pages" },
  { label: "Dhikr Counter", description: "Count your dhikr with tasbeeh", href: "/dhikr", icon: Star, category: "Pages" },
  { label: "Prayers", description: "Log daily salah", href: "/prayers", icon: Moon, category: "Pages" },
  { label: "Prayer Stats", description: "Weekly and monthly prayer stats", href: "/prayers?tab=stats", icon: BarChart3, category: "Pages" },
  { label: "How to Pray", description: "Step-by-step salah guide", href: "/prayers?tab=how-to-pray", icon: BookOpen, category: "Pages" },
  { label: "Duas Library", description: "33 categories of supplications", href: "/library", icon: BookOpen, category: "Pages" },
  { label: "Videos", description: "Islamic video content", href: "/videos", icon: PlayCircle, category: "Pages" },
  { label: "Stats Dashboard", description: "Track your spiritual progress", href: "/stats", icon: BarChart3, category: "Pages" },
  { label: "Qibla Compass", description: "Find the direction of Makkah", href: "/qibla", icon: Compass, category: "Pages" },
  { label: "Quran Tracker", description: "Log reading and memorisation", href: "/quran", icon: Book, category: "Pages" },
  { label: "Islamic Quiz", description: "Test your knowledge", href: "/quiz", icon: HelpCircle, category: "Pages" },
  { label: "Settings", description: "Themes, preferences", href: "/settings", icon: Settings, category: "Pages" },

  { label: "Morning Adhkar", description: "Start your day with remembrance", href: "/library", icon: Sunrise, category: "Duas" },
  { label: "Evening Adhkar", description: "Evening supplications", href: "/library", icon: Sunset, category: "Duas" },
  { label: "Before Sleep", description: "Bedtime duas for protection", href: "/library", icon: CloudMoon, category: "Duas" },
  { label: "After Prayer", description: "Post-salah supplications", href: "/library", icon: Star, category: "Duas" },
  { label: "Du'as for the Ummah", description: "Supplications for the Muslim community", href: "/library", icon: Globe, category: "Duas" },
  { label: "Travel Duas", description: "Supplications for journeys", href: "/library", icon: Plane, category: "Duas" },
  { label: "Food & Drink", description: "Before and after eating", href: "/library", icon: Utensils, category: "Duas" },
  { label: "Protection", description: "Shield from harm and evil", href: "/library", icon: Shield, category: "Duas" },
  { label: "Ruqyah & Illness", description: "Healing supplications", href: "/library", icon: Activity, category: "Duas" },
  { label: "Hajj & Umrah", description: "Pilgrimage duas", href: "/library", icon: Landmark, category: "Duas" },

  { label: "Fajr", description: "Dawn prayer", href: "/prayers", icon: Sunrise, category: "Prayers" },
  { label: "Dhuhr", description: "Midday prayer", href: "/prayers", icon: Clock, category: "Prayers" },
  { label: "Asr", description: "Afternoon prayer", href: "/prayers", icon: Clock, category: "Prayers" },
  { label: "Maghrib", description: "Sunset prayer", href: "/prayers", icon: Sunset, category: "Prayers" },
  { label: "Isha", description: "Night prayer", href: "/prayers", icon: Moon, category: "Prayers" },
];

export function GlobalSearch({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [, navigate] = useLocation();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return SEARCH_ITEMS.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [query]);

  const grouped = useMemo(() => {
    const groups: Record<string, SearchItem[]> = {};
    for (const item of results) {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    }
    return groups;
  }, [results]);

  function handleSelect(item: SearchItem) {
    navigate(item.href);
    setQuery("");
    onClose();
  }

  return (
    <SlideUpPanel isOpen={isOpen} onClose={onClose} title="Search">
      <div className="space-y-4 pt-1">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search pages, duas, prayers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full pl-10 pr-10 py-3 rounded-2xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {!query.trim() && (
          <div className="space-y-3 pt-2">
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Quick Access</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Duas", href: "/library", icon: BookOpen },
                { label: "Prayers", href: "/prayers", icon: Moon },
                { label: "Qibla", href: "/qibla", icon: Compass },
                { label: "Videos", href: "/videos", icon: PlayCircle },
                { label: "Stats", href: "/stats", icon: BarChart3 },
                { label: "Quiz", href: "/quiz", icon: HelpCircle },
              ].map((item) => (
                <button
                  key={item.href}
                  onClick={() => { navigate(item.href); onClose(); }}
                  className="frosted-card rounded-xl p-3 flex items-center gap-3 text-left"
                >
                  <item.icon className="w-4 h-4 text-primary" strokeWidth={1.8} />
                  <span className="text-sm font-semibold text-foreground">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {query.trim() && results.length === 0 && (
          <div className="py-10 text-center text-muted-foreground text-sm">
            No results for "{query}"
          </div>
        )}

        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="space-y-1.5">
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider px-1">{category}</p>
            {items.map((item) => (
              <button
                key={item.label + item.href}
                onClick={() => handleSelect(item)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/60 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-4 h-4 text-primary" strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{item.label}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{item.description}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/50 shrink-0" />
              </button>
            ))}
          </div>
        ))}
      </div>
    </SlideUpPanel>
  );
}
