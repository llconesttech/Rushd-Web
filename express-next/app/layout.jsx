'use client';

import { SettingsProvider } from '@/context/SettingsContext';
import { LocationProvider } from '@/context/LocationContext';
import '@/styles/globals.css';
import '@/styles/app.css';

export default function RootLayout({ children }) {
    return (
        <html lang="en" data-theme="dark">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="robots" content="noindex, nofollow" />
                <title>Rushd — Islamic Companion</title>
                <meta name="description" content="Comprehensive Islamic companion app with Quran, Hadith, prayer times, and more." />
            </head>
            <body>
                <SettingsProvider>
                    <LocationProvider>
                        {children}
                    </LocationProvider>
                </SettingsProvider>
            </body>
        </html>
    );
}
