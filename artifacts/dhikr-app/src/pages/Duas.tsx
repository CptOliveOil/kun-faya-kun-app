import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Search, ChevronRight } from "lucide-react";
import { useDuaCategories } from "@/hooks/use-duas";
import { Input } from "@/components/ui/input";

export default function Duas() {
  const { data: categories, isLoading } = useDuaCategories();
  const [search, setSearch] = useState("");

  if (isLoading) {
    return <div className="p-8 text-center text-primary mt-20">Loading Duas...</div>;
  }

  // Fallback data if API returns empty
  const defaultCategories = categories?.length ? categories : [
    { id: "morning", name: "Morning", icon: "🌅", description: "Start your day with remembrance", color: "#4F8D73", duaCount: 15 },
    { id: "evening", name: "Evening", icon: "🌇", description: "End your day with protection", color: "#D98A53", duaCount: 12 },
    { id: "prayer", name: "After Prayer", icon: "📿", description: "Adhkar after obligatory prayers", color: "#5873B1", duaCount: 8 },
    { id: "sleep", name: "Sleep", icon: "😴", description: "Before falling asleep", color: "#82559E", duaCount: 6 },
    { id: "travel", name: "Travel", icon: "✈️", description: "Supplications for safe journey", color: "#D9A05B", duaCount: 4 },
    { id: "protection", name: "Protection", icon: "🛡️", description: "Seeking refuge in Allah", color: "#A84C4C", duaCount: 10 },
  ];

  const filteredCategories = defaultCategories.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 px-5 pt-2 pb-6 min-h-full flex flex-col bg-background">
      <header className="mb-6 z-10">
        <h1 className="text-3xl font-bold text-foreground mb-2">Duas & Adhkar</h1>
        <p className="text-muted-foreground text-sm font-medium">Find peace in remembrance.</p>
      </header>

      <div className="relative mb-8 z-10">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <Input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-11 h-12 bg-card rounded-full border-border shadow-sm text-base focus-visible:ring-primary/20"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-12 z-10">
        {filteredCategories.map((cat, index) => (
          <Link key={cat.id} href={`/duas/${cat.id}`}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileTap={{ scale: 0.98 }}
              className="bg-card rounded-3xl p-5 flex flex-col gap-3 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-border cursor-pointer relative overflow-hidden group"
            >
              {/* Colored side indicator */}
              <div 
                className="absolute left-0 top-0 bottom-0 w-1.5 opacity-80" 
                style={{ backgroundColor: cat.color }} 
              />
              
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-slate-50 border border-slate-100">
                  {cat.icon}
                </div>
                <div className="px-2.5 py-1 rounded-full bg-slate-50 text-xs font-semibold text-muted-foreground">
                  {cat.duaCount} Duas
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-foreground">{cat.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{cat.description}</p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
      
      {filteredCategories.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          No categories found.
        </div>
      )}
    </div>
  );
}
