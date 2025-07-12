// Special Event cards for Critocracy
// These cards are drawn when landing on special event spaces

// Age of Expansion (Purple) cards
export const ageOfExpansionDeck = [
    {
        deck: "Age of Expansion",
        name: "Scramble for Africa",
        description: "Reflects Discourse on Colonialism by highlighting the violent race for African resources, rewarding Money but costing Influence due to growing resistance.",
        effects: [
            { type: 'RESOURCE_CHANGE', changes: { money: 6 } },
            { type: 'RESOURCE_CHANGE', changes: { influence: -5 } }
        ]
    },
    {
        deck: "Age of Expansion",
        name: "Divide and Conquer",
        description: "Mirrors Césaire's critique of colonial strategies used to fracture societies, advancing players but diminishing their critical understanding.",
        effects: [
            { type: 'MOVEMENT', target: 'SELF', spaces: 7 },
            { type: 'RESOURCE_CHANGE', changes: { knowledge: -5 } }
        ]
    },
    {
        deck: "Age of Expansion",
        name: "Exploitation Justified",
        description: "Embodies Césaire's analysis of colonial rationalization, increasing wealth at the cost of moral legitimacy.",
        effects: [
            { type: 'STEAL', target: 'OTHER', resource: 'INFLUENCE', amount:3, }, 
            { type: 'RESOURCE_CHANGE', changes: { influence: -5 } }
        ]
    },
    {
        deck: "Age of Expansion",
        name: "Colonial Enterprise",
        description: "Reflects Césaire's critique of colonial economic ventures that prioritized profit over justice, allowing financial gain but risking alliances.",
        effects: [
            { type: 'RESOURCE_CHANGE', changes: { money: -6, knowledge: 5 } } 
        ]
    },
    {
        deck: "Age of Expansion",
        name: "Missionary Influence",
        description: "Represents Césaire's view of ideological domination through religion, granting Influence but reinforcing colonial authority.",
        effects: [
            { type: 'MOVEMENT', target: 'SELF', spaces: 6 },
            { type: 'RESOURCE_CHANGE', changes: { influence: 5 } }
        ]
    },
    {
        deck: "Age of Expansion",
        name: "Revolt Suppression",
        description: "Demonstrates colonial violence used to crush uprisings, allowing sabotage but increasing instability.",
        effects: [
            { type: 'MOVEMENT', target: 'OTHER', spaces: -6 } 
        ]
    },
    {
        deck: "Age of Expansion",
        name: "Commodification of Labor",
        description: "Reflects Césaire's analysis of forced labor systems, allowing Money gain at the expense of future opportunities.",
        effects: [
            { type: 'RESOURCE_CHANGE', changes: { money: 7 } },
            { type: 'SKIP_TURN', target: 'SELF' }
        ]
    },
    {
        deck: "Age of Expansion",
        name: "Indigenous Displacement",
        description: "Reflects Césaire's warning about the violence of land dispossession, advancing progress but reducing moral standing.",
        effects: [
            { type: 'MOVEMENT', target: 'SELF', moveToAge: "The Age of Resistance" }, 
            { type: 'RESOURCE_CHANGE', changes: { influence: -6 } }
        ]
    },
    {
        deck: "Age of Expansion",
        name: "Control the Narrative",
        description: "Embodies colonial propaganda described by Césaire, increasing Knowledge while reinforcing power.",
        effects: [
            { type: 'RESOURCE_CHANGE', changes: { knowledge: 5 } },
            { type: 'MOVEMENT', target: 'SELF', spaces: 5 }
        ]
    },
    {
        deck: "Age of Expansion",
        name: "Mercantile Expansion",
        description: "Highlights colonial capitalism's expansion, fostering temporary alliances but encouraging unequal trade.",
        effects: [
            { type: 'STEAL', target: 'OTHER', resource: 'MONEY', amount:2 }, 
            { type: 'RESOURCE_CHANGE', changes: { money: -2 } }
        ]
    },
    {
        deck: "Age of Expansion",
        name: "Plantation Economy",
        description: "Reflects Césaire's critique of exploitative plantation economies, rewarding Money but hindering intellectual growth.",
        effects: [
            { type: 'RESOURCE_CHANGE', changes: { knowledge: -5 } },
            { type: 'RESOURCE_CHANGE', changes: { money: 6 } }
        ]
    },
    {
        deck: "Age of Expansion",
        name: "Imperial Propaganda",
        description: "Reinforces colonial dominance through narrative control, allowing suppression of opposition.",
        effects: [
            { type: 'STEAL', target: 'OTHER', resource: 'INFLLUENCE', amount:4, },
            { type: 'RESOURCE_CHANGE', changes: { influence: -4 } }
        ]
    }
];

// Export the cards array directly
export const PURPLE_DECK = [...ageOfExpansionDeck];