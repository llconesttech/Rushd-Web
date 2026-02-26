/**
 * Multi-Calendar Date Service
 * 
 * Provides date conversion utilities for:
 * - Gregorian (International)
 * - Hijri (Islamic)  
 * - Bengali (Bangla)
 * 
 * Future: Add more regional calendars
 */

// Bengali month names
const BENGALI_MONTHS = [
    'Boishakh', 'Jyoishtho', 'Asharh', 'Srabon',
    'Bhadro', 'Ashwin', 'Kartik', 'Ogrohayon',
    'Poush', 'Magh', 'Falgun', 'Choitro'
];

// Bengali month names in Bengali script
const BENGALI_MONTHS_NATIVE = [
    'বৈশাখ', 'জ্যৈষ্ঠ', 'আষাঢ়', 'শ্রাবণ',
    'ভাদ্র', 'আশ্বিন', 'কার্তিক', 'অগ্রহায়ণ',
    'পৌষ', 'মাঘ', 'ফাল্গুন', 'চৈত্র'
];

// Bengali numerals
const BENGALI_NUMERALS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

// Hijri month names
const HIJRI_MONTHS = [
    'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
    'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Shaban',
    'Ramadan', 'Shawwal', 'Dhul Qadah', 'Dhul Hijjah'
];

// Hijri month names in Arabic
const HIJRI_MONTHS_ARABIC = [
    'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني',
    'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان',
    'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
];

// Gregorian month names
const GREGORIAN_MONTHS = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
];

// Day names
const DAY_NAMES = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday',
    'Thursday', 'Friday', 'Saturday'
];

const DAY_NAMES_BENGALI = [
    'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার',
    'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'
];

const DAY_NAMES_ARABIC = [
    'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء',
    'الخميس', 'الجمعة', 'السبت'
];

/**
 * Convert number to Bengali numerals
 */
export const toBengaliNumeral = (num) => {
    return String(num).split('').map(digit => {
        const n = parseInt(digit);
        return isNaN(n) ? digit : BENGALI_NUMERALS[n];
    }).join('');
};

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

    return {
        year,
        month,
        day,
        monthName: HIJRI_MONTHS[month - 1],
        monthNameArabic: HIJRI_MONTHS_ARABIC[month - 1],
        formatted: `${day} ${HIJRI_MONTHS[month - 1]} ${year} AH`,
        formattedArabic: `${day} ${HIJRI_MONTHS_ARABIC[month - 1]} ${year}`
    };
};

/**
 * Convert Gregorian date to Bengali calendar
 * Bengali calendar starts from April 14 (or 15 in leap years)
 */
export const gregorianToBengali = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth(); // 0-11
    const day = date.getDate();

    // Bengali New Year starts on April 14 (or 15 in leap years)
    // The Bengali year is Gregorian year - 593 (or 594 before April 14)

    // Days in each Bengali month (approximate - varies slightly)
    const bengaliMonthDays = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30];

    // Determine if we're before or after Bengali New Year (April 14)
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    const bengaliNewYearDay = isLeapYear ? 14 : 14; // April 14

    // Calculate Bengali year
    let bengaliYear;
    let bengaliMonth;
    let bengaliDay;

    // Days from start of Gregorian year to each month start
    const gregorianMonthStarts = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    if (isLeapYear) {
        for (let i = 2; i < 12; i++) gregorianMonthStarts[i]++;
    }

    // Day of year (1-365/366)
    const dayOfYear = gregorianMonthStarts[month] + day;

    // Bengali New Year day of year (April 14)
    const bengaliNewYearDayOfYear = gregorianMonthStarts[3] + bengaliNewYearDay; // April = month 3

    if (dayOfYear < bengaliNewYearDayOfYear) {
        // Before Bengali New Year - previous Bengali year
        bengaliYear = year - 594;

        // Calculate which month we're in
        // Working backwards from Chaitra (last month)
        let daysFromNewYear = bengaliNewYearDayOfYear - dayOfYear;

        // Start from Chaitra (month 12) and work backwards
        bengaliMonth = 11; // Chaitra (0-indexed)
        let accumulatedDays = 0;

        for (let i = 11; i >= 0; i--) {
            accumulatedDays += bengaliMonthDays[i];
            if (daysFromNewYear <= accumulatedDays) {
                bengaliMonth = i;
                // Calculate day within this month
                const daysInPreviousMonths = accumulatedDays - bengaliMonthDays[i];
                bengaliDay = bengaliMonthDays[i] - (daysFromNewYear - daysInPreviousMonths) + 1;
                break;
            }
        }
    } else {
        // On or after Bengali New Year - current Bengali year
        bengaliYear = year - 593;

        // Days since Bengali New Year
        const daysSinceNewYear = dayOfYear - bengaliNewYearDayOfYear;

        // Calculate which month
        let accumulatedDays = 0;
        bengaliMonth = 0;

        for (let i = 0; i < 12; i++) {
            if (daysSinceNewYear < accumulatedDays + bengaliMonthDays[i]) {
                bengaliMonth = i;
                bengaliDay = daysSinceNewYear - accumulatedDays + 1;
                break;
            }
            accumulatedDays += bengaliMonthDays[i];
        }
    }

    return {
        year: bengaliYear,
        month: bengaliMonth + 1, // 1-indexed
        day: bengaliDay,
        monthName: BENGALI_MONTHS[bengaliMonth],
        monthNameNative: BENGALI_MONTHS_NATIVE[bengaliMonth],
        formatted: `${bengaliDay} ${BENGALI_MONTHS[bengaliMonth]} ${bengaliYear} BS`,
        formattedNative: `${toBengaliNumeral(bengaliDay)} ${BENGALI_MONTHS_NATIVE[bengaliMonth]} ${toBengaliNumeral(bengaliYear)}`
    };
};

/**
 * Get today's date in all calendar formats
 */
export const getTodayAllCalendars = (date = new Date()) => {
    const gregorian = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        monthName: GREGORIAN_MONTHS[date.getMonth()],
        dayName: DAY_NAMES[date.getDay()],
        dayNameBengali: DAY_NAMES_BENGALI[date.getDay()],
        dayNameArabic: DAY_NAMES_ARABIC[date.getDay()],
        formatted: date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    };

    const hijri = gregorianToHijri(date);
    const bengali = gregorianToBengali(date);

    return {
        gregorian,
        hijri,
        bengali,
        timestamp: date.getTime()
    };
};

/**
 * Get month names for a specific calendar
 */
export const getMonthNames = (calendar = 'gregorian') => {
    switch (calendar) {
        case 'hijri':
            return HIJRI_MONTHS;
        case 'bengali':
            return BENGALI_MONTHS;
        default:
            return GREGORIAN_MONTHS;
    }
};

export { HIJRI_MONTHS, BENGALI_MONTHS, GREGORIAN_MONTHS, DAY_NAMES };
