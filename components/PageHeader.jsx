"use client";
import { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import PropTypes from "prop-types";
import { ChevronRight, ChevronLeft } from "lucide-react";
import "./PageHeader.css";
import ReadingProgress from "./ReadingProgress";

const PageHeader = ({
  breadcrumbs = [],
  title,
  subtitle = "",
  badge = "",
  actions = null,
  readingProgressSurah = null,
  onBack = null,
  isScrolled: externalIsScrolled = undefined,
}) => {
  const backLink =
    breadcrumbs.length > 1 ? breadcrumbs[breadcrumbs.length - 2].path : "/";

  const [internalIsScrolled, setInternalIsScrolled] = useState(false);
  const isScrolled =
    externalIsScrolled !== undefined ? externalIsScrolled : internalIsScrolled;

  useEffect(() => {
    if (externalIsScrolled !== undefined) return; // Skip internal logic if controlled externally

    const scroller = document.querySelector(".reader-main-content") || window;
    const handleScroll = () => {
      const scrollTop =
        scroller === window ? window.scrollY : scroller.scrollTop;
      setInternalIsScrolled((prev) => {
        // The header physically shrinks by ~50-60px.
        // Setting the gap to 100px (120 - 20) ensures no layout thrashing loops.
        if (!prev && scrollTop > 120) return true;
        if (prev && scrollTop < 20) return false;
        return prev;
      });
    };

    scroller.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();

    return () => scroller.removeEventListener("scroll", handleScroll);
  }, [externalIsScrolled]);

  return (
    <div className={`page-header ${isScrolled ? "scrolled" : ""}`}>
      <div className="page-header-nav">
        {typeof onBack === "function" ? (
          <button
            type="button"
            className="ph-back-btn"
            title="Go Back"
            onClick={onBack}
          >
            <ChevronLeft size={18} />
          </button>
        ) : (
          <Link href={backLink} className="ph-back-btn" title="Go Back">
            <ChevronLeft size={18} />
          </Link>
        )}

        <nav className="ph-breadcrumbs">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <Fragment key={index}>
                {index > 0 && (
                  <ChevronRight size={14} className="ph-crumb-separator" />
                )}
                {isLast ? (
                  <span className="ph-crumb-current">{crumb.label}</span>
                ) : (
                  <Link href={crumb.path} className="ph-crumb-link">
                    {crumb.label}
                  </Link>
                )}
              </Fragment>
            );
          })}
        </nav>
      </div>

      <div className="page-header-content">
        <div className="ph-titles">
          <h1 className="ph-title">
            {title}
            {badge && <span className="ph-title-badge">{badge}</span>}
          </h1>
          {readingProgressSurah && (
            <ReadingProgress
              surah={readingProgressSurah}
              className="ph-inline-reading-bar"
            />
          )}
          {subtitle && <p className="ph-subtitle">{subtitle}</p>}
        </div>

        {actions && <div className="ph-actions">{actions}</div>}
      </div>
    </div>
  );
};

PageHeader.propTypes = {
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    }),
  ),
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  badge: PropTypes.node,
  actions: PropTypes.node,
  onBack: PropTypes.func,
  readingProgressSurah: PropTypes.shape({
    ayahs: PropTypes.arrayOf(
      PropTypes.shape({
        numberInSurah: PropTypes.number,
        page: PropTypes.number,
        juz: PropTypes.number,
        hizbQuarter: PropTypes.number,
      }),
    ),
  }),
  isScrolled: PropTypes.bool,
};

export default PageHeader;
