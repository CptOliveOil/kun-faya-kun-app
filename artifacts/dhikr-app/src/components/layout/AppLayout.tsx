import { ReactNode } from "react";
import React from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { HomeIcon, DhikrBeadsIcon, PrayerIcon, HalalTokIcon, QurandleIcon, LibraryBookIcon, VideoPlayIcon } from "@/components/NavIcons";
import { ChevronLeft, User } from "lucide-react";
import { haptic } from "@/lib/haptics";
import { useAuthContext } from "@/contexts/AuthContext";

interface AppLayoutProps {
  children: ReactNode;
}

interface NavItem {
  href: string;
  icon: React.ComponentType<{ active: boolean }>;
  label: string;
  center?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", icon: HomeIcon, label: "Home" },
  { href: "/dhikr", icon: DhikrBeadsIcon, label: "Dhikr" },
  { href: "/prayers", icon: PrayerIcon, label: "Prayers" },
  { href: "/halaltok", icon: HalalTokIcon, label: "HalalTok", center: true },
  { href: "/qurandle", icon: QurandleIcon, label: "Qurandle", center: true },
  { href: "/library", icon: LibraryBookIcon, label: "Library" },
  { href: "/videos", icon: VideoPlayIcon, label: "Videos" },
];

const SUB_PAGES = ["/qibla", "/quiz", "/quran", "/stats", "/more", "/prayer-settings", "/videos"];

function isSubPage(location: string): boolean {
  return SUB_PAGES.some(p => location.startsWith(p)) ||
    location.startsWith("/library/duas/") ||
    location.startsWith("/library/stories/");
}

export function AppLayout({ children }: AppLayoutProps) {
  const [location, navigate] = useLocation();
  const { isAuthenticated, user } = useAuthContext();

  const isRouteActive = (href: string) => {
    if (href === '/') return location === '/';
    return location.startsWith(href);
  };

  const showBackButton = isSubPage(location);
  const displayName = user?.username || (isAuthenticated ? "User" : null);

  return (
    <div className="min-h-screen w-full bg-muted flex items-center justify-center sm:p-4 md:p-8">
      <div
        className="relative w-full max-w-md h-[100dvh] sm:h-[850px] sm:max-h-[90vh] bg-background sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col sm:border-2 border-secondary/50 z-10"
        style={{
          paddingTop: "env(safe-area-inset-top, 0px)",
          paddingLeft: "env(safe-area-inset-left, 0px)",
          paddingRight: "env(safe-area-inset-right, 0px)",
        }}
      >
        
        <main
          className="flex-1 relative z-10 overflow-y-auto overflow-x-hidden scrollbar-hide bg-background"
          style={{ paddingBottom: "calc(4rem + 16px + env(safe-area-inset-bottom, 8px))" }}
        >
          {/* Persistent top bar — only visible when there's a back button or a signed-in username */}
          {(showBackButton || displayName) && (
            <div className="sticky top-0 left-0 right-0 z-40 px-4 pt-2 pb-1 bg-background/80 backdrop-blur-sm flex items-center justify-between min-h-[36px]">
              <div>
                {showBackButton && (
                  <button
                    onClick={() => window.history.length > 1 ? window.history.back() : navigate("/")}
                    className="flex items-center gap-1 text-primary font-semibold text-sm px-2 py-1 rounded-full"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Back
                  </button>
                )}
              </div>
              {displayName && (
                <div className="flex items-center gap-1.5">
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt="" className="w-5 h-5 rounded-full object-cover" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center">
                      <User className="w-3 h-3 text-primary" />
                    </div>
                  )}
                  <span
                    className="text-[11px] font-bold tracking-tight"
                    style={{
                      color: "#1A2420",
                      textShadow: "-0.5px -0.5px 0 #C9A84C, 0.5px -0.5px 0 #C9A84C, -0.5px 0.5px 0 #C9A84C, 0.5px 0.5px 0 #C9A84C",
                    }}
                  >
                    {displayName}
                  </span>
                </div>
              )}
            </div>
          )}
          <div className="min-h-full flex flex-col">
            {children}
          </div>
        </main>

        <nav className="absolute bottom-0 inset-x-0 z-50 bg-card border-t-2 border-secondary/40 sm:rounded-b-[2.5rem] px-1" style={{ paddingBottom: "env(safe-area-inset-bottom, 8px)" }}>
          <div className="flex items-center justify-between h-16">
            {NAV_ITEMS.map((item) => {
              const isActive = isRouteActive(item.href);
              const Icon = item.icon;
              
              return (
                <Link key={item.href} href={item.href} onClick={() => haptic("light")} className={cn(
                  "relative flex-1 flex flex-col items-center justify-center h-full tap-highlight-transparent group outline-none",
                  item.center && "mx-[-2px]"
                )}>
                  {item.center ? (
                    <div className="flex flex-col items-center justify-center gap-0 transition-transform duration-150 group-active:scale-90">
                      <div className={cn(
                        "w-11 h-11 -mt-5 rounded-2xl flex items-center justify-center shadow-lg border-2 transition-colors duration-150",
                        isActive
                          ? "bg-primary border-primary/30"
                          : "bg-gradient-to-br from-[#C9A84C] to-[#B8941F] border-[#C9A84C]/30"
                      )}>
                        <div style={{ filter: "brightness(0) invert(1)" }}>
                          <Icon active={false} />
                        </div>
                      </div>
                      <span className={cn(
                        "text-[8px] font-bold mt-0.5 transition-colors duration-150",
                        isActive ? "text-primary" : "text-secondary"
                      )}>
                        {item.label}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-0.5 transition-transform duration-150 group-active:scale-90 w-full">
                      <div className={cn(
                        "p-1 rounded-xl transition-colors duration-150",
                        isActive ? "bg-primary/10" : ""
                      )}>
                        <Icon active={isActive} />
                      </div>
                      <span className={cn(
                        "text-[9px] font-semibold transition-colors duration-150",
                        isActive ? "text-primary" : "text-secondary"
                      )}>
                        {item.label}
                      </span>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
