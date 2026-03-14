import { Feather } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";

// ── Dua Categories ────────────────────────────────────────────────────────────

interface DuaCategory {
  id: string;
  name: string;
  arabic: string;
  icon: string;
  color: string;
  count: number;
  duas: DuaItem[];
}

interface DuaItem {
  arabic: string;
  transliteration: string;
  translation: string;
  source: string;
}

const CATEGORIES: DuaCategory[] = [
  {
    id: "morning", name: "Morning Adhkar", arabic: "أذكار الصباح", icon: "sunrise", color: "#F0A94A", count: 5,
    duas: [
      { arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ", transliteration: "Asbahna wa asbahal mulku lillah", translation: "We have entered a new morning and with it all dominion belongs to Allah.", source: "Muslim" },
      { arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ", transliteration: "Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namutu, wa ilaykan-nushur", translation: "O Allah, by Your leave we have reached the morning and by Your leave we have reached the evening, by Your leave we live and die and unto You is our resurrection.", source: "Tirmidhi" },
      { arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", transliteration: "SubhanAllahi wa bihamdihi", translation: "Glory and praise be to Allah. (Say 100 times)", source: "Muslim" },
      { arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي", transliteration: "Allahumma 'afini fi badani, Allahumma 'afini fi sam'i, Allahumma 'afini fi basari", translation: "O Allah, grant health to my body. O Allah, grant health to my hearing. O Allah, grant health to my eyesight.", source: "Abu Dawud" },
      { arabic: "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ", transliteration: "Hasbiyallahu la ilaha illa huwa, 'alayhi tawakkaltu wa huwa rabbul 'arshil 'azim", translation: "Allah is sufficient for me. There is no god but He. I have placed my trust in Him, He is Lord of the Majestic Throne.", source: "Abu Dawud" },
    ],
  },
  {
    id: "evening", name: "Evening Adhkar", arabic: "أذكار المساء", icon: "sunset", color: "#E8826A", count: 4,
    duas: [
      { arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ", transliteration: "Amsayna wa amsal mulku lillah", translation: "We have entered the evening and with it all dominion belongs to Allah.", source: "Muslim" },
      { arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ", transliteration: "Allahumma inni as'aluka al-'afiyata fid-dunya wal-akhira", translation: "O Allah, I ask You for well-being in this world and the next.", source: "Ibn Majah" },
      { arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ", transliteration: "Bismillahil-ladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'i wa huwas-sami'ul-'alim", translation: "In the name of Allah with Whose name nothing is harmed on earth or in the heavens, and He is the All-Hearing, All-Knowing.", source: "Tirmidhi" },
      { arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ", transliteration: "A'udhu bikalimatillahit-tammati min sharri ma khalaq", translation: "I seek refuge in the perfect words of Allah from the evil of what He has created.", source: "Muslim" },
    ],
  },
  {
    id: "sleep", name: "Before Sleep", arabic: "قبل النوم", icon: "moon", color: "#8B7EC8", count: 4,
    duas: [
      { arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا", transliteration: "Bismika Allahumma amutu wa ahya", translation: "In Your name, O Allah, I die and I live.", source: "Bukhari" },
      { arabic: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ", transliteration: "Allahumma qini 'adhabaka yawma tab'athu 'ibadak", translation: "O Allah, protect me from Your punishment on the Day You resurrect Your servants.", source: "Abu Dawud, Tirmidhi" },
      { arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ", transliteration: "Subhanaka Allahumma wa bihamdika, ash-hadu an la ilaha illa anta, astaghfiruka wa atubu ilayk", translation: "Glory and praise be to You, O Allah. I bear witness that there is no god but You. I seek Your forgiveness and repent to You.", source: "Tirmidhi" },
      { arabic: "اللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ وَفَوَّضْتُ أَمْرِي إِلَيْكَ", transliteration: "Allahumma aslamtu nafsi ilayk, wa fawwadtu amri ilayk", translation: "O Allah, I have submitted myself to You and entrusted my affairs to You.", source: "Bukhari, Muslim" },
    ],
  },
  {
    id: "waking", name: "Upon Waking", arabic: "عند الاستيقاظ", icon: "sun", color: "#F0A94A", count: 3,
    duas: [
      { arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ", transliteration: "Alhamdu lillahil-ladhi ahyana ba'da ma amatana wa ilayhin-nushur", translation: "All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection.", source: "Bukhari" },
      { arabic: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", transliteration: "La ilaha illallah wahdahu la sharika lah, lahul mulku wa lahul hamdu wa huwa 'ala kulli shay'in qadir", translation: "There is no god but Allah alone, without partner. His is the sovereignty and His is the praise, and He is over all things omnipotent.", source: "Bukhari" },
      { arabic: "سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ", transliteration: "Subhanallah, walhamdulillah, wa la ilaha illallah, wallahu akbar", translation: "Glory be to Allah, all praise is for Allah, there is no god but Allah, and Allah is the Greatest.", source: "Tirmidhi" },
    ],
  },
  {
    id: "anxiety", name: "Anxiety & Worry", arabic: "الهم والحزن", icon: "heart", color: "#E8826A", count: 4,
    duas: [
      { arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ", transliteration: "Allahumma inni a'udhu bika minal-hammi wal-hazan", translation: "O Allah, I seek refuge in You from worry and grief.", source: "Bukhari 6369" },
      { arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ", transliteration: "Hasbunallahu wa ni'mal wakil", translation: "Allah is sufficient for us, and He is the best Disposer of affairs.", source: "Quran 3:173" },
      { arabic: "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ", transliteration: "La ilaha illa anta subhanaka inni kuntu minaz-zalimin", translation: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.", source: "Quran 21:87 (Dua of Yunus)" },
      { arabic: "رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا", transliteration: "Rabbana la tu'akhidhna in nasina aw akhta'na", translation: "Our Lord, do not impose blame upon us if we have forgotten or erred.", source: "Quran 2:286" },
    ],
  },
  {
    id: "food", name: "Food & Drink", arabic: "الطعام والشراب", icon: "coffee", color: "#C9A84C", count: 3,
    duas: [
      { arabic: "بِسْمِ اللَّهِ", transliteration: "Bismillah", translation: "In the name of Allah. (Say before eating)", source: "Abu Dawud" },
      { arabic: "اللَّهُمَّ بَارِكْ لَنَا فِيهِ وَأَطْعِمْنَا خَيْرًا مِنْهُ", transliteration: "Allahumma barik lana fihi wa at'imna khayran minhu", translation: "O Allah, bless it for us and provide us with better than it.", source: "Tirmidhi" },
      { arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ", transliteration: "Alhamdu lillahil-ladhi at'amani hadha wa razaqanihi min ghayri hawlin minni wa la quwwa", translation: "Praise be to Allah Who has fed me this and provided it for me without any power or strength from me.", source: "Tirmidhi, Ibn Majah" },
    ],
  },
  {
    id: "travel", name: "Travel", arabic: "السفر", icon: "navigation", color: "#5B8DB8", count: 3,
    duas: [
      { arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنقَلِبُونَ", transliteration: "Subhanal-ladhi sakhkhara lana hadha wa ma kunna lahu muqrinin wa inna ila rabbina lamunqalibun", translation: "Exalted is He who has subjected this to us, and we could not have [otherwise] subdued it. And indeed we, to our Lord, will [surely] return.", source: "Quran 43:13-14" },
      { arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ فِي سَفَرِي هَذَا الْبِرَّ وَالتَّقْوَى", transliteration: "Allahumma inni as'aluka fi safari hadhal-birra wat-taqwa", translation: "O Allah, I ask You in this journey of mine for righteousness and piety.", source: "Muslim" },
      { arabic: "اللَّهُمَّ أَنْتَ الصَّاحِبُ فِي السَّفَرِ وَالْخَلِيفَةُ فِي الْأَهْلِ", transliteration: "Allahumma antas-sahibu fis-safari wal-khalifatu fil-ahl", translation: "O Allah, You are the Companion in travel and the Protector of the family.", source: "Muslim" },
    ],
  },
  {
    id: "protection", name: "Protection", arabic: "الحماية", icon: "shield", color: "#7CB99E", count: 4,
    duas: [
      { arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ", transliteration: "A'udhu bikalimatillahit-tammati min sharri ma khalaq", translation: "I seek refuge in the perfect words of Allah from the evil of what He has created.", source: "Muslim" },
      { arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ", transliteration: "Bismillahil-ladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'", translation: "In the name of Allah with Whose name nothing is harmed on earth or in the heavens.", source: "Tirmidhi" },
      { arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", transliteration: "Qul a'udhu bi rabbil-falaq", translation: "Say: I seek refuge with the Lord of the daybreak. (Surah Al-Falaq)", source: "Quran 113" },
      { arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", transliteration: "Qul a'udhu bi rabbin-nas", translation: "Say: I seek refuge with the Lord of mankind. (Surah An-Nas)", source: "Quran 114" },
    ],
  },
  {
    id: "forgiveness", name: "Seeking Forgiveness", arabic: "الاستغفار", icon: "refresh-cw", color: "#9B8EC4", count: 4,
    duas: [
      { arabic: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ", transliteration: "Astaghfirullaha al-'azim alladhi la ilaha illa huwal-hayyul-qayyumu wa atubu ilaih", translation: "I seek forgiveness from Allah, the Magnificent, the one besides whom there is no god, the Ever-Living, the Self-Subsisting, and I repent to Him.", source: "Tirmidhi, Abu Dawud" },
      { arabic: "رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ", transliteration: "Rabbighfir li wa tub 'alayya innaka antat-tawwabur-rahim", translation: "My Lord, forgive me and accept my repentance, You are the Accepter of repentance, the Most Merciful.", source: "Tirmidhi, Ibn Majah" },
      { arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ", transliteration: "Allahumma anta rabbi la ilaha illa anta khalaqtani wa ana 'abduk", translation: "O Allah, You are my Lord, there is no god but You. You created me and I am Your servant.", source: "Bukhari (Sayyidul Istighfar)" },
      { arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ", transliteration: "Subhanakal-lahumma wa bihamdika ash-hadu an la ilaha illa anta astaghfiruka wa atubu ilayk", translation: "Glory and praise be to You, O Allah. I bear witness that there is no god but You. I seek Your forgiveness and repent to You.", source: "Tirmidhi" },
    ],
  },
  {
    id: "parents", name: "For Parents", arabic: "الوالدين", icon: "users", color: "#E8826A", count: 3,
    duas: [
      { arabic: "رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا", transliteration: "Rabbi irhamhuma kama rabbayani saghira", translation: "My Lord, have mercy upon them as they brought me up [when I was] small.", source: "Quran 17:24" },
      { arabic: "رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَلِمَن دَخَلَ بَيْتِيَ مُؤْمِنًا", transliteration: "Rabbighfir li wa liwali dayya wa liman dakhala bayti mu'mina", translation: "My Lord, forgive me and my parents and whoever enters my house as a believer.", source: "Quran 71:28" },
      { arabic: "اللَّهُمَّ اغْفِرْ لِي وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا", transliteration: "Allahumma ighfir li wa liwali dayya warhamhuma kama rabbayani saghira", translation: "O Allah, forgive me and my parents and have mercy on them as they raised me when I was young.", source: "Tirmidhi" },
    ],
  },
  {
    id: "knowledge", name: "Knowledge & Study", arabic: "العلم", icon: "book-open", color: "#5B8DB8", count: 3,
    duas: [
      { arabic: "رَبِّ زِدْنِي عِلْمًا", transliteration: "Rabbi zidni 'ilma", translation: "My Lord, increase me in knowledge.", source: "Quran 20:114" },
      { arabic: "اللَّهُمَّ انْفَعْنِي بِمَا عَلَّمْتَنِي وَعَلِّمْنِي مَا يَنْفَعُنِي", transliteration: "Allahumma infa'ni bima 'allamtani wa 'allimni ma yanfa'uni", translation: "O Allah, benefit me with what You have taught me and teach me what will benefit me.", source: "Tirmidhi, Ibn Majah" },
      { arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عِلْمٍ لَا يَنْفَعُ", transliteration: "Allahumma inni a'udhu bika min 'ilmin la yanfa'", translation: "O Allah, I seek refuge in You from knowledge that does not benefit.", source: "Muslim" },
    ],
  },
  {
    id: "illness", name: "Illness & Health", arabic: "المرض والشفاء", icon: "activity", color: "#7CB99E", count: 4,
    duas: [
      { arabic: "اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَأْسَ وَاشْفِ أَنْتَ الشَّافِي لَا شِفَاءَ إِلَّا شِفَاؤُكَ", transliteration: "Allahumma rabban-nasi adhhibil-ba'sa washfi antash-shafi la shifa'a illa shifa'uk", translation: "O Allah, Lord of mankind, remove the harm and heal, You are the Healer, there is no healing except Yours.", source: "Bukhari, Muslim" },
      { arabic: "أَسْأَلُ اللَّهَ الْعَظِيمَ رَبَّ الْعَرْشِ الْعَظِيمِ أَنْ يَشْفِيَكَ", transliteration: "As'alullahal-'azima rabbal-'arshil-'azimi an yashfiyak", translation: "I ask Allah the Mighty, Lord of the Mighty Throne, to cure you.", source: "Abu Dawud, Tirmidhi (say 7 times)" },
      { arabic: "بِسْمِ اللَّهِ أَرْقِيكَ مِنْ كُلِّ شَيْءٍ يُؤْذِيكَ", transliteration: "Bismillahi arqika min kulli shay'in yu'dhik", translation: "In the name of Allah I perform ruqyah for you, from everything that harms you.", source: "Muslim" },
      { arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي اللَّهُمَّ عَافِنِي فِي سَمْعِي اللَّهُمَّ عَافِنِي فِي بَصَرِي", transliteration: "Allahumma 'afini fi badani, Allahumma 'afini fi sam'i, Allahumma 'afini fi basari", translation: "O Allah, grant me health in my body. O Allah, grant me health in my hearing. O Allah, grant me health in my sight.", source: "Abu Dawud" },
    ],
  },
  {
    id: "grief", name: "Grief & Loss", arabic: "الحزن والمصيبة", icon: "cloud", color: "#8B7EC8", count: 3,
    duas: [
      { arabic: "إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ", transliteration: "Inna lillahi wa inna ilayhi raji'un", translation: "Indeed, to Allah we belong and to Him we shall return.", source: "Quran 2:156" },
      { arabic: "اللَّهُمَّ أْجُرْنِي فِي مُصِيبَتِي وَأَخْلِفْ لِي خَيْرًا مِنْهَا", transliteration: "Allahumma ajurni fi musibati wa akhlif li khayran minha", translation: "O Allah, reward me in my affliction and replace it with something better.", source: "Muslim" },
      { arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ", transliteration: "Allahumma inni a'udhu bika minal-hammi wal-hazani wal-'ajzi wal-kasal", translation: "O Allah, I seek refuge in You from worry, grief, incapacity and laziness.", source: "Bukhari" },
    ],
  },
  {
    id: "dua-accepted", name: "Best Times for Dua", arabic: "أوقات إجابة الدعاء", icon: "clock", color: "#C9A84C", count: 4,
    duas: [
      { arabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ أُجِيبُ دَعْوَةَ الدَّاعِ", transliteration: "Wa idha sa'alaka 'ibadi 'anni fa inni qarib, ujibud-da'wata id-da'i", translation: "And when My servants ask you about Me — indeed I am near. I respond to the invocation of the supplicant when he calls upon Me.", source: "Quran 2:186" },
      { arabic: "يَنْزِلُ رَبُّنَا كُلَّ لَيْلَةٍ إِلَى السَّمَاءِ الدُّنْيَا حِينَ يَبْقَى ثُلُثُ اللَّيْلِ الْآخِرُ", transliteration: "Yanzilu rabbuna kulla laylatin ilas-sama'id-dunya hina yabqa thuluthul-layhil-akhir", translation: "Our Lord descends each night to the lowest heaven when the last third of the night remains, calling: Who will call on Me so I may answer?", source: "Bukhari, Muslim" },
      { arabic: "دَعْوَةُ الصَّائِمِ لَا تُرَدُّ", transliteration: "Da'watus-sa'imi la turad", translation: "The supplication of a fasting person is not rejected.", source: "Ibn Majah" },
      { arabic: "ثَلَاثُ دَعَوَاتٍ مُسْتَجَابَاتٌ", transliteration: "Thalath da'awat mustajabat", translation: "Three prayers are answered (without doubt): prayer of the oppressed, prayer of the traveller, prayer of a parent for their child.", source: "Tirmidhi" },
    ],
  },
  {
    id: "gratitude", name: "Gratitude", arabic: "الشكر", icon: "star", color: "#F0A94A", count: 3,
    duas: [
      { arabic: "الْحَمْدُ لِلَّهِ الَّذِي بِنِعْمَتِهِ تَتِمُّ الصَّالِحَاتُ", transliteration: "Alhamdu lillahil-ladhi bi ni'matihi tatimmus-salihat", translation: "All praise is for Allah by Whose grace good deeds are completed.", source: "Ibn Majah" },
      { arabic: "رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَى وَالِدَيَّ", transliteration: "Rabbi awzi'ni an ashkura ni'mataka allati an'amta 'alayya wa 'ala walidayya", translation: "My Lord, enable me to be grateful for Your favor which You have bestowed upon me and upon my parents.", source: "Quran 46:15" },
      { arabic: "اللَّهُمَّ لَكَ الْحَمْدُ كُلُّهُ وَلَكَ الْمُلْكُ كُلُّهُ وَبِيَدِكَ الْخَيْرُ كُلُّهُ", transliteration: "Allahumma lakal-hamdu kulluhu wa lakal-mulku kulluhu wa bi yadikal-khayru kulluh", translation: "O Allah, all praise belongs to You, all dominion belongs to You and all good is in Your hands.", source: "Muslim" },
    ],
  },
];

// ── Section colours ────────────────────────────────────────────────────────────
const ICON_FEATHER_MAP: Record<string, string> = {
  sunrise: "sunrise", sunset: "sunset", moon: "moon", sun: "sun",
  heart: "heart", coffee: "coffee", navigation: "navigation", shield: "shield",
  "refresh-cw": "refresh-cw", users: "users", "book-open": "book-open",
  activity: "activity", cloud: "cloud", clock: "clock", star: "star",
};

export default function LibraryScreen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const tabHeight = useBottomTabBarHeight();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<DuaCategory | null>(null);
  const styles = makeStyles(colors);

  const filtered = CATEGORIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.arabic.includes(search)
  );

  const numCols = 2;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={[styles.title, { color: colors.text }]}>Library</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>Duas & Adhkar</Text>
      </View>

      {/* Search */}
      <View style={[styles.searchRow, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <Feather name="search" size={16} color={colors.textMuted} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search duas…"
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        {search ? (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Feather name="x" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Grid */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={numCols}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: tabHeight + 24, gap: 12 }}
        columnWrapperStyle={{ gap: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder, flex: 1 }]}
            activeOpacity={0.8}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelected(item);
            }}
          >
            <View style={[styles.iconCircle, { backgroundColor: item.color + "22" }]}>
              <Feather
                name={(ICON_FEATHER_MAP[item.icon] || "book") as any}
                size={22}
                color={item.color}
              />
            </View>
            <Text style={[styles.cardName, { color: colors.text }]}>{item.name}</Text>
            <Text style={[styles.cardArabic, { color: colors.textMuted }]}>{item.arabic}</Text>
            <View style={styles.countRow}>
              <Text style={[styles.countText, { color: item.color }]}>{item.duas.length} duas</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Dua modal */}
      <Modal visible={!!selected} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setSelected(null)}>
        {selected && (
          <View style={[styles.modal, { backgroundColor: colors.background }]}>
            {/* Modal header */}
            <View style={[styles.modalHeader, { borderBottomColor: colors.separator }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>{selected.name}</Text>
                <Text style={[styles.modalSubtitle, { color: colors.textMuted }]}>{selected.arabic}</Text>
              </View>
              <TouchableOpacity onPress={() => setSelected(null)} style={styles.closeBtn}>
                <Feather name="x" size={22} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 40 }}>
              {selected.duas.map((dua, i) => (
                <View
                  key={i}
                  style={[styles.duaCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
                >
                  <View style={[styles.duaNum, { backgroundColor: selected.color + "22" }]}>
                    <Text style={[styles.duaNumText, { color: selected.color }]}>{i + 1}</Text>
                  </View>
                  <Text style={[styles.duaArabic, { color: colors.text }]}>{dua.arabic}</Text>
                  <Text style={[styles.duaTrans, { color: colors.primary }]} numberOfLines={2}>{dua.transliteration}</Text>
                  <View style={[styles.divider, { backgroundColor: colors.separator }]} />
                  <Text style={[styles.duaEng, { color: colors.textSecondary }]}>{dua.translation}</Text>
                  <View style={[styles.sourceChip, { backgroundColor: colors.gold + "22" }]}>
                    <Text style={[styles.sourceChipText, { color: colors.gold }]}>{dua.source}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  );
}

function makeStyles(colors: typeof Colors.light) {
  return StyleSheet.create({
    container: { flex: 1 },
    header: { paddingHorizontal: 20, paddingBottom: 12 },
    title: { fontFamily: "Inter_700Bold", fontSize: 28, letterSpacing: -0.5 },
    subtitle: { fontFamily: "Inter_400Regular", fontSize: 13, marginTop: 2 },
    searchRow: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: 16,
      marginBottom: 12,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 14,
      borderWidth: 1,
      gap: 10,
    },
    searchInput: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 14 },
    card: {
      borderRadius: 18,
      padding: 14,
      gap: 6,
      borderWidth: 1,
    },
    iconCircle: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 4,
    },
    cardName: { fontFamily: "Inter_600SemiBold", fontSize: 14, lineHeight: 20 },
    cardArabic: { fontFamily: "Amiri_400Regular", fontSize: 13, textAlign: "right" },
    countRow: { marginTop: 4 },
    countText: { fontFamily: "Inter_500Medium", fontSize: 12 },
    modal: { flex: 1 },
    modalHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      padding: 20,
      paddingTop: 24,
      borderBottomWidth: 1,
    },
    modalTitle: { fontFamily: "Inter_700Bold", fontSize: 22 },
    modalSubtitle: { fontFamily: "Amiri_400Regular", fontSize: 16, marginTop: 2 },
    closeBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
    },
    duaCard: {
      borderRadius: 18,
      padding: 16,
      gap: 8,
      borderWidth: 1,
    },
    duaNum: {
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "flex-start",
    },
    duaNumText: { fontFamily: "Inter_700Bold", fontSize: 13 },
    duaArabic: {
      fontFamily: "Amiri_700Bold",
      fontSize: 22,
      textAlign: "right",
      lineHeight: 38,
    },
    duaTrans: {
      fontFamily: "Inter_500Medium",
      fontSize: 13,
      fontStyle: "italic",
    },
    divider: { height: 1, marginVertical: 4 },
    duaEng: { fontFamily: "Inter_400Regular", fontSize: 13, lineHeight: 20 },
    sourceChip: {
      alignSelf: "flex-start",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 10,
      marginTop: 4,
    },
    sourceChipText: { fontFamily: "Inter_600SemiBold", fontSize: 11 },
  });
}
