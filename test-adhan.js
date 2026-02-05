
import {
    Coordinates,
    CalculationMethod,
    PrayerTimes,
    HighLatitudeRule,
    Qibla
} from 'adhan';

console.log('Qibla function:', Qibla);

const coordinates = new Coordinates(23.8103, 90.4125);
const qiblaDirection = Qibla(coordinates);
console.log('Qibla Direction for Dhaka:', qiblaDirection);
