import { Boot } from './scenes/Boot';
import { Preloader } from './scenes/Preloader';
import { SimpleMainMenu } from './scenes/SimpleMainMenu';
import { SimpleLearning } from './scenes/SimpleLearning';
import Phaser from 'phaser';

// Simple configuration for debugging
const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#f8f9fa',
    input: {
        activePointers: 3
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        min: {
            width: 320,
            height: 240
        },
        max: {
            width: 1024,
            height: 768
        }
    },
    scene: [
        Boot,
        Preloader,
        SimpleMainMenu,
        SimpleLearning
    ]
};

const StartGame = (parent) => {
    console.log('🎮 Starting Tamil Learning Game...');
    
    const game = new Phaser.Game({ ...config, parent });
    
    // Add error handling
    game.events.on('ready', () => {
        console.log('✅ Game initialized successfully');
    });
    
    return game;
}

export default StartGame;