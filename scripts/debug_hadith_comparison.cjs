const fs = require('fs');
const path = require('path');

const baseDir = 'e:/Projects/global-quran/public/data/hadith';
const books = ['bukhari', 'muslim', 'tirmidhi', 'abudawud', 'nasai', 'ibnmajah', 'malik', 'nawawi', 'qudsi', 'dehlawi'];

console.log('Book'.padEnd(15) + 'ArrayLen'.padEnd(10) + 'LastNum'.padEnd(10) + 'ChapterSum'.padEnd(12) + 'Decimals'.padEnd(10) + 'Gaps');
console.log('-'.repeat(65));

for (const bookId of books) {
    const filePath = path.join(baseDir, bookId, `eng-${bookId}.json`);
    if (!fs.existsSync(filePath)) {
        // try arabic
        const araPath = path.join(baseDir, bookId, `ara-${bookId}.json`);
        if (!fs.existsSync(araPath)) { console.log(`${bookId.padEnd(15)} FILE NOT FOUND`); continue; }
    }

    let json;
    try {
        const raw = fs.readFileSync(filePath, 'utf8');
        json = JSON.parse(raw);
    } catch {
        try {
            const araPath = path.join(baseDir, bookId, `ara-${bookId}.json`);
            const raw = fs.readFileSync(araPath, 'utf8');
            json = JSON.parse(raw);
        } catch { console.log(`${bookId.padEnd(15)} PARSE ERROR`); continue; }
    }

    const arrayLen = json.hadiths.length;
    const lastNum = json.hadiths[json.hadiths.length - 1].hadithnumber;

    const sd = json.metadata?.section_details || {};
    let chapterSum = 0;
    let gapCount = 0;
    let prevLast = 0;
    Object.keys(sd).filter(k => k !== '0').sort((a, b) => +a - +b).forEach(sid => {
        const d = sd[sid];
        chapterSum += d.hadithnumber_last - d.hadithnumber_first + 1;
        if (prevLast > 0 && d.hadithnumber_first > prevLast + 1) {
            gapCount += d.hadithnumber_first - prevLast - 1;
        }
        prevLast = d.hadithnumber_last;
    });

    const decimals = json.hadiths.filter(h => h.hadithnumber % 1 !== 0).length;

    console.log(
        bookId.padEnd(15) +
        String(arrayLen).padEnd(10) +
        String(lastNum).padEnd(10) +
        String(chapterSum).padEnd(12) +
        String(decimals).padEnd(10) +
        String(gapCount)
    );
}
