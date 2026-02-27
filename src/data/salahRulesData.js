// src/data/salahRulesData.js
export const PRAYER_RAKATS = [
    { name: 'Fajr', arabic: 'الفجر', sunnah: 2, fard: 2, total: 4, time: 'Dawn until sunrise' },
    { name: 'Dhuhr', arabic: 'الظهر', sunnahBefore: 4, fard: 4, sunnahAfter: 2, total: 10, time: 'After zenith until Asr' },
    { name: 'Asr', arabic: 'العصر', sunnah: 4, fard: 4, optional: true, total: 8, time: 'Mid-afternoon until sunset' },
    { name: 'Maghrib', arabic: 'المغرب', fard: 3, sunnahAfter: 2, total: 5, time: 'After sunset until twilight fades' },
    { name: 'Isha', arabic: 'العشاء', sunnahBefore: 4, fard: 4, sunnahAfter: 2, witr: 3, total: 13, time: 'After twilight until midnight' },
];

export const CONDITIONS = [
    { title: 'Islam', description: 'Being a Muslim' },
    { title: 'Sanity', description: 'Being of sound mind' },
    { title: 'Puberty', description: 'Having reached the age of maturity' },
    { title: 'Purity', description: 'Being free from major and minor impurities (Wudu/Ghusl)' },
    { title: 'Covering Awrah', description: 'Appropriate covering for men and women' },
    { title: 'Facing Qiblah', description: 'Facing the direction of the Kaaba' },
    { title: 'Intention (Niyyah)', description: 'Making sincere intention for the specific prayer' },
    { title: 'Time', description: 'Prayer must be performed within its prescribed time' },
];

export const PILLARS = [
    { title: 'Standing (Qiyam)', description: 'Standing upright if able' },
    { title: 'Opening Takbir', description: 'Saying "Allahu Akbar" to begin' },
    { title: 'Reciting Al-Fatiha', description: 'Reciting Surah Al-Fatiha in every rakat' },
    { title: 'Bowing (Ruku)', description: 'Bowing with hands on knees' },
    { title: 'Rising from Ruku', description: 'Standing upright after bowing' },
    { title: 'Prostration (Sujud)', description: 'Prostrating twice in each rakat' },
    { title: 'Sitting between Sujud', description: 'Brief sitting between the two prostrations' },
    { title: 'Final Tashahhud', description: 'Sitting and reciting the testimony of faith' },
    { title: 'Salawat upon Prophet ﷺ', description: 'Sending blessings in final tashahhud' },
    { title: 'Taslim', description: 'Saying "As-salamu alaykum wa rahmatullah" to end' },
    { title: 'Tranquility', description: 'Performing each action calmly without rushing' },
    { title: 'Order', description: 'Performing actions in the correct sequence' },
];

export const INVALIDATORS = [
    { title: 'Speaking intentionally', description: 'Talking about worldly matters during prayer' },
    { title: 'Eating or drinking', description: 'Consuming food or drink while praying' },
    { title: 'Excessive movement', description: 'Unnecessary excessive movements' },
    { title: 'Breaking Wudu', description: 'Losing ablution state' },
    { title: 'Turning away from Qiblah', description: 'Completely turning away from the prayer direction' },
    { title: 'Laughing aloud', description: 'Laughing loudly during prayer' },
    { title: 'Intentionally leaving a pillar', description: 'Skipping an essential part' },
    { title: 'Uncovering Awrah', description: 'Exposing parts that must be covered' },
];

export const SUNNAH_ACTS = [
    { title: 'Opening supplication', description: 'Dua after opening takbir' },
    { title: 'Seeking refuge', description: 'Saying "A\'udhu billahi min ash-shaytan ir-rajim"' },
    { title: 'Saying Ameen', description: 'After Surah Al-Fatiha' },
    { title: 'Surah after Fatiha', description: 'Reciting additional Quran in first two rakats' },
    { title: 'Dhikr in Ruku', description: 'Saying "Subhana Rabbiyal Adhim"' },
    { title: 'Dhikr in Sujud', description: 'Saying "Subhana Rabbiyal A\'la"' },
    { title: 'Raising hands', description: 'At opening takbir, before ruku, and rising from it' },
    { title: 'Placing right hand over left', description: 'During standing positions' },
];

export const SALAH_DUAS = [
    {
        position: 'Opening (Sana - Hanafi/Hanbali)',
        arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَى جَدُّكَ وَلَا إِلَهَ غَيْرُكَ',
        transliteration: 'Subhanaka Allahumma wa bihamdika, wa tabarakasmuka, wa ta\'ala jadduka, wa la ilaha ghairuk',
        meaning: 'Glory be to You O Allah, and praise be to You. Blessed is Your name, exalted is Your majesty, and there is no god but You.',
        when: 'After opening Takbir',
    },
    {
        position: 'Opening (Sana - Shafi\'i)',
        arabic: 'وَجَّهْتُ وَجْهِيَ لِلَّذِي فَطَرَ السَّمَاوَاتِ وَالْأَرْضَ حَنِيفًا، وَمَا أَنَا مِنَ الْمُشْرِكِينَ، إِنَّ صَلَاتِي وَنُسُكِي وَمَحْيَايَ وَمَمَاتِي لِلَّهِ رَبِّ الْعَالَمِينَ، لَا شَرِيكَ لَهُ، وَبِذَلِكَ أُمِرْتُ وَأَنَا مِنَ الْمُسْلِمِينَ',
        transliteration: 'Wajjahtu wajhiya lilladhi fataras-samawati wal-arda hanifan, wa ma ana minal-mushrikin. Inna salati wa nusuki wa mahyaya wa mamati lillahi rabbil-\'alamin. La sharika lahu wa bidhalika umirtu wa ana minal-muslimin.',
        meaning: 'I have turned my face towards the One who created the heavens and the earth, inclining towards truth, and I am not of the polytheists. Indeed, my prayer, my rites of sacrifice, my living and my dying are for Allah, Lord of the worlds. No partner has He. And this I have been commanded, and I am of the Muslims.',
        when: 'After opening Takbir',
    },
    {
        position: 'Seeking Refuge (Ta\'awwudh)',
        arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
        transliteration: 'A\'udhu billahi min ash-shaytanir-rajim',
        meaning: 'I seek refuge in Allah from the accursed Satan.',
        when: 'Before Bismillah, every rakat (silently)',
    },
    {
        position: 'Basmala',
        arabic: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
        transliteration: 'Bismillahir-Rahmanir-Rahim',
        meaning: 'In the name of Allah, the Most Gracious, the Most Merciful.',
        when: 'Before Surah Al-Fatiha',
    },
    {
        position: 'After Fatiha',
        arabic: 'آمِين',
        transliteration: 'Ameen',
        meaning: 'O Allah, accept (our supplication).',
        when: 'After "walad-dallin" in Fatiha',
    },
    {
        position: 'Going to Ruku',
        arabic: 'اللَّهُ أَكْبَرُ',
        transliteration: 'Allahu Akbar',
        meaning: 'Allah is the Greatest.',
        when: 'While bending for Ruku',
    },
    {
        position: 'In Ruku',
        arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
        transliteration: 'Subhana Rabbiyal Azeem',
        meaning: 'Glory be to my Lord, the Magnificent.',
        when: 'Recite 3 times minimum in Ruku',
    },
    {
        position: 'Rising from Ruku',
        arabic: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ',
        transliteration: 'Sami\'Allahu liman hamidah',
        meaning: 'Allah hears whoever praises Him.',
        when: 'While rising from Ruku',
    },
    {
        position: 'Standing after Ruku',
        arabic: 'رَبَّنَا وَلَكَ الْحَمْدُ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ',
        transliteration: 'Rabbana wa lakal hamd, hamdan kathiran tayyiban mubarakan fih',
        meaning: 'Our Lord, to You belongs all praise, abundant, pure, and blessed.',
        when: 'After standing upright from Ruku',
    },
    {
        position: 'Going to Sujud',
        arabic: 'اللَّهُ أَكْبَرُ',
        transliteration: 'Allahu Akbar',
        meaning: 'Allah is the Greatest.',
        when: 'While going down for Sujud',
    },
    {
        position: 'In Sujud',
        arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
        transliteration: 'Subhana Rabbiyal A\'la',
        meaning: 'Glory be to my Lord, the Most High.',
        when: 'Recite 3 times minimum in Sujud',
    },
    {
        position: 'Between Two Sujud',
        arabic: 'رَبِّ اغْفِرْ لِي وَارْحَمْنِي وَاهْدِنِي وَعَافِنِي وَارْزُقْنِي',
        transliteration: 'Rabbighfirli, warhamni, wahdini, wa\'afini, warzuqni',
        meaning: 'My Lord, forgive me, have mercy on me, guide me, grant me well-being, and provide for me.',
        when: 'Sitting between the two prostrations',
    },
    {
        position: 'Tashahhud (Ibn Mas\'ud - Hanafi/Hanbali)',
        arabic: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
        transliteration: 'At-tahiyyatu lillahi was-salawatu wat-tayyibat. As-salamu \'alayka ayyuhan-nabiyyu wa rahmatullahi wa barakatuh. As-salamu \'alayna wa \'ala \'ibadillahis-salihin. Ash-hadu alla ilaha illallah, wa ash-hadu anna Muhammadan \'abduhu wa rasuluh',
        meaning: 'All greetings, prayers and good things are for Allah. Peace be upon you, O Prophet, and the mercy of Allah and His blessings. Peace be upon us and upon the righteous servants of Allah. I bear witness that there is no god but Allah, and I bear witness that Muhammad is His servant and messenger.',
        when: 'First and final sitting (Tashahhud)',
    },
    {
        position: 'Tashahhud (Ibn Abbas - Shafi\'i/Maliki)',
        arabic: 'التَّحِيَّاتُ الْمُبَارَكَاتُ الصَّلَوَاتُ الطَّيِّبَاتُ لِلَّهِ، السَّلاَمُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلاَمُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ',
        transliteration: 'At-tahiyyatul mubarakatush-shalawatut-tayyibatu lillah. As-salamu \'alayka ayyuhan-nabiyyu wa rahmatullahi wa barakatuh. As-salamu \'alayna wa \'ala \'ibadillahis-salihin. Ash-hadu alla ilaha illallah, wa ash-hadu anna Muhammadan rasulullah',
        meaning: 'All blessed greetings, prayers and good things are for Allah. Peace be upon you, O Prophet, and the mercy of Allah and His blessings. Peace be upon us and upon the righteous servants of Allah. I bear witness that there is no god but Allah, and I bear witness that Muhammad is the messenger of Allah.',
        when: 'First and final sitting (Tashahhud)',
    },
    {
        position: 'Salawat (Durood Ibrahim)',
        arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
        transliteration: 'Allahumma salli \'ala Muhammad wa \'ala ali Muhammad, kama sallaita \'ala Ibrahim wa \'ala ali Ibrahim, innaka Hamidun Majid. Allahumma barik \'ala Muhammad wa \'ala ali Muhammad, kama barakta \'ala Ibrahim wa \'ala ali Ibrahim, innaka Hamidun Majid',
        meaning: 'O Allah, send prayers upon Muhammad and upon the family of Muhammad, as You sent prayers upon Ibrahim and the family of Ibrahim. You are Praiseworthy, Glorious. O Allah, bless Muhammad and the family of Muhammad, as You blessed Ibrahim and the family of Ibrahim. You are Praiseworthy, Glorious.',
        when: 'After Tashahhud in final sitting',
    },
    {
        position: 'Before Salam (Dua)',
        arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ جَهَنَّمَ، وَمِنْ عَذَابِ الْقَبْرِ، وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ، وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ',
        transliteration: 'Allahumma inni a\'udhu bika min \'adhabi jahannam, wa min \'adhabil-qabr, wa min fitnatil-mahya wal-mamat, wa min sharri fitnatil-masihid-dajjal',
        meaning: 'O Allah, I seek refuge in You from the punishment of Hell, from the punishment of the grave, from the trials of life and death, and from the evil of the trial of the False Messiah.',
        when: 'Before Salam (recommended)',
    },
    {
        position: 'Salam (Taslim)',
        arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ',
        transliteration: 'As-salamu \'alaykum wa rahmatullah',
        meaning: 'Peace be upon you and the mercy of Allah.',
        when: 'Turning right then left to end prayer',
    },
];

export const RAKAT_RULES = [
    {
        rakat: 'Rakat 1',
        recitation: ['Sana (Opening Dua)', 'Ta\'awwudh', 'Bismillah', 'Surah Al-Fatiha', 'Any Surah/Ayat'],
        notes: 'Full recitation with additional surah. Recite audibly in Fajr, Maghrib, Isha (Fard); silently in Dhuhr, Asr.',
    },
    {
        rakat: 'Rakat 2',
        recitation: ['Bismillah', 'Surah Al-Fatiha', 'Any Surah/Ayat'],
        notes: 'Same as Rakat 1 but without opening Sana. Sit for Tashahhud after this in 2-rakat prayers.',
    },
    {
        rakat: 'Rakat 3',
        recitation: ['Bismillah', 'Surah Al-Fatiha only (Hanafi)', 'OR Fatiha + Surah (Shafi\'i)'],
        notes: 'In 3 or 4 rakat prayers. Hanafi: only Fatiha. Shafi\'i: can add surah for some voluntary prayers. Fard is always Fatiha only. Recite silently.',
    },
    {
        rakat: 'Rakat 4',
        recitation: ['Bismillah', 'Surah Al-Fatiha only'],
        notes: 'Same as Rakat 3. Final sitting with full Tashahhud + Durood + Dua before Salam.',
    },
];

export const VOLUNTARY_PRAYERS = [
    {
        name: 'Ishraq',
        arabic: 'الإشراق',
        rakats: '2 Rakats',
        time: '15-20 minutes after sunrise',
        guideline: 'Performed after the sun has fully risen. A great reward is mentioned for those who stay in their place after Fajr until Ishraq time.'
    },
    {
        name: 'Duha (Chasht)',
        arabic: 'الضحى',
        rakats: '2 to 12 Rakats',
        time: 'After Ishraq until before Zawal (noon)',
        guideline: 'Best performed when the sun\'s heat becomes intense. At least 2 rakats should be performed regularly.'
    },
    {
        name: 'Awwabin',
        arabic: 'الأوابين',
        rakats: '6 Rakats',
        time: 'Between Maghrib and Isha',
        guideline: 'Usually performed in sets of 2 rakats each. It is highly recommended to engage in worship during this time.'
    },
    {
        name: 'Tahajjud',
        arabic: 'تهجد',
        rakats: '2 to 12 Rakats',
        time: 'After Isha until Fajr (best in last 3rd)',
        guideline: 'The most virtuous of voluntary prayers. Ideally performed after waking up from sleep in the middle of the night.'
    }
];

export const WITR_INFO = {
    basics: {
        hanafi: [
            { label: 'Status', value: 'Wajib (Obligatory)' },
            { label: 'Time', value: 'After Isha until Fajr' },
            { label: 'Rakats', value: '3 Rakats connected' },
        ],
        others: [
            { label: 'Status', value: 'Sunnah Muakkadah (Highly Recommended)' },
            { label: 'Time', value: 'After Isha until Fajr' },
            { label: 'Rakats', value: 'Odd number (1, 3, 5, etc.)' },
        ]
    },
    methods: {
        hanafi: [
            {
                name: 'Hanafi Method (3 Connected Rakats)',
                steps: [
                    'Perform 2 rakats as usual, sit for first Tashahhud.',
                    'Stand for 3rd rakat, recite Fatiha + additional Surah.',
                    'Say "Allahu Akbar" and raise hands to ears before bowing.',
                    'Recite Dua Qunut (silently).',
                    'Bow and complete prayer as usual.'
                ]
            }
        ],
        others: [
            {
                name: 'Method 1: Two + One (Preferred in Shafi\'i & Hanbali)',
                steps: [
                    'Perform 2 rakats and end with Taslim.',
                    'Stand for a separate 1 rakat.',
                    'Recite Fatiha + Surah (usually Al-Ikhlas).',
                    'Recite Qunut after Ruku (or before, depending on specific madhhab preferences).',
                    'Bow/Prostrate and complete with Taslim.'
                ]
            },
            {
                name: 'Method 2: One Single Rakat',
                steps: [
                    'Pray a single rakat individually.',
                    'Recite Fatiha + Surah.',
                    'Perform Qunut, complete Ruku, Sujud, and end with Taslim.'
                ]
            },
            {
                name: 'Method 3: Three Continuous Rakats',
                steps: [
                    'Pray 3 rakats continuously without sitting for Tashahhud in the 2nd rakat (unlike Maghrib).',
                    'Do not perform an extra Takbir before Qunut in the 3rd rakat.',
                    'Sit for the final Tashahhud after the 3rd rakat and end with Taslim.'
                ]
            }
        ]
    },
    qunutDua: {
        arabic: 'اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ، وَعَافِنِي فِيمَنْ عَافَيْتَ، وَتَوَلَّنِي فِيمَنْ تَوَلَّيْتَ، وَبَارِكْ لِي فِيمَا أَعْطَيْتَ، وَقِنِي شَرَّ مَا قَضَيْتَ، فَإِنَّكَ تَقْضِي وَلَا يُقْضَى عَلَيْكَ، وَإِنَّهُ لَا يَذِلُّ مَنْ وَالَيْتَ، تَبَارَكَ رَبَّنَا وَتَعَالَيْتَ',
        transliteration: 'Allahumma ihdini fiman hadayt, wa \'afini fiman \'afayt, wa tawallani fiman tawallayt, wa barik li fima a\'tayt, wa qini sharra ma qadayt, fa innaka taqdi wa la yuqda \'alayk, wa innahu la yadhillu man walayt, tabaraka Rabbana wa ta\'alayt',
        meaning: 'O Allah, guide me among those You have guided, grant me well-being among those You have granted well-being, take me into Your care among those You have taken into Your care, bless me in what You have given, and protect me from the evil of what You have decreed. For indeed, You decree and none can decree over You. Indeed, he whom You take as a friend is not humiliated. Blessed are You, our Lord, and Exalted.',
    },
    qunutHanafi: {
        arabic: 'اللَّهُمَّ إِنَّا نَسْتَعِينُكَ وَنَسْتَغْفِرُكَ وَنُؤْمِنُ بِكَ وَنَتَوَكَّلُ عَلَيْكَ وَنُثْنِي عَلَيْكَ الْخَيْرَ، وَنَشْكُرُكَ وَلَا نَكْفُرُكَ، وَنَخْلَعُ وَنَتْرُكُ مَنْ يَفْجُرُكَ. اللَّهُمَّ إِيَّاكَ نَعْبُدُ وَلَكَ نُصَلِّي وَنَسْجُدُ، وَإِلَيْكَ نَسْعَى وَنَحْفِدُ، نَرْجُو رَحْمَتَكَ وَنَخْشَى عَذَابَكَ، إِنَّ عَذَابَكَ بِالْكُفَّارِ مُلْحَقٌ',
        transliteration: 'Allahumma inna nasta\'inuka wa nastaghfiruka wa nu\'minu bika wa natawakkalu \'alayka wa nuthni \'alaykal-khayr. Wa nashkuruka wa la nakfuruka wa nakhla\'u wa natruku man yafjuruk. Allahumma iyyaka na\'budu wa laka nusalli wa nasjud, wa ilayka nas\'a wa nahfid. Narju rahmataka wa nakhsha \'adhabaka, inna \'adhabaka bil-kuffari mulhaq.',
        meaning: 'O Allah, we seek Your help, we seek Your forgiveness, we believe in You, we rely on You, and we praise You with all goodness. We thank You and are not ungrateful to You, and we reject and abandon whoever disobeys You. O Allah, You alone we worship, to You we pray and prostrate, to You we strive and hasten. We hope for Your mercy and fear Your punishment. Indeed, Your punishment will overtake the disbelievers.',
    }
};

export const SPECIAL_PRAYERS = {
    janazah: {
        title: 'Funeral Prayer (Salat al-Janazah)',
        arabic: 'صلاة الجنازة',
        intro: 'A collective obligation (Fard Kifayah) performed in congregation for a deceased Muslim. It is performed entirely standing, with no Ruku or Sujud.',
        conditions: [
            'Requires Wudu and facing Qiblah.',
            'The body of the deceased must be washed, shrouded, and placed in front of the congregation.',
            'There is no Adhan or Iqamah.',
        ],
        steps: [
            {
                takbir: '1st Takbir',
                action: 'Say "Allahu Akbar" and recite Surah Al-Fatiha.',
                hanafiAction: 'Say "Allahu Akbar" and recite Sana (Subhanaka...) and then Surah Al-Fatiha.'
            },
            {
                takbir: '2nd Takbir',
                action: 'Say "Allahu Akbar" and recite Durood Ibrahim (same as in Tashahhud).'
            },
            {
                takbir: '3rd Takbir',
                action: 'Say "Allahu Akbar" and make sincere Dua for the deceased.',
                duaArabic: 'اللَّهُمَّ اغْفِرْ لِحَيِّنَا وَمَيِّتِنَا وَشَاهِدِنَا وَغَائِبِنَا وَصَغِيرِنَا وَكَبِيرِنَا وَذَكَرِنَا وَأُنْثَانَا',
                duaTransliteration: 'Allahummaghfir lihayyina wa mayyitina wa shahidina wa gha\'ibina wa saghirina wa kabirina wa dhakarina wa unthana.',
                duaMeaning: 'O Allah, forgive our living and our dead, those present and those absent, our young and our old, our males and our females.'
            },
            {
                takbir: '4th Takbir',
                action: 'Say "Allahu Akbar", pause briefly, and perform Taslim (Salam) to end the prayer.'
            }
        ]
    },
    eid: {
        title: 'Eid Prayer (Salat al-Eid)',
        arabic: 'صلاة العيد',
        intro: 'Performed on the mornings of Eid al-Fitr and Eid al-Adha in congregation. It consists of 2 rakats with extra Takbirs. A khutbah (sermon) is delivered after the prayer.',
        sunnahs: [
            'Taking a ghusl (bath) before the prayer.',
            'Wearing one\'s best clothes.',
            'Eating an odd number of dates before Eid al-Fitr prayer.',
            'Going to the prayer by one route and returning by another.',
            'Reciting Takbirat during the journey to the prayer ground.',
        ],
        madhhabDetails: {
            hanafi: {
                rakat1: 'After opening Takbir and Sana, Imam says 3 extra Takbirs (raising hands). Then recites Fatiha and a Surah.',
                rakat2: 'After Fatiha and Surah, Imam says 3 extra Takbirs (raising hands) before the Takbir to go into Ruku.'
            },
            shafii: {
                rakat1: 'After opening Takbir, Imam says 7 extra Takbirs. Then recites Fatiha and a Surah.',
                rakat2: 'After the Takbir of standing up, Imam says 5 extra Takbirs. Then recites Fatiha and a Surah.'
            },
            malikiHanbali: {
                rakat1: 'After opening Takbir, 6 extra Takbirs (Hanbali: 6/Maliki: 6 depending on specific counts with the opening).',
                rakat2: 'After standing up, 5 extra Takbirs before recitation.'
            }
        },
        takbirTashreeq: {
            arabic: 'اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ، لَا إِلَهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، وَلِلَّهِ الْحَمْدُ',
            transliteration: 'Allahu Akbar, Allahu Akbar, La ilaha illallah, Wallahu Akbar, Allahu Akbar, wa lillahil hamd',
            meaning: 'Allah is the Greatest, Allah is the Greatest. There is no deity but Allah. Allah is the Greatest, Allah is the Greatest, and all praise is due to Allah.'
        }
    },
    travel: {
        title: 'Traveler\'s Prayer (Safar / Qasr)',
        arabic: 'صلاة المسافر',
        intro: 'Islam provides concessions for travelers, allowing them to shorten (Qasr) and sometimes combine (Jam\') their prayers to ease their journey.',
        conditions: {
            distance: {
                hanafi: 'Approximately 77-88 km (48-55 miles).',
                majority: 'Approximately 80 km (48 miles).'
            },
            duration: {
                hanafi: 'Intending to stay less than 15 days at the destination.',
                majority: 'Intending to stay 4 days or less at the destination.'
            }
        },
        qasrRules: [
            'Only 4-rakat prayers (Dhuhr, Asr, Isha) are shortened to 2 rakats.',
            'Fajr remains 2 rakats. Maghrib remains 3 rakats.',
            'Hanafi madhhab considers shortening obligatory (Wajib) for a valid traveler.',
            'Other madhhabs consider it highly recommended (Sunnah Muakkadah) or an allowed concession (Rukhsah).'
        ],
        jamRules: {
            allowed: 'Combining prayers (Jam\') is generally allowed in the Shafi\'i, Maliki, and Hanbali madhhabs during travel.',
            hanafiNote: 'In the Hanafi madhhab, physically combining prayers outside of Hajj is generally not permitted; instead, one prays the first at its latest time and the second at its earliest time (Apparent Combining / Jam\' as-Suri).',
            combinations: 'Dhuhr can be combined with Asr. Maghrib can be combined with Isha. Fajr cannot be combined with any prayer.'
        }
    }
};
