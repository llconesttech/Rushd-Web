'use client';
import Link from 'next/link';
import './Footer.css';
import Image from 'next/image';

const APP_STORE_URL = 'https://apps.apple.com/us/app/rushd-quran-tafsir-guidance/id6758621105';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.onesttech.rushd&hl=en';

const Footer = () => (
    <footer className="site-footer">
        <div className="footer-inner">
            {/* Brand */}
            <div className="footer-brand">
                <div className="footer-brand-row">
                    <img src="/light_gold.png" alt="Rushd" />
                    <span>Rushd</span>
                </div>
                <p>Clear Guidance for Everyday Life. Your comprehensive Islamic companion for Quran, Hadith, prayer times, and more.</p>
                <div className="footer-store-badges">
                    <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
                        <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" />
                    </a>
                    <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer">
                        <Image src="/google-play.png" alt="Google Play" width={100} height={100} />
                    </a>
                </div>
            </div>

            {/* Explore */}
            <div className="footer-column">
                <h4>Explore</h4>
                <ul>
                    <li><Link href="/quran">Quran</Link></li>
                    <li><Link href="/hadith">Hadith</Link></li>
                    <li><Link href="/qa-search">Ask AI</Link></li>
                    <li><Link href="/duas">Duas</Link></li>
                    <li><Link href="/names">99 Names of Allah</Link></li>
                </ul>
            </div>

            {/* Tools */}
            <div className="footer-column">
                <h4>Tools</h4>
                <ul>
                    <li><Link href="/tasbih">Tasbih Counter</Link></li>
                    <li><Link href="/zakat">Zakat Calculator</Link></li>
                    <li><Link href="/qibla">Qibla Finder</Link></li>
                    <li><Link href="/calendar">Islamic Calendar</Link></li>
                    <li><Link href="/hajj">Hajj Guide</Link></li>
                </ul>
            </div>

            {/* Legal */}
            <div className="footer-column">
                <h4>Legal &amp; Support</h4>
                <ul>
                    <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                    <li><Link href="/support">Support</Link></li>
                    <li><a href="mailto:support@onesttech.com">Contact Us</a></li>
                    <li><a href="https://onesttech.com" target="_blank" rel="noopener noreferrer">Onest Tech</a></li>
                </ul>
            </div>
        </div>

        <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Rushd — Quran, Tafsir &amp; Guidance. All rights reserved.</p>
            <a href="https://onesttech.com" target="_blank" rel="noopener noreferrer">Developed by Onest Tech</a>
        </div>
    </footer>
);

export default Footer;
