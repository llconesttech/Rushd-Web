import { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * ReadingProgress Component
 *
 * Tracks the current reading position (Page, Juz, Hizb) using IntersectionObserver.
 * Robustly detects which Ayah is currently at the top of the viewport.
 */
const ReadingProgress = ({ surah, pageFilter, onClearFilter }) => {
  // Initialize with first ayah
  const getInitialPos = useCallback(() => {
    if (!surah?.ayahs?.[0]) return null;
    const first = surah.ayahs[0];
    return {
      ayah: first.numberInSurah, // Keep internal, don't display
      page: first.page,
      juz: first.juz,
      hizb: first.hizbQuarter
    };
  }, [surah]);

  const [currentPos, setCurrentPos] = useState(getInitialPos);
  const observerRef = useRef(null);

  // Update if surah changes
  useEffect(() => {
    setCurrentPos(getInitialPos());
  }, [getInitialPos]);

  useEffect(() => {
    if (!surah?.ayahs || surah.ayahs.length === 0) return;

    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Options: Trigger when element crosses the "Reading Line" (approx 150px from top)
    const options = {
      root: null,
      rootMargin: '-80px 0px -80% 0px', // Active zone is a strip at the top
      threshold: 0
    };

    const handleIntersect = (entries) => {
      // Find the first ayah that is intersecting
      // We prioritize the one that just entered or is lingering at top
      const visible = entries.find(entry => entry.isIntersecting);

      if (visible) {
        const val = visible.target.getAttribute('data-ayah-num');
        if (val) {
          const ayahNum = parseInt(val, 10);

          const ayahObj = surah.ayahs.find(a => a.numberInSurah === ayahNum);
          if (ayahObj) {
            setCurrentPos(prev => {
              if (prev?.page === ayahObj.page &&
                prev?.juz === ayahObj.juz &&
                prev?.hizb === ayahObj.hizbQuarter) {
                return prev; // Avoid redundant updates
              }

              return {
                ayah: ayahNum,
                page: ayahObj.page,
                juz: ayahObj.juz,
                hizb: ayahObj.hizbQuarter
              };
            });
          }
        }
      }
    };

    const observer = new IntersectionObserver(handleIntersect, options);
    observerRef.current = observer;

    // Observe all ayah cards
    const cards = document.querySelectorAll('.ayah-row, .ayah-card-style2');
    cards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, [surah]);

  if (!currentPos) {
    return (
      <div className="scrolled-reading-bar">
        <div className="reading-info-group">
          <span className="reading-chip">Page --</span>
          <span className="reading-chip">Juz --</span>
        </div>
      </div>
    );
  }

  return (
    <div className="scrolled-reading-bar">
      <div className="reading-info-group">
        {pageFilter ? (
          <span
            className="reading-chip"
            onClick={onClearFilter}
            style={{ cursor: 'pointer', backgroundColor: '#fee2e2', color: '#991b1b', display: 'flex', alignItems: 'center', gap: '4px' }}
            title="Clear Page Filter"
          >
            Page {pageFilter} <span>×</span>
          </span>
        ) : (
          <span className="reading-chip">Page {currentPos.page}</span>
        )}
        <span className="reading-chip">Juz {currentPos.juz}</span>
        <span className="reading-chip">Hizb {currentPos.hizb}</span>
      </div>
    </div>
  );
};

ReadingProgress.propTypes = {
  surah: PropTypes.shape({
    ayahs: PropTypes.arrayOf(PropTypes.shape({
      numberInSurah: PropTypes.number,
      page: PropTypes.number,
      juz: PropTypes.number,
      hizbQuarter: PropTypes.number
    }))
  }),
  pageFilter: PropTypes.number,
  onClearFilter: PropTypes.func.isRequired
};

export default ReadingProgress;
