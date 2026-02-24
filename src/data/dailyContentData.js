// src/data/dailyContentData.js

export const dailyVerses = [
    {
        arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
        translation: "For indeed, with hardship [will be] ease.",
        reference: "Surah Ash-Sharh, 94:5"
    },
    {
        arabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ",
        translation: "And when My servants ask you concerning Me - indeed I am near.",
        reference: "Surah Al-Baqarah, 2:186"
    },
    {
        arabic: "وَمَا تَشَاءُونَ إِلَّا أَن يَشَاءَ اللَّهُ رَبُّ الْعَالَمِينَ",
        translation: "And you do not will except that Allah wills - Lord of the worlds.",
        reference: "Surah At-Takwir, 81:29"
    },
    {
        arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
        translation: "Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.",
        reference: "Surah Al-Baqarah, 2:201"
    },
    {
        arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ",
        translation: "So remember Me; I will remember you. And be grateful to Me and do not deny Me.",
        reference: "Surah Al-Baqarah, 2:152"
    },
    {
        arabic: "وَرَحْمَتِي وَسِعَتْ كُلَّ شَيْءٍ",
        translation: "But My mercy encompasses all things.",
        reference: "Surah Al-A'raf, 7:156"
    }
];

export const dailyHadiths = [
    {
        arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ",
        translation: "Actions are rewarded by intentions.",
        narrator: "Omar bin Al-Khattab",
        reference: "Sahih al-Bukhari 1"
    },
    {
        arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
        translation: "The best among you (Muslims) are those who learn the Qur'an and teach it.",
        narrator: "Uthman bin Affan",
        reference: "Sahih al-Bukhari 5027"
    },
    {
        arabic: "الدِّينُ النَّصِيحَةُ",
        translation: "Religion is sincerity (good advice).",
        narrator: "Tamim Ad-Dari",
        reference: "Sahih Muslim 55a"
    },
    {
        arabic: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ",
        translation: "A Muslim is the one from whose tongue and hands the Muslims are safe.",
        narrator: "Abdullah bin Amr",
        reference: "Sahih al-Bukhari 10"
    },
    {
        arabic: "كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ، ثَقِيلَتَانِ فِي الْمِيزَانِ، حَبِيبَتَانِ إِلَى الرَّحْمَنِ: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ",
        translation: "There are two expressions which are very easy for the tongue to say, but they are very heavy in the balance and are very dear to The Beneficent (Allah), and they are, 'Subhan Allah Al-[Azeem] and 'Subhan Allah wa bihamdihi.'",
        narrator: "Abu Huraira",
        reference: "Sahih al-Bukhari 6406"
    }
];

// Helper to get consistent daily content based on the current date
export const getDailyContent = () => {
    const today = new Date();
    // Use day of the year (1-365) to cycle through the arrays
    const start = new Date(today.getFullYear(), 0, 0);
    const diff = (today - start) + ((start.getTimezoneOffset() - today.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    const verseIndex = dayOfYear % dailyVerses.length;
    const hadithIndex = dayOfYear % dailyHadiths.length;

    return {
        verse: dailyVerses[verseIndex],
        hadith: dailyHadiths[hadithIndex]
    };
};
