import { useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { setGuestMode } from "@/hooks/use-session";
import { motion } from "framer-motion";
import { HolyMosquesIcon } from "@/components/HolyMosquesIcon";

interface WelcomeProps {
  onGuest: () => void;
}

export default function Welcome({ onGuest }: WelcomeProps) {
  const { login, isLoading } = useAuthContext();
  const [signingIn, setSigningIn] = useState(false);

  function handleLogin() {
    setSigningIn(true);
    login();
  }

  function handleGuest() {
    setGuestMode();
    onGuest();
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm flex flex-col items-center text-center gap-6"
      >
        {/* Logo / Icon */}
        <div className="w-24 h-24 rounded-[2rem] bg-primary/10 flex items-center justify-center shadow-lg">
          <HolyMosquesIcon size={56} />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Kun Fayakun</h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Your personal companion for dhikr, prayer tracking, and Islamic knowledge.
          </p>
        </div>

        {/* Arabic greeting */}
        <p className="arabic-text text-2xl text-primary opacity-80">
          بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
        </p>

        {/* Auth options */}
        <div className="w-full space-y-3 mt-2">
          <button
            onClick={handleLogin}
            disabled={signingIn || isLoading}
            className="w-full py-4 rounded-full bg-primary text-white font-bold text-base shadow-md active:scale-95 transition-transform disabled:opacity-70"
          >
            {signingIn ? "Opening sign-in…" : "Sign in / Create account"}
          </button>

          <button
            onClick={handleGuest}
            className="w-full py-4 rounded-full bg-card border border-border text-foreground font-semibold text-base active:scale-95 transition-transform"
          >
            Continue as Guest
          </button>
        </div>

        {/* Benefits list */}
        <div className="w-full bg-card rounded-[1.5rem] p-5 border border-border text-left space-y-3 mt-2">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">With an account you get</p>
          {[
            { icon: "🔄", text: "Your progress saved across all devices" },
            { icon: "📊", text: "Prayer & Quran stats preserved forever" },
            { icon: "🔒", text: "Private, secure — only you see your data" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-3">
              <span className="text-xl">{item.icon}</span>
              <p className="text-sm text-foreground">{item.text}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          Guest data is stored only on this device.
        </p>
      </motion.div>
    </div>
  );
}
