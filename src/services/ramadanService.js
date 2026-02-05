/**
 * Ramadan Service
 * 
 * Calculates Ramadan dates and generates Sehri/Iftar timetables.
 * Uses existing prayerTimesService for actual prayer times.
 * 
 * API (for Flutter integration):
 *   getRamadanInfo(hijriYear?, dateOffset?)
 *   getRamadanTimetable(latitude, longitude, hijriYear?, options?)
 *   isRamadan(date?, dateOffset?)
 */

import { getPrayerTimes } from './prayerTimesService';

// Hijri month names
const HIJRI_MONTHS = [
    'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
    'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Shaban',
    'Ramadan', 'Shawwal', 'Dhul Qadah', 'Dhul Hijjah'
];

/**
 * Convert Gregorian date to Hijri (Umm al-Qura approximation)
 */
export const gregorianToHijri = (date) => {
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

    return { year, month, day, monthName: HIJRI_MONTHS[month - 1] };
};

/**
 * Convert Hijri date to Gregorian
 */
export const hijriToGregorian = (hYear, hMonth, hDay) => {
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

/**
 * Get Ramadan info for a given Hijri year
 * @param {number} hijriYear - Hijri year (defaults to current/upcoming)
 * @param {number} dateOffset - Days to adjust for moon sighting (-3 to +3)
 * @param {number} eidOffset - Days to adjust Eid date (-2 to +2)
 * @returns {Object} Ramadan start/end dates and status
 */
export const getRamadanInfo = (hijriYear = null, dateOffset = 0, eidOffset = 0) => {
    const today = new Date();
    const todayHijri = gregorianToHijri(today);

    // Determine which Ramadan year to show
    let targetYear = hijriYear;
    if (!targetYear) {
        // If we're past Ramadan this year, show next year's
        if (todayHijri.month > 9 || (todayHijri.month === 9 && todayHijri.day > 30)) {
            targetYear = todayHijri.year + 1;
        } else {
            targetYear = todayHijri.year;
        }
    }

    // Calculate Ramadan 1st with offset
    const ramadanStart = hijriToGregorian(targetYear, 9, 1);
    ramadanStart.setDate(ramadanStart.getDate() + dateOffset);

    // Ramadan is 29 or 30 days, we'll show 30 for planning
    const ramadanEnd = new Date(ramadanStart);
    ramadanEnd.setDate(ramadanEnd.getDate() + 29);

    // Calculate Eid date (1st Shawwal = day after Ramadan ends)
    // Eid offset is separate from Ramadan offset
    const eidDate = new Date(ramadanEnd);
    eidDate.setDate(eidDate.getDate() + 1 + eidOffset);

    // Check if today is in Ramadan
    const isCurrentlyRamadan = today >= ramadanStart && today <= ramadanEnd;

    // Days until Ramadan starts
    const daysUntil = Math.ceil((ramadanStart - today) / (1000 * 60 * 60 * 24));

    // Current day of Ramadan (1-30) if in Ramadan
    let currentRamadanDay = null;
    if (isCurrentlyRamadan) {
        currentRamadanDay = Math.ceil((today - ramadanStart) / (1000 * 60 * 60 * 24)) + 1;
    }

    // Show Eid adjustment after day 28 of Ramadan
    const showEidAdjustment = isCurrentlyRamadan && currentRamadanDay >= 28;

    // Days until Eid
    const daysUntilEid = Math.ceil((eidDate - today) / (1000 * 60 * 60 * 24));

    // Check if today is Eid (within 3 days of Eid date for display purposes)
    const isEidPeriod = daysUntilEid >= -2 && daysUntilEid <= 2;

    // Show widget only 60 days before Ramadan, during Ramadan, or Eid period
    const shouldShowWidget = daysUntil <= 60 || isCurrentlyRamadan || isEidPeriod;

    return {
        hijriYear: targetYear,
        startDate: ramadanStart,
        endDate: ramadanEnd,
        eidDate,
        isCurrentlyRamadan,
        daysUntil: daysUntil > 0 ? daysUntil : 0,
        daysUntilEid: daysUntilEid > 0 ? daysUntilEid : 0,
        currentDay: currentRamadanDay,
        dateOffset,
        eidOffset,
        showEidAdjustment,
        isEidPeriod,
        shouldShowWidget
    };
};

/**
 * Check if a given date is in Ramadan
 */
export const isRamadan = (date = new Date(), dateOffset = 0) => {
    const hijri = gregorianToHijri(date);
    // Apply offset logic (simplified)
    return hijri.month === 9;
};

/**
 * Generate 30-day Ramadan timetable with Sehri/Iftar times
 * @param {number} latitude 
 * @param {number} longitude 
 * @param {number} hijriYear 
 * @param {Object} options - { method, madhab, dateOffset }
 * @returns {Array} Array of 30 days with times
 */
export const getRamadanTimetable = (latitude, longitude, hijriYear = null, options = {}) => {
    const ramadanInfo = getRamadanInfo(hijriYear, options.dateOffset || 0);
    const timetable = [];

    for (let day = 1; day <= 30; day++) {
        const date = new Date(ramadanInfo.startDate);
        date.setDate(date.getDate() + day - 1);

        try {
            const prayerTimes = getPrayerTimes(date, latitude, longitude, {
                method: options.method || 'MuslimWorldLeague',
                madhab: options.madhab || 'Hanafi'
            });

            timetable.push({
                day,
                date: date.toISOString().split('T')[0],
                gregorian: date,
                weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
                sehri: prayerTimes.fajr,     // Sehri ends at Fajr
                iftar: prayerTimes.maghrib,  // Iftar starts at Maghrib
                isToday: isSameDay(date, new Date())
            });
        } catch (error) {
            console.error(`Error calculating times for day ${day}:`, error);
            timetable.push({
                day,
                date: date.toISOString().split('T')[0],
                gregorian: date,
                weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
                sehri: '--:--',
                iftar: '--:--',
                isToday: isSameDay(date, new Date())
            });
        }
    }

    return timetable;
};

/**
 * Get today's Sehri and Iftar times with countdown
 */
export const getTodaySehriIftar = (latitude, longitude, options = {}) => {
    const now = new Date();

    const prayerTimes = getPrayerTimes(now, latitude, longitude, {
        method: options.method || 'MuslimWorldLeague',
        madhab: options.madhab || 'Hanafi'
    });

    // Parse times to Date objects for countdown
    const [sehriH, sehriM] = prayerTimes.fajr.split(':').map(Number);
    const [iftarH, iftarM] = prayerTimes.maghrib.split(':').map(Number);

    const sehriTime = new Date(now);
    sehriTime.setHours(sehriH, sehriM, 0, 0);

    const iftarTime = new Date(now);
    iftarTime.setHours(iftarH, iftarM, 0, 0);

    // Determine next event
    let nextEvent, timeUntil;
    if (now < sehriTime) {
        nextEvent = 'sehri';
        timeUntil = sehriTime - now;
    } else if (now < iftarTime) {
        nextEvent = 'iftar';
        timeUntil = iftarTime - now;
    } else {
        // After iftar, show tomorrow's sehri
        const tomorrowPrayerTimes = getPrayerTimes(
            new Date(now.getTime() + 24 * 60 * 60 * 1000),
            latitude, longitude, options
        );
        nextEvent = 'sehri';
        const [tH, tM] = tomorrowPrayerTimes.fajr.split(':').map(Number);
        const tomorrowSehri = new Date(now);
        tomorrowSehri.setDate(tomorrowSehri.getDate() + 1);
        tomorrowSehri.setHours(tH, tM, 0, 0);
        timeUntil = tomorrowSehri - now;
    }

    return {
        sehri: prayerTimes.fajr,
        iftar: prayerTimes.maghrib,
        nextEvent,
        timeUntilMs: timeUntil,
        timeUntil: formatCountdown(timeUntil)
    };
};

/**
 * Format milliseconds to countdown string
 */
const formatCountdown = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0'),
        display: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    };
};

/**
 * Check if two dates are the same day
 */
const isSameDay = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();
};

export default {
    gregorianToHijri,
    hijriToGregorian,
    getRamadanInfo,
    isRamadan,
    getRamadanTimetable,
    getTodaySehriIftar
};
