/* eslint-disable */
const indopakSurah = {
  "ayahs": [
    {
      "text": "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِیْمِ ۟"
    },
    {
      "text": "اَلْحَمْدُ لِلّٰهِ رَبِّ الْعٰلَمِیْنَ ۟ۙ"
    }
  ]
};

const tajweedSurah = {
  "ayahs": [
    {
      "text": "بِسْمِ [h:1[ٱ]للَّهِ [h:2[ٱ][l[ل]رَّحْمَ[n[ـٰ]نِ [h:3[ٱ][l[ل]رَّح[p[ِي]مِ"
    },
    {
      "text": "ٱلْحَمْدُ لِلَّهِ رَبِّ [h:4[ٱ]لْعَ[n[ـٰ]لَم[p[ِي]نَ"
    }
  ]
};

// Heuristic Mapper
function mergeTexts(indopak, tajweed) {
  // 1. Tokenize Tajweed: Extract content and its associated tag
  // Structure: Array of { char: string, tag: string | null }
  // We ignore diacritics for ALIGNMENT but keep them for reconstruction? 
  // Actually, Tajweed text has tags WRAPPED around letters.
  // [n[x] -> The letter x has tag n.

  // Step 1: Parse Tajweed string into a flat list of (BaseChar, Tag)
  // We need to strip diacritics from Tajweed to identify the BaseChar.

  // Simple tokenizer for Tajweed string
  const tajweedTokens = [];
  let i = 0;
  while (i < tajweed.length) {
    if (tajweed[i] === '[') {
      // It's a tag start
      // Format [code[content] or [code:id[content]
      // Find next '['
      const start = i;
      let bracketCount = 1;
      let innerStart = -1;

      // Look for nested '[' which starts the content
      let j = i + 1;
      while (j < tajweed.length) {
        if (tajweed[j] === '[') {
          innerStart = j;
          break;
        }
        j++;
      }

      if (innerStart !== -1) {
        const tagCode = tajweed.substring(start + 1, innerStart); // e.g., "h:1" or "n"
        // Now find the closing ']' for the content
        // Content can be multiple chars? Usually single letter or letter+diacritic
        // Scan forward until we hit ']'
        // Wait, format is [tag[CONTENT]
        // So we search for ']'
        let k = innerStart + 1;
        const contentStart = k;
        while (k < tajweed.length) {
          if (tajweed[k] === ']') {
            break;
          }
          k++;
        }
        const content = tajweed.substring(contentStart, k);

        // Add this content with the tag
        tajweedTokens.push({ text: content, tag: tagCode });
        i = k + 1;
      } else {
        // Malformed? Treat as char
        tajweedTokens.push({ text: tajweed[i], tag: null });
        i++;
      }
    } else {
      // Normal char
      tajweedTokens.push({ text: tajweed[i], tag: null });
      i++;
    }
  }

  // Now, flatten the tajweed tokens into individual characters with tags
  // e.g. "ٱ" with tag "h:1". 
  // Note: Content might contain diacritics. We attach the tag to the BASE character.
  const tajweedBaseMap = [];

  tajweedTokens.forEach(token => {
    // Walk through the text of the token
    const chars = token.text.split('');
    chars.forEach(char => {
      if (isDiacritic(char)) {
        // Append to previous base
        if (tajweedBaseMap.length > 0) {
          // Diacritics don't need entry in base map for alignment, 
          // but we track them conceptually? No, we align BASES.
        }
      } else {
        tajweedBaseMap.push({ char: char, tag: token.tag });
      }
    });
  });

  // 2. Walk through Indo-Pak text
  // We construct the result string.
  let result = '';
  let tIndex = 0; // Index in tajweedBaseMap

  const ipChars = indopak.split('');

  for (let c = 0; c < ipChars.length; c++) {
    const char = ipChars[c];

    if (isDiacritic(char) || isSpecialsymbol(char) || char === ' ') {
      // Just append non-base chars directly
      result += char;
      continue;
    }

    // It is a base char. Try to align with Tajweed.
    if (tIndex < tajweedBaseMap.length) {
      const tItem = tajweedBaseMap[tIndex];

      // Loose equality check for mapping (Farsi Yeh vs Arabic Yeh, etc)
      if (areCharsEquivalent(char, tItem.char)) {
        // Match! Apply tag if exists
        if (tItem.tag) {
          result += `[${tItem.tag}[${char}]`;
        } else {
          result += char;
        }
        tIndex++;
      } else {
        // Mismatch. 
        // Strategies:
        // 1. Skip Tajweed char (maybe extra in Tajweed like silent Alif handling?)
        // 2. Skip IndoPak char (maybe extra in IndoPak?)
        // Simple heuristic: Look ahead?
        // For this POC, we'll assume simple skip of Tajweed if mismatch, 
        // OR just output regular char.
        console.log(`Mismatch at ${c}: IP '${char}' vs TJ '${tItem.char}'`);
        // Force increment Tajweed to try to sync?
        // Let's try to find this IP char in the next few TJ chars
        let found = false;
        for (let look = 0; look < 5; look++) {
          if (tIndex + look < tajweedBaseMap.length) {
            if (areCharsEquivalent(char, tajweedBaseMap[tIndex + look].char)) {
              // Found it ahead. Skip the intermediate TJ ones.
              tIndex += look;
              const newTItem = tajweedBaseMap[tIndex];
              if (newTItem.tag) {
                result += `[${newTItem.tag}[${char}]`;
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
          result += char; // Keep IP char as is, no tag
        } else {
          // Explicitly use `found` to satisfy linters if it was just for logic flow
          // Console log is commented out to avoid clutter but satisfies usage rules if uncommented, 
          // or we can just leave it as is if ESLint complained about assignments.
          // By refactoring, we ensure `found` contributes to the final result.
        }
      }
    } else {
      result += char;
    }
  }

  return result;
}

function isDiacritic(char) {
  const code = char.charCodeAt(0);
  // Arabic Tashkeel range roughly 064B - 065F
  // Also superscript Aleph 0670
  return (code >= 0x064B && code <= 0x065F) || code === 0x0670;
}

function isSpecialsymbol(char) {
  // Waqf marks, end of ayah, etc
  // 06D6 to 06ED
  const code = char.charCodeAt(0);
  return (code >= 0x06D6 && code <= 0x06ED) || code === 32; // Space included here for logic
}

function areCharsEquivalent(c1, c2) {
  if (c1 === c2) return true;
  // Normalize Alephs
  const alephs = ['\u0627', '\u0623', '\u0625', '\u0622', '\u0671'];
  if (alephs.includes(c1) && alephs.includes(c2)) return true;

  // Yehs
  const yehs = ['\u064A', '\u06CC', '\u0626', '\u0649']; // Arabic Yeh, Farsi Yeh, Yeh Hamza, Aleph Maksura
  if (yehs.includes(c1) && yehs.includes(c2)) return true;

  // Kafs
  const kafs = ['\u0643', '\u06A9'];
  if (kafs.includes(c1) && kafs.includes(c2)) return true;

  // Hehs
  const hehs = ['\u0647', '\u06C1', '\u0629']; // Heh, Heh Goal, Teh Marbuta
  if (hehs.includes(c1) && hehs.includes(c2)) return true;

  return false;
}

// Test
console.log("Ayah 1:");
console.log(mergeTexts(indopakSurah.ayahs[0].text, tajweedSurah.ayahs[0].text));
console.log("\nAyah 2:");
console.log(mergeTexts(indopakSurah.ayahs[1].text, tajweedSurah.ayahs[1].text));

