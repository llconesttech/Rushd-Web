import { useState } from 'react';
import PropTypes from 'prop-types';
import PageHeader from './PageHeader';
import { ChevronDown, ChevronUp, Clock, CheckCircle, BookOpen, Moon, Users, Book } from 'lucide-react';
import './Taraweeh.css';

// Taraweeh basics
const TARAWEEH_INFO = {
    time: 'After Isha prayer, before Witr',
    type: 'Sunnah Muakkadah (emphasized Sunnah)',
    congregation: 'Preferred in congregation but can be prayed alone',
};

// Two styles of Taraweeh
const TARAWEEH_STYLES = [
    {
        name: 'Khatam Taraweeh',
        arabic: 'تراويح ختم القرآن',
        description: 'Complete Quran recitation during Ramadan',
        details: [
            'One juz (1/30 of Quran) recited each night',
            'Full Quran completed by 29th or 30th Ramadan',
            'Typically 20 rakats to accommodate longer recitation',
            'Common in Masjid al-Haram and major mosques worldwide',
        ],
        recommended: 'Highly recommended - considered a Sunnah to complete Quran in Taraweeh',
    },
    {
        name: 'Surah Taraweeh',
        arabic: 'تراويح سور',
        description: 'Shorter surahs recited each night',
        details: [
            'Various surahs chosen by the Imam each night',
            'No requirement to complete entire Quran',
            'Suitable for those praying at home or shorter congregations',
            'Can be 8, 12, or 20 rakats based on preference',
        ],
        recommended: 'Valid and rewarded - focus on khushu (humility) over length',
    },
];

// Rakat options with scholarly references
const RAKAT_OPTIONS = [
    {
        count: '8 Rakats',
        evidence: 'Hadith of Aisha (RA): "The Prophet ﷺ did not pray more than 11 rakats at night, whether in Ramadan or otherwise."',
        source: 'Bukhari & Muslim',
        followed: 'Ahl-e-Hadith, some Salafi scholars',
    },
    {
        count: '20 Rakats',
        evidence: 'Established during the caliphate of Umar (RA) and continued by Uthman (RA) and Ali (RA).',
        source: 'Reported in Muwatta of Imam Malik',
        followed: 'Hanafi, Shafi\'i, Maliki, Hanbali schools (majority)',
    },
    {
        count: '36 Rakats',
        evidence: '&quot;Some reports mention this was prayed in Madinah during certain periods.&quot;',
        source: 'Some Maliki sources',
        followed: 'Historical practice in some regions',
    },
];

// How to pray Taraweeh
const PRAYER_STEPS = [
    { step: 1, title: 'Pray Isha', description: 'Complete the Isha prayer (4 Fard + 2 Sunnah)' },
    { step: 2, title: 'Make intention', description: 'Intend to pray Taraweeh for the sake of Allah' },
    { step: 3, title: 'Pray 2 rakats', description: 'Pray 2 rakats with longer Quran recitation' },
    { step: 4, title: 'Give Salam', description: 'Complete with salam after every 2 rakats' },
    { step: 5, title: 'Take brief rest', description: 'Short pause between sets (this is the &quot;Tarawih&quot; - rest)' },
    { step: 6, title: 'Repeat', description: 'Continue until 8 or 20 rakats are completed' },
    { step: 7, title: 'Pray Witr', description: 'End with Witr prayer (1, 3, 5, 7, or 9 rakats)' },
];

// Virtues of Taraweeh
const VIRTUES = [
    { text: '&quot;Whoever stands (in prayer) during Ramadan with faith and seeking reward, his previous sins will be forgiven.&quot;', source: 'Bukhari & Muslim' },
    { text: 'Praying in congregation is 27 times more rewarding than praying alone.', source: 'Bukhari & Muslim' },
    { text: 'The one who prays with the Imam until he finishes, it is recorded as if he prayed the whole night.', source: 'Tirmidhi' },
];

// Common Duas during Taraweeh
const DUAS = [
    {
        arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ',
        transliteration: 'Subhanaka Allahumma wa bihamdika, ashhadu an la ilaha illa anta, astaghfiruka wa atubu ilayk',
        meaning: 'Glory be to You, O Allah, and praise be to You. I bear witness that there is no god but You. I seek Your forgiveness and turn to You in repentance.',
        when: 'After every 4 rakats (during rest period)',
    },
    {
        arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
        transliteration: 'Allahumma innaka Afuwwun tuhibbul afwa fa\'fu anni',
        meaning: 'O Allah, You are Forgiving and love forgiveness, so forgive me.',
        when: 'Throughout Ramadan, especially in Witr',
    },
    {
        arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
        transliteration: 'Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina adhaban-nar',
        meaning: 'Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.',
        when: 'General supplication',
    },
];

// Witr Guidelines
const WITR_INFO = [
    { title: 'Minimum', description: '1 rakat' },
    { title: 'Common', description: '3 rakats (with one salam at end, or salam after 2 then 1)' },
    { title: 'Maximum', description: '11 rakats (prayed 2 by 2, then 1)' },
    { title: 'Time', description: 'After Isha until Fajr (best in last third of night)' },
    { title: 'Qunut Dua', description: 'Raised hands after ruku in last rakat (in Ramadan)' },
];

const AccordionSection = ({ title, icon: Icon, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={`accordion - section ${isOpen ? 'open' : ''} `}>
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

const Taraweeh = () => {
    return (
        <div className="container">
            <PageHeader
                title="Taraweeh Prayer"
                subtitle="Night prayers during Ramadan"
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Taraweeh', path: '/taraweeh' }
                ]}
            />

            <div className="taraweeh-container">
                {/* Quick Info Card */}
                <div className="info-card">
                    <Moon size={24} />
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-label">Time</span>
                            <span className="info-value">{TARAWEEH_INFO.time}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Type</span>
                            <span className="info-value">{TARAWEEH_INFO.type}</span>
                        </div>
                        <div className="info-item full-width">
                            <span className="info-label">Congregation</span>
                            <span className="info-value">{TARAWEEH_INFO.congregation}</span>
                        </div>
                    </div>
                </div>

                {/* Types of Taraweeh */}
                <AccordionSection title="Types: Khatam vs Surah Taraweeh" icon={Book} defaultOpen={true}>
                    <div className="styles-grid">
                        {TARAWEEH_STYLES.map((style, index) => (
                            <div key={index} className="style-card">
                                <div className="style-header">
                                    <h4>{style.name}</h4>
                                    <span className="style-arabic">{style.arabic}</span>
                                </div>
                                <p className="style-description">{style.description}</p>
                                <ul className="style-details">
                                    {style.details.map((detail, i) => (
                                        <li key={i}>{detail}</li>
                                    ))}
                                </ul>
                                <div className="style-recommended">{style.recommended}</div>
                            </div>
                        ))}
                    </div>
                </AccordionSection>

                {/* Rakat Options */}
                <AccordionSection title="Number of Rakats (Scholarly Views)" icon={Clock}>
                    <p className="section-intro">Different rakats are practiced based on scholarly opinions:</p>
                    <div className="rakat-options">
                        {RAKAT_OPTIONS.map((option, index) => (
                            <div key={index} className="rakat-card">
                                <div className="rakat-count">{option.count}</div>
                                <div className="rakat-evidence">{option.evidence}</div>
                                <div className="rakat-source">📚 {option.source}</div>
                                <div className="rakat-followed">👥 Followed by: {option.followed}</div>
                            </div>
                        ))}
                    </div>
                </AccordionSection>

                {/* How to Pray */}
                <AccordionSection title="How to Pray Taraweeh" icon={BookOpen}>
                    <div className="steps-list">
                        {PRAYER_STEPS.map((item) => (
                            <div key={item.step} className="step-item">
                                <div className="step-number">{item.step}</div>
                                <div className="step-content">
                                    <div className="step-title">{item.title}</div>
                                    <div className="step-description">{item.description}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </AccordionSection>

                {/* Witr Prayer */}
                <AccordionSection title="Witr Prayer" icon={Moon}>
                    <p className="section-intro">Witr is performed after Taraweeh:</p>
                    <div className="witr-grid">
                        {WITR_INFO.map((item, index) => (
                            <div key={index} className="witr-item">
                                <span className="witr-label">{item.title}</span>
                                <span className="witr-value">{item.description}</span>
                            </div>
                        ))}
                    </div>
                </AccordionSection>

                {/* Virtues */}
                <AccordionSection title="Virtues of Taraweeh" icon={CheckCircle}>
                    <div className="virtues-list">
                        {VIRTUES.map((item, index) => (
                            <div key={index} className="virtue-item">
                                <p className="virtue-text">&quot;{item.text}&quot;</p>
                                <span className="virtue-source">— {item.source}</span>
                            </div>
                        ))}
                    </div>
                </AccordionSection>

                {/* Duas */}
                <AccordionSection title="Duas for Taraweeh" icon={Users}>
                    <div className="duas-list">
                        {DUAS.map((dua, index) => (
                            <div key={index} className="dua-card">
                                <div className="dua-arabic">{dua.arabic}</div>
                                <div className="dua-transliteration">{dua.transliteration}</div>
                                <div className="dua-meaning">{dua.meaning}</div>
                                <div className="dua-when">📍 {dua.when}</div>
                            </div>
                        ))}
                    </div>
                </AccordionSection>

            </div>
        </div>
    );
};

AccordionSection.propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    children: PropTypes.node.isRequired,
    defaultOpen: PropTypes.bool
};

export default Taraweeh;
