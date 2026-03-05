'use client';
import { useState } from 'react';
import { Mail, Globe, ChevronDown, Shield, ExternalLink } from 'lucide-react';
import './SupportPage.css';

const faqs = [
    {
        q: 'How do I change the prayer time calculation method?',
        a: 'On the homepage, you\'ll find a dropdown selector next to the prayer times card. Choose your preferred calculation method (e.g., Muslim World League, ISNA, etc.) and madhab.',
    },
    {
        q: 'Why are prayer times different from my local mosque?',
        a: 'Prayer times can vary based on calculation method, madhab, and geographic location. Try switching the calculation method in settings to match the one your local mosque uses.',
    },
    {
        q: 'How do I download Quran recitations for offline use?',
        a: 'Navigate to the Quran reader and select an audio reciter. Recitations are streamed by default. Offline download is available in the mobile app.',
    },
    {
        q: 'Is my data shared with third parties?',
        a: 'No. Rushd does not sell or share your personal data. Analytics data is anonymous and used only to improve the app. See our Privacy Policy for full details.',
    },
    {
        q: 'How do I report a bug or suggest a feature?',
        a: 'Email us at support@onesttech.com with a description of the issue or your suggestion. Screenshots are very helpful for bug reports!',
    },
];

const SupportPage = () => {
    const [openFaq, setOpenFaq] = useState(null);

    return (
        <div className="support-page">
            <div className="support-header">
                <h1>Support</h1>
                <p>We're here to help. Reach out to us or check the frequently asked questions below.</p>
            </div>

            <div className="support-cards">
                <div className="support-card">
                    <div className="support-card-icon">
                        <Mail size={22} />
                    </div>
                    <h3>Email Support</h3>
                    <p>Have a question, bug report, or feature request? Send us an email and we'll get back to you within 24-48 hours.</p>
                    <a href="mailto:support@onesttech.com">
                        support@onesttech.com <ExternalLink size={14} />
                    </a>
                </div>

                <div className="support-card">
                    <div className="support-card-icon">
                        <Globe size={22} />
                    </div>
                    <h3>Website</h3>
                    <p>Visit our official website for more information about Rushd and Onest Tech.</p>
                    <a href="https://rushd.onesttech.com" target="_blank" rel="noopener noreferrer">
                        rushd.onesttech.com <ExternalLink size={14} />
                    </a>
                </div>

                <div className="support-card">
                    <div className="support-card-icon">
                        <Shield size={22} />
                    </div>
                    <h3>Privacy Policy</h3>
                    <p>Learn about how we handle your data and protect your privacy across all platforms.</p>
                    <a href="/privacy-policy">
                        View Privacy Policy <ExternalLink size={14} />
                    </a>
                </div>
            </div>

            <div className="support-faq">
                <h2>Frequently Asked Questions</h2>
                {faqs.map((faq, i) => (
                    <div className="faq-item" key={i}>
                        <button
                            className={`faq-question ${openFaq === i ? 'open' : ''}`}
                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        >
                            {faq.q}
                            <ChevronDown size={18} />
                        </button>
                        {openFaq === i && <div className="faq-answer">{faq.a}</div>}
                    </div>
                ))}
            </div>

            <div className="support-app-section">
                <h3>Get Rushd on Mobile</h3>
                <p>Download the full Rushd experience with prayer reminders, offline Quran, Pilgrim Finder, and more.</p>
                <div className="support-store-links">
                    <a href="https://apps.apple.com/us/app/rushd-quran-tafsir-guidance/id6758621105" target="_blank" rel="noopener noreferrer">
                        <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Download on the App Store" />
                    </a>
                    <a href="https://play.google.com/store/apps/details?id=com.onesttech.rushd&hl=en" target="_blank" rel="noopener noreferrer">
                        <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SupportPage;
