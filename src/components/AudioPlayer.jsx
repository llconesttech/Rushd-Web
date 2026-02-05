import React, { useState, useRef, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import { reciters } from '../data/quranData';
import { getAbsoluteAyahNumber } from '../hooks/useQuran';
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

    // Calculate absolute ayah number for the audio CDN
    const absoluteAyahNumber = getAbsoluteAyahNumber(surahNumber, currentAyah);
    const audioUrl = audioService.getUrl(selectedReciter, absoluteAyahNumber);

    useEffect(() => {
        if (audioRef.current) {
            setAudioError(null);
            audioRef.current.load();
            if (isPlaying) {
                audioRef.current.play().catch(e => {
                    console.log('Autoplay prevented:', e);
                    setAudioError('Click play to start');
                });
            }
        }
    }, [audioUrl]);

    // Reset to ayah 1 when surah changes
    useEffect(() => {
        setCurrentAyah(1);
        setIsPlaying(false);
    }, [surahNumber]);

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
            setAudioError(null);
        }
    };

    const handleEnded = () => {
        if (isAutoPlay && currentAyah < totalAyahs) {
            setCurrentAyah(prev => prev + 1);
        } else {
            setIsPlaying(false);
        }
    };

    const handleError = (e) => {
        console.error('Audio error:', e);
        // Special message for 404 or other network errors
        if (audioRef.current && audioRef.current.networkState === 3) { // NETWORK_NO_SOURCE
            setAudioError(`Audio file not found on server for this reciter at bitrate 128kbps.`);
        } else {
            setAudioError(`Audio unavailable for this reciter/ayah`);
        }
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
        if (currentAyah > 1) {
            setCurrentAyah(prev => prev - 1);
            setIsPlaying(true);
        }
    };

    const handleNext = () => {
        if (currentAyah < totalAyahs) {
            setCurrentAyah(prev => prev + 1);
            setIsPlaying(true);
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

    return (
        <div className="audio-player">
            <audio
                ref={audioRef}
                src={audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onError={handleError}
                preload="auto"
            />

            <div className="player-controls">
                {/* Reciter Selector */}
                <div className="reciter-selector">
                    <button
                        className="reciter-btn"
                        onClick={() => setShowReciterMenu(!showReciterMenu)}
                    >
                        🎙️ {currentReciter?.english_name || 'Select Reciter'}
                    </button>

                    {showReciterMenu && (
                        <div className="reciter-menu">
                            <div className="reciter-menu-header">Select Reciter</div>
                            {Object.entries(reciters).map(([key, reciter]) => (
                                <div
                                    key={key}
                                    className={`reciter-option ${selectedReciter === key ? 'active' : ''}`}
                                    onClick={() => {
                                        setSelectedReciter(key);
                                        setShowReciterMenu(false);
                                        setIsPlaying(false);
                                    }}
                                >
                                    {reciter.english_name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Playback Controls */}
                <div className="playback-controls">
                    <button className="control-btn" onClick={handlePrevious} disabled={currentAyah <= 1}>
                        ⏮️
                    </button>
                    <button className="control-btn play-btn" onClick={togglePlay}>
                        {isPlaying ? '⏸️' : '▶️'}
                    </button>
                    <button className="control-btn" onClick={handleNext} disabled={currentAyah >= totalAyahs}>
                        ⏭️
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="progress-section">
                    <span className="time">{formatTime(currentTime)}</span>
                    <div className="progress-bar" onClick={handleSeek}>
                        <div
                            className="progress-fill"
                            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                        />
                    </div>
                    <span className="time">{formatTime(duration)}</span>
                </div>

                {/* Ayah Info */}
                <div className="ayah-info">
                    <span>Ayah {currentAyah} / {totalAyahs}</span>
                    <button
                        className={`auto-btn ${isAutoPlay ? 'active' : ''}`}
                        onClick={() => setIsAutoPlay(!isAutoPlay)}
                        title={isAutoPlay ? 'Auto-play ON' : 'Auto-play OFF'}
                    >
                        🔁
                    </button>
                </div>
            </div>

            {audioError && (
                <div className="audio-error">
                    {audioError}
                </div>
            )}
        </div>
    );
};

export default AudioPlayer;
