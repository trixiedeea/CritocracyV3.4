// Cards Module for Critocracy
// Manages card decks, drawing, discarding, and applying effects.

// Import player functions needed for card effects
import { 
    updatePlayerResources, 
    // movePlayer, // REMOVED - Function no longer exists in players.js
    // hasImmunity, // Check immunity within applyCardEffect 
    // useSpecialAbility, // Check ability within applyCardEffect 
    getPlayers, 
    // getCurrentPlayer, // REMOVED - Not provided by players.js anymore
    setPlayerSkipTurn, 
    PLAYER_ROLES,
    getRandomOtherPlayer,
    setPlayerForcedPathChange,
    grantImmunity,
    // formAlliance, // Placeholder in game.js
    // makeTrade // Placeholder in game.js
} from './players.js';

// Import game logic functions needed for complex effects
import { 
    handleCardMovement, 
    initiateAlliance,
    initiateTrade
    // players // REMOVED - players array is not exported from game.js
} from './game.js';

// Import board functions if needed for movement effects
// import { getSpaceById, getStartSpaceId } from './board.js'; // REMOVED - Use coordinate system now

// Import card data directly from JS files
import { ENDOFTURNCARDS } from '../assets/Cards/Endofturncards.js';
// Import all named exports from Special Events and combine
import * as SpecialEventCardDecks from '../assets/Cards/Specialeventcards.js';

// Import UI functions needed
import { showCard, logMessage } from './ui.js'; // Added logMessage

// Combine Special Event decks into one structure for easier access by color
const SPECIAL_EVENT_CARD_DATA = {
    PURPLE: SpecialEventCardDecks.PURPLE_CARDS || [],
    BLUE: SpecialEventCardDecks.BLUE_CARDS || [],
    CYAN: SpecialEventCardDecks.CYAN_CARDS || [],
    PINK: SpecialEventCardDecks.PINK_CARDS || []
};

// Check the actual export names and fix if necessary
console.log("Loaded Special Event Cards:", Object.keys(SpecialEventCardDecks));

// Define deck types using strings (consistent with JSON structure if used later)
export const DECK_TYPES = {
    PURPLE: 'PURPLE',
    BLUE: 'BLUE',
    CYAN: 'CYAN',
    PINK: 'PINK',
    END_OF_TURN: 'END_OF_TURN'
};

// Card State Management
let cardState = {
    decks: {
        [DECK_TYPES.PURPLE]: [],
        [DECK_TYPES.BLUE]: [],
        [DECK_TYPES.CYAN]: [],
        [DECK_TYPES.PINK]: [],
        [DECK_TYPES.END_OF_TURN]: []
    },
    discardPiles: {
        [DECK_TYPES.PURPLE]: [],
        [DECK_TYPES.BLUE]: [],
        [DECK_TYPES.CYAN]: [],
        [DECK_TYPES.PINK]: [],
        [DECK_TYPES.END_OF_TURN]: []
    },
    initialized: false
};

// ===== Core Functions =====

/**
 * Initializes card decks from imported data and shuffles them.
 */
export function setupDecks() {
    console.log("Setting up card decks...");
    try {
        // Load and shuffle Special Event decks
        Object.keys(SPECIAL_EVENT_CARD_DATA).forEach(deckType => {
            const deckKey = DECK_TYPES[deckType];
            const cards = SPECIAL_EVENT_CARD_DATA[deckType];
            
            if (deckKey && Array.isArray(cards) && cards.length > 0) {
                cardState.decks[deckKey] = cards.map(card => ({ 
                    ...card, 
                    pathColor: deckKey
                }));
                cardState.discardPiles[deckKey] = [];
                shuffleDeck(deckKey);
                console.log(` Deck ${deckKey} loaded with ${cardState.decks[deckKey].length} cards (color added).`);
            } else {
                console.warn(`Issue with deck ${deckType}: deckKey=${deckKey}, cards=${cards ? cards.length : 'undefined'}`);
                // Fallback: Check if using old export structure
                if (SpecialEventCardDecks.SPECIAL_EVENT_CARDS) {
                    const oldStructureKey = deckType.toLowerCase();
                    const oldStructureCards = SpecialEventCardDecks.SPECIAL_EVENT_CARDS[oldStructureKey];
                    
                    if (Array.isArray(oldStructureCards) && oldStructureCards.length > 0) {
                        console.log(` Using fallback for ${deckType} from old structure.`);
                        cardState.decks[deckKey] = oldStructureCards.map(card => ({
                             ...card,
                             pathColor: deckKey
                        }));
                        cardState.discardPiles[deckKey] = [];
                        shuffleDeck(deckKey);
                        console.log(` Deck ${deckKey} loaded with ${cardState.decks[deckKey].length} cards (color added).`);
                    } else {
                        console.error(`Failed to load cards for ${deckType}, both from new and old structures.`);
                    }
                }
            }
        });

        // Load and shuffle End of Turn deck
        const eotDeckKey = DECK_TYPES.END_OF_TURN;
        if (Array.isArray(ENDOFTURNCARDS) && ENDOFTURNCARDS.length > 0) {
            cardState.decks[eotDeckKey] = [...ENDOFTURNCARDS];
            cardState.discardPiles[eotDeckKey] = [];
            shuffleDeck(eotDeckKey);
            console.log(` Deck ${eotDeckKey} loaded with ${cardState.decks[eotDeckKey].length} cards.`);
        } else {
            console.error(`Failed to load End of Turn cards. ENDOFTURNCARDS=${ENDOFTURNCARDS ? 'exists' : 'undefined'}`);
            return false;
        }
        
        cardState.initialized = true;
        console.log("Card decks setup complete.");
        return true;
    } catch (error) {
        console.error("Error setting up card decks:", error);
        cardState.initialized = false;
        return false;
    }
}

/**
 * Shuffles a specified deck using the Fisher-Yates algorithm.
 */
function shuffleDeck(deckType) {
    let deck = cardState.decks[deckType];
    if (!deck) return;

    console.log(`Shuffling ${deckType} deck...`);
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]]; // Swap
    }
}

/**
 * Draws a card from the specified deck.
 * If the deck is empty, reshuffles the discard pile into the deck.
 * @param {string} deckType - The type of deck to draw from (e.g., DECK_TYPES.PURPLE).
 * @returns {object | null} The drawn card object or null if deck and discard are empty.
 */
export function drawCard(deckType) {
    if (!cardState.initialized || !cardState.decks[deckType]) {
        console.error(`Cannot draw card: Deck type ${deckType} not initialized or invalid.`);
        return null;
    }

    let deck = cardState.decks[deckType];
    let discardPile = cardState.discardPiles[deckType];

    if (deck.length === 0) {
        console.log(`${deckType} deck empty. Reshuffling discard pile...`);
        if (discardPile.length === 0) {
            console.warn(`Cannot draw card: ${deckType} deck and discard pile are both empty.`);
            return null;
        }
        // Move discard pile to deck and shuffle
        cardState.decks[deckType] = [...discardPile];
        cardState.discardPiles[deckType] = [];
        shuffleDeck(deckType);
        deck = cardState.decks[deckType]; // Update reference
    }

    const drawnCard = deck.pop(); // Draw from the end (top) of the deck
    
    if (!drawnCard) {
        console.error(`Popped an undefined card from ${deckType}. Deck state:`, deck);
        // Maybe reshuffle again or handle error?
        return null;
    }
    
    console.log(`Drawn card from ${deckType}: ${drawnCard.name}`);
    
    // Add the deckType to the card object itself
    drawnCard.deckType = deckType;
    
    // Automatically discard the drawn card unless specified otherwise (e.g., Keep cards)
    if (!drawnCard.keep) { // Check for a 'keep' flag
        discardCard(drawnCard, deckType);
    } else {
         console.log(` Card ${drawnCard.name} is kept by the player.`);
    }
    
    return drawnCard;
}

/**
 * Adds a card to the appropriate discard pile.
 */
export function discardCard(card, deckType) {
    if (!cardState.initialized || !cardState.discardPiles[deckType]) {
        console.error(`Cannot discard card: Deck type ${deckType} not initialized or invalid.`);
        return;
    }
    if (!card) {
         console.warn(`Attempted to discard an invalid card object to ${deckType}.`);
         return;
    }
    
    cardState.discardPiles[deckType].push(card);
    // console.log(`Card ${card.name} discarded to ${deckType}. Pile size: ${cardState.discardPiles[deckType].length}`);
}

/**
 * Applies the effects listed on a card to the target player(s).
 */
export function applyCardEffect(card, player) {
    if (!card || !player) {
        console.warn("Cannot apply card effect: Invalid card or player.", { card, player });
        return;
    }

    console.log(`Applying effects of card "${card.name}" to player ${player.name}...`);
    
    // Handle different effect formats
    if (!card.effects) {
        console.error(`Card "${card.name}" has no effects property.`);
        return;
    }
    
    // Case 1: Effects organized by role (object with role keys)
    if (typeof card.effects === 'object' && !Array.isArray(card.effects)) {
        console.log(`Card "${card.name}" has role-based effects structure.`);
        
        // Find effects for the player's role
        const roleEffects = card.effects[player.role];
        if (roleEffects) {
            console.log(`Applying ${player.role}-specific effects:`, roleEffects);
            
            // If the role effects is an array, process each effect
            if (Array.isArray(roleEffects)) {
                roleEffects.forEach(effect => processEffect(effect, player, player));
            }
            // If it's a single effect object, process it directly
            else if (typeof roleEffects === 'object') {
                processEffect(roleEffects, player, player);
            }
        } else {
            console.log(`No specific effects defined for ${player.role} role.`);
            
            // Check if there's a generic "ALL" key for effects that apply to all roles
            if (card.effects.ALL) {
                const allEffects = card.effects.ALL;
                if (Array.isArray(allEffects)) {
                    allEffects.forEach(effect => processEffect(effect, player, player));
                } else {
                    processEffect(allEffects, player, player);
                }
            }
        }
        return;
    }
    
    // Case 2: Effects as an array (original format)
    if (Array.isArray(card.effects)) {
        card.effects.forEach(effect => processEffect(effect, player, player));
        return;
    }
    
    // If we get here, the effects property has an unexpected format
    console.error(`Card "${card.name}" effects has an unexpected format:`, card.effects);
}

/**
 * Process a single effect, handling immunity and applying the correct effect type
 * @param {object} effect - The effect object from the card.
 * @param {object} player - The target player of the effect.
 * @param {object} sourcePlayer - The player who initiated the effect (drew the card).
 */
function processEffect(effect, player, sourcePlayer) {
    console.log(` Processing effect: ${JSON.stringify(effect)} for target ${player.name} from source ${sourcePlayer.name}`);
    
    // Define the target player based on the effect's target property if it exists
    let targetPlayer = player; // Default target is the player passed in (often source player)
    if (effect.target === 'OTHER') {
        targetPlayer = getRandomOtherPlayer(sourcePlayer);
        if (!targetPlayer) {
            console.log(`Effect targeted OTHER, but no other player found.`);
            return; // Cannot apply effect if no target
        }
        console.log(` Effect target is OTHER: ${targetPlayer.name}`);
        // For effects targeting others, the 'player' arg might be misleading, use targetPlayer
    } else if (effect.target === 'SELF') {
        targetPlayer = sourcePlayer; // Explicitly target the source player
        console.log(` Effect target is SELF: ${targetPlayer.name}`);
    } 
    // If no target property, assume the effect applies to the sourcePlayer (player who drew card)
    else if (!effect.target) {
         targetPlayer = sourcePlayer;
    } 
    // Note: Some functions below might re-determine the target internally based on convention

    // Check for immunity BEFORE applying effect
    // Always check immunity of the ACTUAL target player against the source player
    if (hasImmunity(targetPlayer, effect.type, sourcePlayer)) { 
        console.log(` Player ${targetPlayer.name} is immune to ${effect.type} from ${sourcePlayer.name}.`);
        return; // Skip this effect
    }
    
    // Apply the effect based on its type
    switch (effect.type) {
        case 'RESOURCE_CHANGE':
            // Applies to the player object passed in (usually the source) unless target logic modifies it
            applyResourceChange(effect, targetPlayer); 
            break;
        case 'MOVEMENT':
            // applyMovement determines target internally based on effect.target
            applyMovement(effect, sourcePlayer); 
            break;
        case 'STEAL':
             // Source player steals from the target player
             applySteal(effect, targetPlayer, sourcePlayer);
             break;
        case 'SABOTAGE':
             // Source player sabotages the target player
             applySabotage(effect, targetPlayer, sourcePlayer);
             break;
        case 'SKIP_TURN':
             // applySkipTurn determines target internally based on effect.target
             applySkipTurn(effect, sourcePlayer);
             break;
        case 'CHANGE_PATH':
             // Applies to the source player
             applyChangePath(effect, sourcePlayer); 
             break;
        case 'TRADE_OFFER':
             // Source player initiates trade with a target determined in applyTradeOffer
             applyTradeOffer(effect, sourcePlayer);
             break;
        case 'ALLIANCE_OFFER':
             // Source player initiates alliance with a target determined in applyAllianceOffer
             applyAllianceOffer(effect, sourcePlayer);
             break;
        case 'DRAW_CARD':
            // Source player draws a card
            applyDrawCard(effect, sourcePlayer);
            break;
        case 'GRANT_IMMUNITY':
             // Grants immunity to the source player
             applyGrantImmunity(effect, sourcePlayer);
             break;
        case 'STEAL_FROM_ALL':
             // Source player steals from all others
             applyStealFromAll(effect, sourcePlayer);
             break;
        default:
            console.warn(`Unknown card effect type: ${effect.type}`);
    }
}

// ===== Effect Processing Functions =====

/** 
 * Checks player immunity based on role and effect type/source.
 * @param {object} targetPlayer - The player being targeted by the effect.
 * @param {string} effectType - The type of effect being applied.
 * @param {object} sourcePlayer - The player initiating the effect.
 * @returns {boolean} - True if the player is immune.
 */
function hasImmunity(targetPlayer, effectType, sourcePlayer = null) {
    if (!targetPlayer || !targetPlayer.role || !PLAYER_ROLES[targetPlayer.role]) return false;
    
    const roleData = PLAYER_ROLES[targetPlayer.role];
    
    // 0. Alliance Immunity (Check first!)
    // Immune if the source player is the current alliance partner
    if (sourcePlayer && targetPlayer.currentAlliancePartnerId && targetPlayer.currentAlliancePartnerId === sourcePlayer.id) {
        // Allow non-harmful effects? Or block all effects between allies?
        // For now, block common negative effects. Add more types if needed.
        const harmfulEffects = ['STEAL', 'SABOTAGE', 'STEAL_FROM_ALL']; // MOVEMENT (backwards) could be added
        if (harmfulEffects.includes(effectType)) {
            console.log(` Immunity Check: Target ${targetPlayer.name} is allied with source ${sourcePlayer.name}. Immune to ${effectType}.`);
            return true; 
        }
    }

    // 1. Opposing Role Immunity
    // Check if sourcePlayer exists and its role is the opposing role
    if (sourcePlayer && sourcePlayer.role && roleData.opposingRole === sourcePlayer.role) {
         console.log(` Immunity Check: ${targetPlayer.role} opposes ${sourcePlayer.role}. Immune.`);
         return true; // Immune to *any* attack from opposing role
    }

    // 2. Specific Role Immunities
    switch (effectType) {
        case 'STEAL':
            // Check resource type if specified in effect (e.g., effect.resource = 'knowledge')
            if (targetPlayer.role === 'HISTORIAN' /* && effect.resource === 'knowledge' */) return true;
            if (targetPlayer.role === 'COLONIALIST' /* && effect.resource === 'influence' */) return true;
            if (targetPlayer.role === 'POLITICIAN' /* && effect.resource === 'money' */) return true;
            break;
        case 'SABOTAGE': // Generic sabotage immunity count
            if (targetPlayer.role === 'REVOLUTIONARY' && !targetPlayer.sabotageImmunityUsed) {
                targetPlayer.sabotageImmunityUsed = true; // Mark as used for this game
                console.log(` Revolutionary used their 1 sabotage immunity.`);
                return true;
            }
            break;
        case 'SKIP_TURN':
            if (targetPlayer.role === 'ENTREPRENEUR') return true;
            break;
        case 'CHANGE_PATH': // Immunity to being forced to change
             if (targetPlayer.role === 'ARTIST') return true;
             break;
        // Add other specific immunities
    }
    
    return false;
}

function applyResourceChange(effect, player) {
    console.log(` Applying RESOURCE_CHANGE to ${player.name}:`, effect.changes);
    // effect.changes should be an object like { knowledge: 10, money: -5 }
    updatePlayerResources(player, effect.changes); 
}

function applyMovement(effect, player) {
    // player here is the sourcePlayer passed from processEffect
    console.log(` Processing MOVEMENT effect initiated by ${player.name}:`, effect);

    let targetPlayerForMove = null;
    if (effect.target === 'SELF') {
        targetPlayerForMove = player;
    } else if (effect.target === 'OTHER') {
        targetPlayerForMove = getRandomOtherPlayer(player);
        if (!targetPlayerForMove) {
            console.log("No other player found for MOVEMENT effect.");
            return; 
        }
        console.log(` Target for movement effect is other player: ${targetPlayerForMove.name}`);
    } else {
        // If target is not specified, assume SELF
        targetPlayerForMove = player; 
    }
    
    // Pass the responsibility to game.js
    handleCardMovement(targetPlayerForMove, effect);
}

/**
 * Applies STEAL effect. Source player steals from target player.
 * @param {object} effect - The steal effect details.
 * @param {object} targetPlayer - The player being stolen from.
 * @param {object} sourcePlayer - The player initiating the steal.
 */
function applySteal(effect, targetPlayer, sourcePlayer) {
    // Immunity check already done in processEffect
    console.log(` Applying STEAL from ${sourcePlayer.name} to target ${targetPlayer.name}:`, effect);
        
    let resourceToSteal = effect.resource;
    const amount = effect.amount;
    
    if (!resourceToSteal || !amount) {
         console.warn("Invalid STEAL effect definition:", effect);
         return;
    }

    // Handle random resource selection
    if (resourceToSteal === 'random') {
        const availableResources = ['money', 'knowledge', 'influence'].filter(res => targetPlayer.resources[res] > 0); // Only steal resources they HAVE
        if(availableResources.length === 0) {
            console.log(` ${targetPlayer.name} has no resources to steal.`);
            return;
        }
        const randomIndex = Math.floor(Math.random() * availableResources.length);
        resourceToSteal = availableResources[randomIndex];
        console.log(` Random steal selected: ${resourceToSteal}`);
    }
    
    // Check specific role immunities for the *resource type*
     if ((resourceToSteal === 'knowledge' && targetPlayer.role === 'HISTORIAN') ||
         (resourceToSteal === 'influence' && targetPlayer.role === 'COLONIALIST') ||
         (resourceToSteal === 'money' && targetPlayer.role === 'POLITICIAN')) {
          console.log(` Target ${targetPlayer.name} role immunity prevents stealing ${resourceToSteal}.`);
          return;
     }

    // Proceed with steal
    const actualAmountStolen = Math.min(targetPlayer.resources[resourceToSteal] || 0, amount);
    if (actualAmountStolen > 0) {
        console.log(` ${sourcePlayer.name} stealing ${actualAmountStolen} ${resourceToSteal} from ${targetPlayer.name}`);
        updatePlayerResources(sourcePlayer, { [resourceToSteal]: actualAmountStolen }); 
        updatePlayerResources(targetPlayer, { [resourceToSteal]: -actualAmountStolen }); 
    } else {
         console.log(` ${targetPlayer.name} has no ${resourceToSteal} to steal.`);
    }
}

/**
 * Applies SABOTAGE effect. Source player negatively affects target player.
 * @param {object} effect - The sabotage effect details.
 * @param {object} targetPlayer - The player being sabotaged.
 * @param {object} sourcePlayer - The player initiating the sabotage.
 */
function applySabotage(effect, targetPlayer, sourcePlayer) {
    // Immunity check already done in processEffect
    console.log(` Applying SABOTAGE from ${sourcePlayer.name} to target ${targetPlayer.name}:`, effect);
    
    // Apply specific sabotage effect (e.g., lose resources)
    if (effect.changes) { 
        console.log(` Sabotaging ${targetPlayer.name} resources:`, effect.changes);
        let actualChanges = {};
        let logParts = [];
        for (const resource in effect.changes) {
            if (effect.changes[resource] < 0) { // Only apply losses
                 const lossAmount = effect.changes[resource];
                 const actualLoss = Math.max(lossAmount, -(targetPlayer.resources[resource] || 0));
                 if(actualLoss < 0) { // Only record if there IS a loss
                    actualChanges[resource] = actualLoss;
                    logParts.push(`${-actualLoss} ${resource}`);
                 }
            } else {
                 console.warn(`Sabotage effect included gain? Ignoring: ${resource}: ${effect.changes[resource]}`);
            }
        }
        if (Object.keys(actualChanges).length > 0) {
             updatePlayerResources(targetPlayer, actualChanges);
        } else {
             console.log("No actual resource loss applied by sabotage.");
        }
    } else {
         console.warn("Sabotage effect missing 'changes' property.");
    }
}

function applySkipTurn(effect, player) {
    // player here is the sourcePlayer passed from processEffect
    console.log(` Processing SKIP_TURN initiated by ${player.name}:`, effect);
    let target = null;
    if (effect.target === 'SELF') {
        target = player;
    } else if (effect.target === 'OTHER') {
         target = getRandomOtherPlayer(player);
    } else {
         // If target is not specified, assume SELF
         target = player; 
    }
    
    if (!target) {
         console.log("No target found for SKIP_TURN effect.");
         return;
    }
    
    // Check target's immunity (source is the player who drew the card)
    // Pass the original initiator (player) as source for immunity check
    if (hasImmunity(target, 'SKIP_TURN', player)) { 
         console.log(` Target ${target.name} is immune to SKIP_TURN.`);
         return;
    }
    
    console.log(` Player ${target.name} will skip their next turn.`);
    setPlayerSkipTurn(target, true); 
}

function applyChangePath(effect, player) {
    // player here is the sourcePlayer passed from processEffect
    console.log(` Applying CHANGE_PATH to ${player.name}:`, effect);
    
    // Check immunity (against the initiator, which is self in this case)
    if (hasImmunity(player, 'CHANGE_PATH', player)) {
        console.log(`${player.name} is immune to CHANGE_PATH.`);
        return;
    }
    
    console.log(`${player.name} will be forced to change paths at the next junction.`);
    setPlayerForcedPathChange(player, true);
}

/**
 * Applies DRAW_CARD effect. The source player draws a card.
 * @param {object} effect - The draw card effect details.
 * @param {object} sourcePlayer - The player drawing the card.
 */
function applyDrawCard(effect, sourcePlayer) {
    console.log(` Applying DRAW_CARD effect to ${sourcePlayer.name}:`, effect);
    const deckToDraw = effect.deckType;
    if (!deckToDraw) {
        console.error("DRAW_CARD effect missing deckType property.");
        return;
    }

    // Draw the new card
    const newCard = drawCard(deckToDraw);

    if (newCard) {
        console.log(` Card effect caused ${sourcePlayer.name} to draw: ${newCard.name} from ${deckToDraw}`);
        showCard(newCard, deckToDraw, sourcePlayer); 
        applyCardEffect(newCard, sourcePlayer); 
    } else {
        console.warn(` DRAW_CARD effect failed: Could not draw card from ${deckToDraw} deck.`);
    }
}

/**
 * Applies GRANT_IMMUNITY effect. Grants immunity to the source player.
 * @param {object} effect - The grant immunity effect details.
 * @param {object} sourcePlayer - The player receiving immunity.
 */
function applyGrantImmunity(effect, sourcePlayer) {
    console.log(` Applying GRANT_IMMUNITY effect to ${sourcePlayer.name}:`, effect);
    const turns = effect.turns || 1; 
    grantImmunity(sourcePlayer, turns); 
}

/**
 * Applies STEAL_FROM_ALL effect. Source player steals from all other players.
 * @param {object} effect - The steal from all effect details.
 * @param {object} sourcePlayer - The player initiating the steal.
 */
function applyStealFromAll(effect, sourcePlayer) {
    console.log(` Applying STEAL_FROM_ALL effect for ${sourcePlayer.name}:`, effect);
        
    const resourceToSteal = effect.resource;
    const amountPerPlayer = effect.amount;

    if (!resourceToSteal || !amountPerPlayer || amountPerPlayer <= 0) {
        console.error("Invalid STEAL_FROM_ALL effect definition:", effect);
        return;
    }

    // Use getPlayers() imported from players.js
    const otherPlayers = getPlayers().filter(p => p.id !== sourcePlayer.id && !p.finished); 
    if (otherPlayers.length === 0) {
        console.log("STEAL_FROM_ALL: No other players to steal from.");
        return;
    }
    
    let totalStolen = 0;

    otherPlayers.forEach(targetPlayer => {
        console.log(` -> Attempting to steal ${amountPerPlayer} ${resourceToSteal} from ${targetPlayer.name}`);
        
        // Pass actual sourcePlayer for immunity checks
        if (hasImmunity(targetPlayer, 'STEAL_FROM_ALL', sourcePlayer)) { 
            console.log(`    Immune: ${targetPlayer.role} vs ${sourcePlayer.role}`);
            return; // Skips this target player
        }

        // Also check specific resource immunities
        if ((resourceToSteal === 'knowledge' && targetPlayer.role === 'HISTORIAN') ||
            (resourceToSteal === 'influence' && targetPlayer.role === 'COLONIALIST') ||
            (resourceToSteal === 'money' && targetPlayer.role === 'POLITICIAN')) {
            console.log(`    Immune: Role ${targetPlayer.role} protects ${resourceToSteal}.`);
            return; // Skips this target player
        }

        const actualAmountStolen = Math.min(targetPlayer.resources[resourceToSteal] || 0, amountPerPlayer);
        if (actualAmountStolen > 0) {
            console.log(`    Stole ${actualAmountStolen} ${resourceToSteal} from ${targetPlayer.name}`);
            updatePlayerResources(targetPlayer, { [resourceToSteal]: -actualAmountStolen });
            totalStolen += actualAmountStolen;
        } else {
            console.log(`    ${targetPlayer.name} has no ${resourceToSteal} to steal.`);
        }
    });

    if (totalStolen > 0) {
        console.log(` ${sourcePlayer.name} gained a total of ${totalStolen} ${resourceToSteal} from all others.`);
        updatePlayerResources(sourcePlayer, { [resourceToSteal]: totalStolen });
    } else {
        console.log(` No ${resourceToSteal} was stolen from any player.`);
    }
}

function applyAllianceOffer(effect, player) {
    // player here is the sourcePlayer passed from processEffect
    console.log(` Applying ALLIANCE_OFFER effect initiated by ${player.name}:`, effect);
    // Target one random other player for the alliance
    const targetPlayer = getRandomOtherPlayer(player);
    if (!targetPlayer) {
        console.log("ALLIANCE_OFFER: No other player found to form alliance with.");
        return;
    }
    
    console.log(` -> Offering alliance to ${targetPlayer.name}`);
    initiateAlliance(player, targetPlayer);
}

function applyTradeOffer(effect, player) {
    // player here is the sourcePlayer passed from processEffect
    console.log(` Applying TRADE_OFFER effect initiated by ${player.name}:`, effect);
    
    // For now, assume trade is with one random other player
    const targetPlayer = getRandomOtherPlayer(player);
    if (!targetPlayer) {
        console.log("TRADE_OFFER: No other player found to trade with.");
        return;
    }

    // Extract offer/request details from the effect object
    // Use optional chaining for safety
    const offerDetails = effect.offer; 
    const requestDetails = effect.request; 
    const isSwap = effect.swap || false;
    const swapResource = effect.resource; // For swap type trades
    const swapAmount = effect.amount;     // For swap type trades

    // Validate based on type
    if (isSwap) {
        if (!swapResource || !swapAmount) {
             console.error("TRADE_OFFER: Invalid swap structure. Missing resource or amount.", effect);
             return;
        }
         // Standardize swap details for initiateTrade
         const swapOffer = { resource: swapResource, amount: swapAmount };
         const swapRequest = { resource: swapResource, amount: swapAmount };
         console.log(` -> Initiating SWAP offer to ${targetPlayer.name}`);
         initiateTrade(player, targetPlayer, swapOffer, swapRequest, true);

    } else {
         if (!offerDetails || !requestDetails) {
             console.error("TRADE_OFFER: Invalid standard trade structure. Missing offer or request details.", effect);
             return;
         }
         console.log(` -> Initiating standard trade offer to ${targetPlayer.name}`);
         initiateTrade(player, targetPlayer, offerDetails, requestDetails, false);
    }
}

/**
 * Applies the specific effect from an End of Turn card to the player who drew it.
 * @param {object} card - The End of Turn card object.
 * @param {object} player - The player who drew the card.
 */
export function applySinglePlayerEOTEffect(card, player) {
    if (!card || !player || !card.effects || typeof card.effects !== 'object') {
        console.error("applySinglePlayerEOTEffect: Invalid card or player data.", { card, player });
        return;
    }

    // Convert player role (e.g., HISTORIAN) to PascalCase (e.g., Historian) for lookup
    const pascalCaseRole = player.role[0].toUpperCase() + player.role.substring(1).toLowerCase();
    
    // Use the converted role name for lookup
    const roleEffect = card.effects[pascalCaseRole];
    if (!roleEffect) {
        // Log using the original uppercase role for clarity in console
        console.warn(`No specific EOT effect found for role ${player.role} (lookup: ${pascalCaseRole}) on card ${card.name}.`);
        return;
    }

    console.log(`Applying EOT effect for ${player.role} from card ${card.name}:`, roleEffect);

    // Apply the resource change effect
    if (roleEffect.changes) {
        // Construct the changes object expected by updatePlayerResources
        const resourceChanges = {};
        for (const resource in roleEffect.changes) {
            if (roleEffect.changes.hasOwnProperty(resource)) {
                // Ensure amount is a number
                const amount = parseInt(roleEffect.changes[resource], 10);
                if (!isNaN(amount)) {
                    resourceChanges[resource] = amount;
                } else {
                    console.warn(`Invalid amount for resource ${resource} in EOT effect for ${player.role}: ${roleEffect.changes[resource]}`);
                }
            }
        }
        
        if (Object.keys(resourceChanges).length > 0) {
            updatePlayerResources(player, resourceChanges); 
        } else {
             console.log(`No valid resource changes to apply for ${player.role}.`);
        }
        // TODO: Add support for other types of EOT effects if needed (e.g., movement, status)
    } else {
        console.log(`EOT effect for ${player.role} has no 'changes' property.`);
    }
}

/**
 * Applies the effects of an End of Turn card based on player roles.
 * This affects ALL players based on their role's specific effect on the card.
 * @param {object} card - The End of Turn card object.
 */
export function applyEndOfTurnCardEffects(card) {
    console.log(`Applying End of Turn card: ${card.name}`);
    logMessage(`End of Round Event: ${card.name}`);

    if (!card.effects || typeof card.effects !== 'object') {
        console.error('Invalid End of Turn card structure: Missing or invalid effects object.', card);
        logMessage('Error: Invalid card structure.');
        return;
    }
    
    const allPlayers = getPlayers();

    allPlayers.forEach(player => {
        const roleEffect = card.effects[player.role];
        if (roleEffect) {
            console.log(` - Applying effect to ${player.role} (Player ${player.id})`);
            if (roleEffect.type === 'RESOURCE_CHANGE') {
                applyResourceChange(roleEffect, player); 
            } else {
                console.warn(`Unhandled effect type '${roleEffect.type}' found in End of Turn card for role ${player.role}.`);
            }
        } else {
            console.log(` - No specific effect for ${player.role} (Player ${player.id}) on this card.`);
        }
    });
}

// ===== Helper Functions =====

// REMOVED Duplicate local definition - now imported from players.js
/*
function getRandomOtherPlayer(player) {
    const otherPlayers = getPlayers().filter(p => p.id !== player.id && !p.finished); // Exclude self and finished players
    if (otherPlayers.length === 0) {
        return null;
    }
    const randomIndex = Math.floor(Math.random() * otherPlayers.length);
    return otherPlayers[randomIndex];
}
*/