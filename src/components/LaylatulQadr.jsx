import React, { useState, useMemo } from 'react';
import PageHeader from './PageHeader';
import { ChevronDown, ChevronUp, Star, Moon, BookOpen, Heart, Clock, AlertTriangle } from 'lucide-react';
import { getRamadanInfo } from '../services/ramadanService';
import './LaylatulQadr.css';

// Odd nights of last 10 days
const ODD_NIGHTS = [21, 23, 25, 27, 29];

// Virtues and significance
const VIRTUES = [
    { text: 'The Night of Decree is better than a thousand months.', source: 'Quran 97:3' },
    { text: 'Therein descend the angels and the Spirit by permission of their Lord for every matter.', source: 'Quran 97:4' },
    { text: 'Whoever stands (in prayer) during Laylatul Qadr with faith and seeking reward, his previous sins will be forgiven.', source: 'Bukhari & Muslim' },
    { text: 'Search for Laylatul Qadr in the odd nights of the last ten days of Ramadan.', source: 'Bukhari' },
];

// What to do on Laylatul Qadr
const RECOMMENDED_ACTS = [
    { title: 'Night Prayers (Qiyam)', description: 'Pray as much as you can - Tahajjud, Taraweeh', icon: '🕌' },
    { title: 'Quran Recitation', description: 'The night when Quran was revealed - recite abundantly', icon: '📖' },
    { title: 'Dua (Supplication)', description: 'Make unlimited duas - the night of acceptance', icon: '🤲' },
    { title: 'Dhikr', description: 'Remember Allah through various forms of dhikr', icon: '📿' },
    { title: 'Istighfar', description: 'Seek forgiveness intensely', icon: '💚' },
    { title: 'Charity', description: 'Give sadaqah - reward multiplied on this night', icon: '💝' },
    { title: 'I\'tikaf', description: 'Seclusion in the mosque for worship', icon: '🕋' },
    { title: 'Learning', description: 'Study Islamic knowledge, attend lectures', icon: '📚' },
];

// Essential Duas for Laylatul Qadr
const DUAS = [
    {
        title: 'The Primary Laylatul Qadr Dua',
        arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
        transliteration: 'Allahumma innaka Afuwwun tuhibbul afwa fa\'fu anni',
        meaning: 'O Allah, You are Forgiving and love forgiveness, so forgive me.',
        source: 'Taught by Prophet ﷺ to Aisha (Tirmidhi)',
        highlight: true,
    },
    {
        title: 'Seeking Refuge',
        arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ جَهَنَّمَ وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ',
        transliteration: 'Allahumma inni a\'udhu bika min adhabi jahannam, wa a\'udhu bika min adhabil qabr',
        meaning: 'O Allah, I seek refuge in You from the punishment of Hellfire and from the punishment of the grave.',
        source: 'Muslim',
    },
    {
        title: 'For Good in Both Worlds',
        arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
        transliteration: 'Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina adhaban-nar',
        meaning: 'Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.',
        source: 'Quran 2:201',
    },
    {
        title: 'For Steadfastness',
        arabic: 'يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ',
        transliteration: 'Ya Muqallibal qulub, thabbit qalbi \'ala dinik',
        meaning: 'O Turner of hearts, keep my heart firm upon Your religion.',
        source: 'Tirmidhi',
    },
    {
        title: 'For Guidance',
        arabic: 'اللَّهُمَّ اهْدِنِي وَسَدِّدْنِي',
        transliteration: 'Allahumma-hdini wa saddidni',
        meaning: 'O Allah, guide me and keep me on the right path.',
        source: 'Muslim',
    },
];

// Signs of Laylatul Qadr
const SIGNS = [
    'A calm and peaceful night',
    'Neither very hot nor very cold',
    'The moon is like half a plate (clear crescent)',
    'The sun rises the next morning without strong rays',
    'A sense of tranquility and spiritual peace',
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

const LaylatulQadr = () => {
    const ramadanInfo = useMemo(() => getRamadanInfo(), []);

    // Calculate odd night dates
    const oddNightDates = useMemo(() => {
        if (!ramadanInfo.startDate) return [];
        return ODD_NIGHTS.map(day => {
            const date = new Date(ramadanInfo.startDate);
            date.setDate(date.getDate() + day - 1);
            return {
                ramadanDay: day,
                gregorian: date,
                formatted: date.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                }),
                isPast: date < new Date(),
                isToday: date.toDateString() === new Date().toDateString(),
            };
        });
    }, [ramadanInfo]);

    return (
        <div className="container">
            <PageHeader
                title="Laylatul Qadr"
                subtitle="The Night of Power & Decree"
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Laylatul Qadr', path: '/laylatul-qadr' }
                ]}
            />

            <div className="laylatul-qadr-container">
                {/* Hero Card */}
                <div className="lq-hero">
                    <div className="lq-hero-content">
                        <Star size={32} />
                        <h2>لَيْلَةُ الْقَدْرِ خَيْرٌ مِنْ أَلْفِ شَهْرٍ</h2>
                        <p>The Night of Decree is better than a thousand months</p>
                        <span className="quran-ref">— Surah Al-Qadr (97:3)</span>
                    </div>
                </div>

                {/* Odd Nights Calendar */}
                <div className="odd-nights-card">
                    <h3><Moon size={18} /> Seek it on Odd Nights</h3>
                    <p className="odd-nights-intro">The Prophet ﷺ said: "Search for Laylatul Qadr in the odd nights of the last ten days."</p>
                    <div className="odd-nights-grid">
                        {oddNightDates.map((night) => (
                            <div
                                key={night.ramadanDay}
                                className={`odd-night ${night.isPast ? 'past' : ''} ${night.isToday ? 'today' : ''}`}
                            >
                                <span className="night-number">{night.ramadanDay}</span>
                                <span className="night-label">Night</span>
                                <span className="night-date">{night.formatted}</span>
                                {night.isToday && <span className="today-badge">Tonight!</span>}
                            </div>
                        ))}
                    </div>
                    <p className="note">* Dates depend on moon sighting. Most emphasized is the 27th night.</p>
                </div>

                {/* What to Do */}
                <AccordionSection title="What to Do on Laylatul Qadr" icon={Heart} defaultOpen={true}>
                    <div className="acts-grid">
                        {RECOMMENDED_ACTS.map((act, index) => (
                            <div key={index} className="act-card">
                                <span className="act-icon">{act.icon}</span>
                                <div className="act-content">
                                    <div className="act-title">{act.title}</div>
                                    <div className="act-description">{act.description}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </AccordionSection>

                {/* Duas */}
                <AccordionSection title="Essential Duas" icon={BookOpen}>
                    <div className="duas-list">
                        {DUAS.map((dua, index) => (
                            <div key={index} className={`dua-card ${dua.highlight ? 'highlight' : ''}`}>
                                <div className="dua-header">
                                    <span className="dua-title">{dua.title}</span>
                                    {dua.highlight && <span className="primary-badge">Most Important</span>}
                                </div>
                                <div className="dua-arabic">{dua.arabic}</div>
                                <div className="dua-transliteration">{dua.transliteration}</div>
                                <div className="dua-meaning">{dua.meaning}</div>
                                <div className="dua-source">📚 {dua.source}</div>
                            </div>
                        ))}
                    </div>
                </AccordionSection>

                {/* Virtues */}
                <AccordionSection title="Virtues & Significance" icon={Star}>
                    <div className="virtues-list">
                        {VIRTUES.map((item, index) => (
                            <div key={index} className="virtue-item">
                                <p className="virtue-text">"{item.text}"</p>
                                <span className="virtue-source">— {item.source}</span>
                            </div>
                        ))}
                    </div>
                </AccordionSection>

                {/* Signs */}
                <AccordionSection title="Signs of Laylatul Qadr" icon={Clock}>
                    <p className="section-intro">Some reported signs (not definitive):</p>
                    <ul className="signs-list">
                        {SIGNS.map((sign, index) => (
                            <li key={index}>{sign}</li>
                        ))}
                    </ul>
                    <p className="signs-note">
                        <strong>Note:</strong> We should seek it every odd night without waiting for signs.
                        The wisdom is in the seeking itself.
                    </p>
                </AccordionSection>

                {/* Disclaimer */}
                <div className="disclaimer-box">
                    <AlertTriangle size={18} />
                    <p>Exact date of Laylatul Qadr is hidden - seek it on all odd nights of the last 10 days of Ramadan. Dates shown are approximate based on calculated Ramadan dates.</p>
                </div>
            </div>
        </div>
    );
};

export default LaylatulQadr;
