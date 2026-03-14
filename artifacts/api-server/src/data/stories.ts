export const STORY_CATEGORIES = [
  {
    id: "prophets",
    name: "Stories of the Prophets",
    icon: "⭐",
    description: "The lives, trials and miracles of the 25 Prophets mentioned in the Quran",
    storyCount: 5,
    color: "#C9A84C",
  },
  {
    id: "companions",
    name: "The Companions",
    icon: "🌙",
    description: "Inspiring stories of the Sahabah who walked alongside the Prophet ﷺ",
    storyCount: 4,
    color: "#7CB99E",
  },
  {
    id: "hadith-gems",
    name: "Hadith Gems",
    icon: "💎",
    description: "Wisdom, guidance and teachings from authentic hadith collections",
    storyCount: 5,
    color: "#9B8EC4",
  },
  {
    id: "quran-stories",
    name: "Stories of the Quran",
    icon: "📖",
    description: "Profound narratives from the Holy Quran that carry lessons for all of humanity",
    storyCount: 4,
    color: "#5B8DB8",
  },
  {
    id: "seerah",
    name: "Seerah — Life of the Prophet ﷺ",
    icon: "🕌",
    description: "Moments from the blessed life and character of Prophet Muhammad ﷺ",
    storyCount: 4,
    color: "#E8967A",
  },
];

export const STORIES = [
  // PROPHETS
  {
    id: "ibrahim-fire",
    categoryId: "prophets",
    title: "Ibrahim and the Fire",
    subtitle: "The Father of Prophets",
    arabicTitle: "إِبْرَاهِيمُ وَالنَّار",
    readTime: 5,
    tags: ["Tawakkul", "Patience", "Miracle"],
    content: [
      {
        type: "paragraph",
        text: "Ibrahim (AS) grew up in a society drowned in idol worship. His own father, Azar, was a sculptor of the very idols the people worshipped. But Ibrahim's heart was drawn to truth — he questioned everything, looked at the stars, the moon and the sun, and concluded that none of these were worthy of worship. Only the One who created them all deserved his complete devotion.",
      },
      {
        type: "highlight",
        text: "When his people led him to be thrown into a blazing fire, Ibrahim placed his trust entirely in Allah. He said: 'HasbiyAllahu wa ni'mal wakeel' — Allah is sufficient for me and He is the best Disposer of affairs.",
        arabic: "حَسْبِيَ اللهُ وَنِعْمَ الْوَكِيلُ",
        reference: "Quran 3:173",
      },
      {
        type: "paragraph",
        text: "Nimrod, the tyrant king, commanded that Ibrahim be thrown into the greatest fire ever kindled. Narrations mention the fire was so intense that birds could not fly over it. Ibrahim was placed in a catapult and launched into the inferno. And then — Allah spoke.",
      },
      {
        type: "verse",
        text: "We said: O Fire, be coolness and safety upon Ibrahim.",
        arabic: "قُلْنَا يَا نَارُ كُونِي بَرْدًا وَسَلَامًا عَلَىٰ إِبْرَاهِيمَ",
        reference: "Quran 21:69",
      },
      {
        type: "paragraph",
        text: "The fire obeyed its Lord and became cool and peaceful for Ibrahim. He walked out of it unharmed, without even the smell of smoke on his clothes. Nimrod's power was broken that day — not by an army, not by a weapon, but by a man who had nothing but complete trust in Allah.",
      },
      {
        type: "highlight",
        text: "Lesson: When you place full trust in Allah, the impossible becomes possible. Allah can command the very laws of nature to protect His servant.",
      },
    ],
  },
  {
    id: "yusuf-patience",
    categoryId: "prophets",
    title: "Yusuf — The Best of Stories",
    subtitle: "From the well to the throne",
    arabicTitle: "يُوسُفُ — أَحْسَنُ الْقَصَص",
    readTime: 7,
    tags: ["Patience", "Gratitude", "Trust in Allah"],
    content: [
      {
        type: "paragraph",
        text: "Allah called the story of Yusuf (AS) 'the best of stories' — and it truly is. From beloved son to abandoned slave, from slave to prisoner, from prisoner to the highest minister in Egypt, his life was a series of tests that would break most people. But Yusuf held on.",
      },
      {
        type: "verse",
        text: "We relate to you, [O Muhammad], the best of stories in what We have revealed to you of this Quran.",
        arabic: "نَحْنُ نَقُصُّ عَلَيْكَ أَحْسَنَ الْقَصَصِ",
        reference: "Quran 12:3",
      },
      {
        type: "paragraph",
        text: "His brothers, consumed by jealousy of their father's love for him, threw young Yusuf into a well and told their father he had been eaten by a wolf. Yusuf was found by travellers and sold as a slave in Egypt. There, the wife of his master tried to seduce him, and when he refused, she accused him falsely. He was thrown in prison for years — innocent.",
      },
      {
        type: "highlight",
        text: "At every low point, Yusuf never complained to people. He said: 'I only complain of my suffering and my grief to Allah.' His relationship with Allah remained his anchor through every storm.",
        arabic: "إِنَّمَا أَشْكُو بَثِّي وَحُزْنِي إِلَى اللهِ",
        reference: "Quran 12:86",
      },
      {
        type: "paragraph",
        text: "After years in prison, Yusuf interpreted the King of Egypt's dream and was released and appointed as the Minister of Finance. When his brothers came to Egypt years later in a time of famine, he revealed himself. They expected punishment. Instead, he said the most beautiful words of forgiveness recorded in the Quran.",
      },
      {
        type: "verse",
        text: "He said: No blame will there be upon you today. Allah will forgive you; and He is the most merciful of the merciful.",
        arabic: "قَالَ لَا تَثْرِيبَ عَلَيْكُمُ الْيَوْمَ ۖ يَغْفِرُ اللهُ لَكُمْ",
        reference: "Quran 12:92",
      },
      {
        type: "highlight",
        text: "Lesson: Your lowest moment is not your final moment. Allah raises whom He wills. Never lose hope in His plan — even when you are in the well, on the way to the throne.",
      },
    ],
  },
  {
    id: "musa-sea",
    categoryId: "prophets",
    title: "Musa and the Parting of the Sea",
    subtitle: "When there is no way out, Allah creates one",
    arabicTitle: "مُوسَىٰ وَانْفِلَاقُ الْبَحْر",
    readTime: 5,
    tags: ["Tawakkul", "Miracle", "Courage"],
    content: [
      {
        type: "paragraph",
        text: "After years of struggle against Pharaoh, Musa (AS) finally led Bani Israel out of Egypt. But Pharaoh, humiliated and furious, assembled his entire army and pursued them. The Israelites reached the Red Sea — water ahead, Pharaoh's army behind. There was nowhere to go.",
      },
      {
        type: "paragraph",
        text: "The people panicked. They cried out to Musa: 'We are going to be caught!' Some even suggested they had been brought out of Egypt only to be killed. The situation looked impossible from every human perspective.",
      },
      {
        type: "verse",
        text: "He said: No! Indeed, with me is my Lord; He will guide me.",
        arabic: "قَالَ كَلَّا ۖ إِنَّ مَعِيَ رَبِّي سَيَهْدِينِ",
        reference: "Quran 26:62",
      },
      {
        type: "paragraph",
        text: "Allah commanded Musa to strike the sea with his staff. The sea parted — twelve massive paths opened up, one for each tribe, with walls of water on each side. Bani Israel walked through on dry ground. Pharaoh and his army followed — and the sea returned, swallowing them entirely.",
      },
      {
        type: "highlight",
        text: "Lesson: When you have done everything you can and there is no human solution left — that is exactly where Allah steps in. 'Indeed, with me is my Lord; He will guide me.' Say this with certainty.",
      },
    ],
  },
  {
    id: "ayyub-patience",
    categoryId: "prophets",
    title: "Ayyub — The Embodiment of Patience",
    subtitle: "A Prophet who never complained",
    arabicTitle: "أَيُّوبُ — مَثَلُ الصَّبْر",
    readTime: 4,
    tags: ["Patience", "Gratitude", "Trial"],
    content: [
      {
        type: "paragraph",
        text: "Prophet Ayyub (AS) was a man of immense wealth, a large family, and excellent health. Then his trials began. He lost his wealth. He lost his children. He was afflicted with a severe illness that lasted, according to various narrations, for many years. Yet through all of it, he did not complain. He did not blame Allah.",
      },
      {
        type: "highlight",
        text: "He never said: 'Why me?' He only said: 'Harm has touched me and You are the Most Merciful of the merciful.'",
        arabic: "أَنِّي مَسَّنِيَ الضُّرُّ وَأَنتَ أَرْحَمُ الرَّاحِمِينَ",
        reference: "Quran 21:83",
      },
      {
        type: "paragraph",
        text: "Allah heard this whispered prayer and responded. He restored Ayyub's health, gave him back his family and doubled his wealth. Ayyub's patience was not passive — it was an active, conscious choice to remain connected to Allah through the hardest of times.",
      },
      {
        type: "verse",
        text: "And We responded to him and removed what afflicted him of adversity. And We gave him back his family and the like thereof with them.",
        arabic: "فَاسْتَجَبْنَا لَهُ فَكَشَفْنَا مَا بِهِ مِن ضُرٍّ",
        reference: "Quran 21:84",
      },
      {
        type: "highlight",
        text: "Lesson: Patience (Sabr) is not silence. It is choosing to remain with Allah when everything is taken away. And Allah always compensates the patient in ways beyond their imagination.",
      },
    ],
  },
  {
    id: "yunus-whale",
    categoryId: "prophets",
    title: "Yunus in the Darkness",
    subtitle: "The prayer that ascends from the depths",
    arabicTitle: "يُونُسُ فِي الظُّلُمَات",
    readTime: 4,
    tags: ["Repentance", "Hope", "Dua"],
    content: [
      {
        type: "paragraph",
        text: "Prophet Yunus (AS) was sent to the people of Nineveh with the message of Allah. When they initially rejected him, he left without waiting for Allah's command — a momentary lapse in prophetic duty. He boarded a ship, and when a terrible storm came, the crew drew lots to lighten the load. Yunus's name came up and he was thrown overboard, swallowed by a great whale.",
      },
      {
        type: "paragraph",
        text: "Inside the whale, in complete darkness — the darkness of the night, the darkness of the ocean, the darkness of the whale's belly — Yunus turned to Allah with the most powerful dua ever made in despair.",
      },
      {
        type: "hadith",
        text: "The supplication of Yunus in the belly of the whale: 'There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.' No Muslim calls upon Allah with these words for any matter, except that Allah responds to him.",
        arabic: "لَا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ",
        reference: "Quran 21:87 | Tirmidhi",
      },
      {
        type: "paragraph",
        text: "Allah accepted his repentance. The whale was commanded to release Yunus onto a barren shore. He was weak, humbled and grateful. Allah caused a plant to grow over him for shade and then sent him back to his people — and this time, a hundred thousand of them believed.",
      },
      {
        type: "highlight",
        text: "Lesson: No darkness is too deep for your dua to reach Allah. This specific dua — La ilaha illa anta, subhanaka, inni kuntu minaz-zalimin — is guaranteed to be answered. Make it yours.",
      },
    ],
  },

  // COMPANIONS
  {
    id: "bilal-patience",
    categoryId: "companions",
    title: "Bilal ibn Rabah — Ahad, Ahad",
    subtitle: "One word that changed history",
    arabicTitle: "بِلَالُ بْنُ رَبَاح",
    readTime: 5,
    tags: ["Patience", "Courage", "Tawhid"],
    content: [
      {
        type: "paragraph",
        text: "Bilal ibn Rabah (RA) was an Abyssinian slave owned by Umayyah ibn Khalaf — one of the most vicious enemies of early Islam. When Umayyah discovered Bilal had accepted Islam, he would drag him out into the scorching desert at midday, lay him on the burning sand, and place a massive rock on his chest. The torture was designed to make him renounce Islam.",
      },
      {
        type: "highlight",
        text: "But Bilal would only say one thing, over and over: 'Ahad. Ahad.' — One. One. Referring to Allah's oneness. No matter what they did, that was all he would say.",
        arabic: "أَحَد... أَحَد",
      },
      {
        type: "paragraph",
        text: "Abu Bakr As-Siddiq (RA) passed by one day and could not bear to see Bilal's suffering. He purchased Bilal and freed him immediately — for the sake of Allah alone. Years later, after the conquest of Makkah, the Prophet ﷺ called Bilal to climb the Ka'bah and give the very first adhan from its roof. The man who was tortured in its shadow now stood above it, calling creation to worship.",
      },
      {
        type: "highlight",
        text: "Lesson: Your lowest point — the place where you are humiliated, pressed down and in pain — could be where Allah is polishing you for the highest honour. Say 'Ahad' and hold on.",
      },
    ],
  },
  {
    id: "abu-bakr-hijrah",
    categoryId: "companions",
    title: "Abu Bakr and the Cave",
    subtitle: "True friendship with the Prophet ﷺ",
    arabicTitle: "أَبُو بَكْرٍ وَالْغَار",
    readTime: 5,
    tags: ["Love", "Courage", "Seerah"],
    content: [
      {
        type: "paragraph",
        text: "When the Prophet ﷺ received permission from Allah to migrate from Makkah to Madinah, the Quraysh had already plotted to assassinate him — 40 men from 40 tribes, so no single tribe would carry the blood debt. Allah informed His Prophet of the plan. The Prophet ﷺ chose Abu Bakr (RA) as his only companion for the journey.",
      },
      {
        type: "paragraph",
        text: "They took a difficult southern route and hid in the Cave of Thawr for three days. The Quraysh searched everywhere. When they reached the cave entrance, Abu Bakr could see their feet from inside. He grew worried — not for himself, but for the Prophet ﷺ.",
      },
      {
        type: "verse",
        text: "When he said to his companion: Do not grieve; indeed Allah is with us. And Allah sent down His tranquility upon him.",
        arabic: "إِذْ يَقُولُ لِصَاحِبِهِ لَا تَحْزَنْ إِنَّ اللهَ مَعَنَا",
        reference: "Quran 9:40",
      },
      {
        type: "paragraph",
        text: "Allah caused a spider to spin its web across the cave entrance and pigeons to nest there — making it look undisturbed for years. The Quraysh left. The Prophet ﷺ and Abu Bakr continued to Madinah safely, where they were received with overwhelming joy. Abu Bakr wept with happiness. He later said that was the happiest day of his life.",
      },
      {
        type: "highlight",
        text: "Lesson: 'La tahzan — do not grieve, Allah is with us.' These words were spoken in the darkest moment of the Hijrah. They are still true for you, right now.",
      },
    ],
  },
  {
    id: "umar-conversion",
    categoryId: "companions",
    title: "Umar's Conversion",
    subtitle: "The man who wanted to kill the Prophet ﷺ",
    arabicTitle: "إِسْلَامُ عُمَر",
    readTime: 5,
    tags: ["Guidance", "Power of Quran", "Transformation"],
    content: [
      {
        type: "paragraph",
        text: "Umar ibn al-Khattab (RA) was one of Islam's fiercest enemies. He was strong, feared, and deeply hostile to the early Muslims. One day, driven by rage, he set out with his sword to kill the Prophet ﷺ. On the way he was stopped and told that his own sister, Fatimah bint al-Khattab, and her husband had accepted Islam.",
      },
      {
        type: "paragraph",
        text: "Umar went to his sister's home in fury. He could hear recitation inside — it was Surah Ta-Ha. He entered and struck his sister in rage. When she was struck, she bled. Yet she declared: 'We will not leave Islam.' Something in her words stopped him. He asked to read what they had been reciting.",
      },
      {
        type: "verse",
        text: "Ta-Ha. We have not sent down to you the Quran that you be distressed. But only as a reminder for those who fear Allah.",
        arabic: "طه ۚ مَا أَنزَلْنَا عَلَيْكَ الْقُرْآنَ لِتَشْقَىٰ",
        reference: "Quran 20:1-3",
      },
      {
        type: "paragraph",
        text: "When Umar read those words, something broke open in his heart. He wept. He went directly to the Prophet ﷺ and took the Shahada. When the Companions heard that Umar had accepted Islam, they raised the takbeer — Allahu Akbar — so loud it echoed through the streets of Makkah. The Prophet ﷺ said: 'O Allah, strengthen Islam with Umar.'",
      },
      {
        type: "highlight",
        text: "Lesson: The Quran has the power to transform the hardest of hearts. Never underestimate one verse, one ayah, one word of Allah reaching the right person at the right time.",
      },
    ],
  },
  {
    id: "khadijah-support",
    categoryId: "companions",
    title: "Khadijah — The First Believer",
    subtitle: "The woman who held the Prophet ﷺ when he trembled",
    arabicTitle: "خَدِيجَةُ — أُولَى الْمُؤْمِنِين",
    readTime: 4,
    tags: ["Love", "Support", "Women in Islam"],
    content: [
      {
        type: "paragraph",
        text: "When the revelation first came to the Prophet ﷺ in the Cave of Hira, he trembled and rushed home. He was shaken to his core, not knowing what had happened to him. He came to Khadijah bint Khuwaylid (RA) — his wife, his support, his peace. He said: 'Cover me, cover me.'",
      },
      {
        type: "paragraph",
        text: "She wrapped him, held him, and calmed him. And then she spoke words that became one of the most beloved reassurances in Islamic history: 'By Allah, Allah will never humiliate you. You maintain family ties, you bear the burdens of others, you give to those who have nothing, you honour guests, and you help those afflicted by calamity.'",
      },
      {
        type: "highlight",
        text: "Khadijah then took him to her cousin Waraqah — a scholar of the scriptures — who confirmed: 'This is the same angel who came to Musa. You are the Prophet of this nation.' She was the first to believe in him — without hesitation, without doubt.",
      },
      {
        type: "hadith",
        text: "The Prophet ﷺ said: 'She believed in me when people disbelieved. She supported me with her wealth when people deprived me. And Allah blessed me with children through her.'",
        reference: "Ahmad",
      },
      {
        type: "highlight",
        text: "Lesson: A believing, supportive partner is among the greatest gifts of this life. Khadijah's love and faith were the foundation on which the Prophet's mission rested in its most difficult early days.",
      },
    ],
  },

  // HADITH GEMS
  {
    id: "hadith-intention",
    categoryId: "hadith-gems",
    title: "Actions by Intentions",
    subtitle: "The most important hadith in Islam",
    arabicTitle: "الْأَعْمَالُ بِالنِّيَّات",
    readTime: 3,
    tags: ["Intention", "Sincerity", "Foundations"],
    content: [
      {
        type: "hadith",
        text: "Umar ibn al-Khattab (RA) reports that the Prophet ﷺ said: 'Actions are by intentions, and every person shall have what they intended. Whoever migrated for Allah and His Messenger, their migration was for Allah and His Messenger. And whoever migrated for worldly gain or to marry a woman, their migration was for what they migrated for.'",
        arabic: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
        reference: "Bukhari & Muslim — First hadith of Bukhari",
      },
      {
        type: "paragraph",
        text: "Imam Bukhari placed this hadith at the very beginning of his Sahih — the most authentic hadith collection — as the foundation of all Islamic action. Everything you do is shaped by why you do it. The same outward action can be an act of worship or an act of habit, depending solely on your intention.",
      },
      {
        type: "highlight",
        text: "Application: Before every deed — prayer, giving charity, helping someone — pause for a moment and renew your intention. Make it for Allah alone. This single habit can transform your entire life into an act of worship.",
      },
    ],
  },
  {
    id: "hadith-smile",
    categoryId: "hadith-gems",
    title: "Your Smile is Charity",
    subtitle: "Islam's simplest act of worship",
    arabicTitle: "تَبَسُّمُكَ صَدَقَة",
    readTime: 3,
    tags: ["Character", "Charity", "Simplicity"],
    content: [
      {
        type: "hadith",
        text: "The Prophet ﷺ said: 'Do not look down upon any good deed, even if it is meeting your brother with a cheerful face.'",
        arabic: "لَا تَحْقِرَنَّ مِنَ الْمَعْرُوفِ شَيْئًا وَلَوْ أَنْ تَلْقَى أَخَاكَ بِوَجْهٍ طَلْق",
        reference: "Muslim",
      },
      {
        type: "hadith",
        text: "He ﷺ also said: 'Your smiling in the face of your brother is charity. Your commanding good and forbidding evil is charity. Your guiding a man who is lost is charity. Your removing stones and thorns from the road is charity.'",
        arabic: "تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ صَدَقَةٌ",
        reference: "Tirmidhi",
      },
      {
        type: "paragraph",
        text: "In a world that often equates charity with money, Islam democratises goodness. Every smile, every kind word, every act of removing harm from someone's path — all of it counts. The Prophet ﷺ was described as the most cheerful-faced person. He was never seen without a smile when meeting people.",
      },
      {
        type: "highlight",
        text: "Application: You have been given the power to give charity at this very moment — with your face. Let your smile be your sadaqah today.",
      },
    ],
  },
  {
    id: "hadith-knowledge",
    categoryId: "hadith-gems",
    title: "Seek Knowledge from the Cradle",
    subtitle: "The obligation that never ends",
    arabicTitle: "اطْلُبُوا الْعِلْمَ",
    readTime: 3,
    tags: ["Knowledge", "Education", "Growth"],
    content: [
      {
        type: "verse",
        text: "Allah will raise those who have believed among you and those who were given knowledge, by degrees.",
        arabic: "يَرْفَعِ اللهُ الَّذِينَ آمَنُوا مِنكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ",
        reference: "Quran 58:11",
      },
      {
        type: "hadith",
        text: "The Prophet ﷺ said: 'Seeking knowledge is an obligation upon every Muslim.'",
        arabic: "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ",
        reference: "Ibn Majah",
      },
      {
        type: "hadith",
        text: "He ﷺ also said: 'Whoever treads a path in search of knowledge, Allah will make easy for him a path to Jannah.'",
        arabic: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ",
        reference: "Muslim",
      },
      {
        type: "highlight",
        text: "Application: Every moment spent learning about your Deen is a step on the path to Jannah. Read one hadith today. Learn one name of Allah. Understand one ayah. The angels lower their wings for the seeker of knowledge.",
      },
    ],
  },
  {
    id: "hadith-neighbours",
    categoryId: "hadith-gems",
    title: "The Neighbour's Right",
    subtitle: "Jibril kept advising about neighbours",
    arabicTitle: "حَقُّ الْجَار",
    readTime: 3,
    tags: ["Character", "Community", "Rights"],
    content: [
      {
        type: "hadith",
        text: "The Prophet ﷺ said: 'Jibril kept advising me about the neighbour until I thought he would make the neighbour an heir.'",
        arabic: "مَا زَالَ جِبْرِيلُ يُوصِينِي بِالْجَارِ حَتَّى ظَنَنتُ أَنَّهُ سَيُوَرِّثُهُ",
        reference: "Bukhari & Muslim",
      },
      {
        type: "hadith",
        text: "He ﷺ also said: 'Whoever believes in Allah and the Last Day, let him not harm his neighbour. Whoever believes in Allah and the Last Day, let him honour his guest.'",
        arabic: "مَنْ كَانَ يُؤْمِنُ بِاللهِ وَالْيَوْمِ الْآخِرِ فَلَا يُؤْذِ جَارَهُ",
        reference: "Bukhari & Muslim",
      },
      {
        type: "highlight",
        text: "Application: Your neighbour has a right over you. Have you checked on them recently? A warm meal, a kind word, or simply asking how they are — these are acts of Iman, not just courtesy.",
      },
    ],
  },
  {
    id: "hadith-trust",
    categoryId: "hadith-gems",
    title: "The Key to Sustenance",
    subtitle: "Tawakkul — True reliance on Allah",
    arabicTitle: "التَّوَكُّلُ عَلَى اللهِ",
    readTime: 3,
    tags: ["Trust", "Sustenance", "Tawakkul"],
    content: [
      {
        type: "hadith",
        text: "The Prophet ﷺ said: 'If you were to rely on Allah as He should be relied upon, He would provide for you as He provides for the bird — it goes out in the morning hungry and returns in the evening full.'",
        arabic: "لَوْ أَنَّكُمْ كُنْتُمْ تَوَكَّلُونَ عَلَى اللهِ حَقَّ تَوَكُّلِهِ لَرَزَقَكُمْ كَمَا يَرْزُقُ الطَّيْرَ",
        reference: "Tirmidhi",
      },
      {
        type: "paragraph",
        text: "Tawakkul is not passivity — the bird does not sit in its nest waiting for food to appear. It goes out. It acts. But it trusts that Allah will provide. True reliance on Allah means you do your part with full effort, then release the outcome to the One who controls all things.",
      },
      {
        type: "verse",
        text: "And whoever relies upon Allah — then He is sufficient for him. Indeed, Allah will accomplish His purpose. Allah has already set for everything a decreed extent.",
        arabic: "وَمَن يَتَوَكَّلْ عَلَى اللهِ فَهُوَ حَسْبُهُ",
        reference: "Quran 65:3",
      },
      {
        type: "highlight",
        text: "Application: Do your work. Make your plans. Tie your camel. Then release the results to Allah completely. This is Tawakkul. It is the most peaceful way to live.",
      },
    ],
  },

  // QURAN STORIES
  {
    id: "people-cave",
    categoryId: "quran-stories",
    title: "The People of the Cave",
    subtitle: "Young men who chose Allah over a kingdom",
    arabicTitle: "أَصْحَابُ الْكَهْف",
    readTime: 5,
    tags: ["Youth", "Courage", "Faith"],
    content: [
      {
        type: "paragraph",
        text: "In an ancient city, a tyrannical king demanded that all his people worship idols and abandon the truth. Among the people lived a group of young men — exact number known only to Allah — who believed in the One God. When they could no longer bear the pressure to renounce their faith, they made a momentous decision.",
      },
      {
        type: "verse",
        text: "They were youths who believed in their Lord, and We increased them in guidance.",
        arabic: "إِنَّهُمْ فِتْيَةٌ آمَنُوا بِرَبِّهِمْ وَزِدْنَاهُمْ هُدًى",
        reference: "Quran 18:13",
      },
      {
        type: "paragraph",
        text: "They retreated to a cave and prayed: 'Our Lord, grant us from Yourself mercy and prepare for us from our affair right guidance.' Allah caused them to sleep — not for hours or days, but for 309 years. Their dog sat at the cave entrance. Those who passed by thought they were awake. Their bodies turned naturally so they would not decay.",
      },
      {
        type: "highlight",
        text: "When they woke, they thought they had only slept a day. One of them went to buy food in the city with old coins — and found a completely different civilisation. The miracle became known, and their story became a sign of resurrection for all of humanity.",
      },
      {
        type: "verse",
        text: "And it was said: The promise of Allah is true, and as for the Hour, there is no doubt about it.",
        arabic: "وَأَنَّ السَّاعَةَ لَا رَيْبَ فِيهَا",
        reference: "Quran 18:21",
      },
      {
        type: "highlight",
        text: "Lesson: When you choose Allah over worldly comfort, Allah takes care of everything. The young men of the cave gave up a kingdom — and Allah gave them eternity. Surah Al-Kahf is recommended to be read every Friday.",
      },
    ],
  },
  {
    id: "luqman-wisdom",
    categoryId: "quran-stories",
    title: "The Wisdom of Luqman",
    subtitle: "A father's advice that Allah preserved forever",
    arabicTitle: "حِكْمَةُ لُقْمَان",
    readTime: 4,
    tags: ["Wisdom", "Family", "Guidance"],
    content: [
      {
        type: "paragraph",
        text: "Luqman was a man whom Allah blessed with wisdom — scholars differ on whether he was a Prophet or a righteous man. Allah preserved his advice to his son in the Quran, making his words guidance for every parent and child until the end of time.",
      },
      {
        type: "verse",
        text: "O my son, do not associate anything with Allah. Indeed, associating others with Him is great injustice.",
        arabic: "يَا بُنَيَّ لَا تُشْرِكْ بِاللهِ ۖ إِنَّ الشِّرْكَ لَظُلْمٌ عَظِيمٌ",
        reference: "Quran 31:13",
      },
      {
        type: "verse",
        text: "O my son, establish prayer, enjoin what is right, forbid what is wrong, and be patient over what befalls you. Indeed, all that is of the matters requiring determination.",
        arabic: "يَا بُنَيَّ أَقِمِ الصَّلَاةَ وَأْمُرْ بِالْمَعْرُوفِ وَانْهَ عَنِ الْمُنكَرِ وَاصْبِرْ عَلَىٰ مَا أَصَابَكَ",
        reference: "Quran 31:17",
      },
      {
        type: "verse",
        text: "And do not turn your cheek in contempt toward people and do not walk through the earth exultantly. Indeed, Allah does not like everyone self-deluded and boastful.",
        arabic: "وَلَا تُصَعِّرْ خَدَّكَ لِلنَّاسِ وَلَا تَمْشِ فِي الْأَرْضِ مَرَحًا",
        reference: "Quran 31:18",
      },
      {
        type: "highlight",
        text: "Lesson: The greatest gift a parent gives their child is Tawhid, prayer and good character — not wealth, status or connections. Luqman's advice covers everything that matters.",
      },
    ],
  },
  {
    id: "maryam-miracle",
    categoryId: "quran-stories",
    title: "Maryam — Chosen Above All Women",
    subtitle: "The miracle of a mother's trust in Allah",
    arabicTitle: "مَرْيَمُ — الْمُصْطَفَاة",
    readTime: 5,
    tags: ["Women", "Purity", "Miracle"],
    content: [
      {
        type: "verse",
        text: "And mention, O Muhammad, in the Book the story of Maryam, when she withdrew from her family to a place toward the east.",
        arabic: "وَاذْكُرْ فِي الْكِتَابِ مَرْيَمَ إِذِ انتَبَذَتْ مِنْ أَهْلِهَا مَكَانًا شَرْقِيًّا",
        reference: "Quran 19:16",
      },
      {
        type: "paragraph",
        text: "Maryam (AS) was the most devout of women, raised in the temple and known for her purity and worship. When the angel Jibril appeared to her in the form of a man, she was terrified. He announced that she would bear a son — a pure son, a sign for all of humanity.",
      },
      {
        type: "paragraph",
        text: "She retreated alone to give birth under a palm tree, in pain and bewilderment. She cried: 'I wish I had died before this and was in oblivion, forgotten.' Then a voice called to her: 'Do not grieve — your Lord has provided beneath you a stream. And shake toward you the trunk of the palm tree; it will drop upon you ripe, fresh dates.'",
      },
      {
        type: "highlight",
        text: "When she came back to her people with her newborn son and they accused her, she pointed to the baby. And the baby Isa (AS) spoke in the cradle — declaring he was a servant of Allah, that he had been given the Book, and that he was commanded to pray and give charity.",
      },
      {
        type: "hadith",
        text: "The Prophet ﷺ said: 'The best of the women of the people of Paradise are: Khadijah bint Khuwaylid, Fatimah bint Muhammad, Maryam bint Imran, and Asiyah the wife of Pharaoh.'",
        reference: "Ahmad",
      },
      {
        type: "highlight",
        text: "Lesson: Allah honours those who are pure in heart even when the world accuses them. Maryam's answer to slander was to point to a miracle — your answer to difficulty is to point to Allah.",
      },
    ],
  },
  {
    id: "man-two-gardens",
    categoryId: "quran-stories",
    title: "The Man with Two Gardens",
    subtitle: "A warning about arrogance and gratitude",
    arabicTitle: "صَاحِبُ الْجَنَّتَيْن",
    readTime: 4,
    tags: ["Gratitude", "Arrogance", "Warning"],
    content: [
      {
        type: "verse",
        text: "And present to them an example of two men: We granted to one of them two gardens of grapevines, and We bordered them with palm trees and placed between them crops.",
        arabic: "وَاضْرِبْ لَهُم مَّثَلًا رَّجُلَيْنِ جَعَلْنَا لِأَحَدِهِمَا جَنَّتَيْنِ مِنْ أَعْنَابٍ",
        reference: "Quran 18:32",
      },
      {
        type: "paragraph",
        text: "One man had two magnificent gardens — lush, productive and wealthy. He had great wealth and pride. His companion, who had less, kept reminding him: 'When you entered your garden, why did you not say: Masha Allah, la quwwata illa billah — What Allah wills; there is no power except in Allah?'",
      },
      {
        type: "verse",
        text: "And he entered his garden while he was unjust to himself. He said: I do not think that this will perish — ever. And I do not think the Hour will occur.",
        arabic: "وَدَخَلَ جَنَّتَهُ وَهُوَ ظَالِمٌ لِّنَفْسِهِ قَالَ مَا أَظُنُّ أَن تَبِيدَ هَٰذِهِ أَبَدًا",
        reference: "Quran 18:35",
      },
      {
        type: "paragraph",
        text: "His garden was destroyed overnight. All the wealth he had boasted about was reduced to ruin. He stood there wringing his hands in regret, saying: 'I wish I had not associated anyone with my Lord.' But it was too late.",
      },
      {
        type: "highlight",
        text: "Lesson: When blessed with wealth, health, beauty or success — say: 'Masha Allah, la quwwata illa billah.' It is the armour of gratitude that protects what you have been given.",
        arabic: "مَا شَاءَ اللهُ لَا قُوَّةَ إِلَّا بِاللهِ",
      },
    ],
  },

  // SEERAH
  {
    id: "seerah-character",
    categoryId: "seerah",
    title: "Before Prophethood — Al-Amin",
    subtitle: "The most trustworthy man in Makkah",
    arabicTitle: "الْأَمِين — قَبْلَ النُّبُوَّة",
    readTime: 4,
    tags: ["Character", "Trust", "Seerah"],
    content: [
      {
        type: "paragraph",
        text: "Long before the first revelation, Muhammad ibn Abdullah (ﷺ) was known throughout Makkah by a title: Al-Amin — The Trustworthy. In a city of merchants, trade disputes and tribal politics, he was the person everyone brought their disputes to. He was known for his honesty, his gentleness, and his care for the poor, the weak and the vulnerable.",
      },
      {
        type: "hadith",
        text: "When the Black Stone (Hajarul Aswad) was to be reinstalled after the rebuilding of the Ka'bah, the tribes nearly went to war over who would have the honour. They agreed to let the next man who walked through the gate decide. That man was Muhammad ﷺ. He placed the stone in his robe and asked a representative of each tribe to hold a corner — then he lifted it into place with his own blessed hands.",
        reference: "Ibn Hisham, Seerah",
      },
      {
        type: "highlight",
        text: "His character was the Quran: When Aisha (RA) was asked about the Prophet's character, she said: 'His character was the Quran.' He embodied every quality Allah praised in His Book.",
        arabic: "كَانَ خُلُقُهُ الْقُرْآن",
        reference: "Muslim",
      },
      {
        type: "highlight",
        text: "Lesson: Your character is your dawah. The Prophet ﷺ drew people to truth through who he was, long before he spoke a word of prophethood. Be trustworthy, be kind — be Al-Amin.",
      },
    ],
  },
  {
    id: "seerah-taif",
    categoryId: "seerah",
    title: "The Day of Ta'if",
    subtitle: "The worst day — and the most beautiful dua",
    arabicTitle: "يَوْمُ الطَّائِف",
    readTime: 5,
    tags: ["Patience", "Dua", "Mercy"],
    content: [
      {
        type: "paragraph",
        text: "After the Year of Grief — when the Prophet ﷺ lost both his beloved wife Khadijah and his uncle Abu Talib — he travelled to Ta'if seeking support for Islam. He was rejected. The leaders of Ta'if set street children and slaves to mock him and throw stones at him. He bled until his sandals were soaked in blood. He had to shelter in a garden.",
      },
      {
        type: "paragraph",
        text: "The Angel of the Mountains came to him and offered to bring the mountains crashing down on the people of Ta'if. The Prophet ﷺ refused. He said: 'I hope that Allah will bring forth from their descendants people who will worship Allah alone.'",
      },
      {
        type: "highlight",
        text: "Then, bleeding and exhausted, he raised his hands and made one of the most beautiful duas in human history.",
        arabic: "اللَّهُمَّ إِلَيْكَ أَشْكُو ضَعْفَ قُوَّتِي وَقِلَّةَ حِيلَتِي وَهَوَانِي عَلَى النَّاسِ",
      },
      {
        type: "hadith",
        text: "'O Allah, to You I complain of my weakness, my lack of resources and my humiliation before people. O Most Merciful, You are the Lord of the oppressed and You are my Lord. To whom will You leave me — to a distant stranger who will frown at me? Or to an enemy whom You have given power over me? If You are not angry with me, I do not care about anything — but Your pardon is more vast for me. I seek refuge in the light of Your face by which darknesses are illuminated and by which the affairs of this world and the Hereafter are rectified.'",
        reference: "Ibn Hisham, Seerah",
      },
      {
        type: "highlight",
        text: "Lesson: The Prophet ﷺ had every reason to feel hopeless — alone, injured, rejected. Instead he prayed. And years later, Ta'if became one of the most Muslim cities in Arabia. Your worst day is a prayer away from your greatest turning point.",
      },
    ],
  },
  {
    id: "seerah-kindness",
    categoryId: "seerah",
    title: "The Woman Who Threw Trash",
    subtitle: "Kindness in response to harm",
    arabicTitle: "الْمَرْأَةُ الَّتِي كَانَتْ تَقْذِفُ الْأَذَى",
    readTime: 3,
    tags: ["Kindness", "Character", "Forgiveness"],
    content: [
      {
        type: "paragraph",
        text: "There was a woman in Makkah who harboured such hatred for the Prophet ﷺ that she would throw garbage in his path every time he walked by. He never reacted with anger or complaint. He simply walked by, day after day.",
      },
      {
        type: "paragraph",
        text: "One day he passed and there was nothing. Concerned, he inquired about her. He was told she was ill. Rather than feel relief, the Prophet ﷺ went to her home to visit her. She was shocked. She had expected anger, perhaps revenge. Instead he came with kindness and concern. That act of grace was what finally opened her heart to Islam.",
      },
      {
        type: "hadith",
        text: "Aisha (RA) reported: 'The Prophet ﷺ was never indecent, never obscene, never loud in the markets. He would not repay evil with evil, but rather he would forgive and overlook.'",
        arabic: "لَمْ يَكُنِ النَّبِيُّ ﷺ فَاحِشًا وَلَا مُتَفَحِّشًا",
        reference: "Tirmidhi",
      },
      {
        type: "highlight",
        text: "Lesson: Returning harm with kindness is not weakness — it is the strength of those whose hearts are rooted in Allah. It is the Sunnah of the Prophet ﷺ, and it changes hearts.",
      },
    ],
  },
  {
    id: "seerah-farewell",
    categoryId: "seerah",
    title: "The Farewell Sermon",
    subtitle: "The Prophet's last message to humanity",
    arabicTitle: "خُطْبَةُ الْوَدَاع",
    readTime: 5,
    tags: ["Equality", "Rights", "Final Message"],
    content: [
      {
        type: "paragraph",
        text: "On the 9th of Dhul Hijjah, 10 AH, the Prophet Muhammad ﷺ stood on Mount Arafat before 100,000 companions and delivered his farewell sermon. He knew — and told his companions — that he would not be with them after this Hajj. His words on that day were not just for those present. They were for all of humanity.",
      },
      {
        type: "hadith",
        text: "He ﷺ said: 'O People, your blood, your property and your honour are sacred to one another, like the sanctity of this day, in this month, in this land. You will meet your Lord and He will ask you about your deeds. I have conveyed the message. O Allah, be my witness.'",
        arabic: "أَيُّهَا النَّاسُ إِنَّ دِمَاءَكُمْ وَأَمْوَالَكُمْ وَأَعْرَاضَكُمْ عَلَيْكُمْ حَرَامٌ",
        reference: "Bukhari & Muslim",
      },
      {
        type: "hadith",
        text: "'O People, there is no superiority of an Arab over a non-Arab, nor a non-Arab over an Arab; nor of a white person over a black person, nor a black person over a white person — except through taqwa (God-consciousness).'",
        arabic: "لَا فَضْلَ لِعَرَبِيٍّ عَلَىٰ أَعْجَمِيٍّ إِلَّا بِالتَّقْوَى",
        reference: "Ahmad",
      },
      {
        type: "verse",
        text: "Today I have perfected for you your religion and completed My favour upon you and have approved for you Islam as religion.",
        arabic: "الْيَوْمَ أَكْمَلْتُ لَكُمْ دِينَكُمْ وَأَتْمَمْتُ عَلَيْكُمْ نِعْمَتِي وَرَضِيتُ لَكُمُ الْإِسْلَامَ دِينًا",
        reference: "Quran 5:3",
      },
      {
        type: "highlight",
        text: "The Prophet ﷺ ended his sermon by asking: 'Have I conveyed the message?' The companions replied: 'Yes!' He said: 'O Allah, bear witness.' Then the above verse was revealed, and Umar (RA) wept — knowing that when a thing is perfected, it begins to diminish.",
      },
    ],
  },
];
