import { readFile } from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'server', 'data', 'quran', 'v2');
const cache = new Map();

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

export async function getSurah(number, edition, type) {
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

export async function search(query, edition, limit = 50) {
    const results = [];
    const q = query.trim().toLowerCase();
    for (let s = 1; s <= 114; s++) {
        try {
            const data = await getSurah(s, edition, 'translations');
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
