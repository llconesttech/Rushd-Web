import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base directory for translations
const OUTPUT_DIR = path.join(__dirname, '../public/data/quran/v2/translations');

// Mapping of our internal IDs to fawazahmed0/quran-api edition IDs
const EDITION_MAPPING = {
    // Originally Fixed
    'it.piccardo': 'ita-hamzarobertopic',
    'fr.hamidullah': 'fra-muhammadhamidul',
    'de.khoury': 'deu-adeltheodorkhou',
    'es.cortes': 'spa-juliocortes',
    'ru.kuliev': 'rus-ministryofawqa',
    'sq.ahmeti': 'sqi-sherifahmeti',
    'ko.korean': 'kor-hamidchoi',
    'ku.asan': 'kur-burhanmuhammad',
    'nl.keyzer': 'nld-salomokeyzer',
    'sv.bernstrom': 'swe-knutbernstrom',

    // New Corrupted List
    'az.mammadaliyev': 'aze-vasimmammadaliy', // or aze-khanmusayev
    'az.musayev': 'aze-khanmusayev',
    'bg.theophanov': 'bul-tzvetantheophan',
    'bn.bengali': 'ben-muhiuddinkhan',
    'bs.korkut': 'bos-besimkorkut',
    'bs.mlivo': 'bos-mustafamlivo',
    'cs.hrbek': 'ces-hadiabdollahian', // closest avail? check source
    'cs.nykl': 'ces-arnykl',
    'de.aburida': 'deu-aburida',
    'de.bubenheim': 'deu-asfbubenheimand',
    'de.zaidan': 'deu-amirzaidan',
    'dv.divehi': 'div-officeofthepres',
    'en.arberry': 'eng-arthurjohnarber',
    'en.asad': 'eng-muhammadasad',
    'en.daryabadi': 'eng-abdulmajiddarya',
    'en.hilali': 'eng-muhammadtaqiudd',
    'en.maududi': 'eng-abulalamaududi', // tafsirs handled separately? this is trans
    'en.qaribullah': 'eng-hasanalfatihqar',
    'en.sarwar': 'eng-muhammadsarwar',
    'en.shakir': 'eng-mohammadhabibsh',
    'en.yusufali': 'eng-abdullahyusufal',
    'es.asad': 'spa-muhammadasadabd',
    'fa.ansarian': 'fas-sayyedmohammad', // check
    'fa.ayati': 'fas-abdolmohammaday',
    'fa.fooladvand': 'fas-mohammadmahdifo',
    'fa.ghomshei': 'fas-mahdiilahiqoms',
    'fa.makarem': 'fas-nassermakaremsh',
    'ha.gumi': 'hau-abubakarmahmoud',
    'hi.farooq': 'hin-muhammadfarooqk',
    'hi.hindi': 'hin-suhelfarooqkhan',
    'id.indonesian': 'ind-indonesianminis',
    'id.muntakhab': 'ind-quraishshihabh', // unavailable? check
    'ja.japanese': 'jpn-ryoichimita',
    'ml.abdulhameed': 'mal-abdulhameedmada',
    'ms.basmeih': 'msa-abdullahmuhamma',
    'no.berg': 'nor-einarberg',
    'pl.bielawskiego': 'pol-jozefabielawski',
    'pt.elhayek': 'por-samirelhayek',
    'ro.grigore': 'ron-georgegrigore',
    'ur.jalandhry': 'urd-fatehmuhammadja',
    'ur.maududi': 'urd-abulalamaududi',

    // Phase 2 Fixes (User Reported)
    'ug.saleh': 'uig-muhammadsaleh',
    'uz.sodik': 'uzb-muhammadsodikm',
    'ur.junagarhi': 'urd-muhammadjunagar',
    'ur.ahmedali': 'urd-ahmedali',
    'tr.ates': 'tur-suleymanates',
    'tr.bulac': 'tur-alibulac',
    'tr.diyanet': 'tur-diyanetisleri',
    'tr.golpinarli': 'tur-abdulbakigolpin',
    'tr.ozturk': 'tur-yasarnuriozturk', // verifying availability
    'tr.vakfi': 'tur-diyanetvakfi',
    'tr.yazir': 'tur-elmalilihamdi',
    'tt.nugman': 'tat-yakubibnnugman',
    'th.thai': 'tha-kingfahadquranc',
    'ta.tamil': 'tam-janturstfoundation',
    'tg.ayati': 'tgk-abdolmohammaday',
    'zh.jian': 'zho-majian',
    'zh.majian': 'zho-majian', // same source key? check

    // Tafsirs - fawazahmed0 has some, but maybe not all.
    // We will try to map what we can.
    // If not available, we might skip them or map to base translation.
    'en.ibnkathir': 'eng-tafsiribnkathir', // or similar
};

const BASE_URL = 'https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions';

const downloadJson = (url) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
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

const processEdition = async (internalId, sourceId) => {
    console.log(`Processing ${internalId} (Source: ${sourceId})...`);

    // Create directory: internalId normally has dots, but our file system uses dashes or dots?
    // Based on previous findings, the directory is named `it-piccardo` (dashes) for some, but `sq.ahmeti` (dots) for others?
    // Wait, `list_dir` showed `it-piccardo` but `sq.ahmeti` was missing.
    // usage in app: `normalizeEditionId` replaces `.` with `-` (lines 29 of `useQuran.js`).
    // So directory MUST be `it-piccardo`.
    const dirName = internalId.replace('.', '-');
    const editionDir = path.join(OUTPUT_DIR, dirName);

    if (!fs.existsSync(editionDir)) {
        fs.mkdirSync(editionDir, { recursive: true });
    }

    try {
        const url = `${BASE_URL}/${sourceId}.json`;
        console.log(`Downloading full Quran from ${url}...`);
        const data = await downloadJson(url);

        if (!data || !data.quran) {
            console.error(`Invalid data for ${internalId}`);
            return;
        }

        // fawazahmed0 API returns full Quran in one JSON: { quran: [ { chapter: 1, verse: 1, text: "..." }, ... ] }
        // We need to split it into per-surah files: 1.json, 2.json...

        const ayahsBySurah = {};

        data.quran.forEach(ayah => {
            if (!ayahsBySurah[ayah.chapter]) {
                ayahsBySurah[ayah.chapter] = [];
            }
            ayahsBySurah[ayah.chapter].push({
                number: ayah.verse,
                text: ayah.text
            });
        });

        // Write files
        for (let s = 1; s <= 114; s++) {
            const surahAyahs = ayahsBySurah[s] || [];
            const output = {
                number: s,
                edition: internalId,
                ayahs: surahAyahs
            };

            const dest = path.join(editionDir, `${s}.json`);
            fs.writeFileSync(dest, JSON.stringify(output));
        }
        console.log(`Seeaved ${internalId} to ${dirName}/`);

    } catch (err) {
        console.error(`Error processing ${internalId}:`, err.message);
    }
};

const start = async () => {
    console.log('Starting translation downloads...');

    // Allow passing specific IDs via CLI args
    const args = process.argv.slice(2);
    const targets = args.length > 0 ? args : Object.keys(EDITION_MAPPING);

    for (const key of targets) {
        if (EDITION_MAPPING[key]) {
            await processEdition(key, EDITION_MAPPING[key]);
        } else {
            // Try to find if provided arg is a source ID or internal ID?
            // For now just skip if not in mapping
            console.log(`No mapping found for ${key}, skipping.`);
        }
    }
    console.log('Done.');
};

start();
