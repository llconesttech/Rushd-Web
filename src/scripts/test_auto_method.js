
/* global process */
import { getAutoCalculationMethod, PRAYER_CALCULATION_METHODS } from './services/prayerTimesService.js';

// Test cases with known coordinates
const testCases = [
    { city: 'London, UK', lat: 51.5074, lng: -0.1278, expectedKeywords: ['London', 'Europe'] },
    { city: 'New York, USA', lat: 40.7128, lng: -74.0060, expectedKeywords: ['NorthAmerica'] },
    { city: 'Mecca, SA', lat: 21.4225, lng: 39.8262, expectedKeywords: ['UmmAlQura', 'Mecca'] },
    { city: 'Karachi, PK', lat: 24.8607, lng: 67.0011, expectedKeywords: ['Karachi'] },
    { city: 'Cairo, EG', lat: 30.0444, lng: 31.2357, expectedKeywords: ['Egyptian'] },
    { city: 'Jakarta, ID', lat: -6.2088, lng: 106.8456, expectedKeywords: ['MuslimWorldLeague', 'Singapore'] }, // MWL is often default for SEA if specific not found
    { city: 'Sydney, AU', lat: -33.8688, lng: 151.2093, expectedKeywords: ['MuslimWorldLeague', 'Sydney'] }, // MWL is often default
    { city: 'Tehran, IR', lat: 35.6892, lng: 51.3890, expectedKeywords: ['Tehran'] },
    { city: 'Kuala Lumpur, MY', lat: 3.1390, lng: 101.6869, expectedKeywords: ['Malaysia', 'Singapore', 'MuslimWorldLeague'] },
    { city: 'Istanbul, TR', lat: 41.0082, lng: 28.9784, expectedKeywords: ['Turkey', 'MuslimWorldLeague'] }
];

console.log("Testing Auto Calculation Method Detection...\n");

let passed = 0;

testCases.forEach((tc) => {
    const methodId = getAutoCalculationMethod(tc.lat, tc.lng);
    const methodInfo = PRAYER_CALCULATION_METHODS.find(m => m.id === methodId);

    // Check if the detected method ID or name matches any expected keywords
    const isMatch = tc.expectedKeywords.some(kw =>
        methodId.toLowerCase().includes(kw.toLowerCase()) ||
        (methodInfo && methodInfo.name.toLowerCase().includes(kw.toLowerCase()))
    );

    if (isMatch) {
        console.log(`✅ ${tc.city} -> Detected: ${methodInfo ? methodInfo.name : methodId}`);
        passed++;
    } else {
        console.log(`❌ ${tc.city} -> Detected: ${methodInfo ? methodInfo.name : methodId} (Expected one of: ${tc.expectedKeywords.join(', ')})`);
    }
});

console.log(`\nResults: ${passed}/${testCases.length} tests passed.`);

if (typeof process !== 'undefined') {
    if (passed < testCases.length) {
        process.exit(1);
    } else {
        process.exit(0);
    }
}
