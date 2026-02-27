import React from 'react';

export default function MoonPhaseCard({ phase }) {
    if (!phase) return null;
    const iconMap = {
        'New Moon': '/images/moon_phase_new_moon.png',
        'Waxing Crescent': '/images/moon_phase_waxing_crescent.png',
        'First Quarter': '/images/moon_phase_first_quarter.png',
    };
    const iconSrc = iconMap[phase.phaseName] || '/images/moon_phase_new_moon.png';

    return (
        <div className="flex flex-col sm:flex-row items-center sm:items-start p-6 border-2 border-red-600 dark:border-red-800 rounded-2xl bg-gradient-to-br from-red-50 to-white dark:from-gray-800 dark:to-gray-900 shadow-sm relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-red-100 dark:bg-red-900/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

            <div className="bg-white dark:bg-gray-700 p-4 rounded-full shadow-md z-10 sm:mr-6 mb-4 sm:mb-0">
                <img src={iconSrc} alt={phase.phaseName} className="w-24 h-24 object-contain" />
            </div>

            <div className="flex flex-col justify-center h-full w-full z-10 text-center sm:text-left pt-2">
                <h3 className="text-sm uppercase tracking-widest text-red-600 dark:text-red-400 font-bold mb-1">Today's Moon</h3>
                <p className="text-3xl font-black text-gray-900 dark:text-white mb-2">{phase.phaseName}</p>

                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mt-4 overflow-hidden relative">
                    <div
                        className="bg-red-600 dark:bg-red-500 h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${phase.illumination}%` }}
                    ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium w-full">
                    <span>0%</span>
                    <span>Illumination: {phase.illumination}%</span>
                    <span>100%</span>
                </div>
            </div>
        </div>
    );
}
