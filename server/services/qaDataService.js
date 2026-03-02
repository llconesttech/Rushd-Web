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

function extractBookChapter(ref) {
    const match = ref.match(/Sahih\s+(al-)?(\w+)\s+(\d+)/i);
    if (match) {
        const bookMap = {
            'bukhari': 'bukhari',
            'muslim': 'muslim',
            'tirmidhi': 'tirmidhi',
            'ahmad': 'ahmad',
            'abudawud': 'abudawud',
            'nasai': 'nasai',
            'ibnmajah': 'ibnmajah',
            'darimi': 'darimi',
            'malik': 'malik'
        };
        const book = bookMap[match[2].toLowerCase()];
        if (book) return { book, hadithNumber: parseInt(match[3]) };
    }
    return null;
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

export async function getCategories() {
    const topics = await getTopics();
    const categories = Object.entries(topics).map(([category, subcategories]) => {
        const subcategoryList = Object.entries(subcategories).map(([sub, ids]) => ({
            name: sub,
            count: ids.length
        }));
        const totalCount = subcategoryList.reduce((sum, s) => sum + s.count, 0);
        return {
            name: category,
            subcategories: subcategoryList,
            totalCount
        };
    });
    return categories.sort((a, b) => b.totalCount - a.totalCount);
}

export async function getSubcategories(category) {
    const topics = await getTopics();
    const subcategories = topics[category];
    if (!subcategories) return null;
    
    const result = Object.entries(subcategories).map(([name, ids]) => ({
        name,
        count: ids.length,
        sampleIds: ids.slice(0, 5)
    }));
    return {
        category,
        subcategories: result
    };
}

export async function getQABySubcategory(category, subcategory, { page = 1, limit = 20 } = {}) {
    const topics = await getTopics();
    const subcategories = topics[category];
    if (!subcategories) return null;
    
    const ids = subcategories[subcategory];
    if (!ids) return null;
    
    const allItems = [];
    const idSet = new Set(ids);
    
    const books = ['bukhari', 'muslim', 'tirmidhi', 'ahmad'];
    for (const book of books) {
        const macroIndex = (await getMacroIndex())[book];
        if (!macroIndex) continue;
        
        for (const ch of macroIndex.chapters) {
            const chapterData = await getChapter(book, ch.chapter);
            const matching = chapterData.filter(item => idSet.has(item.id));
            allItems.push(...matching);
        }
    }
    
    const total = allItems.length;
    const start = (page - 1) * limit;
    const items = allItems.slice(start, start + limit);
    
    return {
        category,
        subcategory,
        items,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasMore: start + limit < total
        }
    };
}

export async function getQAItem(id) {
    const parts = id.split('-');
    if (parts.length < 3) return null;
    
    const book = parts[0];
    const chapter = parts[1];
    
    try {
        const chapterData = await getChapter(book, chapter);
        return chapterData.find(item => item.id === id) || null;
    } catch {
        return null;
    }
}

export async function searchQA(query, { page = 1, limit = 20 } = {}) {
    if (!query || query.trim().length < 2) {
        return { results: [], pagination: { page, limit, total: 0, totalPages: 0, hasMore: false } };
    }
    
    const searchIndex = await getSearchIndex();
    const term = query.toLowerCase().trim();
    
    const results = searchIndex.filter(item => 
        item.question.toLowerCase().includes(term) ||
        (item.category && item.category.toLowerCase().includes(term)) ||
        (item.sub_category && item.sub_category.toLowerCase().includes(term))
    );
    
    const total = results.length;
    const start = (page - 1) * limit;
    const paginatedResults = results.slice(start, start + limit);
    
    return {
        query,
        results: paginatedResults,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasMore: start + limit < total
        }
    };
}
