export const storyData = {
    chapters: [
        {
            id: 0,
            name: "The Beginning",
            nodes: [
                {
                    id: "corrupted",
                    name: "Corrupted",
                    levelKey: "milestone",
                    x: 200, y: 360,
                    unlocked: true,
                    next: ["chronos", "milkyways", "logicgatekeeper"]
                },
                {
                    id: "chronos",
                    name: "Chronos",
                    levelKey: "milestone", 
                    x: 400, y: 200,
                    unlocked: false,
                    next: ["boss_fresh"]
                },
                {
                    id: "milkyways",
                    name: "Milky Ways",
                    levelKey: "milkyways",
                    x: 400, y: 360,
                    unlocked: false,
                    next: ["boss_fresh"]
                },
                {
                    id: "logicgatekeeper",
                    name: "Logic Gatekeeper",
                    levelKey: "milestone",
                    x: 400, y: 520,
                    unlocked: false,
                    next: ["boss_fresh"]
                },
                {
                    id: "boss_fresh",
                    name: "Long Live The New Fresh",
                    levelKey: "fresh",
                    x: 700, y: 360,
                    isBoss: true,
                    unlocked: false,
                    next: ["chapter_1_island"]
                }
            ]
        }
    ],
    cutscenes: {
        "intro": [
            { time: 0, action: 'peace', duration: 3000 }, // Show Tree of Life, Player jumping
            { time: 3000, action: 'arrival', duration: 2000 }, // Boss enters from right
            { time: 5000, action: 'impact', duration: 1000 }, // Flash + Tree turns pink
            { time: 6000, action: 'shatter', duration: 2000 }, // Tree breaks
            { time: 8000, action: 'finish', duration: 1000 }
        ]
    }
};
