'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { BookOpen, X, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { TAJWEED_RULES } from '../data/tajweedData';
import './TajweedLegendDropdown.css';

const RULES_LIST = Object.values(TAJWEED_RULES).filter(r => r && r.label);

const TajweedLegendDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') setIsOpen(false); };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  // Prevent background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Render text for button
  const buttonContent = (
    <button
      className={`ph-action-btn ph-btn-outline tajweed-legend-btn ${isOpen ? 'active' : ''}`}
      onClick={() => setIsOpen(true)}
      title="Tajweed Color Guide"
    >
      <BookOpen size={16} className="tajweed-icon-colors" />
      <span className="tajweed-btn-text">Tajweed</span>
    </button>
  );

  const sheetContent = (
    <>
      <div className="tajweed-backdrop" onClick={() => setIsOpen(false)} />
      <div className="tajweed-sheet">
        <div className="tajweed-sheet-header">
          <h4>Tajweed Rules</h4>
          <button className="tajweed-close-btn" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="tajweed-sheet-grid">
          {RULES_LIST.map((rule) => (
            <Link
              key={rule.css}
              to={`/tajweed#rule-${rule.css}`}
              className="tajweed-sheet-item"
              onClick={() => setIsOpen(false)}
            >
              <span
                className="tajweed-sheet-dot"
                style={{ backgroundColor: rule.color }}
              />
              <span className="tajweed-sheet-label">{rule.label}</span>
            </Link>
          ))}
        </div>

        <div className="tajweed-sheet-footer">
          <Link href="/tajweed" className="tajweed-view-full-btn" onClick={() => setIsOpen(false)}>
            <span>View Full Guide</span>
            <ExternalLink size={16} />
          </Link>
        </div>
      </div>
    </>
  );

  return (
    <div className="tajweed-legend-container">
      {buttonContent}
      {isOpen && createPortal(sheetContent, document.body)}
    </div>
  );
};

export default TajweedLegendDropdown;
