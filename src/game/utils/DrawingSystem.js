export class DrawingSystem {
    constructor(scene) {
        this.scene = scene;
        this.isDrawing = false;
        this.currentStroke = [];
        this.allStrokes = [];
        this.drawingGraphics = null;
        this.referencePoints = [];
        this.tolerance = 15;
        this.childFriendlyMode = true;
        this.smoothingEnabled = true;
        this.lastPoint = null;
        this.strokeBuffer = [];
        
        // Child-friendly settings
        this.minStrokeDistance = 5; // Minimum distance between recorded points
        this.strokeSmoothing = 0.8; // Smoothing factor for wobbly lines
        this.toleranceBoost = 1.5; // Extra tolerance multiplier for kids
        
        this.setupDrawingGraphics();
        this.setupInput();
    }

    setupDrawingGraphics() {
        this.drawingGraphics = this.scene.add.graphics();
        this.drawingGraphics.setDepth(100);
    }

    setupInput() {
        // Handle pointer down (start drawing)
        this.scene.input.on('pointerdown', (pointer) => {
            this.startDrawing(pointer.x, pointer.y);
        });

        // Handle pointer move (continue drawing)
        this.scene.input.on('pointermove', (pointer) => {
            if (this.isDrawing) {
                this.continueDrawing(pointer.x, pointer.y);
            }
        });

        // Handle pointer up (stop drawing)
        this.scene.input.on('pointerup', () => {
            this.stopDrawing();
        });
    }

    startDrawing(x, y) {
        this.isDrawing = true;
        this.currentStroke = [{ x, y }];
        
        // Start drawing line
        this.drawingGraphics.lineStyle(4, 0x000000);
        this.drawingGraphics.beginPath();
        this.drawingGraphics.moveTo(x, y);
        
        // Play drawing sound effect
        if (this.scene.sound && this.scene.sound.get('drawSound')) {
            this.scene.sound.play('drawSound', { volume: 0.3 });
        }
    }

    continueDrawing(x, y) {
        if (!this.isDrawing) return;
        
        // Apply smoothing and filtering for child-friendly drawing
        const smoothedPoint = this.applySmoothingAndFiltering(x, y);
        
        if (smoothedPoint) {
            // Add smoothed point to current stroke
            this.currentStroke.push(smoothedPoint);
            
            // Draw line to new point
            this.drawingGraphics.lineTo(smoothedPoint.x, smoothedPoint.y);
            this.drawingGraphics.strokePath();
        }
    }
    
    applySmoothingAndFiltering(x, y) {
        // Skip if too close to last point (reduces jitter)
        if (this.lastPoint) {
            const distance = Math.sqrt(
                Math.pow(x - this.lastPoint.x, 2) + 
                Math.pow(y - this.lastPoint.y, 2)
            );
            
            if (distance < this.minStrokeDistance) {
                return null; // Skip this point
            }
        }
        
        let smoothedPoint = { x, y };
        
        // Apply smoothing if enabled
        if (this.smoothingEnabled && this.lastPoint) {
            const smoothing = this.strokeSmoothing;
            smoothedPoint = {
                x: this.lastPoint.x + (x - this.lastPoint.x) * smoothing,
                y: this.lastPoint.y + (y - this.lastPoint.y) * smoothing
            };
        }
        
        this.lastPoint = smoothedPoint;
        return smoothedPoint;
    }

    stopDrawing() {
        if (!this.isDrawing) return;
        
        this.isDrawing = false;
        
        // Add current stroke to all strokes
        if (this.currentStroke.length > 1) {
            this.allStrokes.push([...this.currentStroke]);
        }
        
        // Clear current stroke
        this.currentStroke = [];
        
        // Stop drawing sound
        if (this.scene.sound && this.scene.sound.get('drawSound')) {
            this.scene.sound.stop('drawSound');
        }
    }

    clearDrawing() {
        this.drawingGraphics.clear();
        this.allStrokes = [];
        this.currentStroke = [];
        this.strokeBuffer = [];
        this.isDrawing = false;
        this.lastPoint = null;
    }

    setReferencePoints(points) {
        this.referencePoints = points;
    }

    setTolerance(tolerance) {
        this.tolerance = tolerance;
    }

    // Calculate accuracy by comparing drawn path with reference path
    calculateAccuracy() {
        if (this.allStrokes.length === 0 || this.referencePoints.length === 0) {
            return 0;
        }

        // Combine all strokes into one continuous path
        const drawnPoints = [];
        this.allStrokes.forEach(stroke => {
            drawnPoints.push(...stroke);
        });

        if (drawnPoints.length === 0) return 0;

        // Apply child-friendly tolerance adjustments
        const baseTolerance = this.tolerance;
        const adjustedTolerance = this.childFriendlyMode ? 
            baseTolerance * this.toleranceBoost : baseTolerance;

        // Calculate coverage with multiple scoring methods for better child-friendly results
        const coverageScore = this.calculateCoverageScore(drawnPoints, adjustedTolerance);
        const directionScore = this.calculateDirectionScore(drawnPoints);
        const completionScore = this.calculateCompletionScore(drawnPoints);
        
        // Weighted combination favoring coverage for children
        const accuracy = this.childFriendlyMode ? 
            (coverageScore * 0.7 + directionScore * 0.15 + completionScore * 0.15) :
            (coverageScore * 0.8 + directionScore * 0.1 + completionScore * 0.1);

        return Math.round(Math.min(100, Math.max(0, accuracy)));
    }
    
    calculateCoverageScore(drawnPoints, tolerance) {
        let coveredPoints = 0;

        for (const refPoint of this.referencePoints) {
            let isPointCovered = false;
            
            for (const drawnPoint of drawnPoints) {
                const distance = Math.sqrt(
                    Math.pow(refPoint.x - drawnPoint.x, 2) + 
                    Math.pow(refPoint.y - drawnPoint.y, 2)
                );
                
                if (distance <= tolerance) {
                    isPointCovered = true;
                    break;
                }
            }
            
            if (isPointCovered) {
                coveredPoints++;
            }
        }

        return (coveredPoints / this.referencePoints.length) * 100;
    }
    
    calculateDirectionScore(drawnPoints) {
        // Simplified direction scoring - just check if drawing follows general direction
        if (drawnPoints.length < 3 || this.referencePoints.length < 3) {
            return 80; // Default decent score if not enough points
        }
        
        // Compare overall direction of first and last portions
        const drawnStart = drawnPoints[0];
        const drawnEnd = drawnPoints[drawnPoints.length - 1];
        const refStart = this.referencePoints[0];
        const refEnd = this.referencePoints[this.referencePoints.length - 1];
        
        // Calculate direction vectors
        const drawnVector = { 
            x: drawnEnd.x - drawnStart.x, 
            y: drawnEnd.y - drawnStart.y 
        };
        const refVector = { 
            x: refEnd.x - refStart.x, 
            y: refEnd.y - refStart.y 
        };
        
        // Calculate angle similarity (simplified)
        const drawnAngle = Math.atan2(drawnVector.y, drawnVector.x);
        const refAngle = Math.atan2(refVector.y, refVector.x);
        let angleDiff = Math.abs(drawnAngle - refAngle);
        
        // Normalize angle difference
        if (angleDiff > Math.PI) {
            angleDiff = 2 * Math.PI - angleDiff;
        }
        
        // Convert to score (0-100)
        const directionScore = Math.max(0, 100 - (angleDiff / Math.PI) * 100);
        return directionScore;
    }
    
    calculateCompletionScore(drawnPoints) {
        // Check if the drawing covers the start and end areas of the reference
        if (this.referencePoints.length < 2) {
            return 100; // Default full score
        }
        
        const startArea = this.referencePoints[0];
        const endArea = this.referencePoints[this.referencePoints.length - 1];
        const tolerance = this.tolerance * 2; // Larger tolerance for start/end points
        
        let startCovered = false;
        let endCovered = false;
        
        for (const drawnPoint of drawnPoints) {
            // Check start area coverage
            const startDistance = Math.sqrt(
                Math.pow(startArea.x - drawnPoint.x, 2) + 
                Math.pow(startArea.y - drawnPoint.y, 2)
            );
            if (startDistance <= tolerance) {
                startCovered = true;
            }
            
            // Check end area coverage
            const endDistance = Math.sqrt(
                Math.pow(endArea.x - drawnPoint.x, 2) + 
                Math.pow(endArea.y - drawnPoint.y, 2)
            );
            if (endDistance <= tolerance) {
                endCovered = true;
            }
        }
        
        // Score based on start and end coverage
        if (startCovered && endCovered) {
            return 100;
        } else if (startCovered || endCovered) {
            return 70;
        } else {
            return 40; // Still give some points for effort
        }
    }

    // Generate reference points for a Tamil letter path
    generateLetterPath(letter, centerX, centerY, size = 200) {
        const points = [];
        
        // This would normally generate vector paths for each Tamil letter
        // For now, we'll create simple paths for demonstration
        switch (letter) {
            case 'அ':
                // Simple curved path for 'அ'
                points.push(...this.generateCurvedA(centerX, centerY, size));
                break;
            case 'ஆ':
                // Path for 'ஆ'
                points.push(...this.generateCurvedAa(centerX, centerY, size));
                break;
            case 'இ':
                // Path for 'இ'
                points.push(...this.generateCurvedI(centerX, centerY, size));
                break;
            default:
                // Default simple circle for other letters
                points.push(...this.generateCirclePath(centerX, centerY, size * 0.3));
                break;
        }
        
        return points;
    }

    generateCurvedA(centerX, centerY, size) {
        const points = [];
        const scale = size / 200;
        
        // Generate points for Tamil letter 'அ' shape
        // This is a simplified version - real implementation would use proper Tamil letter vectors
        for (let t = 0; t <= 1; t += 0.02) {
            const x = centerX + (-40 + 80 * t) * scale;
            const y = centerY + (-60 + 120 * Math.sin(Math.PI * t)) * scale;
            points.push({ x, y });
        }
        
        return points;
    }

    generateCurvedAa(centerX, centerY, size) {
        const points = [];
        const scale = size / 200;
        
        // Generate points for Tamil letter 'ஆ' shape
        for (let t = 0; t <= 1; t += 0.02) {
            const x = centerX + (-50 + 100 * t) * scale;
            const y = centerY + (-70 + 140 * Math.sin(Math.PI * t * 0.5)) * scale;
            points.push({ x, y });
        }
        
        return points;
    }

    generateCurvedI(centerX, centerY, size) {
        const points = [];
        const scale = size / 200;
        
        // Generate points for Tamil letter 'இ' shape
        for (let t = 0; t <= 1; t += 0.02) {
            const x = centerX + (-30 + 60 * Math.cos(Math.PI * t)) * scale;
            const y = centerY + (-50 + 100 * t) * scale;
            points.push({ x, y });
        }
        
        return points;
    }

    generateCirclePath(centerX, centerY, radius) {
        const points = [];
        const steps = 50;
        
        for (let i = 0; i <= steps; i++) {
            const angle = (i / steps) * Math.PI * 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            points.push({ x, y });
        }
        
        return points;
    }

    // Draw reference outline for the letter
    drawReferenceOutline(graphics, points, lineWidth = 2, color = 0x888888) {
        if (points.length < 2) return;
        
        graphics.lineStyle(lineWidth, color, 0.5);
        graphics.beginPath();
        graphics.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length; i++) {
            graphics.lineTo(points[i].x, points[i].y);
        }
        
        graphics.strokePath();
    }

    // Draw direction arrows for guidance
    drawDirectionArrows(graphics, points, color = 0x0066cc) {
        if (points.length < 10) return;
        
        const arrowSize = 10;
        const step = Math.floor(points.length / 5); // Show 5 arrows
        
        graphics.fillStyle(color);
        
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
                
                // Draw arrow
                const arrowX = current.x + normalizedDx * arrowSize;
                const arrowY = current.y + normalizedDy * arrowSize;
                
                graphics.fillTriangle(
                    arrowX, arrowY,
                    arrowX - normalizedDx * arrowSize - normalizedDy * arrowSize * 0.5,
                    arrowY - normalizedDy * arrowSize + normalizedDx * arrowSize * 0.5,
                    arrowX - normalizedDx * arrowSize + normalizedDy * arrowSize * 0.5,
                    arrowY - normalizedDy * arrowSize - normalizedDx * arrowSize * 0.5
                );
            }
        }
    }

    // Configuration methods for testing and adjustment
    setChildFriendlyMode(enabled) {
        this.childFriendlyMode = enabled;
        
        if (enabled) {
            // More forgiving settings for children
            this.toleranceBoost = 1.5;
            this.minStrokeDistance = 5;
            this.strokeSmoothing = 0.8;
        } else {
            // Standard settings for older learners/adults
            this.toleranceBoost = 1.0;
            this.minStrokeDistance = 2;
            this.strokeSmoothing = 0.5;
        }
    }
    
    setToleranceBoost(boost) {
        this.toleranceBoost = boost;
    }
    
    setSmoothingSettings(minDistance, smoothingFactor) {
        this.minStrokeDistance = minDistance;
        this.strokeSmoothing = smoothingFactor;
    }
    
    // Testing and debugging methods
    getDrawingStats() {
        return {
            totalStrokes: this.allStrokes.length,
            totalPoints: this.allStrokes.reduce((sum, stroke) => sum + stroke.length, 0),
            referencePoints: this.referencePoints.length,
            tolerance: this.tolerance,
            adjustedTolerance: this.childFriendlyMode ? this.tolerance * this.toleranceBoost : this.tolerance,
            childFriendlyMode: this.childFriendlyMode,
            settings: {
                toleranceBoost: this.toleranceBoost,
                minStrokeDistance: this.minStrokeDistance,
                strokeSmoothing: this.strokeSmoothing
            }
        };
    }
    
    // Method for educators to test different tolerance levels
    testAccuracyWithDifferentSettings(testSettings) {
        const originalSettings = {
            childFriendlyMode: this.childFriendlyMode,
            toleranceBoost: this.toleranceBoost,
            tolerance: this.tolerance
        };
        
        const results = [];
        
        testSettings.forEach(setting => {
            // Temporarily apply test settings
            this.childFriendlyMode = setting.childFriendlyMode;
            this.toleranceBoost = setting.toleranceBoost;
            this.tolerance = setting.tolerance;
            
            // Calculate accuracy with these settings
            const accuracy = this.calculateAccuracy();
            
            results.push({
                settings: { ...setting },
                accuracy: accuracy
            });
        });
        
        // Restore original settings
        this.childFriendlyMode = originalSettings.childFriendlyMode;
        this.toleranceBoost = originalSettings.toleranceBoost;
        this.tolerance = originalSettings.tolerance;
        
        return results;
    }
    
    // Method to provide feedback on drawing for improvement
    getDrawingFeedback() {
        if (this.allStrokes.length === 0) {
            return {
                message: "Try tracing the letter by following the outline",
                suggestions: ["Start at the green dot", "Follow the direction arrows"]
            };
        }
        
        const drawnPoints = [];
        this.allStrokes.forEach(stroke => {
            drawnPoints.push(...stroke);
        });
        
        const coverageScore = this.calculateCoverageScore(
            drawnPoints, 
            this.childFriendlyMode ? this.tolerance * this.toleranceBoost : this.tolerance
        );
        
        const directionScore = this.calculateDirectionScore(drawnPoints);
        const completionScore = this.calculateCompletionScore(drawnPoints);
        
        let feedback = {
            coverage: coverageScore,
            direction: directionScore,
            completion: completionScore,
            suggestions: []
        };
        
        if (coverageScore < 60) {
            feedback.suggestions.push("Try to stay closer to the outlined path");
        }
        
        if (directionScore < 60) {
            feedback.suggestions.push("Follow the direction arrows for better tracing");
        }
        
        if (completionScore < 60) {
            feedback.suggestions.push("Make sure to start and finish at the right places");
        }
        
        if (feedback.suggestions.length === 0) {
            feedback.suggestions.push("Great job! Your tracing is improving!");
        }
        
        return feedback;
    }

    destroy() {
        if (this.drawingGraphics) {
            this.drawingGraphics.destroy();
        }
        
        // Remove input listeners
        this.scene.input.off('pointerdown');
        this.scene.input.off('pointermove');
        this.scene.input.off('pointerup');
    }
}