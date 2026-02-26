import fs from 'fs';

const data = JSON.parse(fs.readFileSync('./public/data/hadith-qa/bukhari_qa_pair.json', 'utf8'));
const engBukhari = JSON.parse(fs.readFileSync('./public/data/hadith/bukhari/eng-bukhari.json', 'utf8'));

let matchStats = { parsed: 0, mapped: 0 };
let sample = [];

for (const item of data) {
  const match = item.reference.match(/Book (\d+)/i);
  if (match) {
    matchStats.parsed++;
    const bookId = match[1];
    const sectionName = engBukhari.metadata.sections[bookId];
    if (sectionName) {
      matchStats.mapped++;
      if (sample.length < 5) {
        sample.push({ q: item.question, topic: sectionName, ref: item.reference });
      }
    }
  }
}

console.log('Stats:', matchStats);
console.log('Sample:', sample);
