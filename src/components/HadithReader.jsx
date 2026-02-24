import { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { HADITH_BOOKS, HADITH_LANGUAGES } from '../data/hadithData';
import { getSectionHadiths, getEdition, getAvailableLanguages, detectLanguage } from '../services/hadithService';
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

    // Global search state
    const [searchResults, setSearchResults] = useState(null); // null means no active global search
    const [isSearching, setIsSearching] = useState(false);

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
                const name = edition.metadata?.sections?.[sectionId] || `Chapter ${sectionId} `;
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

    // Filtered hadiths for current chapter
    const localFilteredHadiths = useMemo(() => {
        let result = hadiths;

        if (gradeFilter !== 'all') {
            result = result.filter(h => {
                const g = getGradeLabel(h.grades);
                return g && g.toLowerCase() === gradeFilter.toLowerCase();
            });
        }
        return result;
    }, [hadiths, gradeFilter]);

    // Effect to handle global search across the book
    useEffect(() => {
        if (!searchTerm.trim()) {
            setSearchResults(null);
            setIsSearching(false);
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearching(true);
            try {
                const term = searchTerm.trim().toLowerCase();
                const searchLang = detectLanguage(term);
                const isNum = /^\d+(\.\d+)?$/.test(term);

                // If it's just a number, we can search the selected language edition
                const langToSearch = isNum ? selectedLang : (searchLang === 'eng' ? selectedLang : searchLang);

                // Load editions
                const displayEdition = await getEdition(bookId, selectedLang);
                const araEdition = await getEdition(bookId, 'ara');

                let targetEdition = null;
                // Only load target if different and not english fallback
                if (langToSearch !== selectedLang && langToSearch !== 'ara' && langToSearch !== 'eng') {
                    try { targetEdition = await getEdition(bookId, langToSearch); } catch (e) { /* ignore */ }
                } else if (langToSearch === 'eng' && selectedLang !== 'eng') {
                    try { targetEdition = await getEdition(bookId, 'eng'); } catch (e) { /* ignore */ }
                }

                let results = [];
                for (const h of displayEdition.hadiths) {
                    if (gradeFilter !== 'all') {
                        const g = getGradeLabel(h.grades);
                        if (!g || g.toLowerCase() !== gradeFilter.toLowerCase()) continue;
                    }

                    const matchAra = araEdition.hadiths.find(a => a.hadithnumber === h.hadithnumber);
                    const araText = matchAra?.text || '';

                    let targetText = '';
                    if (targetEdition) {
                        const matchTarget = targetEdition.hadiths.find(t => t.hadithnumber === h.hadithnumber);
                        targetText = matchTarget?.text || '';
                    }

                    if (!h.text?.toLowerCase().includes(term) &&
                        !araText.includes(term) &&
                        !targetText.toLowerCase().includes(term) &&
                        h.hadithnumber?.toString() !== term &&
                        matchAra?.arabicnumber?.toString() !== term) {
                        continue;
                    }

                    // Attach arabic text to avoid repeated lookups later
                    results.push({ ...h, __araText: araText, __isCurrentChapter: h.reference?.book === parseInt(sectionId) });
                }

                // Sort: Current chapter first, then hadith number
                results.sort((a, b) => {
                    if (a.__isCurrentChapter && !b.__isCurrentChapter) return -1;
                    if (!a.__isCurrentChapter && b.__isCurrentChapter) return 1;
                    return a.hadithnumber - b.hadithnumber;
                });

                setSearchResults(results);
            } catch (err) {
                console.error("Search error", err);
            }
            setIsSearching(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm, gradeFilter, bookId, selectedLang, sectionId]);

    const displayHadiths = searchResults !== null ? searchResults : localFilteredHadiths;

    if (!book) return <div className="container">Book not found</div>;

    function getArabicText(hadith) {
        if (hadith.__araText !== undefined) return hadith.__araText;
        const match = arabicHadiths.find(h => h.hadithnumber === hadith.hadithnumber);
        return match?.text || '';
    }

    return (
        <div className="container hadith-container hadith-reader-container">
            <PageHeader
                title={sectionName}
                subtitle={`${book.name} — Chapter ${sectionId} `}
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Hadith', path: '/hadith' },
                    { label: book.name, path: `/ hadith / ${bookId} ` },
                    { label: `Ch.${sectionId} `, path: ` / hadith / ${bookId}/${sectionId}` }
                ]}
            />

            < div className="hadith-reader-toolbar" >
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

                {
                    uniqueGrades.length > 0 && (
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
                    )
                }

                <label className="toggle-arabic-label">
                    <input
                        type="checkbox"
                        checked={showArabic}
                        onChange={(e) => setShowArabic(e.target.checked)}
                    />
                    Show Arabic
                </label>

                <span className="hadith-count-label">
                    {displayHadiths.length}{searchResults === null && displayHadiths.length !== hadiths.length ? ` / ${hadiths.length}` : ''} Hadiths
                </span>
            </div >

            {/* Search */}
            < div className="hadith-search-bar" style={{ position: 'relative' }}>
                <Search size={18} className="search-icon" />
                <input
                    type="text"
                    placeholder="Search whole book by exact text or hadith number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="hadith-search-input"
                />
                {
                    (searchTerm || gradeFilter !== 'all') && (
                        <button
                            className="search-clear-btn"
                            onClick={() => { setSearchTerm(''); setGradeFilter('all'); }}
                        >
                            Clear Filters
                        </button>
                    )
                }
            </div >

            {loading && <div className="hadith-loading">Loading hadiths...</div>}
            {isSearching && <div className="hadith-loading">Searching globally across the book...</div>}
            {error && <div className="hadith-error">Error: {error}</div>}

            {
                !loading && !error && !isSearching && (
                    <div className="hadiths-list">
                        {displayHadiths.map((hadith, index) => {
                            const gradeLabel = getGradeLabel(hadith.grades);
                            const arabicText = getArabicText(hadith);
                            const langMeta = HADITH_LANGUAGES[selectedLang];
                            const isRtl = langMeta?.dir === 'rtl';
                            const isOtherChapter = searchResults !== null && !hadith.__isCurrentChapter;

                            return (
                                <div
                                    key={hadith.hadithnumber}
                                    className={`hadith-card ${index % 2 === 0 ? 'even' : 'odd'}`}
                                >
                                    {isOtherChapter && (
                                        <div className="ayah-badge" style={{ marginBottom: '1rem', background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}>
                                            From Chapter {hadith.reference?.book}
                                        </div>
                                    )}
                                    <div className="hadith-card-header">
                                        <span className="hadith-number" style={{ borderColor: book.color }}>
                                            {hadith.hadithnumber}
                                        </span>
                                        {hadith.arabicnumber && hadith.arabicnumber !== 0 && (
                                            <span className="chapter-card-arabic-range">
                                                {book.name} (Arabic): {hadith.arabicnumber}
                                            </span>
                                        )}
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
                )
            }

            {
                !loading && !error && !isSearching && displayHadiths.length === 0 && (searchTerm || gradeFilter !== 'all') && (
                    <div className="hadith-empty-state">
                        <p>No hadiths matching your search criteria in the entire book.</p>
                    </div>
                )
            }
        </div >
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
