import { apiFetch } from '@/lib/apiClient';
import { HADITH_BOOKS } from '@/data/hadithData';

function inferChapterRefField(edition) {
    const sample = (edition?.hadiths || []).slice(0, 200);
    if (!sample.length) return 'book';

    const bookVals = new Set();
    const sectionVals = new Set();
    for (const h of sample) {
        const b = h?.reference?.book;
        const s = h?.reference?.section;
        if (b !== undefined && b !== null) bookVals.add(String(b));
        if (s !== undefined && s !== null) sectionVals.add(String(s));
    }

    // Darimi (and some others) encode the chapter in `reference.section` while `reference.book` stays constant (often 0).
    if (bookVals.size <= 1 && sectionVals.size > 1) return 'section';
    return 'book';
}

export async function getEditions() {
    // Editions are effectively static; keep a long client cache.
    return apiFetch('/hadith/editions', { cache: true, ttl: 1000 * 60 * 60 });
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

    const entries = Object.entries(metadata.sections)
        .filter(([key]) => key !== '0')
        .map(([sectionId, sectionName]) => {
            const sectionIdNum = parseInt(sectionId, 10);
            const details = metadata.section_details?.[sectionId];
            const firstH = details?.hadithnumber_first;
            const lastH = details?.hadithnumber_last;
            const hadithCount = (firstH != null && lastH != null && !isNaN(firstH) && !isNaN(lastH))
                ? lastH - firstH + 1
                : 0;
            return {
                id: isNaN(sectionIdNum) ? sectionId : sectionIdNum,
                name: sectionName,
                hadithCount: isNaN(hadithCount) ? 0 : hadithCount,
                firstHadith: firstH,
                lastHadith: lastH,
                firstArabic: details?.arabicnumber_first,
                lastArabic: details?.arabicnumber_last,
            };
        })
        .sort((a, b) => a.id - b.id);

    // Fallback for editions that don't ship `metadata.section_details` (e.g. `darimi`):
    // derive counts and ranges from hadith references.
    const hasAnyRanges = entries.some(ch => ch.hadithCount > 0);
    const hasSectionDetails = metadata?.section_details && Object.keys(metadata.section_details).length > 0;
    if (hasAnyRanges || hasSectionDetails) return entries;

    const chapterField = inferChapterRefField(edition);
    const agg = new Map(); // chapterId -> stats
    for (const h of (edition.hadiths || [])) {
        const ref = h?.reference || {};
        const chapterIdRaw = ref?.[chapterField];
        if (chapterIdRaw == null) continue;
        const chapterId = String(chapterIdRaw);

        const n = Number(h.hadithnumber);
        const a = Number(h.arabicnumber);
        const cur = agg.get(chapterId) || {
            count: 0,
            firstHadith: null,
            lastHadith: null,
            firstArabic: null,
            lastArabic: null,
        };
        cur.count += 1;
        if (!Number.isNaN(n)) {
            cur.firstHadith = cur.firstHadith == null ? n : Math.min(cur.firstHadith, n);
            cur.lastHadith = cur.lastHadith == null ? n : Math.max(cur.lastHadith, n);
        }
        if (!Number.isNaN(a) && a !== 0) {
            cur.firstArabic = cur.firstArabic == null ? a : Math.min(cur.firstArabic, a);
            cur.lastArabic = cur.lastArabic == null ? a : Math.max(cur.lastArabic, a);
        }
        agg.set(chapterId, cur);
    }

    return entries.map(ch => {
        const key = String(ch.id);
        const stat = agg.get(key);
        if (!stat) return ch;
        return {
            ...ch,
            hadithCount: stat.count || 0,
            firstHadith: ch.firstHadith ?? stat.firstHadith,
            lastHadith: ch.lastHadith ?? stat.lastHadith,
            firstArabic: ch.firstArabic ?? stat.firstArabic,
            lastArabic: ch.lastArabic ?? stat.lastArabic,
        };
    });
}

export async function getSectionHadiths(bookId, sectionId, langCode = 'eng') {
    const edition = await getEdition(bookId, langCode);
    const sectionNum = parseInt(sectionId, 10);

    // Preferred: explicit reference.book
    const chapterField = inferChapterRefField(edition);
    const byRef = edition.hadiths?.filter(h => Number(h.reference?.[chapterField]) === sectionNum);
    if (byRef?.length) return byRef;

    // Fallback (for editions that don't include `reference`): use section_details hadith ranges.
    const det = edition.metadata?.section_details?.[String(sectionNum)];
    const firstH = det?.hadithnumber_first;
    const lastH = det?.hadithnumber_last;
    if (firstH != null && lastH != null) {
        return (edition.hadiths || []).filter(h => {
            const n = Number(h.hadithnumber);
            return !Number.isNaN(n) && n >= firstH && n <= lastH;
        });
    }

    return [];
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
