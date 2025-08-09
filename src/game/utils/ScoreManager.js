export class ScoreManager {
    constructor() {
        this.reset();
    }

    reset() {
        this.totalScore = 0;
        this.letterScores = [];
        this.attemptHistory = [];
        this.timeSpentPerLetter = [];
        this.difficultyMultiplier = 1.0;
        this.bonusPoints = 0;
        this.startTime = Date.now();
        this.currentLetterStartTime = Date.now();
    }

    setDifficulty(difficulty) {
        // Scoring multipliers based on difficulty
        const multipliers = {
            'EASY': 1.0,
            'MEDIUM': 1.2,
            'HARD': 1.5
        };
        
        this.difficultyMultiplier = multipliers[difficulty] || 1.0;
    }

    startLetterTimer() {
        this.currentLetterStartTime = Date.now();
    }

    recordLetterScore(letterIndex, letter, accuracy, attempts, skipped = false) {
        const endTime = Date.now();
        const timeSpent = endTime - this.currentLetterStartTime;
        
        let baseScore = 0;
        
        if (skipped) {
            baseScore = 0;
        } else {
            // Base score calculation
            baseScore = Math.max(0, accuracy);
            
            // Attempt penalty (fewer attempts = bonus)
            const attemptBonus = Math.max(0, (4 - attempts) * 5); // 0, 5, 10, 15 bonus
            baseScore += attemptBonus;
            
            // Speed bonus (faster completion = bonus, max 10 points)
            const speedBonus = this.calculateSpeedBonus(timeSpent);
            baseScore += speedBonus;
            
            // Perfect accuracy bonus
            if (accuracy >= 95) {
                baseScore += 10;
            } else if (accuracy >= 90) {
                baseScore += 5;
            }
        }
        
        // Apply difficulty multiplier
        const finalScore = Math.round(baseScore * this.difficultyMultiplier);
        
        // Store detailed scoring data
        const scoreData = {
            letterIndex,
            letter: letter.letter,
            transliteration: letter.transliteration,
            baseAccuracy: accuracy,
            finalScore: finalScore,
            attempts: attempts,
            timeSpent: timeSpent,
            skipped: skipped,
            bonusPoints: {
                attemptBonus: skipped ? 0 : Math.max(0, (4 - attempts) * 5),
                speedBonus: skipped ? 0 : this.calculateSpeedBonus(timeSpent),
                accuracyBonus: this.getAccuracyBonus(accuracy),
                difficultyBonus: Math.round(baseScore * (this.difficultyMultiplier - 1.0))
            }
        };
        
        this.letterScores.push(scoreData);
        this.timeSpentPerLetter.push(timeSpent);
        this.attemptHistory.push(attempts);
        
        // Update total score
        this.totalScore += finalScore;
        
        return scoreData;
    }

    calculateSpeedBonus(timeSpent) {
        // Speed bonus calculation (in milliseconds)
        const fastTime = 15000; // 15 seconds is considered fast
        const slowTime = 60000; // 60 seconds is considered slow
        
        if (timeSpent <= fastTime) {
            return 10; // Maximum speed bonus
        } else if (timeSpent <= slowTime) {
            // Linear decrease from 10 to 0
            return Math.round(10 * (slowTime - timeSpent) / (slowTime - fastTime));
        } else {
            return 0; // No speed bonus for slow completion
        }
    }

    getAccuracyBonus(accuracy) {
        if (accuracy >= 95) return 10;
        if (accuracy >= 90) return 5;
        return 0;
    }

    calculateFinalScore() {
        const totalPossible = this.letterScores.length * 100 * this.difficultyMultiplier;
        if (totalPossible === 0) return 0;
        
        const percentage = Math.round((this.totalScore / totalPossible) * 100);
        return Math.min(100, percentage);
    }

    getSessionStatistics() {
        const totalTime = Date.now() - this.startTime;
        const completedLetters = this.letterScores.filter(score => !score.skipped).length;
        const skippedLetters = this.letterScores.filter(score => score.skipped).length;
        const totalAttempts = this.attemptHistory.reduce((sum, attempts) => sum + attempts, 0);
        const averageAccuracy = this.getAverageAccuracy();
        const averageTime = this.getAverageTime();
        
        return {
            // Basic stats
            totalScore: this.totalScore,
            finalPercentage: this.calculateFinalScore(),
            totalLetters: this.letterScores.length,
            completedLetters,
            skippedLetters,
            
            // Time stats
            totalTime,
            averageTimePerLetter: averageTime,
            fastestLetter: Math.min(...this.timeSpentPerLetter),
            slowestLetter: Math.max(...this.timeSpentPerLetter),
            
            // Accuracy stats
            averageAccuracy,
            bestAccuracy: Math.max(...this.letterScores.map(s => s.baseAccuracy)),
            worstAccuracy: Math.min(...this.letterScores.map(s => s.baseAccuracy)),
            perfectLetters: this.letterScores.filter(s => s.baseAccuracy >= 95).length,
            
            // Attempt stats
            totalAttempts,
            averageAttempts: totalAttempts / this.letterScores.length,
            firstTrySuccesses: this.letterScores.filter(s => s.attempts === 1).length,
            
            // Performance categories
            performanceLevel: this.getPerformanceLevel(),
            achievements: this.calculateAchievements(),
            
            // Difficulty stats
            difficultyMultiplier: this.difficultyMultiplier,
            bonusPointsEarned: this.calculateTotalBonusPoints()
        };
    }

    getAverageAccuracy() {
        const completedScores = this.letterScores.filter(score => !score.skipped);
        if (completedScores.length === 0) return 0;
        
        const totalAccuracy = completedScores.reduce((sum, score) => sum + score.baseAccuracy, 0);
        return Math.round(totalAccuracy / completedScores.length);
    }

    getAverageTime() {
        if (this.timeSpentPerLetter.length === 0) return 0;
        
        const totalTime = this.timeSpentPerLetter.reduce((sum, time) => sum + time, 0);
        return Math.round(totalTime / this.timeSpentPerLetter.length);
    }

    getPerformanceLevel() {
        const finalScore = this.calculateFinalScore();
        
        if (finalScore >= 90) return 'Excellent';
        if (finalScore >= 80) return 'Great';
        if (finalScore >= 70) return 'Good';
        if (finalScore >= 60) return 'Fair';
        return 'Keep Practicing';
    }

    calculateAchievements() {
        const achievements = [];
        const stats = this.getSessionStatistics();
        
        // Perfect score achievement
        if (stats.finalPercentage === 100) {
            achievements.push({
                name: 'Perfect Score!',
                description: 'Achieved 100% accuracy',
                icon: '🏆',
                rarity: 'legendary'
            });
        }
        
        // Speed demon
        if (stats.averageTimePerLetter < 20000) { // Less than 20 seconds average
            achievements.push({
                name: 'Speed Demon',
                description: 'Fast letter completion',
                icon: '⚡',
                rarity: 'rare'
            });
        }
        
        // First try master
        if (stats.firstTrySuccesses >= stats.completedLetters * 0.8) {
            achievements.push({
                name: 'First Try Master',
                description: 'Most letters correct on first try',
                icon: '🎯',
                rarity: 'epic'
            });
        }
        
        // Perfectionist
        if (stats.perfectLetters >= stats.completedLetters * 0.5) {
            achievements.push({
                name: 'Perfectionist',
                description: 'High accuracy on most letters',
                icon: '💎',
                rarity: 'rare'
            });
        }
        
        // Persistent learner
        if (stats.totalLetters >= 12 && stats.skippedLetters === 0) {
            achievements.push({
                name: 'Persistent Learner',
                description: 'Completed all letters without skipping',
                icon: '🌟',
                rarity: 'common'
            });
        }
        
        // Hard mode hero
        if (this.difficultyMultiplier >= 1.5 && stats.finalPercentage >= 75) {
            achievements.push({
                name: 'Hard Mode Hero',
                description: 'Great performance on hard difficulty',
                icon: '🦸',
                rarity: 'epic'
            });
        }
        
        return achievements;
    }

    calculateTotalBonusPoints() {
        return this.letterScores.reduce((total, score) => {
            const bonuses = score.bonusPoints;
            return total + bonuses.attemptBonus + bonuses.speedBonus + 
                   bonuses.accuracyBonus + bonuses.difficultyBonus;
        }, 0);
    }

    getDetailedReport() {
        return {
            letterScores: this.letterScores,
            statistics: this.getSessionStatistics(),
            recommendations: this.getRecommendations()
        };
    }

    getRecommendations() {
        const stats = this.getSessionStatistics();
        const recommendations = [];
        
        // Based on accuracy
        if (stats.averageAccuracy < 70) {
            recommendations.push({
                type: 'accuracy',
                message: 'Try using easier difficulty or practice tracing shapes first',
                action: 'practice_basics'
            });
        }
        
        // Based on speed
        if (stats.averageTimePerLetter > 45000) { // More than 45 seconds
            recommendations.push({
                type: 'speed',
                message: 'Take your time, but try to trace more confidently',
                action: 'confidence_building'
            });
        }
        
        // Based on attempts
        if (stats.averageAttempts > 2.5) {
            recommendations.push({
                type: 'attempts',
                message: 'Focus on the letter shape before starting to trace',
                action: 'observation_practice'
            });
        }
        
        // Based on performance level
        if (stats.performanceLevel === 'Excellent') {
            recommendations.push({
                type: 'progression',
                message: 'Ready for the next stage or higher difficulty!',
                action: 'advance_level'
            });
        }
        
        return recommendations;
    }

    // Save/Load functionality for persistence
    saveToLocalStorage(stageKey) {
        try {
            const data = {
                statistics: this.getSessionStatistics(),
                letterScores: this.letterScores,
                timestamp: Date.now()
            };
            
            localStorage.setItem(`tamilGame_scores_${stageKey}`, JSON.stringify(data));
            
            // Also save high score if this is better
            const currentHighScore = this.loadHighScore(stageKey);
            if (this.calculateFinalScore() > currentHighScore) {
                localStorage.setItem(`tamilGame_highscore_${stageKey}`, this.calculateFinalScore().toString());
            }
        } catch (e) {
            console.warn('Could not save score data:', e);
        }
    }

    loadHighScore(stageKey) {
        try {
            const highScore = localStorage.getItem(`tamilGame_highscore_${stageKey}`);
            return highScore ? parseInt(highScore) : 0;
        } catch (e) {
            return 0;
        }
    }
}