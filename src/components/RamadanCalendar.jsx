import React, { useState, useEffect, useMemo } from 'react';
import PageHeader from './PageHeader';
import { Moon, Sun, Clock, Minus, Plus, MapPin, RefreshCw } from 'lucide-react';
import { getRamadanInfo, getRamadanTimetable, getTodaySehriIftar } from '../services/ramadanService';
import { useAppLocation } from '../context/LocationContext';
import './RamadanCalendar.css';

const RamadanCalendar = () => {
    // Use Global Location Context
    const { location, loading: locationLoading, error: locationError } = useAppLocation();

    // Local state
    const [dateOffset, setDateOffset] = useState(0);
    const [countdown, setCountdown] = useState(null);

    // Combine loading states if needed, or just rely on location loading
    const loading = locationLoading;


    // Get Ramadan info
    const ramadanInfo = useMemo(() => {
        return getRamadanInfo(null, dateOffset);
    }, [dateOffset]);

    // Get timetable
    const timetable = useMemo(() => {
        if (!location) return [];
        return getRamadanTimetable(
            location.latitude,
            location.longitude,
            null,
            { dateOffset }
        );
    }, [location, dateOffset]);

    // Countdown timer
    useEffect(() => {
        if (!location) return;

        const updateCountdown = () => {
            const times = getTodaySehriIftar(location.latitude, location.longitude);
            setCountdown(times);
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    }, [location]);

    const adjustOffset = (delta) => {
        setDateOffset(prev => Math.max(-3, Math.min(3, prev + delta)));
    };

    if (loading) {
        return (
            <div className="container">
                <PageHeader
                    title="Ramadan Calendar"
                    subtitle="Loading..."
                    breadcrumbs={[
                        { label: 'Home', path: '/' },
                        { label: 'Ramadan', path: '/ramadan' }
                    ]}
                />
                <div className="loading-container">
                    <RefreshCw size={32} className="spin" />
                    <p>Getting your location...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <PageHeader
                title="Ramadan Calendar"
                subtitle={ramadanInfo.isCurrentlyRamadan
                    ? `Day ${ramadanInfo.currentDay} of Ramadan ${ramadanInfo.hijriYear} AH`
                    : `Ramadan ${ramadanInfo.hijriYear} AH`
                }
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Ramadan', path: '/ramadan' }
                ]}
            />

            <div className="ramadan-container">
                {/* Status Card */}
                <div className={`ramadan-status ${ramadanInfo.isCurrentlyRamadan ? 'active' : ''}`}>
                    <Moon size={28} />
                    <div className="status-info">
                        {ramadanInfo.isCurrentlyRamadan ? (
                            <>
                                <h3>Ramadan Mubarak! 🌙</h3>
                                <p>Today is Day {ramadanInfo.currentDay} of Ramadan</p>
                            </>
                        ) : (
                            <>
                                <h3>Ramadan is Coming</h3>
                                <p>{ramadanInfo.daysUntil} days until Ramadan begins</p>
                                <span className="start-date">
                                    Starts: {ramadanInfo.startDate.toLocaleDateString('en-US', {
                                        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
                                    })}
                                </span>
                            </>
                        )}
                    </div>
                </div>

                {/* Sehri/Iftar Times Card */}
                {countdown && (
                    <div className="times-card">
                        <div className="times-row">
                            <div className="time-box sehri">
                                <div className="time-icon">
                                    <Moon size={20} />
                                </div>
                                <div className="time-label">Sehri Ends</div>
                                <div className="time-value">{countdown.sehri}</div>
                            </div>
                            <div className="time-box iftar">
                                <div className="time-icon">
                                    <Sun size={20} />
                                </div>
                                <div className="time-label">Iftar</div>
                                <div className="time-value">{countdown.iftar}</div>
                            </div>
                        </div>

                        {/* Countdown */}
                        <div className="countdown-section">
                            <div className="countdown-label">
                                <Clock size={16} />
                                Time until {countdown.nextEvent === 'sehri' ? 'Sehri' : 'Iftar'}
                            </div>
                            <div className="countdown-timer">
                                <div className="countdown-unit">
                                    <span className="countdown-value">{countdown.timeUntil.hours}</span>
                                    <span className="countdown-label-small">hours</span>
                                </div>
                                <span className="countdown-sep">:</span>
                                <div className="countdown-unit">
                                    <span className="countdown-value">{countdown.timeUntil.minutes}</span>
                                    <span className="countdown-label-small">mins</span>
                                </div>
                                <span className="countdown-sep">:</span>
                                <div className="countdown-unit">
                                    <span className="countdown-value">{countdown.timeUntil.seconds}</span>
                                    <span className="countdown-label-small">secs</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Location Info */}
                {locationError && (
                    <div className="location-notice">
                        <MapPin size={16} />
                        {locationError}
                    </div>
                )}

                {/* Moon Sighting Adjustment */}
                <div className="adjustment-card">
                    <h4>🌙 Moon Sighting Adjustment</h4>
                    <p>Adjust dates if your local authorities announced a different start date.</p>
                    <div className="adjustment-control">
                        <button
                            className="adj-btn"
                            onClick={() => adjustOffset(-1)}
                            disabled={dateOffset <= -3}
                        >
                            <Minus size={18} />
                        </button>
                        <div className="offset-display">
                            {dateOffset === 0
                                ? 'Standard (Calculated)'
                                : `${dateOffset > 0 ? '+' : ''}${dateOffset} day${Math.abs(dateOffset) !== 1 ? 's' : ''}`
                            }
                        </div>
                        <button
                            className="adj-btn"
                            onClick={() => adjustOffset(1)}
                            disabled={dateOffset >= 3}
                        >
                            <Plus size={18} />
                        </button>
                    </div>
                </div>

                {/* 30-Day Timetable */}
                <div className="timetable-card">
                    <h4>📅 Ramadan Timetable</h4>
                    <div className="timetable-header">
                        <span>Day</span>
                        <span>Date</span>
                        <span>Sehri</span>
                        <span>Iftar</span>
                    </div>
                    <div className="timetable-body">
                        {timetable.map((day) => (
                            <div
                                key={day.day}
                                className={`timetable-row ${day.isToday ? 'today' : ''}`}
                            >
                                <span className="day-num">{day.day}</span>
                                <span className="day-date">
                                    {day.weekday}, {day.gregorian.toLocaleDateString('en-US', {
                                        month: 'short', day: 'numeric'
                                    })}
                                </span>
                                <span className="day-sehri">{day.sehri}</span>
                                <span className="day-iftar">{day.iftar}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="ramadan-disclaimer">
                    <p>
                        ⚠️ <strong>Important:</strong> Times are calculated mathematically based on your location.
                        Actual Ramadan dates depend on local moon sighting. Always confirm with your local
                        Islamic authorities for accurate dates.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RamadanCalendar;
