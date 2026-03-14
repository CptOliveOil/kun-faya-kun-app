import { useState, useEffect, useCallback, useRef } from "react";
import { MapPin, RefreshCw, AlertCircle, Navigation, Info, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

const MECCA_LAT = 21.4225;
const MECCA_LNG = 39.8262;

function calculateQibla(userLat: number, userLng: number): number {
  const lat1 = userLat * (Math.PI / 180);
  const lat2 = MECCA_LAT * (Math.PI / 180);
  const dLng = (MECCA_LNG - userLng) * (Math.PI / 180);
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

function smoothAngle(prev: number, next: number): number {
  let diff = next - prev;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return (prev + diff * 0.3 + 360) % 360;
}

function getCity(lat: number, lng: number): Promise<string> {
  return fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
    .then(r => r.json())
    .then(d => d.address?.city || d.address?.town || d.address?.village || d.address?.county || "Your Location")
    .catch(() => "Your Location");
}

export default function Qibla() {
  // location state
  const [locState, setLocState] = useState<"loading" | "ready" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [qibla, setQibla] = useState<number | null>(null);
  const [city, setCity] = useState("Your Location");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  // compass state
  const [compassState, setCompassState] = useState<"idle" | "requesting" | "active" | "manual">("idle");
  const [heading, setHeading] = useState(0);
  const [manualHeading, setManualHeading] = useState(0);

  const smoothedRef = useRef(0);
  const headingRef = useRef<number | null>(null);
  const lastUpdateRef = useRef(0);
  const noCompassTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Orientation handler ─────────────────────────────────────────────────
  const handleOrientation = useCallback((e: Event) => {
    const ev = e as DeviceOrientationEvent & { webkitCompassHeading?: number };
    let h: number | null = null;

    // iOS provides webkitCompassHeading — true north, most reliable
    if (typeof ev.webkitCompassHeading === "number" && !isNaN(ev.webkitCompassHeading)) {
      h = ev.webkitCompassHeading;
    } else if (ev.absolute && ev.alpha !== null && ev.alpha !== undefined) {
      h = (360 - ev.alpha) % 360;
    } else if (ev.alpha !== null && ev.alpha !== undefined) {
      h = (360 - ev.alpha) % 360;
    }

    if (h !== null && !isNaN(h)) {
      headingRef.current = h;

      if (noCompassTimeoutRef.current) {
        clearTimeout(noCompassTimeoutRef.current);
        noCompassTimeoutRef.current = null;
      }

      setCompassState("active");

      const now = Date.now();
      if (now - lastUpdateRef.current > 40) {
        lastUpdateRef.current = now;
        const smoothed = smoothAngle(smoothedRef.current, h);
        smoothedRef.current = smoothed;
        setHeading(smoothed);
      }
    }
  }, []);

  // ── Start listening to compass ──────────────────────────────────────────
  const listenToCompass = useCallback(() => {
    window.addEventListener("deviceorientationabsolute", handleOrientation, true);
    window.addEventListener("deviceorientation", handleOrientation, true);

    // If no reading within 4 seconds → fall back to manual
    noCompassTimeoutRef.current = setTimeout(() => {
      if (headingRef.current === null) {
        setCompassState("manual");
      }
    }, 4000);
  }, [handleOrientation]);

  // ── Request compass permission (must be called from user tap on iOS) ────
  const requestCompass = useCallback(() => {
    setCompassState("requesting");

    if (typeof (DeviceOrientationEvent as any).requestPermission === "function") {
      // iOS 13+: requires user gesture
      (DeviceOrientationEvent as any)
        .requestPermission()
        .then((status: string) => {
          if (status === "granted") {
            listenToCompass();
          } else {
            setCompassState("manual");
          }
        })
        .catch(() => setCompassState("manual"));
    } else {
      // Android / desktop: no permission needed
      listenToCompass();
    }
  }, [listenToCompass]);

  // ── Get location on mount ───────────────────────────────────────────────
  useEffect(() => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser.");
      setLocState("error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const q = calculateQibla(latitude, longitude);
        setQibla(q);
        setCoords({ lat: latitude, lng: longitude });
        setLocState("ready");
        // Don't auto-start compass — iOS blocks it unless triggered by tap
        const cityName = await getCity(latitude, longitude);
        setCity(cityName);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setErrorMsg("Location permission was denied. Go to your browser's site settings and allow location access, then reload.");
        } else if (err.code === err.TIMEOUT) {
          setErrorMsg("Location timed out. Check your GPS signal and try again.");
        } else {
          setErrorMsg("Could not get your location. Please try again.");
        }
        setLocState("error");
      },
      { timeout: 12000, enableHighAccuracy: true }
    );

    return () => {
      window.removeEventListener("deviceorientationabsolute", handleOrientation, true);
      window.removeEventListener("deviceorientation", handleOrientation, true);
      if (noCompassTimeoutRef.current) clearTimeout(noCompassTimeoutRef.current);
    };
  }, []);

  // ── Derived values ──────────────────────────────────────────────────────
  const effectiveHeading = compassState === "manual" ? manualHeading : heading;
  const needleAngle = qibla !== null ? (qibla - effectiveHeading + 360) % 360 : 0;
  const isAligned = qibla !== null && (needleAngle < 5 || needleAngle > 355);

  const ticks = Array.from({ length: 72 }, (_, i) => i * 5);

  return (
    <div className="flex-1 flex flex-col h-full bg-background">

      {/* Location bar */}
      <div className="px-5 pt-2 pb-3">
        <div className="flex items-center gap-2.5 bg-card border border-border rounded-2xl px-4 py-3 shadow-sm">
          <MapPin className="w-4 h-4 text-primary shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-foreground text-sm truncate">
              {locState === "loading" ? "Getting your location…" : locState === "error" ? "Location unavailable" : city}
            </p>
            {locState === "ready" && (
              <p className="text-xs text-muted-foreground">Qibla direction for your current location</p>
            )}
          </div>
          {locState === "loading" && <RefreshCw className="w-4 h-4 text-primary animate-spin shrink-0" />}
        </div>
      </div>

      {/* Error state */}
      {locState === "error" ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
          <div className="w-20 h-20 rounded-full bg-card border border-border flex items-center justify-center shadow-sm">
            <AlertCircle className="w-9 h-9 text-secondary" />
          </div>
          <div className="text-center space-y-2 max-w-xs">
            <h2 className="font-bold text-lg text-foreground">Location Required</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{errorMsg}</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4 max-w-xs w-full text-xs text-muted-foreground space-y-1.5 leading-relaxed">
            <p className="font-bold text-foreground mb-2">How to enable location:</p>
            <p>• <b>Safari/iPhone:</b> Settings → Safari → Location → Allow</p>
            <p>• <b>Chrome/Android:</b> Tap the lock icon → Permissions → Location → Allow</p>
            <p>• <b>Firefox:</b> Tap the shield icon → Location → Allow</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3.5 bg-primary text-white rounded-2xl font-semibold text-sm shadow-sm active:scale-95 transition-transform"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center pb-20 gap-5">

          {/* ── Compass ── */}
          <div className="relative flex items-center justify-center w-[min(288px,75vw)] h-[min(288px,75vw)]">

            {/* Rotating compass ring */}
            <div
              className="absolute inset-0 rounded-full bg-card border-2 border-border shadow-lg"
              style={{
                transform: `rotate(${-effectiveHeading}deg)`,
                transition: compassState === "active" ? "transform 0.1s linear" : "none",
              }}
            >
              {/* Tick marks */}
              {ticks.map(deg => {
                const isCard = deg % 90 === 0;
                const is45 = deg % 45 === 0;
                return (
                  <div
                    key={deg}
                    className="absolute left-1/2 top-0"
                    style={{ transform: `rotate(${deg}deg)`, transformOrigin: "0 calc(min(288px, 75vw) / 2)", marginLeft: "-0.5px" }}
                  >
                    <div className={cn(
                      "rounded-full",
                      isCard ? "w-[2px] h-[14px] bg-foreground/70" :
                      is45   ? "w-[1.5px] h-[9px] bg-foreground/35" :
                               "w-[1px] h-[6px] bg-foreground/18"
                    )} />
                  </div>
                );
              })}

              {/* Cardinal labels */}
              <span className="absolute top-4 left-1/2 -translate-x-1/2 text-sm font-black text-red-500">N</span>
              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-bold text-foreground/50">S</span>
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold text-foreground/50">E</span>
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xs font-bold text-foreground/50">W</span>

              {/* Inner ring */}
              <div className="absolute rounded-full border border-border/30" style={{ inset: 28 }} />
            </div>

            {/* Qibla needle */}
            {qibla !== null && (
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{
                  transform: `rotate(${needleAngle}deg)`,
                  transition: compassState === "active" ? "transform 0.1s linear" : "none",
                }}
              >
                <svg viewBox="0 0 40 288" className="absolute w-[40px] h-full" fill="none">
                  <path d="M20 24 L28 100 L12 100 Z" fill={isAligned ? "#2E7D5E" : "#C9A84C"} opacity="0.95" />
                  <path d="M20 264 L28 188 L12 188 Z" fill="currentColor" className="text-foreground/20" />
                  <line x1="20" y1="100" x2="20" y2="188" stroke="currentColor" strokeWidth="1.5" className="text-border" />
                </svg>

                {/* Kaaba icon */}
                <div className="absolute flex items-center justify-center" style={{ top: 18, left: "50%", transform: "translateX(-50%)" }}>
                  <div className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center shadow-md border-2 transition-colors duration-300",
                    isAligned ? "bg-primary border-primary text-white" : "bg-secondary/10 border-secondary text-secondary"
                  )}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                      <rect x="3" y="8" width="18" height="13" rx="1" fill="currentColor" opacity="0.9" />
                      <rect x="3" y="5" width="18" height="4" rx="0.5" fill="currentColor" opacity="0.6" />
                      <path d="M8 21 L8 15 Q12 13 16 15 L16 21" fill="white" opacity="0.25" />
                      <path d="M5 9 Q12 6 19 9" stroke="white" strokeWidth="1" opacity="0.5" fill="none" />
                      <line x1="3" y1="12" x2="21" y2="12" stroke="white" strokeWidth="0.8" opacity="0.3" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Center dot */}
            <div className="absolute w-4 h-4 rounded-full bg-foreground/80 border-2 border-card shadow z-10" />

            {/* Aligned glow */}
            {isAligned && <div className="absolute inset-2 rounded-full border-2 border-primary/40 animate-pulse" />}

            {/* Loading overlay while location loads */}
            {locState === "loading" && (
              <div className="absolute inset-0 rounded-full bg-card/80 flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-primary animate-spin" />
              </div>
            )}
          </div>

          {/* ── Info card ── */}
          <div className={cn(
            "w-full max-w-[min(288px,75vw)] rounded-2xl px-5 py-4 border shadow-sm transition-colors duration-300",
            isAligned ? "bg-primary/10 border-primary/30" : "bg-card border-border"
          )}>
            <div className="flex items-center justify-between">
              <div>
                <p className={cn("text-2xl font-black tabular-nums", isAligned ? "text-primary" : "text-foreground")}>
                  {qibla !== null ? `${Math.round(qibla)}°` : "—"}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {isAligned && <Navigation className="w-4 h-4 text-primary" />}
                  <p className={cn("text-sm font-semibold", isAligned ? "text-primary" : "text-muted-foreground")}>
                    {locState === "loading" ? "Calculating…" :
                     isAligned ? "Facing the Qibla ✓" :
                     compassState === "idle" ? "Tap below to start compass" :
                     "Rotate to face the Kaaba"}
                  </p>
                </div>
              </div>
              {coords && (
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground">{coords.lat.toFixed(3)}°N</p>
                  <p className="text-[10px] text-muted-foreground">{coords.lng.toFixed(3)}°E</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Compass start button (shown until compass is active) ── */}
          {locState === "ready" && compassState === "idle" && (
            <button
              onClick={requestCompass}
              className="flex items-center gap-2.5 px-7 py-3.5 bg-primary text-white rounded-2xl font-semibold text-sm shadow-md active:scale-95 transition-transform"
            >
              <Compass className="w-5 h-5" />
              Start Live Compass
            </button>
          )}

          {compassState === "requesting" && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RefreshCw className="w-4 h-4 animate-spin text-primary" />
              Requesting compass access…
            </div>
          )}

          {/* ── Manual slider (no compass detected) ── */}
          {compassState === "manual" && (
            <div className="w-full max-w-[min(288px,75vw)] bg-card border border-border rounded-2xl px-5 py-4 space-y-3">
              <p className="text-xs font-bold text-secondary flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" /> No compass detected
              </p>
              <p className="text-[11px] text-muted-foreground">
                Your device doesn't support a compass. Use the slider to set which direction you're facing manually.
              </p>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-muted-foreground">Facing</span>
                  <span className="text-foreground tabular-nums">{Math.round(manualHeading)}°</span>
                </div>
                <input
                  type="range" min="0" max="359" value={manualHeading}
                  onChange={e => { setManualHeading(+e.target.value); setHeading(+e.target.value); }}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-primary bg-muted"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>N</span><span>E</span><span>S</span><span>W</span><span>N</span>
                </div>
              </div>
            </div>
          )}

          {/* ── Active compass status + calibration tip ── */}
          {compassState === "active" && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full">
                <Navigation className="w-3.5 h-3.5 text-primary" />
                <p className="text-[11px] text-primary font-semibold">
                  Compass active · {Math.round(effectiveHeading)}°
                </p>
              </div>
              <div className="flex items-start gap-2 bg-card border border-border rounded-2xl px-4 py-3 max-w-[min(288px,75vw)]">
                <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  For best accuracy, move your phone in a figure-8 motion a few times to calibrate.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
