// src/hooks/useGeolocation.js
// Hook that requests browser geolocation and provides fallback handling
import { useState, useEffect } from 'react';

export function useGeolocation() {
    const [coords, setCoords] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation not supported');
            setLoading(false);
            return;
        }
        const onSuccess = (position) => {
            const { latitude, longitude } = position.coords;
            setCoords({ latitude, longitude });
            setLoading(false);
        };
        const onError = (err) => {
            setError(err.message);
            setLoading(false);
        };
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }, []);

    return { coords, error, loading };
}
