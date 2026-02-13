# Safe Dynamic Reading Bar — Implementation Plan

To deliver the requested features (Page/Juz/Hizb/Transliteration) without crashing the app, we will use a **Stability-First Approach**.

## 1. CSS Stability (Crucial)
The root cause of previous crashes was likely **layout thrashing**: The header changing height when the reading bar appeared pushed content down, triggering the observer again in a loop.

**Fix**: Enforce a fixed height for the sticky header in its scrolled state.
- `.page-header.scrolled { height: 60px; overflow: hidden; }`
- Ensure the reading bar fits exactly within this height.

## 2. Safe Scroll Tracking
Instead of `IntersectionObserver` (which can be flaky with layout shifts), we will use **`document.elementFromPoint`**.
- **Event**: `window.onscroll` (throttled to 300ms).
- **Logic**: 
  1. Check point at `(window.innerWidth / 2, 120)` (top-center of viewport).
  2. Find closest `.ayah-row` or `.ayah-card-style2`.
  3. Read `data-ayah-num`.
  4. Update state **only if value changed**.

## 3. Implementation Steps
1. **[CSS]** Update `PageHeader.css` and `index.css` to fix header dimensions.
2. **[App.jsx]** Implement `elementFromPoint` logic in `useEffect`.
3. **[App.jsx]** Restore the reading bar JSX (Dropdown + Info Chips).

This method is "passive" — it only reads the DOM based on user action, never automatically triggering loops.
