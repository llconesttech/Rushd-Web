import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { pageMapping } from '../data/pageMapping';
import { X } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { surahData } from '../data/quranData';
import './SurahListSidebar.css';
import quranServiceV2 from '../services/quranServiceV2'; // Import the service

// Map Juz number to the Surah number where it starts (Approximate/Start of Surah)
const JUZ_START_SURAHS = {
    1: 1, 2: 2, 3: 2, 4: 3, 5: 4, 6: 4, 7: 5, 8: 6, 9: 7, 10: 8,
    11: 9, 12: 11, 13: 12, 14: 15, 15: 17, 16: 18, 17: 21, 18: 23,
    19: 25, 20: 27, 21: 29, 22: 33, 23: 36, 24: 39, 25: 41, 26: 46,
    27: 51, 28: 58, 29: 67, 30: 78
};

const toArabicNumerals = (n) => {
    return n.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
};

const SurahListSidebar = ({ onSurahSelect, currentSurah, persistent = false }) => {
    const {
        isSurahListOpen,
        toggleSurahList,
        selectedScript,
        selectedTranslation,
        selectedTransliteration,
        toggleSettings
    } = useSettings();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('surah'); // 'surah', 'juz', 'page', 'search'
    const [pageInput, setPageInput] = useState('');
    const navigate = useNavigate();

    // Verse Search State
    const [verseQuery, setVerseQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    // Search Scope State
    const [searchScope, setSearchScope] = useState('translation'); // 'translation', 'arabic', 'transliteration'
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [searchError, setSearchError] = useState(null);

    const filteredSurahs = surahData.filter(surah =>
        surah.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        surah.arabicName.includes(searchTerm) ||
        surah.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
        surah.number.toString() === searchTerm
    );

    // Filter Juz based on search? Or just list all 30?
    // Juz list is small enough to just show all 30.
    const juzList = Array.from({ length: 30 }, (_, i) => i + 1);

    useEffect(() => {
        if (currentSurah && (persistent || isSurahListOpen) && activeTab === 'surah') {
            const activeElement = document.querySelector(`.surah-item[data-surah="${currentSurah}"]`);
            if (activeElement) {
                // Short timeout to ensure render
                setTimeout(() => {
                    activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
        }
    }, [currentSurah, persistent, isSurahListOpen, activeTab]);

    const handleSelect = (surahNumber, ayahNumber = null) => {
        onSurahSelect(surahNumber, ayahNumber);
        if (!persistent || window.innerWidth < 1280) {
            toggleSurahList();
        }
    };

    const handleJuzSelect = (juzNumber) => {
        const startSurah = JUZ_START_SURAHS[juzNumber];
        if (startSurah) {
            handleSelect(startSurah);
        }
    };

    const handlePageSubmit = (e) => {
        e.preventDefault();
        const pageNum = parseInt(pageInput);
        if (pageNum >= 1 && pageNum <= 604) {
            const mapping = pageMapping[pageNum];
            if (mapping && mapping.start) {
                navigate(`/quran/${mapping.start.surah}?page=${pageNum}`);
                if (!persistent || window.innerWidth < 1280) {
                    toggleSurahList();
                }
            }
        }
    };

    // Verse Search Handler
    const handleVerseSearch = async (e) => {
        e.preventDefault();
        if (!verseQuery.trim()) return;

        // Reset error
        setSearchError(null);

        // Validation for Transliteration
        if (searchScope === 'transliteration') {
            if (!selectedTransliteration || selectedTransliteration === 'none') {
                setSearchError({
                    message: "No transliteration selected. Please choose one in settings.",
                    action: "Open Settings",
                    actionHandler: () => { toggleSettings(); }
                });
                return;
            }
        }

        setIsSearching(true);
        setHasSearched(true);

        try {
            let results;

            if (searchScope === 'arabic') {
                // Search Arabic
                // Use normalizeEditionId logic if needed, but 'quran-uthmani' is standard
                const scriptId = selectedScript || 'quran-uthmani';
                results = await quranServiceV2.search(verseQuery.trim(), { edition: scriptId, type: 'arabic', limit: 50 });
            } else if (searchScope === 'transliteration') {
                // Search Transliteration
                const transId = selectedTransliteration.replace('.', '-'); // naming convention check
                // Folder logic: 'transliterations' (plural) according to my file check
                results = await quranServiceV2.search(verseQuery.trim(), { edition: transId, type: 'transliterations', limit: 50 });
            } else {
                // Search Translation (Default)
                // Normalize ID: replace dots with dashes for V2 paths (e.g. en.sahih -> en-sahih)
                const translationId = selectedTranslation ? selectedTranslation.replace('.', '-') : 'en-sahih';
                results = await quranServiceV2.search(verseQuery.trim(), { edition: translationId, type: 'translations', limit: 50 });
            }

            setSearchResults(results);
        } catch (error) {
            console.error("Search failed:", error);
            setSearchResults([]);
            setSearchError({
                message: "Search failed. Please try again later.",
                action: null
            });
        } finally {
            setIsSearching(false);
        }
    };

    const className = [
        'surah-sidebar',
        persistent ? 'persistent' : '',
        isSurahListOpen ? 'open' : ''
    ].filter(Boolean).join(' ');

    const getPlaceholder = () => {
        if (searchScope === 'arabic') return "Search Arabic Text...";
        if (searchScope === 'transliteration') return "Search Transliteration...";
        return "Search Translation...";
    };

    return (
        <aside className={className}>
            <div className="surah-header">
                <div className="header-top">
                    <h3>Quran Navigation</h3>
                    <button className="close-btn" onClick={toggleSurahList} aria-label="Close ">
                        <X size={18} />
                    </button>
                </div>

                <div className="sidebar-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'surah' ? 'active' : ''}`}
                        onClick={() => setActiveTab('surah')}
                    >
                        Surah
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'juz' ? 'active' : ''}`}
                        onClick={() => setActiveTab('juz')}
                    >
                        Juz
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'page' ? 'active' : ''}`}
                        onClick={() => setActiveTab('page')}
                    >
                        Page
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`}
                        onClick={() => setActiveTab('search')}
                    >
                        Search
                    </button>
                </div>
            </div>

            {activeTab === 'surah' && (
                <>
                    <div className="surah-search">
                        <input
                            type="text"
                            placeholder="Search Surah..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <ul className="surah-list">
                        {filteredSurahs.map(surah => (
                            <li
                                key={surah.number}
                                data-surah={surah.number}
                                className={`surah-item ${currentSurah === surah.number ? 'active' : ''}`}
                                onClick={() => handleSelect(surah.number)}
                            >
                                <span className="surah-number">{surah.number}</span>
                                <div className="surah-info">
                                    <span className="surah-name">{surah.name}</span>
                                    <div className="surah-arabic-container">
                                        <img
                                            src={`/fonts/Tuluth/Vector-${surah.number - 1}.svg`}
                                            alt={surah.arabicName}
                                            className="surah-vector-sidebar"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                if (e.target.nextSibling) e.target.nextSibling.style.display = 'block';
                                            }}
                                        />
                                        <span className="surah-arabic" style={{ display: 'none' }}>{surah.arabicName}</span>
                                    </div>
                                </div>
                                <div className="surah-meta">
                                    <span className="surah-ayahs">{surah.ayahs} Ayahs</span>
                                    <span className="surah-juz">Juz {surah.juz.length > 1 ? `${surah.juz[0]}-${surah.juz[surah.juz.length - 1]}` : surah.juz[0]}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </>
            )}

            {activeTab === 'juz' && (
                <div className="juz-list">
                    {juzList.map(juz => (
                        <div key={juz} className="juz-item" onClick={() => handleJuzSelect(juz)}>
                            <span className="juz-number">{toArabicNumerals(juz)}</span>
                            <span className="juz-label">Juz {juz}</span>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'page' && (
                <div className="page-nav-container">
                    <h3>Go to Page</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                        Enter page number (1-604)
                    </p>
                    <form onSubmit={handlePageSubmit} className="page-input-wrapper">
                        <input
                            type="number"
                            min="1"
                            max="604"
                            className="page-input"
                            value={pageInput}
                            onChange={(e) => setPageInput(e.target.value)}
                        />
                        <button type="submit" className="page-go-btn">Go</button>
                    </form>
                    <p style={{ marginTop: '2rem', fontSize: '0.75rem', opacity: 0.7 }}>
                        <i>Mapping data coming soon</i>
                    </p>
                </div>
            )}

            {activeTab === 'search' && (
                <>
                    <div className="surah-search">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <form onSubmit={handleVerseSearch} style={{ display: 'flex', gap: '0.5rem' }}>
                                <div style={{ position: 'relative', flex: 1 }}>
                                    <input
                                        type="text"
                                        placeholder={getPlaceholder()}
                                        value={verseQuery}
                                        onChange={(e) => {
                                            setVerseQuery(e.target.value);
                                            setHasSearched(false); // Reset status on type
                                            setSearchError(null);
                                        }}
                                        style={{ width: '100%', paddingRight: '4.5rem' }}
                                    />

                                    <div style={{
                                        position: 'absolute',
                                        right: '0.5rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem'
                                    }}>
                                        {/* Filter Button */}
                                        <button
                                            type="button"
                                            onClick={() => setShowFilterMenu(!showFilterMenu)}
                                            style={{
                                                background: searchScope !== 'translation' ? 'var(--color-primary-light)' : 'none',
                                                border: 'none',
                                                color: searchScope !== 'translation' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                                cursor: 'pointer',
                                                padding: '0.25rem',
                                                borderRadius: '0.25rem',
                                                display: 'flex'
                                            }}
                                            title="Search Options"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                                        </button>

                                        {/* Search Submit Button */}
                                        <button
                                            type="submit"
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: 'var(--color-text-muted)',
                                                cursor: 'pointer',
                                                padding: '0.25rem',
                                                display: 'flex'
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                        </button>
                                    </div>
                                </div>
                            </form>

                            {/* Filter Menu Popover */}
                            {showFilterMenu && (
                                <div style={{
                                    background: 'var(--color-bg-card)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: '0.5rem',
                                    padding: '0.5rem',
                                    boxShadow: 'var(--shadow-md)',
                                    zIndex: 10
                                }}>
                                    <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-muted)' }}>SEARCH IN:</p>

                                    <div
                                        onClick={() => { setSearchScope('translation'); setShowFilterMenu(false); }}
                                        style={{
                                            padding: '0.5rem',
                                            fontSize: '0.85rem',
                                            cursor: 'pointer',
                                            borderRadius: '0.25rem',
                                            background: searchScope === 'translation' ? 'var(--color-bg-main)' : 'transparent',
                                            color: searchScope === 'translation' ? 'var(--color-primary)' : 'var(--color-text-main)',
                                            marginBottom: '0.25rem'
                                        }}
                                    >
                                        Translation <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>({selectedTranslation?.replace('.', '-') || 'en-sahih'})</span>
                                    </div>

                                    <div
                                        onClick={() => { setSearchScope('transliteration'); setShowFilterMenu(false); }}
                                        style={{
                                            padding: '0.5rem',
                                            fontSize: '0.85rem',
                                            cursor: 'pointer',
                                            borderRadius: '0.25rem',
                                            background: searchScope === 'transliteration' ? 'var(--color-bg-main)' : 'transparent',
                                            color: searchScope === 'transliteration' ? 'var(--color-primary)' : 'var(--color-text-main)',
                                            marginBottom: '0.25rem'
                                        }}
                                    >
                                        Transliteration <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>({selectedTransliteration === 'none' ? 'None' : selectedTransliteration})</span>
                                    </div>

                                    <div
                                        onClick={() => { setSearchScope('arabic'); setShowFilterMenu(false); }}
                                        style={{
                                            padding: '0.5rem',
                                            fontSize: '0.85rem',
                                            cursor: 'pointer',
                                            borderRadius: '0.25rem',
                                            background: searchScope === 'arabic' ? 'var(--color-bg-main)' : 'transparent',
                                            color: searchScope === 'arabic' ? 'var(--color-primary)' : 'var(--color-text-main)'
                                        }}
                                    >
                                        Arabic Script <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>({selectedScript || 'quran-uthmani'})</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="search-results-list" style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
                        {searchError && (
                            <div style={{ padding: '1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '0.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
                                {searchError.message}
                                {searchError.action && (
                                    <button
                                        onClick={searchError.actionHandler}
                                        style={{
                                            display: 'block',
                                            margin: '0.5rem auto 0',
                                            padding: '0.3rem 0.8rem',
                                            borderRadius: '0.3rem',
                                            background: '#991b1b',
                                            color: 'white',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: '0.8rem'
                                        }}
                                    >
                                        {searchError.action}
                                    </button>
                                )}
                            </div>
                        )}

                        {isSearching && (
                            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                <div className="spinner" style={{ margin: '0 auto 1rem', width: '24px', height: '24px', border: '2px solid var(--color-border)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }}></div>
                                Searching {searchScope === 'arabic' ? 'Arabic' : searchScope === 'transliteration' ? 'Transliteration' : 'Translations'}...
                                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                            </div>
                        )}

                        {!isSearching && hasSearched && searchResults.length === 0 && !searchError && (
                            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                                No results found for &quot;{verseQuery}&quot;.
                                {searchScope === 'arabic' ?
                                    <><br />Ensure you are typing in Arabic.</> :
                                    searchScope === 'transliteration' ?
                                        <><br />Try different transliteration spellings.</> :
                                        <><br />Try a different keyword.</>
                                }
                            </div>
                        )}

                        {!isSearching && !hasSearched && !searchError && (
                            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.9rem', opacity: 0.8 }}>
                                <p style={{ marginBottom: '0.5rem' }}>Type a word and press <b>Enter</b></p>
                                <p style={{ fontSize: '0.8rem' }}>
                                    Searching: <b>{searchScope === 'arabic' ? 'Arabic Text' : searchScope === 'transliteration' ? 'Transliteration' : 'Translation'}</b>
                                </p>
                            </div>
                        )}

                        {searchResults.map((result, idx) => (
                            <div
                                key={idx}
                                className="search-result-item"
                                onClick={() => handleSelect(result.surah, result.ayah)}
                                style={{
                                    padding: '0.75rem',
                                    marginBottom: '0.5rem',
                                    background: 'var(--color-bg-card)',
                                    borderRadius: '0.5rem',
                                    border: '1px solid var(--color-border)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    hover: { borderColor: 'var(--color-primary)' },
                                    textAlign: searchScope === 'arabic' ? 'right' : 'left',
                                    direction: searchScope === 'arabic' ? 'rtl' : 'ltr'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', direction: 'ltr' }}>
                                    <span style={{ fontWeight: '600', fontSize: '0.85rem', color: 'var(--color-primary)' }}>
                                        {result.surahName} {result.surah}:{result.ayah}
                                    </span>
                                </div>
                                <p style={{
                                    margin: 0,
                                    fontSize: searchScope === 'arabic' ? '1.2rem' : '0.85rem',
                                    color: 'var(--color-text-main)',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    lineHeight: '1.6',
                                    fontFamily: searchScope === 'arabic' ? 'var(--font-quran)' : 'inherit'
                                }}>
                                    {result.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </aside>
    );
};

SurahListSidebar.propTypes = {
    onSurahSelect: PropTypes.func.isRequired,
    currentSurah: PropTypes.number,
    persistent: PropTypes.bool
};

export default SurahListSidebar;
