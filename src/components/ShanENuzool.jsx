
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft, Loader, Settings } from 'lucide-react';
import { surahData, translations, shanENuzoolList } from '../data/quranData';
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
        toggleSettings,
        selectedShanENuzool
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
            if (selectedShanENuzool === 'none') {
                setShanData({});
                setLoadingShan(false);
                return;
            }

            setLoadingShan(true);
            try {
                // Dynamic source based on selected setting
                const sourceId = selectedShanENuzool || 'en-al-wahidi';
                let sourceUrl = `/data/quran/v2/shan-e-nuzool/${sourceId}.json`;

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
                console.warn(`Failed to load Shan-e-Nuzool data`, error);
                setShanData({});
            } finally {
                setLoadingShan(false);
            }
        };

        fetchShanData();
    }, [selectedSurahNum, selectedShanENuzool]);

    // We don't block UI on Quran text loading, only Shan-e-Nuzool loading
    // because the main purpose of this page is Shan-e-Nuzool
    const isLoading = loadingShan;

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
                                <strong>Source:</strong> {shanENuzoolList[selectedShanENuzool]?.english_name || selectedShanENuzool}
                                {Object.keys(shanData).length === 0 && <span className="no-data-badge"> (No entries found for this language)</span>}
                            </p>
                        </div>

                        <div className="ayahs-list">
                            {/* Use static Ayah count to drive list, allowing independence from quranContent loading/success */}
                            {Array.from({ length: currentSurah.ayahs }, (_, i) => i + 1).map((ayahNum) => {
                                const ayahIndex = ayahNum - 1;
                                const ayahData = quranContent?.ayahs?.[ayahIndex];
                                const contextText = shanData[ayahNum];

                                // Skip rendering if we have absolutely nothing (no text, no context)
                                // But usually we want to show numbers at least?
                                // Let's show card if we have ANY data or if we are just waiting

                                return (
                                    <div key={ayahNum} className={`ayah-card ${contextText ? 'has-context' : ''}`} id={`ayah-${ayahNum}`}>
                                        <div className="ayah-header-badge">
                                            <span className="ayah-num-badge">{currentSurah.number}:{ayahNum}</span>
                                        </div>

                                        {/* Arabic Text - Wired to IndoPak */}
                                        {ayahData?.text ? (
                                            <p className="ayah-arabic arabic-text indopak"
                                                style={{ fontFamily: FORCED_FONT }}>
                                                {ayahData.text}
                                            </p>
                                        ) : (
                                            !loadingQuran && <p className="text-muted text-center text-sm py-4">Arabic text unavailable</p>
                                        )}

                                        {/* Translation */}
                                        {selectedTranslation !== 'none' && (
                                            <p className="ayah-translation">
                                                {ayahData?.translation || (loadingQuran ? "Loading..." : "")}
                                            </p>
                                        )}

                                        {/* Shan-e-Nuzool Context */}
                                        {selectedShanENuzool !== 'none' && contextText && (
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
