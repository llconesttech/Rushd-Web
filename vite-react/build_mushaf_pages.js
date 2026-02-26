import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const quranDir = path.join(__dirname, 'public', 'data', 'quran', 'v2');
const arabicFontsDir = path.join(quranDir, 'arabic');
const pagesDir = path.join(quranDir, 'pages');

if (!fs.existsSync(pagesDir)) {
  fs.mkdirSync(pagesDir, { recursive: true });
}

// Get all directories inside /arabic (these are the available scripts like quran-uthmani, quran-tajweed)
const scripts = fs.readdirSync(arabicFontsDir).filter(f => fs.statSync(path.join(arabicFontsDir, f)).isDirectory());

console.log(`Found ${scripts.length} Arabic script editions:`, scripts.join(', '));

for (const scriptFolder of scripts) {
  console.log(`\nProcessing Script: ${scriptFolder}...`);
  const scriptOutDir = path.join(pagesDir, scriptFolder);

  if (!fs.existsSync(scriptOutDir)) {
    fs.mkdirSync(scriptOutDir, { recursive: true });
  }

  // A dictionary holding Ayahs indexed by Page Number
  // Each page holds an array of Ayah objects { surah, text, ... }
  const pages = {};
  for (let p = 1; p <= 604; p++) {
    pages[p] = [];
  }

  // Read all 114 Surahs
  for (let s = 1; s <= 114; s++) {
    const surahFile = path.join(arabicFontsDir, scriptFolder, `${s}.json`);
    if (!fs.existsSync(surahFile)) {
      console.warn(`WARNING: Missing Surah ${s} for ${scriptFolder}`);
      continue;
    }

    const data = JSON.parse(fs.readFileSync(surahFile, 'utf8'));

    for (const ayah of data.ayahs) {
      const pageNum = ayah.page;

      if (pageNum && pages[pageNum]) {
        // Determine if this ayah starts a new surah line block
        const isSurahStart = (ayah.numberInSurah === 1);

        pages[pageNum].push({
          surahNumber: data.number,
          surahName: data.name,
          surahEnglishName: data.englishName,
          ayahNumber: ayah.number,
          ayahNumberInSurah: ayah.numberInSurah,
          text: ayah.text,
          juz: ayah.juz,
          ruku: ayah.ruku,
          manzil: ayah.manzil,
          hizbQuarter: ayah.hizbQuarter,
          sajda: ayah.sajda,
          isSurahStart: isSurahStart
        });
      }
    }
  }

  // Save each page out
  let savedPages = 0;
  for (let p = 1; p <= 604; p++) {
    const pageAyahs = pages[p];
    if (pageAyahs.length > 0) {
      fs.writeFileSync(path.join(scriptOutDir, `${p}.json`), JSON.stringify({
        page: p,
        ayahs: pageAyahs
      }));
      savedPages++;
    }
  }

  console.log(`Successfully chunked ${savedPages} pages for ${scriptFolder}.`);
}

console.log("\nFinished processing all Mushaf pages!");
