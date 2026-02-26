/* eslint-disable */
import React, { useState, useMemo } from 'react';
import { BookOpen, Search, Filter } from 'lucide-react';
import PageHeader from './PageHeader';
import { DAILY_DUAS, DUA_CATEGORIES } from '../data/duasData';
import './DailyDuas.css';

const DailyDuas = () => {
    const [activeCategory, setActiveCategory] = useState(DUA_CATEGORIES[0].id);
    const [searchQuery, setSearchQuery] = useState('');

    // Filter Duas
    const filteredDuas = useMemo(() => {
        return DAILY_DUAS.filter(dua => {
            const matchesCategory = activeCategory === 'all' || dua.category === activeCategory;
            const searchTerm = searchQuery.toLowerCase();
            const matchesSearch =
                dua.title.toLowerCase().includes(searchTerm) ||
                (dua.translation && dua.translation.toLowerCase().includes(searchTerm)) ||
                (dua.transliteration && dua.transliteration.toLowerCase().includes(searchTerm));

            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchQuery]);

    // Grouping for 'all' view or just rendering directly
    const displayedDuas = filteredDuas;

    return (
        <div className="daily-duas-container">
            <PageHeader
                title="Daily Supplications"
                subtitle="Essential authentic Duas from the Sunnah for your daily life"
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Daily Duas', path: '/duas' }
                ]}
            />

            <div className="duas-controls">
                {/* Search Bar */}
                <div className="duas-search-wrapper">
                    <Search className="search-icon" size={18} />
                    <input
                        type="text"
                        placeholder="Search duas by title, meaning or transliteration..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="duas-search-input"
                    />
                </div>

                {/* Category Switcher */}
                <div className="dua-categories-wrapper">
                    <button
                        className={`dua-category-pill ${activeCategory === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveCategory('all')}
                    >
                        <Filter size={16} /> All Duas
                    </button>
                    {DUA_CATEGORIES.map(category => (
                        <button
                            key={category.id}
                            className={`dua-category-pill ${activeCategory === category.id ? 'active' : ''}`}
                            onClick={() => setActiveCategory(category.id)}
                        >
                            <span>{category.icon}</span> {category.title}
                        </button>
                    ))}
                </div>
            </div>

            <div className="duas-content">
                {displayedDuas.length === 0 ? (
                    <div className="no-duas-found">
                        <BookOpen size={48} />
                        <h3>No Supplications Found</h3>
                        <p>We couldn't find any duas matching your search criteria.</p>
                        <button className="btn-secondary" onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}>
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className="duas-masonry">
                        {displayedDuas.map(dua => (
                            <div key={dua.id} className="dua-premium-card">
                                <div className="dua-card-header">
                                    <h3 className="dua-title">{dua.title}</h3>
                                    {dua.description && <p className="dua-desc">{dua.description}</p>}
                                </div>

                                <div className="dua-arabic-body">
                                    {dua.arabic}
                                </div>

                                <div className="dua-card-footer">
                                    <div className="dua-translit">{dua.transliteration}</div>
                                    <div className="dua-translation">{dua.translation}</div>
                                    {dua.reference && (
                                        <div className="dua-reference">
                                            <BookOpen size={14} /> {dua.reference}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DailyDuas;

