export const DUA_CATEGORIES = [
    { id: 'morning_evening', title: 'Morning & Evening', icon: '🌅' },
    { id: 'salah_mosque', title: 'Salah & Mosque', icon: '🕌' },
    { id: 'daily_life', title: 'Daily Life', icon: '🏠' },
    { id: 'travel_protection', title: 'Travel & Protection', icon: '🛡️' }
];

export const DAILY_DUAS = [
    {
        id: 'waking_up',
        category: 'daily_life',
        title: 'Waking Up',
        arabic: 'الْحَمْدُ للهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
        transliteration: 'Alhamdu lillahil-ladhi ahyana ba\'da ma amatana wa-ilayhin-nushoor',
        translation: 'All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection.',
        reference: 'Al-Bukhari 11/113, Muslim 4/2083'
    },
    {
        id: 'sleeping',
        category: 'daily_life',
        title: 'Before Sleeping',
        arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
        transliteration: 'Bismikal-lahumma amootu wa-ahya',
        translation: 'In Your Name, O Allah, I die and I live.',
        reference: 'Al-Bukhari 11/113'
    },
    {
        id: 'reply_adhan',
        category: 'salah_mosque',
        title: 'Reply to the Adhan',
        description: 'Repeat what the Mu\'adhdhin says, except when he says (hayya \'alas-salah) and (hayya \'alal-falah). Instead say:',
        arabic: 'لا حَوْلَ وَلا قُوَّةَ إِلا بِالله',
        transliteration: 'La hawla wa la quwwata illa billah',
        translation: 'There is no might and no power except with Allah.',
        reference: 'Al-Bukhari 1/152, Muslim 1/288'
    },
    {
        id: 'after_adhan',
        category: 'salah_mosque',
        title: 'After the Adhan',
        arabic: 'اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ',
        transliteration: 'Allahumma Rabba hathihid-da\'watit-tammah, was-salatil-qa\'imah, ati Muhammadanil-waseelata wal-fadheelah, wab\'ath-hu maqaman mahmoodanil-lathee wa\'adtah',
        translation: 'O Allah, Lord of this perfect call and established prayer. Grant Muhammad the intercession and favor, and raise him to the honored station You have promised him.',
        reference: 'Al-Bukhari 1/152'
    },
    {
        id: 'entering_mosque',
        category: 'salah_mosque',
        title: 'Entering the Mosque',
        arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
        transliteration: 'Allahummaf-tah lee abwaba rahmatik',
        translation: 'O Allah, open the doors of Your mercy for me.',
        reference: 'Muslim 1/494'
    },
    {
        id: 'leaving_mosque',
        category: 'salah_mosque',
        title: 'Leaving the Mosque',
        arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
        transliteration: 'Allahumma innee as\'aluka min fadhlik',
        translation: 'O Allah, I ask You from Your favor.',
        reference: 'Muslim 1/494'
    },
    {
        id: 'after_wudu',
        category: 'salah_mosque',
        title: 'After Completing Wudu',
        arabic: 'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّداً عَبْدُهُ وَرَسُولُهُ. اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ',
        transliteration: 'Ashhadu an la ilaha illal-lahu wahdahu la shareeka lah, wa-ashhadu anna Muhammadan abduhu warasooluh. Allahummaj-alnee minat-tawwabeena waj-alnee minal-mutatahhireen',
        translation: 'I bear witness that none has the right to be worshipped but Allah alone, Who has no partner; and I bear witness that Muhammad is His slave and His Messenger. O Allah, make me among those who turn to You in repentance, and make me among those who are purified.',
        reference: 'Muslim 1/209, At-Tirmidhi 1/78'
    },
    {
        id: 'eating',
        category: 'daily_life',
        title: 'Before Eating',
        arabic: 'بِسْمِ اللَّهِ',
        transliteration: 'Bismillah',
        translation: 'In the name of Allah.',
        reference: 'Abu Dawud 3/347'
    },
    {
        id: 'eating_forgot',
        category: 'daily_life',
        title: 'If You Forget Bismillah Before Eating',
        arabic: 'بِسْمِ اللَّهِ فِي أَوَّلِهِ وَآخِرِهِ',
        transliteration: 'Bismillahi fee awwalihi wa-akhirih',
        translation: 'In the name of Allah, in its beginning and end.',
        reference: 'Abu Dawud 3/347'
    },
    {
        id: 'after_eating',
        category: 'daily_life',
        title: 'After Eating',
        arabic: 'الْحَمْدُ للهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
        transliteration: 'Alhamdu lillahil-lathee at\'amanee hatha warazaqaneehi min ghayri hawlin minnee wala quwwah',
        translation: 'All praise is to Allah Who has fed me this and provided it for me without any strength or power on my part.',
        reference: 'Abu Dawud, At-Tirmidhi'
    },
    {
        id: 'leaving_home',
        category: 'travel_protection',
        title: 'Leaving the Home',
        arabic: 'بِسْمِ اللهِ، تَوَكَّلْتُ عَلَى اللهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ',
        transliteration: 'Bismillahi tuwakkaltu \'alal-lahi wala hawla wala quwwata illa billah',
        translation: 'In the name of Allah, I place my trust in Allah, and there is no might nor power except with Allah.',
        reference: 'Abu Dawud 4/325, At-Tirmidhi 5/490'
    },
    {
        id: 'riding',
        category: 'travel_protection',
        title: 'Mounting a Vehicle/Traveling',
        arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ. وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
        transliteration: 'Subhanal-lathee sakhkhara lana hatha wama kunna lahu muqrineen. Wa-inna ila Rabbina lamunqaliboon',
        translation: 'Glory is to Him Who has provided this for us though we could never have had it by our efforts. Surely, unto our Lord we are returning.',
        reference: 'Quran 43:13-14'
    },
    {
        id: 'sayyidul_istighfar',
        category: 'morning_evening',
        title: 'The Best Supplication for Forgiveness (Sayyidul Istighfar)',
        arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
        transliteration: 'Allahumma anta Rabbee la ilaha illa anta, khalaqtanee wa-ana \'abduk, wa-ana \'ala \'ahdika wawa\'dika mastata\'t, a\'oothu bika min sharri ma sana\'t, aboo\'u laka bini\'matika \'alay, wa-aboo\'u bithanbee, faghfir lee fa-innahu la yaghfiruth-thunooba illa ant',
        translation: 'O Allah, You are my Lord, there is none worthy of worship but You. You created me and I am Your slave. I keep Your covenant, and my pledge to You so far as I am able. I seek refuge in You from the evil of what I have done. I admit to Your blessings upon me, and I admit to my misdeeds. Forgive me, for there is none who may forgive sins but You.',
        reference: 'Al-Bukhari 7/150'
    },
    {
        id: 'morning_evening_protection',
        category: 'morning_evening',
        title: 'Morning & Evening Protection',
        description: 'Recite 3 times in the morning and evening.',
        arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
        transliteration: 'Bismillahil-ladhi la yadurru ma\'as-mihi shai\'un fil-ardi wa la fis-sama\'i wa huwas-sami\'ul-\'alim',
        translation: 'In the name of Allah with whose name nothing can harm on earth or in heaven, and He is the All-Hearing, All-Knowing.',
        reference: 'Abu Dawud 4/323, At-Tirmidhi 5/465'
    },
    {
        id: 'morning_evening_sufficient',
        category: 'morning_evening',
        title: 'Sufficient against all distress',
        description: 'Recite 7 times in the morning and evening.',
        arabic: 'حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
        transliteration: 'Hasbiyallahu la ilaha illa Huwa \'alaihi tawakkaltu wa Huwa Rabbul-\'Arshil-\'Adheem',
        translation: 'Allah is sufficient for me. There is none worthy of worship but Him. I have placed my trust in Him, and He is the Lord of the Majestic Throne.',
        reference: 'Ibn As-Sunni, Abu Dawud 4/321'
    },
    {
        id: 'morning_evening_glorification',
        category: 'morning_evening',
        title: 'Glorification and Praise',
        description: 'Recite 100 times a day.',
        arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
        transliteration: 'SubhanAllahi wa bihamdihi',
        translation: 'Glory is to Allah and praise is to Him.',
        reference: 'Al-Bukhari 7/168, Muslim 4/2071'
    },
    {
        id: 'entering_bathroom',
        category: 'daily_life',
        title: 'Entering the Restroom',
        arabic: 'بِسْمِ اللَّهِ. اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبْثِ وَالْخَبَائِثِ',
        transliteration: 'Bismillahi. Allahumma inni a\'udhu bika minal-khubthi wal-khaba\'ith',
        translation: 'In the name of Allah. O Allah, I seek refuge in You from the male and female evil spirits.',
        reference: 'Al-Bukhari 1/45, Muslim 1/283'
    },
    {
        id: 'leaving_bathroom',
        category: 'daily_life',
        title: 'Leaving the Restroom',
        arabic: 'غُفْرَانَكَ',
        transliteration: 'Ghufranaka',
        translation: 'I seek Your forgiveness.',
        reference: 'Abu Dawud, Ibn Majah, At-Tirmidhi'
    },
    {
        id: 'wearing_clothes',
        category: 'daily_life',
        title: 'Wearing Clothes',
        arabic: 'الْحَمْدُ للهِ الَّذِي كَسَانِي هَذَا (الثَّوْبَ) وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
        transliteration: 'Alhamdu lillahil-ladhi kasani hadha (ath-thawba) wa razaqanihi min ghayri hawlin minni wa la quwwah',
        translation: 'All praise is due to Allah Who has clothed me with this (garment) and provided it for me, with no power or might from myself.',
        reference: 'Abu Dawud, Ibn Majah, At-Tirmidhi'
    }
];
