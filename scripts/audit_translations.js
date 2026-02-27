import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// We need to import the data. Since it's an ES module, we can use dynamic import or just read/parse for simplicity if complex imports exist.
// But `quranData.js` exports objects. Let's try to import it.
// Note: quranData.js might have local imports that fail in this script context if not careful.
// Actually `reciters` and `languageList` are there.
// Let's Just read the file and regex parse the keys for safety/speed without setting up a full build env.

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const QURAN_DATA_PATH = path.join(__dirname, '../src/data/quranData.js');
const TRANSLATIONS_DIR = path.join(__dirname, '../public/data/quran/v2/translations');
const ARABIC_REGEX = /[\u0600-\u06FF]/;

const start = () => {
    console.log('Auditing translations...');

    if (!fs.existsSync(QURAN_DATA_PATH)) {
        console.error('quranData.js not found');
        return;
    }

    const content = fs.readFileSync(QURAN_DATA_PATH, 'utf8');

    // Extract translation keys using regex
    // Looks for: "key": { ... "type": "translation" ... }
    // Or just "key": { ... } inside the `translations` object.

    // Quick hack: Iterate the lines between `export const translations = {` and `};`

    const lines = content.split('\n');
    let insideTranslations = false;
    const entries = [];

    for (const line of lines) {
        if (line.includes('export const translations = {')) {
            insideTranslations = true;
            continue;
        }
        if (insideTranslations && line.trim().startsWith('};')) {
            insideTranslations = false;
            break;
        }

        if (insideTranslations) {
            const match = line.match(/"([^"]+)":\s*{/);
            if (match) {
                entries.push(match[1]);
            }
        }
    }

    console.log(`Found ${entries.length} translation entries in quranData.js`);

    const report = {
        ok: [],
        missing: [],
        corrupted: []
    };

    entries.forEach(key => {
        // quranData keys usually have dots e.g. "en.sahih"
        // directory structure usually dashes e.g. "en-sahih"
        // But some might conform to dots? Need to check both or normalize.
        // `useQuran.js` does `normalizeEditionId(id)` which replaces dots with dashes.

        const dirName = key.replace(/\./g, '-');
        const dirPath = path.join(TRANSLATIONS_DIR, dirName);
        const filePath = path.join(dirPath, '1.json');

        if (!fs.existsSync(filePath)) {
            report.missing.push(key);
            return;
        }

        try {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const data = JSON.parse(fileContent);
            const text = data.ayahs?.[0]?.text || '';

            if (text && ARABIC_REGEX.test(text)) {
                // It's Arabic. 
                // If the key starts with 'ar.', it might be OK (Arabic Tafsir).
                // But user asked to remove "non-working".
                // "ar.muyassar" etc are Tafsirs, they SHOULD be Arabic.
                // "ur.junagarhi" containing Arabic is WRONG.

                if (key.startsWith('ar.') || key.startsWith('quran') || key.includes('tafsir')) { // assuming tafsirs might be Arabic
                    // Check if it's explicitly an Arabic tafsir
                    if (key.startsWith('ar.')) {
                        report.ok.push(key);
                    } else {
                        // Check if verified as corrupted previously
                        report.corrupted.push(key);
                    }
                } else {
                    report.corrupted.push(key);
                }
            } else {
                report.ok.push(key);
            }
        } catch (e) {
            console.error(`Error reading ${key}:`, e.message);
            report.missing.push(key);
        }
    });

    console.log('\n--- AUDIT RESULTS ---');
    console.log(`OK: ${report.ok.length}`);
    console.log(`MISSING: ${report.missing.length}`);
    console.log(`CORRUPTED: ${report.corrupted.length}`);

    if (report.missing.length > 0) {
        console.log('\n[MISSING FILES] - To be removed:');
        console.log(JSON.stringify(report.missing, null, 2));
    }

    if (report.corrupted.length > 0) {
        console.log('\n[CORRUPTED/ARABIC CONTENT] - To be removed:');
        console.log(JSON.stringify(report.corrupted, null, 2));
    }

    // Save report for easy reading
    fs.writeFileSync('audit_report.json', JSON.stringify(report, null, 2));
};

start();
