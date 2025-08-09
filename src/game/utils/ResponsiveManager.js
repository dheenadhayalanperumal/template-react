export class ResponsiveManager {
    constructor(scene) {
        this.scene = scene;
        this.screenSizeCategory = this.getScreenSizeCategory();
        this.scaleFactor = this.getScaleFactor();
        this.isPortrait = this.isPortraitMode();
        
        // Setup resize listener
        this.setupResizeListener();
    }

    getScreenSizeCategory() {
        const { width, height } = this.scene.sys.game.config;
        const minDimension = Math.min(width, height);
        
        if (minDimension <= 480) {
            return 'mobile';
        } else if (minDimension <= 768) {
            return 'tablet';
        } else {
            return 'desktop';
        }
    }

    getScaleFactor() {
        const { width, height } = this.scene.sys.game.config;
        const baseWidth = 1024;
        const baseHeight = 768;
        
        // Calculate scale factor based on screen size
        const scaleX = width / baseWidth;
        const scaleY = height / baseHeight;
        
        // Use the smaller scale factor to maintain aspect ratio
        return Math.min(scaleX, scaleY, 1.0); // Cap at 1.0 to avoid over-scaling
    }

    isPortraitMode() {
        const { width, height } = this.scene.sys.game.config;
        return height > width;
    }

    setupResizeListener() {
        // Listen for browser resize events
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Listen for orientation change on mobile
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.handleResize(), 100);
        });
    }

    handleResize() {
        // Update screen size category and scale factor
        this.screenSizeCategory = this.getScreenSizeCategory();
        this.scaleFactor = this.getScaleFactor();
        this.isPortrait = this.isPortraitMode();
        
        // Emit resize event for components to respond
        this.scene.events.emit('screenResize', {
            category: this.screenSizeCategory,
            scale: this.scaleFactor,
            portrait: this.isPortrait
        });
    }

    // UI Scaling Methods
    getUIScale() {
        switch (this.screenSizeCategory) {
            case 'mobile':
                return this.scaleFactor * (this.isPortrait ? 1.2 : 0.9);
            case 'tablet':
                return this.scaleFactor * 1.0;
            case 'desktop':
            default:
                return this.scaleFactor;
        }
    }

    getFontSize(baseFontSize) {
        const uiScale = this.getUIScale();
        const minFontSize = this.screenSizeCategory === 'mobile' ? 12 : 14;
        const maxFontSize = baseFontSize * 1.5;
        
        const scaledSize = baseFontSize * uiScale;
        return Math.min(Math.max(scaledSize, minFontSize), maxFontSize);
    }

    getButtonSize(baseWidth, baseHeight) {
        const scale = this.getUIScale();
        const minButtonSize = this.screenSizeCategory === 'mobile' ? 44 : 32; // iOS/Android minimum tap target
        
        return {
            width: Math.max(baseWidth * scale, minButtonSize),
            height: Math.max(baseHeight * scale, minButtonSize)
        };
    }

    // Layout Methods
    getLayoutConfig() {
        const { width, height } = this.scene.sys.game.config;
        
        if (this.isPortrait) {
            return this.getPortraitLayout(width, height);
        } else {
            return this.getLandscapeLayout(width, height);
        }
    }

    getPortraitLayout(width, height) {
        return {
            // Header area (score, progress)
            header: {
                x: width / 2,
                y: 80,
                width: width - 40,
                height: 120
            },
            
            // Main drawing area
            drawingArea: {
                x: width / 2,
                y: height * 0.45,
                width: width - 60,
                height: height * 0.5
            },
            
            // Footer area (buttons)
            footer: {
                x: width / 2,
                y: height - 100,
                width: width - 40,
                height: 120
            },
            
            // Letter display
            letterDisplay: {
                x: width / 2,
                y: height * 0.3,
                size: Math.min(width * 0.6, 150)
            }
        };
    }

    getLandscapeLayout(width, height) {
        return {
            // Left panel (score, progress, buttons)
            leftPanel: {
                x: width * 0.15,
                y: height / 2,
                width: width * 0.25,
                height: height - 40
            },
            
            // Main drawing area
            drawingArea: {
                x: width * 0.65,
                y: height / 2,
                width: width * 0.6,
                height: height - 100
            },
            
            // Letter display (in left panel)
            letterDisplay: {
                x: width * 0.15,
                y: height * 0.3,
                size: Math.min(width * 0.2, height * 0.3)
            }
        };
    }

    // Touch and Input Methods
    getTouchSensitivity() {
        // Adjust touch sensitivity based on device type
        switch (this.screenSizeCategory) {
            case 'mobile':
                return {
                    tolerance: 20, // Higher tolerance for finger input
                    strokeWidth: 6, // Thicker stroke for visibility
                    minDistance: 3 // Minimum distance between touch points
                };
            case 'tablet':
                return {
                    tolerance: 15,
                    strokeWidth: 4,
                    minDistance: 2
                };
            case 'desktop':
            default:
                return {
                    tolerance: 10,
                    strokeWidth: 3,
                    minDistance: 1
                };
        }
    }

    // Drawing Area Methods
    getDrawingAreaDimensions() {
        const layout = this.getLayoutConfig();
        const drawingArea = layout.drawingArea;
        
        // Ensure drawing area is properly sized and centered
        const maxSize = Math.min(drawingArea.width, drawingArea.height) * 0.8;
        
        return {
            x: drawingArea.x,
            y: drawingArea.y,
            width: maxSize,
            height: maxSize,
            centerX: drawingArea.x,
            centerY: drawingArea.y
        };
    }

    // Device-Specific Optimizations
    shouldShowTutorial() {
        // Show tutorial on first mobile use
        return this.screenSizeCategory === 'mobile' && !localStorage.getItem('tamilGame_mobileTutorialShown');
    }

    getOptimalLetterSize() {
        const drawingArea = this.getDrawingAreaDimensions();
        const baseSize = Math.min(drawingArea.width, drawingArea.height) * 0.7;
        
        // Adjust based on screen category
        switch (this.screenSizeCategory) {
            case 'mobile':
                return Math.max(baseSize, 120); // Minimum readable size
            case 'tablet':
                return Math.max(baseSize, 150);
            case 'desktop':
            default:
                return Math.max(baseSize, 200);
        }
    }

    // UI Positioning Helpers
    adaptUIElement(element, baseConfig) {
        const scale = this.getUIScale();
        const layout = this.getLayoutConfig();
        
        // Apply responsive scaling and positioning
        if (element.setScale) {
            element.setScale(scale);
        }
        
        if (element.setFontSize && baseConfig.fontSize) {
            element.setFontSize(this.getFontSize(baseConfig.fontSize));
        }
        
        // Adjust position based on layout
        if (baseConfig.position && element.setPosition) {
            const newPos = this.getResponsivePosition(baseConfig.position, layout);
            element.setPosition(newPos.x, newPos.y);
        }
    }

    getResponsivePosition(basePosition, layout) {
        // Map base positions to responsive layout
        switch (basePosition.area) {
            case 'header':
                return {
                    x: layout.header ? layout.header.x + basePosition.offsetX : basePosition.x,
                    y: layout.header ? layout.header.y + basePosition.offsetY : basePosition.y
                };
            case 'footer':
                return {
                    x: layout.footer ? layout.footer.x + basePosition.offsetX : basePosition.x,
                    y: layout.footer ? layout.footer.y + basePosition.offsetY : basePosition.y
                };
            case 'drawingArea':
                return {
                    x: layout.drawingArea.x + basePosition.offsetX,
                    y: layout.drawingArea.y + basePosition.offsetY
                };
            default:
                return basePosition;
        }
    }

    // Performance Optimizations
    shouldEnableParticles() {
        // Disable heavy particle effects on mobile for performance
        return this.screenSizeCategory !== 'mobile';
    }

    getOptimalFrameRate() {
        switch (this.screenSizeCategory) {
            case 'mobile':
                return 30; // Lower frame rate for battery life
            case 'tablet':
                return 45;
            case 'desktop':
            default:
                return 60;
        }
    }

    // Accessibility Methods
    getAccessibilitySettings() {
        return {
            highContrast: this.screenSizeCategory === 'mobile',
            largerHitboxes: this.screenSizeCategory === 'mobile',
            simplifiedAnimations: this.screenSizeCategory === 'mobile',
            hapticFeedback: 'vibration' in navigator && this.screenSizeCategory === 'mobile'
        };
    }

    // Debug and Testing
    showLayoutGuides(graphics) {
        if (!graphics) return;
        
        const layout = this.getLayoutConfig();
        graphics.clear();
        graphics.lineStyle(2, 0xff0000, 0.5);
        
        // Draw layout areas
        Object.keys(layout).forEach(key => {
            const area = layout[key];
            if (area.width && area.height) {
                graphics.strokeRect(
                    area.x - area.width / 2,
                    area.y - area.height / 2,
                    area.width,
                    area.height
                );
                
                // Label the area
                graphics.scene.add.text(area.x, area.y, key, {
                    fontSize: '12px',
                    fill: '#ff0000'
                }).setOrigin(0.5);
            }
        });
    }

    // Cleanup
    destroy() {
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('orientationchange', this.handleResize);
    }
}