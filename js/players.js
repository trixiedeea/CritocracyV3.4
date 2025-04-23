// Player Module for Critocracy
// Manages player state, roles, resources, and actions.

import { START_SPACE } from './board-data.js';
import { updatePlayerInfo } from './ui.js'; // Corrected import name

// ===== Player Constants =====
export const PLAYER_ROLES = {
    HISTORIAN: { 
        name: 'Suetonius The Historian', 
        startingResources: { knowledge: 14, money: 8, influence: 0 },
        opposingRole: 'POLITICIAN',
        abilityIdentifier: 'knowledgeTheftImmunity',
        token: 'H.png',
        abilityDescription: 'Cannot have knowledge stolen'
    },
    REVOLUTIONARY: {
        name: 'Audre Lorde The Revelutionary',
        startingResources: { knowledge: 14, influence: 8, money: 0 },
        opposingRole: 'COLONIALIST',
        abilityIdentifier: 'sabotageImmunity',
        token: 'R.png',
        abilityDescription: 'Ignores 1 sabotage per game'
    },
    COLONIALIST: { 
        name: 'Jacques Cartier The Colonialist', 
        startingResources: { money: 14, influence: 8, knowledge: 0 },
        opposingRole: 'REVOLUTIONARY',
        abilityIdentifier: 'influenceTheftImmunity',
        token: 'C.png',
        abilityDescription: 'Immune to influence theft'
    },
    ENTREPRENEUR: { 
        name: 'Regina Basilier The Entrepreneur', 
        startingResources: { money: 14, knowledge: 8, influence: 0 },
        opposingRole: 'ARTIST',
        abilityIdentifier: 'skipTurnImmunity',
        token: 'E.png',
        abilityDescription: 'Never has to miss a turn'
    },
    POLITICIAN: { 
        name: 'Winston Churchill The Politician', 
        startingResources: { influence: 14, money: 8, knowledge: 0 },
        opposingRole: 'HISTORIAN',
        abilityIdentifier: 'moneyTheftImmunity',
        token: 'P.png',
        abilityDescription: 'Money cannot be stolen from'
    },
    ARTIST: { 
        name: 'Salvador Dali The Artist', 
        startingResources: { influence: 14, knowledge: 8, money: 0 },
        opposingRole: 'ENTREPRENEUR',
        abilityIdentifier: 'pathChangeImmunity',
        token: 'A.png',
        abilityDescription: 'Cannot be forced to change paths'
    }
};

// Resource types (for validation, maybe)
const RESOURCES = ['money', 'knowledge', 'influence'];

// ===== Player State =====
let players = [];

// ===== Player Functions =====

/**
 * Resets the player state, clearing all players.
 */
export function resetPlayers() {
    console.log("Player state reset.");
    players = [];
}

/**
 * Retrieves the current list of players.
 * @returns {Array<Object>} Copy of the players array
 */
export function getPlayers() {
    // Return a shallow copy to prevent external modification
    return [...players];
}

/**
 * Creates a new player with the specified role and settings.
 * Initializes position using START_SPACE coordinates.
 * @param {string} name - The player's name
 * @param {string} role - The player's role (must be a key in PLAYER_ROLES)
 * @param {boolean} [isHuman=false] - Whether this player is human-controlled
 * @returns {Object|null} The created player object or null if role is invalid
 */
export function createPlayer(name, role, isHuman = false) {
    if (!PLAYER_ROLES[role]) {
        console.error(`Invalid role: ${role}`);
        return null;
    }
    
    // --- Use START_SPACE for initial coordinates --- 
    const startCoords = {
        x: START_SPACE.coordinates[0][0],
        y: START_SPACE.coordinates[0][1]
    };
    // --- End coordinate change --- 
    
    const player = {
        id: `player_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        name: name,
        role: role,
        isHuman: isHuman,
        currentCoords: { ...startCoords }, // Logical position
        x: startCoords.x, // Visual position X
        y: startCoords.y, // Visual position Y
        resources: { ...PLAYER_ROLES[role].startingResources },
        finished: false,
        skipNextTurn: false,
        cards: [],
        items: [],
        alliances: [],
        hasDrawnEOTCard: false,
        immunityTurns: 0, // For specific card effects
        tradeBlockedTurns: 0, // For specific card effects
        forcePathChange: false, // Added flag for card effect
        currentAlliancePartnerId: null // Added for temporary card alliances
    };
    
    console.log(`Created player ${player.name} (${player.role}), Human: ${player.isHuman}, starting at (${player.currentCoords.x},${player.currentCoords.y})`);
    players.push(player);
    return player;
}

/**
 * Updates a player's resources based on changes.
 * Ensures resources do not go below zero.
 * Triggers UI update for the player.
 */
export function updatePlayerResources(player, changes) {
    if (!player || !changes) {
        console.error('Invalid parameters for updatePlayerResources:', { player, changes });
        return false;
    }
    
    // Validate player has resources object
    if (!player.resources) {
        console.error('Player missing resources object:', player);
        return false;
    }

    // Validate and normalize changes
    const normalizedChanges = {};
    let isValid = true;
    for (const resource in changes) {
        if (!RESOURCES.includes(resource)) {
            console.warn(`Invalid resource type '${resource}' ignored`);
            continue;
        }
        
        const change = Number(changes[resource]);
        if (isNaN(change)) {
            console.error(`Invalid change value for ${resource}:`, changes[resource]);
            isValid = false;
            break;
        }
        
        normalizedChanges[resource] = change;
    }
    
    if (!isValid) return false;

    // Calculate new values first to ensure all changes are valid
    const newValues = { ...player.resources };
    for (const [resource, change] of Object.entries(normalizedChanges)) {
        const currentValue = newValues[resource] || 0;
        const newValue = currentValue + change;
        
        // Prevent negative resources
        if (newValue < 0) {
            console.error(`Cannot update ${resource}: would result in negative value (${newValue})`);
            return false;
        }
        
        newValues[resource] = newValue;
    }

    // Apply validated changes
    Object.assign(player.resources, newValues);
    console.log(`Resources updated for ${player.name}:`, player.resources);
    
    // Trigger UI update
    updatePlayerInfo();
    return true;
}

/**
 * Validates a trade between two players
 * @returns {boolean} Whether the trade is valid
 */
export function validateTrade(playerA, playerB, resourcesA, resourcesB) {
    if (!playerA || !playerB || !resourcesA || !resourcesB) {
        console.error('Missing parameters for trade validation');
        return false;
    }

    // Validate players have resources
    if (!playerA.resources || !playerB.resources) {
        console.error('Players missing resource objects');
        return false;
    }

    // Check if either player is trade blocked
    if (isTradeBlocked(playerA) || isTradeBlocked(playerB)) {
        console.error('One or both players are trade blocked');
        return false;
    }

    // Validate resource types and amounts
    for (const [resources, player] of [[resourcesA, playerA], [resourcesB, playerB]]) {
        for (const [resource, amount] of Object.entries(resources)) {
            if (!RESOURCES.includes(resource)) {
                console.error(`Invalid resource type: ${resource}`);
                return false;
            }

            const numAmount = Number(amount);
            if (isNaN(numAmount) || numAmount < 0) {
                console.error(`Invalid amount for ${resource}: ${amount}`);
                return false;
            }

            if ((player.resources[resource] || 0) < numAmount) {
                console.error(`${player.name} has insufficient ${resource}`);
                return false;
            }
        }
    }

    return true;
}

/**
 * Executes a validated trade between two players
 */
export function executeTrade(playerA, playerB, resourcesA, resourcesB) {
    if (!validateTrade(playerA, playerB, resourcesA, resourcesB)) {
        return false;
    }

    // Create inverse resource changes
    const changesForA = {};
    const changesForB = {};

    for (const [resource, amount] of Object.entries(resourcesA)) {
        changesForA[resource] = -amount;
        changesForB[resource] = amount;
    }

    for (const [resource, amount] of Object.entries(resourcesB)) {
        changesForB[resource] = -amount;
        changesForA[resource] = amount;
    }

    // Apply changes atomically
    const successA = updatePlayerResources(playerA, changesForA);
    if (!successA) {
        console.error('Failed to update resources for player A');
        return false;
    }

    const successB = updatePlayerResources(playerB, changesForB);
    if (!successB) {
        // Rollback player A's changes
        updatePlayerResources(playerA, invertChanges(changesForA));
        console.error('Failed to update resources for player B, rolled back player A');
        return false;
    }

    return true;
}

/**
 * Helper function to invert resource changes
 */
function invertChanges(changes) {
    const inverted = {};
    for (const [resource, amount] of Object.entries(changes)) {
        inverted[resource] = -amount;
    }
    return inverted;
}

/**
 * Marks a player as finished.
 */
export function markPlayerFinished(player) {
    if (!player) return;
    console.log(`Marking player ${player.name} as finished.`);
    player.finished = true;
    // Optionally add finish time/rank later if needed
}

/**
 * Checks if all players in the game have finished.
 */
export function allPlayersFinished() {
    if (players.length === 0) return false; // No players, game can't be finished
    return players.every(p => p.finished);
}

/**
 * Sets the skipNextTurn flag for a player.
 */
export function setPlayerSkipTurn(player, skip = true) {
    if (player) {
        player.skipNextTurn = skip;
    }
}

/**
 * Calculates the score for a single player (sum of resources).
 */
export function getPlayerScore(player) {
    // Placeholder scoring logic
    let score = 0;
    if (player.finished) score += 100; // Bonus for finishing
    // Add points for resources, cards, etc. later
    // score += Object.values(player.resources).reduce((sum, val) => sum + val, 0);
    return score;
}

/**
 * Calculates the final player rankings based on score and elimination.
 */
export function getPlayerRanking() {
    // Simple ranking: finished players first, then by name (for tie-breaking)
    return [...players].sort((a, b) => {
        if (a.finished && !b.finished) return -1;
        if (!a.finished && b.finished) return 1;
        return a.name.localeCompare(b.name); // Alphabetical for ties/unfinished
    });
}

// Get player by role
export function getPlayerByRole(role) {
    return players.find(player => player.role === role);
}

/**
 * Gets a random player from the list, excluding the provided player.
 * @param {object} currentPlayer - The player to exclude.
 * @returns {object | null} A random other player, or null if none exist.
 */
export function getRandomOtherPlayer(currentPlayer) {
    if (!currentPlayer) return null; 
    const otherPlayers = players.filter(p => p.id !== currentPlayer.id);
    if (otherPlayers.length === 0) {
        return null; // No other players in the game
    }
    const randomIndex = Math.floor(Math.random() * otherPlayers.length);
    return otherPlayers[randomIndex];
}

// Check if player has immunity to an effect
export function hasImmunity(player) {
    return player && player.immunityTurns > 0;
}

// Use special ability
export function useSpecialAbility(player) {
    // TODO: Implement role-specific abilities
    console.warn(`useSpecialAbility called for ${player.name} (${player.role}) - Not implemented.`);
    return false; // Indicate ability not used/failed
}

/**
 * Grants immunity to a player for a number of turns.
 */
export function grantImmunity(player, turns = 1) {
    if (player) {
        player.immunityTurns = Math.max(player.immunityTurns, turns);
        console.log(`${player.name} granted immunity for ${turns} turn(s). Total: ${player.immunityTurns}`);
    }
}

/**
 * Decrements immunity turns for all players (call at start of a game round/cycle).
 */
export function decrementImmunityTurns() {
    players.forEach(p => {
        if (p.immunityTurns > 0) {
            p.immunityTurns--;
            console.log(`Immunity turns decremented for ${p.name}. Remaining: ${p.immunityTurns}`);
        }
    });
}

/**
 * Blocks trading for a player.
 */
export function blockTrade(player, turns = 1) {
     if (player) {
         player.tradeBlockedTurns = Math.max(player.tradeBlockedTurns, turns);
         console.log(`${player.name} trade blocked for ${turns} turn(s). Total: ${player.tradeBlockedTurns}`);
     }
}

/**
 * Checks if trading is blocked for a player.
 */
export function isTradeBlocked(player) {
    return player && player.tradeBlockedTurns > 0;
}

/**
 * Decrements trade block turns.
 */
export function decrementTradeBlockTurns() {
     players.forEach(p => {
         if (p.tradeBlockedTurns > 0) {
             p.tradeBlockedTurns--;
             console.log(`Trade block turns decremented for ${p.name}. Remaining: ${p.tradeBlockedTurns}`);
         }
     });
}

/**
 * Sets or clears the forcePathChange flag for a player.
 * @param {object} player - The player object.
 * @param {boolean} force - True to set the flag, false to clear it.
 */
export function setPlayerForcedPathChange(player, force) {
    if (player) {
        player.forcePathChange = !!force;
        console.log(` Player ${player.name} forcePathChange set to: ${player.forcePathChange}`);
    }
}

// Move player - REMOVED UNUSED STUB
/*
export async function movePlayer(player, spaces) {
    // Implementation missing...
}
*/ 