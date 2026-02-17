import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, User } from 'lucide-react';
import { HADITH_BOOKS } from '../data/hadithData';
import { getBookStats, getAllNarrators } from '../services/hadithService';
import PageHeader from './PageHeader';
import './Hadith.css';

const HadithBooks = () => {
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('books'); // 'books' | 'narrators'
    const [narrators, setNarrators] = useState([]);
    const [narratorsLoading, setNarratorsLoading] = useState(false);

    useEffect(() => {
        const loadStats = async () => {
            const result = {};
            for (const bookId of Object.keys(HADITH_BOOKS)) {
                try {
                    result[bookId] = await getBookStats(bookId);
                } catch {
                    result[bookId] = { totalHadiths: 0, totalChapters: 0 };
                }
            }
            setStats(result);
            setLoading(false);
        };
        loadStats();
    }, []);

    useEffect(() => {
        if (viewMode === 'narrators' && narrators.length === 0) {
            setNarratorsLoading(true);
            getAllNarrators().then(data => {
                setNarrators(data);
                setNarratorsLoading(false);
            }).catch(() => setNarratorsLoading(false));
        }
    }, [viewMode]);

    const allBooks = Object.values(HADITH_BOOKS);

    const filteredBooks = useMemo(() => {
        if (!searchTerm.trim()) return allBooks;
        const term = searchTerm.toLowerCase();
        return allBooks.filter(b =>
            b.name.toLowerCase().includes(term) ||
            b.arabic.includes(term) ||
            b.author.toLowerCase().includes(term)
        );
    }, [searchTerm]);

    const filteredNarrators = useMemo(() => {
        if (!searchTerm.trim()) return narrators;
        const term = searchTerm.toLowerCase();
        return narrators.filter(n =>
            n.canonical.toLowerCase().includes(term) ||
            n.aliases?.some(a => a.toLowerCase().includes(term))
        );
    }, [narrators, searchTerm]);

    const sahihBooks = filteredBooks.filter(b => b.isSahihSittah);
    const otherBooks = filteredBooks.filter(b => !b.isSahihSittah);

    const renderBookCard = (book) => {
        const bookStats = stats[book.id] || {};
        return (
            <Link to={`/hadith/${book.id}`} key={book.id} className="hadith-book-card-link">
                <div className={`hadith-book-card ${book.isSahihSittah ? 'sahih-sittah' : ''}`}>
                    <div className="book-card-accent" style={{ background: book.color }} />
                    <div className="book-card-content">
                        <div className="book-card-icon-wrap" style={{ background: book.color + '18', color: book.color }}>
                            <BookOpen size={22} />
                        </div>
                        <div className="book-card-info">
                            <div className="book-name-row">
                                <h3 className="book-english-name">{book.name}</h3>
                                {book.isSahihSittah && (
                                    <span className="sahih-badge-inline">Sahih Sittah</span>
                                )}
                            </div>
                            <span className="book-arabic-name">{book.arabic}</span>
                            <p className="book-author">{book.author}</p>
                            {!loading && (
                                <div className="book-stats">
                                    {bookStats.totalChapters > 0 && (
                                        <span className="stat-badge chapters">{bookStats.totalChapters} Chapters</span>
                                    )}
                                    {bookStats.totalHadiths > 0 && (
                                        <span className="stat-badge hadiths">{bookStats.totalHadiths.toLocaleString()} Hadiths</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        );
    };

    return (
        <div className="container hadith-container">
            <PageHeader
                title="Hadith Collections"
                subtitle="Browse the authentic collections of Prophetic traditions"
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Hadith', path: '/hadith' }
                ]}
            />

            {/* View Mode Tabs */}
            <div className="hadith-view-tabs">
                <button
                    className={`view-tab ${viewMode === 'books' ? 'active' : ''}`}
                    onClick={() => setViewMode('books')}
                >
                    <BookOpen size={16} />
                    Book-wise
                </button>
                <button
                    className={`view-tab ${viewMode === 'narrators' ? 'active' : ''}`}
                    onClick={() => setViewMode('narrators')}
                >
                    <User size={16} />
                    Narrator-wise
                </button>
            </div>

            {/* Search */}
            <div className="hadith-search-bar">
                <Search size={18} className="search-icon" />
                <input
                    type="text"
                    placeholder={viewMode === 'books'
                        ? 'Search books by name, author, or Arabic title...'
                        : 'Search narrators by name...'
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="hadith-search-input"
                />
                {searchTerm && (
                    <span className="search-results-count">
                        {viewMode === 'books' ? filteredBooks.length : filteredNarrators.length} results
                    </span>
                )}
            </div>

            {/* ───── Books View ───── */}
            {viewMode === 'books' && (
                <>
                    {sahihBooks.length > 0 && (
                        <section className="hadith-section">
                            <div className="section-label">
                                <span className="section-label-icon">⭐</span>
                                <h2>Sahih Sittah</h2>
                                <span className="section-subtitle">The Six Authentic Collections</span>
                            </div>
                            <div className="hadith-books-grid sahih-grid">
                                {sahihBooks.map(renderBookCard)}
                            </div>
                        </section>
                    )}

                    {otherBooks.length > 0 && (
                        <section className="hadith-section">
                            <div className="section-label">
                                <span className="section-label-icon">📚</span>
                                <h2>Other Collections</h2>
                            </div>
                            <div className="hadith-books-grid other-grid">
                                {otherBooks.map(renderBookCard)}
                            </div>
                        </section>
                    )}

                    {filteredBooks.length === 0 && searchTerm && (
                        <div className="hadith-empty-state">
                            <p>No books matching "<strong>{searchTerm}</strong>"</p>
                        </div>
                    )}
                </>
            )}

            {/* ───── Narrators View ───── */}
            {viewMode === 'narrators' && (
                <>
                    {narratorsLoading ? (
                        <div className="hadith-loading">Loading narrators...</div>
                    ) : (
                        <>
                            <div className="narrators-summary">
                                <span>{filteredNarrators.length} narrators found across {Object.keys(HADITH_BOOKS).length} books</span>
                            </div>
                            <div className="narrators-grid">
                                {filteredNarrators.slice(0, 200).map((narrator) => (
                                    <Link
                                        key={narrator.id}
                                        to={`/hadith/narrator/${narrator.id}`}
                                        className="narrator-card"
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <div className="narrator-avatar">
                                            <User size={18} />
                                        </div>
                                        <div className="narrator-info">
                                            <h4 className="narrator-name">{narrator.canonical}</h4>
                                            <span className="narrator-count">{narrator.totalCount.toLocaleString()} Hadiths</span>
                                            <div className="narrator-books">
                                                {narrator.books.map(bId => {
                                                    const book = HADITH_BOOKS[bId];
                                                    if (!book) return null;
                                                    const count = narrator.hadiths.filter(h => h.book === bId).length;
                                                    return (
                                                        <span
                                                            key={bId}
                                                            className="narrator-book-tag"
                                                            style={{ borderColor: book.color + '60', color: book.color }}
                                                        >
                                                            {book.name.split(' ').pop()} ({count})
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {filteredNarrators.length > 200 && (
                                <div className="hadith-empty-state">
                                    <p>Showing top 200 of {filteredNarrators.length} narrators. Use search to find specific narrators.</p>
                                </div>
                            )}

                            {filteredNarrators.length === 0 && searchTerm && (
                                <div className="hadith-empty-state">
                                    <p>No narrators matching "<strong>{searchTerm}</strong>"</p>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default HadithBooks;
