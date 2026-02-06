/**
 * Scrape All Translations & Transliterations
 * 
 * Fetches all translations defined in quranData.js from alquran.cloud API
 * Saves to public/data/quran/v2/translations/ and public/data/quran/v2/transliterations/
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Use dynamic import for the data file since it's an ES module in src
// We need to read it as text and parse relevant parts because we can't easily import src files from scripts dir in Node sometimes
// actually we can just import it if we use .js extension and type module

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// API Configuration
const API_BASE = 'https://api.quran.com/api/v4';
const OUTPUT_BASE = path.join(__dirname, '..', 'public', 'data', 'quran', 'v2');
const DELAY_MS = 200;

// Manually defining the list from quranData.js to avoid import issues with JSX or other dependencies
// I will copy the translations object here for reliability in this script
// Read quranData.js directly to get the source of truth
const quranDataPath = path.join(__dirname, '..', 'src', 'data', 'quranData.js');
let translations = {};

try {
    const fileContent = fs.readFileSync(quranDataPath, 'utf8');
    // Extract the translations object using regex
    const match = fileContent.match(/export const translations = ({[\s\S]*?});/);
    if (match && match[1]) {
        // Evaluate the object string cautiously
        // We replace "export const translations =" with "translations =" to make it executable in a context if needed,
        // or just eval the object literal.
        // using function constructor to parse the object literal safely
        translations = eval('(' + match[1] + ')');
        console.log('Successfully loaded translations from quranData.js');
    } else {
        throw new Error('Could not regex match translations object');
    }
} catch (err) {
    console.error('Failed to load quranData.js:', err);
    console.log('Using fallback hardcoded list...');
    // Fallback list would go here or we just fail. 
    // For now, let's just error out if we can't sync, to force fix.
    process.exit(1);
}

const ensureDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchSurah = async (surah, edition) => {
    try {
        const url = `${API_BASE}/quran/verses/${edition}?chapter_number=${surah}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${url}`);
        }

        const json = await response.json();
        return json.verses;
    } catch (error) {
        console.error(`  Error fetching surah ${surah}:`, error.message);
        return null;
    }
};

const scrape = async () => {
    console.log('='.repeat(60));
    console.log('Quran V2 Translation/Transliteration Scraper');
    console.log('='.repeat(60));

    // Get list of editions to scrape
    const editions = Object.entries(translations);
    console.log(`Found ${editions.length} editions to scrape`);

    for (const [editionId, info] of editions) {
        const typeFolder = info.type === 'transliteration' ? 'transliterations' : 'translations';
        // Normalize directory name (dashes instead of dots)
        const dirName = editionId.replace('.', '-');
        const outputDir = path.join(OUTPUT_BASE, typeFolder, dirName);

        // Skip if already completely scraped (check 114.json)
        if (fs.existsSync(path.join(outputDir, '114.json'))) {
            // console.log(`Skipping ${editionId} - already exists`);
            // continue;
        }

        console.log(`\nFetching ${editionId} (${info.type})...`);
        ensureDir(outputDir);

        let successCount = 0;

        for (let surah = 1; surah <= 114; surah++) {
            const filePath = path.join(outputDir, `${surah}.json`);

            if (fs.existsSync(filePath)) {
                successCount++;
                process.stdout.write(`\r  Surah ${surah}/114 (Skipped)`);
                continue;
            }

            const verses = await fetchSurah(surah, editionId);

            if (verses && verses.length > 0) {
                // Transform to simple format
                const surahData = {
                    number: surah,
                    edition: editionId,
                    ayahs: verses.map(v => ({
                        number: v.verse_key.split(':')[1], // ayah number
                        text: v.text_uthmani || v.text_indopak || v.text_imlaei || v.text_simple || v.translation || v.text, // Handle various text fields
                    }))
                };

                // Fix: Ensure we capture the correct text field
                // For translations, it's usually 'text'. For transliterations, it's also 'text' sometimes.
                // Let's verify structure on first fetch.
                if (verses[0].text) {
                    surahData.ayahs = verses.map(v => ({
                        number: parseInt(v.verse_key.split(':')[1]),
                        text: v.text
                    }));
                } else if (verses[0].translations) {
                    // Sometimes structure is different?
                }

                fs.writeFileSync(filePath, JSON.stringify(surahData, null, 2));
                successCount++;
                process.stdout.write(`\r  Surah ${surah}/114`);
            }

            await sleep(DELAY_MS);
        }

        if (successCount === 114) {
            console.log(' ✓');
        } else {
            console.log(' ⚠ Some surahs failed');
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log('Scraping complete!');
    console.log('='.repeat(60));
};

scrape();
