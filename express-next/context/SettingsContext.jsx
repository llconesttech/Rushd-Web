/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
    const [isSurahListOpen, setIsSurahListOpen] = useState(false); // Left Sidebar
    const [isSettingsOpen, setIsSettingsOpen] = useState(true); // Right Sidebar (Default open as per screenshot)

    // Theme (dark/light) - persisted to localStorage
    const [theme, setTheme] = useState(() => {
        if (typeof window === 'undefined') return 'dark';
        return localStorage.getItem('rushdTheme') || 'dark';
    });

    // Apply theme to document root
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('rushdTheme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

    // Quran Script Style (default to Tajweed or user preference)
    const [selectedScript, setSelectedScript] = useState('quran-tajweed');

    // Language/Translation (default En-Sahih)
    const [selectedTranslation, setSelectedTranslation] = useState('en.sahih');

    // Tafsir (default none — independent from translation)
    const [selectedTafsir, setSelectedTafsir] = useState('none');

    // Audio Reciter (default to Alafasy or user preference)
    const [selectedReciter, setSelectedReciter] = useState('mishary_rashid');

    // UI Style (style1 or style2)
    const [uiStyle, setUiStyle] = useState('style1');

    // Arabic Font (for non-IndoPak scripts) - default Me Quran
    const [selectedArabicFont, setSelectedArabicFont] = useState('mequran');

    // Tajweed Tooltips
    const [showTajweedTooltips, setShowTajweedTooltips] = useState(true);

    // Transliteration (default none)
    const [selectedTransliteration, setSelectedTransliteration] = useState('none');

    // Shan-e-Nuzool Settings
    const [selectedShanENuzool, setSelectedShanENuzool] = useState('en-al-wahidi');

    const toggleSurahList = () => setIsSurahListOpen(!isSurahListOpen);
    const toggleSettings = () => setIsSettingsOpen(!isSettingsOpen);

    const value = {
        theme,
        toggleTheme,
        isSurahListOpen,
        toggleSurahList,
        isSettingsOpen,
        toggleSettings,
        selectedScript,
        setSelectedScript,
        selectedTranslation,
        setSelectedTranslation,
        selectedTafsir,
        setSelectedTafsir,
        selectedTransliteration,
        setSelectedTransliteration,
        selectedReciter,
        setSelectedReciter,
        uiStyle,
        setUiStyle,
        selectedArabicFont,
        setSelectedArabicFont,
        showTajweedTooltips,
        setShowTajweedTooltips,
        selectedShanENuzool,
        setSelectedShanENuzool
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};

SettingsProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
