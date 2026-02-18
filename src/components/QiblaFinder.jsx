import React, { useState, useEffect } from 'react';
import { getQiblaDirection } from '../services/prayerTimesService';
import PageHeader from './PageHeader';
import { Compass, RefreshCw, Navigation } from 'lucide-react';
import './QiblaFinder.css';

const QiblaFinder = () => {
    const [qiblaAngle, setQiblaAngle] = useState(0);
    const [compassHeading, setCompassHeading] = useState(0);
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [isCompassAvailable, setIsCompassAvailable] = useState(false);

    // 1. Get Location & Calculate Qibla Angle
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude });
                    const angle = getQiblaDirection(latitude, longitude);
                    setQiblaAngle(angle);
                },
                (err) => {
                    console.error("Location error:", err);
                    setError("Enable location services to find Qibla direction.");
                    // Fallback to Dhaka (default)
                    const angle = getQiblaDirection(23.8103, 90.4125);
                    setQiblaAngle(angle);
                }
            );
        } else {
            setError("Geolocation is not supported by your browser.");
        }
    }, []);

    // 2. Handle Device Orientation (Compass)
    useEffect(() => {
        const handleOrientation = (event) => {
            // alpha: rotation around z-axis (compass direction)
            // webkitCompassHeading: iOS standard
            let heading = 0;
            if (event.webkitCompassHeading) {
                heading = event.webkitCompassHeading;
                setIsCompassAvailable(true);
            } else if (event.alpha !== null) {
                // Android/Non-iOS
                // Note: 'alpha' is relative to device start orientation, not absolute North, 
                // UNLESS 'absolute' property is true. Modern browsers handle this differently.
                // For simplified web implementation without complex absolute orientation logic:
                heading = 360 - event.alpha;
                setIsCompassAvailable(true);
            }

            setCompassHeading(heading);
        };

        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', handleOrientation, true);
        }

        return () => {
            window.removeEventListener('deviceorientation', handleOrientation, true);
        };
    }, []);

    const requestCompassPermission = async () => {
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            try {
                const response = await DeviceOrientationEvent.requestPermission();
                if (response === 'granted') {
                    setError(null);
                } else {
                    setError("Compass permission denied.");
                }
            } catch (e) {
                console.error(e);
            }
        }
    };

    // Calculate needle rotation
    // We rotate the compass "disk" opposite to device heading so North stays North visually
    // OR we rotate the needle. Let's rotate the NEEDLE to point to Qibla relative to North.
    // If phone points North (0°), Qibla is at `qiblaAngle`.
    // If phone rotates X°, Qibla should be at `qiblaAngle - X°`.
    const needleRotation = isCompassAvailable
        ? qiblaAngle - compassHeading
        : qiblaAngle; // Static if no compass

    // Human-readable direction from bearing
    const getCardinalLabel = (angle) => {
        const a = ((angle % 360) + 360) % 360;
        const dirs = [
            { label: 'North', min: 348.75, max: 360 },
            { label: 'North', min: 0, max: 11.25 },
            { label: 'North-Northeast', min: 11.25, max: 33.75 },
            { label: 'Northeast', min: 33.75, max: 56.25 },
            { label: 'East-Northeast', min: 56.25, max: 78.75 },
            { label: 'East', min: 78.75, max: 101.25 },
            { label: 'East-Southeast', min: 101.25, max: 123.75 },
            { label: 'Southeast', min: 123.75, max: 146.25 },
            { label: 'South-Southeast', min: 146.25, max: 168.75 },
            { label: 'South', min: 168.75, max: 191.25 },
            { label: 'South-Southwest', min: 191.25, max: 213.75 },
            { label: 'Southwest', min: 213.75, max: 236.25 },
            { label: 'West-Southwest', min: 236.25, max: 258.75 },
            { label: 'West', min: 258.75, max: 281.25 },
            { label: 'West-Northwest', min: 281.25, max: 303.75 },
            { label: 'Northwest', min: 303.75, max: 326.25 },
            { label: 'North-Northwest', min: 326.25, max: 348.75 },
        ];
        const match = dirs.find(d => a >= d.min && a < d.max);
        return match ? match.label : 'North';
    };

    const qiblaCardinal = getCardinalLabel(qiblaAngle);

    return (
        <div className="container">
            <PageHeader
                title="Qibla Finder"
                subtitle="Locate the direction of the Kaaba"
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Qibla', path: '/qibla' }
                ]}
            />

            <div className="qibla-container">
                {error && <div className="permission-warning">{error}</div>}

                <div className="compass-wrapper">
                    <div className="compass-nav" style={{
                        transform: isCompassAvailable ? `rotate(${-compassHeading}deg)` : 'none'
                    }}>
                        <span className="cardinal-point point-n">N</span>
                        <span className="cardinal-point point-e">E</span>
                        <span className="cardinal-point point-s">S</span>
                        <span className="cardinal-point point-w">W</span>
                    </div>

                    <div className="needle-container" style={{
                        transform: 'none'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: 0, left: 0, width: '100%', height: '100%',
                            transition: 'transform 0.1s linear',
                            transform: `rotate(${needleRotation}deg)`
                        }}>
                            <div className="needle-kaaba">
                                <div className="kaaba-icon">🕋</div>
                                <div className="needle-pointer"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Human-readable direction label */}
                <div className="qibla-direction-label">
                    <Navigation size={18} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                    <span>Qibla is on <strong>{qiblaCardinal}</strong> from your location.</span>
                </div>

                <div className="qibla-info">
                    <h3>Qibla Direction</h3>
                    <div className="qibla-angle">{Math.round(qiblaAngle)}° from North</div>
                    <p className="qibla-location">
                        {location ? `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}` : 'Calculated for default location'}
                    </p>

                    {!isCompassAvailable && typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function' && (
                        <button onClick={requestCompassPermission} className="calibrate-btn">
                            <Compass size={18} /> Enable Compass
                        </button>
                    )}

                    {isCompassAvailable && (
                        <div style={{ marginTop: '1rem', color: 'green', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <Navigation size={16} /> Compass Active
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QiblaFinder;
