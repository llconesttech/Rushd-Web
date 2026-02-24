/* eslint-env node */
/* eslint-disable no-undef, no-unused-vars */
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'public', 'data', 'hadith');
const uniqueChapters = new Set();
let fileCount = 0;

function readDirRecursively(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      readDirRecursively(fullPath);
    } else if (file.endsWith('.json')) {
      try {
        const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
        if (data.metadata && data.metadata.sections) {
          Object.values(data.metadata.sections).forEach(name => {
            if (name && name.trim().length > 0) {
              uniqueChapters.add(name);
            }
          });
        }
        fileCount++;
      } catch (e) {
        // ignore
      }
    }
  }
}

readDirRecursively(dataDir);
console.log(`Successfully checked ${fileCount} JSON files.`);
console.log(`Found ${uniqueChapters.size} unique English chapter names.`);

