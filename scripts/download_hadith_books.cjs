/**
 * Download & Reformat Hadith Books from AhmedBaset/hadith-json
 * Converts to the same JSON format used by our existing hadith data.
 *
 * Usage: node scripts/download_hadith_books.cjs [--book bookId]
 *   --book   Optional: process only a specific book (e.g., --book shamail)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'data', 'hadith');
const RAW_BASE = 'https://raw.githubusercontent.com/AhmedBaset/hadith-json/main/db/by_chapter';

// Book definitions: our bookId → AhmedBaset repo path + metadata
const BOOKS = {
    darimi: {
        repoPath: 'the_9_books/darimi',
        name: 'Sunan ad-Darimi',
        nameArabic: 'سنن الدارمي',
        author: 'Imam ad-Darimi',
        chapters: ['introduction', ...range(1, 23)],
    },
    adab: {
        repoPath: 'other_books/aladab_almufrad',
        name: 'Al-Adab Al-Mufrad',
        nameArabic: 'الأدب المفرد',
        author: 'Imam Bukhari',
        chapters: range(1, 57),
    },
    bulugh: {
        repoPath: 'other_books/bulugh_almaram',
        name: 'Bulugh al-Maram',
        nameArabic: 'بلوغ المرام',
        author: 'Ibn Hajar al-Asqalani',
        chapters: range(1, 16),
    },
    riyadussalihin: {
        repoPath: 'other_books/riyad_assalihin',
        name: 'Riyad as-Salihin',
        nameArabic: 'رياض الصالحين',
        author: 'Imam Nawawi',
        chapters: ['introduction', ...range(1, 19)],
    },
    mishkat: {
        repoPath: 'other_books/mishkat_almasabih',
        name: 'Mishkat al-Masabih',
        nameArabic: 'مشكاة المصابيح',
        author: 'Al-Khatib at-Tabrizi',
        chapters: ['introduction', ...range(1, 24)],
    },
    shamail: {
        repoPath: 'other_books/shamail_muhammadiyah',
        name: "Ash-Shama'il Al-Muhammadiyah",
        nameArabic: 'الشمائل المحمدية',
        author: 'Imam Tirmidhi',
        chapters: [...range(1, 56)],
    },
    ahmad: {
        repoPath: 'the_9_books/ahmed',
        name: 'Musnad Ahmad',
        nameArabic: 'مسند أحمد',
        author: 'Imam Ahmad ibn Hanbal',
        chapters: [1, 2, 3, 4, 5, 6, 7, 31], // chapters 8-30 missing per repo notes
    },
};

function range(start, end) {
    const arr = [];
    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
}

function fetchJSON(url) {
    return new Promise((resolve, reject) => {
        const request = https.get(url, { headers: { 'User-Agent': 'HadithDownloader/1.0' } }, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                return fetchJSON(res.headers.location).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) {
                reject(new Error(`HTTP ${res.statusCode} for ${url}`));
                res.resume();
                return;
            }
            let data = '';
            res.setEncoding('utf8');
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try { resolve(JSON.parse(data)); }
                catch (e) { reject(new Error(`JSON parse error: ${e.message}`)); }
            });
        });
        request.on('error', reject);
        request.setTimeout(60000, () => {
            request.destroy();
            reject(new Error(`Timeout for ${url}`));
        });
    });
}

function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

function saveJSON(filePath, data) {
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Convert AhmedBaset chapter data into our project's hadith format.
 * Produces separate Arabic and English edition objects.
 */
function convertToOurFormat(bookId, bookMeta, chaptersData) {
    const sectionsEng = {};
    const sectionsAra = {};
    const sectionDetails = {};
    const hadithsEng = [];
    const hadithsAra = [];

    let globalHadithNum = 0;

    // Sort chapters by their id
    chaptersData.sort((a, b) => {
        const aId = a.chapter?.id ?? 0;
        const bId = b.chapter?.id ?? 0;
        return aId - bId;
    });

    for (const chapterData of chaptersData) {
        if (!chapterData || !chapterData.chapter) continue;

        const chapterId = chapterData.chapter.id;
        const sectionKey = String(chapterId);

        sectionsEng[sectionKey] = chapterData.chapter.english || `Chapter ${chapterId}`;
        sectionsAra[sectionKey] = chapterData.chapter.arabic || '';

        const chapterHadiths = chapterData.hadiths || [];
        if (chapterHadiths.length === 0) continue;

        const firstNum = globalHadithNum + 1;

        for (const h of chapterHadiths) {
            globalHadithNum++;
            const hadithNum = h.idInBook || h.id || globalHadithNum;

            hadithsEng.push({
                hadithnumber: hadithNum,
                arabicnumber: hadithNum,
                text: formatEnglishText(h.english),
                grades: [],
                reference: {
                    book: chapterId,
                    hadith: hadithNum,
                },
            });

            hadithsAra.push({
                hadithnumber: hadithNum,
                arabicnumber: hadithNum,
                text: h.arabic || '',
                grades: [],
                reference: {
                    book: chapterId,
                    hadith: hadithNum,
                },
            });
        }

        const lastHadith = chapterHadiths[chapterHadiths.length - 1];
        const lastNum = lastHadith?.idInBook || lastHadith?.id || globalHadithNum;

        sectionDetails[sectionKey] = {
            hadithnumber_first: chapterHadiths[0]?.idInBook || chapterHadiths[0]?.id || firstNum,
            hadithnumber_last: lastNum,
            arabicnumber_first: chapterHadiths[0]?.idInBook || chapterHadiths[0]?.id || firstNum,
            arabicnumber_last: lastNum,
        };
    }

    const engEdition = {
        metadata: {
            name: bookMeta.name,
            sections: sectionsEng,
            section_details: sectionDetails,
        },
        hadiths: hadithsEng,
    };

    const araEdition = {
        metadata: {
            name: bookMeta.nameArabic || bookMeta.name,
            sections: sectionsAra,
            section_details: sectionDetails,
        },
        hadiths: hadithsAra,
    };

    return { engEdition, araEdition };
}

function formatEnglishText(english) {
    if (!english) return '';
    if (typeof english === 'string') return english;
    const { narrator, text } = english;
    if (narrator && text) {
        return `${narrator}\n${text}`;
    }
    return text || narrator || '';
}

async function processBook(bookId) {
    const bookMeta = BOOKS[bookId];
    if (!bookMeta) {
        console.error(`  ❌ Unknown book: ${bookId}`);
        return false;
    }

    const bookDir = path.join(OUTPUT_DIR, bookId);
    const engFile = path.join(bookDir, `eng-${bookId}.json`);
    const araFile = path.join(bookDir, `ara-${bookId}.json`);

    // Skip if already exists
    if (fs.existsSync(engFile) && fs.existsSync(araFile)) {
        const engStat = fs.statSync(engFile);
        const araStat = fs.statSync(araFile);
        if (engStat.size > 1000 && araStat.size > 1000) {
            console.log(`  ⏩ ${bookMeta.name} — already exists, skipping`);
            return true;
        }
    }

    console.log(`\n  📚 ${bookMeta.name} (${bookId})`);
    console.log(`     Downloading ${bookMeta.chapters.length} chapters...`);

    const chaptersData = [];
    let downloadedCount = 0;
    let failedCount = 0;

    for (const chapterKey of bookMeta.chapters) {
        const url = `${RAW_BASE}/${bookMeta.repoPath}/${chapterKey}.json`;
        try {
            process.stdout.write(`     ⬇️  Chapter ${chapterKey}...`);
            const data = await fetchJSON(url);
            chaptersData.push(data);
            downloadedCount++;
            process.stdout.write(` ✅ (${data.hadiths?.length || 0} hadiths)\n`);
            await sleep(200);
        } catch (e) {
            failedCount++;
            process.stdout.write(` ❌ ${e.message}\n`);
        }
    }

    if (chaptersData.length === 0) {
        console.log(`     ❌ No chapters downloaded, skipping`);
        return false;
    }

    // Convert to our format
    console.log(`     🔄 Converting to project format...`);
    const { engEdition, araEdition } = convertToOurFormat(bookId, bookMeta, chaptersData);

    // Save
    ensureDir(bookDir);
    saveJSON(engFile, engEdition);
    saveJSON(araFile, araEdition);

    const totalHadiths = engEdition.hadiths.length;
    const totalSections = Object.keys(engEdition.metadata.sections).length;
    console.log(`     ✅ Saved: ${totalHadiths} hadiths, ${totalSections} chapters`);
    console.log(`        📄 ${path.relative(process.cwd(), engFile)}`);
    console.log(`        📄 ${path.relative(process.cwd(), araFile)}`);

    if (failedCount > 0) {
        console.log(`     ⚠️  ${failedCount} chapters failed to download`);
    }

    return true;
}

async function main() {
    console.log('=== Hadith Book Downloader & Reformatter ===\n');
    console.log(`Source: AhmedBaset/hadith-json (GitHub)`);
    console.log(`Output: ${OUTPUT_DIR}\n`);

    // Parse args
    const args = process.argv.slice(2);
    const bookFlagIdx = args.indexOf('--book');
    const specificBook = bookFlagIdx >= 0 ? args[bookFlagIdx + 1] : null;

    let booksToProcess;
    if (specificBook) {
        if (!BOOKS[specificBook]) {
            console.error(`Unknown book: ${specificBook}`);
            console.log(`Available: ${Object.keys(BOOKS).join(', ')}`);
            process.exit(1);
        }
        booksToProcess = [specificBook];
    } else {
        // Process smaller books first, Ahmad last
        booksToProcess = ['shamail', 'bulugh', 'adab', 'riyadussalihin', 'darimi', 'mishkat', 'ahmad'];
    }

    console.log(`Books to process: ${booksToProcess.join(', ')}\n`);

    let success = 0;
    let failed = 0;

    for (const bookId of booksToProcess) {
        try {
            const ok = await processBook(bookId);
            if (ok) success++;
            else failed++;
        } catch (e) {
            console.error(`  ❌ Error processing ${bookId}: ${e.message}`);
            failed++;
        }
    }

    console.log('\n=== SUMMARY ===');
    console.log(`  ✅ Success: ${success}`);
    console.log(`  ❌ Failed: ${failed}`);
    console.log(`  📁 Output: ${OUTPUT_DIR}`);
    console.log('\nDone!');
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
