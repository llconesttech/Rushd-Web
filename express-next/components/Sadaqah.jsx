import { useState } from 'react';
import PropTypes from 'prop-types';
import PageHeader from './PageHeader';
import { ChevronDown, ChevronUp, Heart, Gift, Users, BookOpen, AlertTriangle, Coins, HandHeart, Sparkles } from 'lucide-react';
import './Sadaqah.css';

// Types of Sadaqah
const SADAQAH_TYPES = [
    {
        name: 'Sadaqah',
        arabic: 'صدقة',
        description: 'Voluntary charity given at any time',
        details: 'Can be any amount, given to anyone in need. No fixed rules on amount or timing.',
        reward: 'Continuous rewards, extinguishes sins like water extinguishes fire',
    },
    {
        name: 'Sadaqah Jariyah',
        arabic: 'صدقة جارية',
        description: 'Ongoing/continuous charity',
        details: 'Charity whose benefits continue after death: building wells, schools, mosques, planting trees, beneficial knowledge.',
        reward: 'Rewards continue even after death as long as people benefit',
    },
    {
        name: 'Zakat',
        arabic: 'زكاة',
        description: 'Obligatory charity (2.5% of savings)',
        details: 'One of the five pillars of Islam. Must be given if wealth exceeds nisab for one lunar year.',
        reward: 'Purifies wealth and fulfills obligation',
    },
    {
        name: 'Zakat al-Fitr',
        arabic: 'زكاة الفطر',
        description: 'Charity given at end of Ramadan',
        details: 'Obligatory before Eid prayer. Approximately one sa&apos; of staple food per family member.',
        reward: 'Purifies the fast and provides for the needy on Eid',
    },
    {
        name: 'Fidyah',
        arabic: 'فدية',
        description: 'Compensation for missed fasts',
        details: 'Feeding one poor person for each missed fast (for those unable to fast due to chronic illness/old age).',
        reward: 'Fulfills obligation when fasting is not possible',
    },
    {
        name: 'Kaffarah',
        arabic: 'كفارة',
        description: 'Expiation for broken oaths/fasts',
        details: 'Feeding 60 poor people or fasting 60 consecutive days for deliberately breaking a Ramadan fast.',
        reward: 'Atones for major violations',
    },
];

// Virtues of Sadaqah
const VIRTUES = [
    { text: 'Charity does not decrease wealth.', source: 'Muslim' },
    { text: 'The believer&apos;s shade on the Day of Resurrection will be his charity.', source: 'Ahmad' },
    { text: 'Protect yourself from Hell-fire even with half a date.', source: 'Bukhari' },
    { text: 'Sadaqah extinguishes sin as water extinguishes fire.', source: 'Tirmidhi' },
    { text: 'The upper hand (giver) is better than the lower hand (receiver).', source: 'Bukhari & Muslim' },
    { text: 'Allah said: Spend, O son of Adam, and I shall spend on you.', source: 'Bukhari & Muslim' },
];

// Ways to give Sadaqah
const WAYS_TO_GIVE = [
    { title: 'Money', description: 'Cash donations to those in need', icon: '💵' },
    { title: 'Food', description: 'Feeding the hungry, giving groceries', icon: '🍞' },
    { title: 'Water', description: 'Providing clean water, building wells', icon: '💧' },
    { title: 'Clothing', description: 'Giving clothes to those in need', icon: '👕' },
    { title: 'Smile', description: 'A smile is charity (Hadith)', icon: '😊' },
    { title: 'Kind words', description: 'Good speech and advice', icon: '💬' },
    { title: 'Helping others', description: 'Physical help and service', icon: '🤝' },
    { title: 'Teaching', description: 'Sharing beneficial knowledge', icon: '📚' },
    { title: 'Removing harm', description: 'Removing obstacles from path', icon: '🧹' },
    { title: 'Blood donation', description: 'Saving lives through blood', icon: '🩸' },
    { title: 'Planting trees', description: 'Environmental charity', icon: '🌳' },
    { title: 'Building', description: 'Mosques, schools, hospitals', icon: '🏗️' },
];

// Who can receive Sadaqah
const RECIPIENTS = [
    { title: 'The Poor (Fuqara)', description: 'Those who lack basic necessities' },
    { title: 'The Needy (Masakin)', description: 'Those with insufficient income' },
    { title: 'Orphans', description: 'Children without parents' },
    { title: 'Widows', description: 'Women who lost their husbands' },
    { title: 'Students of Knowledge', description: 'Those seeking Islamic education' },
    { title: 'Travelers in need', description: 'Stranded wayfarers' },
    { title: 'Those in debt', description: 'People burdened by debt' },
    { title: 'Family members', description: 'Relatives in need (double reward)' },
];

// Sadaqah Jariyah Ideas
const JARIYAH_IDEAS = [
    { title: 'Build a well', description: 'Provides water to communities for years' },
    { title: 'Build a mosque', description: 'Every prayer there earns you reward' },
    { title: 'Sponsor an orphan', description: 'Continuous care and education' },
    { title: 'Educational sponsorship', description: 'Help students gain knowledge' },
    { title: 'Plant trees', description: 'Every fruit eaten is charity for you' },
    { title: 'Donate Islamic books', description: 'Knowledge that benefits others' },
    { title: 'Teach Quran', description: 'The teacher and student both benefit' },
    { title: 'Build a school', description: 'Education for generations' },
    { title: 'Medical equipment', description: 'Saves lives continuously' },
    { title: 'Share beneficial content', description: 'Online da&apos;wah and Islamic resources' },
];

// Etiquettes of giving
const ETIQUETTES = [
    { title: 'Give sincerely', description: 'Only for Allah&apos;s sake, not for show' },
    { title: 'Give secretly', description: 'Hiding charity is more virtuous (unless to encourage others)' },
    { title: 'Give from the best', description: 'Don&apos;t give what you wouldn&apos;t accept yourself' },
    { title: 'Don&apos;t remind', description: 'Never remind the recipient or cause them embarrassment' },
    { title: 'Give regularly', description: 'Small consistent charity is beloved to Allah' },
    { title: 'Give with kindness', description: 'Kind words with charity, not rudeness' },
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

AccordionSection.propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    children: PropTypes.node.isRequired,
    defaultOpen: PropTypes.bool
};

const Sadaqah = () => {
    return (
        <div className="container">
            <PageHeader
                title="Sadaqah (Charity)"
                subtitle="The virtue and types of Islamic charity"
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Sadaqah', path: '/sadaqah' }
                ]}
            />

            <div className="sadaqah-container">
                {/* Hero Quote */}
                <div className="sadaqah-hero">
                    <Heart size={28} />
                    <blockquote>
                        &quot;Charity does not decrease wealth, no one forgives another except that Allah increases his honor, and no one humbles himself for the sake of Allah except that Allah raises his status.&quot;
                    </blockquote>
                    <cite>— Prophet Muhammad ﷺ (Muslim)</cite>
                </div>

                {/* Types of Sadaqah */}
                <AccordionSection title="Types of Charity in Islam" icon={Coins} defaultOpen={true}>
                    <div className="types-grid">
                        {SADAQAH_TYPES.map((type, index) => (
                            <div key={index} className="type-card">
                                <div className="type-header">
                                    <h4>{type.name}</h4>
                                    <span className="type-arabic">{type.arabic}</span>
                                </div>
                                <p className="type-description">{type.description}</p>
                                <p className="type-details">{type.details}</p>
                                <div className="type-reward">✨ {type.reward}</div>
                            </div>
                        ))}
                    </div>
                </AccordionSection>

                {/* Ways to Give */}
                <AccordionSection title="Many Ways to Give Sadaqah" icon={Gift}>
                    <p className="section-intro">Prophet ﷺ said: &quot;Every act of goodness is charity.&quot; (Muslim)</p>
                    <div className="ways-grid">
                        {WAYS_TO_GIVE.map((way, index) => (
                            <div key={index} className="way-card">
                                <span className="way-icon">{way.icon}</span>
                                <div className="way-content">
                                    <div className="way-title">{way.title}</div>
                                    <div className="way-description">{way.description}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </AccordionSection>

                {/* Sadaqah Jariyah */}
                <AccordionSection title="Sadaqah Jariyah (Continuous Charity)" icon={Sparkles}>
                    <p className="section-intro">
                        &quot;When a person dies, their deeds come to an end except for three: ongoing charity,
                        beneficial knowledge, or a righteous child who prays for them.&quot; — Prophet ﷺ (Muslim)
                    </p>
                    <div className="jariyah-grid">
                        {JARIYAH_IDEAS.map((idea, index) => (
                            <div key={index} className="jariyah-card">
                                <div className="jariyah-title">{idea.title}</div>
                                <div className="jariyah-description">{idea.description}</div>
                            </div>
                        ))}
                    </div>
                </AccordionSection>

                {/* Recipients */}
                <AccordionSection title="Who Can Receive Sadaqah" icon={Users}>
                    <div className="recipients-grid">
                        {RECIPIENTS.map((recipient, index) => (
                            <div key={index} className="recipient-card">
                                <div className="recipient-title">{recipient.title}</div>
                                <div className="recipient-description">{recipient.description}</div>
                            </div>
                        ))}
                    </div>
                </AccordionSection>

                {/* Etiquettes */}
                <AccordionSection title="Etiquettes of Giving" icon={HandHeart}>
                    <div className="etiquettes-list">
                        {ETIQUETTES.map((item, index) => (
                            <div key={index} className="etiquette-item">
                                <div className="etiquette-number">{index + 1}</div>
                                <div className="etiquette-content">
                                    <div className="etiquette-title">{item.title}</div>
                                    <div className="etiquette-description">{item.description}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </AccordionSection>

                {/* Virtues */}
                <AccordionSection title="Virtues of Charity" icon={BookOpen}>
                    <div className="virtues-list">
                        {VIRTUES.map((item, index) => (
                            <div key={index} className="virtue-item">
                                <p className="virtue-text">&quot;{item.text}&quot;</p>
                                <span className="virtue-source">— {item.source}</span>
                            </div>
                        ))}
                    </div>
                </AccordionSection>

                {/* Note */}
                <div className="disclaimer-box">
                    <AlertTriangle size={18} />
                    <p>For Zakat calculations, please use our dedicated Zakat Calculator which handles nisab and various asset types.</p>
                </div>
            </div>
        </div>
    );
};

export default Sadaqah;
