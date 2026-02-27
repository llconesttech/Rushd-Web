'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { useSurahDetail } from '@/hooks/useQuran';
import { translations } from '@/data/quranData';
import { getArabicSurahName, getSurahName } from '@/data/surahNames';
import { getSurahInfo } from '@/data/quranData';
import { useSettings } from '@/context/SettingsContext';
import { parseTajweed } from '@/utils/tajweedParser';
import PageHeader from '@/components/PageHeader';
import ReadingProgress from '@/components/ReadingProgress';
import TajweedLegendDropdown from '@/components/TajweedLegendDropdown';

const parseWordByWord = (text) => {
    if (!text) return [];
    return text.split('$').filter(w => w.trim()).map(w => {
        const parts = w.split('|');
        return { arabic: parts[0], translation: parts[1] };
    });
};

const getManzil = (n) => {
    if (n >= 1 && n <= 4) return 1;
    if (n >= 5 && n <= 9) return 2;
    if (n >= 10 && n <= 16) return 3;
    if (n >= 17 && n <= 25) return 4;
    if (n >= 26 && n <= 36) return 5;
    if (n >= 37 && n <= 49) return 6;
    if (n >= 50 && n <= 114) return 7;
    return 0;
};

export default function QuranReader() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const pageFilter = searchParams.get('page');

    const {
        selectedScript, selectedTranslation, selectedTafsir,
        selectedTransliteration, setSelectedTransliteration,
        uiStyle, selectedArabicFont, showTajweedTooltips,
    } = useSettings();

    const surahNum = parseInt(params.number);

    const getArabicFontFamily = () => {
        if (selectedScript === 'quran-indopak' || selectedScript === 'quran-indopak-tajweed') return 'var(--font-arabic-indopak)';
        switch (selectedArabicFont) {
            case 'alqalam': return "'Al Qalam', serif";
            case 'mequran': return "'Me Quran', serif";
            case 'scheherazade': return "'Scheherazade', serif";
            case 'saleem': return "'Saleem', serif";
            case 'amiri': default: return "'Amiri Quran', serif";
        }
    };

    const { data: surah, loading, error } = useSurahDetail(
        params.number, selectedTransliteration, selectedScript, selectedTranslation, selectedTafsir
    );

    // Deep link to ayah via hash
    useEffect(() => {
        if (!loading && surah && window.location.hash) {
            const ayahId = window.location.hash.replace('#ayah-', '');
            if (ayahId) {
                setTimeout(() => {
                    const el = document.getElementById(`ayah-${ayahId}`);
                    if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        el.classList.add('highlight-ayah');
                        setTimeout(() => el.classList.remove('highlight-ayah'), 2000);
                    }
                }, 500);
            }
        }
    }, [loading, surah]);

    const translationMeta = translations[selectedTranslation];
    const subtitleLangCode = translationMeta?.language_code || 'en';
    const localizedSurahName = getSurahName(surahNum, subtitleLangCode);
    const arabicCalligraphicName = getArabicSurahName(surahNum);
    const surahInfo = getSurahInfo(surahNum);

    if (loading) return <div className="container" style={{ marginTop: '2rem' }}>Loading Surah...</div>;
    if (error) return <div className="container" style={{ marginTop: '2rem' }}>Error loading Surah. Try a different translation.</div>;
    if (!surah) return null;

    const isWordByWord = selectedScript === 'quran-kids' || selectedScript === 'quran-wordbyword' || selectedScript === 'quran-wordbyword-2';
    const isTajweed = selectedScript === 'quran-tajweed' || selectedScript === 'quran-indopak-tajweed';
    const isIndoPak = selectedScript === 'quran-indopak' || selectedScript === 'quran-indopak-tajweed';
    const isStyle2 = uiStyle === 'style2';

    const handleNextSurah = () => { if (surahNum < 114) router.push(`/quran/${surahNum + 1}`); };
    const handlePrevSurah = () => { if (surahNum > 1) router.push(`/quran/${surahNum - 1}`); };

    const surahBadge = (
        <span className={`revelation-badge ${surahInfo?.revelationType.toLowerCase()}`}>
            {surahInfo?.revelationType}
        </span>
    );

    const subtitle = (
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {surahInfo?.meaning}
            <span style={{ color: 'var(--color-border)' }}>&bull;</span>
            {surahInfo?.rukus} Rukus
            <span style={{ color: 'var(--color-border)' }}>&bull;</span>
            Manzil {getManzil(surahNum)}
        </span>
    );

    const renderAyah = (ayah, index) => {
        const arabicContent = isWordByWord ? (
            <div className="word-by-word-container" style={{ padding: 0 }}>
                {parseWordByWord(ayah.text).map((w, i) => (
                    <div key={i} className="word-block">
                        <span className="word-arabic" style={{ fontFamily: getArabicFontFamily() }}>{w.arabic}</span>
                        <span className="word-translation">{w.translation}</span>
                    </div>
                ))}
            </div>
        ) : isTajweed ? (
            <p className={`ayah-arabic arabic-text tajweed-text ${isIndoPak ? 'indopak' : `font-${selectedArabicFont}`}`}
                style={{ fontFamily: getArabicFontFamily() }}
                dangerouslySetInnerHTML={{ __html: parseTajweed(ayah.text, showTajweedTooltips) }} />
        ) : (
            <p className={`ayah-arabic arabic-text font-${selectedArabicFont} ${isIndoPak ? 'indopak' : ''}`}
                style={{ fontFamily: getArabicFontFamily() }}>
                {ayah.text}
            </p>
        );

        const tafsirBlock = ayah.tafsir && (
            <div className="tafsir-container" style={{
                marginTop: '1rem', padding: '1rem',
                backgroundColor: 'var(--color-surface)',
                borderLeft: '4px solid var(--color-secondary)',
                borderRadius: '0 8px 8px 0',
            }}>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase',
                    color: 'var(--color-secondary)', marginBottom: '0.5rem',
                }}>
                    <BookOpen size={14} /> Tafsir
                </div>
                <p className="ayah-tafsir" style={{ fontSize: '1rem', lineHeight: '1.6', color: 'var(--color-text-main)' }}>
                    {ayah.tafsir}
                </p>
            </div>
        );

        if (isStyle2) {
            return (
                <div key={ayah.number} className="ayah-card-style2" data-ayah-num={ayah.numberInSurah}>
                    <span className="ayah-badge">Ayah {ayah.numberInSurah}</span>
                    <button className="play-btn-circle" title="Play Ayah">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                    </button>
                    <div className="ayah-text-container">
                        {arabicContent}
                        {ayah.transliteration && <p className="ayah-transliteration">{ayah.transliteration}</p>}
                        {ayah.translation && <div className="translation-container"><p className="ayah-translation">{ayah.translation}</p></div>}
                        {tafsirBlock}
                    </div>
                </div>
            );
        }

        return (
            <div key={ayah.number} id={`ayah-${ayah.number}`} className="ayah-row" data-ayah-num={ayah.numberInSurah}
                style={{ backgroundColor: index % 2 === 0 ? 'var(--color-bg-card)' : 'var(--color-bg-main)' }}>
                <div className="ayah-number-badge"><span>{surah.number}:{ayah.numberInSurah}</span></div>
                {arabicContent}
                {ayah.transliteration && <p className="ayah-transliteration">{ayah.transliteration}</p>}
                {ayah.translation && <div className="translation-container"><p className="ayah-translation">{ayah.translation}</p></div>}
                {tafsirBlock}
            </div>
        );
    };

    const transliterationSelector = (
        <select value={selectedTransliteration} onChange={(e) => setSelectedTransliteration(e.target.value)}
            className="reading-select" title="Transliteration" style={{ marginLeft: 'auto' }}>
            <option value="none">No Translit.</option>
            {Object.entries(translations)
                .filter(([, val]) => val.type === 'transliteration')
                .sort((a, b) => a[1].english_name.localeCompare(b[1].english_name))
                .map(([key, val]) => <option key={key} value={key}>{val.english_name}</option>)}
        </select>
    );

    return (
        <div className="quran-reader-container" style={{ '--arabic-font': getArabicFontFamily() }}>
            <div className="quran-header-group" style={{ position: 'sticky', top: 0, zIndex: 40 }}>
                <PageHeader
                    title={`Surah ${surah.englishName}`}
                    badge={surahBadge}
                    subtitle={subtitle}
                    breadcrumbs={[
                        { label: 'Home', path: '/' },
                        { label: 'Quran', path: '/quran' },
                        { label: surah.englishName, path: `/quran/${surahNum}` },
                    ]}
                    actions={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', justifyContent: 'flex-end' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <ReadingProgress surah={surah} pageFilter={pageFilter} onClearFilter={() => router.push(`/quran/${surahNum}`)} />
                                {transliterationSelector}
                            </div>
                        </div>
                    }
                />
                {isTajweed && (
                    <div className="tajweed-legend-abs-container">
                        <TajweedLegendDropdown />
                    </div>
                )}
            </div>

            <div className="container" style={{ textAlign: 'right', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                <Link href={`/quran/mushaf/${surah.ayahs[0]?.page || 1}`} className="quran-switch-btn" style={{ display: 'inline-flex', width: 'fit-content' }}>
                    <BookOpen size={16} /> Mushaf View
                </Link>
            </div>

            <div className="quran-reader-inner">
                <div className="surah-calligraphic-header">
                    <img
                        src={`/api/v1/assets/fonts/Tuluth/Vector-${surah.number - 1}.svg`}
                        alt={surah.arabicName}
                        className="surah-vector-name-header"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            if (e.target.nextSibling) e.target.nextSibling.style.display = 'block';
                        }}
                    />
                    <h1 style={{ display: 'none' }}>{'\uFD3F'} {'سورة'} {arabicCalligraphicName} {'\uFD3E'}</h1>
                    <div className="surah-subtitle">
                        <span>{subtitleLangCode !== 'ar' ? localizedSurahName : surah.englishName}</span>
                    </div>
                </div>
            </div>

            <div className={`ayah-content-wrap ${isStyle2 ? 'transparent' : ''}`}>
                {(pageFilter ? surah.ayahs.filter(a => a.page === parseInt(pageFilter)) : surah.ayahs).map((ayah, index) => {
                    const prevRuku = index > 0 ? surah.ayahs[index - 1].ruku : ayah.ruku;
                    const showRukuDivider = index > 0 && ayah.ruku !== prevRuku;
                    return (
                        <React.Fragment key={ayah.numberInSurah || ayah.number}>
                            {showRukuDivider && (
                                <div className="ruku-divider"><span>Ruku {ayah.ruku}</span></div>
                            )}
                            {renderAyah(ayah, index)}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}
