import { useTheme, THEMES, LANGUAGES } from "@/contexts/ThemeContext";
import { Check, User, LogOut, LogIn, Globe, Type, Eye, Clock, ChevronRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useAuthContext } from "@/contexts/AuthContext";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export default function Settings() {
  const { theme, setTheme, fontSize, setFontSize, highContrast, setHighContrast, alwaysShowArabic, setAlwaysShowArabic, language, setLanguage } = useTheme();
  const { user, isAuthenticated, login, logout } = useAuthContext();

  const themeOptions = [
    { id: "sage",     name: "Sage",     color: "#7CB99E" },
    { id: "purple",   name: "Purple",   color: "#7C5CBF" },
    { id: "ocean",    name: "Ocean",    color: "#2E86AB" },
    { id: "rose",     name: "Rose",     color: "#D4737A" },
    { id: "forest",   name: "Forest",   color: "#1E3027" },
    { id: "sand",     name: "Sand",     color: "#B8860B" },
    { id: "teal",     name: "Teal",     color: "#2A9D8F" },
    { id: "midnight", name: "Midnight", color: "#2B4C8C" },
    { id: "olive",    name: "Olive",    color: "#5A7A35" },
    { id: "maroon",   name: "Maroon",   color: "#8B2635" },
    { id: "amber",    name: "Amber",    color: "#C07020" },
    { id: "slate",    name: "Slate",    color: "#4A5F75" },
  ];

  const fontSizes = [
    { id: "normal" as const, label: "Normal", sample: "Aa" },
    { id: "large" as const, label: "Large", sample: "Aa" },
    { id: "extra-large" as const, label: "Extra Large", sample: "Aa" },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      <header className="px-5 pt-6 pb-3 border-b border-border">
        <h1 className="text-xl font-bold text-foreground">Settings</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-5 space-y-8 pb-24">
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Appearance</h2>
          
          <div className="bg-card rounded-[2rem] p-5 shadow-sm border border-border">
            <h3 className="font-bold text-foreground mb-4">Color Theme</h3>
            <div className="grid grid-cols-3 gap-4">
              {themeOptions.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id as any)}
                  className="flex flex-col items-center gap-2 group outline-none"
                >
                  <div 
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform group-active:scale-95 ${theme === t.id ? 'ring-4 ring-offset-2 ring-primary' : 'ring-1 ring-border shadow-sm'}`}
                    style={{ backgroundColor: t.color }}
                  >
                    {theme === t.id && <Check className="w-6 h-6 text-white" />}
                  </div>
                  <span className={`text-xs font-semibold ${theme === t.id ? 'text-primary' : 'text-muted-foreground'}`}>
                    {t.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4" /> Language
          </h2>
          <div className="bg-card rounded-[2rem] p-5 shadow-sm border border-border">
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(LANGUAGES) as [string, string][]).map(([code, name]) => (
                <button
                  key={code}
                  onClick={() => setLanguage(code as any)}
                  className={cn(
                    "px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left",
                    language === code
                      ? "bg-primary text-white shadow-sm"
                      : "bg-muted/50 text-foreground hover:bg-muted"
                  )}
                >
                  {name}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground mt-3">Interface language for menus and labels. Arabic text in duas is always available.</p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Type className="w-4 h-4" /> Text Size
          </h2>
          <div className="bg-card rounded-[2rem] p-5 shadow-sm border border-border">
            <div className="flex gap-3">
              {fontSizes.map((fs) => (
                <button
                  key={fs.id}
                  onClick={() => setFontSize(fs.id)}
                  className={cn(
                    "flex-1 py-4 rounded-xl flex flex-col items-center gap-2 transition-all",
                    fontSize === fs.id
                      ? "bg-primary text-white shadow-sm"
                      : "bg-muted/50 text-foreground hover:bg-muted"
                  )}
                >
                  <span className={cn(
                    "font-bold",
                    fs.id === "normal" && "text-base",
                    fs.id === "large" && "text-lg",
                    fs.id === "extra-large" && "text-xl",
                  )}>
                    {fs.sample}
                  </span>
                  <span className="text-[10px] font-semibold opacity-80">{fs.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Eye className="w-4 h-4" /> Accessibility
          </h2>
          
          <div className="bg-card rounded-[2rem] overflow-hidden shadow-sm border border-border">
            <div className="p-5 flex items-center justify-between border-b border-border">
              <div>
                <h3 className="font-bold text-foreground">High Contrast</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Bolder text and stronger colors</p>
              </div>
              <Switch checked={highContrast} onCheckedChange={setHighContrast} />
            </div>
            
            <div className="p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-foreground">Always Show Arabic</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Display Arabic text in duas and lessons</p>
              </div>
              <Switch checked={alwaysShowArabic} onCheckedChange={setAlwaysShowArabic} />
            </div>
          </div>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4" /> Prayer Times
          </h2>
          <Link href="/prayer-settings">
            <div className="bg-card rounded-[2rem] p-5 shadow-sm border border-border flex items-center justify-between cursor-pointer hover:bg-primary/5 active:scale-[0.98] transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Prayer Time Settings</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">Location, calculation method, mosque timetable</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Link>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Account</h2>
          
          <div className="bg-card rounded-[2rem] overflow-hidden shadow-sm border border-border">
            {isAuthenticated && user ? (
              <>
                <div className="p-5 flex items-center gap-4 border-b border-border">
                  {user.profileImageUrl ? (
                    <img src={user.profileImageUrl} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground truncate">
                      {[user.firstName, user.lastName].filter(Boolean).join(" ") || "Anonymous"}
                    </p>
                    {user.email && (
                      <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                    )}
                    <p className="text-xs text-primary mt-0.5 font-medium">Signed in — data saved to your account</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="w-full p-5 flex items-center gap-3 text-left hover:bg-black/5 transition-colors active:scale-[0.98]"
                >
                  <LogOut className="w-5 h-5 text-red-500" />
                  <span className="font-semibold text-red-500">Sign out</span>
                </button>
              </>
            ) : (
              <>
                <div className="p-5 flex items-center gap-4 border-b border-border">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <User className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Guest</p>
                    <p className="text-sm text-muted-foreground">Data saved on this device only</p>
                  </div>
                </div>
                <button
                  onClick={login}
                  className="w-full p-5 flex items-center gap-3 text-left hover:bg-black/5 transition-colors active:scale-[0.98]"
                >
                  <LogIn className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold text-primary">Sign in / Create account</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Sync your progress across all devices</p>
                  </div>
                </button>
              </>
            )}
          </div>
        </section>

        <section className="space-y-4 pt-4">
          <div className="text-center text-muted-foreground">
            <p className="text-sm font-bold mb-1">Kun Fayakun</p>
            <p className="text-xs">Version 2.0.0</p>
          </div>
        </section>
      </div>
    </div>
  );
}
