import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, User, X, Shield, RefreshCw, Lock } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { setGuestMode, hasChosenGuestMode } from "@/hooks/use-session";

interface AuthBannerProps {
  onChoiceMade: () => void;
}

export function AuthBanner({ onChoiceMade }: AuthBannerProps) {
  const { login, isAuthenticated } = useAuthContext();
  const [dismissed, setDismissed] = useState(false);
  const [signingIn, setSigningIn] = useState(false);

  const alreadyChosen = isAuthenticated || hasChosenGuestMode();
  if (alreadyChosen || dismissed) return null;

  function handleLogin() {
    setSigningIn(true);
    login();
  }

  function handleGuest() {
    setGuestMode();
    setDismissed(true);
    onChoiceMade();
  }

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mx-4 mt-2 mb-1"
        >
          <div className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden">
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">Welcome to Kun Fayakun</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Sign in to save your progress across devices, or continue as a guest.
              </p>

              <div className="flex gap-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><RefreshCw className="w-3 h-3" /> Sync data</span>
                <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Keep stats</span>
                <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Private</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleLogin}
                  disabled={signingIn}
                  className="flex-[2] flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-sm active:scale-95 transition-transform disabled:opacity-70"
                >
                  <LogIn className="w-4 h-4" />
                  {signingIn ? "Opening…" : "Sign In"}
                </button>
                <button
                  onClick={handleGuest}
                  className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-muted text-foreground font-semibold text-sm active:scale-95 transition-transform"
                >
                  <User className="w-4 h-4" />
                  Guest
                </button>
              </div>

              <p className="text-[10px] text-muted-foreground text-center">
                Guest data is stored only on this device.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function CompactAuthPrompt() {
  const { login, isAuthenticated, user } = useAuthContext();
  const [signingIn, setSigningIn] = useState(false);

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2 px-1">
        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
          {user?.profileImage ? (
            <img src={user.profileImage} alt="" className="w-7 h-7 rounded-full" />
          ) : (
            <User className="w-4 h-4 text-primary" />
          )}
        </div>
        <span className="text-xs font-semibold text-foreground truncate max-w-[100px]">
          {user?.username || "Signed In"}
        </span>
      </div>
    );
  }

  return (
    <button
      onClick={() => { setSigningIn(true); login(); }}
      disabled={signingIn}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold active:scale-95 transition-transform"
    >
      <LogIn className="w-3.5 h-3.5" />
      {signingIn ? "…" : "Sign In"}
    </button>
  );
}
