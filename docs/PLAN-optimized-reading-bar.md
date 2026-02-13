# Optimized Reading Bar — Implementation Plan

To achieve maximum performance and zero main-thread blocking, we will isolate the reading progress logic into a dedicated component.

## Architecture

**Current (Problematic):**
`App` (State: currentAyah) -> `PageHeader` -> `SurahList`
Scroll -> `App` Re-render -> Entire `SurahList` Re-renders (Expensive!)

**Proposed (Optimized):**
`App` (Static) -> `PageHeader` -> `ReadingProgress` (State: currentAyah)
Scroll -> `ReadingProgress` Re-renders (Cheap!) -> `App` & `SurahList` do NOT re-render.

## 1. New Component: `<ReadingProgress />`
- **Props**: `surah` (full data), `translations` (for dropdown).
- **State**: `currentPosition` (ayah, page, juz, hizb).
- **Logic**:
  - `useEffect` with `scroll` listener (throttled).
  - uses `document.elementFromPoint` to find visible ayah.
  - Updates *local* state only.

## 2. Integration
- `PageHeader` accepts a `renderReadingBar` prop or `actions` prop that contains `<ReadingProgress />`.
- `App.jsx` renders `<ReadingProgress />` but does **not** listen to scroll itself for ayah tracking.

## 3. Optimization Techniques
- **Throttling**: 200ms limit on scroll checks.
- **Passive Listeners**: `checkScroll` is passive.
- **Memoization**: `ReadingProgress` is `memo`ized to prevent re-renders from parent.

## 4. Verification
- Use React DevTools Profiler (if available) or `console.log` to confirm `App` does not render on scroll.
- Ensure "Blank Page" crash is gone forever.
