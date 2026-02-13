import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, ChevronDown, X } from 'lucide-react';
import { TAJWEED_RULES } from '../data/tajweedData';
import './TajweedLegendDropdown.css';

const RULES_LIST = Object.values(TAJWEED_RULES).filter(r => r && r.label);

const TajweedLegendDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="tajweed-legend-container" ref={dropdownRef}>
      <button
        className={`ph-action-btn ph-btn-outline tajweed-legend-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Tajweed Color Guide"
      >
        <BookOpen size={16} className="tajweed-icon-colors" />
        <span className="tajweed-btn-text">Tajweed</span>
        <ChevronDown size={14} className={`tajweed-chevron ${isOpen ? 'rotate' : ''}`} />
      </button>

      {isOpen && (
        <div className="tajweed-dropdown-card">
          <div className="tajweed-dropdown-header">
            <h4>Tajweed Rules</h4>
            <button className="tajweed-dropdown-close" onClick={() => setIsOpen(false)}>
              <X size={16} />
            </button>
          </div>
          <div className="tajweed-dropdown-grid">
            {RULES_LIST.map((rule) => (
              <div key={rule.css} className="tajweed-dropdown-item">
                <span
                  className="tajweed-dot"
                  style={{ backgroundColor: rule.color }}
                />
                <span className="tajweed-label">{rule.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TajweedLegendDropdown;
