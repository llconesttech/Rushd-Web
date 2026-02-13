import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { TAJWEED_RULES } from '../data/tajweedData';
import './TajweedFab.css';

const RULES_LIST = Object.values(TAJWEED_RULES).filter(r => r && r.label);

const TajweedFab = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') setIsOpen(false); };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="tajweed-backdrop" onClick={() => setIsOpen(false)} />
      )}

      {/* Slide-up sheet */}
      <div className={`tajweed-sheet ${isOpen ? 'open' : ''}`}>
        <div className="tajweed-sheet-header">
          <h4>Tajweed Color Guide</h4>
          <button className="tajweed-close" onClick={() => setIsOpen(false)} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="tajweed-sheet-body">
          {RULES_LIST.map((rule) => (
            <div key={rule.css} className="tajweed-rule-item">
              <span
                className="tajweed-color-dot"
                style={{ backgroundColor: rule.color }}
              />
              <span className="tajweed-rule-label">{rule.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Extended FAB button with label */}
      <button
        className={`tajweed-fab ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Tajweed Color Guide"
        title="Tajweed Color Guide"
      >
        {isOpen ? (
          <X size={20} />
        ) : (
          <>
            <span className="tajweed-fab-dots">
              <span style={{ background: '#537FFF' }} />
              <span style={{ background: '#DD0008' }} />
              <span style={{ background: '#FF7E1E' }} />
            </span>
            <span className="tajweed-fab-label">Colors</span>
          </>
        )}
      </button>
    </>
  );
};

export default TajweedFab;
