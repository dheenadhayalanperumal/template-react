import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { GameConfig } from '../data/TamilAlphabet';

export class DifficultySelect extends Scene {
    constructor() {
        super('DifficultySelect');
    }

    init(data) {
        this.selectedStage = data.stage || 1;
        this.selectedDifficulty = data.difficulty || 'EASY';
    }

    create() {
        const { width, height } = this.sys.game.config;
        
        // Background
        this.add.rectangle(width/2, height/2, width, height, 0x37474f);
        
        this.createDifficultySelection(width, height);
        
        EventBus.emit('current-scene-ready', this);
    }

    createDifficultySelection(width, height) {
        // Title
        this.add.text(width/2, 100, 'Choose Difficulty', {
            fontFamily: 'Arial Black', 
            fontSize: 36, 
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
        
        // Stage info
        const stageName = GameConfig.STAGES[this.selectedStage].name;
        this.add.text(width/2, 150, `Stage ${this.selectedStage}: ${stageName}`, {
            fontFamily: 'Arial', 
            fontSize: 20, 
            color: '#ffeb3b',
            align: 'center'
        }).setOrigin(0.5);
        
        // Difficulty options
        this.createDifficultyOptions(width, height);
        
        // Navigation buttons
        this.createNavigationButtons(width, height);
    }

    createDifficultyOptions(width, height) {
        const startY = 220;
        const spacing = 140;
        const difficulties = ['EASY', 'MEDIUM', 'HARD'];
        
        this.difficultyCards = [];
        
        difficulties.forEach((difficulty, index) => {
            const y = startY + index * spacing;
            this.createDifficultyCard(width/2, y, difficulty);
        });
    }

    createDifficultyCard(x, y, difficulty) {
        const config = GameConfig.DIFFICULTY_LEVELS[difficulty];
        const isSelected = this.selectedDifficulty === difficulty;
        
        // Card background
        const card = this.add.rectangle(x, y, 600, 120, 
            isSelected ? 0x4caf50 : 0x546e7a, 
            isSelected ? 1.0 : 0.8
        ).setInteractive({ useHandCursor: true });
        
        // Difficulty name
        this.add.text(x - 250, y - 30, config.name, {
            fontFamily: 'Arial Black', 
            fontSize: 28, 
            color: '#ffffff'
        });
        
        // Description
        const description = this.getDifficultyDescription(difficulty);
        this.add.text(x - 250, y, description, {
            fontFamily: 'Arial', 
            fontSize: 16, 
            color: '#ffffff',
            wordWrap: { width: 350, useAdvancedWrap: true }
        });
        
        // Visual indicators
        this.createDifficultyIndicators(x + 150, y, difficulty);
        
        // Store card reference
        this.difficultyCards.push({ card, difficulty });
        
        // Add interaction
        card.on('pointerdown', () => this.selectDifficulty(difficulty));
        card.on('pointerover', () => {
            if (!isSelected) {
                card.setFillStyle(0x607d8b, 0.9);
            }
        });
        card.on('pointerout', () => {
            if (!isSelected) {
                card.setFillStyle(0x546e7a, 0.8);
            }
        });
    }

    getDifficultyDescription(difficulty) {
        const descriptions = {
            'EASY': 'Perfect for beginners!\n• Thick guiding lines\n• Direction arrows\n• Starting point shown\n• High tolerance for mistakes',
            'MEDIUM': 'For learners with some practice!\n• Thin guiding lines\n• No direction arrows\n• Starting point shown\n• Medium tolerance',
            'HARD': 'Challenge yourself!\n• No guiding lines\n• Letter shown briefly\n• Starting point only\n• Low tolerance'
        };
        
        return descriptions[difficulty] || '';
    }

    createDifficultyIndicators(x, y, difficulty) {
        const config = GameConfig.DIFFICULTY_LEVELS[difficulty];
        
        // Stars indicating difficulty level
        const stars = difficulty === 'EASY' ? 1 : difficulty === 'MEDIUM' ? 2 : 3;
        const startX = x - (stars - 1) * 15;
        
        for (let i = 0; i < 3; i++) {
            const starX = startX + i * 30;
            const filled = i < stars;
            const color = filled ? '#ffeb3b' : '#666666';
            
            this.add.text(starX, y - 25, '★', {
                fontSize: '24px',
                color: color
            }).setOrigin(0.5);
        }
        
        // Outline thickness indicator
        if (config.outlineWidth > 0) {
            const thickness = config.outlineWidth;
            this.add.rectangle(x, y + 15, 60, thickness, 0xffffff, 0.8);
            
            this.add.text(x, y + 35, 'Guide Line', {
                fontFamily: 'Arial', 
                fontSize: 12, 
                color: '#ffffff'
            }).setOrigin(0.5);
        } else {
            this.add.text(x, y + 25, 'No Guide', {
                fontFamily: 'Arial', 
                fontSize: 12, 
                color: '#ff5722'
            }).setOrigin(0.5);
        }
    }

    createNavigationButtons(width, height) {
        const buttonY = height - 80;
        
        // Back button
        const backBtn = this.add.rectangle(width/2 - 120, buttonY, 150, 50, 0x757575)
            .setInteractive({ useHandCursor: true });
        
        this.add.text(width/2 - 120, buttonY, 'Back', {
            fontFamily: 'Arial', 
            fontSize: 18, 
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Start button
        const startBtn = this.add.rectangle(width/2 + 120, buttonY, 150, 50, 0x4caf50)
            .setInteractive({ useHandCursor: true });
        
        this.add.text(width/2 + 120, buttonY, 'Start Learning', {
            fontFamily: 'Arial', 
            fontSize: 18, 
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Button interactions
        backBtn.on('pointerdown', () => this.goBack());
        backBtn.on('pointerover', () => backBtn.setFillStyle(0x616161));
        backBtn.on('pointerout', () => backBtn.setFillStyle(0x757575));
        
        startBtn.on('pointerdown', () => this.startLearning());
        startBtn.on('pointerover', () => startBtn.setFillStyle(0x45a049));
        startBtn.on('pointerout', () => startBtn.setFillStyle(0x4caf50));
    }

    selectDifficulty(difficulty) {
        // Update selection
        this.selectedDifficulty = difficulty;
        
        // Update card appearances
        this.difficultyCards.forEach(({ card, difficulty: cardDiff }) => {
            const isSelected = cardDiff === difficulty;
            card.setFillStyle(isSelected ? 0x4caf50 : 0x546e7a, isSelected ? 1.0 : 0.8);
        });
    }

    startLearning() {
        // Start learning with selected difficulty
        this.scene.start('Learning', {
            stage: this.selectedStage,
            difficulty: this.selectedDifficulty
        });
    }

    goBack() {
        this.scene.start('MainMenu');
    }
}