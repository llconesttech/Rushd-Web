'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Sun, Moon as MoonIcon } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import './TopBar.css';

const TopBar = () => {
    const router = useRouter();
    const { theme, toggleTheme } = useSettings();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push('/quran?search=' + encodeURIComponent(searchQuery));
        }
    };

    return (
        <div className="topbar">
            <div className="topbar-inner">
                {/* Brand Logo */}
                <div className="topbar-brand" onClick={() => router.push('/')}>
                    <img src={theme === 'dark' ? '/light_gold.png' : '/logo.png'} alt="Rushd Logo" className="topbar-logo" />
                    <span className="topbar-title">Rushd</span>
                </div>

                {/* Primary Navigation */}
                <nav className="topbar-nav">
                    <Link href="/quran" className="topbar-nav-link">Quran</Link>
                    <Link href="/hadith" className="topbar-nav-link">Hadith</Link>
                    <Link href="/qa-search" className="topbar-nav-link">Ask AI</Link>
                    <Link href="/duas" className="topbar-nav-link">Duas</Link>
                </nav>

                {/* Search & Theme Actions */}
                <div className="topbar-actions">
                    <form className="topbar-search-form" onSubmit={handleSearch}>
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder="Search Quran, Hadith..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>
                    <button className="topbar-icon-btn" onClick={toggleTheme} title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}>
                        {theme === 'dark' ? <Sun size={20} /> : <MoonIcon size={20} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
