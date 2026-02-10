/**
 * Quran Service
 * Handles fetching of Surah lists, details, and transliterations.
 */



const quranService = {
    /**
     * Get list of all Surahs
     */
    /**
     * Get list of all Surahs
     * @deprecated Use quranServiceV2.getAllSurahs() instead
     */
    getAllSurahs: async () => {
        throw new Error("Direct API access removed. Use quranServiceV2 for local data.");
    },

    /**
     * Get detailed data for a specific Surah
     * @deprecated Use quranServiceV2.getSurah() instead
     */
    getSurahDetails: async (number, editions) => {
        throw new Error("Direct API access removed. Use quranServiceV2 for local data.");
    },

    transliteration: {
        /**
         * Fetch local transliteration file
         * @param {string} type - Transliteration type identifier (e.g., 'bn_v1')
         */
        getLocal: async (type) => {
            const response = await fetch(`/data/transliteration_${type}.json`);
            return response.json();
        }
    }
};

export default quranService;
