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
        this.add.text(width/2, 150, 'தமிழ் எழுத்துக்கள்)', {
            fontSize: '48px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        this.add.text(width/2, 200, 'Draw & Learn', {
            fontSize: '32px',
            fill: '#ffeb3b',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        // Tamil letters
        this.add.text(width/2, 280, 'உயிர் மற்றும் மெய் எழுத்துக்கள்', {
            fontSize: '48px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        // Interactive start button
        const startButton = this.add.rectangle(width/2, height/2 + 50, 250, 70, 0x4caf50)
            .setInteractive({ useHandCursor: true });
        
        this.add.text(width/2, height/2 + 50, 'START LEARNING', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Button interactions
        startButton.on('pointerdown', () => {
            console.log('🚀 START LEARNING clicked - starting with first Tamil letter');
            this.scene.start('DrawingScene', { letterIndex: 0 });
        });
        
        startButton.on('pointerover', () => {
            startButton.setFillStyle(0x45a049);
        });
        
        startButton.on('pointerout', () => {
            startButton.setFillStyle(0x4caf50);
        });
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
        this.initializeTamilLetters();
    }
    
    initializeTamilLetters() {
        // All Tamil letters with phonetic pronunciations for speech synthesis
        this.tamilLetters = [
            // Uyir Ezhuthukkal (Vowels) - Phonetic sounds that work with TTS
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
            { letter: 'ஔ', transliteration: 'oww', pronunciation: 'ஔ', nativeSound: 'ஔ' },
            
            // Mei Ezhuthukkal (Consonants) - Phonetic sounds for TTS
            { letter: 'க்', transliteration: 'kuh', pronunciation: 'க்', nativeSound: 'க்' },
            { letter: 'ங்', transliteration: 'nguh', pronunciation: 'ங்', nativeSound: 'ங்' },
            { letter: 'ச்', transliteration: 'chuh', pronunciation: 'ச்', nativeSound: 'ச்' },
            { letter: 'ஞ்', transliteration: 'nyuh', pronunciation: 'ஞ்', nativeSound: 'ஞ்' },
            { letter: 'ட்', transliteration: 'tuh', pronunciation: 'ட்', nativeSound: 'ட்' },
            { letter: 'ண்', transliteration: 'nuh', pronunciation: 'ண்', nativeSound: 'ண்' },
            { letter: 'த்', transliteration: 'thuh', pronunciation: 'த்', nativeSound: 'த்' },
            { letter: 'ந்', transliteration: 'nuh', pronunciation: 'ந்', nativeSound: 'ந்' },
            { letter: 'ப்', transliteration: 'puh', pronunciation: 'ப்', nativeSound: 'ப்' },
            { letter: 'ம்', transliteration: 'muh', pronunciation: 'ம்', nativeSound: 'ம்' },
            { letter: 'ய்', transliteration: 'yuh', pronunciation: 'ய்', nativeSound: 'ய்' },
            { letter: 'ர்', transliteration: 'ruh', pronunciation: 'ர்', nativeSound: 'ர்' },
            { letter: 'ல்', transliteration: 'luh', pronunciation: 'ல்', nativeSound: 'ல்' },
            { letter: 'வ்', transliteration: 'vuh', pronunciation: 'வ்', nativeSound: 'வ்' },
            { letter: 'ழ்', transliteration: 'zhuh', pronunciation: 'ழ்', nativeSound: 'ழ்' },
            { letter: 'ள்', transliteration: 'luh', pronunciation: 'ள்', nativeSound: 'ள்' },
            { letter: 'ற்', transliteration: 'ruh', pronunciation: 'ற்', nativeSound: 'ற்' },
            { letter: 'ன்', transliteration: 'nuh', pronunciation: 'ன்', nativeSound: 'ன்' }
        ];
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
        
        // Title at the very top - no background rectangle
        this.add.text(width/2, topY, 'Trace the Tamil Letter', {
            fontSize: titleSize,
            fill: '#4a90e2',  // Blue text instead of white background
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Progress indicator right below title - tighter spacing on mobile
        const progressSpacing = this.isMobile ? 18 : 25;  // Tighter spacing on mobile
        this.add.text(width/2, topY + progressSpacing, `Letter ${this.currentLetterIndex + 1} of ${this.tamilLetters.length}`, {
            fontSize: progressSize,
            fill: '#666666',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        // Responsive letter sizing that takes advantage of available space
        const letterSize = this.isMobile ? '500px' : '400px';  // Larger desktop size to fill space better
        const strokeThickness = this.isMobile ? 6 : 6;  // Same thick stroke for both
        const letterYOffset = this.isMobile ? -100 : -100;  // Moved much higher to ensure full letter visibility
        
        // Letter outline (black stroke, no fill) - RESPONSIVE TEXT with adjusted origin
        this.letterText = this.add.text(width/2, height/2 + letterYOffset, this.currentLetter.letter, {
            fontSize: letterSize,
            fontFamily: 'Arial',
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
            
            // Consonants
            'க்': 'ka.mp3',
            'ங்': 'nga.mp3',
            'ச்': 'cha.mp3',
            'ஞ்': 'nya.mp3',
            'ட்': 'ta.mp3',
            'ண்': 'na.mp3',
            'த்': 'tha.mp3',
            'ந்': 'nha.mp3',
            'ப்': 'pa.mp3',
            'ம்': 'ma.mp3',
            'ய்': 'ya.mp3',
            'ர்': 'ra.mp3',
            'ல்': 'la.mp3',
            'வ்': 'va.mp3',
            'ழ்': 'zha.mp3',
            'ள்': 'lla.mp3',
            'ற்': 'rra.mp3',
            'ன்': 'nna.mp3'
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
                
            case 'க்': // 'k' - consonant with horizontal and vertical elements
                // Top horizontal stroke guide (inside the stroke)
                this.drawDottedLine(centerX - 50, centerY - 50, centerX + 50, centerY - 50);
                // Left vertical stroke guide
                this.drawDottedLine(centerX - 15, centerY - 50, centerX - 15, centerY + 30);
                // Right connecting element guide
                this.drawDottedLine(centerX + 20, centerY - 30, centerX + 35, centerY - 15);
                break;
                
            case 'ங்': // 'ng' - curved consonant
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
                this.evaluateDrawing();
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
    
    evaluateDrawing() {
        // Calculate score out of 100
        const score = this.calculateScore();
        
        console.log(`📊 Letter tracing score: ${score}/100`);
        
        // Show score
        this.showScore(score);
        
        // Handle different score ranges
        if (score < 50) {
            // Below 50 - Ask to try again
            this.handleLowScore(score);
        } else if (score >= 90) {
            // Above 90 - Big celebration
            this.handleExcellentScore(score);
        } else if (score >= 75) {
            // Above 75 - Reward animation
            this.handleGoodScore(score);
        } else {
            // 50-74 - Basic positive feedback
            this.handleOkayScore(score);
        }
    }
    
    calculateScore() {
        // Basic scoring algorithm based on drawing coverage and bounds checking
        let score = 0;
        
        // Base score for drawing inside bounds
        if (this.drawingPoints.length > 0) {
            score += 30; // Base points for attempting
        }
        
        // Coverage score based on number of drawing points
        const minPoints = 10;  // Minimum expected points
        const maxPoints = 100; // Good coverage points
        const coverageScore = Math.min(70, (this.drawingPoints.length / maxPoints) * 70);
        score += coverageScore;
        
        // Bonus for staying within bounds (all points were inside)
        const allPointsInside = this.drawingPoints.every(point => 
            this.isInsideLetterBounds(point.x, point.y)
        );
        
        if (allPointsInside && this.drawingPoints.length > minPoints) {
            score += 20; // Bonus for good tracing
        }
        
        // Randomize slightly for variety (±5 points)
        score += Math.random() * 10 - 5;
        
        return Math.round(Math.max(0, Math.min(100, score)));
    }
    
    showScore(score) {
        // Remove previous score
        if (this.scoreText) {
            this.scoreText.destroy();
        }
        
        // Color based on score
        let color = '#f44336'; // Red for low scores
        if (score >= 90) color = '#4caf50'; // Green for excellent
        else if (score >= 75) color = '#8bc34a'; // Light green for good
        else if (score >= 50) color = '#ff9800'; // Orange for okay
        
        this.scoreText = this.add.text(this.sys.game.config.width/2, 200, `Score: ${score}/100`, {
            fontSize: '36px',
            fill: color,
            fontFamily: 'Arial',
            fontStyle: 'bold',
            stroke: '#ffffff',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Score animation
        this.scoreText.setScale(0);
        this.tweens.add({
            targets: this.scoreText,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 300,
            ease: 'Back.easeOut',
            yoyo: true,
            repeat: 1
        });
    }
    
    handleLowScore(score) {
        // Below 50 - Ask to try again
        this.showFeedback('Try again! Trace more of the letter carefully.', '#f44336');
        
        // Shake animation for the letter
        this.tweens.add({
            targets: this.letterText,
            x: this.letterText.x - 10,
            duration: 100,
            yoyo: true,
            repeat: 3,
            ease: 'Power2'
        });
        
        // Don't enable next button - user must try again
        console.log('❌ Score too low, user must retry');
    }
    
    handleOkayScore(score) {
        // 50-74 - Basic positive feedback
        const messages = [
            'Good job! Keep practicing!',
            'Nice work! Getting better!',
            'Well done! You can do even better!',
            'Good tracing! Try for a higher score next time!'
        ];
        
        const message = messages[Math.floor(Math.random() * messages.length)];
        this.showFeedback(message, '#ff9800');
        
        // Enable next button
        this.enableNextButton();
    }
    
    handleGoodScore(score) {
        // 75-89 - Reward animation
        this.showFeedback('Excellent work! Great tracing! ⭐', '#8bc34a');
        
        // Star particle effect
        this.createStarParticles();
        
        // Letter glow effect
        this.tweens.add({
            targets: this.letterText,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 500,
            yoyo: true,
            repeat: 1,
            ease: 'Power2'
        });
        
        // Enable next button with glow
        this.enableNextButton();
        
        console.log('⭐ Good score - reward animation played');
    }
    
    handleExcellentScore(score) {
        // 90+ - Big celebration
        this.showFeedback('AMAZING! Perfect tracing! 🎉🏆', '#4caf50');
        
        // Multiple celebration effects
        this.createFireworksEffect();
        this.createFloatingStars();
        this.createRainbowGlow();
        
        // Letter celebration animation
        this.tweens.add({
            targets: this.letterText,
            scaleX: 1.3,
            scaleY: 1.3,
            duration: 600,
            yoyo: true,
            repeat: 2,
            ease: 'Bounce.easeOut'
        });
        
        // Enable next button with special effect
        this.enableNextButton();
        
        console.log('🎉 Excellent score - big celebration!');
    }
    
    createStarParticles() {
        const { width, height } = this.sys.game.config;
        
        for (let i = 0; i < 8; i++) {
            const star = this.add.text(
                width/2 + (Math.random() - 0.5) * 200,
                height/2 + (Math.random() - 0.5) * 200,
                '⭐', {
                    fontSize: '24px'
                }
            );
            
            this.tweens.add({
                targets: star,
                y: star.y - 100,
                alpha: 0,
                scaleX: 2,
                scaleY: 2,
                duration: 1500,
                ease: 'Power2',
                onComplete: () => star.destroy()
            });
        }
    }
    
    createFireworksEffect() {
        const { width, height } = this.sys.game.config;
        
        // Multiple firework bursts
        for (let burst = 0; burst < 3; burst++) {
            this.time.delayedCall(burst * 300, () => {
                for (let i = 0; i < 12; i++) {
                    const angle = (i / 12) * Math.PI * 2;
                    const distance = 100 + Math.random() * 50;
                    
                    const particle = this.add.text(width/2, height/2 - 50, '✨', {
                        fontSize: '20px'
                    });
                    
                    this.tweens.add({
                        targets: particle,
                        x: width/2 + Math.cos(angle) * distance,
                        y: height/2 - 50 + Math.sin(angle) * distance,
                        alpha: 0,
                        scaleX: 0.5,
                        scaleY: 0.5,
                        duration: 1000,
                        ease: 'Power2',
                        onComplete: () => particle.destroy()
                    });
                }
            });
        }
    }
    
    createFloatingStars() {
        const { width, height } = this.sys.game.config;
        
        for (let i = 0; i < 15; i++) {
            const star = this.add.text(
                Math.random() * width,
                height + 50,
                '🌟', {
                    fontSize: '30px'
                }
            );
            
            this.tweens.add({
                targets: star,
                y: -50,
                x: star.x + (Math.random() - 0.5) * 100,
                duration: 3000 + Math.random() * 1000,
                ease: 'Linear',
                onComplete: () => star.destroy()
            });
        }
    }
    
    createRainbowGlow() {
        // Rainbow color cycling effect on the letter
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
        let colorIndex = 0;
        
        const colorCycle = this.time.addEvent({
            delay: 200,
            callback: () => {
                if (this.letterText && colorIndex < colors.length * 2) {
                    this.letterText.setStroke(colors[colorIndex % colors.length], 6);
                    colorIndex++;
                } else {
                    // Reset to black
                    if (this.letterText) {
                        this.letterText.setStroke('#000000', 6);
                    }
                    colorCycle.remove();
                }
            },
            repeat: colors.length * 2 - 1
        });
    }
    
    showFeedback(message, color = '#4caf50') {
        // Remove previous feedback
        if (this.feedbackText) {
            this.feedbackText.destroy();
        }
        
        this.feedbackText = this.add.text(this.sys.game.config.width/2, 180, message, {
            fontSize: '28px',
            fill: color,
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Auto-hide after 2 seconds
        this.time.delayedCall(2000, () => {
            if (this.feedbackText) {
                this.feedbackText.destroy();
                this.feedbackText = null;
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
            
            // Add glow effect to indicate it's ready
            this.tweens.add({
                targets: this.nextButton,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 500,
                yoyo: true,
                repeat: 2,
                ease: 'Power2'
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
            
            // Clear feedback
            if (this.feedbackText) {
                this.feedbackText.destroy();
                this.feedbackText = null;
            }
            if (this.warningText) {
                this.warningText.destroy();
                this.warningText = null;
            }
            
            // Clear score display
            if (this.scoreText) {
                this.scoreText.destroy();
                this.scoreText = null;
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
            this.scene.restart({ letterIndex: nextIndex });
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
        
        this.add.text(width/2, height/2 - 40, 'You completed all Tamil letters!', {
            fontSize: '28px',
            fill: '#ffeb3b',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        // Show some completed letters
        this.add.text(width/2, height/2 + 20, 'அ ஆ இ ஈ உ ஊ எ ஏ ஐ ஒ ஓ ஔ', {
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
        const drawingPoints = this.drawingPoints ? [...this.drawingPoints] : [];
        const isEvaluating = this.isEvaluating;
        
        // Clear and recreate all elements with new dimensions
        this.children.removeAll();
        
        // Reinitialize with current state
        this.currentLetterIndex = currentLetterIndex;
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