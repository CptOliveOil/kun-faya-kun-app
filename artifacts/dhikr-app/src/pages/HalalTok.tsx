import { useState, useRef, useEffect, useCallback } from "react";
import { Heart, Share2, BookmarkPlus, Sparkles, Play, RefreshCw, Video } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeedItem {
  id: number;
  type: "reminder" | "hadith" | "quran" | "fact" | "dua" | "tip" | "video";
  title: string;
  arabic?: string;
  content?: string;
  source?: string;
  gradient: string;
  tag: string;
  illustration: IllustrationKey;
  youtubeId?: string;
  channel?: string;
  duration?: string;
}

type IllustrationKey = "book" | "quran" | "moon" | "hands" | "shield" | "heart" | "star" | "compass" | "scroll" | "lantern" | "crescent" | "mosque" | "seed" | "water" | "scale" | "tree" | "sun" | "mountain" | "honey" | "pen" | "kaaba" | "dove" | "tasbih" | "none";

function Illustration({ type, className }: { type: IllustrationKey; className?: string }) {
  const cls = cn("w-28 h-28", className);
  switch (type) {
    case "book":
      return (
        <svg viewBox="0 0 120 120" className={cls} fill="none">
          <rect x="15" y="20" width="90" height="75" rx="6" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
          <rect x="20" y="25" width="38" height="65" rx="4" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
          <rect x="62" y="25" width="38" height="65" rx="4" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
          <line x1="22" y1="38" x2="56" y2="38" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round"/>
          <line x1="22" y1="46" x2="56" y2="46" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round"/>
          <line x1="22" y1="54" x2="48" y2="54" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round"/>
          <line x1="64" y1="38" x2="98" y2="38" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round"/>
          <line x1="64" y1="46" x2="98" y2="46" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round"/>
          <line x1="64" y1="54" x2="86" y2="54" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round"/>
          <path d="M60 20 L60 95" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5"/>
          <path d="M40 15 C40 15 50 18 60 18 C70 18 80 15 80 15 C80 15 70 22 60 22 C50 22 40 15 40 15Z" fill="rgba(201,168,76,0.8)"/>
        </svg>
      );
    case "quran":
      return (
        <svg viewBox="0 0 120 120" className={cls} fill="none">
          <rect x="25" y="10" width="70" height="95" rx="8" fill="rgba(255,255,255,0.18)" stroke="rgba(201,168,76,0.8)" strokeWidth="2.5"/>
          <rect x="25" y="10" width="15" height="95" rx="4" fill="rgba(201,168,76,0.3)" stroke="rgba(201,168,76,0.6)" strokeWidth="1.5"/>
          <line x1="46" y1="30" x2="88" y2="30" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="46" y1="38" x2="88" y2="38" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="46" y1="46" x2="80" y2="46" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="46" y1="58" x2="88" y2="58" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="46" y1="66" x2="88" y2="66" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="46" y1="74" x2="72" y2="74" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M57 85 L63 80 L69 85 L67 92 L63 90 L59 92 Z" fill="rgba(201,168,76,0.9)" stroke="rgba(201,168,76,1)" strokeWidth="1"/>
        </svg>
      );
    case "moon":
      return (
        <svg viewBox="0 0 120 120" className={cls} fill="none">
          <path d="M75 25 C55 30 42 50 47 72 C52 94 72 105 90 100 C68 110 42 95 35 72 C28 49 45 25 68 20 C70.5 19.3 72.8 19 75 19 C75 19 75 25 75 25Z" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.6)" strokeWidth="2"/>
          <circle cx="88" cy="35" r="4" fill="rgba(255,255,255,0.9)"/>
          <circle cx="72" cy="22" r="2" fill="rgba(255,255,255,0.7)"/>
          <circle cx="96" cy="55" r="2.5" fill="rgba(255,255,255,0.7)"/>
          <path d="M85 62 L88 58 L91 62 L89.5 67 L88 66 L86.5 67 Z" fill="rgba(201,168,76,0.9)"/>
        </svg>
      );
    case "hands":
      return (
        <svg viewBox="0 0 120 120" className={cls} fill="none">
          <path d="M30 75 C25 70 22 60 25 50 C27 43 32 40 38 42 L42 44 L44 35 C46 28 52 26 56 30 C56 30 58 22 64 23 C70 24 71 32 71 32 C71 32 74 26 80 28 C86 30 86 38 86 42 L88 55 C90 62 88 72 84 78" stroke="rgba(255,255,255,0.7)" strokeWidth="3" strokeLinecap="round" fill="rgba(255,255,255,0.1)"/>
          <path d="M30 75 C30 75 34 82 40 85 C46 88 50 88 60 88 C70 88 74 88 80 85 C86 82 90 78 90 78" stroke="rgba(255,255,255,0.7)" strokeWidth="3" strokeLinecap="round" fill="none"/>
          <ellipse cx="60" cy="55" rx="18" ry="12" fill="rgba(201,168,76,0.2)" stroke="rgba(201,168,76,0.5)" strokeWidth="1.5"/>
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 120 120" className={cls} fill="none">
          <path d="M60 15 L90 28 L90 62 C90 82 75 98 60 105 C45 98 30 82 30 62 L30 28 Z" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5"/>
          <path d="M60 25 L82 35 L82 62 C82 77 71 90 60 96 C49 90 38 77 38 62 L38 35 Z" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
          <path d="M50 60 L56 66 L72 50" stroke="rgba(201,168,76,1)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case "heart":
      return (
        <svg viewBox="0 0 120 120" className={cls} fill="none">
          <path d="M60 95 C60 95 20 72 20 45 C20 32 30 22 42 22 C50 22 57 26 60 32 C63 26 70 22 78 22 C90 22 100 32 100 45 C100 72 60 95 60 95Z" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5"/>
          <path d="M60 85 C60 85 30 67 30 47 C30 38 36 32 44 32 C51 32 56 36 60 42 C64 36 69 32 76 32 C84 32 90 38 90 47 C90 67 60 85 60 85Z" fill="rgba(255,100,100,0.3)" stroke="rgba(255,150,150,0.5)" strokeWidth="1.5"/>
        </svg>
      );
    case "star":
      return (
        <svg viewBox="0 0 120 120" className={cls} fill="none">
          <path d="M60 12 L68 42 L100 42 L74 60 L84 90 L60 72 L36 90 L46 60 L20 42 L52 42 Z" fill="rgba(201,168,76,0.35)" stroke="rgba(201,168,76,0.9)" strokeWidth="2" strokeLinejoin="round"/>
          <circle cx="60" cy="45" r="6" fill="rgba(255,255,255,0.5)"/>
          <circle cx="38" cy="30" r="2" fill="rgba(255,255,255,0.6)"/>
          <circle cx="82" cy="30" r="2" fill="rgba(255,255,255,0.6)"/>
        </svg>
      );
    case "compass":
      return (
        <svg viewBox="0 0 120 120" className={cls} fill="none">
          <circle cx="60" cy="60" r="44" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" fill="rgba(255,255,255,0.08)"/>
          <circle cx="60" cy="60" r="36" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none"/>
          <line x1="60" y1="18" x2="60" y2="28" stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="60" y1="92" x2="60" y2="102" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round"/>
          <line x1="18" y1="60" x2="28" y2="60" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round"/>
          <line x1="92" y1="60" x2="102" y2="60" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round"/>
          <path d="M60 30 L65 56 L60 52 L55 56 Z" fill="rgba(201,168,76,0.9)"/>
          <path d="M60 90 L65 64 L60 68 L55 64 Z" fill="rgba(255,255,255,0.4)"/>
          <circle cx="60" cy="60" r="5" fill="rgba(255,255,255,0.6)" stroke="rgba(201,168,76,0.8)" strokeWidth="1.5"/>
          <text x="60" y="22" textAnchor="middle" fontSize="9" fill="rgba(201,168,76,1)" fontWeight="bold">N</text>
        </svg>
      );
    case "scroll":
      return (
        <svg viewBox="0 0 120 120" className={cls} fill="none">
          <rect x="25" y="25" width="70" height="72" rx="5" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
          <ellipse cx="25" cy="61" rx="12" ry="36" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
          <ellipse cx="95" cy="61" rx="12" ry="36" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
          <line x1="40" y1="40" x2="82" y2="40" stroke="rgba(255,255,255,0.6)" strokeWidth="1.8" strokeLinecap="round"/>
          <line x1="40" y1="50" x2="82" y2="50" stroke="rgba(255,255,255,0.6)" strokeWidth="1.8" strokeLinecap="round"/>
          <line x1="40" y1="60" x2="75" y2="60" stroke="rgba(255,255,255,0.4)" strokeWidth="1.8" strokeLinecap="round"/>
          <line x1="40" y1="70" x2="82" y2="70" stroke="rgba(255,255,255,0.6)" strokeWidth="1.8" strokeLinecap="round"/>
          <line x1="40" y1="80" x2="65" y2="80" stroke="rgba(255,255,255,0.4)" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      );
    case "lantern":
      return (
        <svg viewBox="0 0 120 120" className={cls} fill="none">
          <line x1="60" y1="10" x2="60" y2="22" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round"/>
          <rect x="38" y="22" width="44" height="8" rx="3" fill="rgba(201,168,76,0.6)" stroke="rgba(201,168,76,0.9)" strokeWidth="1.5"/>
          <path d="M42 30 L36 90 L84 90 L78 30 Z" fill="rgba(201,168,76,0.15)" stroke="rgba(201,168,76,0.7)" strokeWidth="2"/>
          <ellipse cx="60" cy="60" rx="14" ry="18" fill="rgba(255,220,100,0.3)" stroke="rgba(255,220,100,0.5)" strokeWidth="1"/>
          <ellipse cx="60" cy="60" rx="7" ry="9" fill="rgba(255,220,100,0.6)"/>
          <rect x="38" y="88" width="44" height="8" rx="3" fill="rgba(201,168,76,0.6)" stroke="rgba(201,168,76,0.9)" strokeWidth="1.5"/>
        </svg>
      );
    case "crescent":
      return (
        <svg viewBox="0 0 120 120" className={cls} fill="none">
          <path d="M68 20 C48 25 35 45 40 67 C45 89 65 100 83 95 C61 105 35 90 28 67 C21 44 38 20 61 15 C63.5 14.3 65.8 14 68 14 Z" fill="rgba(201,168,76,0.4)" stroke="rgba(201,168,76,0.9)" strokeWidth="2"/>
          <path d="M75 28 L78 24 L81 28 L79.5 33 L78 32 L76.5 33 Z" fill="rgba(255,255,255,0.9)"/>
          <circle cx="90" cy="38" r="3" fill="rgba(255,255,255,0.8)"/>
          <circle cx="85" cy="22" r="1.5" fill="rgba(255,255,255,0.6)"/>
          <circle cx="100" cy="55" r="2" fill="rgba(255,255,255,0.6)"/>
        </svg>
      );
    case "mosque":
      return (
        <svg viewBox="0 0 120 120" className={cls} fill="none">
          <rect x="15" y="75" width="90" height="35" rx="3" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
          <path d="M30 75 C30 55 42 45 60 40 C78 45 90 55 90 75" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
          <path d="M42 75 C42 62 50 55 60 52 C70 55 78 62 78 75" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
          <path d="M55 52 L55 38 L60 32 L65 38 L65 52" stroke="rgba(201,168,76,0.8)" strokeWidth="2" fill="rgba(201,168,76,0.2)"/>
          <path d="M58 25 L60 20 L62 25" fill="rgba(201,168,76,1)"/>
          <rect x="15" y="65" width="10" height="40" rx="2" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
          <rect x="95" y="65" width="10" height="40" rx="2" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
          <rect x="50" y="85" width="20" height="25" rx="10" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
        </svg>
      );
    case "seed":
      return (
        <svg viewBox="0 0 120 120" className={cls} fill="none">
          <path d="M60 100 L60 50" stroke="rgba(255,255,255,0.6)" strokeWidth="3" strokeLinecap="round"/>
          <path d="M60 70 C60 70 40 65 35 48 C50 42 65 55 60 70Z" fill="rgba(100,200,120,0.4)" stroke="rgba(150,220,150,0.7)" strokeWidth="2"/>
          <path d="M60 58 C60 58 80 53 85 36 C70 30 55 43 60 58Z" fill="rgba(100,200,120,0.4)" stroke="rgba(150,220,150,0.7)" strokeWidth="2"/>
          <circle cx="60" cy="48" r="4" fill="rgba(201,168,76,0.7)" stroke="rgba(201,168,76,1)" strokeWidth="1"/>
        </svg>
      );
    case "water":
      return (
        <svg viewBox="0 0 120 120" className={cls} fill="none">
          <path d="M60 15 C60 15 30 50 30 72 C30 88 44 100 60 100 C76 100 90 88 90 72 C90 50 60 15 60 15Z" fill="rgba(100,180,255,0.25)" stroke="rgba(150,200,255,0.7)" strokeWidth="2.5"/>
          <path d="M60 30 C60 30 40 58 40 72 C40 83 49 90 60 90" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" fill="none"/>
          <ellipse cx="60" cy="75" rx="16" ry="8" fill="rgba(100,180,255,0.2)" stroke="rgba(150,200,255,0.4)" strokeWidth="1"/>
        </svg>
      );
    case "scale":
      return (
        <svg viewBox="0 0 120 120" className={cls} fill="none">
          <line x1="60" y1="15" x2="60" y2="95" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="25" y1="40" x2="95" y2="40" stroke="rgba(201,168,76,0.9)" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="60" cy="20" r="5" fill="rgba(201,168,76,0.8)" stroke="rgba(201,168,76,1)" strokeWidth="1.5"/>
          <line x1="25" y1="40" x2="25" y2="55" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round"/>
          <line x1="95" y1="40" x2="95" y2="55" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round"/>
          <path d="M15 55 Q25 62 35 55" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
          <path d="M85 55 Q95 62 105 55" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
          <path d="M60 90 L52 100 L68 100 Z" fill="rgba(255,255,255,0.4)"/>
          <path d="M8 55 L42 55" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round"/>
          <path d="M78 55 L112 55" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      );
    case "tree":
      return (
        <svg viewBox="0 0 120 120" className={cls} fill="none">
          <line x1="60" y1="95" x2="60" y2="65" stroke="rgba(180,130,80,0.8)" strokeWidth="5" strokeLinecap="round"/>
          <path d="M60 68 C60 68 35 55 32 30 C50 25 65 45 60 68Z" fill="rgba(80,180,100,0.35)" stroke="rgba(120,200,130,0.7)" strokeWidth="2"/>
          <path d="M60 55 C60 55 85 42 88 17 C70 12 55 32 60 55Z" fill="rgba(80,180,100,0.35)" stroke="rgba(120,200,130,0.7)" strokeWidth="2"/>
          <rect x="52" y="90" width="16" height="15" rx="3" fill="rgba(180,130,80,0.6)" stroke="rgba(180,130,80,0.8)" strokeWidth="1.5"/>
        </svg>
      );
    case "sun":
      return (
        <svg viewBox="0 0 120 120" className={cls} fill="none">
          <circle cx="60" cy="60" r="22" fill="rgba(255,220,80,0.35)" stroke="rgba(255,220,80,0.9)" strokeWidth="2.5"/>
          <circle cx="60" cy="60" r="14" fill="rgba(255,220,80,0.4)" stroke="rgba(255,220,80,0.7)" strokeWidth="1.5"/>
          {[0,45,90,135,180,225,270,315].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 60 + 28 * Math.cos(rad); const y1 = 60 + 28 * Math.sin(rad);
            const x2 = 60 + 40 * Math.cos(rad); const y2 = 60 + 40 * Math.sin(rad);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,220,80,0.8)" strokeWidth="2.5" strokeLinecap="round"/>;
          })}
          <circle cx="60" cy="60" r="7" fill="rgba(255,255,200,0.6)"/>
        </svg>
      );
    case "mountain":
      return (
        <svg viewBox="0 0 120 120" className={cls} fill="none">
          <path d="M10 95 L50 30 L90 95 Z" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinejoin="round"/>
          <path d="M45 95 L72 45 L99 95 Z" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinejoin="round"/>
          <path d="M40 50 L50 30 L60 50 Z" fill="rgba(255,255,255,0.6)" stroke="rgba(255,255,255,0.7)" strokeWidth="1"/>
          <path d="M65 55 L72 45 L79 55 Z" fill="rgba(255,255,255,0.5)" stroke="rgba(255,255,255,0.6)" strokeWidth="1"/>
          <line x1="10" y1="95" x2="110" y2="95" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      );
    case "honey":
      return (
        <svg viewBox="0 0 120 120" className={cls} fill="none">
          <path d="M40 30 L80 30 L95 57 L80 85 L40 85 L25 57 Z" fill="rgba(201,168,76,0.25)" stroke="rgba(201,168,76,0.8)" strokeWidth="2.5"/>
          <path d="M45 38 L75 38 L87 57 L75 77 L45 77 L33 57 Z" fill="rgba(201,168,76,0.15)" stroke="rgba(201,168,76,0.5)" strokeWidth="1.5"/>
          <line x1="60" y1="38" x2="60" y2="77" stroke="rgba(201,168,76,0.4)" strokeWidth="1.5"/>
          <line x1="33" y1="57" x2="87" y2="57" stroke="rgba(201,168,76,0.4)" strokeWidth="1.5"/>
          <path d="M55 85 C55 92 58 98 60 100 C62 98 65 92 65 85" stroke="rgba(201,168,76,0.7)" strokeWidth="2" strokeLinecap="round" fill="rgba(201,168,76,0.2)"/>
          <ellipse cx="60" cy="50" rx="10" ry="8" fill="rgba(255,220,80,0.3)" stroke="rgba(255,220,80,0.5)" strokeWidth="1"/>
        </svg>
      );
    case "pen":
      return (
        <svg viewBox="0 0 120 120" className={cls} fill="none">
          <path d="M80 15 L105 40 L40 100 L15 100 L15 75 Z" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinejoin="round"/>
          <path d="M80 15 L105 40 L95 50 L70 25 Z" fill="rgba(201,168,76,0.4)" stroke="rgba(201,168,76,0.8)" strokeWidth="1.5" strokeLinejoin="round"/>
          <line x1="70" y1="25" x2="40" y2="100" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
          <path d="M15 100 L15 75 L28 88 Z" fill="rgba(255,255,255,0.3)"/>
        </svg>
      );
    case "kaaba":
      return (
        <svg viewBox="0 0 120 120" className={cls} fill="none">
          <rect x="25" y="40" width="70" height="65" rx="3" fill="rgba(20,20,20,0.7)" stroke="rgba(201,168,76,0.8)" strokeWidth="2"/>
          <rect x="25" y="40" width="70" height="15" rx="0" fill="rgba(201,168,76,0.4)" stroke="rgba(201,168,76,0.6)" strokeWidth="1"/>
          <line x1="25" y1="55" x2="95" y2="55" stroke="rgba(201,168,76,0.7)" strokeWidth="1"/>
          <rect x="48" y="80" width="24" height="25" rx="3" fill="rgba(201,168,76,0.3)" stroke="rgba(201,168,76,0.6)" strokeWidth="1.5"/>
          <circle cx="60" cy="25" r="8" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
          <path d="M54 25 C55 20 65 20 66 25" stroke="rgba(201,168,76,0.9)" strokeWidth="1.5" fill="none"/>
          {[30,50,70,90,110].map((x, i) => (
            <circle key={i} cx={x} cy="105" r="3" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
          ))}
        </svg>
      );
    case "dove":
      return (
        <svg viewBox="0 0 120 120" className={cls} fill="none">
          <path d="M60 70 C40 65 20 50 25 35 C30 20 50 18 65 28 C80 18 100 20 100 35 C100 50 80 65 60 70Z" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.6)" strokeWidth="2"/>
          <path d="M60 70 L50 95 L60 85 L70 95 Z" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M25 35 L5 30 L20 42" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          <path d="M100 35 L115 28 L102 42" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          <circle cx="58" cy="30" r="3" fill="rgba(255,255,255,0.8)"/>
          <path d="M55 28 L52 26 L54 30" fill="rgba(201,168,76,0.8)"/>
        </svg>
      );
    case "tasbih":
      return (
        <svg viewBox="0 0 120 120" className={cls} fill="none">
          <path d="M60 15 C80 15 95 30 95 50 C95 70 80 85 60 85 C40 85 25 70 25 50 C25 30 40 15 60 15" stroke="rgba(201,168,76,0.7)" strokeWidth="2" fill="none" strokeDasharray="4 3"/>
          <circle cx="60" cy="15" r="5" fill="rgba(201,168,76,0.8)" stroke="rgba(201,168,76,1)" strokeWidth="1.5"/>
          <circle cx="85" cy="25" r="4.5" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"/>
          <circle cx="95" cy="50" r="4.5" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"/>
          <circle cx="85" cy="75" r="4.5" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"/>
          <circle cx="60" cy="85" r="4.5" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"/>
          <circle cx="35" cy="75" r="4.5" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"/>
          <circle cx="25" cy="50" r="4.5" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"/>
          <circle cx="35" cy="25" r="4.5" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"/>
          <line x1="60" y1="10" x2="60" y2="4" stroke="rgba(201,168,76,0.7)" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="60" cy="3" r="3" fill="rgba(201,168,76,0.5)" stroke="rgba(201,168,76,0.8)" strokeWidth="1"/>
          <path d="M57 95 L60 110 L63 95" stroke="rgba(201,168,76,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 120 120" className={cls} fill="none">
          <circle cx="60" cy="60" r="44" stroke="rgba(255,255,255,0.5)" strokeWidth="2" fill="rgba(255,255,255,0.1)"/>
        </svg>
      );
  }
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = ((s * 1664525) + 1013904223) & 0x7fffffff;
    const j = s % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function getDailySeed(): number {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

const ALL_ITEMS: FeedItem[] = [
  // ── TEXT CARDS ──────────────────────────────────────────────────────────────
  { id: 1, type: "hadith", tag: "Hadith", illustration: "book", gradient: "from-emerald-900 via-emerald-800 to-teal-900",
    title: "The Best of You", arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
    content: "The best among you are those who learn the Quran and teach it to others.\n\nThis hadith elevates both the student and the teacher. Learning the Quran elevates your rank, but teaching it multiplies your reward — every letter your student recites earns you the same reward.",
    source: "Sahih al-Bukhari 5027" },
  { id: 2, type: "quran", tag: "Quran", illustration: "crescent", gradient: "from-blue-900 via-indigo-900 to-purple-900",
    title: "Allah's Promise", arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا • إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    content: "For indeed, with hardship comes ease. Indeed, with hardship comes ease.\n\nNotice: Allah repeats this twice. 'Hardship' uses the definite article (same hardship), while 'ease' is indefinite — meaning for every one hardship, there are multiple eases.",
    source: "Quran 94:5–6" },
  { id: 3, type: "reminder", tag: "Reminder", illustration: "tasbih", gradient: "from-amber-900 via-orange-900 to-red-900",
    title: "The Tasbih After Every Prayer", arabic: "سُبْحَانَ اللهِ • الْحَمْدُ لِلَّهِ • اللهُ أَكْبَرُ",
    content: "33 SubhanAllah + 33 Alhamdulillah + 34 Allahu Akbar = 100 dhikr.\n\nThe Prophet ﷺ said: 'Whoever does this after every prayer, his sins will be forgiven, even if they are as vast as the ocean.' That's 500 dhikr daily — just 5 minutes.",
    source: "Sahih Muslim 597" },
  { id: 4, type: "fact", tag: "Did You Know?", illustration: "moon", gradient: "from-violet-900 via-purple-900 to-fuchsia-900",
    title: "Laylatul Qadr — One Night = 83 Years", arabic: "لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ",
    content: "The Night of Power is better than 1,000 months — over 83 years of worship in a single night!\n\nIf you stay up all night in worship during Laylatul Qadr, you earn the equivalent of a lifetime. The most likely night? The 27th of Ramadan.",
    source: "Quran 97:3" },
  { id: 5, type: "hadith", tag: "Hadith", illustration: "heart", gradient: "from-rose-900 via-pink-900 to-red-900",
    title: "A Smile is Sadaqah", arabic: "تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ",
    content: "Your smile in the face of your brother is charity.\n\nThe Prophet ﷺ also listed: giving good advice, helping load an animal, removing harmful objects from the road. Goodness is everywhere — you just have to look.",
    source: "Jami' at-Tirmidhi 1956" },
  { id: 6, type: "quran", tag: "Quran", illustration: "hands", gradient: "from-cyan-900 via-teal-900 to-emerald-900",
    title: "Trust in Allah Completely", arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    content: "And whoever relies upon Allah — then He is sufficient for him.\n\nTawakkul is not laziness. The Prophet ﷺ said: 'Tie your camel, then put your trust in Allah.' Do everything in your capacity, then leave the rest to Him.",
    source: "Quran 65:3" },
  { id: 7, type: "tip", tag: "Daily Tip", illustration: "sun", gradient: "from-sky-900 via-blue-900 to-indigo-900",
    title: "The Sunnah Morning Routine",
    content: "The Prophet ﷺ's morning routine:\n\n1. Wake before Fajr for Tahajjud\n2. Make Wudu\n3. Pray Fajr in congregation\n4. Read morning adhkar\n5. Eat dates for breakfast\n\nTry waking just 15 minutes before Fajr this week. The whole day changes." },
  { id: 8, type: "dua", tag: "Du'a", illustration: "shield", gradient: "from-slate-900 via-gray-900 to-zinc-800",
    title: "The Dua of Anxiety", arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ",
    content: "O Allah, I seek refuge in You from worry, grief, incapacity, and laziness.\n\nThis dua covers worry (present), grief (past), incapacity (inability to act), and laziness (unwillingness to act). Say it when you feel overwhelmed.",
    source: "Sahih al-Bukhari 6369" },
  { id: 9, type: "fact", tag: "Did You Know?", illustration: "water", gradient: "from-blue-900 via-cyan-900 to-teal-900",
    title: "Water — The Origin of Life", arabic: "وَجَعَلْنَا مِنَ الْمَاءِ كُلَّ شَيْءٍ حَيٍّ",
    content: "We made from water every living thing.\n\nScientists confirmed all life began in water in the 20th century. The Quran stated this 1,400 years ago. The word 'water' appears 63 times in the Quran. SubhanAllah.",
    source: "Quran 21:30" },
  { id: 10, type: "hadith", tag: "Hadith", illustration: "heart", gradient: "from-pink-900 via-rose-900 to-red-900",
    title: "Paradise Lies at Her Feet", arabic: "الْجَنَّةُ تَحْتَ أَقْدَامِ الْأُمَّهَاتِ",
    content: "A man asked: 'Who is most deserving of my good companionship?' The Prophet ﷺ replied: 'Your mother.' Three times. Only on the fourth did he say: 'Then your father.' Her rank is three times his.",
    source: "Sunan an-Nasa'i 3104" },
  { id: 11, type: "quran", tag: "Quran", illustration: "lantern", gradient: "from-emerald-900 via-green-900 to-lime-900",
    title: "Remember Me — I Remember You", arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ",
    content: "Remember Me, and I will remember you. Be grateful to Me, and do not deny Me.\n\nImagine: the Lord of the heavens remembers YOU personally. Every SubhanAllah, every silent thought of Allah — He remembers you in a gathering better than yours.",
    source: "Quran 2:152" },
  { id: 12, type: "reminder", tag: "Reminder", illustration: "scale", gradient: "from-amber-900 via-yellow-900 to-orange-900",
    title: "Heavier Than the Heavens", arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ",
    content: "The Prophet ﷺ said: 'If the heavens and the earth were placed on one side of a scale, and La ilaha illAllah on the other side, it would outweigh them all.'\n\nYou have in your tongue something heavier than the entire universe.",
    source: "Musnad Ahmad" },
  { id: 13, type: "tip", tag: "Daily Tip", illustration: "water", gradient: "from-teal-900 via-cyan-900 to-blue-900",
    title: "Wudu — Where Science Meets Sunnah",
    content: "Wudu is not just spiritual cleansing:\n\n• Washing the face activates the diving reflex — slows heart rate, reduces stress\n• Rinsing the mouth removes 300+ bacteria per ml\n• Wiping the head massages acupressure points\n\nPerfect hygiene 1,400 years before germ theory." },
  { id: 14, type: "quran", tag: "Quran", illustration: "hands", gradient: "from-indigo-900 via-violet-900 to-purple-900",
    title: "Call Upon Me — I Answer", arabic: "ادْعُونِي أَسْتَجِبْ لَكُمْ",
    content: "Call upon Me; I will respond to you.\n\nAllah doesn't say 'I might respond.' He says I WILL respond. Your dua is always answered — sometimes immediately, sometimes delayed, sometimes reward saved for Akhirah. Never stop making dua.",
    source: "Quran 40:60" },
  { id: 15, type: "hadith", tag: "Hadith", illustration: "seed", gradient: "from-green-900 via-emerald-900 to-teal-900",
    title: "Plant Even at the End of Time",
    content: "The Prophet ﷺ said: 'If the Hour is about to be established and one of you was holding a palm shoot — if he can plant it before the Hour comes, let him plant it.'\n\nAlways do good. Never let circumstances make you give up.",
    source: "Musnad Ahmad 12491" },
  { id: 16, type: "dua", tag: "Du'a", illustration: "moon", gradient: "from-slate-900 via-indigo-900 to-blue-900",
    title: "The Dua Before Sleeping", arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    content: "In Your name, O Allah, I die and I live.\n\nThe Prophet ﷺ said this every night. Sleep is called 'the minor death' in Islam — each night Allah takes our souls, each morning is a resurrection. My life and death are in Your hands.",
    source: "Sahih al-Bukhari 6324" },
  { id: 17, type: "fact", tag: "Did You Know?", illustration: "star", gradient: "from-gray-900 via-slate-800 to-zinc-900",
    title: "Iron Was Sent Down from Space", arabic: "وَأَنزَلْنَا الْحَدِيدَ فِيهِ بَأْسٌ شَدِيدٌ",
    content: "Allah says: 'We sent down iron.' Modern astrophysics confirms iron on Earth came from meteorites and supernovae. The Quran described iron as being 'sent down' 1,400 years before NASA confirmed extraterrestrial iron.",
    source: "Quran 57:25" },
  { id: 18, type: "reminder", tag: "Reminder", illustration: "compass", gradient: "from-emerald-900 via-teal-900 to-cyan-900",
    title: "Istighfar — The Master Key", arabic: "أَسْتَغْفِرُ اللهَ وَأَتُوبُ إِلَيْهِ",
    content: "The Prophet ﷺ made Istighfar 100 times DAILY — despite being sinless.\n\nIbn Abbas: 'Whoever makes Istighfar regularly, Allah will relieve every distress, find a way out from every difficulty, and provide from where they don't expect.'",
    source: "Sahih Muslim 2702" },
  { id: 19, type: "quran", tag: "Quran", illustration: "lantern", gradient: "from-purple-900 via-violet-900 to-fuchsia-900",
    title: "Allah is Closer Than You Think", arabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ",
    content: "When My servants ask about Me — indeed I am near. I respond to the caller when he calls.\n\nEvery other verse has 'Say:' before the answer. But here, Allah responds DIRECTLY about where He is — no intermediary. He is near.",
    source: "Quran 2:186" },
  { id: 20, type: "tip", tag: "Daily Tip", illustration: "scroll", gradient: "from-amber-900 via-orange-900 to-red-900",
    title: "Surah Al-Mulk — Your Grave's Protector", arabic: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ",
    content: "Read Surah Al-Mulk every night before sleeping.\n\nThe Prophet ﷺ said it intercedes for its reader until they are forgiven, and protects from the punishment of the grave. Only 30 verses — 5 minutes. In 30 days, you can memorize it.",
    source: "Jami' at-Tirmidhi 2891" },
  { id: 21, type: "hadith", tag: "Hadith", illustration: "tasbih", gradient: "from-yellow-900 via-amber-900 to-orange-900",
    title: "Two Words — Infinite Weight", arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ۝ سُبْحَانَ اللَّهِ الْعَظِيمِ",
    content: "SubhanAllahi wa bihamdihi, SubhanAllahil Azeem.\n\nTwo words light on the tongue, heavy on the scale of deeds, beloved to the Most Merciful. Say them 100 times in morning and evening. That's it. That's the deed.",
    source: "Sahih al-Bukhari 6406" },
  { id: 22, type: "fact", tag: "Did You Know?", illustration: "mountain", gradient: "from-stone-900 via-gray-800 to-slate-900",
    title: "Mountains Have Deep Roots", arabic: "أَلَمْ نَجْعَلِ الْأَرْضَ مِهَادًا • وَالْجِبَالَ أَوْتَادًا",
    content: "The Quran calls mountains 'pegs'. Modern geology confirms mountains have roots 3–6x their visible height underground — exactly like pegs. Mount Everest is 8.8km above sea level but extends ~250km below.",
    source: "Quran 78:6–7" },
  { id: 23, type: "dua", tag: "Du'a", illustration: "mosque", gradient: "from-emerald-900 via-green-800 to-teal-900",
    title: "Entering the Masjid", arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
    content: "O Allah, open the doors of Your mercy for me.\n\nEnter with your right foot. When leaving, say: 'Allahumma inni as'aluka min fadlak.' The Masjid is the house of Allah — you receive mercy just by being there.",
    source: "Sahih Muslim 713" },
  { id: 24, type: "reminder", tag: "Reminder", illustration: "heart", gradient: "from-rose-900 via-pink-900 to-fuchsia-900",
    title: "Salawat on the Prophet ﷺ", arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ",
    content: "Every salawat = 10 blessings from Allah on you. He will intercede for you on the Day of Judgment. 10 in the morning + 10 at night earns his intercession.\n\n'The miser is the one in whose presence I am mentioned and he does not send salawat.'",
    source: "Sunan Abu Dawud 1047" },
  { id: 25, type: "quran", tag: "Quran", illustration: "hands", gradient: "from-sky-900 via-blue-900 to-indigo-900",
    title: "Never Despair of Allah's Mercy", arabic: "لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا",
    content: "Do not despair of the mercy of Allah. Indeed, Allah forgives ALL sins.\n\n'All sins' — no exception. If you feel you've gone too far, you haven't. The door of tawbah is open until your last breath.",
    source: "Quran 39:53" },
  { id: 26, type: "tip", tag: "Daily Tip", illustration: "honey", gradient: "from-amber-800 via-yellow-900 to-orange-900",
    title: "The Sunnah of Honey", arabic: "فِيهِ شِفَاءٌ لِّلنَّاسِ",
    content: "The Quran says: 'There comes from their bellies a drink of varying colors, in which there is healing for people.'\n\nModern research: antibacterial against MRSA, heals wounds, boosts immunity, reduces cough better than medicine. Eat 1 tsp raw honey every morning.",
    source: "Quran 16:69" },
  { id: 27, type: "hadith", tag: "Hadith", illustration: "seed", gradient: "from-lime-900 via-green-900 to-emerald-900",
    title: "Removing Harm is Faith", arabic: "الإِيمَانُ بِضْعٌ وَسَبْعُونَ شُعْبَةً",
    content: "Faith has 70+ branches. The highest is 'La ilaha illAllah'. The lowest is removing something harmful from the road.\n\nThe Prophet ﷺ moved a branch lying on a path and said it was worth a branch of iman. Every small act counts.",
    source: "Sahih Muslim 35" },
  { id: 28, type: "fact", tag: "Did You Know?", illustration: "star", gradient: "from-indigo-900 via-blue-900 to-violet-900",
    title: "The Universe is Expanding", arabic: "وَالسَّمَاءَ بَنَيْنَاهَا بِأَيْدٍ وَإِنَّا لَمُوسِعُونَ",
    content: "The Quran: 'We built the heavens with power, and We are expanding it.' Edwin Hubble discovered cosmic expansion in 1929. The Quran stated it 1,400 years earlier. From a single point, expanding for 13.8 billion years.",
    source: "Quran 51:47" },
  { id: 29, type: "dua", tag: "Du'a", illustration: "pen", gradient: "from-teal-900 via-cyan-900 to-sky-900",
    title: "Increase My Knowledge", arabic: "رَبِّ زِدْنِي عِلْمًا",
    content: "My Lord, increase me in knowledge.\n\nThe ONLY thing in the Quran where the Prophet ﷺ was commanded to ask for MORE of something. Not wealth, not power — knowledge.\n\nSay this before studying, before reading. Ask Allah to make knowledge stick.",
    source: "Quran 20:114" },
  { id: 30, type: "reminder", tag: "Reminder", illustration: "tree", gradient: "from-amber-900 via-orange-800 to-yellow-900",
    title: "Shukr Multiplies Your Blessings", arabic: "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
    content: "If you are grateful, I will surely increase you in blessing.\n\nAllah uses a lam of oath — 'I SWEAR I will increase you.' A divine guarantee.\n\nStart a gratitude practice: write 3 blessings every night. After 21 days, your baseline happiness rises measurably.",
    source: "Quran 14:7" },

  // NEW CARDS 31–72 ────────────────────────────────────────────────────────────
  { id: 31, type: "hadith", tag: "Hadith", illustration: "scroll", gradient: "from-emerald-900 via-teal-900 to-green-900",
    title: "Actions by Intentions", arabic: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ",
    content: "Actions are only by intentions, and every person will have only what they intended.\n\nThis is one of the most foundational hadith in Islam. The same deed — one person does for Allah, another for show. Same action, opposite value. Purify your intention before everything.",
    source: "Sahih al-Bukhari 1" },
  { id: 32, type: "quran", tag: "Quran", illustration: "shield", gradient: "from-blue-900 via-sky-900 to-cyan-900",
    title: "Allah Burdens No One Beyond Capacity", arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
    content: "Allah does not burden a soul beyond that it can bear.\n\nWhatever you are going through — Allah has already determined you can handle it. Not because it's easy, but because He knows your strength better than you do. You are stronger than you feel.",
    source: "Quran 2:286" },
  { id: 33, type: "tip", tag: "Daily Tip", illustration: "moon", gradient: "from-slate-900 via-blue-900 to-indigo-900",
    title: "The Power of Tahajjud",
    content: "Tahajjud — the night prayer — is the most recommended voluntary prayer in Islam.\n\nThe Prophet ﷺ never abandoned it. It's prayed after waking from sleep, before Fajr. Even 2 rak'ahs is enough to start. The stillness of the night makes your dua penetrate the heavens." },
  { id: 34, type: "fact", tag: "Did You Know?", illustration: "water", gradient: "from-teal-900 via-blue-900 to-slate-900",
    title: "Zamzam — Scientifically Unique",
    content: "Zamzam water has been flowing for over 4,000 years and has never dried up — despite millions drawing from it annually during Hajj.\n\nStudies show it has a unique mineral composition unlike any other water source on Earth. The Prophet ﷺ said it is 'a food that satisfies and a cure for illness.'" },
  { id: 35, type: "dua", tag: "Du'a", illustration: "hands", gradient: "from-emerald-900 via-green-900 to-teal-900",
    title: "The Dua for Guidance", arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
    content: "Guide us to the straight path.\n\nYou recite this 17 times EVERY day in Salah — yet how often do you truly feel its weight? This is the most repeated dua in existence. You're asking Allah for guidance, and He is already answering by keeping you on the path.",
    source: "Quran 1:6" },
  { id: 36, type: "tip", tag: "Daily Tip", illustration: "honey", gradient: "from-green-900 via-emerald-900 to-lime-900",
    title: "Sunnah Superfoods",
    content: "The Prophet ﷺ recommended these for health:\n\n• Dates — energy, minerals, iron\n• Black seed (Nigella Sativa) — 'a cure for every disease except death'\n• Olive oil — anti-inflammatory\n• Honey — antibacterial\n• Figs — mentioned in the Quran, high in fibre\n\nAll confirmed by modern nutrition." },
  { id: 37, type: "quran", tag: "Quran", illustration: "scale", gradient: "from-red-900 via-rose-900 to-pink-900",
    title: "Saving One Life = Saving All of Humanity", arabic: "مَن قَتَلَ نَفْسًا... فَكَأَنَّمَا قَتَلَ النَّاسَ جَمِيعًا",
    content: "Whoever kills a person... it is as though he has killed all of mankind. And whoever saves a life, it is as though he has saved all of mankind.\n\nEvery act of kindness, every life you protect — you are preserving all of humanity symbolically.",
    source: "Quran 5:32" },
  { id: 38, type: "quran", tag: "Quran", illustration: "scale", gradient: "from-amber-900 via-orange-900 to-yellow-900",
    title: "Surah Al-Asr — The Formula for Success", arabic: "وَالْعَصْرِ • إِنَّ الْإِنسَانَ لَفِي خُسْرٍ",
    content: "By time! Indeed, mankind is in loss — except those who believe, do righteous deeds, urge each other to truth, and urge each other to patience.\n\nImam Ash-Shafi'i said: 'If people reflected only on this surah, it would be sufficient for them.'",
    source: "Quran 103:1–3" },
  { id: 39, type: "reminder", tag: "Reminder", illustration: "scroll", gradient: "from-teal-900 via-emerald-900 to-green-900",
    title: "Don't Delay Tawbah",
    content: "The Prophet ﷺ said: 'Allah accepts the repentance of a servant as long as the death rattle has not yet reached his throat.'\n\nThere is no sin too great, no gap too long. The only condition is sincerity. Don't let Shaytan convince you that you've gone too far. You haven't.",
    source: "Jami' at-Tirmidhi 3537" },
  { id: 40, type: "fact", tag: "Did You Know?", illustration: "kaaba", gradient: "from-stone-900 via-slate-900 to-gray-900",
    title: "The Ka'bah — First House on Earth", arabic: "إِنَّ أَوَّلَ بَيْتٍ وُضِعَ لِلنَّاسِ لَلَّذِي بِبَكَّةَ مُبَارَكًا",
    content: "The first house of worship established for people was the one at Makkah.\n\nOver 2 million people circle it during Hajj each year. The Ka'bah is the only structure on Earth that humans have been circumambulating continuously for thousands of years. It is the heartbeat of Islam.",
    source: "Quran 3:96" },
  { id: 41, type: "dua", tag: "Du'a", illustration: "heart", gradient: "from-rose-900 via-red-900 to-pink-900",
    title: "Dua for Your Parents", arabic: "رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
    content: "My Lord, have mercy upon them as they raised me when I was young.\n\nThis verse is a reminder: your parents had no instruction manual. They gave you what they had. Whether they're alive or passed, this dua reaches them. Say it for them tonight.",
    source: "Quran 17:24" },
  { id: 42, type: "tip", tag: "Daily Tip", illustration: "sun", gradient: "from-amber-800 via-yellow-800 to-orange-900",
    title: "The Golden Hour After Asr",
    content: "The Prophet ﷺ said deeds are presented to Allah twice a week, on Mondays and Thursdays.\n\nAnd deeds are presented daily after Asr — the hour when most people are distracted.\n\nMake it your habit to say 100x Astaghfirullah between Asr and Maghrib. Let your last presented deed be seeking forgiveness." },
  { id: 43, type: "hadith", tag: "Hadith", illustration: "shield", gradient: "from-indigo-900 via-blue-900 to-cyan-900",
    title: "Be Mindful of Allah", arabic: "احْفَظِ اللَّهَ يَحْفَظْكَ",
    content: "Be mindful of Allah, and He will protect you. Be mindful of Allah, and you will find Him before you.\n\nWhen you guard Allah's limits — His halal and haram — He guards your affairs in return. No bodyguard, no insurance, no protection compares to Allah's care over a believer.",
    source: "Jami' at-Tirmidhi 2516" },
  { id: 44, type: "quran", tag: "Quran", illustration: "sun", gradient: "from-amber-900 via-orange-800 to-yellow-900",
    title: "Surah Ad-Duha — You Are Not Abandoned", arabic: "مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ",
    content: "Your Lord has not taken leave of you, nor has He detested you.\n\nThis surah was revealed when the Prophet ﷺ went through a period of silence from revelation and felt grief. Allah responded personally. If you feel Allah has forgotten you — He has not. This surah is for you.",
    source: "Quran 93:3" },
  { id: 45, type: "reminder", tag: "Reminder", illustration: "heart", gradient: "from-teal-900 via-cyan-900 to-blue-900",
    title: "Gratitude for Your Health",
    content: "The Prophet ﷺ said: 'Whoever wakes up healthy in body, safe in his home, and has his daily food — it is as if the whole world has been given to him.'\n\nPause right now. You are reading this. You are breathing. You have eyes, a working mind, safety. Say Alhamdulillah.",
    source: "Jami' at-Tirmidhi 2346" },
  { id: 46, type: "fact", tag: "Did You Know?", illustration: "moon", gradient: "from-gray-900 via-slate-800 to-zinc-900",
    title: "The Moon Split — A Verified Miracle",
    content: "The Quran states: 'The Hour has come near and the moon was split.' This was a physical miracle performed by the Prophet ﷺ witnessed by hundreds in Makkah.\n\nAncient Indian astronomical records from Kerala also reference a lunar anomaly in the same period.",
    source: "Quran 54:1" },
  { id: 47, type: "dua", tag: "Du'a", illustration: "shield", gradient: "from-slate-900 via-gray-900 to-zinc-900",
    title: "Waking from a Bad Dream", arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
    content: "If you wake from a nightmare:\n\n1. Seek refuge with Allah: 'A'udhu billahi minash-shaytanir rajim'\n2. Spit lightly to your left three times\n3. Turn to the other side\n4. Do NOT tell anyone the dream\n\nThe Prophet ﷺ said bad dreams are from Shaytan and they cannot harm you if you follow this.",
    source: "Sahih Muslim 2262" },
  { id: 48, type: "tip", tag: "Daily Tip", illustration: "mosque", gradient: "from-emerald-900 via-green-900 to-teal-900",
    title: "Congregation = 27x Reward",
    content: "The Prophet ﷺ said: 'The prayer in congregation is 27 times better than the prayer prayed alone.'\n\nThat means every Fajr in the masjid equals 27 Fajrs prayed at home. Over a lifetime, that's a staggering multiplication of worship. The masjid is never a detour — it's always worth it." },
  { id: 49, type: "hadith", tag: "Hadith", illustration: "pen", gradient: "from-blue-900 via-indigo-900 to-violet-900",
    title: "Seek Knowledge",
    content: "The Prophet ﷺ said: 'Seeking knowledge is an obligation upon every Muslim.'\n\nKnowledge of what? Begin with the obligations: how to pray, how to fast, what is halal and haram. Then expand. The pen is mightier than the sword — and a knowledgeable Muslim changes the world.",
    source: "Sunan Ibn Majah 224" },
  { id: 50, type: "quran", tag: "Quran", illustration: "quran", gradient: "from-emerald-900 via-teal-900 to-green-900",
    title: "Surah Al-Ikhlas = One Third of Quran", arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ",
    content: "Say: He is Allah, the One. Allah, the Eternal Refuge. He neither begets nor is born. And there is none comparable to Him.\n\nThe Prophet ﷺ said this surah equals one-third of the Quran. Read it 3 times and you've read the full Quran's worth of reward.",
    source: "Quran 112 | Sahih al-Bukhari 5013" },
  { id: 51, type: "reminder", tag: "Reminder", illustration: "scroll", gradient: "from-gray-900 via-zinc-900 to-slate-900",
    title: "The Barzakh — Between Worlds",
    content: "After death, every soul enters the Barzakh — a barrier between this life and the Akhirah.\n\nThe righteous experience it as a garden. The unjust as a pit. Every deed you send ahead continues to benefit you there. Your sadaqah jariyah, your raised children, your knowledge shared — all still flowing.",
    source: "Quran 23:100" },
  { id: 52, type: "fact", tag: "Did You Know?", illustration: "quran", gradient: "from-emerald-900 via-green-900 to-teal-900",
    title: "Al-Fatiha — 17 Times a Day",
    content: "Surah Al-Fatiha is recited at least 17 times every single day in obligatory prayers — more than any other portion of the Quran.\n\nIt contains a complete theology: praise, majesty, worship, help, guidance, warning. It's not just an opening — it's the entire religion in 7 verses." },
  { id: 53, type: "dua", tag: "Du'a", illustration: "shield", gradient: "from-violet-900 via-purple-900 to-blue-900",
    title: "Protection from the Evil Eye", arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ",
    content: "In the name of Allah, with Whose name nothing on earth or in heaven can cause harm, and He is the All-Hearing, All-Knowing.\n\nSay this 3 times in the morning and evening. The Prophet ﷺ said: 'Nothing will harm him.'" },
  { id: 54, type: "tip", tag: "Daily Tip", illustration: "seed", gradient: "from-lime-900 via-green-900 to-emerald-900",
    title: "The Power of Sadaqah",
    content: "The Prophet ﷺ said: 'Charity does not decrease wealth.'\n\nIn fact, the opposite: sadaqah creates barakah. It extinguishes sins like water extinguishes fire. It protects from calamity. Try: give £1 every single day for 30 days — watch what changes in your life.",
    source: "Sahih Muslim 2588" },
  { id: 55, type: "hadith", tag: "Hadith", illustration: "heart", gradient: "from-orange-900 via-amber-900 to-yellow-900",
    title: "Every Act of Good is Sadaqah",
    content: "The Prophet ﷺ said: 'Every act of goodness is charity. Part of goodness is that you meet your brother with a cheerful face, and that you pour some water from your bucket into the vessel of your brother.'\n\nGoodness doesn't require money. It requires presence.",
    source: "Jami' at-Tirmidhi 1970" },
  { id: 56, type: "quran", tag: "Quran", illustration: "book", gradient: "from-teal-900 via-cyan-900 to-sky-900",
    title: "Begin With Bismillah", arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    content: "In the name of Allah, the Most Gracious, the Most Merciful.\n\nThis phrase appears 114 times in the Quran. The Prophet ﷺ taught: begin every matter with Bismillah. Eating, driving, entering home, beginning work — bring Allah's name into it and watch how the blessing enters too.",
    source: "Quran 1:1" },
  { id: 57, type: "reminder", tag: "Reminder", illustration: "crescent", gradient: "from-slate-900 via-zinc-900 to-gray-900",
    title: "Death is a Motivator, Not a Fear",
    content: "The Prophet ﷺ said: 'Remember frequently the destroyer of pleasures: death.'\n\nNot to make you sad, but to make you alive. When you know the meeting with Allah is close, you waste less, love more, forgive faster, pray earlier. Death is the greatest productivity hack.",
    source: "Jami' at-Tirmidhi 2307" },
  { id: 58, type: "fact", tag: "Did You Know?", illustration: "star", gradient: "from-indigo-900 via-violet-900 to-blue-900",
    title: "The Language of Paradise",
    content: "Many scholars hold that the language of Paradise is Arabic — the language of the Quran, of the Prophet ﷺ, of the adhkar said in every prayer.\n\nEvery Arabic word of the Quran you learn, every Arabic phrase of dhikr you master — you are learning the language of your eternal home.",
    source: "Ibn Al-Qayyim, Haadi al-Arwah" },
  { id: 59, type: "dua", tag: "Du'a", illustration: "hands", gradient: "from-emerald-900 via-green-900 to-lime-900",
    title: "The Power of Ameen", arabic: "آمِين",
    content: "When you say 'Ameen' at the end of Al-Fatiha, you are saying: 'O Allah, respond to this dua.'\n\nThe Prophet ﷺ said: 'When the imam says Ameen, say Ameen — for whoever's Ameen coincides with the angels' Ameen, all his previous sins are forgiven.'\n\nNever say it absent-mindedly again.",
    source: "Sahih al-Bukhari 780" },
  { id: 60, type: "tip", tag: "Daily Tip", illustration: "scroll", gradient: "from-amber-900 via-yellow-900 to-orange-800",
    title: "Disconnect to Reconnect",
    content: "The Prophet ﷺ would sit with companions and give them undivided attention. Phones didn't exist, but distractions did — and he chose presence.\n\nTry: 30 minutes before Fajr and 30 minutes after Isha — phone off. Fill it with Quran, dhikr, or silent reflection. Your soul will thank you." },
  { id: 61, type: "hadith", tag: "Hadith", illustration: "dove", gradient: "from-sky-900 via-blue-900 to-cyan-900",
    title: "The Merciful are Shown Mercy", arabic: "الرَّاحِمُونَ يَرْحَمُهُمُ الرَّحْمَنُ",
    content: "The merciful will be shown mercy by the Most Merciful. Be merciful to those on earth — He Who is in the heavens will be merciful to you.\n\nMercy to animals, to children, to strangers, to those who wronged you — it all comes back multiplied from Allah.",
    source: "Jami' at-Tirmidhi 1924" },
  { id: 62, type: "quran", tag: "Quran", illustration: "lantern", gradient: "from-purple-900 via-fuchsia-900 to-pink-900",
    title: "Allah is As-Sabur — The Patient", arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    content: "Indeed, Allah is with the patient ones.\n\nPatience (sabr) in Islam has three forms: patience in worship, patience in avoiding sin, patience in accepting Allah's decree. Each form has its own reward. When you combine all three, you become unstoppable.",
    source: "Quran 2:153" },
  { id: 63, type: "reminder", tag: "Reminder", illustration: "mosque", gradient: "from-green-900 via-emerald-900 to-teal-900",
    title: "Friday — The Master of All Days",
    content: "The Prophet ﷺ said: 'The best day on which the sun rises is Friday.'\n\nOn Fridays:\n• Send abundant salawat on the Prophet ﷺ\n• Read Surah Al-Kahf\n• Make dua in the special hour (scholars say it's near Asr)\n• Seek forgiveness\n\nFriday is a weekly Eid for believers." },
  { id: 64, type: "fact", tag: "Did You Know?", illustration: "kaaba", gradient: "from-amber-900 via-orange-900 to-red-900",
    title: "Makkah — Center of the Earth",
    content: "Studies using satellite data show that Makkah is geographically close to the center of the Earth's land masses.\n\nWhen you face Qibla, all 1.9 billion Muslims on Earth are facing the same single point. No other act unifies humanity so completely across time zones, continents, and cultures.",
    source: "Global Compass Studies" },
  { id: 65, type: "dua", tag: "Du'a", illustration: "moon", gradient: "from-indigo-900 via-blue-900 to-slate-900",
    title: "Dua When You See the New Moon", arabic: "اللَّهُمَّ أَهِلَّهُ عَلَيْنَا بِالْأَمْنِ وَالْإِيمَانِ",
    content: "O Allah, bring it over us with security and faith, safety and Islam. My Lord and your Lord is Allah.\n\nEvery new month is a fresh start — the Prophet ﷺ taught us to greet it with dua. A new crescent = 30 new days of opportunity.",
    source: "Jami' at-Tirmidhi 3451" },
  { id: 66, type: "hadith", tag: "Hadith", illustration: "tasbih", gradient: "from-teal-900 via-green-900 to-emerald-900",
    title: "Sitting After Fajr — Light of the Day", arabic: "من صلى الفجر في جماعة ثم قعد يذكر الله",
    content: "Whoever prays Fajr in congregation, then sits making dhikr of Allah until the sun rises, then prays two rak'ahs — they will have the reward of a complete Hajj and Umrah.\n\nThe Prophet ﷺ said: complete, complete, complete. That window between Fajr and sunrise is pure gold.",
    source: "Jami' at-Tirmidhi 586" },
  { id: 67, type: "quran", tag: "Quran", illustration: "dove", gradient: "from-rose-900 via-pink-900 to-fuchsia-900",
    title: "Al-Wadud — The All-Loving", arabic: "وَهُوَ الْغَفُورُ الْوَدُودُ",
    content: "He is the Forgiving, the All-Loving.\n\nWaduud is one of the most beautiful names of Allah. Not just 'one who loves' but 'one who is Love.' His love is not earned through perfection — it's freely given to the one who turns to Him. Even in your worst moments, you are loved.",
    source: "Quran 85:14" },
  { id: 68, type: "tip", tag: "Daily Tip", illustration: "seed", gradient: "from-lime-900 via-green-900 to-teal-900",
    title: "Plant a Sadaqah Jariyah",
    content: "The Prophet ﷺ said: 'When a person dies, all their deeds end — except three: ongoing charity (sadaqah jariyah), knowledge that benefits others, or a righteous child who prays for them.'\n\nPlant a tree, donate to a masjid, teach someone Quran, write beneficial knowledge. Let your good deeds outlive you.",
    source: "Sahih Muslim 1631" },
  { id: 69, type: "reminder", tag: "Reminder", illustration: "hands", gradient: "from-purple-900 via-indigo-900 to-blue-900",
    title: "Dhikr — The Nourishment of Hearts", arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    content: "Verily, in the remembrance of Allah do hearts find rest.\n\nAnxiety, emptiness, restlessness — all cured by the same prescription. Not therapy (though that helps), not distraction (that just delays), but the remembrance of the One who made the heart. Start with 100 SubhanAllah today.",
    source: "Quran 13:28" },
  { id: 70, type: "fact", tag: "Did You Know?", illustration: "book", gradient: "from-emerald-900 via-teal-900 to-cyan-900",
    title: "The Quran Has Never Changed",
    content: "The Quran is the only religious scripture in the world that has remained 100% unchanged for 1,400 years.\n\nMillions of hafidh (memorisers) preserve it in their hearts across every generation. If every physical copy were destroyed tonight, the Quran would be restored word-for-word by morning.",
    source: "Quran 15:9 — 'Indeed, We sent down the Reminder, and indeed, We will be its guardian.'" },
  { id: 71, type: "dua", tag: "Du'a", illustration: "lantern", gradient: "from-amber-900 via-orange-900 to-yellow-900",
    title: "The Dua of Prophet Yunus (AS)", arabic: "لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ",
    content: "There is no god but You. Glory be to You. Indeed, I have been of the wrongdoers.\n\nYunus (AS) said this from inside the belly of the whale, in the depths of the ocean, in the darkness of night. If Allah answered him there — He will answer you here.",
    source: "Quran 21:87" },
  { id: 72, type: "hadith", tag: "Hadith", illustration: "star", gradient: "from-violet-900 via-purple-900 to-indigo-900",
    title: "The Prophet ﷺ on Good Character", arabic: "إِنَّمَا بُعِثْتُ لِأُتَمِّمَ مَكَارِمَ الْأَخْلَاقِ",
    content: "I was only sent to perfect good character.\n\nThe entire mission of the Prophet ﷺ — all 23 years of prophethood, all the sacrifices and trials — can be summarized in this one sentence. Islam is akhlaq. Your character IS your religion.",
    source: "Al-Bayhaqi, Sha'b al-Iman" },

  // ── HALALTOK VIDEO FEED ──────────────────────────────────────────────────────
  { id: 101, type: "video", tag: "HalalTok", illustration: "none", gradient: "from-black via-gray-900 to-zinc-900",
    title: "Only Complain To Allah", youtubeId: "k-unPWLT2YE", channel: "Mufti Menk", duration: "—",
    content: "Stop seeking sympathy from people — bring your pain only to the One who can actually fix it." },
  { id: 102, type: "video", tag: "HalalTok", illustration: "none", gradient: "from-black via-emerald-950 to-teal-950",
    title: "Dhikr - A Solution to Calm The Heart", youtubeId: "GK7CxaxCMvw", channel: "Omar Suleiman", duration: "—",
    content: "When anxiety grips you, dhikr is the prescription Allah gave us — and it actually works." },
  { id: 103, type: "video", tag: "HalalTok", illustration: "none", gradient: "from-black via-indigo-950 to-blue-950",
    title: "How to Calm a Turbulent Heart", youtubeId: "0jOMewDuqMI", channel: "Nouman Ali Khan", duration: "—",
    content: "When the heart is restless, where do you turn? Nouman Ali Khan shares a Quranic path to peace." },
  { id: 104, type: "video", tag: "HalalTok", illustration: "none", gradient: "from-black via-amber-950 to-yellow-950",
    title: "Truly Liberated", youtubeId: "DUimTlNWD4o", channel: "Mufti Menk", duration: "—",
    content: "Real freedom isn't found in the world — it's found when you submit to Allah completely." },
  { id: 105, type: "video", tag: "HalalTok", illustration: "none", gradient: "from-black via-slate-900 to-gray-900",
    title: "Never Stay Neutral", youtubeId: "Cu_5bXKWqwg", channel: "Mufti Menk", duration: "—",
    content: "Silence in the face of wrongdoing isn't neutrality — it's complicity. Stand for what's right." },
  { id: 106, type: "video", tag: "HalalTok", illustration: "none", gradient: "from-black via-violet-950 to-purple-950",
    title: "The Night Allah Changes Everything", youtubeId: "6JDQNsJZ5bg", channel: "Mufti Menk", duration: "—",
    content: "Laylatul Qadr — a night better than a thousand months. Your entire life can shift in one night." },
  { id: 107, type: "video", tag: "HalalTok", illustration: "none", gradient: "from-black via-rose-950 to-red-950",
    title: "Blinded by Sins", youtubeId: "dCXbrr9XpCU", channel: "Mufti Menk", duration: "—",
    content: "Sin dims the light of the heart — recognise the signs before you can no longer see the truth." },
  { id: 108, type: "video", tag: "HalalTok", illustration: "none", gradient: "from-black via-green-950 to-emerald-950",
    title: "Allah's Army", youtubeId: "YBHvtnLwAf0", channel: "Nouman Ali Khan", duration: "—",
    content: "You are part of something much bigger than yourself. Allah's army is in every corner of the earth." },
  { id: 109, type: "video", tag: "HalalTok", illustration: "none", gradient: "from-black via-zinc-900 to-stone-900",
    title: "Mufti Menk Motivational Speech", youtubeId: "uSFaphrOZ20", channel: "Mufti Menk", duration: "—",
    content: "A powerful boost of motivation from Mufti Menk to keep you going when life gets hard." },
  { id: 110, type: "video", tag: "HalalTok", illustration: "none", gradient: "from-black via-cyan-950 to-teal-950",
    title: "Allah Made The Quran Easy", youtubeId: "EG6k731pm1I", channel: "Nouman Ali Khan", duration: "—",
    content: "Allah says He made the Quran easy to remember — so why do we make excuses to avoid it?" },
  { id: 111, type: "video", tag: "HalalTok", illustration: "none", gradient: "from-black via-orange-950 to-amber-950",
    title: "The Unmatched Character of Prophet Muhammad ﷺ", youtubeId: "7teljFXHEeQ", channel: "Yaqeen Institute", duration: "—",
    content: "No human being in history had a character like his ﷺ — let this remind you why you love him." },
  { id: 112, type: "video", tag: "HalalTok", illustration: "none", gradient: "from-black via-gray-900 to-slate-900",
    title: "Struggling with Salah?", youtubeId: "yjQHYd8_1dc", channel: "Mufti Menk", duration: "—",
    content: "If you're finding salah hard, you're not alone. Here's what you need to hear today." },
  { id: 113, type: "video", tag: "HalalTok", illustration: "none", gradient: "from-black via-blue-950 to-indigo-950",
    title: "The Dangerous Way We Misread Hardship", youtubeId: "Q_lRjAGv_TE", channel: "Omar Suleiman", duration: "—",
    content: "We think hardship means Allah is angry — but that couldn't be further from the truth." },
  { id: 114, type: "video", tag: "HalalTok", illustration: "none", gradient: "from-black via-purple-950 to-violet-950",
    title: "Stop Getting Deceived", youtubeId: "JR3plz3IaXU", channel: "Nouman Ali Khan", duration: "—",
    content: "Shaytan has been deceiving humanity since Adam — learn the traps so you don't fall in them." },
  { id: 115, type: "video", tag: "HalalTok", illustration: "none", gradient: "from-black via-zinc-900 to-gray-900",
    title: "When They Lie About You", youtubeId: "04i4lQH-d1w", channel: "Mufti Menk", duration: "—",
    content: "When people slander and falsely accuse you — here's the Islamic way to respond with dignity." },
  { id: 116, type: "video", tag: "HalalTok", illustration: "none", gradient: "from-black via-emerald-950 to-green-950",
    title: "Love For Allah v Love For Duniya", youtubeId: "VXDZtHwZaGc", channel: "Omar Suleiman", duration: "—",
    content: "You can't fully love both — at some point your heart has to choose. Which one wins in yours?" },
  { id: 117, type: "video", tag: "HalalTok", illustration: "none", gradient: "from-black via-slate-800 to-gray-900",
    title: "You Are Not Helpless", youtubeId: "K_WbJviYcgo", channel: "Nouman Ali Khan", duration: "—",
    content: "Feel powerless? Allah gave you tools you haven't fully used yet. Nouman Ali Khan explains." },
  { id: 118, type: "video", tag: "HalalTok", illustration: "none", gradient: "from-black via-teal-950 to-cyan-950",
    title: "Your Du'a Can Change the World", youtubeId: "HwXyliHiF2A", channel: "Omar Suleiman", duration: "—",
    content: "One sincere dua from one heart can move mountains — never underestimate your connection to Allah." },
  { id: 119, type: "video", tag: "HalalTok", illustration: "none", gradient: "from-black via-indigo-950 to-blue-950",
    title: "The Day That Feels Like a Prayer", youtubeId: "mBITcOZQK-0", channel: "Nouman Ali Khan", duration: "—",
    content: "What if every day could feel like an act of worship? Nouman Ali Khan on living with intention." },
  { id: 120, type: "video", tag: "HalalTok", illustration: "none", gradient: "from-black via-amber-950 to-orange-950",
    title: "Ayatul Kursi - The Divine Throne", youtubeId: "7p9fLsSJKts", channel: "Islamic Shorts", duration: "—",
    content: "The greatest verse in the Quran — understand the magnitude of Allah's throne and dominion." },
  { id: 121, type: "video", tag: "HalalTok", illustration: "none", gradient: "from-black via-rose-950 to-pink-950",
    title: "The Reality of Jannah That Will Make You Cry", youtubeId: "ORq5dm7VjUs", channel: "Islamic Shorts", duration: "—",
    content: "No eye has seen it, no ear has heard it — but your heart already longs for it. This is Jannah." },
  { id: 122, type: "video", tag: "HalalTok", illustration: "none", gradient: "from-black via-green-950 to-emerald-950",
    title: "Can't Wait 30 Seconds for Allah?", youtubeId: "lDAFRjlvtEQ", channel: "Islamic Shorts", duration: "—",
    content: "You scroll for hours but can't spare 30 seconds of dhikr? A sharp reminder we all need." },
  { id: 123, type: "video", tag: "HalalTok", illustration: "none", gradient: "from-black via-gray-900 to-zinc-900",
    title: "Allah Is Enough for Everyone", youtubeId: "6bNiP6VDPwQ", channel: "Islamic Shorts", duration: "—",
    content: "When everyone fails you, remember — Allah has never failed anyone who truly turned to Him." },
  { id: 124, type: "video", tag: "HalalTok", illustration: "none", gradient: "from-black via-violet-950 to-purple-950",
    title: "The Quran's Message in 60 Seconds", youtubeId: "CJwjFYcZB5E", channel: "Quran in 60 Seconds", duration: "—",
    content: "The entire message of the Quran — distilled into one powerful minute." },
  { id: 125, type: "video", tag: "HalalTok", illustration: "none", gradient: "from-black via-cyan-950 to-teal-950",
    title: "Allah's Mercy Is Truly Endless", youtubeId: "N2qyMMFjtME", channel: "Daily Islamic Shorts", duration: "—",
    content: "No sin is too great for Allah's mercy — no heart too far gone to be brought back." },
  { id: 126, type: "video", tag: "HalalTok", illustration: "none", gradient: "from-black via-orange-950 to-amber-950",
    title: "Power of Fasting — Science + Islam Explained", youtubeId: "oIAKT375uy0", channel: "Islamic Motivation", duration: "—",
    content: "Science is finally catching up with what Allah commanded 1400 years ago — fasting heals." },
  { id: 127, type: "video", tag: "HalalTok", illustration: "none", gradient: "from-black via-slate-900 to-gray-900",
    title: "Prophet Dawud Receives Divine Wisdom", youtubeId: "G8_aDxVVpkE", channel: "Islamic Shorts", duration: "—",
    content: "The story of Prophet Dawud and the wisdom Allah placed in his heart — timeless and moving." },
  { id: 128, type: "video", tag: "HalalTok", illustration: "none", gradient: "from-black via-blue-950 to-indigo-950",
    title: "60 Seconds of Quranic Guidance", youtubeId: "25bZCTfWCAM", channel: "Quran Lovers", duration: "—",
    content: "One minute. One ayah. One truth that could change everything for you today." },
  { id: 129, type: "video", tag: "HalalTok", illustration: "none", gradient: "from-black via-emerald-950 to-green-950",
    title: "We Cannot Judge Someone's Heart", youtubeId: "vuRqBT5uqmA", channel: "Islamic Reminder", duration: "—",
    content: "Only Allah knows what's in the heart. Leave judgment to Him — your job is to be good." },
  { id: 130, type: "video", tag: "HalalTok", illustration: "none", gradient: "from-black via-purple-950 to-violet-950",
    title: "Even When He ﷺ Could No Longer Speak", youtubeId: "kpMRUVM7M-I", channel: "Omar Suleiman", duration: "—",
    content: "The final moments of the Prophet ﷺ — a reminder of his love for his ummah until his last breath." },
  { id: 131, type: "video", tag: "HalalTok", illustration: "none", gradient: "from-black via-zinc-900 to-stone-900",
    title: "Work On Your Prayer!", youtubeId: "WacvX7gn-cg", channel: "Mufti Menk", duration: "—",
    content: "Your salah is the first thing you'll be asked about — make it count while you still can." },
];

function VideoCard({ item, isActive }: { item: FeedItem; isActive: boolean }) {
  const [playing, setPlaying] = useState(false);
  // hqdefault is reliable for all public videos; maxresdefault silently returns a black image when missing
  const [thumbSrc, setThumbSrc] = useState(`https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`);
  const [thumbFailed, setThumbFailed] = useState(false);

  useEffect(() => {
    if (!isActive) setPlaying(false);
  }, [isActive]);

  // Reset thumb when item changes
  useEffect(() => {
    setThumbSrc(`https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`);
    setThumbFailed(false);
  }, [item.youtubeId]);

  const ytUrl = `https://www.youtube.com/watch?v=${item.youtubeId}`;

  return (
    <div className="absolute inset-0 bg-black flex flex-col">
      {!playing ? (
        <>
          {/* Thumbnail — hqdefault → mqdefault → coloured fallback */}
          {!thumbFailed ? (
            <img
              src={thumbSrc}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover opacity-80"
              onError={() => {
                if (thumbSrc.includes("hqdefault")) {
                  setThumbSrc(`https://img.youtube.com/vi/${item.youtubeId}/mqdefault.jpg`);
                } else {
                  setThumbFailed(true);
                }
              }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a3a2a] to-[#0d1f17]" />
          )}

          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/85" />

          <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white/90 text-[10px] font-bold uppercase tracking-widest mb-4 backdrop-blur-sm border border-white/20">
              <Video className="w-3 h-3" /> {item.tag}
            </span>
            <button
              onClick={() => setPlaying(true)}
              className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/50 flex items-center justify-center hover:bg-white/30 active:scale-95 transition-all mb-6 shadow-2xl"
            >
              <Play className="w-9 h-9 text-white fill-white ml-1" />
            </button>
            <h2 className="text-white font-bold text-2xl leading-tight text-center drop-shadow-lg mb-2">{item.title}</h2>
            <p className="text-white/70 text-sm font-medium mb-1">{item.channel}</p>
            <p className="text-[#C9A84C] text-xs font-bold">{item.duration}</p>
          </div>

          <div className="relative z-10 px-6 pb-20">
            <p className="text-white/60 text-sm leading-relaxed text-center mb-4">{item.content}</p>
            {/* Open in YouTube button — always available */}
            <a
              href={ytUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-[#FF0000]/80 backdrop-blur-sm text-white text-xs font-bold active:scale-95 transition-transform"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Open in YouTube
            </a>
          </div>
        </>
      ) : (
        <div className="relative w-full h-full">
          <iframe
            className="w-full h-full border-0"
            src={`https://www.youtube-nocookie.com/embed/${item.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={item.title}
          />
          {/* Exit player button */}
          <button
            onClick={() => setPlaying(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white z-10"
          >
            <span className="text-lg leading-none">×</span>
          </button>
        </div>
      )}
    </div>
  );
}

function ActionButton({ icon: Icon, label, active, onClick }: { icon: any; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
      <div className={cn("w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-sm border", active ? "bg-white/25 border-white/40" : "bg-white/10 border-white/20")}>
        <Icon className={cn("w-5 h-5", active && label === "Like" ? "text-red-400 fill-red-400" : active ? "text-[#C9A84C] fill-[#C9A84C]" : "text-white")} />
      </div>
    </button>
  );
}

export default function HalalTok() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [saved, setSaved] = useState<Set<number>>(new Set());
  const [displayItems, setDisplayItems] = useState<FeedItem[]>([]);
  const [todaySeed] = useState(getDailySeed());

  useEffect(() => {
    const stored = localStorage.getItem("halaltok_liked");
    const storedSaved = localStorage.getItem("halaltok_saved");
    if (stored) setLiked(new Set(JSON.parse(stored)));
    if (storedSaved) setSaved(new Set(JSON.parse(storedSaved)));
    setDisplayItems(seededShuffle(ALL_ITEMS, todaySeed));
  }, [todaySeed]);

  const appendMoreItems = useCallback(() => {
    setDisplayItems(prev => {
      const newSeed = todaySeed + prev.length;
      return [...prev, ...seededShuffle(ALL_ITEMS, newSeed)];
    });
  }, [todaySeed]);

  const toggleLike = useCallback((id: number) => {
    setLiked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      localStorage.setItem("halaltok_liked", JSON.stringify([...next]));
      return next;
    });
  }, []);

  const toggleSave = useCallback((id: number) => {
    setSaved(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      localStorage.setItem("halaltok_saved", JSON.stringify([...next]));
      return next;
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onScroll = () => {
      const idx = Math.round(container.scrollTop / container.clientHeight);
      setCurrentIndex(idx);
      if (idx >= displayItems.length - 5) appendMoreItems();
    };
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [displayItems.length, appendMoreItems]);

  const item = displayItems[currentIndex];

  return (
    <div className="absolute inset-0 bg-black z-20 flex flex-col" style={{ bottom: 0 }}>
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between pt-3 pb-2 px-4">
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full">
          <Sparkles className="w-4 h-4 text-[#C9A84C]" />
          <span className="text-white font-bold text-sm tracking-wide">HalalTok</span>
        </div>
        <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full">
          <RefreshCw className="w-3 h-3 text-white/50" />
          <span className="text-white/60 text-xs">Daily feed</span>
        </div>
      </div>

      <div ref={containerRef} className="flex-1 overflow-y-auto snap-y snap-mandatory scrollbar-hide">
        {displayItems.map((item, index) => (
          <div key={`${item.id}-${index}`} className="snap-start w-full flex-shrink-0 relative" style={{ height: "100%" }}>
            {item.type === "video" ? (
              <VideoCard item={item} isActive={index === currentIndex} />
            ) : (
              <>
                <div className={`absolute inset-0 bg-gradient-to-b ${item.gradient}`} />
                <div className="absolute inset-0 opacity-[0.03]" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
                <div className="relative z-10 h-full flex flex-col px-6 pt-16 pb-24">
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    {item.illustration !== "none" && (
                      <div className="mb-3"><Illustration type={item.illustration} /></div>
                    )}
                    <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-white/90 text-[10px] font-bold uppercase tracking-widest mb-3 backdrop-blur-sm border border-white/20">
                      {item.tag}
                    </span>
                    <h2 className="text-white font-bold text-2xl leading-tight mb-3 drop-shadow-lg">{item.title}</h2>
                    {item.arabic && (
                      <p className="arabic-text text-xl text-[#C9A84C] leading-relaxed mb-4 drop-shadow max-w-xs">{item.arabic}</p>
                    )}
                    <div className="max-w-xs">
                      {(item.content || "").split('\n\n').map((para, i) => (
                        <p key={i} className={cn("text-white/85 leading-relaxed font-medium text-sm", i > 0 && "mt-3")}>{para}</p>
                      ))}
                    </div>
                    {item.source && (
                      <p className="text-white/45 text-[11px] mt-4 font-medium italic">— {item.source}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-white/40 text-xs flex items-center gap-1">
                      <span className="text-base">↑</span> Swipe for more
                    </p>
                    <div className="flex items-center gap-3">
                      <ActionButton icon={Heart} label="Like" active={liked.has(item.id)} onClick={() => toggleLike(item.id)} />
                      <ActionButton icon={BookmarkPlus} label="Save" active={saved.has(item.id)} onClick={() => toggleSave(item.id)} />
                      <ActionButton icon={Share2} label="Share" />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
