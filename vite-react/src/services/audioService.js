/**
 * Audio Service
 * Handles generation of audio URLs for various reciters and formats.
 */


import { reciters } from '../data/quranData';

const pad = (num) => String(num).padStart(3, '0');

const audioService = {
    /**
     * Get local audio file path
     * @param {string} reciterId 
     * @param {number} surah 
     * @param {number} ayah 
     */
    getLocalUrl: (reciterId, surah, ayah) => {
        const reciter = reciters[reciterId];
        if (!reciter) return null;
        return `/audio/${reciterId}/${pad(surah)}${pad(ayah)}.mp3`;
    },

    /**
     * Get remote audio URL (EveryAyah)
     * @param {string} reciterId 
     * @param {number} surah 
     * @param {number} ayah 
     */
    getRemoteUrl: (reciterId, surah, ayah) => {
        const reciter = reciters[reciterId];
        const subfolder = reciter?.subfolder || 'Alafasy_64kbps'; // Default fallback
        return `https://everyayah.com/data/${subfolder}/${pad(surah)}${pad(ayah)}.mp3`;
    }
};

export default audioService;
