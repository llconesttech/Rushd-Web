import React, { useState } from 'react';

export default function ManualLocationInput({ onSubmit }) {
    const [manualLat, setManualLat] = useState('');
    const [manualLng, setManualLng] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const lat = parseFloat(manualLat);
        const lng = parseFloat(manualLng);
        if (!isNaN(lat) && !isNaN(lng)) {
            onSubmit(lat, lng);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-2 mt-4">
            <input
                type="number"
                step="any"
                placeholder="Latitude"
                value={manualLat}
                onChange={(e) => setManualLat(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded p-2 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <input
                type="number"
                step="any"
                placeholder="Longitude"
                value={manualLng}
                onChange={(e) => setManualLng(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded p-2 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition transform hover:scale-105 shadow hover:shadow-lg"
            >
                Calculate Phase
            </button>
        </form>
    );
}
