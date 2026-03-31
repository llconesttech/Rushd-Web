import { useState } from 'react';
import PropTypes from 'prop-types';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';
import ThemedInput from './UI/Input/ThemedInput';
import ThemedSelect from './UI/Select/ThemedSelect';

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
                    {category.inputs.map((input) => {
                        const isSelect = input.type === 'select';
                        const selectOptions = isSelect && input.options
                            ? input.options.map((o) => ({ value: o.value, label: o.label }))
                            : [];
                        const stored = values[input.id];
                        const selectValue = isSelect
                            ? selectOptions.find((o) => o.value === stored) ??
                              (stored === undefined || stored === ''
                                  ? selectOptions[0] ?? null
                                  : null)
                            : null;

                        return (
                        <div key={input.id} className="zakat-input-group">
                            <label>{input.label}</label>

                            {isSelect ? (
                                <ThemedSelect
                                    accent="#0d5c63"
                                    wrapperClassName="zakat-field-select"
                                    instanceId={`zakat-${category.id}-${input.id}`}
                                    options={selectOptions}
                                    value={selectValue}
                                    onChange={(opt) => onChange(input.id, opt ? opt.value : '')}
                                    isSearchable={false}
                                    isClearable={false}
                                    aria-label={input.label}
                                />
                            ) : (
                                <div className="zakat-themed-input-wrap">
                                    <ThemedInput
                                        type="number"
                                        inputMode="decimal"
                                        prefix={currencySymbol}
                                        ariaLabel={input.label}
                                        placeholder={input.placeholder}
                                        value={values[input.id] || ''}
                                        onChange={(e) => onChange(input.id, e.target.value)}
                                        onWheel={(e) => e.currentTarget.blur()}
                                    />
                                    {input.id.includes('Grams') ? <span className="unit-suffix">g</span> : null}
                                </div>
                            )}
                        </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

ZakatCategoryCard.propTypes = {
    category: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        icon: PropTypes.elementType.isRequired,
        details: PropTypes.string.isRequired,
        inputs: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            type: PropTypes.string,
            placeholder: PropTypes.string,
            options: PropTypes.arrayOf(PropTypes.shape({
                value: PropTypes.string.isRequired,
                label: PropTypes.string.isRequired,
            }))
        })).isRequired,
    }).isRequired,
    values: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    currencySymbol: PropTypes.string.isRequired,
};

export default ZakatCategoryCard;
