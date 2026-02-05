import React, { useState } from 'react';
import PageHeader from './PageHeader';
import { ChevronDown, ChevronUp, Clock, CheckCircle, XCircle, AlertTriangle, BookOpen } from 'lucide-react';
import './SalahRules.css';

// Prayer times and Rakat counts
const PRAYER_RAKATS = [
    { name: 'Fajr', arabic: 'الفجر', sunnah: 2, fard: 2, total: 4, time: 'Dawn until sunrise' },
    { name: 'Dhuhr', arabic: 'الظهر', sunnahBefore: 4, fard: 4, sunnahAfter: 2, total: 10, time: 'After zenith until Asr' },
    { name: 'Asr', arabic: 'العصر', sunnah: 4, fard: 4, optional: true, total: 8, time: 'Mid-afternoon until sunset' },
    { name: 'Maghrib', arabic: 'المغرب', fard: 3, sunnahAfter: 2, total: 5, time: 'After sunset until twilight fades' },
    { name: 'Isha', arabic: 'العشاء', sunnahBefore: 4, fard: 4, sunnahAfter: 2, witr: 3, total: 13, time: 'After twilight until midnight' },
];

const CONDITIONS = [
    { title: 'Islam', description: 'Being a Muslim' },
    { title: 'Sanity', description: 'Being of sound mind' },
    { title: 'Puberty', description: 'Having reached the age of maturity' },
    { title: 'Purity', description: 'Being free from major and minor impurities (Wudu/Ghusl)' },
    { title: 'Covering Awrah', description: 'Appropriate covering for men and women' },
    { title: 'Facing Qiblah', description: 'Facing the direction of the Kaaba' },
    { title: 'Intention (Niyyah)', description: 'Making sincere intention for the specific prayer' },
    { title: 'Time', description: 'Prayer must be performed within its prescribed time' },
];

const PILLARS = [
    { title: 'Standing (Qiyam)', description: 'Standing upright if able' },
    { title: 'Opening Takbir', description: 'Saying "Allahu Akbar" to begin' },
    { title: 'Reciting Al-Fatiha', description: 'Reciting Surah Al-Fatiha in every rakat' },
    { title: 'Bowing (Ruku)', description: 'Bowing with hands on knees' },
    { title: 'Rising from Ruku', description: 'Standing upright after bowing' },
    { title: 'Prostration (Sujud)', description: 'Prostrating twice in each rakat' },
    { title: 'Sitting between Sujud', description: 'Brief sitting between the two prostrations' },
    { title: 'Final Tashahhud', description: 'Sitting and reciting the testimony of faith' },
    { title: 'Salawat upon Prophet ﷺ', description: 'Sending blessings in final tashahhud' },
    { title: 'Taslim', description: 'Saying "As-salamu alaykum wa rahmatullah" to end' },
    { title: 'Tranquility', description: 'Performing each action calmly without rushing' },
    { title: 'Order', description: 'Performing actions in the correct sequence' },
];

const INVALIDATORS = [
    { title: 'Speaking intentionally', description: 'Talking about worldly matters during prayer' },
    { title: 'Eating or drinking', description: 'Consuming food or drink while praying' },
    { title: 'Excessive movement', description: 'Unnecessary excessive movements' },
    { title: 'Breaking Wudu', description: 'Losing ablution state' },
    { title: 'Turning away from Qiblah', description: 'Completely turning away from the prayer direction' },
    { title: 'Laughing aloud', description: 'Laughing loudly during prayer' },
    { title: 'Intentionally leaving a pillar', description: 'Skipping an essential part' },
    { title: 'Uncovering Awrah', description: 'Exposing parts that must be covered' },
];

const SUNNAH_ACTS = [
    { title: 'Opening supplication', description: 'Dua after opening takbir' },
    { title: 'Seeking refuge', description: 'Saying "A\'udhu billahi min ash-shaytan ir-rajim"' },
    { title: 'Saying Ameen', description: 'After Surah Al-Fatiha' },
    { title: 'Surah after Fatiha', description: 'Reciting additional Quran in first two rakats' },
    { title: 'Dhikr in Ruku', description: 'Saying "Subhana Rabbiyal Adhim"' },
    { title: 'Dhikr in Sujud', description: 'Saying "Subhana Rabbiyal A\'la"' },
    { title: 'Raising hands', description: 'At opening takbir, before ruku, and rising from it' },
    { title: 'Placing right hand over left', description: 'During standing positions' },
];

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

const SalahRules = () => {
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
                {/* Prayer Times & Rakats */}
                <AccordionSection title="Prayer Times & Rakats" icon={Clock} defaultOpen={true}>
                    <div className="rakats-table">
                        <div className="rakats-header">
                            <span>Prayer</span>
                            <span>Sunnah</span>
                            <span>Fard</span>
                            <span>After</span>
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
                                    {prayer.witr && <small>+{prayer.witr}W</small>}
                                </span>
                                <span className="rakat-count total">{prayer.total}</span>
                            </div>
                        ))}
                    </div>
                    <p className="legend">
                        <span className="badge fard">Fard = Obligatory</span>
                        <span className="badge sunnah">Sunnah = Recommended</span>
                        <span className="badge witr">W = Witr</span>
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

                {/* Disclaimer */}
                <div className="disclaimer-box">
                    <AlertTriangle size={18} />
                    <p>This is a simplified guide. For detailed rulings specific to your madhab (school of thought), please consult a qualified scholar.</p>
                </div>
            </div>
        </div>
    );
};

export default SalahRules;
