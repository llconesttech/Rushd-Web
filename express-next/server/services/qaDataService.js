import { readFile } from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'server', 'data', 'hadith-qa');
const cache = new Map();

async function readJSON(filePath) {
    if (cache.has(filePath)) return cache.get(filePath);
    const raw = await readFile(filePath, 'utf-8');
    const data = JSON.parse(raw);
    cache.set(filePath, data);
    return data;
}

export async function getMacroIndex() {
    return readJSON(path.join(DATA_DIR, 'qa_macro_index.json'));
}

export async function getSearchIndex() {
    return readJSON(path.join(DATA_DIR, 'qa_search_index.json'));
}

export async function getTopics() {
    return readJSON(path.join(DATA_DIR, 'qa_topics.json'));
}

export async function getChapter(book, chapter) {
    return readJSON(path.join(DATA_DIR, book, `${chapter}.json`));
}
