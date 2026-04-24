export const milkyways = {
    name: "Milky Ways",
    author: "Bossfight",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    data: [
        // Fast opening
        { time: 0.5, type: 'pulse_circle', x: 320, y: 360, size: 0, targetSize: 200, duration: 300 },
        { time: 1.0, type: 'pulse_circle', x: 960, y: 360, size: 0, targetSize: 200, duration: 300 },
        { time: 1.5, type: 'pulse_circle', x: 640, y: 180, size: 0, targetSize: 200, duration: 300 },
        { time: 2.0, type: 'pulse_circle', x: 640, y: 540, size: 0, targetSize: 200, duration: 300 },
        
        // Rapid bursts
        { time: 3.0, type: 'burst', x: 640, y: 360, count: 16, speed: 8, warning: 400 },
        { time: 4.0, type: 'burst', x: 200, y: 200, count: 12, speed: 7, warning: 400 },
        { time: 5.0, type: 'burst', x: 1080, y: 520, count: 12, speed: 7, warning: 400 },
        
        // Laser storm
        { time: 7.0, type: 'laser_v', x: 100, warning: 400, duration: 200 },
        { time: 7.2, type: 'laser_v', x: 200, warning: 400, duration: 200 },
        { time: 7.4, type: 'laser_v', x: 300, warning: 400, duration: 200 },
        { time: 7.6, type: 'laser_v', x: 400, warning: 400, duration: 200 },
        { time: 7.8, type: 'laser_v', x: 500, warning: 400, duration: 200 },
        
        // Wall rush
        { time: 10.0, type: 'wall_h', y: -200, h: 150, speed: 10, duration: 2000 },
        { time: 12.0, type: 'wall_h', y: -200, h: 150, speed: 10, duration: 2000 },
        
        // Final pulse
        { time: 15.0, type: 'pulse_circle', x: 640, y: 360, size: 0, targetSize: 800, duration: 3000 },
    ]
};
