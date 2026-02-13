// Complete Quran data extracted from legacy GlobalQuran project
// This includes all available translations, reciters, and Quran scripts

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
    "quran-simple-min": { "english_name": "Simple Minimal", "native_name": "", "type": "quran" },
    "quran-indopak": { "english_name": "Indo-Pak Nastaleeq", "native_name": "نستعلیق انڈو پاک", "type": "quran" },
    "quran-indopak-tajweed": { "english_name": "Indo-Pak Tajweed", "native_name": "نستعلیق تجوید", "type": "quran" }
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
    "en.ibnkathir": { "language_code": "en", "english_name": "Tafsir Ibn Kathir (Abridged)", "native_name": "", "type": "tafsir" },
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
    "tr.vakfi": { "language_code": "tr", "english_name": "Diyanet Vakfi", "native_name": "", "type": "translation" },
    "tr.yazir": { "language_code": "tr", "english_name": "Elmalili Hamdi Yazir", "native_name": "", "type": "translation" },
    "tr.transliteration": { "language_code": "tr", "english_name": "Turkish Transliteration", "native_name": "Türkçe Transliterasyon", "type": "transliteration" },

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

    // --- Offline Tafsirs (from spa5k) ---
    "bn-tafisr-fathul-majid": { "language_code": "bn", "english_name": "Tafsir Fathul Majid", "native_name": "AbdulRahman Bin Hasan Al-Alshaikh", "type": "tafsir" },
    "en-tafisr-ibn-kathir": { "language_code": "en", "english_name": "Tafsir Ibn Kathir (abridged)", "native_name": "Hafiz Ibn Kathir", "type": "tafsir" },
    "ar-tafsir-ibn-kathir": { "language_code": "ar", "english_name": "Tafsir Ibn Kathir", "native_name": "Hafiz Ibn Kathir", "type": "tafsir" },
    "bn-tafseer-ibn-e-kaseer": { "language_code": "bn", "english_name": "Tafseer ibn Kathir", "native_name": "Tawheed Publication", "type": "tafsir" },
    "bn-tafsir-ahsanul-bayaan": { "language_code": "bn", "english_name": "Tafsir Ahsanul Bayaan", "native_name": "Bayaan Foundation", "type": "tafsir" },
    "bn-tafsir-abu-bakr-zakaria": { "language_code": "bn", "english_name": "Tafsir Abu Bakr Zakaria", "native_name": "King Fahd Quran Printing Complex", "type": "tafsir" },

    "en-tafsir-maarif-ul-quran": { "language_code": "en", "english_name": "Maarif-ul-Quran", "native_name": "Mufti Muhammad Shafi", "type": "tafsir" },
    "ru-tafseer-al-saddi": { "language_code": "ru", "english_name": "Tafseer Al Saddi", "native_name": "Saddi", "type": "tafsir" },
    "ar-tafseer-al-saddi": { "language_code": "ar", "english_name": "Tafseer Al Saddi", "native_name": "Saddi", "type": "tafsir" },
    "ar-tafsir-al-baghawi": { "language_code": "ar", "english_name": "Tafseer Al-Baghawi", "native_name": "Baghawy", "type": "tafsir" },
    "ar-tafseer-tanwir-al-miqbas": { "language_code": "ar", "english_name": "Tafseer Tanwir al-Miqbas", "native_name": "Tanweer", "type": "tafsir" },
    "ar-tafsir-al-wasit": { "language_code": "ar", "english_name": "Tafsir Al Wasit", "native_name": "Waseet", "type": "tafsir" },
    "ar-tafsir-al-tabari": { "language_code": "ar", "english_name": "Tafsir al-Tabari", "native_name": "Tabari", "type": "tafsir" },
    "ar-tafsir-muyassar": { "language_code": "ar", "english_name": "Tafsir Muyassar", "native_name": "المیسر", "type": "tafsir" },
    "ar-tafseer-al-qurtubi": { "language_code": "ar", "english_name": "Tafseer Al Qurtubi", "native_name": "Qurtubi", "type": "tafsir" },
    "kurd-tafsir-rebar": { "language_code": "ku", "english_name": "Rebar Kurdish Tafsir", "native_name": "Rebar Kurdish Tafsir", "type": "tafsir" },
    "ur-tafseer-ibn-e-kaseer": { "language_code": "ur", "english_name": "Tafsir Ibn Kathir", "native_name": "Hafiz Ibn Kathir", "type": "tafsir" },
    "ur-tafsir-bayan-ul-quran": { "language_code": "ur", "english_name": "Tafsir Bayan ul Quran", "native_name": "Dr. Israr Ahmad", "type": "tafsir" },
    "ur-tazkirul-quran": { "language_code": "ur", "english_name": "Tazkirul Quran", "native_name": "Maulana Wahid Uddin Khan", "type": "tafsir" },
    "en-tazkirul-quran": { "language_code": "en", "english_name": "Tazkirul Quran", "native_name": "Maulana Wahid Uddin Khan", "type": "tafsir" },
    "en-kashf-al-asrar-tafsir": { "language_code": "en", "english_name": "Kashf Al-Asrar Tafsir", "native_name": "Kashf Al-Asrar Tafsir", "type": "tafsir" },
    "en-al-qushairi-tafsir": { "language_code": "en", "english_name": "Al Qushairi Tafsir", "native_name": "Al Qushairi Tafsir", "type": "tafsir" },
    "en-kashani-tafsir": { "language_code": "en", "english_name": "Kashani Tafsir", "native_name": "Kashani Tafsir", "type": "tafsir" },
    "en-tafsir-al-tustari": { "language_code": "en", "english_name": "Tafsir al-Tustari", "native_name": "Tafsir al-Tustari", "type": "tafsir" },
    "en-asbab-al-nuzul-by-al-wahidi": { "language_code": "en", "english_name": "Asbab Al-Nuzul by Al-Wahidi", "native_name": "Asbab Al-Nuzul by Al-Wahidi", "type": "tafsir" },
    "en-tafsir-ibn-abbas": { "language_code": "en", "english_name": "Tanwîr al-Miqbâs min Tafsîr Ibn ‘Abbâs", "native_name": "Tanwîr al-Miqbâs min Tafsîr Ibn ‘Abbâs", "type": "tafsir" },
    "en-al-jalalayn": { "language_code": "en", "english_name": "Al-Jalalayn", "native_name": "Al-Jalalayn", "type": "tafsir" },
    "zh.majian": { "language_code": "zh", "english_name": "Ma Jian", "native_name": "Ma Jian (Traditional)", "type": "translation" }
};

// All available reciters (Audio)
export const reciters = {
    "mishary_rashid": { "english_name": "Mishary Rashid Alafasy", "style": "Murattal", "subfolder": "Alafasy_64kbps", "bitRate": "64" },
    "abdulbaset": { "english_name": "AbdulBaset AbdulSamad", "style": "Murattal", "subfolder": "Abdul_Basit_Murattal_64kbps", "bitRate": "64" },
    "abdulbaset_mujawwad": { "english_name": "AbdulBaset AbdulSamad (Mujawwad)", "style": "Mujawwad", "subfolder": "Abdul_Basit_Mujawwad_128kbps", "bitRate": "128" },
    "minshawi_mujawwad": { "english_name": "Mohamed Siddiq Al-Minshawi (Mujawwad)", "style": "Mujawwad", "subfolder": "Minshawy_Mujawwad_192kbps", "bitRate": "192" },
    "hudhaify": { "english_name": "Ali Al-Hudhaify", "style": "Madani", "subfolder": "Hudhaify_64kbps", "bitRate": "64" },
    "sudais": { "english_name": "Abdur-Rahman as-Sudais", "style": "Madani", "subfolder": "Abdurrahmaan_As-Sudais_64kbps", "bitRate": "64" },
    "shuraim": { "english_name": "Saud Al-Shuraim", "style": "Madani", "subfolder": "Saood_ash-Shuraym_64kbps", "bitRate": "64" },
    "ghamadi": { "english_name": "Saad Al-Ghamdi", "style": "Murattal", "subfolder": "Ghamadi_40kbps", "bitRate": "40" },
    "husary": { "english_name": "Mahmoud Khalil Al-Husary", "style": "Murattal", "subfolder": "Husary_64kbps", "bitRate": "64" },
    "maher": { "english_name": "Maher Al Muaiqly", "style": "Madani", "subfolder": "MaherAlMuaiqly_128kbps", "bitRate": "128" },
    "yasser_dosari": { "english_name": "Yasser Al-Dosari", "style": "Meccan", "subfolder": "Yasser_Ad-Dussary_128kbps", "bitRate": "128" },
    "juhany": { "english_name": "Abdullah Awad al-Juhany", "style": "Meccan", "subfolder": "Abdullah_Juhany_128kbps", "bitRate": "128" },
    "baleela": { "english_name": "Bandar Baleela", "style": "Meccan", "subfolder": "Bandar_Baleela_64kbps", "bitRate": "64" }
};

// Complete Surah metadata with Juz information
export const surahData = [
    { number: 1, name: "Al-Faatiha", arabicName: "الفاتحة", meaning: "The Opening", ayahs: 7, rukus: 1, revelationType: "Meccan", juz: [1] },
    { number: 2, name: "Al-Baqara", arabicName: "البقرة", meaning: "The Cow", ayahs: 286, rukus: 40, revelationType: "Medinan", juz: [1, 2, 3] },
    { number: 3, name: "Aal-i-Imraan", arabicName: "آل عمران", meaning: "The Family of Imraan", ayahs: 200, rukus: 20, revelationType: "Medinan", juz: [3, 4] },
    { number: 4, name: "An-Nisaa", arabicName: "النساء", meaning: "The Women", ayahs: 176, rukus: 24, revelationType: "Medinan", juz: [4, 5, 6] },
    { number: 5, name: "Al-Maaida", arabicName: "المائدة", meaning: "The Table Spread", ayahs: 120, rukus: 16, revelationType: "Medinan", juz: [6, 7] },
    { number: 6, name: "Al-An'aam", arabicName: "الأنعام", meaning: "The Cattle", ayahs: 165, rukus: 20, revelationType: "Meccan", juz: [7, 8] },
    { number: 7, name: "Al-A'raaf", arabicName: "الأعراف", meaning: "The Heights", ayahs: 206, rukus: 24, revelationType: "Meccan", juz: [8, 9] },
    { number: 8, name: "Al-Anfaal", arabicName: "الأنفال", meaning: "The Spoils of War", ayahs: 75, rukus: 10, revelationType: "Medinan", juz: [9, 10] },
    { number: 9, name: "At-Tawba", arabicName: "التوبة", meaning: "The Repentance", ayahs: 129, rukus: 16, revelationType: "Medinan", juz: [10, 11] },
    { number: 10, name: "Yunus", arabicName: "يونس", meaning: "Jonah", ayahs: 109, rukus: 11, revelationType: "Meccan", juz: [11] },
    { number: 11, name: "Hud", arabicName: "هود", meaning: "Hud", ayahs: 123, rukus: 10, revelationType: "Meccan", juz: [11, 12] },
    { number: 12, name: "Yusuf", arabicName: "يوسف", meaning: "Joseph", ayahs: 111, rukus: 12, revelationType: "Meccan", juz: [12, 13] },
    { number: 13, name: "Ar-Ra'd", arabicName: "الرعد", meaning: "The Thunder", ayahs: 43, rukus: 6, revelationType: "Medinan", juz: [13] },
    { number: 14, name: "Ibrahim", arabicName: "إبراهيم", meaning: "Abraham", ayahs: 52, rukus: 7, revelationType: "Meccan", juz: [13] },
    { number: 15, name: "Al-Hijr", arabicName: "الحجر", meaning: "The Rocky Tract", ayahs: 99, rukus: 6, revelationType: "Meccan", juz: [14] },
    { number: 16, name: "An-Nahl", arabicName: "النحل", meaning: "The Bee", ayahs: 128, rukus: 16, revelationType: "Meccan", juz: [14] },
    { number: 17, name: "Al-Israa", arabicName: "الإسراء", meaning: "The Night Journey", ayahs: 111, rukus: 12, revelationType: "Meccan", juz: [15] },
    { number: 18, name: "Al-Kahf", arabicName: "الكهف", meaning: "The Cave", ayahs: 110, rukus: 12, revelationType: "Meccan", juz: [15, 16] },
    { number: 19, name: "Maryam", arabicName: "مريم", meaning: "Mary", ayahs: 98, rukus: 6, revelationType: "Meccan", juz: [16] },
    { number: 20, name: "Taa-Haa", arabicName: "طه", meaning: "Taa-Haa", ayahs: 135, rukus: 8, revelationType: "Meccan", juz: [16] },
    { number: 21, name: "Al-Anbiyaa", arabicName: "الأنبياء", meaning: "The Prophets", ayahs: 112, rukus: 7, revelationType: "Meccan", juz: [17] },
    { number: 22, name: "Al-Hajj", arabicName: "الحج", meaning: "The Pilgrimage", ayahs: 78, rukus: 10, revelationType: "Medinan", juz: [17] },
    { number: 23, name: "Al-Mu'minoon", arabicName: "المؤمنون", meaning: "The Believers", ayahs: 118, rukus: 6, revelationType: "Meccan", juz: [18] },
    { number: 24, name: "An-Noor", arabicName: "النور", meaning: "The Light", ayahs: 64, rukus: 9, revelationType: "Medinan", juz: [18] },
    { number: 25, name: "Al-Furqaan", arabicName: "الفرقان", meaning: "The Criterion", ayahs: 77, rukus: 6, revelationType: "Meccan", juz: [18, 19] },
    { number: 26, name: "Ash-Shu'araa", arabicName: "الشعراء", meaning: "The Poets", ayahs: 227, rukus: 11, revelationType: "Meccan", juz: [19] },
    { number: 27, name: "An-Naml", arabicName: "النمل", meaning: "The Ant", ayahs: 93, rukus: 7, revelationType: "Meccan", juz: [19, 20] },
    { number: 28, name: "Al-Qasas", arabicName: "القصص", meaning: "The Stories", ayahs: 88, rukus: 9, revelationType: "Meccan", juz: [20] },
    { number: 29, name: "Al-Ankaboot", arabicName: "العنكبوت", meaning: "The Spider", ayahs: 69, rukus: 7, revelationType: "Meccan", juz: [20, 21] },
    { number: 30, name: "Ar-Room", arabicName: "الروم", meaning: "The Romans", ayahs: 60, rukus: 6, revelationType: "Meccan", juz: [21] },
    { number: 31, name: "Luqmaan", arabicName: "لقمان", meaning: "Luqman", ayahs: 34, rukus: 4, revelationType: "Meccan", juz: [21] },
    { number: 32, name: "As-Sajda", arabicName: "السجدة", meaning: "The Prostration", ayahs: 30, rukus: 3, revelationType: "Meccan", juz: [21] },
    { number: 33, name: "Al-Ahzaab", arabicName: "الأحزاب", meaning: "The Combined Forces", ayahs: 73, rukus: 9, revelationType: "Medinan", juz: [21, 22] },
    { number: 34, name: "Saba", arabicName: "سبإ", meaning: "Sheba", ayahs: 54, rukus: 6, revelationType: "Meccan", juz: [22] },
    { number: 35, name: "Faatir", arabicName: "فاطر", meaning: "Originator", ayahs: 45, rukus: 5, revelationType: "Meccan", juz: [22] },
    { number: 36, name: "Yaseen", arabicName: "يس", meaning: "Ya Sin", ayahs: 83, rukus: 5, revelationType: "Meccan", juz: [22, 23] },
    { number: 37, name: "As-Saaffaat", arabicName: "الصافات", meaning: "Those Who Set The Ranks", ayahs: 182, rukus: 5, revelationType: "Meccan", juz: [23] },
    { number: 38, name: "Saad", arabicName: "ص", meaning: "Saad", ayahs: 88, rukus: 5, revelationType: "Meccan", juz: [23] },
    { number: 39, name: "Az-Zumar", arabicName: "الزمر", meaning: "The Troops", ayahs: 75, rukus: 8, revelationType: "Meccan", juz: [23, 24] },
    { number: 40, name: "Ghafir", arabicName: "غافر", meaning: "The Forgiver", ayahs: 85, rukus: 9, revelationType: "Meccan", juz: [24] },
    { number: 41, name: "Fussilat", arabicName: "فصلت", meaning: "Explained in Detail", ayahs: 54, rukus: 6, revelationType: "Meccan", juz: [24, 25] },
    { number: 42, name: "Ash-Shooraa", arabicName: "الشورى", meaning: "The Consultation", ayahs: 53, rukus: 5, revelationType: "Meccan", juz: [25] },
    { number: 43, name: "Az-Zukhruf", arabicName: "الزخرف", meaning: "The Ornaments of Gold", ayahs: 89, rukus: 6, revelationType: "Meccan", juz: [25] },
    { number: 44, name: "Ad-Dukhaan", arabicName: "الدخان", meaning: "The Smoke", ayahs: 59, rukus: 3, revelationType: "Meccan", juz: [25] },
    { number: 45, name: "Al-Jaathiya", arabicName: "الجاثية", meaning: "The Crouching", ayahs: 37, rukus: 4, revelationType: "Meccan", juz: [25] },
    { number: 46, name: "Al-Ahqaaf", arabicName: "الأحقاف", meaning: "The Wind-Curved Sandhills", ayahs: 35, rukus: 4, revelationType: "Meccan", juz: [26] },
    { number: 47, name: "Muhammad", arabicName: "محمد", meaning: "Muhammad", ayahs: 38, rukus: 4, revelationType: "Medinan", juz: [26] },
    { number: 48, name: "Al-Fath", arabicName: "الفتح", meaning: "The Victory", ayahs: 29, rukus: 4, revelationType: "Medinan", juz: [26] },
    { number: 49, name: "Al-Hujuraat", arabicName: "الحجرات", meaning: "The Rooms", ayahs: 18, rukus: 2, revelationType: "Medinan", juz: [26] },
    { number: 50, name: "Qaaf", arabicName: "ق", meaning: "Qaaf", ayahs: 45, rukus: 3, revelationType: "Meccan", juz: [26] },
    { number: 51, name: "Adh-Dhaariyaat", arabicName: "الذاريات", meaning: "The Winnowing Winds", ayahs: 60, rukus: 3, revelationType: "Meccan", juz: [26, 27] },
    { number: 52, name: "At-Toor", arabicName: "الطور", meaning: "The Mount", ayahs: 49, rukus: 2, revelationType: "Meccan", juz: [27] },
    { number: 53, name: "An-Najm", arabicName: "النجم", meaning: "The Star", ayahs: 62, rukus: 3, revelationType: "Meccan", juz: [27] },
    { number: 54, name: "Al-Qamar", arabicName: "القمر", meaning: "The Moon", ayahs: 55, rukus: 3, revelationType: "Meccan", juz: [27] },
    { number: 55, name: "Ar-Rahmaan", arabicName: "الرحمن", meaning: "The Beneficent", ayahs: 78, rukus: 3, revelationType: "Medinan", juz: [27] },
    { number: 56, name: "Al-Waqi'a", arabicName: "الواقعة", meaning: "The Inevitable", ayahs: 96, rukus: 3, revelationType: "Meccan", juz: [27] },
    { number: 57, name: "Al-Hadeed", arabicName: "الحديد", meaning: "The Iron", ayahs: 29, rukus: 4, revelationType: "Medinan", juz: [27] },
    { number: 58, name: "Al-Mujaadila", arabicName: "المجادلة", meaning: "The Pleading Woman", ayahs: 22, rukus: 3, revelationType: "Medinan", juz: [28] },
    { number: 59, name: "Al-Hashr", arabicName: "الحشر", meaning: "The Exile", ayahs: 24, rukus: 3, revelationType: "Medinan", juz: [28] },
    { number: 60, name: "Al-Mumtahana", arabicName: "الممتحنة", meaning: "She That Is To Be Examined", ayahs: 13, rukus: 2, revelationType: "Medinan", juz: [28] },
    { number: 61, name: "As-Saff", arabicName: "الصف", meaning: "The Ranks", ayahs: 14, rukus: 2, revelationType: "Medinan", juz: [28] },
    { number: 62, name: "Al-Jumu'a", arabicName: "الجمعة", meaning: "The Congregation, Friday", ayahs: 11, rukus: 2, revelationType: "Medinan", juz: [28] },
    { number: 63, name: "Al-Munaafiqoon", arabicName: "المنافقون", meaning: "The Hypocrites", ayahs: 11, rukus: 2, revelationType: "Medinan", juz: [28] },
    { number: 64, name: "At-Taghaabun", arabicName: "التغابن", meaning: "The Mutual Disillusion", ayahs: 18, rukus: 2, revelationType: "Medinan", juz: [28] },
    { number: 65, name: "At-Talaaq", arabicName: "الطلاق", meaning: "The Divorce", ayahs: 12, rukus: 2, revelationType: "Medinan", juz: [28] },
    { number: 66, name: "At-Tahreem", arabicName: "التحريم", meaning: "The Prohibition", ayahs: 12, rukus: 2, revelationType: "Medinan", juz: [28] },
    { number: 67, name: "Al-Mulk", arabicName: "الملك", meaning: "The Sovereignty", ayahs: 30, rukus: 2, revelationType: "Meccan", juz: [29] },
    { number: 68, name: "Al-Qalam", arabicName: "القلم", meaning: "The Pen", ayahs: 52, rukus: 2, revelationType: "Meccan", juz: [29] },
    { number: 69, name: "Al-Haaqqa", arabicName: "الحاقة", meaning: "The Reality", ayahs: 52, rukus: 2, revelationType: "Meccan", juz: [29] },
    { number: 70, name: "Al-Ma'aarij", arabicName: "المعارج", meaning: "The Ascending Stairways", ayahs: 44, rukus: 2, revelationType: "Meccan", juz: [29] },
    { number: 71, name: "Nooh", arabicName: "نوح", meaning: "Noah", ayahs: 28, rukus: 2, revelationType: "Meccan", juz: [29] },
    { number: 72, name: "Al-Jinn", arabicName: "الجن", meaning: "The Jinn", ayahs: 28, rukus: 2, revelationType: "Meccan", juz: [29] },
    { number: 73, name: "Al-Muzzammil", arabicName: "المزمل", meaning: "The Enshrouded One", ayahs: 20, rukus: 2, revelationType: "Meccan", juz: [29] },
    { number: 74, name: "Al-Muddaththir", arabicName: "المدثر", meaning: "The Cloaked One", ayahs: 56, rukus: 2, revelationType: "Meccan", juz: [29] },
    { number: 75, name: "Al-Qiyaama", arabicName: "القيامة", meaning: "The Resurrection", ayahs: 40, rukus: 2, revelationType: "Meccan", juz: [29] },
    { number: 76, name: "Al-Insaan", arabicName: "الإنسان", meaning: "The Man", ayahs: 31, rukus: 2, revelationType: "Medinan", juz: [29] },
    { number: 77, name: "Al-Mursalaat", arabicName: "المرسلات", meaning: "The Emissaries", ayahs: 50, rukus: 2, revelationType: "Meccan", juz: [29] },
    { number: 78, name: "An-Naba", arabicName: "النبإ", meaning: "The Tidings", ayahs: 40, rukus: 2, revelationType: "Meccan", juz: [30] },
    { number: 79, name: "An-Naazi'aat", arabicName: "النازعات", meaning: "Those Who Drag Forth", ayahs: 46, rukus: 2, revelationType: "Meccan", juz: [30] },
    { number: 80, name: "Abasa", arabicName: "عبس", meaning: "He Frowned", ayahs: 42, rukus: 1, revelationType: "Meccan", juz: [30] },
    { number: 81, name: "At-Takweer", arabicName: "التكوير", meaning: "The Overthrowing", ayahs: 29, rukus: 1, revelationType: "Meccan", juz: [30] },
    { number: 82, name: "Al-Infitaar", arabicName: "الانفطار", meaning: "The Cleaving", ayahs: 19, rukus: 1, revelationType: "Meccan", juz: [30] },
    { number: 83, name: "Al-Mutaffifeen", arabicName: "المطففين", meaning: "The Defrauding", ayahs: 36, rukus: 1, revelationType: "Meccan", juz: [30] },
    { number: 84, name: "Al-Inshiqaaq", arabicName: "الانشقاق", meaning: "The Sundering", ayahs: 25, rukus: 1, revelationType: "Meccan", juz: [30] },
    { number: 85, name: "Al-Burooj", arabicName: "البروج", meaning: "The Mansions of the Stars", ayahs: 22, rukus: 1, revelationType: "Meccan", juz: [30] },
    { number: 86, name: "At-Taariq", arabicName: "الطارق", meaning: "The Nightcomer", ayahs: 17, rukus: 1, revelationType: "Meccan", juz: [30] },
    { number: 87, name: "Al-A'laa", arabicName: "الأعلى", meaning: "The Most High", ayahs: 19, rukus: 1, revelationType: "Meccan", juz: [30] },
    { number: 88, name: "Al-Ghaashiya", arabicName: "الغاشية", meaning: "The Overwhelming", ayahs: 26, rukus: 1, revelationType: "Meccan", juz: [30] },
    { number: 89, name: "Al-Fajr", arabicName: "الفجر", meaning: "The Dawn", ayahs: 30, rukus: 1, revelationType: "Meccan", juz: [30] },
    { number: 90, name: "Al-Balad", arabicName: "البلد", meaning: "The City", ayahs: 20, rukus: 1, revelationType: "Meccan", juz: [30] },
    { number: 91, name: "Ash-Shams", arabicName: "الشمس", meaning: "The Sun", ayahs: 15, rukus: 1, revelationType: "Meccan", juz: [30] },
    { number: 92, name: "Al-Layl", arabicName: "الليل", meaning: "The Night", ayahs: 21, rukus: 1, revelationType: "Meccan", juz: [30] },
    { number: 93, name: "Ad-Dhuhaa", arabicName: "الضحى", meaning: "The Morning Hours", ayahs: 11, rukus: 1, revelationType: "Meccan", juz: [30] },
    { number: 94, name: "Ash-Sharh", arabicName: "الشرح", meaning: "The Relief", ayahs: 8, rukus: 1, revelationType: "Meccan", juz: [30] },
    { number: 95, name: "At-Teen", arabicName: "التين", meaning: "The Fig", ayahs: 8, rukus: 1, revelationType: "Meccan", juz: [30] },
    { number: 96, name: "Al-Alaq", arabicName: "العلق", meaning: "The Clot", ayahs: 19, rukus: 1, revelationType: "Meccan", juz: [30] },
    { number: 97, name: "Al-Qadr", arabicName: "القدر", meaning: "The Power", ayahs: 5, rukus: 1, revelationType: "Meccan", juz: [30] },
    { number: 98, name: "Al-Bayyina", arabicName: "البينة", meaning: "The Clear Proof", ayahs: 8, rukus: 1, revelationType: "Medinan", juz: [30] },
    { number: 99, name: "Az-Zalzala", arabicName: "الزلزلة", meaning: "The Earthquake", ayahs: 8, rukus: 1, revelationType: "Medinan", juz: [30] },
    { number: 100, name: "Al-Aadiyaat", arabicName: "العاديات", meaning: "The Courser", ayahs: 11, rukus: 1, revelationType: "Meccan", juz: [30] },
    { number: 101, name: "Al-Qaari'a", arabicName: "القارعة", meaning: "The Calamity", ayahs: 11, rukus: 1, revelationType: "Meccan", juz: [30] },
    { number: 102, name: "At-Takaathur", arabicName: "التكاثر", meaning: "The Rivalry in World Increase", ayahs: 8, rukus: 1, revelationType: "Meccan", juz: [30] },
    { number: 103, name: "Al-Asr", arabicName: "العصر", meaning: "The Declining Day", ayahs: 3, rukus: 1, revelationType: "Meccan", juz: [30] },
    { number: 104, name: "Al-Humaza", arabicName: "الهمزة", meaning: "The Traducer", ayahs: 9, rukus: 1, revelationType: "Meccan", juz: [30] },
    { number: 105, name: "Al-Feel", arabicName: "الفيل", meaning: "The Elephant", ayahs: 5, rukus: 1, revelationType: "Meccan", juz: [30] },
    { number: 106, name: "Quraysh", arabicName: "قريش", meaning: "Quraysh", ayahs: 4, rukus: 1, revelationType: "Meccan", juz: [30] },
    { number: 107, name: "Al-Maa'oon", arabicName: "الماعون", meaning: "The Small Kindnesses", ayahs: 7, rukus: 1, revelationType: "Meccan", juz: [30] },
    { number: 108, name: "Al-Kawthar", arabicName: "الكوثر", meaning: "The Abundance", ayahs: 3, rukus: 1, revelationType: "Meccan", juz: [30] },
    { number: 109, name: "Al-Kaafiroon", arabicName: "الكافرون", meaning: "The Disbelievers", ayahs: 6, rukus: 1, revelationType: "Meccan", juz: [30] },
    { number: 110, name: "An-Nasr", arabicName: "النصر", meaning: "The Divine Support", ayahs: 3, rukus: 1, revelationType: "Medinan", juz: [30] },
    { number: 111, name: "Al-Masad", arabicName: "المسد", meaning: "The Palm Fiber", ayahs: 5, rukus: 1, revelationType: "Meccan", juz: [30] },
    { number: 112, name: "Al-Ikhlaas", arabicName: "الإخلاص", meaning: "The Sincerity", ayahs: 4, rukus: 1, revelationType: "Meccan", juz: [30] },
    { number: 113, name: "Al-Falaq", arabicName: "الفلق", meaning: "The Daybreak", ayahs: 5, rukus: 1, revelationType: "Meccan", juz: [30] },
    { number: 114, name: "An-Naas", arabicName: "الناس", meaning: "Mankind", ayahs: 6, rukus: 1, revelationType: "Meccan", juz: [30] }
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
