// Age of Legacy (Pink) cards
export const ageOfLegacyDeck = [
    {
        deck: "Age of Legacy",
        name: "Digital Divide",
        description: "Exposes inequalities in access to digital history, impacting Knowledge.",
        effects: [
            { type: 'RESOURCE_CHANGE', changes: { knowledge: -7 } }, // Self loss
            { type: 'STEAL', target: 'OTHER', resource: 'KNOWLEDGE', amount: 4 } // Steal 4 knowledge from another player
        ]
    },
    {
        deck: "Age of Legacy",
        name: "Memory Laws",
        description: "Highlights state control over historical narratives, penalizing certain interpretations.",
        effects: [
            { type: 'RESOURCE_CHANGE', changes: { influence: -6 } }
        ]
    },
    {
        deck: "Age of Legacy",
        name: "Archival Silences",
        description: "Reveals gaps in historical records, pushing players back as they reinvestigate.",
        effects: [
            { type: 'MOVEMENT', target: 'SELF', spaces: -7 },
            { type: 'RESOURCE_CHANGE', changes: { knowledge: 4 } }
        ]
    },
    {
        deck: "Age of Legacy",
        name: "Historical Trauma",
        description: "Addresses the lasting impact of past injustices, costing resources.",
        effects: [
            { type: 'RESOURCE_CHANGE', changes: { money: -6, influence: -3 } }
        ]
    },
    {
        deck: "Age of Legacy",
        name: "Victors Write History",
        description: "Reinforces dominant narratives, rewarding players aligned with power.",
        // How to determine alignment? Placeholder: give resources
        effects: [
            { type: 'RESOURCE_CHANGE', changes: { money: 5, influence: 5 } }
        ]
    },
    {
        deck: "Age of Legacy",
        name: "Counter-Narratives Emerge",
        description: "Challenges established histories, allowing strategic gains.",
        effects: [
            { type: 'RESOURCE_CHANGE', changes: { knowledge: 6 } },
            { type: 'MOVEMENT', target: 'OTHER', spaces: -4 } // disrupt others
        ]
    },
    {
        deck: "Age of Legacy",
        name: "Public History Debates",
        description: "Sparks public debate about historical interpretation, affecting Influence.",
        effects: [
            { type: 'RESOURCE_CHANGE', changes: { influence: 7 } },
            { type: 'SABOTAGE', target: 'OTHER', changes: { influence: -4 } }
        ]
    },
    {
        deck: "Age of Legacy",
        name: "Legacy of Resistance",
        description: "Honors past struggles, providing resources and inspiration.",
        effects: [
            { type: 'MOVEMENT', target: 'SELF', spaces: 6 },
            { type: 'RESOURCE_CHANGE', changes: { knowledge: 3, influence: 3 } }
        ]
    },
    {
        deck: "Age of Legacy",
        name: "Generational Amnesia",
        description: "Highlights the loss of historical memory, penalizing Knowledge.",
        effects: [
            { type: 'RESOURCE_CHANGE', changes: { knowledge: -8 } }
        ]
    },
    {
        deck: "Age of Legacy",
        name: "Future Histories",
        description: "Considers how current actions will be remembered, rewarding forward thinking.",
        // Placeholder: Grant immunity?
        effects: [
            { type: 'GRANT_IMMUNITY', turns: 1 } 
        ]
    },
    {
        deck: "Age of Legacy",
        name: "Rewriting the Past",
        description: "Allows players to alter historical narratives, gaining Influence but losing Knowledge.",
        effects: [
            { type: 'RESOURCE_CHANGE', changes: { influence: 8, knowledge: -5 } }
        ]
    },
    {
        deck: "Age of Legacy",
        name: "The Weight of History",
        description: "Shows the burden of the past, slowing progress.",
        effects: [
            { type: 'SKIP_TURN', target: 'SELF' },
            { type: 'RESOURCE_CHANGE', changes: { money: -4 } }
        ]
    }
];

// Export the cards array directly
export const PINK_DECK = [...ageOfLegacyDeck];