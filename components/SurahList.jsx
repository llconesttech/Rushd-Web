'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useSurahList } from '@/hooks/useQuran';
import { surahData } from '@/data/quranData';
import PageHeader from '@/components/PageHeader';
import SearchInput from './SearchInput';
import './SurahList.css';

function filterSurahs(surahs, rawQuery) {
    const q = rawQuery.trim();
    if (!q) return surahs;

    const qLower = q.toLowerCase();
    const asNum = /^\d+$/.test(q) ? parseInt(q, 10) : null;
    const numExact = asNum !== null && asNum >= 1 && asNum <= 114;

    return surahs.filter((s) => {
        if (numExact && s.number === asNum) return true;

        const english =
            (s.englishName || s.name || '').toLowerCase();
        const meaning = (
            s.englishNameTranslation ||
            s.meaning ||
            ''
        ).toLowerCase();
        if (english.includes(qLower) || meaning.includes(qLower))
            return true;

        if (s.arabicName && s.arabicName.includes(q)) return true;

        if (asNum !== null && String(s.number).includes(q)) return true;

        return false;
    });
}

export default function SurahList() {
    const { data: surahs, loading, error } = useSurahList();
    const [searchQuery, setSearchQuery] = useState('');

    const enhancedSurahs = useMemo(
        () =>
            surahs.map((surah) => {
                const metadata = surahData.find((s) => s.number === surah.number);
                return { ...surah, ...metadata };
            }),
        [surahs],
    );

    const visibleSurahs = useMemo(
        () => filterSurahs(enhancedSurahs, searchQuery),
        [enhancedSurahs, searchQuery],
    );

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error loading Surahs</div>;

    return (
        <div className="">
            <PageHeader
                title="Surah Index"
                subtitle="Select a Surah to read • 114 Surahs • 30 Juz"
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Quran', path: '/quran' },
                ]}
            />

            <SearchInput
                onSubmit={(e) => e.preventDefault()}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, meaning, number, or Arabic…"
                className="topbar-search-form mobile-menu-search"
            />

            {visibleSurahs.length === 0 ? (
                <p
                    style={{
                        marginTop: '1.25rem',
                        color: 'var(--color-text-muted)',
                        textAlign: 'center',
                    }}
                >
                    No surahs match “{searchQuery.trim()}”. Try another spelling or
                    number.
                </p>
            ) : (
            <div className="surah-list-container">
                {visibleSurahs.map(surah => (
                    <Link href={`/quran/${surah.number}`} key={surah.number} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="surah-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <span style={{
                                    backgroundColor: 'var(--color-primary-light)',
                                    color: 'var(--color-text-main)',
                                    width: '36px', height: '36px', borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 'bold', fontSize: '0.9rem',
                                }}>{surah.number}</span>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <span
                                        className={`revelation-chip ${
                                            surah.revelationType === 'Meccan'
                                                ? 'revelation-chip--meccan'
                                                : 'revelation-chip--medinan'
                                        }`}
                                        aria-label={surah.revelationType}
                                        title={surah.revelationType}
                                    >
                                        <img
                                            className="revelation-chip__img"
                                            src={
                                                surah.revelationType === 'Meccan'
                                                    ? '/Macca.png'
                                                    : '/Madina.png'
                                            }
                                            alt={surah.revelationType}
                                        />
                                    </span>
                                    {surah.juz && (
                                        <span style={{
                                            fontSize: '0.7rem', padding: '0.2rem 0.5rem',
                                            backgroundColor: 'var(--color-pill-juz-bg)',
                                            color: 'var(--color-pill-juz-text)',
                                            borderRadius: '0.5rem',
                                        }}>Juz {surah.juz[0]}</span>
                                    )}
                                </div>
                            </div>
                            <h3 style={{ margin: '0.5rem 0', fontSize: '1.125rem' }}>{surah.englishName || surah.name}</h3>
                            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{surah.englishNameTranslation || surah.meaning}</p>
                            <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                                    {surah.numberOfAyahs || surah.ayahs} Ayahs {surah.rukus > 1 && <>&bull; {surah.rukus} Rukus</>}
                                </span>
                                <div className="surah-name-calligraphy">
                                    <img
                                        src={`/api/v1/assets/fonts/Tuluth/Vector-${surah.number - 1}.svg`}
                                        alt={surah.arabicName}
                                        className="surah-vector-name"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            if (e.target.nextSibling) e.target.nextSibling.style.display = 'block';
                                        }}
                                    />
                                    <span style={{ display: 'none' }}>
                                        {surah.arabicName || (surah.name && surah.name.replace('سورة ', ''))}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            )}
        </div>
    );
}
