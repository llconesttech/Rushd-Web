import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Search, Hash, Loader2, BookOpen, AlertCircle, Bookmark } from 'lucide-react';
import PageHeader from './PageHeader';
import { HADITH_BOOKS } from '../data/hadithData';
import './Hadith.css';

const QASearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [topics, setTopics] = useState([]);
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState(null);

  // For actual questions
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  // Load macro topics initially
  useEffect(() => {
    fetch('/data/hadith-qa/qa_macro_index.json')
      .then(res => res.json())
      .then(data => {
        setTopics(data);
        setLoadingTopics(false);
      })
      .catch(() => setLoadingTopics(false));
  }, []);

  // Load full question index when searching
  const [fullIndex, setFullIndex] = useState(null);
  const [loadingIndex, setLoadingIndex] = useState(false);

  useEffect(() => {
    if (!searchTerm.trim() || fullIndex || loadingIndex) return;
    setLoadingIndex(true);
    fetch('/data/hadith-qa/qa_search_index.json')
      .then(res => res.json())
      .then(data => {
        setFullIndex(data);
        setLoadingIndex(false);
      })
      .catch(() => setLoadingIndex(false));
  }, [searchTerm, fullIndex, loadingIndex]);

  const filteredTopics = useMemo(() => {
    if (!searchTerm.trim()) return topics;
    const term = searchTerm.toLowerCase();
    return topics.filter(t => t.name.toLowerCase().includes(term));
  }, [topics, searchTerm]);

  const displayQuestions = useMemo(() => {
    if (!searchTerm.trim()) return [];
    if (!fullIndex) return [];
    const term = searchTerm.toLowerCase();

    // Exact topic match first, then string search
    let results = fullIndex.filter(q =>
      q.q.toLowerCase().includes(term) || q.t.toLowerCase().includes(term)
    );
    // Limit to 50 results so browser doesn't freeze
    return results.slice(0, 50);
  }, [fullIndex, searchTerm]);

  const handleTopicClick = async (topic) => {
    if (selectedTopic === topic.name) {
      setSelectedTopic(null);
      setQuestions([]);
      return;
    }

    setSelectedTopic(topic.name);
    setLoadingQuestions(true);
    setQuestions([]);

    try {
      let loaded = [];
      // Fetch chunks based on topic refs
      const fetchPromises = [];
      for (const [book, chapters] of Object.entries(topic.refs)) {
        for (const ch of Object.keys(chapters)) {
          fetchPromises.push(
            fetch(`/data/hadith-qa/${book}/${ch}.json`).then(r => r.json())
          );
        }
      }

      const results = await Promise.allSettled(fetchPromises);
      for (const res of results) {
        if (res.status === 'fulfilled') {
          loaded = loaded.concat(res.value);
        } else {
          console.warn("Failed to load a QA chunk", res.reason);
        }
      }
      // Sort by Book then ID
      setQuestions(loaded);
    } catch (e) {
      console.error(e);
    }
    setLoadingQuestions(false);
  };

  return (
    <div className="container hadith-container">
      <PageHeader
        title="Islamic Q&A Knowledge Base"
        subtitle="Search 68,000+ authentic questions & answers categorized by topic"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Q&A Search', path: '/qa-search' }
        ]}
      />

      <div className="hadith-search-bar" style={{ marginTop: '2rem', marginBottom: '1rem' }}>
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search topics (e.g., Fasting, Wudu) or specific questions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="hadith-search-input"
        />
        {(loadingIndex) && <Loader2 size={18} className="spin-icon" style={{ opacity: 0.5 }} />}
      </div>

      {/* Display Top Topics if no search */}
      {(!searchTerm.trim() && !selectedTopic) && (
        <div className="qa-topics-section">
          <h2 className="section-title"><Hash size={20} /> Browse Categories</h2>
          {loadingTopics ? (
            <div className="hadith-loading">Loading Categories...</div>
          ) : (
            <div className="qa-topics-grid">
              {topics.map(topic => (
                <button key={topic.name} onClick={() => handleTopicClick(topic)} className="qa-topic-card cursor-pointer">
                  <h3 className="qa-topic-title">{topic.name}</h3>
                  <span className="qa-topic-count">{topic.total.toLocaleString()} Q&A</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Selected Topic Full View */}
      {selectedTopic && !searchTerm.trim() && (
        <div className="qa-selected-topic">
          <div className="qa-topic-header">
            <h2><Bookmark size={24} style={{ marginRight: '0.5rem' }} /> {selectedTopic}</h2>
            <button className="search-clear-btn" onClick={() => setSelectedTopic(null)}>Close Topic</button>
          </div>

          {loadingQuestions ? (
            <div className="hadith-loading"><Loader2 className="spin-icon" /> Loading questions for {selectedTopic}...</div>
          ) : (
            <div className="qa-questions-list">
              {questions.map((q, idx) => (
                <QACard key={`${q.reference}-${idx}`} q={q} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Search Results */}
      {searchTerm.trim() && (
        <div className="qa-search-results">
          {/* Topics matching term */}
          {filteredTopics.length > 0 && (
            <div className="qa-inline-topics">
              <h3 className="section-title" style={{ fontSize: '1rem', marginTop: 0 }}>Matching Topics</h3>
              <div className="qa-pill-container">
                {filteredTopics.slice(0, 8).map(t => (
                  <button key={t.name} onClick={() => { setSearchTerm(''); handleTopicClick(t); }} className="qa-topic-pill">
                    {t.name} <span className="pill-count">{t.total.toLocaleString()}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <h3 className="section-title">Search Results</h3>
          {fullIndex ? (
            displayQuestions.length > 0 ? (
              <div className="qa-questions-list">
                {displayQuestions.map(idxItem => (
                  <LazyQACard key={idxItem.id} indexItem={idxItem} />
                ))}
                {displayQuestions.length === 50 && (
                  <div className="hadith-empty-state"><AlertCircle size={20} /> Too many results, showing top 50. Please refine your search.</div>
                )}
              </div>
            ) : (
              <div className="hadith-empty-state">No questions found matching &quot;{searchTerm}&quot;</div>
            )
          ) : (
            <div className="hadith-loading">Searching vast knowledge base...</div>
          )}
        </div>
      )}
    </div>
  );
};

// Lazy loads a specific chunk question if searched from the index
const LazyQACard = ({ indexItem }) => {
  const [fullQ, setFullQ] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const fetchFull = () => {
    if (fullQ) { setExpanded(!expanded); return; }
    fetch(`/data/hadith-qa/${indexItem.b}/${indexItem.ch}.json`)
      .then(r => r.json())
      .then(data => {
        const exactItem = data.find(d => d.id === indexItem.id || d.question === indexItem.q);
        if (exactItem) {
          setFullQ(exactItem);
          setExpanded(true);
        }
      });
  };

  const bookLabel = HADITH_BOOKS[indexItem.b]?.name || indexItem.b;

  return (
    <div className="qa-card" onClick={fetchFull}>
      <div className="qa-card-header">
        <h4 className="qa-question-text">{indexItem.q}</h4>
        <div className="qa-meta-tags">
          <span className="qa-meta-topic">{indexItem.t}</span>
          <span className="qa-meta-book">{bookLabel}</span>
        </div>
      </div>

      {expanded && fullQ && (
        <div className="qa-card-answer" onClick={e => e.stopPropagation()}>
          <div className="qa-rule-line" />
          <p className="qa-hadith-text">{fullQ["hadith-eng"]}</p>
          <div className="qa-card-footer">
            <span className="qa-reference"><BookOpen size={14} /> {fullQ.reference}</span>
            {fullQ.grade && <span className="qa-grade">{fullQ.grade}</span>}
          </div>
        </div>
      )}

      {!expanded && (
        <div className="qa-card-tap-hint">Tap to see answer</div>
      )}
    </div>
  );
};

LazyQACard.propTypes = {
  indexItem: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    b: PropTypes.string.isRequired,
    ch: PropTypes.string.isRequired,
    q: PropTypes.string.isRequired,
    t: PropTypes.string.isRequired,
  }).isRequired,
};

// Renders an already loaded question
const QACard = ({ q }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="qa-card" onClick={() => setExpanded(!expanded)}>
      <div className="qa-card-header">
        <h4 className="qa-question-text">{q.question}</h4>
        <div className="qa-meta-tags">
          <span className="qa-meta-book">{q.reference?.split(',')[0]}</span>
        </div>
      </div>

      {expanded && (
        <div className="qa-card-answer" onClick={e => e.stopPropagation()}>
          <div className="qa-rule-line" />
          <p className="qa-hadith-text">{q["hadith-eng"]}</p>
          <div className="qa-card-footer">
            <span className="qa-reference"><BookOpen size={14} /> {q.reference}</span>
            {q.grade && <span className="qa-grade">{q.grade}</span>}
          </div>
        </div>
      )}

      {!expanded && (
        <div className="qa-card-tap-hint">Tap to see answer</div>
      )}
    </div>
  );
};

QACard.propTypes = {
  q: PropTypes.shape({
    question: PropTypes.string.isRequired,
    reference: PropTypes.string.isRequired,
    "hadith-eng": PropTypes.string.isRequired,
    grade: PropTypes.string,
  }).isRequired,
};

export default QASearch;
