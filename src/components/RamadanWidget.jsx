import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
        setRamadanInfo(getRamadanInfo());
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
                <div className="ramadan-widget-header">
                    <div className="widget-title">
                        <Star size={18} />
                        <span>Eid Mubarak! 🎉</span>
                    </div>
                    <Link to="/ramadan" className="widget-link">
                        View Details <ChevronRight size={16} />
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
            <div className="ramadan-widget-header">
                <div className="widget-title">
                    <Moon size={18} />
                    <span>
                        {ramadanInfo.isCurrentlyRamadan
                            ? `Ramadan Day ${ramadanInfo.currentDay}`
                            : 'Ramadan Coming'}
                    </span>
                </div>
                <Link to="/ramadan" className="widget-link">
                    View Calendar <ChevronRight size={16} />
                </Link>
            </div>

            {countdown && ramadanInfo.isCurrentlyRamadan && (
                <div className="widget-times">
                    <div className="widget-time-box">
                        <Moon size={14} />
                        <span className="time-type">Sehri</span>
                        <span className="time-value">{countdown.sehri}</span>
                    </div>
                    <div className="widget-time-box">
                        <Sun size={14} />
                        <span className="time-type">Iftar</span>
                        <span className="time-value">{countdown.iftar}</span>
                    </div>
                    <div className="widget-countdown">
                        <Clock size={14} />
                        <span className="countdown-text">
                            {countdown.timeUntil.display} until {countdown.nextEvent}
                        </span>
                    </div>
                </div>
            )}

            {!ramadanInfo.isCurrentlyRamadan && (
                <div className="widget-countdown-days">
                    <span className="days-count">{ramadanInfo.daysUntil}</span>
                    <span className="days-label">days until Ramadan</span>
                    <span className="moonsighting-note">* Depends on moon sighting</span>
                </div>
            )}

            {/* Eid countdown after day 28 */}
            {ramadanInfo.showEidAdjustment && (
                <div className="eid-countdown">
                    <Star size={14} />
                    <span>Eid in ~{ramadanInfo.daysUntilEid} days</span>
                    <span className="moonsighting-note">* Depends on moon sighting</span>
                </div>
            )}
        </div>
    );
};

export default RamadanWidget;
