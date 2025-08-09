import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('Drawing System', () => {
  let mockDrawingSystem
  
  beforeEach(() => {
    vi.clearAllMocks()
    
    mockDrawingSystem = {
      isDrawing: false,
      drawingPoints: [],
      drawingGraphics: {
        clear: vi.fn(),
        lineStyle: vi.fn(),
        beginPath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        strokePath: vi.fn()
      },
      letterBounds: {
        x: 100,
        y: 100,
        width: 800,
        height: 600
      }
    }
  })

  describe('Drawing State Management', () => {
    it('initializes with correct default state', () => {
      expect(mockDrawingSystem.isDrawing).toBe(false)
      expect(mockDrawingSystem.drawingPoints).toEqual([])
    })

    it('starts drawing on pointer down', () => {
      const startDrawing = (x, y) => {
        mockDrawingSystem.isDrawing = true
        mockDrawingSystem.drawingPoints = [{ x, y }]
      }
      
      startDrawing(300, 200)
      
      expect(mockDrawingSystem.isDrawing).toBe(true)
      expect(mockDrawingSystem.drawingPoints).toHaveLength(1)
      expect(mockDrawingSystem.drawingPoints[0]).toEqual({ x: 300, y: 200 })
    })

    it('adds points during drawing movement', () => {
      const addDrawingPoint = (x, y) => {
        if (mockDrawingSystem.isDrawing) {
          mockDrawingSystem.drawingPoints.push({ x, y })
        }
      }
      
      mockDrawingSystem.isDrawing = true
      addDrawingPoint(310, 210)
      addDrawingPoint(320, 220)
      
      expect(mockDrawingSystem.drawingPoints).toHaveLength(2)
    })

    it('stops drawing on pointer up', () => {
      const stopDrawing = () => {
        mockDrawingSystem.isDrawing = false
      }
      
      mockDrawingSystem.isDrawing = true
      stopDrawing()
      
      expect(mockDrawingSystem.isDrawing).toBe(false)
    })
  })

  describe('Bounds Checking', () => {
    const isInsideLetterBounds = (x, y, bounds, margin = 20) => {
      return (
        x >= bounds.x - margin &&
        x <= bounds.x + bounds.width + margin &&
        y >= bounds.y - margin &&
        y <= bounds.y + bounds.height + margin
      )
    }

    it('validates points inside letter bounds', () => {
      const bounds = mockDrawingSystem.letterBounds
      
      expect(isInsideLetterBounds(300, 200, bounds)).toBe(true)
      expect(isInsideLetterBounds(500, 400, bounds)).toBe(true)
    })

    it('rejects points outside letter bounds', () => {
      const bounds = mockDrawingSystem.letterBounds
      
      expect(isInsideLetterBounds(50, 50, bounds)).toBe(false)
      expect(isInsideLetterBounds(1000, 800, bounds)).toBe(false)
    })

    it('handles margin for bounds checking', () => {
      const bounds = mockDrawingSystem.letterBounds
      
      // Point just outside bounds but within margin
      expect(isInsideLetterBounds(85, 85, bounds, 20)).toBe(true)
      
      // Point outside bounds and margin
      expect(isInsideLetterBounds(70, 70, bounds, 20)).toBe(false)
    })

    it('adapts bounds for mobile devices', () => {
      const mobileBounds = {
        ...mockDrawingSystem.letterBounds,
        x: 50,
        y: 50,
        width: 300,
        height: 500
      }
      
      expect(isInsideLetterBounds(200, 300, mobileBounds)).toBe(true)
    })
  })

  describe('Drawing Graphics', () => {
    it('initializes graphics with correct line style', () => {
      const initializeGraphics = (thickness, color, alpha) => {
        mockDrawingSystem.drawingGraphics.lineStyle(thickness, color, alpha)
      }
      
      initializeGraphics(12, 0x2196f3, 0.8)
      
      expect(mockDrawingSystem.drawingGraphics.lineStyle).toHaveBeenCalledWith(12, 0x2196f3, 0.8)
    })

    it('draws lines between points', () => {
      const drawLine = (fromX, fromY, toX, toY) => {
        mockDrawingSystem.drawingGraphics.beginPath()
        mockDrawingSystem.drawingGraphics.moveTo(fromX, fromY)
        mockDrawingSystem.drawingGraphics.lineTo(toX, toY)
        mockDrawingSystem.drawingGraphics.strokePath()
      }
      
      drawLine(100, 100, 200, 200)
      
      expect(mockDrawingSystem.drawingGraphics.beginPath).toHaveBeenCalled()
      expect(mockDrawingSystem.drawingGraphics.moveTo).toHaveBeenCalledWith(100, 100)
      expect(mockDrawingSystem.drawingGraphics.lineTo).toHaveBeenCalledWith(200, 200)
      expect(mockDrawingSystem.drawingGraphics.strokePath).toHaveBeenCalled()
    })

    it('clears drawing graphics', () => {
      const clearDrawing = () => {
        mockDrawingSystem.drawingGraphics.clear()
        mockDrawingSystem.drawingPoints = []
      }
      
      clearDrawing()
      
      expect(mockDrawingSystem.drawingGraphics.clear).toHaveBeenCalled()
      expect(mockDrawingSystem.drawingPoints).toEqual([])
    })

    it('applies responsive line thickness', () => {
      const getLineThickness = (isMobile) => isMobile ? 10 : 12
      
      expect(getLineThickness(true)).toBe(10)
      expect(getLineThickness(false)).toBe(12)
    })
  })

  describe('Guide Lines System', () => {
    let mockGuideGraphics
    
    beforeEach(() => {
      mockGuideGraphics = {
        lineStyle: vi.fn(),
        beginPath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        strokePath: vi.fn(),
        clear: vi.fn()
      }
    })

    it('creates dotted guide lines', () => {
      const createDottedLine = (x1, y1, x2, y2) => {
        mockGuideGraphics.lineStyle(1, 0x888888, 0.5)
        
        const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
        const segments = Math.floor(distance / 8)
        
        for (let i = 0; i < segments; i += 2) {
          const t1 = i / segments
          const t2 = Math.min((i + 1) / segments, 1)
          
          const startX = x1 + (x2 - x1) * t1
          const startY = y1 + (y2 - y1) * t1
          const endX = x1 + (x2 - x1) * t2
          const endY = y1 + (y2 - y1) * t2
          
          mockGuideGraphics.beginPath()
          mockGuideGraphics.moveTo(startX, startY)
          mockGuideGraphics.lineTo(endX, endY)
          mockGuideGraphics.strokePath()
        }
      }
      
      createDottedLine(100, 100, 200, 200)
      
      expect(mockGuideGraphics.lineStyle).toHaveBeenCalledWith(1, 0x888888, 0.5)
      expect(mockGuideGraphics.beginPath).toHaveBeenCalled()
      expect(mockGuideGraphics.strokePath).toHaveBeenCalled()
    })

    it('creates letter-specific guide patterns', () => {
      const createGuideForTamilLetter = (letter) => {
        mockGuideGraphics.lineStyle(1, 0x888888, 0.5)
        
        switch(letter) {
          case 'அ':
            // Vertical guide
            mockGuideGraphics.moveTo(150, 100)
            mockGuideGraphics.lineTo(150, 300)
            break
          case 'க்':
            // Horizontal guide  
            mockGuideGraphics.moveTo(100, 150)
            mockGuideGraphics.lineTo(300, 150)
            break
          default:
            // Generic cross pattern
            mockGuideGraphics.moveTo(100, 200)
            mockGuideGraphics.lineTo(300, 200)
        }
        
        mockGuideGraphics.strokePath()
      }
      
      createGuideForTamilLetter('அ')
      
      expect(mockGuideGraphics.lineStyle).toHaveBeenCalled()
      expect(mockGuideGraphics.strokePath).toHaveBeenCalled()
    })

    it('clears guide lines when needed', () => {
      const clearGuides = () => {
        mockGuideGraphics.clear()
      }
      
      clearGuides()
      
      expect(mockGuideGraphics.clear).toHaveBeenCalled()
    })
  })

  describe('Drawing Evaluation', () => {
    it('calculates score based on drawing points', () => {
      const calculateScore = (points) => {
        let score = 0
        
        if (points.length > 0) {
          score += 30 // Base score for attempting
        }
        
        const coverageScore = Math.min(70, Math.floor((points.length / 100) * 70))
        score += coverageScore
        
        return Math.max(0, Math.min(100, Math.floor(score)))
      }
      
      expect(calculateScore([])).toBe(0)
      expect(calculateScore([{x: 100, y: 100}])).toBe(30)
      expect(calculateScore(new Array(50).fill({x: 100, y: 100}))).toBe(65)
    })

    it('validates drawing quality', () => {
      const validateDrawing = (points, bounds) => {
        const allPointsInside = points.every(point => 
          isInsideLetterBounds(point.x, point.y, bounds, 20)
        )
        
        return {
          valid: allPointsInside && points.length >= 10,
          pointsInside: allPointsInside,
          sufficientPoints: points.length >= 10
        }
      }
      
      const validPoints = [
        {x: 200, y: 200}, {x: 210, y: 210}, {x: 220, y: 220},
        {x: 230, y: 230}, {x: 240, y: 240}, {x: 250, y: 250},
        {x: 260, y: 260}, {x: 270, y: 270}, {x: 280, y: 280},
        {x: 290, y: 290}, {x: 300, y: 300}
      ]
      
      const result = validateDrawing(validPoints, mockDrawingSystem.letterBounds)
      
      expect(result.valid).toBe(true)
      expect(result.pointsInside).toBe(true)
      expect(result.sufficientPoints).toBe(true)
    })

    it('provides appropriate feedback based on score', () => {
      const getFeedback = (score) => {
        if (score >= 90) return { message: 'Excellent!', color: '#4caf50' }
        if (score >= 75) return { message: 'Great job!', color: '#8bc34a' }
        if (score >= 50) return { message: 'Good work!', color: '#ff9800' }
        return { message: 'Try again!', color: '#f44336' }
      }
      
      expect(getFeedback(95)).toEqual({ message: 'Excellent!', color: '#4caf50' })
      expect(getFeedback(80)).toEqual({ message: 'Great job!', color: '#8bc34a' })
      expect(getFeedback(60)).toEqual({ message: 'Good work!', color: '#ff9800' })
      expect(getFeedback(30)).toEqual({ message: 'Try again!', color: '#f44336' })
    })
  })

  describe('Touch and Mouse Events', () => {
    it('handles pointer down events', () => {
      const handlePointerDown = (event) => {
        const { x, y } = event
        
        if (isInsideLetterBounds(x, y, mockDrawingSystem.letterBounds)) {
          mockDrawingSystem.isDrawing = true
          mockDrawingSystem.drawingPoints = [{ x, y }]
          return true
        }
        return false
      }
      
      const validEvent = { x: 300, y: 200 }
      const invalidEvent = { x: 50, y: 50 }
      
      expect(handlePointerDown(validEvent)).toBe(true)
      expect(handlePointerDown(invalidEvent)).toBe(false)
    })

    it('handles pointer move events', () => {
      const handlePointerMove = (event) => {
        if (!mockDrawingSystem.isDrawing) return false
        
        const { x, y } = event
        
        if (isInsideLetterBounds(x, y, mockDrawingSystem.letterBounds)) {
          mockDrawingSystem.drawingPoints.push({ x, y })
          return true
        } else {
          mockDrawingSystem.isDrawing = false
          return false
        }
      }
      
      mockDrawingSystem.isDrawing = true
      
      const validMove = { x: 310, y: 210 }
      const invalidMove = { x: 50, y: 50 }
      
      expect(handlePointerMove(validMove)).toBe(true)
      expect(handlePointerMove(invalidMove)).toBe(false)
    })

    it('handles pointer up events', () => {
      const handlePointerUp = () => {
        if (mockDrawingSystem.isDrawing) {
          mockDrawingSystem.isDrawing = false
          return mockDrawingSystem.drawingPoints.length
        }
        return 0
      }
      
      mockDrawingSystem.isDrawing = true
      mockDrawingSystem.drawingPoints = [{ x: 100, y: 100 }, { x: 200, y: 200 }]
      
      const pointCount = handlePointerUp()
      
      expect(mockDrawingSystem.isDrawing).toBe(false)
      expect(pointCount).toBe(2)
    })
  })

  const isInsideLetterBounds = (x, y, bounds, margin = 20) => {
    return (
      x >= bounds.x - margin &&
      x <= bounds.x + bounds.width + margin &&
      y >= bounds.y - margin &&
      y <= bounds.y + bounds.height + margin
    )
  }
})