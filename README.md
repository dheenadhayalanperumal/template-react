# Tamil Aathichudi Draw & Learn Game

Educational Tamil alphabet learning game for children aged 3-8. Built with React + Phaser 3 framework for interactive touch-based letter tracing.

### Technologies Used

- [Phaser 3.90.0](https://phaser.io) - Game engine for interactive graphics and animations
- [React 19.0.0](https://reactjs.org) - UI framework
- [Vite 6.3.1](https://vitejs.dev) - Build tool and development server

## Requirements

[Node.js](https://nodejs.org) is required to install dependencies and run scripts via `npm`.

## Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm run dev` | Launch development server (usually runs on port 8080/8081) |
| `npm run build` | Create production build in the `dist` folder |

## Getting Started

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Open your browser to `http://localhost:8080` (or the port shown in terminal)
4. The game will load with the Tamil alphabet learning interface

## Game Features

- **30 Tamil Letters**: Complete Uyir (vowels) and Mei (consonants) alphabet
- **Touch-Based Tracing**: Draw within letter boundaries using mouse/touch
- **Progressive Learning**: Move through letters one by one
- **Scoring System**: 0-100 points with different feedback levels
- **Responsive Design**: Optimized for both mobile and desktop
- **Interactive Animations**: Celebrations, particles, and visual feedback

## Project Structure

| Path                          | Description                                                                 |
|-------------------------------|-----------------------------------------------------------------------------|
| `index.html`                  | Main HTML page that contains the game                                      |
| `src/`                        | Contains the React and game source code                                    |
| `src/main.jsx`                | React application entry point                                              |
| `src/MinimalGame.jsx`         | Main game component with Phaser integration                                |
| `public/style.css`            | Styling for the application                                                |
| `CLAUDE.md`                   | Project documentation and implementation notes                             |

## Game Architecture

The game is built using:

- **MinimalScene**: Main menu and start screen
- **DrawingScene**: Interactive letter tracing interface
- **Letter System**: 30 Tamil letters with proper bounds detection
- **Scoring System**: Real-time feedback with animations

## How to Play

1. Click "START LEARNING" from the main menu
2. Trace the Tamil letter shown on screen by drawing within the black outline
3. Receive score and feedback based on your tracing accuracy
4. Progress through all 30 Tamil letters
5. Celebrate completion with the final screen

## Scoring Levels

- **Below 50**: Try again (shake animation, must retry)
- **50-74**: Good job (can proceed to next letter)
- **75-89**: Excellent (star particles reward)
- **90+**: Amazing (fireworks celebration)

## Development

The game uses Vite for hot-reloading during development. Any changes to files in the `src` folder will automatically reload the browser.

For production deployment, run `npm run build` to create optimized files in the `dist` folder.

## Credits

Built for educational purposes to help children learn Tamil alphabet through interactive tracing.
