/* eslint-disable */
import { useState, useRef, useEffect } from 'react';
import PageHeader from './PageHeader';
import { RotateCcw, ChevronUp, Volume2, VolumeX } from 'lucide-react';
import './TasbihCounter.css';

const TASBIH_PRESETS = [
    { name: 'SubhanAllah', arabic: 'سُبْحَانَ الله', target: 33 },
    { name: 'Alhamdulillah', arabic: 'الحَمْدُ لله', target: 33 },
    { name: 'Allahu Akbar', arabic: 'الله أَكْبَر', target: 33 },
    { name: 'La ilaha illallah', arabic: 'لَا إِلَٰهَ إِلَّا الله', target: 100 },
    { name: 'Astaghfirullah', arabic: 'أَسْتَغْفِرُ الله', target: 100 },
    { name: 'Custom', arabic: '', target: 99 },
];

const TasbihCounter = () => {
    const [count, setCount] = useState(0);
    const [selectedPreset, setSelectedPreset] = useState(TASBIH_PRESETS[0]);
    const [customTarget, setCustomTarget] = useState(99);
    const [hapticEnabled] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(false);

    // Touch handling for swipe
    const touchStartY = useRef(null);
    const containerRef = useRef(null);

    // Haptic feedback (vibration)
    const triggerHaptic = () => {
        if (hapticEnabled && navigator.vibrate) {
            navigator.vibrate(30);
        }
    };

    // Click sound (optional)
    const playClickSound = () => {
        if (soundEnabled) {
            // Simple beep using Web Audio API
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.frequency.value = 800;
            gainNode.gain.value = 0.1;
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.05);
        }
    };

    const increment = () => {
        setCount(prev => prev + 1);
        triggerHaptic();
        playClickSound();
    };

    const reset = () => {
        setCount(0);
        if (hapticEnabled && navigator.vibrate) {
            navigator.vibrate([50, 30, 50]); // Double vibration for reset
        }
    };

    // Swipe up gesture
    const handleTouchStart = (e) => {
        touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
        if (touchStartY.current === null) return;

        const touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY.current - touchEndY;

        // Swipe up detected (minimum 50px)
        if (diff > 50) {
            increment();
        }

        touchStartY.current = null;
    };

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'Space' || e.code === 'Enter') {
                e.preventDefault();
                increment();
            } else if (e.code === 'Escape' || e.code === 'KeyR') {
                reset();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [hapticEnabled, soundEnabled, increment, reset]);

    const target = selectedPreset.name === 'Custom' ? customTarget : selectedPreset.target;
    const progress = Math.min((count / target) * 100, 100);
    const isComplete = count >= target;

    return (
        <div className="container">
            <PageHeader
                title="Tasbih Counter"
                subtitle="Digital dhikr counter with gesture support"
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Tasbih', path: '/tasbih' }
                ]}
            />

            <div className="tasbih-container">
                {/* Preset Selector */}
                <div className="preset-selector">
                    {TASBIH_PRESETS.map((preset) => (
                        <button
                            key={preset.name}
                            className={`preset-btn ${selectedPreset.name === preset.name ? 'active' : ''}`}
                            onClick={() => {
                                setSelectedPreset(preset);
                                setCount(0);
                            }}
                        >
                            {preset.name}
                        </button>
                    ))}
                </div>

                {/* Custom Target Input */}
                {selectedPreset.name === 'Custom' && (
                    <div className="custom-target-input">
                        <label>Target:</label>
                        <input
                            type="number"
                            value={customTarget}
                            onChange={(e) => setCustomTarget(Math.max(1, parseInt(e.target.value) || 1))}
                            min="1"
                        />
                    </div>
                )}

                {/* Arabic Text Display */}
                {selectedPreset.arabic && (
                    <div className="arabic-display">
                        {selectedPreset.arabic}
                    </div>
                )}

                {/* Main Counter Area */}
                <div
                    ref={containerRef}
                    className={`counter-area ${isComplete ? 'complete' : ''}`}
                    onClick={increment}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Progress Ring */}
                    <svg className="progress-ring" viewBox="0 0 200 200">
                        <circle
                            className="progress-ring-bg"
                            cx="100"
                            cy="100"
                            r="90"
                        />
                        <circle
                            className="progress-ring-fill"
                            cx="100"
                            cy="100"
                            r="90"
                            style={{
                                strokeDasharray: `${2 * Math.PI * 90}`,
                                strokeDashoffset: `${2 * Math.PI * 90 * (1 - progress / 100)}`
                            }}
                        />
                    </svg>

                    {/* Count Display */}
                    <div className="count-display">
                        <span className="count-number">{count}</span>
                        <span className="count-target">/ {target}</span>
                    </div>

                    {/* Swipe Hint */}
                    <div className="swipe-hint">
                        <ChevronUp size={20} />
                        <span>Tap or Swipe Up</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="tasbih-controls">
                    <button className="control-btn reset-btn" onClick={reset}>
                        <RotateCcw size={20} />
                        Reset
                    </button>

                    <button
                        className={`control-btn toggle-btn ${soundEnabled ? 'active' : ''}`}
                        onClick={() => setSoundEnabled(!soundEnabled)}
                    >
                        {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                        Sound
                    </button>
                </div>

                {/* Completion Message */}
                {isComplete && (
                    <div className="completion-message">
                        ✨ Alhamdulillah! Target reached! ✨
                    </div>
                )}

                {/* Instructions */}
                <div className="tasbih-instructions">
                    <p><strong>Tip:</strong> Tap the circle, swipe up, or press <kbd>Space</kbd> to count</p>
                </div>
            </div>
        </div>
    );
};

export default TasbihCounter;

