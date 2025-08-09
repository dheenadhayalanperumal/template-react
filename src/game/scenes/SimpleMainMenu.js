import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class SimpleMainMenu extends Scene {
    constructor() {
        super('SimpleMainMenu');
    }

    create() {
        const { width, height } = this.sys.game.config;
        
        console.log('🎮 SimpleMainMenu scene created');
        
        // Simple background
        this.add.rectangle(width/2, height/2, width, height, 0x4a90e2);
        
        // Title
        this.add.text(width/2, 150, 'Tamil Aathichudi', {
            fontFamily: 'Arial', fontSize: '48px', color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.add.text(width/2, 200, 'Draw & Learn', {
            fontFamily: 'Arial', fontSize: '32px', color: '#ffeb3b'
        }).setOrigin(0.5);
        
        // Simple start button
        const startButton = this.add.rectangle(width/2, height/2 + 50, 200, 60, 0x4caf50)
            .setInteractive({ useHandCursor: true });
        
        this.add.text(width/2, height/2 + 50, 'START GAME', {
            fontFamily: 'Arial', fontSize: '20px', color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Button click handler
        startButton.on('pointerdown', () => {
            console.log('🚀 START GAME clicked - going directly to Learning');
            this.scene.start('Learning', { stage: 1, difficulty: 'EASY' });
        });
        
        startButton.on('pointerover', () => {
            startButton.setFillStyle(0x45a049);
        });
        
        startButton.on('pointerout', () => {
            startButton.setFillStyle(0x4caf50);
        });
        
        EventBus.emit('current-scene-ready', this);
    }
}