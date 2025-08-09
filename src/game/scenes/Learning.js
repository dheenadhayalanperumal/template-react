import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { DrawingSystem } from '../utils/DrawingSystem';
import { LetterRenderer } from '../utils/LetterRenderer';
import { GameUI } from '../ui/GameUI';
import { AudioManager } from '../utils/AudioManager';
import { ScoreManager } from '../utils/ScoreManager';
import { TamilAlphabet, getLettersByStage, GameConfig } from '../data/TamilAlphabet';

export class Learning extends Scene {
    constructor() {
        super('Learning');
    }

    init(data) {
        // Initialize game data
        this.gameData = {
            stage: data.stage || 1,
            difficulty: data.difficulty || 'EASY',
            currentLetterIndex: 0,
            score: 0,
            attempts: GameConfig.MAX_ATTEMPTS,
            completedLetters: [],
            accuracyScores: []
        };
    }

    create() {
        const { width, height } = this.sys.game.config;
        
        // Background
        this.add.rectangle(width/2, height/2, width, height, 0xf8f9fa);
        
        // Initialize systems
        this.setupSystems();
        
        // Load current stage letters
        this.loadStageLetters();
        
        // Start with first letter
        this.showCurrentLetter();
        
        // Setup event listeners
        this.setupEventListeners();
        
        EventBus.emit('current-scene-ready', this);
    }

    setupSystems() {
        // Initialize audio system first
        this.audioManager = new AudioManager(this);
        
        // Initialize score manager
        this.scoreManager = new ScoreManager();
        this.scoreManager.setDifficulty(this.gameData.difficulty);
        
        // Initialize drawing system
        this.drawingSystem = new DrawingSystem(this);
        
        // Initialize letter renderer
        this.letterRenderer = new LetterRenderer(this);
        
        // Initialize UI system
        this.gameUI = new GameUI(this);
        
        // Start background music
        this.audioManager.playBackgroundMusic();
        
        // Update UI with initial values
        this.updateUI();
    }

    loadStageLetters() {
        this.stageLetters = getLettersByStage(this.gameData.stage);
        this.gameData.totalLetters = this.stageLetters.length;
    }

    setupEventListeners() {
        // Drawing completion check
        this.input.on('pointerup', () => {
            this.checkDrawingAccuracy();
        });
        
        // UI button events
        this.events.on('clearDrawing', () => {
            this.clearCurrentDrawing();
        });
        
        this.events.on('skipLetter', () => {
            this.skipCurrentLetter();
        });
        
        this.events.on('nextLetter', () => {
            this.moveToNextLetter();
        });
        
        this.events.on('showSettings', () => {
            this.showSettings();
        });
    }

    showCurrentLetter() {
        if (this.gameData.currentLetterIndex >= this.stageLetters.length) {
            this.showResults();
            return;
        }

        const currentLetter = this.stageLetters[this.gameData.currentLetterIndex];
        
        // Clear previous drawing
        this.drawingSystem.clearDrawing();
        
        // Render letter with current difficulty
        this.letterRenderer.renderLetter(currentLetter, this.gameData.difficulty);
        
        // Set reference path for drawing comparison
        const referencePath = this.letterRenderer.getReferencePath();
        this.drawingSystem.setReferencePoints(referencePath);
        
        // Set tolerance based on difficulty
        const difficultyConfig = GameConfig.DIFFICULTY_LEVELS[this.gameData.difficulty];
        this.drawingSystem.setTolerance(difficultyConfig.tolerance);
        
        // Update UI
        this.gameUI.updateCurrentLetter(currentLetter.letter, currentLetter.transliteration);
        this.gameUI.hideNextButton();
        this.gameUI.hideFeedback();
        
        // Play letter pronunciation
        this.playLetterPronunciation(currentLetter);
        
        // Reset attempts for this letter
        this.gameData.attempts = GameConfig.MAX_ATTEMPTS;
        
        // Start timer for this letter
        this.scoreManager.startLetterTimer();
        
        this.updateUI();
    }

    checkDrawingAccuracy() {
        // Get accuracy from drawing system
        const accuracy = this.drawingSystem.calculateAccuracy();
        
        // Check if accuracy meets threshold
        const isCorrect = accuracy >= GameConfig.ACCURACY_THRESHOLD;
        
        if (isCorrect) {
            this.handleCorrectAttempt(accuracy);
        } else {
            this.handleIncorrectAttempt(accuracy);
        }
    }

    handleCorrectAttempt(accuracy) {
        const currentLetter = this.stageLetters[this.gameData.currentLetterIndex];
        const attemptsUsed = GameConfig.MAX_ATTEMPTS - this.gameData.attempts + 1;
        
        // Record detailed score
        const scoreData = this.scoreManager.recordLetterScore(
            this.gameData.currentLetterIndex,
            currentLetter,
            accuracy,
            attemptsUsed,
            false
        );
        
        // Store in game data for backwards compatibility
        this.gameData.accuracyScores.push(accuracy);
        this.gameData.completedLetters.push(this.gameData.currentLetterIndex);
        
        // Update UI with new score
        this.updateScore();
        
        // Show detailed feedback
        this.gameUI.showFeedback(true, accuracy);
        this.gameUI.animateCorrectFeedback();
        
        // Play success sound with accuracy-based variation
        this.audioManager.playAccuracyFeedback(accuracy);
        
        // Show next button
        this.gameUI.showNextButton();
    }

    handleIncorrectAttempt(accuracy) {
        this.gameData.attempts--;
        
        if (this.gameData.attempts > 0) {
            // Show feedback and allow retry
            this.gameUI.showFeedback(false, accuracy);
            this.gameUI.updateAttempts(this.gameData.attempts);
            
            // Play try again sound
            this.playTryAgainSound();
            
            // Clear drawing after a delay
            this.time.delayedCall(1500, () => {
                this.drawingSystem.clearDrawing();
            });
        } else {
            // No attempts left, record as failed and move to next letter
            const currentLetter = this.stageLetters[this.gameData.currentLetterIndex];
            const attemptsUsed = GameConfig.MAX_ATTEMPTS;
            
            // Record failed attempt
            this.scoreManager.recordLetterScore(
                this.gameData.currentLetterIndex,
                currentLetter,
                accuracy,
                attemptsUsed,
                false
            );
            
            this.gameData.accuracyScores.push(0); // Record as failed
            this.gameUI.showFeedback(false, accuracy);
            
            // Auto-move to next letter after delay
            this.time.delayedCall(2000, () => {
                this.moveToNextLetter();
            });
        }
    }

    updateScore() {
        // Use ScoreManager for sophisticated scoring
        this.gameData.score = this.scoreManager.calculateFinalScore();
        
        this.gameUI.updateScore(this.gameData.score);
        this.gameUI.animateScoreUpdate();
    }

    updateUI() {
        this.gameUI.updateProgress(
            this.gameData.currentLetterIndex + 1, 
            this.gameData.totalLetters
        );
        this.gameUI.updateScore(this.gameData.score);
        this.gameUI.updateAttempts(this.gameData.attempts);
    }

    clearCurrentDrawing() {
        this.drawingSystem.clearDrawing();
    }

    skipCurrentLetter() {
        // Record as skipped in score manager
        const currentLetter = this.stageLetters[this.gameData.currentLetterIndex];
        this.scoreManager.recordLetterScore(
            this.gameData.currentLetterIndex,
            currentLetter,
            0,
            0,
            true // marked as skipped
        );
        
        // Record as skipped (0 accuracy) for backwards compatibility
        this.gameData.accuracyScores.push(0);
        this.moveToNextLetter();
    }

    moveToNextLetter() {
        this.gameData.currentLetterIndex++;
        
        if (this.gameData.currentLetterIndex >= this.stageLetters.length) {
            this.showResults();
        } else {
            this.showCurrentLetter();
        }
    }

    showResults() {
        // Save detailed score data
        const stageKey = `stage_${this.gameData.stage}_${this.gameData.difficulty}`;
        this.scoreManager.saveToLocalStorage(stageKey);
        
        // Get comprehensive statistics
        const statistics = this.scoreManager.getSessionStatistics();
        const detailedReport = this.scoreManager.getDetailedReport();
        
        // Calculate final statistics with enhanced data
        const finalStats = {
            // Basic data
            stage: this.gameData.stage,
            difficulty: this.gameData.difficulty,
            stageName: GameConfig.STAGES[this.gameData.stage].name,
            
            // Enhanced statistics from ScoreManager
            ...statistics,
            
            // Detailed scoring data
            letterScores: detailedReport.letterScores,
            recommendations: detailedReport.recommendations,
            
            // Legacy compatibility
            totalLetters: this.gameData.totalLetters,
            accuracyScores: this.gameData.accuracyScores
        };
        
        // Play completion celebration
        this.audioManager.playCompletionCelebration();
        
        // Transition to results scene
        this.scene.start('Results', finalStats);
    }

    showSettings() {
        // Pause current game and show settings
        this.scene.pause();
        this.scene.launch('Settings', { returnTo: 'Learning', gameData: this.gameData });
    }

    // Audio methods
    playLetterPronunciation(letter) {
        this.audioManager.playLetterIntroSequence(letter.letter);
    }

    playSuccessSound() {
        this.audioManager.playUIFeedback('correct');
    }

    playTryAgainSound() {
        this.audioManager.playUIFeedback('incorrect');
    }

    // Scene lifecycle
    shutdown() {
        // Clean up systems
        if (this.audioManager) {
            this.audioManager.destroy();
        }
        
        if (this.drawingSystem) {
            this.drawingSystem.destroy();
        }
        
        if (this.letterRenderer) {
            this.letterRenderer.destroy();
        }
        
        if (this.gameUI) {
            this.gameUI.destroy();
        }
        
        // Remove event listeners
        this.events.off('clearDrawing');
        this.events.off('skipLetter');
        this.events.off('nextLetter');
        this.events.off('showSettings');
    }
}