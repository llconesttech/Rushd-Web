import { useState } from 'react';
import PropTypes from 'prop-types';
import PageHeader from './PageHeader';
import { ChevronDown, ChevronUp, Clock, CheckCircle, XCircle, BookOpen, Moon, MessageSquare, List, Sun, Users, Calendar, Briefcase, Settings2, AlertTriangle } from 'lucide-react';
import './SalahRules.css';
import {
    PRAYER_RAKATS, CONDITIONS, PILLARS, INVALIDATORS, SUNNAH_ACTS,
    SALAH_DUAS, RAKAT_RULES, VOLUNTARY_PRAYERS, WITR_INFO, SPECIAL_PRAYERS
} from '../data/salahRulesData';

const AccordionSection = ({ title, icon: Icon, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={`accordion-section ${isOpen ? 'open' : ''}`}>
            <button className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
                <div className="accordion-title">
                    <Icon size={20} />
                    <span>{title}</span>
                </div>
                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {isOpen && <div className="accordion-content">{children}</div>}
        </div>
    );
};

AccordionSection.propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    children: PropTypes.node.isRequired,
    defaultOpen: PropTypes.bool
};

const SalahRules = () => {
    const [activeCategory, setActiveCategory] = useState('regular'); // 'regular', 'voluntary', 'special'
    const [activeMadhhab, setActiveMadhhab] = useState('hanafi'); // 'hanafi', 'shafii', 'maliki', 'hanbali'

    const renderRegularSalah = () => (
        <>
            {/* Prayer Times & Rakats */}
            <AccordionSection title="Prayer Times & Rakats" icon={Clock} defaultOpen={true}>
                <div className="rakats-table">
                    <div className="rakats-header">
                        <span>Prayer</span>
                        <span>Sunnah</span>
                        <span>Fard</span>
                        <span>After</span>
                        <span>Witr</span>
                        <span>Total</span>
                    </div>
                    {PRAYER_RAKATS.map((prayer) => (
                        <div key={prayer.name} className="rakats-row">
                            <div className="prayer-name">
                                <span className="arabic">{prayer.arabic}</span>
                                <span className="english">{prayer.name}</span>
                            </div>
                            <span className="rakat-count sunnah">
                                {prayer.sunnahBefore || prayer.sunnah || '-'}
                                {prayer.optional && <small>(opt)</small>}
                            </span>
                            <span className="rakat-count fard">{prayer.fard}</span>
                            <span className="rakat-count sunnah">
                                {prayer.sunnahAfter || '-'}
                            </span>
                            <span className={`rakat-count ${prayer.witr ? 'witr' : ''}`}>
                                {prayer.witr || '-'}
                            </span>
                            <span className="rakat-count total">{prayer.total}</span>
                        </div>
                    ))}
                </div>
                {activeMadhhab !== 'hanafi' && (
                    <div className="madhhab-note-box mt-4">
                        <AlertTriangle size={14} />
                        <span>Note: In Shafi&apos;i, Maliki, and Hanbali madhhabs, Asr time begins later than in Hanafi, when an object&apos;s shadow equals its length (plus midday shadow).</span>
                    </div>
                )}
                <p className="legend mt-2">
                    <span className="badge fard">Fard = Obligatory</span>
                    <span className="badge sunnah">Sunnah = Recommended</span>
                    <span className="badge witr">Witr = Wajib/MuakkadSunnah</span>
                </p>
            </AccordionSection>

            {/* Conditions of Prayer */}
            <AccordionSection title="Conditions (Shurut)" icon={CheckCircle}>
                <p className="section-intro">Prerequisites that must be met before prayer:</p>
                <div className="rules-grid">
                    {CONDITIONS.map((item, index) => (
                        <div key={index} className="rule-item condition">
                            <div className="rule-number">{index + 1}</div>
                            <div className="rule-content">
                                <div className="rule-title">{item.title}</div>
                                <div className="rule-description">{item.description}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </AccordionSection>

            {/* Pillars of Prayer */}
            <AccordionSection title="Pillars (Arkan)" icon={BookOpen}>
                <p className="section-intro">Essential parts that cannot be omitted:</p>
                <div className="rules-grid">
                    {PILLARS.map((item, index) => (
                        <div key={index} className="rule-item pillar">
                            <div className="rule-number">{index + 1}</div>
                            <div className="rule-content">
                                <div className="rule-title">{item.title}</div>
                                <div className="rule-description">{item.description}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </AccordionSection>

            {/* Sunnah Acts */}
            <AccordionSection title="Sunnah Acts" icon={CheckCircle}>
                <p className="section-intro">Recommended acts that increase reward:</p>
                <div className="rules-grid">
                    {SUNNAH_ACTS.map((item, index) => (
                        <div key={index} className="rule-item sunnah-act">
                            <div className="rule-number">{index + 1}</div>
                            <div className="rule-content">
                                <div className="rule-title">{item.title}</div>
                                <div className="rule-description">{item.description}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </AccordionSection>

            {/* What Invalidates Prayer */}
            <AccordionSection title="What Invalidates Prayer" icon={XCircle}>
                <p className="section-intro">Actions that break the prayer:</p>
                <div className="rules-grid">
                    {INVALIDATORS.map((item, index) => (
                        <div key={index} className="rule-item invalidator">
                            <div className="rule-icon"><XCircle size={16} /></div>
                            <div className="rule-content">
                                <div className="rule-title">{item.title}</div>
                                <div className="rule-description">{item.description}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </AccordionSection>

            {/* Rakat Recitation Rules */}
            <AccordionSection title="What to Recite in Each Rakat" icon={List}>
                <p className="section-intro">Surah and dua requirements for each rakat of prayer:</p>
                <div className="rakat-rules-list">
                    {RAKAT_RULES.map((rule, index) => (
                        <div key={index} className="rakat-rule-card">
                            <div className="rakat-rule-header">{rule.rakat}</div>
                            <div className="rakat-recitations">
                                {rule.recitation.map((item, i) => (
                                    <span key={i} className="recitation-badge">{item}</span>
                                ))}
                            </div>
                            <div className="rakat-notes">{rule.notes}</div>
                        </div>
                    ))}
                </div>
            </AccordionSection>

            {/* Prayer Duas */}
            <AccordionSection title="Duas During Prayer" icon={MessageSquare}>
                <p className="section-intro">Essential supplications to recite during each position of prayer:</p>
                <div className="duas-list">
                    {SALAH_DUAS.filter(dua => {
                        if (activeMadhhab === 'hanafi' || activeMadhhab === 'hanbali') {
                            if (dua.position.includes('Shafi\'i')) return false;
                        } else {
                            if (dua.position.includes('Hanafi/Hanbali')) return false;
                        }
                        return true;
                    }).map((dua, index) => (
                        <div key={index} className="dua-card">
                            <div className="dua-header">
                                <span className="dua-position">{dua.position}</span>
                                <span className="dua-when">📍 {dua.when}</span>
                            </div>
                            <div className="dua-arabic">{dua.arabic}</div>
                            <div className="dua-transliteration">{dua.transliteration}</div>
                            <div className="dua-meaning">{dua.meaning}</div>
                        </div>
                    ))}
                </div>
            </AccordionSection>

            {/* Witr Prayer Guidelines */}
            <AccordionSection title="Witr Prayer Guidelines (After Isha)" icon={Moon}>
                <div className="witr-section">
                    <div className="witr-basics">
                        <h4>Basic Information ({activeMadhhab === 'hanafi' ? 'Hanafi' : "Shafi'i/Maliki/Hanbali"})</h4>
                        <div className="witr-basics-grid">
                            {WITR_INFO.basics[activeMadhhab === 'hanafi' ? 'hanafi' : 'others'].map((item, index) => (
                                <div key={index} className="witr-basic-item">
                                    <span className="witr-label">{item.label}</span>
                                    <span className="witr-value">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="witr-methods">
                        <h4>Method of Praying</h4>
                        {WITR_INFO.methods[activeMadhhab === 'hanafi' ? 'hanafi' : 'others'].map((method, index) => (
                            <div key={index} className="witr-method-card">
                                <div className="method-name">{method.name}</div>
                                <ol className="method-steps">
                                    {method.steps.map((step, i) => (
                                        <li key={i}>{step}</li>
                                    ))}
                                </ol>
                            </div>
                        ))}
                    </div>

                    <div className="witr-qunut">
                        <h4>Dua Qunut</h4>
                        <div className="qunut-dua-card">
                            <div className="dua-arabic">{(activeMadhhab === 'hanafi' ? WITR_INFO.qunutHanafi : WITR_INFO.qunutDua).arabic}</div>
                            <div className="dua-transliteration">{(activeMadhhab === 'hanafi' ? WITR_INFO.qunutHanafi : WITR_INFO.qunutDua).transliteration}</div>
                            <div className="dua-meaning">{(activeMadhhab === 'hanafi' ? WITR_INFO.qunutHanafi : WITR_INFO.qunutDua).meaning}</div>
                        </div>
                    </div>
                </div>
            </AccordionSection>
        </>
    );

    const renderVoluntarySalah = () => {
        return (
            <>
                {/* Voluntary Prayers Section */}
                <AccordionSection title="Voluntary (Sunnah) Prayers" icon={Sun} defaultOpen={true}>
                    <p className="section-intro">Highly recommended prayers performed outside the five daily obligatory times.</p>
                    <div className="voluntary-prayers-grid">
                        {VOLUNTARY_PRAYERS.map((prayer) => (
                            <div key={prayer.name} className="sunnah-card">
                                <div className="sunnah-card-header">
                                    <div className="sunnah-name-group">
                                        <span className="sunnah-arabic">{prayer.arabic}</span>
                                        <h4 className="sunnah-english">{prayer.name}</h4>
                                    </div>
                                    <span className="sunnah-rakats-badge">{prayer.rakats}</span>
                                </div>
                                <div className="sunnah-info-row">
                                    <Clock size={14} />
                                    <span>{prayer.time}</span>
                                </div>
                                <p className="sunnah-guideline">{prayer.guideline}</p>
                            </div>
                        ))}
                    </div>
                </AccordionSection>
            </>
        )
    };

    const renderSpecialSalah = () => (
        <>
            {/* Janazah Prayer */}
            <AccordionSection title="Funeral Prayer (Salat al-Janazah)" icon={Users} defaultOpen={true}>
                <div className="special-prayer-content">
                    <div className="special-header">
                        <div className="special-title-group">
                            <span className="arabic">{SPECIAL_PRAYERS.janazah.arabic}</span>
                            <span className="subtitle">Fard Kifayah (Collective Obligation)</span>
                        </div>
                    </div>
                    <p className="special-intro">{SPECIAL_PRAYERS.janazah.intro}</p>

                    <div className="special-conditions">
                        <h4>Conditions & Prerequisites</h4>
                        <ul>
                            {SPECIAL_PRAYERS.janazah.conditions.map((c, i) => (
                                <li key={i}>{c}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="special-steps">
                        <h4>How to Perform (The 4 Takbirs)</h4>
                        <div className="takbir-timeline">
                            {SPECIAL_PRAYERS.janazah.steps.map((step, i) => (
                                <div key={i} className="takbir-node">
                                    <div className="takbir-badge">{step.takbir}</div>
                                    <div className="takbir-action">
                                        <p>{activeMadhhab === 'hanafi' && step.hanafiAction ? step.hanafiAction : step.action}</p>
                                        {step.duaArabic && (
                                            <div className="takbir-dua-box mt-2 py-2 px-3 bg-white/50 dark:bg-black/20 rounded-md border border-gray-200 dark:border-gray-800">
                                                <p className="arabic text-right text-lg text-primary">{step.duaArabic}</p>
                                                <p className="text-xs italic text-gray-600 dark:text-gray-400 mt-1">{step.duaTransliteration}</p>
                                                <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">{step.duaMeaning}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </AccordionSection>

            {/* Eid Prayer */}
            <AccordionSection title="Eid Prayer (Salat al-Eid)" icon={Calendar}>
                <div className="special-prayer-content">
                    <div className="special-header">
                        <div className="special-title-group">
                            <span className="arabic">{SPECIAL_PRAYERS.eid.arabic}</span>
                            <span className="subtitle">Wajib/Sunnah Muakkadah</span>
                        </div>
                    </div>
                    <p className="special-intro">{SPECIAL_PRAYERS.eid.intro}</p>

                    <div className="special-conditions">
                        <h4>Sunnah Acts Specific to Eid</h4>
                        <ul>
                            {SPECIAL_PRAYERS.eid.sunnahs.map((s, i) => (
                                <li key={i}>{s}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="special-steps">
                        <h4>Method of Praying (Extra Takbirs)</h4>
                        {activeMadhhab === 'hanafi' && (
                            <div className="madhhab-specific-box">
                                <h5>Hanafi Method (6 Extra Takbirs total)</h5>
                                <p><strong>Rakat 1:</strong> {SPECIAL_PRAYERS.eid.madhhabDetails.hanafi.rakat1}</p>
                                <p><strong>Rakat 2:</strong> {SPECIAL_PRAYERS.eid.madhhabDetails.hanafi.rakat2}</p>
                            </div>
                        )}
                        {activeMadhhab === 'shafii' && (
                            <div className="madhhab-specific-box">
                                <h5>Shafi&apos;i Method (12 Extra Takbirs total)</h5>
                                <p><strong>Rakat 1:</strong> {SPECIAL_PRAYERS.eid.madhhabDetails.shafii.rakat1}</p>
                                <p><strong>Rakat 2:</strong> {SPECIAL_PRAYERS.eid.madhhabDetails.shafii.rakat2}</p>
                            </div>
                        )}
                        {(activeMadhhab === 'maliki' || activeMadhhab === 'hanbali') && (
                            <div className="madhhab-specific-box">
                                <h5>Maliki/Hanbali Method (11 or 12 Takbirs total depending on calculation)</h5>
                                <p><strong>Rakat 1:</strong> {SPECIAL_PRAYERS.eid.madhhabDetails.malikiHanbali.rakat1}</p>
                                <p><strong>Rakat 2:</strong> {SPECIAL_PRAYERS.eid.madhhabDetails.malikiHanbali.rakat2}</p>
                            </div>
                        )}
                    </div>

                    <div className="special-steps">
                        <h4>Takbir at-Tashreeq</h4>
                        <p className="text-sm text-gray-500 mb-2">Recited after obligatory prayers during the days of Eid</p>
                        <div className="qunut-dua-card">
                            <div className="dua-arabic">{SPECIAL_PRAYERS.eid.takbirTashreeq.arabic}</div>
                            <div className="dua-transliteration">{SPECIAL_PRAYERS.eid.takbirTashreeq.transliteration}</div>
                            <div className="dua-meaning">{SPECIAL_PRAYERS.eid.takbirTashreeq.meaning}</div>
                        </div>
                    </div>
                </div>
            </AccordionSection>

            {/* Traveler's Prayer */}
            <AccordionSection title="Traveler's Prayer (Safar / Qasr)" icon={Briefcase}>
                <div className="special-prayer-content">
                    <div className="special-header">
                        <div className="special-title-group">
                            <span className="arabic">{SPECIAL_PRAYERS.travel.arabic}</span>
                            <span className="subtitle">Concessions for Travelers</span>
                        </div>
                    </div>
                    <p className="special-intro">{SPECIAL_PRAYERS.travel.intro}</p>

                    <div className="travel-grid">
                        <div className="travel-card">
                            <h4>Distance Required</h4>
                            <div className="madhhab-note-box mt-2">
                                <AlertTriangle size={14} />
                                <span>{activeMadhhab === 'hanafi' ? SPECIAL_PRAYERS.travel.conditions.distance.hanafi : SPECIAL_PRAYERS.travel.conditions.distance.majority}</span>
                            </div>
                        </div>
                        <div className="travel-card">
                            <h4>Duration of Stay</h4>
                            <div className="madhhab-note-box mt-2">
                                <AlertTriangle size={14} />
                                <span>{activeMadhhab === 'hanafi' ? SPECIAL_PRAYERS.travel.conditions.duration.hanafi : SPECIAL_PRAYERS.travel.conditions.duration.majority}</span>
                            </div>
                        </div>
                    </div>

                    <div className="special-steps mt-4">
                        <h4>Rules of Qasr (Shortening)</h4>
                        <ul>
                            {SPECIAL_PRAYERS.travel.qasrRules.map((rule, i) => (
                                <li key={i}>{rule}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="special-steps mt-4 pb-2">
                        <h4>Combining Prayers (Jam&apos;)</h4>
                        <div className="jam-box">
                            <p className="mb-2"><strong>Basic Rule:</strong> {SPECIAL_PRAYERS.travel.jamRules.allowed}</p>
                            <p className="mb-2"><strong>Combinations:</strong> {SPECIAL_PRAYERS.travel.jamRules.combinations}</p>
                            {activeMadhhab === 'hanafi' && (
                                <div className="p-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded text-sm mt-3">
                                    <strong>Hanafi Ruling:</strong> {SPECIAL_PRAYERS.travel.jamRules.hanafiNote}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </AccordionSection>
        </>
    );

    return (
        <div className="container">
            <PageHeader
                title="Salah Rules"
                subtitle="Essential guidelines for prayer"
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Salah Rules', path: '/salah-rules' }
                ]}
            />

            <div className="salah-rules-container">

                {/* Top Controls: Madhhab and Category Selector */}
                <div className="salah-controls">
                    <div className="madhhab-selector-wrapper">
                        <div className="madhhab-label">
                            <Settings2 size={16} />
                            <span>Select Madhhab:</span>
                        </div>
                        <div className="madhhab-pills">
                            {['hanafi', 'shafii', 'maliki', 'hanbali'].map(m => (
                                <button
                                    key={m}
                                    className={`madhhab-pill ${activeMadhhab === m ? 'active' : ''}`}
                                    onClick={() => setActiveMadhhab(m)}
                                >
                                    {m === 'shafii' ? "Shafi'i" : m.charAt(0).toUpperCase() + m.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="category-switcher">
                        <button
                            className={`category-tab ${activeCategory === 'regular' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('regular')}
                        >
                            Regular Salah
                        </button>
                        <button
                            className={`category-tab ${activeCategory === 'voluntary' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('voluntary')}
                        >
                            Voluntary (Sunnah)
                        </button>
                        <button
                            className={`category-tab ${activeCategory === 'special' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('special')}
                        >
                            Special Prayers
                        </button>
                        <div
                            className="category-indicator"
                            style={{
                                transform: `translateX(${activeCategory === 'regular' ? '0%' : activeCategory === 'voluntary' ? '100%' : '200%'})`
                            }}
                        />
                    </div>
                </div>

                {/* Content Area */}
                <div className="salah-content">
                    {activeCategory === 'regular' && renderRegularSalah()}
                    {activeCategory === 'voluntary' && renderVoluntarySalah()}
                    {activeCategory === 'special' && renderSpecialSalah()}
                </div>

                {/* Disclaimer */}
                <div className="disclaimer-box">
                    <AlertTriangle size={18} />
                    <p>This is a simplified guide. Navigating different madhhabs shows major differences, but for detailed rulings please consult a qualified scholar.</p>
                </div>
            </div>
        </div>
    );
};

export default SalahRules;
