/**
 * Hadith Data Scraper
 * Downloads all hadith editions from fawazahmed0/hadith-api CDN
 * and stores them locally in public/data/hadith/
 *
 * Usage: node scripts/scrape_hadith.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const CDN_BASE = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1';
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'data', 'hadith');

function fetchJSON(url) {
    return new Promise((resolve, reject) => {
        const request = https.get(url, { headers: { 'User-Agent': 'HadithScraper/1.0' } }, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                return fetchJSON(res.headers.location).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) {
                reject(new Error(`HTTP ${res.statusCode} for ${url}`));
                res.resume();
                return;
            }
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try { resolve(JSON.parse(data)); }
                catch (e) { reject(new Error(`JSON parse error for ${url}: ${e.message}`)); }
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

async function main() {
    console.log('=== Hadith Data Scraper ===\n');

    // Step 1: Download editions.json (master list)
    console.log('[1/3] Downloading editions.json...');
    const editions = await fetchJSON(`${CDN_BASE}/editions.json`);
    saveJSON(path.join(OUTPUT_DIR, 'editions.json'), editions);
    console.log(`  ✅ Saved editions.json (${Object.keys(editions).length} books found)\n`);

    // Step 2: Download info.json (grades, section details)
    console.log('[2/3] Downloading info.json...');
    try {
        const info = await fetchJSON(`${CDN_BASE}/info.json`);
        saveJSON(path.join(OUTPUT_DIR, 'info.json'), info);
        console.log('  ✅ Saved info.json\n');
    } catch (e) {
        console.log(`  ⚠️ info.json failed: ${e.message} (non-critical, continuing)\n`);
    }

    // Step 3: Download each edition
    console.log('[3/3] Downloading all editions...\n');

    const allBooks = Object.keys(editions);
    let totalEditions = 0;
    let downloaded = 0;
    let failed = 0;
    const failures = [];

    // Count total editions
    for (const bookId of allBooks) {
        totalEditions += editions[bookId].collection.length;
    }

    console.log(`  Total: ${totalEditions} editions across ${allBooks.length} books\n`);

    for (const bookId of allBooks) {
        const book = editions[bookId];
        const bookDir = path.join(OUTPUT_DIR, bookId);
        ensureDir(bookDir);

        console.log(`  📚 ${book.name} (${bookId}) — ${book.collection.length} editions`);

        for (const edition of book.collection) {
            const fileName = `${edition.name}.json`;
            const filePath = path.join(bookDir, fileName);

            // Skip if already downloaded
            if (fs.existsSync(filePath)) {
                const stat = fs.statSync(filePath);
                if (stat.size > 100) {
                    downloaded++;
                    process.stdout.write(`    ⏩ ${edition.name} (cached)\n`);
                    continue;
                }
            }

            try {
                process.stdout.write(`    ⬇️  ${edition.name} (${edition.language})...`);
                const data = await fetchJSON(edition.linkmin || edition.link);
                saveJSON(filePath, data);
                downloaded++;
                process.stdout.write(` ✅\n`);

                // Small delay to be nice to the CDN
                await sleep(200);
            } catch (e) {
                failed++;
                failures.push({ edition: edition.name, error: e.message });
                process.stdout.write(` ❌ ${e.message}\n`);
            }
        }
        console.log('');
    }

    // Summary
    console.log('=== SUMMARY ===');
    console.log(`  ✅ Downloaded: ${downloaded}/${totalEditions}`);
    console.log(`  ❌ Failed: ${failed}`);
    if (failures.length > 0) {
        console.log('\n  Failed editions:');
        failures.forEach(f => console.log(`    - ${f.edition}: ${f.error}`));
    }
    console.log(`\n  📁 Output: ${OUTPUT_DIR}`);
    console.log('\nDone!');
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
