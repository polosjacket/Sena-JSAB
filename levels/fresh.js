export const fresh = {
    name: "Long Live The New Fresh",
    author: "Danimal Cannon",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    data: [
        // PHASE 1: Spiked Bursts (Introduction)
        { time: 1.0, type: 'burst', x: 640, y: 360, count: 12, speed: 6, warning: 800 },
        { time: 2.5, type: 'burst', x: 640, y: 360, count: 16, speed: 7, warning: 600 },
        { time: 4.0, type: 'burst', x: 640, y: 360, count: 24, speed: 8, warning: 400 },
        
        // PHASE 2: The Eye (Rotation and Lines)
        { time: 6.0, type: 'hexagon', x: 640, y: 360, targetSize: 400, duration: 2000, warning: 1000 },
        { time: 6.5, type: 'laser_v', x: 320, duration: 1000, warning: 500 },
        { time: 7.0, type: 'laser_v', x: 960, duration: 1000, warning: 500 },
        
        // PHASE 3: Arm Slams (Vertical/Horizontal Beams with Red Telegraphs)
        { time: 10.0, type: 'beam_h', y: 0, h: 200, duration: 1000, warning: 1200 }, // Top Arm Slam
        { time: 10.5, type: 'beam_h', y: 520, h: 200, duration: 1000, warning: 1200 }, // Bottom Arm Slam
        
        { time: 13.0, type: 'laser_v', x: 100, duration: 500, warning: 300 },
        { time: 13.2, type: 'laser_v', x: 300, duration: 500, warning: 300 },
        { time: 13.4, type: 'laser_v', x: 500, duration: 500, warning: 300 },
        { time: 13.6, type: 'laser_v', x: 700, duration: 500, warning: 300 },
        { time: 13.8, type: 'laser_v', x: 900, duration: 500, warning: 300 },
        { time: 14.0, type: 'laser_v', x: 1100, duration: 500, warning: 300 },
        
        // PHASE 4: Rotating Lasers (Complex Hexagon pulses)
        { time: 16.0, type: 'hexagon', x: 320, y: 360, targetSize: 300, duration: 1500, warning: 800 },
        { time: 16.0, type: 'hexagon', x: 960, y: 360, targetSize: 300, duration: 1500, warning: 800 },
        
        // PHASE 5: Full Chaos Escalation
        { time: 20.0, type: 'pulse_circle', x: 640, y: 360, targetSize: 800, duration: 3000, warning: 1500 },
        { time: 21.0, type: 'burst', x: 200, y: 200, count: 32, speed: 10, warning: 500 },
        { time: 21.0, type: 'burst', x: 1080, y: 520, count: 32, speed: 10, warning: 500 },
        
        { time: 24.0, type: 'beam_h', y: 0, h: 720, duration: 1000, warning: 2000 }, // Final Mega Slam
    ]
};
