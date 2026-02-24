/* eslint-disable */
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Mic, Repeat, ChevronDown } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { reciters } from '../data/quranData';
import audioService from '../services/audioService';
import './AudioPlayer.css';

const AudioPlayer = ({ surahNumber, totalAyahs }) => {
    const { selectedReciter, setSelectedReciter } = useSettings();
    const audioRef = useRef(null);
    const [currentAyah, setCurrentAyah] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [showReciterMenu, setShowReciterMenu] = useState(false);
    const [isAutoPlay, setIsAutoPlay] = useState(true);
    const [audioError, setAudioError] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const localUrl = audioService.getLocalUrl(selectedReciter, surahNumber, currentAyah);
    const remoteUrl = audioService.getRemoteUrl(selectedReciter, surahNumber, currentAyah);
    const [currentSrc, setCurrentSrc] = useState(localUrl);

    useEffect(() => {
        setCurrentSrc(localUrl);
        setAudioError(null);
    }, [localUrl]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.load();
            if (isPlaying) {
                audioRef.current.play().catch(e => {
                    console.log('Autoplay prevented:', e);
                    setAudioError('Click play to start');
                });
            }
        }
    }, [currentSrc]);

    useEffect(() => {
        setCurrentAyah(1);
        setIsPlaying(false);
    }, [surahNumber]);

    const handleTimeUpdate = () => {
        if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
            setAudioError(null);
        }
    };

    // Refs to ensure event handlers access latest state
    const stateRef = useRef({ isAutoPlay, currentAyah, totalAyahs, isPlaying });
    useEffect(() => {
        stateRef.current = { isAutoPlay, currentAyah, totalAyahs, isPlaying };
    }, [isAutoPlay, currentAyah, totalAyahs, isPlaying]);

    const handleEnded = () => {
        const state = stateRef.current;

        if (state.isAutoPlay && state.currentAyah < state.totalAyahs) {
            setIsPlaying(true); // Ensure playing plays next track
            setCurrentAyah(prev => prev + 1);
        } else {
            setIsPlaying(false);
        }
    };

    const handleError = (e) => {
        console.error('Audio error:', e);
        if (currentSrc === localUrl && localUrl !== remoteUrl) {
            console.log('Local audio not found, switching to remote:', remoteUrl);
            setCurrentSrc(remoteUrl);
            return;
        }
        setAudioError('Audio unavailable for this reciter/ayah');
        setIsPlaying(false);
    };

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                setAudioError(null);
                audioRef.current.play().catch(e => {
                    console.log('Play prevented:', e);
                    setAudioError('Unable to play audio');
                });
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handlePrevious = () => {
        if (currentAyah > 1) { setCurrentAyah(prev => prev - 1); setIsPlaying(true); }
    };

    const handleNext = () => {
        if (currentAyah < totalAyahs) { setCurrentAyah(prev => prev + 1); setIsPlaying(true); }
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
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onError={handleError}
                preload="auto"
            />

            {/* Progress bar (top edge of pill) */}
            <div className="fp-progress-track" onClick={handleSeek}>
                <div className="fp-progress-fill" style={{ width: `${progress}%` }} />
            </div>

            {/* Main controls row */}
            <div className="fp-main">
                {/* Left: Ayah info */}
                <button
                    className="fp-ayah-badge"
                    onClick={() => setIsExpanded(!isExpanded)}
                    title="Show reciter options"
                >
                    <span className="fp-ayah-text">
                        {currentAyah}<span className="fp-ayah-divider">/</span>{totalAyahs}
                    </span>
                    <ChevronDown size={12} className={`fp-expand-icon ${isExpanded ? 'rotated' : ''}`} />
                </button>

                {/* Desktop: Reciter name chip (visible on wider screens) */}
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

                {/* Center: Transport controls */}
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

                {/* Right: Time + Auto-play */}
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

            {/* Expandable section: reciter selector */}
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

