import { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { haptic } from "@/lib/haptics";
import { playAchievementChime } from "@/lib/sounds";
import { Share2, BarChart3, X, Trophy, HelpCircle, RotateCcw, Clock } from "lucide-react";

interface Puzzle {
  id: number;
  surahName: string;
  ayahRef: string;
  arabic: string;
  transliteration: string;
  words: [string, string, string, string, string];
  decoys: string[];
  translation: string;
}

const PUZZLES: Puzzle[] = [
  {
    id: 1, surahName: "Al-Fatiha", ayahRef: "1:2",
    arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    transliteration: "Alhamdu lillāhi rabbi al-'ālamīn",
    words: ["All praise", "belongs to", "Allah", "Lord of", "the worlds"],
    decoys: ["the heavens", "Creator of", "Master of"],
    translation: "All praise is due to Allah, Lord of the worlds.",
  },
  {
    id: 2, surahName: "Al-Baqarah", ayahRef: "2:286",
    arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
    transliteration: "Lā yukallifu Allāhu nafsan illā wus'ahā",
    words: ["Allah does not", "burden", "a soul", "beyond", "its capacity"],
    decoys: ["its limits", "what it bears", "any hardship"],
    translation: "Allah does not burden a soul beyond that it can bear.",
  },
  {
    id: 3, surahName: "Al-Ikhlas", ayahRef: "112:1-2",
    arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ اللَّهُ الصَّمَدُ",
    transliteration: "Qul huwa Allāhu aḥad Allāhu aṣ-ṣamad",
    words: ["Say", "He is Allah", "the One", "Allah", "the Eternal"],
    decoys: ["the Almighty", "the Creator", "the Most Great"],
    translation: "Say: He is Allah, the One, Allah the Eternal Refuge.",
  },
  {
    id: 4, surahName: "Ash-Sharh", ayahRef: "94:5",
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
    transliteration: "Fa-inna ma'a al-'usri yusrā",
    words: ["Indeed", "with", "every hardship", "comes", "ease"],
    decoys: ["patience", "after difficulty", "relief"],
    translation: "For indeed, with hardship comes ease.",
  },
  {
    id: 5, surahName: "Al-Baqarah", ayahRef: "2:152",
    arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ",
    transliteration: "Fa-dhkurūnī adhkurkum wash-kurū lī wa-lā takfurūn",
    words: ["Remember Me", "I will remember you", "be grateful", "to Me", "do not deny"],
    decoys: ["and worship", "and praise", "and thank"],
    translation: "So remember Me; I will remember you. Be grateful to Me and do not deny Me.",
  },
  {
    id: 6, surahName: "Ar-Ra'd", ayahRef: "13:28",
    arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    transliteration: "Alā bi-dhikri Allāhi taṭma'innu al-qulūb",
    words: ["Verily", "in the remembrance", "of Allah", "find rest", "the hearts"],
    decoys: ["the souls", "the minds", "do find peace"],
    translation: "Verily, in the remembrance of Allah do hearts find rest.",
  },
  {
    id: 7, surahName: "Al-Ankabut", ayahRef: "29:69",
    arabic: "وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا",
    transliteration: "Wa-alladhīna jāhadū fīnā la-nahdiyanna-hum subulanā",
    words: ["Those who strive", "in Our cause", "We will surely", "guide them", "to Our ways"],
    decoys: ["reward them", "aid them", "to Our path"],
    translation: "And those who strive for Us — We will surely guide them to Our ways.",
  },
  {
    id: 8, surahName: "At-Talaq", ayahRef: "65:3",
    arabic: "وَمَنْ يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    transliteration: "Wa-man yatawakkal 'alā Allāhi fa-huwa ḥasbuh",
    words: ["Whoever relies", "upon Allah", "then He is", "sufficient", "for him"],
    decoys: ["his helper", "his protector", "enough for all"],
    translation: "And whoever relies upon Allah — then He is sufficient for him.",
  },
  {
    id: 9, surahName: "Ibrahim", ayahRef: "14:7",
    arabic: "لَئِنْ شَكَرْتُمْ لَأَزِيدَنَّكُمْ وَلَئِنْ كَفَرْتُمْ إِنَّ عَذَابِي لَشَدِيدٌ",
    transliteration: "La'in shakartum la-azīdannakum wa-la'in kafartum inna 'adhābī la-shadīd",
    words: ["If you are grateful", "I will increase you", "and if you disbelieve", "My punishment", "is severe"],
    decoys: ["is great", "will come", "is harsh"],
    translation: "If you are grateful, I will surely increase you; and if you deny, My punishment is severe.",
  },
  {
    id: 10, surahName: "Al-Baqarah", ayahRef: "2:186",
    arabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ",
    transliteration: "Wa-idhā sa'alaka 'ibādī 'annī fa-innī qarīb",
    words: ["When My servants", "ask you about Me", "tell them", "I am", "near"],
    decoys: ["All-Hearing", "watching", "ever close"],
    translation: "And when My servants ask you about Me — indeed I am near.",
  },
  {
    id: 11, surahName: "Al-Baqarah", ayahRef: "2:153",
    arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    transliteration: "Inna Allāha ma'a aṣ-ṣābirīn",
    words: ["Indeed", "Allah", "is with", "the patient", "ones"],
    decoys: ["the grateful", "the believers", "the righteous"],
    translation: "Indeed, Allah is with the patient.",
  },
  {
    id: 12, surahName: "Al-Hashr", ayahRef: "59:22",
    arabic: "اللَّهُ الَّذِي لَا إِلَهَ إِلَّا هُوَ",
    transliteration: "Allāhu alladhī lā ilāha illā huwa",
    words: ["Allah", "there is no", "deity", "except", "Him"],
    decoys: ["other than", "besides", "the Almighty"],
    translation: "Allah — there is no deity except Him.",
  },
  {
    id: 13, surahName: "Taha", ayahRef: "20:114",
    arabic: "وَقُلْ رَبِّ زِدْنِي عِلْمًا",
    transliteration: "Wa-qul rabbi zidnī 'ilmā",
    words: ["And say", "My Lord", "increase me", "in", "knowledge"],
    decoys: ["in wisdom", "in faith", "in guidance"],
    translation: "And say: My Lord, increase me in knowledge.",
  },
  {
    id: 14, surahName: "Al-Anbiya", ayahRef: "21:87",
    arabic: "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
    transliteration: "Lā ilāha illā anta subḥānaka innī kuntu min aẓ-ẓālimīn",
    words: ["There is no deity", "except You", "Glory be to You", "I have been", "among the wrongdoers"],
    decoys: ["among the heedless", "a sinner", "forgive me"],
    translation: "There is no deity except You; exalted are You. Indeed I have been of the wrongdoers.",
  },
  {
    id: 15, surahName: "Al-Imran", ayahRef: "3:139",
    arabic: "وَأَنْتُمُ الْأَعْلَوْنَ إِنْ كُنْتُمْ مُؤْمِنِينَ",
    transliteration: "Wa-antumu al-a'lawna in kuntum mu'minīn",
    words: ["You are", "the superior ones", "if only", "you are", "true believers"],
    decoys: ["the victors", "the guided", "the thankful"],
    translation: "And you will be superior if you are believers.",
  },
  {
    id: 16, surahName: "Ghafir", ayahRef: "40:60",
    arabic: "وَقَالَ رَبُّكُمُ ادْعُونِي أَسْتَجِبْ لَكُمْ",
    transliteration: "Wa-qāla rabbukumu ud'ūnī astajib lakum",
    words: ["Your Lord has said", "Call upon Me", "and I will", "respond", "to you"],
    decoys: ["answer you", "grant you", "hear you"],
    translation: "And your Lord says: Call upon Me and I will respond to you.",
  },
  {
    id: 17, surahName: "Az-Zumar", ayahRef: "39:53",
    arabic: "لَا تَقْنَطُوا مِنْ رَحْمَةِ اللَّهِ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا",
    transliteration: "Lā taqnaṭū min raḥmati Allāhi inna Allāha yaghfiru adh-dhunūba jamī'ā",
    words: ["Do not despair", "of the mercy", "of Allah", "He forgives", "all sins"],
    decoys: ["all wrongs", "every wrong", "the repentant"],
    translation: "Do not despair of the mercy of Allah. Indeed, Allah forgives all sins.",
  },
  {
    id: 18, surahName: "Al-Imran", ayahRef: "3:160",
    arabic: "إِنْ يَنْصُرْكُمُ اللَّهُ فَلَا غَالِبَ لَكُمْ",
    transliteration: "In yanṣurkumu Allāhu fa-lā ghāliba lakum",
    words: ["If Allah helps you", "there is no one", "who can", "overcome", "you"],
    decoys: ["defeat you", "harm you", "stop you"],
    translation: "If Allah should aid you, no one can overcome you.",
  },
  {
    id: 19, surahName: "Al-Baqarah", ayahRef: "2:45",
    arabic: "وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ وَإِنَّهَا لَكَبِيرَةٌ إِلَّا عَلَى الْخَاشِعِينَ",
    transliteration: "Wa-sta'īnū biṣ-ṣabri waṣ-ṣalāh wa-innahā la-kabīratun illā 'alā al-khāshi'īn",
    words: ["Seek help", "through patience", "and prayer", "though it is heavy", "except for the humble"],
    decoys: ["for the devoted", "for the pious", "for the patient"],
    translation: "Seek help through patience and prayer — though it is heavy except for the humbly submissive.",
  },
  {
    id: 20, surahName: "Yusuf", ayahRef: "12:87",
    arabic: "لَا يَيْأَسُ مِنْ رَوْحِ اللَّهِ إِلَّا الْقَوْمُ الْكَافِرُونَ",
    transliteration: "Lā yay'asu min rawḥi Allāhi illā al-qawmu al-kāfirūn",
    words: ["None despairs", "of the relief", "from Allah", "except", "the disbelievers"],
    decoys: ["the wrongdoers", "the heedless", "the deniers"],
    translation: "No one despairs of relief from Allah except the disbelieving people.",
  },
  {
    id: 21, surahName: "Al-Fatiha", ayahRef: "1:5",
    arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    transliteration: "Iyyāka na'budu wa-iyyāka nasta'īn",
    words: ["You alone", "we worship", "and You alone", "we ask", "for help"],
    decoys: ["we seek", "we praise", "we trust"],
    translation: "It is You we worship and You we ask for help.",
  },
  {
    id: 22, surahName: "Al-Baqarah", ayahRef: "2:255",
    arabic: "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
    transliteration: "Allāhu lā ilāha illā huwa al-Ḥayyu al-Qayyūm",
    words: ["Allah", "there is no deity", "except Him", "the Ever-Living", "the Sustainer"],
    decoys: ["the All-Knowing", "the Most High", "the Eternal"],
    translation: "Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence.",
  },
  {
    id: 23, surahName: "Hud", ayahRef: "11:88",
    arabic: "وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ عَلَيْهِ تَوَكَّلْتُ وَإِلَيْهِ أُنِيبُ",
    transliteration: "Wa-mā tawfīqī illā bi-Allāhi 'alayhi tawakkaltu wa-ilayhi unīb",
    words: ["My success", "is only through", "Allah", "upon Him I rely", "and to Him I turn"],
    decoys: ["I trust", "I return", "I worship"],
    translation: "My success is only through Allah. Upon Him I rely and to Him I turn.",
  },
  {
    id: 24, surahName: "Al-Furqan", ayahRef: "25:63",
    arabic: "وَعِبَادُ الرَّحْمَنِ الَّذِينَ يَمْشُونَ عَلَى الْأَرْضِ هَوْنًا",
    transliteration: "Wa-'ibādu ar-Raḥmāni alladhīna yamshūna 'alā al-arḍi hawanā",
    words: ["The servants of", "the Most Merciful", "who walk", "upon the earth", "humbly"],
    decoys: ["gently", "quietly", "with humility"],
    translation: "The servants of the Most Merciful are those who walk upon the earth humbly.",
  },
  {
    id: 25, surahName: "Az-Zumar", ayahRef: "39:10",
    arabic: "إِنَّمَا يُوَفَّى الصَّابِرُونَ أَجْرَهُمْ بِغَيْرِ حِسَابٍ",
    transliteration: "Innamā yuwaffā aṣ-ṣābirūna ajrahum bi-ghayri ḥisāb",
    words: ["Indeed", "the patient", "will be given", "their reward", "without limit"],
    decoys: ["without measure", "abundantly", "in full"],
    translation: "Indeed, the patient will be given their reward without limit.",
  },
  {
    id: 26, surahName: "Al-Fatiha", ayahRef: "1:6-7",
    arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ",
    transliteration: "Ihdinā aṣ-ṣirāṭa al-mustaqīm ṣirāṭa alladhīna an'amta 'alayhim",
    words: ["Guide us", "to the straight path", "the path of those", "whom You have", "blessed"],
    decoys: ["rewarded", "guided", "favored"],
    translation: "Guide us to the straight path — the path of those upon whom You have bestowed favor.",
  },
  {
    id: 27, surahName: "Al-Hadid", ayahRef: "57:3",
    arabic: "هُوَ الْأَوَّلُ وَالْآخِرُ وَالظَّاهِرُ وَالْبَاطِنُ",
    transliteration: "Huwa al-Awwalu wa-l-Ākhiru wa-ẓ-Ẓāhiru wa-l-Bāṭin",
    words: ["He is", "the First", "and the Last", "the Manifest", "and the Hidden"],
    decoys: ["and the Outward", "the Eternal", "and the Knowing"],
    translation: "He is the First and the Last, the Manifest and the Hidden.",
  },
  {
    id: 28, surahName: "Al-Baqarah", ayahRef: "2:156",
    arabic: "إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ",
    transliteration: "Innā li-Allāhi wa-innā ilayhi rāji'ūn",
    words: ["Indeed", "to Allah", "we belong", "and to Him", "we shall return"],
    decoys: ["we go back", "we turn", "we come"],
    translation: "Indeed, to Allah we belong and to Allah we shall return.",
  },
  {
    id: 29, surahName: "Al-Mujadila", ayahRef: "58:11",
    arabic: "يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ",
    transliteration: "Yarfa'i Allāhu alladhīna āmanū wa-alladhīna ūtū al-'ilma darajāt",
    words: ["Allah raises", "those who believe", "and those given", "knowledge", "in degrees"],
    decoys: ["in ranks", "in status", "in honor"],
    translation: "Allah will raise those who believe and those given knowledge, in degrees.",
  },
  {
    id: 30, surahName: "Al-Imran", ayahRef: "3:200",
    arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اصْبِرُوا وَصَابِرُوا وَرَابِطُوا وَاتَّقُوا اللَّهَ",
    transliteration: "Yā ayyuhā alladhīna āmanū iṣbirū wa-ṣābirū wa-rābiṭū wa-ittaqū Allāh",
    words: ["O you who believe", "be patient", "compete in patience", "stand firm", "and fear Allah"],
    decoys: ["remain steadfast", "hold on", "and trust Allah"],
    translation: "O you who believe, be patient and compete in patience and stand firm and fear Allah.",
  },
  {
    id: 31, surahName: "An-Nisa", ayahRef: "4:36",
    arabic: "وَاعْبُدُوا اللَّهَ وَلَا تُشْرِكُوا بِهِ شَيْئًا",
    transliteration: "Wa-'budū Allāha wa-lā tushrikū bihi shay'ā",
    words: ["Worship Allah", "and associate", "nothing", "as a partner", "with Him"],
    decoys: ["besides Him", "alongside Him", "other than Him"],
    translation: "Worship Allah and associate nothing with Him.",
  },
  {
    id: 32, surahName: "Al-Baqarah", ayahRef: "2:177",
    arabic: "وَلَكِنَّ الْبِرَّ مَنْ آمَنَ بِاللَّهِ وَالْيَوْمِ الْآخِرِ",
    transliteration: "Wa-lākinna al-birra man āmana bi-Allāhi wal-yawmi al-ākhir",
    words: ["But righteousness is", "in one who believes", "in Allah", "and the Last Day", "and the angels"],
    decoys: ["and the prophets", "and the books", "and the unseen"],
    translation: "But righteousness is in one who believes in Allah, the Last Day, the angels, the Book, and the prophets.",
  },
  {
    id: 33, surahName: "Al-Isra", ayahRef: "17:44",
    arabic: "وَإِنْ مِنْ شَيْءٍ إِلَّا يُسَبِّحُ بِحَمْدِهِ وَلَكِنْ لَا تَفْقَهُونَ تَسْبِيحَهُمْ",
    transliteration: "Wa-in min shay'in illā yusabbiḥu bi-ḥamdihi wa-lākin lā tafqahūna tasbīḥahum",
    words: ["There is nothing", "except that it glorifies", "His praise", "but you do not", "understand their glorification"],
    decoys: ["comprehend", "hear", "perceive their praise"],
    translation: "There is not a thing except that it glorifies His praise, but you do not understand their glorification.",
  },
  {
    id: 34, surahName: "Al-Baqarah", ayahRef: "2:269",
    arabic: "يُؤْتِي الْحِكْمَةَ مَنْ يَشَاءُ وَمَنْ يُؤْتَ الْحِكْمَةَ فَقَدْ أُوتِيَ خَيْرًا كَثِيرًا",
    transliteration: "Yu'tī al-ḥikmata man yashā'u wa-man yu'ta al-ḥikmata fa-qad ūtiya khayran kathīrā",
    words: ["He grants wisdom", "to whom He wills", "and whoever", "is granted wisdom", "has been given much good"],
    decoys: ["abundant good", "great blessing", "great wealth"],
    translation: "He grants wisdom to whom He wills, and whoever is granted wisdom has certainly been given much good.",
  },
  {
    id: 35, surahName: "An-Nahl", ayahRef: "16:78",
    arabic: "وَاللَّهُ أَخْرَجَكُمْ مِنْ بُطُونِ أُمَّهَاتِكُمْ لَا تَعْلَمُونَ شَيْئًا",
    transliteration: "Wa-Allāhu akhrajkum min buṭūni ummahātikum lā ta'lamūna shay'ā",
    words: ["Allah brought you out", "from the wombs", "of your mothers", "knowing", "nothing"],
    decoys: ["without knowledge", "unable to speak", "blind and deaf"],
    translation: "Allah brought you out from the wombs of your mothers knowing nothing.",
  },
  {
    id: 36, surahName: "Al-Hashr", ayahRef: "59:23",
    arabic: "هُوَ اللَّهُ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْمَلِكُ الْقُدُّوسُ السَّلَامُ",
    transliteration: "Huwa Allāhu alladhī lā ilāha illā huwa al-Maliku al-Quddūsu as-Salām",
    words: ["He is Allah", "there is no deity", "except Him", "the King", "the Holy the Peace"],
    decoys: ["the Creator", "the Almighty", "the Sovereign"],
    translation: "He is Allah, other than whom there is no deity, the King, the Holy, the Peace.",
  },
  {
    id: 37, surahName: "Al-Kahf", ayahRef: "18:10",
    arabic: "رَبَّنَا آتِنَا مِنْ لَدُنْكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا",
    transliteration: "Rabbanā ātinā min ladunka raḥmatan wa-hayyi' lanā min amrinā rashadā",
    words: ["Our Lord", "grant us mercy", "from Yourself", "and prepare for us", "right guidance"],
    decoys: ["ease in our affairs", "our guidance", "right conduct"],
    translation: "Our Lord, grant us from Yourself mercy and prepare for us right guidance.",
  },
  {
    id: 38, surahName: "Al-Araf", ayahRef: "7:180",
    arabic: "وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَى فَادْعُوهُ بِهَا",
    transliteration: "Wa-li-Llāhi al-asmā'u al-ḥusnā fad'ūhu bihā",
    words: ["To Allah belong", "the most beautiful", "names", "so call upon Him", "by them"],
    decoys: ["with them", "through them", "using His names"],
    translation: "To Allah belong the most beautiful names, so invoke Him by them.",
  },
  {
    id: 39, surahName: "Al-Kahf", ayahRef: "18:46",
    arabic: "الْمَالُ وَالْبَنُونَ زِينَةُ الْحَيَاةِ الدُّنْيَا",
    transliteration: "Al-mālu wa-l-banūna zīnatu al-ḥayāti ad-dunyā",
    words: ["Wealth and children", "are the adornment", "of", "worldly", "life"],
    decoys: ["of this life", "temporary life", "lowly life"],
    translation: "Wealth and children are the adornment of worldly life.",
  },
  {
    id: 40, surahName: "Ar-Ra'd", ayahRef: "13:11",
    arabic: "إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّى يُغَيِّرُوا",
    transliteration: "Inna Allāha lā yughayyiru mā bi-qawmin ḥattā yughayyirū",
    words: ["Allah will not change", "the condition", "of a people", "until they change", "themselves"],
    decoys: ["what is in themselves", "their own state", "their affairs"],
    translation: "Allah will not change the condition of a people until they change what is in themselves.",
  },
  {
    id: 41, surahName: "Al-Hijr", ayahRef: "15:49",
    arabic: "نَبِّئْ عِبَادِي أَنِّي أَنَا الْغَفُورُ الرَّحِيمُ",
    transliteration: "Nabbi' 'ibādī annī ana al-Ghafūru ar-Raḥīm",
    words: ["Tell My servants", "that I am", "the Forgiving", "the", "Merciful"],
    decoys: ["the Gracious", "the Kind", "the All-Knowing"],
    translation: "Inform My servants that it is I who am the Forgiving, the Merciful.",
  },
  {
    id: 42, surahName: "Al-Imran", ayahRef: "3:173",
    arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
    transliteration: "Ḥasbunā Allāhu wa-ni'ma al-wakīl",
    words: ["Sufficient for us", "is Allah", "and He is", "the best", "Disposer of Affairs"],
    decoys: ["the best Helper", "the best Guardian", "the best Protector"],
    translation: "Sufficient for us is Allah, and He is the best Disposer of Affairs.",
  },
  {
    id: 43, surahName: "An-Naml", ayahRef: "27:62",
    arabic: "أَمَّنْ يُجِيبُ الْمُضْطَرَّ إِذَا دَعَاهُ وَيَكْشِفُ السُّوءَ",
    transliteration: "Amman yujību al-muḍṭarra idhā da'āhu wa-yakshifu as-sū'",
    words: ["Who responds", "to the desperate", "when he calls", "and removes", "the harm"],
    decoys: ["the distress", "the difficulty", "the hardship"],
    translation: "Who responds to the desperate when he calls upon Him and removes the harm?",
  },
  {
    id: 44, surahName: "Al-Inshirah", ayahRef: "94:7-8",
    arabic: "فَإِذَا فَرَغْتَ فَانْصَبْ وَإِلَى رَبِّكَ فَارْغَبْ",
    transliteration: "Fa-idhā faraghta fanṣab wa-ilā rabbika farghab",
    words: ["When you are free", "exert yourself", "in worship", "and to your Lord", "turn in hope"],
    decoys: ["turn with longing", "direct yourself", "turn your desires"],
    translation: "So when you have finished, stand up for worship, and to your Lord direct your longing.",
  },
  {
    id: 45, surahName: "Al-Kahf", ayahRef: "18:39",
    arabic: "مَا شَاءَ اللَّهُ لَا قُوَّةَ إِلَّا بِاللَّهِ",
    transliteration: "Mā shā'a Allāhu lā quwwata illā bi-Allāh",
    words: ["Whatever Allah wills", "will come to pass", "there is no", "power", "except through Allah"],
    decoys: ["but through Allah", "except with Allah", "only by Allah"],
    translation: "What Allah wills — there is no power except through Allah.",
  },
  {
    id: 46, surahName: "Maryam", ayahRef: "19:96",
    arabic: "إِنَّ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ سَيَجْعَلُ لَهُمُ الرَّحْمَنُ وُدًّا",
    transliteration: "Inna alladhīna āmanū wa-'amilū aṣ-ṣāliḥāti sayaj'alu lahumu ar-Raḥmānu wuddā",
    words: ["Those who believe", "and do righteous deeds", "the Most Merciful", "will appoint for them", "love"],
    decoys: ["affection", "mercy", "goodness"],
    translation: "Those who believe and do righteous deeds — the Most Merciful will appoint for them love.",
  },
  {
    id: 47, surahName: "Al-Mulk", ayahRef: "67:1",
    arabic: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    transliteration: "Tabāraka alladhī bi-yadihi al-mulku wa-huwa 'alā kulli shay'in qadīr",
    words: ["Blessed is He", "in whose hand", "is dominion", "and He is over", "all things capable"],
    decoys: ["all matters", "all creation", "everything powerful"],
    translation: "Blessed is He in whose hand is dominion, and He is over all things competent.",
  },
  {
    id: 48, surahName: "An-Nahl", ayahRef: "16:97",
    arabic: "مَنْ عَمِلَ صَالِحًا مِنْ ذَكَرٍ أَوْ أُنْثَى وَهُوَ مُؤْمِنٌ فَلَنُحْيِيَنَّهُ حَيَاةً طَيِّبَةً",
    transliteration: "Man 'amila ṣāliḥan min dhakarin aw unthā wa-huwa mu'minun fa-lanuḥyiyannahu ḥayātan ṭayyibah",
    words: ["Whoever does good", "whether male or female", "while being a believer", "We will grant", "a good life"],
    decoys: ["a happy life", "a pure life", "abundant blessings"],
    translation: "Whoever does righteousness, whether male or female, while being a believer — We will grant them a good life.",
  },
  {
    id: 49, surahName: "Al-Baqarah", ayahRef: "2:216",
    arabic: "وَعَسَى أَنْ تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَكُمْ",
    transliteration: "Wa-'asā an takrahū shay'an wa-huwa khayrun lakum",
    words: ["Perhaps you", "dislike something", "but it is", "good", "for you"],
    decoys: ["better for you", "best for you", "a blessing for you"],
    translation: "Perhaps you dislike a thing, and it is good for you.",
  },
  {
    id: 50, surahName: "Al-Asr", ayahRef: "103:1-3",
    arabic: "وَالْعَصْرِ إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ",
    transliteration: "Wa-l-'aṣri inna al-insāna la-fī khusr",
    words: ["By time", "indeed", "mankind", "is in", "loss"],
    decoys: ["error", "ruin", "trouble"],
    translation: "By time, indeed mankind is in loss.",
  },
  {
    id: 51, surahName: "Az-Zalzala", ayahRef: "99:7",
    arabic: "فَمَنْ يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ",
    transliteration: "Fa-man ya'mal mithqāla dharratin khayran yarah",
    words: ["Whoever does", "an atom's weight", "of good", "will", "see it"],
    decoys: ["find it", "receive it", "be shown it"],
    translation: "Whoever does an atom's weight of good will see it.",
  },
  {
    id: 52, surahName: "Ad-Duha", ayahRef: "93:4-5",
    arabic: "وَلَلْآخِرَةُ خَيْرٌ لَكَ مِنَ الْأُولَى وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَى",
    transliteration: "Wa-lal-ākhiratu khayrun laka min al-ūlā wa-lasawfa yu'ṭīka rabbuka fa-tarḍā",
    words: ["The Hereafter is", "better for you", "than the world", "and your Lord", "will give you till you are pleased"],
    decoys: ["so you are satisfied", "so you rejoice", "more than you wish"],
    translation: "The Hereafter is better for you than the first life. And your Lord is going to give you, and you will be satisfied.",
  },
  {
    id: 53, surahName: "Luqman", ayahRef: "31:17",
    arabic: "يَا بُنَيَّ أَقِمِ الصَّلَاةَ وَأْمُرْ بِالْمَعْرُوفِ وَانْهَ عَنِ الْمُنْكَرِ",
    transliteration: "Yā bunayya aqimi aṣ-ṣalāta wa-'mur bil-ma'rūfi wan-ha 'ani al-munkar",
    words: ["O my son", "establish prayer", "and command", "what is right", "and forbid the wrong"],
    decoys: ["what is known", "what is good", "what is evil"],
    translation: "O my son, establish prayer, enjoin what is right, and forbid what is wrong.",
  },
  {
    id: 54, surahName: "Al-Anfal", ayahRef: "8:2",
    arabic: "إِنَّمَا الْمُؤْمِنُونَ الَّذِينَ إِذَا ذُكِرَ اللَّهُ وَجِلَتْ قُلُوبُهُمْ",
    transliteration: "Innamā al-mu'minūna alladhīna idhā dhukira Allāhu wajilat qulūbuhum",
    words: ["True believers are", "only those", "whose hearts", "tremble", "when Allah is mentioned"],
    decoys: ["are moved", "feel awe", "remember Allah"],
    translation: "The believers are only those who, when Allah is mentioned, their hearts tremble.",
  },
  {
    id: 55, surahName: "Al-Qasas", ayahRef: "28:77",
    arabic: "وَلَا تَنْسَ نَصِيبَكَ مِنَ الدُّنْيَا",
    transliteration: "Wa-lā tansa naṣībaka min ad-dunyā",
    words: ["And do not", "forget", "your share", "of", "this world"],
    decoys: ["the worldly life", "temporal life", "this life"],
    translation: "And do not forget your share of the world.",
  },
  {
    id: 56, surahName: "At-Tawbah", ayahRef: "9:51",
    arabic: "قُلْ لَنْ يُصِيبَنَا إِلَّا مَا كَتَبَ اللَّهُ لَنَا",
    transliteration: "Qul lan yuṣībanā illā mā kataba Allāhu lanā",
    words: ["Say nothing", "will befall us", "except what", "Allah has decreed", "for us"],
    decoys: ["has written", "has willed", "has ordained for us"],
    translation: "Say, 'Nothing will befall us except what Allah has decreed for us.'",
  },
  {
    id: 57, surahName: "Al-Jumu'ah", ayahRef: "62:10",
    arabic: "فَانْتَشِرُوا فِي الْأَرْضِ وَابْتَغُوا مِنْ فَضْلِ اللَّهِ",
    transliteration: "Fa-ntashirū fī al-arḍi wa-btaghū min faḍli Allāh",
    words: ["Disperse through", "the land", "and seek", "from the bounty", "of Allah"],
    decoys: ["of His grace", "of His gifts", "of His provision"],
    translation: "Disperse through the land and seek from the bounty of Allah.",
  },
  {
    id: 58, surahName: "Al-Munafiqun", ayahRef: "63:9",
    arabic: "لَا تُلْهِكُمْ أَمْوَالُكُمْ وَلَا أَوْلَادُكُمْ عَنْ ذِكْرِ اللَّهِ",
    transliteration: "Lā tulhikum amwālukum wa-lā awlādukum 'an dhikri Allāh",
    words: ["Let not", "your wealth", "or your children", "distract you", "from remembrance of Allah"],
    decoys: ["from Allah's remembrance", "from prayer", "from worship"],
    translation: "Let not your wealth nor your children distract you from the remembrance of Allah.",
  },
  {
    id: 59, surahName: "Al-Hujurat", ayahRef: "49:12",
    arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اجْتَنِبُوا كَثِيرًا مِنَ الظَّنِّ",
    transliteration: "Yā ayyuhā alladhīna āmanū ijtanibū kathīran min aẓ-ẓann",
    words: ["O you who believe", "avoid", "much of", "suspicion", "for some suspicion is sin"],
    decoys: ["indeed it is wrong", "it leads to sin", "it is harmful"],
    translation: "O you who believe, avoid much negative assumption. Indeed some assumption is sin.",
  },
  {
    id: 60, surahName: "Al-Hujurat", ayahRef: "49:13",
    arabic: "إِنَّ أَكْرَمَكُمْ عِنْدَ اللَّهِ أَتْقَاكُمْ",
    transliteration: "Inna akramakum 'inda Allāhi atqākum",
    words: ["Indeed the most noble", "of you", "in the sight", "of Allah", "is the most righteous"],
    decoys: ["the most pious", "the most God-fearing", "the most devout"],
    translation: "Indeed, the most noble of you in the sight of Allah is the most righteous.",
  },
  {
    id: 61, surahName: "Al-Hadid", ayahRef: "57:20",
    arabic: "اعْلَمُوا أَنَّمَا الْحَيَاةُ الدُّنْيَا لَعِبٌ وَلَهْوٌ وَزِينَةٌ",
    transliteration: "I'lamū annamā al-ḥayātu ad-dunyā la'ibun wa-lahwun wa-zīnah",
    words: ["Know that", "the worldly life", "is but play", "and amusement", "and adornment"],
    decoys: ["and diversion", "and distraction", "and desire"],
    translation: "Know that the worldly life is but play and amusement and adornment.",
  },
  {
    id: 62, surahName: "Az-Zumar", ayahRef: "39:9",
    arabic: "هَلْ يَسْتَوِي الَّذِينَ يَعْلَمُونَ وَالَّذِينَ لَا يَعْلَمُونَ",
    transliteration: "Hal yastawī alladhīna ya'lamūna wa-alladhīna lā ya'lamūn",
    words: ["Are they equal", "those who know", "and those", "who do not", "know"],
    decoys: ["are the same", "those who see", "those who learn"],
    translation: "Are those who know equal to those who do not know?",
  },
  {
    id: 63, surahName: "Al-Imran", ayahRef: "3:110",
    arabic: "كُنْتُمْ خَيْرَ أُمَّةٍ أُخْرِجَتْ لِلنَّاسِ تَأْمُرُونَ بِالْمَعْرُوفِ",
    transliteration: "Kuntum khayra ummatin ukhrijat lin-nāsi ta'murūna bil-ma'rūf",
    words: ["You are", "the best nation", "brought forth", "for mankind", "enjoining right"],
    decoys: ["commanding good", "doing justice", "guiding people"],
    translation: "You are the best nation produced for mankind, enjoining what is right.",
  },
  {
    id: 64, surahName: "Al-Baqarah", ayahRef: "2:183",
    arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ",
    transliteration: "Yā ayyuhā alladhīna āmanū kutiba 'alaykumu aṣ-ṣiyām",
    words: ["O you who believe", "fasting", "has been prescribed", "upon you", "as it was before"],
    decoys: ["for those before", "as commanded", "for the believers"],
    translation: "O you who believe, fasting has been prescribed upon you as it was for those before you.",
  },
  {
    id: 65, surahName: "Al-Hajj", ayahRef: "22:78",
    arabic: "وَجَاهِدُوا فِي اللَّهِ حَقَّ جِهَادِهِ",
    transliteration: "Wa-jāhidū fī Allāhi ḥaqqa jihādihi",
    words: ["Strive", "for the cause", "of Allah", "as He deserves", "to be striven for"],
    decoys: ["as you should", "sincerely", "with full effort"],
    translation: "Strive for Allah with the striving due to Him.",
  },
  {
    id: 66, surahName: "Al-Imran", ayahRef: "3:134",
    arabic: "الَّذِينَ يُنْفِقُونَ فِي السَّرَّاءِ وَالضَّرَّاءِ وَالْكَاظِمِينَ الْغَيْظَ",
    transliteration: "Alladhīna yunfiqūna fī as-sarrā'i wa-aḍ-ḍarrā'i wal-kāẓimīna al-ghayẓ",
    words: ["Those who spend", "in ease", "and in hardship", "and who restrain", "their anger"],
    decoys: ["their tongues", "their desires", "their feelings"],
    translation: "Those who spend in ease and in hardship and who restrain their anger.",
  },
  {
    id: 67, surahName: "Al-Fath", ayahRef: "48:28",
    arabic: "هُوَ الَّذِي أَرْسَلَ رَسُولَهُ بِالْهُدَى وَدِينِ الْحَقِّ",
    transliteration: "Huwa alladhī arsala rasūlahu bil-hudā wa-dīni al-ḥaqq",
    words: ["He is the one", "who sent His Messenger", "with guidance", "and the religion", "of truth"],
    decoys: ["of Islam", "of light", "of justice"],
    translation: "He is the one who sent His Messenger with guidance and the religion of truth.",
  },
  {
    id: 68, surahName: "Al-Qalam", ayahRef: "68:4",
    arabic: "وَإِنَّكَ لَعَلَى خُلُقٍ عَظِيمٍ",
    transliteration: "Wa-innaka la-'alā khuluqin 'aẓīm",
    words: ["And indeed", "you are", "of a great", "moral", "character"],
    decoys: ["noble character", "excellent manner", "lofty status"],
    translation: "And indeed, you are of a great moral character.",
  },
  {
    id: 69, surahName: "Al-Imran", ayahRef: "3:185",
    arabic: "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ",
    transliteration: "Kullu nafsin dhā'iqatu al-mawt",
    words: ["Every", "soul", "shall taste", "of", "death"],
    decoys: ["will experience", "must face", "will meet"],
    translation: "Every soul shall taste death.",
  },
  {
    id: 70, surahName: "Al-Baqarah", ayahRef: "2:257",
    arabic: "اللَّهُ وَلِيُّ الَّذِينَ آمَنُوا يُخْرِجُهُمْ مِنَ الظُّلُمَاتِ إِلَى النُّورِ",
    transliteration: "Allāhu waliyyu alladhīna āmanū yukhrijuhum min aẓ-ẓulumāti ilan-nūr",
    words: ["Allah is the protector", "of those who believe", "He brings them out", "from darkness", "into light"],
    decoys: ["from ignorance", "from falsehood", "into guidance"],
    translation: "Allah is the protector of those who believe. He brings them out from darkness into light.",
  },
  {
    id: 71, surahName: "An-Nahl", ayahRef: "16:128",
    arabic: "إِنَّ اللَّهَ مَعَ الَّذِينَ اتَّقَوْا وَالَّذِينَ هُمْ مُحْسِنُونَ",
    transliteration: "Inna Allāha ma'a alladhīna ittaqaw wa-alladhīna hum muḥsinūn",
    words: ["Indeed Allah is", "with those", "who fear Him", "and those who are", "doers of good"],
    decoys: ["the pious", "the righteous", "the obedient"],
    translation: "Indeed, Allah is with those who fear Him and those who are doers of good.",
  },
  {
    id: 72, surahName: "At-Tur", ayahRef: "52:21",
    arabic: "كُلُّ امْرِئٍ بِمَا كَسَبَ رَهِينٌ",
    transliteration: "Kullu imri'in bi-mā kasaba rahīn",
    words: ["Every person", "will be held", "accountable", "for what", "he has earned"],
    decoys: ["he has done", "he has gained", "he worked for"],
    translation: "Every person will be held accountable for what he has earned.",
  },
  {
    id: 73, surahName: "Az-Zalzala", ayahRef: "99:8",
    arabic: "وَمَنْ يَعْمَلْ مِثْقَالَ ذَرَّةٍ شَرًّا يَرَهُ",
    transliteration: "Wa-man ya'mal mithqāla dharratin sharran yarah",
    words: ["And whoever does", "an atom's weight", "of evil", "will", "see it"],
    decoys: ["find it", "receive it", "be shown it"],
    translation: "And whoever does an atom's weight of evil will see it.",
  },
  {
    id: 74, surahName: "At-Tin", ayahRef: "95:4",
    arabic: "لَقَدْ خَلَقْنَا الْإِنْسَانَ فِي أَحْسَنِ تَقْوِيمٍ",
    transliteration: "Laqad khalaqnā al-insāna fī aḥsani taqwīm",
    words: ["We have created", "the human being", "in", "the best", "of forms"],
    decoys: ["the finest form", "best of creation", "perfect stature"],
    translation: "We have certainly created man in the best of forms.",
  },
  {
    id: 75, surahName: "Al-Alaq", ayahRef: "96:1",
    arabic: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ",
    transliteration: "Iqra' bi-ismi rabbika alladhī khalaq",
    words: ["Recite", "in the name", "of your Lord", "who", "created"],
    decoys: ["who formed", "who made", "who brought forth"],
    translation: "Recite in the name of your Lord who created.",
  },
  {
    id: 76, surahName: "Al-Qadr", ayahRef: "97:1",
    arabic: "إِنَّا أَنْزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ",
    transliteration: "Innā anzalnāhu fī laylati al-qadr",
    words: ["Indeed We", "sent it down", "during", "the Night", "of Decree"],
    decoys: ["of Qadr", "of Power", "of Majesty"],
    translation: "Indeed, We sent it down during the Night of Decree.",
  },
  {
    id: 77, surahName: "Al-Bayyina", ayahRef: "98:8",
    arabic: "رَضِيَ اللَّهُ عَنْهُمْ وَرَضُوا عَنْهُ",
    transliteration: "Raḍiya Allāhu 'anhum wa-raḍū 'anh",
    words: ["Allah is pleased", "with them", "and they", "are pleased", "with Him"],
    decoys: ["with His rewards", "with His decree", "satisfied with Him"],
    translation: "Allah is pleased with them, and they are pleased with Him.",
  },
  {
    id: 78, surahName: "Al-Kawthar", ayahRef: "108:1",
    arabic: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ",
    transliteration: "Innā a'ṭaynāka al-kawthar",
    words: ["Indeed", "We have given", "you", "the fountain", "of Al-Kawthar"],
    decoys: ["of abundance", "of paradise", "of blessing"],
    translation: "Indeed, We have granted you Al-Kawthar.",
  },
  {
    id: 79, surahName: "Al-Kafiroun", ayahRef: "109:6",
    arabic: "لَكُمْ دِينُكُمْ وَلِيَ دِينِ",
    transliteration: "Lakum dīnukum wa-liya dīn",
    words: ["For you", "is your religion", "and for me", "is", "my religion"],
    decoys: ["my belief", "my faith", "my way"],
    translation: "For you is your religion, and for me is my religion.",
  },
  {
    id: 80, surahName: "An-Nasr", ayahRef: "110:1",
    arabic: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ",
    transliteration: "Idhā jā'a naṣru Allāhi wal-fatḥ",
    words: ["When there comes", "the victory", "of Allah", "and", "the conquest"],
    decoys: ["the opening", "the help", "the aid"],
    translation: "When the victory of Allah has come and the conquest.",
  },
  {
    id: 81, surahName: "Al-Falaq", ayahRef: "113:1",
    arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
    transliteration: "Qul a'ūdhu bi-rabbi al-falaq",
    words: ["Say", "I seek refuge", "in the Lord", "of the", "daybreak"],
    decoys: ["of the dawn", "of the morning", "of all creation"],
    translation: "Say: I seek refuge in the Lord of daybreak.",
  },
  {
    id: 82, surahName: "An-Nas", ayahRef: "114:1-3",
    arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ مَلِكِ النَّاسِ إِلَهِ النَّاسِ",
    transliteration: "Qul a'ūdhu bi-rabbi an-nāsi maliki an-nāsi ilāhi an-nās",
    words: ["Say I seek refuge", "in the Lord of mankind", "the King of mankind", "the God", "of mankind"],
    decoys: ["of all people", "of the worlds", "of creation"],
    translation: "Say: I seek refuge in the Lord of mankind, the King of mankind, the God of mankind.",
  },
  {
    id: 83, surahName: "Al-Ikhlas", ayahRef: "112:3-4",
    arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
    transliteration: "Lam yalid wa-lam yūlad wa-lam yakun lahu kufuwan aḥad",
    words: ["He neither", "begot", "nor was He begotten", "and none is", "comparable to Him"],
    decoys: ["equal to Him", "like unto Him", "His equal"],
    translation: "He neither begets nor is born, and there is none comparable to Him.",
  },
  {
    id: 84, surahName: "At-Tawbah", ayahRef: "9:119",
    arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَكُونُوا مَعَ الصَّادِقِينَ",
    transliteration: "Yā ayyuhā alladhīna āmanū ittaqū Allāha wa-kūnū ma'a aṣ-ṣādiqīn",
    words: ["O you who believe", "fear Allah", "and be", "with", "the truthful"],
    decoys: ["the righteous", "the honest", "the sincere"],
    translation: "O you who believe, fear Allah and be with the truthful.",
  },
  {
    id: 85, surahName: "An-Nisa", ayahRef: "4:29",
    arabic: "وَلَا تَقْتُلُوا أَنْفُسَكُمْ إِنَّ اللَّهَ كَانَ بِكُمْ رَحِيمًا",
    transliteration: "Wa-lā taqtulū anfusakum inna Allāha kāna bi-kum raḥīmā",
    words: ["And do not", "kill yourselves", "indeed Allah", "is ever", "Merciful to you"],
    decoys: ["kind to you", "compassionate to you", "caring of you"],
    translation: "And do not kill yourselves. Indeed, Allah is ever Merciful to you.",
  },
  {
    id: 86, surahName: "An-Nur", ayahRef: "24:35",
    arabic: "اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ",
    transliteration: "Allāhu nūru as-samāwāti wa-l-arḍ",
    words: ["Allah", "is the Light", "of the heavens", "and", "the earth"],
    decoys: ["and the worlds", "and all creation", "the universe"],
    translation: "Allah is the Light of the heavens and the earth.",
  },
  {
    id: 87, surahName: "Al-Isra", ayahRef: "17:9",
    arabic: "إِنَّ هَذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ",
    transliteration: "Inna hādhā al-Qur'āna yahdī li-llatī hiya aqwam",
    words: ["Indeed", "this Quran", "guides", "to that which", "is most upright"],
    decoys: ["most correct", "most straight", "most right"],
    translation: "Indeed, this Quran guides to that which is most suitable.",
  },
  {
    id: 88, surahName: "Yunus", ayahRef: "10:107",
    arabic: "وَإِنْ يَمْسَسْكَ اللَّهُ بِضُرٍّ فَلَا كَاشِفَ لَهُ إِلَّا هُوَ",
    transliteration: "Wa-in yamsaska Allāhu bi-ḍurrin fa-lā kāshifa lahu illā huw",
    words: ["If Allah afflicts you", "with harm", "none can remove it", "except", "Him"],
    decoys: ["but He", "other than Him", "only Allah"],
    translation: "If Allah should touch you with hardship, there is no remover of it except Him.",
  },
  {
    id: 89, surahName: "Ar-Rahman", ayahRef: "55:13",
    arabic: "فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ",
    transliteration: "Fa-bi-ayyi ālā'i rabbikumā tukadhdhibān",
    words: ["So which", "of the favors", "of your Lord", "would you both", "deny"],
    decoys: ["reject", "disbelieve in", "belittle"],
    translation: "So which of the favors of your Lord would you deny?",
  },
  {
    id: 90, surahName: "Ar-Rahman", ayahRef: "55:26-27",
    arabic: "كُلُّ مَنْ عَلَيْهَا فَانٍ وَيَبْقَى وَجْهُ رَبِّكَ ذُو الْجَلَالِ وَالْإِكْرَامِ",
    transliteration: "Kullu man 'alayhā fān wa-yabqā wajhu rabbika dhū al-jalāli wal-ikrām",
    words: ["All that is on it", "will perish", "and there will remain", "the Face of your Lord", "Owner of Majesty"],
    decoys: ["the Everlasting", "of great Majesty", "the Most Glorified"],
    translation: "All that exists will perish, and there will remain the Face of your Lord, Owner of Majesty and Honor.",
  },
  {
    id: 91, surahName: "Al-Baqarah", ayahRef: "2:163",
    arabic: "وَإِلَهُكُمْ إِلَهٌ وَاحِدٌ لَا إِلَهَ إِلَّا هُوَ الرَّحْمَنُ الرَّحِيمُ",
    transliteration: "Wa-ilāhukum ilāhun wāḥidun lā ilāha illā huwa ar-Raḥmānu ar-Raḥīm",
    words: ["Your God", "is one God", "there is no deity", "except Him", "the Most Gracious Most Merciful"],
    decoys: ["the Merciful", "the Forgiving", "the All-Knowing"],
    translation: "Your god is one God. There is no deity except Him, the Most Gracious, the Most Merciful.",
  },
  {
    id: 92, surahName: "Ar-Ra'd", ayahRef: "13:29",
    arabic: "الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ طُوبَى لَهُمْ وَحُسْنُ مَآبٍ",
    transliteration: "Alladhīna āmanū wa-'amilū aṣ-ṣāliḥāti ṭūbā lahum wa-ḥusnu ma'āb",
    words: ["Those who believe", "and do righteous deeds", "for them", "is happiness", "and a good return"],
    decoys: ["a good ending", "a beautiful abode", "a pleasant return"],
    translation: "Those who believe and do righteous deeds — for them is happiness and a good final abode.",
  },
  {
    id: 93, surahName: "Al-Imran", ayahRef: "3:102",
    arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ حَقَّ تُقَاتِهِ",
    transliteration: "Yā ayyuhā alladhīna āmanū ittaqū Allāha ḥaqqa tuqātihi",
    words: ["O you who believe", "fear Allah", "as He", "deserves", "to be feared"],
    decoys: ["with true piety", "as He deserves", "in the right way"],
    translation: "O you who believe, fear Allah as He deserves to be feared.",
  },
  {
    id: 94, surahName: "An-Nahl", ayahRef: "16:125",
    arabic: "ادْعُ إِلَى سَبِيلِ رَبِّكَ بِالْحِكْمَةِ وَالْمَوْعِظَةِ الْحَسَنَةِ",
    transliteration: "Ud'u ilā sabīli rabbika bil-ḥikmati wal-maw'iẓati al-ḥasanah",
    words: ["Invite to the way", "of your Lord", "with wisdom", "and good", "instruction"],
    decoys: ["kind words", "gentle guidance", "beautiful preaching"],
    translation: "Invite to the way of your Lord with wisdom and good instruction.",
  },
  {
    id: 95, surahName: "Al-Baqarah", ayahRef: "2:222",
    arabic: "إِنَّ اللَّهَ يُحِبُّ التَّوَّابِينَ وَيُحِبُّ الْمُتَطَهِّرِينَ",
    transliteration: "Inna Allāha yuḥibbu at-tawwābīna wa-yuḥibbu al-mutaṭahhirīn",
    words: ["Indeed Allah loves", "those who", "constantly repent", "and loves", "those who purify themselves"],
    decoys: ["those who are clean", "those who seek forgiveness", "those who are pure"],
    translation: "Indeed, Allah loves those who are constantly repentant and loves those who purify themselves.",
  },
  {
    id: 96, surahName: "Al-Baqarah", ayahRef: "2:148",
    arabic: "وَلِكُلٍّ وِجْهَةٌ هُوَ مُوَلِّيهَا فَاسْتَبِقُوا الْخَيْرَاتِ",
    transliteration: "Wa-likullin wijhatun huwa muwallīhā fa-stabiqū al-khayrāt",
    words: ["For each", "is a direction", "he faces", "so race toward", "all that is good"],
    decoys: ["compete in good", "hasten to goodness", "all good deeds"],
    translation: "For each is a direction he faces. So race toward all that is good.",
  },
  {
    id: 97, surahName: "Al-Muminun", ayahRef: "23:1-2",
    arabic: "قَدْ أَفْلَحَ الْمُؤْمِنُونَ الَّذِينَ هُمْ فِي صَلَاتِهِمْ خَاشِعُونَ",
    transliteration: "Qad aflaḥa al-mu'minūna alladhīna hum fī ṣalātihim khāshi'ūn",
    words: ["Successful indeed", "are the believers", "who are", "in their prayer", "humbly submissive"],
    decoys: ["deeply devoted", "fully focused", "sincerely humble"],
    translation: "Successful indeed are the believers who are humbly submissive in their prayer.",
  },
  {
    id: 98, surahName: "Al-Furqan", ayahRef: "25:70",
    arabic: "إِلَّا مَنْ تَابَ وَآمَنَ وَعَمِلَ عَمَلًا صَالِحًا فَأُولَئِكَ يُبَدِّلُ اللَّهُ سَيِّئَاتِهِمْ حَسَنَاتٍ",
    transliteration: "Illā man tāba wa-āmana wa-'amila 'amalan ṣāliḥan fa-ulā'ika yubaddilu Allāhu sayyi'ātihim ḥasanāt",
    words: ["Except those who repent", "believe", "and do good", "for Allah will replace", "their evil with good"],
    decoys: ["their sins forgiven", "their wrongs erased", "their faults covered"],
    translation: "Except those who repent, believe, and do good — for Allah will replace their evil deeds with good.",
  },
  {
    id: 99, surahName: "Al-Imran", ayahRef: "3:17",
    arabic: "وَالصَّابِرِينَ وَالصَّادِقِينَ وَالْقَانِتِينَ وَالْمُنْفِقِينَ وَالْمُسْتَغْفِرِينَ",
    transliteration: "Wa-aṣ-ṣābirīna wa-aṣ-ṣādiqīna wal-qānitīna wal-munfiqīna wal-mustaghfirīn",
    words: ["The patient", "the truthful", "the devoutly obedient", "those who spend", "and those who seek forgiveness"],
    decoys: ["the charitable", "the thankful", "those who remember Allah"],
    translation: "The patient, the truthful, the devoutly obedient, those who spend, and those who seek forgiveness.",
  },
  {
    id: 100, surahName: "Ghafir", ayahRef: "40:7",
    arabic: "رَبَّنَا وَسِعْتَ كُلَّ شَيْءٍ رَحْمَةً وَعِلْمًا",
    transliteration: "Rabbanā wasi'ta kulla shay'in raḥmatan wa-'ilmā",
    words: ["Our Lord", "You encompass", "all things", "in mercy", "and knowledge"],
    decoys: ["in grace", "in wisdom", "and wisdom"],
    translation: "Our Lord, You have encompassed all things in mercy and knowledge.",
  },
  {
    id: 101, surahName: "Al-Baqarah", ayahRef: "2:200",
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً",
    transliteration: "Rabbanā ātinā fī ad-dunyā ḥasanatan wa-fī al-ākhirati ḥasanah",
    words: ["Our Lord", "give us good", "in this world", "and good", "in the Hereafter"],
    decoys: ["in the next life", "in paradise", "and protect us"],
    translation: "Our Lord, give us good in this world and good in the Hereafter.",
  },
  {
    id: 102, surahName: "Al-Kahf", ayahRef: "18:28",
    arabic: "وَاصْبِرْ نَفْسَكَ مَعَ الَّذِينَ يَدْعُونَ رَبَّهُمْ بِالْغَدَاةِ وَالْعَشِيِّ",
    transliteration: "Wa-iṣbir nafsaka ma'a alladhīna yad'ūna rabbahum bil-ghadāti wal-'ashiyy",
    words: ["Restrain yourself", "with those who", "call upon their Lord", "in the morning", "and the evening"],
    decoys: ["at dawn", "throughout the day", "at night"],
    translation: "Restrain yourself with those who call upon their Lord in the morning and evening.",
  },
  {
    id: 103, surahName: "An-Nisa", ayahRef: "4:163",
    arabic: "إِنَّا أَوْحَيْنَا إِلَيْكَ كَمَا أَوْحَيْنَا إِلَى نُوحٍ وَالنَّبِيِّينَ مِنْ بَعْدِهِ",
    transliteration: "Innā awḥaynā ilayka kamā awḥaynā ilā Nūḥin wa-an-nabiyyīna min ba'dih",
    words: ["We have revealed", "to you", "as We revealed", "to Noah", "and the prophets after him"],
    decoys: ["the messengers", "the chosen ones", "those who came before"],
    translation: "We have revealed to you as We revealed to Noah and the prophets after him.",
  },
  {
    id: 104, surahName: "Al-Baqarah", ayahRef: "2:233",
    arabic: "وَاتَّقُوا اللَّهَ وَاعْلَمُوا أَنَّ اللَّهَ بِمَا تَعْمَلُونَ بَصِيرٌ",
    transliteration: "Wa-ittaqū Allāha wa-'lamū anna Allāha bi-mā ta'malūna baṣīr",
    words: ["Fear Allah", "and know", "that Allah", "sees", "what you do"],
    decoys: ["is aware of", "is watching", "knows all about"],
    translation: "Fear Allah and know that Allah sees what you do.",
  },
  {
    id: 105, surahName: "Al-Imran", ayahRef: "3:191",
    arabic: "الَّذِينَ يَذْكُرُونَ اللَّهَ قِيَامًا وَقُعُودًا وَعَلَى جُنُوبِهِمْ",
    transliteration: "Alladhīna yadhkurūna Allāha qiyāman wa-qu'ūdan wa-'alā junūbihim",
    words: ["Those who remember Allah", "standing", "and sitting", "and on", "their sides"],
    decoys: ["lying down", "in all states", "at all times"],
    translation: "Those who remember Allah while standing, sitting, and on their sides.",
  },
  {
    id: 106, surahName: "Al-Ankabut", ayahRef: "29:45",
    arabic: "إِنَّ الصَّلَاةَ تَنْهَى عَنِ الْفَحْشَاءِ وَالْمُنْكَرِ",
    transliteration: "Inna aṣ-ṣalāta tanhā 'ani al-faḥshā'i wal-munkar",
    words: ["Indeed prayer", "prohibits", "immorality", "and", "wrongdoing"],
    decoys: ["evil deeds", "bad actions", "sin"],
    translation: "Indeed, prayer prohibits immorality and wrongdoing.",
  },
  {
    id: 107, surahName: "Al-Baqarah", ayahRef: "2:110",
    arabic: "وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَمَا تُقَدِّمُوا لِأَنْفُسِكُمْ مِنْ خَيْرٍ تَجِدُوهُ عِنْدَ اللَّهِ",
    transliteration: "Wa-aqīmū aṣ-ṣalāta wa-ātū az-zakāta wa-mā tuqaddimū li-anfusikum min khayrin tajidūhu 'inda Allāh",
    words: ["Establish prayer", "and give charity", "and whatever good", "you put forward", "you will find with Allah"],
    decoys: ["you will receive", "Allah will reward", "He will return it"],
    translation: "Establish prayer and give charity. Whatever good you put forward, you will find it with Allah.",
  },
  {
    id: 108, surahName: "Maryam", ayahRef: "19:59",
    arabic: "فَخَلَفَ مِنْ بَعْدِهِمْ خَلْفٌ أَضَاعُوا الصَّلَاةَ وَاتَّبَعُوا الشَّهَوَاتِ",
    transliteration: "Fa-khalafa min ba'dihim khalfun aḍā'ū aṣ-ṣalāta wa-ttaba'ū ash-shahawāt",
    words: ["After them came", "successors who", "neglected prayer", "and followed", "their desires"],
    decoys: ["their lusts", "their passions", "worldly pleasures"],
    translation: "After them came successors who neglected prayer and followed their desires.",
  },
  {
    id: 109, surahName: "Al-Anam", ayahRef: "6:103",
    arabic: "لَا تُدْرِكُهُ الْأَبْصَارُ وَهُوَ يُدْرِكُ الْأَبْصَارَ وَهُوَ اللَّطِيفُ الْخَبِيرُ",
    transliteration: "Lā tudrikuhu al-abṣāru wa-huwa yudriqu al-abṣāra wa-huwa al-Laṭīfu al-Khabīr",
    words: ["Vision cannot", "encompass Him", "but He encompasses", "all vision", "He is the Subtle All-Aware"],
    decoys: ["the All-Seeing", "the All-Knowing", "the Most-Subtle"],
    translation: "Vision cannot encompass Him, but He encompasses all vision. He is the Subtle, the Acquainted.",
  },
  {
    id: 110, surahName: "Al-Baqarah", ayahRef: "2:30",
    arabic: "وَإِذْ قَالَ رَبُّكَ لِلْمَلَائِكَةِ إِنِّي جَاعِلٌ فِي الْأَرْضِ خَلِيفَةً",
    transliteration: "Wa-idh qāla rabbuka lil-malā'ikati innī jā'ilun fī al-arḍi khalīfah",
    words: ["And when your Lord said", "to the angels", "I am placing", "on earth", "a vicegerent"],
    decoys: ["a successor", "a guardian", "a keeper"],
    translation: "And when your Lord said to the angels: I am placing on earth a vicegerent.",
  },
  {
    id: 111, surahName: "Al-Baqarah", ayahRef: "2:31",
    arabic: "وَعَلَّمَ آدَمَ الْأَسْمَاءَ كُلَّهَا",
    transliteration: "Wa-'allama ādama al-asmā'a kullahā",
    words: ["And He taught", "Adam", "the names", "of all", "things"],
    decoys: ["all creatures", "all beings", "everything"],
    translation: "And He taught Adam the names of all things.",
  },
  {
    id: 112, surahName: "Al-Baqarah", ayahRef: "2:115",
    arabic: "وَلِلَّهِ الْمَشْرِقُ وَالْمَغْرِبُ فَأَيْنَمَا تُوَلُّوا فَثَمَّ وَجْهُ اللَّهِ",
    transliteration: "Wa-li-Llāhi al-mashriqu wal-maghribu fa-aynamā tuwallū fa-thamma wajhu Allāh",
    words: ["To Allah belongs", "the East and West", "wherever you turn", "there is", "the Face of Allah"],
    decoys: ["the presence of Allah", "Allah's direction", "His direction"],
    translation: "To Allah belongs the East and the West. Wherever you turn, there is the Face of Allah.",
  },
  {
    id: 113, surahName: "Al-Imran", ayahRef: "3:8",
    arabic: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً",
    transliteration: "Rabbanā lā tuzigh qulūbanā ba'da idh hadaytanā wa-hab lanā min ladunka raḥmah",
    words: ["Our Lord", "do not let our hearts", "deviate after", "You have guided us", "and grant us mercy"],
    decoys: ["and forgive us", "and have mercy", "from Yourself"],
    translation: "Our Lord, do not let our hearts deviate after You have guided us and grant us mercy from Yourself.",
  },
  {
    id: 114, surahName: "An-Nisa", ayahRef: "4:1",
    arabic: "يَا أَيُّهَا النَّاسُ اتَّقُوا رَبَّكُمُ الَّذِي خَلَقَكُمْ مِنْ نَفْسٍ وَاحِدَةٍ",
    transliteration: "Yā ayyuhā an-nāsu ittaqū rabbakumu alladhī khalaqakum min nafsin wāḥidah",
    words: ["O mankind", "fear your Lord", "who created you", "from a single", "soul"],
    decoys: ["person", "being", "spirit"],
    translation: "O mankind, fear your Lord, who created you from a single soul.",
  },
  {
    id: 115, surahName: "Al-Maidah", ayahRef: "5:32",
    arabic: "مَنْ قَتَلَ نَفْسًا بِغَيْرِ نَفْسٍ أَوْ فَسَادٍ فِي الْأَرْضِ فَكَأَنَّمَا قَتَلَ النَّاسَ جَمِيعًا",
    transliteration: "Man qatala nafsan bi-ghayri nafsin aw fasādin fī al-arḍi fa-ka'annamā qatala an-nāsa jamī'ā",
    words: ["Whoever kills a soul", "unjustly", "it is as if", "he killed", "all mankind"],
    decoys: ["all people", "humanity", "the entire world"],
    translation: "Whoever kills a soul unjustly, it is as if he had killed all mankind.",
  },
  {
    id: 116, surahName: "Al-Anam", ayahRef: "6:54",
    arabic: "كَتَبَ رَبُّكُمْ عَلَى نَفْسِهِ الرَّحْمَةَ",
    transliteration: "Kataba rabbukum 'alā nafsihi ar-raḥmah",
    words: ["Your Lord has", "decreed upon Himself", "mercy", "that He will", "forgive"],
    decoys: ["be kind", "be gracious", "be compassionate"],
    translation: "Your Lord has decreed upon Himself mercy.",
  },
  {
    id: 117, surahName: "Al-Araf", ayahRef: "7:56",
    arabic: "وَلَا تُفْسِدُوا فِي الْأَرْضِ بَعْدَ إِصْلَاحِهَا",
    transliteration: "Wa-lā tufsidū fī al-arḍi ba'da iṣlāḥihā",
    words: ["And do not", "spread corruption", "in the earth", "after", "it has been set right"],
    decoys: ["it was fixed", "its reform", "it was corrected"],
    translation: "And do not spread corruption in the earth after it has been set right.",
  },
  {
    id: 118, surahName: "Al-Anfal", ayahRef: "8:46",
    arabic: "وَأَطِيعُوا اللَّهَ وَرَسُولَهُ وَلَا تَنَازَعُوا فَتَفْشَلُوا وَتَذْهَبَ رِيحُكُمْ",
    transliteration: "Wa-aṭī'ū Allāha wa-rasūlahu wa-lā tanāza'ū fa-tafshalū wa-tadhhaba rīḥukum",
    words: ["Obey Allah", "and His Messenger", "and do not dispute", "lest you fail", "and lose your strength"],
    decoys: ["your courage", "your resolve", "your unity"],
    translation: "Obey Allah and His Messenger and do not dispute, lest you fail and lose your strength.",
  },
  {
    id: 119, surahName: "Yunus", ayahRef: "10:57",
    arabic: "يَا أَيُّهَا النَّاسُ قَدْ جَاءَتْكُمْ مَوْعِظَةٌ مِنْ رَبِّكُمْ",
    transliteration: "Yā ayyuhā an-nāsu qad jā'atkum maw'iẓatun min rabbikum",
    words: ["O mankind", "there has come to you", "an instruction", "from your Lord", "and a healing"],
    decoys: ["a guidance", "a message", "a reminder"],
    translation: "O mankind, there has come to you instruction from your Lord and a healing.",
  },
  {
    id: 120, surahName: "Hud", ayahRef: "11:6",
    arabic: "وَمَا مِنْ دَابَّةٍ فِي الْأَرْضِ إِلَّا عَلَى اللَّهِ رِزْقُهَا",
    transliteration: "Wa-mā min dābbatin fī al-arḍi illā 'alā Allāhi rizquhā",
    words: ["There is no creature", "on earth", "except that", "upon Allah", "is its provision"],
    decoys: ["its sustenance", "its food", "its livelihood"],
    translation: "There is no creature on earth but that upon Allah is its provision.",
  },
];

const MAX_ATTEMPTS = 5;
const SLOTS = 5;
const STORAGE_KEY = "qurandle_stats";
const GAME_KEY = "qurandle_game";

interface GameStats {
  played: number;
  won: number;
  streak: number;
  maxStreak: number;
  distribution: number[];
  lastPlayed: string;
}

interface GameState {
  puzzleId: number;
  dateKey: string;
  attempts: string[][];
  statuses: CellStatus[][];
  solved: boolean;
  failed: boolean;
}

type CellStatus = "correct" | "present" | "absent" | "empty";

function getDailyPuzzle(): Puzzle {
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash + dateStr.charCodeAt(i)) & 0x7fffffff;
  }
  return PUZZLES[hash % PUZZLES.length];
}

const COLORS = {
  correct: "#22c55e",
  present: "#84A98C",
  absent:  "#ef4444",
} as const;

function ArabicWordStrip({ arabic, transliteration }: { arabic: string; transliteration: string }) {
  const arabicWords = arabic.trim().split(/\s+/);
  const transWords = transliteration.trim().split(/\s+/);
  return (
    <div dir="rtl" className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 py-1">
      {arabicWords.map((word, i) => (
        <div key={i} className="flex flex-col items-center gap-0.5">
          <span className="arabic-text text-sm leading-snug text-foreground">{word}</span>
          <span className="text-[8px] leading-none text-muted-foreground tracking-tight">{transWords[i] ?? ""}</span>
        </div>
      ))}
    </div>
  );
}

function getDateKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function getYesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function loadStats(): GameStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { played: 0, won: 0, streak: 0, maxStreak: 0, distribution: [0, 0, 0, 0, 0], lastPlayed: "" };
}

function saveStats(stats: GameStats) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

function loadGame(): GameState | null {
  try {
    const raw = localStorage.getItem(GAME_KEY);
    if (raw) {
      const game = JSON.parse(raw) as GameState;
      if (game.dateKey === getDateKey()) return game;
    }
  } catch {}
  return null;
}

function saveGame(game: GameState) {
  localStorage.setItem(GAME_KEY, JSON.stringify(game));
}

interface Achievement {
  id: string;
  label: string;
  desc: string;
  icon: string;
  check: (s: GameStats) => boolean;
}

const ACHIEVEMENTS: Achievement[] = [
  { id: "first_solve",  label: "First Solve",  desc: "Complete your first Qurandle",  icon: "⭐", check: s => s.won >= 1 },
  { id: "genius",       label: "Genius",        desc: "Solved in 1 guess",             icon: "🧠", check: s => s.distribution[0] >= 1 },
  { id: "eagle",        label: "Eagle Eye",     desc: "Solved in 2 guesses",           icon: "🦅", check: s => s.distribution[1] >= 1 },
  { id: "consistent",  label: "Consistent",    desc: "3-day streak achieved",         icon: "🔥", check: s => s.maxStreak >= 3 },
  { id: "scholar",      label: "Scholar",       desc: "7-day streak achieved",         icon: "📚", check: s => s.maxStreak >= 7 },
  { id: "half_century", label: "Half Century",  desc: "50 total wins",                 icon: "🏆", check: s => s.won >= 50 },
];

function getTimeUntilMidnight(): string {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight.getTime() - now.getTime();
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const sec = Math.floor((diff % 60000) / 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
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

function evaluateAttempt(attempt: string[], correct: string[]): CellStatus[] {
  const statuses: CellStatus[] = new Array(SLOTS).fill("absent");
  const used = new Array(SLOTS).fill(false);

  for (let i = 0; i < SLOTS; i++) {
    if (attempt[i] === correct[i]) {
      statuses[i] = "correct";
      used[i] = true;
    }
  }

  for (let i = 0; i < SLOTS; i++) {
    if (statuses[i] === "correct") continue;
    for (let j = 0; j < SLOTS; j++) {
      if (!used[j] && attempt[i] === correct[j]) {
        statuses[i] = "present";
        used[j] = true;
        break;
      }
    }
  }

  return statuses;
}

export default function Qurandle() {
  const puzzle = useMemo(() => getDailyPuzzle(), []);
  const dateKey = useMemo(() => getDateKey(), []);

  const allWords = useMemo(() => {
    const seed = dateKey.split("-").reduce((a, b) => a + parseInt(b), 0);
    return seededShuffle([...puzzle.words, ...puzzle.decoys], seed);
  }, [puzzle, dateKey]);

  const [game, setGame] = useState<GameState>(() => {
    const saved = loadGame();
    if (saved && saved.puzzleId === puzzle.id) return saved;
    return {
      puzzleId: puzzle.id,
      dateKey,
      attempts: [],
      statuses: [],
      solved: false,
      failed: false,
    };
  });

  const [currentPick, setCurrentPick] = useState<string[]>([]);
  const [showStats, setShowStats] = useState(false);
  const [showHelp, setShowHelp] = useState(() => !localStorage.getItem("qurandle_seen_help"));
  const [stats, setStats] = useState<GameStats>(loadStats);
  const [shakeRow, setShakeRow] = useState(false);
  const [revealRow, setRevealRow] = useState(-1);
  const [countdown, setCountdown] = useState(getTimeUntilMidnight);

  useEffect(() => { saveGame(game); }, [game]);

  useEffect(() => {
    const timer = setInterval(() => setCountdown(getTimeUntilMidnight()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const rollover = setInterval(() => {
      if (getDateKey() !== dateKey) {
        window.location.reload();
      }
    }, 30000);
    return () => clearInterval(rollover);
  }, [dateKey]);

  const isGameOver = game.solved || game.failed;

  const usedWords = useMemo(() => {
    const map: Record<string, CellStatus> = {};
    game.attempts.forEach((attempt, ai) => {
      attempt.forEach((word, wi) => {
        const st = game.statuses[ai]?.[wi];
        if (!st) return;
        const prev = map[word];
        if (st === "correct") map[word] = "correct";
        else if (st === "present" && prev !== "correct") map[word] = "present";
        else if (!prev) map[word] = st;
      });
    });
    return map;
  }, [game.attempts, game.statuses]);

  const handleWordTap = useCallback((word: string) => {
    if (isGameOver) return;
    if (currentPick.length >= SLOTS) return;
    haptic("light");
    setCurrentPick(prev => {
      if (prev.includes(word)) return prev;
      return [...prev, word];
    });
  }, [isGameOver, currentPick.length]);

  const handleRemoveWord = useCallback((index: number) => {
    if (isGameOver) return;
    haptic("light");
    setCurrentPick(prev => prev.filter((_, i) => i !== index));
  }, [isGameOver]);

  const handleClear = useCallback(() => {
    haptic("light");
    setCurrentPick([]);
  }, []);

  const handleSubmit = useCallback(() => {
    if (currentPick.length !== SLOTS) {
      setShakeRow(true);
      setTimeout(() => setShakeRow(false), 500);
      haptic("tap");
      return;
    }

    const statuses = evaluateAttempt(currentPick, [...puzzle.words]);
    const solved = statuses.every(s => s === "correct");
    const attemptNum = game.attempts.length + 1;
    const failed = !solved && attemptNum >= MAX_ATTEMPTS;

    setRevealRow(game.attempts.length);
    setTimeout(() => setRevealRow(-1), 600);

    const newGame: GameState = {
      ...game,
      attempts: [...game.attempts, [...currentPick]],
      statuses: [...game.statuses, statuses],
      solved,
      failed,
    };

    setGame(newGame);
    setCurrentPick([]);

    if (solved) {
      haptic("success");
      playAchievementChime();
      const newStats = { ...stats };
      newStats.played++;
      newStats.won++;
      const yesterday = getYesterdayKey();
      newStats.streak = newStats.lastPlayed === yesterday ? newStats.streak + 1 : 1;
      if (newStats.streak > newStats.maxStreak) newStats.maxStreak = newStats.streak;
      newStats.distribution[attemptNum - 1]++;
      newStats.lastPlayed = dateKey;
      setStats(newStats);
      saveStats(newStats);
      setTimeout(() => setShowStats(true), 1200);
    } else if (failed) {
      haptic("tap");
      const newStats = { ...stats };
      newStats.played++;
      newStats.streak = 0;
      newStats.lastPlayed = dateKey;
      setStats(newStats);
      saveStats(newStats);
      setTimeout(() => setShowStats(true), 1200);
    } else {
      haptic("tap");
    }
  }, [currentPick, puzzle, game, stats, dateKey]);

  const shareResult = useCallback(() => {
    const emojiGrid = game.statuses.map(row =>
      row.map(s => s === "correct" ? "🟩" : s === "present" ? "🟨" : "⬛").join("")
    ).join("\n");
    const text = `Qurandle ${dateKey}\n${game.solved ? game.attempts.length : "X"}/${MAX_ATTEMPTS}\n\n${emojiGrid}\n\nKun Fayakun — Daily Quranic Word Game`;
    if (navigator.share) {
      navigator.share({ text }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(text);
    }
    haptic("success");
  }, [game, dateKey]);

  const dismissHelp = useCallback(() => {
    setShowHelp(false);
    localStorage.setItem("qurandle_seen_help", "1");
  }, []);

  return (
    <div className="flex-1 flex flex-col px-4 pt-4 pb-6 bg-background min-h-full">
      <header className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Qurandle</h1>
          <p className="text-xs text-muted-foreground font-medium">Arrange the English translation in order</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowHelp(true)} className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center">
            <HelpCircle className="w-4 h-4 text-muted-foreground" />
          </button>
          <button onClick={() => setShowStats(true)} className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </header>

      <div className="text-center mb-3 px-3 pt-2 pb-1 bg-card rounded-xl border border-border">
        <p className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1">
          {puzzle.surahName} — {puzzle.ayahRef}
        </p>
        <ArabicWordStrip arabic={puzzle.arabic} transliteration={puzzle.transliteration} />
      </div>

      <div className="flex-1 flex flex-col gap-2">
        {Array.from({ length: MAX_ATTEMPTS }).map((_, rowIndex) => {
          const attempt = game.attempts[rowIndex];
          const rowStatuses = game.statuses[rowIndex];
          const isCurrentRow = !isGameOver && rowIndex === game.attempts.length;
          const pick = isCurrentRow ? currentPick : [];

          return (
            <motion.div
              key={rowIndex}
              className={cn(
                "flex gap-1 justify-center items-center",
              )}
              animate={isCurrentRow && shakeRow ? { x: [0, -6, 6, -6, 6, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              {Array.from({ length: SLOTS }).map((_, colIndex) => {
                const word = attempt ? attempt[colIndex] : pick[colIndex];
                const status = attempt ? rowStatuses?.[colIndex] : undefined;
                const isEmpty = !word;
                const isPickSlot = isCurrentRow && colIndex < pick.length;

                return (
                  <motion.div
                    key={colIndex}
                    initial={rowIndex === revealRow ? { rotateX: 90, opacity: 0 } : {}}
                    animate={{ rotateX: 0, opacity: 1 }}
                    transition={{ delay: colIndex * 0.08, duration: 0.25 }}
                    onClick={() => isCurrentRow && isPickSlot ? handleRemoveWord(colIndex) : undefined}
                    className={cn(
                      "flex-1 min-h-[44px] max-w-[68px] rounded-lg flex items-center justify-center text-center px-1 py-1 text-[10px] font-bold border-2 transition-colors leading-tight cursor-default",
                      isEmpty && !isPickSlot && "border-dashed border-border/40 bg-transparent",
                      isPickSlot && !attempt && "bg-primary/10 border-primary/40 text-primary cursor-pointer active:scale-95 transition-transform",
                      status === "correct" && "bg-[#22c55e] text-white border-[#22c55e]",
                      status === "present" && "bg-[#84A98C] text-white border-[#84A98C]",
                      status === "absent"  && "bg-[#ef4444] text-white border-[#ef4444]",
                    )}
                  >
                    {word ?? ""}
                  </motion.div>
                );
              })}
            </motion.div>
          );
        })}

        {isGameOver && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-4 bg-card border border-border text-center space-y-2 mt-1"
          >
            {game.solved ? (
              <>
                <div className="flex items-center justify-center gap-2">
                  <Trophy className="w-5 h-5 text-[#C9A84C]" />
                  <span className="font-bold text-foreground text-sm">
                    {game.attempts.length === 1 ? "SubhanAllah! First try!" :
                     game.attempts.length <= 3 ? "Excellent! MashaAllah!" : "Alhamdulillah!"}
                  </span>
                </div>
              </>
            ) : (
              <p className="font-bold text-foreground text-sm">The correct order was:</p>
            )}
            <ArabicWordStrip arabic={puzzle.arabic} transliteration={puzzle.transliteration} />
            <p className="text-xs text-muted-foreground">{puzzle.translation}</p>
            <p className="text-[10px] font-bold text-secondary">— {puzzle.surahName} ({puzzle.ayahRef})</p>
          </motion.div>
        )}

        {!isGameOver && (
          <div className="mt-2 space-y-3">
            <div className="flex gap-1.5 justify-center flex-wrap">
              {allWords.map((word, idx) => {
                const inPick = currentPick.includes(word);
                const status = usedWords[word];
                return (
                  <motion.button
                    key={`bank-${idx}-${word}`}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleWordTap(word)}
                    disabled={inPick}
                    className={cn(
                      "px-2.5 py-2 rounded-xl text-xs font-semibold border-2 transition-all duration-200",
                      inPick
                        ? "opacity-30 border-border bg-muted cursor-not-allowed"
                        : status === "correct"
                          ? "border-[#22c55e]/50 bg-[#22c55e]/10 text-[#22c55e]"
                          : status === "present"
                            ? "border-[#84A98C]/50 bg-[#84A98C]/10 text-[#84A98C]"
                            : status === "absent"
                              ? "border-[#ef4444]/30 bg-[#ef4444]/8 text-[#ef4444]/60"
                              : "border-border bg-card text-foreground shadow-sm active:bg-primary/5"
                    )}
                  >
                    {word}
                  </motion.button>
                );
              })}
            </div>

            <div className="flex gap-2 justify-center">
              <button
                onClick={handleClear}
                disabled={currentPick.length === 0}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-card border border-border text-muted-foreground disabled:opacity-30 active:scale-95 transition-transform"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Clear
              </button>
              <button
                onClick={handleSubmit}
                disabled={currentPick.length !== SLOTS}
                className="flex-1 max-w-[200px] py-2.5 rounded-xl text-sm font-bold bg-primary text-white disabled:opacity-30 active:scale-95 transition-transform shadow-md"
              >
                Check ({game.attempts.length + 1}/{MAX_ATTEMPTS})
              </button>
            </div>
          </div>
        )}

        {isGameOver && (
          <div className="flex flex-col items-center gap-3 mt-2">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-medium">Next puzzle in</span>
              <span className="text-sm font-bold text-foreground font-mono">{countdown}</span>
            </div>
            <button
              onClick={shareResult}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-md active:scale-95 transition-transform"
            >
              <Share2 className="w-4 h-4" />
              Share Result
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showStats && (
          <StatsModal
            stats={stats}
            game={game}
            onClose={() => setShowStats(false)}
            onShare={shareResult}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHelp && <HelpModal onClose={dismissHelp} />}
      </AnimatePresence>
    </div>
  );
}

function StatsModal({ stats, game, onClose, onShare }: {
  stats: GameStats;
  game: GameState;
  onClose: () => void;
  onShare: () => void;
}) {
  const winPct = stats.played > 0 ? Math.round((stats.won / stats.played) * 100) : 0;
  const maxDist = Math.max(...stats.distribution, 1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-foreground/20 backdrop-blur-sm sm:p-4"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-full max-w-sm bg-card sm:border border-border rounded-t-[2rem] sm:rounded-[2rem] p-6 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-hide"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-foreground">Statistics</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { value: stats.played, label: "Played" },
            { value: winPct, label: "Win %" },
            { value: stats.streak, label: "Streak" },
            { value: stats.maxStreak, label: "Max" },
          ].map(item => (
            <div key={item.label} className="text-center">
              <div className="text-2xl font-bold text-foreground">{item.value}</div>
              <div className="text-[10px] font-medium text-muted-foreground">{item.label}</div>
            </div>
          ))}
        </div>

        <div className="space-y-1.5 mb-6">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Guess Distribution</h3>
          {stats.distribution.map((count, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground w-3">{i + 1}</span>
              <div
                className={cn(
                  "h-5 rounded-md flex items-center justify-end px-1.5 text-[10px] font-bold text-white min-w-[20px] transition-all",
                  game.solved && game.attempts.length === i + 1 ? "bg-primary" : "bg-muted-foreground/30"
                )}
                style={{ width: `${Math.max(10, (count / maxDist) * 100)}%` }}
              >
                {count}
              </div>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Achievements</h3>
          <div className="grid grid-cols-3 gap-2">
            {ACHIEVEMENTS.map(a => {
              const unlocked = a.check(stats);
              return (
                <div key={a.id} className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-xl border text-center",
                  unlocked ? "bg-secondary/10 border-secondary/30" : "bg-muted/30 border-border opacity-40"
                )}>
                  <span className="text-xl">{a.icon}</span>
                  <span className="text-[9px] font-bold text-foreground leading-tight">{a.label}</span>
                  <span className="text-[8px] text-muted-foreground leading-tight">{a.desc}</span>
                </div>
              );
            })}
          </div>
        </div>

        {(game.solved || game.failed) && (
          <button
            onClick={onShare}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white font-bold text-sm active:scale-95 transition-transform"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}

function HelpModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-foreground/20 backdrop-blur-sm sm:p-4"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-full max-w-sm bg-card sm:border border-border rounded-t-[2rem] sm:rounded-[2rem] p-6 shadow-2xl max-h-[80vh] overflow-y-auto scrollbar-hide"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">How to Play</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-4 text-sm text-foreground/80">
          <p className="font-medium">Arrange 5 English word-chunks of a Quranic verse in the correct order.</p>

          <div className="space-y-2">
            <p className="font-bold text-foreground">Rules:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>You have <strong>5 attempts</strong></li>
              <li>Tap word tiles below to fill the 5 slots</li>
              <li>Tap a placed word to remove it</li>
              <li>Some tiles are <strong>decoys</strong> not in the verse</li>
              <li>The Arabic original is shown above for reference</li>
              <li>A new puzzle appears daily at midnight</li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-foreground">Color Guide:</p>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="px-2.5 py-1.5 rounded-lg bg-[#22c55e] text-white text-xs font-bold">of Allah</div>
                <span>Correct position</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-2.5 py-1.5 rounded-lg bg-[#84A98C] text-white text-xs font-bold">the Lord</div>
                <span>In verse, wrong position</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-2.5 py-1.5 rounded-lg bg-[#ef4444] text-white text-xs font-bold">the King</div>
                <span>Not in the verse (decoy)</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 rounded-xl bg-primary text-white font-bold text-sm active:scale-95 transition-transform"
        >
          Got it!
        </button>
      </motion.div>
    </motion.div>
  );
}
