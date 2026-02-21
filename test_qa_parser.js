import fs from 'fs';
import path from 'path';

const files = ['bukhari_qa_pair.json', 'muslim_qa_pair.json', 'tirmidhi_qa_pair.json', 'ahmad_qa_pair.json'];

for (const f of files) {
  const data = JSON.parse(fs.readFileSync('./public/data/hadith-qa/' + f, 'utf8'));
  let matchStats = { parsed: 0, total: data.length };
  let sample = [];

  for (const item of data) {
    const match = item.reference.match(/Book (\d+)/i) || item.reference.match(/hadith (\d+)/i);
    if (match) {
      matchStats.parsed++;
    } else {
      if (sample.length < 3) sample.push(item.reference);
    }
  }
  console.log(f, 'Stats:', matchStats);
  if (sample.length > 0) console.log(f, 'Unparsed Examples:', sample);
}
