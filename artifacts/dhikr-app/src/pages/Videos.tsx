import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Clock, User, CheckCircle, BookOpen, Mic, BookHeart, Moon, Users, Heart, AlertCircle, History, Star, Landmark, Repeat } from "lucide-react";
import { cn } from "@/lib/utils";
import { SlideUpPanel } from "@/components/SlideUpPanel";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Video {
  id: string;
  videoId: string;
  title: string;
  speaker: string;
  duration: string;
  durationSec: number;
}

interface VideoCategory {
  id: string;
  name: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  videos: Video[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Extract a YouTube video ID from any YouTube URL format, or return as-is if it's already an ID. */
export function extractYouTubeId(input: string): string {
  if (!input) return "";
  // Already a bare ID (no slashes, no dots)
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;
  try {
    const url = new URL(input.startsWith("http") ? input : `https://${input}`);
    // youtu.be/ID
    if (url.hostname === "youtu.be") return url.pathname.slice(1);
    // youtube.com/shorts/ID
    const shortsMatch = url.pathname.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
    if (shortsMatch) return shortsMatch[1];
    // youtube.com/watch?v=ID
    return url.searchParams.get("v") || input;
  } catch {
    return input;
  }
}

function parseDuration(dur: string): number {
  const parts = dur.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] || 0;
}

// ─── Progress helpers (localStorage) ─────────────────────────────────────────

function getProgress(videoId: string): number {
  try {
    const data = localStorage.getItem(`dhikr_video_progress_${videoId}`);
    return data ? JSON.parse(data).percent ?? 0 : 0;
  } catch { return 0; }
}

function saveProgress(videoId: string, percent: number) {
  localStorage.setItem(
    `dhikr_video_progress_${videoId}`,
    JSON.stringify({ percent, updatedAt: Date.now() })
  );
}

function getContinueWatching(): { video: Video; category: VideoCategory; progress: number }[] {
  const results: { video: Video; category: VideoCategory; progress: number }[] = [];
  VIDEO_CATEGORIES.forEach(cat => {
    cat.videos.forEach(v => {
      const p = getProgress(v.id);
      if (p > 2 && p < 90) results.push({ video: v, category: cat, progress: p });
    });
  });
  return results.sort((a, b) => b.progress - a.progress);
}

function getTotalProgress() {
  let watched = 0, total = 0;
  VIDEO_CATEGORIES.forEach(cat => {
    cat.videos.forEach(v => {
      total++;
      if (getProgress(v.id) >= 90) watched++;
    });
  });
  return { watched, total };
}

// ─── Video data ───────────────────────────────────────────────────────────────

const VIDEO_CATEGORIES: VideoCategory[] = [
  {
    id: "daily", name: "Daily Reminders", color: "#2E7D5E", icon: Star,
    videos: [
      { id: "d1", videoId: "YSp4tZQzoDo", title: "The Power of Bismillah",   speaker: "Mufti Menk",      duration: "8:42",  durationSec: 522 },
      { id: "d2", videoId: "DBGYumYEOVU", title: "Why Does Allah Test Us?",  speaker: "Nouman Ali Khan", duration: "15:20", durationSec: 920 },
      { id: "d3", videoId: "PBt1mcAO0do", title: "Be Grateful to Allah",     speaker: "Mufti Menk",      duration: "12:05", durationSec: 725 },
      { id: "d4", videoId: "5uAtB_eBgOM", title: "Trust Allah's Plan",       speaker: "Omar Suleiman",   duration: "10:33", durationSec: 633 },
    ],
  },
  {
    id: "reminders", name: "Reminders", color: "#2E7D5E", icon: Heart,
    videos: [
      { id: "rem1",  videoId: "rLTv1lUAYxA", title: "Stop Worrying, Trust Allah",                     speaker: "Mufti Menk",    duration: "—", durationSec: 0 },
      { id: "rem2",  videoId: "ufffdfz-Wqc", title: "Make The Most of This Month",                    speaker: "Mufti Menk",    duration: "—", durationSec: 0 },
      { id: "rem3",  videoId: "yr7jx7apyP0", title: "The Most Important Reminder You'll Hear Today",  speaker: "Omar Suleiman", duration: "—", durationSec: 0 },
      { id: "rem4",  videoId: "jVRRnupNJUI", title: "Stop Pleasing Everyone",                         speaker: "Mufti Menk",    duration: "—", durationSec: 0 },
      { id: "rem5",  videoId: "S7n91tiFgwE", title: "Live As If It Is Your Last Day",                 speaker: "Mufti Menk",    duration: "—", durationSec: 0 },
      { id: "rem6",  videoId: "GKaCo-nJgSc", title: "This Reminder Is For Me, I Need It",             speaker: "Mufti Menk",    duration: "—", durationSec: 0 },
      { id: "rem7",  videoId: "y37088rKUkg", title: "Message to the Muslim Youth",                    speaker: "Mufti Menk",    duration: "—", durationSec: 0 },
      { id: "rem8",  videoId: "i8Vpn_L9X0Q", title: "Stop Complaining, Start Living",                 speaker: "Mufti Menk",    duration: "—", durationSec: 0 },
      { id: "rem9",  videoId: "NBPBSLr5j5E", title: "Reflection & Self Improvement",                  speaker: "Mufti Menk",    duration: "—", durationSec: 0 },
      { id: "rem10", videoId: "StBHWsu2wXM", title: "Leave It In The Hands Of Allah",                 speaker: "Mufti Menk",    duration: "—", durationSec: 0 },
    ],
  },
  {
    id: "hadith", name: "Hadith", color: "#D4A24C", icon: BookOpen,
    videos: [
      { id: "had1",  videoId: "p8-p_mPc8Cs", title: "The Scariest Hadith We Ignore",                        speaker: "Omar Suleiman", duration: "—", durationSec: 0 },
      { id: "had2",  videoId: "Xp-u3Te-p7I", title: "The Hadith That Changes Everything About Happiness",    speaker: "Omar Suleiman", duration: "—", durationSec: 0 },
      { id: "had3",  videoId: "eueTFX3CSGY", title: "Avoiding That Which Doesn't Concern You",              speaker: "Omar Suleiman", duration: "—", durationSec: 0 },
      { id: "had4",  videoId: "pXLKda9rNf8", title: "Two Things Allah Keeps Hidden From Us",                speaker: "Omar Suleiman", duration: "—", durationSec: 0 },
      { id: "had5",  videoId: "XT6KRsSkJjs", title: "Do Not Wish to Meet Your Enemy in Battle",             speaker: "Omar Suleiman", duration: "—", durationSec: 0 },
      { id: "had6",  videoId: "LX_-rCCDJLs", title: "Sincere Advice to an Unwilling Recipient",             speaker: "Omar Suleiman", duration: "—", durationSec: 0 },
      { id: "had7",  videoId: "pQIv8FRGOik", title: "Two Blessings that are Rarely Combined",               speaker: "Omar Suleiman", duration: "—", durationSec: 0 },
      { id: "had8",  videoId: "x3RdxVejdoI", title: "To Be Spared and Grateful Is More Beloved",            speaker: "Omar Suleiman", duration: "—", durationSec: 0 },
      { id: "had9",  videoId: "aGC7rKiRl04", title: "The Du'a Abu Bakr Asked For",                          speaker: "Omar Suleiman", duration: "—", durationSec: 0 },
      { id: "had10", videoId: "HxRd7CKmD6Q", title: "Did the Prophet ﷺ Tell Us About This War?",            speaker: "Omar Suleiman", duration: "—", durationSec: 0 },
    ],
  },
  {
    id: "stories", name: "Prophet Stories", color: "#6B4C9A", icon: Users,
    videos: [
      { id: "ps1",  videoId: "IQjzErJlpJ0", title: "Stories Of The Prophets 01: Introduction",            speaker: "Mufti Menk", duration: "—", durationSec: 0 },
      { id: "ps2",  videoId: "w6bX6GKqVa4", title: "Stories Of The Prophets 02: Creation of Aadam",       speaker: "Mufti Menk", duration: "—", durationSec: 0 },
      { id: "ps3",  videoId: "J9IDLOza_KM", title: "Stories Of The Prophets 03: Aadam on Earth Part 1",   speaker: "Mufti Menk", duration: "—", durationSec: 0 },
      { id: "ps4",  videoId: "WNPjOOwXOIk", title: "Stories Of The Prophets 04: Aadam on Earth Part 2",   speaker: "Mufti Menk", duration: "—", durationSec: 0 },
      { id: "ps5",  videoId: "T30tVG3uKZM", title: "Stories Of The Prophets 05: Sheeth",                  speaker: "Mufti Menk", duration: "—", durationSec: 0 },
      { id: "ps6",  videoId: "eGgNrs9UyRU", title: "Stories Of The Prophets 06: Idrees",                  speaker: "Mufti Menk", duration: "—", durationSec: 0 },
      { id: "ps7",  videoId: "j-1Rti9-H-k", title: "Stories Of The Prophets 12: Ibraheem and Ismail",    speaker: "Mufti Menk", duration: "—", durationSec: 0 },
      { id: "ps8",  videoId: "vmuNyJYXRbg", title: "The Intriguing Story of Prophet Yusuf",               speaker: "Mufti Menk", duration: "—", durationSec: 0 },
      { id: "ps9",  videoId: "vldKHcVG2xA", title: "Stories Of The Prophets 20: Musa and Haroon",         speaker: "Mufti Menk", duration: "—", durationSec: 0 },
      { id: "ps10", videoId: "y0pc95YEloA", title: "Stories Of The Prophets 29: Isa",                     speaker: "Mufti Menk", duration: "—", durationSec: 0 },
    ],
  },
  {
    id: "quran", name: "Quran Recitations", color: "#1D4E89", icon: BookHeart,
    videos: [
      { id: "qr1",  videoId: "w8OkqixNr3s", title: "Quran Recitation with Sheikh Mishary Alafasy",  speaker: "Mishary Rashid Alafasy", duration: "—", durationSec: 0 },
      { id: "qr2",  videoId: "X2YnP50cwNU", title: "Surah Al-Baqarah",                              speaker: "Mishary Rashid Alafasy", duration: "—", durationSec: 0 },
      { id: "qr3",  videoId: "H4N5eFbLl9A", title: "Surah Ar-Rahman",                               speaker: "Mishary Rashid Alafasy", duration: "—", durationSec: 0 },
      { id: "qr4",  videoId: "-FxEYa8joK8", title: "Surah Al-Kahf",                                 speaker: "Mishary Rashid Alafasy", duration: "—", durationSec: 0 },
      { id: "qr5",  videoId: "Q9SH1PZA0tM", title: "Last 20 Surahs of the Quran",                   speaker: "Mishary Rashid Alafasy", duration: "—", durationSec: 0 },
      { id: "qr6",  videoId: "mcFkxppp9-M", title: "Surah Al-Baqarah Full Quick Recitation",        speaker: "Mishary Rashid Alafasy", duration: "—", durationSec: 0 },
      { id: "qr7",  videoId: "Q9xYG8PLxeg", title: "Surah Ya Seen",                                 speaker: "Mishary Rashid Alafasy", duration: "—", durationSec: 0 },
      { id: "qr8",  videoId: "UDvh63xHVa0", title: "Surah Al-Fatiha",                               speaker: "Mishary Rashid Alafasy", duration: "—", durationSec: 0 },
      { id: "qr9",  videoId: "ifGIMi82aFE", title: "Surah Al-Mulk",                                 speaker: "Mishary Rashid Alafasy", duration: "—", durationSec: 0 },
      { id: "qr10", videoId: "NDE6iXOK7_Q", title: "Surah Al-Waqi'ah",                              speaker: "Mishary Rashid Alafasy", duration: "—", durationSec: 0 },
    ],
  },
  {
    id: "lectures", name: "Lectures", color: "#9B3E5E", icon: Mic,
    videos: [
      { id: "lec1",  videoId: "NBPBSLr5j5E", title: "Reflection & Self Improvement",    speaker: "Mufti Menk",    duration: "—", durationSec: 0 },
      { id: "lec2",  videoId: "jY5j9p6rElQ", title: "From Enemies to Brothers",          speaker: "Omar Suleiman", duration: "—", durationSec: 0 },
      { id: "lec3",  videoId: "wFzUSfYoF2k", title: "Guaranteed Ease During Hardship",   speaker: "Mufti Menk",    duration: "—", durationSec: 0 },
      { id: "lec4",  videoId: "DHVXN6Ylpxw", title: "The Secret to Finding Inner Peace", speaker: "Omar Suleiman", duration: "—", durationSec: 0 },
      { id: "lec5",  videoId: "fLeFdWfmxWg", title: "Curing the Heart",                  speaker: "Mufti Menk",    duration: "—", durationSec: 0 },
      { id: "lec6",  videoId: "qm3bi01R2KM", title: "Practicing Detachment",             speaker: "Omar Suleiman", duration: "—", durationSec: 0 },
      { id: "lec7",  videoId: "LdVyP-YU1fk", title: "Lessons from Hajj 2025",            speaker: "Mufti Menk",    duration: "—", durationSec: 0 },
      { id: "lec8",  videoId: "edt-9YzERk4", title: "The Quranic Circle of Life",        speaker: "Mufti Menk",    duration: "—", durationSec: 0 },
      { id: "lec9",  videoId: "z9O2CalZ9E0", title: "What It Means to Endure",           speaker: "Omar Suleiman", duration: "—", durationSec: 0 },
      { id: "lec10", videoId: "r_4UK9cj4eA", title: "How to Ask Allah",                  speaker: "Mufti Menk",    duration: "—", durationSec: 0 },
    ],
  },
  {
    id: "khutbahs", name: "Khutbahs", color: "#7C3D12", icon: Landmark,
    videos: [
      { id: "khu1",  videoId: "pbttwoB1fU0", title: "Signs That Allah Is At War With You",          speaker: "Omar Suleiman", duration: "—", durationSec: 0 },
      { id: "khu2",  videoId: "qix2-6TCG1Q", title: "How Every Day of Ramadan is Worth 70 Years",   speaker: "Omar Suleiman", duration: "—", durationSec: 0 },
      { id: "khu3",  videoId: "9dFZagoZyRE", title: "Are You a Mediocre Muslim?",                   speaker: "Omar Suleiman", duration: "—", durationSec: 0 },
      { id: "khu4",  videoId: "o3BOHDBIMe0", title: "Better Than 1000 Worshippers",                 speaker: "Omar Suleiman", duration: "—", durationSec: 0 },
      { id: "khu5",  videoId: "C1HLDo0P-IQ", title: "Hidden Causes of Disconnect from Allah",       speaker: "Omar Suleiman", duration: "—", durationSec: 0 },
      { id: "khu6",  videoId: "tvvc3C_5ap0", title: "Is Karma Real? The Consequences of Your Deeds",speaker: "Omar Suleiman", duration: "—", durationSec: 0 },
      { id: "khu7",  videoId: "VY_QT8CiTLI", title: "Training Your Nafs in Sha'ban",               speaker: "Omar Suleiman", duration: "—", durationSec: 0 },
      { id: "khu8",  videoId: "j8lip8LqhFA", title: "How to Build Your Laylatul Qadr Du'a List",    speaker: "Omar Suleiman", duration: "—", durationSec: 0 },
      { id: "khu9",  videoId: "Q0SFG-wtCts", title: "When Allah Hits You With A Wall",              speaker: "Omar Suleiman", duration: "—", durationSec: 0 },
      { id: "khu10", videoId: "Dr9P7MvKXxU", title: "How Much Du'a Do You Make for Others?",       speaker: "Omar Suleiman", duration: "—", durationSec: 0 },
    ],
  },
  {
    id: "dua", name: "Dua", color: "#059669", icon: Moon,
    videos: [
      { id: "dua1",  videoId: "bSgLEtTYh0c", title: "Dua To Solve All Problems Quickly",           speaker: "Saad Al Qureshi",       duration: "—", durationSec: 0 },
      { id: "dua2",  videoId: "EuFgCbOEZ84", title: "40 Rabbana - Powerful Duas From the Quran",   speaker: "Omar Hisham Al Arabi",  duration: "—", durationSec: 0 },
      { id: "dua3",  videoId: "YAVk0A9oxO4", title: "Dua of The Prophet ﷺ",                        speaker: "Mufti Menk",            duration: "—", durationSec: 0 },
      { id: "dua4",  videoId: "YsERYonSQlk", title: "Beautiful Morning Dua",                       speaker: "Omar Hisham Al Arabi",  duration: "—", durationSec: 0 },
      { id: "dua5",  videoId: "_zZmKMac8wE", title: "Morning Dua in Full",                         speaker: "Omar Hisham Al Arabi",  duration: "—", durationSec: 0 },
      { id: "dua6",  videoId: "At0-upXqpYw", title: "Dua for Exam Success",                        speaker: "Omar Hisham Al Arabi",  duration: "—", durationSec: 0 },
      { id: "dua7",  videoId: "BXBeGG2MXGk", title: "The Dua That Will Give You Everything You Want", speaker: "Omar Hisham Al Arabi", duration: "—", durationSec: 0 },
      { id: "dua8",  videoId: "42AVhDZJcNg", title: "25 Duas from Qur'an",                         speaker: "Mevlan Kurtishi",       duration: "—", durationSec: 0 },
      { id: "dua9",  videoId: "mxyAwfbfsks", title: "Evening Duas for Protection",                 speaker: "Omar Hisham Al Arabi",  duration: "—", durationSec: 0 },
      { id: "dua10", videoId: "LNPWF1IpZOc", title: "Morning Duas Ruqyah",                        speaker: "Omar Hisham Al Arabi",  duration: "—", durationSec: 0 },
    ],
  },
  {
    id: "dhikr", name: "Dhikr", color: "#0E6655", icon: Repeat,
    videos: [
      { id: "dhk1",  videoId: "2nwGkFLr5GI", title: "The Most Powerful Dhikr",                      speaker: "Mufti Menk",              duration: "—", durationSec: 0 },
      { id: "dhk2",  videoId: "aGC7rKiRl04", title: "The Du'a Abu Bakr Asked For",                   speaker: "Omar Suleiman",           duration: "—", durationSec: 0 },
      { id: "dhk3",  videoId: "sRCI23clwdA", title: "What is the Best Dhikr for Laylatul Qadr?",    speaker: "Omar Suleiman",           duration: "—", durationSec: 0 },
      { id: "dhk4",  videoId: "JGmgc8JoZZQ", title: "Powerful Islamic Dhikr",                       speaker: "Islamic Audio",           duration: "—", durationSec: 0 },
      { id: "dhk5",  videoId: "P8EIBksC0MA", title: "Morning Adhkar - Recite Daily",                 speaker: "Mufti Menk",              duration: "—", durationSec: 0 },
      { id: "dhk6",  videoId: "BipGEsz9lBo", title: "These 4 Dhikr Will Give You Everything In Your Life", speaker: "Islam The Ultimate Peace", duration: "—", durationSec: 0 },
      { id: "dhk7",  videoId: "EOc_utfNmLY", title: "The Special Dhikr Most Muslims Miss in Ramadan", speaker: "Omar Suleiman",          duration: "—", durationSec: 0 },
      { id: "dhk8",  videoId: "FgYHCA-aQvw", title: "Listen Daily | Astaghfirullah Zikr",            speaker: "Islamic Audio",           duration: "—", durationSec: 0 },
      { id: "dhk9",  videoId: "2Mq2gvBV3RE", title: "Evening Adhkar and Dua",                        speaker: "Omar Hisham Al Arabi",    duration: "—", durationSec: 0 },
      { id: "dhk10", videoId: "OOO2MKclvUM", title: "The Morning Adhkar",                            speaker: "Omar Hisham Al Arabi",    duration: "—", durationSec: 0 },
    ],
  },
];

// ─── Thumbnail ────────────────────────────────────────────────────────────────

function YouTubeThumbnail({
  videoId, title, categoryColor, className, compact = false,
}: {
  videoId: string; title: string; categoryColor: string; className?: string; compact?: boolean;
}) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {/* Loading skeleton */}
      {status === "loading" && (
        <div className="absolute inset-0 bg-muted animate-pulse rounded-inherit" />
      )}

      {/* Actual thumbnail */}
      {status !== "error" && (
        <img
          src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
          alt={title}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            status === "loaded" ? "opacity-100" : "opacity-0"
          )}
          loading="lazy"
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
        />
      )}

      {/* Error fallback: coloured bg + play icon */}
      {status === "error" && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-1"
          style={{ backgroundColor: `${categoryColor}22` }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${categoryColor}33` }}
          >
            <Play className="w-5 h-5 ml-0.5" style={{ color: categoryColor }} fill="currentColor" />
          </div>
          {!compact && (
            <span className="text-[9px] font-semibold text-muted-foreground px-2 text-center line-clamp-2">{title}</span>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Video card ───────────────────────────────────────────────────────────────

function VideoCard({
  video, categoryColor, onPlay,
}: {
  video: Video; categoryColor: string; onPlay: (v: Video) => void;
}) {
  const progress = getProgress(video.id);
  const isWatched = progress >= 90;
  const inProgress = progress > 2 && progress < 90;

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={() => onPlay(video)}
      className="flex gap-3 p-3 frosted-card rounded-2xl cursor-pointer transition-colors relative"
    >
      {/* Thumbnail */}
      <div className="relative w-28 h-[72px] rounded-xl overflow-hidden shrink-0">
        <YouTubeThumbnail
          videoId={video.videoId}
          title={video.title}
          categoryColor={categoryColor}
          className="w-full h-full rounded-xl"
        />
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-9 h-9 rounded-full bg-black/50 flex items-center justify-center shadow-md">
            <Play className="w-4 h-4 text-white ml-0.5" fill="currentColor" />
          </div>
        </div>
        {/* Duration badge */}
        <div className="absolute bottom-1 right-1 bg-black/75 text-white text-[8px] font-bold px-1 py-0.5 rounded">
          {video.duration}
        </div>
        {/* Progress bar */}
        {inProgress && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20 rounded-b-xl overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
        <h4 className="text-sm font-bold text-foreground leading-tight line-clamp-2">{video.title}</h4>
        <p className="text-[11px] text-muted-foreground flex items-center gap-1">
          <User className="w-3 h-3 shrink-0" /> {video.speaker}
        </p>
        {isWatched && (
          <span className="text-[10px] text-primary font-bold flex items-center gap-0.5 mt-0.5">
            <CheckCircle className="w-3 h-3" /> Watched
          </span>
        )}
        {inProgress && (
          <span className="text-[10px] text-amber-600 font-semibold mt-0.5">{progress}% watched</span>
        )}
      </div>
    </motion.div>
  );
}

// ─── Continue watching ────────────────────────────────────────────────────────

function ContinueWatchingSection({ onPlay, refreshKey }: { onPlay: (v: Video) => void; refreshKey: number }) {
  const items = getContinueWatching();
  if (items.length === 0) return null;

  return (
    <div className="px-4 mb-3">
      <div className="flex items-center gap-2 mb-2">
        <History className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-bold text-foreground">Continue Watching</h2>
      </div>
      <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1">
        {items.map(({ video, category, progress }) => (
          <motion.div
            key={video.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPlay(video)}
            className="shrink-0 w-36 cursor-pointer"
          >
            <div className="relative w-36 h-20 rounded-xl overflow-hidden">
              <YouTubeThumbnail
                videoId={video.videoId}
                title={video.title}
                categoryColor={category.color}
                className="w-full h-full rounded-xl"
                compact
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center">
                  <Play className="w-3.5 h-3.5 text-white ml-0.5" fill="currentColor" />
                </div>
              </div>
              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <p className="text-[10px] font-semibold text-foreground mt-1 line-clamp-1">{video.title}</p>
            <p className="text-[9px] text-muted-foreground">{progress}% watched</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Video player ─────────────────────────────────────────────────────────────

function VideoPlayerContent({ video, onProgressUpdate }: { video: Video; onProgressUpdate: () => void }) {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef(Date.now());
  const [embedState, setEmbedState] = useState<"loading" | "ready" | "failed">("loading");
  const embedFailTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setEmbedState("loading");
    startRef.current = Date.now();

    // Progress tracking via elapsed time
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startRef.current) / 1000;
      const pct = Math.min(99, Math.round((elapsed / video.durationSec) * 100));
      saveProgress(video.id, pct);
      onProgressUpdate();
    }, 5000);

    // If iframe doesn't fire onLoad within 8s, assume it failed
    embedFailTimeout.current = setTimeout(() => {
      setEmbedState(s => s === "loading" ? "failed" : s);
    }, 8000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (embedFailTimeout.current) clearTimeout(embedFailTimeout.current);
      const elapsed = (Date.now() - startRef.current) / 1000;
      const pct = Math.min(99, Math.round((elapsed / video.durationSec) * 100));
      saveProgress(video.id, pct);
      onProgressUpdate();
    };
  }, [video]);

  const ytWatch = `https://www.youtube.com/watch?v=${video.videoId}`;
  const embedUrl = `https://www.youtube.com/embed/${video.videoId}?rel=0&modestbranding=1&autoplay=1`;

  return (
    <div className="space-y-3 pt-1">
      {/* Embed player / fallback */}
      {embedState !== "failed" ? (
        <div className="relative w-full rounded-2xl overflow-hidden bg-black" style={{ paddingBottom: "56.25%" }}>
          {embedState === "loading" && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}
          <iframe
            className="absolute inset-0 w-full h-full border-0"
            src={embedUrl}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            onLoad={() => {
              if (embedFailTimeout.current) clearTimeout(embedFailTimeout.current);
              setEmbedState("ready");
            }}
            onError={() => setEmbedState("failed")}
          />
        </div>
      ) : (
        <div className="relative w-full rounded-2xl overflow-hidden bg-black" style={{ paddingBottom: "56.25%" }}>
          <img
            src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
            alt={video.title}
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6">
            <AlertCircle className="w-8 h-8 text-white/80" />
            <p className="text-white/90 text-sm text-center font-medium">
              This video cannot be played in the app.
            </p>
          </div>
        </div>
      )}

      {/* Open in YouTube — always visible */}
      <a
        href={ytWatch}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-3.5 bg-[#FF0000] text-white rounded-2xl font-bold text-center flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-md"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
        Open in YouTube
      </a>

      {/* Meta */}
      <p className="text-sm text-muted-foreground flex items-center gap-2 px-1">
        <User className="w-4 h-4 shrink-0" /> {video.speaker}
        <span className="text-border">·</span>
        <Clock className="w-4 h-4 shrink-0" /> {video.duration}
      </p>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Videos() {
  const [activeCategory, setActiveCategory] = useState(VIDEO_CATEGORIES[0].id);
  const [playingVideo, setPlayingVideo] = useState<Video | null>(null);
  const [progressKey, setProgressKey] = useState(0);

  const refreshProgress = useCallback(() => setProgressKey(k => k + 1), []);

  const category = VIDEO_CATEGORIES.find(c => c.id === activeCategory) ?? VIDEO_CATEGORIES[0];
  const { watched, total } = getTotalProgress();

  return (
    <div className="flex-1 flex flex-col min-h-full bg-background">
      {/* Header */}
      <header className="px-5 pt-6 pb-3">
        <h1 className="text-2xl font-bold text-foreground">Islamic Videos</h1>
        <p className="text-muted-foreground text-xs mt-1">Reminders, stories, recitations & more</p>
      </header>

      {/* Watch progress ring */}
      <div className="px-5 mb-3">
        <div className="frosted-card rounded-2xl p-3 flex items-center gap-3 gold-border-rounded">
          <div className="relative w-10 h-10 shrink-0">
            <svg viewBox="0 0 36 36" className="w-10 h-10 -rotate-90">
              <circle cx="18" cy="18" r="15" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15" fill="none"
                stroke="hsl(var(--primary))" strokeWidth="3"
                strokeDasharray={`${(watched / total) * 94.25} 94.25`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-primary">
              {watched}/{total}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-foreground">Watch Progress</p>
            <p className="text-[10px] text-muted-foreground">{watched} of {total} videos fully watched</p>
          </div>
        </div>
      </div>

      {/* Continue Watching */}
      <ContinueWatchingSection key={progressKey} onPlay={setPlayingVideo} refreshKey={progressKey} />

      {/* Category filter pills */}
      <div className="flex gap-2 px-5 overflow-x-auto scrollbar-hide pb-2 mb-1">
        {VIDEO_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-3.5 py-2 rounded-full text-[11px] font-bold whitespace-nowrap transition-all shrink-0 flex items-center gap-1.5",
                activeCategory === cat.id ? "text-white shadow-sm" : "frosted-card text-muted-foreground"
              )}
              style={activeCategory === cat.id ? { backgroundColor: cat.color } : {}}
            >
              <Icon className="w-3.5 h-3.5" />
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Video list */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 pt-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-2.5"
          >
            {category.videos.map((video, i) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <VideoCard
                  video={video}
                  categoryColor={category.color}
                  onPlay={setPlayingVideo}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Video player panel */}
      <SlideUpPanel
        isOpen={!!playingVideo}
        onClose={() => { setPlayingVideo(null); refreshProgress(); }}
        title={playingVideo?.title ?? ""}
      >
        {playingVideo && (
          <VideoPlayerContent
            video={playingVideo}
            onProgressUpdate={refreshProgress}
          />
        )}
      </SlideUpPanel>
    </div>
  );
}
