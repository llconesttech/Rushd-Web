import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { X, MessageCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { quranScripts, translations, languageList, reciters, shanENuzoolList } from '../data/quranData';
import './SettingsSidebar.css';

import { useLocation } from 'react-router-dom';

const SettingsSidebar = ({ persistent = false }) => {
    const location = useLocation();
    const isShanENuzool = location.pathname.startsWith('/shan-e-nuzool');

    const {
        isSettingsOpen,
        toggleSettings,
        selectedScript,
        setSelectedScript,
        selectedTranslation,
        setSelectedTranslation,
        selectedTafsir,
        setSelectedTafsir,
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
    } = useSettings();

    const [searchTerm, setSearchTerm] = useState('');

    // Default to 'translations' if on Shan-e-Nuzool page, else 'quran'
    const [activeSection, setActiveSection] = useState(isShanENuzool ? 'translations' : 'quran');

    // Update active section if path changes (e.g. navigating to/from Shan-e-Nuzool)
    useEffect(() => {
        if (isShanENuzool) setActiveSection('translations');
    }, [isShanENuzool]);

    const isIndoPak = selectedScript === 'quran-indopak' || selectedScript === 'quran-indopak-tajweed';
    const isTajweed = selectedScript === 'quran-tajweed' || selectedScript === 'quran-indopak-tajweed';

    const fontOptions = [
        { key: 'amiri', label: 'أميري', english: 'Amiri', family: "'Amiri Quran', serif" },
        { key: 'scheherazade', label: 'شهرزاد', english: 'Scheherazade', family: "'Scheherazade', serif" },
        { key: 'alqalam', label: 'القلم', english: 'Al Qalam', family: "'Al Qalam', serif" },
        { key: 'mequran', label: 'عثماني', english: 'Uthmani', family: "'Me Quran', serif" },
        { key: 'saleem', label: 'سليم', english: 'Saleem', family: "'Saleem', serif" },
    ];

    const className = [
        'settings-sidebar',
        persistent ? 'persistent' : '',
        isSettingsOpen ? 'open' : ''
    ].filter(Boolean).join(' ');

    const tabs = isShanENuzool
        ? ['translations', 'shan-e-nuzool']
        : ['quran', 'translations', 'tafsir', 'reciters'];

    return (
        <aside className={className}>
            <div className="settings-header">
                <h3>Settings</h3>
                <button className="close-btn" onClick={toggleSettings} aria-label="Close settings">
                    <X size={18} />
                </button>
            </div>

            <div className="section-tabs">
                {tabs.map(section => (
                    <button
                        key={section}
                        className={`tab ${activeSection === section ? 'active' : ''}`}
                        onClick={() => setActiveSection(section)}
                        style={{ flex: isShanENuzool ? 1 : undefined }}
                    >
                        {section === 'quran' ? 'Quran' :
                            section === 'translations' ? 'Languages' :
                                section === 'shan-e-nuzool' ? 'Context' :
                                    section === 'tafsir' ? 'Tafsir' : 'Reciters'}
                    </button>
                ))}
            </div>

            <div className="settings-content">
                {/* Quran Scripts */}
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

                        <h4 style={{ marginTop: '1rem' }}>Arabic Font</h4>
                        {isIndoPak ? (
                            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                                IndoPak script uses a fixed Nastaleeq font.
                            </p>
                        ) : (
                            <div className="font-selector-grid">
                                {fontOptions.map(font => (
                                    <button
                                        key={font.key}
                                        className={`font-selector-btn ${selectedArabicFont === font.key ? 'active' : ''}`}
                                        style={{ fontFamily: font.family }}
                                        onClick={() => setSelectedArabicFont(font.key)}
                                    >
                                        <span className="font-arabic-label">{font.label}</span>
                                        <span className="font-english-label">{font.english}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Tajweed Tooltips Toggle */}
                        {isTajweed && (
                            <div className="tajweed-toggle-row">
                                <div className="tajweed-toggle-label">
                                    <MessageCircle size={18} color="var(--color-text-muted)" />
                                    <span>Tajweed Tooltips</span>
                                </div>
                                <label className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        checked={showTajweedTooltips}
                                        onChange={(e) => setShowTajweedTooltips(e.target.checked)}
                                    />
                                    <span className="toggle-slider" />
                                </label>
                            </div>
                        )}

                        <h4 style={{ marginTop: '1rem' }}>UI Design Style</h4>
                        <div className="ui-style-group">
                            <button
                                className={`ui-style-btn ${uiStyle === 'style1' ? 'active' : ''}`}
                                onClick={() => setUiStyle('style1')}
                            >
                                النمط ١
                            </button>
                            <button
                                className={`ui-style-btn ${uiStyle === 'style2' ? 'active' : ''}`}
                                onClick={() => setUiStyle('style2')}
                            >
                                النمط ٢
                            </button>
                        </div>
                    </section>
                )}



                {/* Translations, Tafsir */}
                {(activeSection === 'translations' || activeSection === 'tafsir') && (
                    <section className="settings-section">
                        <input
                            type="text"
                            placeholder={
                                activeSection === 'tafsir' ? "Search tafsirs..." : "Search translations..."
                            }
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        <div className="translations-grouped">
                            {(() => {
                                const filteredItems = Object.entries(translations).filter(([, value]) => {
                                    const matchesSearch =
                                        value.english_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        value.native_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        languageList[value.language_code]?.english_name?.toLowerCase().includes(searchTerm.toLowerCase());

                                    if (!matchesSearch) return false;

                                    if (activeSection === 'tafsir') return value.type === 'tafsir';
                                    return value.type === 'translation';
                                });

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
                                                        className={`settings-item ${(() => {
                                                            if (activeSection === 'tafsir') return selectedTafsir === item.key;
                                                            return selectedTranslation === item.key;
                                                        })() ? 'active' : ''}`}
                                                        onClick={() => {
                                                            if (activeSection === 'tafsir') {
                                                                setSelectedTafsir(selectedTafsir === item.key ? 'none' : item.key);
                                                            } else {
                                                                setSelectedTranslation(selectedTranslation === item.key ? 'none' : item.key);
                                                            }
                                                        }}
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

                {/* Shan-e-Nuzool Context */}
                {activeSection === 'shan-e-nuzool' && (
                    <section className="settings-section">
                        <h4>Context Source</h4>
                        <ul className="settings-list">
                            {Object.entries(shanENuzoolList).map(([key, value]) => (
                                <li
                                    key={key}
                                    className={`settings-item ${selectedShanENuzool === key ? 'active' : ''}`}
                                    onClick={() => setSelectedShanENuzool(selectedShanENuzool === key ? 'none' : key)}
                                >
                                    <span className="item-name">{value.english_name}</span>
                                    {value.native_name && <span className="native-name">{value.native_name}</span>}
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Reciters */}
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
                                    <span className="item-type">{value.style || value.type}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>
        </aside>
    );
};

SettingsSidebar.propTypes = {
    persistent: PropTypes.bool
};

export default SettingsSidebar;
