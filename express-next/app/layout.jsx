'use client';

import { Inter } from 'next/font/google';
import { SettingsProvider } from '@/context/SettingsContext';
import { LocationProvider } from '@/context/LocationContext';
import '@/styles/globals.css';
import '@/styles/app.css';

const inter = Inter({ 
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning className={inter.variable}>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="robots" content="noindex, nofollow" />
                <title>Rushd — Islamic Companion</title>
                <meta name="description" content="Comprehensive Islamic companion app with Quran, Hadith, prayer times, and more." />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function() {
                                try {
                                    var theme = localStorage.getItem('rushdTheme') || 'dark';
                                } catch (e) {
                                    var theme = 'dark';
                                }
                                document.documentElement.setAttribute('data-theme', theme);
                            })();
                        `,
                    }}
                />
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
