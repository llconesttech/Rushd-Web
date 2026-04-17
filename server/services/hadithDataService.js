import { readFile } from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "server", "data", "hadith");

async function readJSON(filePath) {
  const raw = await readFile(filePath, "utf-8");
  const data = JSON.parse(raw);
  return data;
}

function hasArabicScript(text) {
  return typeof text === "string" && /[\u0600-\u06FF]/.test(text);
}

function normalizeSingleSectionTitle(edition, lang) {
  // Some small collections (e.g. "40 hadith" sets) ship a single section whose
  // title is Arabic even for non-Arabic translations. The frontend uses
  // `metadata.sections[sectionId]` as the displayed chapter title.
  const meta = edition?.metadata;
  const sections = meta?.sections;
  if (!meta || !sections || typeof sections !== "object") return edition;
  if (!lang || lang === "ara") return edition;

  const nonZeroKeys = Object.keys(sections).filter((k) => k !== "0");
  if (nonZeroKeys.length !== 1) return edition;

  const onlyKey = nonZeroKeys[0];
  const currentTitle = sections[onlyKey];
  const fallbackTitle = meta?.name;

  // Replace if section title is Arabic but the edition metadata name is not.
  if (
    hasArabicScript(currentTitle) &&
    typeof fallbackTitle === "string" &&
    fallbackTitle.trim() &&
    !hasArabicScript(fallbackTitle)
  ) {
    return {
      ...edition,
      metadata: {
        ...meta,
        sections: {
          ...sections,
          [onlyKey]: fallbackTitle.trim(),
        },
      },
    };
  }

  return edition;
}

export async function getEditions() {
  return readJSON(path.join(DATA_DIR, "editions.json"));
}

export async function getInfo() {
  return readJSON(path.join(DATA_DIR, "info.json"));
}

export async function getNarratorMaster() {
  return readJSON(path.join(DATA_DIR, "narrator_master.json"));
}

export async function getNarratorClusters() {
  return readJSON(path.join(DATA_DIR, "narrator_clusters.json"));
}

export async function getEdition(bookId, lang) {
  let edition = await readJSON(
    path.join(DATA_DIR, bookId, `${lang}-${bookId}.json`),
  );

  // Some community-provided Bengali editions only ship `hadiths` without `metadata`.
  // The UI expects `metadata.sections` + `metadata.section_details` for chapters.
  if (lang === "ben" && (!edition?.metadata || !edition?.metadata?.sections)) {
    try {
      const eng = await readJSON(
        path.join(DATA_DIR, bookId, `eng-${bookId}.json`),
      );
      edition = {
        ...edition,
        metadata: eng?.metadata || edition?.metadata,
      };
    } catch {
      // If English metadata isn't available, return as-is.
      return normalizeSingleSectionTitle(edition, lang);
    }
  }

  return normalizeSingleSectionTitle(edition, lang);
}
