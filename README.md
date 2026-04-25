# Just Shapes & Beats - Story Mode Clone

A high-fidelity, web-based recreation of the iconic rhythm game "Just Shapes & Beats." This project faithfully implements the Story Mode progression, visual cinematics, and intense bullet-hell mechanics with a focus on premium graphics and smooth performance.

## 🚀 Key Features

- **Story Mode Architecture**: A complete progression system featuring an overworld map, level unlocking, and persistent progress via `localStorage`.
- **High-Fidelity Graphics**:
  - **Bloom Engine**: Real-time glow effects for all pink (hazards) and cyan (player) objects.
  - **Authentic Feedback**: Defragmentation (shatter) hit effects, screen shake, and impact freeze-frames.
- **Cinematic System**: Scripted visual cutscenes recreating the "Tree of Life" corruption sequence.
- **Precision Mechanics**:
  - **Dash Invincibility**: Perfectly frame-synced dash logic.
  - **Telegraphing**: Red warning indicators for all hazards showing where "the pink will be."
- **Official Level Mapping**: Faithful recreations of stages like "Long Live The New Fresh," complete with physical boss entities.

## 🛠️ Technology Stack

- **Core**: HTML5 Canvas, Vanilla JavaScript (ES6 Modules).
- **Backend**: Express.js (Security-hardened with Helmet and Rate-limiting).
- **Development**: Vite (Fast HMR and asset bundling).

## 🎮 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended).

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally
For development with hot-reload:
```bash
npm run dev
```
Then visit: `http://localhost:5173`

To run the production-ready Express server:
```bash
npm start
```
Then visit: `http://localhost:3000`

## 🏗️ Architecture Overview

- **`main.js`**: The central game engine. Manages the state machine (`GameState`), player physics, collision detection, and global rendering.
- **`levels/`**: Contains the level design data.
  - `storyData.js`: Defines the world map nodes, connections, and cutscene steps.
  - `fresh.js`, `milkyways.js`: Specific pattern data and boss phases.
- **`MapManager`**: Handles the overworld canvas, pathfinding between nodes, and progress unlocking.
- **`Obstacle` Classes**: A modular hierarchy of hazard types (Pulses, Lasers, Beams, Hexagons) utilizing a two-phase "Telegraph -> Actual" lifecycle.

## 📝 Changelog
Detailed history of updates can be found in [changelogs.md](./changelogs.md).

## 📜 License
This project is for educational purposes. All original "Just Shapes & Beats" intellectual property belongs to **Berserk Studio**.
