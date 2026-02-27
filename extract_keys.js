import fs from 'fs';

const cache = JSON.parse(fs.readFileSync('translations_cache.json', 'utf8'));
const ben = cache['ben'];

// Dump just the english keys
const keys = Object.keys(ben);
fs.writeFileSync('ben_keys.txt', keys.join('\n'));
console.log('Saved to ben_keys.txt');
