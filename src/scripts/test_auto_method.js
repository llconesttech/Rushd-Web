
import { getAutoCalculationMethod } from '../services/prayerTimesService.js';

// Test Cases
const testCases = [
    { name: 'Dubai', lat: 25.2048, lng: 55.2708, expected: 'Dubai' },
    { name: 'Karachi (Pakistan)', lat: 24.8607, lng: 67.0011, expected: 'Karachi' },
    { name: 'Dhaka (Bangladesh)', lat: 23.8103, lng: 90.4125, expected: 'Karachi' },
    { name: 'Mumbai (India)', lat: 19.0760, lng: 72.8777, expected: 'Karachi' },
    { name: 'London (UK)', lat: 51.5074, lng: -0.1278, expected: 'MoonsightingCommittee' },
    { name: 'New York (USA)', lat: 40.7128, lng: -74.0060, expected: 'MoonsightingCommittee' },
    { name: 'Riyadh (Saudi Arabia)', lat: 24.7136, lng: 46.6753, expected: 'UmmAlQura' },
    { name: 'Cairo (Egypt)', lat: 30.0444, lng: 31.2357, expected: 'Egyptian' },
    { name: 'Istanbul (Turkey)', lat: 41.0082, lng: 28.9784, expected: 'Turkey' },
    { name: 'Tehran (Iran)', lat: 35.6892, lng: 51.3890, expected: 'Tehran' },
    { name: 'Singapore', lat: 1.3521, lng: 103.8198, expected: 'Singapore' },
    { name: 'Kuwait City', lat: 29.3759, lng: 47.9774, expected: 'Kuwait' },
    { name: 'Doha (Qatar)', lat: 25.2854, lng: 51.5310, expected: 'Qatar' },
    { name: 'Berlin (Default)', lat: 52.5200, lng: 13.4050, expected: 'MuslimWorldLeague' }
];

console.log('--- Testing getAutoCalculationMethod ---');
let passed = 0;
testCases.forEach(tc => {
    const result = getAutoCalculationMethod(tc.lat, tc.lng);
    if (result === tc.expected) {
        console.log(`✅ ${tc.name}: Passed (Got ${result})`);
        passed++;
    } else {
        console.error(`❌ ${tc.name}: Failed (Expected ${tc.expected}, Got ${result})`);
    }
});

console.log(`\nResult: ${passed}/${testCases.length} passed.`);
if (passed === testCases.length) process.exit(0);
else process.exit(1);
