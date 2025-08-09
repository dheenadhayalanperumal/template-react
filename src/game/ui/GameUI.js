import { ResponsiveManager } from '../utils/ResponsiveManager';

export class GameUI {
    constructor(scene) {
        this.scene = scene;
        this.uiElements = {};
        this.currentScore = 0;
        this.currentLetter = 1;
        this.totalLetters = 12;
        this.attempts = 0;
        this.maxAttempts = 3;
        
        // Initialize responsive manager with error handling
        try {
            this.responsiveManager = new ResponsiveManager(scene);
            this.setupResponsiveListeners();
        } catch (error) {
            console.warn('ResponsiveManager failed to initialize, using fallback UI:', error);
            this.responsiveManager = null;
        }
        
        this.createUI();
    }

    createUI() {
        const { width, height } = this.scene.sys.game.config;
        
        // Use traditional UI layout for compatibility, with responsive enhancements
        this.createTraditionalUI(width, height);
    }
    
    createTraditionalUI(width, height) {
        // Background panel for UI
        this.createBackgroundPanel(width, height);
        
        // Score display
        this.createScoreDisplay(width, height);
        
        // Progress display
        this.createProgressDisplay(width, height);
        
        // Attempts display
        this.createAttemptsDisplay(width, height);
        
        // Action buttons
        this.createActionButtons(width, height);
        
        // Letter display area
        this.createLetterDisplayArea(width, height);
        
        // Feedback display
        this.createFeedbackDisplay(width, height);
    }

    createPortraitUI(width, height, layout) {
        // Header area with score and progress
        this.createHeaderPanel(layout.header);
        
        // Letter display in upper portion
        this.createLetterDisplayArea(layout.letterDisplay);
        
        // Drawing area in center
        this.createDrawingAreaIndicator(layout.drawingArea);
        
        // Footer with buttons
        this.createFooterButtons(layout.footer);
        
        // Feedback overlay
        this.createFeedbackDisplay(width, height);
    }

    createLandscapeUI(width, height, layout) {
        // Left panel with controls
        this.createLeftControlPanel(layout.leftPanel);
        
        // Letter display in left panel
        this.createLetterDisplayArea(layout.letterDisplay);
        
        // Drawing area on the right
        this.createDrawingAreaIndicator(layout.drawingArea);
        
        // Feedback overlay
        this.createFeedbackDisplay(width, height);
    }

    createBackgroundPanel(width, height) {
        // Top UI panel
        this.uiElements.topPanel = this.scene.add.rectangle(
            width / 2, 60, width, 120, 0x4a90e2, 0.9
        ).setDepth(10);
        
        // Bottom UI panel
        this.uiElements.bottomPanel = this.scene.add.rectangle(
            width / 2, height - 80, width, 160, 0x4a90e2, 0.9
        ).setDepth(10);
    }

    createScoreDisplay(width, height) {
        // Score label
        this.uiElements.scoreLabel = this.scene.add.text(
            50, 30, 'Score:', {
                fontSize: '24px',
                fontFamily: 'Arial',
                fill: '#ffffff',
                fontStyle: 'bold'
            }
        ).setDepth(20);
        
        // Score value
        this.uiElements.scoreValue = this.scene.add.text(
            50, 55, '0%', {
                fontSize: '32px',
                fontFamily: 'Arial',
                fill: '#ffff00',
                fontStyle: 'bold'
            }
        ).setDepth(20);
    }

    createProgressDisplay(width, height) {
        // Progress label
        this.uiElements.progressLabel = this.scene.add.text(
            width / 2, 30, 'Letter Progress', {
                fontSize: '20px',
                fontFamily: 'Arial',
                fill: '#ffffff',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5, 0).setDepth(20);
        
        // Progress value
        this.uiElements.progressValue = this.scene.add.text(
            width / 2, 55, `${this.currentLetter} / ${this.totalLetters}`, {
                fontSize: '28px',
                fontFamily: 'Arial',
                fill: '#ffff00',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5, 0).setDepth(20);
        
        // Progress bar background
        this.uiElements.progressBarBg = this.scene.add.rectangle(
            width / 2, 90, 200, 10, 0x333333
        ).setDepth(20);
        
        // Progress bar fill
        this.uiElements.progressBarFill = this.scene.add.rectangle(
            width / 2 - 100, 90, 0, 10, 0x00ff00
        ).setOrigin(0, 0.5).setDepth(25);
    }

    createAttemptsDisplay(width, height) {
        // Attempts label
        this.uiElements.attemptsLabel = this.scene.add.text(
            width - 200, 30, 'Attempts Left:', {
                fontSize: '18px',
                fontFamily: 'Arial',
                fill: '#ffffff',
                fontStyle: 'bold'
            }
        ).setDepth(20);
        
        // Hearts for attempts
        this.uiElements.hearts = [];
        for (let i = 0; i < this.maxAttempts; i++) {
            const heart = this.scene.add.text(
                width - 160 + (i * 30), 55, '♥', {
                    fontSize: '24px',
                    fill: '#ff4444'
                }
            ).setDepth(20);
            this.uiElements.hearts.push(heart);
        }
    }

    createActionButtons(width, height) {
        // Clear/Erase button
        this.uiElements.clearButton = this.scene.add.rectangle(
            100, height - 80, 150, 50, 0xff6b6b
        ).setInteractive({ useHandCursor: true }).setDepth(20);
        
        this.uiElements.clearButtonText = this.scene.add.text(
            100, height - 80, 'Clear', {
                fontSize: '20px',
                fontFamily: 'Arial',
                fill: '#ffffff',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5).setDepth(25);
        
        // Skip button
        this.uiElements.skipButton = this.scene.add.rectangle(
            280, height - 80, 150, 50, 0xffa500
        ).setInteractive({ useHandCursor: true }).setDepth(20);
        
        this.uiElements.skipButtonText = this.scene.add.text(
            280, height - 80, 'Skip', {
                fontSize: '20px',
                fontFamily: 'Arial',
                fill: '#ffffff',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5).setDepth(25);
        
        // Next button (initially hidden)
        this.uiElements.nextButton = this.scene.add.rectangle(
            width - 100, height - 80, 150, 50, 0x4caf50
        ).setInteractive({ useHandCursor: true }).setDepth(20).setVisible(false);
        
        this.uiElements.nextButtonText = this.scene.add.text(
            width - 100, height - 80, 'Next', {
                fontSize: '20px',
                fontFamily: 'Arial',
                fill: '#ffffff',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5).setDepth(25).setVisible(false);
        
        // Settings button
        this.uiElements.settingsButton = this.scene.add.rectangle(
            width - 50, 40, 80, 40, 0x666666
        ).setInteractive({ useHandCursor: true }).setDepth(20);
        
        this.uiElements.settingsButtonText = this.scene.add.text(
            width - 50, 40, '⚙️', {
                fontSize: '24px'
            }
        ).setOrigin(0.5).setDepth(25);
        
        this.setupButtonEvents();
    }

    createLetterDisplayArea(layoutOrWidth, height = null) {
        // Handle both new responsive layout and old width/height parameters
        let letterConfig;
        
        if (typeof layoutOrWidth === 'object' && layoutOrWidth.x !== undefined) {
            // New responsive layout object
            letterConfig = {
                x: layoutOrWidth.x,
                y: layoutOrWidth.y,
                size: layoutOrWidth.size || 120
            };
        } else {
            // Old width/height parameters - maintain backwards compatibility
            const width = layoutOrWidth;
            letterConfig = {
                x: width / 2,
                y: height / 2,
                size: 120
            };
            
            // Letter display background (only for old-style calls)
            this.uiElements.letterArea = this.scene.add.rectangle(
                width / 2, height / 2, width - 100, height - 300, 0xffffff, 0.9
            ).setDepth(5);
        }
        
        // Create letter display
        this.uiElements.currentLetter = this.scene.add.text(
            letterConfig.x, letterConfig.y - 30, 'அ', {
                fontSize: `${letterConfig.size}px`,
                fontFamily: 'Arial',
                fill: '#333333',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5).setDepth(15);
        
        // Letter transliteration
        this.uiElements.letterTranslit = this.scene.add.text(
            letterConfig.x, letterConfig.y + 60, 'a', {
                fontSize: `${letterConfig.size * 0.2}px`,
                fontFamily: 'Arial',
                fill: '#666666',
                fontStyle: 'italic'
            }
        ).setOrigin(0.5).setDepth(15);
    }

    createFeedbackDisplay(width, height) {
        // Feedback text (initially hidden)
        this.uiElements.feedbackText = this.scene.add.text(
            width / 2, height - 150, '', {
                fontSize: `${this.responsiveManager ? this.responsiveManager.getFontSize(32) : 32}px`,
                fontFamily: 'Arial',
                fill: '#4caf50',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5).setDepth(30).setVisible(false);
        
        // Accuracy display (initially hidden)
        this.uiElements.accuracyText = this.scene.add.text(
            width / 2, height - 110, '', {
                fontSize: `${this.responsiveManager ? this.responsiveManager.getFontSize(24) : 24}px`,
                fontFamily: 'Arial',
                fill: '#333333'
            }
        ).setOrigin(0.5).setDepth(30).setVisible(false);
    }
    
    // Backwards compatibility methods
    createBackgroundPanel(width, height) {
        // Top UI panel
        this.uiElements.topPanel = this.scene.add.rectangle(
            width / 2, 60, width, 120, 0x4a90e2, 0.9
        ).setDepth(10);
        
        // Bottom UI panel
        this.uiElements.bottomPanel = this.scene.add.rectangle(
            width / 2, height - 80, width, 160, 0x4a90e2, 0.9
        ).setDepth(10);
    }

    createScoreDisplay(width, height) {
        // Score label
        this.uiElements.scoreLabel = this.scene.add.text(
            50, 30, 'Score:', {
                fontSize: `${this.responsiveManager ? this.responsiveManager.getFontSize(24) : 24}px`,
                fontFamily: 'Arial',
                fill: '#ffffff',
                fontStyle: 'bold'
            }
        ).setDepth(20);
        
        // Score value
        this.uiElements.scoreValue = this.scene.add.text(
            50, 55, '0%', {
                fontSize: `${this.responsiveManager ? this.responsiveManager.getFontSize(32) : 32}px`,
                fontFamily: 'Arial',
                fill: '#ffff00',
                fontStyle: 'bold'
            }
        ).setDepth(20);
    }

    createProgressDisplay(width, height) {
        // Progress label
        this.uiElements.progressLabel = this.scene.add.text(
            width / 2, 30, 'Letter Progress', {
                fontSize: `${this.responsiveManager ? this.responsiveManager.getFontSize(20) : 20}px`,
                fontFamily: 'Arial',
                fill: '#ffffff',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5, 0).setDepth(20);
        
        // Progress value
        this.uiElements.progressValue = this.scene.add.text(
            width / 2, 55, `${this.currentLetter} / ${this.totalLetters}`, {
                fontSize: `${this.responsiveManager ? this.responsiveManager.getFontSize(28) : 28}px`,
                fontFamily: 'Arial',
                fill: '#ffff00',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5, 0).setDepth(20);
        
        // Progress bar background
        this.uiElements.progressBarBg = this.scene.add.rectangle(
            width / 2, 90, 200, 10, 0x333333
        ).setDepth(20);
        
        // Progress bar fill
        this.uiElements.progressBarFill = this.scene.add.rectangle(
            width / 2 - 100, 90, 0, 10, 0x00ff00
        ).setOrigin(0, 0.5).setDepth(25);
    }

    createAttemptsDisplay(width, height) {
        // Attempts label
        this.uiElements.attemptsLabel = this.scene.add.text(
            width - 200, 30, 'Attempts Left:', {
                fontSize: `${this.responsiveManager ? this.responsiveManager.getFontSize(18) : 18}px`,
                fontFamily: 'Arial',
                fill: '#ffffff',
                fontStyle: 'bold'
            }
        ).setDepth(20);
        
        // Hearts for attempts
        this.uiElements.hearts = [];
        for (let i = 0; i < this.maxAttempts; i++) {
            const heart = this.scene.add.text(
                width - 160 + (i * 30), 55, '♥', {
                    fontSize: '24px',
                    fill: '#ff4444'
                }
            ).setDepth(20);
            this.uiElements.hearts.push(heart);
        }
    }

    createActionButtons(width, height) {
        // Clear/Erase button
        this.uiElements.clearButton = this.scene.add.rectangle(
            100, height - 80, 150, 50, 0xff6b6b
        ).setInteractive({ useHandCursor: true }).setDepth(20);
        
        this.uiElements.clearButtonText = this.scene.add.text(
            100, height - 80, 'Clear', {
                fontSize: `${this.responsiveManager ? this.responsiveManager.getFontSize(20) : 20}px`,
                fontFamily: 'Arial',
                fill: '#ffffff',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5).setDepth(25);
        
        // Skip button
        this.uiElements.skipButton = this.scene.add.rectangle(
            280, height - 80, 150, 50, 0xffa500
        ).setInteractive({ useHandCursor: true }).setDepth(20);
        
        this.uiElements.skipButtonText = this.scene.add.text(
            280, height - 80, 'Skip', {
                fontSize: `${this.responsiveManager ? this.responsiveManager.getFontSize(20) : 20}px`,
                fontFamily: 'Arial',
                fill: '#ffffff',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5).setDepth(25);
        
        // Next button (initially hidden)
        this.uiElements.nextButton = this.scene.add.rectangle(
            width - 100, height - 80, 150, 50, 0x4caf50
        ).setInteractive({ useHandCursor: true }).setDepth(20).setVisible(false);
        
        this.uiElements.nextButtonText = this.scene.add.text(
            width - 100, height - 80, 'Next', {
                fontSize: `${this.responsiveManager ? this.responsiveManager.getFontSize(20) : 20}px`,
                fontFamily: 'Arial',
                fill: '#ffffff',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5).setDepth(25).setVisible(false);
        
        // Settings button
        this.uiElements.settingsButton = this.scene.add.rectangle(
            width - 50, 40, 80, 40, 0x666666
        ).setInteractive({ useHandCursor: true }).setDepth(20);
        
        this.uiElements.settingsButtonText = this.scene.add.text(
            width - 50, 40, '⚙️', {
                fontSize: '24px'
            }
        ).setOrigin(0.5).setDepth(25);
        
        this.setupButtonEvents();
    }

    setupButtonEvents() {
        // Clear button
        this.uiElements.clearButton.on('pointerdown', () => {
            this.scene.events.emit('clearDrawing');
            this.playButtonSound();
        });
        
        this.uiElements.clearButton.on('pointerover', () => {
            this.uiElements.clearButton.setFillStyle(0xff5252);
        });
        
        this.uiElements.clearButton.on('pointerout', () => {
            this.uiElements.clearButton.setFillStyle(0xff6b6b);
        });
        
        // Skip button
        this.uiElements.skipButton.on('pointerdown', () => {
            this.scene.events.emit('skipLetter');
            this.playButtonSound();
        });
        
        this.uiElements.skipButton.on('pointerover', () => {
            this.uiElements.skipButton.setFillStyle(0xff9500);
        });
        
        this.uiElements.skipButton.on('pointerout', () => {
            this.uiElements.skipButton.setFillStyle(0xffa500);
        });
        
        // Next button
        this.uiElements.nextButton.on('pointerdown', () => {
            this.scene.events.emit('nextLetter');
            this.playButtonSound();
        });
        
        this.uiElements.nextButton.on('pointerover', () => {
            this.uiElements.nextButton.setFillStyle(0x43a047);
        });
        
        this.uiElements.nextButton.on('pointerout', () => {
            this.uiElements.nextButton.setFillStyle(0x4caf50);
        });
        
        // Settings button
        this.uiElements.settingsButton.on('pointerdown', () => {
            this.scene.events.emit('showSettings');
            this.playButtonSound();
        });
    }

    playButtonSound() {
        if (this.scene.sound && this.scene.sound.get('buttonSound')) {
            this.scene.sound.play('buttonSound', { volume: 0.5 });
        }
    }

    updateScore(score) {
        this.currentScore = score;
        this.uiElements.scoreValue.setText(`${score}%`);
        
        // Change color based on score
        let color = '#ff4444'; // Red for low scores
        if (score >= 80) color = '#4caf50'; // Green for good scores
        else if (score >= 60) color = '#ffbb33'; // Yellow for medium scores
        
        this.uiElements.scoreValue.setFill(color);
    }

    updateProgress(current, total) {
        this.currentLetter = current;
        this.totalLetters = total;
        
        this.uiElements.progressValue.setText(`${current} / ${total}`);
        
        // Update progress bar
        const progressPercent = current / total;
        const barWidth = 200 * progressPercent;
        this.uiElements.progressBarFill.setSize(barWidth, 10);
    }

    updateAttempts(attemptsLeft) {
        this.attempts = this.maxAttempts - attemptsLeft;
        
        // Update heart colors
        for (let i = 0; i < this.maxAttempts; i++) {
            if (i < attemptsLeft) {
                this.uiElements.hearts[i].setFill('#ff4444'); // Red heart
            } else {
                this.uiElements.hearts[i].setFill('#666666'); // Gray heart
            }
        }
    }

    updateCurrentLetter(letter, transliteration) {
        this.uiElements.currentLetter.setText(letter);
        this.uiElements.letterTranslit.setText(transliteration);
    }

    showFeedback(isCorrect, accuracy) {
        const feedback = isCorrect ? 'Excellent!' : 'Try Again!';
        const color = isCorrect ? '#4caf50' : '#ff6b6b';
        
        this.uiElements.feedbackText.setText(feedback);
        this.uiElements.feedbackText.setFill(color);
        this.uiElements.feedbackText.setVisible(true);
        
        this.uiElements.accuracyText.setText(`Accuracy: ${accuracy}%`);
        this.uiElements.accuracyText.setVisible(true);
        
        // Show/hide next button based on correctness
        if (isCorrect) {
            this.uiElements.nextButton.setVisible(true);
            this.uiElements.nextButtonText.setVisible(true);
        }
        
        // Auto-hide feedback after 2 seconds
        this.scene.time.delayedCall(2000, () => {
            this.hideFeedback();
        });
    }

    hideFeedback() {
        this.uiElements.feedbackText.setVisible(false);
        this.uiElements.accuracyText.setVisible(false);
    }

    showNextButton() {
        this.uiElements.nextButton.setVisible(true);
        this.uiElements.nextButtonText.setVisible(true);
    }

    hideNextButton() {
        this.uiElements.nextButton.setVisible(false);
        this.uiElements.nextButtonText.setVisible(false);
    }

    // Animation methods
    animateScoreUpdate() {
        this.scene.tweens.add({
            targets: this.uiElements.scoreValue,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 200,
            yoyo: true,
            ease: 'Power2'
        });
    }

    animateCorrectFeedback() {
        // Celebratory animation
        this.scene.tweens.add({
            targets: this.uiElements.feedbackText,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 300,
            yoyo: true,
            ease: 'Back.easeOut'
        });
        
        // Particle effect could be added here
        this.createCelebrationParticles();
    }

    createCelebrationParticles() {
        const { width, height } = this.scene.sys.game.config;
        
        // Create simple star particles
        for (let i = 0; i < 10; i++) {
            const star = this.scene.add.text(
                width / 2 + (Math.random() - 0.5) * 200,
                height / 2 + (Math.random() - 0.5) * 200,
                '⭐', {
                    fontSize: '20px'
                }
            ).setDepth(50);
            
            // Animate stars
            this.scene.tweens.add({
                targets: star,
                y: star.y - 100,
                alpha: 0,
                scaleX: 2,
                scaleY: 2,
                duration: 1000,
                ease: 'Power2',
                onComplete: () => {
                    star.destroy();
                }
            });
        }
    }

    setupResponsiveListeners() {
        if (this.responsiveManager) {
            this.scene.events.on('screenResize', () => {
                this.recreateUI();
            });
        }
    }

    recreateUI() {
        // Clean up existing UI
        this.destroy();
        
        // Recreate UI with new responsive settings
        this.createUI();
    }

    createHeaderPanel(headerArea) {
        // Background for header
        this.uiElements.headerPanel = this.scene.add.rectangle(
            headerArea.x, headerArea.y, headerArea.width, headerArea.height, 
            0x4a90e2, 0.9
        ).setDepth(10);
        
        // Score and progress in header
        this.createResponsiveScoreDisplay(headerArea);
        this.createResponsiveProgressDisplay(headerArea);
    }

    createFooterButtons(footerArea) {
        const buttonSize = this.responsiveManager.getButtonSize(120, 50);
        const buttonSpacing = buttonSize.width + 20;
        const startX = footerArea.x - buttonSpacing;
        
        // Clear button
        this.uiElements.clearButton = this.scene.add.rectangle(
            startX, footerArea.y, buttonSize.width, buttonSize.height, 0xff6b6b
        ).setInteractive({ useHandCursor: true }).setDepth(20);
        
        this.uiElements.clearButtonText = this.scene.add.text(
            startX, footerArea.y, 'Clear', {
                fontSize: `${this.responsiveManager.getFontSize(16)}px`,
                fontFamily: 'Arial',
                fill: '#ffffff',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5).setDepth(25);
        
        // Skip button
        this.uiElements.skipButton = this.scene.add.rectangle(
            footerArea.x, footerArea.y, buttonSize.width, buttonSize.height, 0xffa500
        ).setInteractive({ useHandCursor: true }).setDepth(20);
        
        this.uiElements.skipButtonText = this.scene.add.text(
            footerArea.x, footerArea.y, 'Skip', {
                fontSize: `${this.responsiveManager.getFontSize(16)}px`,
                fontFamily: 'Arial',
                fill: '#ffffff',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5).setDepth(25);
        
        // Next button
        this.uiElements.nextButton = this.scene.add.rectangle(
            startX + buttonSpacing * 2, footerArea.y, buttonSize.width, buttonSize.height, 0x4caf50
        ).setInteractive({ useHandCursor: true }).setDepth(20).setVisible(false);
        
        this.uiElements.nextButtonText = this.scene.add.text(
            startX + buttonSpacing * 2, footerArea.y, 'Next', {
                fontSize: `${this.responsiveManager.getFontSize(16)}px`,
                fontFamily: 'Arial',
                fill: '#ffffff',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5).setDepth(25).setVisible(false);
        
        this.setupButtonEvents();
    }

    createLeftControlPanel(leftPanel) {
        // Background for left panel
        this.uiElements.leftPanel = this.scene.add.rectangle(
            leftPanel.x, leftPanel.y, leftPanel.width, leftPanel.height, 
            0x4a90e2, 0.9
        ).setDepth(10);
        
        // Score and progress vertically arranged
        this.createResponsiveScoreDisplay({
            x: leftPanel.x,
            y: leftPanel.y - leftPanel.height * 0.3,
            width: leftPanel.width,
            height: leftPanel.height * 0.2
        });
        
        this.createResponsiveProgressDisplay({
            x: leftPanel.x,
            y: leftPanel.y - leftPanel.height * 0.1,
            width: leftPanel.width,
            height: leftPanel.height * 0.2
        });
        
        // Buttons at bottom of left panel
        this.createVerticalButtons(leftPanel);
    }

    createVerticalButtons(leftPanel) {
        const buttonSize = this.responsiveManager.getButtonSize(100, 40);
        const buttonSpacing = buttonSize.height + 15;
        const startY = leftPanel.y + leftPanel.height * 0.2;
        
        // Clear button
        this.uiElements.clearButton = this.scene.add.rectangle(
            leftPanel.x, startY, buttonSize.width, buttonSize.height, 0xff6b6b
        ).setInteractive({ useHandCursor: true }).setDepth(20);
        
        this.uiElements.clearButtonText = this.scene.add.text(
            leftPanel.x, startY, 'Clear', {
                fontSize: `${this.responsiveManager.getFontSize(14)}px`,
                fontFamily: 'Arial',
                fill: '#ffffff',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5).setDepth(25);
        
        // Skip button
        this.uiElements.skipButton = this.scene.add.rectangle(
            leftPanel.x, startY + buttonSpacing, buttonSize.width, buttonSize.height, 0xffa500
        ).setInteractive({ useHandCursor: true }).setDepth(20);
        
        this.uiElements.skipButtonText = this.scene.add.text(
            leftPanel.x, startY + buttonSpacing, 'Skip', {
                fontSize: `${this.responsiveManager.getFontSize(14)}px`,
                fontFamily: 'Arial',
                fill: '#ffffff',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5).setDepth(25);
        
        this.setupButtonEvents();
    }

    createResponsiveScoreDisplay(area) {
        this.uiElements.scoreLabel = this.scene.add.text(
            area.x - area.width * 0.3, area.y - 15, 'Score:', {
                fontSize: `${this.responsiveManager.getFontSize(18)}px`,
                fontFamily: 'Arial',
                fill: '#ffffff',
                fontStyle: 'bold'
            }
        ).setDepth(20);
        
        this.uiElements.scoreValue = this.scene.add.text(
            area.x - area.width * 0.3, area.y + 10, '0%', {
                fontSize: `${this.responsiveManager.getFontSize(24)}px`,
                fontFamily: 'Arial',
                fill: '#ffff00',
                fontStyle: 'bold'
            }
        ).setDepth(20);
    }

    createResponsiveProgressDisplay(area) {
        this.uiElements.progressLabel = this.scene.add.text(
            area.x + area.width * 0.3, area.y - 15, 'Progress', {
                fontSize: `${this.responsiveManager.getFontSize(16)}px`,
                fontFamily: 'Arial',
                fill: '#ffffff',
                fontStyle: 'bold'
            }
        ).setOrigin(1, 0).setDepth(20);
        
        this.uiElements.progressValue = this.scene.add.text(
            area.x + area.width * 0.3, area.y + 10, `${this.currentLetter}/${this.totalLetters}`, {
                fontSize: `${this.responsiveManager.getFontSize(20)}px`,
                fontFamily: 'Arial',
                fill: '#ffff00',
                fontStyle: 'bold'
            }
        ).setOrigin(1, 0).setDepth(20);
    }

    createDrawingAreaIndicator(drawingArea) {
        // Visual indicator for drawing area bounds
        this.uiElements.drawingAreaBorder = this.scene.add.rectangle(
            drawingArea.x, drawingArea.y, drawingArea.width, drawingArea.height, 
            0xffffff, 0
        ).setStrokeStyle(2, 0xcccccc, 0.5).setDepth(5);
        
        // Helper text
        if (this.responsiveManager.screenSizeCategory === 'mobile') {
            this.uiElements.drawingHelp = this.scene.add.text(
                drawingArea.x, drawingArea.y + drawingArea.height * 0.4, 
                'Trace the letter here', {
                    fontSize: `${this.responsiveManager.getFontSize(14)}px`,
                    fontFamily: 'Arial',
                    fill: '#666666',
                    alpha: 0.7
                }
            ).setOrigin(0.5).setDepth(15);
        }
    }

    destroy() {
        // Clean up responsive manager
        if (this.responsiveManager) {
            this.responsiveManager.destroy();
        }
        
        // Clean up event listeners
        this.scene.events.off('screenResize');
        
        // Clean up all UI elements
        Object.values(this.uiElements).forEach(element => {
            if (element && element.destroy) {
                element.destroy();
            }
        });
        
        this.uiElements = {};
    }
}