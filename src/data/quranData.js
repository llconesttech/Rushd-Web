// Complete Quran data extracted from legacy GlobalQuran project
// This includes all available translations, reciters, and Quran scripts

export const API_BASE_URL = 'https://api.globalquran.com';
export const AUDIO_BASE_URL = 'https://audio.globalquran.com';

// All available languages
export const languageList = {
    "af": { "english_name": "Afrikaans", "native_name": "", "dir": "left" },
    "am": { "english_name": "Amharic", "native_name": "አማርኛ", "dir": "left" },
    "ar": { "english_name": "Arabic", "native_name": "العربية", "dir": "right" },
    "az": { "english_name": "Azerbaijani", "native_name": "Азәрбајҹан", "dir": "left" },
    "bg": { "english_name": "Bulgarian", "native_name": "български", "dir": "left" },
    "bn": { "english_name": "Bengali", "native_name": "বাংলা", "dir": "left" },
    "bs": { "english_name": "Bosnian", "native_name": "bosanski", "dir": "left" },
    "cs": { "english_name": "Czech", "native_name": "čeština", "dir": "left" },
    "de": { "english_name": "German", "native_name": "Deutsch", "dir": "left" },
    "dv": { "english_name": "Divehi", "native_name": "ދިވެހިބަސް", "dir": "right" },
    "en": { "english_name": "English", "native_name": "English", "dir": "left" },
    "es": { "english_name": "Spanish", "native_name": "español", "dir": "left" },
    "fa": { "english_name": "Persian", "native_name": "فارسی", "dir": "right" },
    "fr": { "english_name": "French", "native_name": "français", "dir": "left" },
    "ha": { "english_name": "Hausa", "native_name": "ḥawsa", "dir": "left" },
    "hi": { "english_name": "Hindi", "native_name": "हिन्दी", "dir": "left" },
    "id": { "english_name": "Indonesian", "native_name": "Bahasa Indonesia", "dir": "left" },
    "it": { "english_name": "Italian", "native_name": "italiano", "dir": "left" },
    "ja": { "english_name": "Japanese", "native_name": "日本語", "dir": "left" },
    "ko": { "english_name": "Korean", "native_name": "한국어", "dir": "left" },
    "ku": { "english_name": "Kurdish", "native_name": "کوردی", "dir": "right" },
    "ml": { "english_name": "Malayalam", "native_name": "മലയാളം", "dir": "left" },
    "ms": { "english_name": "Malay", "native_name": "Bahasa Melayu", "dir": "left" },
    "nl": { "english_name": "Dutch", "native_name": "Nederlands", "dir": "left" },
    "no": { "english_name": "Norwegian", "native_name": "norsk", "dir": "left" },
    "pl": { "english_name": "Polish", "native_name": "polski", "dir": "left" },
    "pt": { "english_name": "Portuguese", "native_name": "português", "dir": "left" },
    "ro": { "english_name": "Romanian", "native_name": "română", "dir": "left" },
    "ru": { "english_name": "Russian", "native_name": "русский", "dir": "left" },
    "sd": { "english_name": "Sindhi", "native_name": "سنڌي", "dir": "right" },
    "so": { "english_name": "Somali", "native_name": "Soomaali", "dir": "left" },
    "sq": { "english_name": "Albanian", "native_name": "shqipe", "dir": "left" },
    "sv": { "english_name": "Swedish", "native_name": "svenska", "dir": "left" },
    "sw": { "english_name": "Swahili", "native_name": "Kiswahili", "dir": "left" },
    "ta": { "english_name": "Tamil", "native_name": "தமிழ்", "dir": "left" },
    "tg": { "english_name": "Tajik", "native_name": "Оятӣ", "dir": "left" },
    "th": { "english_name": "Thai", "native_name": "ไทย", "dir": "left" },
    "tr": { "english_name": "Turkish", "native_name": "Türkçe", "dir": "left" },
    "tt": { "english_name": "Tatar", "native_name": "татарча", "dir": "left" },
    "ug": { "english_name": "Uyghur", "native_name": "ئۇيغۇرچە", "dir": "right" },
    "uk": { "english_name": "Ukrainian", "native_name": "українська", "dir": "left" },
    "ur": { "english_name": "Urdu", "native_name": "اردو", "dir": "right" },
    "uz": { "english_name": "Uzbek", "native_name": "o'zbek", "dir": "left" },
    "zh": { "english_name": "Chinese", "native_name": "中文", "dir": "left" }
};

// Quran Scripts (Arabic text styles)
export const quranScripts = {
    "quran-wordbyword": { "english_name": "Word By Word", "native_name": "كلمة بكلمة", "type": "quran" },
    "quran-uthmani": { "english_name": "Uthmani", "native_name": "", "type": "quran" },
    "quran-uthmani-min": { "english_name": "Uthmani Minimal", "native_name": "", "type": "quran" },
    "quran-kids": { "english_name": "Kids", "native_name": "الاطفال", "type": "quran" },
    "quran-tajweed": { "english_name": "Tajweed", "native_name": "التجويد", "type": "quran" },
    "quran-simple": { "english_name": "Simple", "native_name": "", "type": "quran" },
    "quran-simple-clean": { "english_name": "Simple Clean", "native_name": "", "type": "quran" },
    "quran-simple-enhanced": { "english_name": "Simple Enhanced", "native_name": "", "type": "quran" },
    "quran-simple-min": { "english_name": "Simple Minimal", "native_name": "", "type": "quran" }
};

// All available translations organized by language
export const translations = {
    // Arabic Tafsir
    "ar.muyassar": { "language_code": "ar", "english_name": "King Fahad Quran Complex", "native_name": "تفسير الميسر", "type": "tafsir" },
    "ar.jalalayn": { "language_code": "ar", "english_name": "Jalal ad-Din al-Mahalli and Jalal ad-Din as-Suyuti", "native_name": "تفسير الجلالين", "type": "tafsir" },

    // Azerbaijani
    "az.mammadaliyev": { "language_code": "az", "english_name": "Vasim Mammadaliyev and Ziya Bunyadov", "native_name": "Məmmədəliyev & Bünyadov", "type": "translation" },
    "az.musayev": { "language_code": "az", "english_name": "Alikhan Musayev", "native_name": "", "type": "translation" },

    // Bengali
    "bn.bengali": { "language_code": "bn", "english_name": "Maulana Muhiuddin Khan", "native_name": "মুহিউদ্দীন খান", "type": "translation" },

    // Bosnian
    "bs.korkut": { "language_code": "bs", "english_name": "Korkut", "native_name": "Besim Korkut", "type": "translation" },
    "bs.mlivo": { "language_code": "bs", "english_name": "Mustafa Mlivo", "native_name": "Mlivo", "type": "translation" },

    // Bulgarian
    "bg.theophanov": { "language_code": "bg", "english_name": "Tzvetan Theophanov", "native_name": "Теофанов", "type": "translation" },

    // Czech
    "cs.hrbek": { "language_code": "cs", "english_name": "Preklad I. Hrbek", "native_name": "", "type": "translation" },
    "cs.nykl": { "language_code": "cs", "english_name": "A. R. Nykl", "native_name": "", "type": "translation" },

    // German
    "de.aburida": { "language_code": "de", "english_name": "Abu Rida Muhammad ibn Ahmad ibn Rassoul", "native_name": "", "type": "translation" },
    "de.bubenheim": { "language_code": "de", "english_name": "Sheikh A. S. F. Bubenheim and Dr. N. Elyas", "native_name": "", "type": "translation" },
    "de.khoury": { "language_code": "de", "english_name": "Adel Theodor Khoury", "native_name": "", "type": "translation" },
    "de.zaidan": { "language_code": "de", "english_name": "Amir Zaidan", "native_name": "", "type": "translation" },

    // Divehi
    "dv.divehi": { "language_code": "dv", "english_name": "Office of the President of Maldives", "native_name": "ދިވެހި", "type": "translation" },

    // English
    "en.sahih": { "language_code": "en", "english_name": "Sahih International", "native_name": "", "type": "translation" },
    "en.arberry": { "language_code": "en", "english_name": "A. J. Arberry", "native_name": "", "type": "translation" },
    "en.asad": { "language_code": "en", "english_name": "Muhammad Asad", "native_name": "", "type": "translation" },
    "en.daryabadi": { "language_code": "en", "english_name": "Abdul Majid Daryabadi", "native_name": "", "type": "translation" },
    "en.hilali": { "language_code": "en", "english_name": "Dr. Muhammad Taqi-ud-Din al-Hilali and Dr. Muhammad Muhsin Khan", "native_name": "", "type": "translation" },
    "en.pickthall": { "language_code": "en", "english_name": "Mohammed Marmaduke William Pickthall", "native_name": "", "type": "translation" },
    "en.qaribullah": { "language_code": "en", "english_name": "Professor Shaykh Hasan Al-Fatih Qaribullah", "native_name": "", "type": "translation" },
    "en.sarwar": { "language_code": "en", "english_name": "Muhammad Sarwar", "native_name": "", "type": "translation" },
    "en.yusufali": { "language_code": "en", "english_name": "Abdullah Yusuf Ali", "native_name": "", "type": "translation" },
    "en.maududi": { "language_code": "en", "english_name": "Sayyid Abul Ala Maududi", "native_name": "", "type": "translation" },
    "en.shakir": { "language_code": "en", "english_name": "Mohammad Habib Shakir", "native_name": "", "type": "translation" },
    "en.transliteration": { "language_code": "en", "english_name": "Transliteration", "native_name": "", "type": "transliteration" },

    // Spanish
    "es.cortes": { "language_code": "es", "english_name": "Julio Cortes", "native_name": "", "type": "translation" },
    "es.asad": { "language_code": "es", "english_name": "Muhammad Asad - Abdurrasak Pérez", "native_name": "Asad", "type": "translation" },

    // Persian
    "fa.ayati": { "language_code": "fa", "english_name": "AbdolMohammad Ayati", "native_name": "آیتی", "type": "translation" },
    "fa.fooladvand": { "language_code": "fa", "english_name": "Mohammad Mahdi Fooladvand", "native_name": "فولادوند", "type": "translation" },
    "fa.ghomshei": { "language_code": "fa", "english_name": "Mahdi Elahi Ghomshei", "native_name": "الهی قمشه‌ای", "type": "translation" },
    "fa.makarem": { "language_code": "fa", "english_name": "Ayatollah Naser Makarem Shirazi", "native_name": "مکارم شیرازی", "type": "translation" },
    "fa.ansarian": { "language_code": "fa", "english_name": "Ayatollah Hussain Ansarian", "native_name": "انصاریان", "type": "translation" },

    // French
    "fr.hamidullah": { "language_code": "fr", "english_name": "Dr. Muhammad Hamidullah", "native_name": "", "type": "translation" },

    // Hausa
    "ha.gumi": { "language_code": "ha", "english_name": "Sheikh Abubakar Mahmoud Gumi", "native_name": "", "type": "translation" },

    // Hindi
    "hi.hindi": { "language_code": "hi", "english_name": "Hindi", "native_name": "हिन्दी", "type": "translation" },
    "hi.farooq": { "language_code": "hi", "english_name": "Muhammad Farooq Khan and Muhammad Ahmed", "native_name": "फ़ारूक़ ख़ान & अहमद", "type": "translation" },

    // Indonesian
    "id.indonesian": { "language_code": "id", "english_name": "Indonesian", "native_name": "Bahasa Indonesia", "type": "translation" },
    "id.muntakhab": { "language_code": "id", "english_name": "Muhammad Quraish Shihab et al.", "native_name": "Quraish Shihab", "type": "translation" },

    // Italian
    "it.piccardo": { "language_code": "it", "english_name": "Hamza Roberto Piccardo", "native_name": "", "type": "translation" },

    // Japanese
    "ja.japanese": { "language_code": "ja", "english_name": "Japanese", "native_name": "日本語", "type": "translation" },

    // Korean
    "ko.korean": { "language_code": "ko", "english_name": "Korean", "native_name": "한국어", "type": "translation" },

    // Kurdish
    "ku.asan": { "language_code": "ku", "english_name": "Burhan Muhammad-Amin", "native_name": "تەفسیری ئاسان", "type": "translation" },

    // Malayalam
    "ml.abdulhameed": { "language_code": "ml", "english_name": "Cheriyamundam Abdul Hameed and Kunhumohammed Parappur", "native_name": "അബ്ദുൽ ഹമീദ് & പറപ്പൂർ", "type": "translation" },

    // Malay
    "ms.basmeih": { "language_code": "ms", "english_name": "Abdullah Muhammad Basmeih", "native_name": "Basmeih", "type": "translation" },

    // Dutch
    "nl.keyzer": { "language_code": "nl", "english_name": "Dr. Salomo Keyzer", "native_name": "", "type": "translation" },

    // Norwegian
    "no.berg": { "language_code": "no", "english_name": "Einar Berg", "native_name": "", "type": "translation" },

    // Polish
    "pl.bielawskiego": { "language_code": "pl", "english_name": "Józefa Bielawskiego", "native_name": "", "type": "translation" },

    // Portuguese
    "pt.elhayek": { "language_code": "pt", "english_name": "Professor Samir El-Hayek", "native_name": "", "type": "translation" },

    // Romanian
    "ro.grigore": { "language_code": "ro", "english_name": "George Grigore", "native_name": "", "type": "translation" },

    // Russian
    "ru.kuliev": { "language_code": "ru", "english_name": "Elmir Kuliev", "native_name": "Кулиев", "type": "translation" },
    "ru.osmanov": { "language_code": "ru", "english_name": "M.-N.O. Osmanov", "native_name": "Османов", "type": "translation" },
    "ru.porokhova": { "language_code": "ru", "english_name": "V. Porokhova", "native_name": "Порохова", "type": "translation" },
    "ru.abuadel": { "language_code": "ru", "english_name": "Abu Adel", "native_name": "Абу Адель", "type": "translation" },
    "ru.krachkovsky": { "language_code": "ru", "english_name": "Ignaty Yulianovich Krachkovsky", "native_name": "Крачковский", "type": "translation" },

    // Sindhi
    "sd.amroti": { "language_code": "sd", "english_name": "Taj Mehmood Amroti", "native_name": "امروٽي", "type": "translation" },

    // Somali
    "so.abduh": { "language_code": "so", "english_name": "Mahmud Muhammad Abduh", "native_name": "", "type": "translation" },

    // Albanian
    "sq.ahmeti": { "language_code": "sq", "english_name": "Sherif Ahmeti", "native_name": "", "type": "translation" },
    "sq.mehdiu": { "language_code": "sq", "english_name": "Feti Mehdiu", "native_name": "", "type": "translation" },
    "sq.nahi": { "language_code": "sq", "english_name": "Hasan Efendi Nahi", "native_name": "", "type": "translation" },

    // Swedish
    "sv.bernstrom": { "language_code": "sv", "english_name": "Knut Bernström", "native_name": "", "type": "translation" },

    // Swahili
    "sw.barwani": { "language_code": "sw", "english_name": "Ali Muhsin Al-Barwani", "native_name": "", "type": "translation" },

    // Tamil
    "ta.tamil": { "language_code": "ta", "english_name": "Tamil", "native_name": "தமிழ்", "type": "translation" },

    // Tajik
    "tg.ayati": { "language_code": "tg", "english_name": "Abdolmohammad Ayati", "native_name": "Оятӣ", "type": "translation" },

    // Thai
    "th.thai": { "language_code": "th", "english_name": "King Fahad Quran Complex", "native_name": "ภาษาไทย", "type": "translation" },

    // Turkish
    "tr.ates": { "language_code": "tr", "english_name": "Suleyman Ates", "native_name": "Süleyman Ateş", "type": "translation" },
    "tr.bulac": { "language_code": "tr", "english_name": "Ali Bulaç", "native_name": "", "type": "translation" },
    "tr.diyanet": { "language_code": "tr", "english_name": "Diyanet Isleri", "native_name": "Diyanet İşleri", "type": "translation" },
    "tr.golpinarli": { "language_code": "tr", "english_name": "Abdulbaki Golpinarli", "native_name": "Abdulbakî Gölpınarlı", "type": "translation" },
    "tr.ozturk": { "language_code": "tr", "english_name": "Yasar Nuri Ozturk", "native_name": "Öztürk", "type": "translation" },
    "tr.transliteration": { "language_code": "tr", "english_name": "Transliteration", "native_name": "", "type": "transliteration" },
    "tr.vakfi": { "language_code": "tr", "english_name": "Diyanet Vakfi", "native_name": "", "type": "translation" },
    "tr.yazir": { "language_code": "tr", "english_name": "Elmalili Hamdi Yazir", "native_name": "", "type": "translation" },

    // Tatar
    "tt.nugman": { "language_code": "tt", "english_name": "Yakub Ibn Nugman", "native_name": "", "type": "translation" },

    // Uyghur
    "ug.saleh": { "language_code": "ug", "english_name": "Muhammad Saleh", "native_name": "محمد صالح", "type": "translation" },

    // Urdu
    "ur.jalandhry": { "language_code": "ur", "english_name": "Maulana Fateh Muhammad Jalandhry", "native_name": "جالندہری", "type": "translation" },
    "ur.ahmedali": { "language_code": "ur", "english_name": "Professor Ahmed Ali", "native_name": "احمد علی", "type": "translation" },
    "ur.junagarhi": { "language_code": "ur", "english_name": "Muhammad Junagarhi", "native_name": "محمد جوناگڑھی", "type": "translation" },

    // Uzbek
    "uz.sodik": { "language_code": "uz", "english_name": "Muhammad Sodik Muhammad Yusuf", "native_name": "Мухаммад Содик", "type": "translation" },

    // Chinese
    "zh.jian": { "language_code": "zh", "english_name": "Ma Jian", "native_name": "Ma Jian", "type": "translation" },
    "zh.majian": { "language_code": "zh", "english_name": "Ma Jian", "native_name": "Ma Jian (Traditional)", "type": "translation" }
};

// All available reciters (Audio)
export const reciters = {
    "ar.abdulbasitmurattal": { "english_name": "Abdul Basit", "native_name": "", "type": "murattal" },
    "ar.abdulbasitmujawwad": { "english_name": "Abdul Basit (Mujawwad)", "native_name": "", "type": "mujawwad" },
    "ar.abdullahbasfar": { "english_name": "Abdullah Basfar", "native_name": "", "type": "versebyverse" },
    "ar.abdurrahmaansudais": { "english_name": "Abdurrahmaan As-Sudais", "native_name": "", "type": "versebyverse" },
    "ar.abdulsamad": { "english_name": "Abdul Samad", "native_name": "", "type": "versebyverse" },
    "ar.shaatree": { "english_name": "Abu Bakr Ash-Shaatree", "native_name": "", "type": "versebyverse" },
    "ar.ahmedajamy": { "english_name": "Ahmed ibn Ali al-Ajamy", "native_name": "", "type": "versebyverse" },
    "ar.alafasy": { "english_name": "Alafasy", "native_name": "", "type": "versebyverse" },
    "ar.ghamadi": { "english_name": "Ghamadi", "native_name": "", "type": "versebyverse" },
    "ar.hanirifai": { "english_name": "Hani Rifai", "native_name": "", "type": "versebyverse" },
    "ar.husary": { "english_name": "Husary", "native_name": "", "type": "versebyverse" },
    "ar.husarymujawwad": { "english_name": "Husary (Mujawwad)", "native_name": "", "type": "mujawwad" },
    "ar.hudhaify": { "english_name": "Hudhaify", "native_name": "", "type": "versebyverse" },
    "ar.ibrahimakhbar": { "english_name": "Ibrahim Akhdar", "native_name": "", "type": "versebyverse" },
    "ar.mahermuaiqly": { "english_name": "Maher Al Muaiqly", "native_name": "", "type": "versebyverse" },
    "ar.minshawi": { "english_name": "Minshawi", "native_name": "", "type": "murattal" },
    "ar.minshawimujawwad": { "english_name": "Minshawy (Mujawwad)", "native_name": "", "type": "mujawwad" },
    "ar.muhammadayyoub": { "english_name": "Muhammad Ayyoub", "native_name": "", "type": "versebyverse" },
    "ar.muhammadjibreel": { "english_name": "Muhammad Jibreel", "native_name": "", "type": "versebyverse" },
    "ar.saoodshuraym": { "english_name": "Saood bin Ibraaheem Ash-Shuraym", "native_name": "", "type": "versebyverse" },
    "ar.parhizgar": { "english_name": "Parhizgar", "native_name": "", "type": "versebyverse" },
    "en.walk": { "english_name": "Ibrahim Walk (English)", "native_name": "", "type": "versebyverse" },
    "fr.leclerc": { "english_name": "Youssouf Leclerc (French)", "native_name": "", "type": "versebyverse" },
    "ur.khan": { "english_name": "Shamshad Ali Khan (Urdu)", "native_name": "", "type": "versebyverse" },
    "zh.chinese": { "english_name": "Chinese", "native_name": "中文", "type": "versebyverse" }
};

// Complete Surah metadata with Juz information
export const surahData = [
    { number: 1, name: "Al-Faatiha", arabicName: "الفاتحة", meaning: "The Opening", ayahs: 7, revelationType: "Meccan", juz: [1] },
    { number: 2, name: "Al-Baqara", arabicName: "البقرة", meaning: "The Cow", ayahs: 286, revelationType: "Medinan", juz: [1, 2, 3] },
    { number: 3, name: "Aal-i-Imraan", arabicName: "آل عمران", meaning: "The Family of Imraan", ayahs: 200, revelationType: "Medinan", juz: [3, 4] },
    { number: 4, name: "An-Nisaa", arabicName: "النساء", meaning: "The Women", ayahs: 176, revelationType: "Medinan", juz: [4, 5, 6] },
    { number: 5, name: "Al-Maaida", arabicName: "المائدة", meaning: "The Table Spread", ayahs: 120, revelationType: "Medinan", juz: [6, 7] },
    { number: 6, name: "Al-An'aam", arabicName: "الأنعام", meaning: "The Cattle", ayahs: 165, revelationType: "Meccan", juz: [7, 8] },
    { number: 7, name: "Al-A'raaf", arabicName: "الأعراف", meaning: "The Heights", ayahs: 206, revelationType: "Meccan", juz: [8, 9] },
    { number: 8, name: "Al-Anfaal", arabicName: "الأنفال", meaning: "The Spoils of War", ayahs: 75, revelationType: "Medinan", juz: [9, 10] },
    { number: 9, name: "At-Tawba", arabicName: "التوبة", meaning: "The Repentance", ayahs: 129, revelationType: "Medinan", juz: [10, 11] },
    { number: 10, name: "Yunus", arabicName: "يونس", meaning: "Jonah", ayahs: 109, revelationType: "Meccan", juz: [11] },
    { number: 11, name: "Hud", arabicName: "هود", meaning: "Hud", ayahs: 123, revelationType: "Meccan", juz: [11, 12] },
    { number: 12, name: "Yusuf", arabicName: "يوسف", meaning: "Joseph", ayahs: 111, revelationType: "Meccan", juz: [12, 13] },
    { number: 13, name: "Ar-Ra'd", arabicName: "الرعد", meaning: "The Thunder", ayahs: 43, revelationType: "Medinan", juz: [13] },
    { number: 14, name: "Ibrahim", arabicName: "إبراهيم", meaning: "Abraham", ayahs: 52, revelationType: "Meccan", juz: [13] },
    { number: 15, name: "Al-Hijr", arabicName: "الحجر", meaning: "The Rocky Tract", ayahs: 99, revelationType: "Meccan", juz: [14] },
    { number: 16, name: "An-Nahl", arabicName: "النحل", meaning: "The Bee", ayahs: 128, revelationType: "Meccan", juz: [14] },
    { number: 17, name: "Al-Israa", arabicName: "الإسراء", meaning: "The Night Journey", ayahs: 111, revelationType: "Meccan", juz: [15] },
    { number: 18, name: "Al-Kahf", arabicName: "الكهف", meaning: "The Cave", ayahs: 110, revelationType: "Meccan", juz: [15, 16] },
    { number: 19, name: "Maryam", arabicName: "مريم", meaning: "Mary", ayahs: 98, revelationType: "Meccan", juz: [16] },
    { number: 20, name: "Taa-Haa", arabicName: "طه", meaning: "Taa-Haa", ayahs: 135, revelationType: "Meccan", juz: [16] },
    { number: 21, name: "Al-Anbiyaa", arabicName: "الأنبياء", meaning: "The Prophets", ayahs: 112, revelationType: "Meccan", juz: [17] },
    { number: 22, name: "Al-Hajj", arabicName: "الحج", meaning: "The Pilgrimage", ayahs: 78, revelationType: "Medinan", juz: [17] },
    { number: 23, name: "Al-Mu'minoon", arabicName: "المؤمنون", meaning: "The Believers", ayahs: 118, revelationType: "Meccan", juz: [18] },
    { number: 24, name: "An-Noor", arabicName: "النور", meaning: "The Light", ayahs: 64, revelationType: "Medinan", juz: [18] },
    { number: 25, name: "Al-Furqaan", arabicName: "الفرقان", meaning: "The Criterion", ayahs: 77, revelationType: "Meccan", juz: [18, 19] },
    { number: 26, name: "Ash-Shu'araa", arabicName: "الشعراء", meaning: "The Poets", ayahs: 227, revelationType: "Meccan", juz: [19] },
    { number: 27, name: "An-Naml", arabicName: "النمل", meaning: "The Ant", ayahs: 93, revelationType: "Meccan", juz: [19, 20] },
    { number: 28, name: "Al-Qasas", arabicName: "القصص", meaning: "The Stories", ayahs: 88, revelationType: "Meccan", juz: [20] },
    { number: 29, name: "Al-Ankaboot", arabicName: "العنكبوت", meaning: "The Spider", ayahs: 69, revelationType: "Meccan", juz: [20, 21] },
    { number: 30, name: "Ar-Room", arabicName: "الروم", meaning: "The Romans", ayahs: 60, revelationType: "Meccan", juz: [21] },
    { number: 31, name: "Luqmaan", arabicName: "لقمان", meaning: "Luqman", ayahs: 34, revelationType: "Meccan", juz: [21] },
    { number: 32, name: "As-Sajda", arabicName: "السجدة", meaning: "The Prostration", ayahs: 30, revelationType: "Meccan", juz: [21] },
    { number: 33, name: "Al-Ahzaab", arabicName: "الأحزاب", meaning: "The Combined Forces", ayahs: 73, revelationType: "Medinan", juz: [21, 22] },
    { number: 34, name: "Saba", arabicName: "سبإ", meaning: "Sheba", ayahs: 54, revelationType: "Meccan", juz: [22] },
    { number: 35, name: "Faatir", arabicName: "فاطر", meaning: "Originator", ayahs: 45, revelationType: "Meccan", juz: [22] },
    { number: 36, name: "Yaseen", arabicName: "يس", meaning: "Ya Sin", ayahs: 83, revelationType: "Meccan", juz: [22, 23] },
    { number: 37, name: "As-Saaffaat", arabicName: "الصافات", meaning: "Those Who Set The Ranks", ayahs: 182, revelationType: "Meccan", juz: [23] },
    { number: 38, name: "Saad", arabicName: "ص", meaning: "Saad", ayahs: 88, revelationType: "Meccan", juz: [23] },
    { number: 39, name: "Az-Zumar", arabicName: "الزمر", meaning: "The Troops", ayahs: 75, revelationType: "Meccan", juz: [23, 24] },
    { number: 40, name: "Ghafir", arabicName: "غافر", meaning: "The Forgiver", ayahs: 85, revelationType: "Meccan", juz: [24] },
    { number: 41, name: "Fussilat", arabicName: "فصلت", meaning: "Explained in Detail", ayahs: 54, revelationType: "Meccan", juz: [24, 25] },
    { number: 42, name: "Ash-Shooraa", arabicName: "الشورى", meaning: "The Consultation", ayahs: 53, revelationType: "Meccan", juz: [25] },
    { number: 43, name: "Az-Zukhruf", arabicName: "الزخرف", meaning: "The Ornaments of Gold", ayahs: 89, revelationType: "Meccan", juz: [25] },
    { number: 44, name: "Ad-Dukhaan", arabicName: "الدخان", meaning: "The Smoke", ayahs: 59, revelationType: "Meccan", juz: [25] },
    { number: 45, name: "Al-Jaathiya", arabicName: "الجاثية", meaning: "The Crouching", ayahs: 37, revelationType: "Meccan", juz: [25] },
    { number: 46, name: "Al-Ahqaaf", arabicName: "الأحقاف", meaning: "The Wind-Curved Sandhills", ayahs: 35, revelationType: "Meccan", juz: [26] },
    { number: 47, name: "Muhammad", arabicName: "محمد", meaning: "Muhammad", ayahs: 38, revelationType: "Medinan", juz: [26] },
    { number: 48, name: "Al-Fath", arabicName: "الفتح", meaning: "The Victory", ayahs: 29, revelationType: "Medinan", juz: [26] },
    { number: 49, name: "Al-Hujuraat", arabicName: "الحجرات", meaning: "The Rooms", ayahs: 18, revelationType: "Medinan", juz: [26] },
    { number: 50, name: "Qaaf", arabicName: "ق", meaning: "Qaaf", ayahs: 45, revelationType: "Meccan", juz: [26] },
    { number: 51, name: "Adh-Dhaariyaat", arabicName: "الذاريات", meaning: "The Winnowing Winds", ayahs: 60, revelationType: "Meccan", juz: [26, 27] },
    { number: 52, name: "At-Toor", arabicName: "الطور", meaning: "The Mount", ayahs: 49, revelationType: "Meccan", juz: [27] },
    { number: 53, name: "An-Najm", arabicName: "النجم", meaning: "The Star", ayahs: 62, revelationType: "Meccan", juz: [27] },
    { number: 54, name: "Al-Qamar", arabicName: "القمر", meaning: "The Moon", ayahs: 55, revelationType: "Meccan", juz: [27] },
    { number: 55, name: "Ar-Rahmaan", arabicName: "الرحمن", meaning: "The Beneficent", ayahs: 78, revelationType: "Medinan", juz: [27] },
    { number: 56, name: "Al-Waqi'a", arabicName: "الواقعة", meaning: "The Inevitable", ayahs: 96, revelationType: "Meccan", juz: [27] },
    { number: 57, name: "Al-Hadeed", arabicName: "الحديد", meaning: "The Iron", ayahs: 29, revelationType: "Medinan", juz: [27] },
    { number: 58, name: "Al-Mujaadila", arabicName: "المجادلة", meaning: "The Pleading Woman", ayahs: 22, revelationType: "Medinan", juz: [28] },
    { number: 59, name: "Al-Hashr", arabicName: "الحشر", meaning: "The Exile", ayahs: 24, revelationType: "Medinan", juz: [28] },
    { number: 60, name: "Al-Mumtahana", arabicName: "الممتحنة", meaning: "She That Is To Be Examined", ayahs: 13, revelationType: "Medinan", juz: [28] },
    { number: 61, name: "As-Saff", arabicName: "الصف", meaning: "The Ranks", ayahs: 14, revelationType: "Medinan", juz: [28] },
    { number: 62, name: "Al-Jumu'a", arabicName: "الجمعة", meaning: "The Congregation, Friday", ayahs: 11, revelationType: "Medinan", juz: [28] },
    { number: 63, name: "Al-Munaafiqoon", arabicName: "المنافقون", meaning: "The Hypocrites", ayahs: 11, revelationType: "Medinan", juz: [28] },
    { number: 64, name: "At-Taghaabun", arabicName: "التغابن", meaning: "The Mutual Disillusion", ayahs: 18, revelationType: "Medinan", juz: [28] },
    { number: 65, name: "At-Talaaq", arabicName: "الطلاق", meaning: "The Divorce", ayahs: 12, revelationType: "Medinan", juz: [28] },
    { number: 66, name: "At-Tahreem", arabicName: "التحريم", meaning: "The Prohibition", ayahs: 12, revelationType: "Medinan", juz: [28] },
    { number: 67, name: "Al-Mulk", arabicName: "الملك", meaning: "The Sovereignty", ayahs: 30, revelationType: "Meccan", juz: [29] },
    { number: 68, name: "Al-Qalam", arabicName: "القلم", meaning: "The Pen", ayahs: 52, revelationType: "Meccan", juz: [29] },
    { number: 69, name: "Al-Haaqqa", arabicName: "الحاقة", meaning: "The Reality", ayahs: 52, revelationType: "Meccan", juz: [29] },
    { number: 70, name: "Al-Ma'aarij", arabicName: "المعارج", meaning: "The Ascending Stairways", ayahs: 44, revelationType: "Meccan", juz: [29] },
    { number: 71, name: "Nooh", arabicName: "نوح", meaning: "Noah", ayahs: 28, revelationType: "Meccan", juz: [29] },
    { number: 72, name: "Al-Jinn", arabicName: "الجن", meaning: "The Jinn", ayahs: 28, revelationType: "Meccan", juz: [29] },
    { number: 73, name: "Al-Muzzammil", arabicName: "المزمل", meaning: "The Enshrouded One", ayahs: 20, revelationType: "Meccan", juz: [29] },
    { number: 74, name: "Al-Muddaththir", arabicName: "المدثر", meaning: "The Cloaked One", ayahs: 56, revelationType: "Meccan", juz: [29] },
    { number: 75, name: "Al-Qiyaama", arabicName: "القيامة", meaning: "The Resurrection", ayahs: 40, revelationType: "Meccan", juz: [29] },
    { number: 76, name: "Al-Insaan", arabicName: "الإنسان", meaning: "The Man", ayahs: 31, revelationType: "Medinan", juz: [29] },
    { number: 77, name: "Al-Mursalaat", arabicName: "المرسلات", meaning: "The Emissaries", ayahs: 50, revelationType: "Meccan", juz: [29] },
    { number: 78, name: "An-Naba", arabicName: "النبإ", meaning: "The Tidings", ayahs: 40, revelationType: "Meccan", juz: [30] },
    { number: 79, name: "An-Naazi'aat", arabicName: "النازعات", meaning: "Those Who Drag Forth", ayahs: 46, revelationType: "Meccan", juz: [30] },
    { number: 80, name: "Abasa", arabicName: "عبس", meaning: "He Frowned", ayahs: 42, revelationType: "Meccan", juz: [30] },
    { number: 81, name: "At-Takweer", arabicName: "التكوير", meaning: "The Overthrowing", ayahs: 29, revelationType: "Meccan", juz: [30] },
    { number: 82, name: "Al-Infitaar", arabicName: "الانفطار", meaning: "The Cleaving", ayahs: 19, revelationType: "Meccan", juz: [30] },
    { number: 83, name: "Al-Mutaffifeen", arabicName: "المطففين", meaning: "The Defrauding", ayahs: 36, revelationType: "Meccan", juz: [30] },
    { number: 84, name: "Al-Inshiqaaq", arabicName: "الانشقاق", meaning: "The Sundering", ayahs: 25, revelationType: "Meccan", juz: [30] },
    { number: 85, name: "Al-Burooj", arabicName: "البروج", meaning: "The Mansions of the Stars", ayahs: 22, revelationType: "Meccan", juz: [30] },
    { number: 86, name: "At-Taariq", arabicName: "الطارق", meaning: "The Nightcomer", ayahs: 17, revelationType: "Meccan", juz: [30] },
    { number: 87, name: "Al-A'laa", arabicName: "الأعلى", meaning: "The Most High", ayahs: 19, revelationType: "Meccan", juz: [30] },
    { number: 88, name: "Al-Ghaashiya", arabicName: "الغاشية", meaning: "The Overwhelming", ayahs: 26, revelationType: "Meccan", juz: [30] },
    { number: 89, name: "Al-Fajr", arabicName: "الفجر", meaning: "The Dawn", ayahs: 30, revelationType: "Meccan", juz: [30] },
    { number: 90, name: "Al-Balad", arabicName: "البلد", meaning: "The City", ayahs: 20, revelationType: "Meccan", juz: [30] },
    { number: 91, name: "Ash-Shams", arabicName: "الشمس", meaning: "The Sun", ayahs: 15, revelationType: "Meccan", juz: [30] },
    { number: 92, name: "Al-Layl", arabicName: "الليل", meaning: "The Night", ayahs: 21, revelationType: "Meccan", juz: [30] },
    { number: 93, name: "Ad-Dhuhaa", arabicName: "الضحى", meaning: "The Morning Hours", ayahs: 11, revelationType: "Meccan", juz: [30] },
    { number: 94, name: "Ash-Sharh", arabicName: "الشرح", meaning: "The Relief", ayahs: 8, revelationType: "Meccan", juz: [30] },
    { number: 95, name: "At-Teen", arabicName: "التين", meaning: "The Fig", ayahs: 8, revelationType: "Meccan", juz: [30] },
    { number: 96, name: "Al-Alaq", arabicName: "العلق", meaning: "The Clot", ayahs: 19, revelationType: "Meccan", juz: [30] },
    { number: 97, name: "Al-Qadr", arabicName: "القدر", meaning: "The Power", ayahs: 5, revelationType: "Meccan", juz: [30] },
    { number: 98, name: "Al-Bayyina", arabicName: "البينة", meaning: "The Clear Proof", ayahs: 8, revelationType: "Medinan", juz: [30] },
    { number: 99, name: "Az-Zalzala", arabicName: "الزلزلة", meaning: "The Earthquake", ayahs: 8, revelationType: "Medinan", juz: [30] },
    { number: 100, name: "Al-Aadiyaat", arabicName: "العاديات", meaning: "The Courser", ayahs: 11, revelationType: "Meccan", juz: [30] },
    { number: 101, name: "Al-Qaari'a", arabicName: "القارعة", meaning: "The Calamity", ayahs: 11, revelationType: "Meccan", juz: [30] },
    { number: 102, name: "At-Takaathur", arabicName: "التكاثر", meaning: "The Rivalry in World Increase", ayahs: 8, revelationType: "Meccan", juz: [30] },
    { number: 103, name: "Al-Asr", arabicName: "العصر", meaning: "The Declining Day", ayahs: 3, revelationType: "Meccan", juz: [30] },
    { number: 104, name: "Al-Humaza", arabicName: "الهمزة", meaning: "The Traducer", ayahs: 9, revelationType: "Meccan", juz: [30] },
    { number: 105, name: "Al-Feel", arabicName: "الفيل", meaning: "The Elephant", ayahs: 5, revelationType: "Meccan", juz: [30] },
    { number: 106, name: "Quraysh", arabicName: "قريش", meaning: "Quraysh", ayahs: 4, revelationType: "Meccan", juz: [30] },
    { number: 107, name: "Al-Maa'oon", arabicName: "الماعون", meaning: "The Small Kindnesses", ayahs: 7, revelationType: "Meccan", juz: [30] },
    { number: 108, name: "Al-Kawthar", arabicName: "الكوثر", meaning: "The Abundance", ayahs: 3, revelationType: "Meccan", juz: [30] },
    { number: 109, name: "Al-Kaafiroon", arabicName: "الكافرون", meaning: "The Disbelievers", ayahs: 6, revelationType: "Meccan", juz: [30] },
    { number: 110, name: "An-Nasr", arabicName: "النصر", meaning: "The Divine Support", ayahs: 3, revelationType: "Medinan", juz: [30] },
    { number: 111, name: "Al-Masad", arabicName: "المسد", meaning: "The Palm Fiber", ayahs: 5, revelationType: "Meccan", juz: [30] },
    { number: 112, name: "Al-Ikhlaas", arabicName: "الإخلاص", meaning: "The Sincerity", ayahs: 4, revelationType: "Meccan", juz: [30] },
    { number: 113, name: "Al-Falaq", arabicName: "الفلق", meaning: "The Daybreak", ayahs: 5, revelationType: "Meccan", juz: [30] },
    { number: 114, name: "An-Naas", arabicName: "الناس", meaning: "Mankind", ayahs: 6, revelationType: "Meccan", juz: [30] }
];

// Helper function to get audio URL for a verse
export const getAudioUrl = (reciter, surah, ayah, format = 'mp3', kbs = '128') => {
    const surahPadded = String(surah).padStart(3, '0');
    const ayahPadded = String(ayah).padStart(3, '0');
    return `${AUDIO_BASE_URL}/${format}/${reciter}/${kbs}/${surahPadded}${ayahPadded}.${format}`;
};

// Helper function to get surah info
export const getSurahInfo = (surahNumber) => {
    return surahData.find(s => s.number === surahNumber);
};

// Helper to group translations by language
export const getTranslationsByLanguage = () => {
    const grouped = {};
    Object.entries(translations).forEach(([key, value]) => {
        const lang = languageList[value.language_code];
        if (!grouped[value.language_code]) {
            grouped[value.language_code] = {
                language: lang?.english_name || value.language_code,
                nativeName: lang?.native_name || '',
                dir: lang?.dir || 'left',
                translations: []
            };
        }
        grouped[value.language_code].translations.push({ key, ...value });
    });
    return grouped;
};
