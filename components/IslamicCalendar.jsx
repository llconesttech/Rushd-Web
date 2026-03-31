import { useState, useMemo } from 'react';
import PageHeader from './PageHeader';
import { ChevronLeft, ChevronRight, Calendar, Star, Moon } from 'lucide-react';
import './IslamicCalendar.css';

// Hijri month names
const HIJRI_MONTHS = [
    { en: 'Muharram', ar: 'مُحَرَّم', bn: 'মহররম' },
    { en: 'Safar', ar: 'صَفَر', bn: 'সফর' },
    { en: 'Rabi al-Awwal', ar: 'رَبِيع الأَوَّل', bn: 'রবিউল আউয়াল' },
    { en: 'Rabi al-Thani', ar: 'رَبِيع الثَّانِي', bn: 'রবিউস সানি' },
    { en: 'Jumada al-Awwal', ar: 'جُمَادَى الأُولَى', bn: 'জমাদিউল আউয়াল' },
    { en: 'Jumada al-Thani', ar: 'جُمَادَى الثَّانِيَة', bn: 'জমাদিউস সানি' },
    { en: 'Rajab', ar: 'رَجَب', bn: 'রজব' },
    { en: 'Shaban', ar: 'شَعْبَان', bn: 'শাবান' },
    { en: 'Ramadan', ar: 'رَمَضَان', bn: 'রমজান' },
    { en: 'Shawwal', ar: 'شَوَّال', bn: 'শাওয়াল' },
    { en: 'Dhul Qadah', ar: 'ذُو القَعْدَة', bn: 'জিলকদ' },
    { en: 'Dhul Hijjah', ar: 'ذُو الحِجَّة', bn: 'জিলহজ' },
];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Important Islamic events (month, day)
const ISLAMIC_EVENTS = [
    { month: 1, day: 1, name: 'Islamic New Year', nameAr: 'رأس السنة الهجرية', nameBn: 'হিজরি নববর্ষ' },
    { month: 1, day: 10, name: 'Day of Ashura', nameAr: 'يوم عاشوراء', nameBn: 'আশুরা' },
    { month: 3, day: 12, name: 'Mawlid al-Nabi ﷺ', nameAr: 'المولد النبوي', nameBn: 'ঈদে মিলাদুন্নবী ﷺ' },
    { month: 7, day: 27, name: 'Isra and Miraj', nameAr: 'الإسراء والمعراج', nameBn: 'শবে মেরাজ' },
    { month: 8, day: 15, name: 'Shab-e-Barat', nameAr: 'ليلة البراءة', nameBn: 'শবে বরাত' },
    { month: 9, day: 1, name: 'Start of Ramadan', nameAr: 'بداية رمضان', nameBn: 'রমজান শুরু' },
    { month: 9, day: 27, name: 'Laylat al-Qadr', nameAr: 'ليلة القدر', nameBn: 'লাইলাতুল কদর' },
    { month: 10, day: 1, name: 'Eid al-Fitr', nameAr: 'عيد الفطر', nameBn: 'ঈদুল ফিতর' },
    { month: 12, day: 8, name: 'Day of Tarwiyah', nameAr: 'يوم التروية', nameBn: 'তারবিয়া দিবস' },
    { month: 12, day: 9, name: 'Day of Arafah', nameAr: 'يوم عرفة', nameBn: 'আরাফাত দিবস' },
    { month: 12, day: 10, name: 'Eid al-Adha', nameAr: 'عيد الأضحى', nameBn: 'ঈদুল আযহা' },
];

// Gregorian to Hijri conversion (Umm al-Qura approximation)
const gregorianToHijri = (date) => {
    const jd = Math.floor((date.getTime() / 86400000) + 2440587.5);
    const l = jd - 1948440 + 10632;
    const n = Math.floor((l - 1) / 10631);
    const l2 = l - 10631 * n + 354;
    const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) +
        Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
    const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
        Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
    const month = Math.floor((24 * l3) / 709);
    const day = l3 - Math.floor((709 * month) / 24);
    const year = 30 * n + j - 30;

    return { year, month, day };
};

// Hijri to Gregorian conversion
const hijriToGregorian = (hYear, hMonth, hDay) => {
    const jd = Math.floor((11 * hYear + 3) / 30) + 354 * hYear + 30 * hMonth -
        Math.floor((hMonth - 1) / 2) + hDay + 1948440 - 385;
    const l = jd + 68569;
    const n = Math.floor((4 * l) / 146097);
    const l2 = l - Math.floor((146097 * n + 3) / 4);
    const i = Math.floor((4000 * (l2 + 1)) / 1461001);
    const l3 = l2 - Math.floor((1461 * i) / 4) + 31;
    const j = Math.floor((80 * l3) / 2447);
    const day = l3 - Math.floor((2447 * j) / 80);
    const l4 = Math.floor(j / 11);
    const month = j + 2 - 12 * l4;
    const year = 100 * (n - 49) + i + l4;

    return new Date(year, month - 1, day);
};

// Get days in Hijri month (alternating 30/29, with adjustments)
const getDaysInHijriMonth = (year, month) => {
    // Simple approximation: odd months have 30 days, even have 29
    // Last month has 30 days in leap years
    if (month === 12) {
        // Leap year calculation for Hijri
        const leapYears = [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29];
        return leapYears.includes(year % 30) ? 30 : 29;
    }
    return month % 2 === 1 ? 30 : 29;
};

const IslamicCalendar = () => {
    const today = new Date();
    const todayHijri = gregorianToHijri(today);

    const [viewYear, setViewYear] = useState(todayHijri.year);
    const [viewMonth, setViewMonth] = useState(todayHijri.month);

    // Generate calendar days
    const calendarDays = useMemo(() => {
        const firstDayGregorian = hijriToGregorian(viewYear, viewMonth, 1);
        const startWeekday = firstDayGregorian.getDay();
        const daysInMonth = getDaysInHijriMonth(viewYear, viewMonth);

        const days = [];

        // Empty cells for days before the 1st
        for (let i = 0; i < startWeekday; i++) {
            days.push({ day: null, isToday: false });
        }

        // Actual days of the month
        for (let d = 1; d <= daysInMonth; d++) {
            const isToday = viewYear === todayHijri.year &&
                viewMonth === todayHijri.month &&
                d === todayHijri.day;
            const event = ISLAMIC_EVENTS.find(e => e.month === viewMonth && e.day === d);
            days.push({ day: d, isToday, event });
        }

        return days;
    }, [viewYear, viewMonth, todayHijri]);

    const navigateMonth = (delta) => {
        let newMonth = viewMonth + delta;
        let newYear = viewYear;

        if (newMonth > 12) {
            newMonth = 1;
            newYear++;
        } else if (newMonth < 1) {
            newMonth = 12;
            newYear--;
        }

        setViewMonth(newMonth);
        setViewYear(newYear);
    };

    const goToToday = () => {
        setViewYear(todayHijri.year);
        setViewMonth(todayHijri.month);
    };

    // Get upcoming events
    const upcomingEvents = useMemo(() => {
        const events = [];
        for (let i = 0; i < 12; i++) {
            let checkMonth = todayHijri.month + i;
            let checkYear = todayHijri.year;
            if (checkMonth > 12) {
                checkMonth -= 12;
                checkYear++;
            }

            ISLAMIC_EVENTS.forEach(event => {
                if (event.month === checkMonth) {
                    const isPast = checkYear === todayHijri.year &&
                        checkMonth === todayHijri.month &&
                        event.day < todayHijri.day;
                    if (!isPast) {
                        events.push({
                            ...event,
                            year: checkYear,
                            gregorian: hijriToGregorian(checkYear, event.month, event.day)
                        });
                    }
                }
            });
        }
        return events.slice(0, 5);
    }, [todayHijri]);

    return (
        <div className="">
            <PageHeader
                title="Islamic Calendar"
                subtitle="Hijri Calendar & Important Dates"
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Calendar', path: '/calendar' }
                ]}
            />

            <div className="calendar-container">
                {/* Current Date Display */}
                <div className="current-date-card">
                    <Moon size={24} />
                    <div className="current-date-info">
                        <div className="current-hijri">
                            <span className="hijri-day">{todayHijri.day}</span>
                            <span className="hijri-month">{HIJRI_MONTHS[todayHijri.month - 1].ar}</span>
                            <span className="hijri-year">{todayHijri.year} AH</span>
                        </div>
                        <div className="current-gregorian">
                            {today.toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="calendar-card">
                    <div className="calendar-header">
                        <button className="nav-btn" onClick={() => navigateMonth(-1)}>
                            <ChevronLeft size={20} />
                        </button>
                        <div className="month-year">
                            <span className="month-name-ar">{HIJRI_MONTHS[viewMonth - 1].ar}</span>
                            <span className="month-name-en">{HIJRI_MONTHS[viewMonth - 1].en} {viewYear} AH</span>
                        </div>
                        <button className="nav-btn" onClick={() => navigateMonth(1)}>
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    <button className="today-btn" onClick={goToToday}>
                        <Calendar size={16} /> Today
                    </button>

                    <div className="calendar-grid">
                        {WEEKDAYS.map(day => (
                            <div key={day} className="weekday-header">{day}</div>
                        ))}
                        {calendarDays.map((item, index) => (
                            <div
                                key={index}
                                className={`calendar-day ${!item.day ? 'empty' : ''} ${item.isToday ? 'today' : ''} ${item.event ? 'has-event' : ''}`}
                                title={item.event?.name}
                            >
                                {item.day}
                                {item.event && <Star size={10} className="event-star" />}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Events */}
                <div className="events-card">
                    <h3 className="events-title">
                        <Star size={20} />
                        Upcoming Islamic Events
                    </h3>
                    <div className="events-list">
                        {upcomingEvents.map((event, index) => (
                            <div key={index} className="event-item">
                                <div className="event-date">
                                    <span className="event-hijri">{event.day} {HIJRI_MONTHS[event.month - 1].en}</span>
                                    <span className="event-gregorian">
                                        {event.gregorian.toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <div className="event-name">
                                    <span className="event-name-en">{event.name}</span>
                                    <span className="event-name-ar">{event.nameAr}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info */}
                <div className="calendar-info">
                    <p>
                        📅 <strong>Note:</strong> Hijri dates are calculated mathematically and may vary by 1-2 days
                        depending on moon sighting in your region. Always confirm with local authorities for
                        religious observances.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default IslamicCalendar;
