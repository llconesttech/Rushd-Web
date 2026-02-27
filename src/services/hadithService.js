/**
 * Hadith Service
 * Loads locally-stored hadith data from public/data/hadith/
 */

const cache = {};

async function fetchLocalJSON(path) {
    if (cache[path]) return cache[path];

    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}`);
    const data = await res.json();
    cache[path] = data;
    return data;
}

export async function getEditions() {
    // Force fresh fetch for editions list to reflect new book availability
    return fetchLocalJSON(`/data/hadith/editions.json?t=${Date.now()}`);
}

/** Load info.json (grades, section details per book) */
export async function getInfo() {
    return fetchLocalJSON('/data/hadith/info.json');
}

/** Get available languages for a specific book */
export async function getAvailableLanguages(bookId) {
    const editions = await getEditions();
    const book = editions[bookId];
    if (!book) return [];

    const seen = new Set();
    return book.collection
        .filter(ed => {
            const lang = ed.name.split('-')[0];
            // skip duplicate arabic (without diacritics) editions
            if (seen.has(lang)) return false;
            seen.add(lang);
            return true;
        })
        .map(ed => ({
            code: ed.name.split('-')[0],
            editionName: ed.name,
            language: ed.language,
            direction: ed.direction,
        }));
}

/** Load a specific edition (book + language) */
export async function getEdition(bookId, langCode = 'eng') {
    const editionName = `${langCode}-${bookId}`;
    return fetchLocalJSON(`/data/hadith/${bookId}/${editionName}.json`);
}

/** Get chapters/sections for a book (uses English edition for section names) */
export async function getBookChapters(bookId, langCode = 'eng') {
    const edition = await getEdition(bookId, langCode);
    const { metadata } = edition;

    if (!metadata?.sections) return [];

    const chapters = Object.entries(metadata.sections)
        .filter(([key]) => key !== '0') // skip empty section 0
        .map(([sectionId, sectionName]) => {
            const details = metadata.section_details?.[sectionId];
            const hadithCount = details
                ? details.hadithnumber_last - details.hadithnumber_first + 1
                : 0;

            return {
                id: parseInt(sectionId),
                name: sectionName,
                hadithCount,
                firstHadith: details?.hadithnumber_first,
                lastHadith: details?.hadithnumber_last,
                firstArabic: details?.arabicnumber_first,
                lastArabic: details?.arabicnumber_last,
            };
        })
        .sort((a, b) => a.id - b.id);

    return chapters;
}

/** Get hadiths for a specific section/chapter */
export async function getSectionHadiths(bookId, sectionId, langCode = 'eng') {
    const edition = await getEdition(bookId, langCode);
    const sectionNum = parseInt(sectionId);

    return edition.hadiths.filter(h => h.reference?.book === sectionNum);
}

/** Get Arabic text for a specific hadith (always from Arabic edition) */
export async function getArabicEdition(bookId) {
    return getEdition(bookId, 'ara');
}

/** Compute detailed stats from an edition object */
function computeBookStats(edition) {
    const { metadata, hadiths } = edition;
    const sections = metadata?.sections || {};
    const sectionDetails = metadata?.section_details || {};
    const totalChapters = Object.keys(sections).filter(k => k !== '0').length;
    const totalRecords = hadiths?.length || 0;

    // Canonical count: last integer hadith number
    let canonicalCount = 0;
    if (hadiths?.length) {
        const lastHadith = hadiths[hadiths.length - 1];
        canonicalCount = Math.floor(lastHadith.hadithnumber) || 0;
    }

    // Chapter-wise count: sum of (last - first + 1) per section range
    let chapterWiseCount = 0;
    Object.keys(sectionDetails)
        .filter(k => k !== '0')
        .forEach(sectionId => {
            const det = sectionDetails[sectionId];
            if (det?.hadithnumber_first != null && det?.hadithnumber_last != null) {
                chapterWiseCount += det.hadithnumber_last - det.hadithnumber_first + 1;
            }
        });

    // Count sub-numbered (decimal) hadiths and gap numbers
    const decimalCount = hadiths?.filter(h => h.hadithnumber % 1 !== 0).length || 0;
    const gapCount = canonicalCount - chapterWiseCount;

    return {
        totalChapters,
        totalRecords,
        canonicalCount,
        chapterWiseCount: chapterWiseCount || totalRecords,
        decimalCount,
        gapCount,
        hasDiscrepancy: totalRecords !== chapterWiseCount || canonicalCount !== chapterWiseCount,
    };
}

/** Get detailed hadith counts for a book */
export async function getBookStats(bookId) {
    try {
        const edition = await getEdition(bookId, 'eng');
        return computeBookStats(edition);
    } catch {
        try {
            const edition = await getEdition(bookId, 'ara');
            return computeBookStats(edition);
        } catch {
            return {
                totalChapters: 0, totalRecords: 0, canonicalCount: 0,
                chapterWiseCount: 0, decimalCount: 0, gapCount: 0, hasDiscrepancy: false,
            };
        }
    }
}

/** Load narrator_master.json */
export async function getNarratorMaster() {
    return fetchLocalJSON('/data/hadith/narrator_master.json');
}

/** Get all narrators (canonical, sorted by count) */
export async function getAllNarrators() {
    const master = await getNarratorMaster();
    return master.narrators;
}

/** Get a specific narrator by id */
export async function getNarratorById(narratorId) {
    const master = await getNarratorMaster();
    return master.narrators.find(n => n.id === narratorId) || null;
}

/** Get narrators for a specific book, sorted by hadith count */
export async function getNarratorsByBook(bookId) {
    const master = await getNarratorMaster();
    return master.narrators
        .filter(n => n.books.includes(bookId))
        .map(n => ({
            ...n,
            count: n.hadiths.filter(h => h.book === bookId).length,
        }))
        .sort((a, b) => b.count - a.count);
}

/** Detect the language of a given text search query */
export function detectLanguage(text) {
    if (!text) return 'eng';

    // Arabic script (includes Persian/Urdu but they share characters)
    if (/[\u0600-\u06FF]/.test(text)) {
        // Can try to refine if needed, but Arabic data is usually "ara"
        // Urdu has specific letters like Pe, Che, Zhe, Gaf, Farsi Yeh, Keheh
        if (/[\u067E\u0686\u0698\u06AF\u06CC\u06A9]/.test(text)) return 'urd';
        return 'ara';
    }

    // Bengali script
    if (/[\u0980-\u09FF]/.test(text)) return 'ben';

    // Cyrillic (Russian)
    if (/[\u0400-\u04FF]/.test(text)) return 'rus';

    // Tamil script
    if (/[\u0B80-\u0BFF]/.test(text)) return 'tam';

    // Keep Latin-based languages (eng, fra, ind, tur) under "eng" as default,
    // or we might need further heuristics if we strictly separated them.
    return 'eng';
}

import { HADITH_BOOKS } from '../data/hadithData.js';

/** Search all chapters across all books dynamically */
export async function searchAllChapters(query) {
    if (!query || !query.trim()) return [];
    const term = query.toLowerCase();
    const lang = detectLanguage(query);

    const results = [];
    const bookIds = Object.keys(HADITH_BOOKS);

    // Fetch chapters for all books in parallel
    const chapterPromises = bookIds.map(async (bookId) => {
        try {
            const chapters = await getBookChapters(bookId, lang);
            return { bookId, chapters };
        } catch {
            return { bookId, chapters: [] };
        }
    });

    const booksChapters = await Promise.all(chapterPromises);

    for (const { bookId, chapters } of booksChapters) {
        for (const ch of chapters) {
            if (ch.name?.toLowerCase().includes(term) || ch.id.toString().includes(term)) {
                results.push({
                    ...ch,
                    bookId,
                    bookName: HADITH_BOOKS[bookId].name,
                    bookColor: HADITH_BOOKS[bookId].color
                });
            }
        }
    }

    return results;
}
