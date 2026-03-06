'use client';

import { SettingsProvider } from '@/context/SettingsContext';
import { LocationProvider } from '@/context/LocationContext';

export default function Providers({ children }) {
    return (
        <SettingsProvider>
            <LocationProvider>{children}</LocationProvider>
        </SettingsProvider>
    );
}

