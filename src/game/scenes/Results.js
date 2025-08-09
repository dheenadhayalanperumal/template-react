import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Results extends Scene {
    constructor() {
        super('Results');
    }

    init(data) {
        this.resultData = data;
    }

    create() {
        const { width, height } = this.sys.game.config;
        
        // Background with gradient
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x4a90e2, 0x4a90e2, 0x357abd, 0x357abd);
        bg.fillRect(0, 0, width, height);
        
        this.createResultsDisplay(width, height);
        this.createActionButtons(width, height);
        this.animateResults();
        
        EventBus.emit('current-scene-ready', this);
    }

    createResultsDisplay(width, height) {
        // Title
        this.add.text(width/2, 80, 'Learning Complete!', {
            fontFamily: 'Arial Black', 
            fontSize: 36, 
            color: '#ffffff',
            stroke: '#000000', 
            strokeThickness: 3,
            align: 'center'
        }).setOrigin(0.5);
        
        // Stage name
        this.add.text(width/2, 130, this.resultData.stageName, {
            fontFamily: 'Arial', 
            fontSize: 24, 
            color: '#ffeb3b',
            align: 'center'
        }).setOrigin(0.5);
        
        // Main score circle
        const scoreCircle = this.add.circle(width/2, 250, 80, 0xffffff);
        const scoreText = this.add.text(width/2, 250, `${this.resultData.finalScore}%`, {
            fontFamily: 'Arial Black', 
            fontSize: 48, 
            color: '#4a90e2',
            align: 'center'
        }).setOrigin(0.5);
        
        // Score label
        this.add.text(width/2, 340, 'Final Score', {
            fontFamily: 'Arial', 
            fontSize: 20, 
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
        
        // Statistics
        this.createStatistics(width, height);
        
        // Performance message
        this.showPerformanceMessage(width, height);
        
        // Store elements for animation
        this.scoreCircle = scoreCircle;
        this.scoreText = scoreText;
    }

    createStatistics(width, height) {
        const statsY = 400;
        const leftX = width/2 - 120;
        const rightX = width/2 + 120;
        
        // Letters completed
        this.add.text(leftX, statsY, 'Letters Completed', {
            fontFamily: 'Arial', 
            fontSize: 16, 
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
        
        this.add.text(leftX, statsY + 25, `${this.resultData.completedLetters}/${this.resultData.totalLetters}`, {
            fontFamily: 'Arial Black', 
            fontSize: 24, 
            color: '#4caf50',
            align: 'center'
        }).setOrigin(0.5);
        
        // Accuracy range
        const accuracies = this.resultData.accuracyScores.filter(score => score > 0);
        const avgAccuracy = accuracies.length > 0 ? 
            Math.round(accuracies.reduce((sum, acc) => sum + acc, 0) / accuracies.length) : 0;
            
        this.add.text(rightX, statsY, 'Average Accuracy', {
            fontFamily: 'Arial', 
            fontSize: 16, 
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
        
        this.add.text(rightX, statsY + 25, `${avgAccuracy}%`, {
            fontFamily: 'Arial Black', 
            fontSize: 24, 
            color: '#ffeb3b',
            align: 'center'
        }).setOrigin(0.5);
    }

    showPerformanceMessage(width, height) {
        let message = '';
        let color = '#ffffff';
        let emoji = '👍';
        
        if (this.resultData.finalScore >= 90) {
            message = 'Excellent Work! You\'re a Tamil writing star!';
            color = '#4caf50';
            emoji = '🌟';
        } else if (this.resultData.finalScore >= 80) {
            message = 'Great Job! Keep practicing to improve!';
            color = '#8bc34a';
            emoji = '😊';
        } else if (this.resultData.finalScore >= 60) {
            message = 'Good Effort! Practice makes perfect!';
            color = '#ffeb3b';
            emoji = '😌';
        } else {
            message = 'Keep Trying! Every practice session helps!';
            color = '#ff9800';
            emoji = '💪';
        }
        
        this.add.text(width/2, 480, emoji, {
            fontSize: 40
        }).setOrigin(0.5);
        
        this.add.text(width/2, 520, message, {
            fontFamily: 'Arial', 
            fontSize: 18, 
            color: color,
            align: 'center',
            wordWrap: { width: width - 100, useAdvancedWrap: true }
        }).setOrigin(0.5);
    }

    createActionButtons(width, height) {
        const buttonY = height - 120;
        const buttonWidth = 160;
        const buttonHeight = 50;
        
        // Try Again button
        const tryAgainBtn = this.add.rectangle(width/2 - 100, buttonY, buttonWidth, buttonHeight, 0x4caf50)
            .setInteractive({ useHandCursor: true });
        
        this.add.text(width/2 - 100, buttonY, 'Try Again', {
            fontFamily: 'Arial', 
            fontSize: 18, 
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Main Menu button
        const menuBtn = this.add.rectangle(width/2 + 100, buttonY, buttonWidth, buttonHeight, 0x2196f3)
            .setInteractive({ useHandCursor: true });
        
        this.add.text(width/2 + 100, buttonY, 'Main Menu', {
            fontFamily: 'Arial', 
            fontSize: 18, 
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Next Stage button (if applicable)
        if (this.shouldShowNextStage()) {
            const nextStageBtn = this.add.rectangle(width/2, buttonY + 60, buttonWidth, buttonHeight, 0xff9800)
                .setInteractive({ useHandCursor: true });
            
            this.add.text(width/2, buttonY + 60, 'Next Stage', {
                fontFamily: 'Arial', 
                fontSize: 18, 
                color: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            
            nextStageBtn.on('pointerdown', () => this.startNextStage());
            nextStageBtn.on('pointerover', () => nextStageBtn.setFillStyle(0xf57c00));
            nextStageBtn.on('pointerout', () => nextStageBtn.setFillStyle(0xff9800));
        }
        
        // Button interactions
        tryAgainBtn.on('pointerdown', () => this.tryAgain());
        tryAgainBtn.on('pointerover', () => tryAgainBtn.setFillStyle(0x45a049));
        tryAgainBtn.on('pointerout', () => tryAgainBtn.setFillStyle(0x4caf50));
        
        menuBtn.on('pointerdown', () => this.goToMainMenu());
        menuBtn.on('pointerover', () => menuBtn.setFillStyle(0x1976d2));
        menuBtn.on('pointerout', () => menuBtn.setFillStyle(0x2196f3));
    }

    shouldShowNextStage() {
        // Show next stage button if score is good enough and not on final stage
        return this.resultData.finalScore >= 70 && this.resultData.stage < 3;
    }

    animateResults() {
        // Animate score circle
        this.scoreCircle.setScale(0);
        this.scoreText.setScale(0);
        
        this.tweens.add({
            targets: [this.scoreCircle, this.scoreText],
            scaleX: 1,
            scaleY: 1,
            duration: 800,
            ease: 'Back.easeOut',
            delay: 500
        });
        
        // Animate score counting up
        this.tweens.addCounter({
            from: 0,
            to: this.resultData.finalScore,
            duration: 1500,
            delay: 800,
            onUpdate: (tween) => {
                const value = Math.floor(tween.getValue());
                this.scoreText.setText(`${value}%`);
            }
        });
        
        // Create celebration particles if score is high
        if (this.resultData.finalScore >= 80) {
            this.time.delayedCall(1000, () => {
                this.createCelebrationEffect();
            });
        }
    }

    createCelebrationEffect() {
        const { width, height } = this.sys.game.config;
        
        // Create falling stars
        for (let i = 0; i < 20; i++) {
            this.time.delayedCall(i * 100, () => {
                const star = this.add.text(
                    Math.random() * width,
                    -20,
                    '⭐', {
                        fontSize: '24px'
                    }
                );
                
                this.tweens.add({
                    targets: star,
                    y: height + 50,
                    duration: 3000,
                    ease: 'Linear',
                    onComplete: () => star.destroy()
                });
            });
        }
    }

    tryAgain() {
        // Restart the same stage
        this.scene.start('Learning', { 
            stage: this.resultData.stage,
            difficulty: 'EASY' // Could be saved from previous session
        });
    }

    startNextStage() {
        // Start next stage
        this.scene.start('Learning', { 
            stage: this.resultData.stage + 1,
            difficulty: 'EASY'
        });
    }

    goToMainMenu() {
        this.scene.start('MainMenu');
    }
}