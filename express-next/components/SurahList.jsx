'use client';

import Link from 'next/link';
import { useSurahList } from '@/hooks/useQuran';
import { surahData } from '@/data/quranData';
import PageHeader from '@/components/PageHeader';

export default function SurahList() {
    const { data: surahs, loading, error } = useSurahList();

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error loading Surahs</div>;

    const enhancedSurahs = surahs.map(surah => {
        const metadata = surahData.find(s => s.number === surah.number);
        return { ...surah, ...metadata };
    });

    return (
        <div className="container">
            <PageHeader
                title="Surah Index"
                subtitle="Select a Surah to read • 114 Surahs • 30 Juz"
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Quran', path: '/quran' },
                ]}
            />

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '1rem',
                marginTop: '1rem',
                direction: 'rtl',
            }}>
                {enhancedSurahs.map(surah => (
                    <Link href={`/quran/${surah.number}`} key={surah.number} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div style={{
                            backgroundColor: 'var(--color-bg-card)',
                            padding: '1.5rem',
                            borderRadius: '0.75rem',
                            boxShadow: 'var(--shadow-sm)',
                            border: '1px solid var(--color-border)',
                            transition: 'all 0.2s',
                            cursor: 'pointer',
                            direction: 'rtl',
                        }} className="surah-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <span style={{
                                    backgroundColor: 'var(--color-primary-light)',
                                    color: 'var(--color-text-main)',
                                    width: '36px', height: '36px', borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 'bold', fontSize: '0.9rem',
                                }}>{surah.number}</span>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <span style={{
                                        fontSize: '0.7rem', padding: '0.2rem 0.5rem',
                                        backgroundColor: surah.revelationType === 'Meccan' ? 'var(--color-pill-meccan-bg)' : 'var(--color-pill-medinan-bg)',
                                        color: surah.revelationType === 'Meccan' ? 'var(--color-pill-meccan-text)' : 'var(--color-pill-medinan-text)',
                                        borderRadius: '0.5rem',
                                    }}>{surah.revelationType}</span>
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
        </div>
    );
}
