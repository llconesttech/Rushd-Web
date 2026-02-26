'use client';
/* eslint-disable */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Moon, Sun, Clock, ChevronRight, Star } from 'lucide-react';
import { getRamadanInfo, getTodaySehriIftar } from '../services/ramadanService';
import './RamadanWidget.css';

/**
 * Compact Ramadan Widget for HomePage
 * Shows Sehri/Iftar times with countdown
 * Only displays 60 days before Ramadan, during Ramadan, or Eid period
 */
const RamadanWidget = ({ latitude, longitude }) => {
    const [countdown, setCountdown] = useState(null);
    const [ramadanInfo, setRamadanInfo] = useState(null);

    useEffect(() => {
        const storedOffset = localStorage.getItem('rushdMoonOffset');
        const dateOffset = storedOffset ? parseInt(storedOffset, 10) : 0;
        setRamadanInfo(getRamadanInfo(null, dateOffset));
    }, []);

    useEffect(() => {
        if (!latitude || !longitude) return;

        const updateCountdown = () => {
            try {
                const times = getTodaySehriIftar(latitude, longitude);
                setCountdown(times);
            } catch (error) {
                console.error('Error getting Sehri/Iftar times:', error);
            }
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    }, [latitude, longitude]);

    // Don't render if no info or outside display window
    if (!ramadanInfo || !ramadanInfo.shouldShowWidget) return null;

    // Eid period display
    if (ramadanInfo.isEidPeriod && !ramadanInfo.isCurrentlyRamadan) {
        return (
            <div className="ramadan-widget eid-mode">
                <div className="rw-header">
                    <div className="rw-title">
                        <Star size={18} className="rw-icon-gold" />
                        <span>Eid Mubarak!</span>
                    </div>
                    <Link href="/ramadan" className="rw-link">
                        View Details <ChevronRight size={14} />
                    </Link>
                </div>
                <div className="eid-message">
                    Wishing you and your family a blessed Eid al-Fitr!
                </div>
            </div>
        );
    }

    return (
        <div className="ramadan-widget">
            {/* Geometric overlay via CSS */}
            <div className="rw-pattern-overlay" aria-hidden="true" />

            <div className="rw-header">
                <div className="rw-title">
                    <Moon size={18} className="rw-icon-gold" />
                    <span>
                        {ramadanInfo.isCurrentlyRamadan
                            ? `Ramadan Mubarak — Day ${ramadanInfo.currentDay}`
                            : 'Ramadan is Coming'}
                    </span>
                </div>
                <Link href="/ramadan" className="rw-link">
                    View Calendar <ChevronRight size={14} />
                </Link>
            </div>

            {/* During Ramadan: Sehri / Iftar / Countdown grid */}
            {countdown && ramadanInfo.isCurrentlyRamadan && (
                <div className="rw-times-grid">
                    <div className="rw-time-card">
                        <Moon size={16} className="rw-card-icon" />
                        <span className="rw-card-label">Sehri</span>
                        <span className="rw-card-value">{countdown.sehri}</span>
                    </div>
                    <div className="rw-time-card">
                        <Sun size={16} className="rw-card-icon" />
                        <span className="rw-card-label">Iftar</span>
                        <span className="rw-card-value">{countdown.iftar}</span>
                    </div>
                    <div className="rw-time-card rw-countdown-card">
                        <Clock size={16} className="rw-card-icon" />
                        <span className="rw-card-label">
                            Until {countdown.nextEvent}
                        </span>
                        <span className="rw-card-value rw-mono">
                            {countdown.timeUntil.display}
                        </span>
                    </div>
                </div>
            )}

            {/* Before Ramadan: Days countdown */}
            {!ramadanInfo.isCurrentlyRamadan && (
                <div className="rw-coming-soon">
                    <span className="rw-days-count">{ramadanInfo.daysUntil}</span>
                    <span className="rw-days-label">days until Ramadan</span>
                    <span className="rw-moonsighting">* Depends on moon sighting</span>
                </div>
            )}

            {/* Eid countdown after day 28 */}
            {ramadanInfo.showEidAdjustment && (
                <div className="rw-eid-notice">
                    <Star size={14} className="rw-icon-gold" />
                    <span>Eid in ~{ramadanInfo.daysUntilEid} days</span>
                    <span className="rw-moonsighting">* Depends on moon sighting</span>
                </div>
            )}
        </div>
    );
};

export default RamadanWidget;

