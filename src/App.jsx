import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate, useLocation, matchPath } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSurahList, useSurahDetail } from './hooks/useQuran';
import { useSettings } from './context/SettingsContext';
import SettingsSidebar from './components/SettingsSidebar';
import SurahListSidebar from './components/SurahListSidebar';
import HomePage from './components/HomePage';
import AudioPlayer from './components/AudioPlayer';
import PageHeader from './components/PageHeader'; // Import new component
import QiblaFinder from './components/QiblaFinder';
import TasbihCounter from './components/TasbihCounter';
import ZakatCalculator from './components/ZakatCalculator';
import SalahRules from './components/SalahRules';
import { surahData, getSurahInfo } from './data/quranData';

// Components
const SurahList = () => {
  const { data: surahs, loading, error } = useSurahList();

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error loading Surahs</div>;

  // Merge API data with our comprehensive metadata
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
                  {surah.numberOfAyahs || surah.ayahs} Ayahs
                </span>
                <span style={{
                  fontFamily: 'var(--font-arabic)',
                  fontSize: '1.35rem',
                  color: 'var(--color-primary)'
                }}>
                  {surah.arabicName || (surah.name && surah.name.replace('سورة ', ''))}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// ... parsing utilities omitted for brevity as they are unchanged ...
const parseTajweed = (text) => {
  if (!text) return "";
  return text.replace(/\[([a-z])(?::\d+)?\[([^\]]+)\]/g, (match, type, content) => {
    return `<span class="tj-${type}">${content}</span>`;
  });
};

const parseWordByWord = (text) => {
  if (!text) return [];
  const words = text.split('$').filter(w => w.trim());
  return words.map(w => {
    const parts = w.split('|');
    return {
      arabic: parts[0],
      translation: parts[1]
    };
  });
};

const QuranReader = () => {
  const { number } = useParams();
  const navigate = useNavigate();
  const [transliterationType, setTransliterationType] = useState('none');
  const { selectedScript, selectedTranslation, uiStyle } = useSettings();

  const surahNum = parseInt(number);

  // Pass selected script and translation to the hook
  const { data: surah, loading, error } = useSurahDetail(
    number,
    transliterationType,
    selectedScript,
    selectedTranslation
  );

  // Get complete metadata from our comprehensive data
  const surahInfo = getSurahInfo(surahNum);

  if (loading) return <div className="container" style={{ marginTop: '2rem' }}>Loading Surah...</div>;
  if (error) return <div className="container" style={{ marginTop: '2rem' }}>Error loading Surah. Try a different translation.</div>;
  if (!surah) return null;

  const isWordByWord = selectedScript === 'quran-kids' || selectedScript === 'quran-wordbyword' || selectedScript === 'quran-wordbyword-2';
  const isTajweed = selectedScript === 'quran-tajweed';

  // Navigation handlers
  const handleNextSurah = () => {
    if (surahNum < 114) navigate(`/quran/${surahNum + 1}`);
  };

  const handlePrevSurah = () => {
    if (surahNum > 1) navigate(`/quran/${surahNum - 1}`);
  };

  const actions = (
    <>
      <div className="ph-actions-group">
        <button
          className="ph-action-btn ph-btn-outline"
          onClick={handlePrevSurah}
          disabled={surahNum <= 1}
          title="Previous Surah"
        >
          <ChevronLeft size={16} /> Prev
        </button>
        <button
          className="ph-action-btn ph-btn-outline"
          onClick={handleNextSurah}
          disabled={surahNum >= 114}
          title="Next Surah"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>

      <select
        value={transliterationType}
        onChange={(e) => setTransliterationType(e.target.value)}
        className="ph-action-btn ph-btn-outline"
        style={{ padding: '0.4rem 0.75rem' }}
      >
        <option value="none">No Transliteration</option>
        <option value="bn_v1">Bengali (Phonetic)</option>
      </select>
    </>
  );

  const subtitle = (
    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      {surah.englishNameTranslation} • {surah.numberOfAyahs} Ayahs • {surahInfo?.revelationType}
    </span>
  );

  return (
    <div className="container" style={{ maxWidth: '800px', padding: 0 }}>
      <PageHeader
        title={surah.englishName}
        subtitle={subtitle}
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Quran', path: '/quran' },
          { label: surah.englishName, path: `/quran/${surahNum}` }
        ]}
        actions={actions}
      />

      {/* Audio Player */}
      <div style={{ padding: '0 2rem' }}>
        <AudioPlayer surahNumber={parseInt(number)} totalAyahs={surah.numberOfAyahs} />
      </div>

      {/* Main Content */}
      <div className={uiStyle === 'style2' ? '' : ''} style={{
        marginTop: '1rem',
        padding: '0 2rem 2rem 2rem',
        backgroundColor: uiStyle === 'style2' ? 'transparent' : 'var(--color-bg-card)',
        borderRadius: uiStyle === 'style2' ? '0' : '1rem',
        boxShadow: uiStyle === 'style2' ? 'none' : 'var(--shadow-md)',
        overflow: 'hidden'
      }}>
        {/* ... Ayah Mapping (Content) ... */}
        {surah.ayahs.map((ayah, index) => (
          uiStyle === 'style2' ? (
            <div key={ayah.number} className="ayah-card-style2">
              <span className="ayah-badge">Ayah {ayah.numberInSurah}</span>
              <button className="play-btn-circle" title="Play Ayah">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              </button>

              <div className="ayah-text-container">
                {isWordByWord ? (
                  <div className="word-by-word-container" style={{ padding: 0 }}>
                    {parseWordByWord(ayah.text).map((w, i) => (
                      <div key={i} className="word-block">
                        <span className="word-arabic">{w.arabic}</span>
                        <span className="word-translation">{w.translation}</span>
                      </div>
                    ))}
                  </div>
                ) : isTajweed ? (
                  <p className="arabic-text tajweed-text" style={{
                    fontSize: '2.5rem',
                    lineHeight: '2.5',
                    textAlign: 'right',
                    margin: 0,
                    color: 'var(--color-text-main)'
                  }} dangerouslySetInnerHTML={{ __html: parseTajweed(ayah.text) }} />
                ) : (
                  <p className="arabic-text" style={{
                    fontSize: '2.5rem',
                    lineHeight: '2.5',
                    textAlign: 'right',
                    margin: 0,
                    color: 'var(--color-text-main)'
                  }}>
                    {ayah.text}
                  </p>
                )}

                <div className="translation-container">
                  <p style={{ fontSize: '1.25rem', lineHeight: '1.8', color: 'var(--color-text-main)', margin: 0 }}>
                    {ayah.translation}
                  </p>
                </div>

                {ayah.transliteration && (
                  <p style={{ fontSize: '1.1rem', color: 'var(--color-primary-dark)', fontStyle: 'italic', margin: 0, borderLeft: '3px solid var(--color-primary)', paddingLeft: '1rem' }}>
                    {ayah.transliteration}
                  </p>
                )}
              </div>

              {/* Footnote/Note Box if data exists (mocking it for now as per style 2) */}
              <div className="footnote-box">
                <p className="footnote-text">
                  Note: This ayah highlights the importance of faith and guidance.
                </p>
              </div>
            </div>
          ) : (
            <div key={ayah.number} style={{
              padding: '2rem',
              borderBottom: '1px solid var(--color-border)',
              backgroundColor: index % 2 === 0 ? 'var(--color-bg-card)' : 'var(--color-bg-main)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '1.5rem',
                color: 'var(--color-text-muted)',
                fontSize: '0.875rem'
              }}>
                <span>{surah.number}:{ayah.numberInSurah}</span>
              </div>

              {isWordByWord ? (
                <div className="word-by-word-container">
                  {parseWordByWord(ayah.text).map((w, i) => (
                    <div key={i} className="word-block">
                      <span className="word-arabic">{w.arabic}</span>
                      <span className="word-translation">{w.translation}</span>
                    </div>
                  ))}
                </div>
              ) : isTajweed ? (
                <p className="arabic-text tajweed-text" style={{
                  fontSize: '2.5rem',
                  lineHeight: '2.2',
                  textAlign: 'right',
                  marginBottom: '1.5rem',
                  color: 'var(--color-text-main)'
                }} dangerouslySetInnerHTML={{ __html: parseTajweed(ayah.text) }} />
              ) : (
                <p className="arabic-text" style={{
                  fontSize: '2.5rem',
                  lineHeight: '2.2',
                  textAlign: 'right',
                  marginBottom: '1.5rem',
                  color: 'var(--color-text-main)'
                }}>
                  {ayah.text}
                </p>
              )}

              <div style={{ marginBottom: '1rem' }}>
                <p style={{ fontSize: '1.125rem', lineHeight: '1.6', color: 'var(--color-text-main)' }}>
                  {ayah.translation}
                </p>
              </div>

              {ayah.transliteration && (
                <div style={{ marginTop: '0.75rem', padding: '0.75rem', backgroundColor: 'var(--color-primary-light)', borderRadius: '0.5rem' }}>
                  <p style={{ fontSize: '1rem', color: 'var(--color-primary-dark)', fontStyle: 'italic', margin: 0 }}>
                    {ayah.transliteration}
                  </p>
                </div>
              )}
            </div>
          )
        ))}
      </div>
    </div>
  );
};

const Layout = ({ children }) => {
  const { uiStyle } = useSettings();
  const location = window.location.pathname;
  const isGridView = location === '/' || location === '/quran';

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      backgroundColor: (uiStyle === 'style2' || isGridView) ? 'var(--color-bg-main)' : undefined
    }} className={(uiStyle === 'style2' || isGridView) ? 'bg-dots' : ''}>
      {children}
    </div>
  );
};

function App() {
  const navigate = useNavigate();

  const handleSurahSelect = (surahNumber) => {
    navigate(`/quran/${surahNumber}`);
  };

  // const { number } = useParams();
  // const surahNumber = number ? parseInt(number) : null;

  // Determine if we are on the Reader page
  const location = useLocation();
  const readerMatch = matchPath("/quran/:number", location.pathname);
  const surahNumber = readerMatch ? parseInt(readerMatch.params.number) : null;
  const isReaderPage = !!readerMatch;

  return (
    <Layout>
      {/* 
          Surah Sidebar:
          - Pass 'persistent={true}' if on Reader page to keep it open and sticky.
          - In Flex layout, this becomes the first flex item.
      */}
      {isReaderPage && (
        <SurahListSidebar
          onSurahSelect={handleSurahSelect}
          currentSurah={surahNumber}
          persistent={true}
        />
      )}

      {/* Main Content Area */}
      <main style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex', // To center the inner container
        justifyContent: 'center', // Center content horizontally
        backgroundColor: 'transparent'
      }}>
        {/* Inner Content Container */}
        <div style={{
          width: '100%',
          maxWidth: isReaderPage ? '864px' : '1200px', // 800px content + 64px padding
          padding: '2rem', // Reduced padding
          // Margin auto is handled by flex justify-center, but good for safety
          margin: isReaderPage ? '0 auto' : '0 auto',
        }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quran" element={<SurahList />} />
            {/* Reader Page */}
            <Route path="/quran/:number" element={<QuranReader />} />
            <Route path="/qibla" element={<QiblaFinder />} />
            <Route path="/tasbih" element={<TasbihCounter />} />
            <Route path="/zakat" element={<ZakatCalculator />} />
            <Route path="/salah-rules" element={<SalahRules />} />
            <Route path="/settings" element={<div className="container"><h1>Settings</h1></div>} />
          </Routes>
        </div>
      </main>

      {/* 
         Settings Sidebar:
         - Pass 'persistent={true}' but control visibility via context/props if needed.
         - The request was "Can toggle the settings on right".
      */}
      {isReaderPage && (
        <SettingsSidebar persistent={true} />
      )}
    </Layout>
  );
}

// Wrap App with Router for useNavigate
function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
