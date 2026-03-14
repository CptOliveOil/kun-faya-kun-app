import { useState } from "react";
import { Link } from "wouter";
import { MapPin, Settings2, Minus, Plus, RefreshCw, ChevronDown } from "lucide-react";

import { PrayerManIcon, getPrayerPosition } from "./PrayerManIcon";
import { usePrayerTimes, formatTime, getTimeUntil, usePrayerCalcSettings, CALC_METHODS, ASR_METHODS } from "@/hooks/use-prayer-times";
import type { CalcMethodKey, AsrMethodKey } from "@/hooks/use-prayer-times";
import { usePrayerOffsets } from "@/hooks/use-prayer-offsets";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { usePrayersData } from "@/hooks/use-prayers";


const SALAH_ONLY = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

export function PrayerTimesCard() {
  const { offsets, updateOffset, resetOffsets } = usePrayerOffsets();
  const { calcMethod, asrMethod, updateCalcMethod, updateAsrMethod } = usePrayerCalcSettings();
  const { data, error, loading } = usePrayerTimes(offsets);
  const { data: prayerLog } = usePrayersData();
  const [showSettings, setShowSettings] = useState(false);

  const completedMap = prayerLog?.prayers as Record<string, { status: string }> | undefined;

  const completedCount = SALAH_ONLY.filter(k => completedMap?.[k]?.status === "completed").length;
  const fillPercent = Math.round((completedCount / 5) * 100);

  if (loading) {
    return (
      <div className="frosted-card rounded-3xl p-5 flex items-center justify-center h-40">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="w-5 h-5 text-muted-foreground animate-spin" />
          <p className="text-sm text-muted-foreground">Getting your location…</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="frosted-card rounded-3xl p-5 flex flex-col items-center justify-center h-32 gap-2">
        <MapPin className="w-5 h-5 text-muted-foreground" />
        <p className="text-sm text-muted-foreground text-center">{error || "Couldn't get prayer times"}</p>
        <a href="/prayers" className="text-xs text-primary font-semibold">Enable Location</a>
      </div>
    );
  }

  const nextPrayer = data.nextPrayer;

  return (
    <div className="space-y-3">
      <div className="frosted-card rounded-3xl overflow-hidden gold-border-rounded">
        <div className="px-5 pt-4 pb-2 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-foreground text-base">Prayer Times</h3>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-primary" />
              <span className="text-xs text-muted-foreground">
                {data.coords
                  ? `${data.coords.latitude.toFixed(2)}°, ${data.coords.longitude.toFixed(2)}°`
                  : "Your location"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings((s) => !s)}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                showSettings ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground hover:bg-primary/5"
              )}
            >
              <Settings2 className="w-4 h-4" />
            </button>
            <Link href="/prayers">
              <div className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm active:scale-95 transition-transform">
                Log Prayers
              </div>
            </Link>
          </div>
        </div>

        {nextPrayer && (
          <div className="mx-4 mb-3 bg-primary/10 rounded-2xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PrayerManIcon position={getPrayerPosition(nextPrayer.name)} size={40} fillPercent={fillPercent} />
              <div>
                <p className="text-xs text-muted-foreground">Next Prayer</p>
                <p className="font-bold text-foreground">{nextPrayer.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-primary">{formatTime(nextPrayer.time)}</p>
              <p className="text-xs text-muted-foreground">{getTimeUntil(nextPrayer.time)}</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {data.prayers.map((prayer) => {
          const isPast = prayer.time < new Date();
          const isNext = prayer.name === nextPrayer?.name;
          const isDone = completedMap?.[prayer.name.toLowerCase()]?.status === "completed";
          const isSalah = prayer.name !== "Sunrise";

          return (
            <motion.div
              key={prayer.name}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "frosted-card rounded-2xl p-3 flex flex-col items-center text-center relative overflow-hidden transition-all",
                isNext && "gold-border-rounded ring-1 ring-[#C9A84C]/30",
                isDone && "bg-primary/5 border-primary/20",
              )}
            >
              {isNext && (
                <div className="absolute top-1 right-1">
                  <span className="text-[8px] bg-primary text-white px-1.5 py-0.5 rounded-full font-bold">Next</span>
                </div>
              )}
              {isDone && (
                <div className="absolute top-1 right-1">
                  <span className="text-[8px] bg-primary/80 text-white px-1.5 py-0.5 rounded-full font-bold">✓</span>
                </div>
              )}
              
              <div className="mb-1.5">
                <PrayerManIcon
                  position={getPrayerPosition(prayer.name)}
                  size={34}
                  fillPercent={isDone ? 100 : 0}
                />
              </div>


              <p className={cn(
                "font-bold text-xs",
                isNext ? "text-primary" : isPast ? "text-muted-foreground" : "text-foreground"
              )}>
                {prayer.name}
              </p>
              <p className={cn(
                "font-bold text-sm tabular-nums mt-0.5",
                isNext ? "text-primary" : "text-foreground"
              )}>
                {formatTime(prayer.time)}
              </p>
              {isNext && (
                <p className="text-[9px] text-primary/70 mt-0.5">{getTimeUntil(prayer.time)}</p>
              )}
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="frosted-card rounded-2xl p-4 space-y-4 gold-border-rounded">
              <h4 className="text-sm font-bold text-foreground">Prayer Calculation Settings</h4>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase">Calculation Method</label>
                <div className="relative">
                  <select
                    value={calcMethod}
                    onChange={(e) => updateCalcMethod(e.target.value as CalcMethodKey)}
                    className="w-full py-2.5 px-3 pr-8 rounded-xl border border-border bg-card text-foreground text-sm font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {CALC_METHODS.map((m) => (
                      <option key={m.key} value={m.key}>{m.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase">Asr Method</label>
                <div className="relative">
                  <select
                    value={asrMethod}
                    onChange={(e) => updateAsrMethod(e.target.value as AsrMethodKey)}
                    className="w-full py-2.5 px-3 pr-8 rounded-xl border border-border bg-card text-foreground text-sm font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {ASR_METHODS.map((m) => (
                      <option key={m.key} value={m.key}>{m.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase">Time Adjustments</label>
                <div className="grid grid-cols-3 gap-2">
                  {data.prayers.filter(p => p.name !== "Sunrise").map((prayer) => {
                    const offsetKey = prayer.name.toLowerCase();
                    const offset = offsets[offsetKey] || 0;
                    return (
                      <div key={prayer.name} className="flex flex-col items-center gap-1 bg-muted/40 rounded-xl py-2 px-1">
                        <span className="text-[10px] font-bold text-muted-foreground">{prayer.name}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateOffset(offsetKey, -5)}
                            className="w-5 h-5 rounded-full bg-card flex items-center justify-center hover:bg-primary/10 transition-colors border border-border"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className={cn(
                            "text-[10px] font-mono w-6 text-center",
                            offset !== 0 ? "text-primary font-bold" : "text-muted-foreground"
                          )}>
                            {offset >= 0 ? `+${offset}` : offset}
                          </span>
                          <button
                            onClick={() => updateOffset(offsetKey, 5)}
                            className="w-5 h-5 rounded-full bg-card flex items-center justify-center hover:bg-primary/10 transition-colors border border-border"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={resetOffsets}
                  className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1 mx-auto mt-1"
                >
                  <RefreshCw className="w-3 h-3" /> Reset adjustments
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
