import { levels } from './levels/index.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;
const PLAYER_SIZE = 20;
const DASH_DISTANCE = 150;
const DASH_COOLDOWN = 500; // ms
const DASH_DURATION = 150; // ms
const INVINCIBLE_DURATION = 1000; // ms after hit
const MAX_HEALTH = 100;

// Game UI Elements
const startScreen = document.getElementById('start-screen');
const levelSelection = document.getElementById('level-selection');
const levelGrid = document.getElementById('level-grid');
const gameUI = document.getElementById('game-ui');
const gameOverScreen = document.getElementById('game-over-screen');
const startBtn = document.getElementById('start-btn');
const showLevelsBtn = document.getElementById('show-levels-btn');
const backToMenuBtn = document.getElementById('back-to-menu');
const restartBtn = document.getElementById('restart-btn');
const healthBar = document.getElementById('health-bar');
const scoreDisplay = document.getElementById('score');

// Current level info
let currentLevelData = null;

// Populate level grid
function initLevelGrid() {
    levelGrid.innerHTML = '';
    levels.forEach((level, index) => {
        const card = document.createElement('div');
        card.className = 'level-card';
        card.innerHTML = `
            <div class="difficulty">${index === 0 ? 'TUTORIAL' : 'BOSS'}</div>
            <h3>${level.name}</h3>
            <p>${level.author}</p>
        `;
        card.onclick = () => {
            currentLevelData = level;
            startLevel();
        };
        levelGrid.appendChild(card);
    });
}

initLevelGrid();

// Navigation
showLevelsBtn.onclick = () => {
    startScreen.classList.remove('active');
    levelSelection.classList.add('active');
};

backToMenuBtn.onclick = () => {
    levelSelection.classList.remove('active');
    startScreen.classList.add('active');
};

startBtn.onclick = () => {
    currentLevelData = levels[0]; // Tutorial
    startLevel();
};

// Game state
let gameState = 'START'; // START, PLAYING, GAMEOVER
let score = 0;
let health = MAX_HEALTH;
let lastTime = 0;
let levelTime = 0;
let audioContext, audioBuffer, audioSource;
let isAudioLoading = false;

// Input state
const keys = {};
let player = {
    x: GAME_WIDTH / 2,
    y: GAME_HEIGHT / 2,
    vx: 0,
    vy: 0,
    speed: 6,
    isDashing: false,
    lastDash: 0,
    dashDir: { x: 0, y: 0 },
    isInvincible: false,
    invincibleUntil: 0,
    color: '#00f2ff'
};

// Obstacles
let obstacles = [];
let activeObstacles = [];

// Resize canvas
function resize() {
    const scale = Math.min(window.innerWidth / GAME_WIDTH, window.innerHeight / GAME_HEIGHT);
    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;
    canvas.style.width = `${GAME_WIDTH * scale}px`;
    canvas.style.height = `${GAME_HEIGHT * scale}px`;
}

window.addEventListener('resize', resize);
resize();

// Input listeners
window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);





// Projectile helper
class Projectile {
    constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.size = 10;
        this.dead = false;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > GAME_WIDTH || this.y < 0 || this.y > GAME_HEIGHT) this.dead = true;
    }
    draw() {
        ctx.fillStyle = '#ff007f';
        ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
    }
}

// Classes
class Obstacle {
    constructor(config) {
        this.config = config;
        this.startTime = config.time * 1000;
        this.active = false;
        this.dead = false;
        this.spawnedAt = 0;
    }

    update(currentTime, dt) {
        if (!this.active && currentTime >= this.startTime) {
            this.active = true;
            this.spawnedAt = currentTime;
        }
    }

    draw() {}
    checkCollision(px, py) { return false; }
}

class PulseCircle extends Obstacle {
    draw(currentTime) {
        const elapsed = currentTime - this.spawnedAt;
        const progress = Math.min(elapsed / this.config.duration, 1);
        const currentSize = this.config.targetSize * progress;
        
        ctx.beginPath();
        ctx.arc(this.config.x, this.config.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = progress > 0.8 ? '#ff007f' : 'rgba(255, 0, 127, 0.3)';
        ctx.fill();
        
        if (progress >= 1) this.dead = true;
    }

    checkCollision(px, py, currentTime) {
        const elapsed = currentTime - this.spawnedAt;
        if (elapsed < this.config.duration * 0.8) return false;
        
        const currentSize = this.config.targetSize;
        const dx = px - this.config.x;
        const dy = py - this.config.y;
        return Math.sqrt(dx * dx + dy * dy) < currentSize;
    }
}

class LaserV extends Obstacle {
    draw(currentTime) {
        const elapsed = currentTime - this.spawnedAt;
        const isWarning = elapsed < this.config.warning;
        
        ctx.fillStyle = isWarning ? 'rgba(255, 0, 127, 0.2)' : '#ff007f';
        ctx.fillRect(this.config.x - 10, 0, 20, GAME_HEIGHT);
        
        if (elapsed >= this.config.warning + this.config.duration) this.dead = true;
    }

    checkCollision(px, py, currentTime) {
        const elapsed = currentTime - this.spawnedAt;
        if (elapsed < this.config.warning) return false;
        return px > this.config.x - 20 && px < this.config.x + 20;
    }
}

class Burst extends Obstacle {
    constructor(config) {
        super(config);
        this.fired = false;
        this.projectiles = [];
    }

    draw(currentTime) {
        const elapsed = currentTime - this.spawnedAt;
        
        if (elapsed < this.config.warning) {
            // Warning circle
            ctx.strokeStyle = 'rgba(255, 0, 127, 0.5)';
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.arc(this.config.x, this.config.y, 30, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
        } else if (!this.fired) {
            this.fired = true;
            for (let i = 0; i < this.config.count; i++) {
                const angle = (i / this.config.count) * Math.PI * 2;
                this.projectiles.push(new Projectile(
                    this.config.x, 
                    this.config.y, 
                    Math.cos(angle) * this.config.speed, 
                    Math.sin(angle) * this.config.speed
                ));
            }
        }

        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            p.update();
            p.draw();
            if (p.dead) this.projectiles.splice(i, 1);
        }

        if (this.fired && this.projectiles.length === 0) this.dead = true;
    }

    checkCollision(px, py) {
        for (let p of this.projectiles) {
            const dx = px - p.x;
            const dy = py - p.y;
            if (Math.abs(dx) < p.size && Math.abs(dy) < p.size) return true;
        }
        return false;
    }
}

class WallH extends Obstacle {
    draw(currentTime) {
        const elapsed = currentTime - this.spawnedAt;
        this.y = this.config.y + (elapsed / 1000) * this.config.speed * 60;
        
        ctx.fillStyle = '#ff007f';
        ctx.fillRect(0, this.y, GAME_WIDTH, this.config.h);
        
        if (this.y > GAME_HEIGHT) this.dead = true;
    }

    checkCollision(px, py) {
        return py > this.y && py < this.y + this.config.h;
    }
}

class BeamH extends Obstacle {
    draw(currentTime) {
        const elapsed = currentTime - this.spawnedAt;
        const isWarning = elapsed < this.config.warning;
        
        ctx.fillStyle = isWarning ? 'rgba(255, 0, 127, 0.2)' : '#ff007f';
        ctx.fillRect(0, this.config.y, GAME_WIDTH, this.config.h);
        
        if (elapsed >= this.config.warning + this.config.duration) this.dead = true;
    }

    checkCollision(px, py, currentTime) {
        const elapsed = currentTime - this.spawnedAt;
        if (elapsed < this.config.warning) return false;
        return py > this.config.y && py < this.config.y + this.config.h;
    }
}

class Hexagon extends Obstacle {
    draw(currentTime) {
        const elapsed = currentTime - this.spawnedAt;
        const progress = Math.min(elapsed / this.config.duration, 1);
        const currentSize = this.config.targetSize * progress;
        const rotation = (elapsed / 1000) * Math.PI;

        ctx.save();
        ctx.translate(this.config.x, this.config.y);
        ctx.rotate(rotation);
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const x = Math.cos(angle) * currentSize;
            const y = Math.sin(angle) * currentSize;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = progress > 0.8 ? '#ff007f' : 'rgba(255, 0, 127, 0.3)';
        ctx.fill();
        ctx.restore();

        if (progress >= 1) this.dead = true;
    }

    checkCollision(px, py, currentTime) {
        const elapsed = currentTime - this.spawnedAt;
        if (elapsed < this.config.duration * 0.8) return false;
        const dx = px - this.config.x;
        const dy = py - this.config.y;
        return Math.sqrt(dx * dx + dy * dy) < this.config.targetSize;
    }
}

// Game Logic
function updatePlayer(dt) {
    if (gameState !== 'PLAYING') return;

    // Movement
    let dx = 0;
    let dy = 0;
    if (keys['KeyW'] || keys['ArrowUp']) dy -= 1;
    if (keys['KeyS'] || keys['ArrowDown']) dy += 1;
    if (keys['KeyA'] || keys['ArrowLeft']) dx -= 1;
    if (keys['KeyD'] || keys['ArrowRight']) dx += 1;

    // Normalize
    if (dx !== 0 || dy !== 0) {
        const len = Math.sqrt(dx * dx + dy * dy);
        dx /= len;
        dy /= len;
        
        // Dash check
        if (keys['Space'] && Date.now() - player.lastDash > DASH_COOLDOWN) {
            player.isDashing = true;
            player.lastDash = Date.now();
            player.dashDir = { x: dx, y: dy };
            setTimeout(() => { player.isDashing = false; }, DASH_DURATION);
        }
    }

    if (player.isDashing) {
        player.x += player.dashDir.x * (DASH_DISTANCE / (DASH_DURATION / 16));
        player.y += player.dashDir.y * (DASH_DISTANCE / (DASH_DURATION / 16));
    } else {
        player.x += dx * player.speed;
        player.y += dy * player.speed;
    }

    // Bounds
    player.x = Math.max(PLAYER_SIZE, Math.min(GAME_WIDTH - PLAYER_SIZE, player.x));
    player.y = Math.max(PLAYER_SIZE, Math.min(GAME_HEIGHT - PLAYER_SIZE, player.y));

    // Invincibility
    if (player.isInvincible && Date.now() > player.invincibleUntil) {
        player.isInvincible = false;
    }
}

function handleCollisions() {
    if (player.isInvincible || player.isDashing) return;

    for (let obs of activeObstacles) {
        if (obs.checkCollision(player.x, player.y, levelTime)) {
            takeDamage(20);
            break;
        }
    }
}

function takeDamage(amount) {
    health -= amount;
    player.isInvincible = true;
    player.invincibleUntil = Date.now() + INVINCIBLE_DURATION;
    
    // Update UI
    healthBar.style.width = `${(health / MAX_HEALTH) * 100}%`;
    
    if (health <= 0) {
        gameOver();
    }
}

function gameOver() {
    gameState = 'GAMEOVER';
    if (audioSource) audioSource.stop();
    gameUI.classList.remove('active');
    gameOverScreen.classList.add('active');
}

function startLevel() {
    gameState = 'PLAYING';
    health = MAX_HEALTH;
    levelTime = 0;
    activeObstacles = [];
    obstacles = currentLevelData.data.map(d => {
        if (d.type === 'pulse_circle') return new PulseCircle(d);
        if (d.type === 'laser_v') return new LaserV(d);
        if (d.type === 'burst') return new Burst(d);
        if (d.type === 'wall_h') return new WallH(d);
        if (d.type === 'beam_h') return new BeamH(d);
        if (d.type === 'hexagon') return new Hexagon(d);
        return new Obstacle(d);
    });
    
    healthBar.style.width = '100%';
    startScreen.classList.remove('active');
    levelSelection.classList.remove('active');
    gameOverScreen.classList.remove('active');
    gameUI.classList.add('active');
    
    playMusic();
}

async function playMusic() {
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    if (!audioBuffer || audioSource.lastUrl !== currentLevelData.audioUrl) {
        isAudioLoading = true;
        const response = await fetch(currentLevelData.audioUrl);
        const arrayBuffer = await response.arrayBuffer();
        audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        isAudioLoading = false;
    }
    
    audioSource = audioContext.createBufferSource();
    audioSource.lastUrl = currentLevelData.audioUrl;
    audioSource.buffer = audioBuffer;
    audioSource.connect(audioContext.destination);
    audioSource.start();
    lastTime = performance.now();
}

function loop(timestamp) {
    const dt = timestamp - lastTime;
    lastTime = timestamp;

    if (gameState === 'PLAYING') {
        levelTime += dt;
        updatePlayer(dt);
        
        // Spawning
        for (let i = obstacles.length - 1; i >= 0; i--) {
            const obs = obstacles[i];
            if (levelTime >= obs.startTime) {
                activeObstacles.push(obs);
                obstacles.splice(i, 1);
            }
        }
        
        // Updating active
        for (let i = activeObstacles.length - 1; i >= 0; i--) {
            const obs = activeObstacles[i];
            if (obs.dead) {
                activeObstacles.splice(i, 1);
            }
        }
        
        handleCollisions();
        
        // Score (Time)
        const sec = Math.floor(levelTime / 1000);
        const ms = Math.floor((levelTime % 1000) / 10);
        scoreDisplay.innerText = `${sec.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`;
    }

    draw();
    requestAnimationFrame(loop);
}

function draw() {
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Background Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < GAME_WIDTH; x += 50) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, GAME_HEIGHT); ctx.stroke();
    }
    for (let y = 0; y < GAME_HEIGHT; y += 50) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(GAME_WIDTH, y); ctx.stroke();
    }

    if (gameState === 'PLAYING' || gameState === 'GAMEOVER') {
        // Draw Obstacles
        for (let obs of activeObstacles) {
            obs.draw(levelTime);
        }

        // Draw Player
        ctx.fillStyle = player.isInvincible && Math.floor(Date.now() / 100) % 2 === 0 ? 'rgba(255,255,255,0.5)' : player.color;
        if (player.isDashing) ctx.shadowBlur = 20;
        ctx.shadowColor = player.color;
        ctx.fillRect(player.x - PLAYER_SIZE / 2, player.y - PLAYER_SIZE / 2, PLAYER_SIZE, PLAYER_SIZE);
        ctx.shadowBlur = 0;
    }
}

restartBtn.addEventListener('click', startLevel);

requestAnimationFrame(loop);
