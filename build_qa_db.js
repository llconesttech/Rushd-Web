import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const qaDir = path.join(__dirname, 'public', 'data', 'hadith-qa');
const hadithDir = path.join(__dirname, 'public', 'data', 'hadith');

const books = [
  { qaFile: 'bukhari_qa_pair.json', bookId: 'bukhari' },
  { qaFile: 'muslim_qa_pair.json', bookId: 'muslim' },
  { qaFile: 'tirmidhi_qa_pair.json', bookId: 'tirmidhi' },
  { qaFile: 'ahmad_qa_pair.json', bookId: 'ahmad' }
];

let masterIndex = [];

for (const b of books) {
  console.log(`Processing ${b.bookId}...`);
  const qaPath = path.join(qaDir, b.qaFile);
  if (!fs.existsSync(qaPath)) {
    console.warn(`File not found: ${qaPath}`);
    continue;
  }
  const qaData = JSON.parse(fs.readFileSync(qaPath, 'utf8'));

  let chapterNames = {};
  if (b.bookId !== 'ahmad') {
    try {
      const hadithJson = JSON.parse(fs.readFileSync(path.join(hadithDir, b.bookId, `eng-${b.bookId}.json`), 'utf8'));
      chapterNames = hadithJson.metadata.sections || {};
    } catch (e) {
      console.warn(`Could not load english hadith metadata for ${b.bookId}`);
    }
  }

  const outDir = path.join(qaDir, b.bookId);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const chunks = {};

  for (let i = 0; i < qaData.length; i++) {
    const item = qaData[i];

    let chapterId = '1';
    const match = item.reference.match(/Book (\d+)/i) || item.reference.match(/hadith (\d+)/i);
    if (match) {
      chapterId = match[1];
    }

    if (!chunks[chapterId]) chunks[chapterId] = [];

    const qaId = `${b.bookId}-${chapterId}-${chunks[chapterId].length + 1}`;
    item.id = qaId;

    chunks[chapterId].push(item);

    // Strip out HTML tags or crazy newlines from topic names
    let topicName = chapterNames[chapterId] || `Book ${chapterId}`;
    topicName = topicName.replace(/<[^>]+>/g, '').trim();
    if (!topicName) topicName = `Book ${chapterId}`;

    masterIndex.push({
      id: qaId,
      q: item.question,
      t: topicName,
      b: b.bookId,
      ch: chapterId
    });
  }

  for (const [ch, items] of Object.entries(chunks)) {
    fs.writeFileSync(path.join(outDir, `${ch}.json`), JSON.stringify(items));
  }
  console.log(`Saved ${Object.keys(chunks).length} chunks for ${b.bookId}.`);
}

fs.writeFileSync(path.join(qaDir, 'qa_search_index.json'), JSON.stringify(masterIndex));
console.log(`Saved master index with ${masterIndex.length} questions. Size: ${(fs.statSync(path.join(qaDir, 'qa_search_index.json')).size / 1024 / 1024).toFixed(2)} MB`);

// Generate highly optimized Topics overview
const topicsMap = {};

for (const q of masterIndex) {
  if (!topicsMap[q.t]) {
    topicsMap[q.t] = { name: q.t, total: 0, refs: {} };
  }
  const t = topicsMap[q.t];
  t.total++;

  if (!t.refs[q.b]) {
    t.refs[q.b] = {};
  }
  if (!t.refs[q.b][q.ch]) {
    t.refs[q.b][q.ch] = 0;
  }
  t.refs[q.b][q.ch]++;
}

const topicsArr = Object.values(topicsMap).sort((a, b) => b.total - a.total);
fs.writeFileSync(path.join(qaDir, 'qa_topics.json'), JSON.stringify(topicsArr));
console.log(`Saved topics index with ${topicsArr.length} topics. Size: ${(fs.statSync(path.join(qaDir, 'qa_topics.json')).size / 1024).toFixed(2)} KB`);

