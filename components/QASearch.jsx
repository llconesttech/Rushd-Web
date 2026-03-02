'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Search, Hash, Loader2, BookOpen, ChevronRight, ChevronDown, ArrowLeft, ExternalLink, X } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { HADITH_BOOKS } from '@/data/hadithData';
import { apiFetch } from '@/lib/apiClient';
import '@/components/Hadith.css';

const QASearch = () => {
  const [view, setView] = useState('categories');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [subcategoryData, setSubcategoryData] = useState(null);
  
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [loadingSubcategory, setLoadingSubcategory] = useState(false);
  const [qaData, setQaData] = useState(null);
  
  const [searchResults, setSearchResults] = useState(null);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchPage, setSearchPage] = useState(1);
  
  const [selectedQA, setSelectedQA] = useState(null);
  const [loadingQAItem, setLoadingQAItem] = useState(false);

  useEffect(() => {
    apiFetch('/qa/categories')
      .then(data => {
        setCategories(data);
        setLoadingCategories(false);
      })
      .catch(() => setLoadingCategories(false));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearch.length >= 2) {
      setView('search');
      setSearchQuery(debouncedSearch);
      setSearchPage(1);
      setSearchResults(null);
    } else if (debouncedSearch.length === 0 && view === 'search') {
      setView('categories');
      setSearchQuery('');
      setSearchResults(null);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (!searchQuery || view !== 'search') return;
    setLoadingSearch(true);
    apiFetch(`/qa/search?q=${encodeURIComponent(searchQuery)}&page=${searchPage}&limit=20`)
      .then(data => {
        setSearchResults(prev => {
          if (searchPage === 1) return data;
          return {
            ...data,
            results: [...(prev?.results || []), ...data.results]
          };
        });
        setLoadingSearch(false);
      })
      .catch(() => setLoadingSearch(false));
  }, [searchQuery, searchPage, view]);

  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    setView('subcategories');
    setLoadingCategory(true);
    setSubcategoryData(null);
    
    try {
      const data = await apiFetch(`/qa/category/${encodeURIComponent(category.name)}`);
      setSubcategoryData(data);
    } catch (e) {
      console.error(e);
    }
    setLoadingCategory(false);
  };

  const handleSubcategoryClick = async (subcategory) => {
    setSelectedSubcategory(subcategory);
    setView('qa');
    setLoadingSubcategory(true);
    setQaData(null);
    
    try {
      const data = await apiFetch(
        `/qa/subcategory/${encodeURIComponent(selectedCategory.name)}/${encodeURIComponent(subcategory.name)}?page=1&limit=20`
      );
      setQaData(data);
    } catch (e) {
      console.error(e);
    }
    setLoadingSubcategory(false);
  };

  const loadMoreSearchResults = () => {
    if (!loadingSearch && searchResults?.pagination?.hasMore) {
      setSearchPage(prev => prev + 1);
    }
  };

  const handleQAItemClick = async (item) => {
    if (selectedQA?.id === item.id) {
      setSelectedQA(null);
      return;
    }
    setSelectedQA(item);
  };

  const handleJumpToReference = (item) => {
    const match = item.reference?.match(/Sahih\s+(?:al-)?(\w+)\s+(\d+)/i);
    if (match) {
      const bookId = match[1].toLowerCase();
      const hadithNum = match[2];
      const book = HADITH_BOOKS[bookId];
      if (book) {
        const chapter = item.id.split('-')[1] || '1';
        window.open(`/hadith/${bookId}/${chapter}?hadith=${hadithNum}`, '_blank');
      }
    }
  };

  const navigateBack = () => {
    if (view === 'qa') {
      setView('subcategories');
      setSelectedSubcategory(null);
      setQaData(null);
      setSelectedQA(null);
    } else if (view === 'subcategories') {
      setView('categories');
      setSelectedCategory(null);
      setSubcategoryData(null);
    } else if (view === 'search') {
      setView('categories');
      setSearchTerm('');
      setSearchQuery('');
      setSearchResults(null);
    }
  };

  const getBookInfo = (id) => {
    const bookId = id.split('-')[0];
    return HADITH_BOOKS[bookId] || { name: bookId, color: '#666' };
  };

  return (
    <div className="container hadith-container">
      <PageHeader
        title="Islamic Q&A Knowledge Base"
        subtitle="Browse 68,000+ authentic questions & answers from hadith books"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Q&A Search', path: '/qa-search' }
        ]}
      />

      <div className="hadith-search-bar" style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search questions, topics, or categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="hadith-search-input"
        />
        {searchTerm && (
          <button 
            className="search-clear-btn" 
            onClick={() => { setSearchTerm(''); setView('categories'); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {view !== 'categories' && (
        <button onClick={navigateBack} className="qa-back-btn">
          <ArrowLeft size={16} /> Back
        </button>
      )}

      {view === 'categories' && (
        <div className="qa-categories-view">
          <h2 className="section-title"><Hash size={20} /> Browse by Category</h2>
          {loadingCategories ? (
            <div className="hadith-loading">Loading categories...</div>
          ) : (
            <div className="qa-categories-grid">
              {categories.map(cat => (
                <button 
                  key={cat.name} 
                  onClick={() => handleCategoryClick(cat)}
                  className="qa-category-card"
                >
                  <div className="qa-category-icon">{getCategoryIcon(cat.name)}</div>
                  <div className="qa-category-info">
                    <h3 className="qa-category-name">{cat.name}</h3>
                    <span className="qa-category-count">{cat.totalCount.toLocaleString()} Q&A</span>
                    <span className="qa-category-subs">{cat.subcategories.length} subcategories</span>
                  </div>
                  <ChevronRight size={18} className="qa-category-arrow" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {view === 'subcategories' && selectedCategory && (
        <div className="qa-subcategories-view">
          <div className="qa-view-header">
            <h2>{selectedCategory.name}</h2>
            <span className="qa-item-count">{selectedCategory.totalCount.toLocaleString()} questions</span>
          </div>
          
          {loadingCategory ? (
            <div className="hadith-loading">Loading subcategories...</div>
          ) : subcategoryData ? (
            <div className="qa-subcategories-list">
              {subcategoryData.subcategories.map(sub => (
                <button 
                  key={sub.name}
                  onClick={() => handleSubcategoryClick(sub)}
                  className="qa-subcategory-item"
                >
                  <span className="qa-subcategory-name">{sub.name}</span>
                  <span className="qa-subcategory-count">{sub.count.toLocaleString()}</span>
                  <ChevronRight size={16} />
                </button>
              ))}
            </div>
          ) : (
            <div className="hadith-empty-state">No subcategories found</div>
          )}
        </div>
      )}

      {view === 'qa' && selectedSubcategory && (
        <div className="qa-list-view">
          <div className="qa-view-header">
            <h2>{selectedSubcategory.name}</h2>
            {qaData && (
              <span className="qa-item-count">
                {qaData.pagination.total.toLocaleString()} questions
              </span>
            )}
          </div>

          {loadingSubcategory ? (
            <div className="hadith-loading">Loading questions...</div>
          ) : qaData ? (
            <>
              <div className="qa-items-list">
                {qaData.items.map((item, idx) => (
                  <QACard 
                    key={item.id} 
                    item={item} 
                    isExpanded={selectedQA?.id === item.id}
                    onClick={() => handleQAItemClick(item)}
                    onJumpToReference={() => handleJumpToReference(item)}
                    getBookInfo={getBookInfo}
                  />
                ))}
              </div>
              
              {qaData.pagination.hasMore && (
                <button 
                  className="qa-load-more-btn"
                  onClick={async () => {
                    const nextPage = qaData.pagination.page + 1;
                    setLoadingSubcategory(true);
                    try {
                      const data = await apiFetch(
                        `/qa/subcategory/${encodeURIComponent(selectedCategory.name)}/${encodeURIComponent(selectedSubcategory.name)}?page=${nextPage}&limit=20`
                      );
                      setQaData({
                        ...data,
                        items: [...qaData.items, ...data.items]
                      });
                    } catch (e) {
                      console.error(e);
                    }
                    setLoadingSubcategory(false);
                  }}
                >
                  {loadingSubcategory ? <Loader2 className="spin-icon" /> : 'Load More'}
                </button>
              )}
            </>
          ) : (
            <div className="hadith-empty-state">No questions found</div>
          )}
        </div>
      )}

      {view === 'search' && (
        <div className="qa-search-view">
          <div className="qa-view-header">
            <h2>Search Results</h2>
            {searchResults && (
              <span className="qa-item-count">
                {searchResults.pagination.total.toLocaleString()} results
              </span>
            )}
          </div>
          
          <p className="qa-search-query">Showing results for "{searchQuery}"</p>

          {loadingSearch && !searchResults ? (
            <div className="hadith-loading">Searching...</div>
          ) : searchResults ? (
            <>
              {searchResults.results.length > 0 ? (
                <div className="qa-items-list">
                  {searchResults.results.map((item, idx) => (
                    <SearchQACard 
                      key={`${item.id}-${idx}`}
                      item={item}
                      onLoadFull={async () => {
                        const fullItem = await apiFetch(`/qa/item/${item.id}`);
                        return fullItem;
                      }}
                      getBookInfo={getBookInfo}
                    />
                  ))}
                </div>
              ) : (
                <div className="hadith-empty-state">
                  No results found for "{searchQuery}"
                </div>
              )}

              {searchResults.pagination.hasMore && (
                <button 
                  className="qa-load-more-btn"
                  onClick={loadMoreSearchResults}
                >
                  {loadingSearch ? <Loader2 className="spin-icon" /> : 'Load More Results'}
                </button>
              )}
            </>
          ) : null}
        </div>
      )}
    </div>
  );
};

const QACard = ({ item, isExpanded, onClick, onJumpToReference, getBookInfo }) => {
  const book = getBookInfo(item.id);
  
  return (
    <div className={`qa-card ${isExpanded ? 'expanded' : ''}`} onClick={onClick}>
      <div className="qa-card-header">
        <h4 className="qa-question-text">{item.question}</h4>
        <div className="qa-meta-tags">
          <span className="qa-meta-topic">{item.category}</span>
          <span className="qa-meta-book" style={{ color: book.color }}>{book.name}</span>
        </div>
      </div>

      {isExpanded && (
        <div className="qa-card-answer" onClick={e => e.stopPropagation()}>
          <div className="qa-rule-line" />
          <p className="qa-hadith-text">{item["hadith-eng"]}</p>
          <div className="qa-card-footer">
            <span className="qa-reference">
              <BookOpen size={14} /> {item.reference}
            </span>
            {item.grade && <span className="qa-grade">{item.grade}</span>}
            {item.category !== item.sub_category && (
              <span className="qa-sub-category-tag">{item.sub_category}</span>
            )}
          </div>
          <button 
            className="qa-jump-btn"
            onClick={(e) => { e.stopPropagation(); onJumpToReference(item); }}
          >
            <ExternalLink size={14} /> View in Hadith Book
          </button>
        </div>
      )}

      {!isExpanded && (
        <div className="qa-card-tap-hint">Tap to see answer</div>
      )}
    </div>
  );
};

QACard.propTypes = {
  item: PropTypes.object.isRequired,
  isExpanded: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  onJumpToReference: PropTypes.func.isRequired,
  getBookInfo: PropTypes.func.isRequired,
};

const SearchQACard = ({ item, onLoadFull, getBookInfo }) => {
  const [expanded, setExpanded] = useState(false);
  const [fullItem, setFullItem] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const book = getBookInfo(item.id);

  const handleExpand = async () => {
    if (expanded) {
      setExpanded(false);
      return;
    }
    
    if (fullItem) {
      setExpanded(true);
      return;
    }
    
    setLoading(true);
    try {
      const data = await onLoadFull();
      setFullItem(data);
      setExpanded(true);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className={`qa-card ${expanded ? 'expanded' : ''}`} onClick={handleExpand}>
      <div className="qa-card-header">
        <h4 className="qa-question-text">{item.question}</h4>
        <div className="qa-meta-tags">
          <span className="qa-meta-topic">{item.category}</span>
          <span className="qa-meta-book" style={{ color: book.color }}>{book.name}</span>
        </div>
      </div>

      {expanded && fullItem && (
        <div className="qa-card-answer" onClick={e => e.stopPropagation()}>
          <div className="qa-rule-line" />
          <p className="qa-hadith-text">{fullItem["hadith-eng"]}</p>
          <div className="qa-card-footer">
            <span className="qa-reference">
              <BookOpen size={14} /> {fullItem.reference}
            </span>
            {fullItem.grade && <span className="qa-grade">{fullItem.grade}</span>}
            {fullItem.sub_category && fullItem.category !== fullItem.sub_category && (
              <span className="qa-sub-category-tag">{fullItem.sub_category}</span>
            )}
          </div>
          <button 
            className="qa-jump-btn"
            onClick={(e) => { 
              e.stopPropagation(); 
              const match = fullItem.reference?.match(/Sahih\s+(?:al-)?(\w+)\s+(\d+)/i);
              if (match) {
                const bookId = match[1].toLowerCase();
                const hadithNum = match[2];
                const book = HADITH_BOOKS[bookId];
                if (book) {
                  const chapter = fullItem.id.split('-')[1] || '1';
                  window.open(`/hadith/${bookId}/${chapter}?hadith=${hadithNum}`, '_blank');
                }
              }
            }}
          >
            <ExternalLink size={14} /> View in Hadith Book
          </button>
        </div>
      )}

      {loading && <div className="qa-card-loading"><Loader2 className="spin-icon" /></div>}
      
      {!expanded && !loading && (
        <div className="qa-card-tap-hint">Tap to see answer</div>
      )}
    </div>
  );
};

SearchQACard.propTypes = {
  item: PropTypes.object.isRequired,
  onLoadFull: PropTypes.func.isRequired,
  getBookInfo: PropTypes.func.isRequired,
};

function getCategoryIcon(categoryName) {
  const icons = {
    'Faith & Belief': '✱',
    'Prophetic Biography': '☔',
    'Prayer': '🕋',
    'Fasting': '🌙',
    'Zakat': '💰',
    'Hajj & Umrah': '🕱',
    'Marriage & Family': '💑',
    'Manners & Ethics': '🤝',
    'Quran & Tafseer': '📖',
    'Supplication & Worship': '🙇',
    'Afterlife & Eschatology': '⚱',
    'Justice & Law': '⚖',
    'Food & Dietary Laws': '🍖',
    'Islamic History': '📜',
    'Health & Medicine': '🏥',
    'Knowledge & Education': '📚',
    'Trade & Finance': '💼',
    'Jihad & Warfare': '⚔',
    'Funeral & Death': '🕯',
  };
  return icons[categoryName] || '📋';
}

export default QASearch;
