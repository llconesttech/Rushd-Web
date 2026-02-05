import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { quranScripts, translations, reciters, languageList } from '../data/quranData';
import './SettingsSidebar.css';

const SettingsSidebar = () => {
    const {
        isSettingsOpen,
        toggleSettings,
        selectedScript,
        setSelectedScript,
        selectedTranslation,
        setSelectedTranslation,
        selectedReciter,
        setSelectedReciter
    } = useSettings();

    const [searchTerm, setSearchTerm] = useState('');
    const [activeSection, setActiveSection] = useState('quran'); // quran, translations, reciters

    // Filter translations by search term
    const filteredTranslations = Object.entries(translations).filter(([key, value]) =>
        value.english_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        value.native_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        languageList[value.language_code]?.english_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Group translations by language
    const groupedTranslations = {};
    filteredTranslations.forEach(([key, value]) => {
        const langCode = value.language_code;
        if (!groupedTranslations[langCode]) {
            groupedTranslations[langCode] = {
                name: languageList[langCode]?.english_name || langCode,
                nativeName: languageList[langCode]?.native_name || '',
                items: []
            };
        }
        groupedTranslations[langCode].items.push({ key, ...value });
    });

    if (!isSettingsOpen) {
        return (
            <button className="settings-toggle-btn" onClick={toggleSettings} title="Open Settings">
                ⚙️
            </button>
        );
    }

    return (
        <aside className="settings-sidebar">
            <div className="settings-header">
                <h3>Settings</h3>
                <button className="close-btn" onClick={toggleSettings}>×</button>
            </div>

            {/* Section Tabs */}
            <div className="section-tabs">
                <button
                    className={`tab ${activeSection === 'quran' ? 'active' : ''}`}
                    onClick={() => setActiveSection('quran')}
                >
                    Quran
                </button>
                <button
                    className={`tab ${activeSection === 'translations' ? 'active' : ''}`}
                    onClick={() => setActiveSection('translations')}
                >
                    Languages
                </button>
                <button
                    className={`tab ${activeSection === 'reciters' ? 'active' : ''}`}
                    onClick={() => setActiveSection('reciters')}
                >
                    Reciters
                </button>
            </div>

            <div className="settings-content">
                {/* Quran Scripts Section */}
                {activeSection === 'quran' && (
                    <section className="settings-section">
                        <h4>Arabic Script Style</h4>
                        <ul className="settings-list">
                            {Object.entries(quranScripts).map(([key, value]) => (
                                <li
                                    key={key}
                                    className={`settings-item ${selectedScript === key ? 'active' : ''}`}
                                    onClick={() => setSelectedScript(key)}
                                >
                                    <span className="item-name">{value.english_name}</span>
                                    {value.native_name && <span className="native-name">{value.native_name}</span>}
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Translations Section */}
                {activeSection === 'translations' && (
                    <section className="settings-section">
                        <input
                            type="text"
                            placeholder="Search translations..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="translation-count">
                            {Object.keys(translations).length} translations available
                        </div>

                        <div className="translations-grouped">
                            {Object.entries(groupedTranslations)
                                .sort((a, b) => a[1].name.localeCompare(b[1].name))
                                .map(([langCode, group]) => (
                                    <div key={langCode} className="language-group">
                                        <div className="language-header">
                                            {group.name}
                                            {group.nativeName && <span className="native-lang"> ({group.nativeName})</span>}
                                        </div>
                                        <ul className="settings-list">
                                            {group.items.map(item => (
                                                <li
                                                    key={item.key}
                                                    className={`settings-item ${selectedTranslation === item.key ? 'active' : ''}`}
                                                    onClick={() => setSelectedTranslation(item.key)}
                                                >
                                                    <span className="item-name">{item.english_name}</span>
                                                    {item.native_name && <span className="native-name">{item.native_name}</span>}
                                                    <span className="item-type">{item.type}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                        </div>
                    </section>
                )}

                {/* Reciters Section */}
                {activeSection === 'reciters' && (
                    <section className="settings-section">
                        <h4>Audio Reciters</h4>
                        <ul className="settings-list reciters-list">
                            {Object.entries(reciters).map(([key, value]) => (
                                <li
                                    key={key}
                                    className={`settings-item ${selectedReciter === key ? 'active' : ''}`}
                                    onClick={() => setSelectedReciter(key)}
                                >
                                    <span className="item-name">{value.english_name}</span>
                                    <span className="item-type">{value.type}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>
        </aside>
    );
};

export default SettingsSidebar;
