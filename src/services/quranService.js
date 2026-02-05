/**
 * Quran Service
 * Handles fetching of Surah lists, details, and transliterations.
 */

import { API_BASE_URL } from './api';

const quranService = {
    /**
     * Get list of all Surahs
     */
    getAllSurahs: async () => {
        const response = await fetch(`${API_BASE_URL}/surah`);
        return response.json();
    },

    /**
     * Get detailed data for a specific Surah
     * @param {number} number - Surah number
     * @param {string} editions - Comma-separated edition identifiers (e.g., "quran-uthmani,en.sahih")
     */
    getSurahDetails: async (number, editions) => {
        const response = await fetch(`${API_BASE_URL}/surah/${number}/editions/${editions}`);
        return response.json();
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
