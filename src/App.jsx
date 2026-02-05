import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Home, Settings, ChevronLeft, Moon, Sun } from 'lucide-react';
import { useSurahList, useSurahDetail } from './hooks/useQuran';
import { useSettings } from './context/SettingsContext';
import SettingsSidebar from './components/SettingsSidebar';
import SurahListSidebar from './components/SurahListSidebar';
import AudioPlayer from './components/AudioPlayer';
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
      <div style={{ marginBottom: '2rem' }}>
        <h1>Surah Index</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Select a Surah to read • 114 Surahs • 30 Juz</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '1rem'
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

// Parsing utilities for special scripts
const parseTajweed = (text) => {
  if (!text) return "";
  // alquran.cloud format: [h:1[ٱ] or [n[ـٰ]
  // Matches [rule:index[text] or [rule[text]
  return text.replace(/\[([a-z])(?::\d+)?\[([^\]]+)\]/g, (match, type, content) => {
    return `<span class="tj-${type}">${content}</span>`;
  });
};

const parseWordByWord = (text) => {
  if (!text) return [];
  // Example: Word|Translation|X|Y|#$
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
  const [transliterationType, setTransliterationType] = useState('none');
  const { selectedScript, selectedTranslation } = useSettings();

  // Pass selected script and translation to the hook
  const { data: surah, loading, error } = useSurahDetail(
    number,
    transliterationType,
    selectedScript,
    selectedTranslation
  );

  // Get complete metadata from our comprehensive data
  const surahInfo = getSurahInfo(parseInt(number));

  if (loading) return <div className="container" style={{ marginTop: '2rem' }}>Loading Surah...</div>;
  if (error) return <div className="container" style={{ marginTop: '2rem' }}>Error loading Surah. Try a different translation.</div>;
  if (!surah) return null;

  const isWordByWord = selectedScript === 'quran-kids' || selectedScript === 'quran-wordbyword' || selectedScript === 'quran-wordbyword-2';
  const isTajweed = selectedScript === 'quran-tajweed';

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      {/* Audio Player */}
      <AudioPlayer surahNumber={parseInt(number)} totalAyahs={surah.numberOfAyahs} />

      {/* Surah Header with Juz Info */}
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <Link to="/quran" className="btn-icon" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--color-text-muted)' }}>
          <ChevronLeft /> Back
        </Link>
        <div style={{ flex: 1, textAlign: 'center', minWidth: '200px' }}>
          <h1 style={{ margin: 0 }}>{surah.englishName}</h1>
          <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '1rem' }}>
            {surah.englishNameTranslation} • {surah.numberOfAyahs} Ayahs
          </p>
          {surahInfo && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
              marginTop: '0.5rem',
              flexWrap: 'wrap'
            }}>
              <span style={{
                padding: '0.25rem 0.75rem',
                backgroundColor: 'var(--color-primary-light)',
                borderRadius: '1rem',
                fontSize: '0.75rem',
                color: 'var(--color-primary-dark)',
                fontWeight: 500
              }}>
                Juz {surahInfo.juz.length > 1 ? `${surahInfo.juz[0]}-${surahInfo.juz[surahInfo.juz.length - 1]}` : surahInfo.juz[0]}
              </span>
              <span style={{
                padding: '0.25rem 0.75rem',
                backgroundColor: surahInfo.revelationType === 'Meccan' ? '#fef3c7' : '#dbeafe',
                borderRadius: '1rem',
                fontSize: '0.75rem',
                color: surahInfo.revelationType === 'Meccan' ? '#92400e' : '#1e40af',
                fontWeight: 500
              }}>
                {surahInfo.revelationType}
              </span>
              <span style={{
                padding: '0.25rem 0.75rem',
                backgroundColor: '#f3e8ff',
                borderRadius: '1rem',
                fontSize: '0.75rem',
                color: '#6b21a8',
                fontWeight: 500
              }}>
                {surahInfo.arabicName}
              </span>
            </div>
          )}
        </div>

        <select
          value={transliterationType}
          onChange={(e) => setTransliterationType(e.target.value)}
          style={{
            padding: '0.5rem',
            borderRadius: '0.5rem',
            border: '1px solid var(--color-border)',
            backgroundColor: 'white',
            cursor: 'pointer'
          }}
        >
          <option value="none">No Transliteration</option>
          <option value="bn_v1">Bengali (Phonetic)</option>
          {/* Future: <option value="bn_v2">Bengali (IPA)</option> */}
        </select>
      </div>

      <div style={{
        backgroundColor: 'var(--color-bg-card)',
        borderRadius: '1rem',
        boxShadow: 'var(--shadow-md)',
        overflow: 'hidden'
      }}>
        {surah.ayahs.map((ayah, index) => (
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
        ))}
      </div>
    </div>
  );
};

const Layout = ({ children }) => (
  <div style={{ display: 'flex', minHeight: '100vh' }}>
    <aside style={{
      width: '260px',
      backgroundColor: 'var(--color-bg-card)',
      borderRight: '1px solid var(--color-border)',
      padding: 'var(--spacing-md)',
      position: 'fixed',
      height: '100vh',
      overflowY: 'auto'
    }}>
      <div style={{ marginBottom: '3rem', marginTop: '1rem', color: 'var(--color-primary-dark)', fontWeight: 'bold', fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '0.5rem' }}>
        <div style={{ background: 'var(--color-primary)', color: 'white', padding: '6px', borderRadius: '8px' }}>
          <BookOpen size={24} />
        </div>
        Rushd
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <NavLink to="/" icon={<Home size={20} />} label="Dashboard" />
        <NavLink to="/quran" icon={<BookOpen size={20} />} label="Quran Index" />
        <div style={{ height: '1px', background: 'var(--color-border)', margin: '1rem 0' }}></div>
        <NavLink to="/settings" icon={<Settings size={20} />} label="Settings" />
      </nav>
    </aside>
    <main style={{ flex: 1, marginLeft: '260px', padding: '3rem' }}>
      {children}
    </main>
  </div>
);

const NavLink = ({ to, icon, label }) => (
  <Link to={to} style={{
    textDecoration: 'none',
    color: 'var(--color-text-main)',
    padding: '0.75rem 1rem',
    borderRadius: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontWeight: '500',
    transition: 'all 0.2s',
  }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-main)'}
    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
  >
    <span style={{ color: 'var(--color-text-muted)' }}>{icon}</span> {label}
  </Link>
);

function App() {
  const navigate = useNavigate();

  const handleSurahSelect = (surahNumber) => {
    navigate(`/quran/${surahNumber}`);
  };

  return (
    <>
      <SurahListSidebar onSurahSelect={handleSurahSelect} currentSurah={null} />
      <Layout>
        <Routes>
          <Route path="/" element={<SurahList />} />
          <Route path="/quran" element={<SurahList />} />
          <Route path="/quran/:number" element={<QuranReader />} />
          <Route path="/settings" element={<div className="container"><h1>Settings</h1></div>} />
        </Routes>
      </Layout>
      <SettingsSidebar />
    </>
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
