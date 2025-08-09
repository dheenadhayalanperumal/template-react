import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { GameConfig } from '../data/TamilAlphabet';

export class Settings extends Scene {
    constructor() {
        super('Settings');
    }

    init(data) {
        this.returnTo = data.returnTo || 'MainMenu';
        this.gameData = data.gameData;
        
        // Load current settings or defaults
        this.settings = {
            difficulty: 'EASY',
            soundEnabled: true,
            musicEnabled: true,
            language: 'english', // UI language
            stage: 1,
            ...this.loadSettings()
        };
    }

    create() {
        const { width, height } = this.sys.game.config;
        
        // Background
        this.add.rectangle(width/2, height/2, width, height, 0x37474f);
        
        // Title
        this.add.text(width/2, 80, 'Settings', {
            fontFamily: 'Arial Black', 
            fontSize: 36, 
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
        
        this.createSettingsMenu(width, height);
        this.createNavigationButtons(width, height);
        
        EventBus.emit('current-scene-ready', this);
    }

    createSettingsMenu(width, height) {
        const startY = 160;
        const spacing = 80;
        let currentY = startY;
        
        // Difficulty Setting
        this.createDifficultySelector(width/2, currentY);
        currentY += spacing;
        
        // Stage Selection
        this.createStageSelector(width/2, currentY);
        currentY += spacing;
        
        // Sound Settings
        this.createSoundToggles(width/2, currentY);
        currentY += spacing;
        
        // Language Setting
        this.createLanguageSelector(width/2, currentY + 40);
    }

    createDifficultySelector(centerX, y) {
        this.add.text(centerX, y - 20, 'Difficulty Level', {
            fontFamily: 'Arial', 
            fontSize: 20, 
            color: '#ffffff'
        }).setOrigin(0.5);
        
        const difficulties = ['EASY', 'MEDIUM', 'HARD'];
        const buttonWidth = 100;
        const totalWidth = buttonWidth * 3 + 20; // 10px spacing between buttons
        const startX = centerX - totalWidth/2 + buttonWidth/2;
        
        this.difficultyButtons = [];
        
        difficulties.forEach((difficulty, index) => {
            const x = startX + index * (buttonWidth + 10);
            const isSelected = this.settings.difficulty === difficulty;
            
            const button = this.add.rectangle(x, y + 15, buttonWidth, 40, 
                isSelected ? 0x4caf50 : 0x666666)
                .setInteractive({ useHandCursor: true });
            
            const text = this.add.text(x, y + 15, difficulty, {
                fontFamily: 'Arial', 
                fontSize: 14, 
                color: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            
            // Store references
            this.difficultyButtons.push({ button, text, difficulty });
            
            // Add interaction
            button.on('pointerdown', () => {
                this.selectDifficulty(difficulty);
            });
        });
    }

    createStageSelector(centerX, y) {
        this.add.text(centerX, y - 20, 'Select Stage', {
            fontFamily: 'Arial', 
            fontSize: 20, 
            color: '#ffffff'
        }).setOrigin(0.5);
        
        const stages = [
            { id: 1, name: 'Vowels' },
            { id: 2, name: 'Consonants' },
            { id: 3, name: 'Combined' }
        ];
        
        const buttonWidth = 120;
        const totalWidth = buttonWidth * 3 + 20;
        const startX = centerX - totalWidth/2 + buttonWidth/2;
        
        this.stageButtons = [];
        
        stages.forEach((stage, index) => {
            const x = startX + index * (buttonWidth + 10);
            const isSelected = this.settings.stage === stage.id;
            
            const button = this.add.rectangle(x, y + 15, buttonWidth, 40, 
                isSelected ? 0x2196f3 : 0x666666)
                .setInteractive({ useHandCursor: true });
            
            const text = this.add.text(x, y + 15, stage.name, {
                fontFamily: 'Arial', 
                fontSize: 14, 
                color: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            
            this.stageButtons.push({ button, text, stage: stage.id });
            
            button.on('pointerdown', () => {
                this.selectStage(stage.id);
            });
        });
    }

    createSoundToggles(centerX, y) {
        this.add.text(centerX, y - 20, 'Audio Settings', {
            fontFamily: 'Arial', 
            fontSize: 20, 
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Sound Effects Toggle
        const soundY = y + 15;
        this.add.text(centerX - 60, soundY, 'Sound Effects', {
            fontFamily: 'Arial', 
            fontSize: 16, 
            color: '#ffffff'
        }).setOrigin(0.5);
        
        this.soundToggle = this.add.rectangle(centerX + 60, soundY, 60, 30, 
            this.settings.soundEnabled ? 0x4caf50 : 0xff5722)
            .setInteractive({ useHandCursor: true });
        
        this.soundToggleText = this.add.text(centerX + 60, soundY, 
            this.settings.soundEnabled ? 'ON' : 'OFF', {
                fontFamily: 'Arial', 
                fontSize: 14, 
                color: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5);
        
        this.soundToggle.on('pointerdown', () => {
            this.toggleSound();
        });
        
        // Music Toggle
        const musicY = y + 50;
        this.add.text(centerX - 60, musicY, 'Background Music', {
            fontFamily: 'Arial', 
            fontSize: 16, 
            color: '#ffffff'
        }).setOrigin(0.5);
        
        this.musicToggle = this.add.rectangle(centerX + 60, musicY, 60, 30, 
            this.settings.musicEnabled ? 0x4caf50 : 0xff5722)
            .setInteractive({ useHandCursor: true });
        
        this.musicToggleText = this.add.text(centerX + 60, musicY, 
            this.settings.musicEnabled ? 'ON' : 'OFF', {
                fontFamily: 'Arial', 
                fontSize: 14, 
                color: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5);
        
        this.musicToggle.on('pointerdown', () => {
            this.toggleMusic();
        });
    }

    createLanguageSelector(centerX, y) {
        this.add.text(centerX, y - 20, 'Interface Language', {
            fontFamily: 'Arial', 
            fontSize: 20, 
            color: '#ffffff'
        }).setOrigin(0.5);
        
        const languages = [
            { id: 'english', name: 'English' },
            { id: 'tamil', name: 'தமிழ்' }
        ];
        
        const buttonWidth = 100;
        const startX = centerX - buttonWidth - 5;
        
        this.languageButtons = [];
        
        languages.forEach((lang, index) => {
            const x = startX + index * (buttonWidth + 10);
            const isSelected = this.settings.language === lang.id;
            
            const button = this.add.rectangle(x, y + 15, buttonWidth, 40, 
                isSelected ? 0x9c27b0 : 0x666666)
                .setInteractive({ useHandCursor: true });
            
            const text = this.add.text(x, y + 15, lang.name, {
                fontFamily: 'Arial', 
                fontSize: 16, 
                color: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            
            this.languageButtons.push({ button, text, language: lang.id });
            
            button.on('pointerdown', () => {
                this.selectLanguage(lang.id);
            });
        });
    }

    createNavigationButtons(width, height) {
        const buttonY = height - 80;
        
        // Back/Cancel button
        const backBtn = this.add.rectangle(width/2 - 100, buttonY, 150, 50, 0x757575)
            .setInteractive({ useHandCursor: true });
        
        this.add.text(width/2 - 100, buttonY, 'Back', {
            fontFamily: 'Arial', 
            fontSize: 18, 
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Save/Apply button
        const saveBtn = this.add.rectangle(width/2 + 100, buttonY, 150, 50, 0x4caf50)
            .setInteractive({ useHandCursor: true });
        
        this.add.text(width/2 + 100, buttonY, 'Apply', {
            fontFamily: 'Arial', 
            fontSize: 18, 
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Button interactions
        backBtn.on('pointerdown', () => this.goBack());
        backBtn.on('pointerover', () => backBtn.setFillStyle(0x616161));
        backBtn.on('pointerout', () => backBtn.setFillStyle(0x757575));
        
        saveBtn.on('pointerdown', () => this.saveAndApply());
        saveBtn.on('pointerover', () => saveBtn.setFillStyle(0x45a049));
        saveBtn.on('pointerout', () => saveBtn.setFillStyle(0x4caf50));
    }

    selectDifficulty(difficulty) {
        this.settings.difficulty = difficulty;
        
        // Update button appearance
        this.difficultyButtons.forEach(({ button, difficulty: btnDiff }) => {
            const isSelected = btnDiff === difficulty;
            button.setFillStyle(isSelected ? 0x4caf50 : 0x666666);
        });
    }

    selectStage(stage) {
        this.settings.stage = stage;
        
        // Update button appearance
        this.stageButtons.forEach(({ button, stage: btnStage }) => {
            const isSelected = btnStage === stage;
            button.setFillStyle(isSelected ? 0x2196f3 : 0x666666);
        });
    }

    selectLanguage(language) {
        this.settings.language = language;
        
        // Update button appearance
        this.languageButtons.forEach(({ button, language: btnLang }) => {
            const isSelected = btnLang === language;
            button.setFillStyle(isSelected ? 0x9c27b0 : 0x666666);
        });
    }

    toggleSound() {
        this.settings.soundEnabled = !this.settings.soundEnabled;
        
        // Update toggle appearance
        this.soundToggle.setFillStyle(this.settings.soundEnabled ? 0x4caf50 : 0xff5722);
        this.soundToggleText.setText(this.settings.soundEnabled ? 'ON' : 'OFF');
        
        // Apply immediately
        if (this.settings.soundEnabled) {
            this.sound.resumeAll();
        } else {
            this.sound.pauseAll();
        }
    }

    toggleMusic() {
        this.settings.musicEnabled = !this.settings.musicEnabled;
        
        // Update toggle appearance
        this.musicToggle.setFillStyle(this.settings.musicEnabled ? 0x4caf50 : 0xff5722);
        this.musicToggleText.setText(this.settings.musicEnabled ? 'ON' : 'OFF');
        
        // Apply immediately
        if (this.settings.musicEnabled) {
            // Start background music if available
            if (this.sound.get('bgMusic') && !this.sound.get('bgMusic').isPlaying) {
                this.sound.play('bgMusic', { loop: true, volume: 0.3 });
            }
        } else {
            // Stop background music
            if (this.sound.get('bgMusic')) {
                this.sound.get('bgMusic').stop();
            }
        }
    }

    saveAndApply() {
        // Save settings to local storage
        this.saveSettings();
        
        // Apply settings and return
        if (this.returnTo === 'Learning' && this.gameData) {
            // Update game data with new settings
            this.gameData.difficulty = this.settings.difficulty;
            this.scene.resume('Learning');
            this.scene.stop();
        } else if (this.returnTo === 'Learning') {
            // Start new learning session with settings
            this.scene.start('Learning', {
                stage: this.settings.stage,
                difficulty: this.settings.difficulty
            });
        } else {
            // Return to main menu
            this.scene.start('MainMenu');
        }
    }

    goBack() {
        if (this.returnTo === 'Learning') {
            this.scene.resume('Learning');
            this.scene.stop();
        } else {
            this.scene.start('MainMenu');
        }
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem('tamilGameSettings');
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            return {};
        }
    }

    saveSettings() {
        try {
            localStorage.setItem('tamilGameSettings', JSON.stringify(this.settings));
        } catch (e) {
            console.warn('Could not save settings:', e);
        }
    }
}