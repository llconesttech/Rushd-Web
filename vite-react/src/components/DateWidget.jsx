/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Calendar, Moon, Sun } from 'lucide-react';
import { getTodayAllCalendars } from '../services/dateService';
import './DateWidget.css';

const DateWidget = () => {
    const [dates, setDates] = useState(null);

    useEffect(() => {
        // Update date on mount and every minute
        const updateDate = () => {
            setDates(getTodayAllCalendars(new Date()));
        };

        updateDate();

        // Update every minute to catch day changes
        const interval = setInterval(updateDate, 60000);

        return () => clearInterval(interval);
    }, []);

    if (!dates) return null;

    return (
        <div className="date-widget">
            <div className="date-widget-header">
                <Calendar size={18} />
                <span>Today's Date</span>
            </div>

            <div className="date-cards">
                {/* Gregorian Calendar */}
                <div className="date-card gregorian">
                    <div className="date-card-icon">
                        <Sun size={16} />
                    </div>
                    <div className="date-card-content">
                        <div className="date-label">Gregorian</div>
                        <div className="date-day">{dates.gregorian.dayName}</div>
                        <div className="date-main">
                            <span className="date-num">{dates.gregorian.day}</span>
                            <span className="date-month">{dates.gregorian.monthName}</span>
                            <span className="date-year">{dates.gregorian.year}</span>
                        </div>
                    </div>
                </div>

                {/* Islamic/Hijri Calendar */}
                <div className="date-card hijri">
                    <div className="date-card-icon">
                        <Moon size={16} />
                    </div>
                    <div className="date-card-content">
                        <div className="date-label">Islamic (Hijri)</div>
                        <div className="date-day-arabic">{dates.gregorian.dayNameArabic}</div>
                        <div className="date-main">
                            <span className="date-num">{dates.hijri.day}</span>
                            <span className="date-month">{dates.hijri.monthName}</span>
                            <span className="date-year">{dates.hijri.year} AH</span>
                        </div>
                        <div className="date-arabic">{dates.hijri.monthNameArabic}</div>
                    </div>
                </div>

                {/* Bengali Calendar */}
                <div className="date-card bengali">
                    <div className="date-card-icon">
                        <span className="bengali-icon">বাং</span>
                    </div>
                    <div className="date-card-content">
                        <div className="date-label">Bengali (Bangla)</div>
                        <div className="date-day-bengali">{dates.gregorian.dayNameBengali}</div>
                        <div className="date-main">
                            <span className="date-num">{dates.bengali.day}</span>
                            <span className="date-month">{dates.bengali.monthName}</span>
                            <span className="date-year">{dates.bengali.year} BS</span>
                        </div>
                        <div className="date-native">{dates.bengali.formattedNative}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DateWidget;

