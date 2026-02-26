import { useState, useEffect } from 'react';
import { surahData, translations as translationData } from '../data/quranData';
import quranService from '../services/quranService';
import quranServiceV2 from '../services/quranServiceV2';

// Check if V2 script is available locally
const V2_SCRIPTS = [
    'quran-uthmani', 'quran-uthmani-min', 'quran-tajweed', 'quran-wordbyword',
    'quran-simple', 'quran-simple-clean', 'quran-simple-enhanced', 'quran-simple-min',
    'quran-kids', 'quran-indopak', 'quran-indopak-tajweed'
];

// eslint-disable-next-line no-unused-vars
const V2_TRANSLATIONS = [
    'en-sahih', 'en-pickthall', 'en-yusufali',
    'bn-bengali', 'ur-jalandhry', 'ur-maududi', 'ar-muyassar', 'ar-jalalayn',
    // New Offline Tafsirs
    'bn-tafisr-fathul-majid', 'en-tafisr-ibn-kathir', 'ar-tafsir-ibn-kathir',
    'bn-tafseer-ibn-e-kaseer', 'bn-tafsir-ahsanul-bayaan', 'bn-tafsir-abu-bakr-zakaria',
    'en-tafsir-maarif-ul-quran', 'ru-tafseer-al-saddi', 'ar-tafseer-al-saddi',
    'ar-tafsir-al-baghawi', 'ar-tafseer-tanwir-al-miqbas', 'ar-tafsir-al-wasit',
    'ar-tafsir-al-tabari', 'ar-tafsir-muyassar', 'ar-tafseer-al-qurtubi',
    'kurd-tafsir-rebar', 'ur-tafseer-ibn-e-kaseer', 'ur-tafsir-bayan-ul-quran',
    'ur-tazkirul-quran', 'en-tazkirul-quran', 'en-kashf-al-asrar-tafsir',
    'en-al-qushairi-tafsir', 'en-kashani-tafsir', 'en-tafsir-al-tustari',
    'en-asbab-al-nuzul-by-al-wahidi', 'en-tafsir-ibn-abbas', 'en-al-jalalayn'
];


// Normalize edition ID (dots to dashes for V2 paths)
const normalizeEditionId = (id) => id.replace('.', '-');

export const useSurahList = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const surahs = await quranServiceV2.getAllSurahs();
                if (surahs && surahs.length > 0) {
                    setData(surahs);
                    setLoading(false);
                    return;
                }
            } catch (err) {
                console.log('V2 surah list not available', err);
                setError(err);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };
};

export const useSurahDetail = (number, transliterationType = 'none', selectedScript = 'quran-uthmani', selectedTranslation = 'en.sahih', selectedTafsir = 'none') => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!number) return;

        const fetchData = async () => {
            setLoading(true);

            const normalizedScript = normalizeEditionId(selectedScript);
            const normalizedTranslation = selectedTranslation !== 'none' ? normalizeEditionId(selectedTranslation) : 'none';
            const normalizedTafsir = selectedTafsir !== 'none' ? normalizeEditionId(selectedTafsir) : 'none';

            const useV2Script = V2_SCRIPTS.includes(normalizedScript);
            // Allow any selected translation/tafsir to attempt fetch, don't whitelist
            const useV2Translation = normalizedTranslation !== 'none';
            const useV2Tafsir = normalizedTafsir !== 'none';

            try {
                let arabic, translation, tafsirData;

                // --- Fetch Arabic script ---
                if (useV2Script) {
                    try {
                        arabic = await quranServiceV2.getSurah(number, normalizedScript, 'arabic');
                    } catch (err) {
                        console.log(`V2 script ${normalizedScript} not available`);
                    }
                }

                // --- Fetch Translation (if selected) ---
                if (normalizedTranslation !== 'none') {
                    if (useV2Translation) {
                        try {
                            const item = translationData[selectedTranslation];
                            if (item?.type === 'tafsir') {
                                translation = await quranServiceV2.getTafsirSurah(number, normalizedTranslation);
                            } else {
                                translation = await quranServiceV2.getTranslationSurah(number, normalizedTranslation);
                            }
                        } catch (err) {
                            console.log(`V2 translation ${normalizedTranslation} not available`);
                        }
                    }
                }

                // --- Fetch Tafsir (if selected, independent) ---
                if (normalizedTafsir !== 'none') {
                    if (useV2Tafsir) {
                        try {
                            tafsirData = await quranServiceV2.getTafsirSurah(number, normalizedTafsir);
                        } catch (err) {
                            console.log(`V2 tafsir ${normalizedTafsir} not available`);
                        }
                    }
                }

                // --- Placeholder for V2 items that failed to load ---
                if (arabic && !translation && useV2Translation) {
                    translation = {
                        ayahs: arabic.ayahs.map(() => ({
                            text: 'Translation not downloaded. Please download data.'
                        }))
                    };
                }
                if (arabic && !tafsirData && useV2Tafsir) {
                    tafsirData = {
                        ayahs: arabic.ayahs.map(() => ({
                            text: 'Tafsir not downloaded. Please download data.'
                        }))
                    };
                }

                // Removed API fallback as per request
                if (!arabic || (normalizedTranslation !== 'none' && !translation)) {
                    // Just log or throw if critical data missing
                    console.warn('Arabic or Translation data missing locally');
                    if (!arabic) throw new Error('Surah data not available locally');
                }

                // --- Transliteration ---
                let startMap = {};
                if (transliterationType !== 'none') {
                    try {
                        const transId = transliterationType === 'bn_v1' ? 'en-transliteration' : normalizeEditionId(transliterationType);
                        const transResult = await quranServiceV2.getSurah(number, transId, 'transliterations');
                        if (transResult && transResult.ayahs) {
                            transResult.ayahs.forEach(item => {
                                const key = item.numberInSurah || item.number;
                                startMap[key] = item.text;
                            });
                        }
                    } catch (v2Err) {
                        console.log(`V2 transliteration missing`);
                        if (transliterationType === 'bn_v1') {
                            const transJson = await quranService.transliteration.getLocal('bn_v1');
                            const surahTrans = transJson[number];
                            if (surahTrans && surahTrans.transliteration) {
                                surahTrans.transliteration.forEach(item => {
                                    startMap[item.verse] = item.text;
                                });
                            }
                        }
                    }
                }

                // --- Merge all data ---
                const mergedAyahs = arabic.ayahs.map((ayah, index) => ({
                    ...ayah,
                    numberInSurah: ayah.numberInSurah || ayah.number,
                    translation: translation?.ayahs?.[index]?.text || '',
                    tafsir: tafsirData?.ayahs?.[index]?.text || '',
                    transliteration: startMap[ayah.numberInSurah || ayah.number] || null
                }));

                setData({
                    ...arabic,
                    ayahs: mergedAyahs,
                    name: arabic.name,
                    englishName: arabic.englishName
                });
                setLoading(false);

            } catch (err) {
                console.error('Error fetching surah:', err);
                setError(err);
                setLoading(false);
            }
        };

        fetchData();
    }, [number, transliterationType, selectedScript, selectedTranslation, selectedTafsir]);

    return { data, loading, error };
};

// Calculate absolute ayah number dynamically from surahData
export const getAbsoluteAyahNumber = (surahNumber, ayahInSurah) => {
    if (surahNumber < 1 || surahNumber > 114) return ayahInSurah;

    let offset = 0;
    for (let i = 0; i < surahNumber - 1; i++) {
        offset += surahData[i].ayahs;
    }
    return offset + ayahInSurah;
};
