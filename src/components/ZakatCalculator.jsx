import { useState } from 'react';
import PropTypes from 'prop-types';
import PageHeader from './PageHeader';
import { Calculator, RefreshCw, ChevronDown, Info, Settings, Globe, Scale, Coins } from 'lucide-react';
import './ZakatCalculator.css';
import ZakatCategoryCard from './ZakatCategoryCard';
import { ZAKAT_CATEGORIES, LIABILITIES_CATEGORY } from '../data/zakatData';

// Nisab thresholds (fixed gram amounts)
const NISAB_VALUES = {
    gold: { grams: 87.48, label: 'Gold Standard', sub: '87.48g', desc: 'Use if your wealth is mostly gold.' },
    silver: { grams: 612.36, label: 'Silver Standard', sub: '612.36g', desc: 'Recommended: Safer for ensuring Zakat is paid.' },
};

const CURRENCIES = [
    { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka', defaultGold: 9500, defaultSilver: 130 },
    { code: 'USD', symbol: '$', name: 'US Dollar', defaultGold: 65, defaultSilver: 0.85 },
    { code: 'EUR', symbol: '€', name: 'Euro', defaultGold: 60, defaultSilver: 0.78 },
    { code: 'GBP', symbol: '£', name: 'British Pound', defaultGold: 52, defaultSilver: 0.68 },
    { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', defaultGold: 244, defaultSilver: 3.20 },
    { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', defaultGold: 239, defaultSilver: 3.10 },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee', defaultGold: 5400, defaultSilver: 70 },
    { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee', defaultGold: 18200, defaultSilver: 238 },
];

const InfoTooltip = ({ text }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="info-tooltip-container"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            onClick={() => setIsVisible(!isVisible)}>
            <Info size={15} className="info-icon" />
            {isVisible && <div className="tooltip-content">{text}</div>}
        </div>
    );
};

InfoTooltip.propTypes = {
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
};

const ZakatCalculator = () => {
    const [currency, setCurrency] = useState(CURRENCIES[0]);
    const [nisabType, setNisabType] = useState('silver'); // Safe default
    const [metalPrices, setMetalPrices] = useState({
        gold: CURRENCIES[0].defaultGold,
        silver: CURRENCIES[0].defaultSilver,
    });

    const [values, setValues] = useState({});

    // Update metal prices when currency changes
    const handleCurrencyChange = (newCurrency) => {
        setCurrency(newCurrency);
        setMetalPrices({
            gold: newCurrency.defaultGold,
            silver: newCurrency.defaultSilver,
        });
    };

    const handleInputChange = (category, id, value) => {
        setValues(prev => ({
            ...prev,
            [`${category}_${id}`]: value
        }));
    };

    const getVal = (key) => parseFloat(values[key] || 0);

    // --- Calculation Logic ---

    // 1. Money
    const moneyTotal = getVal('money_cashInHand') + getVal('money_cashInBank') + getVal('money_deposited');

    // 2. Gold & Silver
    const goldTotal = getVal('gold_goldGrams') * metalPrices.gold;
    const silverTotal = getVal('silver_silverGrams') * metalPrices.silver;

    // 3. Investments
    const investmentsTotal = getVal('investments_stocks') + getVal('investments_mutualFunds') + getVal('investments_profits');

    // 4. Properties
    const propertyTotal = getVal('property_investmentProperty') + getVal('property_rentalIncome');

    // 5. Business
    const businessTotal = getVal('business_stockInTrade') + getVal('business_receivables');

    // 6. Agriculture (Special Rates)
    const agriRate = () => {
        const type = values['agriculture_irrigationType'];
        if (type === 'rain') return 0.10;
        if (type === 'artificial') return 0.05;
        if (type === 'mixed') return 0.075;
        return 0.10; // Default
    };
    const agriZakat = getVal('agriculture_agriProduceValue') * agriRate();

    // 7. Cattle (Sheep/Goat Standard Tiers)
    const cattleCount = getVal('cattle_cattleCount');
    const getCattleHeadCount = (count) => {
        if (count < 40) return 0;
        if (count <= 120) return 1;
        if (count <= 200) return 2;
        if (count <= 300) return 3;
        // Beyond 300, 1 for every 100
        return Math.floor(count / 100);
    };
    const cattleZakat = getCattleHeadCount(cattleCount) * getVal('cattle_pricePerAnimal');

    // 8. Precious Stones
    const preciousTotal = getVal('precious_stonesValue');

    // 9. Others
    const othersTotal = getVal('others_loansGiven') + getVal('others_otherAssets');

    // Total Zakatable Assets (Excluding Agri/Cattle which have specific rules, but usually added to wealth if converted to cash. 
    // HOWEVER, standard Zakat calc usually separates Agri. For simplicity in this UI, we'll sum the 2.5% items and add Agri/Cattle Zakat amounts directly to final Zakat Due)

    // Standard 2.5% Assets
    const zakatableAssets = moneyTotal + goldTotal + silverTotal + investmentsTotal + propertyTotal + businessTotal + preciousTotal + othersTotal;

    // Liabilities
    const liabilitiesTotal = getVal('liabilities_debts') + getVal('liabilities_expenses');

    // Net Worth for 2.5% calculation
    const netWorth = Math.max(0, zakatableAssets - liabilitiesTotal);

    // Nisab
    const nisabThreshold = NISAB_VALUES[nisabType].grams * metalPrices[nisabType];
    const isNisabMet = netWorth >= nisabThreshold;

    // Final Zakat
    const zakatOnWealth = isNisabMet ? netWorth * 0.025 : 0;
    const totalZakatDue = zakatOnWealth + agriZakat + cattleZakat; // Agri & Cattle are separate from Nisab of wealth usually, keeping simple.

    const resetAll = () => {
        setValues({});
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const formatCurrency = (amount) => {
        return `${currency.symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return (
        <div className="zakat-page-background">
            <div className="container">
                <PageHeader
                    title="Zakat Calculator"
                    subtitle="Calculate your annual Zakat obligation"
                    breadcrumbs={[
                        { label: 'Home', path: '/' },
                        { label: 'Zakat', path: '/zakat' }
                    ]}
                />

                <div className="zakat-container">
                    {/* Global Settings Control Panel */}
                    <div className="zakat-config-panel">
                        <div className="config-header">
                            <div className="config-title">
                                <Settings size={20} className="text-primary" />
                                <h3>Configuration</h3>
                            </div>
                            <button className="reset-action-btn" onClick={resetAll} title="Reset all fields">
                                <RefreshCw size={14} /> Clear All
                            </button>
                        </div>

                        <div className="config-grid">
                            {/* Currency Selector */}
                            <div className="config-group">
                                <div className="config-label">
                                    <Globe size={16} className="text-muted" />
                                    <span>Currency</span>
                                    <InfoTooltip text="Select the currency for your assets. Metal prices will update automatically based on default values." />
                                </div>
                                <div className="select-container">
                                    <select
                                        className="modern-select"
                                        value={currency.code}
                                        onChange={(e) => handleCurrencyChange(CURRENCIES.find(c => c.code === e.target.value))}
                                    >
                                        {CURRENCIES.map(c => (
                                            <option key={c.code} value={c.code}>{c.symbol} {c.code} - {c.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={14} className="select-arrow" />
                                </div>
                            </div>

                            {/* Nisab Selector */}
                            <div className="config-group">
                                <div className="config-label">
                                    <Scale size={16} className="text-muted" />
                                    <span>Nisab Standard</span>
                                    <InfoTooltip text={
                                        <>
                                            <p><strong>Silver Standard:</strong> Lower threshold (~${(NISAB_VALUES.silver.grams * metalPrices.silver).toFixed(0)}), safer to ensure obligation is met.</p>
                                            <div style={{ height: 4 }}></div>
                                            <p><strong>Gold Standard:</strong> Higher threshold (~${(NISAB_VALUES.gold.grams * metalPrices.gold).toFixed(0)}), used if wealth is purely gold.</p>
                                        </>
                                    } />
                                </div>
                                <div className="segment-control">
                                    <button
                                        className={`segment-option ${nisabType === 'silver' ? 'active' : ''}`}
                                        onClick={() => setNisabType('silver')}
                                    >
                                        Silver
                                    </button>
                                    <button
                                        className={`segment-option ${nisabType === 'gold' ? 'active' : ''}`}
                                        onClick={() => setNisabType('gold')}
                                    >
                                        Gold
                                    </button>
                                </div>
                            </div>

                            {/* Metal Prices */}
                            <div className="config-group full-width-mobile">
                                <div className="config-label">
                                    <Coins size={16} className="text-muted" />
                                    <span>Metal Prices ({currency.code})</span>
                                    <InfoTooltip text="These are default estimated market rates. You can edit them to match your local market rates." />
                                </div>
                                <div className="metal-prices-row">
                                    <div className="metal-input-wrapper">
                                        <label>Gold/g</label>
                                        <div className="price-input">
                                            <span className="currency-symbol">{currency.symbol}</span>
                                            <input
                                                type="number"
                                                value={metalPrices.gold}
                                                onChange={(e) => setMetalPrices({ ...metalPrices, gold: parseFloat(e.target.value) || 0 })}
                                            />
                                        </div>
                                    </div>
                                    <div className="metal-input-wrapper">
                                        <label>Silver/g</label>
                                        <div className="price-input">
                                            <span className="currency-symbol">{currency.symbol}</span>
                                            <input
                                                type="number"
                                                value={metalPrices.silver}
                                                onChange={(e) => setMetalPrices({ ...metalPrices, silver: parseFloat(e.target.value) || 0 })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="zakat-main-layout">
                        {/* Asset Columns */}
                        <div className="zakat-cards-column">
                            {ZAKAT_CATEGORIES.map(category => (
                                <ZakatCategoryCard
                                    key={category.id}
                                    category={category}
                                    values={Object.keys(values).filter(k => k.startsWith(category.id)).reduce((obj, k) => {
                                        obj[k.replace(`${category.id}_`, '')] = values[k];
                                        return obj;
                                    }, {})}
                                    onChange={(id, val) => handleInputChange(category.id, id, val)}
                                    currencySymbol={currency.symbol}
                                />
                            ))}

                            <ZakatCategoryCard
                                category={LIABILITIES_CATEGORY}
                                values={Object.keys(values).filter(k => k.startsWith('liabilities')).reduce((obj, k) => {
                                    obj[k.replace('liabilities_', '')] = values[k];
                                    return obj;
                                }, {})}
                                onChange={(id, val) => handleInputChange('liabilities', id, val)}
                                currencySymbol={currency.symbol}
                            />
                        </div>

                        {/* Summary Sticky Details */}
                        <div className="zakat-summary-sidebar">
                            <div className="summary-sticky-wrapper">
                                <div className="zakat-summary-card">
                                    <div className="summary-header">
                                        <h3><Calculator size={20} /> Summary</h3>
                                    </div>

                                    <div className="summary-content">
                                        <div className="summary-item">
                                            <span className="label">Zakatable Assets</span>
                                            <span className="value">{formatCurrency(zakatableAssets)}</span>
                                        </div>
                                        <div className="summary-item expense">
                                            <span className="label">Liabilities</span>
                                            <span className="value">- {formatCurrency(liabilitiesTotal)}</span>
                                        </div>

                                        <div className="divider"></div>

                                        <div className="summary-item net-worth">
                                            <span className="label">Net Wealth</span>
                                            <span className="value">{formatCurrency(netWorth)}</span>
                                        </div>

                                        <div className="nisab-indicator">
                                            <div className="nisab-info">
                                                <span className="label">Nisab ({nisabType})</span>
                                                <span className="amount">{formatCurrency(nisabThreshold)}</span>
                                            </div>
                                            {isNisabMet ?
                                                <div className="status-badge success">Nisab Met</div> :
                                                <div className="status-badge warning">Below Nisab</div>
                                            }
                                        </div>

                                        {(agriZakat > 0 || cattleZakat > 0) && <div className="divider"></div>}

                                        {agriZakat > 0 && (
                                            <div className="summary-item">
                                                <span className="label">Agriculture Zakat</span>
                                                <span className="value">+ {formatCurrency(agriZakat)}</span>
                                            </div>
                                        )}
                                        {cattleZakat > 0 && (
                                            <div className="summary-item">
                                                <span className="label">Cattle Zakat</span>
                                                <span className="value">+ {formatCurrency(cattleZakat)}</span>
                                            </div>
                                        )}

                                        <div className="total-due-card">
                                            <span className="due-label">Total Zakat Due</span>
                                            <h2 className="due-amount">{formatCurrency(totalZakatDue)}</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ZakatCalculator;
