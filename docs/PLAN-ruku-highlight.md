# Ruku Highlighting & Navigation

Show Ruku/Manzil metadata on Surah list pages and add visual Ruku dividers in the reading view. The data already exists in `meta.json` (surah-level `rukus` count) and per-ayah JSON files (`ruku` field).

## Proposed Changes

### Surah Grid Cards

#### [MODIFY] [App.jsx](file:///f:/Rushd-Web/src/App.jsx)

**`SurahList` component (lines 30–127):**
- The `enhancedSurahs` merge already gives us `surah.rukus` from `meta.json` via `useSurahList()`. We just need to render it.
- Add **Ruku** and **Manzil** counts below or beside the Ayah count in the card footer.
- Manzil is calculated from surah number using the existing `getManzil()` helper (move it to module scope or extract to a utility).

```diff
 <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
-  {surah.numberOfAyahs || surah.ayahs} Ayahs
+  {surah.numberOfAyahs || surah.ayahs} Ayahs • {surah.rukus || '—'} Rukus
 </span>
```

---

#### [MODIFY] [SurahListSidebar.jsx](file:///f:/Rushd-Web/src/components/SurahListSidebar.jsx)

- Add Ruku count in the `.surah-meta` section of each sidebar list item.
- `surahData` in `quranData.js` doesn't have `rukus`, but `meta.json` does. Two options:
  - **Option A (recommended):** Add `rukus` field to `surahData` array in `quranData.js` (one-time data sync from `meta.json`).
  - **Option B:** Fetch from `meta.json` at runtime (already done by `useSurahList` but sidebar uses static `surahData`).
- Going with **Option A**: add `rukus` to each entry in `surahData`.

---

### Surah Detail Page — Ruku Dividers

#### [MODIFY] [App.jsx](file:///f:/Rushd-Web/src/App.jsx)

**`QuranReader` component (lines 150–341):**

1. **Subtitle enhancement** (line 235): Add total Ruku count.
```diff
- {surahInfo?.ayahs} Ayahs • {surahInfo?.revelationType} • Manzil {getManzil(surahNum)}
+ {surahInfo?.ayahs} Ayahs • {surahInfo?.rukus || '—'} Rukus • {surahInfo?.revelationType} • Manzil {getManzil(surahNum)}
```

2. **Ruku divider between ayahs** (in `renderAyah` or in the `.map()` at line 337):
   - Compare current ayah's `ruku` with previous ayah's `ruku`.
   - When they differ, insert a visual **Ruku divider** before the ayah.
   - Divider shows: `┈ Ruku {number} ┈` with a subtle horizontal line and badge.

```jsx
{surah.ayahs.map((ayah, index) => {
  const prevRuku = index > 0 ? surah.ayahs[index - 1].ruku : null;
  const showDivider = prevRuku !== null && ayah.ruku !== prevRuku;
  return (
    <React.Fragment key={ayah.number}>
      {showDivider && <div className="ruku-divider"><span>Ruku {ayah.ruku}</span></div>}
      {renderAyah(ayah, index)}
    </React.Fragment>
  );
})}
```

3. **CSS for divider** — Add to `index.css`:
```css
.ruku-divider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  color: var(--color-primary);
  font-size: 0.8rem;
  font-weight: 600;
}
.ruku-divider::before,
.ruku-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-border);
}
```

### IndoPak Ain Symbol Verification

**Finding:** IndoPak text has traditional Quranic stop/pause marks (like `۟۠`, `ع`, `ۚ`, etc.) embedded in the Unicode text itself. These are NOT explicit "Ruku Ain" markers — they are standard waqf marks. The `ruku` field in JSON is the authoritative source for ruku boundaries.

**Action:** No text modification needed. The programmatic divider approach (Option A above) works universally across all scripts.

---

## Phase 3: Navigation Panel (Brainstorm)

### 🧠 Brainstorm: Jump-to Navigation in Surah List

#### Context
The user wants a way to quickly navigate to a specific Manzil, Ayah, Ruku, or Juz from the Surah list page. The detail page is already crowded, so this needs careful UI/UX planning.

---

### Option A: Filter/Search Enhancement in Sidebar
Enhance the existing `SurahListSidebar` search to support filter chips (e.g., "Juz 1", "Manzil 3", "Ruku 5"). Clicking a filter scrolls/filters the list.

✅ **Pros:**
- Builds on existing UI, no new components
- Familiar search-bar pattern
- Minimal screen real estate

❌ **Cons:**
- Discovery: users may not know about filter syntax
- Complex to implement filtering across multiple dimensions

📊 **Effort:** Medium

---

### Option B: Collapsible Quick-Nav Panel
A collapsible panel at the top of the Surah list page with dropdowns/selectors for Juz, Manzil, Ruku. Selecting one scrolls to or filters the matching surahs.

✅ **Pros:**
- Highly discoverable
- Clear separation from search
- Can show counts (e.g., "Juz 1 — 2 Surahs")

❌ **Cons:**
- Takes vertical space
- Needs careful responsive design

📊 **Effort:** Medium-High

---

### Option C: Floating Action Button (FAB) with Bottom Sheet
A FAB on the Surah list page that opens a bottom-sheet modal with tabs (Juz / Manzil / Ruku). Tapping an item navigates directly.

✅ **Pros:**
- Zero-footprint until activated
- Mobile-friendly bottom-sheet pattern
- Can be reused on detail page later

❌ **Cons:**
- Less discoverable (hidden behind FAB)
- Extra click to access

📊 **Effort:** Medium

---

### 💡 Recommendation

**Option B** — Collapsible Quick-Nav Panel for the Surah list page, as it's the most discoverable and provides the best UX for the "ease of access" goal. Can be collapsed by default on mobile.

> **This phase is deferred to the next conversation.** The current plan focuses on Phase 1 & 2 only.

---

## Verification Plan

### Manual Verification (Browser)
1. Run `npm run dev` and open the app
2. Navigate to `/quran` → verify each surah card shows **Ruku** and **Manzil** counts
3. Open `SurahListSidebar` → verify Ruku count appears in metadata
4. Navigate to `/quran/2` (Al-Baqara) → verify:
   - Subtitle shows "40 Rukus"
   - Ruku dividers appear between ayah groups (e.g., between ayah 7 and 8 where ruku changes from 2→3)
5. Switch to IndoPak script → verify dividers still appear correctly
6. Switch to Tajweed script → verify dividers still appear correctly
