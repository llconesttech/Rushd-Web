/**
 * Build narrator_master.json with canonical name normalization.
 * Uses user-reviewed aliases and multi-pattern extraction.
 *
 * Output: public/data/hadith/narrator_master.json
 *   {
 *     "narrators": [ { id, canonical, aliases, hadiths: [{book, number, grade}], totalCount, books } ],
 *     "aliasIndex": { "lowercase alias": "narrator-id" }
 *   }
 */

const fs = require('fs');
const path = require('path');

// ─── User-Confirmed Canonical Mappings ────────────────────────────────────────
// Each entry: canonical -> array of known aliases (lowercased for matching)
const CANONICAL_ALIASES = {
    "Abu Hurairah": [
        "abu huraira", "abu hurairah", "abu hurayrah", "abuhurayrah",
        "abuhuraira", "abuhurairah", "abu huraira al-dawsi",
        "abu huraira al-dusi", "abu hurairah al-dawsi", "abu huraira ad-dausi",
        "abu huraira-", "ata (while abu huraira was narrating (see previous hadith))",
        "abi huraira", "abnu hurairah", "abu hurairh", "abu-huraira"
    ],
    "Aishah bint Abi Bakr": [
        "aisha", "'aisha", "`aisha", "aishah", "'a'ishah", "'aishah",
        "ummul mu'minin 'aishah", "ummul mu'minin aishah",
        "a'ishah", "a'isha", "umm al-mu'minin 'aisha",
        "'a'isha", "a'isha (the mother of the faithful believers)",
        "'aishah",
        // Honorific suffixes/prefixes
        "aishah the mother of the believers", "'aishah the mother of the believers",
        "aishah [may allah be pleased with her]",
        "aisha the wife of the prophet", "aishah the wife of the prophet",
        "'aishah the wife of the prophet",
        "aisha the mother of the faithful believers",
        "aisha may allah be pleased with her",
        "the mother of the belivers aishah",
        "ummul mu'minin",
        // Narrative variations (X from Aisha, Aisha said, etc)
        "urwa from aisha", "urwa on the authority of `aisha", "urwa from `aisha",
        "amra bint `abdur-rahman from `aisha",
        "a freed slave of 'aishah", "abu yunus, the freed slave of 'aishah",
        "aishah said that the prophet", "from aishah that the messenger of allah",
        "aishah mentioned a similar report and",
        "aishah was asked about drinks and she"
    ],
    "'Abdullah ibn 'Abbas": [
        "ibn `abbas", "ibn 'abbas", "ibn abbas",
        "`abdullah bin `abbas", "'abdullah bin 'abbas",
        "abdullah bin abbas", "'abdullah ibn 'abbas",
        "abdullah bin 'abbas", "abdullah ibn abbas",
        "'abdullah bin abbas", "ibn ' `abbas", "ibn' `abbas",
        "ibn ' 'abbas"
    ],
    "Anas ibn Malik": [
        "anas", "anas bin malik", "anas ibn malik",
        "anas b. malik", "anas b malik"
    ],
    "'Abdullah ibn 'Umar": [
        "ibn `umar", "ibn 'umar", "ibn umar",
        "`abdullah bin `umar", "'abdullah bin 'umar",
        "abdullah bin umar", "'abdullah ibn 'umar",
        "abdullah bin 'umar", "abdullah ibn umar",
        "'abdullah bin umar", "ibn 'umar from 'umar",
        "ibn' `umar", "ibn. `umar",
        "nafi` from ibn `umar", "nafi' from ibn 'umar"
    ],
    "Jabir ibn 'Abdullah": [
        "jabir bin `abdullah", "jabir bin 'abdullah",
        "jabir ibn abdullah", "jabir ibn 'abdullah",
        "jabir bin abdullah", "jabir b. 'abdullah",
        "jabir", "jabir bin abdullah al-ansari",
        "jabir ibn 'abdullah al-ansari"
    ],
    "Abu Sa'id al-Khudri": [
        "abu sa`id al-khudri", "abu sa'id al-khudri",
        "abu said al-khudri", "abusa'id al-khudri",
        "abu sa`id", "abu sa'id", "abu said",
        "abusa'id", "abu sa'eed al-khudri",
        "abu saeed al-khudri"
    ],
    "Abu Musa al-Ash'ari": [
        "abu musa", "abu musa al-ash'ari",
        "abumusa al-ash'ari", "abumusa", "abu musa al-ashari",
        "abu musa ash'ari", "abumusa al-ashari"
    ],
    "'Ali ibn Abi Talib": [
        "`ali", "'ali", "ali",
        "'ali bin abu talib", "'ali bin abi talib",
        "ali ibn abutalib", "ali ibn abi talib",
        "'ali ibn abi talib", "'ali bin 'ali"
    ],
    "al-Bara' ibn 'Azib": [
        "al-bara", "al-bara'", "al-bara' bin 'azib",
        "al-bara bin 'azib", "al-bara' ibn 'azib",
        "al-bara bin azib"
    ],
    "'Umar ibn al-Khattab": [
        "`umar bin al-khattab", "'umar bin al-khattab",
        "umar bin al-khattab", "'umar", "umar",
        "umar ibn al-khattab", "'umar ibn al-khattab",
        "umar b. al-khattab"
    ],
    "'Abdullah ibn Mas'ud": [
        "ibn mas'ud", "ibn masud", "'abdullah ibn mas'ud",
        "abdullah bin mas'ud", "abdullah ibn masud",
        "'abdullah bin mas'ud"
    ],

    // ─── Cluster 11: Sahl (SPLIT) ───
    "Sahl ibn Sa'd al-Sa'idi": [
        "sahl bin sa`d", "sahl bin sa'd", "sahl bin sad",
        "sahl", "sahl bin sa'd as-sa'idi", "sahl ibn sa'd",
        "sahl b. sa'd"
    ],
    "Sahl ibn Hanif": [
        "sahl bin hanif", "sahl bin hunaif", "sahl ibn hanif"
    ],

    // ─── Cluster 49: Ka'b (SPLIT) ───
    "Ka'b ibn Malik": [
        "ka'b bin malik", "ka`b bin malik", "ka'b", "kab bin malik",
        "ka'b ibn malik", "ka`b", "kab"
    ],
    "Ka'b ibn 'Ujrah": [
        "ka'b bin ujra", "ka`b bin ujra", "ka'b bin 'ujrah",
        "ka'b bin 'ujra", "ka'b bin 'ujara", "ka'b bun ujrah",
        "kab bin ujrah", "ka'b ibn ujrah", "ka'b ibn ujra",
        "ka`b bin 'ujra", "kab bin 'ujrah"
    ],

    // ─── Cluster 51: Sa'eed (SPLIT) ───
    "Sa'id ibn Jubair": [
        "sa'eed bin jubair", "saeed bin jubair", "sa'id bin jubair",
        "said bin jubair", "sa'eed bin jubair", "sa'id ibn jubair"
    ],
    "Sa'id ibn Zaid": [
        "sa'eed bin zaid", "saeed bin zaid", "sa'id bin zaid",
        "sa'eed bin zaid bin 'amr", "sa'eed bin zaid bin 'amr bin nufail"
    ],

    // ─── Cluster 52: Hisham (SPLIT) ───
    "Hisham ibn 'Urwah": [
        "hisham bin 'urwah", "hisham bin 'urwa", "hisham b. 'urwah",
        "hisham bin urwah", "hisham ibn 'urwa",
        "hisham"  // in ambiguous cases, usually Hisham ibn 'Urwah
    ],
    "Hisham ibn 'Amir": [
        "hisham bin 'amir", "hisham bin amir", "hisham ibn amir"
    ],
    "Hisham ibn Zaid": [
        "hisham bin zaid", "hisham b. zaid"
    ],

    // ─── Cluster 53: Ikrimah (SPLIT) ───
    "Ikrimah mawla ibn 'Abbas": [
        "ikrima", "ikrimah", "ikramah", "ikrimah narrated",
        "ikrima from ibn 'abbas", "ikrimah, from ibn 'abbas"
    ],
    "Ikrimah ibn Abi Jahl": [
        "ikrimah bin abi jahl", "ikrimah ibn abujahl",
        "ikrima bin abi jahl"
    ],

    // ─── Cluster 54: Alqamah (SPLIT) ───
    "Alqamah ibn Qais al-Nakha'i": [
        "alqama", "alqamah", "alqamah bin qais", "alqama bin waqqas",
        "alqamah bin waqqas"
    ],
    "Alqamah ibn Wa'il": [
        "alqamah bin wa'il", "alqamah bin wa'il al-kindi",
        "alqamah ibn wa'il", "alqamah b. wa'il",
        "alqamah b. wa'il b. hujr", "alqamah binwa'il"
    ],

    // ─── Cluster 57: Thawban ───
    "Thawban": [
        "thawban", "thawban, the freed slave of the messenger",
        "thawban, the client of the prophet"
    ],

    // ─── Cluster 59: Umm Group (SPLIT ALL) ───
    "Umm 'Atiyyah al-Ansariyyah": [
        "um 'atiyya", "um-'atiya", "um 'atiyya", "um atiya",
        "um atiyya", "um 'atiyya al-ansariya", "umm atiyyah",
        "umm 'atiyyah"
    ],
    "Umm Habibah": [
        "um habiba", "umm habibah", "umm habiba"
    ],
    "Umm Khalid bint Khalid": [
        "um khalid bint khalid", "um khalid", "umm khalid"
    ],
    "Umm Hani bint Abi Talib": [
        "um hani", "um hani bint abi talib", "umm hani", "umm hani'"
    ],
    "Umm Sharik": [
        "um sharik", "umm sharik"
    ],

    // ─── Cluster 60: Mujahid (SPLIT) ───
    "Mujahid ibn Jabr": [
        "mujahid", "mujahid bin jabr", "mujahid bin jabir",
        "mujahid bin jabir al-makki", "mujahi"
    ],
    "Mujashi' ibn Mas'ud": [
        "mujashi", "mujashi bin masud", "mujashi' bin mas'ud"
    ],

    // ─── Cluster 50: Masruq ───
    "Masruq ibn al-Ajda'": [
        "masruq", "masruq bin al-ajda", "masriq"
    ],

    // ─── Additional well-known narrators ───
    "Abu Dharr al-Ghifari": [
        "abu dhar", "abu dharr", "abudhar", "abu dharr al-ghifari"
    ],
    "'Uthman ibn 'Affan": [
        "`uthman", "'uthman", "uthman", "uthman bin affan",
        "'uthman bin 'affan", "uthman ibn affan"
    ],
    "Abu Bakr al-Siddiq": [
        "abu bakr", "abu bakr as-siddiq", "abu bakr al-siddiq",
        "abubakr"
    ],
    "Mu'adh ibn Jabal": [
        "mu'adh", "mu'adh bin jabal", "muadh", "muadh bin jabal",
        "mu'adh ibn jabal", "mu`adh"
    ],
    "'Imran ibn Husain": [
        "imran bin husain", "'imran bin husain", "imran",
        "imran ibn husain", "'imran"
    ],
    "Abu Ayyub al-Ansari": [
        "abu ayyub al-ansari", "abu ayyub", "abuayyub al-ansari"
    ],
    "Hudhaifah ibn al-Yaman": [
        "hudhaifa", "hudhaifah", "hudhaifa bin al-yaman",
        "hudhaifah bin al-yaman", "huthaifah"
    ],
    "Zaid ibn Thabit": [
        "zaid bin thabit", "zaid ibn thabit", "zaid bin sabit",
        "zaid"
    ],
    "'A'ishah bint Talhah": [
        // Split from main Aisha — this is a Tabi'iyyah
    ],
    "Nafi' mawla ibn 'Umar": [
        "nafi`", "nafi'", "nafi"
    ],
    "Abu Qatadah al-Ansari": [
        "abu qatada", "abu qatadah", "abu qatadah al-ansari"
    ],
    "Samurah ibn Jundub": [
        "samura bin jundab", "samurah bin jundab", "samura bin jundub",
        "samurah ibn jundub"
    ],
    "Ubayy ibn Ka'b": [
        "ubayy ibn ka'b", "ubayy bin ka'b", "ubai bin ka'b", "ubayy"
    ],
    "'Amr ibn al-'As": [
        "amr ibn al-as", "'amr ibn al-'as", "'amr bin al-'as",
        "amr bin al-as"
    ],
    "Buraydah ibn al-Husayb": [
        "buraida", "buraidah", "buraida bin al-husaib",
        "buraidah bin al-husaib", "buraydah"
    ],
    "Abu Umamah al-Bahili": [
        "abu umamah", "abu umamah al-bahili", "abuumamah"
    ],
    "Mu'awiyah ibn Abi Sufyan": [
        "mu'awiyah", "muawiyah", "mu'awiya", "muawiya",
        "mu'awiyah bin abi sufyan"
    ],
    "'Abdullah ibn 'Amr": [
        "abdullah bin 'amr", "'abdullah bin 'amr",
        "abdullah bin amr", "`abdullah bin `amr",
        "abdullah bin 'amr bin al-'as", "'abdullah bin 'amr bin al-'as",
        "abdullah bin amr bin al-as"
    ],
    "'Abdullah ibn Az-Zubair": [
        "abdullah bin az-zubair", "'abdullah bin az-zubair",
        "abdullah bin zubair", "ibn az-zubair"
    ],
    "Umm Salamah": [
        "um salama", "umm salama", "umm salamah",
        "um salamah", "hind bint abi umayyah"
    ],
    "Abu Talhah al-Ansari": [
        "abu talha", "abu talhah", "abu talha al-ansari",
        "abu talhah al-ansari"
    ],
    "Maimunah bint al-Harith": [
        "maimuna", "maimunah", "maimuna bint al-harith",
        "maymunah"
    ],
    "Hafsah bint 'Umar": [
        "hafsa", "hafsah", "hafsah bint 'umar",
        "hafsa bint umar"
    ],
    "Zainab bint Jahsh": [
        "zainab", "zaynab", "zainab bint jahsh",
        "zaynab bint jahsh"
    ],
};

// ─── Extraction Patterns ────────────────────────────────────────────────
const PATTERNS = [
    /^Narrated\s+(.+?):/i,
    /^([A-Z][A-Za-z\s'`'\-]+?)\s+narrated\s+that\s*:/i,
    /^It was narrated from\s+(.+?)\s+that/i,
    /^It was narrated that\s+(.+?)\s+said\s*:/i,
];
const ISNAD_PATTERN = /on authority of\s+([^,]+)/gi;

function extractNarrator(text) {
    if (!text) return null;
    for (const pat of PATTERNS) {
        const match = text.match(pat);
        if (match) return cleanRawName(match[1]);
    }
    let lastMatch = null;
    let m;
    while ((m = ISNAD_PATTERN.exec(text)) !== null) lastMatch = m[1];
    ISNAD_PATTERN.lastIndex = 0;
    if (lastMatch) return cleanRawName(lastMatch);
    return null;
}

function cleanRawName(raw) {
    let name = raw.trim();
    name = name.replace(/[,;.\s]+$/, '');
    name = name.replace(/^['"`]+|['"`]+$/g, '');
    name = name.replace(/\s+/g, ' ').trim();
    if (name.length > 60 || name.length < 2) return null;
    return name;
}

// ─── Build Alias Lookup (lowercased) ────────────────────────────────────
function buildAliasLookup() {
    const lookup = {};
    for (const [canonical, aliases] of Object.entries(CANONICAL_ALIASES)) {
        const id = toId(canonical);
        for (const alias of aliases) {
            // Store both raw lowercase and normalized forms
            lookup[alias.toLowerCase()] = { id, canonical };
            lookup[normalizeForLookup(alias)] = { id, canonical };
        }
        lookup[canonical.toLowerCase()] = { id, canonical };
        lookup[normalizeForLookup(canonical)] = { id, canonical };
    }
    return lookup;
}

function toId(canonical) {
    return canonical
        .toLowerCase()
        .replace(/['`\u2018\u2019ʿʾ]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

function normalizeForLookup(name) {
    return name
        .toLowerCase()
        .replace(/\.\s*([`'\u2018\u2019ʿʾ])/g, ' $1')  // "Ibn." before apostrophe -> "Ibn "
        .replace(/[`'\u2018\u2019ʿʾ]/g, "'")
        .replace(/'+/g, "'")                  // collapse multiple apostrophes
        .replace(/'\s+'/g, "'")               // "' '" -> "'"
        .replace(/'\s+/g, "'")                // apostrophe-space -> apostrophe
        .replace(/\s+'/g, " '")              // normalize space-apostrophe
        .replace(/\s*\([^)]*\)\s*/g, ' ')
        .replace(/\s*\[[^\]]*\]\s*/g, ' ')
        .replace(/,\s*(may allah|r\.a|the mother|from his|who|wife of).*/gi, '')
        .replace(/\s+(the mother of the (faithful )?believers?)$/gi, '')
        .replace(/\s+may allah be pleased with (him|her|them)$/gi, '')
        .replace(/\s+(the wife of the prophet.*)$/gi, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function resolveCanonical(rawName, aliasLookup) {
    const norm = normalizeForLookup(rawName);

    // Direct lookup
    if (aliasLookup[norm]) return aliasLookup[norm];

    // Try without parentheticals and trailing descriptors
    const stripped = norm.replace(/\s*\(.*?\)\s*/g, '').replace(/,.*/, '').trim();
    if (aliasLookup[stripped]) return aliasLookup[stripped];

    // Try without common prefixes
    for (const prefix of ['narrated ', 'from ']) {
        if (stripped.startsWith(prefix)) {
            const withoutPrefix = stripped.slice(prefix.length).trim();
            if (aliasLookup[withoutPrefix]) return aliasLookup[withoutPrefix];
        }
    }

    return null; // No canonical match — use raw name
}

// ─── Main ────────────────────────────────────────────────────────────────
function main() {
    const hadithDir = path.join(__dirname, '..', 'public', 'data', 'hadith');
    const aliasLookup = buildAliasLookup();
    const BOOKS = ['bukhari', 'muslim', 'tirmidhi', 'abudawud', 'nasai', 'ibnmajah',
        'malik', 'nawawi', 'qudsi', 'dehlawi'];

    // narrator id -> { canonical, aliases: Set, hadiths: [], books: Set }
    const narrators = {};
    let totalExtracted = 0;
    let totalHadiths = 0;
    let canonicalMatches = 0;

    for (const bookId of BOOKS) {
        const filePath = path.join(hadithDir, bookId, `eng-${bookId}.json`);
        if (!fs.existsSync(filePath)) {
            console.log(`  ⏭ ${bookId}: no English edition`);
            continue;
        }

        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        let matched = 0;

        // Load grades from info.json if available
        let gradesMap = {};
        try {
            const infoPath = path.join(hadithDir, 'info.json');
            if (fs.existsSync(infoPath)) {
                const info = JSON.parse(fs.readFileSync(infoPath, 'utf8'));
                if (info[bookId]?.grades) gradesMap = info[bookId].grades;
            }
        } catch { }

        for (const hadith of data.hadiths) {
            totalHadiths++;
            const rawName = extractNarrator(hadith.text);
            if (!rawName) continue;

            matched++;
            totalExtracted++;

            const resolved = resolveCanonical(rawName, aliasLookup);
            let narratorId, canonical;

            if (resolved) {
                narratorId = resolved.id;
                canonical = resolved.canonical;
                canonicalMatches++;
            } else {
                // Unmatched — use raw name as-is
                canonical = rawName;
                narratorId = toId(rawName);
            }

            if (!narrators[narratorId]) {
                narrators[narratorId] = {
                    id: narratorId,
                    canonical,
                    aliases: new Set(),
                    hadiths: [],
                    books: new Set(),
                };
            }

            narrators[narratorId].aliases.add(rawName);
            narrators[narratorId].books.add(bookId);

            // Get grade
            let grade = null;
            if (hadith.grades && hadith.grades.length > 0) {
                const g = hadith.grades[0];
                grade = typeof g === 'string' ? g : g?.grade || null;
            }

            narrators[narratorId].hadiths.push({
                book: bookId,
                number: hadith.hadithnumber,
                section: hadith.reference?.book || null,
                grade,
            });
        }

        console.log(`  ✅ ${bookId}: ${matched}/${data.hadiths.length} extracted`);
    }

    // ─── Split Multi-Narrator Entries ("X and Y" → X + Y) ────────────────
    // Helper: resolve a name to an existing narrator (alias lookup + direct ID match)
    const resolveToNarrator = (name) => {
        // Try canonical alias lookup first
        const resolved = resolveCanonical(name, aliasLookup);
        if (resolved && narrators[resolved.id]) return resolved.id;
        // Fallback: try direct ID match against existing narrators
        const directId = toId(name);
        if (narrators[directId]) return directId;
        return null;
    };

    const multiKeys = Object.keys(narrators).filter(k =>
        narrators[k].canonical.includes(' and ')
    );
    let splitCount = 0;
    for (const key of multiKeys) {
        const entry = narrators[key];
        const parts = entry.canonical.split(/ and /i);
        if (parts.length !== 2) continue;

        const leftId = resolveToNarrator(parts[0].trim());
        const rightId = resolveToNarrator(parts[1].trim());
        if (!leftId || !rightId) continue;
        if (leftId === key || rightId === key) continue; // self-reference guard

        // Merge hadiths into both individual narrators (dedup by book+number)
        for (const targetId of [leftId, rightId]) {
            const existing = new Set(
                narrators[targetId].hadiths.map(h => `${h.book}:${h.number}`)
            );
            for (const h of entry.hadiths) {
                if (!existing.has(`${h.book}:${h.number}`)) {
                    narrators[targetId].hadiths.push(h);
                    narrators[targetId].books.add(h.book);
                }
            }
        }
        delete narrators[key];
        splitCount++;
    }
    console.log(`  🔀 Split ${splitCount}/${multiKeys.length} multi-narrator entries`);

    // Convert to output format
    const narratorList = Object.values(narrators)
        .map(n => ({
            id: n.id,
            canonical: n.canonical,
            aliases: [...n.aliases].filter(a => a !== n.canonical),
            totalCount: n.hadiths.length,
            books: [...n.books],
            hadiths: n.hadiths,
        }))
        .sort((a, b) => b.totalCount - a.totalCount);

    // Build alias index for quick lookups
    const aliasIndex = {};
    for (const n of narratorList) {
        aliasIndex[n.canonical.toLowerCase()] = n.id;
        for (const alias of n.aliases) {
            aliasIndex[alias.toLowerCase()] = n.id;
        }
    }

    const output = {
        meta: {
            totalNarrators: narratorList.length,
            totalHadithsWithNarrator: totalExtracted,
            totalHadithsProcessed: totalHadiths,
            canonicalMatches,
            generatedAt: new Date().toISOString(),
        },
        narrators: narratorList,
        aliasIndex,
    };

    const outPath = path.join(hadithDir, 'narrator_master.json');
    fs.writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf8');

    console.log(`\n📁 Saved to ${outPath}`);
    console.log(`📊 ${narratorList.length} unique narrators`);
    console.log(`📊 ${totalExtracted}/${totalHadiths} hadiths with narrator`);
    console.log(`📊 ${canonicalMatches} matched to canonical names (${Math.round(canonicalMatches / totalExtracted * 100)}%)`);

    // Show top 20
    console.log(`\n🏆 Top 20 narrators:`);
    narratorList.slice(0, 20).forEach((n, i) => {
        const aliases = n.aliases.length > 0 ? ` (aliases: ${n.aliases.slice(0, 3).join(', ')})` : '';
        console.log(`  ${i + 1}. ${n.canonical} — ${n.totalCount} hadiths${aliases}`);
    });
}

main();
