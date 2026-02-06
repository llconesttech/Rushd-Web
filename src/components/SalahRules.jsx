import React, { useState } from 'react';
import PageHeader from './PageHeader';
import { ChevronDown, ChevronUp, Clock, CheckCircle, XCircle, AlertTriangle, BookOpen, Moon, MessageSquare, List } from 'lucide-react';
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

// Essential Duas During Prayer
const SALAH_DUAS = [
    {
        position: 'Opening (Sana)',
        arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَى جَدُّكَ وَلَا إِلَهَ غَيْرُكَ',
        transliteration: 'Subhanaka Allahumma wa bihamdika, wa tabarakasmuka, wa ta\'ala jadduka, wa la ilaha ghairuk',
        meaning: 'Glory be to You O Allah, and praise be to You. Blessed is Your name, exalted is Your majesty, and there is no god but You.',
        when: 'After opening Takbir, before Fatiha',
    },
    {
        position: 'Seeking Refuge (Ta\'awwudh)',
        arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
        transliteration: 'A\'udhu billahi min ash-shaytanir-rajim',
        meaning: 'I seek refuge in Allah from the accursed Satan.',
        when: 'Before Bismillah, every rakat (silently)',
    },
    {
        position: 'Basmala',
        arabic: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
        transliteration: 'Bismillahir-Rahmanir-Rahim',
        meaning: 'In the name of Allah, the Most Gracious, the Most Merciful.',
        when: 'Before Surah Al-Fatiha',
    },
    {
        position: 'After Fatiha',
        arabic: 'آمِين',
        transliteration: 'Ameen',
        meaning: 'O Allah, accept (our supplication).',
        when: 'After "walad-dallin" in Fatiha',
    },
    {
        position: 'Going to Ruku',
        arabic: 'اللَّهُ أَكْبَرُ',
        transliteration: 'Allahu Akbar',
        meaning: 'Allah is the Greatest.',
        when: 'While bending for Ruku',
    },
    {
        position: 'In Ruku',
        arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
        transliteration: 'Subhana Rabbiyal Azeem',
        meaning: 'Glory be to my Lord, the Magnificent.',
        when: 'Recite 3 times minimum in Ruku',
    },
    {
        position: 'Rising from Ruku',
        arabic: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ',
        transliteration: 'Sami\'Allahu liman hamidah',
        meaning: 'Allah hears whoever praises Him.',
        when: 'While rising from Ruku',
    },
    {
        position: 'Standing after Ruku',
        arabic: 'رَبَّنَا وَلَكَ الْحَمْدُ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ',
        transliteration: 'Rabbana wa lakal hamd, hamdan kathiran tayyiban mubarakan fih',
        meaning: 'Our Lord, to You belongs all praise, abundant, pure, and blessed.',
        when: 'After standing upright from Ruku',
    },
    {
        position: 'Going to Sujud',
        arabic: 'اللَّهُ أَكْبَرُ',
        transliteration: 'Allahu Akbar',
        meaning: 'Allah is the Greatest.',
        when: 'While going down for Sujud',
    },
    {
        position: 'In Sujud',
        arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
        transliteration: 'Subhana Rabbiyal A\'la',
        meaning: 'Glory be to my Lord, the Most High.',
        when: 'Recite 3 times minimum in Sujud',
    },
    {
        position: 'Between Two Sujud',
        arabic: 'رَبِّ اغْفِرْ لِي وَارْحَمْنِي وَاهْدِنِي وَعَافِنِي وَارْزُقْنِي',
        transliteration: 'Rabbighfirli, warhamni, wahdini, wa\'afini, warzuqni',
        meaning: 'My Lord, forgive me, have mercy on me, guide me, grant me well-being, and provide for me.',
        when: 'Sitting between the two prostrations',
    },
    {
        position: 'Tashahhud (At-Tahiyyat)',
        arabic: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
        transliteration: 'At-tahiyyatu lillahi was-salawatu wat-tayyibat. As-salamu \'alayka ayyuhan-nabiyyu wa rahmatullahi wa barakatuh. As-salamu \'alayna wa \'ala \'ibadillahis-salihin. Ash-hadu alla ilaha illallah, wa ash-hadu anna Muhammadan \'abduhu wa rasuluh',
        meaning: 'All greetings, prayers and good things are for Allah. Peace be upon you, O Prophet, and the mercy of Allah and His blessings. Peace be upon us and upon the righteous servants of Allah. I bear witness that there is no god but Allah, and I bear witness that Muhammad is His servant and messenger.',
        when: 'First and final sitting (Tashahhud)',
    },
    {
        position: 'Salawat (Durood Ibrahim)',
        arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
        transliteration: 'Allahumma salli \'ala Muhammad wa \'ala ali Muhammad, kama sallaita \'ala Ibrahim wa \'ala ali Ibrahim, innaka Hamidun Majid. Allahumma barik \'ala Muhammad wa \'ala ali Muhammad, kama barakta \'ala Ibrahim wa \'ala ali Ibrahim, innaka Hamidun Majid',
        meaning: 'O Allah, send prayers upon Muhammad and upon the family of Muhammad, as You sent prayers upon Ibrahim and the family of Ibrahim. You are Praiseworthy, Glorious. O Allah, bless Muhammad and the family of Muhammad, as You blessed Ibrahim and the family of Ibrahim. You are Praiseworthy, Glorious.',
        when: 'After Tashahhud in final sitting',
    },
    {
        position: 'Before Salam (Dua)',
        arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ جَهَنَّمَ، وَمِنْ عَذَابِ الْقَبْرِ، وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ، وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ',
        transliteration: 'Allahumma inni a\'udhu bika min \'adhabi jahannam, wa min \'adhabil-qabr, wa min fitnatil-mahya wal-mamat, wa min sharri fitnatil-masihid-dajjal',
        meaning: 'O Allah, I seek refuge in You from the punishment of Hell, from the punishment of the grave, from the trials of life and death, and from the evil of the trial of the False Messiah.',
        when: 'Before Salam (recommended)',
    },
    {
        position: 'Salam (Taslim)',
        arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ',
        transliteration: 'As-salamu \'alaykum wa rahmatullah',
        meaning: 'Peace be upon you and the mercy of Allah.',
        when: 'Turning right then left to end prayer',
    },
];

// Rakat Recitation Rules
const RAKAT_RULES = [
    {
        rakat: 'Rakat 1',
        recitation: ['Sana (Opening Dua)', 'Ta\'awwudh', 'Bismillah', 'Surah Al-Fatiha', 'Any Surah/Ayat'],
        notes: 'Full recitation with additional surah. Recite audibly in Fajr, Maghrib, Isha (Fard); silently in Dhuhr, Asr.',
    },
    {
        rakat: 'Rakat 2',
        recitation: ['Bismillah', 'Surah Al-Fatiha', 'Any Surah/Ayat'],
        notes: 'Same as Rakat 1 but without opening Sana. Sit for Tashahhud after this in 2-rakat prayers.',
    },
    {
        rakat: 'Rakat 3',
        recitation: ['Bismillah', 'Surah Al-Fatiha only (Hanafi)', 'OR Fatiha + Surah (Shafi\'i)'],
        notes: 'In 3 or 4 rakat prayers. Hanafi: only Fatiha. Shafi\'i: can add surah. Always recite silently.',
    },
    {
        rakat: 'Rakat 4',
        recitation: ['Bismillah', 'Surah Al-Fatiha only'],
        notes: 'Same as Rakat 3. Final sitting with full Tashahhud + Durood + Dua before Salam.',
    },
];

// Witr Prayer Guidelines
const WITR_INFO = {
    basics: [
        { label: 'Status', value: 'Wajib (obligatory) in Hanafi; Sunnah Muakkadah in others' },
        { label: 'Time', value: 'After Isha until Fajr (best in last third of night)' },
        { label: 'Rakats', value: '1, 3, 5, 7, 9, or 11 rakats (odd number)' },
        { label: 'Common', value: '3 rakats (most common practice)' },
    ],
    methods: [
        {
            name: 'Hanafi Method (3 Rakats)',
            steps: [
                'Pray 3 rakats continuously like Maghrib',
                'Sit for Tashahhud after 2nd rakat, then stand for 3rd',
                'In 3rd rakat: Fatiha + Surah, then raise hands and recite Dua Qunut',
                'Say "Allahu Akbar" before Qunut, not after',
                'Complete with Ruku, Sujud, and Salam',
            ],
        },
        {
            name: 'Other Madhabs (1 or 3 Rakats)',
            steps: [
                'Option 1: Pray 2 rakats, give salam, then pray 1 rakat separately',
                'Option 2: Pray 3 rakats with one salam at end (like Maghrib but Qunut in last rakat)',
                'Qunut can be before or after Ruku depending on madhab',
                'Some recite Qunut only in second half of Ramadan',
            ],
        },
    ],
    qunutDua: {
        arabic: 'اللَّهُمَّ إِنَّا نَسْتَعِينُكَ وَنَسْتَغْفِرُكَ وَنُؤْمِنُ بِكَ وَنَتَوَكَّلُ عَلَيْكَ وَنُثْنِي عَلَيْكَ الْخَيْرَ وَنَشْكُرُكَ وَلَا نَكْفُرُكَ وَنَخْلَعُ وَنَتْرُكُ مَنْ يَفْجُرُكَ، اللَّهُمَّ إِيَّاكَ نَعْبُدُ وَلَكَ نُصَلِّي وَنَسْجُدُ وَإِلَيْكَ نَسْعَى وَنَحْفِدُ وَنَرْجُو رَحْمَتَكَ وَنَخْشَى عَذَابَكَ إِنَّ عَذَابَكَ بِالْكُفَّارِ مُلْحِقٌ',
        transliteration: 'Allahumma inna nasta\'inuka wa nastaghfiruka wa nu\'minu bika wa natawakkalu \'alayka wa nuthni \'alaykal-khayr. Wa nashkuruka wa la nakfuruka wa nakhla\'u wa natruku man yafjuruk. Allahumma iyyaka na\'budu wa laka nusalli wa nasjudu wa ilayka nas\'a wa nahfidu wa narju rahmataka wa nakhsha \'adhabaka inna \'adhabaka bil-kuffari mulhiq',
        meaning: 'O Allah, we seek Your help and ask for Your forgiveness, and we believe in You and rely on You, and we praise You with all good. We thank You and do not deny You. We abandon and forsake whoever disobeys You. O Allah, You alone we worship, to You we pray and prostrate, to You we hasten. We hope for Your mercy and fear Your punishment. Indeed, Your punishment will reach the disbelievers.',
    },
};

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
                    <p className="legend">
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

                {/* Prayer Duas */}
                <AccordionSection title="Duas During Prayer" icon={MessageSquare}>
                    <p className="section-intro">Essential supplications to recite during each position of prayer:</p>
                    <div className="duas-list">
                        {SALAH_DUAS.map((dua, index) => (
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

                {/* Witr Prayer */}
                <AccordionSection title="Witr Prayer Guidelines" icon={Moon}>
                    <div className="witr-section">
                        <div className="witr-basics">
                            <h4>Basic Information</h4>
                            <div className="witr-basics-grid">
                                {WITR_INFO.basics.map((item, index) => (
                                    <div key={index} className="witr-basic-item">
                                        <span className="witr-label">{item.label}</span>
                                        <span className="witr-value">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="witr-methods">
                            <h4>Methods of Praying</h4>
                            {WITR_INFO.methods.map((method, index) => (
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
                                <div className="dua-arabic">{WITR_INFO.qunutDua.arabic}</div>
                                <div className="dua-transliteration">{WITR_INFO.qunutDua.transliteration}</div>
                                <div className="dua-meaning">{WITR_INFO.qunutDua.meaning}</div>
                            </div>
                        </div>
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
