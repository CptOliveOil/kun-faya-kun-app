import { Link } from "wouter";
import { Compass, Star, Settings as SettingsIcon, BookOpen, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function More() {
  const menuItems = [
    { id: "qibla", title: "Qibla Compass", description: "Find the direction of the Kaaba", icon: Compass, href: "/qibla", color: "text-emerald-500", bg: "bg-emerald-50" },
    { id: "quiz", title: "Islamic Quiz", description: "Test your knowledge and earn rewards", icon: Star, href: "/quiz", color: "text-amber-500", bg: "bg-amber-50" },
    { id: "prayer-guide", title: "Prayer Guide", description: "Step-by-step guide to performing Salah", icon: BookOpen, href: "/prayers?tab=how-to-pray", color: "text-blue-500", bg: "bg-blue-50" },
    { id: "settings", title: "Settings", description: "Themes, fonts, and preferences", icon: SettingsIcon, href: "/settings", color: "text-slate-500", bg: "bg-slate-100" },
  ];

  return (
    <div className="flex-1 px-5 pt-2 pb-6 min-h-full flex flex-col bg-background">
      <header className="mb-8 z-10">
        <h1 className="text-3xl font-bold text-foreground mb-2">More</h1>
        <p className="text-muted-foreground text-sm font-medium">Explore additional features.</p>
      </header>

      <div className="grid grid-cols-1 gap-4 z-10">
        {menuItems.map((item, index) => (
          <Link key={item.id} href={item.href}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileTap={{ scale: 0.98 }}
              className="bg-card rounded-[2rem] p-5 flex items-center gap-4 shadow-sm border border-border cursor-pointer relative overflow-hidden group"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.bg}`}>
                <item.icon className={`w-7 h-7 ${item.color}`} />
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{item.description}</p>
              </div>
              
              <ChevronRight className="w-6 h-6 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
