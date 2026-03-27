"use client";
import React, { useState, useEffect, useMemo } from "react";
import ReactDOM from "react-dom";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BookOpen, Info } from "lucide-react";
import { HADITH_BOOKS, HADITH_LANGUAGES } from "../data/hadithData";
import {
  getBookChapters,
  getAvailableLanguages,
  getBookStats,
} from "../services/hadithService";
import PageHeader from "./PageHeader";
import "./Hadith.css";
import SearchInput from "./SearchInput";
import ThemedSelect from "./UI/Select/ThemedSelect";

const HadithChapters = () => {
  const { bookId } = useParams();
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLang, setSelectedLang] = useState("eng");
  const [availableLangs, setAvailableLangs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [bookStats, setBookStats] = useState(null);
  const [countPos, setCountPos] = useState(null);
  const countTriggerRef = React.useRef(null);

  const showCount = () => {
    if (!countTriggerRef.current) return;
    const rect = countTriggerRef.current.getBoundingClientRect();
    const popupWidth = 260;
    let left = rect.left + rect.width / 2 - popupWidth / 2;
    if (left < 8) left = 8;
    if (left + popupWidth > window.innerWidth - 8)
      left = window.innerWidth - popupWidth - 8;
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

        const hasEng = langs.find((l) => l.code === "eng");
        const fallback = langs.find((l) => l.code !== "ara") || langs[0];
        const langToUse = hasEng ? "eng" : fallback?.code || "ara";
        setSelectedLang(langToUse);

        const ch = await getBookChapters(bookId, langToUse);
        setChapters(ch);
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    };
    load();
    getBookStats(bookId)
      .then(setBookStats)
      .catch(() => {});
  }, [bookId]);

  useEffect(() => {
    if (!loading && selectedLang) {
      const reload = async () => {
        try {
          const ch = await getBookChapters(bookId, selectedLang);
          setChapters(ch);
        } catch {
          /* keep existing */
        }
      };
      reload();
    }
  }, [selectedLang, loading, bookId]);

  const filteredChapters = useMemo(() => {
    if (!searchTerm.trim()) return chapters;
    const term = searchTerm.toLowerCase();

    const isNum = /^\d+$/.test(term);
    const searchNum = isNum ? parseInt(term, 10) : null;

    return chapters.filter((ch) => {
      // Basic text or exact ID match
      if (ch.name?.toLowerCase().includes(term) || ch.id.toString() === term) {
        return true;
      }

      // Chapter number match (exact)
      if (isNum && ch.id === searchNum) {
        return true;
      }

      // Range match for hadith number (exact match within range)
      if (isNum) {
        if (ch.firstHadith && ch.lastHadith) {
          const first =
            typeof ch.firstHadith === "number"
              ? ch.firstHadith
              : parseFloat(ch.firstHadith);
          const last =
            typeof ch.lastHadith === "number"
              ? ch.lastHadith
              : parseFloat(ch.lastHadith);
          if (!isNaN(first) && !isNaN(last)) {
            // Check exact hadith number match
            if (
              searchNum >= Math.floor(first) &&
              searchNum <= Math.ceil(last)
            ) {
              return true;
            }
            // Check if searchNum matches ending pattern (e.g., 69 matches 1069, 2069, etc.)
            const searchStr = searchNum.toString();
            const rangeSize = Math.ceil(last) - Math.floor(first) + 1;
            if (rangeSize >= 100) {
              // For large chapters, check suffix match
              for (let n = Math.floor(first); n <= Math.ceil(last); n++) {
                if (n.toString().endsWith(searchStr)) {
                  return true;
                }
              }
            }
          }
        }

        // Arabic hadith number match - exact or suffix match
        if (ch.firstArabic && ch.lastArabic && ch.firstArabic !== 0) {
          const firstAra =
            typeof ch.firstArabic === "number"
              ? ch.firstArabic
              : parseFloat(ch.firstArabic);
          const lastAra =
            typeof ch.lastArabic === "number"
              ? ch.lastArabic
              : parseFloat(ch.lastArabic);
          if (!isNaN(firstAra) && !isNaN(lastAra)) {
            // Check exact Arabic hadith number
            if (
              searchNum >= Math.floor(firstAra) &&
              searchNum <= Math.ceil(lastAra)
            ) {
              return true;
            }
            // Check suffix match for Arabic numbers (e.g., 69 matches 1069, 2069, etc.)
            const searchStr = searchNum.toString();
            const rangeSize = Math.ceil(lastAra) - Math.floor(firstAra) + 1;
            if (rangeSize >= 100) {
              for (let n = Math.floor(firstAra); n <= Math.ceil(lastAra); n++) {
                if (n.toString().endsWith(searchStr)) {
                  return true;
                }
              }
            }
          }
        }
      }
      return false;
    });
  }, [chapters, searchTerm]);

  // Extract search number for use in render
  const isNum = /^\d+$/.test(searchTerm);
  const searchNum = isNum ? parseInt(searchTerm, 10) : null;

  const chapterWiseTotal = chapters.reduce(
    (sum, ch) => sum + ch.hadithCount,
    0,
  );
  const hasDiscrepancy = bookStats?.hasDiscrepancy;
  const countMin = hasDiscrepancy
    ? Math.min(
        bookStats.chapterWiseCount,
        bookStats.canonicalCount,
        bookStats.totalRecords,
      )
    : chapterWiseTotal;
  const countMax = hasDiscrepancy
    ? Math.max(
        bookStats.chapterWiseCount,
        bookStats.canonicalCount,
        bookStats.totalRecords,
      )
    : chapterWiseTotal;

  const langOptions = useMemo(
    () =>
      availableLangs.map((lang) => {
        const meta = HADITH_LANGUAGES[lang.code];
        return {
          value: lang.code,
          label: meta ? `${meta.name} (${meta.native})` : lang.language,
        };
      }),
    [availableLangs],
  );

  const selectedLangOption = useMemo(
    () => langOptions.find((o) => o.value === selectedLang) ?? null,
    [langOptions, selectedLang],
  );

  const langAccent = HADITH_BOOKS[bookId]?.color ?? "#0d5c63";

  if (!book) return <div className="container">Book not found</div>;

  return (
    <div className="mb-10">
      <PageHeader
        title={book.name}
        subtitle={book.arabic}
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Hadith", path: "/hadith" },
          { label: book.name, path: `/hadith/${bookId}` },
        ]}
      />

      {/* Book Header Card */}
      <div className="hadith-toolbar">
        <div className="book-meta-row">
          <div className="book-meta-icon" style={{ background: book.color }}>
            <BookOpen size={24} color="#fff" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="book-title-big">{book.name}</h2>{" "}
              {book.isSahihSittah && (
                <span className="sahih-badge-inline">Sahih Sittah</span>
              )}
            </div>
            <p className="book-author-big">
              by {book.author} · {chapters.length} Chapters ·{" "}
              <span className="hadith-count-inline-wrap">
                {hasDiscrepancy
                  ? `${countMin.toLocaleString()}–${countMax.toLocaleString()} Hadiths`
                  : `${chapterWiseTotal.toLocaleString()} Hadiths`}
                {hasDiscrepancy && (
                  <span
                    ref={countTriggerRef}
                    className="hadith-info-trigger inline"
                    onMouseEnter={showCount}
                    onMouseLeave={hideCount}
                    onClick={(e) => {
                      e.stopPropagation();
                      countPos ? hideCount() : showCount();
                    }}
                  >
                    <Info size={13} />
                    {countPos &&
                      ReactDOM.createPortal(
                        <div
                          className="hadith-info-popup"
                          style={{
                            position: "fixed",
                            bottom: countPos.bottom,
                            left: countPos.left,
                            width: countPos.width,
                            zIndex: 9999,
                          }}
                          onMouseLeave={hideCount}
                          onClick={(e) => e.stopPropagation()}
                        >
                          Different counting methods yield different totals —
                          traditional numbering, chapter-wise sums, and recorded
                          entries each differ slightly.
                        </div>,
                        document.getElementById("root") || document.body,
                      )}
                  </span>
                )}
              </span>
            </p>
          </div>
        </div>

        <ThemedSelect
          label="Translation"
          accent={langAccent}
          wrapperClassName="hadith-chapters-lang-field"
          instanceId="hadith-chapters-lang"
          options={langOptions}
          value={selectedLangOption}
          onChange={(opt) => opt && setSelectedLang(opt.value)}
          isSearchable
          isClearable={false}
          isDisabled={loading || langOptions.length === 0}
          placeholder=""
        />
      </div>

      <SearchInput
        onSubmit={(e) => e.preventDefault()}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search all chapters across books in any language..."
        className="topbar-search-form mobile-menu-search mb-15"
        iconSize={18}
      ></SearchInput>

      {loading && <div className="hadith-loading">Loading chapters...</div>}
      {error && <div className="hadith-error">Error: {error}</div>}

      {!loading && !error && (
        <div className="chapters-grid">
          {filteredChapters.map((chapter) => {
            // Check if search term matches a specific hadith number
            const isExactHadithMatch =
              isNum &&
              chapter.firstHadith &&
              chapter.lastHadith &&
              searchNum >= Math.floor(chapter.firstHadith) &&
              searchNum <= Math.ceil(chapter.lastHadith);

            // Check if search term matches a specific Arabic hadith number
            const isExactArabicMatch =
              isNum &&
              chapter.firstArabic &&
              chapter.lastArabic &&
              chapter.firstArabic !== 0 &&
              searchNum >= Math.floor(chapter.firstArabic) &&
              searchNum <= Math.ceil(chapter.lastArabic);

            const targetHadith =
              isExactHadithMatch || isExactArabicMatch ? searchNum : null;

            return (
              <Link
                href={`/hadith/${bookId}/${chapter.id}?lang=${selectedLang}${targetHadith ? `&hadith=${targetHadith}` : ""}`}
                key={chapter.id}
                className="chapter-card-grid"
              >
                <div className="chapter-card-header-row">
                  <span
                    className="chapter-num-badge"
                    style={{
                      backgroundColor: book.color + "18",
                      color: book.color,
                      borderColor: book.color + "40",
                    }}
                  >
                    {chapter.id}
                  </span>
                  <span className="chapter-hadith-badge">
                    {chapter.hadithCount} Hadiths
                  </span>
                </div>
                <h4 className="chapter-card-title">
                  {chapter.name || `Chapter ${chapter.id}`}
                </h4>
                <div className="chapter-card-range">
                  {chapter.firstHadith && chapter.lastHadith && (
                    <span>
                      #{chapter.firstHadith} – #{chapter.lastHadith}
                    </span>
                  )}
                  {chapter.firstArabic &&
                    chapter.lastArabic &&
                    chapter.firstArabic !== 0 && (
                      <span className="chapter-card-arabic-range">
                        Arabic: {chapter.firstArabic} – {chapter.lastArabic}
                      </span>
                    )}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {!loading && !error && filteredChapters.length === 0 && searchTerm && (
        <div className="hadith-empty-state">
          <p>
            No chapters matching &quot;<strong>{searchTerm}</strong>&quot;
          </p>
        </div>
      )}
    </div>
  );
};

export default HadithChapters;
