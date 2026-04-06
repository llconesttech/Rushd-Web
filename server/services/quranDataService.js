import { readFile } from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'server', 'data', 'quran', 'v2');
const cache = new Map();
let bnStrictTranslitCache = null;
let metaSurahNameCache = null;

async function readJSON(filePath) {
    if (cache.has(filePath)) return cache.get(filePath);
    const raw = await readFile(filePath, 'utf-8');
    const data = JSON.parse(raw);
    cache.set(filePath, data);
    return data;
}

export async function getMeta() {
    return readJSON(path.join(DATA_DIR, 'meta.json'));
}

async function getBnStrictTranslitSurah(number) {
    if (!bnStrictTranslitCache) {
        if (!metaSurahNameCache) {
            const meta = await getMeta();
            metaSurahNameCache = new Map(
                (meta?.surahs || []).map((s) => [Number(s.number), s.englishName]),
            );
        }

        const filePath = path.join(
            DATA_DIR,
            'transliterations',
            'bn-transliteration',
            'strict_tajweed_full_perfected.json',
        );
        const all = await readJSON(filePath);
        // Convert into a surah_no -> normalized V2 shape map for quick lookup/search.
        bnStrictTranslitCache = new Map(
            all.map((s) => [
                Number(s.surah_no),
                {
                    number: Number(s.surah_no),
                    englishName: metaSurahNameCache?.get(Number(s.surah_no)),
                    ayahs: (s.verses || []).map((v) => ({
                        numberInSurah: Number(v.ayah_no),
                        number: Number(v.ayah_no),
                        text:
                            v?.transliteration?.strict_tajweed ??
                            v?.transliteration?.standard ??
                            '',
                    })),
                },
            ]),
        );
    }

    const found = bnStrictTranslitCache.get(Number(number));
    if (!found) {
        throw new Error(`Bengali transliteration not found for surah ${number}`);
    }
    return found;
}

export async function getSurah(number, edition, type) {
    // Bengali transliteration currently ships as a single bundled JSON; normalize it at runtime.
    if (type === 'transliterations' && edition === 'bn-transliteration') {
        return getBnStrictTranslitSurah(number);
    }

    return readJSON(path.join(DATA_DIR, type, edition, `${number}.json`));
}

export async function getPage(script, pageNum) {
    return readJSON(path.join(DATA_DIR, 'pages', script, `${pageNum}.json`));
}

export async function getTafsirMeta() {
    return readJSON(path.join(DATA_DIR, 'tafsir_metadata.json'));
}

export async function getShanENuzool(edition, surahNumber) {
    return readJSON(path.join(DATA_DIR, 'shan-e-nuzool', edition, `${surahNumber}.json`));
}

export async function search(query, edition, type = 'translations', limit = 50) {
    const results = [];
    const q = query.trim().toLowerCase();
    for (let s = 1; s <= 114; s++) {
        try {
            const data = await getSurah(s, edition, type);
            for (const ayah of data.ayahs) {
                if (ayah.text.toLowerCase().includes(q)) {
                    results.push({
                        surah: s,
                        surahName: data.englishName,
                        ayah: ayah.number,
                        text: ayah.text,
                        juz: ayah.juz,
                        page: ayah.page,
                    });
                    if (results.length >= limit) return results;
                }
            }
        } catch { /* skip unavailable surahs */ }
    }
    return results;
}
