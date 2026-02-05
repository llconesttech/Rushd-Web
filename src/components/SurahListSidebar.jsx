import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { surahData } from '../data/quranData';
import './SurahListSidebar.css';

const SurahListSidebar = ({ onSurahSelect, currentSurah, persistent = false }) => {
    const { isSurahListOpen, toggleSurahList } = useSettings();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredSurahs = surahData.filter(surah =>
        surah.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        surah.arabicName.includes(searchTerm) ||
        surah.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
        surah.number.toString() === searchTerm
    );

    // Auto-scroll to active surah
    React.useEffect(() => {
        if (currentSurah && persistent) {
            const activeElement = document.querySelector(`.surah-item[data-surah="${currentSurah}"]`);
            if (activeElement) {
                activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [currentSurah, persistent]);

    if (!persistent && !isSurahListOpen) {
        return (
            <button className="surah-toggle-btn" onClick={toggleSurahList} title="Open Surah List">
                📖
            </button>
        );
    }

    return (
        <aside className={`surah-sidebar ${persistent ? 'persistent' : ''}`}>
            <div className="surah-header">
                <h3>Surahs</h3>
                {!persistent && <button className="close-btn" onClick={toggleSurahList}>×</button>}
            </div>

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
                        onClick={() => onSurahSelect(surah.number)}
                    >
                        <span className="surah-number">{surah.number}</span>
                        <div className="surah-info">
                            <span className="surah-name">{surah.name}</span>
                            <span className="surah-arabic">{surah.arabicName}</span>
                        </div>
                        <div className="surah-meta">
                            <span className="surah-ayahs">{surah.ayahs} Ayahs</span>
                            <span className="surah-juz">Juz {surah.juz.length > 1 ? `${surah.juz[0]}-${surah.juz[surah.juz.length - 1]}` : surah.juz[0]}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default SurahListSidebar;
