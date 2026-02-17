import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { HADITH_BOOKS, HADITH_LANGUAGES } from '../data/hadithData';
import { getSectionHadiths, getEdition, getAvailableLanguages } from '../services/hadithService';
import PageHeader from './PageHeader';
import './Hadith.css';

const HadithReader = () => {
    const { bookId, sectionId } = useParams();
    const [searchParams] = useSearchParams();
    const langFromUrl = searchParams.get('lang') || 'eng';

    const [hadiths, setHadiths] = useState([]);
    const [arabicHadiths, setArabicHadiths] = useState([]);
    const [sectionName, setSectionName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedLang, setSelectedLang] = useState(langFromUrl);
    const [availableLangs, setAvailableLangs] = useState([]);
    const [showArabic, setShowArabic] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [gradeFilter, setGradeFilter] = useState('all');

    const book = HADITH_BOOKS[bookId];

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const langs = await getAvailableLanguages(bookId);
                setAvailableLangs(langs);

                const translationHadiths = await getSectionHadiths(bookId, sectionId, selectedLang);
                setHadiths(translationHadiths);

                try {
                    const araHadiths = await getSectionHadiths(bookId, sectionId, 'ara');
                    setArabicHadiths(araHadiths);
                } catch { setArabicHadiths([]); }

                const edition = await getEdition(bookId, selectedLang);
                const name = edition.metadata?.sections?.[sectionId] || `Chapter ${sectionId}`;
                setSectionName(name);
            } catch (e) {
                setError(e.message);
            }
            setLoading(false);
        };
        load();
    }, [bookId, sectionId, selectedLang]);

    // Collect unique grades for filter dropdown
    const uniqueGrades = useMemo(() => {
        const grades = new Set();
        hadiths.forEach(h => {
            const label = getGradeLabel(h.grades);
            if (label) grades.add(label);
        });
        return Array.from(grades).sort();
    }, [hadiths]);

    // Filtered hadiths
    const filteredHadiths = useMemo(() => {
        let result = hadiths;

        if (gradeFilter !== 'all') {
            result = result.filter(h => {
                const g = getGradeLabel(h.grades);
                return g && g.toLowerCase() === gradeFilter.toLowerCase();
            });
        }

        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            result = result.filter(h => {
                const arabicText = getArabicTextFromCache(h.hadithnumber);
                return h.text?.toLowerCase().includes(term) ||
                    arabicText?.includes(term) ||
                    h.hadithnumber?.toString().includes(term);
            });
        }

        return result;
    }, [hadiths, searchTerm, gradeFilter, arabicHadiths]);

    if (!book) return <div className="container">Book not found</div>;

    function getArabicTextFromCache(hadithNumber) {
        const match = arabicHadiths.find(h => h.hadithnumber === hadithNumber);
        return match?.text || '';
    }

    return (
        <div className="container hadith-container hadith-reader-container">
            <PageHeader
                title={sectionName}
                subtitle={`${book.name} — Chapter ${sectionId}`}
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Hadith', path: '/hadith' },
                    { label: book.name, path: `/hadith/${bookId}` },
                    { label: `Ch. ${sectionId}`, path: `/hadith/${bookId}/${sectionId}` }
                ]}
            />

            <div className="hadith-reader-toolbar">
                <select
                    value={selectedLang}
                    onChange={(e) => setSelectedLang(e.target.value)}
                    className="hadith-lang-select"
                >
                    {availableLangs
                        .filter(l => l.code !== 'ara')
                        .map(lang => {
                            const meta = HADITH_LANGUAGES[lang.code];
                            return (
                                <option key={lang.code} value={lang.code}>
                                    {meta ? `${meta.name}` : lang.language}
                                </option>
                            );
                        })}
                </select>

                {uniqueGrades.length > 0 && (
                    <select
                        value={gradeFilter}
                        onChange={(e) => setGradeFilter(e.target.value)}
                        className="hadith-lang-select"
                    >
                        <option value="all">All Grades</option>
                        {uniqueGrades.map(g => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>
                )}

                <label className="toggle-arabic-label">
                    <input
                        type="checkbox"
                        checked={showArabic}
                        onChange={(e) => setShowArabic(e.target.checked)}
                    />
                    Show Arabic
                </label>

                <span className="hadith-count-label">
                    {filteredHadiths.length}{filteredHadiths.length !== hadiths.length ? ` / ${hadiths.length}` : ''} Hadiths
                </span>
            </div>

            {/* Search */}
            <div className="hadith-search-bar">
                <Search size={18} className="search-icon" />
                <input
                    type="text"
                    placeholder="Search by text, hadith number, or keyword..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="hadith-search-input"
                />
                {(searchTerm || gradeFilter !== 'all') && (
                    <button
                        className="search-clear-btn"
                        onClick={() => { setSearchTerm(''); setGradeFilter('all'); }}
                    >
                        Clear Filters
                    </button>
                )}
            </div>

            {loading && <div className="hadith-loading">Loading hadiths...</div>}
            {error && <div className="hadith-error">Error: {error}</div>}

            {!loading && !error && (
                <div className="hadiths-list">
                    {filteredHadiths.map((hadith, index) => {
                        const gradeLabel = getGradeLabel(hadith.grades);
                        const arabicText = getArabicTextFromCache(hadith.hadithnumber);
                        const langMeta = HADITH_LANGUAGES[selectedLang];
                        const isRtl = langMeta?.dir === 'rtl';

                        return (
                            <div
                                key={hadith.hadithnumber}
                                className={`hadith-card ${index % 2 === 0 ? 'even' : 'odd'}`}
                            >
                                <div className="hadith-card-header">
                                    <span className="hadith-number" style={{ borderColor: book.color }}>
                                        {hadith.hadithnumber}
                                    </span>
                                    {gradeLabel && (
                                        <span className={`grade-badge ${getGradeClass(gradeLabel)}`}>
                                            {gradeLabel}
                                        </span>
                                    )}
                                    {hadith.reference && (
                                        <span className="hadith-ref">
                                            Book {hadith.reference.book}, Hadith {hadith.reference.hadith}
                                        </span>
                                    )}
                                </div>

                                {showArabic && arabicText && (
                                    <p className="hadith-arabic-text">{arabicText}</p>
                                )}

                                <p
                                    className="hadith-translation-text"
                                    dir={isRtl ? 'rtl' : 'ltr'}
                                    style={{ textAlign: isRtl ? 'right' : 'left' }}
                                >
                                    {hadith.text}
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}

            {!loading && !error && filteredHadiths.length === 0 && (searchTerm || gradeFilter !== 'all') && (
                <div className="hadith-empty-state">
                    <p>No hadiths matching your filters</p>
                </div>
            )}
        </div>
    );
};

function getGradeLabel(grades) {
    if (!grades || grades.length === 0) return null;
    const grade = grades[0];
    if (typeof grade === 'string') return grade;
    return grade?.grade || null;
}

function getGradeClass(label) {
    if (!label) return '';
    const l = label.toLowerCase();
    if (l.includes('sahih')) return 'grade-sahih';
    if (l.includes('hasan')) return 'grade-hasan';
    if (l.includes('daif') || l.includes("da'if")) return 'grade-daif';
    return 'grade-other';
}

export default HadithReader;
