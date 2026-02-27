// src/utils/lunarPhase.js
// Conway's algorithm for lunar phase calculation (globally recognized)
// Returns an object { phaseName, phaseIndex, illumination }
// phaseIndex: 0 = New Moon, 1 = Waxing Crescent, 2 = First Quarter, 3 = Waxing Gibbous,
// 4 = Full Moon, 5 = Waning Gibbous, 6 = Last Quarter, 7 = Waning Crescent

export function calculateLunarPhase(date = new Date(), latitude = 0, longitude = 0) {
    // Convert to UTC
    const utc = Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds()
    );

    // Days since known new moon (2000 Jan 6 18:14 UTC)
    const knownNewMoon = Date.UTC(2000, 0, 6, 18, 14, 0);
    const daysSince = (utc - knownNewMoon) / 86400000; // ms per day

    // Synodic month length
    const synodic = 29.53058867;
    const lunations = daysSince / synodic;
    const phase = lunations - Math.floor(lunations);
    const phaseIndex = Math.round(phase * 8) % 8;

    const phaseNames = [
        'New Moon',
        'Waxing Crescent',
        'First Quarter',
        'Waxing Gibbous',
        'Full Moon',
        'Waning Gibbous',
        'Last Quarter',
        'Waning Crescent'
    ];

    // Approximate illumination percentage
    const illumination = (1 - Math.cos(2 * Math.PI * phase)) / 2;

    return {
        phaseName: phaseNames[phaseIndex],
        phaseIndex,
        illumination: Math.round(illumination * 100)
    };
}
