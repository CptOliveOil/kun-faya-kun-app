import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Globe, Sunrise, Sunset, MoonStar, Star, Clock, CheckCircle, Activity, Award, Send,
  BookOpen, BookHeart, Sparkles, Repeat, Crown, AlarmClock, CloudMoon, Shirt, Droplets,
  Utensils, Home, Building, Compass, Users, HeartHandshake, Shield, Landmark, Plane,
  Coins, MessageCircle, Heart, Feather, Leaf,
} from "lucide-react";
import { useDuaCategories, useDuasByCategory } from "@/hooks/use-duas";
import { useStoryCategories } from "@/hooks/use-stories";
import { Input } from "@/components/ui/input";
import { SlideUpPanel } from "@/components/SlideUpPanel";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, any> = {
  globe: Globe, sunrise: Sunrise, sunset: Sunset, "moon-star": MoonStar, star: Star,
  clock: Clock, "check-circle": CheckCircle, activity: Activity, award: Award, send: Send,
  "book-open": BookOpen, "book-heart": BookHeart, sparkles: Sparkles, repeat: Repeat,
  crown: Crown, "alarm-clock": AlarmClock, "cloud-moon": CloudMoon, shirt: Shirt,
  droplets: Droplets, utensils: Utensils, home: Home, building: Building, compass: Compass,
  users: Users, "heart-handshake": HeartHandshake, shield: Shield, landmark: Landmark,
  plane: Plane, coins: Coins, "message-circle": MessageCircle, heart: Heart, feather: Feather,
  leaf: Leaf,
};

function CategoryIcon({ icon, color, size = 20 }: { icon: string; color: string; size?: number }) {
  const IconComponent = ICON_MAP[icon];
  if (!IconComponent) return <BookOpen style={{ color }} className="w-5 h-5" />;
  return <IconComponent style={{ color }} width={size} height={size} strokeWidth={1.8} />;
}

function DuaPanelContent({ categoryId, categoryName }: { categoryId: string; categoryName: string }) {
  const { data: duas, isLoading } = useDuasByCategory(categoryId);

  if (isLoading) return <div className="py-10 text-center text-muted-foreground text-sm">Loading...</div>;

  if (!duas?.length) {
    return <div className="py-10 text-center text-muted-foreground text-sm">No duas found in this category.</div>;
  }

  return (
    <div className="space-y-4 pt-2">
      {duas.map((dua: any, index: number) => (
        <motion.div
          key={dua.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.06 }}
          className="frosted-card rounded-2xl p-5 space-y-4 gold-border-rounded"
        >
          <span className="px-2.5 py-1 bg-secondary/10 text-secondary text-[10px] font-bold rounded-full border border-secondary/20">
            {dua.reference}
          </span>
          <p className="text-2xl leading-[2.2] arabic-text text-foreground text-right">{dua.arabic}</p>
          <p className="text-sm text-primary font-medium italic">{dua.transliteration}</p>
          <div className="h-px bg-border" />
          <p className="text-xs text-muted-foreground leading-relaxed">{dua.translation}</p>
        </motion.div>
      ))}
    </div>
  );
}

export default function Library() {
  const [activeTab, setActiveTab] = useState<"duas" | "stories">("duas");
  const [duaGroup, setDuaGroup] = useState<"main" | "other">("main");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<{ id: string; name: string } | null>(null);

  const { data: duaCategories, isLoading: duasLoading } = useDuaCategories();
  const { data: storyCategories, isLoading: storiesLoading } = useStoryCategories();

  const dCategories = duaCategories?.length ? duaCategories : [];
  const sCategories = storyCategories?.length ? storyCategories : [
    { id: "prophets", name: "Prophets", icon: "star", description: "Lives and miracles", color: "#C9A84C", storyCount: 5 },
    { id: "companions", name: "Companions", icon: "users", description: "The Sahabah", color: "#7CB99E", storyCount: 4 },
    { id: "hadith-gems", name: "Hadith Gems", icon: "sparkles", description: "Wisdom & teachings", color: "#9B8EC4", storyCount: 5 },
    { id: "quran-stories", name: "Quran Stories", icon: "book-open", description: "Narratives from Quran", color: "#5B8DB8", storyCount: 4 },
  ];

  const filteredDuas = dCategories
    .filter((c: any) => c.group === duaGroup || !c.group)
    .filter((c: any) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase())
    );

  const filteredStories = sCategories.filter((c: any) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 px-5 pt-12 pb-6 min-h-full flex flex-col bg-background">
      <header className="mb-5 z-10">
        <h1 className="text-2xl font-bold text-foreground">Duas</h1>
        <p className="text-muted-foreground text-xs mt-1">Supplications & Remembrance</p>
      </header>

      <div className="flex p-1 bg-muted rounded-full mb-4 z-10 shadow-inner">
        <button
          onClick={() => setActiveTab("duas")}
          className={cn("flex-1 py-2 text-xs font-bold rounded-full transition-all", activeTab === "duas" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground")}
        >
          Duas & Adhkar
        </button>
        <button
          onClick={() => setActiveTab("stories")}
          className={cn("flex-1 py-2 text-xs font-bold rounded-full transition-all", activeTab === "stories" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground")}
        >
          Islamic Stories
        </button>
      </div>

      {activeTab === "duas" && (
        <div className="flex p-0.5 bg-muted/60 rounded-full mb-4 z-10 w-fit mx-auto">
          <button
            onClick={() => setDuaGroup("main")}
            className={cn("px-4 py-1.5 text-[10px] font-bold rounded-full transition-all", duaGroup === "main" ? "bg-primary text-white shadow-sm" : "text-muted-foreground")}
          >
            Main
          </button>
          <button
            onClick={() => setDuaGroup("other")}
            className={cn("px-4 py-1.5 text-[10px] font-bold rounded-full transition-all", duaGroup === "other" ? "bg-primary text-white shadow-sm" : "text-muted-foreground")}
          >
            Other
          </button>
        </div>
      )}

      <div className="relative mb-4 z-10">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <Input
          type="text"
          placeholder={`Search ${activeTab}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-10 bg-card rounded-full border-border shadow-sm text-sm focus-visible:ring-primary/20"
        />
      </div>

      <div className="flex-1 z-10 pb-12">
        <AnimatePresence mode="wait">
          {activeTab === "duas" ? (
            <motion.div
              key={`duas-${duaGroup}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 gap-3"
            >
              {filteredDuas.map((cat: any, index: number) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedCategory({ id: cat.id, name: cat.name })}
                  className="frosted-card rounded-2xl p-4 flex flex-col gap-2.5 cursor-pointer relative overflow-hidden group h-full gold-border-rounded"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-muted/60">
                    <CategoryIcon icon={cat.icon} color={cat.color} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-foreground leading-tight">{cat.name}</h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{cat.description}</p>
                  </div>
                  <span className="text-[9px] font-bold text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full w-fit">
                    {cat.duaCount} duas
                  </span>
                </motion.div>
              ))}
              {filteredDuas.length === 0 && !duasLoading && (
                <div className="col-span-full py-10 text-center text-muted-foreground text-sm">No categories found.</div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="stories"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 gap-3"
            >
              {filteredStories.map((cat: any, index: number) => (
                <Link key={cat.id} href={`/library/stories/${cat.id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-card rounded-2xl p-4 flex flex-col items-center text-center gap-3 shadow-sm border border-border cursor-pointer relative overflow-hidden"
                  >
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{ background: `radial-gradient(circle at top right, ${cat.color}, transparent 70%)` }}
                    />
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-card shadow-sm border border-border relative z-10">
                      <CategoryIcon icon={cat.icon} color={cat.color} size={22} />
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-xs font-bold text-foreground">{cat.name}</h3>
                      <div className="mt-1.5 inline-block px-2 py-0.5 rounded-md bg-muted text-[9px] font-bold text-muted-foreground">
                        {cat.storyCount} Stories
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
              {filteredStories.length === 0 && !storiesLoading && (
                <div className="col-span-full py-10 text-center text-muted-foreground text-sm">No categories found.</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <SlideUpPanel
        isOpen={!!selectedCategory}
        onClose={() => setSelectedCategory(null)}
        title={selectedCategory ? `${selectedCategory.name} Duas` : ""}
        showBack
      >
        {selectedCategory && (
          <DuaPanelContent categoryId={selectedCategory.id} categoryName={selectedCategory.name} />
        )}
      </SlideUpPanel>
    </div>
  );
}
