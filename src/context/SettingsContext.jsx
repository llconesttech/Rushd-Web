import React, { createContext, useContext, useState } from 'react';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
    const [isSurahListOpen, setIsSurahListOpen] = useState(false); // Left Sidebar
    const [isSettingsOpen, setIsSettingsOpen] = useState(true); // Right Sidebar (Default open as per screenshot)

    // Quran Script Style (default to Tajweed or user preference)
    const [selectedScript, setSelectedScript] = useState('quran-tajweed');

    // Language/Translation (default En-Sahih)
    const [selectedTranslation, setSelectedTranslation] = useState('en.sahih');

    // Audio Reciter (default to Alafasy or user preference)
    const [selectedReciter, setSelectedReciter] = useState('ar.alafasy');

    // UI Style (style1 or style2)
    const [uiStyle, setUiStyle] = useState('style1');

    const toggleSurahList = () => setIsSurahListOpen(!isSurahListOpen);
    const toggleSettings = () => setIsSettingsOpen(!isSettingsOpen);

    const value = {
        isSurahListOpen,
        toggleSurahList,
        isSettingsOpen,
        toggleSettings,
        selectedScript,
        setSelectedScript,
        selectedTranslation,
        setSelectedTranslation,
        selectedReciter,
        setSelectedReciter,
        uiStyle,
        setUiStyle,
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};
