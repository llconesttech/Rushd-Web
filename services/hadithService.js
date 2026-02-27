import { apiFetch } from '@/lib/apiClient';
import { HADITH_BOOKS } from '@/data/hadithData';

export async function getEditions() {
    return apiFetch('/hadith/editions', { cache: false });
}

export async function getInfo() {
    return apiFetch('/hadith/info');
}

export async function getAvailableLanguages(bookId) {
    const editions = await getEditions();
    const book = editions[bookId];
    if (!book) return [];

    const seen = new Set();
    return book.collection
        .filter(ed => {
            const lang = ed.name.split('-')[0];
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

export async function getEdition(bookId, langCode = 'eng') {
    return apiFetch(`/hadith/${bookId}/${langCode}`);
}

export async function getBookChapters(bookId, langCode = 'eng') {
    const edition = await getEdition(bookId, langCode);
    const { metadata } = edition;
    if (!metadata?.sections) return [];

    return Object.entries(metadata.sections)
        .filter(([key]) => key !== '0')
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
}

export async function getSectionHadiths(bookId, sectionId, langCode = 'eng') {
    const edition = await getEdition(bookId, langCode);
    return edition.hadiths.filter(h => h.reference?.book === parseInt(sectionId));
}

export async function getArabicEdition(bookId) {
    return getEdition(bookId, 'ara');
}

function computeBookStats(edition) {
    const { metadata, hadiths } = edition;
    const sections = metadata?.sections || {};
    const sectionDetails = metadata?.section_details || {};
    const totalChapters = Object.keys(sections).filter(k => k !== '0').length;
    const totalRecords = hadiths?.length || 0;

    let canonicalCount = 0;
    if (hadiths?.length) {
        canonicalCount = Math.floor(hadiths[hadiths.length - 1].hadithnumber) || 0;
    }

    let chapterWiseCount = 0;
    Object.keys(sectionDetails)
        .filter(k => k !== '0')
        .forEach(sectionId => {
            const det = sectionDetails[sectionId];
            if (det?.hadithnumber_first != null && det?.hadithnumber_last != null) {
                chapterWiseCount += det.hadithnumber_last - det.hadithnumber_first + 1;
            }
        });

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

export async function getBookStats(bookId) {
    try {
        return computeBookStats(await getEdition(bookId, 'eng'));
    } catch {
        try {
            return computeBookStats(await getEdition(bookId, 'ara'));
        } catch {
            return {
                totalChapters: 0, totalRecords: 0, canonicalCount: 0,
                chapterWiseCount: 0, decimalCount: 0, gapCount: 0, hasDiscrepancy: false,
            };
        }
    }
}

export async function getNarratorMaster() {
    return apiFetch('/hadith/narrators');
}

export async function getAllNarrators() {
    return (await getNarratorMaster()).narrators;
}

export async function getNarratorById(narratorId) {
    const master = await getNarratorMaster();
    return master.narrators.find(n => n.id === narratorId) || null;
}

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

export function detectLanguage(text) {
    if (!text) return 'eng';
    if (/[\u0600-\u06FF]/.test(text)) {
        if (/[\u067E\u0686\u0698\u06AF\u06CC\u06A9]/.test(text)) return 'urd';
        return 'ara';
    }
    if (/[\u0980-\u09FF]/.test(text)) return 'ben';
    if (/[\u0400-\u04FF]/.test(text)) return 'rus';
    if (/[\u0B80-\u0BFF]/.test(text)) return 'tam';
    return 'eng';
}

export async function searchAllChapters(query) {
    if (!query?.trim()) return [];
    const term = query.toLowerCase();
    const lang = detectLanguage(query);

    const bookIds = Object.keys(HADITH_BOOKS);
    const booksChapters = await Promise.all(
        bookIds.map(async bookId => {
            try {
                return { bookId, chapters: await getBookChapters(bookId, lang) };
            } catch {
                return { bookId, chapters: [] };
            }
        })
    );

    const results = [];
    for (const { bookId, chapters } of booksChapters) {
        for (const ch of chapters) {
            if (ch.name?.toLowerCase().includes(term) || ch.id.toString().includes(term)) {
                results.push({
                    ...ch,
                    bookId,
                    bookName: HADITH_BOOKS[bookId].name,
                    bookColor: HADITH_BOOKS[bookId].color,
                });
            }
        }
    }
    return results;
}
