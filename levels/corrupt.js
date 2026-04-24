export const corrupt = {
    name: "New Game",
    author: "Nitro Fun",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    data: [
        // Intro hexagon pulses
        { time: 1.0, type: 'hexagon', x: 640, y: 360, targetSize: 400, duration: 2000 },
        { time: 2.0, type: 'hexagon', x: 640, y: 360, targetSize: 600, duration: 2000 },
        
        // Horizontal beams
        { time: 4.0, type: 'beam_h', y: 0, h: 360, warning: 1000, duration: 500 },
        { time: 5.0, type: 'beam_h', y: 360, h: 360, warning: 1000, duration: 500 },
        
        // Chaotic bursts
        { time: 7.0, type: 'burst', x: 320, y: 360, count: 16, speed: 6, warning: 500 },
        { time: 7.5, type: 'burst', x: 960, y: 360, count: 16, speed: 6, warning: 500 },
        
        // Double hexagon
        { time: 10.0, type: 'hexagon', x: 320, y: 360, targetSize: 300, duration: 1000 },
        { time: 10.0, type: 'hexagon', x: 960, y: 360, targetSize: 300, duration: 1000 },
        
        // Final screen sweep
        { time: 12.0, type: 'beam_h', y: 0, h: 720, warning: 2000, duration: 1000 },
    ]
};
