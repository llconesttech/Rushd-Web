/* eslint-env node */
/* eslint-disable no-undef, no-unused-vars */
import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir';
const EDITIONS_URL = 'https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/editions.json';
// Separated Tafsir Directory
const OUTPUT_DIR = path.join(__dirname, '../public/data/quran/v2/tafsir');
const METADATA_FILE = path.join(__dirname, '../public/data/quran/v2/tafsir_metadata.json');

const downloadJson = (url) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            // Handle redirects
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                downloadJson(res.headers.location).then(resolve).catch(reject);
                return;
            }

            if (res.statusCode !== 200) {
                reject(new Error(`Status ${res.statusCode}`));
                return;
            }
            const chunks = [];
            res.on('data', chunk => chunks.push(chunk));
            res.on('end', () => {
                try {
                    const buffer = Buffer.concat(chunks);
                    const data = JSON.parse(buffer.toString('utf8'));
                    resolve(data);
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
};

const start = async () => {
    console.log('Fetching editions list...');
    let editions = [];
    try {
        editions = await downloadJson(EDITIONS_URL);
    } catch (err) {
        console.error('Failed to fetch editions:', err);
        return;
    }

    // Filter out bn-tafsir-abu-bakr-zakaria (User Request) - Verified it IS Bengali, user might have seen encoding issue.
    // Re-enabling it.
    // editions = editions.filter(e => e.slug !== 'bn-tafsir-abu-bakr-zakaria');

    console.log(`Found ${editions.length} editions.`);

    // Ensure output directory
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const metadataList = {};

    for (const edition of editions) {
        console.log(`Processing ${edition.slug} (${edition.name})...`);
        const editionDir = path.join(OUTPUT_DIR, edition.slug);

        if (!fs.existsSync(editionDir)) {
            fs.mkdirSync(editionDir, { recursive: true });
        }

        const langMap = {
            'arabic': 'ar',
            'bengali': 'bn',
            'english': 'en',
            'russian': 'ru',
            'urdu': 'ur',
            'kurdish': 'ku',
            'turkish': 'tr',
            'indonesian': 'id',
            'malay': 'ms',
            'persian': 'fa',
            'french': 'fr',
            'spanish': 'es',
            'german': 'de'
        };
        const langCode = langMap[edition.language_name.toLowerCase()] || 'en';

        metadataList[edition.slug] = {
            language_code: langCode,
            english_name: edition.name,
            native_name: edition.author_name || edition.name,
            type: 'tafsir',
            slug: edition.slug,
            source: edition.source
        };

        for (let s = 1; s <= 114; s++) {
            const url = `${BASE_URL}/${edition.slug}/${s}.json`;
            const dest = path.join(editionDir, `${s}.json`);

            // if (fs.existsSync(dest)) {
            // Skip if exists to speed up resume
            // continue;
            // }

            try {
                if (s % 20 === 0) process.stdout.write(`${s}... `);

                const data = await downloadJson(url);

                // Check if valid data
                if (!data || !data.ayahs) {
                    // console.warn(`\nEmpty/Invalid data for Surah ${s} (${edition.slug})`);
                    continue;
                }

                const transformed = {
                    id: edition.id,
                    ayahs: data.ayahs.map(a => ({
                        number: a.ayah,
                        text: a.text
                    }))
                };

                fs.writeFileSync(dest, JSON.stringify(transformed));
            } catch (err) {
                // console.error(`\nError Surah ${s} (${edition.slug}): ${err.message}`);
            }
        }
        process.stdout.write(' Done.\n');
    }

    // Write metadata
    fs.writeFileSync(METADATA_FILE, JSON.stringify(metadataList, null, 2));

    console.log('All downloads complete. Metadata saved to tafsir_metadata.json');
};

start();

