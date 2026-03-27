"use client";
/* eslint-disable */
import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import ReactDOM from "react-dom";
import Link from "next/link";
import { Search, BookOpen, User, Info, ChevronDown } from "lucide-react";
import { HADITH_BOOKS } from "../data/hadithData";
import {
  getBookStats,
  getAllNarrators,
  searchAllChapters,
} from "../services/hadithService";
import PageHeader from "./PageHeader";
import "./Hadith.css";
import SearchInput from "./SearchInput";

const NARRATORS_PER_SECTION = 20;
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#".split("");

const HadithCountInfo = ({ stats }) => {
  const [pos, setPos] = useState(null); // null = hidden
  const triggerRef = React.useRef(null);

  if (!stats || stats.totalRecords === 0) return null;

  const {
    chapterWiseCount,
    canonicalCount,
    totalRecords,
    hasDiscrepancy,
    decimalCount,
    gapCount,
  } = stats;
  const min = Math.min(chapterWiseCount, canonicalCount, totalRecords);
  const max = Math.max(chapterWiseCount, canonicalCount, totalRecords);

  const show = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const popupWidth = 260;
    let left = rect.left + rect.width / 2 - popupWidth / 2;
    if (left < 8) left = 8;
    if (left + popupWidth > window.innerWidth - 8)
      left = window.innerWidth - popupWidth - 8;
    setPos({
      bottom: window.innerHeight - rect.top + 8,
      left,
      width: popupWidth,
    });
  };

  const hide = () => setPos(null);

  const toggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (pos) {
      hide();
    } else {
      show();
    }
  };

  const popup =
    pos &&
    ReactDOM.createPortal(
      <div
        className="hadith-info-popup"
        style={{
          position: "fixed",
          bottom: pos.bottom,
          left: pos.left,
          width: pos.width,
          zIndex: 9999,
        }}
        onMouseLeave={hide}
        onClick={(e) => e.stopPropagation()}
      >
        Different counting methods yield different totals — traditional
        numbering, chapter-wise sums, and recorded entries each differ slightly.
      </div>,
      document.getElementById("root") || document.body,
    );

  return (
    <span className="hadith-count-range-wrap">
      <span className="stat-badge hadiths">
        {hasDiscrepancy
          ? `${min.toLocaleString()}–${max.toLocaleString()} Hadiths`
          : `${totalRecords.toLocaleString()} Hadiths`}
      </span>
      {hasDiscrepancy && (
        <span
          ref={triggerRef}
          className="hadith-info-trigger"
          onMouseEnter={show}
          onMouseLeave={hide}
          onClick={toggle}
        >
          <Info size={13} />
          {popup}
        </span>
      )}
    </span>
  );
};

const HadithBooks = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("books"); // 'books' | 'narrators'
  const [narrators, setNarrators] = useState([]);
  const [narratorsLoading, setNarratorsLoading] = useState(false);
  const [expandedLetters, setExpandedLetters] = useState({});
  const sectionRefs = useRef({});

  // Chapters View Mode State
  const [chapterResults, setChapterResults] = useState([]);
  const [isChapterSearching, setIsChapterSearching] = useState(false);
  const chapterSearchRequestRef = useRef(0);
  const normalizedSearchTerm = searchTerm.trim();

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
    if (viewMode === "narrators" && narrators.length === 0) {
      setNarratorsLoading(true);
      getAllNarrators()
        .then((data) => {
          setNarrators(data);
          setNarratorsLoading(false);
        })
        .catch(() => setNarratorsLoading(false));
    }
  }, [viewMode]);

  // Handle Chapter Search
  useEffect(() => {
    if (viewMode !== "chapters") {
      setIsChapterSearching(false);
      return;
    }

    const query = searchTerm.trim();
    if (!query) {
      chapterSearchRequestRef.current += 1; // invalidate pending results
      setChapterResults([]);
      setIsChapterSearching(false);
      return;
    }

    const requestId = ++chapterSearchRequestRef.current;
    const timer = setTimeout(() => {
      setIsChapterSearching(true);
      searchAllChapters(query)
        .then((res) => {
          if (requestId !== chapterSearchRequestRef.current) return;
          setChapterResults(res);
          setIsChapterSearching(false);
        })
        .catch(() => {
          if (requestId !== chapterSearchRequestRef.current) return;
          setChapterResults([]);
          setIsChapterSearching(false);
        });
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(timer);
      // Invalidate this pending request when deps change before resolve.
      chapterSearchRequestRef.current += 1;
    };
  }, [searchTerm, viewMode]);

  const allBooks = Object.values(HADITH_BOOKS);

  const filteredBooks = useMemo(() => {
    if (!searchTerm.trim()) return allBooks;
    const term = searchTerm.toLowerCase();
    return allBooks.filter(
      (b) =>
        b.name.toLowerCase().includes(term) ||
        b.arabic.includes(term) ||
        b.author.toLowerCase().includes(term),
    );
  }, [searchTerm]);

  // Group narrators by first letter for alphabet view
  const narratorsByLetter = useMemo(() => {
    const groups = {};
    for (const letter of ALPHABET) groups[letter] = [];
    for (const n of narrators) {
      const first = (n.canonical || "").charAt(0).toUpperCase();
      const letter = /[A-Z]/.test(first) ? first : "#";
      groups[letter].push(n);
    }
    // Sort within each letter by count descending
    for (const letter of ALPHABET) {
      groups[letter].sort((a, b) => b.totalCount - a.totalCount);
    }
    return groups;
  }, [narrators]);

  const filteredNarrators = useMemo(() => {
    if (!searchTerm.trim()) return narrators;
    const term = searchTerm.toLowerCase();
    return narrators.filter(
      (n) =>
        n.canonical.toLowerCase().includes(term) ||
        n.aliases?.some((a) => a.toLowerCase().includes(term)),
    );
  }, [narrators, searchTerm]);

  // Group filtered narrators by letter (for search mode)
  const filteredByLetter = useMemo(() => {
    if (!searchTerm.trim()) return narratorsByLetter;
    const groups = {};
    for (const letter of ALPHABET) groups[letter] = [];
    for (const n of filteredNarrators) {
      const first = (n.canonical || "").charAt(0).toUpperCase();
      const letter = /[A-Z]/.test(first) ? first : "#";
      groups[letter].push(n);
    }
    return groups;
  }, [filteredNarrators, searchTerm, narratorsByLetter]);

  const scrollToLetter = useCallback((letter) => {
    const el = sectionRefs.current[letter];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const toggleLetter = useCallback((letter) => {
    setExpandedLetters((prev) => ({ ...prev, [letter]: !prev[letter] }));
  }, []);

  const handleSearchTermChange = useCallback((e) => {
    const nextValue = e.target.value;

    // Immediate hard reset when input is cleared to avoid stale card flash.
    if (!nextValue.trim()) {
      chapterSearchRequestRef.current += 1;
      setChapterResults([]);
      setIsChapterSearching(false);
    }

    setSearchTerm(nextValue);
  }, []);

  const sahihBooks = filteredBooks.filter((b) => b.isSahihSittah);
  const otherBooks = filteredBooks.filter((b) => !b.isSahihSittah);

  const renderBookCard = (book) => {
    const bookStats = stats[book.id] || {};
    return (
      <Link
        href={book.id ? `/hadith/${book.id}` : "#"}
        key={book.id}
        className="hadith-book-card-link"
      >
        <div
          className={`hadith-book-card ${book.isSahihSittah ? "sahih-sittah" : ""}`}
        >
          <div
            className="book-card-accent"
            style={{ background: book.color }}
          />
          <div className="book-card-content">
            <div
              className="book-card-icon-wrap"
              style={{ background: book.color + "18", color: book.color }}
            >
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
                    <span className="stat-badge chapters">
                      {bookStats.totalChapters} Chapters
                    </span>
                  )}
                  <HadithCountInfo stats={bookStats} />
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="">
      <PageHeader
        title="Hadith Collections"
        subtitle="Browse the authentic collections of Prophetic traditions"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Hadith", path: "/hadith" },
        ]}
      />

      {/* View Mode Tabs */}
      <div className="hadith-view-tabs">
        <button
          className={`view-tab ${viewMode === "books" ? "active" : ""}`}
          onClick={() => {
            setViewMode("books");
            setSearchTerm("");
          }}
        >
          <BookOpen size={16} />
          Book-wise
        </button>
        <button
          className={`view-tab ${viewMode === "chapters" ? "active" : ""}`}
          onClick={() => {
            setViewMode("chapters");
            setSearchTerm("");
          }}
        >
          <BookOpen size={16} />
          Chapter-wise Search
        </button>
        <button
          className={`view-tab ${viewMode === "narrators" ? "active" : ""}`}
          onClick={() => {
            setViewMode("narrators");
            setSearchTerm("");
          }}
        >
          <User size={16} />
          Narrator-wise
        </button>
      </div>

      <SearchInput
        onSubmit={(e) => e.preventDefault()}
        value={searchTerm}
        onChange={handleSearchTermChange}
        placeholder="Search Hadith by name, author, or Arabic title..."
        className="topbar-search-form mobile-menu-search mb-15"
        iconSize={18}
      ></SearchInput>

      {/* ───── Books View ───── */}
      {viewMode === "books" && (
        <>
          {sahihBooks.length > 0 && (
            <section className="mb-10 hadith-section-featured">
              <div className="section-label">
                <span className="section-label-icon">⭐</span>
                <h2>Sahih Sittah</h2>
                <span className="section-subtitle">
                  The Six Authentic Collections
                </span>
              </div>
              <div className="hadith-books-grid sahih-grid">
                {sahihBooks.map(renderBookCard)}
              </div>
            </section>
          )}

          {otherBooks.length > 0 && (
            <section className="mb-10 hadith-section-featured">
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
              <p>
                No books matching "<strong>{searchTerm}</strong>"
              </p>
            </div>
          )}
        </>
      )}

      {/* ───── Chapters View ───── */}
      {viewMode === "chapters" && (
        <React.Fragment key={normalizedSearchTerm ? "chapters-searching" : "chapters-empty"}>
          {!normalizedSearchTerm ? (
            <div className="hadith-empty-state hadith-empty-state--global-search">
              <div className="global-search-empty-icon-wrap" aria-hidden="true">
                <Search size={42} />
              </div>
              <h3 className="global-search-empty-title">
                Global Chapter Search
              </h3>
              <p className="global-search-empty-text">
                Type a keyword in English, Arabic, Bengali, etc. to search
                across all book chapters globally.
              </p>
            </div>
          ) : isChapterSearching ? (
            <div className="hadith-loading">Searching chapters globally...</div>
          ) : chapterResults.length === 0 ? (
            <div className="hadith-empty-state">
              <p>
                No chapters matching "<strong>{searchTerm}</strong>"
              </p>
            </div>
          ) : (
            <div className="chapters-grid">
              {chapterResults.map((chapter) => (
                <Link
                  href={
                    chapter.bookId && chapter.id
                      ? `/hadith/${chapter.bookId}/${chapter.id}`
                      : "#"
                  }
                  key={`${chapter.bookId}-${chapter.id}`}
                  className="chapter-card-grid chapter-card-grid--search"
                  style={{ "--chapter-accent": chapter.bookColor }}
                >
                  <div className="chapter-card-header-row">
                    <span
                      className="chapter-num-badge chapter-num-search-badge"
                    >
                      Ch. {chapter.id}
                    </span>
                    <span
                      className="chapter-hadith-badge"
                      style={{
                        background: "var(--color-bg-main)",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      {chapter.bookName}
                    </span>
                  </div>
                  <h4 className="chapter-card-title">
                    {chapter.name || `Chapter ${chapter.id}`}
                  </h4>
                  <div className="chapter-card-range">
                    {chapter.hadithCount > 0 && (
                      <span>{chapter.hadithCount} Hadiths</span>
                    )}
                    {chapter.firstHadith && chapter.lastHadith && (
                      <span style={{ marginLeft: "auto" }}>
                        #{chapter.firstHadith}–{chapter.lastHadith}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </React.Fragment>
      )}

      {/* ───── Narrators View ───── */}
      {viewMode === "narrators" && (
        <>
          {narratorsLoading ? (
            <div className="hadith-loading">Loading narrators...</div>
          ) : (
            <>
              <div className="narrators-summary">
                <span>
                  {filteredNarrators.length} narrators found across{" "}
                  {Object.keys(HADITH_BOOKS).length} books
                </span>
              </div>

              {/* Alphabet Navigation Bar */}
              <div className="narrator-alpha-bar">
                {ALPHABET.map((letter) => {
                  const count = filteredByLetter[letter]?.length || 0;
                  return (
                    <button
                      key={letter}
                      className={`narrator-alpha-letter ${count === 0 ? "disabled" : ""}`}
                      disabled={count === 0}
                      onClick={() => scrollToLetter(letter)}
                      title={`${count} narrator${count !== 1 ? "s" : ""}`}
                    >
                      {letter}
                      {count > 0 && (
                        <span className="alpha-count">{count}</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Letter Sections */}
              {ALPHABET.map((letter) => {
                const items = filteredByLetter[letter];
                if (!items || items.length === 0) return null;
                const isExpanded = expandedLetters[letter];
                const visible = isExpanded
                  ? items
                  : items.slice(0, NARRATORS_PER_SECTION);
                const hasMore = items.length > NARRATORS_PER_SECTION;

                return (
                  <section
                    key={letter}
                    className="narrator-letter-section"
                    ref={(el) => (sectionRefs.current[letter] = el)}
                  >
                    <div className="narrator-letter-header">
                      <span className="narrator-letter-char">{letter}</span>
                      <span className="narrator-letter-count">
                        {items.length} narrator{items.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="narrators-grid">
                      {visible.map((narrator) => (
                        <Link
                          key={narrator.id}
                          href={
                            narrator.id
                              ? `/hadith/narrator/${narrator.id}`
                              : "#"
                          }
                          className="narrator-card"
                          style={{ textDecoration: "none" }}
                        >
                          <div className="narrator-avatar">
                            <User size={18} />
                          </div>
                          <div className="narrator-info">
                            <h4 className="narrator-name">
                              {narrator.canonical}
                            </h4>
                            {(narrator.grade || narrator.death) && (
                              <div className="narrator-meta-row">
                                {narrator.grade && (
                                  <h6 className="narrator-meta-item">
                                    {narrator.grade}
                                  </h6>
                                )}
                                {narrator.death && (
                                  <h6 className="narrator-meta-item">
                                    {narrator.death}
                                  </h6>
                                )}
                              </div>
                            )}
                            <span className="narrator-count">
                              {narrator.totalCount.toLocaleString()} Hadiths
                            </span>
                            <div className="narrator-books narrator-books-list">
                              {narrator.books.map((bId) => {
                                const book = HADITH_BOOKS[bId];
                                if (!book) return null;
                                const count = narrator.hadiths.filter(
                                  (h) => h.book === bId,
                                ).length;
                                return (
                                  <div key={bId} className="narrator-book-row">
                                    <span className="narrator-book-title">
                                      {book.name.split(" ").pop()}
                                    </span>
                                    <span className="narrator-book-count">
                                      {count}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    {hasMore && (
                      <button
                        className="narrator-show-more"
                        onClick={() => toggleLetter(letter)}
                      >
                        {isExpanded
                          ? "Show less"
                          : `Show all ${items.length} narrators`}
                        <ChevronDown
                          size={14}
                          className={isExpanded ? "rotated" : ""}
                        />
                      </button>
                    )}
                  </section>
                );
              })}

              {filteredNarrators.length === 0 && searchTerm && (
                <div className="hadith-empty-state">
                  <p>
                    No narrators matching "<strong>{searchTerm}</strong>"
                  </p>
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
