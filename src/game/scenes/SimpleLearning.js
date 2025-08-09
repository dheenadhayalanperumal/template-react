import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class SimpleLearning extends Scene {
    constructor() {
        super('SimpleLearning');
    }

    init(data) {
        this.gameData = {
            stage: data.stage || 1,
            difficulty: data.difficulty || 'EASY',
            currentLetterIndex: 0
        };
        console.log('🎯 SimpleLearning initialized with:', this.gameData);
    }

    create() {
        const { width, height } = this.sys.game.config;
        
        console.log('📚 SimpleLearning scene created');
        
        // Background
        this.add.rectangle(width/2, height/2, width, height, 0xf8f9fa);
        
        // Header
        this.add.rectangle(width/2, 60, width, 120, 0x4a90e2, 0.9);
        
        // Score display
        this.add.text(50, 30, 'Score: 0%', {
            fontSize: '24px', fontFamily: 'Arial', fill: '#ffffff', fontStyle: 'bold'
        });
        
        // Progress display
        this.add.text(width/2, 30, 'Letter 1 / 12', {
            fontSize: '20px', fontFamily: 'Arial', fill: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Letter display area
        this.add.rectangle(width/2, height/2, width - 100, height - 300, 0xffffff, 0.9);
        
        // Current letter
        this.currentLetterText = this.add.text(width/2, height/2 - 50, 'அ', {
            fontSize: '120px', fontFamily: 'Arial', fill: '#333333', fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Transliteration
        this.add.text(width/2, height/2 + 50, 'a', {
            fontSize: '24px', fontFamily: 'Arial', fill: '#666666', fontStyle: 'italic'
        }).setOrigin(0.5);
        
        // Instructions
        this.add.text(width/2, height/2 + 100, 'Touch and drag to trace the letter', {
            fontSize: '18px', fontFamily: 'Arial', fill: '#888888'
        }).setOrigin(0.5);
        
        // Simple buttons at bottom
        this.createSimpleButtons(width, height);
        
        // Simple drawing area
        this.setupSimpleDrawing();
        
        EventBus.emit('current-scene-ready', this);
    }
    
    createSimpleButtons(width, height) {
        // Clear button
        const clearButton = this.add.rectangle(150, height - 80, 120, 50, 0xff6b6b)
            .setInteractive({ useHandCursor: true });
        
        this.add.text(150, height - 80, 'Clear', {
            fontSize: '18px', fontFamily: 'Arial', fill: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Next button
        const nextButton = this.add.rectangle(width - 150, height - 80, 120, 50, 0x4caf50)
            .setInteractive({ useHandCursor: true });
        
        this.add.text(width - 150, height - 80, 'Next', {
            fontSize: '18px', fontFamily: 'Arial', fill: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Back to menu button
        const menuButton = this.add.rectangle(width/2, height - 80, 120, 50, 0x2196f3)
            .setInteractive({ useHandCursor: true });
        
        this.add.text(width/2, height - 80, 'Menu', {
            fontSize: '18px', fontFamily: 'Arial', fill: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Button events
        clearButton.on('pointerdown', () => {
            console.log('🗑️ Clear button clicked');
            if (this.drawingGraphics) {
                this.drawingGraphics.clear();
            }
        });
        
        nextButton.on('pointerdown', () => {
            console.log('➡️ Next button clicked');
            this.showNextLetter();
        });
        
        menuButton.on('pointerdown', () => {
            console.log('🏠 Menu button clicked');
            this.scene.start('SimpleMainMenu');
        });
    }
    
    setupSimpleDrawing() {
        // Create graphics for drawing
        this.drawingGraphics = this.add.graphics();
        this.isDrawing = false;
        
        // Drawing events
        this.input.on('pointerdown', (pointer) => {
            console.log('✏️ Started drawing at:', pointer.x, pointer.y);
            this.isDrawing = true;
            this.drawingGraphics.lineStyle(4, 0x000000);
            this.drawingGraphics.beginPath();
            this.drawingGraphics.moveTo(pointer.x, pointer.y);
        });
        
        this.input.on('pointermove', (pointer) => {
            if (this.isDrawing) {
                this.drawingGraphics.lineTo(pointer.x, pointer.y);
                this.drawingGraphics.strokePath();
            }
        });
        
        this.input.on('pointerup', () => {
            if (this.isDrawing) {
                console.log('✏️ Finished drawing');
                this.isDrawing = false;
                this.checkDrawing();
            }
        });
    }
    
    checkDrawing() {
        // Simple feedback
        const { width } = this.sys.game.config;
        
        // Remove previous feedback
        if (this.feedbackText) {
            this.feedbackText.destroy();
        }
        
        // Show random positive feedback
        const messages = ['Great job!', 'Nice work!', 'Keep it up!', 'Excellent!'];
        const message = messages[Math.floor(Math.random() * messages.length)];
        
        this.feedbackText = this.add.text(width/2, 150, message, {
            fontSize: '32px', fontFamily: 'Arial', fill: '#4caf50', fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Auto-hide feedback after 2 seconds
        this.time.delayedCall(2000, () => {
            if (this.feedbackText) {
                this.feedbackText.destroy();
                this.feedbackText = null;
            }
        });
    }
    
    showNextLetter() {
        // Simple progression through first few letters
        const letters = [
            { letter: 'அ', transliteration: 'a' },
            { letter: 'ஆ', transliteration: 'aa' },
            { letter: 'இ', transliteration: 'i' },
            { letter: 'ஈ', transliteration: 'ii' },
            { letter: 'உ', transliteration: 'u' }
        ];
        
        this.gameData.currentLetterIndex++;
        
        if (this.gameData.currentLetterIndex >= letters.length) {
            console.log('🎉 All letters completed!');
            this.showCompletion();
            return;
        }
        
        const currentLetter = letters[this.gameData.currentLetterIndex];
        console.log('📝 Showing letter:', currentLetter);
        
        this.currentLetterText.setText(currentLetter.letter);
        
        // Clear drawing
        if (this.drawingGraphics) {
            this.drawingGraphics.clear();
        }
        
        // Update progress
        // (In a real implementation, we'd update the progress text)
    }
    
    showCompletion() {
        const { width, height } = this.sys.game.config;
        
        // Clear screen
        this.children.removeAll();
        
        // Completion message
        this.add.rectangle(width/2, height/2, width, height, 0x4a90e2);
        
        this.add.text(width/2, height/2 - 50, '🎉 Congratulations! 🎉', {
            fontSize: '36px', fontFamily: 'Arial', fill: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.add.text(width/2, height/2, 'You completed the Tamil letters!', {
            fontSize: '24px', fontFamily: 'Arial', fill: '#ffeb3b'
        }).setOrigin(0.5);
        
        // Play again button
        const playAgainButton = this.add.rectangle(width/2, height/2 + 80, 200, 60, 0x4caf50)
            .setInteractive({ useHandCursor: true });
        
        this.add.text(width/2, height/2 + 80, 'Play Again', {
            fontSize: '20px', fontFamily: 'Arial', fill: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5);
        
        playAgainButton.on('pointerdown', () => {
            this.scene.start('SimpleMainMenu');
        });
    }
}