
import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

const ZakatCategoryCard = ({ category, values, onChange, currencySymbol }) => {
    const [showDetails, setShowDetails] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);

    const Icon = category.icon;

    return (
        <div className="zakat-card">
            <div className="zakat-card-header">
                <div className="zakat-card-title-group" onClick={() => setIsExpanded(!isExpanded)}>
                    <div className={`zakat-icon-wrapper ${category.id}`}>
                        <Icon size={20} />
                    </div>
                    <h3>{category.title}</h3>
                    {isExpanded ? <ChevronUp size={16} className="text-muted" /> : <ChevronDown size={16} className="text-muted" />}
                </div>
                <button
                    className={`info-toggle-btn ${showDetails ? 'active' : ''}`}
                    onClick={() => setShowDetails(!showDetails)}
                    title="Show Rulings & Details"
                >
                    <Info size={18} />
                    <span>Rules</span>
                </button>
            </div>

            {showDetails && (
                <div className="zakat-details-panel">
                    <p>{category.details}</p>
                </div>
            )}

            {isExpanded && (
                <div className="zakat-inputs-container">
                    {category.inputs.map(input => (
                        <div key={input.id} className="zakat-input-group">
                            <label>{input.label}</label>

                            {input.type === 'select' ? (
                                <div className="select-wrapper">
                                    <select
                                        value={values[input.id] || ''}
                                        onChange={(e) => onChange(input.id, e.target.value)}
                                    >
                                        {input.options.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                <div className="input-wrapper">
                                    <span className="currency-prefix">{currencySymbol}</span>
                                    <input
                                        type="number"
                                        placeholder={input.placeholder}
                                        value={values[input.id] || ''}
                                        onChange={(e) => onChange(input.id, e.target.value)}
                                        onWheel={(e) => e.target.blur()}
                                    />
                                    {input.id.includes('Grams') && <span className="unit-suffix">g</span>}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ZakatCategoryCard;
