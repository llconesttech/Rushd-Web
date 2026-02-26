import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, 'public', 'data', 'hadith');
const cachePath = path.join(__dirname, 'translations_cache.json');

const translationCache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));

const langMap = {
  'ara': 'ar',
  'ben': 'bn',
  'fra': 'fr',
  'ind': 'id',
  'rus': 'ru',
  'tam': 'ta',
  'tur': 'tr',
  'urd': 'ur'
};

const targetPrefixes = Object.keys(langMap);

function traverseTree(dir) {
  let filesUpdated = 0;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      filesUpdated += traverseTree(fullPath);
    } else if (file.endsWith('.json')) {
      const prefix = file.split('-')[0];
      const bookId = file.split('-').slice(1).join('-'); // handles 'eng-bukhari.json'

      if (targetPrefixes.includes(prefix)) {
        try {
          // We need the english file to read the original keys from, 
          // because the target file already has (poorly) translated keys which won't match our cache mapping.
          const engFilePath = path.join(dir, `eng-${bookId}`);
          if (!fs.existsSync(engFilePath)) continue;

          const engData = JSON.parse(fs.readFileSync(engFilePath, 'utf8'));
          const targetData = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
          let updated = false;

          if (engData.metadata && engData.metadata.sections && targetData.metadata && targetData.metadata.sections) {
            for (const [sectionId, text] of Object.entries(engData.metadata.sections)) {
              if (text && text.trim().length > 0) {
                const engText = text.trim();
                const translated = translationCache[prefix]?.[engText];

                if (translated && translated !== targetData.metadata.sections[sectionId]) {
                  targetData.metadata.sections[sectionId] = translated;
                  updated = true;
                }
              }
            }
          }

          if (updated) {
            fs.writeFileSync(fullPath, JSON.stringify(targetData, null, 2));
            console.log(`Updated ${path.basename(fullPath)}`);
            filesUpdated++;
          }
        } catch (e) {
          console.error(`Failed to process ${fullPath}:`, e.message);
        }
      }
    }
  }
  return filesUpdated;
}

console.log('Applying translations from cache...');
const totalUpdated = traverseTree(dataDir);
console.log(`Finished updating ${totalUpdated} JSON files.`);
