import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as WebBrowser from "expo-web-browser";
import * as Haptics from "expo-haptics";
import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
  useColorScheme,
  Share,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width: W, height: H } = Dimensions.get("window");

// ── Types ────────────────────────────────────────────────────────────────────

interface FeedItem {
  id: number;
  type: "reminder" | "hadith" | "quran" | "fact" | "dua" | "tip" | "video";
  tag: string;
  title: string;
  arabic?: string;
  content?: string;
  source?: string;
  colors: [string, string];
  youtubeId?: string;
  channel?: string;
  duration?: string;
}

// ── Feed Data ────────────────────────────────────────────────────────────────

const FEED: FeedItem[] = [
  { id: 1, type: "hadith", tag: "Hadith", colors: ["#064e3b", "#134e4a"],
    title: "The Best of You", arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
    content: "The best among you are those who learn the Quran and teach it to others.\n\nLearning the Quran elevates your rank, but teaching it multiplies your reward — every letter your student recites earns you the same reward.",
    source: "Sahih al-Bukhari 5027" },
  { id: 2, type: "quran", tag: "Quran", colors: ["#1e3a8a", "#4c1d95"],
    title: "Allah's Promise", arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا • إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    content: "For indeed, with hardship comes ease. Indeed, with hardship comes ease.\n\nAllah repeats this twice — same hardship (definite), multiple eases (indefinite). For every trial, there are multiple openings.",
    source: "Quran 94:5–6" },
  { id: 3, type: "reminder", tag: "Reminder", colors: ["#78350f", "#7c2d12"],
    title: "The Tasbih After Every Prayer", arabic: "سُبْحَانَ اللهِ • الْحَمْدُ لِلَّهِ • اللهُ أَكْبَرُ",
    content: "33 SubhanAllah + 33 Alhamdulillah + 34 Allahu Akbar = 100 dhikr.\n\n'Whoever does this after every prayer, his sins will be forgiven, even if they are as vast as the ocean.' — That's 500 dhikr daily in just 5 minutes.",
    source: "Sahih Muslim 597" },
  { id: 4, type: "fact", tag: "Did You Know?", colors: ["#4c1d95", "#581c87"],
    title: "Laylatul Qadr — One Night = 83 Years", arabic: "لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ",
    content: "The Night of Power is better than 1,000 months — over 83 years of worship in a single night!\n\nIf you stay up all night in worship during Laylatul Qadr, you earn the equivalent of a lifetime of worship.",
    source: "Quran 97:3" },
  { id: 5, type: "hadith", tag: "Hadith", colors: ["#881337", "#9f1239"],
    title: "A Smile is Sadaqah", arabic: "تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ",
    content: "Your smile in the face of your brother is charity.\n\nGoodness is everywhere — in a smile, good advice, helping someone, removing harm from the road. You can earn rewards in every moment.",
    source: "Jami' at-Tirmidhi 1956" },
  { id: 6, type: "quran", tag: "Quran", colors: ["#164e63", "#065f46"],
    title: "Trust in Allah Completely", arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    content: "And whoever relies upon Allah — then He is sufficient for him.\n\nTawakkul is not passivity. 'Tie your camel, then put your trust in Allah.' Do everything in your capacity — then leave the rest to Him.",
    source: "Quran 65:3" },
  { id: 7, type: "tip", tag: "Daily Tip", colors: ["#0c4a6e", "#1e3a8a"],
    title: "The Sunnah Morning Routine",
    content: "The Prophet ﷺ's morning routine:\n\n1. Wake before Fajr for Tahajjud\n2. Make Wudu\n3. Pray Fajr in congregation\n4. Read morning adhkar\n5. Eat dates for breakfast\n\nTry waking just 15 minutes before Fajr this week." },
  { id: 8, type: "dua", tag: "Du'a", colors: ["#1c1917", "#18181b"],
    title: "The Dua of Anxiety", arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ",
    content: "O Allah, I seek refuge in You from worry, grief, incapacity, and laziness.\n\nThis dua covers: worry (present), grief (past), incapacity (inability to act), laziness (unwillingness to act). Say it when overwhelmed.",
    source: "Sahih al-Bukhari 6369" },
  { id: 9, type: "fact", tag: "Did You Know?", colors: ["#0c4a6e", "#164e63"],
    title: "Zamzam Water & Modern Science",
    arabic: "إِنَّهَا مُبَارَكَةٌ",
    content: "Zamzam water contains higher levels of calcium, magnesium, and fluoride than ordinary water. It flows at 8,000 litres/second from a source that has never run dry in 4,000+ years — despite being in one of the driest deserts on Earth.",
    source: "Scientific studies, 2011–2018" },
  { id: 10, type: "hadith", tag: "Hadith", colors: ["#7f1d1d", "#831843"],
    title: "Two Words Allah Loves", arabic: "كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ",
    content: "Two phrases, light on the tongue but heavy on the scales, beloved to the Most Merciful:\n\nSubhanAllahi wa bihamdihi — SubhanAllahil Azeem\n\nSay them 100 times in 2 minutes. Mountains of reward for almost no effort.",
    source: "Sahih al-Bukhari 6682" },
  { id: 11, type: "quran", tag: "Quran", colors: ["#064e3b", "#065f46"],
    title: "Allah Remembers You Too", arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ",
    content: "Remember Me — and I will remember you.\n\nWhen you say SubhanAllah, Allah speaks about you in the highest gathering. When you make dua, Allah responds. You are never praying into the void — Allah is listening.",
    source: "Quran 2:152" },
  { id: 12, type: "reminder", tag: "Reminder", colors: ["#78350f", "#92400e"],
    title: "The Weight of Istighfar", arabic: "أَسْتَغْفِرُ اللهَ الْعَظِيمَ",
    content: "The Prophet ﷺ made istighfar over 70 times a day — the best of creation, who had no sins.\n\nImagine what our need is. Istighfar opens doors, removes hardship, invites rain, brings children, and grants provision.",
    source: "Quran 71:10–12" },
  { id: 13, type: "tip", tag: "Daily Tip", colors: ["#134e4a", "#164e63"],
    title: "The Power of Wudu", 
    content: "Each limb you wash in wudu, sins fall off it. The Prophet ﷺ said: 'Whoever perfects his wudu, his sins leave his body, even from under his fingernails.'\n\nWudu is not just ritual — it's a full spiritual reset before meeting Allah in prayer." },
  { id: 14, type: "quran", tag: "Quran", colors: ["#312e81", "#4c1d95"],
    title: "Allah Sees Your Heart", arabic: "إِنَّهُ عَلِيمٌ بِذَاتِ الصُّدُورِ",
    content: "Indeed, He is All-Knowing of what is within the breasts.\n\nAllah doesn't judge by your appearance, clothes, or status. He sees sincerity. A humble prayer in the dark of night, with a trembling heart, is worth more than the most public act of worship.",
    source: "Quran 35:38" },
  { id: 15, type: "hadith", tag: "Hadith", colors: ["#14532d", "#064e3b"],
    title: "Sadaqah Doesn't Decrease Wealth", arabic: "مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ",
    content: "Sadaqah does not decrease wealth. Allah increases it. In fact, the Prophet ﷺ said giving increases you in three ways:\n\n1. In actual blessing\n2. In generosity of character\n3. In Allah's love for you",
    source: "Sahih Muslim 2588" },
  { id: 16, type: "dua", tag: "Du'a", colors: ["#1e1b4b", "#1e3a8a"],
    title: "The Dua for Difficulty", arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
    content: "Allah is sufficient for us, and He is the best Disposer of affairs.\n\nThis was the dua of Ibrahim ﷺ when thrown into the fire — and the fire became cool. It was the dua of Muhammad ﷺ when told 'people have gathered against you.' Say it in every hardship.",
    source: "Quran 3:173, Bukhari 4563" },
  { id: 17, type: "fact", tag: "Did You Know?", colors: ["#1e1b4b", "#312e81"],
    title: "The Quran & Iron", arabic: "وَأَنزَلْنَا الْحَدِيدَ فِيهِ بَأْسٌ شَدِيدٌ",
    content: "'We sent down iron, in which is great strength and benefits for mankind.' The word 'iron' (حديد) appears in Surah Hadid, the 57th chapter. The atomic number of iron is 26. The word حديد appears in the 26th verse of that chapter.",
    source: "Quran 57:25" },
  { id: 18, type: "reminder", tag: "Reminder", colors: ["#064e3b", "#0f766e"],
    title: "Pray on Time — It's Your Anchor",
    content: "Ibn Masud asked the Prophet ﷺ: 'Which deed is most beloved to Allah?' He said: 'Prayer on time.' Then family ties. Then jihad.\n\nYour 5 daily prayers are anchors. Structure your day around them — not the other way around.",
    source: "Bukhari 527, Muslim 85" },
  { id: 19, type: "quran", tag: "Quran", colors: ["#4c1d95", "#5b21b6"],
    title: "With Every Difficulty — Ease", arabic: "وَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
    content: "So verily, with the hardship, there is relief.\n\nThe Arabic uses 'ma'a' (مع) — 'WITH the hardship' — not 'after'. Ease doesn't come after your trial ends. It accompanies it. You're not waiting — it's already there with you.",
    source: "Quran 94:6" },
  { id: 20, type: "tip", tag: "Daily Tip", colors: ["#7c2d12", "#92400e"],
    title: "Read Quran Every Day",
    content: "Even 5 minutes of Quran daily builds a relationship that protects you. The Prophet ﷺ said the Quran will intercede for its companion on the Day of Judgment.\n\nStart with just one page after Fajr. The consistency is what counts." },
  { id: 21, type: "hadith", tag: "Hadith", colors: ["#78350f", "#7c2d12"],
    title: "Control Your Anger", arabic: "لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ",
    content: "The strong man is not the one who can wrestle — he is the one who controls himself when angry.\n\nAnger is shaytan's greatest weapon. When angry: say A'uzu billah. Change position (sit if standing). Do wudu. It physically cools you.",
    source: "Sahih al-Bukhari 6114" },
  { id: 22, type: "fact", tag: "Did You Know?", colors: ["#1c1917", "#292524"],
    title: "Mount Everest & the Quran", arabic: "وَالْجِبَالَ أَوْتَادًا",
    content: "'Have We not made the earth a resting place and the mountains as pegs?' Modern geology confirms mountains have roots deeper than their height — like pegs/stakes in the earth, stabilizing tectonic plates. Stated 1,400 years ago.",
    source: "Quran 78:6–7" },
  { id: 23, type: "dua", tag: "Du'a", colors: ["#064e3b", "#065f46"],
    title: "Entering the Masjid", arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
    content: "O Allah, open the doors of Your mercy for me.\n\nEnter with your right foot. When leaving: 'Allahumma inni as'aluka min fadlak.' The Masjid is the house of Allah — you receive mercy simply by being there.",
    source: "Sahih Muslim 713" },
  { id: 24, type: "reminder", tag: "Reminder", colors: ["#881337", "#9f1239"],
    title: "Salawat on the Prophet ﷺ", arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ",
    content: "Every salawat = 10 blessings from Allah on you. He will intercede for you on the Day of Judgment.\n\n10 in the morning + 10 at night earns his intercession. 'The miser is the one in whose presence I am mentioned and he does not send salawat.'",
    source: "Sunan Abu Dawud 1047" },
  { id: 25, type: "quran", tag: "Quran", colors: ["#0c4a6e", "#0369a1"],
    title: "Never Despair of Allah's Mercy", arabic: "لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا",
    content: "Do not despair of the mercy of Allah. Indeed, Allah forgives ALL sins.\n\n'All sins' — no exception. If you feel you've gone too far, you haven't. The door of tawbah is open until your last breath.",
    source: "Quran 39:53" },
  { id: 26, type: "tip", tag: "Daily Tip", colors: ["#78350f", "#7c2d12"],
    title: "The Sunnah of Honey", arabic: "فِيهِ شِفَاءٌ لِّلنَّاسِ",
    content: "The Quran says honey has healing for people. Modern research confirms: antibacterial against MRSA, heals wounds, boosts immunity, reduces cough better than medicine.\n\nEat 1 tsp raw honey every morning — it's a sunnah food.",
    source: "Quran 16:69" },
  { id: 27, type: "hadith", tag: "Hadith", colors: ["#14532d", "#166534"],
    title: "Removing Harm is Faith", arabic: "الإِيمَانُ بِضْعٌ وَسَبْعُونَ شُعْبَةً",
    content: "Faith has 70+ branches. The highest is 'La ilaha illAllah'. The lowest is removing something harmful from the road.\n\nThe Prophet ﷺ moved a branch on a path and called it a branch of iman. Every small act counts.",
    source: "Sahih Muslim 35" },
  { id: 28, type: "fact", tag: "Did You Know?", colors: ["#1e3a8a", "#312e81"],
    title: "The Universe is Expanding", arabic: "وَالسَّمَاءَ بَنَيْنَاهَا بِأَيْدٍ وَإِنَّا لَمُوسِعُونَ",
    content: "'We built the heavens with power, and We are expanding it.' Edwin Hubble discovered cosmic expansion in 1929. The Quran stated it 1,400 years earlier — from a single point, expanding for 13.8 billion years.",
    source: "Quran 51:47" },
  { id: 29, type: "dua", tag: "Du'a", colors: ["#134e4a", "#164e63"],
    title: "Increase My Knowledge", arabic: "رَبِّ زِدْنِي عِلْمًا",
    content: "My Lord, increase me in knowledge.\n\nThe ONLY thing in the Quran where the Prophet ﷺ was commanded to ask for MORE of something. Not wealth, not power — knowledge.\n\nSay this before studying, before reading.",
    source: "Quran 20:114" },
  { id: 30, type: "reminder", tag: "Reminder", colors: ["#92400e", "#78350f"],
    title: "Shukr Multiplies Your Blessings", arabic: "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
    content: "If you are grateful, I will surely increase you in blessing.\n\nAllah uses a lam of oath — 'I SWEAR I will increase you.' A divine guarantee. Write 3 blessings every night — after 21 days, your baseline happiness rises measurably.",
    source: "Quran 14:7" },
  // ── Video Cards ───────────────────────────────────────────────────────────
  { id: 101, type: "video", tag: "Video Reminder", colors: ["#000000", "#18181b"],
    title: "The Power of Bismillah", youtubeId: "1Rl0mhSGbOU", channel: "Mufti Menk", duration: "8:42",
    content: "A short reminder on the immense power of saying Bismillah before everything you do." },
  { id: 102, type: "video", tag: "Video Reminder", colors: ["#000000", "#1c1917"],
    title: "Why Does Allah Test Us?", youtubeId: "dQHfaUhMx0E", channel: "Nouman Ali Khan", duration: "15:20",
    content: "Nouman Ali Khan explores the wisdom behind hardship and why trials are signs of Allah's love." },
  { id: 103, type: "video", tag: "Video Reminder", colors: ["#000000", "#18181b"],
    title: "Trust Allah's Plan", youtubeId: "JznXSbFj3Qo", channel: "Omar Suleiman", duration: "10:33",
    content: "When things don't go as planned — how do you find peace? Omar Suleiman explains tawakkul." },
  { id: 104, type: "video", tag: "Video Reminder", colors: ["#000000", "#18181b"],
    title: "Don't Be Sad – Allah Knows", youtubeId: "VEH7JePxC34", channel: "Mufti Menk", duration: "9:48",
    content: "Your pain is not hidden from Allah — and He is always near." },
  { id: 105, type: "video", tag: "Quran Recitation", colors: ["#000000", "#052e16"],
    title: "Surah Ar-Rahman — Full Recitation", youtubeId: "ORoeZjXs6qI", channel: "Mishary Rashid Alafasy", duration: "12:05",
    content: "A beautiful full recitation of Surah Ar-Rahman — 'Which of the favours of your Lord will you deny?'" },
  { id: 106, type: "video", tag: "Quran Recitation", colors: ["#000000", "#1e1b4b"],
    title: "Surah Al-Mulk — Heart Touching", youtubeId: "HlYqJEDlKMU", channel: "Abdul Rahman Al Sudais", duration: "8:30",
    content: "A moving recitation of Surah Al-Mulk (Chapter 67) — your nightly protector from the punishment of the grave." },
  { id: 107, type: "video", tag: "Video Reminder", colors: ["#000000", "#18181b"],
    title: "Most Powerful Duas from Quran", youtubeId: "7sP_0v3KZWQ", channel: "FreeQuranEducation", duration: "15:30",
    content: "A comprehensive compilation of the most powerful duas directly from the words of Allah in the Quran." },
  { id: 108, type: "video", tag: "Video Reminder", colors: ["#000000", "#1c1917"],
    title: "Powerful Dhikr for Daily Life", youtubeId: "XnP6TnYn3Zs", channel: "Omar Suleiman", duration: "18:25",
    content: "Omar Suleiman guides you through the most impactful daily dhikr to elevate every moment of your day." },
];

// Seeded shuffle so feed is consistent per day
function getDailySeed() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Tag colours ───────────────────────────────────────────────────────────────
const TAG_COLORS: Record<string, string> = {
  Hadith: "#C9A84C",
  Quran: "#7CB99E",
  Reminder: "#E8826A",
  "Did You Know?": "#9B8EC4",
  "Du'a": "#5B8DB8",
  "Daily Tip": "#F0A94A",
  "Video Reminder": "#EF4444",
  "Quran Recitation": "#10B981",
};

// ── Individual card ───────────────────────────────────────────────────────────
function FeedCard({ item, isActive }: { item: FeedItem; isActive: boolean }) {
  const insets = useSafeAreaInsets();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [thumbOk, setThumbOk] = useState(true);

  const tagColor = TAG_COLORS[item.tag] || "#C9A84C";

  async function openYouTube() {
    if (!item.youtubeId) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await WebBrowser.openBrowserAsync(`https://www.youtube.com/watch?v=${item.youtubeId}`);
  }

  async function onShare() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const msg = item.arabic
      ? `${item.title}\n\n${item.arabic}\n\n${item.content || ""}${item.source ? "\n\n— " + item.source : ""}`
      : `${item.title}\n\n${item.content || ""}`;
    Share.share({ message: msg });
  }

  return (
    <View style={{ width: W, height: H }}>
      <LinearGradient colors={item.colors} style={StyleSheet.absoluteFill} />

      {/* Video thumbnail */}
      {item.type === "video" && item.youtubeId && (
        <View style={s.thumbContainer}>
          {thumbOk ? (
            <Image
              source={{ uri: `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg` }}
              style={s.thumb}
              onError={() => setThumbOk(false)}
            />
          ) : (
            <View style={[s.thumb, { backgroundColor: "#111" }]} />
          )}
          <View style={s.thumbOverlay} />
          <TouchableOpacity style={s.playBtn} onPress={openYouTube} activeOpacity={0.8}>
            <View style={s.playCircle}>
              <Feather name="play" size={28} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Content */}
      <View
        style={[
          s.content,
          { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 80 },
        ]}
      >
        {/* Tag */}
        <View style={[s.tag, { backgroundColor: tagColor + "33", borderColor: tagColor + "66" }]}>
          <Text style={[s.tagText, { color: tagColor }]}>{item.tag}</Text>
        </View>

        {/* Arabic */}
        {item.arabic && !item.youtubeId && (
          <Text style={s.arabic}>{item.arabic}</Text>
        )}

        {/* Title */}
        <Text style={s.title}>{item.title}</Text>

        {/* Body */}
        {item.content && (
          <Text style={s.body}>{item.content}</Text>
        )}

        {/* Source */}
        {item.source && (
          <View style={s.sourceRow}>
            <Feather name="book-open" size={12} color="rgba(255,255,255,0.5)" />
            <Text style={s.sourceText}>{item.source}</Text>
          </View>
        )}

        {/* Video: channel + Watch button */}
        {item.type === "video" && (
          <View style={{ gap: 12, marginTop: 8 }}>
            {item.channel && (
              <View style={s.channelRow}>
                <Feather name="user" size={13} color="rgba(255,255,255,0.6)" />
                <Text style={s.channelText}>{item.channel}</Text>
                {item.duration && (
                  <>
                    <Feather name="clock" size={12} color="rgba(255,255,255,0.4)" />
                    <Text style={s.channelText}>{item.duration}</Text>
                  </>
                )}
              </View>
            )}
            <TouchableOpacity style={s.watchBtn} onPress={openYouTube} activeOpacity={0.85}>
              <Feather name="youtube" size={16} color="#fff" />
              <Text style={s.watchBtnText}>Watch on YouTube</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Side actions */}
      <View style={[s.actions, { bottom: insets.bottom + 90 }]}>
        <TouchableOpacity
          style={s.actionBtn}
          onPress={() => { setLiked(!liked); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
        >
          <Feather name="heart" size={24} color={liked ? "#FF6B6B" : "#fff"} />
          <Text style={s.actionLabel}>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={s.actionBtn}
          onPress={() => { setSaved(!saved); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
        >
          <Feather name="bookmark" size={24} color={saved ? "#C9A84C" : "#fff"} />
          <Text style={s.actionLabel}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.actionBtn} onPress={onShare}>
          <Feather name="share-2" size={24} color="#fff" />
          <Text style={s.actionLabel}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom hint */}
      <View style={[s.swipeHint, { bottom: insets.bottom + 60 }]}>
        <Feather name="chevron-up" size={16} color="rgba(255,255,255,0.4)" />
        <Text style={s.swipeHintText}>Swipe for more</Text>
      </View>
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function HalalTokScreen() {
  const insets = useSafeAreaInsets();
  const feed = React.useMemo(() => seededShuffle(FEED, getDailySeed()), []);
  const [activeIndex, setActiveIndex] = useState(0);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
    []
  );

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      {/* Header overlay */}
      <View style={[s.header, { paddingTop: insets.top + 4 }]} pointerEvents="none">
        <Text style={s.headerTitle}>HalalTok</Text>
        <Text style={s.headerSub}>Daily Islamic Feed</Text>
      </View>

      <FlatList
        data={feed}
        keyExtractor={(item) => String(item.id)}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={H}
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, index) => ({ length: H, offset: H * index, index })}
        renderItem={({ item, index }) => (
          <FeedCard item={item} isActive={index === activeIndex} />
        )}
      />
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: "center",
    paddingBottom: 8,
  },
  headerTitle: {
    color: "#C9A84C",
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    letterSpacing: 1,
  },
  headerSub: {
    color: "rgba(255,255,255,0.5)",
    fontFamily: "Inter_400Regular",
    fontSize: 11,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "flex-end",
    gap: 10,
  },
  tag: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 4,
  },
  tagText: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  arabic: {
    fontFamily: "Amiri_700Bold",
    fontSize: 26,
    color: "#fff",
    textAlign: "right",
    lineHeight: 44,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    color: "#fff",
    lineHeight: 30,
  },
  body: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: "rgba(255,255,255,0.85)",
    lineHeight: 24,
  },
  sourceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sourceText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
  },
  channelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  channelText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
  },
  watchBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#EF4444",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignSelf: "flex-start",
  },
  watchBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: "#fff",
  },
  actions: {
    position: "absolute",
    right: 16,
    gap: 20,
    alignItems: "center",
  },
  actionBtn: {
    alignItems: "center",
    gap: 4,
  },
  actionLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: "rgba(255,255,255,0.8)",
  },
  swipeHint: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    gap: 2,
  },
  swipeHintText: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: "rgba(255,255,255,0.35)",
  },
  thumbContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  thumb: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  thumbOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  playBtn: {
    position: "absolute",
    top: "40%",
    left: "50%",
    marginLeft: -36,
    marginTop: -36,
  },
  playCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
});
