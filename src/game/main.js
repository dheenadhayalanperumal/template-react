import { Boot } from './scenes/Boot';
import { Game } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { DifficultySelect } from './scenes/DifficultySelect';
import { Learning } from './scenes/Learning';
import { Results } from './scenes/Results';
import { Settings } from './scenes/Settings';
import Phaser from 'phaser';
import { Preloader } from './scenes/Preloader';

// Find out more information about the Game Config at:
// https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#f8f9fa',
    input: {
        activePointers: 3 // Support multi-touch for better mobile experience
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
        MainMenu,
        DifficultySelect,
        Learning,
        Results,
        Settings,
        Game,
        GameOver
    ]
};

const StartGame = (parent) => {

    return new Phaser.Game({ ...config, parent });

}

export default StartGame;
