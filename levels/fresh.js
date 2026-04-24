export const fresh = {
    name: "Long Live The New Fresh",
    author: "Danimal Cannon",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    isBoss: true,
    data: [
        // PHASE 1: Spiked Bursts (Introduction)
        { time: 1.0, type: 'burst', x: 640, y: 360, count: 12, speed: 6, warning: 800 },
        { time: 2.5, type: 'burst', x: 640, y: 360, count: 16, speed: 7, warning: 600 },
        { time: 4.0, type: 'burst', x: 640, y: 360, count: 24, speed: 8, warning: 400 },
        
        // PHASE 2: The Eye (Rotation and Lines)
        { time: 6.0, type: 'hexagon', x: 640, y: 360, targetSize: 400, duration: 2000, warning: 1000 },
        { time: 6.5, type: 'laser_v', x: 320, duration: 1000, warning: 500 },
        { time: 7.0, type: 'laser_v', x: 960, duration: 1000, warning: 500 },
        
        // PHASE 3: Arm Slams
        { time: 10.0, type: 'beam_h', y: 0, h: 200, duration: 1000, warning: 1200 }, 
        { time: 10.5, type: 'beam_h', y: 520, h: 200, duration: 1000, warning: 1200 }, 
        
        { time: 13.0, type: 'laser_v', x: 100, duration: 500, warning: 300 },
        { time: 13.5, type: 'laser_v', x: 640, duration: 500, warning: 300 },
        { time: 14.0, type: 'laser_v', x: 1180, duration: 500, warning: 300 },
        
        // PHASE 4: Endless Escalation (Looping patterns for longevity)
        { time: 16.0, type: 'hexagon', x: 320, y: 360, targetSize: 300, duration: 1500, warning: 800 },
        { time: 16.0, type: 'hexagon', x: 960, y: 360, targetSize: 300, duration: 1500, warning: 800 },
        
        { time: 18.0, type: 'burst', x: 640, y: 100, count: 20, speed: 9, warning: 400 },
        { time: 19.0, type: 'burst', x: 640, y: 620, count: 20, speed: 9, warning: 400 },
        
        { time: 22.0, type: 'pulse_circle', x: 640, y: 360, targetSize: 900, duration: 4000, warning: 2000 },
        
        // Repeat Escalation to make it feel "Endless"
        { time: 26.0, type: 'beam_h', y: 0, h: 150, duration: 500, warning: 300 },
        { time: 26.5, type: 'beam_h', y: 200, h: 150, duration: 500, warning: 300 },
        { time: 27.0, type: 'beam_h', y: 400, h: 150, duration: 500, warning: 300 },
        { time: 27.5, type: 'beam_h', y: 600, h: 150, duration: 500, warning: 300 },
        
        { time: 30.0, type: 'hexagon', x: 640, y: 360, targetSize: 1000, duration: 5000, warning: 1000 },
        { time: 32.0, type: 'burst', x: 200, y: 200, count: 32, speed: 12, warning: 300 },
        { time: 33.0, type: 'burst', x: 1080, y: 520, count: 32, speed: 12, warning: 300 },
        { time: 34.0, type: 'burst', x: 1080, y: 200, count: 32, speed: 12, warning: 300 },
        { time: 35.0, type: 'burst', x: 200, y: 520, count: 32, speed: 12, warning: 300 },
        
        { time: 40.0, type: 'beam_h', y: 0, h: 720, duration: 1000, warning: 3000 }, // Mega Finale
    ]
};
