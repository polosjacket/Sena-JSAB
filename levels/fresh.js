export const fresh = {
    name: "Long Live The New Fresh",
    author: "Danimal Cannon",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    data: [
        // Intro sequence
        { time: 1.0, type: 'laser_v', x: 200, warning: 500, duration: 200 },
        { time: 1.5, type: 'laser_v', x: 400, warning: 500, duration: 200 },
        { time: 2.0, type: 'laser_v', x: 600, warning: 500, duration: 200 },
        { time: 2.5, type: 'laser_v', x: 800, warning: 500, duration: 200 },
        { time: 3.0, type: 'laser_v', x: 1000, warning: 500, duration: 200 },
        
        // Fast pulses
        { time: 4.0, type: 'pulse_circle', x: 640, y: 360, size: 0, targetSize: 300, duration: 400 },
        { time: 4.5, type: 'pulse_circle', x: 640, y: 360, size: 0, targetSize: 400, duration: 400 },
        { time: 5.0, type: 'pulse_circle', x: 640, y: 360, size: 0, targetSize: 500, duration: 400 },
        
        // Burst phase
        { time: 6.0, type: 'burst', x: 320, y: 180, count: 8, speed: 6, warning: 500 },
        { time: 6.5, type: 'burst', x: 960, y: 180, count: 8, speed: 6, warning: 500 },
        { time: 7.0, type: 'burst', x: 320, y: 540, count: 8, speed: 6, warning: 500 },
        { time: 7.5, type: 'burst', x: 960, y: 540, count: 8, speed: 6, warning: 500 },
        
        // Wall sequence
        { time: 9.0, type: 'wall_h', y: -100, h: 200, speed: 8, duration: 2000 },
        { time: 11.0, type: 'wall_h', y: -100, h: 200, speed: 8, duration: 2000 },
        
        // Climax
        { time: 14.0, type: 'burst', x: 640, y: 360, count: 24, speed: 10, warning: 1000 },
        { time: 15.0, type: 'laser_v', x: 100, warning: 300, duration: 100 },
        { time: 15.1, type: 'laser_v', x: 300, warning: 300, duration: 100 },
        { time: 15.2, type: 'laser_v', x: 500, warning: 300, duration: 100 },
        { time: 15.3, type: 'laser_v', x: 700, warning: 300, duration: 100 },
        { time: 15.4, type: 'laser_v', x: 900, warning: 300, duration: 100 },
        { time: 15.5, type: 'laser_v', x: 1100, warning: 300, duration: 100 },
    ]
};
