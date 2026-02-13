# Dynamic Sticky Reading Bar — Implementation Plan

The current sticky header collapses its subtitle on scroll (via `max-height: 0`), leaving only the title visible. This creates an "empty" feeling. The user wants a **contextual reading toolbar** that becomes richer — not emptier — when scrolled.

## Data Available Per Ayah
Each ayah object has: `juz`, `page`, `hizbQuarter`, `ruku`, `manzil`, `numberInSurah`.

## Proposed Changes

### [App.jsx](file:///f:/Rushd-Web/src/App.jsx) — `QuranReader` component

1. **Scroll-based Ayah Tracking**:
   - Add `useEffect` + `IntersectionObserver` (or scroll event) to detect which ayah `.ayah-row` / `.ayah-card-style2` is currently visible at the top of the viewport.
   - Store `currentAyah` in state (includes `juz`, `page`, `hizbQuarter`, `ruku`).

2. **Dynamic Sticky Content**:
   - Replace `actions={null}` with a new `scrolledActions` component.
   - When scrolled, the `PageHeader` will show a **reading context bar** via actions:
     - `Ayah {numberInSurah}` — current visible Ayah
     - `Page {page}` — Quran page
     - `Juz {juz}` — current Juz
     - `Hizb {hizbQuarter}` — current Hizb quarter
     - `[Transliteration ▾]` — dropdown  
   - When NOT scrolled (at top), keep showing the regular subtitle.

3. **Implementation approach**:
   - Use a `ref` on the scroll container (`.reader-main-content`) and an `IntersectionObserver` to detect which ayah row is at the top.
   - Store `currentVisibleAyah` in React state.
   - Pass dynamic `actions` to `PageHeader` that change based on `isScrolled` state.

### [PageHeader.jsx](file:///f:/Rushd-Web/src/components/PageHeader.jsx)

4. **Optional**: Accept a `scrolledContent` prop — an alternative JSX to render in `ph-actions` when scrolled.
   - OR: The `QuranReader` can manage this by passing dynamic JSX via `actions` that swaps based on scroll state.
   - **Decision**: Use the simpler approach — pass dynamic `actions` from `QuranReader`. No `PageHeader` changes needed.

### [PageHeader.css](file:///f:/Rushd-Web/src/components/PageHeader.css)

5. **Stop hiding subtitle on scroll**: Instead of collapsing, keep the subtitle visible but more compact.
   - Change `.page-header.scrolled .ph-subtitle` to stay visible (remove `max-height: 0` / `opacity: 0`).

6. **New CSS for scrolled actions**:
   - `.scrolled-reading-bar` — flex row, small font, pill-shaped info chips.

### [index.css](file:///f:/Rushd-Web/src/index.css)

7. **Reading bar chip styles**:
   - `.reading-chip` — background pill for each metadata item.

---

## Verification Plan

### Manual Verification (by user)
1. Open `/quran/2` (Al-Baqara)
2. Before scrolling: Sticky header shows title + subtitle (meaning, ayahs, rukus, badge)
3. Scroll down past the calligraphic header
4. **Expected**: Sticky bar should now show dynamic info: `Ayah X | Page Y | Juz Z | Hizb W`  + Transliteration dropdown
5. Continue scrolling — the numbers should update as you pass through different ayahs
6. Check that Juz changes correctly (Al-Baqara spans Juz 1–3)
7. Check mobile responsiveness (narrow viewport should wrap gracefully)
