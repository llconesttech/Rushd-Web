const https = require('https');

function fetchHTML(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

async function main() {
    console.log('Fetching main page...');
    const mainHtml = await fetchHTML('https://sunnah.com/ahmad');
    const chapterRegex = /href="\/ahmad\/([0-9a-zA-Z]+)"/g;
    const chapters = [];
    let match;
    while ((match = chapterRegex.exec(mainHtml)) !== null) {
        if (!chapters.includes(match[1])) {
            chapters.push(match[1]);
        }
    }
    console.log('Total chapters listed:', chapters.length);
    console.log('Chapters found:', chapters.sort((a, b) => {
        const na = parseInt(a), nb = parseInt(b);
        if (!isNaN(na) && !isNaN(nb)) return na - nb;
        return a.localeCompare(b);
    }).join(', '));

    const testChap = '1';
    console.log(`\nFetching Ahmad Chapter ${testChap} to test structure...`);
    const chapHtml = await fetchHTML(`https://sunnah.com/ahmad/${testChap}`);

    // Check for hadith entries
    const hadithContainerRegex = /<div class="actualHadithContainer[^"]*" id="h[0-9]*">/g;
    const hadithMatches = chapHtml.match(hadithContainerRegex);
    console.log(`Hadiths found in Chapter ${testChap}:`, hadithMatches ? hadithMatches.length : 0);

    // Look for Arabic and English text blocks
    const englishMatch = chapHtml.match(/<div class="english_hadith_full">([\s\S]*?)<\/div>/);
    const arabicMatch = chapHtml.match(/<div class="arabic_hadith_full arabic">([\s\S]*?)<\/div>/);

    console.log('\nSample English structure found:', !!englishMatch);
    if (englishMatch) console.log('English snippet:', englishMatch[1].substring(0, 100).trim() + '...');

    console.log('Sample Arabic structure found:', !!arabicMatch);
    if (arabicMatch) console.log('Arabic snippet:', arabicMatch[1].substring(0, 100).trim() + '...');
}

main().catch(console.error);
