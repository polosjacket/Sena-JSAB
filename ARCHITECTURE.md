# Technical Architecture - JSAB Clone

This document provides a deep dive into the engine design and technical implementation details of the Just Shapes & Beats clone.

## 1. Game State Machine

The core flow is managed by a `GameState` enum in `main.js`. This ensures clean transitions between the menu, world map, cinematics, and active gameplay.

| State | Purpose | Transitions To |
|-------|---------|----------------|
| `MENU` | Start screen and main options. | `MAP`, `CUTSCENE` |
| `MAP` | Interactive overworld navigation. | `PLAYING`, `MENU` |
| `CUTSCENE` | Scripted visual sequences. | `MAP`, `PLAYING` |
| `PLAYING` | Active bullet-hell level. | `GAMEOVER`, `MAP` |
| `GAMEOVER` | Failure screen. | `PLAYING`, `MAP` |

## 2. The Obstacle System

All hazards derive from the `Obstacle` base class. This system uses a **Time-Based Lifecycle**:

1. **Pre-Spawn**: Obstacle exists in the `obstacles` wait-list.
2. **Telegraph Phase** (`drawTelegraph`): When `levelTime >= startTime - warning`, the obstacle moves to `activeObstacles`. It draws red indicators but has no collision.
3. **Actual Phase** (`drawActual`): Once `levelTime >= startTime`, the hazard turns pink and becomes lethal.
4. **Death**: After its `duration`, the hazard sets its `dead` flag and is culled from the array.

### Custom Patterns
- **`Burst`**: Fires a circular array of `Projectile` objects.
- **`LaserV` / `BeamH`**: Uses full-axis area-of-effect (AoE) collision boxes.
- **`Hexagon`**: High-detail geometry with rotation and pulsation.

## 3. High-Fidelity Rendering

The "glow" effect is achieved via **Shadow Blurring** on the Canvas context.
```javascript
ctx.shadowBlur = 20;
ctx.shadowColor = '#ff007f';
ctx.fillRect(...);
```
To maintain performance, `shadowBlur` is only enabled for high-priority objects (Player, Active Hazards) and disabled immediately after drawing.

## 4. Progress Persistence

Player progress is serialized to a JSON object and stored in `localStorage`.
- **`unlockedNodes`**: Array of node IDs available on the map.
- **`completedNodes`**: Array of node IDs already beaten.
- **`lastPosition`**: Coordinates of the player square on the world map.

## 5. Level Data Format

Levels are defined as data objects in `levels/`.
```javascript
export const myLevel = {
    name: "Level Name",
    data: [
        { time: 1.5, type: 'burst', x: 640, y: 360, count: 12, speed: 6, warning: 800 }
    ]
}
```
`time` is in seconds, while `warning` (telegraph duration) is in milliseconds.
