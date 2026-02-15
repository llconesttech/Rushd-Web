import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate, useLocation, matchPath } from 'react-router-dom';
import { ChevronLeft, ChevronRight, BookOpen, Settings, Home } from 'lucide-react';
import { useSurahList, useSurahDetail } from './hooks/useQuran';
import { translations, languageList } from './data/quranData';
import { getArabicSurahName, getSurahName } from './data/surahNames';
import SettingsSidebar from './components/SettingsSidebar';
import SurahListSidebar from './components/SurahListSidebar';
import HomePage from './components/HomePage';
import ReadingProgress from './components/ReadingProgress';
import AudioPlayer from './components/AudioPlayer';
import PageHeader from './components/PageHeader';

import TajweedLegendDropdown from './components/TajweedLegendDropdown';
import TajweedPage from './components/TajweedPage';
import { parseTajweed } from './utils/tajweedParser';
import quranService from './services/quranService';
import { TAJWEED_RULES } from './data/tajweedData';
import { useSettings } from './context/SettingsContext';
import QiblaFinder from './components/QiblaFinder';
import TasbihCounter from './components/TasbihCounter';
import ZakatCalculator from './components/ZakatCalculator';
import SalahRules from './components/SalahRules';
import AsmaUlHusna from './components/AsmaUlHusna';
import IslamicCalendar from './components/IslamicCalendar';
import RamadanCalendar from './components/RamadanCalendar';
import FastingRules from './components/FastingRules';
import Taraweeh from './components/Taraweeh';
import LaylatulQadr from './components/LaylatulQadr';
import Sadaqah from './components/Sadaqah';
import ShanENuzool from './components/ShanENuzool';
import { surahData, getSurahInfo } from './data/quranData';

// ─── Surah List (Grid Page) ───
const SurahList = () => {
  const { data: surahs, loading, error } = useSurahList();

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error loading Surahs</div>;

  const enhancedSurahs = surahs.map(surah => {
    const metadata = surahData.find(s => s.number === surah.number);
    return { ...surah, ...metadata };
  });

  return (
    <div className="container">
      <PageHeader
        title="Surah Index"
        subtitle="Select a Surah to read • 114 Surahs • 30 Juz"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Quran', path: '/quran' }
        ]}
      />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '1rem',
        marginTop: '1rem'
      }}>
        {enhancedSurahs.map(surah => (
          <Link to={`/quran/${surah.number}`} key={surah.number} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{
              backgroundColor: 'var(--color-bg-card)',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--color-border)',
              transition: 'all 0.2s',
              cursor: 'pointer'
            }} className="surah-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary-dark)',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}>{surah.number}</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{
                    fontSize: '0.7rem',
                    padding: '0.2rem 0.5rem',
                    backgroundColor: surah.revelationType === 'Meccan' ? '#fef3c7' : '#dbeafe',
                    color: surah.revelationType === 'Meccan' ? '#92400e' : '#1e40af',
                    borderRadius: '0.5rem'
                  }}>{surah.revelationType}</span>
                  {surah.juz && (
                    <span style={{
                      fontSize: '0.7rem',
                      padding: '0.2rem 0.5rem',
                      backgroundColor: '#f0fdf4',
                      color: '#047857',
                      borderRadius: '0.5rem'
                    }}>Juz {surah.juz[0]}</span>
                  )}
                </div>
              </div>
              <h3 style={{ margin: '0.5rem 0', fontSize: '1.125rem' }}>{surah.englishName || surah.name}</h3>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{surah.englishNameTranslation || surah.meaning}</p>
              <div style={{
                marginTop: '0.75rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  {surah.numberOfAyahs || surah.ayahs} Ayahs {surah.rukus > 1 && <>&bull; {surah.rukus} Rukus</>}
                </span>
                <div className="surah-name-calligraphy">
                  <img
                    src={`/fonts/Tuluth/Vector-${surah.number - 1}.svg`}
                    alt={surah.arabicName}
                    className="surah-vector-name"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.nextSibling) e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <span style={{ display: 'none' }}>
                    {surah.arabicName || (surah.name && surah.name.replace('سورة ', ''))}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};



// ─── Word-by-Word Parser ───
const parseWordByWord = (text) => {
  if (!text) return [];
  const words = text.split('$').filter(w => w.trim());
  return words.map(w => {
    const parts = w.split('|');
    return { arabic: parts[0], translation: parts[1] };
  });
};

// ─── Quran Reader (Surah Detail Page) ───
const QuranReader = () => {
  const { number } = useParams();
  const navigate = useNavigate();
  // removed local state: const [transliterationType, setTransliterationType] = useState('none');
  const {
    selectedScript,
    selectedTranslation,
    selectedTafsir,
    selectedTransliteration,
    setSelectedTransliteration,
    uiStyle,
    selectedArabicFont,
    showTajweedTooltips
  } = useSettings();
  const [isScrolled, setIsScrolled] = useState(false);

  const surahNum = parseInt(number);

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

  const { data: surah, loading, error } = useSurahDetail(
    number, selectedTransliteration, selectedScript, selectedTranslation, selectedTafsir
  );

  const location = useLocation();
  const highlightAyah = location.state?.highlightAyah;

  // Track scroll position for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle Deep Linking to Ayah
  useEffect(() => {
    if (highlightAyah && !loading && surah) {
      // Small delay to ensure rendering
      setTimeout(() => {
        const element = document.getElementById(`ayah-${highlightAyah}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Optional: Add highlight class and remove it
          element.classList.add('highlight-ayah');
          setTimeout(() => element.classList.remove('highlight-ayah'), 2000);
        }
      }, 500);
    }
  }, [highlightAyah, loading, surah]);

  const translationMeta = translations[selectedTranslation];
  const subtitleLangCode = translationMeta?.language_code || 'en';
  const localizedSurahName = getSurahName(surahNum, subtitleLangCode);
  const arabicCalligraphicName = getArabicSurahName(surahNum);
  const surahInfo = getSurahInfo(surahNum);

  if (loading) return <div className="container" style={{ marginTop: '2rem' }}>Loading Surah...</div>;
  if (error) return <div className="container" style={{ marginTop: '2rem' }}>Error loading Surah. Try a different translation.</div>;
  if (!surah) return null;

  const isWordByWord = selectedScript === 'quran-kids' || selectedScript === 'quran-wordbyword' || selectedScript === 'quran-wordbyword-2';
  const isTajweed = selectedScript === 'quran-tajweed' || selectedScript === 'quran-indopak-tajweed';
  const isIndoPak = selectedScript === 'quran-indopak' || selectedScript === 'quran-indopak-tajweed';
  const isStyle2 = uiStyle === 'style2';

  const handleNextSurah = () => { if (surahNum < 114) navigate(`/quran/${surahNum + 1}`); };
  const handlePrevSurah = () => { if (surahNum > 1) navigate(`/quran/${surahNum - 1}`); };

  // Actions removed in favor of inline header controls
  const actions = null;

  const getManzil = (n) => {
    if (n >= 1 && n <= 4) return 1;
    if (n >= 5 && n <= 9) return 2;
    if (n >= 10 && n <= 16) return 3;
    if (n >= 17 && n <= 25) return 4;
    if (n >= 26 && n <= 36) return 5;
    if (n >= 37 && n <= 49) return 6;
    if (n >= 50 && n <= 114) return 7;
    return 0;
  };

  // Badge Element
  const surahBadge = (
    <span className={`revelation-badge ${surahInfo?.revelationType.toLowerCase()}`}>
      {surahInfo?.revelationType}
    </span>
  );

  // Compact subtitle for sticky header
  const subtitle = (
    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
      {surahInfo?.meaning}
      <span style={{ color: 'var(--color-border)' }}>&bull;</span>
      {surahInfo?.rukus} Rukus
      <span style={{ color: 'var(--color-border)' }}>&bull;</span>
      Manzil {getManzil(surahNum)}
    </span>
  );

  // ─── Render an Ayah ───
  const renderAyah = (ayah, index) => {
    const arabicContent = isWordByWord ? (
      <div className="word-by-word-container" style={{ padding: 0 }}>
        {parseWordByWord(ayah.text).map((w, i) => (
          <div key={i} className="word-block">
            <span className="word-arabic" style={{ fontFamily: getArabicFontFamily() }}>{w.arabic}</span>
            <span className="word-translation">{w.translation}</span>
          </div>
        ))}
      </div>
    ) : isTajweed ? (
      <p className={`ayah-arabic arabic-text tajweed-text ${isIndoPak ? 'indopak' : `font-${selectedArabicFont}`}`}
        style={{ fontFamily: getArabicFontFamily() }}
        dangerouslySetInnerHTML={{ __html: parseTajweed(ayah.text, showTajweedTooltips) }} />
    ) : (
      <p className={`ayah-arabic arabic-text font-${selectedArabicFont} ${isIndoPak ? 'indopak' : ''}`}
        style={{ fontFamily: getArabicFontFamily() }}>
        {ayah.text}
      </p>
    );

    if (isStyle2) {
      return (
        <div
          key={ayah.number}
          className="ayah-card-style2"
          data-ayah-num={ayah.numberInSurah} // For scroll tracking
        >
          <span className="ayah-badge">Ayah {ayah.numberInSurah}</span>
          <button className="play-btn-circle" title="Play Ayah">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          </button>
          <div className="ayah-text-container">
            {arabicContent}
            {ayah.transliteration && <p className="ayah-transliteration">{ayah.transliteration}</p>}
            {ayah.translation && <div className="translation-container"><p className="ayah-translation">{ayah.translation}</p></div>}
            {ayah.tafsir && (
              <div className="tafsir-container" style={{
                marginTop: '1rem',
                padding: '1rem',
                backgroundColor: 'var(--color-surface)',
                borderLeft: '4px solid var(--color-secondary)',
                borderRadius: '0 8px 8px 0'
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase',
                  color: 'var(--color-secondary)', marginBottom: '0.5rem'
                }}>
                  <BookOpen size={14} /> Tafsir
                </div>
                <p className="ayah-tafsir" style={{ fontSize: '1rem', lineHeight: '1.6', color: 'var(--color-text-main)' }}>
                  {ayah.tafsir}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Style 1
    return (
      <div
        key={ayah.number}
        id={`ayah-${ayah.number}`}
        className="ayah-row"
        data-ayah-num={ayah.numberInSurah} // For scroll tracking
        style={{
          backgroundColor: index % 2 === 0 ? 'var(--color-bg-card)' : 'var(--color-bg-main)'
        }}
      >
        <div className="ayah-number-badge">
          <span>{surah.number}:{ayah.numberInSurah}</span>
        </div>
        {arabicContent}
        {ayah.transliteration && <p className="ayah-transliteration">{ayah.transliteration}</p>}
        {ayah.translation && <div className="translation-container"><p className="ayah-translation">{ayah.translation}</p></div>}
        {ayah.tafsir && (
          <div className="tafsir-container" style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: 'var(--color-surface)',
            borderLeft: '4px solid var(--color-secondary)',
            borderRadius: '0 8px 8px 0'
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase',
              color: 'var(--color-secondary)', marginBottom: '0.5rem'
            }}>
              <BookOpen size={14} /> Tafsir
            </div>
            <p className="ayah-tafsir" style={{ fontSize: '1rem', lineHeight: '1.6', color: 'var(--color-text-main)' }}>
              {ayah.tafsir}
            </p>
          </div>
        )}
      </div>
    );
  };

  // Transliteration Selector (Always Visible)
  const transliterationSelector = (
    <select
      value={selectedTransliteration}
      onChange={(e) => setSelectedTransliteration(e.target.value)}
      className="reading-select"
      title="Transliteration"
      style={{ marginLeft: 'auto' }}
    >
      <option value="none">No Translit.</option>
      {Object.entries(translations)
        .filter(([key, val]) => val.type === 'transliteration')
        .sort((a, b) => a[1].english_name.localeCompare(b[1].english_name))
        .map(([key, val]) => (
          <option key={key} value={key}>{val.english_name}</option>
        ))}
    </select>
  );

  return (
    <div className="quran-reader-container" style={{ '--arabic-font': getArabicFontFamily() }}>
      {/* Header Group */}
      <div className="quran-header-group" style={{ position: 'sticky', top: 0, zIndex: 40 }}>
        <PageHeader
          title={`Surah ${surah.englishName}`}
          badge={surahBadge}
          subtitle={subtitle}
          breadcrumbs={[
            { label: 'Home', path: '/' },
            { label: 'Quran', path: '/quran' },
            { label: surah.englishName, path: `/quran/${surahNum}` }
          ]}
          isScrolled={isScrolled}
          actions={
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', justifyContent: 'flex-end' }}>
              <ReadingProgress surah={surah} />
              {transliterationSelector}
            </div>
          }
        />

        {/* Tajweed Legend Dropdown (replaces Bar) */}
        {isTajweed && (
          <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 60 }}>
            <TajweedLegendDropdown />
          </div>
        )}
      </div>

      {/* Calligraphic Surah Header */}
      <div className="quran-reader-inner">
        <div className="surah-calligraphic-header">
          <img
            src={`/fonts/Tuluth/Vector-${surah.number - 1}.svg`}
            alt={surah.arabicName}
            className="surah-vector-name-header"
            onError={(e) => {
              e.target.style.display = 'none';
              if (e.target.nextSibling) e.target.nextSibling.style.display = 'block';
            }}
          />
          <h1 style={{ display: 'none' }}>{'\uFD3F'} {'سورة'} {arabicCalligraphicName} {'\uFD3E'}</h1>

          <div className="surah-subtitle">
            <span>{subtitleLangCode !== 'ar' ? localizedSurahName : surah.englishName}</span>
          </div>

        </div>
      </div>

      {/* Ayahs */}
      <div className={`ayah-content-wrap ${isStyle2 ? 'transparent' : ''}`}>
        {surah.ayahs.map((ayah, index) => {
          const prevRuku = index > 0 ? surah.ayahs[index - 1].ruku : ayah.ruku;
          const showRukuDivider = index > 0 && ayah.ruku !== prevRuku;
          return (
            <React.Fragment key={ayah.numberInSurah || ayah.number}>
              {showRukuDivider && (
                <div className="ruku-divider">
                  <span>Ruku {ayah.ruku}</span>
                </div>
              )}
              {renderAyah(ayah, index)}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// ─── Layout ───
const Layout = ({ children }) => {
  const { uiStyle } = useSettings();
  const location = window.location.pathname;
  const isGridView = location === '/' || location === '/quran';
  const bgClass = (uiStyle === 'style2' || isGridView) ? 'app-layout bg-dots' : 'app-layout';

  return (
    <div className={bgClass} style={{
      display: 'flex',
      height: '100dvh',
      width: '100vw',
      overflow: 'hidden',
      backgroundColor: (uiStyle === 'style2' || isGridView) ? 'var(--color-bg-main)' : undefined
    }}>
      {children}
    </div>
  );
};




// ─── App ───
function App() {
  const navigate = useNavigate();
  const { isSurahListOpen, isSettingsOpen, toggleSurahList, toggleSettings } = useSettings();

  const handleSurahSelect = (surahNumber, ayahNumber = null) => {
    navigate(`/quran/${surahNumber}`, { state: { highlightAyah: ayahNumber } });
  };

  const location = useLocation();
  const readerMatch = matchPath("/quran/:number", location.pathname);
  const surahNumber = readerMatch ? parseInt(readerMatch.params.number) : null;
  const isReaderPage = !!readerMatch;

  const isShanENuzoolPage = !!matchPath("/shan-e-nuzool/:surahId?", location.pathname);
  const showSidebars = isReaderPage || isShanENuzoolPage;

  const surahMeta = surahNumber ? getSurahInfo(surahNumber) : null;
  const totalAyahs = surahMeta?.ayahs || 0;

  const anySidebarOpen = isSurahListOpen || isSettingsOpen;

  const handleBackdropClick = () => {
    if (isSurahListOpen) toggleSurahList();
    if (isSettingsOpen) toggleSettings();
  };

  return (
    <Layout>
      {/* Surah Sidebar */}
      {showSidebars && (
        <SurahListSidebar
          onSurahSelect={(num) => {
            if (isShanENuzoolPage) navigate(`/shan-e-nuzool/${num}`);
            else handleSurahSelect(num);
          }}
          currentSurah={isShanENuzoolPage ? (parseInt(location.pathname.split('/').pop()) || 1) : surahNumber}
          persistent={true}
        />
      )}

      {/* Backdrop Overlay (mobile/tablet) */}
      {showSidebars && (
        <div
          className={`sidebar - backdrop ${anySidebarOpen ? 'visible' : ''} `}
          onClick={handleBackdropClick}
        />
      )}

      {/* Main Content Wrapper */}
      <div className="main-content-wrapper">

        {/* Scrollable content */}
        <main className="reader-main-content">
          <div style={{
            width: '100%',
            maxWidth: (isReaderPage || isShanENuzoolPage) ? '864px' : '1200px',
            padding: (isReaderPage || isShanENuzoolPage) ? '0.5rem' : '2rem',
            margin: '0 auto',
          }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/quran" element={<SurahList />} />
              <Route path="/quran/:number" element={<QuranReader />} />
              <Route path="/qibla" element={<QiblaFinder />} />
              <Route path="/tasbih" element={<TasbihCounter />} />
              <Route path="/zakat" element={<ZakatCalculator />} />
              <Route path="/salah-rules" element={<SalahRules />} />
              <Route path="/names" element={<AsmaUlHusna />} />
              <Route path="/calendar" element={<IslamicCalendar />} />
              <Route path="/ramadan" element={<RamadanCalendar />} />
              <Route path="/fasting" element={<FastingRules />} />
              <Route path="/taraweeh" element={<Taraweeh />} />
              <Route path="/laylatul-qadr" element={<LaylatulQadr />} />
              <Route path="/sadaqah" element={<Sadaqah />} />
              <Route path="/shan-e-nuzool" element={<ShanENuzool />} />
              <Route path="/shan-e-nuzool/:surahId" element={<ShanENuzool />} />
              <Route path="/tajweed" element={<TajweedPage />} />
              <Route path="/settings" element={<div className="container"><h1>Settings</h1></div>} />
            </Routes>
          </div>
        </main>

        {/* Audio Player Dock (bottom of content, above mobile nav) */}
        {isReaderPage && surahNumber > 0 && (
          <div className="audio-player-dock">
            <AudioPlayer surahNumber={surahNumber} totalAyahs={totalAyahs} />
          </div>
        )}
      </div>

      {/* Settings Sidebar */}
      {showSidebars && (
        <SettingsSidebar persistent={true} />
      )}

      {/* Tajweed FAB Removed */}

      {/* Mobile Bottom Action Bar */}
      {showSidebars && (
        <div className="mobile-bottom-bar">
          <button className={`bar - btn ${isSurahListOpen ? 'active' : ''} `} onClick={toggleSurahList}>
            <BookOpen size={22} />
            <span>Surahs</span>
          </button>
          <button className="bar-btn" onClick={() => navigate('/')}>
            <Home size={22} />
            <span>Home</span>
          </button>
          <button className={`bar - btn ${isSettingsOpen ? 'active' : ''} `} onClick={toggleSettings}>
            <Settings size={22} />
            <span>Settings</span>
          </button>
        </div>
      )}
    </Layout>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
