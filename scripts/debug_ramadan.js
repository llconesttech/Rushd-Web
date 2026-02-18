
const HIJRI_MONTHS = [
    'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
    'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Shaban',
    'Ramadan', 'Shawwal', 'Dhul Qadah', 'Dhul Hijjah'
];

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

    return { year, month, day, monthName: HIJRI_MONTHS[month - 1] };
};

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

const today = new Date('2026-02-18T12:00:00'); // User says today is 1st Ramadan 1447 (Feb 18, 2026)
console.log('Today:', today.toDateString());
const hToday = gregorianToHijri(today);
console.log('Hijri Today:', hToday);

const ramadanStart = hijriToGregorian(1447, 9, 1);
console.log('Calculated 1st Ramadan 1447:', ramadanStart.toDateString());

const dateOffset = 0;
ramadanStart.setDate(ramadanStart.getDate() + dateOffset);

const currentRamadanDay = Math.floor((today - ramadanStart) / (1000 * 60 * 60 * 24)) + 1;
console.log('Current Ramadan Day (Offset 0):', currentRamadanDay);
