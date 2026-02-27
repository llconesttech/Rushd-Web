/**
 * Generate Indo-Pak Tajweed Hybrid Data
 * 
 * Takes IndoPak text (Nastaleeq script) and applies Tajweed color tags
 * from the Tajweed dataset. Output: quran-indopak-tajweed JSON files.
 * 
 * Usage: node src/scripts/generate_indopak_tajweed.js
 */

const fs = require('fs');
const path = require('path');

const INDOPAK_DIR = path.join(__dirname, '../../public/data/quran/v2/arabic/quran-indopak');
const TAJWEED_DIR = path.join(__dirname, '../../public/data/quran/v2/arabic/quran-tajweed');
const OUTPUT_DIR = path.join(__dirname, '../../public/data/quran/v2/arabic/quran-indopak-tajweed');

// --- Character utilities ---

function isDiacritic(char) {
    const code = char.charCodeAt(0);
    // Arabic Tashkeel (064B-065F), superscript Aleph (0670)
    // Also include Tatweel (0640) and extended combining marks
    return (code >= 0x064B && code <= 0x065F) || code === 0x0670 ||
        (code >= 0x0610 && code <= 0x061A) || // Small signs
        (code >= 0x06D6 && code <= 0x06DC) || // Small Quranic marks
        (code >= 0x06DF && code <= 0x06E4) ||
        (code >= 0x06E7 && code <= 0x06E8) ||
        (code >= 0x06EA && code <= 0x06ED) ||
        code === 0x0640; // Tatweel
}

function isSpecialSymbol(char) {
    const code = char.charCodeAt(0);
    // Waqf marks, end of ayah, rub el hizb, etc.
    return (code >= 0x06D6 && code <= 0x06ED) ||
        code === 0x06DE || // Start of Rub El Hizb
        (code >= 0x0600 && code <= 0x0605) || // Arabic number signs
        code === 0x200F || code === 0x200E || // RTL/LTR marks
        code === 0xFDFA || code === 0xFDFB;   // Islamic phrases
}

function isEndOfAyahMark(char) {
    const code = char.charCodeAt(0);
    return code === 0x06DD || // End of Ayah
        code === 0x0600 || code === 0x0601 || code === 0x0602 ||
        code === 0x0603;
}

function areCharsEquivalent(c1, c2) {
    if (c1 === c2) return true;

    // Normalize Alephs
    const alephs = ['\u0627', '\u0623', '\u0625', '\u0622', '\u0671', '\u0672', '\u0673'];
    if (alephs.includes(c1) && alephs.includes(c2)) return true;

    // Yehs
    const yehs = ['\u064A', '\u06CC', '\u0626', '\u0649'];
    if (yehs.includes(c1) && yehs.includes(c2)) return true;

    // Kafs
    const kafs = ['\u0643', '\u06A9'];
    if (kafs.includes(c1) && kafs.includes(c2)) return true;

    // Hehs
    const hehs = ['\u0647', '\u06C1', '\u0629'];
    if (hehs.includes(c1) && hehs.includes(c2)) return true;

    // Teh/Teh Marbuta
    const tehs = ['\u062A', '\u0629'];
    if (tehs.includes(c1) && tehs.includes(c2)) return true;

    // Waw variants
    const waws = ['\u0648', '\u0624'];
    if (waws.includes(c1) && waws.includes(c2)) return true;

    return false;
}

function isBaseChar(char) {
    return !isDiacritic(char) && !isSpecialSymbol(char) && char !== ' ' && char.charCodeAt(0) > 0x060F;
}

// --- Tajweed Tokenizer ---

function tokenizeTajweed(text) {
    const tokens = [];
    let i = 0;
    while (i < text.length) {
        if (text[i] === '[') {
            const start = i;
            let innerStart = -1;

            let j = i + 1;
            while (j < text.length) {
                if (text[j] === '[') {
                    innerStart = j;
                    break;
                }
                j++;
            }

            if (innerStart !== -1) {
                const tagCode = text.substring(start + 1, innerStart);
                let k = innerStart + 1;
                while (k < text.length) {
                    if (text[k] === ']') break;
                    k++;
                }
                const content = text.substring(innerStart + 1, k);
                tokens.push({ text: content, tag: tagCode });
                i = k + 1;
            } else {
                tokens.push({ text: text[i], tag: null });
                i++;
            }
        } else {
            tokens.push({ text: text[i], tag: null });
            i++;
        }
    }
    return tokens;
}

function buildTajweedBaseMap(tokens) {
    const baseMap = [];
    tokens.forEach(token => {
        for (const char of token.text) {
            if (isBaseChar(char)) {
                baseMap.push({ char, tag: token.tag });
            }
        }
    });
    return baseMap;
}

// --- Core Merge ---

function mergeTexts(indopakText, tajweedText) {
    const tajweedTokens = tokenizeTajweed(tajweedText);
    const tajweedBaseMap = buildTajweedBaseMap(tajweedTokens);

    let result = '';
    let tIndex = 0;
    const chars = [...indopakText]; // Handle multi-codepoint properly

    for (let c = 0; c < chars.length; c++) {
        const char = chars[c];

        if (!isBaseChar(char)) {
            result += char;
            continue;
        }

        // It's a base char - try to align with Tajweed
        if (tIndex < tajweedBaseMap.length) {
            const tItem = tajweedBaseMap[tIndex];

            if (areCharsEquivalent(char, tItem.char)) {
                if (tItem.tag) {
                    result += `[${tItem.tag}[${char}]`;
                } else {
                    result += char;
                }
                tIndex++;
            } else {
                // Look ahead up to 8 positions in tajweed map
                let found = false;
                for (let look = 1; look <= 8; look++) {
                    if (tIndex + look < tajweedBaseMap.length) {
                        if (areCharsEquivalent(char, tajweedBaseMap[tIndex + look].char)) {
                            tIndex += look;
                            const newItem = tajweedBaseMap[tIndex];
                            if (newItem.tag) {
                                result += `[${newItem.tag}[${char}]`;
                            } else {
                                result += char;
                            }
                            tIndex++;
                            found = true;
                            break;
                        }
                    }
                }

                if (!found) {
                    // Also try looking ahead in IndoPak to see if tajweed matches later
                    let foundReverse = false;
                    for (let look = 1; look <= 5; look++) {
                        if (c + look < chars.length && isBaseChar(chars[c + look])) {
                            if (areCharsEquivalent(chars[c + look], tItem.char)) {
                                // Current IP char is extra - just output it plain
                                result += char;
                                foundReverse = true;
                                break;
                            }
                        }
                    }
                    if (!foundReverse) {
                        result += char;
                        tIndex++; // Skip the tajweed char too
                    }
                }
            }
        } else {
            result += char;
        }
    }

    return result;
}

// --- Main ---

function main() {
    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    let successCount = 0;
    let errorCount = 0;

    for (let surah = 1; surah <= 114; surah++) {
        const ipFile = path.join(INDOPAK_DIR, `${surah}.json`);
        const tjFile = path.join(TAJWEED_DIR, `${surah}.json`);

        if (!fs.existsSync(ipFile) || !fs.existsSync(tjFile)) {
            console.error(`Missing data for surah ${surah}`);
            errorCount++;
            continue;
        }

        try {
            const ipData = JSON.parse(fs.readFileSync(ipFile, 'utf8'));
            const tjData = JSON.parse(fs.readFileSync(tjFile, 'utf8'));

            const mergedAyahs = ipData.ayahs.map((ayah, idx) => {
                const tjAyah = tjData.ayahs[idx];
                if (!tjAyah) {
                    console.warn(`Surah ${surah}: Missing tajweed ayah at index ${idx}`);
                    return ayah;
                }

                return {
                    ...ayah,
                    text: mergeTexts(ayah.text, tjAyah.text)
                };
            });

            const outputData = {
                ...ipData,
                ayahs: mergedAyahs
            };

            const outFile = path.join(OUTPUT_DIR, `${surah}.json`);
            fs.writeFileSync(outFile, JSON.stringify(outputData, null, 2), 'utf8');
            successCount++;

            if (surah % 10 === 0 || surah <= 3) {
                console.log(`✓ Surah ${surah} merged successfully`);
            }
        } catch (err) {
            console.error(`Error processing surah ${surah}:`, err.message);
            errorCount++;
        }
    }

    console.log(`\nDone! ${successCount} surahs merged, ${errorCount} errors.`);
}

main();
