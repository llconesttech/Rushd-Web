const fs = require('fs');
const path = require('path');
const https = require('https');

const BASE_URL = 'https://sunnah.com';
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'data', 'hadith');

const BOOKS = {
    ahmad: { slug: 'ahmad', name: 'Musnad Ahmad ibn Hanbal' },
    darimi: { slug: 'darimi', name: 'Sunan ad-Darimi' },
    adab: { slug: 'adab', name: 'Al-Adab al-Mufrad' },
    bulugh: { slug: 'bulugh', name: 'Bulugh al-Maram' },
    riyadussalihin: { slug: 'riyadussalihin', name: 'Riyad as-Salihin' },
    mishkat: { slug: 'mishkat', name: 'Mishkat al-Masabih' },
    shamail: { slug: 'shamail', name: 'Shamail al-Muhammadiyah' }
};

async function fetchHTML(url) {
    let retries = 3;
    while (retries > 0) {
        try {
            return await new Promise((resolve, reject) => {
                const req = https.get(url, {
                    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
                }, (res) => {
                    if (res.statusCode !== 200) return reject(new Error(`Status ${res.statusCode}`));
                    let data = '';
                    res.on('data', (chunk) => data += chunk);
                    res.on('end', () => resolve(data));
                });
                req.on('error', reject);
                req.setTimeout(30000, () => { req.destroy(); reject(new Error('Timeout')); });
            });
        } catch (e) {
            retries--;
            if (retries === 0) throw e;
            console.log(`  ⚠️ Retrying ${url} (${e.message})...`);
            await new Promise(r => setTimeout(r, 3000));
        }
    }
}

function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function cleanHTML(html) {
    if (!html) return '';
    let cleaned = html;

    // Handle case where capture started inside a tag (e.g. split in middle)
    if (cleaned.match(/^[^<]*>/)) {
        cleaned = cleaned.replace(/^[^<]*>/, '');
    }

    // Stop at metadata/footer markers that often leak in via regex
    const markers = [
        /Grade\s*:/i,
        /Reference\s*:/i,
        /In-book reference\s*:/i,
        /Report Error/i,
        /Share\s*\|\s*Copy/i,
        /Content on this page was last updated/i,
        /About\s*\|\s*News/i
    ];

    for (const marker of markers) {
        const parts = cleaned.split(marker);
        if (parts.length > 1) cleaned = parts[0];
    }

    return cleaned
        .replace(/<div[^>]*class=["']?hadith_narrated["']?[^>]*>([\s\S]*?)<\/div>/gi, (m, c) => c.trim() + '\n')
        .replace(/<div[^>]*class=["']?text_details["']?[^>]*>([\s\S]*?)<\/div>/gi, (m, c) => c.trim() + '\n')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]+>/g, '') // remove remaining tags
        .replace(/&nbsp;/g, ' ')
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#039;/g, "'")
        .replace(/&lsquo;/g, "'")
        .replace(/&rsquo;/g, "'")
        .replace(/&ldquo;/g, '"')
        .replace(/&rdquo;/g, '"')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/\s+\n/g, '\n')
        .replace(/\n\s+/g, '\n')
        .replace(/ +/g, ' ')
        .trim();
}

async function scrapeBook(bookId) {
    const book = BOOKS[bookId];
    console.log(`\n📚 Scraping ${book.name} (${bookId})...`);

    const mainUrl = `${BASE_URL}/${book.slug}`;
    const mainHtml = await fetchHTML(mainUrl);

    // Find all links to chapters / musnads
    const chapterLinks = [];
    const chapterRegex = new RegExp(`href="/${book.slug}/([^"\\s]+)"`, 'g');
    let match;
    while ((match = chapterRegex.exec(mainHtml)) !== null) {
        const chap = match[1];
        if (chap !== 'about' && !chapterLinks.includes(chap) && !chap.includes('/') && !chap.includes('?')) {
            chapterLinks.push(chap);
        }
    }

    console.log(`  Found ${chapterLinks.length} chapters.`);

    const metadata = {
        name: book.name,
        sections: {},
        section_details: {}
    };
    const engHadiths = [];
    const araHadiths = [];

    let totalHadithsCount = 0;

    for (const chap of chapterLinks) {
        console.log(`  ⬇️  Chapter ${chap}...`);
        const chapUrl = `${BASE_URL}/${book.slug}/${chap}`;
        let chapHtml;
        try {
            chapHtml = await fetchHTML(chapUrl);
        } catch (e) {
            console.log(`    ❌ Failed to fetch chapter ${chap}: ${e.message}`);
            continue;
        }

        // Get Chapter Names
        const chapNameEngMatch = chapHtml.match(/<div class=["']?book_page_english_name["']?>([\s\S]*?)<\/div>/) ||
            chapHtml.match(/<div class=["']?english_book_name["']?>([\s\S]*?)<\/div>/);

        const sectionId = chap;
        metadata.sections[sectionId] = chapNameEngMatch ? cleanHTML(chapNameEngMatch[1]) : `Chapter ${chap}`;

        // Extract Hadiths
        // Match hadith containers
        const blocks = chapHtml.split(/<div class=["']?actualHadithContainer[^"'>]*["']?\s+id=["']?h\d+["']?[^>]*>/);
        blocks.shift(); // remove everything before first hadith

        if (blocks.length === 0) {
            console.log(`    ⚠️ No hadiths found in Chapter ${chap}.`);
            continue;
        }

        let firstInChap = null;
        let lastInChap = null;

        for (const block of blocks) {
            // Find hadith number
            const hNumMatch = block.match(/class=["']?hadith_number["']?>([^<]+)<\/div>/) ||
                block.match(/class=["']?hadith_reference_sticky["']?>[\s\S]*?\s(\d+\.?\d*)<\/div>/) ||
                block.match(/In-book reference[\s\S]*?Hadith\s(\d+\.?\d*)/);

            let hadithNumStr = hNumMatch ? hNumMatch[1].trim() : null;
            if (!hadithNumStr) {
                // fallback to a counter
                hadithNumStr = String(++totalHadithsCount);
            } else {
                hadithNumStr = hadithNumStr.replace(/[^\d.]/g, '');
                // Handle case where it might be empty after cleaning
                if (!hadithNumStr) hadithNumStr = String(++totalHadithsCount);
            }

            const hadithNum = parseFloat(hadithNumStr);

            // Find in-book hadith number
            const inBookMatch = block.match(/In-book reference[\s\S]*?Hadith\s+(\d+\.?\d*)/i);
            const inBookHadithNum = inBookMatch ? parseFloat(inBookMatch[1]) : hadithNum;

            // Robust text extraction: split by Arabic block since it follows English
            const araStartMatch = block.match(/<div[^>]*class=["']?arabic_hadith_full/);
            const araStartIdx = araStartMatch ? araStartMatch.index : -1;

            const engPart = araStartIdx !== -1 ? block.substring(0, araStartIdx) : block;
            const araPart = araStartIdx !== -1 ? block.substring(araStartIdx) : '';

            // English Text
            const engMatch = engPart.match(/<div class=["']?english_hadith_full["']?>([\s\S]+?)<div class=["']?clear["']?><\/div>/) ||
                engPart.match(/<div class=["']?english_hadith_full["']?>([\s\S]+?)<\/div>/);

            // Arabic Text
            const araMatch = araPart.match(/<div class=["']?arabic_hadith_full[^"']*["']?>([\s\S]+?)<\/div>\s*<\/div>/) ||
                araPart.match(/<div class=["']?arabic_hadith_full[^"']*["']?>([\s\S]+?)<\/div>/);

            // Grades
            const grades = [];
            const gradeRegex = /<td class=["']?english_grade["']?[^>]*><b>Grade<\/b>:<\/td><td[^>]*>&nbsp;<b>([^<]+)<\/b>\s*([^<]*)/g;
            let gMatch;
            while ((gMatch = gradeRegex.exec(block)) !== null) {
                grades.push({ grade: gMatch[1].trim(), second: gMatch[2].trim() });
            }

            const hadithObj = {
                hadithnumber: hadithNum,
                arabicnumber: hadithNum,
                grades: grades,
                reference: { book: parseInt(chap) || sectionId, hadith: inBookHadithNum }
            };

            const engText = cleanHTML(engMatch ? engMatch[1] : (engPart.includes('english_hadith_full') ? engPart : ''));
            const araText = cleanHTML(araMatch ? araMatch[1] : (araPart.includes('arabic_hadith_full') ? araPart : ''));

            engHadiths.push({ ...hadithObj, text: engText });
            araHadiths.push({ ...hadithObj, text: araText });

            if (firstInChap === null) firstInChap = hadithNum;
            lastInChap = hadithNum;
        }

        metadata.section_details[sectionId] = {
            hadithnumber_first: firstInChap,
            hadithnumber_last: lastInChap,
            arabicnumber_first: firstInChap,
            arabicnumber_last: lastInChap
        };

        process.stdout.write(`    ✅ ${blocks.length} hadiths parsed.\n`);
        await new Promise(r => setTimeout(r, 800)); // be nice
    }

    if (engHadiths.length === 0) {
        console.log(`  ❌ Scraping failed for ${bookId}: No hadiths found.`);
        return;
    }

    // Save
    const bookDir = path.join(OUTPUT_DIR, bookId);
    ensureDir(bookDir);

    fs.writeFileSync(path.join(bookDir, `eng-${bookId}.json`), JSON.stringify({ metadata, hadiths: engHadiths }, null, 2));
    fs.writeFileSync(path.join(bookDir, `ara-${bookId}.json`), JSON.stringify({ metadata, hadiths: araHadiths }, null, 2));

    console.log(`  ✅ Successfully saved ${engHadiths.length} hadiths for ${bookId}`);
}

async function main() {
    const args = process.argv.slice(2);
    const targetBook = args[0];

    if (targetBook) {
        if (!BOOKS[targetBook]) {
            console.log(`Unknown book: ${targetBook}. Available: ${Object.keys(BOOKS).join(', ')}`);
            process.exit(1);
        }
        await scrapeBook(targetBook);
    } else {
        const bookIds = Object.keys(BOOKS);
        for (const bookId of bookIds) {
            await scrapeBook(bookId);
        }
    }
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
