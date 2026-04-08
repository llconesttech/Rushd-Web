/* eslint-disable */
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Mic, Repeat, ChevronDown } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { reciters } from '../data/quranData';
import audioService from '../services/audioService';
import './AudioPlayer.css';

const AudioPlayer = ({ surahNumber, totalAyahs }) => {
    const { selectedReciter, setSelectedReciter, setAudioPlayback, audioCommand, setAudioCommand } = useSettings();
    const audioRef = useRef(null);
    const shouldResumePlaybackRef = useRef(false);
    const isPlayingRef = useRef(false);
    const switchingTrackRef = useRef(false);
    const [currentAyah, setCurrentAyah] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasStartedPlayback, setHasStartedPlayback] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [showReciterMenu, setShowReciterMenu] = useState(false);
    const [isAutoPlay, setIsAutoPlay] = useState(true);
    const [audioError, setAudioError] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const localUrl = audioService.getLocalUrl(selectedReciter, surahNumber, currentAyah);
    const remoteUrl = audioService.getRemoteUrl(selectedReciter, surahNumber, currentAyah);
    
    const currentSrc = localUrl || remoteUrl;

    const stableSrcRef = useRef(remoteUrl);
    useEffect(() => {
        if (stableSrcRef.current !== remoteUrl) {
            stableSrcRef.current = remoteUrl;
        }
    }, [remoteUrl]);

    useEffect(() => {
        isPlayingRef.current = isPlaying;
    }, [isPlaying]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (audio.src !== stableSrcRef.current) {
            audio.src = stableSrcRef.current;
        }
        
        switchingTrackRef.current = true;
        audio.load();
        
        const tryPlay = shouldResumePlaybackRef.current || isPlayingRef.current;
        shouldResumePlaybackRef.current = false;

        if (!tryPlay) {
            switchingTrackRef.current = false;
            return;
        }

        audio.play().then(() => {
            switchingTrackRef.current = false;
        }).catch(() => {
            switchingTrackRef.current = false;
            setAudioError('Click play to start');
            setIsPlaying(false);
        });
    }, [currentAyah]);

    useEffect(() => {
        setCurrentAyah(1);
        setIsPlaying(false);
        shouldResumePlaybackRef.current = false;
        setHasStartedPlayback(false);
    }, [surahNumber]);

    useEffect(() => {
        if (!hasStartedPlayback) {
            setAudioPlayback(null);
            return;
        }
        setAudioPlayback({ surahNumber, ayahInSurah: currentAyah, isPlaying, hasStarted: true });
    }, [surahNumber, currentAyah, isPlaying, hasStartedPlayback, setAudioPlayback]);

    useEffect(() => {
        return () => setAudioPlayback(null);
    }, [setAudioPlayback]);

    useEffect(() => {
        if (!audioCommand) return;
        if (audioCommand.surahNumber !== surahNumber) return;

        const media = audioRef.current;

        const safePlay = () => {
            if (!media) return;
            setAudioError(null);
            shouldResumePlaybackRef.current = true;
            switchingTrackRef.current = true;
            media.play().then(() => {
                switchingTrackRef.current = false;
            }).catch(() => {
                switchingTrackRef.current = false;
                setAudioError('Click play to start');
                setIsPlaying(false);
            });
        };

        const safePause = () => {
            if (!media) return;
            media.pause();
        };

        if (audioCommand.type === 'pause') {
            safePause();
            setAudioCommand(null);
            return;
        }

        if (audioCommand.type === 'toggle_ayah') {
            if (audioCommand.ayahInSurah === currentAyah) {
                if (media?.paused) safePlay();
                else safePause();
            } else {
                shouldResumePlaybackRef.current = true;
                setCurrentAyah(audioCommand.ayahInSurah);
            }
            setAudioCommand(null);
            return;
        }

        if (audioCommand.type === 'play_ayah') {
            setAudioError(null);
            shouldResumePlaybackRef.current = true;
            if (audioCommand.ayahInSurah === currentAyah) {
                safePlay();
            } else {
                setCurrentAyah(audioCommand.ayahInSurah);
            }
            setAudioCommand(null);
            return;
        }

        setAudioCommand(null);
    }, [audioCommand, surahNumber, currentAyah, setAudioCommand]);

    const handleTimeUpdate = () => {
        if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
            setAudioError(null);
        }
    };

    const stateRef = useRef({ isAutoPlay, currentAyah, totalAyahs, isPlaying });
    useEffect(() => {
        stateRef.current = { isAutoPlay, currentAyah, totalAyahs, isPlaying };
    }, [isAutoPlay, currentAyah, totalAyahs, isPlaying]);

    const handleEnded = () => {
        const state = stateRef.current;
        if (state.isAutoPlay && state.currentAyah < state.totalAyahs) {
            shouldResumePlaybackRef.current = true;
            setCurrentAyah((prev) => prev + 1);
        } else {
            setIsPlaying(false);
        }
    };

    const handleError = () => {
        setAudioError('Audio unavailable for this reciter/ayah');
        setIsPlaying(false);
    };

    const handlePause = () => {
        if (switchingTrackRef.current) return;
        const el = audioRef.current;
        const st = stateRef.current;
        if (el?.ended && st.isAutoPlay && st.currentAyah < st.totalAyahs) {
            return;
        }
        setIsPlaying(false);
    };

    const togglePlay = () => {
        const media = audioRef.current;
        if (!media) return;
        if (media.paused) {
            setAudioError(null);
            media.play().catch(() => {
                setAudioError('Unable to play audio');
            });
        } else {
            media.pause();
        }
    };

    const handlePrevious = () => {
        if (currentAyah > 1) {
            shouldResumePlaybackRef.current = true;
            setCurrentAyah((prev) => prev - 1);
        }
    };

    const handleNext = () => {
        if (currentAyah < totalAyahs) {
            shouldResumePlaybackRef.current = true;
            setCurrentAyah((prev) => prev + 1);
        }
    };

    const formatTime = (time) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleSeek = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = x / rect.width;
        if (audioRef.current && duration) {
            audioRef.current.currentTime = percentage * duration;
        }
    };

    const currentReciter = reciters[selectedReciter];
    const progress = duration ? (currentTime / duration) * 100 : 0;

    return (
        <div className={`floating-player ${isExpanded ? 'expanded' : ''}`}>
            <audio
                ref={audioRef}
                src={currentSrc}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
                onPlay={() => {
                    switchingTrackRef.current = false;
                    setHasStartedPlayback(true);
                    setIsPlaying(true);
                }}
                onPause={handlePause}
                onError={handleError}
                preload="auto"
            />

            <div className="fp-progress-track" onClick={handleSeek}>
                <div className="fp-progress-fill" style={{ width: `${progress}%` }} />
            </div>

            <div className="fp-main">
                <button
                    className="fp-ayah-badge"
                    onClick={() => {
                        setIsExpanded((v) => {
                            const next = !v;
                            setShowReciterMenu(next);
                            return next;
                        });
                    }}
                    title="Show reciter options"
                >
                    <span className="fp-ayah-text">
                        {currentAyah}<span className="fp-ayah-divider">/</span>{totalAyahs}
                    </span>
                    <ChevronDown size={12} className={`fp-expand-icon ${isExpanded ? 'rotated' : ''}`} />
                </button>

                <button
                    className="fp-reciter-chip"
                    onClick={() => { setIsExpanded(true); setShowReciterMenu(true); }}
                    title="Change reciter"
                >
                    <Mic size={12} strokeWidth={2} />
                    <span className="fp-reciter-chip-name">
                        {currentReciter?.english_name?.split(' ').slice(0, 2).join(' ') || 'Reciter'}
                    </span>
                </button>

                <div className="fp-controls">
                    <button className="fp-btn" onClick={handlePrevious} disabled={currentAyah <= 1} aria-label="Previous Ayah">
                        <SkipBack size={16} strokeWidth={2} />
                    </button>
                    <button className="fp-btn fp-play" onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
                        {isPlaying
                            ? <Pause size={18} strokeWidth={2.5} />
                            : <Play size={18} fill="currentColor" strokeWidth={0} />
                        }
                    </button>
                    <button className="fp-btn" onClick={handleNext} disabled={currentAyah >= totalAyahs} aria-label="Next Ayah">
                        <SkipForward size={16} strokeWidth={2} />
                    </button>
                </div>

                <div className="fp-right">
                    <span className="fp-time">{formatTime(currentTime)}</span>
                    <button
                        className={`fp-btn fp-auto ${isAutoPlay ? 'active' : ''}`}
                        onClick={() => setIsAutoPlay(!isAutoPlay)}
                        title={isAutoPlay ? 'Auto-play ON' : 'Auto-play OFF'}
                        aria-label="Toggle auto-play"
                    >
                        <Repeat size={14} strokeWidth={2} />
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div className="fp-expanded-section">
                    <div className="fp-reciter-row">
                        <Mic size={14} />
                        <button
                            className="fp-reciter-trigger"
                            onClick={() => setShowReciterMenu(!showReciterMenu)}
                        >
                            {currentReciter?.english_name || 'Select Reciter'}
                            <ChevronDown size={12} className={showReciterMenu ? 'rotated' : ''} />
                        </button>
                    </div>

                    {showReciterMenu && (
                        <div className="fp-reciter-list">
                            {Object.entries(reciters).map(([key, reciter]) => (
                                <button
                                    key={key}
                                    className={`fp-reciter-option ${selectedReciter === key ? 'active' : ''}`}
                                    onClick={() => {
                                        setSelectedReciter(key);
                                        setShowReciterMenu(false);
                                        setIsExpanded(false);
                                        shouldResumePlaybackRef.current = false;
                                        setIsPlaying(false);
                                    }}
                                >
                                    {reciter.english_name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {audioError && (
                <div className="fp-error">{audioError}</div>
            )}
        </div>
    );
};

export default AudioPlayer;
