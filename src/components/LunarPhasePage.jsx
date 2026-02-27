import { useState, useEffect, useMemo, useCallback } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import { calculateLunarPhase } from '../utils/lunarPhase';
import PageHeader from './PageHeader';
import { Moon, MapPin, ChevronLeft, ChevronRight, Eye, Search } from 'lucide-react';
import './LunarPhasePage.css';

// Inline SVG moon phase icons
const MoonIcon = ({ phaseIndex, size = 80 }) => {
    const r = size / 2 - 2;
    const cx = size / 2;
    const cy = size / 2;

    const getPath = () => {
        switch (phaseIndex) {
            case 0: return <circle cx={cx} cy={cy} r={r} fill="var(--moon-dark)" stroke="var(--moon-stroke)" strokeWidth="1.5" />;
            case 1: return (<><circle cx={cx} cy={cy} r={r} fill="var(--moon-dark)" stroke="var(--moon-stroke)" strokeWidth="1.5" /><path d={`M${cx},${cy - r} A${r},${r} 0 0,1 ${cx},${cy + r} A${r * 0.6},${r} 0 0,0 ${cx},${cy - r}`} fill="var(--moon-lit)" /></>);
            case 2: return (<><circle cx={cx} cy={cy} r={r} fill="var(--moon-dark)" stroke="var(--moon-stroke)" strokeWidth="1.5" /><path d={`M${cx},${cy - r} A${r},${r} 0 0,1 ${cx},${cy + r} L${cx},${cy - r}`} fill="var(--moon-lit)" /></>);
            case 3: return (<><circle cx={cx} cy={cy} r={r} fill="var(--moon-lit)" stroke="var(--moon-stroke)" strokeWidth="1.5" /><path d={`M${cx},${cy - r} A${r},${r} 0 0,0 ${cx},${cy + r} A${r * 0.6},${r} 0 0,0 ${cx},${cy - r}`} fill="var(--moon-dark)" /></>);
            case 4: return <circle cx={cx} cy={cy} r={r} fill="var(--moon-lit)" stroke="var(--moon-stroke)" strokeWidth="1.5" />;
            case 5: return (<><circle cx={cx} cy={cy} r={r} fill="var(--moon-lit)" stroke="var(--moon-stroke)" strokeWidth="1.5" /><path d={`M${cx},${cy - r} A${r},${r} 0 0,1 ${cx},${cy + r} A${r * 0.6},${r} 0 0,1 ${cx},${cy - r}`} fill="var(--moon-dark)" /></>);
            case 6: return (<><circle cx={cx} cy={cy} r={r} fill="var(--moon-dark)" stroke="var(--moon-stroke)" strokeWidth="1.5" /><path d={`M${cx},${cy - r} A${r},${r} 0 0,0 ${cx},${cy + r} L${cx},${cy - r}`} fill="var(--moon-lit)" /></>);
            case 7: return (<><circle cx={cx} cy={cy} r={r} fill="var(--moon-dark)" stroke="var(--moon-stroke)" strokeWidth="1.5" /><path d={`M${cx},${cy - r} A${r},${r} 0 0,0 ${cx},${cy + r} A${r * 0.6},${r} 0 0,1 ${cx},${cy - r}`} fill="var(--moon-lit)" /></>);
            default: return <circle cx={cx} cy={cy} r={r} fill="var(--moon-dark)" stroke="var(--moon-stroke)" strokeWidth="1.5" />;
        }
    };

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="moon-icon">
            {getPath()}
        </svg>
    );
};

const MoonIconSmall = ({ phaseIndex }) => <MoonIcon phaseIndex={phaseIndex} size={32} />;

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const LunarPhasePage = () => {
    const { coords, error: geoError, loading } = useGeolocation();
    const [activeCoords, setActiveCoords] = useState(null);
    const [locationName, setLocationName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
    const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());

    // Reverse geocode to get location name
    const reverseGeocode = useCallback(async (lat, lng) => {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`);
            const data = await res.json();
            if (data.address) {
                const city = data.address.city || data.address.town || data.address.village || data.address.county || '';
                const country = data.address.country || '';
                setLocationName([city, country].filter(Boolean).join(', '));
            }
        } catch {
            setLocationName(`${lat.toFixed(2)}°, ${lng.toFixed(2)}°`);
        }
    }, []);

    // Forward geocode: search for a city/place
    const handleLocationSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        setSearchLoading(true);
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1&accept-language=en`);
            const data = await res.json();
            if (data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lng = parseFloat(data[0].lon);
                setActiveCoords({ latitude: lat, longitude: lng });
                setLocationName(data[0].display_name.split(',').slice(0, 2).join(','));
                setSearchQuery('');
            }
        } catch {
            // silently fail
        }
        setSearchLoading(false);
    };

    useEffect(() => {
        if (coords) {
            setActiveCoords(coords);
            reverseGeocode(coords.latitude, coords.longitude);
        }
    }, [coords, reverseGeocode]);

    const todayPhase = useMemo(() => {
        const lat = activeCoords?.latitude || 0;
        const lng = activeCoords?.longitude || 0;
        return calculateLunarPhase(new Date(), lat, lng);
    }, [activeCoords]);

    const upcomingPhases = useMemo(() => {
        const lat = activeCoords?.latitude || 0;
        const lng = activeCoords?.longitude || 0;
        const phases = [];
        const targetIndices = [0, 2, 4, 6];
        const found = new Set();
        const today = new Date();
        for (let i = 1; i <= 35 && found.size < 4; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            const p = calculateLunarPhase(d, lat, lng);
            if (targetIndices.includes(p.phaseIndex) && !found.has(p.phaseIndex)) {
                found.add(p.phaseIndex);
                phases.push({ ...p, date: d, dateStr: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) });
            }
        }
        return phases.sort((a, b) => a.date - b.date);
    }, [activeCoords]);

    const calendarDays = useMemo(() => {
        const lat = activeCoords?.latitude || 0;
        const lng = activeCoords?.longitude || 0;
        const firstDay = new Date(calendarYear, calendarMonth, 1);
        const startWeekday = firstDay.getDay();
        const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
        const today = new Date();
        const days = [];
        for (let i = 0; i < startWeekday; i++) days.push({ day: null });
        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(calendarYear, calendarMonth, d);
            const phase = calculateLunarPhase(date, lat, lng);
            days.push({ day: d, phase, isToday: date.toDateString() === today.toDateString() });
        }
        return days;
    }, [calendarYear, calendarMonth, activeCoords]);

    const navigateMonth = (delta) => {
        let m = calendarMonth + delta;
        let y = calendarYear;
        if (m > 11) { m = 0; y++; }
        if (m < 0) { m = 11; y--; }
        setCalendarMonth(m);
        setCalendarYear(y);
    };

    const lunarAge = useMemo(() => {
        const now = new Date();
        const utc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
        const knownNewMoon = Date.UTC(2000, 0, 6, 18, 14, 0);
        const synodic = 29.53058867;
        const phase = ((utc - knownNewMoon) / 86400000 / synodic);
        return ((phase - Math.floor(phase)) * synodic).toFixed(1);
    }, []);

    return (
        <div className="container">
            <PageHeader
                title="Lunar Phase"
                subtitle="Moon observation & phase calendar"
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Lunar Phase', path: '/tools/lunar-phase' }
                ]}
            />

            <div className="lunar-container">
                {/* Location Search Bar */}
                <div className="lunar-location-bar">
                    <div className="lunar-location-current">
                        <MapPin size={16} />
                        <span>{locationName || (activeCoords ? `${activeCoords.latitude.toFixed(2)}°, ${activeCoords.longitude.toFixed(2)}°` : 'Detecting…')}</span>
                    </div>
                    <form onSubmit={handleLocationSearch} className="lunar-search-form">
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder="Search city or place…"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="lunar-search-input"
                        />
                        <button type="submit" className="lunar-search-btn" disabled={searchLoading}>
                            {searchLoading ? '…' : 'Go'}
                        </button>
                    </form>
                </div>

                {/* Loading state */}
                {loading && !activeCoords && (
                    <div className="lunar-loading-card">
                        <div className="lunar-loading-spinner"></div>
                        <span>Detecting your location…</span>
                    </div>
                )}

                {/* Geolocation error fallback */}
                {geoError && !activeCoords && (
                    <div className="lunar-fallback-card">
                        <MapPin size={20} />
                        <p className="lunar-fallback-text">
                            Location access denied. Use the search bar above to find your city, or the moon data below defaults to UTC.
                        </p>
                    </div>
                )}

                {/* Section 1: Today's Moon Phase */}
                <div className="lunar-hero-card">
                    <div className="lunar-hero-top">
                        <div className="lunar-hero-icon">
                            <MoonIcon phaseIndex={todayPhase.phaseIndex} size={120} />
                        </div>
                        <div className="lunar-hero-info">
                            <span className="lunar-hero-label">Moon Phase Today</span>
                            <h2 className="lunar-hero-phase">{todayPhase.phaseName}</h2>
                            <div className="lunar-hero-meta">
                                <span className="lunar-meta-item">
                                    <Eye size={14} />
                                    {todayPhase.illumination}% illuminated
                                </span>
                                <span className="lunar-meta-item">
                                    <Moon size={14} />
                                    Lunar day {lunarAge}
                                </span>
                            </div>
                            {/* Illumination bar */}
                            <div className="lunar-illumination-bar">
                                <div className="lunar-illumination-track">
                                    <div className="lunar-illumination-fill" style={{ width: `${todayPhase.illumination}%` }}></div>
                                </div>
                                <span className="lunar-illumination-label">{todayPhase.illumination}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Upcoming Key Phases */}
                {upcomingPhases.length > 0 && (
                    <div className="lunar-upcoming-card">
                        <h3 className="lunar-section-title">
                            <Moon size={18} />
                            Upcoming Moon Phases
                        </h3>
                        <div className="lunar-upcoming-grid">
                            {upcomingPhases.map((p, i) => (
                                <div key={i} className="lunar-upcoming-item">
                                    <MoonIconSmall phaseIndex={p.phaseIndex} />
                                    <span className="lunar-upcoming-name">{p.phaseName}</span>
                                    <span className="lunar-upcoming-date">{p.dateStr}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Section 3: Moon Phase Calendar */}
                <div className="lunar-calendar-card">
                    <div className="lunar-calendar-header">
                        <button className="lunar-cal-nav" onClick={() => navigateMonth(-1)}>
                            <ChevronLeft size={18} />
                        </button>
                        <div className="lunar-cal-title">
                            <span>{MONTH_NAMES[calendarMonth]} {calendarYear}</span>
                            <button className="lunar-cal-today" onClick={() => { setCalendarYear(new Date().getFullYear()); setCalendarMonth(new Date().getMonth()); }}>Today</button>
                        </div>
                        <button className="lunar-cal-nav" onClick={() => navigateMonth(1)}>
                            <ChevronRight size={18} />
                        </button>
                    </div>
                    <div className="lunar-calendar-grid">
                        {WEEKDAYS.map(wd => (
                            <div key={wd} className="lunar-cal-weekday">{wd}</div>
                        ))}
                        {calendarDays.map((item, i) => (
                            <div key={i} className={`lunar-cal-day ${!item.day ? 'empty' : ''} ${item.isToday ? 'today' : ''}`} title={item.phase?.phaseName}>
                                {item.day && (
                                    <>
                                        <MoonIconSmall phaseIndex={item.phase?.phaseIndex ?? 0} />
                                        <span className="lunar-cal-daynum">{item.day}</span>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section 4: About */}
                <div className="lunar-info-card">
                    <p>
                        <Moon size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem' }} />
                        <strong>Note:</strong> Lunar phases are calculated astronomically. The Islamic calendar months begin with visual crescent sighting. Always confirm with local authorities for religious observances.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LunarPhasePage;
