"use client";

import { useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, Settings, Home, Menu } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { getSurahInfo } from "@/data/quranData";
import TopBar from "@/components/TopBar";
import SurahListSidebar from "@/components/SurahListSidebar";
import SettingsSidebar from "@/components/SettingsSidebar";
import AudioPlayer from "@/components/AudioPlayer";
import Footer from "./Footer";

export default function AppShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isSurahListOpen, isSettingsOpen, toggleSurahList, toggleSettings } =
    useSettings();

  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Route detection
  const readerMatch = pathname.match(/^\/quran\/(\d+)$/);
  const surahNumber = readerMatch ? parseInt(readerMatch[1]) : null;
  const isReaderPage = !!readerMatch;
  const isGridView = pathname === "/" || pathname === "/quran";
  const isZakatPage = pathname === "/zakat";
  const showSidebars = isReaderPage;
  const anySidebarOpen = isSurahListOpen || isSettingsOpen;

  const surahMeta = surahNumber ? getSurahInfo(surahNumber) : null;
  const totalAyahs = surahMeta?.ayahs || 0;

  const handleSurahSelect = useCallback(
    (num) => {
      router.push(`/quran/${num}`);
    },
    [router],
  );

  const handleMainScroll = useCallback(
    (e) => {
      const currentScrollY = e.target.scrollTop;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsNavVisible(false);
      } else {
        setIsNavVisible(true);
      }
      setLastScrollY(currentScrollY);
    },
    [lastScrollY],
  );

  const handleBackdropClick = useCallback(() => {
    if (isSurahListOpen) toggleSurahList();
    if (isSettingsOpen) toggleSettings();
  }, [isSurahListOpen, isSettingsOpen, toggleSurahList, toggleSettings]);

  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  const bgClass =
    isGridView || isZakatPage ? "app-layout bg-dots" : "app-layout";

  return (
    <div
      className={bgClass}
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        width: "100%",
        overflow: "hidden",
        backgroundColor:
          isGridView || isZakatPage ? "var(--color-bg-main)" : undefined,
      }}
    >
      <TopBar />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "row",
          overflow: "hidden",
          minWidth: 0,
          position: "relative",
          width: "100%",
        }}
      >
        {showSidebars && (
          <SurahListSidebar
            onSurahSelect={handleSurahSelect}
            currentSurah={surahNumber}
            persistent={true}
          />
        )}

        {showSidebars && (
          <div
            className={`sidebar-backdrop ${anySidebarOpen ? "visible" : ""}`}
            onClick={handleBackdropClick}
          />
        )}

        <div className="main-content-wrapper">
          <main
            className={`reader-main-content ${isGridView ? "hide-scrollbar" : ""}`}
            onScroll={handleMainScroll}
          >
            <div className="container">{children}</div>
            <Footer />
          </main>

          {isReaderPage && surahNumber > 0 && (
            <div className="audio-player-dock">
              <AudioPlayer surahNumber={surahNumber} totalAyahs={totalAyahs} />
            </div>
          )}
        </div>

        {showSidebars && <SettingsSidebar persistent={true} />}
      </div>

      <div
        className="mobile-bottom-bar"
        style={{
          transform: isNavVisible ? "translateY(0)" : "translateY(150%)",
          transition: "transform 0.3s ease-in-out",
        }}
      >
        <div className="container mobile-bottom-container">
          <button
            className={`bar-btn ${isMobileMenuOpen ? "active" : ""}`}
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav-menu"
          >
            <Menu size={22} />
            <span>Menu</span>
          </button>
          <button className="bar-btn" onClick={() => router.push("/")}>
            <Home size={22} />
            <span>Home</span>
          </button>
          <button
            className={`bar-btn ${isSurahListOpen ? "active" : ""}`}
            onClick={toggleSurahList}
          >
            <BookOpen size={22} />
            <span>Surahs</span>
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <>
          <div className="mobile-menu-backdrop" onClick={closeMobileMenu} />
          <div id="mobile-nav-menu" className="mobile-menu-sheet" role="menu">
            <button
              className="mobile-menu-item"
              role="menuitem"
              onClick={() => {
                closeMobileMenu();
                router.push("/quran");
              }}
            >
              Quran
            </button>
            <button
              className="mobile-menu-item"
              role="menuitem"
              onClick={() => {
                closeMobileMenu();
                router.push("/hadith");
              }}
            >
              Hadith
            </button>
            <button
              className="mobile-menu-item"
              role="menuitem"
              onClick={() => {
                closeMobileMenu();
                router.push("/qa-search");
              }}
            >
              Ask AI
            </button>
            <button
              className="mobile-menu-item"
              role="menuitem"
              onClick={() => {
                closeMobileMenu();
                router.push("/duas");
              }}
            >
              Duas
            </button>
          </div>
        </>
      )}
    </div>
  );
}
