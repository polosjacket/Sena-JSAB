import { levels } from './levels/index.js';
import { storyData } from './levels/storyData.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const mapCanvas = document.getElementById('mapCanvas');
const mapCtx = mapCanvas.getContext('2d');

// Game constants
const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;
const PLAYER_SIZE = 20;
const DASH_DISTANCE = 150;
const DASH_COOLDOWN = 500;
const DASH_DURATION = 150;
const INVINCIBLE_DURATION = 1200;
const MAX_HEALTH = 100;

// Effects
let shakeIntensity = 0;
let freezeFrame = 0;
let playerParticles = [];

function applyShake() {
    if (shakeIntensity > 0) {
        const sx = (Math.random() - 0.5) * shakeIntensity;
        const sy = (Math.random() - 0.5) * shakeIntensity;
        ctx.translate(sx, sy);
        shakeIntensity *= 0.9;
        if (shakeIntensity < 0.1) shakeIntensity = 0;
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 15;
        this.vy = (Math.random() - 0.5) * 15;
        this.size = Math.random() * 8 + 4;
        this.color = color;
        this.life = 1.0;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.95;
        this.vy *= 0.95;
        this.life -= 0.02;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.life;
        ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
        ctx.globalAlpha = 1.0;
    }
}

// Game UI Elements
const startScreen = document.getElementById('start-screen');
const worldMap = document.getElementById('world-map');
const cutsceneLayer = document.getElementById('cutscene-layer');
const dialogueText = document.getElementById('dialogue-text');
const gameUI = document.getElementById('game-ui');
const gameOverScreen = document.getElementById('game-over-screen');
const storyModeBtn = document.getElementById('story-mode-btn');
const restartBtn = document.getElementById('restart-btn');
const healthBar = document.getElementById('health-bar');
const scoreDisplay = document.getElementById('score');

const GameState = {
    MENU: 'MENU',
    MAP: 'MAP',
    CUTSCENE: 'CUTSCENE',
    PLAYING: 'PLAYING',
    GAMEOVER: 'GAMEOVER'
};

// Current level info
let currentLevelData = null;
let currentStoryNode = null;
let gameState = GameState.MENU;

// Progress
let progress = {
    unlockedNodes: ['corrupted'],
    completedNodes: [],
    playerPos: { x: 200, y: 360 }
};

function saveProgress() {
    localStorage.setItem('sena_jsab_progress', JSON.stringify(progress));
}

function loadProgress() {
    const saved = localStorage.getItem('sena_jsab_progress');
    if (saved) {
        progress = JSON.parse(saved);
    }
}

loadProgress();

// Navigation
storyModeBtn.onclick = () => {
    startScreen.classList.remove('active');
    if (progress.completedNodes.length === 0) {
        enterCutscene('intro', enterMap);
    } else {
        enterMap();
    }
};

function enterMap() {
    gameState = GameState.MAP;
    worldMap.classList.add('active');
    resize();
}

function enterCutscene(key, onComplete) {
    gameState = GameState.CUTSCENE;
    cutsceneLayer.classList.add('active');
    const sequence = storyData.cutscenes[key];
    let startTime = performance.now();

    function update() {
        if (gameState !== GameState.CUTSCENE) return;
        const elapsed = performance.now() - startTime;
        
        // Find current step
        const step = [...sequence].reverse().find(s => elapsed >= s.time);
        if (elapsed > sequence[sequence.length-1].time + sequence[sequence.length-1].duration) {
            cutsceneLayer.classList.remove('active');
            if (onComplete) onComplete();
            return;
        }

        renderVisualCutscene(step, elapsed);
        requestAnimationFrame(update);
    }
    update();
}

function renderVisualCutscene(step, elapsed) {
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    const centerX = GAME_WIDTH / 2;
    const centerY = GAME_HEIGHT / 2;

    if (!step) return;

    // Draw Tree of Life
    const treeColor = (step.action === 'shatter' || (step.action === 'impact' && (elapsed % 200 > 100))) ? '#ff007f' : '#fff';
    ctx.save();
    ctx.translate(centerX, centerY - 50);
    ctx.shadowBlur = 30;
    ctx.shadowColor = treeColor;
    
    // Triangle
    ctx.beginPath();
    ctx.moveTo(0, -120);
    ctx.lineTo(-100, 60);
    ctx.lineTo(100, 60);
    ctx.closePath();
    ctx.fillStyle = treeColor;
    ctx.fill();

    // Pulse effect
    const pulse = Math.sin(elapsed / 300) * 10;
    ctx.beginPath();
    ctx.arc(0, -10, 40 + pulse, 0, Math.PI * 2);
    ctx.strokeStyle = treeColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Circles inside
    ctx.fillStyle = '#000';
    [-40, 0, 40].forEach((x, i) => {
        ctx.beginPath();
        ctx.arc(x, 20 + i*5, 12, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.restore();

    // Draw Player
    if (step.action === 'peace' || step.action === 'arrival') {
        const px = centerX - 150 + Math.sin(elapsed / 200) * 100;
        const py = centerY + 100 + Math.abs(Math.sin(elapsed / 150)) * -60;
        ctx.fillStyle = '#00f2ff';
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#00f2ff';
        ctx.fillRect(px - 10, py - 10, 20, 20);
        ctx.shadowBlur = 0;
    }

    // Draw Boss
    if (step.action === 'arrival' || step.action === 'impact' || step.action === 'shatter') {
        let bx = GAME_WIDTH + 200;
        if (step.action === 'arrival') {
            const stepElapsed = elapsed - step.time;
            bx = GAME_WIDTH - (stepElapsed / step.duration) * (GAME_WIDTH / 2 + 100);
        } else {
            bx = centerX + 100;
        }

        ctx.save();
        ctx.translate(bx, centerY - 50);
        ctx.rotate(elapsed / 300);
        
        // Spiky Circle
        ctx.fillStyle = '#ff007f';
        ctx.shadowBlur = 40;
        ctx.shadowColor = '#ff007f';
        ctx.beginPath();
        for (let i = 0; i < 24; i++) {
            const angle = (i / 24) * Math.PI * 2;
            const r = i % 2 === 0 ? 80 : 50;
            ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
        }
        ctx.closePath();
        ctx.fill();

        // Eye
        ctx.rotate(-elapsed / 300);
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    // Impact Flash
    if (step.action === 'impact') {
        ctx.fillStyle = `rgba(255, 0, 127, ${Math.random() * 0.8})`;
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    }
}




// Game state
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

class MapManager {
    constructor() {
        this.nodes = storyData.chapters[0].nodes;
        this.player = { ...progress.playerPos };
    }

    update() {
        if (gameState !== GameState.MAP) return;
        let dx = 0, dy = 0;
        if (keys['KeyW'] || keys['ArrowUp']) dy -= 4;
        if (keys['KeyS'] || keys['ArrowDown']) dy += 4;
        if (keys['KeyA'] || keys['ArrowLeft']) dx -= 4;
        if (keys['KeyD'] || keys['ArrowRight']) dx += 4;
        
        this.player.x += dx;
        this.player.y += dy;
        progress.playerPos = { ...this.player };

        // Check for node proximity
        for (let node of this.nodes) {
            const dist = Math.sqrt((this.player.x - node.x)**2 + (this.player.y - node.y)**2);
            if (dist < 30 && progress.unlockedNodes.includes(node.id)) {
                currentStoryNode = node;
                currentLevelData = levels.find(l => l.name.toLowerCase().includes(node.levelKey.toLowerCase()));
                if (!currentLevelData) currentLevelData = levels[0]; // Fallback
                startLevel();
                break;
            }
        }
    }

    draw() {
        mapCtx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        
        // Draw connections
        mapCtx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        mapCtx.lineWidth = 3;
        for (let node of this.nodes) {
            if (node.next) {
                node.next.forEach(nextId => {
                    const nextNode = this.nodes.find(n => n.id === nextId);
                    if (nextNode) {
                        mapCtx.beginPath();
                        mapCtx.moveTo(node.x, node.y);
                        mapCtx.lineTo(nextNode.x, nextNode.y);
                        mapCtx.stroke();
                    }
                });
            }
        }

        // Draw nodes
        for (let node of this.nodes) {
            const isUnlocked = progress.unlockedNodes.includes(node.id);
            mapCtx.fillStyle = isUnlocked ? '#fff' : '#222';
            mapCtx.shadowBlur = isUnlocked ? 20 : 0;
            mapCtx.shadowColor = '#fff';
            
            mapCtx.beginPath();
            mapCtx.arc(node.x, node.y, 18, 0, Math.PI * 2);
            mapCtx.fill();
            mapCtx.shadowBlur = 0;

            if (isUnlocked) {
                mapCtx.fillStyle = '#fff';
                mapCtx.font = 'bold 16px Outfit';
                mapCtx.textAlign = 'center';
                mapCtx.fillText(node.name, node.x, node.y + 45);
            }
        }

        // Draw player
        mapCtx.fillStyle = '#00f2ff';
        mapCtx.shadowBlur = 20;
        mapCtx.shadowColor = '#00f2ff';
        mapCtx.fillRect(this.player.x - 12, this.player.y - 12, 24, 24);
        mapCtx.shadowBlur = 0;
    }
}

const mapManager = new MapManager();





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
        this.telegraphDuration = config.warning || 500;
        this.active = false;
        this.dead = false;
        this.spawnedAt = 0;
    }

    update(currentTime, dt) {
        if (!this.active && currentTime >= this.startTime - this.telegraphDuration) {
            this.active = true;
            this.spawnedAt = currentTime;
        }
    }

    draw(currentTime) {
        const elapsed = currentTime - this.spawnedAt;
        if (elapsed < this.telegraphDuration) {
            this.drawTelegraph(elapsed);
        } else {
            this.drawActual(elapsed - this.telegraphDuration);
        }
    }

    drawTelegraph(elapsed) {}
    drawActual(elapsed) {}
    checkCollision(px, py, currentTime) { return false; }
}

class PulseCircle extends Obstacle {
    drawTelegraph(elapsed) {
        const progress = elapsed / this.telegraphDuration;
        ctx.beginPath();
        ctx.arc(this.config.x, this.config.y, this.config.targetSize, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 0, 0, ${progress * 0.3})`;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    drawActual(elapsed) {
        const progress = Math.min(elapsed / this.config.duration, 1);
        const currentSize = this.config.targetSize * progress;
        
        ctx.beginPath();
        ctx.arc(this.config.x, this.config.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = progress > 0.8 ? '#ff007f' : 'rgba(255, 0, 127, 0.4)';
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ff007f';
        ctx.fill();
        ctx.shadowBlur = 0;
        
        if (progress >= 1) this.dead = true;
    }

    checkCollision(px, py, currentTime) {
        const elapsed = currentTime - this.spawnedAt;
        if (elapsed < this.telegraphDuration + this.config.duration * 0.8) return false;
        
        const dx = px - this.config.x;
        const dy = py - this.config.y;
        return Math.sqrt(dx * dx + dy * dy) < this.config.targetSize;
    }
}

class LaserV extends Obstacle {
    drawTelegraph(elapsed) {
        const progress = elapsed / this.telegraphDuration;
        ctx.fillStyle = `rgba(255, 0, 0, ${progress * 0.2})`;
        ctx.fillRect(this.config.x - 10, 0, 20, GAME_HEIGHT);
    }

    drawActual(elapsed) {
        ctx.fillStyle = '#ff007f';
        ctx.shadowBlur = 25;
        ctx.shadowColor = '#ff007f';
        ctx.fillRect(this.config.x - 15, 0, 30, GAME_HEIGHT);
        ctx.shadowBlur = 0;
        
        if (elapsed >= this.config.duration) this.dead = true;
    }

    checkCollision(px, py, currentTime) {
        const elapsed = currentTime - this.spawnedAt;
        if (elapsed < this.telegraphDuration) return false;
        return px > this.config.x - 20 && px < this.config.x + 20;
    }
}


class Burst extends Obstacle {
    constructor(config) {
        super(config);
        this.fired = false;
        this.projectiles = [];
    }

    drawTelegraph(elapsed) {
        const progress = elapsed / this.telegraphDuration;
        ctx.strokeStyle = `rgba(255, 0, 0, ${progress * 0.5})`;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(this.config.x, this.config.y, 40, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    drawActual(elapsed) {
        if (!this.fired) {
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
    drawTelegraph(elapsed) {
        const progress = elapsed / this.telegraphDuration;
        ctx.fillStyle = `rgba(255, 0, 0, ${progress * 0.2})`;
        ctx.fillRect(0, this.config.y, GAME_WIDTH, this.config.h);
    }

    drawActual(elapsed) {
        const y = this.config.y + (elapsed / 1000) * this.config.speed * 60;
        ctx.fillStyle = '#ff007f';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ff007f';
        ctx.fillRect(0, y, GAME_WIDTH, this.config.h);
        ctx.shadowBlur = 0;
        if (y > GAME_HEIGHT) this.dead = true;
        this.currentY = y;
    }

    checkCollision(px, py) {
        return py > this.currentY && py < this.currentY + this.config.h;
    }
}

class BeamH extends Obstacle {
    drawTelegraph(elapsed) {
        const progress = elapsed / this.telegraphDuration;
        ctx.fillStyle = `rgba(255, 0, 0, ${progress * 0.3})`;
        ctx.fillRect(0, this.config.y, GAME_WIDTH, this.config.h);
    }

    drawActual(elapsed) {
        ctx.fillStyle = '#ff007f';
        ctx.shadowBlur = 30;
        ctx.shadowColor = '#ff007f';
        ctx.fillRect(0, this.config.y, GAME_WIDTH, this.config.h);
        ctx.shadowBlur = 0;
        if (elapsed >= this.config.duration) this.dead = true;
    }

    checkCollision(px, py, currentTime) {
        const elapsed = currentTime - this.spawnedAt;
        if (elapsed < this.telegraphDuration) return false;
        return py > this.config.y && py < this.config.y + this.config.h;
    }
}

class Hexagon extends Obstacle {
    drawTelegraph(elapsed) {
        const progress = elapsed / this.telegraphDuration;
        ctx.save();
        ctx.translate(this.config.x, this.config.y);
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const x = Math.cos(angle) * this.config.targetSize;
            const y = Math.sin(angle) * this.config.targetSize;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(255, 0, 0, ${progress * 0.3})`;
        ctx.stroke();
        ctx.restore();
    }

    drawActual(elapsed) {
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
        ctx.fillStyle = progress > 0.8 ? '#ff007f' : 'rgba(255, 0, 127, 0.4)';
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ff007f';
        ctx.fill();
        ctx.restore();

        if (progress >= 1) this.dead = true;
    }

    checkCollision(px, py, currentTime) {
        const elapsed = currentTime - this.spawnedAt;
        if (elapsed < this.telegraphDuration + this.config.duration * 0.8) return false;
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
    if (player.isInvincible) return;
    
    health -= amount;
    player.isInvincible = true;
    player.invincibleUntil = Date.now() + INVINCIBLE_DURATION;
    
    // Screen Shake
    shakeIntensity = 20;
    
    // Defragmentation Particles
    for (let i = 0; i < 15; i++) {
        playerParticles.push(new Particle(player.x, player.y, player.color));
    }

    // Freeze Frame (100ms)
    freezeFrame = 6; // frames
    
    // Update UI
    healthBar.style.width = `${(health / MAX_HEALTH) * 100}%`;
    
    if (health <= 0) {
        gameOver();
    }
}

function gameOver() {
    gameState = GameState.GAMEOVER;
    if (audioSource) audioSource.stop();
    gameUI.classList.remove('active');
    gameOverScreen.classList.add('active');
}

function startLevel() {
    gameState = GameState.PLAYING;
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
    worldMap.classList.remove('active');
    gameOverScreen.classList.remove('active');
    gameUI.classList.add('active');
    
    playMusic();
}

function finishLevel() {
    if (gameState !== GameState.PLAYING) return;
    gameState = GameState.MAP;
    gameUI.classList.remove('active');
    worldMap.classList.add('active');
    
    if (audioSource) audioSource.stop();

    // Unlock next nodes
    if (currentStoryNode && currentStoryNode.next) {
        currentStoryNode.next.forEach(id => {
            if (!progress.unlockedNodes.includes(id)) {
                progress.unlockedNodes.push(id);
            }
        });
        if (!progress.completedNodes.includes(currentStoryNode.id)) {
            progress.completedNodes.push(currentStoryNode.id);
        }
        saveProgress();
    }
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
    if (freezeFrame > 0) {
        freezeFrame--;
        requestAnimationFrame(loop);
        return;
    }

    const dt = timestamp - lastTime;
    lastTime = timestamp;

    if (gameState === GameState.MAP) {
        mapManager.update();
    }

    if (gameState === GameState.PLAYING) {
        levelTime += dt;
        updatePlayer(dt);
        
        // Particles update
        for (let i = playerParticles.length - 1; i >= 0; i--) {
            playerParticles[i].update();
            if (playerParticles[i].life <= 0) playerParticles.splice(i, 1);
        }

        // Spawning
        for (let i = obstacles.length - 1; i >= 0; i--) {
            const obs = obstacles[i];
            if (levelTime >= obs.startTime - obs.telegraphDuration) {
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
        
        // Win condition: All obstacles done
        if (obstacles.length === 0 && activeObstacles.length === 0) {
            finishLevel();
        }

        // Score (Time)
        const sec = Math.floor(levelTime / 1000);
        const ms = Math.floor((levelTime % 1000) / 10);
        scoreDisplay.innerText = `${sec.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`;
    }

    draw();
    requestAnimationFrame(loop);
}

function draw() {
    ctx.save();
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    applyShake();

    if (gameState === GameState.MAP) {
        mapManager.draw();
    }

    // Background Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < GAME_WIDTH; x += 50) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, GAME_HEIGHT); ctx.stroke();
    }
    for (let y = 0; y < GAME_HEIGHT; y += 50) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(GAME_WIDTH, y); ctx.stroke();
    }

    if (gameState === GameState.PLAYING || gameState === GameState.GAMEOVER) {
        // Draw Obstacles
        for (let obs of activeObstacles) {
            obs.draw(levelTime);
        }

        // Draw Particles
        playerParticles.forEach(p => p.draw());

        // Draw Player
        if (playerParticles.length === 0 || player.isInvincible) {
            ctx.fillStyle = player.isInvincible && Math.floor(Date.now() / 100) % 2 === 0 ? 'rgba(255,255,255,0.3)' : player.color;
            ctx.shadowBlur = 15;
            ctx.shadowColor = player.color;
            ctx.fillRect(player.x - PLAYER_SIZE / 2, player.y - PLAYER_SIZE / 2, PLAYER_SIZE, PLAYER_SIZE);
            ctx.shadowBlur = 0;
        }
    }
    ctx.restore();
}

restartBtn.addEventListener('click', startLevel);

requestAnimationFrame(loop);
