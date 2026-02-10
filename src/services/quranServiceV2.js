/**
 * Quran Service V2
 * 
 * Serves Quran data from local JSON files (no API dependency).
 * Uses lazy loading per-surah for efficient memory usage.
 * 
 * API:
 *   getAllSurahs() - Get list of all surahs with metadata
 *   getSurah(surahNumber, edition) - Get a single surah
 *   getAyah(surahNumber, ayahNumber, edition) - Get a single ayah
 *   search(query, options) - Search across translations
 */

const DATA_BASE = '/data/quran/v2';

// Cache for loaded data
const cache = {
    meta: null,
    surahs: {} // { 'arabic/quran-uthmani/1': {...} }
};

/**
 * Fetch JSON with caching
 */
const fetchJSON = async (path) => {
    const response = await fetch(`${DATA_BASE}/${path}`);
    if (!response.ok) {
        throw new Error(`Failed to load: ${path}`);
    }
    return response.json();
};

/**
 * Get metadata (all surahs list, available editions)
 */
export const getMeta = async () => {
    if (!cache.meta) {
        cache.meta = await fetchJSON('meta.json');
    }
    return cache.meta;
};

/**
 * Get list of all surahs with metadata
 */
export const getAllSurahs = async () => {
    const meta = await getMeta();
    return meta.surahs;
};

/**
 * Get a single surah
 * @param {number} surahNumber - 1-114
 * @param {string} edition - e.g., 'quran-uthmani', 'en-sahih'
 * @param {string} type - 'arabic' or 'translations'
 */
export const getSurah = async (surahNumber, edition, type = 'arabic') => {
    const cacheKey = `${type}/${edition}/${surahNumber}`;

    if (!cache.surahs[cacheKey]) {
        const path = `${type}/${edition}/${surahNumber}.json`;
        cache.surahs[cacheKey] = await fetchJSON(path);
    }

    return cache.surahs[cacheKey];
};

/**
 * Get Arabic text for a surah
 */
export const getArabicSurah = async (surahNumber, script = 'quran-uthmani') => {
    return getSurah(surahNumber, script, 'arabic');
};

/**
 * Get translation for a surah
 */
export const getTranslationSurah = async (surahNumber, translationId = 'en-sahih') => {
    return getSurah(surahNumber, translationId, 'translations');
};

/**
 * Get tafsir for a surah
 */
export const getTafsirSurah = async (surahNumber, tafsirId) => {
    return getSurah(surahNumber, tafsirId, 'tafsir');
};

/**
 * Get a single ayah
 */
export const getAyah = async (surahNumber, ayahNumber, edition, type = 'arabic') => {
    const surah = await getSurah(surahNumber, edition, type);
    return surah.ayahs.find(a => a.number === ayahNumber);
};

/**
 * Get surah with multiple editions (Arabic + translation)
 */
export const getSurahWithTranslation = async (surahNumber, arabicScript = 'quran-uthmani', translationId = 'en-sahih') => {
    const [arabic, translation] = await Promise.all([
        getArabicSurah(surahNumber, arabicScript),
        getTranslationSurah(surahNumber, translationId)
    ]);

    // Merge ayahs
    const ayahs = arabic.ayahs.map((arabicAyah, index) => ({
        ...arabicAyah,
        translation: translation.ayahs[index]?.text || ''
    }));

    return {
        number: arabic.number,
        name: arabic.name,
        englishName: arabic.englishName,
        ayahs
    };
};

/**
 * Get available Arabic scripts
 */
export const getArabicScripts = async () => {
    const meta = await getMeta();
    return meta.arabicScripts;
};

/**
 * Get available translations
 */
export const getTranslations = async () => {
    const meta = await getMeta();
    return meta.translations;
};

/**
 * Search across text
 * @param {string} query - Search query
 * @param {object} options - { edition, type, limit }
 */
export const search = async (query, options = {}) => {
    const {
        edition = 'en-sahih',
        type = 'translations',
        limit = 50
    } = options;

    const results = [];
    const queryLower = query.toLowerCase();

    // Search through all surahs
    for (let surah = 1; surah <= 114; surah++) {
        try {
            const data = await getSurah(surah, edition, type);

            for (const ayah of data.ayahs) {
                if (ayah.text.toLowerCase().includes(queryLower)) {
                    results.push({
                        surah: surah,
                        surahName: data.englishName,
                        ayah: ayah.number,
                        text: ayah.text,
                        juz: ayah.juz,
                        page: ayah.page
                    });

                    if (results.length >= limit) {
                        return results;
                    }
                }
            }
        } catch (error) {
            // Skip if surah not available for this edition
            console.warn(`Search: Skipping surah ${surah} for ${edition}`);
        }
    }

    return results;
};

/**
 * Clear cache
 */
export const clearCache = () => {
    cache.meta = null;
    cache.surahs = {};
};

// Export as default object for backward compatibility
const quranServiceV2 = {
    getMeta,
    getAllSurahs,
    getSurah,
    getArabicSurah,
    getTranslationSurah,
    getAyah,
    getSurahWithTranslation,
    getArabicScripts,
    getTranslations,
    search,
    getTafsirSurah,
    clearCache
};

export default quranServiceV2;
