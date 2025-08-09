import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('Game Logic', () => {
  describe('Tamil Letter Management', () => {
    const tamilLetters = [
      { letter: 'அ', transliteration: 'ah', pronunciation: 'அ', nativeSound: 'அ' },
      { letter: 'ஆ', transliteration: 'aah', pronunciation: 'ஆ', nativeSound: 'ஆ' },
      { letter: 'இ', transliteration: 'ih', pronunciation: 'இ', nativeSound: 'இ' },
      { letter: 'ஈ', transliteration: 'eee', pronunciation: 'ஈ', nativeSound: 'ஈ' },
      { letter: 'உ', transliteration: 'uh', pronunciation: 'உ', nativeSound: 'உ' },
    ]

    it('manages current letter index correctly', () => {
      let currentIndex = 0
      
      const goToNext = () => {
        currentIndex = Math.min(currentIndex + 1, tamilLetters.length - 1)
        return currentIndex
      }
      
      const goToPrevious = () => {
        currentIndex = Math.max(currentIndex - 1, 0)
        return currentIndex
      }
      
      expect(currentIndex).toBe(0)
      expect(goToNext()).toBe(1)
      expect(goToNext()).toBe(2)
      expect(goToPrevious()).toBe(1)
      expect(goToPrevious()).toBe(0)
      expect(goToPrevious()).toBe(0) // Should not go below 0
    })

    it('handles letter progression through full set', () => {
      let currentIndex = 0
      
      const advanceToNextLetter = () => {
        currentIndex++
        if (currentIndex >= tamilLetters.length) {
          return { completed: true, index: currentIndex - 1 }
        }
        return { completed: false, index: currentIndex }
      }
      
      // Progress through all letters
      let result
      for (let i = 0; i < tamilLetters.length; i++) {
        result = advanceToNextLetter()
      }
      
      expect(result.completed).toBe(true)
      expect(result.index).toBe(tamilLetters.length - 1)
    })

    it('validates Tamil letter data structure', () => {
      tamilLetters.forEach((letter, index) => {
        expect(letter).toHaveProperty('letter')
        expect(letter).toHaveProperty('transliteration')
        expect(letter).toHaveProperty('pronunciation')
        expect(letter).toHaveProperty('nativeSound')
        
        expect(typeof letter.letter).toBe('string')
        expect(letter.letter.length).toBeGreaterThan(0)
        
        // Ensure transliteration is in Latin characters
        expect(/^[a-zA-Z]+$/.test(letter.transliteration)).toBe(true)
      })
    })
  })

  describe('Score Calculation System', () => {
    it('calculates basic scores correctly', () => {
      const calculateDetailedScore = (drawingPoints, letterBounds, isMobile = false) => {
        let score = 0
        
        // Base score for attempting to draw
        if (drawingPoints.length > 0) {
          score += 30
        }
        
        // Coverage score based on drawing points
        const minPoints = 10
        const maxPoints = 100
        const coverageScore = Math.min(70, Math.floor((drawingPoints.length / maxPoints) * 70))
        score += coverageScore
        
        // Bonus for staying within bounds
        const allPointsInside = drawingPoints.every(point => {
          const margin = isMobile ? 40 : 20
          return (
            point.x >= letterBounds.x - margin &&
            point.x <= letterBounds.x + letterBounds.width + margin &&
            point.y >= letterBounds.y - margin &&
            point.y <= letterBounds.y + letterBounds.height + margin
          )
        })
        
        if (allPointsInside && drawingPoints.length >= minPoints) {
          score += 20
        }
        
        return Math.max(0, Math.min(100, Math.floor(score)))
      }
      
      const bounds = { x: 100, y: 100, width: 800, height: 600 }
      const validPoints = Array(50).fill(0).map((_, i) => ({ x: 200 + i, y: 200 + i }))
      const invalidPoints = [{ x: 50, y: 50 }, { x: 1000, y: 1000 }]
      
      expect(calculateDetailedScore([], bounds)).toBe(0)
      expect(calculateDetailedScore(validPoints, bounds)).toBe(85) // 30 + 35 + 20
      expect(calculateDetailedScore(invalidPoints, bounds)).toBe(31) // 30 + 1, no bonus
    })

    it('provides appropriate score-based feedback', () => {
      const getScoreCategory = (score) => {
        if (score >= 90) return 'excellent'
        if (score >= 75) return 'good'
        if (score >= 50) return 'okay'
        return 'retry'
      }
      
      const getScoreMessage = (score) => {
        const category = getScoreCategory(score)
        const messages = {
          excellent: 'AMAZING! Perfect tracing! 🎉🏆',
          good: 'Excellent work! Great tracing! ⭐',
          okay: 'Good job! Keep practicing!',
          retry: 'Try again! Trace more of the letter carefully.'
        }
        return messages[category]
      }
      
      expect(getScoreCategory(95)).toBe('excellent')
      expect(getScoreCategory(80)).toBe('good')
      expect(getScoreCategory(60)).toBe('okay')
      expect(getScoreCategory(30)).toBe('retry')
      
      expect(getScoreMessage(95)).toContain('AMAZING')
      expect(getScoreMessage(30)).toContain('Try again')
    })
  })

  describe('Mobile Responsiveness Logic', () => {
    it('detects mobile devices correctly', () => {
      const detectMobile = (width, userAgent) => {
        const isNarrowScreen = width <= 768
        const isMobileUA = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
        return isNarrowScreen || isMobileUA
      }
      
      expect(detectMobile(320, 'iPhone')).toBe(true)
      expect(detectMobile(1024, 'Android')).toBe(true)
      expect(detectMobile(1920, 'Mozilla/5.0')).toBe(false)
      expect(detectMobile(500, 'Chrome/Desktop')).toBe(true) // Narrow screen
    })

    it('applies mobile-specific configurations', () => {
      const getMobileConfig = (isMobile) => ({
        letterSize: isMobile ? '600px' : '320px',
        strokeThickness: isMobile ? 6 : 6,
        buttonHeight: isMobile ? 40 : 45,
        margin: isMobile ? 40 : 20,
        titleSize: isMobile ? '16px' : '20px'
      })
      
      const mobileConfig = getMobileConfig(true)
      const desktopConfig = getMobileConfig(false)
      
      expect(mobileConfig.letterSize).toBe('600px')
      expect(desktopConfig.letterSize).toBe('320px')
      expect(mobileConfig.margin).toBe(40)
      expect(desktopConfig.margin).toBe(20)
    })
  })

  describe('Audio File Management', () => {
    it('maps Tamil letters to correct filenames', () => {
      const getAudioFileName = (tamilLetter) => {
        const letterToFile = {
          'அ': 'a.mp3', 'ஆ': 'aa.mp3', 'இ': 'i.mp3', 'ஈ': 'ii.mp3', 'உ': 'u.mp3',
          'க்': 'ka.mp3', 'ங்': 'nga.mp3', 'ச்': 'cha.mp3'
        }
        return letterToFile[tamilLetter] || 'default.mp3'
      }
      
      expect(getAudioFileName('அ')).toBe('a.mp3')
      expect(getAudioFileName('க்')).toBe('ka.mp3')
      expect(getAudioFileName('unknown')).toBe('default.mp3')
    })

    it('handles audio loading and error states', () => {
      const audioStates = {
        loading: false,
        playing: false,
        error: false
      }
      
      const handleAudioLoad = () => {
        audioStates.loading = true
        audioStates.error = false
      }
      
      const handleAudioPlay = () => {
        audioStates.loading = false
        audioStates.playing = true
      }
      
      const handleAudioError = () => {
        audioStates.loading = false
        audioStates.playing = false
        audioStates.error = true
      }
      
      handleAudioLoad()
      expect(audioStates.loading).toBe(true)
      
      handleAudioPlay()
      expect(audioStates.playing).toBe(true)
      expect(audioStates.loading).toBe(false)
      
      handleAudioError()
      expect(audioStates.error).toBe(true)
      expect(audioStates.playing).toBe(false)
    })
  })

  describe('Game State Management', () => {
    it('manages game progression states', () => {
      const gameState = {
        currentScene: 'menu',
        currentLetterIndex: 0,
        score: 0,
        attempts: 3,
        completedLetters: []
      }
      
      const startGame = () => {
        gameState.currentScene = 'drawing'
        gameState.currentLetterIndex = 0
        gameState.score = 0
      }
      
      const completeLetterWithScore = (score) => {
        gameState.completedLetters.push({
          index: gameState.currentLetterIndex,
          score: score
        })
        gameState.currentLetterIndex++
      }
      
      const returnToMenu = () => {
        gameState.currentScene = 'menu'
      }
      
      startGame()
      expect(gameState.currentScene).toBe('drawing')
      
      completeLetterWithScore(85)
      expect(gameState.completedLetters).toHaveLength(1)
      expect(gameState.currentLetterIndex).toBe(1)
      
      returnToMenu()
      expect(gameState.currentScene).toBe('menu')
    })

    it('tracks learning progress', () => {
      const trackProgress = (completedLetters, totalLetters) => {
        const completed = completedLetters.length
        const percentage = Math.floor((completed / totalLetters) * 100)
        const averageScore = completed > 0 
          ? Math.floor(completedLetters.reduce((sum, letter) => sum + letter.score, 0) / completed)
          : 0
        
        return {
          completed,
          total: totalLetters,
          percentage,
          averageScore,
          isComplete: completed === totalLetters
        }
      }
      
      const completedLetters = [
        { index: 0, score: 85 },
        { index: 1, score: 92 },
        { index: 2, score: 78 }
      ]
      
      const progress = trackProgress(completedLetters, 30)
      
      expect(progress.completed).toBe(3)
      expect(progress.percentage).toBe(10)
      expect(progress.averageScore).toBe(85)
      expect(progress.isComplete).toBe(false)
    })
  })

  describe('Error Handling and Edge Cases', () => {
    it('handles empty or invalid drawing data', () => {
      const validateDrawingData = (points) => {
        if (!Array.isArray(points)) {
          return { valid: false, error: 'Points must be an array' }
        }
        
        if (points.length === 0) {
          return { valid: false, error: 'No drawing points provided' }
        }
        
        const hasInvalidPoints = points.some(point => 
          typeof point.x !== 'number' || typeof point.y !== 'number' ||
          isNaN(point.x) || isNaN(point.y)
        )
        
        if (hasInvalidPoints) {
          return { valid: false, error: 'Invalid point coordinates' }
        }
        
        return { valid: true, error: null }
      }
      
      expect(validateDrawingData(null).valid).toBe(false)
      expect(validateDrawingData([]).valid).toBe(false)
      expect(validateDrawingData([{ x: 'invalid', y: 100 }]).valid).toBe(false)
      expect(validateDrawingData([{ x: 100, y: 200 }]).valid).toBe(true)
    })

    it('handles boundary conditions', () => {
      const safeDivision = (numerator, denominator) => {
        if (denominator === 0) return 0
        return numerator / denominator
      }
      
      const clampValue = (value, min, max) => {
        return Math.max(min, Math.min(max, value))
      }
      
      expect(safeDivision(10, 0)).toBe(0)
      expect(safeDivision(10, 2)).toBe(5)
      expect(clampValue(-5, 0, 100)).toBe(0)
      expect(clampValue(150, 0, 100)).toBe(100)
      expect(clampValue(50, 0, 100)).toBe(50)
    })
  })
})