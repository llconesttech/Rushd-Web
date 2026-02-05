import React, { useState, useEffect } from 'react';
import PageHeader from './PageHeader';
import { Calculator, DollarSign, Coins, TrendingUp, Home, Car, Briefcase, RefreshCw } from 'lucide-react';
import './ZakatCalculator.css';

// Nisab thresholds (fixed gram amounts per Islamic jurisprudence)
const NISAB_VALUES = {
    gold: { grams: 87.48, label: 'Gold (87.48g)' },
    silver: { grams: 612.36, label: 'Silver (612.36g)' },
};

// Default metal prices per gram (user should update with local prices)
const DEFAULT_METAL_PRICES_BDT = {
    gold: 9500,    // ~৳9500/gram in Bangladesh
    silver: 130,   // ~৳130/gram in Bangladesh
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

const ASSET_CATEGORIES = [
    { key: 'cash', label: 'Cash & Bank Balance', icon: DollarSign, description: 'Money in hand, savings, current accounts' },
    { key: 'gold', label: 'Gold', icon: Coins, description: 'Jewelry, coins, bars (in grams or value)' },
    { key: 'silver', label: 'Silver', icon: Coins, description: 'Jewelry, coins, bars (in grams or value)' },
    { key: 'investments', label: 'Investments', icon: TrendingUp, description: 'Stocks, mutual funds, bonds, crypto' },
    { key: 'businessAssets', label: 'Business Assets', icon: Briefcase, description: 'Inventory, receivables, merchandise' },
    { key: 'property', label: 'Investment Property', icon: Home, description: 'Rental properties (market value)' },
    { key: 'other', label: 'Other Zakatable Assets', icon: Car, description: 'Any other assets for trade' },
];

const LIABILITIES = [
    { key: 'debts', label: 'Debts & Loans', description: 'Money you owe to others' },
    { key: 'expenses', label: 'Immediate Expenses', description: 'Bills due within the year' },
];

const ZakatCalculator = () => {
    const [currency, setCurrency] = useState(CURRENCIES[0]);
    const [nisabType, setNisabType] = useState('gold');
    const [assets, setAssets] = useState({
        cash: '',
        gold: '',
        silver: '',
        investments: '',
        businessAssets: '',
        property: '',
        other: '',
    });
    const [liabilities, setLiabilities] = useState({
        debts: '',
        expenses: '',
    });
    // Metal prices in user's LOCAL currency (not USD!)
    const [metalPrices, setMetalPrices] = useState({
        gold: CURRENCIES[0].defaultGold,
        silver: CURRENCIES[0].defaultSilver,
    });

    // Update metal prices when currency changes
    const handleCurrencyChange = (newCurrency) => {
        setCurrency(newCurrency);
        setMetalPrices({
            gold: newCurrency.defaultGold,
            silver: newCurrency.defaultSilver,
        });
    };

    // Calculate Nisab in selected currency (grams × local price per gram)
    const calculateNisab = () => {
        const grams = NISAB_VALUES[nisabType].grams;
        const pricePerGram = metalPrices[nisabType];
        return grams * pricePerGram;
    };

    // Calculate totals
    const totalAssets = Object.values(assets).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
    const totalLiabilities = Object.values(liabilities).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
    const netWorth = totalAssets - totalLiabilities;
    const nisab = calculateNisab();
    const isZakatDue = netWorth >= nisab;
    const zakatAmount = isZakatDue ? netWorth * 0.025 : 0;

    const handleAssetChange = (key, value) => {
        setAssets(prev => ({ ...prev, [key]: value }));
    };

    const handleLiabilityChange = (key, value) => {
        setLiabilities(prev => ({ ...prev, [key]: value }));
    };

    const resetAll = () => {
        setAssets({
            cash: '', gold: '', silver: '', investments: '',
            businessAssets: '', property: '', other: '',
        });
        setLiabilities({ debts: '', expenses: '' });
    };

    const formatCurrency = (amount) => {
        return `${currency.symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return (
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
                {/* Settings Row */}
                <div className="zakat-settings">
                    <div className="setting-group">
                        <label>Currency</label>
                        <select
                            value={currency.code}
                            onChange={(e) => handleCurrencyChange(CURRENCIES.find(c => c.code === e.target.value))}
                        >
                            {CURRENCIES.map(c => (
                                <option key={c.code} value={c.code}>{c.symbol} {c.code} - {c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="setting-group">
                        <label>Nisab Standard</label>
                        <select value={nisabType} onChange={(e) => setNisabType(e.target.value)}>
                            <option value="gold">{NISAB_VALUES.gold.label}</option>
                            <option value="silver">{NISAB_VALUES.silver.label}</option>
                        </select>
                    </div>

                    <button className="reset-btn" onClick={resetAll}>
                        <RefreshCw size={16} /> Reset
                    </button>
                </div>

                {/* Metal Prices Section */}
                <div className="metal-prices-section">
                    <div className="metal-prices-header">
                        <Coins size={18} />
                        <span>Current Metal Prices (per gram in {currency.code})</span>
                    </div>
                    <div className="metal-prices-inputs">
                        <div className="metal-input">
                            <label>Gold Price</label>
                            <div className="input-field">
                                <span className="currency-symbol">{currency.symbol}</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={metalPrices.gold}
                                    onChange={(e) => setMetalPrices(prev => ({ ...prev, gold: parseFloat(e.target.value) || 0 }))}
                                />
                                <span className="unit">/gram</span>
                            </div>
                        </div>
                        <div className="metal-input">
                            <label>Silver Price</label>
                            <div className="input-field">
                                <span className="currency-symbol">{currency.symbol}</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={metalPrices.silver}
                                    onChange={(e) => setMetalPrices(prev => ({ ...prev, silver: parseFloat(e.target.value) || 0 }))}
                                />
                                <span className="unit">/gram</span>
                            </div>
                        </div>
                    </div>
                    <p className="metal-prices-note">
                        💡 Check current usd prices at: <a href="https://goldprice.org" target="_blank" rel="noopener noreferrer">GoldPrice.org</a> or <a href="https://www.kitco.com" target="_blank" rel="noopener noreferrer">Kitco.com</a>
                    </p>
                </div>

                {/* Assets Section */}
                <div className="zakat-section">
                    <h3 className="section-header">
                        <TrendingUp size={20} />
                        Assets
                    </h3>
                    <div className="input-grid">
                        {ASSET_CATEGORIES.map(({ key, label, icon: Icon, description }) => (
                            <div key={key} className="input-card">
                                <div className="input-header">
                                    <Icon size={18} className="input-icon" />
                                    <div>
                                        <div className="input-label">{label}</div>
                                        <div className="input-description">{description}</div>
                                    </div>
                                </div>
                                <div className="input-field">
                                    <span className="currency-symbol">{currency.symbol}</span>
                                    <input
                                        type="number"
                                        value={assets[key]}
                                        onChange={(e) => handleAssetChange(key, e.target.value)}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Liabilities Section */}
                <div className="zakat-section">
                    <h3 className="section-header">
                        <DollarSign size={20} />
                        Liabilities (Deductible)
                    </h3>
                    <div className="input-grid liabilities-grid">
                        {LIABILITIES.map(({ key, label, description }) => (
                            <div key={key} className="input-card">
                                <div className="input-header">
                                    <DollarSign size={18} className="input-icon liability-icon" />
                                    <div>
                                        <div className="input-label">{label}</div>
                                        <div className="input-description">{description}</div>
                                    </div>
                                </div>
                                <div className="input-field">
                                    <span className="currency-symbol">{currency.symbol}</span>
                                    <input
                                        type="number"
                                        value={liabilities[key]}
                                        onChange={(e) => handleLiabilityChange(key, e.target.value)}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Results Section */}
                <div className="zakat-results">
                    <h3 className="section-header">
                        <Calculator size={20} />
                        Calculation Results
                    </h3>

                    <div className="results-grid">
                        <div className="result-item">
                            <span className="result-label">Total Assets</span>
                            <span className="result-value">{formatCurrency(totalAssets)}</span>
                        </div>
                        <div className="result-item">
                            <span className="result-label">Total Liabilities</span>
                            <span className="result-value minus">- {formatCurrency(totalLiabilities)}</span>
                        </div>
                        <div className="result-item highlight">
                            <span className="result-label">Net Zakatable Wealth</span>
                            <span className="result-value">{formatCurrency(netWorth)}</span>
                        </div>
                        <div className="result-item">
                            <span className="result-label">Nisab Threshold ({nisabType})</span>
                            <span className="result-value">{formatCurrency(nisab)}</span>
                        </div>
                    </div>

                    <div className={`zakat-due-card ${isZakatDue ? 'due' : 'not-due'}`}>
                        {isZakatDue ? (
                            <>
                                <div className="due-status">✓ Zakat is Due</div>
                                <div className="zakat-amount">
                                    <span className="amount-label">Your Zakat (2.5%)</span>
                                    <span className="amount-value">{formatCurrency(zakatAmount)}</span>
                                </div>
                                <p className="due-message">
                                    Your wealth exceeds the Nisab. Pay this amount to fulfill your Zakat obligation.
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="due-status">Zakat Not Due</div>
                                <p className="due-message">
                                    Your net wealth ({formatCurrency(netWorth)}) is below the Nisab threshold ({formatCurrency(nisab)}).
                                    Zakat becomes obligatory when your wealth exceeds this amount for one lunar year.
                                </p>
                            </>
                        )}
                    </div>
                </div>

                {/* Info Section */}
                <div className="zakat-info">
                    <h4>📖 About Zakat</h4>
                    <ul>
                        <li><strong>Rate:</strong> 2.5% of net zakatable wealth</li>
                        <li><strong>Nisab (Gold):</strong> 87.48 grams of gold</li>
                        <li><strong>Nisab (Silver):</strong> 612.36 grams of silver</li>
                        <li><strong>Hawl:</strong> Wealth must be held for one lunar year</li>
                    </ul>
                    <p className="disclaimer">
                        ⚠️ This calculator provides an estimate. Consult a scholar for specific rulings about your situation.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ZakatCalculator;
