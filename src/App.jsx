import { useRef } from 'react';
import { PhaserGame } from './PhaserGame';

function App ()
{
    //  References to the PhaserGame component
    const phaserRef = useRef();

    // Event emitted from the PhaserGame component
    const currentScene = (scene) => {
        console.log('✅ Scene loaded successfully:', scene.scene.key);
        
        // Add click debugging for MainMenu
        if (scene.scene.key === 'MainMenu') {
            console.log('🎮 Tamil Learning Game - Main Menu Ready!');
        }
    }

    return (
        <div id="app">
            <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
        </div>
    )
}

export default App
