export const fresh = {
    name: "Long Live The New Fresh",
    author: "Danimal Cannon",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    isBoss: true,
    data: [
        // PHASE 1: Spiked Bursts
        { time: 1.0, type: 'burst', x: 640, y: 360, count: 12, speed: 6, warning: 800 },
        { time: 2.5, type: 'burst', x: 300, y: 360, count: 12, speed: 6, warning: 800 },
        { time: 2.5, type: 'burst', x: 980, y: 360, count: 12, speed: 6, warning: 800 },
        { time: 4.5, type: 'burst', x: 640, y: 360, count: 20, speed: 8, warning: 600 },
        
        // PHASE 2: The Eye (Rotation)
        { time: 7.0, type: 'hexagon', x: 640, y: 360, targetSize: 350, duration: 2500, warning: 1000 },
        { time: 8.0, type: 'laser_v', x: 200, duration: 1500, warning: 500 },
        { time: 8.0, type: 'laser_v', x: 1080, duration: 1500, warning: 500 },
        
        // PHASE 3: Arm Slams (Partial Screen)
        { time: 12.0, type: 'beam_h', y: 0, h: 180, duration: 1000, warning: 1000 }, 
        { time: 13.5, type: 'beam_h', y: 540, h: 180, duration: 1000, warning: 1000 }, 
        
        { time: 16.0, type: 'laser_v', x: 400, duration: 1000, warning: 400 },
        { time: 17.0, type: 'laser_v', x: 880, duration: 1000, warning: 400 },
        
        // PHASE 4: Escalation
        { time: 20.0, type: 'burst', x: 640, y: 150, count: 16, speed: 7, warning: 600 },
        { time: 22.0, type: 'burst', x: 640, y: 570, count: 16, speed: 7, warning: 600 },
        
        { time: 25.0, type: 'hexagon', x: 320, y: 360, targetSize: 250, duration: 2000, warning: 800 },
        { time: 25.0, type: 'hexagon', x: 960, y: 360, targetSize: 250, duration: 2000, warning: 800 },
        
        // PHASE 5: Finale (Not Endless)
        { time: 30.0, type: 'pulse_circle', x: 640, y: 360, targetSize: 600, duration: 3000, warning: 1000 },
        { time: 32.0, type: 'burst', x: 640, y: 360, count: 32, speed: 10, warning: 500 },
        
        { time: 36.0, type: 'beam_h', y: 260, h: 200, duration: 1500, warning: 1500 }, // Center slam only
        { time: 40.0, type: 'burst', x: 640, y: 360, count: 40, speed: 12, warning: 1000 }
    ]
};
