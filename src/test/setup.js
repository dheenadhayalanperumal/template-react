import '@testing-library/jest-dom'

// Mock DOM APIs that Phaser needs
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: vi.fn().mockReturnValue({
    fillStyle: '',
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    getImageData: vi.fn().mockReturnValue({ data: new Array(4) }),
    putImageData: vi.fn(),
    createImageData: vi.fn().mockReturnValue({ data: new Array(4) }),
    setTransform: vi.fn(),
    drawImage: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    closePath: vi.fn(),
    stroke: vi.fn(),
    translate: vi.fn(),
    scale: vi.fn(),
    rotate: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    measureText: vi.fn().mockReturnValue({ width: 10 }),
    font: '',
    globalAlpha: 1,
  })
});

// Mock Phaser.Game to avoid canvas issues in tests
global.Phaser = {
  Game: class MockGame {
    constructor(config) {
      this.config = config;
      this.events = {
        on: vi.fn(),
        emit: vi.fn()
      };
      this.scene = {
        isActive: vi.fn().mockReturnValue(false)
      };
    }
    destroy() {
      // Mock destroy
    }
  },
  Scene: class MockScene {
    constructor(key) {
      this.scene = { key };
      this.add = {
        rectangle: vi.fn().mockReturnThis(),
        text: vi.fn().mockReturnThis(),
        graphics: vi.fn().mockReturnThis()
      };
      this.input = {
        on: vi.fn()
      };
      this.sys = {
        game: {
          config: { width: 1024, height: 768 }
        }
      };
      this.time = {
        delayedCall: vi.fn(),
        addEvent: vi.fn()
      };
      this.tweens = {
        add: vi.fn()
      };
      this.children = {
        removeAll: vi.fn()
      };
    }
  },
  AUTO: 'AUTO',
  Scale: {
    FIT: 'FIT',
    CENTER_BOTH: 'CENTER_BOTH'
  },
  Math: {
    Distance: {
      Between: vi.fn().mockReturnValue(100)
    }
  }
};

// Mock Audio API
global.Audio = class MockAudio {
  constructor() {
    this.play = vi.fn().mockResolvedValue(undefined);
    this.pause = vi.fn();
    this.volume = 1;
    this.currentTime = 0;
  }
};

// Mock Speech Synthesis API
global.speechSynthesis = {
  speak: vi.fn(),
  cancel: vi.fn(),
  getVoices: vi.fn().mockReturnValue([]),
  onvoiceschanged: null
};

global.SpeechSynthesisUtterance = class MockSpeechSynthesisUtterance {
  constructor(text) {
    this.text = text;
    this.lang = 'en-US';
    this.voice = null;
    this.rate = 1;
    this.pitch = 1;
  }
};

// Mock window methods
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
});

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 768,
});