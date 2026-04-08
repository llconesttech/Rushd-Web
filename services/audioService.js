import { reciters } from '@/data/quranData';

const pad = (num) => String(num).padStart(3, '0');

const audioService = {
    getLocalUrl: (reciterId, surah, ayah) => {
        const reciter = reciters[reciterId];
        if (!reciter) return null;
        return `/api/v1/audio/${reciterId}/${pad(surah)}${pad(ayah)}.mp3`;
    },

    getRemoteUrl: (reciterId, surah, ayah) => {
        const reciter = reciters[reciterId];
        const subfolder = reciter?.subfolder || 'Alafasy_64kbps';
        return `https://everyayah.com/data/${subfolder}/${pad(surah)}${pad(ayah)}.mp3`;
    },
};

export default audioService;
