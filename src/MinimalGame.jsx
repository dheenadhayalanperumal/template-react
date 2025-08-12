import { useEffect, useRef } from 'react';
import Phaser from 'phaser';

// Minimal Phaser scene that will definitely work
class MinimalScene extends Phaser.Scene {
    constructor() {
        super('MinimalScene');
    }
    
    create() {
        console.log('✅ Minimal Phaser scene loaded successfully!');
        
        const { width, height } = this.sys.game.config;
        
        // Add resize listener for responsive layout
        this.scale.on('resize', this.handleResize, this);
        
        // Background
        this.add.rectangle(width/2, height/2, width, height, 0x4a90e2);
        
        // Title
        this.add.text(width/2, 150, 'தமிழ் எழுத்துக்கள்', {
            fontSize: '48px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        this.add.text(width/2, 220, 'Draw & Learn', {
            fontSize: '32px',
            fill: '#ffeb3b',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        // Tamil letters
        // this.add.text(width/2, 280, 'உயிர் மற்றும் மெய் எழுத்துக்கள்', {
        //     fontSize: '48px',
        //     fill: '#ffffff',
        //     fontFamily: 'Arial'
        // }).setOrigin(0.5);
        
        // Letter type selection buttons - 4 options in 2x2 grid with proper spacing
        const buttonWidth = 240;
        const buttonHeight = 65;
        const buttonSpacingX = 130;
        const buttonSpacingY = 75;
        const buttonStartY = height/2 + 30; // Move buttons down to avoid title overlap
        
        // Tamil Uyir Eluthu button (top-left)
        const uyirButton = this.add.rectangle(width/2 - buttonSpacingX, buttonStartY - buttonSpacingY, buttonWidth, buttonHeight, 0x4caf50)
            .setInteractive({ useHandCursor: true });
        
        this.add.text(width/2 - buttonSpacingX, buttonStartY - buttonSpacingY, 'உயிர் எழுத்து\n(Tamil Vowels)', {
            fontSize: '15px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5);
        
        // Tamil Uyir Mei Eluthu button (top-right)
        const uyirMeiButton = this.add.rectangle(width/2 + buttonSpacingX, buttonStartY - buttonSpacingY, buttonWidth, buttonHeight, 0x2196f3)
            .setInteractive({ useHandCursor: true });
        
        this.add.text(width/2 + buttonSpacingX, buttonStartY - buttonSpacingY, 'உயிர்மெய் எழுத்து\n(ka, ga, sa...)', {
            fontSize: '15px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5);
        
        // English Capital Letters button (bottom-left)
        const englishCapitalButton = this.add.rectangle(width/2 - buttonSpacingX, buttonStartY + buttonSpacingY, buttonWidth, buttonHeight, 0xff9800)
            .setInteractive({ useHandCursor: true });
        
        this.add.text(width/2 - buttonSpacingX, buttonStartY + buttonSpacingY, 'English Capital\n(A, B, C...)', {
            fontSize: '15px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5);
        
        // English Small Letters button (bottom-right)
        const englishSmallButton = this.add.rectangle(width/2 + buttonSpacingX, buttonStartY + buttonSpacingY, buttonWidth, buttonHeight, 0x9c27b0)
            .setInteractive({ useHandCursor: true });
        
        this.add.text(width/2 + buttonSpacingX, buttonStartY + buttonSpacingY, 'English Small\n(a, b, c...)', {
            fontSize: '15px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5);
        
        // Button interactions for Tamil Uyir
        uyirButton.on('pointerdown', () => {
            console.log('🚀 Tamil Uyir Eluthu selected - starting with vowels');
            this.scene.start('DrawingScene', { letterIndex: 0, letterType: 'uyir' });
        });
        uyirButton.on('pointerover', () => uyirButton.setFillStyle(0x45a049));
        uyirButton.on('pointerout', () => uyirButton.setFillStyle(0x4caf50));
        
        // Button interactions for Tamil Uyir Mei
        uyirMeiButton.on('pointerdown', () => {
            console.log('🚀 Tamil Uyir Mei Eluthu selected - starting with consonant combinations');
            this.scene.start('DrawingScene', { letterIndex: 0, letterType: 'uyirMei' });
        });
        uyirMeiButton.on('pointerover', () => uyirMeiButton.setFillStyle(0x1976d2));
        uyirMeiButton.on('pointerout', () => uyirMeiButton.setFillStyle(0x2196f3));
        
        // Button interactions for English Capital
        englishCapitalButton.on('pointerdown', () => {
            console.log('🚀 English Capital Letters selected - starting with A-Z');
            this.scene.start('DrawingScene', { letterIndex: 0, letterType: 'englishCapital' });
        });
        englishCapitalButton.on('pointerover', () => englishCapitalButton.setFillStyle(0xfb8c00));
        englishCapitalButton.on('pointerout', () => englishCapitalButton.setFillStyle(0xff9800));
        
        // Button interactions for English Small
        englishSmallButton.on('pointerdown', () => {
            console.log('🚀 English Small Letters selected - starting with a-z');
            this.scene.start('DrawingScene', { letterIndex: 0, letterType: 'englishSmall' });
        });
        englishSmallButton.on('pointerover', () => englishSmallButton.setFillStyle(0x7b1fa2));
        englishSmallButton.on('pointerout', () => englishSmallButton.setFillStyle(0x9c27b0));
    }
    
    handleResize(gameSize) {
        const { width, height } = gameSize;
        console.log('🔄 MinimalScene resizing to:', width, 'x', height);
        
        // Clear and recreate all elements with new dimensions
        this.children.removeAll();
        this.create();
    }
}

// Enhanced drawing scene with all Tamil letters
class DrawingScene extends Phaser.Scene {
    constructor() {
        super('DrawingScene');
    }
    
    init(data) {
        // Initialize with letter data
        this.currentLetterIndex = data.letterIndex || 0;
        this.letterType = data.letterType || 'uyir'; // Default to uyir
        this.initializeTamilLetters();
    }
    
    initializeTamilLetters() {
        // Uyir Ezhuthukkal (Vowels) - 12 vowels
        this.uyirLetters = [
            { letter: 'அ', transliteration: 'ah', pronunciation: 'அ', nativeSound: 'அ' },
            { letter: 'ஆ', transliteration: 'aah', pronunciation: 'ஆ', nativeSound: 'ஆ' },
            { letter: 'இ', transliteration: 'ih', pronunciation: 'இ', nativeSound: 'இ' },
            { letter: 'ஈ', transliteration: 'eee', pronunciation: 'ஈ', nativeSound: 'ஈ' },
            { letter: 'உ', transliteration: 'uh', pronunciation: 'உ', nativeSound: 'உ' },
            { letter: 'ஊ', transliteration: 'ooo', pronunciation: 'ஊ', nativeSound: 'ஊ' },
            { letter: 'எ', transliteration: 'eh', pronunciation: 'எ', nativeSound: 'எ' },
            { letter: 'ஏ', transliteration: 'ayy', pronunciation: 'ஏ', nativeSound: 'ஏ' },
            { letter: 'ஐ', transliteration: 'aai', pronunciation: 'ஐ', nativeSound: 'ஐ' },
            { letter: 'ஒ', transliteration: 'oh', pronunciation: 'ஒ', nativeSound: 'ஒ' },
            { letter: 'ஓ', transliteration: 'ohh', pronunciation: 'ஓ', nativeSound: 'ஓ' },
            { letter: 'ஔ', transliteration: 'oww', pronunciation: 'ஔ', nativeSound: 'ஔ' }
        ];
        
        // Uyir Mei Ezhuthukkal (18 Tamil Consonants)
        this.uyirMeiLetters = [
            { letter: 'க', transliteration: 'ka', pronunciation: 'க', nativeSound: 'க' },
            { letter: 'ங', transliteration: 'nga', pronunciation: 'ங', nativeSound: 'ங' },
            { letter: 'ச', transliteration: 'cha', pronunciation: 'ச', nativeSound: 'ச' },
            { letter: 'ஞ', transliteration: 'nya', pronunciation: 'ஞ', nativeSound: 'ஞ' },
            { letter: 'ட', transliteration: 'ta', pronunciation: 'ட', nativeSound: 'ட' },
            { letter: 'ண', transliteration: 'na', pronunciation: 'ண', nativeSound: 'ண' },
            { letter: 'த', transliteration: 'tha', pronunciation: 'த', nativeSound: 'த' },
            { letter: 'ந', transliteration: 'nha', pronunciation: 'ந', nativeSound: 'ந' },
            { letter: 'ப', transliteration: 'pa', pronunciation: 'ப', nativeSound: 'ப' },
            { letter: 'ம', transliteration: 'ma', pronunciation: 'ம', nativeSound: 'ம' },
            { letter: 'ய', transliteration: 'ya', pronunciation: 'ய', nativeSound: 'ய' },
            { letter: 'ர', transliteration: 'ra', pronunciation: 'ர', nativeSound: 'ர' },
            { letter: 'ல', transliteration: 'la', pronunciation: 'ல', nativeSound: 'ல' },
            { letter: 'வ', transliteration: 'va', pronunciation: 'வ', nativeSound: 'வ' },
            { letter: 'ழ', transliteration: 'zha', pronunciation: 'ழ', nativeSound: 'ழ' },
            { letter: 'ள', transliteration: 'lla', pronunciation: 'ள', nativeSound: 'ள' },
            { letter: 'ற', transliteration: 'rra', pronunciation: 'ற', nativeSound: 'ற' },
            { letter: 'ன', transliteration: 'nna', pronunciation: 'ன', nativeSound: 'ன' }
        ];
        
        // English Capital Letters (A-Z)
        this.englishCapitalLetters = [
            { letter: 'A', transliteration: 'A', pronunciation: 'A', nativeSound: 'A' },
            { letter: 'B', transliteration: 'B', pronunciation: 'B', nativeSound: 'B' },
            { letter: 'C', transliteration: 'C', pronunciation: 'C', nativeSound: 'C' },
            { letter: 'D', transliteration: 'D', pronunciation: 'D', nativeSound: 'D' },
            { letter: 'E', transliteration: 'E', pronunciation: 'E', nativeSound: 'E' },
            { letter: 'F', transliteration: 'F', pronunciation: 'F', nativeSound: 'F' },
            { letter: 'G', transliteration: 'G', pronunciation: 'G', nativeSound: 'G' },
            { letter: 'H', transliteration: 'H', pronunciation: 'H', nativeSound: 'H' },
            { letter: 'I', transliteration: 'I', pronunciation: 'I', nativeSound: 'I' },
            { letter: 'J', transliteration: 'J', pronunciation: 'J', nativeSound: 'J' },
            { letter: 'K', transliteration: 'K', pronunciation: 'K', nativeSound: 'K' },
            { letter: 'L', transliteration: 'L', pronunciation: 'L', nativeSound: 'L' },
            { letter: 'M', transliteration: 'M', pronunciation: 'M', nativeSound: 'M' },
            { letter: 'N', transliteration: 'N', pronunciation: 'N', nativeSound: 'N' },
            { letter: 'O', transliteration: 'O', pronunciation: 'O', nativeSound: 'O' },
            { letter: 'P', transliteration: 'P', pronunciation: 'P', nativeSound: 'P' },
            { letter: 'Q', transliteration: 'Q', pronunciation: 'Q', nativeSound: 'Q' },
            { letter: 'R', transliteration: 'R', pronunciation: 'R', nativeSound: 'R' },
            { letter: 'S', transliteration: 'S', pronunciation: 'S', nativeSound: 'S' },
            { letter: 'T', transliteration: 'T', pronunciation: 'T', nativeSound: 'T' },
            { letter: 'U', transliteration: 'U', pronunciation: 'U', nativeSound: 'U' },
            { letter: 'V', transliteration: 'V', pronunciation: 'V', nativeSound: 'V' },
            { letter: 'W', transliteration: 'W', pronunciation: 'W', nativeSound: 'W' },
            { letter: 'X', transliteration: 'X', pronunciation: 'X', nativeSound: 'X' },
            { letter: 'Y', transliteration: 'Y', pronunciation: 'Y', nativeSound: 'Y' },
            { letter: 'Z', transliteration: 'Z', pronunciation: 'Z', nativeSound: 'Z' }
        ];
        
        // English Small Letters (a-z)
        this.englishSmallLetters = [
            { letter: 'a', transliteration: 'a', pronunciation: 'a', nativeSound: 'a' },
            { letter: 'b', transliteration: 'b', pronunciation: 'b', nativeSound: 'b' },
            { letter: 'c', transliteration: 'c', pronunciation: 'c', nativeSound: 'c' },
            { letter: 'd', transliteration: 'd', pronunciation: 'd', nativeSound: 'd' },
            { letter: 'e', transliteration: 'e', pronunciation: 'e', nativeSound: 'e' },
            { letter: 'f', transliteration: 'f', pronunciation: 'f', nativeSound: 'f' },
            { letter: 'g', transliteration: 'g', pronunciation: 'g', nativeSound: 'g' },
            { letter: 'h', transliteration: 'h', pronunciation: 'h', nativeSound: 'h' },
            { letter: 'i', transliteration: 'i', pronunciation: 'i', nativeSound: 'i' },
            { letter: 'j', transliteration: 'j', pronunciation: 'j', nativeSound: 'j' },
            { letter: 'k', transliteration: 'k', pronunciation: 'k', nativeSound: 'k' },
            { letter: 'l', transliteration: 'l', pronunciation: 'l', nativeSound: 'l' },
            { letter: 'm', transliteration: 'm', pronunciation: 'm', nativeSound: 'm' },
            { letter: 'n', transliteration: 'n', pronunciation: 'n', nativeSound: 'n' },
            { letter: 'o', transliteration: 'o', pronunciation: 'o', nativeSound: 'o' },
            { letter: 'p', transliteration: 'p', pronunciation: 'p', nativeSound: 'p' },
            { letter: 'q', transliteration: 'q', pronunciation: 'q', nativeSound: 'q' },
            { letter: 'r', transliteration: 'r', pronunciation: 'r', nativeSound: 'r' },
            { letter: 's', transliteration: 's', pronunciation: 's', nativeSound: 's' },
            { letter: 't', transliteration: 't', pronunciation: 't', nativeSound: 't' },
            { letter: 'u', transliteration: 'u', pronunciation: 'u', nativeSound: 'u' },
            { letter: 'v', transliteration: 'v', pronunciation: 'v', nativeSound: 'v' },
            { letter: 'w', transliteration: 'w', pronunciation: 'w', nativeSound: 'w' },
            { letter: 'x', transliteration: 'x', pronunciation: 'x', nativeSound: 'x' },
            { letter: 'y', transliteration: 'y', pronunciation: 'y', nativeSound: 'y' },
            { letter: 'z', transliteration: 'z', pronunciation: 'z', nativeSound: 'z' }
        ];
        
        // Set the appropriate letter array based on selection
        if (this.letterType === 'uyir') {
            this.tamilLetters = this.uyirLetters;
        } else if (this.letterType === 'uyirMei') {
            this.tamilLetters = this.uyirMeiLetters;
        } else if (this.letterType === 'englishCapital') {
            this.tamilLetters = this.englishCapitalLetters;
        } else if (this.letterType === 'englishSmall') {
            this.tamilLetters = this.englishSmallLetters;
        }
    }
    
    create() {
        console.log('✅ Drawing scene loaded! Letter:', this.currentLetterIndex + 1);
        
        const { width, height } = this.sys.game.config;
        
        // Add resize listener for responsive layout
        this.scale.on('resize', this.handleResize, this);
        
        // Consistent mobile detection with game config
        this.isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        console.log('📱 Mobile device detected:', this.isMobile, 'Screen:', window.innerWidth, 'x', window.innerHeight, 'Game:', width, 'x', height);
        
        // Background
        this.add.rectangle(width/2, height/2, width, height, 0xf8f9fa);
        
        // Current letter data
        this.currentLetter = this.tamilLetters[this.currentLetterIndex];
        
        // Responsive header sizing
        const titleSize = this.isMobile ? '18px' : '24px';  // Appropriate sizes for each device
        const progressSize = this.isMobile ? '14px' : '18px';  // Readable progress text
        const topY = this.isMobile ? 15 : 30;  // Proper spacing from top
        
        // Title based on letter type
        let titleText = 'Trace the Letter';
        if (this.letterType === 'uyir') titleText = 'Trace the Tamil Vowel';
        else if (this.letterType === 'uyirMei') titleText = 'Trace the Tamil Letter';
        else if (this.letterType === 'englishCapital') titleText = 'Trace the Capital Letter';
        else if (this.letterType === 'englishSmall') titleText = 'Trace the Small Letter';
        
        this.add.text(width/2, topY, titleText, {
            fontSize: titleSize,
            fill: '#4a90e2',  // Blue text instead of white background
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Progress indicator right below title - tighter spacing on mobile
        const progressSpacing = this.isMobile ? 18 : 25;  // Tighter spacing on mobile
        let letterTypeText = 'Letter';
        if (this.letterType === 'uyir') letterTypeText = 'Vowel';
        else if (this.letterType === 'uyirMei') letterTypeText = 'Letter';
        else if (this.letterType === 'englishCapital') letterTypeText = 'Capital';
        else if (this.letterType === 'englishSmall') letterTypeText = 'Letter';
        
        this.add.text(width/2, topY + progressSpacing, `${letterTypeText} ${this.currentLetterIndex + 1} of ${this.tamilLetters.length}`, {
            fontSize: progressSize,
            fill: '#666666',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        // Responsive letter sizing that takes advantage of available space
        const letterSize = this.isMobile ? '500px' : '400px';  // Larger desktop size to fill space better
        const strokeThickness = this.isMobile ? 6 : 6;  // Same thick stroke for both
        const letterYOffset = this.isMobile ? -100 : -100;  // Moved much higher to ensure full letter visibility
        
        // Use consistent Arial font for all letter types
        const fontFamily = 'Arial';
        
        // Letter outline (black stroke, no fill) - RESPONSIVE TEXT with adjusted origin
        this.letterText = this.add.text(width/2, height/2 + letterYOffset, this.currentLetter.letter, {
            fontSize: letterSize,
            fontFamily: fontFamily,
            stroke: '#000000',
            strokeThickness: strokeThickness,
            fill: 'transparent',  // No fill color
            align: 'center',
            baseline: 'middle'
        }).setOrigin(0.5, 0.4);  // Adjusted Y origin to account for Tamil letter descenders
        
        // Guide lines removed for cleaner letter display
        
        // Audio system disabled per user request
        
        // Responsive bottom text positioning
        const pronunciationSize = this.isMobile ? '16px' : '20px';  // Readable sizes
        const instructionSize = this.isMobile ? '14px' : '16px';    // Clear instructions
        const pronunciationY = height/2 + (this.isMobile ? 200 : 150);  // Proportional positioning
        const instructionY = height/2 + (this.isMobile ? 220 : 180);    // Proper spacing
        
        // Letter pronunciation and sound button hidden per user request
        
        // Removed test buttons - will use custom voice files
        
        // Drawing area (restricted to letter bounds)
        this.drawingGraphics = this.add.graphics();
        this.isDrawing = false;
        this.drawingPoints = [];
        
        // Instructions hidden per user request
        
        // Setup drawing with bounds checking
        this.setupRestrictedDrawing();
        
        // Bottom buttons
        this.createButtons(width, height);
    }
    
    initializeTamilVoices() {
        // Initialize Tamil voices with comprehensive debugging
        console.log('🔊 Initializing Tamil voice system...');
        
        if (!window.speechSynthesis) {
            console.warn('❌ Speech synthesis not supported in this browser');
            return;
        }
        
        // Force voices to load by creating a dummy utterance
        const testUtterance = new SpeechSynthesisUtterance('');
        window.speechSynthesis.speak(testUtterance);
        window.speechSynthesis.cancel();
        
        // Get available voices
        let voices = window.speechSynthesis.getVoices();
        console.log('🔊 Initial voices count:', voices.length);
        
        if (voices.length === 0) {
            console.log('🔊 Waiting for voices to load...');
            // Voices not loaded yet, set up listener
            window.speechSynthesis.onvoiceschanged = () => {
                voices = window.speechSynthesis.getVoices();
                console.log('🔊 Voices loaded count:', voices.length);
                
                // Log all available voices for debugging
                console.log('🔊 All available voices:');
                voices.forEach((voice, index) => {
                    console.log(`  ${index}: ${voice.name} (${voice.lang})`);
                });
                
                // Find Tamil voices
                const tamilVoices = voices.filter(voice => 
                    voice.lang.includes('ta') || 
                    voice.name.toLowerCase().includes('tamil')
                );
                
                if (tamilVoices.length > 0) {
                    console.log('🔊 Tamil voices found:', tamilVoices.map(v => `${v.name} (${v.lang})`));
                } else {
                    console.log('🔊 No Tamil voices found, will use system default');
                }
                
                // Find Indian voices as fallback
                const indianVoices = voices.filter(voice => 
                    voice.lang.includes('hi-IN') || 
                    voice.lang.includes('en-IN') ||
                    voice.name.toLowerCase().includes('india')
                );
                
                if (indianVoices.length > 0) {
                    console.log('🔊 Indian voices found as fallback:', indianVoices.map(v => `${v.name} (${v.lang})`));
                }
            };
        } else {
            // Voices already loaded
            console.log('🔊 Voices already available:', voices.length);
            
            // Log all voices for debugging
            voices.forEach((voice, index) => {
                console.log(`  ${index}: ${voice.name} (${voice.lang})`);
            });
            
            const tamilVoices = voices.filter(voice => 
                voice.lang.includes('ta') || 
                voice.name.toLowerCase().includes('tamil')
            );
            
            if (tamilVoices.length > 0) {
                console.log('🔊 Tamil voices ready:', tamilVoices.map(v => `${v.name} (${v.lang})`));
            }
        }
    }
    
    playLetterSound() {
        // Play Tamil letter pronunciation using custom audio files
        console.log('🔊 Playing custom audio for letter:', this.currentLetter.letter);
        
        try {
            // Stop any currently playing audio
            if (this.currentAudio) {
                this.currentAudio.pause();
                this.currentAudio.currentTime = 0;
            }
            
            // Generate audio file path based on letter
            const audioFileName = this.getAudioFileName(this.currentLetter.letter);
            const audioPath = `/audio/tamil/${audioFileName}`;
            
            console.log('🔊 Loading audio file:', audioPath);
            
            // Create and play audio
            this.currentAudio = new Audio(audioPath);
            this.currentAudio.volume = 0.8;
            
            // Add event listeners
            this.currentAudio.onloadstart = () => {
                console.log('🔊 Loading audio file...');
            };
            
            this.currentAudio.oncanplaythrough = () => {
                console.log('🔊 Audio loaded successfully, playing...');
            };
            
            this.currentAudio.onplay = () => {
                console.log('🔊 Audio playback started');
            };
            
            this.currentAudio.onended = () => {
                console.log('🔊 Audio playback ended');
            };
            
            this.currentAudio.onerror = (error) => {
                console.warn('❌ Audio file not found:', audioPath);
                console.log('🔊 Please add audio file:', audioFileName);
                this.showAudioFallback();
            };
            
            // Play the audio
            this.currentAudio.play().catch(error => {
                console.error('❌ Audio playback failed:', error);
                this.showAudioFallback();
            });
            
        } catch (error) {
            console.error('❌ Audio system error:', error);
            this.showAudioFallback();
        }
    }
    
    getAudioFileName(tamilLetter) {
        // Convert Tamil letters to audio file names
        const letterToFile = {
            // Vowels
            'அ': 'a.mp3',
            'ஆ': 'aa.mp3', 
            'இ': 'i.mp3',
            'ஈ': 'ii.mp3',
            'உ': 'u.mp3',
            'ஊ': 'uu.mp3',
            'எ': 'e.mp3',
            'ஏ': 'ee.mp3',
            'ஐ': 'ai.mp3',
            'ஒ': 'o.mp3',
            'ஓ': 'oo.mp3',
            'ஔ': 'au.mp3',
            
            // Uyir Mei (18 Tamil Consonants)
            'க': 'ka.mp3',
            'ங': 'nga.mp3',
            'ச': 'cha.mp3',
            'ஞ': 'nya.mp3',
            'ட': 'ta.mp3',
            'ண': 'na.mp3',
            'த': 'tha.mp3',
            'ந': 'nha.mp3',
            'ப': 'pa.mp3',
            'ம': 'ma.mp3',
            'ய': 'ya.mp3',
            'ர': 'ra.mp3',
            'ல': 'la.mp3',
            'வ': 'va.mp3',
            'ழ': 'zha.mp3',
            'ள': 'lla.mp3',
            'ற': 'rra.mp3',
            'ன': 'nna.mp3',
            
            // English Capital Letters
            'A': 'A.mp3',
            'B': 'B.mp3',
            'C': 'C.mp3',
            'D': 'D.mp3',
            'E': 'E.mp3',
            'F': 'F.mp3',
            'G': 'G.mp3',
            'H': 'H.mp3',
            'I': 'I.mp3',
            'J': 'J.mp3',
            'K': 'K.mp3',
            'L': 'L.mp3',
            'M': 'M.mp3',
            'N': 'N.mp3',
            'O': 'O.mp3',
            'P': 'P.mp3',
            'Q': 'Q.mp3',
            'R': 'R.mp3',
            'S': 'S.mp3',
            'T': 'T.mp3',
            'U': 'U.mp3',
            'V': 'V.mp3',
            'W': 'W.mp3',
            'X': 'X.mp3',
            'Y': 'Y.mp3',
            'Z': 'Z.mp3',
            
            // English Small Letters
            'a': 'a-small.mp3',
            'b': 'b-small.mp3',
            'c': 'c-small.mp3',
            'd': 'd-small.mp3',
            'e': 'e-small.mp3',
            'f': 'f-small.mp3',
            'g': 'g-small.mp3',
            'h': 'h-small.mp3',
            'i': 'i-small.mp3',
            'j': 'j-small.mp3',
            'k': 'k-small.mp3',
            'l': 'l-small.mp3',
            'm': 'm-small.mp3',
            'n': 'n-small.mp3',
            'o': 'o-small.mp3',
            'p': 'p-small.mp3',
            'q': 'q-small.mp3',
            'r': 'r-small.mp3',
            's': 's-small.mp3',
            't': 't-small.mp3',
            'u': 'u-small.mp3',
            'v': 'v-small.mp3',
            'w': 'w-small.mp3',
            'x': 'x-small.mp3',
            'y': 'y-small.mp3',
            'z': 'z-small.mp3'
        };
        
        return letterToFile[tamilLetter] || 'default.mp3';
    }
    
    showAudioFallback() {
        // Visual feedback when audio is not available
        const { width, height } = this.sys.game.config;
        
        const audioIcon = this.add.text(width - 50, 50, '🔊', {
            fontSize: '24px'
        });
        
        // Animate the audio icon
        this.tweens.add({
            targets: audioIcon,
            scaleX: 1.3,
            scaleY: 1.3,
            duration: 200,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                this.time.delayedCall(1000, () => {
                    audioIcon.destroy();
                });
            }
        });
    }
    
    createLetterGuideLines() {
        // Create dotted guide lines inside the letter for better tracing guidance
        const letterBounds = this.letterText.getBounds();
        const { width, height } = this.sys.game.config;
        
        // Create graphics for guide lines
        this.guideGraphics = this.add.graphics();
        
        // Different guide patterns for different letters
        const letter = this.currentLetter.letter;
        
        // Define guide lines for common Tamil letters
        this.createGuidePattern(letter, letterBounds);
    }
    
    createGuidePattern(letter, letterBounds) {
        const centerX = letterBounds.x + letterBounds.width / 2;
        const centerY = letterBounds.y + letterBounds.height / 2;
        
        // Dotted line style for guides - thinner and more subtle
        this.guideGraphics.lineStyle(1, 0x888888, 0.5);
        
        // Calculate stroke thickness (approximate 6px from letter strokeThickness)
        const strokeOffset = 3; // Half of stroke thickness to position inside the stroke
        
        // Letter-specific guide patterns that follow the actual stroke paths
        switch(letter) {
            case 'அ': // 'a' - Tamil letter with vertical and horizontal elements
                // Left vertical stroke guide (inside the stroke)
                this.drawDottedLine(centerX - 50, centerY - 70, centerX - 50, centerY + 30);
                // Horizontal connecting stroke guide
                this.drawDottedLine(centerX - 50, centerY - 30, centerX + 30, centerY - 30);
                // Right curved element guide
                this.drawDottedCurve(centerX + 30, centerY - 30, centerX + 40, centerY - 10, centerX + 30, centerY + 10);
                break;
                
            case 'ஆ': // 'aa' - has distinctive curved shape
                // Main vertical stroke guide
                this.drawDottedLine(centerX - 70, centerY - 70, centerX - 70, centerY + 50);
                // Top horizontal guide
                this.drawDottedLine(centerX - 70, centerY - 50, centerX - 30, centerY - 50);
                // Curved connecting element guide
                this.drawDottedCurve(centerX - 30, centerY - 30, centerX + 10, centerY - 20, centerX + 30, centerY + 10);
                break;
                
            case 'இ': // 'i' - simpler curved shape
                // Top curved element guide
                this.drawDottedCurve(centerX - 30, centerY - 50, centerX, centerY - 65, centerX + 30, centerY - 50);
                // Central vertical guide
                this.drawDottedLine(centerX, centerY - 45, centerX, centerY + 30);
                // Bottom connecting guide
                this.drawDottedLine(centerX - 20, centerY + 20, centerX + 20, centerY + 20);
                break;
                
            case 'ஈ': // 'ii' - similar to இ but with additional elements
                // Top curved guide
                this.drawDottedCurve(centerX - 35, centerY - 55, centerX, centerY - 70, centerX + 35, centerY - 55);
                // Central vertical guide
                this.drawDottedLine(centerX, centerY - 50, centerX, centerY + 35);
                // Additional horizontal guides
                this.drawDottedLine(centerX - 25, centerY - 20, centerX + 25, centerY - 20);
                this.drawDottedLine(centerX - 30, centerY + 25, centerX + 30, centerY + 25);
                break;
                
            case 'உ': // 'u' - curved shape
                // Main curved body guide
                this.drawDottedCurve(centerX - 40, centerY - 40, centerX, centerY + 20, centerX + 40, centerY - 40);
                // Central connecting guide
                this.drawDottedLine(centerX, centerY - 30, centerX, centerY + 10);
                break;
                
            case 'ஊ': // 'uu' - similar to உ with additions
                // Main curved guide
                this.drawDottedCurve(centerX - 45, centerY - 45, centerX, centerY + 25, centerX + 45, centerY - 45);
                // Central vertical guide
                this.drawDottedLine(centerX, centerY - 35, centerX, centerY + 15);
                // Additional curved element
                this.drawDottedCurve(centerX - 30, centerY + 10, centerX, centerY + 30, centerX + 30, centerY + 10);
                break;
                
            case 'க': // 'k' - consonant with horizontal and vertical elements
                // Top horizontal stroke guide (inside the stroke)
                this.drawDottedLine(centerX - 50, centerY - 50, centerX + 50, centerY - 50);
                // Left vertical stroke guide
                this.drawDottedLine(centerX - 15, centerY - 50, centerX - 15, centerY + 30);
                // Right connecting element guide
                this.drawDottedLine(centerX + 20, centerY - 30, centerX + 35, centerY - 15);
                break;
                
            case 'ங': // 'ng' - curved consonant
                // Main curved guide
                this.drawDottedCurve(centerX - 40, centerY - 30, centerX, centerY + 20, centerX + 40, centerY - 30);
                // Central vertical guide
                this.drawDottedLine(centerX, centerY - 20, centerX, centerY + 40);
                break;
                
            default:
                // Enhanced generic pattern that follows stroke-like paths
                // Instead of simple cross, create more natural stroke guides
                
                // Main horizontal stroke guide (positioned like actual letter strokes)
                this.drawDottedLine(
                    letterBounds.x + 40, 
                    centerY - 20, 
                    letterBounds.x + letterBounds.width - 40, 
                    centerY - 20
                );
                
                // Main vertical stroke guide
                this.drawDottedLine(
                    centerX - 15, 
                    letterBounds.y + 40, 
                    centerX - 15, 
                    letterBounds.y + letterBounds.height - 40
                );
                
                // Additional connecting guides for complex letters
                this.drawDottedLine(
                    centerX + 20, 
                    centerY - 40, 
                    centerX + 20, 
                    centerY + 20
                );
                break;
        }
    }
    
    drawDottedLine(x1, y1, x2, y2) {
        const distance = Phaser.Math.Distance.Between(x1, y1, x2, y2);
        const segments = Math.floor(distance / 8); // 8px segments with gaps
        
        for (let i = 0; i < segments; i += 2) { // Every other segment to create dots
            const t1 = i / segments;
            const t2 = Math.min((i + 1) / segments, 1);
            
            const startX = x1 + (x2 - x1) * t1;
            const startY = y1 + (y2 - y1) * t1;
            const endX = x1 + (x2 - x1) * t2;
            const endY = y1 + (y2 - y1) * t2;
            
            this.guideGraphics.beginPath();
            this.guideGraphics.moveTo(startX, startY);
            this.guideGraphics.lineTo(endX, endY);
            this.guideGraphics.strokePath();
        }
    }
    
    drawDottedCurve(x1, y1, cpX, cpY, x2, y2) {
        // Create a dotted curved guide line using quadratic curve
        const segments = 20;
        
        for (let i = 0; i < segments; i += 2) { // Every other segment for dots
            const t1 = i / segments;
            const t2 = Math.min((i + 1) / segments, 1);
            
            // Quadratic Bezier curve formula
            const startX = Math.pow(1-t1, 2) * x1 + 2*(1-t1)*t1 * cpX + Math.pow(t1, 2) * x2;
            const startY = Math.pow(1-t1, 2) * y1 + 2*(1-t1)*t1 * cpY + Math.pow(t1, 2) * y2;
            const endX = Math.pow(1-t2, 2) * x1 + 2*(1-t2)*t2 * cpX + Math.pow(t2, 2) * x2;
            const endY = Math.pow(1-t2, 2) * y1 + 2*(1-t2)*t2 * cpY + Math.pow(t2, 2) * y2;
            
            this.guideGraphics.beginPath();
            this.guideGraphics.moveTo(startX, startY);
            this.guideGraphics.lineTo(endX, endY);
            this.guideGraphics.strokePath();
        }
    }

    setupRestrictedDrawing() {
        this.input.on('pointerdown', (pointer) => {
            if (this.isInsideLetterBounds(pointer.x, pointer.y)) {
                console.log('✏️ Started drawing inside letter bounds');
                this.isDrawing = true;
                this.drawingPoints = [{ x: pointer.x, y: pointer.y }];
                // Responsive paint brush line thickness
                const brushSize = this.isMobile ? 10 : 12;  // Slightly thinner on mobile for precision
                this.drawingGraphics.lineStyle(brushSize, 0x2196f3, 0.8);  // Thick blue brush with slight transparency
                this.drawingGraphics.beginPath();
                this.drawingGraphics.moveTo(pointer.x, pointer.y);
            } else {
                console.log('❌ Drawing outside letter bounds - not allowed');
                this.showOutOfBoundsWarning();
            }
        });
        
        this.input.on('pointermove', (pointer) => {
            if (this.isDrawing) {
                if (this.isInsideLetterBounds(pointer.x, pointer.y)) {
                    this.drawingPoints.push({ x: pointer.x, y: pointer.y });
                    this.drawingGraphics.lineTo(pointer.x, pointer.y);
                    this.drawingGraphics.strokePath();
                } else {
                    // Stop drawing when going outside bounds
                    this.isDrawing = false;
                    this.showOutOfBoundsWarning();
                }
            }
        });
        
        this.input.on('pointerup', () => {
            if (this.isDrawing) {
                console.log('✏️ Finished drawing');
                this.isDrawing = false;
                this.enableNextButton();
            }
        });
    }
    
    isInsideLetterBounds(x, y) {
        // Get letter bounds (approximate)
        const letterBounds = this.letterText.getBounds();
        // Much larger playable area for easier tracing
        const margin = this.isMobile ? 80 : 60;  // Significantly increased playable area 
        
        return (
            x >= letterBounds.x - margin &&
            x <= letterBounds.x + letterBounds.width + margin &&
            y >= letterBounds.y - margin &&
            y <= letterBounds.y + letterBounds.height + margin
        );
    }
    
    showOutOfBoundsWarning() {
        // Remove previous warning
        if (this.warningText) {
            this.warningText.destroy();
        }
        
        this.warningText = this.add.text(this.sys.game.config.width/2, 180, 'Stay inside the letter!', {
            fontSize: '24px',
            fill: '#ff5722',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Auto-hide warning
        this.time.delayedCall(1500, () => {
            if (this.warningText) {
                this.warningText.destroy();
                this.warningText = null;
            }
        });
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    enableNextButton() {
        if (this.nextButton && this.nextButtonText) {
            this.nextButton.setVisible(true);
            this.nextButtonText.setVisible(true);
            
            // Add hover effects for Next button
            const { width, height } = this.sys.game.config;
            const nextButtonWidth = this.isMobile ? 180 : 200;
            const buttonHeight = this.isMobile ? 85 : 90;
            const buttonY = height - (this.isMobile ? 55 : 60);
            
            this.nextButton.on('pointerover', () => {
                this.nextButton.clear().fillStyle(0x00f2c3).fillRoundedRect(width/2 - nextButtonWidth/2, buttonY - buttonHeight/2, nextButtonWidth, buttonHeight, 15);
            });
            this.nextButton.on('pointerout', () => {
                this.nextButton.clear().fillStyle(0x00d4aa).fillRoundedRect(width/2 - nextButtonWidth/2, buttonY - buttonHeight/2, nextButtonWidth, buttonHeight, 15);
            });
            
        }
    }
    
    createButtons(width, height) {
        // Larger buttons for better usability
        const buttonHeight = this.isMobile ? 85 : 90;   // Increased height for easier tapping
        const buttonWidth = this.isMobile ? 110 : 120;  // Increased width for better visibility
        const nextButtonWidth = this.isMobile ? 180 : 200; // Larger next button
        const fontSize = this.isMobile ? '28px' : '32px';  // Larger font for better readability
        const buttonY = height - (this.isMobile ? 55 : 60);  // More space from edge for larger buttons
        const sideButtonSpacing = this.isMobile ? 85 : 100;   // More spacing for larger buttons
        
        // Clear button - left bottom corner with rounded corners
        const clearButton = this.add.graphics()
            .fillStyle(0xffd93d)  // Bright yellow color
            .fillRoundedRect(sideButtonSpacing - buttonWidth/2, buttonY - buttonHeight/2, buttonWidth, buttonHeight, 15)
            .setInteractive(new Phaser.Geom.Rectangle(sideButtonSpacing - buttonWidth/2, buttonY - buttonHeight/2, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains);
        
        this.add.text(sideButtonSpacing, buttonY, 'Clear', {
            fontSize: fontSize,
            fill: '#333333',  // Dark text on bright background
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Next button (initially hidden) - center bottom with rounded corners
        this.nextButton = this.add.graphics()
            .fillStyle(0x00d4aa)  // Bright teal/mint green
            .fillRoundedRect(width/2 - nextButtonWidth/2, buttonY - buttonHeight/2, nextButtonWidth, buttonHeight, 15)
            .setInteractive(new Phaser.Geom.Rectangle(width/2 - nextButtonWidth/2, buttonY - buttonHeight/2, nextButtonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains)
            .setVisible(false);
        
        this.nextButtonText = this.add.text(width/2, buttonY, 'Next Letter', {
            fontSize: fontSize,
            fill: '#ffffff',  // White text on teal background
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5).setVisible(false);
        
        // Menu button - right bottom corner with rounded corners
        const menuButton = this.add.graphics()
            .fillStyle(0xff6b9d)  // Bright pink/magenta
            .fillRoundedRect(width - sideButtonSpacing - buttonWidth/2, buttonY - buttonHeight/2, buttonWidth, buttonHeight, 15)
            .setInteractive(new Phaser.Geom.Rectangle(width - sideButtonSpacing - buttonWidth/2, buttonY - buttonHeight/2, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains);
        
        this.add.text(width - sideButtonSpacing, buttonY, 'Menu', {
            fontSize: fontSize,
            fill: '#ffffff',  // White text on pink background
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Button hover effects for Clear button
        clearButton.on('pointerover', () => {
            clearButton.clear().fillStyle(0xffed4a).fillRoundedRect(sideButtonSpacing - buttonWidth/2, buttonY - buttonHeight/2, buttonWidth, buttonHeight, 15);
        });
        clearButton.on('pointerout', () => {
            clearButton.clear().fillStyle(0xffd93d).fillRoundedRect(sideButtonSpacing - buttonWidth/2, buttonY - buttonHeight/2, buttonWidth, buttonHeight, 15);
        });
        
        // Button events
        clearButton.on('pointerdown', () => {
            console.log('🗑️ Clear drawing');
            this.drawingGraphics.clear();
            this.drawingPoints = [];
            
            // No guide lines to recreate
            
            // Hide next button until tracing is complete again
            this.nextButton.setVisible(false);
            this.nextButtonText.setVisible(false);
            
            // Clear warning
            if (this.warningText) {
                this.warningText.destroy();
                this.warningText = null;
            }
        });
        
        this.nextButton.on('pointerdown', () => {
            console.log('➡️ Next letter');
            this.goToNextLetter();
        });
        
        // Button hover effects for Menu button
        menuButton.on('pointerover', () => {
            menuButton.clear().fillStyle(0xff85b3).fillRoundedRect(width - sideButtonSpacing - buttonWidth/2, buttonY - buttonHeight/2, buttonWidth, buttonHeight, 15);
        });
        menuButton.on('pointerout', () => {
            menuButton.clear().fillStyle(0xff6b9d).fillRoundedRect(width - sideButtonSpacing - buttonWidth/2, buttonY - buttonHeight/2, buttonWidth, buttonHeight, 15);
        });
        
        menuButton.on('pointerdown', () => {
            console.log('🏠 Back to menu');
            this.scene.start('MinimalScene');
        });
    }
    
    goToNextLetter() {
        const nextIndex = this.currentLetterIndex + 1;
        
        if (nextIndex >= this.tamilLetters.length) {
            // All letters completed!
            this.showCompletionScreen();
        } else {
            // Go to next letter
            console.log(`📝 Moving to letter ${nextIndex + 1}: ${this.tamilLetters[nextIndex].letter}`);
            this.scene.restart({ letterIndex: nextIndex, letterType: this.letterType });
        }
    }
    
    showCompletionScreen() {
        const { width, height } = this.sys.game.config;
        
        // Clear everything
        this.children.removeAll();
        
        // Completion background
        this.add.rectangle(width/2, height/2, width, height, 0x4a90e2);
        
        // Congratulations message
        this.add.text(width/2, height/2 - 100, '🎉 Congratulations! 🎉', {
            fontSize: '48px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        let completionText = 'You completed all letters!';
        if (this.letterType === 'uyir') completionText = 'You completed all Tamil vowels!';
        else if (this.letterType === 'uyirMei') completionText = 'You completed all Tamil letters!';
        else if (this.letterType === 'englishCapital') completionText = 'You completed all capital letters!';
        else if (this.letterType === 'englishSmall') completionText = 'You completed all small letters!';
        
        this.add.text(width/2, height/2 - 40, completionText, {
            fontSize: '28px',
            fill: '#ffeb3b',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        // Show some completed letters based on type
        let sampleLetters = 'அ ஆ இ ஈ உ ஊ எ ஏ ஐ ஒ ஓ ஔ';
        if (this.letterType === 'uyir') sampleLetters = 'அ ஆ இ ஈ உ ஊ எ ஏ ஐ ஒ ஓ ஔ';
        else if (this.letterType === 'uyirMei') sampleLetters = 'க ங ச ஞ ட ண த ந ப ம ய ர';
        else if (this.letterType === 'englishCapital') sampleLetters = 'A B C D E F G H I J K L';
        else if (this.letterType === 'englishSmall') sampleLetters = 'a b c d e f g h i j k l';
        
        this.add.text(width/2, height/2 + 20, sampleLetters, {
            fontSize: '36px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        // Play again button
        const playAgainButton = this.add.rectangle(width/2, height/2 + 100, 200, 60, 0x4caf50)
            .setInteractive({ useHandCursor: true });
        
        this.add.text(width/2, height/2 + 100, 'Play Again', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        playAgainButton.on('pointerdown', () => {
            console.log('🔄 Restarting game');
            this.scene.start('MinimalScene');
        });
    }
    
    handleResize(gameSize) {
        const { width, height } = gameSize;
        console.log('🔄 DrawingScene resizing to:', width, 'x', height);
        
        // Store current state
        const currentLetterIndex = this.currentLetterIndex;
        const letterType = this.letterType;
        const drawingPoints = this.drawingPoints ? [...this.drawingPoints] : [];
        const isEvaluating = this.isEvaluating;
        
        // Clear and recreate all elements with new dimensions
        this.children.removeAll();
        
        // Reinitialize with current state
        this.currentLetterIndex = currentLetterIndex;
        this.letterType = letterType;
        this.drawingPoints = drawingPoints;
        this.isEvaluating = isEvaluating;
        
        this.create();
    }
}

// Smart responsive game configuration that fills available space properly
const getGameConfig = () => {
    const isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Use full viewport for mobile, much larger size for desktop to fill available space
    const gameWidth = isMobile ? window.innerWidth : Math.min(window.innerWidth * 0.95, 1400);
    const gameHeight = isMobile ? window.innerHeight : Math.min(window.innerHeight * 0.95, 900);
    
    return {
        type: Phaser.AUTO,
        width: gameWidth,
        height: gameHeight,
        backgroundColor: '#f8f9fa',
        parent: 'minimal-game',
        scale: {
            mode: isMobile ? Phaser.Scale.RESIZE : Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            min: {
                width: 320,
                height: 240
            },
            max: {
                width: isMobile ? window.innerWidth : 1400,
                height: isMobile ? window.innerHeight : 900
            }
        },
        input: {
            activePointers: 3,
            smoothFactor: 0.2
        },
        scene: [MinimalScene, DrawingScene]
    };
};

export default function MinimalGame() {
    const gameRef = useRef();
    
    useEffect(() => {
        console.log('🎮 Initializing fully responsive Phaser game...');
        
        try {
            const gameConfig = getGameConfig();
            const game = new Phaser.Game(gameConfig);
            gameRef.current = game;
            
            console.log('✅ Responsive game created successfully');
            
            // Handle window resize and orientation changes
            const handleResize = () => {
                console.log('📱 Device resized/rotated - updating game dimensions');
                if (gameRef.current && gameRef.current.scale) {
                    // Update game size to match new viewport dimensions
                    gameRef.current.scale.resize(window.innerWidth, window.innerHeight);
                }
            };
            
            const handleOrientationChange = () => {
                // Small delay to allow orientation change to complete
                setTimeout(() => {
                    console.log('🔄 Orientation changed - updating game layout');
                    handleResize();
                }, 100);
            };
            
            // Add event listeners for responsiveness
            window.addEventListener('resize', handleResize);
            window.addEventListener('orientationchange', handleOrientationChange);
            
            // Also listen for viewport changes (mobile browsers)
            window.addEventListener('load', handleResize);
            
            return () => {
                // Cleanup event listeners
                window.removeEventListener('resize', handleResize);
                window.removeEventListener('orientationchange', handleOrientationChange);
                window.removeEventListener('load', handleResize);
                
                if (gameRef.current) {
                    console.log('🧹 Cleaning up responsive game');
                    gameRef.current.destroy(true);
                    gameRef.current = null;
                }
            };
        } catch (error) {
            console.error('❌ Error creating responsive Phaser game:', error);
        }
    }, []);
    
    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            margin: 0,
            padding: 0,
            overflow: 'hidden'
        }}>
            <div id="minimal-game" style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#f8f9fa',
                borderRadius: window.innerWidth <= 768 ? '0' : '10px',
                overflow: 'hidden',
                touchAction: 'manipulation',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}></div>
        </div>
    );
}