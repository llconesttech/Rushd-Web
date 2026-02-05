/**
 * Audio Service
 * Handles generation of audio URLs for various reciters and formats.
 */

import { AUDIO_CDN_URL, AUDIO_BASE_URL } from './api';

const audioService = {
    /**
     * Construct audio URL for a specific verse
     * @param {string} reciter - Reciter identifier
     * @param {number} absoluteAyahNumber - Absolute ayah number (1-6236)
     * @param {number} bitrate - Audio bitrate (default: 128)
     */
    getUrl: (reciter, absoluteAyahNumber, bitrate = 128) => {
        return `${AUDIO_CDN_URL}/${bitrate}/${reciter}/${absoluteAyahNumber}.mp3`;
    },

    /**
     * Construct audio URL using legacy GlobalQuran format
     * @param {string} reciter 
     * @param {number} surah 
     * @param {number} ayah 
     * @param {string} format 
     * @param {string} kbs 
     */
    getLegacyUrl: (reciter, surah, ayah, format = 'mp3', kbs = '128') => {
        const surahPadded = String(surah).padStart(3, '0');
        const ayahPadded = String(ayah).padStart(3, '0');
        return `${AUDIO_BASE_URL}/${format}/${reciter}/${kbs}/${surahPadded}${ayahPadded}.${format}`;
    }
};

export default audioService;
