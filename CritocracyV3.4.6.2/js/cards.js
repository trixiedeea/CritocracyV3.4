// Import player functions needed for card effects
import { 
    getPlayers, 
    setPlayerSkipTurn, 
    PLAYER_ROLES,
    getRandomOtherPlayer,
    updatePlayerResources,
} from './players.js';

// Import game logic functions needed for complex effects
import { 
    handleCardMovement,
    handleEndTurn, 
    processEndPlayerTurn,
} from './game.js';

// Import card data directly from JS files
import { endOfTurnDeck } from '../assets/Cards/Endofturncards.js';
import { ageOfExpansionDeck } from '../assets/Cards/AgeOfExpansionCards.js';
import { ageOfLegacyDeck } from '../assets/Cards/AgeOfLegacyCards.js';
import { ageOfReckoningDeck } from '../assets/Cards/AgeOfReckoningCards.js';
import { ageOfResistanceDeck } from '../assets/Cards/AgeOfResistanceCards.js';

// Import UI functions needed
import { showMessage, updatePlayerInfo, updateResourcePanel } from './ui.js';
import { state } from './state.js';
import { TIMING, clearDeckHighlights } from './animations.js';

// Import game state functions
import { getCurrentPlayer } from './game.js';

import { fullDeckRegionPathMap } from './board-data.js';

// Combine path Card decks into one structure for easier access by color
const CARD_DATA = {
    ageOfExpansionDeck: Array.isArray(ageOfExpansionDeck) ? ageOfExpansionDeck : [],
    ageOfResistanceDeck: Array.isArray(ageOfResistanceDeck) ? ageOfResistanceDeck : [],
    ageOfReckoningDeck: Array.isArray(ageOfReckoningDeck) ? ageOfReckoningDeck : [],
    ageOfLegacyDeck: Array.isArray(ageOfLegacyDeck) ? ageOfLegacyDeck : [],
    endOfTurnDeck: Array.isArray(endOfTurnDeck) ? endOfTurnDeck : []
};

// Define deck types using fullDeckRegionPathMap
export const deckType = {
    ageOfExpansionDeck: fullDeckRegionPathMap.ageOfExpansion.deckType,
    ageOfResistanceDeck: fullDeckRegionPathMap.ageOfResistance.deckType,
    ageOfReckoningDeck: fullDeckRegionPathMap.ageOfReckoning.deckType,
    ageOfLegacyDeck: fullDeckRegionPathMap.ageOfLegacy.deckType,
    endOfTurnDeck: 'endOfTurnDeck'
};

// Map deck types to their display names and colors using fullDeckRegionPathMap
export const deckInfo = {
    [deckType.ageOfExpansionDeck]: { 
        name: fullDeckRegionPathMap.ageOfExpansion.name + ' Deck',
        color: fullDeckRegionPathMap.ageOfExpansion.cssClass.replace('path-', ''),
        displayName: fullDeckRegionPathMap.ageOfExpansion.name
    },
    [deckType.ageOfResistanceDeck]: { 
        name: fullDeckRegionPathMap.ageOfResistance.name + ' Deck',
        color: fullDeckRegionPathMap.ageOfResistance.cssClass.replace('path-', ''),
        displayName: fullDeckRegionPathMap.ageOfResistance.name
    },
    [deckType.ageOfReckoningDeck]: { 
        name: fullDeckRegionPathMap.ageOfReckoning.name + ' Deck',
        color: fullDeckRegionPathMap.ageOfReckoning.cssClass.replace('path-', ''),
        displayName: fullDeckRegionPathMap.ageOfReckoning.name
    },
    [deckType.ageOfLegacyDeck]: { 
        name: fullDeckRegionPathMap.ageOfLegacy.name + ' Deck',
        color: fullDeckRegionPathMap.ageOfLegacy.cssClass.replace('path-', ''),
        displayName: fullDeckRegionPathMap.ageOfLegacy.name
    },
    [deckType.endOfTurnDeck]: {
        name: 'End of Turn Deck',
        color: 'yellow',
        displayName: 'End of Turn'
    }
};

export const deckIdMap = {
    // End of Turn deck - matches the HTML element ID 'end-Of-Turn'
    'endofturndeck': ['endOfTurnDeck'],
    'endofturnDeck': ['endOfTurnDeck'],
    'endOfTurnDeck': ['endOfTurnDeck'],
    'end-Of-Turn-Deck': ['endOfTurnDeck'],
    'end-of-turn-deck': ['endOfTurnDeck'],
    
    // Age paths using fullDeckRegionPathMap
    'purplepath': [fullDeckRegionPathMap.ageOfExpansion.pathKey],
    'bluepath': [fullDeckRegionPathMap.ageOfResistance.pathKey],
    'cyanpath': [fullDeckRegionPathMap.ageOfReckoning.pathKey],
    'pinkpath': [fullDeckRegionPathMap.ageOfLegacy.pathKey]
};

// Check the actual export names and fix if necessary
console.log("Loaded Cards:", Object.keys(CARD_DATA));

// Card State Management
let cardState = {
    decks: {
        [deckType.ageOfExpansionDeck]: [],
        [deckType.ageOfResistanceDeck]: [],
        [deckType.ageOfReckoningDeck]: [],
        [deckType.ageOfLegacyDeck]: [],
        [deckType.endOfTurnDeck]: []
    },
    discardPiles: {
        [deckType.ageOfExpansionDeck]: [],
        [deckType.ageOfResistanceDeck]: [],
        [deckType.ageOfReckoningDeck]: [],
        [deckType.ageOfLegacyDeck]: [],
        [deckType.endOfTurnDeck]: []
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
        // Load and shuffle Age of Expansion (Purple)
        if (Array.isArray(ageOfExpansionDeck) && ageOfExpansionDeck.length > 0) {
            cardState.decks[deckType.ageOfExpansionDeck] = [...ageOfExpansionDeck];
            cardState.discardPiles[deckType.ageOfExpansionDeck] = [];
            shuffleDeck(deckType.ageOfExpansionDeck);
            console.log(`Deck ${deckType.ageOfExpansionDeck} loaded with ${cardState.decks[deckType.ageOfExpansionDeck].length} cards.`);
        } else {
            console.error(`Failed to load Age of Expansion cards.ageOfExpansionDeck=${ageOfExpansionDeck ? 'exists' : 'undefined'}`);
            return false;
        }

        // Load and shuffle Age of Resistance (Blue)
        if (Array.isArray(ageOfResistanceDeck) && ageOfResistanceDeck.length > 0) {
            cardState.decks[deckType.ageOfResistanceDeck] = [...ageOfResistanceDeck];
            cardState.discardPiles[deckType.ageOfResistanceDeck] = [];
            shuffleDeck(deckType.ageOfResistanceDeck);
            console.log(`Deck ${deckType.ageOfResistanceDeck} loaded with ${cardState.decks[deckType.ageOfResistanceDeck].length} cards.`);
        } else {
            console.log(`Failed to load Age of Resistance (ageOfResistanceDeck) cards. Data is missing, empty, or not an array.`);
            return false;
        }

        // Load and shuffle Age of Reckoning (Cyan)
        if (Array.isArray(ageOfReckoningDeck) && ageOfReckoningDeck.length > 0) {
            cardState.decks[deckType.ageOfReckoningDeck] = [...ageOfReckoningDeck];
            cardState.discardPiles[deckType.ageOfReckoningDeck] = [];
            shuffleDeck(deckType.ageOfReckoningDeck);
            console.log(`Deck ${deckType.ageOfReckoningDeck} loaded with ${cardState.decks[deckType.ageOfReckoningDeck].length} cards.`);
        } else {
            console.log(`Failed to load Age of Reckoning (ageOfReckoningDeck) cards. Data is missing, empty, or not an array.`);
            return false;
        }

        // Load and shuffle Age of Legacy (Pink)
        if (Array.isArray(ageOfLegacyDeck) && ageOfLegacyDeck.length > 0) {
            cardState.decks[deckType.ageOfLegacyDeck] = [...ageOfLegacyDeck];
            cardState.discardPiles[deckType.ageOfLegacyDeck] = [];
            shuffleDeck(deckType.ageOfLegacyDeck);
            console.log(`Deck ${deckType.ageOfLegacyDeck} loaded with ${cardState.decks[deckType.ageOfLegacyDeck].length} cards.`);
        } else {
            console.log(`Failed to load Age of Legacy (ageOfLegacyDeck) cards. Data is missing, empty, or not an array.`);
            return false;
        }

        // Load and shuffle End of Turn cards
        if (Array.isArray(endOfTurnDeck) && endOfTurnDeck.length > 0) {
            cardState.decks[deckType.endOfTurnDeck] = [...endOfTurnDeck];
            cardState.discardPiles[deckType.endOfTurnDeck] = [];
            shuffleDeck(deckType.endOfTurnDeck);
            console.log(`End of Turn deck loaded with ${cardState.decks[deckType.endOfTurnDeck].length} cards.`);
        } else {
            console.log("Failed to load End of Turn (endOfTurnDeck) cards. Data is missing, empty, or not an array.");
            return false;
        }

        cardState.initialized = true;
        console.log("All card decks have been set up successfully.");
        return true;
    } catch (error) {
        console.error("An unexpected error occurred during deck setup:", error);
        cardState.initialized = false;
        return false;
    }
};

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
};

/**
 * Animates a card being drawn with proper timing for CPU vs Human
 * @param {string} deckType - The type of deck to animate from
 * @returns {Promise} Resolves when animation and card display completes
 */
export function drawCard(deckType, player) {
    console.log('---------drawCard---------');
    const ctx = state.board.ctx;
    if (!ctx) {
        console.warn('No canvas context available for animation');
        return Promise.resolve(); // fail-safe fallback
    }

    // Get deck region configuration
    const deckConfig = Object.values(fullDeckRegionPathMap).find(r => r.deckType === deckType);
    if (!deckConfig) {
        console.warn(`No deck configuration found for type: ${deckType}`);
        return Promise.resolve(); // fail-safe fallback
    }

    // Pick a position (random for endOfTurnDeck)
    const positions = deckConfig.positions;
    const position = (deckType === 'endOfTurnDeck')
        ? positions[Math.floor(Math.random() * positions.length)]
        : positions[0];

    // Get coordinates
    const { topleft, toplefty, bottomrightx, bottomright } = position;
    const cardX = topleft;
    const cardY = toplefty;
    const cardWidth = bottomrightx - topleft;
    const cardHeight = bottomright - toplefty;

    // Animation logic
    return new Promise((resolve) => {
        let startTime = null;

        function animate(currentTime) {
            if (!startTime) startTime = currentTime;
            const elapsed = currentTime - startTime;

            ctx.clearRect(cardX, cardY, cardWidth, cardHeight);

            if (elapsed < TIMING.CARD_DRAW) {
                const progress = elapsed / TIMING.CARD_DRAW;
                const scale = 1 + (0.2 * Math.sin(progress * Math.PI));
                const scaledWidth = cardWidth * scale;
                const scaledHeight = cardHeight * scale;
                const offsetX = (scaledWidth - cardWidth) / 2;
                const offsetY = (scaledHeight - cardHeight) / 2;

                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.fillRect(
                    cardX - offsetX,
                    cardY - offsetY,
                    scaledWidth,
                    scaledHeight
                );

                requestAnimationFrame(animate);
            } else {
                resolve();
            }
        }

        requestAnimationFrame(animate);
    }).then(() => {
        // Draw the actual card from the deck
        if (!cardState.initialized || !cardState.decks[deckType]) {
            console.log(`Cannot draw card: Deck type ${deckType} not initialized or invalid.`);
            return;
        }

        let deck = cardState.decks[deckType];
        let discardPile = cardState.discardPiles[deckType];

        if (deck.length === 0) {
            console.log(`${deckType} deck empty. Reshuffling discard pile...`);
            if (discardPile.length === 0) {
                console.warn(`Cannot draw card: ${deckType} deck and discard pile are both empty.`);
                return;
            }
            // Move discard pile to deck and shuffle
            cardState.decks[deckType] = [...discardPile];
            cardState.discardPiles[deckType] = [];
            shuffleDeck(deckType);
            deck = cardState.decks[deckType]; // Update reference
        }

        const drawnCard = deck.pop(); // Draw from the end (top) of the deck
        
        if (!drawnCard) {
            console.log(`Popped an undefined card from ${deckType}. Deck state:`, deck);
            return;
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

        if (drawnCard && typeof showCard === 'function') {
            showCard(drawnCard, deckType, player);
        } else {
            console.warn('showCard function not defined or no card drawn');
        }
    });
};

/**
 * Adds a card to the appropriate discard pile.
 */
export function discardCard(card, deckType) {
    if (!cardState.initialized || !cardState.discardPiles[deckType]) {
        console.log(`Cannot discard card: Deck type ${deckType} not initialized or invalid.`);
        return;
    }
    if (!card) {
         console.warn(`Attempted to discard an invalid card object to ${deckType}.`);
         return;
    }
    
    cardState.discardPiles[deckType].push(card);
    // console.log(`Card ${card.name} discarded to ${deckType}. Pile size: ${cardState.discardPiles[deckType].length}`);
};

/**
 * Applies the effects listed on a card to the target player(s).
 */
export async function applyCardEffect(card, player) {
    console.log('---------applyCardEffect---------');
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
        
        // Find effects for the player's role (convert to PascalCase to match card data)
        const pascalCaseRole = player.role.charAt(0).toUpperCase() + player.role.slice(1).toLowerCase();
        const roleEffects = card.effects[pascalCaseRole];
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
            console.error(`No specific effects defined for ${player.role} role.`);
            
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
        
        // Call processEndPlayerTurn after applying effects
        processEndPlayerTurn();
        return;
    }
    
    // Case 2: Effects as an array (original format)
    if (Array.isArray(card.effects)) {
        card.effects.forEach(effect => processEffect(effect, player, player));
        
        // Call processEndPlayerTurn after applying effects
        processEndPlayerTurn();
        return;
    }
    
    // If we get here, the effects property has an unexpected format
    console.log(`Card "${card.name}" effects has an unexpected format:`, card.effects);
    
    // Call processEndPlayerTurn even if effects format is unexpected
    processEndPlayerTurn();
};

/**
 * Process a single effect, handling immunity and applying the correct effect type
 * @param {object} effect - The effect object from the card.
 * @param {object} player - The target player of the effect.
 * @param {object} sourcePlayer - The player who initiated the effect (drew the card).
 */
function processEffect(effect, player, sourcePlayer) {
    console.log('---------processEffect---------');
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
             break;           // Source player sabotages the target player
        case 'SKIP_TURN':
             // applySkipTurn determines target internally based on effect.target
             applySkipTurn(effect, sourcePlayer);
             break;
        case 'CHANGE_PATH':
             // Source player initiates alliance with a target determined in applyAllianceOffer
             applyAllianceOffer(effect, sourcePlayer);
             break;
        case 'DRAW_CARD':
            // Source player draws a card
            applyDrawCard(effect, sourcePlayer);
            break;
        case 'STEAL_FROM_ALL':
             // Source player steals from all others
             applyStealFromAll(effect, sourcePlayer);
             break;
        default:
            console.warn(`Unknown card effect type: ${effect.type}`);
    }
};

// ===== Effect Processing Functions =======

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
};

function applyResourceChange(effect, player) {
    console.log('---------applyResourceChange---------');
    console.log(` Applying RESOURCE_CHANGE to ${player.name}:`, effect.changes);
    // effect.changes should be an object like { knowledge: 10, money: -5 }
    updatePlayerResources(effect, player);
    updateResourcePanel(player); 
};

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
};

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
        updatePlayerInfo(sourcePlayer, { [resourceToSteal]: actualAmountStolen }); 
        updatePlayerInfo(targetPlayer, { [resourceToSteal]: -actualAmountStolen }); 
    } else {
         console.log(` ${targetPlayer.name} has no ${resourceToSteal} to steal.`);
    }
};

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
};

/**
 * Applies DRAW_CARD effect. The source player draws a card.
 * @param {object} effect - The draw card effect details.
 * @param {object} sourcePlayer - The player drawing the card.
 */
function applyDrawCard(effect, sourcePlayer) {
    console.log('---------applyDrawCard---------');
    console.log(` Applying DRAW_CARD effect to ${sourcePlayer.name}:`, effect);
    const deckToDraw = effect.deckType;
    if (!deckToDraw) {
        console.log("DRAW_CARD effect missing deckType property.");
        return;
    }

    // Draw the new card
    const newCard = drawCard(deckToDraw, sourcePlayer);

    if (newCard) {
        console.log(` Card effect caused ${sourcePlayer.name} to draw: ${newCard.name} from ${deckToDraw}`);
        showMessage(`${sourcePlayer.name} drew a card: ${newCard.name}`); // Changed from showCard to showMessage
        applyCardEffect(newCard, sourcePlayer); 
    } else {
        console.warn(` DRAW_CARD effect failed: Could not draw card from ${deckToDraw} deck.`);
    }
};

// Helper function to format resource changes
function formatResourceChanges(changes) {
    if (!changes) return '';
    
    const changesList = [];
    if (changes.money !== undefined) {
        changesList.push(`${changes.money >= 0 ? '+' : ''}${changes.money} Money`);
    }
    if (changes.knowledge !== undefined) {
        changesList.push(`${changes.knowledge >= 0 ? '+' : ''}${changes.knowledge} Knowledge`);
    }
    if (changes.influence !== undefined) {
        changesList.push(`${changes.influence >= 0 ? '+' : ''}${changes.influence} Influence`);
    }
    return changesList.join(', ');
};

// Helper function to format a single effect
function formatEffect(effect) {
    if (!effect) return '';
    
    // Handle different effect types
    switch(effect.type) {
        case 'RESOURCE_CHANGE':
        case 'RESOURCE':
            const changes = effect.changes ? formatResourceChanges(effect.changes) : '';
            return `${effect.description || 'Resource change'}: ${changes}`;
            
        case 'MOVEMENT':
        case 'MOVE':
            const spaces = effect.spaces || 'some';
            const direction = effect.direction ? ` ${effect.direction}` : '';
            const target = effect.target && effect.target !== 'SELF' ? ` (${effect.target})` : '';
            return `Move${direction} ${spaces} spaces${target}`;
            
        case 'STEAL':
            const amount = effect.amount || 'some';
            const resource = effect.resource || 'resources';
            const from = effect.target ? ` from ${effect.target}` : '';
            return `Steal ${amount} ${resource}${from}`;
            
        case 'SKIP_TURN':
            return `Skip ${effect.target || 'your'} next turn`;
            
        case 'DRAW_CARD':
            const count = effect.count || 1;
            return `Draw ${count} card${count !== 1 ? 's' : ''}`;
            
        case 'CHANGE_PATH':
        case 'PATH_CHANGE':
            return `Change path to ${effect.path || 'a new path'}`;
            
        default:
            // If we have a description, use that
            if (effect.description) return effect.description;
            // If we have an effect property, use that
            if (effect.effect) return effect.effect;
            // As a last resort, show the raw effect
            return JSON.stringify(effect);
    }
};

export async function showCard(card, deckType, player, onComplete) {
    console.log('---------showCard---------');
    console.log("Showing card:", card, "Deck:", deckType, "Player:", player);

    const deckMeta = deckInfo[deckType];
    const isAI = player && !player.isHuman;
    const isEndOfTurnCard = deckType === 'endOfTurnDeck' || 
        (card.type && card.type.includes('endOfTurn')) ||
        (card.deck && card.deck.includes('endOfTurn'));
    const isAgeDeck = /^age-Of/i.test(deckType);

    // Hide all popovers
    document.querySelectorAll('.popover-Content').forEach(popover => popover.style.display = 'none');

    const dialog = document.querySelector(`[data-deck-id="${deckType}"]`)?.closest('dialog');
    if (!dialog) {
        console.error("Deck popover element not found for deck:", deckType);
        return;
    }

    const popoverContent = dialog.querySelector(`[data-deck-id="${deckType}"]`);
    if (popoverContent) {
        popoverContent.style.display = 'block';
    }
    dialog.className = 'popover';
    if (deckMeta?.color) dialog.classList.add(`card-${deckType}`);
    else if (card?.color) dialog.classList.add(`card-${card.color}`);

    const titleEl = dialog.querySelector('#card-Title');
    const descEl = dialog.querySelector('#card-Description');
    const effectsEl = dialog.querySelector('#card-Effects');
    const showDetailsButton = dialog.querySelector('#show-Card-Details-Button');
    const closeCardButton = dialog.querySelector('#close-Card-Button');
    const closeAgeCardButton = dialog.querySelector('.close-Age-Card-Button');

    if (!titleEl || !descEl || !effectsEl || !showDetailsButton || (!closeCardButton && !closeAgeCardButton)) {
        console.error("Required elements missing in popover dialog");
        return;
    }

    titleEl.textContent = card.name || 'Card';

    // Format resource summary preview
    let resourceSummary = '';
    if (Array.isArray(card.effects)) {
        card.effects.forEach(effect => {
            if (effect.type === 'RESOURCE_CHANGE' && effect.changes) {
                const formatted = formatResourceChanges(effect.changes);
                if (formatted) {
                    let target = effect.target === 'OTHER' ? ' (Target: Other)' :
                                 (effect.target && effect.target !== 'SELF' ? ` (Target: ${effect.target})` : '');
                    resourceSummary += `<p><span class="effect-icon">💰</span> <strong>Effect${target}:</strong> ${formatted}</p>`;
                }
            } else if (effect.type === 'MOVEMENT') {
                resourceSummary += `<p><span class="effect-icon">🚶</span> <strong>Effect:</strong> Move ${effect.spaces}</p>`;
            } else if (effect.type === 'SKIP_TURN') {
                resourceSummary += `<p><span class="effect-icon">⏭️</span> <strong>Effect:</strong> Skip Turn</p>`;
            } else if (effect.type === 'STEAL') {
                resourceSummary += `<p><span class="effect-icon">🔄</span> <strong>Effect:</strong> Steal ${effect.amount} ${effect.resource}</p>`;
            } else if (effect.type === 'ALLIANCE_OFFER') {
                resourceSummary += `<p><span class="effect-icon">🤝</span> <strong>Effect:</strong> Alliance Offer</p>`;
            }
        });
    } else if (typeof card.effects === 'object' && isEndOfTurnCard) {
        resourceSummary += `<p><span class="effect-icon">💡</span><i>(Effects vary by role - click below for details)</i></p>`;
    }

    descEl.innerHTML = `<div class="card-description">${card.description || ''}</div>
                        <div class="card-effects-summary">${resourceSummary}</div>`;

    effectsEl.innerHTML = '';
    effectsEl.style.display = 'none';

    showDetailsButton.style.display = isAgeDeck ? 'none' : 'block';
    showDetailsButton.disabled = false;

    showDetailsButton.onclick = () => {
        let explanationHTML = '';

        if (isEndOfTurnCard && player?.role) {
            const allRoles = ['Colonialist', 'Revolutionary', 'Historian', 'Entrepreneur', 'Politician', 'Artist'];
            explanationHTML += "<div class='role-effects-container'><h3>Effects for All Roles:</h3><ul class='role-effects-list'>";
            allRoles.forEach(role => {
                const roleEffect = card.effects[role];
                if (roleEffect) {
                    const changes = roleEffect.changes || {};
                    const changeText = [
                        changes.money !== undefined ? `${changes.money >= 0 ? '+' : ''}${changes.money} Money` : '',
                        changes.knowledge !== undefined ? `${changes.knowledge >= 0 ? '+' : ''}${changes.knowledge} Knowledge` : '',
                        changes.influence !== undefined ? `${changes.influence >= 0 ? '+' : ''}${changes.influence} Influence` : ''
                    ].filter(Boolean).join(', ');

                    const fullText = `<span class='role-name'>${role}:</span> <span class='resource-changes'>[${changeText}]</span> <span class='effect-explanation'>${roleEffect.explanation || ''}</span>`;
                    const currentClass = role === player.role ? 'current-role' : '';
                    explanationHTML += `<li class="role-effect ${currentClass}">${fullText}</li>`;
                } else {
                    explanationHTML += `<li class='role-effect'><span class='role-name'>${role}:</span> No effect defined.</li>`;
                }
            });
            explanationHTML += "</ul></div>";
        } else if (Array.isArray(card.effects)) {
            explanationHTML += '<p><strong>Card Effects:</strong></p><ul>';
            card.effects.forEach(effect => {
                const formatted = formatEffect(effect);
                explanationHTML += `<li>${formatted}</li>`;
            });
            explanationHTML += '</ul>';
        }

        effectsEl.innerHTML = explanationHTML;
        effectsEl.style.display = 'block';
        showDetailsButton.style.display = 'none';
    };

    // Store the original card data in the dialog for event listeners to access
    dialog.dataset.cardData = JSON.stringify(card);
    
    dialog.showModal();

    if (isAI) {
        setTimeout(() => {
            if (dialog.open) {
                dialog.close();
                if (typeof onComplete === 'function') onComplete();
                if (isEndOfTurnCard) {
                    applyCardEffect(card, player);
                } else if (isAgeDeck) {
                    applyAgeCardEffect(card.effects, player, player);
                }
            }
        }, 9000);
    }

    function formatResourceChanges(changes) {
        const result = [];
        if (changes.money !== undefined) result.push(`${changes.money >= 0 ? '+' : ''}${changes.money}💰`);
        if (changes.knowledge !== undefined) result.push(`${changes.knowledge >= 0 ? '+' : ''}${changes.knowledge}📚`);
        if (changes.influence !== undefined) result.push(`${changes.influence >= 0 ? '+' : ''}${changes.influence}🎭`);
        return result.join(', ');
    }

    function formatEffect(effect) {
        if (effect.type === 'RESOURCE_CHANGE' && effect.changes) {
            return formatResourceChanges(effect.changes);
        }
        if (effect.type === 'MOVEMENT') {
            return `Move ${effect.spaces} spaces.`;
        }
        if (effect.type === 'SKIP_TURN') {
            return 'Skip your turn.';
        }
        if (effect.type === 'STEAL') {
            return `Steal ${effect.amount} ${effect.resource}`;
        }
        if (effect.type === 'ALLIANCE_OFFER') {
            return 'Offer an alliance.';
        }
        return '(Unknown effect)';
    }
};

// Hide card popover
export function hideCard() {
    console.log('---------hideCard---------');
    const { ui } = state;
    const popoverContainer = ui.elements.cardPopoverContainer;
    const popover = ui.elements.popover;
    const effectsEl = ui.elements.cardEffects;
    const showDetailsButton = ui.elements.showCardDetailsButton;

    if (!popover) return;
    console.log("Hiding card popover");
    
    // Add reverse animation
    const cardPopover = popover.querySelector('.card-Popover');
    if (cardPopover) {
        cardPopover.style.animation = 'cardFlip 0.3s reverse';
        // Wait for animation to complete before hiding
        setTimeout(() => {
            popover.style.display = 'none';
            // Reset animation for next time
            cardPopover.style.animation = '';
        }, 5000);
    } else {
        popover.style.display = 'none';
    }
    
    // Reset effects visibility for next time
    if (effectsEl) {
        effectsEl.style.display = 'none';
        effectsEl.innerHTML = '';
    }
    if (showDetailsButton) {
        showDetailsButton.style.display = 'block'; // Or 'inline-block'
    }
    
    // Stop any deck highlighting
    clearDeckHighlights();
};

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
        console.log("Invalid STEAL_FROM_ALL effect definition:", effect);
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
            updatePlayerInfo(targetPlayer);
            totalStolen += actualAmountStolen;
        } else {
            console.log(`    ${targetPlayer.name} has no ${resourceToSteal} to steal.`);
        }
    });

    if (totalStolen > 0) {
        console.log(` ${sourcePlayer.name} gained a total of ${totalStolen} ${resourceToSteal} from all others.`);
        updatePlayerInfo(sourcePlayer);
    } else {
        console.log(` No ${resourceToSteal} was stolen from any player.`);
    }
};

/**
 * Process a single effect, handling immunity and applying the correct effect type
 * @param {object} effect - The effect object from the card.
 * @param {object} player - The target player of the effect.
 * @param {object} sourcePlayer - The player who initiated the effect (drew the card).
 */
export function applyAgeCardEffect(effect, player, sourcePlayer) {
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
            updatePlayerResources(effect, targetPlayer); 
            break;
        case 'MOVEMENT':
            // applyMovement determines target internally based on effect.target
            handleCardMovement(effect, sourcePlayer); 
            break;
        case 'STEAL':
             // Source player steals from the target player
             applySteal(effect, targetPlayer, sourcePlayer);
             break;
        case 'SKIP_TURN':
             // applySkipTurn determines target internally based on effect.target
             applySkipTurn(effect, sourcePlayer);
             break;
        case 'STEAL_FROM_ALL':
             // Source player steals from all others
             applyStealFromAll(effect, sourcePlayer);
             break;
        default:
            console.warn(`Unknown card effect type: ${effect.type}`);
            if (player.isAI) {
                updatePlayerResources(effect, player);
                handleEndTurn();
            } else {
                updatePlayerResources(effect, player);
                handleEndTurn();
            }
            break;
    }
}

export function isEndOfTurnCard(card) {
    console.log('---------isEndOfTurnCard---------');
    return card && (
        (card.type && card.type.includes('endOfTurn')) ||
        (card.deck && card.deck.includes('endOfTurn'))
    );
}

