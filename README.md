# cosmic-defender-3d-take-2

Browser-based 3D Cosmic Defender game built with Three.js

## Features

- **3D Arena**: A 100x100 unit playing field with:
  - Grid floor for spatial reference
  - Semi-transparent boundary walls
  - Atmospheric fog effects
  
- **Player Spaceship**: A tiny geometric spaceship with:
  - Distinctive green cockpit and blue wings
  - Glowing orange engine with dynamic lighting
  - Smooth floating animation

- **Interactive Camera**: Mouse-controlled orbit camera for viewing the scene from any angle

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Running the Game

```bash
# Start development server
npm run dev
```

Then open your browser to `http://localhost:5173/`

### Building for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build
npm run preview
```

## Controls

- **Mouse**: Click and drag to rotate camera
- **Mouse Wheel**: Zoom in/out
- **WASD Movement**: Coming soon!

## Technology Stack

- **Three.js**: 3D graphics library
- **Vite**: Fast build tool and dev server
- **Vanilla JavaScript**: ES6 modules

## Project Structure

```
cosmic-defender-3d-take-2/
├── index.html          # Main HTML entry point
├── styles.css          # Global styles
├── js/
│   └── main.js        # Game logic and Three.js scene
├── package.json        # Dependencies and scripts
└── README.md          # This file
```

## Future Enhancements

- Player movement controls (WASD)
- Enemy ships
- Collision detection
- Shooting mechanics
- Score system
- Sound effects
- Multiple levels

## License

ISC

