const fs = require('fs');
const path = require('path');

// Paths
const CSV_PATH = 'c:/Users/User/Downloads/all_rawis.csv';
const MASTER_JSON_PATH = path.join(__dirname, '../public/data/hadith/narrator_master.json');
const OUT_MAP_PATH = path.join(__dirname, 'narrator_csv_map.json');

// Normalizer
function normalize(str) {
    if (!str) return '';
    return str.toLowerCase()
        .replace(/['`‘’]/g, '')
        .replace(/\(.*\)/g, '') // Remove (RA), (saw), etc.
        .replace(/\b(ibn|bin|b\.|b)\b/g, 'bin')
        .replace(/ghaffari/g, 'ghifari') // Normalize Ghaffari -> Ghifari
        .replace(/ah\b/g, 'a') // Normalize ta-marbuta endings: Umamah -> Umama, Aishah -> Aisha
        .replace(/\s+/g, ' ')
        .trim();
}

function formatParents(raw) {
    if (!raw || raw === 'NA') return '';
    const parts = raw.split('/');
    if (parts.length === 1) return `Father: ${parts[0].trim()}`;

    const father = parts[0].trim();
    const mother = parts.slice(1).join('/').trim();

    if (father && mother) return `Father: ${father} • Mother: ${mother}`;
    if (father) return `Father: ${father}`;
    if (mother) return `Mother: ${mother}`;
    return raw;
}

function parseCSVLine(line) {
    // Basic CSV parser handling quotes
    const result = [];
    let start = 0;
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        if (line[i] === '"') {
            inQuotes = !inQuotes;
        } else if (line[i] === ',' && !inQuotes) {
            result.push(line.substring(start, i).replace(/^"|"$/g, '').trim());
            start = i + 1;
        }
    }
    result.push(line.substring(start).replace(/^"|"$/g, '').trim());
    return result;
}

function main() {
    console.log('📖 Reading Master JSON...');
    const masterData = JSON.parse(fs.readFileSync(MASTER_JSON_PATH, 'utf8'));
    console.log(`Loaded ${masterData.narrators.length} narrators.`);

    console.log('📖 Reading CSV...');
    const csvContent = fs.readFileSync(CSV_PATH, 'utf8');
    const lines = csvContent.split('\n').filter(l => l.trim());
    const csvHeaders = parseCSVLine(lines[0]);

    // Map CSV data
    const csvNarrators = [];
    for (let i = 1; i < lines.length; i++) {
        const cols = parseCSVLine(lines[i]);
        if (cols.length < 2) continue;

        const rawName = cols[1]; // Name column
        // Split "Name ( Arabic )"
        const nameParts = rawName.split('(');
        const enName = nameParts[0].trim();

        csvNarrators.push({
            id: cols[0], // scholar_indx
            nameRaw: rawName,
            nameEn: enName,
            norm: normalize(enName),
            grade: cols[2],
            parents: formatParents(cols[3]),
            spouse: cols[4],
            siblings: cols[5],
            children: cols[6],
            birth_date_place: cols[7],
            places_of_stay: cols[8],
            death_date_place: cols[9],
            teachers: cols[10],
            students: cols[11],
            area_of_interest: cols[12] ? cols[12].replace(/%20/g, ' ') : '',
            tags: cols[13] ? cols[13].replace(/%20/g, ' ') : ''
        });
    }
    console.log(`Loaded ${csvNarrators.length} CSV entries.`);

    // Matching
    let exactMatches = 0;
    let fuzzyMatches = 0;
    const mapping = {};

    masterData.narrators.forEach(n => {
        const normKey = normalize(n.canonical);

        // Strategy 1: Exact Normalized Match
        let match = csvNarrators.find(c => c.norm === normKey);

        // Strategy 2: Contains Match (for compound names)
        if (!match) {
            match = csvNarrators.find(c => c.norm.includes(normKey) || normKey.includes(c.norm));
            if (match) fuzzyMatches++;
        } else {
            exactMatches++;
        }

        if (match) {
            mapping[n.canonical] = {
                csvId: match.id,
                grade: match.grade,
                death: match.death_date_place, // using full death_date_place
                full_name: match.nameEn,
                parents: match.parents,
                spouse: match.spouse,
                siblings: match.siblings,
                children: match.children,
                birth_date_place: match.birth_date_place,
                places_of_stay: match.places_of_stay,
                teachers: match.teachers,
                students: match.students,
                area_of_interest: match.area_of_interest,
                tags: match.tags
            };
        }
    });

    console.log('-----------------------------------');
    console.log(`✅ Exact Matches: ${exactMatches}`);
    console.log(`⚠️ Fuzzy Matches: ${fuzzyMatches}`);
    console.log(`❌ Unmatched: ${masterData.narrators.length - (exactMatches + fuzzyMatches)}`);
    console.log(`📊 Match Rate: ${Math.round(((exactMatches + fuzzyMatches) / masterData.narrators.length) * 100)}%`);

    fs.writeFileSync(OUT_MAP_PATH, JSON.stringify(mapping, null, 2));
    console.log(`💾 Saved mapping to ${OUT_MAP_PATH}`);
}

main();
