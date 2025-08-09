export class AudioManager {
    constructor(scene) {
        this.scene = scene;
        this.soundEnabled = true;
        this.musicEnabled = true;
        this.masterVolume = 1.0;
        this.musicVolume = 0.3;
        this.sfxVolume = 0.6;
        
        // Currently playing sounds
        this.currentMusic = null;
        this.currentDrawSound = null;
        
        // Load settings
        this.loadAudioSettings();
    }

    loadAudioSettings() {
        try {
            const settings = localStorage.getItem('tamilGameSettings');
            if (settings) {
                const parsed = JSON.parse(settings);
                this.soundEnabled = parsed.soundEnabled !== undefined ? parsed.soundEnabled : true;
                this.musicEnabled = parsed.musicEnabled !== undefined ? parsed.musicEnabled : true;
            }
        } catch (e) {
            console.warn('Could not load audio settings:', e);
        }
    }

    // Sound Effect Methods
    playButtonClick() {
        this.playSound('buttonSound', this.sfxVolume * 0.8);
    }

    playDrawingSound() {
        if (this.currentDrawSound && this.currentDrawSound.isPlaying) {
            return; // Already playing
        }
        
        this.currentDrawSound = this.playSound('drawSound', this.sfxVolume * 0.4, true);
    }

    stopDrawingSound() {
        if (this.currentDrawSound && this.currentDrawSound.isPlaying) {
            this.currentDrawSound.stop();
            this.currentDrawSound = null;
        }
    }

    playSuccessSound() {
        this.playSound('successSound', this.sfxVolume * 0.8);
        
        // Add a little celebration jingle
        this.scene.time.delayedCall(200, () => {
            this.playSound('successSound', this.sfxVolume * 0.6, false, 1.2); // Higher pitch
        });
    }

    playTryAgainSound() {
        this.playSound('tryAgainSound', this.sfxVolume * 0.6);
    }

    playStageCompleteSound() {
        this.playSound('stageComplete', this.sfxVolume * 0.9);
    }

    // Tamil Letter Pronunciation Methods
    playLetterPronunciation(letter, callback = null) {
        const audioKey = `pronounce_${letter}`;
        const sound = this.playSound(audioKey, this.sfxVolume * 1.0, false, 1.0, callback);
        
        if (!sound && this.scene.sound) {
            // Fallback: use speech synthesis if audio file not available
            this.speakLetter(letter, callback);
        }
        
        return sound;
    }

    speakLetter(letter, callback = null) {
        // Fallback text-to-speech for Tamil letters
        if ('speechSynthesis' in window) {
            try {
                const utterance = new SpeechSynthesisUtterance(letter);
                
                // Try to find Tamil voice
                const voices = speechSynthesis.getVoices();
                const tamilVoice = voices.find(voice => 
                    voice.lang.includes('ta') || voice.name.includes('Tamil')
                );
                
                if (tamilVoice) {
                    utterance.voice = tamilVoice;
                }
                
                utterance.rate = 0.8;
                utterance.pitch = 1.1;
                utterance.volume = this.soundEnabled ? this.sfxVolume : 0;
                
                if (callback) {
                    utterance.onend = callback;
                }
                
                speechSynthesis.speak(utterance);
                return true;
            } catch (e) {
                console.warn('Speech synthesis failed:', e);
                if (callback) callback();
                return false;
            }
        }
        
        if (callback) callback();
        return false;
    }

    // Background Music Methods
    playBackgroundMusic() {
        if (!this.musicEnabled || this.currentMusic) {
            return;
        }
        
        this.currentMusic = this.scene.sound.add('bgMusic', {
            loop: true,
            volume: this.musicVolume * this.masterVolume
        });
        
        if (this.currentMusic) {
            this.currentMusic.play();
        }
    }

    stopBackgroundMusic() {
        if (this.currentMusic) {
            this.currentMusic.stop();
            this.currentMusic.destroy();
            this.currentMusic = null;
        }
    }

    pauseBackgroundMusic() {
        if (this.currentMusic && this.currentMusic.isPlaying) {
            this.currentMusic.pause();
        }
    }

    resumeBackgroundMusic() {
        if (this.currentMusic && this.currentMusic.isPaused) {
            this.currentMusic.resume();
        }
    }

    // Core Sound Playing Method
    playSound(key, volume = 1.0, loop = false, rate = 1.0, callback = null) {
        if (!this.soundEnabled || !this.scene.sound) {
            if (callback) callback();
            return null;
        }
        
        try {
            const sound = this.scene.sound.add(key, {
                volume: volume * this.masterVolume,
                loop: loop,
                rate: rate
            });
            
            if (sound) {
                if (callback) {
                    sound.once('complete', callback);
                }
                sound.play();
                return sound;
            }
        } catch (e) {
            console.warn(`Could not play sound ${key}:`, e);
        }
        
        if (callback) callback();
        return null;
    }

    // Volume Control Methods
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        
        // Update currently playing sounds
        if (this.currentMusic) {
            this.currentMusic.setVolume(this.musicVolume * this.masterVolume);
        }
    }

    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }

    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        
        if (this.currentMusic) {
            this.currentMusic.setVolume(this.musicVolume * this.masterVolume);
        }
    }

    // Enable/Disable Methods
    enableSound() {
        this.soundEnabled = true;
        this.scene.sound.resumeAll();
        
        if (this.musicEnabled && !this.currentMusic) {
            this.playBackgroundMusic();
        }
    }

    disableSound() {
        this.soundEnabled = false;
        this.scene.sound.pauseAll();
        this.stopDrawingSound();
    }

    enableMusic() {
        this.musicEnabled = true;
        if (this.soundEnabled) {
            this.playBackgroundMusic();
        }
    }

    disableMusic() {
        this.musicEnabled = false;
        this.stopBackgroundMusic();
    }

    toggleSound() {
        if (this.soundEnabled) {
            this.disableSound();
        } else {
            this.enableSound();
        }
        return this.soundEnabled;
    }

    toggleMusic() {
        if (this.musicEnabled) {
            this.disableMusic();
        } else {
            this.enableMusic();
        }
        return this.musicEnabled;
    }

    // Contextual Audio Methods
    playUIFeedback(type) {
        switch (type) {
            case 'correct':
                this.playSuccessSound();
                break;
            case 'incorrect':
                this.playTryAgainSound();
                break;
            case 'button':
                this.playButtonClick();
                break;
            case 'complete':
                this.playStageCompleteSound();
                break;
        }
    }

    // Special Effect Methods
    playProgressSound(progress) {
        // Play different pitched sounds based on progress
        const pitch = 0.8 + (progress / 100) * 0.8; // Range from 0.8 to 1.6
        this.playSound('buttonSound', this.sfxVolume * 0.5, false, pitch);
    }

    playAccuracyFeedback(accuracy) {
        // Play sound based on accuracy level
        if (accuracy >= 90) {
            this.playSuccessSound();
        } else if (accuracy >= 70) {
            this.playSound('successSound', this.sfxVolume * 0.7, false, 1.0);
        } else if (accuracy >= 50) {
            this.playSound('tryAgainSound', this.sfxVolume * 0.6, false, 0.9);
        } else {
            this.playTryAgainSound();
        }
    }

    // Sequence Methods for Complex Audio
    playLetterIntroSequence(letter, callback = null) {
        // Play a sequence: chime -> pronunciation -> confirmation sound
        this.playSound('buttonSound', this.sfxVolume * 0.3, false, 1.2);
        
        this.scene.time.delayedCall(300, () => {
            this.playLetterPronunciation(letter, () => {
                this.scene.time.delayedCall(200, () => {
                    this.playSound('buttonSound', this.sfxVolume * 0.2, false, 0.8);
                    if (callback) callback();
                });
            });
        });
    }

    playCompletionCelebration() {
        // Play a celebration sequence
        this.playStageCompleteSound();
        
        // Add some sparkle sounds
        for (let i = 0; i < 3; i++) {
            this.scene.time.delayedCall(i * 150 + 500, () => {
                this.playSound('successSound', this.sfxVolume * 0.4, false, 1.5 + i * 0.2);
            });
        }
    }

    // Cleanup Methods
    stopAllSounds() {
        this.scene.sound.stopAll();
        this.currentMusic = null;
        this.currentDrawSound = null;
    }

    pauseAllSounds() {
        this.scene.sound.pauseAll();
    }

    resumeAllSounds() {
        if (this.soundEnabled) {
            this.scene.sound.resumeAll();
        }
    }

    destroy() {
        this.stopAllSounds();
        
        // Remove any timed events
        if (this.scene && this.scene.time) {
            this.scene.time.removeAllEvents();
        }
    }
}