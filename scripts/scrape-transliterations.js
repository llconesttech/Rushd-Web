/**
 * Scrape Transliterations Only
 * 
 * Uses api.alquran.cloud which has proper Latin transliteration data
 * Saves to public/data/quran/v2/transliterations/
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// API Configuration - Using alquran.cloud for transliterations
const API_BASE = 'http://api.alquran.cloud/v1';
const OUTPUT_BASE = path.join(__dirname, '..', 'public', 'data', 'quran', 'v2', 'transliterations');
const DELAY_MS = 300;

// Available transliterations from alquran.cloud
const transliterations = {
    "en.transliteration": { name: "English Transliteration" }
    // Add more transliterations here if API supports them
};

const ensureDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchSurah = async (surah, edition) => {
    try {
        const url = `${API_BASE}/surah/${surah}/${edition}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${url}`);
        }

        const json = await response.json();

        if (json.code !== 200 || !json.data) {
            throw new Error(`API error: ${json.status || 'Unknown'}`);
        }

        return json.data;
    } catch (error) {
        console.error(`  Error fetching surah ${surah}:`, error.message);
        return null;
    }
};

const scrape = async () => {
    console.log('='.repeat(60));
    console.log('Quran Transliteration Scraper (alquran.cloud)');
    console.log('='.repeat(60));

    const editions = Object.entries(transliterations);
    console.log(`Found ${editions.length} transliteration(s) to scrape`);

    for (const [editionId, info] of editions) {
        // Normalize directory name (dashes instead of dots)
        const dirName = editionId.replace('.', '-');
        const outputDir = path.join(OUTPUT_BASE, dirName);

        console.log(`\nFetching ${editionId} (${info.name})...`);
        ensureDir(outputDir);

        let successCount = 0;

        for (let surah = 1; surah <= 114; surah++) {
            const filePath = path.join(outputDir, `${surah}.json`);

            const data = await fetchSurah(surah, editionId);

            if (data && data.ayahs && data.ayahs.length > 0) {
                // Transform to our format
                const surahData = {
                    number: surah,
                    name: data.name,
                    englishName: data.englishName,
                    edition: editionId,
                    ayahs: data.ayahs.map(ayah => ({
                        number: ayah.numberInSurah,
                        text: ayah.text // This should be Latin transliteration
                    }))
                };

                fs.writeFileSync(filePath, JSON.stringify(surahData, null, 2));
                successCount++;
                process.stdout.write(`\r  Surah ${surah}/114`);
            } else {
                process.stdout.write(`\r  Surah ${surah}/114 (Failed)`);
            }

            await sleep(DELAY_MS);
        }

        if (successCount === 114) {
            console.log(' ✓');
        } else {
            console.log(` ⚠ ${successCount}/114 succeeded`);
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log('Transliteration scraping complete!');
    console.log('='.repeat(60));
};

scrape();
