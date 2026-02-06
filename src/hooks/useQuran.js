import { useState, useEffect } from 'react';
import { surahData } from '../data/quranData';
import quranService from '../services/quranService';
import quranServiceV2 from '../services/quranServiceV2';

// Check if V2 script is available locally
const V2_SCRIPTS = [
    'quran-uthmani', 'quran-uthmani-min', 'quran-tajweed', 'quran-wordbyword',
    'quran-simple', 'quran-simple-clean', 'quran-simple-enhanced', 'quran-simple-min',
    'quran-kids', 'quran-indopak'
];

const V2_TRANSLATIONS = [
    'en-sahih', 'en-pickthall', 'en-yusufali',
    'bn-bengali', 'ur-jalandhry', 'ur-maududi', 'ar-muyassar'
];

// Normalize edition ID (dots to dashes for V2 paths)
const normalizeEditionId = (id) => id.replace('.', '-');

export const useSurahList = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Try V2 first (local), fallback to API
        const fetchData = async () => {
            try {
                const surahs = await quranServiceV2.getAllSurahs();
                if (surahs && surahs.length > 0) {
                    setData(surahs);
                    setLoading(false);
                    return;
                }
            } catch (err) {
                console.log('V2 surah list not available, falling back to API');
            }

            // Fallback to API
            try {
                const json = await quranService.getAllSurahs();
                setData(json.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };
};

export const useSurahDetail = (number, transliterationType = 'none', selectedScript = 'quran-uthmani', selectedTranslation = 'en.sahih') => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!number) return;

        const fetchData = async () => {
            setLoading(true);

            const normalizedScript = normalizeEditionId(selectedScript);
            const normalizedTranslation = normalizeEditionId(selectedTranslation);

            const useV2Script = V2_SCRIPTS.includes(normalizedScript);
            const useV2Translation = V2_TRANSLATIONS.includes(normalizedTranslation);

            try {
                let arabic, translation;

                // Try V2 for script
                if (useV2Script) {
                    try {
                        arabic = await quranServiceV2.getSurah(number, normalizedScript, 'arabic');
                    } catch (err) {
                        console.log(`V2 script ${normalizedScript} not available`);
                    }
                }

                // Try V2 for translation
                if (useV2Translation) {
                    try {
                        translation = await quranServiceV2.getSurah(number, normalizedTranslation, 'translations');
                    } catch (err) {
                        console.log(`V2 translation ${normalizedTranslation} not available`);
                    }
                }

                // Fallback to API if V2 failed
                if (!arabic || !translation) {
                    const editions = `${selectedScript},${selectedTranslation}`;
                    const apiJson = await quranService.getSurahDetails(number, editions);

                    if (apiJson.code !== 200 || !apiJson.data || apiJson.data.length < 2) {
                        throw new Error('Failed to fetch surah data');
                    }

                    if (!arabic) arabic = apiJson.data[0];
                    if (!translation) {
                        translation = {
                            ayahs: apiJson.data[1].ayahs.map(a => ({ ...a, text: a.text }))
                        };
                    }
                }

                let startMap = {};

                // Fetch/Process Transliteration
                // Fetch/Process Transliteration
                if (transliterationType !== 'none') {
                    try {
                        // Map legacy type 'bn_v1' to 'en-transliteration' (V2)
                        // The legacy content was English transliteration despite the name
                        const transId = transliterationType === 'bn_v1' ? 'en-transliteration' : normalizeEditionId(transliterationType);

                        try {
                            const transData = await quranServiceV2.getSurah(number, transId, 'transliterations');

                            if (transData && transData.ayahs) {
                                transData.ayahs.forEach(item => {
                                    // Use numberInSurah for mapping (1,2,3...) not number (absolute ayah number)
                                    const key = item.numberInSurah || item.number;
                                    startMap[key] = item.text;
                                });
                            }
                        } catch (v2Err) {
                            console.log(`V2 transliteration ${transId} missing`);

                            // Fallback to legacy local file if V2 fails
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
                    } catch (err) {
                        console.error("Transliteration load error", err);
                    }
                }

                // Merge data - handle both V2 and API formats
                const mergedAyahs = arabic.ayahs.map((ayah, index) => ({
                    ...ayah,
                    numberInSurah: ayah.numberInSurah || ayah.number,
                    translation: translation.ayahs[index]?.text || '',
                    transliteration: startMap[ayah.numberInSurah || ayah.number] || null
                }));

                setData({
                    ...arabic,
                    ayahs: mergedAyahs,
                    // Ensure name fields exist
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
    }, [number, transliterationType, selectedScript, selectedTranslation]);

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
