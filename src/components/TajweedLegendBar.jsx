import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Palette } from 'lucide-react';
import { TAJWEED_RULES } from '../data/tajweedData';
import './TajweedLegendBar.css';

const RULES_LIST = Object.values(TAJWEED_RULES).filter(r => r && r.label);

const TajweedLegendBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="tajweed-legend-bar-container">
      <div className="tajweed-legend-bar">
        <button
          className={`tajweed-bar-toggle ${isExpanded ? 'active' : ''}`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="tajweed-bar-toggle-content">
            <Palette size={16} className="tajweed-icon" />
            <span className="tajweed-label">Tajweed Colors</span>
            <div className="tajweed-dots-preview">
              <span style={{ backgroundColor: '#537FFF' }}></span>
              <span style={{ backgroundColor: '#DD0008' }}></span>
              <span style={{ backgroundColor: '#169200' }}></span>
            </div>
          </div>
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        <div className={`tajweed-rules-strip ${isExpanded ? 'expanded' : ''}`}>
          {RULES_LIST.map((rule) => (
            <div key={rule.css} className="tajweed-strip-item">
              <span
                className="tajweed-dot"
                style={{ backgroundColor: rule.color }}
              />
              <span className="tajweed-rule-name">{rule.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TajweedLegendBar;
