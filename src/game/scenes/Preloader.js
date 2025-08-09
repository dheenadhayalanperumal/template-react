import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        //  Load the assets for the Tamil learning game
        this.load.setPath('assets');

        // Images
        this.load.image('logo', 'logo.png');
        this.load.image('star', 'star.png');
        
        // Audio files for game sounds
        this.loadGameAudio();
        
        // Audio files for Tamil letter pronunciation
        this.loadTamilPronunciationAudio();
    }
    
    loadGameAudio() {
        // Game sound effects - using placeholder paths
        // In production, these would be actual audio files
        try {
            // Button click sound
            this.load.audio('buttonSound', ['sounds/button_click.mp3', 'sounds/button_click.ogg']);
            
            // Drawing sound (continuous while drawing)
            this.load.audio('drawSound', ['sounds/draw_stroke.mp3', 'sounds/draw_stroke.ogg']);
            
            // Success sound (when letter is traced correctly)
            this.load.audio('successSound', ['sounds/success.mp3', 'sounds/success.ogg']);
            
            // Try again sound (when accuracy is low)
            this.load.audio('tryAgainSound', ['sounds/try_again.mp3', 'sounds/try_again.ogg']);
            
            // Background music
            this.load.audio('bgMusic', ['sounds/background_music.mp3', 'sounds/background_music.ogg']);
            
            // Stage complete sound
            this.load.audio('stageComplete', ['sounds/stage_complete.mp3', 'sounds/stage_complete.ogg']);
            
        } catch (error) {
            console.warn('Audio files not found, game will work without sound:', error);
        }
    }
    
    loadTamilPronunciationAudio() {
        // Tamil letter pronunciation audio files
        // These would be recorded by native Tamil speakers
        
        const tamilLetters = [
            // Uyir Ezhuthukkal (Vowels)
            'அ', 'ஆ', 'இ', 'ஈ', 'உ', 'ஊ', 'எ', 'ஏ', 'ஐ', 'ஒ', 'ஓ', 'ஔ',
            
            // Mei Ezhuthukkal (Consonants) 
            'க்', 'ங்', 'ச்', 'ஞ்', 'ட்', 'ண்', 'த்', 'ந்', 'ப்', 'ம்', 'ய்', 'ர்', 'ல்', 'வ்', 'ழ்', 'ள்', 'ற்', 'ன்',
            
            // Uyirmei Ezhuthukkal (க combinations for demo)
            'க', 'கா', 'கி', 'கீ', 'கு', 'கூ', 'கெ', 'கே', 'கை', 'கொ', 'கோ', 'கௌ'
        ];
        
        try {
            tamilLetters.forEach(letter => {
                // Create safe filename from Tamil letter
                const filename = this.getTamilLetterFilename(letter);
                const audioKey = `pronounce_${letter}`;
                
                this.load.audio(audioKey, [
                    `sounds/tamil/${filename}.mp3`,
                    `sounds/tamil/${filename}.ogg`
                ]);
            });
        } catch (error) {
            console.warn('Tamil pronunciation audio files not found:', error);
        }
    }
    
    getTamilLetterFilename(letter) {
        // Convert Tamil letters to safe filenames
        const letterMap = {
            'அ': 'a', 'ஆ': 'aa', 'இ': 'i', 'ஈ': 'ii', 'உ': 'u', 'ஊ': 'uu',
            'எ': 'e', 'ஏ': 'ee', 'ஐ': 'ai', 'ஒ': 'o', 'ஓ': 'oo', 'ஔ': 'au',
            'க்': 'k', 'ங்': 'ng', 'ச்': 'ch', 'ஞ்': 'nj', 'ட்': 't', 'ண்': 'n',
            'த்': 'th', 'ந்': 'nh', 'ப்': 'p', 'ம்': 'm', 'ய்': 'y', 'ர்': 'r',
            'ல்': 'l', 'வ்': 'v', 'ழ்': 'zh', 'ள்': 'll', 'ற்': 'rr', 'ன்': 'nn',
            'க': 'ka', 'கா': 'kaa', 'கি': 'ki', 'கீ': 'kii', 'கு': 'ku', 'கூ': 'kuu',
            'கெ': 'ke', 'கே': 'kee', 'கை': 'kai', 'கொ': 'ko', 'கோ': 'koo', 'கௌ': 'kau'
        };
        
        return letterMap[letter] || 'unknown';
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
    }
}
