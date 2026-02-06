// Fetch transliteration data from API
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Transliterations to fetch
const transliterations = [
    { id: 'tr.transliteration', folder: 'tr-transliteration' },
    { id: 'ru.transliteration', folder: 'ru-transliteration' }
];

function fetch(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
            res.on('error', reject);
        }).on('error', reject);
    });
}

async function fetchTransliteration(id, folder) {
    const outputDir = path.join(__dirname, '..', 'public/data/quran/v2/transliterations', folder);

    // Create directory
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log(`Fetching ${id}...`);

    for (let i = 1; i <= 114; i++) {
        const url = `https://api.alquran.cloud/v1/surah/${i}/${id}`;
        try {
            const response = await fetch(url);
            if (response.data) {
                fs.writeFileSync(
                    path.join(outputDir, `${i}.json`),
                    JSON.stringify(response.data, null, 2)
                );
                process.stdout.write(`\r  Surah ${i}/114`);
            }
        } catch (e) {
            console.error(`\n  Error fetching surah ${i}: ${e.message}`);
        }
    }
    console.log(`\n  Done: ${folder}`);
}

async function main() {
    for (const trans of transliterations) {
        await fetchTransliteration(trans.id, trans.folder);
    }
    console.log('\nAll transliterations fetched!');
}

main().catch(e => console.error(e));
