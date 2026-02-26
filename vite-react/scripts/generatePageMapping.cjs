const fs = require('fs');
const path = require('path');

const quranPath = path.join(__dirname, '../public/data/quran/v2/arabic/quran-uthmani');
const outputPath = path.join(__dirname, '../src/data/pageMapping.js');

const pageMap = {};

// Initialize pages 1-604
for (let i = 1; i <= 604; i++) {
    pageMap[i] = {
        start: null,
        end: null,
        surahs: {} // { surahNum: { startAyah, endAyah } }
    };
}

// Read all 114 surahs
for (let i = 1; i <= 114; i++) {
    try {
        const filePath = path.join(quranPath, `${i}.json`);
        const content = fs.readFileSync(filePath, 'utf8');
        const surah = JSON.parse(content);

        surah.ayahs.forEach(ayah => {
            const page = ayah.page;
            if (!pageMap[page]) return; // Should not happen

            // Update start/end for the page overall
            if (!pageMap[page].start) pageMap[page].start = { surah: i, ayah: ayah.number };
            pageMap[page].end = { surah: i, ayah: ayah.number };

            // Update per-surah range on this page
            if (!pageMap[page].surahs[i]) {
                pageMap[page].surahs[i] = { start: ayah.number, end: ayah.number };
            } else {
                pageMap[page].surahs[i].end = ayah.number;
            }
        });

    } catch (err) {
        console.error(`Error reading surah ${i}:`, err);
    }
}

const fileContent = `// Auto-generated page mapping
// Maps Page Number -> Surah/Ayah ranges
export const pageMapping = ${JSON.stringify(pageMap, null, 2)};
`;

fs.writeFileSync(outputPath, fileContent);
console.log(`Successfully generated pageMapping.js at ${outputPath}`);
