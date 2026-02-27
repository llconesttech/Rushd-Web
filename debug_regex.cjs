const fs = require('fs');

const html = fs.readFileSync('debug_scrape_fail.html', 'utf8');
console.log("File length:", html.length);

const keywords = [
    "TextResultEnglish",
    "class='TextResultEnglish'",
    "font class='TextResultEnglish'",
    "Asbab",
    "Wahidi"
];

keywords.forEach(kw => {
    const idx = html.indexOf(kw);
    console.log(`Keyword '${kw}': ${idx}`);
    if (idx !== -1) {
        console.log(`  Surrounding: ${html.substring(Math.max(0, idx - 20), idx + kw.length + 20)}`);
    }
});

// Hex dump of a small chunk around where we expect it
// Finding "TopLayer" which seemed to be before it
const anchor = "SearchResults";
const anchorIdx = html.indexOf(anchor);
if (anchorIdx !== -1) {
    console.log(`Anchor '${anchor}' found at ${anchorIdx}`);
    const chunk = html.substring(anchorIdx, anchorIdx + 1000);
    console.log("Chunk after anchor:", chunk);
}
