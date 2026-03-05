'use client';
import { Star } from 'lucide-react';
import './AppPromo.css';

const APP_STORE_URL = 'https://apps.apple.com/us/app/rushd-quran-tafsir-guidance/id6758621105';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.onesttech.rushd&hl=en';

const AppPromo = () => (
    <section className="app-promo">
        <div className="app-promo-inner">
            <div className="app-promo-icon">
                <img src="/favicon.png" alt="Rushd App Icon" />
            </div>
            <div className="app-promo-content">
                <h3>Rushd – Quran, Tafsir &amp; Guidance</h3>
                <p>Get the full experience — prayer reminders, offline Quran, Pilgrim Finder, daily tracker, and more.</p>
                <div className="app-promo-rating">
                    <div className="app-promo-stars">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={14} fill="currentColor" strokeWidth={0} />
                        ))}
                    </div>
                    <span>5.0 • Free</span>
                </div>
                <div className="app-promo-badges">
                    <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
                        <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Download on the App Store" />
                    </a>
                    <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer">
                        <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" />
                    </a>
                </div>
            </div>
        </div>
    </section>
);

export default AppPromo;
