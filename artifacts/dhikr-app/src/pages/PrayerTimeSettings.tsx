import { useState, useEffect, useRef } from "react";
import { MapPin, Calculator, SlidersHorizontal, CalendarDays, ChevronDown, RefreshCw, Minus, Plus, Clock, Building2, Info, Upload, X, CheckCircle } from "lucide-react";
import { usePrayerCalcSettings, CALC_METHODS, ASR_METHODS, usePrayerTimes, formatTime } from "@/hooks/use-prayer-times";
import { usePrayerOffsets } from "@/hooks/use-prayer-offsets";
import type { CalcMethodKey, AsrMethodKey } from "@/hooks/use-prayer-times";
import { cn } from "@/lib/utils";

const HIGH_LAT_RULES = [
  { key: "Recommended", label: "Recommended (auto)", desc: "Automatically selects the best rule based on your location." },
  { key: "MiddleOfTheNight", label: "Middle of the Night", desc: "Fajr/Isha split the night evenly. Used in some high-latitude regions." },
  { key: "SeventhOfTheNight", label: "Seventh of the Night", desc: "Fajr/Isha calculated as 1/7 of the night. Common in Scandinavia." },
  { key: "TwilightAngle", label: "Twilight Angle", desc: "Use the twilight angle directly. Best when twilight lasts all night." },
  { key: "None", label: "None", desc: "No high latitude adjustment. Use in countries near the equator." },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const PRAYERS_LIST = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

function SelectField({ label, value, onChange, options, helpText }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { key: string; label: string; desc?: string }[];
  helpText?: string;
}) {
  const selected = options.find(o => o.key === value);
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-foreground">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full py-3.5 px-4 pr-10 rounded-2xl border border-border bg-card text-foreground text-sm font-semibold appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary shadow-sm"
        >
          {options.map(o => (
            <option key={o.key} value={o.key}>{o.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      </div>
      {(selected?.desc || helpText) && (
        <p className="text-xs text-muted-foreground leading-relaxed px-1 flex gap-1.5">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary/60" />
          {selected?.desc || helpText}
        </p>
      )}
    </div>
  );
}

function LocationTab({ data, loading, error }: { data: any; loading: boolean; error: string | null }) {
  return (
    <div className="space-y-4">
      <div className="bg-card rounded-3xl p-5 border border-border shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">Your Location</h3>
            <p className="text-xs text-muted-foreground">Used to calculate accurate prayer times</p>
          </div>
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground py-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span className="text-sm">Getting your location…</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700">
            <p className="font-bold mb-1">Location access denied</p>
            <p className="text-xs leading-relaxed">{error}</p>
            <p className="text-xs mt-2 text-red-600">To fix this: go to your browser settings → Site Permissions → Location → Allow for this site.</p>
          </div>
        )}

        {data?.coords && !loading && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/40 rounded-2xl p-4 text-center">
                <p className="text-xs text-muted-foreground font-bold uppercase mb-1">Latitude</p>
                <p className="text-xl font-bold text-foreground tabular-nums">{data.coords.latitude.toFixed(4)}°</p>
                <p className="text-xs text-muted-foreground">{data.coords.latitude >= 0 ? "North" : "South"}</p>
              </div>
              <div className="bg-muted/40 rounded-2xl p-4 text-center">
                <p className="text-xs text-muted-foreground font-bold uppercase mb-1">Longitude</p>
                <p className="text-xl font-bold text-foreground tabular-nums">{data.coords.longitude.toFixed(4)}°</p>
                <p className="text-xs text-muted-foreground">{data.coords.longitude >= 0 ? "East" : "West"}</p>
              </div>
            </div>
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              <p className="text-xs text-primary font-medium">Location is automatically detected. Prayer times update when you open the app.</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-card rounded-3xl p-5 border border-border shadow-sm">
        <h3 className="font-bold text-foreground mb-1">Location Privacy</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">Your location is used only to calculate prayer times. It is never stored on any server — all calculations happen on your device.</p>
      </div>
    </div>
  );
}

function CalculationTab() {
  const { calcMethod, asrMethod, updateCalcMethod, updateAsrMethod } = usePrayerCalcSettings();
  const [highLat, setHighLat] = useState(() => localStorage.getItem("dhikr_high_lat") || "Recommended");
  const [jumuahOffset, setJumuahOffset] = useState(() => parseInt(localStorage.getItem("dhikr_jumuah_offset") || "45"));

  const updateHighLat = (v: string) => {
    setHighLat(v);
    localStorage.setItem("dhikr_high_lat", v);
  };

  const updateJumuah = (delta: number) => {
    const next = Math.max(0, Math.min(120, jumuahOffset + delta));
    setJumuahOffset(next);
    localStorage.setItem("dhikr_jumuah_offset", String(next));
  };

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-3xl p-5 border border-border shadow-sm space-y-5">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">Calculation Method</h3>
            <p className="text-xs text-muted-foreground">Select the authority used in your region</p>
          </div>
        </div>

        <SelectField
          label="Calculation Method"
          value={calcMethod}
          onChange={v => updateCalcMethod(v as CalcMethodKey)}
          options={CALC_METHODS.map(m => ({
            key: m.key,
            label: m.label,
            desc: getMethodDescription(m.key),
          }))}
        />

        <SelectField
          label="Madhab (Asr Time)"
          value={asrMethod}
          onChange={v => updateAsrMethod(v as AsrMethodKey)}
          options={[
            { key: "Standard", label: "Shafi / Maliki / Hanbali — standard shadow length", desc: "Standard Asr time when an object's shadow equals its length. Used by Shafi, Maliki, and Hanbali schools." },
            { key: "Hanafi", label: "Hanafi — double shadow length", desc: "Hanafi Asr is when an object's shadow is twice its length. Can be 60–90 minutes later than Shafi." },
          ]}
        />

        <SelectField
          label="High Latitude Rule"
          value={highLat}
          onChange={updateHighLat}
          options={HIGH_LAT_RULES}
        />
      </div>

      <div className="bg-card rounded-3xl p-5 border border-border shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-secondary/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">Jumu'ah Time</h3>
            <p className="text-xs text-muted-foreground">Offset from Dhuhr adhan at your mosque</p>
          </div>
        </div>

        <div className="bg-secondary/5 border border-secondary/20 rounded-2xl p-4 mb-4">
          <p className="text-xs text-secondary font-medium leading-relaxed">Jumu'ah (Friday prayer) typically starts a set number of minutes after the Dhuhr adhan. Set this to match your local mosque's schedule.</p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => updateJumuah(-5)}
            className="w-11 h-11 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 active:scale-95 transition-all border border-border"
          >
            <Minus className="w-4 h-4" />
          </button>
          <div className="flex-1 text-center">
            <p className="text-3xl font-bold text-foreground tabular-nums">{jumuahOffset}</p>
            <p className="text-xs text-muted-foreground">minutes after Dhuhr adhan</p>
          </div>
          <button
            onClick={() => updateJumuah(5)}
            className="w-11 h-11 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 active:scale-95 transition-all border border-border"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function AdjustmentsTab({ data }: { data: any }) {
  const { offsets, updateOffset, resetOffsets } = usePrayerOffsets();
  const adjustPrayers = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-3xl p-5 border border-border shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
            <SlidersHorizontal className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">Time Adjustments</h3>
            <p className="text-xs text-muted-foreground">Fine-tune each prayer by ±minutes</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 mb-5 flex gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 leading-relaxed">Use these to match your local mosque's timetable. Adjustments apply in addition to the calculation method.</p>
        </div>

        <div className="space-y-4">
          {adjustPrayers.map(key => {
            const offset = offsets[key] || 0;
            const displayName = key.charAt(0).toUpperCase() + key.slice(1);
            const prayerTime = data?.prayers?.find((p: any) => p.name.toLowerCase() === key || p.key === key);

            return (
              <div key={key} className="flex items-center gap-4">
                <div className="w-20 shrink-0">
                  <p className="font-bold text-sm text-foreground">{displayName}</p>
                  {prayerTime && (
                    <p className="text-xs text-muted-foreground tabular-nums">{formatTime(prayerTime.time)}</p>
                  )}
                </div>
                <div className="flex-1 flex items-center gap-3">
                  <button
                    onClick={() => updateOffset(key, -5)}
                    className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 active:scale-95 transition-all border border-border shrink-0"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex-1 text-center">
                    <span className={cn(
                      "text-lg font-bold tabular-nums",
                      offset !== 0 ? "text-primary" : "text-muted-foreground"
                    )}>
                      {offset >= 0 ? `+${offset}` : offset} min
                    </span>
                  </div>
                  <button
                    onClick={() => updateOffset(key, 5)}
                    className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 active:scale-95 transition-all border border-border shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={resetOffsets}
          className="mt-5 w-full py-3 rounded-2xl border border-border text-muted-foreground text-sm font-semibold flex items-center justify-center gap-2 hover:bg-muted/50 active:scale-95 transition-all"
        >
          <RefreshCw className="w-4 h-4" /> Reset all adjustments
        </button>
      </div>
    </div>
  );
}

function TimetableTab({ data, loading }: { data: any; loading: boolean }) {
  const [mosqueMode, setMosqueMode] = useState(false);
  const [mosqueTimes, setMosqueTimes] = useState<Record<string, Record<string, string>>>(() => {
    try {
      return JSON.parse(localStorage.getItem("dhikr_mosque_timetable") || "{}");
    } catch { return {}; }
  });
  const [csvStatus, setCsvStatus] = useState<"idle" | "success" | "error">("idle");
  const [csvMsg, setCsvMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const saveMosqueTime = (day: string, prayer: string, value: string) => {
    const updated = { ...mosqueTimes, [day]: { ...(mosqueTimes[day] || {}), [prayer]: value } };
    setMosqueTimes(updated);
    localStorage.setItem("dhikr_mosque_timetable", JSON.stringify(updated));
  };

  const clearAll = () => {
    setMosqueTimes({});
    localStorage.removeItem("dhikr_mosque_timetable");
    setCsvStatus("idle");
  };

  const handleCsvUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.trim().split(/\r?\n/).filter(l => l.trim());
        if (lines.length < 2) throw new Error("File appears empty");

        // Parse header row — expect: Prayer, Mon, Tue, Wed, Thu, Fri, Sat, Sun
        // or possibly just time columns without a header
        const headerCells = lines[0].split(/[,\t;]/).map(c => c.trim());
        const dataStartRow = headerCells[0].toLowerCase().includes("prayer") || headerCells[0].toLowerCase() === "" ? 1 : 0;
        const dayHeaders = dataStartRow === 1 ? headerCells.slice(1) : DAYS;

        const updated: Record<string, Record<string, string>> = {};

        for (let i = dataStartRow; i < lines.length; i++) {
          const cells = lines[i].split(/[,\t;]/).map(c => c.trim());
          const prayerRaw = cells[0];
          // Match prayer name case-insensitively
          const matchedPrayer = PRAYERS_LIST.find(p => p.toLowerCase() === prayerRaw.toLowerCase());
          if (!matchedPrayer) continue;

          cells.slice(1).forEach((timeVal, idx) => {
            const dayLabel = dayHeaders[idx];
            if (!dayLabel) return;
            // Normalise day label to match DAYS array (Mon/Tue/...)
            const matchedDay = DAYS.find(d => d.toLowerCase() === dayLabel.toLowerCase().slice(0, 3));
            if (!matchedDay) return;
            if (!timeVal || timeVal === "-" || timeVal === "—") return;
            // Ensure HH:MM format
            const timeMatch = timeVal.match(/(\d{1,2}):(\d{2})/);
            if (!timeMatch) return;
            const hh = timeMatch[1].padStart(2, "0");
            const mm = timeMatch[2];
            updated[matchedDay] = { ...(updated[matchedDay] || {}), [matchedPrayer]: `${hh}:${mm}` };
          });
        }

        if (Object.keys(updated).length === 0) throw new Error("No valid prayer times found in file");
        setMosqueTimes(updated);
        localStorage.setItem("dhikr_mosque_timetable", JSON.stringify(updated));
        setCsvStatus("success");
        setCsvMsg(`Imported ${Object.values(updated).reduce((n, d) => n + Object.keys(d).length, 0)} times`);
      } catch (err: any) {
        setCsvStatus("error");
        setCsvMsg(err.message || "Could not parse file");
      }
    };
    reader.readAsText(file);
  };

  if (loading) {
    return <div className="py-8 text-center text-muted-foreground text-sm">Loading prayer times…</div>;
  }

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-3xl p-5 border border-border shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Today's Timetable</h3>
              <p className="text-xs text-muted-foreground">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            </div>
          </div>
        </div>

        {data?.prayers && (
          <div className="space-y-2">
            {data.prayers.map((prayer: any) => {
              const isSalah = prayer.name !== "Sunrise";
              return (
                <div key={prayer.name} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                  <div>
                    <p className="font-bold text-foreground text-sm">{prayer.name}</p>
                    <p className="text-xs text-muted-foreground arabic-text">{prayer.arabicName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground tabular-nums">{formatTime(prayer.time)}</p>
                    {!isSalah && <p className="text-xs text-muted-foreground">Sunrise</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-card rounded-3xl p-5 border border-border shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-secondary/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Mosque Timetable</h3>
              <p className="text-xs text-muted-foreground">Enter or upload your mosque's times</p>
            </div>
          </div>
          <button
            onClick={() => setMosqueMode(m => !m)}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-bold transition-all",
              mosqueMode ? "bg-primary text-white" : "bg-muted text-muted-foreground"
            )}
          >
            {mosqueMode ? "Done" : "Edit"}
          </button>
        </div>

        {/* CSV Upload strip */}
        <div className="mb-4 flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.tsv,.txt"
            className="hidden"
            onChange={e => {
              const f = e.target.files?.[0];
              if (f) handleCsvUpload(f);
              e.target.value = "";
            }}
          />
          <button
            onClick={() => { setCsvStatus("idle"); fileInputRef.current?.click(); }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl border-2 border-dashed border-border bg-muted/30 text-sm font-semibold text-primary hover:bg-primary/5 active:scale-[0.98] transition-all"
          >
            <Upload className="w-4 h-4" />
            Upload CSV timetable
          </button>
          {Object.keys(mosqueTimes).length > 0 && (
            <button
              onClick={clearAll}
              className="w-11 h-11 flex items-center justify-center rounded-2xl border border-border bg-muted/30 text-muted-foreground hover:text-red-500 hover:border-red-300 transition-all shrink-0"
              title="Clear all times"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {csvStatus === "success" && (
          <div className="mb-3 flex items-center gap-2 bg-green-50 border border-green-200 rounded-2xl px-3 py-2.5">
            <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
            <p className="text-xs text-green-700 font-semibold">{csvMsg}</p>
          </div>
        )}
        {csvStatus === "error" && (
          <div className="mb-3 flex items-center gap-2 bg-red-50 border border-red-200 rounded-2xl px-3 py-2.5">
            <X className="w-4 h-4 text-red-500 shrink-0" />
            <p className="text-xs text-red-600 font-semibold">{csvMsg}</p>
          </div>
        )}

        {/* CSV format hint */}
        <div className="mb-4 bg-muted/40 rounded-2xl px-3 py-2.5">
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            <span className="font-bold">CSV format:</span> First column = prayer name (Fajr, Dhuhr, Asr, Maghrib, Isha). Remaining columns = days (Mon–Sun). First row can be a header.
          </p>
          <p className="text-[10px] text-muted-foreground mt-1 font-mono">Prayer,Mon,Tue,Wed,Thu,Fri,Sat,Sun</p>
          <p className="text-[10px] text-muted-foreground font-mono">Fajr,05:30,05:30,05:30,05:30,05:15,05:45,05:45</p>
        </div>

        {mosqueMode ? (
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="text-left py-2 px-1 text-muted-foreground font-bold">Prayer</th>
                  {DAYS.map(d => (
                    <th key={d} className="py-2 px-1 text-muted-foreground font-bold text-center">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PRAYERS_LIST.map(prayer => (
                  <tr key={prayer} className="border-t border-border/40">
                    <td className="py-2 px-1 font-bold text-foreground">{prayer}</td>
                    {DAYS.map(day => (
                      <td key={day} className="py-1 px-0.5">
                        <input
                          type="time"
                          value={mosqueTimes[day]?.[prayer] || ""}
                          onChange={e => saveMosqueTime(day, prayer, e.target.value)}
                          className="w-full text-[10px] border border-border rounded-lg px-1 py-1.5 bg-muted text-center focus:outline-none focus:ring-1 focus:ring-primary/30"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="text-left py-2 px-1 text-muted-foreground font-bold">Prayer</th>
                  {DAYS.map(d => (
                    <th key={d} className="py-2 px-1 text-muted-foreground font-bold text-center">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PRAYERS_LIST.map(prayer => (
                  <tr key={prayer} className="border-t border-border/40">
                    <td className="py-2.5 px-1 font-bold text-foreground">{prayer}</td>
                    {DAYS.map(day => (
                      <td key={day} className="py-2.5 px-1 text-center">
                        <span className={cn(
                          "font-semibold tabular-nums",
                          mosqueTimes[day]?.[prayer] ? "text-foreground" : "text-muted-foreground/40"
                        )}>
                          {mosqueTimes[day]?.[prayer] || "—"}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {Object.keys(mosqueTimes).length === 0 && (
              <p className="text-center text-muted-foreground text-xs py-4">Upload a CSV or tap Edit to enter your mosque's timetable</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function getMethodDescription(key: string): string {
  const descs: Record<string, string> = {
    MuslimWorldLeague: "Used by most UK and European mosques. Fajr: 18°, Isha: 17°.",
    Egyptian: "Egyptian General Authority of Survey. Fajr: 19.5°, Isha: 17.5°.",
    Karachi: "University of Islamic Sciences, Karachi. Used in Pakistan, Afghanistan, Bangladesh, India.",
    UmmAlQura: "Umm Al-Qura University, Makkah. Used in Saudi Arabia.",
    Dubai: "Official method for the UAE. Used in Dubai and the Emirates.",
    MoonsightingCommittee: "Moonsighting Committee (ISNA). Used by some North American Muslim communities.",
    NorthAmerica: "ISNA method. Fajr: 15°, Isha: 15°. Common in North America.",
    Kuwait: "Used in Kuwait.",
    Qatar: "Modified Umm Al-Qura for Qatar. Isha is 90 min after Maghrib.",
    Singapore: "Used in Singapore, Malaysia, and Indonesia.",
    Tehran: "Institute of Geophysics, University of Tehran. Used in Iran and some Shia communities.",
    Turkey: "Diyanet İşleri Başkanlığı, Turkey.",
  };
  return descs[key] || "";
}

type TabKey = "location" | "calculation" | "adjustments" | "timetable";

const TABS: { key: TabKey; label: string; icon: any }[] = [
  { key: "location", label: "Location", icon: MapPin },
  { key: "calculation", label: "Calculation", icon: Calculator },
  { key: "adjustments", label: "Adjustments", icon: SlidersHorizontal },
  { key: "timetable", label: "Timetable", icon: CalendarDays },
];

export default function PrayerTimeSettings() {
  const [activeTab, setActiveTab] = useState<TabKey>("calculation");
  const { offsets } = usePrayerOffsets();
  const { data, error, loading } = usePrayerTimes(offsets);

  return (
    <div className="flex-1 flex flex-col h-full bg-background pt-2 pb-6">
      <header className="px-5 pt-4 pb-3">
        <h1 className="text-2xl font-bold text-foreground">Prayer Times</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Configure your location and calculation preferences.</p>
      </header>

      <div className="px-5 mb-4">
        <div className="flex p-1 bg-muted rounded-full shadow-inner overflow-x-auto scrollbar-hide gap-0.5">
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-full text-xs font-bold transition-all whitespace-nowrap",
                  activeTab === tab.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-8">
        {activeTab === "location" && <LocationTab data={data} loading={loading} error={error} />}
        {activeTab === "calculation" && <CalculationTab />}
        {activeTab === "adjustments" && <AdjustmentsTab data={data} />}
        {activeTab === "timetable" && <TimetableTab data={data} loading={loading} />}
      </div>
    </div>
  );
}
