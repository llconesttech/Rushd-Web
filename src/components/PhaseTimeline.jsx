import React from 'react';

export default function PhaseTimeline({ phases }) {
    if (!phases || phases.length === 0) return null;
    return (
        <div className="flex flex-col space-y-3">
            {phases.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700 transition-colors">
                    <div className="flex items-center space-x-4">
                        <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-full">
                            <img src={p.icon} alt={p.phaseName} className="w-8 h-8 object-contain" />
                        </div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{p.phaseName}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">{p.date}</p>
                </div>
            ))}
        </div>
    );
}
