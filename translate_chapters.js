import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import translate from 'translate';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

translate.engine = 'google';

const dataDir = path.join(__dirname, 'public', 'data', 'hadith');

// Language code mapping from our file prefixes to Google Translate language codes
const langMap = {
  'ara': 'ar',
  'ben': 'bn',
  'fra': 'fr',
  'ind': 'id',
  'rus': 'ru',
  'tam': 'ta',
  'tur': 'tr',
  'urd': 'ur',
  'eng': 'en' // source
};

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  // 1. Gather all files
  const filesByLang = {};
  const uniqueEnglishChapters = new Set();

  function traverseTree(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        traverseTree(fullPath);
      } else if (file.endsWith('.json')) {
        const prefix = file.split('-')[0];
        if (!filesByLang[prefix]) {
          filesByLang[prefix] = [];
        }
        filesByLang[prefix].push(fullPath);

        // We use every section text we encounter as potential English text 
        // because all files currently have English texts
        try {
          const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
          if (data.metadata && data.metadata.sections) {
            for (const key of Object.keys(data.metadata.sections)) {
              const val = data.metadata.sections[key];
              if (val && val.trim().length > 0) {
                uniqueEnglishChapters.add(val.trim());
              }
            }
          }
        } catch (e) { /* ignore */ }
      }
    }
  }

  traverseTree(dataDir);

  const chaptersArray = Array.from(uniqueEnglishChapters);
  console.log(`Found ${chaptersArray.length} unique chapters across all files.`);

  // 2. Translate unique chapters for each target language
  const translationsBackupPath = path.join(__dirname, 'translations_cache.json');
  let translationCache = {};
  if (fs.existsSync(translationsBackupPath)) {
    try {
      translationCache = JSON.parse(fs.readFileSync(translationsBackupPath, 'utf8'));
      console.log("Loaded existing translation cache.");
    } catch (e) { /* ignore */ }
  }

  // Target prefixes (excluding eng and undefined)
  const targetLangs = Object.keys(filesByLang).filter(l => l !== 'eng' && langMap[l]);

  for (const prefix of targetLangs) {
    const googleLang = langMap[prefix];

    if (!translationCache[prefix]) {
      translationCache[prefix] = {};
    }

    console.log(`\nTranslating to ${prefix} (${googleLang})...`);
    let newlyTranslated = 0;

    for (const text of chaptersArray) {
      if (!translationCache[prefix][text]) {
        try {
          const translated = await translate(text, { from: 'en', to: googleLang });
          translationCache[prefix][text] = translated;
          newlyTranslated++;

          if (newlyTranslated % 20 === 0) {
            console.log(`  Translated ${newlyTranslated} items for ${prefix}...`);
            fs.writeFileSync(translationsBackupPath, JSON.stringify(translationCache, null, 2));
          }

          await sleep(300); // Play nice with the API rating limit

        } catch (e) {
          console.error(`  [!] Error translating to ${googleLang}: ${e.message}`);
          console.log('  Sleeping 5 seconds then retrying...');
          await sleep(5000);
          // Single retry
          try {
            const translated = await translate(text, { from: 'en', to: googleLang });
            translationCache[prefix][text] = translated;
            newlyTranslated++;
          } catch (err) {
            console.error(`  [!] Retry failed for "${text}". Using original text.`);
            // fallback to original if completely failed
            translationCache[prefix][text] = text;
          }
        }
      }
    }
    fs.writeFileSync(translationsBackupPath, JSON.stringify(translationCache, null, 2));
    if (newlyTranslated === 0) console.log(`  All items were already cached for ${prefix}.`);
  }

  console.log('\n================================.........');
  console.log('Translations generated/loaded. Applying to JSON files...');

  // 3. Apply translations
  for (const prefix of targetLangs) {
    const files = filesByLang[prefix] || [];
    for (const file of files) {
      try {
        const data = JSON.parse(fs.readFileSync(file, 'utf8'));
        let updated = false;

        if (data.metadata && data.metadata.sections) {
          for (const [sectionId, text] of Object.entries(data.metadata.sections)) {
            if (text && text.trim().length > 0) {
              const engText = text.trim();
              const translated = translationCache[prefix]?.[engText];

              // Check if translation exists and is different, or if it isn't an english pass through
              if (translated && translated !== data.metadata.sections[sectionId]) {
                data.metadata.sections[sectionId] = translated;
                updated = true;
              }
            }
          }
        }

        if (updated) {
          fs.writeFileSync(file, JSON.stringify(data, null, 2));
          console.log(`Updated ${path.basename(file)}`);
        }
      } catch (e) {
        console.error(`Failed to process ${file}:`, e.message);
      }
    }
  }

  console.log('\nFinished updating all non-English JSON files!');
}

run().catch(console.error);
