/* eslint-disable */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Loader2, BookOpen, Settings } from 'lucide-react';
import { useSwipeable } from 'react-swipeable';
import PageHeader from './PageHeader';
import { useSettings } from '../context/SettingsContext';
import { parseTajweed } from '../utils/tajweedParser';
import { surahData } from '../data/quranData';
import TajweedLegendDropdown from './TajweedLegendDropdown';
import AudioPlayer from './AudioPlayer';

import './Mushaf.css';

const toArabicNumerals = (n) => {
  if (!n) return '';
  return n.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
};

const MushafReader = () => {
  const { page } = useParams();
  const navigate = useNavigate();
  const currentPage = parseInt(page) || 1;
  const { selectedScript, selectedArabicFont } = useSettings();

  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  const isTajweed = selectedScript === 'quran-tajweed' || selectedScript === 'quran-indopak-tajweed';
  const isIndoPak = selectedScript === 'quran-indopak' || selectedScript === 'quran-indopak-tajweed';

  const getArabicFontFamily = () => {
    if (selectedScript === 'quran-indopak' || selectedScript === 'quran-indopak-tajweed') return 'var(--font-arabic-indopak)';
    switch (selectedArabicFont) {
      case 'alqalam': return "'Al Qalam', serif";
      case 'mequran': return "'Me Quran', serif";
      case 'scheherazade': return "'Scheherazade', serif";
      case 'saleem': return "'Saleem', serif";
      case 'amiri':
      default:
        return "'Amiri Quran', serif";
    }
  };

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      try {
        let targetScript = selectedScript;
        if (targetScript.includes('kids') || targetScript.includes('wordbyword')) {
          targetScript = 'quran-uthmani';
        }

        const res = await fetch(`/data/quran/v2/pages/${targetScript}/${currentPage}.json`);
        if (res.ok) {
          const data = await res.json();

          // We also need the real Surah data to show localized names (like Bengali translation)
          // The raw chunk only has English names
          const enhancedAyahs = data.ayahs.map(ayah => {
            const sData = surahData.find(s => s.number === ayah.surahNumber);
            return {
              ...ayah,
              localizedSurahName: sData ? sData.name : ayah.surahName, // Arabic name
              translatedName: sData ? sData.meaning : ayah.surahEnglishName
            };
          });

          setPageData({ ...data, ayahs: enhancedAyahs });
        } else {
          console.error("Page not found");
        }
      } catch (err) {
        console.error("Failed to load page", err);
      }
      setLoading(false);

      if (containerRef.current) {
        containerRef.current.scrollTo(0, 0);
      }
    };

    fetchPage();
  }, [currentPage, selectedScript]);

  const handleNextPage = useCallback(() => {
    if (currentPage < 604) navigate(`/quran/mushaf/${currentPage + 1}`);
  }, [currentPage, navigate]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) navigate(`/quran/mushaf/${currentPage - 1}`);
  }, [currentPage, navigate]);

  // Keyboard navigation (Right to left standard)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handleNextPage(); // Left goes Next in RTL
      if (e.key === 'ArrowRight') handlePrevPage(); // Right goes Prev in RTL
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, handleNextPage, handlePrevPage]);

  // Swipe Gestures for Mobile
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleNextPage(),  // Swiping left moves to next page (RTL behavior)
    onSwipedRight: () => handlePrevPage(), // Swiping right moves to previous page
    preventScrollOnSwipe: true,
    trackMouse: false
  });

  // Format Arabic Ayah for inline display (removing trailing spaces, adding the Ayah end symbol properly)
  const renderAyahInline = (ayah) => {
    // Special formatting for Bismillah when it appears inline (not common in Mushaf, usually on its own line)
    let textContent = ayah.text.trim();

    if (isTajweed) {
      let html = parseTajweed(textContent, false); // Explicitly disable tooltips for Mushaf
      return (
        <span key={ayah.ayahNumber} className="mushaf-ayah-span inline-ayah tajweed-text">
          <span dangerouslySetInnerHTML={{ __html: html }} />
          <span className="mushaf-ayah-end">۝<span className="mushaf-ayah-number">{ayah.ayahNumberInSurah}</span></span>
        </span>
      );
    }

    return (
      <span key={ayah.ayahNumber} className="mushaf-ayah-span inline-ayah">
        {textContent} <span className="mushaf-ayah-end">۝<span className="mushaf-ayah-number">{ayah.ayahNumberInSurah}</span></span>
      </span>
    );
  }

  const pageRukus = pageData?.ayahs ? [...new Set(pageData.ayahs.map(a => a.ruku).filter(Boolean))] : [];
  const hasSajdah = pageData?.ayahs?.some(a => a.sajda);

  // Safely pull primary/dominant values for the current page
  const primaryJuz = pageData?.ayahs?.[0]?.juz || '';
  const primarySurah = pageData?.ayahs?.[0]?.surahNumber || 1;
  // To solve Surah Name not showing in header:
  const primarySurahName = pageData?.ayahs?.[0]?.localizedSurahName || '';
  const headerTitle = primarySurahName ? `Surah ${primarySurahName}` : `Mushaf`;

  return (
    <div className="mushaf-container">
      <PageHeader
        title={headerTitle}
        subtitle={`Juz ${primaryJuz} • Page ${currentPage}`}
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Quran', path: '/quran' },
          { label: `Mushaf Page ${currentPage}`, path: `/quran/mushaf/${currentPage}` }
        ]}
        actions={
          <div className="mushaf-header-actions" style={{ position: 'relative' }}>
            {isTajweed && <TajweedLegendDropdown />}
            <Link to={`/quran/${primarySurah}?page=${currentPage}`} className="quran-switch-btn" title="Back to Surah Details">
              <BookOpen size={16} /> Translation
            </Link>
            <button className="quran-switch-btn" onClick={() => navigate('/settings')} title="Change Script Settings">
              <Settings size={16} /> Settings
            </button>
          </div>
        }
      />

      <div
        className="mushaf-reader-wrapper"
        ref={containerRef}
        style={{ '--mushaf-font': getArabicFontFamily() }}
        {...swipeHandlers}
      >
        {/* Top Navigation Controls (Desktop) */}
        <div className="mushaf-nav-controls desktop-only">
          <button
            onClick={handleNextPage}
            disabled={currentPage >= 604}
            className="mushaf-nav-btn"
            title="Next Page (Left Arrow)"
          >
            <ChevronLeft size={24} />
          </button>
          <span className="mushaf-page-badge">Page {currentPage} / 604</span>
          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className="mushaf-nav-btn"
            title="Previous Page (Right Arrow)"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Page Content                {/* Forcing paper-bg to ensure a premium Mushaf aesthetic regardless of general global UI setting */}
        <div className={`mushaf-page mushaf-paper-bg ${isIndoPak ? 'indopak' : ''}`}>

          {/* Top Indicators - Rendered at the top header of the page instead of side margins */}
          {pageData?.ayahs?.length > 0 && !loading && (
            <div className="mushaf-page-indicators">
              <div className="indicator-group" title="Juz Number">
                <span>الجزء</span>
                <strong>{toArabicNumerals(primaryJuz)}</strong>
              </div>

              <div className="indicator-group center-stamp">
                <img
                  src={`/fonts/Tuluth/Vector-${primarySurah - 1}.svg`}
                  alt={primarySurahName}
                  className="mushaf-header-surah-img"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    if (e.target.nextSibling) e.target.nextSibling.style.display = 'block';
                  }}
                />
                <span style={{ display: 'none' }}>{primarySurahName}</span>
              </div>

              <div className="indicator-group right-group">
                {pageRukus.length > 0 && (
                  <div title="Ruku">
                    <span>رُكوع</span>
                    <strong>{toArabicNumerals(pageRukus[0])}</strong>
                  </div>
                )}
                {hasSajdah && (
                  <div title="Sajdah" className="sajdah-stamp">
                    <span>سجدة</span>
                    <strong>۩</strong>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mushaf-page-inner">
            {loading ? (
              <div className="mushaf-loading">
                <Loader2 className="spin-icon" size={32} />
                <p>Loading Mushaf Page...</p>
              </div>
            ) : pageData?.ayahs?.length > 0 ? (
              <div className="mushaf-text-flow" dir="rtl">
                {pageData.ayahs.map((ayah, i) => (
                  <React.Fragment key={`${ayah.surahNumber}-${ayah.ayahNumber}`}>
                    {/* Render Surah Header if this ayah is the first of a Surah */}
                    {ayah.ayahNumberInSurah === 1 && (
                      <div className="mushaf-surah-break">
                        <div className="mushaf-surah-ornament">
                          <img
                            src={`/fonts/Tuluth/Vector-${ayah.surahNumber - 1}.svg`}
                            alt={ayah.localizedSurahName}
                            className="mushaf-inline-surah-img"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              if (e.target.nextSibling) e.target.nextSibling.style.display = 'block';
                            }}
                          />
                          <h2 className="mushaf-surah-name" style={{ display: 'none' }}>{ayah.localizedSurahName}</h2>
                        </div>
                        {/* Standard Bismillah unless it's At-Tawbah (Surah 9) */}
                        {ayah.surahNumber !== 9 && ayah.surahNumber !== 1 && (
                          <div className="mushaf-bismillah" title="In the name of Allah, the Entirely Merciful, the Especially Merciful">
                            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                          </div>
                        )}
                      </div>
                    )}

                    {renderAyahInline(ayah)}
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <div className="mushaf-loading error">
                <p>Page could not be loaded.</p>
              </div>
            )}

            {/* Static Bottom Navigation Controls */}
            <div className="mushaf-page-footer">
              <button
                onClick={handleNextPage}
                disabled={currentPage >= 604}
                className="mushaf-nav-btn footer-btn"
                title="Next Page"
              >
                <ChevronLeft size={24} />
              </button>
              <span className="mushaf-page-badge footer-badge">Page {currentPage} / 604</span>
              <button
                onClick={handlePrevPage}
                disabled={currentPage <= 1}
                className="mushaf-nav-btn footer-btn"
                title="Previous Page"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Audio Player Dock Local to Mushaf */}
      {primarySurah > 0 && (
        <div className="audio-player-dock" style={{ position: 'sticky', bottom: 0, paddingBottom: '0.5rem', zIndex: 100 }}>
          <AudioPlayer
            surahNumber={primarySurah}
            totalAyahs={surahData.find(s => s.number === primarySurah)?.ayahs || 0}
          />
        </div>
      )}
    </div>
  );
};

export default MushafReader;

