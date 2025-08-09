import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        const { width, height } = this.sys.game.config;
        
        // Background gradient
        this.add.rectangle(width/2, height/2, width, height, 0x4a90e2);
        
        // Title
        this.add.text(width/2, 150, 'Tamil Aathichudi', {
            fontFamily: 'Arial Black', fontSize: 48, color: '#ffffff',
            stroke: '#000000', strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5);
        
        this.add.text(width/2, 200, 'Draw & Learn', {
            fontFamily: 'Arial', fontSize: 32, color: '#ffeb3b',
            align: 'center'
        }).setOrigin(0.5);
        
        // Tamil letters display
        this.add.text(width/2, 280, 'அ ஆ இ ஈ உ ஊ', {
            fontFamily: 'Arial', fontSize: 56, color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
        
        // Menu buttons
        this.createMenuButtons(width, height);
        
        EventBus.emit('current-scene-ready', this);
    }
    
    createMenuButtons(width, height) {
        // Play button
        const playButton = this.add.rectangle(width/2, height/2 + 50, 200, 60, 0x4caf50)
            .setInteractive({ useHandCursor: true });
        
        this.add.text(width/2, height/2 + 50, 'Start Learning', {
            fontFamily: 'Arial', fontSize: 24, color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Settings button
        const settingsButton = this.add.rectangle(width/2, height/2 + 130, 200, 50, 0xff9800)
            .setInteractive({ useHandCursor: true });
        
        this.add.text(width/2, height/2 + 130, 'Settings', {
            fontFamily: 'Arial', fontSize: 20, color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // How to Play button
        const howToButton = this.add.rectangle(width/2, height/2 + 190, 200, 50, 0x673ab7)
            .setInteractive({ useHandCursor: true });
        
        this.add.text(width/2, height/2 + 190, 'How to Play', {
            fontFamily: 'Arial', fontSize: 20, color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Button interactions
        playButton.on('pointerdown', () => {
            console.log('🚀 Start Learning button clicked!');
            this.startGame();
        });
        playButton.on('pointerover', () => playButton.setFillStyle(0x45a049));
        playButton.on('pointerout', () => playButton.setFillStyle(0x4caf50));
        
        settingsButton.on('pointerdown', () => this.showSettings());
        settingsButton.on('pointerover', () => settingsButton.setFillStyle(0xf57c00));
        settingsButton.on('pointerout', () => settingsButton.setFillStyle(0xff9800));
        
        howToButton.on('pointerdown', () => this.showHowToPlay());
        howToButton.on('pointerover', () => howToButton.setFillStyle(0x5e35b1));
        howToButton.on('pointerout', () => howToButton.setFillStyle(0x673ab7));
    }

    startGame() {
        console.log('🎯 Starting DifficultySelect scene...');
        try {
            this.scene.start('DifficultySelect', { stage: 1 });
        } catch (error) {
            console.error('❌ Error starting DifficultySelect:', error);
            // Fallback: go directly to Learning scene
            console.log('🔄 Fallback: Starting Learning scene directly...');
            this.scene.start('Learning', { stage: 1, difficulty: 'EASY' });
        }
    }
    
    showSettings() {
        this.scene.start('Settings');
    }
    
    showHowToPlay() {
        // For now, just show an alert with instructions
        // Later we can create a proper HowToPlay scene
        alert('How to Play:\n\n1. Choose your difficulty level\n2. Trace the Tamil letters with your finger\n3. Try to stay close to the outlined path\n4. Complete all letters to see your score!\n\nTip: Start with Easy mode if you\'re new to Tamil letters!');
    }
}
