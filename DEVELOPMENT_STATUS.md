# GlobalQuran (Rushd App) - Development Handoff

This document provides a comprehensive overview of the current status of the GlobalQuran project, designed to help an AI agent (Antigravity, Claude, Cursor) pick up the work seamlessly.

## 🏁 Project Overview
A modern React + Vite migration of the legacy GlobalQuran project, featuring an Emerald Green theme, comprehensive Quran data, and multi-script/multi-translation support.

---

## ✅ Accomplished So Far

### 1. Core Architecture
- **Framework**: React 18 + Vite (fast, modern).
- **Styling**: Vanilla CSS with a centralized design system in `index.css` (Emerald Green palette).
- **Routing**: `react-router-dom` handling `/`, `/quran`, and `/quran/:number`.
- **State Management**: `SettingsContext.jsx` manages global preferences:
  - `selectedScript`: Current Arabic style (Tajweed, Uthmani, etc.).
  - `selectedTranslation`: Current translation ID (e.g., `en.sahih`).
  - `selectedReciter`: Current audio reciter ID (e.g., `ar.alafasy`).
  - `isSurahListOpen` / `isSettingsOpen`: Sidebar toggles.

### 2. Data Layer (`src/data/quranData.js`)
- **Surah Metadata**: Accurate list of all 114 Surahs with Juz ranges, revelation type, and Arabic names.
- **Translations**: Comprehensive mapping of 90+ translation identifiers available via the API.
- **Reciters**: Mapping of 25+ reciters for audio playback.
- **Language List**: Mapping of language codes to native/English names for grouping.

### 3. Smart Hooks (`src/hooks/useQuran.js`)
- **`useSurahDetail`**: Fetches multiple "editions" simultaneously from `alquran.cloud` (e.g., `quran-tajweed,bn.bengali`).
- **Absolute Ayah Mapping**: `getAbsoluteAyahNumber` correctly maps Surah/Ayah to the 1-6236 range required by Islamic Network CDNs.

### 4. UI Components
- **`QuranReader`**: Dynamically switches rendering modes:
  - **Plain**: Standard Arabic text.
  - **Tajweed**: Parsed from `[h:1[...]]` tags into color-coded spans.
  - **Word-by-Word**: Parsed from piped strings into interactive blocks.
- **`AudioPlayer`**: Integrated controls with auto-play, reciter selection, and error handling for missing CDN files.
- **`SettingsSidebar`**: Tabbed interface with language grouping and translation search.
- **`SurahListSidebar`**: Quick navigation with surah search and Juz badges.

---

## 🛠️ Technical Implementation Details (Critical for AI)

### Special Script Parsing
The AlQuran.cloud API returns unique formats for certain scripts which are handled in `App.jsx`:
- **Tajweed**: Handled by `parseTajweed` regex: `/\[([a-z])(?::\d+)?\[([^\]]+)\]/g`.
- **Word-by-Word**: Handled by `parseWordByWord` which splits by `$` then `|`.

### Audio CDN Formula
Audio is currently fetched from:
`https://cdn.islamic.network/quran/audio/{bitrate}/{reciter}/{absolute_ayah_id}.mp3`
*Absolute Ayah ID is cumulative (Al-Baqara Ayah 1 is ID 8).*

---

## 🚀 Remaining Tasks / Next Steps

1.  **Global Search**: Implement a full-text search or surah-referencing search engine.
2.  **Local Audio Support**: Infrastructure is ready; need to allow the player to check for local `.mp3` files before falling back to the CDN.
3.  **Persistence**: Save user's `SettingsContext` to `localStorage` so they don't reset on refresh.
4.  **Bengali IPA**: Implement the second phonetic/system for Bengali transliteration (referenced in `App.jsx` comments).
5.  **Offline/PWA**: Add a Service Worker for offline Quran reading.
6.  **Dark Mode**: Extend the Emerald theme with a dedicated Dark Mode palette.
7.  **UX Polish**: Mobile responsiveness for the Word-by-Word grid and sidebar animations.

---

## ⚠️ Known Issues / Caveats
- Some reciters on the Islamic Network CDN are missing specific ayahs or surahs, causing 404 errors. The player handles this by showing an error message.
- "Word by Word" from alquran.cloud might occasionally have parsing gaps if the API structure changes.

---

## 🤖 Instructions for the Next Assistant
1. **Always refer to `src/data/quranData.js`** as the source of truth for surah/translation/reciter metadata.
2. **If adding features**, ensure they respect the CSS variables in `index.css`.
3. **When modifying the reader**, verify changes against **Tajweed** and **Word-by-Word** script selections as they use custom parsing logic.
4. **API Strategy**: Continue using `http://api.alquran.cloud/v1` for text and `https://cdn.islamic.network/quran/audio` for audio.
