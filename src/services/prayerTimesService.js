/**
 * Prayer Times Service
 * 
 * Local calculation of Islamic prayer times using the adhan library.
 * This service can be used as a reference for Flutter/Dart implementation.
 * 
 * API:
 *   getPrayerTimes(date, latitude, longitude, options)
 *   
 * Parameters:
 *   - date: Date object or ISO string
 *   - latitude: number
 *   - longitude: number
 *   - options: {
 *       method: 'MuslimWorldLeague' | 'Egyptian' | 'Karachi' | 'UmmAlQura' | 'Dubai' | 'MoonsightingCommittee' | 'NorthAmerica' | 'Kuwait' | 'Qatar' | 'Singapore' | 'Tehran' | 'Turkey'
 *       madhab: 'Shafi' | 'Hanafi'
 *     }
 * 
 * Returns:
 *   {
 *     fajr: string (HH:mm),
 *     sunrise: string (HH:mm),
 *     dhuhr: string (HH:mm),
 *     asr: string (HH:mm),
 *     maghrib: string (HH:mm),
 *     isha: string (HH:mm),
 *     // Calculated forbidden periods
 *     forbidden: {
 *       sunrise: { start: string, end: string },
 *       zawal: { start: string, end: string },
 *       sunset: { start: string, end: string }
 *     }
 *   }
 */

import {
    PrayerTimes,
    Coordinates,
    CalculationMethod,
    Madhab,
    HighLatitudeRule,
    SunnahTimes,
    Qibla
} from 'adhan';

// Calculation methods mapping
const METHODS = {
    MuslimWorldLeague: CalculationMethod.MuslimWorldLeague,
    Egyptian: CalculationMethod.Egyptian,
    Karachi: CalculationMethod.Karachi,
    UmmAlQura: CalculationMethod.UmmAlQura,
    Dubai: CalculationMethod.Dubai,
    MoonsightingCommittee: CalculationMethod.MoonsightingCommittee,
    NorthAmerica: CalculationMethod.NorthAmerica,
    Kuwait: CalculationMethod.Kuwait,
    Qatar: CalculationMethod.Qatar,
    Singapore: CalculationMethod.Singapore,
    Tehran: CalculationMethod.Tehran,
    Turkey: CalculationMethod.Turkey,
};

// Madhab mapping
const MADHABS = {
    Shafi: Madhab.Shafi,
    Hanafi: Madhab.Hanafi,
};

/**
 * Format a Date object to HH:mm string
 */
const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};

/**
 * Add minutes to a Date object
 */
const addMinutes = (date, minutes) => {
    return new Date(date.getTime() + minutes * 60 * 1000);
};

/**
 * Subtract minutes from a Date object
 */
const subtractMinutes = (date, minutes) => {
    return new Date(date.getTime() - minutes * 60 * 1000);
};

/**
 * Get prayer times for a given date and location
 * 
 * @param {Date|string} date - Date object or ISO date string
 * @param {number} latitude - Latitude of location
 * @param {number} longitude - Longitude of location
 * @param {Object} options - Calculation options
 * @param {string} options.method - Calculation method (default: 'MuslimWorldLeague')
 * @param {string} options.madhab - Madhab for Asr calculation (default: 'Shafi')
 * @returns {Object} Prayer times object
 */
export const getPrayerTimes = (date, latitude, longitude, options = {}) => {
    // Parse date if string
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    // Set up coordinates
    const coordinates = new Coordinates(latitude, longitude);

    // Get calculation parameters
    const method = METHODS[options.method] || CalculationMethod.MuslimWorldLeague;
    const params = method();
    params.madhab = MADHABS[options.madhab] || Madhab.Shafi;
    params.highLatitudeRule = HighLatitudeRule.recommended(coordinates);

    // Calculate prayer times
    const prayerTimes = new PrayerTimes(coordinates, dateObj, params);

    // Get Sunnah times for additional calculations
    const sunnahTimes = new SunnahTimes(prayerTimes);

    // Calculate forbidden periods
    const sunriseEnd = addMinutes(prayerTimes.sunrise, 15);
    const zawalStart = subtractMinutes(prayerTimes.dhuhr, 10);
    const sunsetStart = subtractMinutes(prayerTimes.maghrib, 15);

    // Calculate Sunnah time RANGES
    // Ishraq: 15 min after sunrise until ~45 min after sunrise
    const ishraqStart = addMinutes(prayerTimes.sunrise, 15);
    const ishraqEnd = addMinutes(prayerTimes.sunrise, 45);

    // Duha (Chasht): ~45 min after sunrise until ~20 min before Dhuhr
    const duhaStart = addMinutes(prayerTimes.sunrise, 45);
    const duhaEnd = subtractMinutes(prayerTimes.dhuhr, 20);

    // Awwabin: After Maghrib until Isha
    const awwabinStart = addMinutes(prayerTimes.maghrib, 10);
    const awwabinEnd = prayerTimes.isha;

    // Tahajjud: Last third of night until Fajr
    const tahajjudStart = sunnahTimes.lastThirdOfTheNight;
    const tahajjudEnd = prayerTimes.fajr;

    return {
        // Main prayer times
        fajr: formatTime(prayerTimes.fajr),
        sunrise: formatTime(prayerTimes.sunrise),
        dhuhr: formatTime(prayerTimes.dhuhr),
        asr: formatTime(prayerTimes.asr),
        maghrib: formatTime(prayerTimes.maghrib),
        isha: formatTime(prayerTimes.isha),

        // Sunnah prayer time RANGES
        sunnah: {
            ishraq: { start: formatTime(ishraqStart), end: formatTime(ishraqEnd) },
            duha: { start: formatTime(duhaStart), end: formatTime(duhaEnd) },
            awwabin: { start: formatTime(awwabinStart), end: formatTime(awwabinEnd) },
            tahajjud: { start: formatTime(tahajjudStart), end: formatTime(tahajjudEnd) },
        },

        // Additional times (legacy, kept for backward compatibility)
        midnight: formatTime(sunnahTimes.middleOfTheNight),
        lastThird: formatTime(sunnahTimes.lastThirdOfTheNight),


        // Forbidden periods
        forbidden: {
            sunrise: {
                start: formatTime(prayerTimes.sunrise),
                end: formatTime(sunriseEnd)
            },
            zawal: {
                start: formatTime(zawalStart),
                end: formatTime(prayerTimes.dhuhr)
            },
            sunset: {
                start: formatTime(sunsetStart),
                end: formatTime(prayerTimes.maghrib)
            }
        },

        // Current prayer (useful for highlighting)
        currentPrayer: prayerTimes.currentPrayer(),
        nextPrayer: prayerTimes.nextPrayer()
    };
};

/**
 * Get Qibla direction from North
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {number} Degree from North (0-360)
 */
export const getQiblaDirection = (latitude, longitude) => {
    const coordinates = new Coordinates(latitude, longitude);
    return Qibla(coordinates);
};

/**
 * Get available calculation methods
 * @returns {string[]} List of available method names
 */
export const getAvailableMethods = () => Object.keys(METHODS);

/**
 * Get available madhabs
 * @returns {string[]} List of available madhab names
 */
export const getAvailableMadhabs = () => Object.keys(MADHABS);

export default {
    getPrayerTimes,
    getAvailableMethods,
    getAvailableMadhabs,
    getQiblaDirection
};
