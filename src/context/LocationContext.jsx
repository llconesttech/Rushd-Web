import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const useAppLocation = () => {
    const context = useContext(LocationContext);
    if (!context) {
        throw new Error('useAppLocation must be used within a LocationProvider');
    }
    return context;
};

export const LocationProvider = ({ children }) => {
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [coords, setCoords] = useState(null);

    // Default Fallback (Dhaka)
    const DEFAULT_LOCATION = {
        latitude: 23.8103,
        longitude: 90.4125,
        city: 'Dhaka',
        country: 'Bangladesh'
    };

    const getLocationName = async (lat, lng) => {
        try {
            // Fast approximation using Timezone
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const city = timezone.split('/')[1]?.replace(/_/g, ' ') || 'Unknown';
            return { city, country: '' };
        } catch (err) {
            console.error('Error getting location name:', err);
            return { city: 'Unknown', country: '' };
        }
    };

    const fetchLocation = () => {
        setLoading(true);
        setError(null);

        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser.');
            setLocation(DEFAULT_LOCATION);
            setCoords({ lat: DEFAULT_LOCATION.latitude, lng: DEFAULT_LOCATION.longitude });
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                // Get name (can be async if we use an API later, keeping it simple for now)
                const nameInfo = await getLocationName(latitude, longitude);

                const newLocation = {
                    latitude,
                    longitude,
                    ...nameInfo
                };

                setLocation(newLocation);
                setCoords({ lat: latitude, lng: longitude });
                setLoading(false);
            },
            (err) => {
                console.warn('Geolocation error:', err.message);
                setError('Unable to retrieve location. Using default.');
                setLocation(DEFAULT_LOCATION);
                setCoords({ lat: DEFAULT_LOCATION.latitude, lng: DEFAULT_LOCATION.longitude });
                setLoading(false);
            },
            {
                enableHighAccuracy: false, // Use false for faster results
                timeout: 10000,
                maximumAge: 3600000 // Cache for 1 hour
            }
        );
    };

    // Initial Fetch
    useEffect(() => {
        fetchLocation();
    }, []);

    // Refresh function exposed to components
    const refreshLocation = () => {
        fetchLocation();
    };

    const value = {
        location,
        coords, // { lat, lng } format for compatibility with existing code
        loading,
        error,
        refreshLocation
    };

    return (
        <LocationContext.Provider value={value}>
            {children}
        </LocationContext.Provider>
    );
};
