import { useState, useEffect } from 'react';
import { surahData } from '../data/quranData';

const API_BASE = 'http://api.alquran.cloud/v1';

export const useSurahList = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${API_BASE}/surah`)
            .then(res => res.json())
            .then(json => {
                setData(json.data);
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
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
            try {
                // Build editions string based on selections
                const editions = `${selectedScript},${selectedTranslation}`;

                // 1. Fetch Core Data (Arabic Script + Selected Translation)
                const apiRes = await fetch(`${API_BASE}/surah/${number}/editions/${editions}`);
                const apiJson = await apiRes.json();

                if (apiJson.code !== 200 || !apiJson.data || apiJson.data.length < 2) {
                    throw new Error('Failed to fetch surah data');
                }

                const arabic = apiJson.data[0];
                const translation = apiJson.data[1];

                let startMap = {};

                // 2. Fetch/Process Transliteration
                if (transliterationType === 'bn_v1') {
                    try {
                        const transRes = await fetch('/data/transliteration_bn_v1.json');
                        const transJson = await transRes.json();
                        const surahTrans = transJson[number];
                        if (surahTrans && surahTrans.transliteration) {
                            surahTrans.transliteration.forEach(item => {
                                startMap[item.verse] = item.text;
                            });
                        }
                    } catch (err) {
                        console.error("Failed to load local transliteration", err);
                    }
                }

                // 3. Merge
                const mergedAyahs = arabic.ayahs.map((ayah, index) => ({
                    ...ayah,
                    translation: translation.ayahs[index]?.text || '',
                    transliteration: startMap[ayah.numberInSurah] || null
                }));

                setData({ ...arabic, ayahs: mergedAyahs });
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

// Helper to get audio URL using alquran.cloud CDN
// Format: https://cdn.islamic.network/quran/audio/{bitrate}/{edition}/{ayah_number}.mp3
export const getAudioUrl = (reciter, absoluteAyahNumber, bitrate = 128) => {
    return `https://cdn.islamic.network/quran/audio/${bitrate}/${reciter}/${absoluteAyahNumber}.mp3`;
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
