import { readFile } from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'server', 'data', 'hadith');
const cache = new Map();

async function readJSON(filePath) {
    if (cache.has(filePath)) return cache.get(filePath);
    const raw = await readFile(filePath, 'utf-8');
    const data = JSON.parse(raw);
    cache.set(filePath, data);
    return data;
}

export async function getEditions() {
    return readJSON(path.join(DATA_DIR, 'editions.json'));
}

export async function getInfo() {
    return readJSON(path.join(DATA_DIR, 'info.json'));
}

export async function getNarratorMaster() {
    return readJSON(path.join(DATA_DIR, 'narrator_master.json'));
}

export async function getNarratorClusters() {
    return readJSON(path.join(DATA_DIR, 'narrator_clusters.json'));
}

export async function getEdition(bookId, lang) {
    return readJSON(path.join(DATA_DIR, bookId, `${lang}-${bookId}.json`));
}
