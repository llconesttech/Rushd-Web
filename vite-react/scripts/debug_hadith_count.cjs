
const fs = require('fs');
const path = require('path');

const filePath = path.join('e:/Projects/global-quran/public/data/hadith/bukhari/eng-bukhari.json');

try {
    const data = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(data);

    console.log('Metadata:', JSON.stringify(json.metadata, null, 2));
    console.log('Hadiths Array Length:', json.hadiths.length);

    // Check for duplicates or gaps
    const hadithNumbers = json.hadiths.map(h => h.hadithnumber);
    const uniqueHadithNumbers = new Set(hadithNumbers);
    console.log('Unique Hadith Numbers:', uniqueHadithNumbers.size);

    // Check first and last
    console.log('First Hadith Number:', hadithNumbers[0]);
    console.log('Last Hadith Number:', hadithNumbers[hadithNumbers.length - 1]);

    // Check references
    const referenceNumbers = json.hadiths.map(h => h.reference?.hadith).filter(n => n !== undefined);
    console.log('Reference Hadith Numbers Count:', referenceNumbers.length);

} catch (err) {
    console.error('Error reading file:', err);
}
