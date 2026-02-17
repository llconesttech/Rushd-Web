/**
 * Analyze narrator names from narrators.json and find potential duplicates.
 * Groups similar names using multiple strategies:
 *   1. Exact substring matching (e.g., "Abu Sa'id" is prefix of "Abu Sa'id Al-Khudri")
 *   2. Apostrophe/backtick normalization
 *   3. Common suffix removal (bin, ibn, al-, etc.)
 *   4. Simple Levenshtein distance for close matches
 */

const fs = require('fs');
const path = require('path');

const data = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'public', 'data', 'hadith', 'narrators.json'), 'utf8')
);

// Collect all unique narrator names with their total hadith counts across books
const globalNarrators = {};

for (const [bookId, bookData] of Object.entries(data)) {
    if (!bookData?.narrators) continue;
    for (const [name, hadithNums] of Object.entries(bookData.narrators)) {
        if (!globalNarrators[name]) {
            globalNarrators[name] = { count: 0, books: [] };
        }
        globalNarrators[name].count += hadithNums.length;
        globalNarrators[name].books.push(bookId);
    }
}

const allNames = Object.keys(globalNarrators);
console.log(`Total unique narrator names: ${allNames.length}\n`);

// Normalize a name for comparison
function normalize(name) {
    return name
        .toLowerCase()
        .replace(/[`'ʿʾ'']/g, '')     // remove apostrophes
        .replace(/\s*\(.*?\)\s*/g, '') // remove parentheticals
        .replace(/,.*$/, '')           // remove everything after comma
        .replace(/\b(r\.a\.?|may allah be pleased with (him|her|them))\b/gi, '')
        .replace(/\b(the prophet|the messenger)\b/gi, '')
        .replace(/-/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

// Levenshtein distance
function levenshtein(a, b) {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            dp[i][j] = a[i - 1] === b[j - 1]
                ? dp[i - 1][j - 1]
                : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
    }
    return dp[m][n];
}

// Build clusters using Union-Find
class UnionFind {
    constructor(n) { this.parent = Array.from({ length: n }, (_, i) => i); }
    find(x) { return this.parent[x] === x ? x : (this.parent[x] = this.find(this.parent[x])); }
    union(a, b) { this.parent[this.find(a)] = this.find(b); }
}

const uf = new UnionFind(allNames.length);
const normMap = {};

// Index by normalized name
allNames.forEach((name, i) => {
    const norm = normalize(name);
    if (!normMap[norm]) normMap[norm] = [];
    normMap[norm].push(i);
});

// Phase 1: Exact normalized match
for (const indices of Object.values(normMap)) {
    for (let k = 1; k < indices.length; k++) {
        uf.union(indices[0], indices[k]);
    }
}

// Phase 2: Substring / prefix matching on normalized names
const normEntries = allNames.map((name, i) => ({ name, norm: normalize(name), i }));
normEntries.sort((a, b) => a.norm.localeCompare(b.norm));

for (let i = 0; i < normEntries.length; i++) {
    for (let j = i + 1; j < normEntries.length; j++) {
        const a = normEntries[i].norm;
        const b = normEntries[j].norm;

        // If one is a clean prefix of the other (e.g., "abu said" vs "abu said al khudri")
        if (b.startsWith(a + ' ') || a.startsWith(b + ' ')) {
            uf.union(normEntries[i].i, normEntries[j].i);
        }

        // Stop looking too far ahead (sorted, so names diverge)
        if (b.substring(0, 3) !== a.substring(0, 3)) break;
    }
}

// Phase 3: Levenshtein for close matches (only for names with same first 3 chars)
for (let i = 0; i < normEntries.length; i++) {
    for (let j = i + 1; j < normEntries.length; j++) {
        const a = normEntries[i].norm;
        const b = normEntries[j].norm;

        if (b.substring(0, 3) !== a.substring(0, 3)) break;

        const maxLen = Math.max(a.length, b.length);
        if (maxLen < 4) continue;

        const dist = levenshtein(a, b);
        // Allow edit distance <= 2 for names > 5 chars, or <= 1 for shorter
        const threshold = maxLen > 8 ? 3 : maxLen > 5 ? 2 : 1;
        if (dist <= threshold && dist > 0) {
            uf.union(normEntries[i].i, normEntries[j].i);
        }
    }
}

// Build clusters
const clusters = {};
allNames.forEach((name, i) => {
    const root = uf.find(i);
    if (!clusters[root]) clusters[root] = [];
    clusters[root].push(name);
});

// Filter to only clusters with more than 1 name (potential duplicates)
const duplicateClusters = Object.values(clusters)
    .filter(c => c.length > 1)
    .map(names => ({
        names: names.sort((a, b) => (globalNarrators[b].count - globalNarrators[a].count)),
        totalHadiths: names.reduce((s, n) => s + globalNarrators[n].count, 0),
        details: names.map(n => `${n} (${globalNarrators[n].count} hadiths in ${globalNarrators[n].books.join(', ')})`),
    }))
    .sort((a, b) => b.totalHadiths - a.totalHadiths);

console.log(`Found ${duplicateClusters.length} clusters with potential duplicates:\n`);
console.log('='.repeat(80));

duplicateClusters.forEach((cluster, idx) => {
    console.log(`\n📌 CLUSTER ${idx + 1} — ${cluster.totalHadiths} total hadiths`);
    cluster.details.forEach(d => console.log(`   • ${d}`));
});

// Also output as JSON for later use
const outPath = path.join(__dirname, '..', 'public', 'data', 'hadith', 'narrator_clusters.json');
fs.writeFileSync(outPath, JSON.stringify(duplicateClusters, null, 2), 'utf8');
console.log(`\n\n📁 Full cluster data saved to ${outPath}`);
console.log(`📊 ${duplicateClusters.length} clusters, ${duplicateClusters.reduce((s, c) => s + c.names.length, 0)} names involved`);
