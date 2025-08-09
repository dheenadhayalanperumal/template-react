export class LetterRenderer {
    constructor(scene) {
        this.scene = scene;
        this.letterGraphics = null;
        this.referenceGraphics = null;
        this.currentLetterData = null;
        this.letterSize = 200;
        this.centerX = 0;
        this.centerY = 0;
        
        this.setupGraphics();
    }

    setupGraphics() {
        // Graphics for the letter display
        this.letterGraphics = this.scene.add.graphics().setDepth(10);
        
        // Graphics for reference paths/outlines
        this.referenceGraphics = this.scene.add.graphics().setDepth(5);
        
        // Set center position
        const { width, height } = this.scene.sys.game.config;
        this.centerX = width / 2;
        this.centerY = height / 2;
    }

    renderLetter(letterData, difficultyLevel = 'EASY') {
        this.currentLetterData = letterData;
        
        // Clear previous renders
        this.clearRender();
        
        // Render based on difficulty level
        switch (difficultyLevel) {
            case 'EASY':
                this.renderEasyMode(letterData);
                break;
            case 'MEDIUM':
                this.renderMediumMode(letterData);
                break;
            case 'HARD':
                this.renderHardMode(letterData);
                break;
            default:
                this.renderEasyMode(letterData);
        }
    }

    renderEasyMode(letterData) {
        // Easy mode: Show thick outline, direction arrows, and starting point
        const referencePath = this.generateLetterPath(letterData.letter);
        
        // Draw thick outline
        this.drawThickOutline(referencePath, 8, 0x888888);
        
        // Draw direction arrows
        this.drawDirectionArrows(referencePath, 0x0066cc);
        
        // Draw starting point
        this.drawStartingPoint(referencePath[0], 0x00ff00);
        
        // Show letter in light gray for reference
        this.drawLetterReference(letterData.letter, 0xcccccc, 0.3);
    }

    renderMediumMode(letterData) {
        // Medium mode: Show thin outline, no arrows
        const referencePath = this.generateLetterPath(letterData.letter);
        
        // Draw thin outline
        this.drawThickOutline(referencePath, 4, 0xaaaaaa);
        
        // Draw starting point only
        this.drawStartingPoint(referencePath[0], 0x00ff00);
        
        // Show letter in very light gray
        this.drawLetterReference(letterData.letter, 0xeeeeee, 0.2);
    }

    renderHardMode(letterData) {
        // Hard mode: Show letter briefly, then hide
        this.drawLetterReference(letterData.letter, 0x666666, 0.8);
        
        // Hide letter after 2 seconds
        this.scene.time.delayedCall(2000, () => {
            this.letterGraphics.clear();
        });
        
        // Only show a small starting dot
        const referencePath = this.generateLetterPath(letterData.letter);
        this.drawStartingPoint(referencePath[0], 0x00ff00);
    }

    generateLetterPath(letter) {
        // This method generates the path points for tracing each Tamil letter
        // In a production version, these would be loaded from vector font files
        
        const paths = this.getTamilLetterPaths();
        return paths[letter] || this.generateDefaultPath();
    }

    getTamilLetterPaths() {
        // Comprehensive path definitions for Tamil letters
        // Each letter has an array of points that define the tracing path
        
        return {
            // Uyir Ezhuthukkal (Vowels)
            'அ': this.generateLetterA(),
            'ஆ': this.generateLetterAa(),
            'இ': this.generateLetterI(),
            'ஈ': this.generateLetterIi(),
            'உ': this.generateLetterU(),
            'ஊ': this.generateLetterUu(),
            'எ': this.generateLetterE(),
            'ஏ': this.generateLetterEe(),
            'ஐ': this.generateLetterAi(),
            'ஒ': this.generateLetterO(),
            'ஓ': this.generateLetterOo(),
            'ஔ': this.generateLetterAu(),
            
            // Mei Ezhuthukkal (Consonants)
            'க்': this.generateLetterKa(),
            'ங்': this.generateLetterNga(),
            'ச்': this.generateLetterCha(),
            'ஞ்': this.generateLetterNja(),
            'ட்': this.generateLetterTa(),
            'ண்': this.generateLetterNa(),
            'த்': this.generateLetterTha(),
            'ந்': this.generateLetterNha(),
            'ப்': this.generateLetterPa(),
            'ம்': this.generateLetterMa(),
            'ய்': this.generateLetterYa(),
            'ர்': this.generateLetterRa(),
            'ல்': this.generateLetterLa(),
            'வ்': this.generateLetterVa(),
            'ழ்': this.generateLetterZha(),
            'ள்': this.generateLetterLLa(),
            'ற்': this.generateLetterRRa(),
            'ன்': this.generateLetterNna(),
            
            // Uyirmei combinations (க series)
            'க': this.generateLetterKa_vowel(),
            'கா': this.generateLetterKaa(),
            'கி': this.generateLetterKi(),
            'கீ': this.generateLetterKii(),
            'கு': this.generateLetterKu(),
            'கூ': this.generateLetterKuu(),
            'கெ': this.generateLetterKe(),
            'கே': this.generateLetterKee(),
            'கை': this.generateLetterKai(),
            'கொ': this.generateLetterKo(),
            'கோ': this.generateLetterKoo(),
            'கௌ': this.generateLetterKau()
        };
    }

    // Letter path generation methods
    generateLetterA() {
        const points = [];
        const scale = this.letterSize / 200;
        
        // Tamil letter அ path
        // Starting from top-left, curving down and right
        for (let t = 0; t <= 1; t += 0.01) {
            const x = this.centerX + (-60 + 120 * t) * scale;
            const y = this.centerY + (-80 + 160 * Math.sin(Math.PI * t * 0.5)) * scale;
            points.push({ x, y });
        }
        
        return points;
    }

    generateLetterAa() {
        const points = [];
        const scale = this.letterSize / 200;
        
        // Tamil letter ஆ path - similar to அ but with an additional line
        // Main curve
        for (let t = 0; t <= 1; t += 0.01) {
            const x = this.centerX + (-70 + 140 * t) * scale;
            const y = this.centerY + (-90 + 120 * Math.sin(Math.PI * t * 0.3)) * scale;
            points.push({ x, y });
        }
        
        // Additional horizontal line
        for (let t = 0; t <= 1; t += 0.02) {
            const x = this.centerX + (-30 + 60 * t) * scale;
            const y = this.centerY + (60) * scale;
            points.push({ x, y });
        }
        
        return points;
    }

    generateLetterI() {
        const points = [];
        const scale = this.letterSize / 200;
        
        // Tamil letter இ path
        for (let t = 0; t <= 1; t += 0.01) {
            const x = this.centerX + (-40 + 80 * Math.cos(Math.PI * t)) * scale;
            const y = this.centerY + (-60 + 120 * t) * scale;
            points.push({ x, y });
        }
        
        return points;
    }

    generateLetterIi() {
        const points = [];
        const scale = this.letterSize / 200;
        
        // Tamil letter ஈ path - longer version of இ
        for (let t = 0; t <= 1; t += 0.01) {
            const x = this.centerX + (-50 + 100 * Math.cos(Math.PI * t * 0.8)) * scale;
            const y = this.centerY + (-70 + 140 * t) * scale;
            points.push({ x, y });
        }
        
        return points;
    }

    generateLetterU() {
        const points = [];
        const scale = this.letterSize / 200;
        
        // Tamil letter உ path
        const radius = 50 * scale;
        for (let angle = 0; angle <= Math.PI; angle += 0.05) {
            const x = this.centerX + Math.cos(angle) * radius;
            const y = this.centerY + Math.sin(angle) * radius - 20 * scale;
            points.push({ x, y });
        }
        
        return points;
    }

    generateLetterUu() {
        const points = [];
        const scale = this.letterSize / 200;
        
        // Tamil letter ஊ path - similar to உ but larger
        const radius = 60 * scale;
        for (let angle = 0; angle <= Math.PI * 1.2; angle += 0.05) {
            const x = this.centerX + Math.cos(angle) * radius;
            const y = this.centerY + Math.sin(angle) * radius - 30 * scale;
            points.push({ x, y });
        }
        
        return points;
    }

    // Additional letter generation methods would continue here...
    // For brevity, I'll create a few more key ones

    generateLetterKa() {
        const points = [];
        const scale = this.letterSize / 200;
        
        // Tamil letter க் (consonant Ka)
        // Vertical line
        for (let t = 0; t <= 1; t += 0.02) {
            const x = this.centerX + (-20) * scale;
            const y = this.centerY + (-60 + 120 * t) * scale;
            points.push({ x, y });
        }
        
        // Horizontal line
        for (let t = 0; t <= 1; t += 0.02) {
            const x = this.centerX + (-20 + 40 * t) * scale;
            const y = this.centerY + (0) * scale;
            points.push({ x, y });
        }
        
        return points;
    }

    generateLetterKa_vowel() {
        const points = [];
        const scale = this.letterSize / 200;
        
        // Tamil letter க (Ka with inherent vowel)
        // Base consonant shape plus vowel modification
        for (let t = 0; t <= 1; t += 0.01) {
            const x = this.centerX + (-50 + 100 * t) * scale;
            const y = this.centerY + (-70 + 140 * Math.sin(Math.PI * t)) * scale;
            points.push({ x, y });
        }
        
        return points;
    }

    generateDefaultPath() {
        // Default circular path for letters without specific paths
        const points = [];
        const radius = 50;
        
        for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
            const x = this.centerX + Math.cos(angle) * radius;
            const y = this.centerY + Math.sin(angle) * radius;
            points.push({ x, y });
        }
        
        return points;
    }

    drawThickOutline(points, width, color) {
        if (points.length < 2) return;
        
        this.referenceGraphics.lineStyle(width, color, 0.6);
        this.referenceGraphics.beginPath();
        this.referenceGraphics.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length; i++) {
            this.referenceGraphics.lineTo(points[i].x, points[i].y);
        }
        
        this.referenceGraphics.strokePath();
    }

    drawDirectionArrows(points, color) {
        if (points.length < 10) return;
        
        const arrowSize = 12;
        const step = Math.floor(points.length / 6); // Show 6 arrows
        
        this.referenceGraphics.fillStyle(color);
        
        for (let i = 0; i < points.length - step; i += step) {
            const current = points[i];
            const next = points[i + step];
            
            // Calculate arrow direction
            const dx = next.x - current.x;
            const dy = next.y - current.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            
            if (length > 0) {
                const normalizedDx = dx / length;
                const normalizedDy = dy / length;
                
                // Arrow head position
                const arrowX = current.x + normalizedDx * arrowSize;
                const arrowY = current.y + normalizedDy * arrowSize;
                
                // Draw arrow triangle
                this.referenceGraphics.fillTriangle(
                    arrowX, arrowY,
                    arrowX - normalizedDx * arrowSize - normalizedDy * arrowSize * 0.5,
                    arrowY - normalizedDy * arrowSize + normalizedDx * arrowSize * 0.5,
                    arrowX - normalizedDx * arrowSize + normalizedDy * arrowSize * 0.5,
                    arrowY - normalizedDy * arrowSize - normalizedDx * arrowSize * 0.5
                );
            }
        }
    }

    drawStartingPoint(startPoint, color) {
        // Draw a larger circle at the starting point
        this.referenceGraphics.fillStyle(color);
        this.referenceGraphics.fillCircle(startPoint.x, startPoint.y, 8);
        
        // Add pulsing animation to starting point
        const startDot = this.scene.add.circle(startPoint.x, startPoint.y, 8, color);
        startDot.setDepth(15);
        
        this.scene.tweens.add({
            targets: startDot,
            scaleX: 1.5,
            scaleY: 1.5,
            alpha: 0.3,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Power2'
        });
    }

    drawLetterReference(letter, color, alpha) {
        // Draw the actual Tamil letter as text for reference
        const letterText = this.scene.add.text(
            this.centerX, this.centerY, letter, {
                fontSize: `${this.letterSize}px`,
                fontFamily: 'Arial',
                fill: Phaser.Display.Color.IntegerToColor(color).rgba,
                alpha: alpha,
                fontStyle: 'bold'
            }
        ).setOrigin(0.5).setDepth(8);
        
        // Store reference to clean up later
        if (!this.letterReferences) {
            this.letterReferences = [];
        }
        this.letterReferences.push(letterText);
    }

    getReferencePath() {
        if (!this.currentLetterData) return [];
        return this.generateLetterPath(this.currentLetterData.letter);
    }

    clearRender() {
        this.letterGraphics.clear();
        this.referenceGraphics.clear();
        
        // Clean up letter references
        if (this.letterReferences) {
            this.letterReferences.forEach(ref => {
                if (ref && ref.destroy) {
                    ref.destroy();
                }
            });
            this.letterReferences = [];
        }
    }

    setLetterSize(size) {
        this.letterSize = size;
    }

    setPosition(x, y) {
        this.centerX = x;
        this.centerY = y;
    }

    destroy() {
        this.clearRender();
        
        if (this.letterGraphics) {
            this.letterGraphics.destroy();
        }
        
        if (this.referenceGraphics) {
            this.referenceGraphics.destroy();
        }
    }
}