import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Search, BookOpen, Filter } from 'lucide-react';
import { HADITH_BOOKS, HADITH_LANGUAGES } from '../data/hadithData';
import { getBookChapters, getAvailableLanguages } from '../services/hadithService';
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
    }, [selectedLang]);

    const filteredChapters = useMemo(() => {
        if (!searchTerm.trim()) return chapters;
        const term = searchTerm.toLowerCase();
        return chapters.filter(ch =>
            ch.name?.toLowerCase().includes(term) ||
            ch.id.toString().includes(term)
        );
    }, [chapters, searchTerm]);

    const totalHadiths = chapters.reduce((sum, ch) => sum + ch.hadithCount, 0);

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
                        <p className="book-author-big">by {book.author} · {chapters.length} Chapters · {totalHadiths.toLocaleString()} Hadiths</p>
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
                    placeholder={`Search ${chapters.length} chapters by name or number...`}
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
                        <Link
                            to={`/hadith/${bookId}/${chapter.id}?lang=${selectedLang}`}
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
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {!loading && !error && filteredChapters.length === 0 && searchTerm && (
                <div className="hadith-empty-state">
                    <p>No chapters matching "<strong>{searchTerm}</strong>"</p>
                </div>
            )}
        </div>
    );
};

export default HadithChapters;
