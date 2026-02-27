import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TRANSLATIONS_DIR = path.join(__dirname, '../public/data/quran/v2/translations');

// Simple regex to detect Arabic characters
const ARABIC_REGEX = /[\u0600-\u06FF]/;

const start = () => {
    console.log('Verifying translation files...');

    if (!fs.existsSync(TRANSLATIONS_DIR)) {
        console.error('Translations directory not found');
        return;
    }

    const dirs = fs.readdirSync(TRANSLATIONS_DIR);
    const broken = [];
    const missing = [];
    const ok = [];

    dirs.forEach(dir => {
        const dirPath = path.join(TRANSLATIONS_DIR, dir);
        if (!fs.statSync(dirPath).isDirectory()) return;

        const file1 = path.join(dirPath, '1.json');

        if (!fs.existsSync(file1)) {
            missing.push(dir);
            // console.log(`[MISSING] ${dir}`);
            return;
        }

        try {
            const content = fs.readFileSync(file1, 'utf8');
            const data = JSON.parse(content);
            const firstAyah = data.ayahs?.[0]?.text || '';

            // Check if it looks like Arabic
            if (ARABIC_REGEX.test(firstAyah)) {
                // Special case: Arabic translations/tafsirs ARE supposed to be Arabic
                if (dir.startsWith('ar-') || dir.startsWith('ar.')) {
                    ok.push(dir);
                } else {
                    broken.push(dir);
                    // console.log(`[CORRUPTED] ${dir} (Contains Arabic)`);
                }
            } else {
                ok.push(dir);
                // console.log(`[OK] ${dir}`);
            }

        } catch (err) {
            console.error(`Error reading ${dir}:`, err.message);
        }
    });

    console.log('\n--- SUMMARY ---');
    console.log(`TOTAL: ${dirs.length}`);
    console.log(`OK: ${ok.length}`);
    console.log(`MISSING FILES: ${missing.length}`);
    console.log(`CORRUPTED (Arabic text in non-Arabic file): ${broken.length}`);

    if (broken.length > 0) {
        console.log('\n--- CORRUPTED LIST ---');
        console.log(JSON.stringify(broken));
    }
    if (missing.length > 0) {
        console.log('\n--- MISSING LIST ---');
        console.log(JSON.stringify(missing));
    }
};

start();
