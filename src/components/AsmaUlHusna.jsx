/* eslint-disable */
import React, { useState, useEffect } from 'react';
import PageHeader from './PageHeader';
import { Search, Globe } from 'lucide-react';
import namesData from '../data/asmaUlHusna/names.json';
import './AsmaUlHusna.css';

// Import all language files statically (Vite/webpack requirement)
import enTranslations from '../data/asmaUlHusna/en.json';
import bnTranslations from '../data/asmaUlHusna/bn.json';

const LANGUAGES = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
];

// Map language codes to their translation files
const translationFiles = {
    en: enTranslations,
    bn: bnTranslations,
};

const AsmaUlHusna = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedName, setSelectedName] = useState(null);
    const [language, setLanguage] = useState('en');

    // Get current translations
    const translations = translationFiles[language] || translationFiles.en;

    // Merge base names with translations
    const names = namesData.map(item => ({
        ...item,
        transliteration: translations[item.number]?.transliteration || '',
        meaning: translations[item.number]?.meaning || '',
    }));

    // Filter names based on search
    const filteredNames = names.filter(name =>
        name.name.includes(searchQuery) ||
        name.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
        name.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
        name.number.toString() === searchQuery
    );

    return (
        <div className="container">
            <PageHeader
                title="99 Names of Allah"
                subtitle="Asma ul Husna - The Beautiful Names"
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: '99 Names', path: '/names' }
                ]}
            />

            <div className="asma-container">
                {/* Controls Row */}
                <div className="asma-controls">
                    {/* Search Bar */}
                    <div className="search-container">
                        <Search size={20} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by name, transliteration, or meaning..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    {/* Language Selector */}
                    <div className="language-selector">
                        <Globe size={18} />
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                        >
                            {LANGUAGES.map(lang => (
                                <option key={lang.code} value={lang.code}>
                                    {lang.flag} {lang.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Names Grid */}
                <div className="names-grid">
                    {filteredNames.map((name) => (
                        <div
                            key={name.number}
                            className={`name-card ${selectedName?.number === name.number ? 'selected' : ''}`}
                            onClick={() => setSelectedName(selectedName?.number === name.number ? null : name)}
                        >
                            <div className="name-number">{name.number}</div>
                            <div className="name-arabic">{name.name}</div>
                            <div className="name-transliteration">{name.transliteration}</div>
                            <div className="name-meaning">{name.meaning}</div>
                        </div>
                    ))}
                </div>

                {filteredNames.length === 0 && (
                    <div className="no-results">
                        No names found matching "{searchQuery}"
                    </div>
                )}

                {/* Info Section */}
                <div className="asma-info">
                    <h4>📖 About Asma ul Husna</h4>
                    <p>
                        {language === 'bn' ? (
                            <>
                                আল্লাহর ৯৯ নাম, যা আসমা উল হুসনা (أسماء الله الحسنى) নামেও পরিচিত,
                                কুরআন ও হাদিসে উল্লিখিত আল্লাহর সুন্দর গুণাবলী বর্ণনা করে।
                                রাসূলুল্লাহ ﷺ বলেছেন:
                                <em>"আল্লাহর নিরানব্বইটি নাম রয়েছে, একশ থেকে এক কম। যে ব্যক্তি তা মুখস্থ করবে সে জান্নাতে প্রবেশ করবে।"</em>
                                (সহীহ বুখারী)
                            </>
                        ) : (
                            <>
                                The 99 Names of Allah, also known as Asma ul Husna (أسماء الله الحسنى),
                                are the beautiful names that describe the attributes of Allah as mentioned
                                in the Quran and Hadith. The Prophet Muhammad ﷺ said:
                                <em>"Allah has ninety-nine names, one hundred minus one. Whoever learns them will enter Paradise."</em>
                                (Sahih Bukhari)
                            </>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AsmaUlHusna;

