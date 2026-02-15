
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft, Loader, Settings } from 'lucide-react';
import { surahData } from '../data/quranData';
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
        selectedScript,
        selectedTranslation,
        selectedTafsir,
        selectedArabicFont,
        isSettingsOpen,
        toggleSettings
    } = useSettings();

    // Fetch Standard Quran Data (Arabic + Translation + Tafsir)
    const { data: quranContent, loading: loadingQuran, error: errorQuran } = useSurahDetail(
        selectedSurahNum.toString(),
        'none',
        selectedScript,
        selectedTranslation,
        selectedTafsir
    );

    // Load Shan-e-Nuzool Data
    useEffect(() => {
        const fetchShanData = async () => {
            setLoadingShan(true);
            try {
                const response = await fetch('/data/quran/v2/shan-e-nuzool/en-al-wahidi.json');
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
                console.error("Failed to load Shan-e-Nuzool data", error);
                setShanData({});
            } finally {
                setLoadingShan(false);
            }
        };

        fetchShanData();
    }, [selectedSurahNum]);

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

    const hasShanData = Object.keys(shanData).length > 0;
    const isLoading = loadingShan || loadingQuran;

    return (
        <div className="shan-e-nuzool-page" style={{ '--arabic-font': getArabicFontFamily() }}>
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
                                <strong>Source:</strong> Asbab Al-Nuzul by Al-Wahidi
                                {Object.keys(shanData).length === 0 && <span className="no-data-badge"> (No entries for this Surah)</span>}
                            </p>
                        </div>

                        <div className="ayahs-list">
                            {quranContent?.ayahs.map((ayah, index) => {
                                const contextText = shanData[ayah.numberInSurah];

                                // Only show Ayahs that HAVE Shan-e-Nuzool context? 
                                // User said: "Arabic ayah will be shown and underneath shan e nuzul will be shown"
                                // If we only show relevant ones, use filter. If we show all, just map.
                                // Let's show all so the context is clear, but highlight ones with Shan-e-Nuzool.

                                return (
                                    <div key={ayah.number} className={`ayah-card ${contextText ? 'has-context' : ''}`} id={`ayah-${ayah.numberInSurah}`}>
                                        <div className="ayah-header-badge">
                                            <span className="ayah-num-badge">{currentSurah.number}:{ayah.numberInSurah}</span>
                                        </div>

                                        {/* Arabic Text */}
                                        <p className={`ayah-arabic arabic-text font-${selectedArabicFont}`}
                                            style={{ fontFamily: getArabicFontFamily() }}>
                                            {ayah.text}
                                        </p>

                                        {/* Translation */}
                                        <p className="ayah-translation">
                                            {ayah.translation}
                                        </p>

                                        {/* Tafsir (if selected) */}
                                        {ayah.tafsir && (
                                            <div className="tafsir-box">
                                                <div className="tafsir-label">
                                                    <BookOpen size={14} /> Tafsir
                                                </div>
                                                <p className="tafsir-text">{ayah.tafsir}</p>
                                            </div>
                                        )}

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
