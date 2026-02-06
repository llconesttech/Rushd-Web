import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { quranScripts, translations, reciters, languageList } from '../data/quranData';
import './SettingsSidebar.css';

const SettingsSidebar = ({ persistent = false }) => {
    const {
        isSettingsOpen,
        toggleSettings,
        selectedScript,
        setSelectedScript,
        selectedTranslation,
        setSelectedTranslation,
        selectedReciter,
        setSelectedReciter,
        uiStyle,
        setUiStyle
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

    if (!persistent && !isSettingsOpen) {
        return (
            <button className="settings-toggle-btn" onClick={toggleSettings} title="Open Settings">
                ⚙️
            </button>
        );
    }

    return (
        <aside className={`settings-sidebar ${persistent ? 'persistent' : ''}`}>
            <div className="settings-header">
                <h3>Settings</h3>
                {!persistent && <button className="close-btn" onClick={toggleSettings}>×</button>}
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
                    className={`tab ${activeSection === 'tafsir' ? 'active' : ''}`}
                    onClick={() => setActiveSection('tafsir')}
                >
                    Tafsir
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

                        <h4 style={{ marginTop: '1.5rem' }}>UI Design Style</h4>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                            <button
                                className={`tab ${uiStyle === 'style1' ? 'active' : ''}`}
                                style={{
                                    flex: 1,
                                    padding: '0.5rem',
                                    borderRadius: '8px',
                                    border: '1px solid var(--color-border)',
                                    cursor: 'pointer',
                                    backgroundColor: uiStyle === 'style1' ? 'var(--color-primary)' : 'white',
                                    color: uiStyle === 'style1' ? 'white' : 'var(--color-text-main)'
                                }}
                                onClick={() => setUiStyle('style1')}
                            >
                                Style 1
                            </button>
                            <button
                                className={`tab ${uiStyle === 'style2' ? 'active' : ''}`}
                                style={{
                                    flex: 1,
                                    padding: '0.5rem',
                                    borderRadius: '8px',
                                    border: '1px solid var(--color-border)',
                                    cursor: 'pointer',
                                    backgroundColor: uiStyle === 'style2' ? 'var(--color-primary)' : 'white',
                                    color: uiStyle === 'style2' ? 'white' : 'var(--color-text-main)'
                                }}
                                onClick={() => setUiStyle('style2')}
                            >
                                Style 2
                            </button>
                        </div>
                    </section>
                )}

                {/* Translations & Tafsir Section */}
                {(activeSection === 'translations' || activeSection === 'tafsir') && (
                    <section className="settings-section">
                        <input
                            type="text"
                            placeholder={activeSection === 'tafsir' ? "Search tafsirs..." : "Search translations..."}
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        <div className="translations-grouped">
                            {(() => {
                                // Filter items based on active section and search term
                                const filteredItems = Object.entries(translations).filter(([key, value]) => {
                                    const matchesSearch =
                                        value.english_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        value.native_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        languageList[value.language_code]?.english_name?.toLowerCase().includes(searchTerm.toLowerCase());

                                    if (!matchesSearch) return false;

                                    if (activeSection === 'tafsir') {
                                        return value.type === 'tafsir';
                                    } else {
                                        return value.type !== 'tafsir';
                                    }
                                });

                                // Group by language
                                const groups = {};
                                filteredItems.forEach(([key, value]) => {
                                    const langCode = value.language_code;
                                    if (!groups[langCode]) {
                                        groups[langCode] = {
                                            name: languageList[langCode]?.english_name || langCode,
                                            nativeName: languageList[langCode]?.native_name || '',
                                            items: []
                                        };
                                    }
                                    groups[langCode].items.push({ key, ...value });
                                });

                                if (filteredItems.length === 0) {
                                    return <div className="no-results">No {activeSection} found.</div>;
                                }

                                return Object.entries(groups)
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
                                    ));
                            })()}
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
