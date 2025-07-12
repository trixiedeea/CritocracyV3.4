// Age of Resistance (Blue) cards
export const ageOfResistanceDeck = [
    {
        deck: "Age of Resistance",
        name: "Haitian Revolution",
        description: "Reflects Benjamin's Angel of History by showcasing the reversal of colonial power, rewarding Influence and progress.",
        effects: [
            { type: 'MOVEMENT', target: 'SELF', spaces: 7 },
            { type: 'RESOURCE_CHANGE', changes: { influence: 5 } }
        ]
    },
    {
        deck: "Age of Resistance",
        name: "Salt March",
        description: "Embodies nonviolent resistance, advancing the cause but risking political fallout.",
        effects: [
            { type: 'STEAL', target: 'OTHER', resource: 'INFLUENCE', amount:5, }, 
            { type: 'RESOURCE_CHANGE', changes: { influence: -5 } }
        ]
    },
    {
        deck: "Age of Resistance",
        name: "Print to Power",
        description: "Echoes Benjamin's belief in media's role in empowering resistance, allowing Knowledge gain and strategic movement.",
        effects: [
            { type: 'RESOURCE_CHANGE', changes: { knowledge: 6 } },
            { type: 'MOVEMENT', target: 'SELF', spaces: 6 }
        ]
    },
    {
        deck: "Age of Resistance",
        name: "Anti-Colonial Uprising",
        description: "Reflects Benjamin's view of history's ruptures, advancing players but at the cost of resources.",
        effects: [
            { type: 'MOVEMENT', target: 'SELF', moveToAge: "The Age of Reckoning" },
            { type: 'RESOURCE_CHANGE', changes: { money: -6 } }
        ]
    },
    {
        deck: "Age of Resistance",
        name: "Subaltern Voices",
        description: "Draws on postcolonial theory's focus on marginalized voices, increasing Knowledge but disrupting existing power.",
        effects: [
            { type: 'RESOURCE_CHANGE', changes: { knowledge: 5 } },
            { type: 'MOVEMENT', target: 'OTHER', spaces: -5 }
        ]
    },
    {
        deck: "Age of Resistance",
        name: "Angel of History",
        description: "Embodies Benjamin's idea that progress is built on past suffering, pushing players backward while rewarding reflection.",
        effects: [
            { type: 'MOVEMENT', target: 'SELF', spaces: -6 },
            { type: 'RESOURCE_CHANGE', changes: { influence: 6 } }
        ]
    },
    {
        deck: "Age of Resistance",
        name: "Decolonial Theory",
        description: "Reflects Tuck and Yang's call for real material change, allowing alliances and resource exchange.",
        effects: [
            { type: 'STEAL', target: 'OTHER', resource: 'MONEY', amount:6 },
            { type: 'RESOURCE_CHANGE', changes: { money: -6 } } 
        ]
    },
    {
        deck: "Age of Resistance",
        name: "Disrupting Power Structures",
        description: "Mirrors Barthes' Death of the Author, shifting control by trading Influence for Knowledge.",
        effects: [
            { type: 'RESOURCE_CHANGE', changes: { influence: -5, knowledge: 6 } }
        ]
    },
    {
        deck: "Age of Resistance",
        name: "Narrative Shift",
        description: "Reflects Benjamin's idea of history's reversals, allowing players to reshape their paths.",
        effects: [
            { type: 'MOVEMENT', target: 'SELF', spaces: 5 },
            { type: 'DRAW_CARD', deckType: 'END_OF_TURN' } 
        ]
    },
    {
        deck: "Age of Resistance",
        name: "Revolutionary Momentum",
        description: "Embodies Benjamin's recognition of historical upheaval, enabling sabotage of opponents.",
        effects: [
            { type: 'MOVEMENT', target: 'OTHER', spaces: -7 } 
        ]
    },
 
    {
        deck: "Age of Resistance",
        name: "Intellectual Awakening",
        description: "Reflects Benjamin's call for critical engagement with history, giving players the power to strategically reposition.",
        effects: [
            { type: 'RESOURCE_CHANGE', changes: { knowledge: 5 } },
            { type: 'MOVEMENT', target: 'SELF', spaces: 4 }
        ]
    }
];

// Export the cards array directly
export const BLUE_DECK = [...ageOfResistanceDeck];