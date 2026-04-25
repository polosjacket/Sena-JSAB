# Changelog - JSAB Story Mode Project

All notable changes to the Just Shapes & Beats clone implementation.

## [v1.2.0] - High-Fidelity & Gameplay Polish
### Added
- **High-Fidelity Graphics Engine**: Implemented a global bloom/glow effect for all hazards and player objects.
- **Red Attack Telegraphing**: Added red warning indicators for all obstacles to signal where "the pink will be."
- **Authentic Damage Mechanics**:
    - **Defragmentation**: Player square now shatters into particles on hit.
    - **Screen Shake**: Dynamic camera jitter on damage and boss slams.
    - **Time Freeze**: 100ms impact pause for visceral feedback.
- **Physical Boss Presence**: Added a detailed Boss entity in the level with ears, rotating spikes, and a pulsing eye.
- **Level Intro Cards**: Cinematic title cards displaying level name and author at the start of each stage.

### Fixed
- **Dash Invincibility**: Rebuilt the dash state machine to ensure the player is invincible for the full duration, including the final frame.
- **Collision Overhaul**: Fixed a bug where dashing through hazards could trigger a game over (the "restart" bug).
- **Smoothness**: Synchronized all movement logic with `dt` (delta time) for consistent performance across high-refresh-rate monitors.

### Changed
- **Level Balancing**: Adjusted "Long Live The New Fresh" to be non-endless and removed "full-screen pink" patterns to ensure the game is fair and possible.

---

## [v1.1.0] - Visual Story Mode
### Added
- **Visual Cinematic Engine**: Replaced text-based dialogue with scripted Canvas animations.
- **Intro Sequence**: Recreated the "Tree of Life" corruption sequence with the Spiky Boss and shattering geometry.
- **Overworld Map**: Interactive 2D map with WASD navigation and persistent progression.
- **Save System**: Integrated `localStorage` to track unlocked levels and player position.

### Changed
- **Cutscene Refactor**: Removed all "made-up" text to focus on the wordless visual storytelling found in the actual game.

---

## [v1.0.0] - Initial Prototype
### Added
- **Core Engine**: Basic rhythm-game physics with dash mechanics.
- **Level System**: Modular level data loading from JS files.
- **Obstacle Library**: Initial patterns (PulseCircle, LaserV, Burst).
- **Security**: Express server with Helmet and Rate-limiting.
