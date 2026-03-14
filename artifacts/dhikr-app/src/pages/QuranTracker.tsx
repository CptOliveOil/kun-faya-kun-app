import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Check, BookOpen, Activity, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Surah data ───────────────────────────────────────────────────────────────

interface Surah {
  number: number;
  arabic: string;
  english: string;
  meaning: string;
  ayahs: number;
  juz: number;
  type: "Makki" | "Madani";
}

const SURAHS: Surah[] = [
  { number: 1,   arabic: "الفاتحة",    english: "Al-Fatiha",      meaning: "The Opening",           ayahs: 7,   juz: 1,  type: "Makki" },
  { number: 2,   arabic: "البقرة",     english: "Al-Baqarah",     meaning: "The Cow",               ayahs: 286, juz: 1,  type: "Madani" },
  { number: 3,   arabic: "آل عمران",   english: "Ali 'Imran",     meaning: "Family of Imran",       ayahs: 200, juz: 3,  type: "Madani" },
  { number: 4,   arabic: "النساء",     english: "An-Nisa",        meaning: "The Women",             ayahs: 176, juz: 4,  type: "Madani" },
  { number: 5,   arabic: "المائدة",    english: "Al-Ma'idah",     meaning: "The Table Spread",      ayahs: 120, juz: 6,  type: "Madani" },
  { number: 6,   arabic: "الأنعام",   english: "Al-An'am",       meaning: "The Cattle",            ayahs: 165, juz: 7,  type: "Makki" },
  { number: 7,   arabic: "الأعراف",   english: "Al-A'raf",       meaning: "The Heights",           ayahs: 206, juz: 8,  type: "Makki" },
  { number: 8,   arabic: "الأنفال",   english: "Al-Anfal",       meaning: "The Spoils of War",     ayahs: 75,  juz: 9,  type: "Madani" },
  { number: 9,   arabic: "التوبة",     english: "At-Tawbah",      meaning: "The Repentance",        ayahs: 129, juz: 10, type: "Madani" },
  { number: 10,  arabic: "يونس",       english: "Yunus",          meaning: "Jonah",                 ayahs: 109, juz: 11, type: "Makki" },
  { number: 11,  arabic: "هود",        english: "Hud",            meaning: "Hud",                   ayahs: 123, juz: 11, type: "Makki" },
  { number: 12,  arabic: "يوسف",       english: "Yusuf",          meaning: "Joseph",                ayahs: 111, juz: 12, type: "Makki" },
  { number: 13,  arabic: "الرعد",      english: "Ar-Ra'd",        meaning: "The Thunder",           ayahs: 43,  juz: 13, type: "Madani" },
  { number: 14,  arabic: "إبراهيم",    english: "Ibrahim",        meaning: "Abraham",               ayahs: 52,  juz: 13, type: "Makki" },
  { number: 15,  arabic: "الحجر",      english: "Al-Hijr",        meaning: "The Rocky Tract",       ayahs: 99,  juz: 14, type: "Makki" },
  { number: 16,  arabic: "النحل",      english: "An-Nahl",        meaning: "The Bee",               ayahs: 128, juz: 14, type: "Makki" },
  { number: 17,  arabic: "الإسراء",    english: "Al-Isra",        meaning: "The Night Journey",     ayahs: 111, juz: 15, type: "Makki" },
  { number: 18,  arabic: "الكهف",      english: "Al-Kahf",        meaning: "The Cave",              ayahs: 110, juz: 15, type: "Makki" },
  { number: 19,  arabic: "مريم",       english: "Maryam",         meaning: "Mary",                  ayahs: 98,  juz: 16, type: "Makki" },
  { number: 20,  arabic: "طه",         english: "Ta-Ha",          meaning: "Ta-Ha",                 ayahs: 135, juz: 16, type: "Makki" },
  { number: 21,  arabic: "الأنبياء",   english: "Al-Anbiya",      meaning: "The Prophets",          ayahs: 112, juz: 17, type: "Makki" },
  { number: 22,  arabic: "الحج",       english: "Al-Hajj",        meaning: "The Pilgrimage",        ayahs: 78,  juz: 17, type: "Madani" },
  { number: 23,  arabic: "المؤمنون",   english: "Al-Mu'minun",    meaning: "The Believers",         ayahs: 118, juz: 18, type: "Makki" },
  { number: 24,  arabic: "النور",      english: "An-Nur",         meaning: "The Light",             ayahs: 64,  juz: 18, type: "Madani" },
  { number: 25,  arabic: "الفرقان",    english: "Al-Furqan",      meaning: "The Criterion",         ayahs: 77,  juz: 18, type: "Makki" },
  { number: 26,  arabic: "الشعراء",    english: "Ash-Shu'ara",    meaning: "The Poets",             ayahs: 227, juz: 19, type: "Makki" },
  { number: 27,  arabic: "النمل",      english: "An-Naml",        meaning: "The Ant",               ayahs: 93,  juz: 19, type: "Makki" },
  { number: 28,  arabic: "القصص",      english: "Al-Qasas",       meaning: "The Stories",           ayahs: 88,  juz: 20, type: "Makki" },
  { number: 29,  arabic: "العنكبوت",   english: "Al-Ankabut",     meaning: "The Spider",            ayahs: 69,  juz: 20, type: "Makki" },
  { number: 30,  arabic: "الروم",      english: "Ar-Rum",         meaning: "The Romans",            ayahs: 60,  juz: 21, type: "Makki" },
  { number: 31,  arabic: "لقمان",      english: "Luqman",         meaning: "Luqman",                ayahs: 34,  juz: 21, type: "Makki" },
  { number: 32,  arabic: "السجدة",     english: "As-Sajdah",      meaning: "The Prostration",       ayahs: 30,  juz: 21, type: "Makki" },
  { number: 33,  arabic: "الأحزاب",    english: "Al-Ahzab",       meaning: "The Combined Forces",   ayahs: 73,  juz: 21, type: "Madani" },
  { number: 34,  arabic: "سبأ",        english: "Saba",           meaning: "Sheba",                 ayahs: 54,  juz: 22, type: "Makki" },
  { number: 35,  arabic: "فاطر",       english: "Fatir",          meaning: "Originator",            ayahs: 45,  juz: 22, type: "Makki" },
  { number: 36,  arabic: "يس",         english: "Ya-Sin",         meaning: "Ya-Sin",                ayahs: 83,  juz: 22, type: "Makki" },
  { number: 37,  arabic: "الصافات",    english: "As-Saffat",      meaning: "Those who set the Ranks", ayahs: 182, juz: 23, type: "Makki" },
  { number: 38,  arabic: "ص",          english: "Sad",            meaning: "Sad",                   ayahs: 88,  juz: 23, type: "Makki" },
  { number: 39,  arabic: "الزمر",      english: "Az-Zumar",       meaning: "The Troops",            ayahs: 75,  juz: 23, type: "Makki" },
  { number: 40,  arabic: "غافر",       english: "Ghafir",         meaning: "The Forgiver",          ayahs: 85,  juz: 24, type: "Makki" },
  { number: 41,  arabic: "فصلت",       english: "Fussilat",       meaning: "Explained in Detail",   ayahs: 54,  juz: 24, type: "Makki" },
  { number: 42,  arabic: "الشورى",     english: "Ash-Shura",      meaning: "The Consultation",      ayahs: 53,  juz: 25, type: "Makki" },
  { number: 43,  arabic: "الزخرف",     english: "Az-Zukhruf",     meaning: "The Ornaments of Gold", ayahs: 89,  juz: 25, type: "Makki" },
  { number: 44,  arabic: "الدخان",     english: "Ad-Dukhan",      meaning: "The Smoke",             ayahs: 59,  juz: 25, type: "Makki" },
  { number: 45,  arabic: "الجاثية",    english: "Al-Jathiyah",    meaning: "The Crouching",         ayahs: 37,  juz: 25, type: "Makki" },
  { number: 46,  arabic: "الأحقاف",    english: "Al-Ahqaf",       meaning: "The Wind-Curved Sandhills", ayahs: 35, juz: 26, type: "Makki" },
  { number: 47,  arabic: "محمد",       english: "Muhammad",       meaning: "Muhammad",              ayahs: 38,  juz: 26, type: "Madani" },
  { number: 48,  arabic: "الفتح",      english: "Al-Fath",        meaning: "The Victory",           ayahs: 29,  juz: 26, type: "Madani" },
  { number: 49,  arabic: "الحجرات",    english: "Al-Hujurat",     meaning: "The Rooms",             ayahs: 18,  juz: 26, type: "Madani" },
  { number: 50,  arabic: "ق",          english: "Qaf",            meaning: "Qaf",                   ayahs: 45,  juz: 26, type: "Makki" },
  { number: 51,  arabic: "الذاريات",   english: "Adh-Dhariyat",   meaning: "The Winnowing Winds",   ayahs: 60,  juz: 26, type: "Makki" },
  { number: 52,  arabic: "الطور",      english: "At-Tur",         meaning: "The Mount",             ayahs: 49,  juz: 27, type: "Makki" },
  { number: 53,  arabic: "النجم",      english: "An-Najm",        meaning: "The Star",              ayahs: 62,  juz: 27, type: "Makki" },
  { number: 54,  arabic: "القمر",      english: "Al-Qamar",       meaning: "The Moon",              ayahs: 55,  juz: 27, type: "Makki" },
  { number: 55,  arabic: "الرحمن",     english: "Ar-Rahman",      meaning: "The Beneficent",        ayahs: 78,  juz: 27, type: "Madani" },
  { number: 56,  arabic: "الواقعة",    english: "Al-Waqi'ah",     meaning: "The Inevitable",        ayahs: 96,  juz: 27, type: "Makki" },
  { number: 57,  arabic: "الحديد",     english: "Al-Hadid",       meaning: "The Iron",              ayahs: 29,  juz: 27, type: "Madani" },
  { number: 58,  arabic: "المجادلة",   english: "Al-Mujadila",    meaning: "The Pleading Woman",    ayahs: 22,  juz: 28, type: "Madani" },
  { number: 59,  arabic: "الحشر",      english: "Al-Hashr",       meaning: "The Exile",             ayahs: 24,  juz: 28, type: "Madani" },
  { number: 60,  arabic: "الممتحنة",   english: "Al-Mumtahanah",  meaning: "She that is Examined",  ayahs: 13,  juz: 28, type: "Madani" },
  { number: 61,  arabic: "الصف",       english: "As-Saf",         meaning: "The Ranks",             ayahs: 14,  juz: 28, type: "Madani" },
  { number: 62,  arabic: "الجمعة",     english: "Al-Jumu'ah",     meaning: "Friday",                ayahs: 11,  juz: 28, type: "Madani" },
  { number: 63,  arabic: "المنافقون",  english: "Al-Munafiqun",   meaning: "The Hypocrites",        ayahs: 11,  juz: 28, type: "Madani" },
  { number: 64,  arabic: "التغابن",    english: "At-Taghabun",    meaning: "Mutual Disillusion",    ayahs: 18,  juz: 28, type: "Madani" },
  { number: 65,  arabic: "الطلاق",     english: "At-Talaq",       meaning: "Divorce",               ayahs: 12,  juz: 28, type: "Madani" },
  { number: 66,  arabic: "التحريم",    english: "At-Tahrim",      meaning: "The Prohibition",       ayahs: 12,  juz: 28, type: "Madani" },
  { number: 67,  arabic: "الملك",      english: "Al-Mulk",        meaning: "The Sovereignty",       ayahs: 30,  juz: 29, type: "Makki" },
  { number: 68,  arabic: "القلم",      english: "Al-Qalam",       meaning: "The Pen",               ayahs: 52,  juz: 29, type: "Makki" },
  { number: 69,  arabic: "الحاقة",     english: "Al-Haqqah",      meaning: "The Reality",           ayahs: 52,  juz: 29, type: "Makki" },
  { number: 70,  arabic: "المعارج",    english: "Al-Ma'arij",     meaning: "The Ascending Stairways", ayahs: 44, juz: 29, type: "Makki" },
  { number: 71,  arabic: "نوح",        english: "Nuh",            meaning: "Noah",                  ayahs: 28,  juz: 29, type: "Makki" },
  { number: 72,  arabic: "الجن",       english: "Al-Jinn",        meaning: "The Jinn",              ayahs: 28,  juz: 29, type: "Makki" },
  { number: 73,  arabic: "المزمل",     english: "Al-Muzzammil",   meaning: "The Enshrouded One",    ayahs: 20,  juz: 29, type: "Makki" },
  { number: 74,  arabic: "المدثر",     english: "Al-Muddaththir", meaning: "The Cloaked One",       ayahs: 56,  juz: 29, type: "Makki" },
  { number: 75,  arabic: "القيامة",    english: "Al-Qiyamah",     meaning: "The Resurrection",      ayahs: 40,  juz: 29, type: "Makki" },
  { number: 76,  arabic: "الإنسان",    english: "Al-Insan",       meaning: "The Man",               ayahs: 31,  juz: 29, type: "Madani" },
  { number: 77,  arabic: "المرسلات",   english: "Al-Mursalat",    meaning: "The Emissaries",        ayahs: 50,  juz: 29, type: "Makki" },
  { number: 78,  arabic: "النبأ",      english: "An-Naba",        meaning: "The Tidings",           ayahs: 40,  juz: 30, type: "Makki" },
  { number: 79,  arabic: "النازعات",   english: "An-Nazi'at",     meaning: "Those who drag forth",  ayahs: 46,  juz: 30, type: "Makki" },
  { number: 80,  arabic: "عبس",        english: "'Abasa",         meaning: "He Frowned",            ayahs: 42,  juz: 30, type: "Makki" },
  { number: 81,  arabic: "التكوير",    english: "At-Takwir",      meaning: "The Overthrowing",      ayahs: 29,  juz: 30, type: "Makki" },
  { number: 82,  arabic: "الانفطار",   english: "Al-Infitar",     meaning: "The Cleaving",          ayahs: 19,  juz: 30, type: "Makki" },
  { number: 83,  arabic: "المطففين",   english: "Al-Mutaffifin",  meaning: "The Defrauding",        ayahs: 36,  juz: 30, type: "Makki" },
  { number: 84,  arabic: "الانشقاق",   english: "Al-Inshiqaq",    meaning: "The Sundering",         ayahs: 25,  juz: 30, type: "Makki" },
  { number: 85,  arabic: "البروج",     english: "Al-Buruj",       meaning: "The Mansions of Stars", ayahs: 22,  juz: 30, type: "Makki" },
  { number: 86,  arabic: "الطارق",     english: "At-Tariq",       meaning: "The Nightcomer",        ayahs: 17,  juz: 30, type: "Makki" },
  { number: 87,  arabic: "الأعلى",     english: "Al-A'la",        meaning: "The Most High",         ayahs: 19,  juz: 30, type: "Makki" },
  { number: 88,  arabic: "الغاشية",    english: "Al-Ghashiyah",   meaning: "The Overwhelming",      ayahs: 26,  juz: 30, type: "Makki" },
  { number: 89,  arabic: "الفجر",      english: "Al-Fajr",        meaning: "The Dawn",              ayahs: 30,  juz: 30, type: "Makki" },
  { number: 90,  arabic: "البلد",      english: "Al-Balad",       meaning: "The City",              ayahs: 20,  juz: 30, type: "Makki" },
  { number: 91,  arabic: "الشمس",      english: "Ash-Shams",      meaning: "The Sun",               ayahs: 15,  juz: 30, type: "Makki" },
  { number: 92,  arabic: "الليل",      english: "Al-Layl",        meaning: "The Night",             ayahs: 21,  juz: 30, type: "Makki" },
  { number: 93,  arabic: "الضحى",      english: "Ad-Duha",        meaning: "The Morning Hours",     ayahs: 11,  juz: 30, type: "Makki" },
  { number: 94,  arabic: "الشرح",      english: "Ash-Sharh",      meaning: "The Relief",            ayahs: 8,   juz: 30, type: "Makki" },
  { number: 95,  arabic: "التين",      english: "At-Tin",         meaning: "The Fig",               ayahs: 8,   juz: 30, type: "Makki" },
  { number: 96,  arabic: "العلق",      english: "Al-'Alaq",       meaning: "The Clot",              ayahs: 19,  juz: 30, type: "Makki" },
  { number: 97,  arabic: "القدر",      english: "Al-Qadr",        meaning: "The Power",             ayahs: 5,   juz: 30, type: "Makki" },
  { number: 98,  arabic: "البينة",     english: "Al-Bayyinah",    meaning: "The Clear Proof",       ayahs: 8,   juz: 30, type: "Madani" },
  { number: 99,  arabic: "الزلزلة",    english: "Az-Zalzalah",    meaning: "The Earthquake",        ayahs: 8,   juz: 30, type: "Madani" },
  { number: 100, arabic: "العاديات",   english: "Al-'Adiyat",     meaning: "The Coursers",          ayahs: 11,  juz: 30, type: "Makki" },
  { number: 101, arabic: "القارعة",    english: "Al-Qari'ah",     meaning: "The Calamity",          ayahs: 11,  juz: 30, type: "Makki" },
  { number: 102, arabic: "التكاثر",    english: "At-Takathur",    meaning: "The Rivalry in World Increase", ayahs: 8, juz: 30, type: "Makki" },
  { number: 103, arabic: "العصر",      english: "Al-'Asr",        meaning: "The Declining Day",     ayahs: 3,   juz: 30, type: "Makki" },
  { number: 104, arabic: "الهمزة",     english: "Al-Humazah",     meaning: "The Traducer",          ayahs: 9,   juz: 30, type: "Makki" },
  { number: 105, arabic: "الفيل",      english: "Al-Fil",         meaning: "The Elephant",          ayahs: 5,   juz: 30, type: "Makki" },
  { number: 106, arabic: "قريش",       english: "Quraysh",        meaning: "Quraysh",               ayahs: 4,   juz: 30, type: "Makki" },
  { number: 107, arabic: "الماعون",    english: "Al-Ma'un",       meaning: "The Small Kindnesses",  ayahs: 7,   juz: 30, type: "Makki" },
  { number: 108, arabic: "الكوثر",     english: "Al-Kawthar",     meaning: "Abundance",             ayahs: 3,   juz: 30, type: "Makki" },
  { number: 109, arabic: "الكافرون",   english: "Al-Kafirun",     meaning: "The Disbelievers",      ayahs: 6,   juz: 30, type: "Makki" },
  { number: 110, arabic: "النصر",      english: "An-Nasr",        meaning: "The Divine Support",    ayahs: 3,   juz: 30, type: "Madani" },
  { number: 111, arabic: "المسد",      english: "Al-Masad",       meaning: "The Palm Fibre",        ayahs: 5,   juz: 30, type: "Makki" },
  { number: 112, arabic: "الإخلاص",    english: "Al-Ikhlas",      meaning: "Sincerity",             ayahs: 4,   juz: 30, type: "Makki" },
  { number: 113, arabic: "الفلق",      english: "Al-Falaq",       meaning: "The Daybreak",          ayahs: 5,   juz: 30, type: "Makki" },
  { number: 114, arabic: "الناس",      english: "An-Nas",         meaning: "Mankind",               ayahs: 6,   juz: 30, type: "Makki" },
];

const JUZ_NAMES = [
  "", "Alif Lam Mim", "Sayaqul", "Tilka Ar-Rusul", "Lan Tana Lu", "Wal Muhsanat",
  "La Yuhibbullah", "Wa Idha Sami'u", "Wa Law Annana", "Qal Al-Mala", "Wa A'lamu",
  "Yata Zaru", "Wa Ma Min Dabbah", "Wa Ma Ubri'u", "Rubama", "Subhana Alladhi",
  "Qal Alam", "Iqtaraba", "Qad Aflaha", "Wa Qal Alladhina", "Amman Khalaqa",
  "Utlu Ma Uhiya", "Wa Man Yaqnut", "Wa Mali", "Fa Man Azlam", "Ilayhi Yuraddu",
  "Ha Mim", "Qala Fa Ma Khatbukum", "Qad Sami Allah", "Tabaraka Alladhi", "Amma",
];

// ─── Local storage helpers ────────────────────────────────────────────────────

const KEY = (n: number) => `dhikr_surah_read_${n}`;
const KEY_MEM = (n: number) => `dhikr_surah_mem_${n}`;

function isRead(n: number): boolean {
  return localStorage.getItem(KEY(n)) === "1";
}
function isMemorised(n: number): boolean {
  return localStorage.getItem(KEY_MEM(n)) === "1";
}
function toggleRead(n: number) {
  if (isRead(n)) localStorage.removeItem(KEY(n));
  else localStorage.setItem(KEY(n), "1");
}
function toggleMem(n: number) {
  if (isMemorised(n)) localStorage.removeItem(KEY_MEM(n));
  else localStorage.setItem(KEY_MEM(n), "1");
}

// ─── Components ───────────────────────────────────────────────────────────────

function SurahRow({
  surah,
  mode,
  checked,
  onToggle,
}: {
  surah: Surah;
  mode: "reading" | "memorisation";
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      layout
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors",
        checked ? "bg-primary/8" : "hover:bg-muted/40"
      )}
    >
      {/* Number badge */}
      <div className={cn(
        "w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0",
        checked ? "bg-primary text-white" : "bg-muted text-muted-foreground"
      )}>
        {surah.number}
      </div>

      {/* Names */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className={cn("text-sm font-bold leading-tight", checked ? "text-primary" : "text-foreground")}>
            {surah.english}
          </span>
          <span className="text-[10px] text-muted-foreground hidden sm:inline">· {surah.meaning}</span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[10px] text-muted-foreground">{surah.ayahs} ayahs</span>
          <span className="text-[9px] text-muted-foreground/60">·</span>
          <span className={cn(
            "text-[9px] font-semibold px-1 rounded",
            surah.type === "Makki" ? "text-amber-600 bg-amber-50" : "text-blue-600 bg-blue-50"
          )}>
            {surah.type}
          </span>
        </div>
      </div>

      {/* Arabic name */}
      <span className="text-sm font-bold text-muted-foreground/70 shrink-0" style={{ fontFamily: "serif" }}>
        {surah.arabic}
      </span>

      {/* Tick button */}
      <button
        onClick={onToggle}
        className={cn(
          "w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all active:scale-90",
          checked
            ? "bg-primary border-primary text-white shadow-sm"
            : "border-border text-transparent hover:border-primary/50"
        )}
      >
        <Check className="w-3.5 h-3.5" strokeWidth={3} />
      </button>
    </motion.div>
  );
}

function JuzSection({
  juz,
  surahs,
  mode,
  readState,
  onToggle,
  defaultOpen,
}: {
  juz: number;
  surahs: Surah[];
  mode: "reading" | "memorisation";
  readState: Record<number, boolean>;
  onToggle: (n: number) => void;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const completed = surahs.filter(s => readState[s.number]).length;
  const pct = Math.round((completed / surahs.length) * 100);

  return (
    <div className="frosted-card rounded-2xl overflow-hidden gold-border-rounded">
      {/* Juz header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <span className="text-[10px] font-bold text-primary">{juz}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-foreground">Juz {juz} — {JUZ_NAMES[juz]}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground shrink-0">{completed}/{surahs.length}</span>
          </div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
      </button>

      {/* Surahs list */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-2 pb-2 divide-y divide-border/40">
              {surahs.map(s => (
                <SurahRow
                  key={s.number}
                  surah={s}
                  mode={mode}
                  checked={readState[s.number] ?? false}
                  onToggle={() => onToggle(s.number)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function QuranTracker() {
  const [mode, setMode] = useState<"reading" | "memorisation">("reading");
  const [search, setSearch] = useState("");
  const [readState, setReadState] = useState<Record<number, boolean>>(() => {
    const state: Record<number, boolean> = {};
    SURAHS.forEach(s => { state[s.number] = mode === "reading" ? isRead(s.number) : isMemorised(s.number); });
    return state;
  });

  // Re-load state whenever mode changes
  const loadState = (m: "reading" | "memorisation") => {
    const state: Record<number, boolean> = {};
    SURAHS.forEach(s => { state[s.number] = m === "reading" ? isRead(s.number) : isMemorised(s.number); });
    setReadState(state);
  };

  const handleModeChange = (m: "reading" | "memorisation") => {
    setMode(m);
    loadState(m);
  };

  const handleToggle = (n: number) => {
    if (mode === "reading") toggleRead(n);
    else toggleMem(n);
    setReadState(prev => ({ ...prev, [n]: !prev[n] }));
  };

  // Stats
  const totalRead = Object.values(readState).filter(Boolean).length;
  const totalAyahsRead = SURAHS.filter(s => readState[s.number]).reduce((sum, s) => sum + s.ayahs, 0);
  const pctComplete = Math.round((totalRead / 114) * 100);

  // Search filter
  const query = search.trim().toLowerCase();
  const filtered = query
    ? SURAHS.filter(s =>
        s.english.toLowerCase().includes(query) ||
        s.arabic.includes(query) ||
        s.meaning.toLowerCase().includes(query) ||
        String(s.number).includes(query)
      )
    : null;

  // Group by juz
  const juzGroups = useMemo(() => {
    const groups: Record<number, Surah[]> = {};
    SURAHS.forEach(s => {
      if (!groups[s.juz]) groups[s.juz] = [];
      groups[s.juz].push(s);
    });
    return groups;
  }, []);

  // Which juz has the current bookmark (first incomplete juz)
  const currentJuz = useMemo(() => {
    for (let j = 1; j <= 30; j++) {
      const group = juzGroups[j] || [];
      if (group.some(s => !readState[s.number])) return j;
    }
    return 30;
  }, [juzGroups, readState]);

  return (
    <div className="flex-1 flex flex-col min-h-full bg-background">
      {/* Header */}
      <header className="px-5 pt-6 pb-3">
        <h1 className="text-2xl font-bold text-foreground">Quran Tracker</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Track your reading & memorisation surah by surah</p>
      </header>

      {/* Stats bar */}
      <div className="px-5 mb-3">
        <div className="frosted-card rounded-2xl p-4 gold-border-rounded space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <p className="text-xl font-bold text-primary">{totalRead}</p>
              <p className="text-[10px] text-muted-foreground font-semibold uppercase">Surahs</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-secondary">{totalAyahsRead.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground font-semibold uppercase">Ayahs</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-foreground">{pctComplete}%</p>
              <p className="text-[10px] text-muted-foreground font-semibold uppercase">Complete</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-muted-foreground">Juz {currentJuz}</p>
              <p className="text-[10px] text-muted-foreground font-semibold uppercase">Bookmark</p>
            </div>
          </div>
          {/* Overall bar */}
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={false}
              animate={{ width: `${pctComplete}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Mode toggle */}
      <div className="px-5 mb-3 flex gap-1 p-1 bg-muted/50 rounded-full">
        <button
          onClick={() => handleModeChange("reading")}
          className={cn(
            "flex-1 py-2 text-sm font-bold rounded-full transition-all flex items-center justify-center gap-1.5",
            mode === "reading" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
          )}
        >
          <BookOpen className="w-3.5 h-3.5" /> Reading
        </button>
        <button
          onClick={() => handleModeChange("memorisation")}
          className={cn(
            "flex-1 py-2 text-sm font-bold rounded-full transition-all flex items-center justify-center gap-1.5",
            mode === "memorisation" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
          )}
        >
          <Activity className="w-3.5 h-3.5" /> Memorisation
        </button>
      </div>

      {/* Search */}
      <div className="px-5 mb-3">
        <div className="flex items-center gap-2 bg-card rounded-xl border border-border px-3 py-2">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Search surahs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          {search && (
            <button onClick={() => setSearch("")}>
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Surah list */}
      <div className="flex-1 overflow-y-auto px-4 pb-28 space-y-2">
        {filtered ? (
          /* Search results — flat list */
          <div className="frosted-card rounded-2xl overflow-hidden gold-border-rounded divide-y divide-border/40 px-2 py-1">
            {filtered.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">No surahs found</p>
            ) : filtered.map(s => (
              <SurahRow
                key={s.number}
                surah={s}
                mode={mode}
                checked={readState[s.number] ?? false}
                onToggle={() => handleToggle(s.number)}
              />
            ))}
          </div>
        ) : (
          /* Juz sections */
          Object.entries(juzGroups).map(([juzStr, surahs]) => {
            const juz = Number(juzStr);
            return (
              <JuzSection
                key={juz}
                juz={juz}
                surahs={surahs}
                mode={mode}
                readState={readState}
                onToggle={handleToggle}
                defaultOpen={juz === currentJuz}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
