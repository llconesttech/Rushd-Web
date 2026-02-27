/**
 * Extract narrator names from English hadith text across all books.
 * Generates public/data/hadith/narrators.json
 *
 * Patterns detected:
 *   Bukhari/AbuDawud/Tirmidhi: "Narrated X:"
 *   Ibn Majah:                 "X narrated that:"
 *   Nasai:                     "It was narrated from X that" / "It was narrated that X said:"
 *   Muslim:                    "on authority of X," (last in chain = actual narrator)
 */

const fs = require('fs');
const path = require('path');

const BOOKS = ['bukhari', 'muslim', 'tirmidhi', 'abudawud', 'nasai', 'ibnmajah',
    'malik', 'nawawi', 'qudsi', 'dehlawi'];

const PATTERNS = [
    // "Narrated 'Umar bin Al-Khattab:"
    /^Narrated\s+(.+?):/i,
    // "Abu Hurairah narrated that:"
    /^([A-Z][A-Za-z\s'`\-]+?)\s+narrated\s+that\s*:/i,
    // "It was narrated from Abu Hurairah that"
    /^It was narrated from\s+(.+?)\s+that/i,
    // "It was narrated that Abu Hurairah said:"
    /^It was narrated that\s+(.+?)\s+said\s*:/i,
];

// For Muslim's isnād chain: find the last "on authority of X"
const ISNAD_PATTERN = /on authority of\s+([^,]+)/gi;

function extractNarrator(text) {
    if (!text) return null;

    // Try standard patterns first
    for (const pat of PATTERNS) {
        const match = text.match(pat);
        if (match) {
            return cleanName(match[1]);
        }
    }

    // Fallback: isnād chain (Muslim-style) — use last "on authority of"
    let lastMatch = null;
    let m;
    while ((m = ISNAD_PATTERN.exec(text)) !== null) {
        lastMatch = m[1];
    }
    ISNAD_PATTERN.lastIndex = 0;
    if (lastMatch) return cleanName(lastMatch);

    return null;
}

function cleanName(raw) {
    let name = raw.trim();
    // Remove trailing punctuation
    name = name.replace(/[,;.\s]+$/, '');
    // Remove leading/trailing quotes
    name = name.replace(/^['"`]+|['"`]+$/g, '');
    // Normalize backtick apostrophes
    name = name.replace(/`/g, "'");
    // Collapse whitespace
    name = name.replace(/\s+/g, ' ').trim();
    // Remove "(the mother of...)" parenthetical
    name = name.replace(/\s*\([^)]*\)\s*/g, ' ').trim();
    // Skip if too long (likely a sentence, not a name)
    if (name.length > 60) return null;
    // Skip if too short
    if (name.length < 2) return null;
    return name;
}

function main() {
    const hadithDir = path.join(__dirname, '..', 'public', 'data', 'hadith');
    const result = {};
    let totalExtracted = 0;
    let totalHadiths = 0;

    for (const bookId of BOOKS) {
        const filePath = path.join(hadithDir, bookId, `eng-${bookId}.json`);
        if (!fs.existsSync(filePath)) {
            console.log(`  ⏭ Skipping ${bookId} — no English edition`);
            continue;
        }

        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const bookNarrators = {};
        let matched = 0;

        for (const hadith of data.hadiths) {
            totalHadiths++;
            const narrator = extractNarrator(hadith.text);
            if (narrator) {
                matched++;
                totalExtracted++;
                if (!bookNarrators[narrator]) {
                    bookNarrators[narrator] = [];
                }
                bookNarrators[narrator].push(hadith.hadithnumber);
            }
        }

        // Sort narrators by hadith count (descending)
        const sorted = Object.entries(bookNarrators)
            .sort((a, b) => b[1].length - a[1].length)
            .reduce((acc, [name, nums]) => {
                acc[name] = nums;
                return acc;
            }, {});

        result[bookId] = {
            narratorCount: Object.keys(sorted).length,
            matchedHadiths: matched,
            totalHadiths: data.hadiths.length,
            coverage: Math.round((matched / data.hadiths.length) * 100),
            narrators: sorted,
        };

        console.log(`  ✅ ${bookId}: ${Object.keys(sorted).length} narrators, ${matched}/${data.hadiths.length} hadiths (${Math.round((matched / data.hadiths.length) * 100)}%)`);
    }

    const outPath = path.join(hadithDir, 'narrators.json');
    fs.writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf8');
    console.log(`\n📁 Saved to ${outPath}`);
    console.log(`📊 Total: ${totalExtracted}/${totalHadiths} hadiths with narrators extracted`);
}

main();
