import React, { useState } from 'react';
import { X } from 'lucide-react';
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

    React.useEffect(() => {
        if (currentSurah && (persistent || isSurahListOpen)) {
            const activeElement = document.querySelector(`.surah-item[data-surah="${currentSurah}"]`);
            if (activeElement) {
                activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [currentSurah, persistent, isSurahListOpen]);

    const handleSelect = (surahNumber) => {
        onSurahSelect(surahNumber);
        if (!persistent || window.innerWidth < 1280) {
            toggleSurahList();
        }
    };

    const className = [
        'surah-sidebar',
        persistent ? 'persistent' : '',
        isSurahListOpen ? 'open' : ''
    ].filter(Boolean).join(' ');

    return (
        <aside className={className}>
            <div className="surah-header">
                <h3>Surahs</h3>
                <button className="close-btn" onClick={toggleSurahList} aria-label="Close Surah list">
                    <X size={18} />
                </button>
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
                        onClick={() => handleSelect(surah.number)}
                    >
                        <span className="surah-number">{surah.number}</span>
                        <div className="surah-info">
                            <span className="surah-name">{surah.name}</span>
                            <span className="surah-arabic">{surah.arabicName}</span>
                        </div>
                        <div className="surah-meta">
                            <span className="surah-ayahs">{surah.ayahs} Ayahs</span>
                            {surah.rukus > 1 && <span className="surah-rukus">{surah.rukus} Rukus</span>}
                            <span className="surah-juz">Juz {surah.juz.length > 1 ? `${surah.juz[0]}-${surah.juz[surah.juz.length - 1]}` : surah.juz[0]}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default SurahListSidebar;
