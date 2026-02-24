import { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { User, BookOpen, Search, ArrowLeft, MapPin, Calendar, Heart, GraduationCap } from 'lucide-react';
import { HADITH_BOOKS } from '../data/hadithData';
import { getNarratorById, getEdition } from '../services/hadithService';
import PageHeader from './PageHeader';
import './Hadith.css';

const NarratorDetail = () => {
    const { narratorId } = useParams();
    const [narrator, setNarrator] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hadithTexts, setHadithTexts] = useState({});
    const [loadingTexts, setLoadingTexts] = useState(false);
    const [filterBook, setFilterBook] = useState('all');
    const [filterGrade, setFilterGrade] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 20;

    useEffect(() => {
        getNarratorById(narratorId).then(n => {
            setNarrator(n);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [narratorId]);

    // Load hadith texts for the filtered set
    useEffect(() => {
        if (!narrator) return;
        const booksToLoad = filterBook === 'all' ? narrator.books : [filterBook];
        setLoadingTexts(true);

        Promise.all(
            booksToLoad.map(async bookId => {
                try {
                    const edition = await getEdition(bookId, 'eng');
                    return { bookId, hadiths: edition.hadiths };
                } catch {
                    return { bookId, hadiths: [] };
                }
            })
        ).then(results => {
            const textMap = {};
            results.forEach(({ bookId, hadiths }) => {
                hadiths.forEach(h => {
                    textMap[`${bookId}-${h.hadithnumber}`] = h.text;
                });
            });
            setHadithTexts(textMap);
            setLoadingTexts(false);
        });
    }, [narrator, filterBook]);

    const filteredHadiths = useMemo(() => {
        if (!narrator) return [];
        let list = narrator.hadiths;

        if (filterBook !== 'all') {
            list = list.filter(h => h.book === filterBook);
        }
        if (filterGrade !== 'all') {
            list = list.filter(h =>
                h.grade?.toLowerCase().includes(filterGrade.toLowerCase())
            );
        }
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            list = list.filter(h => {
                const text = hadithTexts[`${h.book}-${h.number}`] || '';
                return text.toLowerCase().includes(term) ||
                    String(h.number).includes(term);
            });
        }
        return list;
    }, [narrator, filterBook, filterGrade, searchTerm, hadithTexts]);

    const paginatedHadiths = useMemo(() => {
        return filteredHadiths.slice(0, page * PAGE_SIZE);
    }, [filteredHadiths, page]);

    if (loading) {
        return <div className="container hadith-container"><div className="hadith-loading">Loading narrator...</div></div>;
    }

    if (!narrator) {
        return (
            <div className="container hadith-container">
                <div className="hadith-empty-state">
                    <p>Narrator not found</p>
                    <Link to="/hadith" className="back-link"><ArrowLeft size={16} /> Back to collections</Link>
                </div>
            </div>
        );
    }

    // Get unique grades from hadiths
    const grades = [...new Set(narrator.hadiths.map(h => h.grade).filter(Boolean))];

    return (
        <div className="container hadith-container">
            <PageHeader
                title={narrator.canonical}
                subtitle={`${narrator.totalCount.toLocaleString()} Hadiths across ${narrator.books.length} collection${narrator.books.length > 1 ? 's' : ''}`}
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Hadith', path: '/hadith' },
                    { label: narrator.canonical }
                ]}
            />

            {/* Narrator Info Card */}
            <div className="narrator-profile-container">
                <div className="narrator-profile-header">
                    <div className="narrator-profile-avatar">
                        <User size={32} />
                    </div>
                    <div className="narrator-profile-title">
                        <h2>{narrator.canonical}</h2>
                        {narrator.full_name && <p className="narrator-full-name">{narrator.full_name}</p>}

                        {(narrator.grade || narrator.death) && (
                            <div className="narrator-meta-badges">
                                {narrator.grade && <span className="meta-badge grade">{narrator.grade}</span>}
                                {narrator.death && <span className="meta-badge death"><Calendar size={14} /> {narrator.death}</span>}
                            </div>
                        )}

                        {narrator.aliases?.length > 0 && (
                            <p className="narrator-aliases">
                                <strong>Also known as:</strong> {narrator.aliases.slice(0, 5).join(', ')}
                                {narrator.aliases.length > 5 && ` +${narrator.aliases.length - 5} more`}
                            </p>
                        )}
                    </div>
                </div>

                {/* Comprehensive Biography Grid */}
                {(narrator.birth_date_place || narrator.places_of_stay || narrator.tags || narrator.parents || narrator.spouse || narrator.siblings || narrator.children || narrator.teachers || narrator.students || narrator.area_of_interest) && (
                    <div className="narrator-bio-grid">
                        {/* Column 1: Life & Demographics */}
                        {(narrator.birth_date_place || narrator.places_of_stay || narrator.tags) && (
                            <div className="bio-section">
                                <h3><MapPin size={16} /> Demographics</h3>
                                {narrator.birth_date_place && <div className="bio-stat"><span>Birth</span> <p>{narrator.birth_date_place}</p></div>}
                                {narrator.places_of_stay && <div className="bio-stat"><span>Places of Stay</span> <p>{narrator.places_of_stay}</p></div>}
                                {narrator.tags && <div className="bio-stat"><span>Tags</span> <p>{narrator.tags}</p></div>}
                            </div>
                        )}

                        {/* Column 2: Relationships */}
                        {(narrator.parents || narrator.spouse || narrator.siblings || narrator.children) && (
                            <div className="bio-section">
                                <h3><Heart size={16} /> Relationships</h3>
                                {narrator.parents && <div className="bio-stat"><span>Parents</span> <p>{narrator.parents}</p></div>}
                                {narrator.spouse && <div className="bio-stat"><span>Spouse</span> <p>{narrator.spouse}</p></div>}
                                {narrator.siblings && <div className="bio-stat"><span>Siblings</span> <p>{narrator.siblings}</p></div>}
                                {narrator.children && <div className="bio-stat"><span>Children</span> <p>{narrator.children}</p></div>}
                            </div>
                        )}

                        {/* Column 3: Academic */}
                        {(narrator.area_of_interest || narrator.teachers || narrator.students) && (
                            <div className="bio-section">
                                <h3><GraduationCap size={16} /> Academic</h3>
                                {narrator.area_of_interest && <div className="bio-stat"><span>Expertise</span> <p>{narrator.area_of_interest}</p></div>}
                                {narrator.teachers && <div className="bio-stat"><span>Teachers</span> <p>{narrator.teachers}</p></div>}
                                {narrator.students && <div className="bio-stat"><span>Students</span> <p>{narrator.students}</p></div>}
                            </div>
                        )}
                    </div>
                )}

                <div className="narrator-book-tags">
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
                                {book.name} ({count})
                            </span>
                        );
                    })}
                </div>
            </div>

            {/* Filters Row */}
            <div className="narrator-filters">
                <div className="hadith-search-bar" style={{ flex: 1 }}>
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search hadith text or number..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="hadith-search-input"
                    />
                </div>

                <select
                    value={filterBook}
                    onChange={e => { setFilterBook(e.target.value); setPage(1); }}
                    className="narrator-filter-select"
                >
                    <option value="all">All Books ({narrator.totalCount})</option>
                    {narrator.books.map(bId => {
                        const book = HADITH_BOOKS[bId];
                        if (!book) return null;
                        const count = narrator.hadiths.filter(h => h.book === bId).length;
                        return <option key={bId} value={bId}>{book.name} ({count})</option>;
                    })}
                </select>

                {grades.length > 0 && (
                    <select
                        value={filterGrade}
                        onChange={e => { setFilterGrade(e.target.value); setPage(1); }}
                        className="narrator-filter-select"
                    >
                        <option value="all">All Grades</option>
                        {grades.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                )}
            </div>

            {/* Results Count */}
            <div className="narrators-summary" style={{ marginTop: '0.5rem' }}>
                Showing {Math.min(paginatedHadiths.length, filteredHadiths.length)} of {filteredHadiths.length} hadiths
            </div>

            {/* Hadith List */}
            {loadingTexts ? (
                <div className="hadith-loading">Loading hadith texts...</div>
            ) : (
                <div className="narrator-hadith-list">
                    {paginatedHadiths.map((h, idx) => {
                        const book = HADITH_BOOKS[h.book];
                        const text = hadithTexts[`${h.book}-${h.number}`];
                        return (
                            <div key={`${h.book}-${h.number}-${idx}`} className="narrator-hadith-item">
                                <div className="narrator-hadith-meta">
                                    <Link
                                        to={`/hadith/${h.book}/${h.section || 1}?lang=eng`}
                                        className="narrator-hadith-book"
                                        style={{ color: book?.color }}
                                    >
                                        <BookOpen size={14} />
                                        {book?.name || h.book}
                                    </Link>
                                    <span className="narrator-hadith-number">#{h.number}</span>
                                    {h.grade && (
                                        <span className={`narrator-hadith-grade grade-${h.grade?.toLowerCase()?.includes('sahih') ? 'sahih' : h.grade?.toLowerCase()?.includes('hasan') ? 'hasan' : 'daif'}`}>
                                            {h.grade}
                                        </span>
                                    )}
                                </div>
                                {text && (
                                    <p className="narrator-hadith-text">
                                        {text.length > 300 ? text.slice(0, 300) + '…' : text}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Load More */}
            {paginatedHadiths.length < filteredHadiths.length && (
                <button
                    className="narrator-load-more"
                    onClick={() => setPage(p => p + 1)}
                >
                    Load More ({filteredHadiths.length - paginatedHadiths.length} remaining)
                </button>
            )}

            {filteredHadiths.length === 0 && !loadingTexts && (
                <div className="hadith-empty-state">
                    <p>No hadiths found matching your filters</p>
                </div>
            )}
        </div>
    );
};

export default NarratorDetail;
