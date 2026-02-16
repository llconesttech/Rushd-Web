import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPrayerTimes, getAvailableMethods, getAvailableMadhabs, getAutoCalculationMethod } from '../services/prayerTimesService';
import { getTodayAllCalendars } from '../services/dateService';
import { useAppLocation } from '../context/LocationContext';
import RamadanWidget from './RamadanWidget';
import './HomePage.css';

// Feature data
const quickActions = [
    { id: 'quran', title: 'Read Quran', icon: '📖', link: '/quran' },
    { id: 'tasbih', title: 'Tasbih Counter', icon: '📿', link: '/tasbih' },
    { id: 'zakat', title: 'Zakat Calculator', icon: '💰', link: '/zakat' },
    { id: 'salah', title: 'Salah Rules', icon: '🕌', link: '/salah-rules' },
    { id: 'duas', title: 'Daily Duas', icon: '🤲', link: '/duas' },
    { id: 'qibla', title: 'Qibla Finder', icon: '🧭', link: '/qibla' },
];

const featureSections = [
    {
        id: 'quran-learning',
        title: 'Quran & Learning',
        icon: '📚',
        features: [
            { id: 'read', title: 'Read Quran', icon: '📖', link: '/quran' },
            { id: 'shan-e-nuzool', title: 'Shan-e-Nuzool', icon: '📜', link: '/shan-e-nuzool' },
            { id: 'tajweed', title: 'Tajweed', icon: '🎯', link: '/tajweed' },
            { id: 'memorize', title: 'Memorization', icon: '🧠', link: '/memorize' },
            { id: 'audio', title: 'Audio Recitation', icon: '🎧', link: '/audio' },
        ]
    },
    {
        id: 'islamic-tools',
        title: 'Islamic Tools',
        icon: '🛠️',
        features: [
            { id: 'qibla', title: 'Qibla Direction', icon: '🧭', link: '/qibla' },
            { id: 'tasbih', title: 'Tasbih Counter', icon: '📿', link: '/tasbih' },
            { id: 'zakat', title: 'Zakat Calculator', icon: '💰', link: '/zakat' },
            { id: 'calendar', title: 'Islamic Calendar', icon: '📅', link: '/calendar' },
            { id: 'names', title: '99 Names of Allah', icon: '✨', link: '/names' },
        ]
    },
    {
        id: 'pilgrimage',
        title: 'Pilgrimage',
        icon: '🕋',
        features: [
            { id: 'hajj', title: 'Hajj Guide', icon: '🕋', link: '/hajj' },
            { id: 'umrah', title: 'Umrah Guide', icon: '🌙', link: '/umrah' },
            { id: 'duas-hajj', title: 'Hajj Duas', icon: '🤲', link: '/hajj-duas' },
            { id: 'checklist', title: 'Packing List', icon: '✅', link: '/packing' },
        ]
    },
    {
        id: 'ramadan',
        title: 'Ramadhan Special',
        icon: '🌙',
        features: [
            { id: 'ramadan-cal', title: 'Ramadan Calendar', icon: '📅', link: '/ramadan' },
            { id: 'fasting', title: 'Fasting Rules', icon: '🍽️', link: '/fasting' },
            { id: 'taraweeh', title: 'Taraweeh', icon: '🌃', link: '/taraweeh' },
            { id: 'sadaqah', title: 'Sadaqah', icon: '💝', link: '/sadaqah' },
            { id: 'laylatul', title: 'Laylatul Qadr', icon: '⭐', link: '/laylatul-qadr' },
        ]
    }
];

const HomePage = () => {
    // Alias global state to local names to match existing JSX usage
    const { location, coords, loading: locationLoading } = useAppLocation();

    const [salahTimes, setSalahTimes] = useState(null);
    const [currentPrayer, setCurrentPrayer] = useState(null);
    const [currentForbidden, setCurrentForbidden] = useState(null);
    const [currentSunnah, setCurrentSunnah] = useState(null);
    const [loading, setLoading] = useState(true);
    const [todayDates, setTodayDates] = useState(null);

    // Load method from localStorage or default
    const [method, setMethod] = useState(() => {
        return localStorage.getItem('prayerMethod') || null;
    });

    const [madhab, setMadhab] = useState(() => {
        return localStorage.getItem('prayerMadhab') || 'Hanafi';
    });

    // Check for current prayer and forbidden status
    const updateCurrentStatus = () => {
        if (!salahTimes) return;

        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        const parseTimeToMinutes = (timeStr) => {
            if (!timeStr) return 0;
            const [hours, minutes] = timeStr.split(':').map(Number);
            return hours * 60 + minutes;
        };

        const fajrStart = parseTimeToMinutes(salahTimes.Fajr);
        const dhuhrStart = parseTimeToMinutes(salahTimes.Dhuhr);
        const asrStart = parseTimeToMinutes(salahTimes.Asr);
        const maghribStart = parseTimeToMinutes(salahTimes.Maghrib);
        const ishaStart = parseTimeToMinutes(salahTimes.Isha);

        // Get forbidden times for prayer end limits
        const sunriseStart = salahTimes.forbidden?.sunrise ?
            parseTimeToMinutes(salahTimes.forbidden.sunrise.start) : dhuhrStart;
        const sunriseEnd = salahTimes.forbidden?.sunrise ?
            parseTimeToMinutes(salahTimes.forbidden.sunrise.end) : sunriseStart + 15;
        const zawalStart = salahTimes.forbidden?.zawal ?
            parseTimeToMinutes(salahTimes.forbidden.zawal.start) : dhuhrStart - 10;
        const sunsetStart = salahTimes.forbidden?.sunset ?
            parseTimeToMinutes(salahTimes.forbidden.sunset.start) : maghribStart - 15;

        let activePrayer = null;

        // Determine current valid prayer based on time windows
        if (currentMinutes >= ishaStart || currentMinutes < fajrStart) {
            // Isha: from Isha until Fajr
            activePrayer = 'Isha';
        } else if (currentMinutes >= fajrStart && currentMinutes < sunriseStart) {
            // Fajr: from Fajr until Sunrise
            activePrayer = 'Fajr';
        } else if (currentMinutes >= sunriseStart && currentMinutes < sunriseEnd) {
            // Sunrise forbidden period - no prayer
            activePrayer = null;
        } else if (currentMinutes >= sunriseEnd && currentMinutes < zawalStart) {
            // Ishraq/Duha time - no obligatory prayer but Duha is recommended
            activePrayer = null;
        } else if (currentMinutes >= zawalStart && currentMinutes < dhuhrStart) {
            // Zawal forbidden period - no prayer
            activePrayer = null;
        } else if (currentMinutes >= dhuhrStart && currentMinutes < asrStart) {
            // Dhuhr: from Dhuhr until Asr
            activePrayer = 'Dhuhr';
        } else if (currentMinutes >= asrStart && currentMinutes < sunsetStart) {
            // Asr: from Asr until Sunset forbidden time starts
            activePrayer = 'Asr';
        } else if (currentMinutes >= sunsetStart && currentMinutes < maghribStart) {
            // Sunset forbidden period - Asr technically ended
            activePrayer = null;
        } else if (currentMinutes >= maghribStart && currentMinutes < ishaStart) {
            // Maghrib: from Maghrib until Isha
            activePrayer = 'Maghrib';
        }

        setCurrentPrayer(activePrayer);

        // 2. Check Forbidden Times
        if (salahTimes.forbidden) {
            let foundForbidden = null;
            for (const [name, period] of Object.entries(salahTimes.forbidden)) {
                const start = parseTimeToMinutes(period.start);
                const end = parseTimeToMinutes(period.end);
                if (currentMinutes >= start && currentMinutes < end) {
                    foundForbidden = name;
                    break;
                }
            }
            setCurrentForbidden(foundForbidden);
        }

        // 3. Check Sunnah Times
        if (salahTimes.sunnah) {
            let foundSunnah = null;
            for (const [name, period] of Object.entries(salahTimes.sunnah)) {
                const start = parseTimeToMinutes(period.start);
                const end = parseTimeToMinutes(period.end);

                // Handle overnight times (like Tahajjud which spans midnight)
                if (start > end) {
                    // Overnight: check if current is after start OR before end
                    if (currentMinutes >= start || currentMinutes < end) {
                        foundSunnah = name;
                        break;
                    }
                } else {
                    if (currentMinutes >= start && currentMinutes < end) {
                        foundSunnah = name;
                        break;
                    }
                }
            }
            setCurrentSunnah(foundSunnah);
        }
    };

    // Calculate prayer times
    const calculatePrayerTimes = (lat, lng, selectedMethod) => {
        try {
            const today = new Date();
            const times = getPrayerTimes(today, lat, lng, {
                method: selectedMethod || 'MuslimWorldLeague',
                madhab: madhab
            });

            setSalahTimes({
                Fajr: times.fajr,
                Dhuhr: times.dhuhr,
                Asr: times.asr,
                Maghrib: times.maghrib,
                Isha: times.isha,
                Sunrise: times.sunrise,
                Sunset: times.maghrib,
                forbidden: times.forbidden,
                sunnah: times.sunnah
            });
        } catch (error) {
            console.error('Error calculating prayer times:', error);
        } finally {
            setLoading(false);
        }
    };

    // Effect to calculate times when location or method changes
    useEffect(() => {
        if (locationLoading) return;

        if (coords) {
            // Auto-detect method if not set
            let activeMethod = method;
            if (!activeMethod) {
                activeMethod = getAutoCalculationMethod(coords.lat, coords.lng);
                setMethod(activeMethod);
            }

            calculatePrayerTimes(coords.lat, coords.lng, activeMethod);
        }
    }, [coords, locationLoading, method, madhab]);


    // Timer to update status every 30 seconds
    useEffect(() => {
        if (!salahTimes) return;

        updateCurrentStatus();

        const interval = setInterval(() => {
            updateCurrentStatus();
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, [salahTimes]);

    // Initialize today's dates
    useEffect(() => {
        setTodayDates(getTodayAllCalendars(new Date()));
    }, []);

    // Recalculate when method changes
    useEffect(() => {
        if (coords) {
            calculatePrayerTimes(coords.lat, coords.lng, method);
            if (method) localStorage.setItem('prayerMethod', method);
            localStorage.setItem('prayerMadhab', madhab);
        }
    }, [method, madhab, coords]);

    // Handle method change
    const handleMethodChange = (e) => {
        setMethod(e.target.value);
    };

    const handleMadhabChange = (e) => {
        setMadhab(e.target.value);
    };




    return (
        <div className="homepage">
            {/* Hero Section */}
            <section className="hero-section">
                <img
                    src="/logo.png"
                    alt="Rushd Logo"
                    className="hero-logo"
                />
                <h1 className="hero-title">Rushd - Quran Tafsir Guidance</h1>
                <p className="hero-subtitle">Clear Guidance for Everyday Life</p>
            </section>

            {/* Ramadan Widget - Shows Sehri/Iftar countdown */}
            {coords && (
                <section className="container">
                    <RamadanWidget latitude={coords.lat} longitude={coords.lng} />
                </section>
            )}

            {/* Salah Times Card */}
            <section className="salah-card">
                <div className="salah-header">
                    <div className="salah-header-left">
                        <h2>🕌 Daily Salah Times</h2>
                        {todayDates && (
                            <div className="salah-date-row">
                                <span className="date-item gregorian">{todayDates.gregorian.day} {todayDates.gregorian.monthName} {todayDates.gregorian.year}</span>
                                <span className="date-separator">•</span>
                                <span className="date-item hijri">{todayDates.hijri.day} {todayDates.hijri.monthName} {todayDates.hijri.year} AH</span>
                                <span className="date-separator">•</span>
                                <span className="date-item bengali">{todayDates.bengali.day} {todayDates.bengali.monthName} {todayDates.bengali.year} BS</span>
                            </div>
                        )}
                    </div>
                    <div className="salah-header-right">
                        <select
                            className="method-selector"
                            value={madhab}
                            onChange={handleMadhabChange}
                            style={{ marginRight: '0.5rem' }}
                        >
                            {getAvailableMadhabs().map((m) => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                        <select
                            className="method-selector"
                            value={method || ''}
                            onChange={handleMethodChange}
                        >
                            {/* Wait for method to be set, or show loading/default */}
                            {getAvailableMethods().map((m) => (
                                <option key={m} value={m}>{m.replace(/([A-Z])/g, ' $1').trim()}</option>
                            ))}
                        </select>



                        <span className="salah-location">
                            📍 {location ? location.city : 'Loading...'}{location?.country ? `, ${location.country}` : ''}
                        </span>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>Loading prayer times...</div>
                ) : salahTimes && (
                    <>
                        <div className="salah-times-grid">
                            {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((prayer) => (
                                <div
                                    key={prayer}
                                    className={`salah-time-item ${currentPrayer === prayer ? 'current' : ''}`}
                                >
                                    {currentPrayer === prayer && <div className="current-badge">NOW</div>}
                                    <div className="salah-name">{prayer}</div>
                                    <div className="salah-time">{salahTimes[prayer]}</div>
                                </div>
                            ))}
                        </div>

                        <div className="forbidden-times-container">
                            <h3 className="forbidden-title">⚠️ Forbidden Times to Pray</h3>
                            <div className="forbidden-times-list">
                                <div className={`forbidden-item ${currentForbidden === 'sunrise' ? 'active' : ''}`}>
                                    {currentForbidden === 'sunrise' && <div className="forbidden-badge">NOW</div>}
                                    <span className="forbidden-label">Sunrise (Ishraq)</span>
                                    <span className="forbidden-range">{salahTimes.forbidden?.sunrise?.start} - {salahTimes.forbidden?.sunrise?.end}</span>
                                </div>
                                <div className={`forbidden-item ${currentForbidden === 'zawal' ? 'active' : ''}`}>
                                    {currentForbidden === 'zawal' && <div className="forbidden-badge">NOW</div>}
                                    <span className="forbidden-label">Zawal (Midday)</span>
                                    <span className="forbidden-range">{salahTimes.forbidden?.zawal?.start} - {salahTimes.forbidden?.zawal?.end}</span>
                                </div>
                                <div className={`forbidden-item ${currentForbidden === 'sunset' ? 'active' : ''}`}>
                                    {currentForbidden === 'sunset' && <div className="forbidden-badge">NOW</div>}
                                    <span className="forbidden-label">Sunset (Ghurub)</span>
                                    <span className="forbidden-range">{salahTimes.forbidden?.sunset?.start} - {salahTimes.forbidden?.sunset?.end}</span>
                                </div>
                            </div>
                        </div>

                        {/* Sunnah Times */}
                        {salahTimes.sunnah && (
                            <div className="sunnah-times-container">
                                <h3 className="sunnah-title">🌙 Sunnah Prayer Times</h3>
                                <div className="sunnah-times-grid">
                                    <div className={`sunnah-item ${currentSunnah === 'ishraq' ? 'active' : ''}`}>
                                        {currentSunnah === 'ishraq' && <div className="sunnah-badge">NOW</div>}
                                        <span className="sunnah-label">Ishraq</span>
                                        <span className="sunnah-time">{salahTimes.sunnah.ishraq?.start} - {salahTimes.sunnah.ishraq?.end}</span>
                                    </div>
                                    <div className={`sunnah-item ${currentSunnah === 'duha' ? 'active' : ''}`}>
                                        {currentSunnah === 'duha' && <div className="sunnah-badge">NOW</div>}
                                        <span className="sunnah-label">Duha (Chasht)</span>
                                        <span className="sunnah-time">{salahTimes.sunnah.duha?.start} - {salahTimes.sunnah.duha?.end}</span>
                                    </div>
                                    <div className={`sunnah-item ${currentSunnah === 'awwabin' ? 'active' : ''}`}>
                                        {currentSunnah === 'awwabin' && <div className="sunnah-badge">NOW</div>}
                                        <span className="sunnah-label">Awwabin</span>
                                        <span className="sunnah-time">{salahTimes.sunnah.awwabin?.start} - {salahTimes.sunnah.awwabin?.end}</span>
                                    </div>
                                    <div className={`sunnah-item ${currentSunnah === 'tahajjud' ? 'active' : ''}`}>
                                        {currentSunnah === 'tahajjud' && <div className="sunnah-badge">NOW</div>}
                                        <span className="sunnah-label">Tahajjud</span>
                                        <span className="sunnah-time">{salahTimes.sunnah.tahajjud?.start} - {salahTimes.sunnah.tahajjud?.end}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </section>

            {/* Quick Actions */}
            <section className="quick-actions">
                <h2 className="section-title">⚡ Quick Actions</h2>
                <div className="quick-actions-grid">
                    {quickActions.map((action) => (
                        <Link to={action.link} key={action.id} className="quick-action-card">
                            <div className="quick-action-icon">{action.icon}</div>
                            <h3 className="quick-action-title">{action.title}</h3>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Feature Sections */}
            {featureSections.map((section) => (
                <section key={section.id} className="feature-section">
                    <div className="feature-section-header">
                        <div className="feature-section-icon">{section.icon}</div>
                        <h2 className="feature-section-title">{section.title}</h2>
                    </div>
                    <div className="feature-cards-grid">
                        {section.features.map((feature) => (
                            <Link to={feature.link} key={feature.id} className="feature-card">
                                <div className="feature-card-icon">{feature.icon}</div>
                                <h3 className="feature-card-title">{feature.title}</h3>
                            </Link>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
};

export default HomePage;
