'use client';

import { useState, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { BookOpen, Settings, Home } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { getSurahInfo } from '@/data/quranData';
import TopBar from '@/components/TopBar';
import SurahListSidebar from '@/components/SurahListSidebar';
import SettingsSidebar from '@/components/SettingsSidebar';
import AudioPlayer from '@/components/AudioPlayer';

export default function AppShell({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const { isSurahListOpen, isSettingsOpen, toggleSurahList, toggleSettings } = useSettings();

    const [isNavVisible, setIsNavVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // Route detection
    const readerMatch = pathname.match(/^\/quran\/(\d+)$/);
    const surahNumber = readerMatch ? parseInt(readerMatch[1]) : null;
    const isReaderPage = !!readerMatch;
    const isGridView = pathname === '/' || pathname === '/quran';
    const isZakatPage = pathname === '/zakat';
    const showSidebars = isReaderPage;
    const anySidebarOpen = isSurahListOpen || isSettingsOpen;

    const surahMeta = surahNumber ? getSurahInfo(surahNumber) : null;
    const totalAyahs = surahMeta?.ayahs || 0;

    const handleSurahSelect = useCallback((num) => {
        router.push(`/quran/${num}`);
    }, [router]);

    const handleMainScroll = useCallback((e) => {
        const currentScrollY = e.target.scrollTop;
        if (currentScrollY > lastScrollY && currentScrollY > 50) {
            setIsNavVisible(false);
        } else {
            setIsNavVisible(true);
        }
        setLastScrollY(currentScrollY);
    }, [lastScrollY]);

    const handleBackdropClick = useCallback(() => {
        if (isSurahListOpen) toggleSurahList();
        if (isSettingsOpen) toggleSettings();
    }, [isSurahListOpen, isSettingsOpen, toggleSurahList, toggleSettings]);

    const bgClass = (isGridView || isZakatPage) ? 'app-layout bg-dots' : 'app-layout';

    return (
        <div className={bgClass} style={{
            display: 'flex', flexDirection: 'column',
            height: '100dvh', width: '100vw', overflow: 'hidden',
            backgroundColor: (isGridView || isZakatPage) ? 'var(--color-bg-main)' : undefined,
        }}>
            <TopBar />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'row', overflow: 'hidden', minWidth: 0, position: 'relative', width: '100%' }}>
                {showSidebars && (
                    <SurahListSidebar
                        onSurahSelect={handleSurahSelect}
                        currentSurah={surahNumber}
                        persistent={true}
                    />
                )}

                {showSidebars && (
                    <div
                        className={`sidebar-backdrop ${anySidebarOpen ? 'visible' : ''}`}
                        onClick={handleBackdropClick}
                    />
                )}

                <div className="main-content-wrapper">
                    <main className="reader-main-content" onScroll={handleMainScroll}>
                        <div style={{
                            width: '100%',
                            maxWidth: isReaderPage ? '1000px' : '1200px',
                            padding: isReaderPage ? '0.5rem' : '2rem',
                            margin: '0 auto',
                        }}>
                            {children}
                        </div>
                    </main>

                    {isReaderPage && surahNumber > 0 && (
                        <div className="audio-player-dock">
                            <AudioPlayer surahNumber={surahNumber} totalAyahs={totalAyahs} />
                        </div>
                    )}
                </div>

                {showSidebars && (
                    <SettingsSidebar persistent={true} />
                )}
            </div>

            <div
                className="mobile-bottom-bar"
                style={{
                    transform: isNavVisible ? 'translateY(0)' : 'translateY(150%)',
                    transition: 'transform 0.3s ease-in-out',
                }}
            >
                <button className={`bar-btn ${isSurahListOpen ? 'active' : ''}`} onClick={toggleSurahList}>
                    <BookOpen size={22} />
                    <span>Surahs</span>
                </button>
                <button className="bar-btn" onClick={() => router.push('/')}>
                    <Home size={22} />
                    <span>Home</span>
                </button>
                <button className={`bar-btn ${isSettingsOpen ? 'active' : ''}`} onClick={toggleSettings}>
                    <Settings size={22} />
                    <span>Settings</span>
                </button>
            </div>
        </div>
    );
}
