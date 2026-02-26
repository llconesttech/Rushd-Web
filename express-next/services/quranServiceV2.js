import { apiFetch } from '@/lib/apiClient';

export const getMeta = () => apiFetch('/quran/meta');

export const getAllSurahs = async () => {
    const meta = await getMeta();
    return meta.surahs;
};

export const getSurah = (surahNumber, edition, type = 'arabic') =>
    apiFetch(`/quran/surah/${surahNumber}?edition=${edition}&type=${type}`);

export const getArabicSurah = (surahNumber, script = 'quran-uthmani') =>
    getSurah(surahNumber, script, 'arabic');

export const getTranslationSurah = (surahNumber, translationId = 'en-sahih') =>
    getSurah(surahNumber, translationId, 'translations');

export const getTafsirSurah = (surahNumber, tafsirId) =>
    getSurah(surahNumber, tafsirId, 'tafsir');

export const getAyah = async (surahNumber, ayahNumber, edition, type = 'arabic') => {
    const surah = await getSurah(surahNumber, edition, type);
    return surah.ayahs.find(a => a.number === ayahNumber);
};

export const getSurahWithTranslation = async (surahNumber, arabicScript = 'quran-uthmani', translationId = 'en-sahih') => {
    const [arabic, translation] = await Promise.all([
        getArabicSurah(surahNumber, arabicScript),
        getTranslationSurah(surahNumber, translationId),
    ]);

    return {
        number: arabic.number,
        name: arabic.name,
        englishName: arabic.englishName,
        ayahs: arabic.ayahs.map((arabicAyah, index) => ({
            ...arabicAyah,
            translation: translation.ayahs[index]?.text || '',
        })),
    };
};

export const getArabicScripts = async () => (await getMeta()).arabicScripts;
export const getTranslations = async () => (await getMeta()).translations;

export const search = async (query, options = {}) => {
    const { edition = 'en-sahih', limit = 50 } = options;
    if (!query?.trim()) return [];
    return apiFetch(`/quran/search?q=${encodeURIComponent(query)}&edition=${edition}&limit=${limit}`);
};

export const clearCache = () => {
    // Cache is now managed by apiClient
};

const quranServiceV2 = {
    getMeta, getAllSurahs, getSurah, getArabicSurah,
    getTranslationSurah, getAyah, getSurahWithTranslation,
    getArabicScripts, getTranslations, search, getTafsirSurah, clearCache,
};

export default quranServiceV2;
