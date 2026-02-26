/* eslint-disable */
import React, { useState } from 'react';
import PageHeader from './PageHeader';
import { ChevronDown, ChevronUp, CheckCircle, XCircle, AlertTriangle, Clock, Heart, Gift, Users } from 'lucide-react';
import './FastingRules.css';

// Who must fast
const OBLIGATORY_CONDITIONS = [
    { title: 'Islam', description: 'Being a Muslim' },
    { title: 'Sanity', description: 'Being of sound mind' },
    { title: 'Puberty', description: 'Having reached the age of maturity' },
    { title: 'Ability', description: 'Being physically capable of fasting' },
    { title: 'Residency', description: 'Not being a traveler (musafir)' },
    { title: 'Free from impediments', description: 'Women not menstruating or in postpartum bleeding' },
];

// Pillars of fasting
const PILLARS = [
    { title: 'Intention (Niyyah)', description: 'Making sincere intention before Fajr for obligatory fasts' },
    { title: 'Abstaining from food & drink', description: 'Refraining from eating and drinking from Fajr to Maghrib' },
    { title: 'Abstaining from intimacy', description: 'Refraining from marital relations during fasting hours' },
    { title: 'Time period', description: 'Observing the fast from dawn (Fajr) to sunset (Maghrib)' },
];

// What invalidates the fast
const INVALIDATORS = [
    { title: 'Eating or drinking intentionally', description: 'Consuming food, drink, or anything with nutritional value' },
    { title: 'Marital relations', description: 'Sexual intercourse during fasting hours' },
    { title: 'Intentional vomiting', description: 'Deliberately inducing vomiting' },
    { title: 'Menstruation or postpartum bleeding', description: 'Beginning of menstrual or postnatal bleeding' },
    { title: 'Injections with nutrients', description: 'IV drips or injections that provide nourishment' },
    { title: 'Intentional ejaculation', description: 'Through any means other than intercourse' },
];

// What does NOT invalidate the fast
const NON_INVALIDATORS = [
    { title: 'Eating or drinking forgetfully', description: 'Continue your fast - it is provision from Allah' },
    { title: 'Unintentional vomiting', description: 'Vomiting without deliberately inducing it' },
    { title: 'Wet dreams', description: 'Nocturnal emissions during sleep' },
    { title: 'Swallowing saliva', description: 'Normal swallowing of one\'s own saliva' },
    { title: 'Using miswak/toothbrush', description: 'Cleaning teeth without swallowing toothpaste' },
    { title: 'Tasting food without swallowing', description: 'For cooking purposes, then spitting it out' },
    { title: 'Eye drops, ear drops', description: 'According to most scholars' },
    { title: 'Blood tests', description: 'Small amounts of blood drawn for testing' },
    { title: 'Injections (non-nutritious)', description: 'Medical injections that don\'t provide nourishment' },
];

// Who is exempted
const EXEMPTIONS = [
    { title: 'Travelers', description: 'Those on a journey may break fast and make up later', makeUp: true },
    { title: 'Pregnant women', description: 'If fasting harms them or the baby', makeUp: true },
    { title: 'Breastfeeding mothers', description: 'If fasting affects milk production or baby', makeUp: true },
    { title: 'Sick persons', description: 'Illness that would worsen with fasting', makeUp: true },
    { title: 'Elderly (chronic)', description: 'Those unable to fast due to old age', fidyah: true },
    { title: 'Chronically ill', description: 'Permanent illness with no hope of recovery', fidyah: true },
];

// Sunnah acts of fasting
const SUNNAH_ACTS = [
    { title: 'Suhoor (pre-dawn meal)', description: 'Eating before Fajr, even if just water' },
    { title: 'Delaying Suhoor', description: 'Eating close to Fajr time' },
    { title: 'Hastening Iftar', description: 'Breaking fast immediately after Maghrib' },
    { title: 'Breaking with dates', description: 'Preferably odd number of fresh or dry dates' },
    { title: 'Dua at Iftar', description: 'Making supplication when breaking fast' },
    { title: 'Generosity', description: 'Increasing in charity and good deeds' },
    { title: 'Reciting Quran', description: 'Increasing Quran recitation during Ramadan' },
    { title: 'Taraweeh prayer', description: 'Praying night prayers in congregation' },
    { title: 'I\'tikaf', description: 'Seclusion in the mosque, especially last 10 days' },
    { title: 'Seeking Laylatul Qadr', description: 'Extra worship in the last 10 nights' },
];

// Types of fasts
const FAST_TYPES = [
    { type: 'Obligatory (Fard)', examples: 'Ramadan fasting', icon: '🌙' },
    { type: 'Necessary (Wajib)', examples: 'Vowed fasts, make-up fasts', icon: '📌' },
    { type: 'Recommended (Sunnah)', examples: 'Mondays & Thursdays, Ayyam al-Beed, Ashura', icon: '⭐' },
    { type: 'Disliked (Makruh)', examples: 'Fasting only on Friday or Saturday alone', icon: '⚠️' },
    { type: 'Prohibited (Haram)', examples: 'Eid days, days of Tashreeq', icon: '🚫' },
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

const FastingRules = () => {
    return (
        <div className="container">
            <PageHeader
                title="Fasting Rules"
                subtitle="Essential guidelines for Sawm (Fasting)"
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Fasting Rules', path: '/fasting' }
                ]}
            />

            <div className="fasting-rules-container">
                {/* Types of Fasts */}
                <AccordionSection title="Types of Fasts" icon={Clock} defaultOpen={true}>
                    <div className="fast-types-grid">
                        {FAST_TYPES.map((item, index) => (
                            <div key={index} className="fast-type-card">
                                <span className="fast-icon">{item.icon}</span>
                                <div className="fast-type-content">
                                    <div className="fast-type-name">{item.type}</div>
                                    <div className="fast-type-examples">{item.examples}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </AccordionSection>

                {/* Who Must Fast */}
                <AccordionSection title="Who Must Fast" icon={Users}>
                    <p className="section-intro">Fasting is obligatory for those who meet these conditions:</p>
                    <div className="rules-grid">
                        {OBLIGATORY_CONDITIONS.map((item, index) => (
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

                {/* Pillars of Fasting */}
                <AccordionSection title="Pillars of Fasting (Arkan)" icon={CheckCircle}>
                    <p className="section-intro">Essential elements that constitute a valid fast:</p>
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

                {/* What Breaks the Fast */}
                <AccordionSection title="What Breaks the Fast" icon={XCircle}>
                    <p className="section-intro">Actions that invalidate the fast and require make-up:</p>
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

                {/* What Does NOT Break the Fast */}
                <AccordionSection title="What Does NOT Break the Fast" icon={CheckCircle}>
                    <p className="section-intro">Common misconceptions - these do not invalidate your fast:</p>
                    <div className="rules-grid">
                        {NON_INVALIDATORS.map((item, index) => (
                            <div key={index} className="rule-item valid">
                                <div className="rule-icon"><CheckCircle size={16} /></div>
                                <div className="rule-content">
                                    <div className="rule-title">{item.title}</div>
                                    <div className="rule-description">{item.description}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </AccordionSection>

                {/* Exemptions */}
                <AccordionSection title="Who is Exempted" icon={Heart}>
                    <p className="section-intro">Those who may skip fasting with valid reasons:</p>
                    <div className="rules-grid">
                        {EXEMPTIONS.map((item, index) => (
                            <div key={index} className="rule-item exemption">
                                <div className="rule-content">
                                    <div className="rule-title">{item.title}</div>
                                    <div className="rule-description">{item.description}</div>
                                    <div className="rule-tags">
                                        {item.makeUp && <span className="tag makeup">Make up later</span>}
                                        {item.fidyah && <span className="tag fidyah">Pay Fidyah</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="fidyah-note">
                        <strong>Fidyah:</strong> Feeding one poor person for each day missed (approximately one meal).
                    </div>
                </AccordionSection>

                {/* Sunnah Acts */}
                <AccordionSection title="Recommended Acts (Sunnah)" icon={Gift}>
                    <p className="section-intro">Acts that increase the reward of fasting:</p>
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

                {/* Disclaimer */}
                <div className="disclaimer-box">
                    <AlertTriangle size={18} />
                    <p>This is a simplified guide based on general Islamic principles. For detailed rulings specific to your madhab (school of thought), please consult a qualified scholar.</p>
                </div>
            </div>
        </div>
    );
};

export default FastingRules;

