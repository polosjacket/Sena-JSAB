export const storyData = {
    chapters: [
        {
            id: 0,
            name: "The Beginning",
            nodes: [
                {
                    id: "corrupted",
                    name: "Corrupted",
                    levelKey: "milestone", // Using milestone as corrupted tutorial
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
            { text: "In a world of shapes...", duration: 2000 },
            { text: "The music was everything.", duration: 2000 },
            { text: "Until the corruption arrived.", color: "#ff007f", duration: 3000 }
        ],
        "post_tutorial": [
            { text: "The tutorial is over.", duration: 2000 },
            { text: "Now the real challenge begins.", duration: 2000 }
        ]
    }
};
