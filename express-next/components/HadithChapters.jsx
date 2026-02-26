'use client';
import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Search, BookOpen, Info } from 'lucide-react';
import { HADITH_BOOKS, HADITH_LANGUAGES } from '../data/hadithData';
import { getBookChapters, getAvailableLanguages, getBookStats } from '../services/hadithService';
import PageHeader from './PageHeader';
import './Hadith.css';

const HadithChapters = () => {
    const { bookId } = useParams();
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedLang, setSelectedLang] = useState('eng');
    const [availableLangs, setAvailableLangs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [bookStats, setBookStats] = useState(null);
    const [countPos, setCountPos] = useState(null);
    const countTriggerRef = React.useRef(null);

    const showCount = () => {
        if (!countTriggerRef.current) return;
        const rect = countTriggerRef.current.getBoundingClientRect();
        const popupWidth = 260;
        let left = rect.left + rect.width / 2 - popupWidth / 2;
        if (left < 8) left = 8;
        if (left + popupWidth > window.innerWidth - 8) left = window.innerWidth - popupWidth - 8;
        setCountPos({
            bottom: window.innerHeight - rect.top + 8,
            left,
            width: popupWidth,
        });
    };
    const hideCount = () => setCountPos(null);

    const book = HADITH_BOOKS[bookId];

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const langs = await getAvailableLanguages(bookId);
                setAvailableLangs(langs);

                const hasEng = langs.find(l => l.code === 'eng');
                const fallback = langs.find(l => l.code !== 'ara') || langs[0];
                const langToUse = hasEng ? 'eng' : fallback?.code || 'ara';
                setSelectedLang(langToUse);

                const ch = await getBookChapters(bookId, langToUse);
                setChapters(ch);
            } catch (e) {
                setError(e.message);
            }
            setLoading(false);
        };
        load();
        getBookStats(bookId).then(setBookStats).catch(() => { });
    }, [bookId]);

    useEffect(() => {
        if (!loading && selectedLang) {
            const reload = async () => {
                try {
                    const ch = await getBookChapters(bookId, selectedLang);
                    setChapters(ch);
                } catch { /* keep existing */ }
            };
            reload();
        }
    }, [selectedLang, loading, bookId]);

    const filteredChapters = useMemo(() => {
        if (!searchTerm.trim()) return chapters;
        const term = searchTerm.toLowerCase();

        const isNum = /^\d+$/.test(term);
        const searchNum = isNum ? parseInt(term, 10) : null;

        return chapters.filter(ch => {
            // Basic text or exact ID match
            if (ch.name?.toLowerCase().includes(term) || ch.id.toString() === term) {
                return true;
            }

            // Range match for hadith number
            if (isNum) {
                if (ch.firstHadith && ch.lastHadith) {
                    const first = typeof ch.firstHadith === 'number' ? ch.firstHadith : parseFloat(ch.firstHadith);
                    const last = typeof ch.lastHadith === 'number' ? ch.lastHadith : parseFloat(ch.lastHadith);
                    if (!isNaN(first) && !isNaN(last) && searchNum >= Math.floor(first) && searchNum <= Math.ceil(last)) {
                        return true;
                    }
                }
                if (ch.firstArabic && ch.lastArabic && ch.firstArabic !== 0) {
                    const firstAra = typeof ch.firstArabic === 'number' ? ch.firstArabic : parseFloat(ch.firstArabic);
                    const lastAra = typeof ch.lastArabic === 'number' ? ch.lastArabic : parseFloat(ch.lastArabic);
                    if (!isNaN(firstAra) && !isNaN(lastAra) && searchNum >= Math.floor(firstAra) && searchNum <= Math.ceil(lastAra)) {
                        return true;
                    }
                }
            }
            return false;
        });
    }, [chapters, searchTerm]);

    const chapterWiseTotal = chapters.reduce((sum, ch) => sum + ch.hadithCount, 0);
    const hasDiscrepancy = bookStats?.hasDiscrepancy;
    const countMin = hasDiscrepancy ? Math.min(bookStats.chapterWiseCount, bookStats.canonicalCount, bookStats.totalRecords) : chapterWiseTotal;
    const countMax = hasDiscrepancy ? Math.max(bookStats.chapterWiseCount, bookStats.canonicalCount, bookStats.totalRecords) : chapterWiseTotal;

    if (!book) return <div className="container">Book not found</div>;

    return (
        <div className="container hadith-container">
            <PageHeader
                title={book.name}
                subtitle={book.arabic}
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Hadith', path: '/hadith' },
                    { label: book.name, path: `/hadith/${bookId}` }
                ]}
            />

            {/* Book Header Card */}
            <div className="hadith-toolbar">
                <div className="book-meta-row">
                    <div className="book-meta-icon" style={{ background: book.color }}>
                        <BookOpen size={24} color="#fff" />
                    </div>
                    <div>
                        <h2 className="book-title-big">{book.name}</h2>
                        <p className="book-author-big">
                            by {book.author} · {chapters.length} Chapters ·{' '}
                            <span className="hadith-count-inline-wrap">
                                {hasDiscrepancy
                                    ? `${countMin.toLocaleString()}–${countMax.toLocaleString()} Hadiths`
                                    : `${chapterWiseTotal.toLocaleString()} Hadiths`
                                }
                                {hasDiscrepancy && (
                                    <span
                                        ref={countTriggerRef}
                                        className="hadith-info-trigger inline"
                                        onMouseEnter={showCount}
                                        onMouseLeave={hideCount}
                                        onClick={(e) => { e.stopPropagation(); countPos ? hideCount() : showCount(); }}
                                    >
                                        <Info size={13} />
                                        {countPos && ReactDOM.createPortal(
                                            <div
                                                className="hadith-info-popup"
                                                style={{ position: 'fixed', bottom: countPos.bottom, left: countPos.left, width: countPos.width, zIndex: 9999 }}
                                                onMouseLeave={hideCount}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                Different counting methods yield different totals — traditional numbering, chapter-wise sums, and recorded entries each differ slightly.
                                            </div>,
                                            document.getElementById('root') || document.body
                                        )}
                                    </span>
                                )}
                            </span>
                        </p>
                    </div>
                    {book.isSahihSittah && <span className="sahih-badge-inline">Sahih Sittah</span>}
                </div>

                <select
                    value={selectedLang}
                    onChange={(e) => setSelectedLang(e.target.value)}
                    className="hadith-lang-select"
                >
                    {availableLangs.map(lang => {
                        const meta = HADITH_LANGUAGES[lang.code];
                        return (
                            <option key={lang.code} value={lang.code}>
                                {meta ? `${meta.name} (${meta.native})` : lang.language}
                            </option>
                        );
                    })}
                </select>
            </div>

            {/* Search Bar */}
            <div className="hadith-search-bar">
                <Search size={18} className="search-icon" />
                <input
                    type="text"
                    placeholder={`Search ${chapters.length} chapters by name, or find by hadith number...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="hadith-search-input"
                />
                {searchTerm && (
                    <span className="search-results-count">
                        {filteredChapters.length} result{filteredChapters.length !== 1 ? 's' : ''}
                    </span>
                )}
            </div>

            {loading && <div className="hadith-loading">Loading chapters...</div>}
            {error && <div className="hadith-error">Error: {error}</div>}

            {!loading && !error && (
                <div className="chapters-grid">
                    {filteredChapters.map(chapter => (
                        <Link href={`/hadith/${bookId}/${chapter.id}?lang=${selectedLang}`}
                            key={chapter.id}
                            className="chapter-card-grid"
                        >
                            <div className="chapter-card-header-row">
                                <span className="chapter-num-badge" style={{
                                    backgroundColor: book.color + '18',
                                    color: book.color,
                                    borderColor: book.color + '40',
                                }}>
                                    {chapter.id}
                                </span>
                                <span className="chapter-hadith-badge">
                                    {chapter.hadithCount} Hadiths
                                </span>
                            </div>
                            <h4 className="chapter-card-title">{chapter.name || `Chapter ${chapter.id}`}</h4>
                            <div className="chapter-card-range">
                                {chapter.firstHadith && chapter.lastHadith && (
                                    <span>#{chapter.firstHadith} – #{chapter.lastHadith}</span>
                                )}
                                {chapter.firstArabic && chapter.lastArabic && chapter.firstArabic !== 0 && (
                                    <span className="chapter-card-arabic-range">
                                        Arabic: {chapter.firstArabic} – {chapter.lastArabic}
                                    </span>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {!loading && !error && filteredChapters.length === 0 && searchTerm && (
                <div className="hadith-empty-state">
                    <p>No chapters matching &quot;<strong>{searchTerm}</strong>&quot;</p>
                </div>
            )}
        </div>
    );
};

export default HadithChapters;
