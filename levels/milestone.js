export const milestone = {
    name: "Milestone",
    author: "Berzerk Studio",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    data: [
        { time: 1.0, type: 'pulse_circle', x: 640, y: 360, size: 0, targetSize: 200, duration: 1000 },
        { time: 2.5, type: 'pulse_circle', x: 200, y: 200, size: 0, targetSize: 150, duration: 800 },
        { time: 3.5, type: 'pulse_circle', x: 1080, y: 520, size: 0, targetSize: 150, duration: 800 },
        { time: 5.0, type: 'laser_v', x: 300, warning: 1000, duration: 500 },
        { time: 5.5, type: 'laser_v', x: 640, warning: 1000, duration: 500 },
        { time: 6.0, type: 'laser_v', x: 980, warning: 1000, duration: 500 },
        { time: 8.0, type: 'burst', x: 640, y: 360, count: 12, speed: 5, warning: 1000 },
        { time: 10.0, type: 'wall_h', y: -100, h: 100, speed: 4, duration: 3000 },
        { time: 12.0, type: 'pulse_circle', x: 640, y: 360, size: 0, targetSize: 600, duration: 2000 },
    ]
};
