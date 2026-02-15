
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft, Loader, Settings } from 'lucide-react';
import { surahData, translations } from '../data/quranData';
import { useSurahDetail } from '../hooks/useQuran';
import { useSettings } from '../context/SettingsContext';
import './ShanENuzool.css';

const ShanENuzool = () => {
    const { surahId } = useParams();
    const navigate = useNavigate();
    const [shanData, setShanData] = useState({});
    const [loadingShan, setLoadingShan] = useState(true);

    // Default to Surah 1 if no ID params
    const selectedSurahNum = surahId ? parseInt(surahId) : 1;
    const currentSurah = surahData.find(s => s.number === selectedSurahNum);

    // Get Settings for Quran Text
    const {
        selectedTranslation,
        isSettingsOpen,
        toggleSettings
    } = useSettings();

    // Determine Language for Shan-e-Nuzool
    const langCode = translations[selectedTranslation]?.language_code || 'en';

    // Force IndoPak Script for this page
    const FORCED_SCRIPT = 'quran-indopak';
    const FORCED_FONT = 'var(--font-arabic-indopak)';

    // Fetch Standard Quran Data (Arabic + Translation Only, No Tafsir)
    const { data: quranContent, loading: loadingQuran, error: errorQuran } = useSurahDetail(
        selectedSurahNum.toString(),
        'none',
        FORCED_SCRIPT, // Force IndoPak
        selectedTranslation,
        'none' // No Tafsir
    );

    // Load Shan-e-Nuzool Data
    useEffect(() => {
        const fetchShanData = async () => {
            setLoadingShan(true);
            try {
                // Dynamic source based on language
                // Currently only 'en' is fully supported with 'en-al-wahidi.json'
                // For others, we'd look for `${langCode}-shan-e-nuzool.json`
                let sourceUrl = '/data/quran/v2/shan-e-nuzool/en-al-wahidi.json';

                if (langCode !== 'en') {
                    // Try to load language specific file if it exists (e.g. bn-shan-e-nuzool.json)
                    // For now, this will likely 404 for non-en, which is expected behavior until data is added
                    sourceUrl = `/data/quran/v2/shan-e-nuzool/${langCode}-shan-e-nuzool.json`;
                }

                // Temporary fallback for dev: if 'bn', maybe fallback to english if bn missing?
                // User said "language wise shan-e-nuzuls". Let's try strict loading.

                const response = await fetch(sourceUrl);
                if (!response.ok) throw new Error('Language data not found');

                const json = await response.json();

                // Get data for selected surah
                const surahContent = json[selectedSurahNum.toString()];

                // Map to object for O(1) lookup by Ayah number
                const dataMap = {};
                if (surahContent && surahContent.ayahs) {
                    surahContent.ayahs.forEach(item => {
                        dataMap[item.ayah] = item.text;
                    });
                }
                setShanData(dataMap);
            } catch (error) {
                console.warn(`Failed to load Shan-e-Nuzool data for ${langCode}`, error);
                // Fallback to empty (or maybe English?)
                // setShanData({}); // Clear data if not found

                // OPTIONAL: Fallback to English if current lang fails?
                // For now, let's just clear it to show "No entries" so user knows content is missing for this lang.
                setShanData({});
            } finally {
                setLoadingShan(false);
            }
        };

        fetchShanData();
    }, [selectedSurahNum, langCode]);

    const isLoading = loadingShan || loadingQuran;

    return (
        <div className="shan-e-nuzool-page" style={{ '--arabic-font': FORCED_FONT }}>
            <header className="page-header sticky-header">
                <div className="header-content">
                    <Link to="/" className="back-button">
                        <ArrowLeft size={24} />
                        <span>Home</span>
                    </Link>
                    <div className="header-titles">
                        <h1>{currentSurah?.name}</h1>
                        <p>Shan-e-Nuzool • {currentSurah?.english_name}</p>
                    </div>
                    <button className={`settings-trigger ${isSettingsOpen ? 'active' : ''}`} onClick={toggleSettings}>
                        <Settings size={22} />
                    </button>
                </div>
            </header>

            <main className="details-view">
                {isLoading ? (
                    <div className="loading-state">
                        <Loader className="spin" /> Loading Surah Context...
                    </div>
                ) : (
                    <>
                        <div className="info-card">
                            <p className="source-citation">
                                <strong>Language:</strong> {langCode.toUpperCase()}
                                {Object.keys(shanData).length === 0 && <span className="no-data-badge"> (No entries found for this language)</span>}
                            </p>
                        </div>

                        <div className="ayahs-list">
                            {quranContent?.ayahs.map((ayah, index) => {
                                const contextText = shanData[ayah.numberInSurah];

                                return (
                                    <div key={ayah.number} className={`ayah-card ${contextText ? 'has-context' : ''}`} id={`ayah-${ayah.numberInSurah}`}>
                                        <div className="ayah-header-badge">
                                            <span className="ayah-num-badge">{currentSurah.number}:{ayah.numberInSurah}</span>
                                        </div>

                                        {/* Arabic Text - Wired to IndoPak */}
                                        <p className="ayah-arabic arabic-text indopak"
                                            style={{ fontFamily: FORCED_FONT }}>
                                            {ayah.text}
                                        </p>

                                        {/* Translation */}
                                        <p className="ayah-translation">
                                            {ayah.translation}
                                        </p>

                                        {/* Shan-e-Nuzool Context */}
                                        {contextText && (
                                            <div className="shan-context-box">
                                                <div className="context-label">
                                                    <BookOpen size={16} /> Context of Revelation
                                                </div>
                                                <p className="context-text">{contextText}</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default ShanENuzool;
