// Game Module for Critocracy
// Handles core game logic, game flow, and state management

// ===== Imports =====
import { 
    drawBoard,        // New scaling function
    setupBoard,    
    getNextStepOptions,   // Added missing import
    findSpaceDetailsByCoords,
    loadTokenImages,
    drawTokens,
} from './board.js';
import { 
    START_SPACE, 
    FINISH_SPACE, 
    choicepoints,
    ageOfExpansionPath, 
    ageOfResistancePath, 
    ageOfReckoningPath, 
    ageOfLegacyPath,
    getPathOptionsFromStart,
    fullDeckRegionPathMap,
    PATH_COLORS,
    SPACE_TYPE
} from './board-data.js';
import { 
    setupDecks, 
    drawCard, 
    applyCardEffect,
    showCard,
    hideCard
} from './cards.js';
import { 
    createPlayer, 
    allPlayersFinished,
    markPlayerFinished, 
    getPlayerRanking,
    getPlayers, 
    resetPlayers,
    setPlayerSkipTurn,
    updatePlayerResources
} from './players.js';
// UI imports
import {  
    promptForPathChoice, 
    updateGameControls,
    updatePlayerInfo,
    handleCanvasCardClick
} from './ui.js';
import {
    animateDiceRoll,
    animateTokenToPosition,
    highlightDeckRegions,
    ensurePlayerPath
} from './animations.js';

import { state, updateGameState, updateUIState } from './state.js';

// Game logic imports-

// ===== Game Functions =====

/**
 * Initializes the core game modules (Board, Cards, Players).
 */
export function startGame(playerConfigs, turnOrder) {
    console.log('[Game] startGame called with:', { playerConfigs, turnOrder });
    if (!playerConfigs || !turnOrder || playerConfigs.length === 0 || turnOrder.length === 0) {
        console.error('[Game] startGame called with invalid arguments.');
        return;
    }

    // Reset and create players
    resetPlayers();
    const playerMap = new Map();
    playerConfigs.forEach(config => {
        const player = createPlayer(config);
        if (player) {
            playerMap.set(player.id, player);
        }
    });

// Define fixed start coordinates at the top of your file (once)
const START_COORDS = { x: 104, y: 512 };

// Set game state
    updateGameState({
        players: turnOrder.map(id => playerMap.get(id)),
        turnOrder: turnOrder,
        totalPlayerCount: turnOrder.length,
        humanPlayerCount: turnOrder.filter(id => playerMap.get(id).isHuman).length,
        currentPlayerIndex: -1,
        started: true,
        currentPhase: 'PLAYING'
    });

    // Update player coordinates
    updateGameState({
        players: state.players.map(p => ({
            ...p,
            currentCoords: { ...START_COORDS }
        }))
    });

    console.log('[Game] Game state initialized:', {
        players: state.players.map(p => p.name),
        turnOrder: state.turnOrder,
    });

    // Draw the board with initial token positions
    drawBoard();
    drawTokens();

    // Start the first turn
    console.log('[Game] Advancing to the first player.');
    advanceToNextPlayer();
};

export async function initGame() {
    try {
        console.log("-------Initializing game-------");

        // 1. Reset all players and core game state
        resetPlayers();

        // 2. Load board visuals, game spaces, tokens, and cards
        await setupBoard();
        await setupDecks();
        await loadTokenImages();

        // 3. Add min/max bounds to each choicepoint for hitbox detection
        if (Array.isArray(choicepoints)) {
            for (let i = 0; i < choicepoints.length; i++) {
                const cp = choicepoints[i];

                if (!cp.coords || typeof cp.coords !== 'object') {
                    console.warn(`[Choicepoint ${cp?.id || i}] is missing or invalid coords`);
                    continue;
                }

                // Extract coordinates from the new object format
                const coords = cp.coords;
                const xs = [coords.topleft, coords.toprightx, coords.bottomrightx, coords.bottomleftx];
                const ys = [coords.toplefty, coords.topright, coords.bottomright, coords.bottomleft];

                cp.minX = Math.min(...xs);
                cp.maxX = Math.max(...xs);
                cp.minY = Math.min(...ys);
                cp.maxY = Math.max(...ys);
            }
        }

        // 4. Make choicepoints globally accessible
        window.choicepoints = choicepoints;

        // 5. Initialize game state from scratch
        updateGameState({
            started: false,
            ended: false,
            currentPhase: 'SETUP',
            players: [],
            totalPlayerCount: 0,
            humanPlayerCount: 0,
            currentPlayerIndex: -1,
            turnOrder: [],
            pendingActionData: null,
            pathChoiceLock: false,
            lastRoll: 0
        });

        console.log("-------Game initialization complete-------");
        return true;

    } catch (error) {
        console.error('❌ Error initializing game:', error);
        return false;
    }
};

/**
 * Gets the player object whose turn it currently is.
 */
export function getCurrentPlayer() {
    if (state.currentPlayerIndex < 0 || state.currentPlayerIndex >= state.players.length) {
        console.error("Invalid currentPlayerIndex:", state.currentPlayerIndex);
        return null;
    }
    return state.players[state.currentPlayerIndex];
};

export const rollResult = state.rollResult;

export async function handlePlayerAction() {
    console.log('-----------handlePlayerAction-----------')
    if (state.currentPhase !== 'PLAYING') {
        console.warn("handlePlayerAction called in phase:", state.currentPhase);
        return;
    }

    const player = getCurrentPlayer();
    if (!player) {
        console.error("handlePlayerAction: Could not get current player.");
        return;
    }

    // 0. Check if player turn should be skipped
    if (player.skipTurns > 0) {
        console.log(`Player ${player.name} skips turn (${player.skipTurns} remaining).`);
        player.skipTurns--;
        updatePlayerInfo();
        await handleEndTurn(true);
        return;
    }

    updateGameControls();

    // Add a small delay after dice roll for better visibility (optional)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Get the roll result from state
    const rollResult = state.rollResult;
    console.log(`Player ${player.name} rolling stored value: ${rollResult}`);

    // Handle start space case
    const startX = START_SPACE.coordinates[0];
    const startY = START_SPACE.coordinates[1];

    console.log(`Checking start space - Player: (${player.currentCoords.x},${player.currentCoords.y}), Start: (${startX},${startY})`);

    if (player.currentCoords.x === startX && player.currentCoords.y === startY) {
        console.log(`Player ${player.name} is at Start. Needs to choose a path.`);
        updateGameState({
            currentPhase: 'AWAITING_PATH_CHOICE',
            pendingActionData: { rollResult }
        });
        console.warn('GAMEPHASE UPDATED TO AWAITING_PATH_CHOICE');

        const pathObjects = {
            ageOfExpansion: { name: 'Age of Expansion', color: 'Purple' },
            ageOfResistance: { name: 'Age of Resistance', color: 'Blue' },
            ageOfReckoning: { name: 'Age of Reckoning', color: 'Cyan' },
            ageOfLegacy: { name: 'Age of Legacy', color: 'Pink' }
        };

        const options = Object.entries(START_SPACE.nextCoordOptions).map(([pathKey, coordsArray]) => ({
            text: pathObjects[pathKey]?.name || pathKey,
            coords: { x: coordsArray[0], y: coordsArray[1] },
            color: pathObjects[pathKey]?.color || 'White',
            pathName: pathKey + 'Path' // Add 'Path' suffix to match the pathKey in board data
        }));

        if (player.isHuman) {
            console.log("Prompting human for start path choice with options:", options);
            promptForPathChoice(options, player);
        } else {
            promptForPathChoice(options, player);
        }
        return; // Wait for choice
    }

    // Handle movement for non-start spaces
    console.log(`Player ${player.name} is moving ${rollResult} spaces`);

    try {
        // --- FIXED: Single call to animateTokenToPosition, not loop ---
        await animateTokenToPosition(player, null, 1000, false, null);
        // animateTokenToPosition handles internal steps and remainingSteps decrement
    } catch (error) {
        console.error('Error during movement:', error);
        handleEndTurn();
    }
};

export function handlePathChoice(chosenCoords, chosenPath) {
    console.log('--------- handlePathChoice ---------');
  
    const player = getCurrentPlayer();
    if (!player) {
      console.error("handlePathChoice: No current player found.");
      return;
    }
  
    // Store the player's decision
    player.currentCoords = chosenCoords;
    player.currentPath = chosenPath;
  
    // Read and clear the interrupted move data
    const {
      remainingSteps = 0,
      duration = 1000,
      skipSpaceAction = false,
      onComplete = null
    } = state.interruptedMove || {};
  
    delete state.interruptedMove;
  
    // Resume movement from new path/coords
    animateTokenToPosition(player, null, duration, skipSpaceAction, onComplete);
};  

/**
 * Handles the logic after a player's token finishes its movement.
 * Identifies the space type and path, then highlights the associated deck.
 * @param {object} completionData - { reason, stepsTaken }
 */
export async function handleEndOfMove(completionData = { reason: 'unknown', stepsTaken: 0 }) {
    console.log('---------handleEndOfMove---------');
    const { reason, stepsTaken } = completionData;
    const player = getCurrentPlayer();

    console.log(`Player ${player.name} completed movement to coords:`, player.currentCoords);

    const spaceDetails = findSpaceDetailsByCoords(player.currentCoords);

    if (!spaceDetails) {
        console.error(`Could not find space details at:`, player.currentCoords);
        console.warn("Resetting player to START_SPACE due to invalid position.");

        if (START_SPACE && START_SPACE.coordinates?.[0]) {
            player.currentCoords = { x: START_SPACE.coordinates[0][0], y: START_SPACE.coordinates[0][1] };
            console.log(`Player position reset to START_SPACE at (${player.currentCoords.x}, ${player.currentCoords.y})`);
            drawBoard(); // Refresh visuals
        } else {
            console.error("START_SPACE is invalid or malformed.");
        }

        return;
    }

    console.log(`Found space:`, spaceDetails);

    // Determine path the player is on
    let pathKey = spaceDetails.pathName?.replace('Path', '') || null;
    const pathColor = spaceDetails.pathColor || 'default';
    const SPACE_TYPE = spaceDetails.Type || 'Regular';

    // Map path names to the correct keys in fullDeckRegionPathMap
    const pathNameMap = {
        'ageOfExpansion': 'ageOfExpansion',
        'ageOfResistance': 'ageOfResistance',
        'ageOfReckoning': 'ageOfReckoning',
        'ageOfLegacy': 'ageOfLegacy'
    };

    // Get the correct path key if it exists in our mapping
    const mappedPathKey = pathKey ? pathNameMap[pathKey] : null;

    console.log(`Space type: ${SPACE_TYPE}, Path: ${pathKey}, Mapped Path: ${mappedPathKey}, Color: ${pathColor}`);

    // Only highlight deck regions if this is a Draw space
    if (SPACE_TYPE === 'Draw') {
        // Determine deck to highlight based on path for Draw spaces
        let deckType = 'endOfTurnDeck';
        
        if (mappedPathKey && fullDeckRegionPathMap[mappedPathKey]?.deckType) {
            deckType = fullDeckRegionPathMap[mappedPathKey].deckType;
            console.log(`Found deck type: ${deckType} for path ${mappedPathKey}`);
        } else {
            console.warn(`No specific deckType found for path '${pathKey}'. Using 'endOfTurnDeck'.`);
        }

        // Get positions from fullDeckRegionPathMap
        let positions = [];
        if (mappedPathKey && fullDeckRegionPathMap[mappedPathKey]?.positions) {
            positions = fullDeckRegionPathMap[mappedPathKey].positions;
        } else if (deckType === 'endOfTurnDeck' && fullDeckRegionPathMap.endOfTurn?.positions) {
            positions = fullDeckRegionPathMap.endOfTurn.positions;
        }
        
        console.log(`Draw space → highlighting deck region for path ${mappedPathKey} using deckType ${deckType}`);
        highlightDeckRegions(player, deckType, positions);
    } else if (SPACE_TYPE === 'Regular') {
        // For Regular spaces, only highlight end-of-turn regions
        const deckType = 'endOfTurnDeck';
        const positions = fullDeckRegionPathMap.endOfTurn?.positions || [];
        
        console.log(`Regular space → highlighting end-of-turn regions`);
        highlightDeckRegions(player, deckType, positions);
    } else {
        console.log(`Space type ${SPACE_TYPE} - no deck highlighting needed`);
    }
};

/**
 * Handle the action a player takes after landing on a space.
 * Delegates logic based on spaceType and pathName.
 *
 * @param {object} player - The player who landed
 * @param {string} spaceType - The type of the space ('Draw', 'Regular', etc.)
 * @param {string} pathName - The path name the player is on (e.g., 'Age of Resistance Path')
 */
export function handleSpaceAction(player, spaceType, pathName) {
    console.log('---------handleSpaceAction---------');
    console.log(`Handling space type: ${spaceType}, pathName: ${pathName}, player: ${player.name}`);
  
    // Normalize the pathName to a key (e.g. 'Age of Resistance Path' => 'ageOfResistance')
    const normalizedKey = pathName?.replace(/\s+/g, '').replace('Path', '');
    const pathData = fullDeckRegionPathMap?.[normalizedKey];
  
    if (spaceType === 'Draw') {
      if (!pathData || !pathData.deckType || !pathData.positions) {
        console.error(`Missing deckType or positions for pathName: "${pathName}"`);
        return;
      }
  
      const deckType = pathData.deckType;
      const positions = pathData.positions;
  
      console.log(`Draw space → deckType: ${deckType}, positions:`, positions);
      highlightDeckRegions(player, deckType, positions);
  
    } else if (spaceType === 'Regular') {
      const deckType = 'endOfTurnDeck';
      const positions = fullDeckRegionPathMap.endOfTurn?.positions || [];
  
      console.log(`Regular space → deckType: ${deckType}, positions:`, positions);
      handleEndOfTurn(spaceType, deckType, player, positions);
  
    } else {
      console.log(`Unhandled space type: ${spaceType}`);
    }
};  

/**
 * Triggers end-of-turn card draw for the current player.
 * Does NOT advance to the next player — that’s handled later by processEndPlayerTurn().
 */
export async function handleEndTurn() {
    console.log('---------handleEndTurn---------');
  
    const player = getCurrentPlayer();
    if (!player) {
      console.error('[handleEndTurn] No current player found.');
      return;
    }
  
    console.log(`GAME: Ending turn for Player ${player.name} (${player.role})`);
  
    // Stop any queued animations
    if (window.animationQueue && typeof window.animationQueue.clear === 'function') {
      window.animationQueue.clear();
    }
  
    // Clear any visual highlights
    if (typeof clearHighlights === 'function') {
      clearHighlights();
    }
  
    // Define deckType and positions (⬅️ as variables, like you asked)
    const deckType = 'endOfTurnDeck';
    const positions = [
      {
        topleft: 302, toplefty: 444,
        toprightx: 386, topright: 444,
        bottomrightx: 386, bottomright: 582,
        bottomleftx: 302, bottomleft: 582
      },
      {
        topleft: 1128, toplefty: 458,
        toprightx: 1210, topright: 458,
        bottomrightx: 1210, bottomright: 596,
        bottomleftx: 1128, bottomleft: 596
      }
    ];
  
    // 👇 Call exactly as you demanded
    highlightDeckRegions(player, deckType, positions);
  
    console.log("Prompting player to draw end-of-turn card. Turn will advance after card is drawn.");
};

/**
 * Finalizes the current player's turn.
 * - If human, enables the "End Turn" button with infinite shake animation.
 * - If AI, automatically advances to the next player after 3 seconds.
 */
export async function processEndPlayerTurn() {
    console.log('---------processEndPlayerTurn---------');

    const currentPlayer = getCurrentPlayer();
    if (!currentPlayer) {
        console.error('[processEndPlayerTurn] No current player found.');
        return;
    }

    console.log(`Processing end of turn for ${currentPlayer.name} (${currentPlayer.role})`);

    if (currentPlayer.finished) {
        console.log(`Player ${currentPlayer.name} already marked as finished. Advancing...`);
        await advanceToNextPlayer();
        return;
    }

    if (currentPlayer.isHuman) {
        console.log("Human player — enabling End Turn button with infinite shake animation");
        
        // Enable the End Turn button
        updateUIState({
            showEndTurnButton: true
        });
        
        // Add infinite shake animation to the End Turn button
        const endTurnButton = document.getElementById('end-Turn-Button');
        if (endTurnButton) {
            endTurnButton.style.animation = 'shake 1.5s infinite ease-in-out';
            endTurnButton.disabled = false;
        }
    } else {
        console.log("AI player — waiting 3 seconds before advancing...");
        setTimeout(() => {
            advanceToNextPlayer();
        }, 3000);
    }
};

/**
 * Ends the game and displays the results.
 */
async function triggerGameOver() {
    if (state.ended) return; // Prevent multiple calls

    updateGameState({
        ended: true,
        currentPhase: 'GAME_OVER'
    });

    // Calculate final scores/rankings
    const finalRankings = getPlayerRanking();
    console.log("Final Rankings:", finalRankings);

    // Display end game screen
    showEndGameScreen(finalRankings);
};

// Track if an AI turn is in progress to prevent overlapping turns
state.aiTurnInProgress = state.aiTurnInProgress || false;

/**
 * Handles the complete turn logic for an AI player.
 * @param {object} aiPlayer - The AI player object.
 */
export async function handleAITurn(aiPlayer) {
    console.log(`----------- handleAITurn for ${aiPlayer.name} -----------`);
    
    // Prevent overlapping AI turns
    if (state.aiTurnInProgress) {
        console.warn(`AI turn already in progress. Ignoring duplicate call for ${aiPlayer.name}`);
        return;
    }

    // Validate game state and player turn
    const currentPlayer = getCurrentPlayer();
    if (state.currentPhase !== 'PLAYING' || state.ended || !currentPlayer || currentPlayer.id !== aiPlayer.id) {
        console.warn(`handleAITurn called incorrectly. Phase: ${state.currentPhase}, ` +
                   `Ended: ${state.ended}, Current: ${currentPlayer?.id}, AI: ${aiPlayer.id}`);
        return;
    }

    try {
        // Set flag to prevent overlapping turns
        updateGameState({ aiTurnInProgress: true });

        // Add a small delay to make AI actions more natural and give UI time to update
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check if player still exists and it's still their turn
        const currentPlayerCheck = getCurrentPlayer();
        if (!currentPlayerCheck || currentPlayerCheck.id !== aiPlayer.id) {
            console.warn("Player turn changed during AI processing. Aborting AI turn.");
            return;
        }
        
        console.log(`AI ${aiPlayer.name} starting turn...`);
        
        // AI Decision Making (Simplified for now)
        // 1. Use Special Ability? (Simple logic: use if available and maybe beneficial?)
        //    For now, let's skip complex AI ability usage.
        
        // 2. Roll dice and trigger standard player action
        console.log(`AI ${aiPlayer.name} rolling dice...`);
        
        // For AI players, we need to simulate the dice roll first
        const diceElement = document.getElementById('dice');
        if (diceElement) {
            // Generate a random roll for AI
            const aiRoll = Math.ceil(Math.random() * 6);
            console.log(`AI ${aiPlayer.name} rolled: ${aiRoll}`);
            
            // Set the roll result in state
            updateGameState({ rollResult: aiRoll });
            
            // Animate the dice roll for AI (with shorter delay)
            await animateDiceRoll(diceElement, aiRoll, 1000);
        } else {
            // Fallback if dice element not found
            const aiRoll = Math.ceil(Math.random() * 6);
            updateGameState({ rollResult: aiRoll });
            console.log(`AI ${aiPlayer.name} rolled: ${aiRoll} (no animation)`);
        }
        
        // Handle the player action and wait for it to complete
        await handlePlayerAction();
        
        console.log(`--- Completed handleAITurn for ${aiPlayer.name} ---`);
    } catch (error) {
        console.error(`Error during AI turn for ${aiPlayer.name}:`, error);
        // Ensure we don't get stuck in a bad state
        updateGameState({
            currentPhase: 'PLAYING',
            pendingActionData: null
        });
        
        // Try to advance to next player on error
        try {
            await advanceToNextPlayer();
        } catch (e) {
            console.error('Error recovering from AI turn error:', e);
        }
    } finally {
        // Always clear the flag, even on error
        updateGameState({ aiTurnInProgress: false });
    }
};

/**
 * Returns a copy of the current game state.
 */
export function getGameState() {
    return { ...state, players: [...state.players] };
};
// ===== Card Effect Handling =====

/**
 * Handles movement effects triggered by cards.
 * This function interprets the card effect and calls the appropriate board functions.
 * Exported for use by cards.js
 * @param {object} player - The player object to move.
 * @param {object} effect - The movement effect details from the card.
 */
export function handleCardMovement(player, effect) {
    console.log('---------handleCardMovement---------');
    console.log(`GAME: Handling card movement for ${player.name}:`, effect);

    if (!player) {
        console.error("handleCardMovement: Invalid player object received.");
        return;
    }

    if (effect.spaces) {
        // Handle moving a specific number of spaces (positive or negative)
        const steps = parseInt(effect.spaces, 10);
        if (isNaN(steps)) {
            console.error(`handleCardMovement: Invalid 'spaces' value: ${effect.spaces}`);
            return;
        }
        console.log(`GAME: Moving ${player.name} ${steps} spaces via card effect.`);
        ensurePlayerPath(player);
        animateTokenToPosition(player, steps, (result) => {
            console.log(`GAME: Card movement (spaces: ${steps}) animation completed for ${player.name}. Reason: ${result.reason}`);
            // No extra action needed here, animateTokenToPosition handles end state.
        });

    } else if (effect.targetSpaceId) {
        // Handle moving to a specific space ID (e.g., 'START', 'FINISH')
        let targetCoords = null;
        const spaceId = effect.targetSpaceId.toUpperCase();
        
        if (spaceId === 'START' && START_SPACE) {
            targetCoords = { x: START_SPACE.coordinates[0][0], y: START_SPACE.coordinates[0][1] };
        } else if (spaceId === 'FINISH' && FINISH_SPACE) {
            targetCoords = { x: FINISH_SPACE.coordinates[0][0], y: FINISH_SPACE.coordinates[0][1] };
        } else {
            console.warn(`handleCardMovement: Unsupported 'targetSpaceId': ${effect.targetSpaceId}`);
            // TODO: Implement lookup for other potential named space IDs if needed
            return; 
        }

        if(targetCoords) {
            console.log(`GAME: Moving ${player.name} directly to ${spaceId} (${targetCoords.x}, ${targetCoords.y}) via card effect.`);
            console.log(`${player.role} moves directly to ${spaceId}!`);
            player.currentCoords = { ...targetCoords }; 
            drawBoard(); // Redraw board
            
            if (spaceId === 'FINISH') {
                console.log(`Player ${player.name} reached FINISH via card effect.`);
                markPlayerFinished(player); // Use existing function
                // Check if game ends after marking finished
                if (allPlayersFinished(getPlayers())) {
                    triggerGameOver();
                    return; // Stop further processing if game over
                }
            }
            updatePlayerInfo(); // Corrected UI update call
        }

    } else if (effect.moveToAge) {
        // Handle moving to the start of a specific Age
        console.log(`GAME: Moving ${player.name} to start of Age: ${effect.moveToAge}`);
        console.log(`${player.role} jumps to ${effect.moveToAge}!`);
        
        // Debug log the actual path names
        console.log("Available path names:", {
            ageOfExpansionPath: ageOfExpansionPath.name,
            ageOfResistancePath: ageOfResistancePath.name,
            ageOfReckoningPath: ageOfReckoningPath.name,
            ageOfLegacyPath: ageOfLegacyPath.name
        });
        
        let targetPath = null;
        // Case-insensitive matching for more robustness
        const ageNameKey = effect.moveToAge;
        if (ageNameKey.includes("expansion")) {
            targetPath = ageOfExpansionPath;
        } else if (ageNameKey.includes("resistance") || ageNameKey.includes("resistence")) {
            targetPath = ageOfResistancePath;
        } else if (ageNameKey.includes("reckoning")) {
            targetPath = ageOfReckoningPath;
        } else if (ageNameKey.includes("legacy")) {
            targetPath = ageOfLegacyPath;
        } else {
            console.error(`handleCardMovement: Unknown Age name in moveToAge: ${effect.moveToAge}`);
            return;
        }
        
        console.log(`Selected targetPath:`, targetPath.name);

        if (targetPath && targetPath.segments && targetPath.segments.length > 0) {
            // Get the coordinates of the very first space in the target path
            const targetCoords = {
                x: targetPath.segments[0].coordinates[0][0],
                y: targetPath.segments[0].coordinates[0][1]
            };
            console.log(` Target coordinates for ${effect.moveToAge}: (${targetCoords.x}, ${targetCoords.y})`);
            player.currentCoords = { ...targetCoords };
            drawBoard(); // Redraw board
            updatePlayerInfo(); // Corrected UI update call
        } else {
            console.error(`handleCardMovement: Could not find path data for Age: ${effect.moveToAge}`);
        }

    } else {
        console.warn("handleCardMovement: Unknown movement effect structure:", effect);
    }
};

/**
 * Helper function to create a delay using Promises
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise} - Promise that resolves after the delay
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Simulates a CPU player clicking on a deck
 * @param {string} deckType - The type of deck to draw from
 * @returns {Promise} - Promise that resolves when the card is drawn
 */
export async function simulateCpuDeckClick(deckType) {
    console.log('---------simulateCpuDeckClick---------');
    console.log(`CPU simulating click on ${deckType} deck`);
    const player = getCurrentPlayer();

    if (!player) {
        console.error('No current player found for CPU deck click');
        return null;
    }

    console.log(`Processing card draw for player: ${player.name} (ID: ${player.id})`);

    let regionKey = '';

    if (deckType === 'endOfTurnDeck') {
        regionKey = Math.random() < 0.5 ? 'endOfTurnRegion1' : 'endOfTurnRegion2';
        console.log(`Selected End of Turn deck: ${regionKey}`);
    } else {
        for (const [key, region] of Object.entries(fullDeckRegionPathMap)) {
            if (region.deckType === deckType) {
                regionKey = key;
                break;
            }
        }
    }

    if (!regionKey) {
        console.error(`Could not find region key for deck type: ${deckType}`);
        return null;
    }

    highlightDeckRegions(player, deckType, positions);

    await delay(800);

    const card = await drawCard(deckType);
    return card;
};

/**
 * Simulates an AI player making a choicepoint decision.
 * Called when an AI player lands on a choicepoint or starts from the beginning.
 * @param {object} player - The AI player making the choice
 */
export function simulateCpuChoicepoint(player) {
    console.log('---------simulateCpuChoicepoint---------');
    console.log(`[AI] Simulating choicepoint choice for ${player.name} in phase: ${state.currentPhase}`);

    // Guard: Prevent invalid player or human calls
    if (!player || player.isHuman) {
        console.error("simulateCpuChoicepoint called with invalid player:", player);
        return;
    }

    // Guard: Prevent running in incorrect phase
    if (state.currentPhase === 'PLAYING') {
        console.warn("AI attempted to choose in PLAYING phase — blocking.");
        return;
    }
    
    // Guard: Prevent multiple simultaneous choices
    if (state.choiceInProgress) {
        console.warn("AI choice already in progress, ignoring duplicate call");
        return;
    }
    
    // Set flag to prevent overlapping choices
    updateGameState({ choiceInProgress: true });
    
    // Helper function to clean up after choice is made
    const cleanup = () => {
        updateGameState({ choiceInProgress: false });
        console.log(`[AI] ${player.name} completed choice in phase: ${state.currentPhase}`);
    };
    
    // Helper function to handle errors and cleanup
    const handleError = (message) => {
        console.error(`[AI] ${message}`);
        cleanup();
        handleEndTurn(true);
    };
    
    if (state.currentPhase === 'AWAITING_PATH_CHOICE') {
        // Initial 2-second delay to decide path
        setTimeout(() => {
            // Get the path options from the board
            const options = getNextStepOptions();
            
            if (!options || options.length === 0) {
                return handleError("No path options available");
            }
            
            // Select a random option
            const randomIndex = Math.floor(Math.random() * options.length);
            const selectedOption = options[randomIndex];

            if (!selectedOption || !selectedOption.coords ||
                typeof selectedOption.coords.x !== 'number' ||
                typeof selectedOption.coords.y !== 'number') {
                return handleError(`Invalid selected option: ${JSON.stringify(selectedOption)}`);
            }

            updateGameState({
                pendingActionData: {
                    ...state.pendingActionData || {},
                    pathName: selectedOption.pathName
                }
            });

            console.log(`[AI] ${player.name} pre-selected path: ${selectedOption.text}. Triggering UI animation.`);

            // AI Logic: Show popover and run the 8-second animation sequence
            const popover = document.getElementById('path-Choice-Popover');
            if (!popover) {
                return handleError("Path-choice popover not found");
            }

            const idMap = {
                ageOfExpansion: 'age-Of-Expansion-Path',
                ageOfResistance: 'age-Of-Resistance-Path',
                ageOfReckoning: 'age-Of-Reckoning-Path',
                ageOfLegacy: 'age-Of-Legacy-Path',
            };

            try {
                popover.showModal();
            } catch (err) {
                console.error('Failed to show modal:', err);
                return handleError("Failed to show path choice modal");
            }

            // 2.5s delay to identify the button
            setTimeout(() => {
                const chosenButton = document.getElementById(idMap[selectedOption.pathName]);
                if (chosenButton) {
                    chosenButton.classList.add('ai-chosen-path');
                }

                // 2.5s for the pulse animation to run
                setTimeout(() => {
                    // 2.5s final delay after animation
                    setTimeout(() => {
                        try {
                            popover.close();
                        } catch (err) {
                            console.error('Failed to close popover:', err);
                        }
                        if (chosenButton) {
                            chosenButton.classList.remove('ai-chosen-path');
                        }
                        handlePathChoice(selectedOption.coords, selectedOption.pathName);
                        cleanup();
                    }, 2500);
                }, 2500);
            }, 2500);
            
        }, 2000); // 2-second delay before choice is made and UI is shown

    } else if (state.currentPhase === 'AWAITING_CHOICEPOINT_CHOICE') {
        // Get the choice options from pendingActionData
        if (!state.pendingActionData || !state.pendingActionData.choiceOptions) {
            return handleError("Missing choiceOptions in pendingActionData");
        }

        const { choiceOptions } = state.pendingActionData;
        
        if (!choiceOptions || choiceOptions.length === 0) {
            return handleError("No choice options available");
        }
        
        // Select a random option
        const randomIndex = Math.floor(Math.random() * choiceOptions.length);
        const selectedOption = choiceOptions[randomIndex];
        
        // Validate the selected option format
        if (!selectedOption || !selectedOption.coords || 
            typeof selectedOption.coords.x !== 'number' || 
            typeof selectedOption.coords.y !== 'number') {
            return handleError(`Invalid choicepoint option format: ${JSON.stringify(selectedOption)}`);
        }
        
        console.log(`[AI] ${player.name} chose path option: ${selectedOption.text || 'unnamed path'}`);
        
        // Add a small delay for better UX
        setTimeout(() => {
            try {
                // Call the callback with the selected option
                if (state.pendingActionData.onChoice) {
                    state.pendingActionData.onChoice(selectedOption);
                } else {
                    // Fallback to handlePathChoice if no callback provided
                    handlePathChoice(selectedOption.coords);
                }
            } catch (error) {
                console.error("Error handling AI choice:", error);
                handleEndTurn(true);
            } finally {
                cleanup();
            }
        }, 1000); // 1-second delay for better UX
    }
    else {
        console.error(`[AI] simulateCpuChoicepoint called in incorrect phase: ${state.currentPhase}`);
        cleanup();
        return;
    }
};
/**
 * Advances the game state to the next player in the turn order.
 * Handles skipping finished players and looping back.
 */
export async function advanceToNextPlayer() {
    console.log("----------- advance To Next Player ------------");
    
    // Decrement temporary statuses / clear alliances at the start of the round
    if (state.currentPlayerIndex === state.totalPlayerCount - 1) {
        console.log("End of round reached, decrementing/clearing statuses.");
        updateGameState();
        // decrementTradeBlockTurns(); // Add if implemented
        // decrementImmunityTurns();
        // updateGameState({
        //     players: state.players.map(p => ({ ...p, currentAlliancePartnerId: null }))
        // });
        console.log("All temporary alliances cleared.");
    }

    if (state.ended) {
        console.log("Game has ended, not advancing player.");
        return;
    }

    // Check for game over condition *before* advancing (in case last player finished)
    if (allPlayersFinished(state.players)) {
        await triggerGameOver();
        return;
    }

    let nextPlayerIndex = (state.currentPlayerIndex + 1) % state.totalPlayerCount;
    let loopCheck = 0; // Prevent infinite loops

    // Find the next player who hasn't finished
    while (state.players[nextPlayerIndex].finished && loopCheck < state.totalPlayerCount) {
        console.log(`Player ${state.players[nextPlayerIndex].name} has finished, skipping.`);
        nextPlayerIndex = (nextPlayerIndex + 1) % state.totalPlayerCount;
        loopCheck++;
    }

    // If loopCheck reaches totalPlayerCount, it means everyone left is finished - trigger game over again just in case.
    if (loopCheck >= state.totalPlayerCount) {
         console.warn("Advanced player logic found only finished players. Triggering game over.");
         await triggerGameOver();
         return;
    }

    updateGameState({
        currentPlayerIndex: nextPlayerIndex,
        currentPhase: 'ROLLING', // Start in ROLLING phase until dice is rolled
        pendingActionData: null,
        rollResult: 0
    });
    console.warn('GAMEPHASE UPDATED TO ROLLING');

    const newCurrentPlayer = getCurrentPlayer();

    console.log(`Advancing turn. New current player: ${newCurrentPlayer.name} (ID: ${newCurrentPlayer.id}, Index: ${state.currentPlayerIndex})`);
    
    updateGameState({
        pendingActionData: null, // Clear any pending data from previous turn
        rollResult: 0 // Clear dice roll
    });
    
    // Update UI for the current player (highlights current)
    if (!newCurrentPlayer.id) {
        console.error('Current player has no ID!', newCurrentPlayer);
        return; // Don't proceed if player is invalid
    }
    
    // Update UI controls for the current player
    updateGameControls(); // Update buttons based on player type etc.
    
    // If it's a human player's turn, ensure the dice is interactive
    if (newCurrentPlayer.isHuman) {
        console.log(`[DEBUG] Human player ${newCurrentPlayer.name}'s turn started`);
        // Force update the UI controls to ensure the dice is enabled
        setTimeout(() => updateGameControls(), 100);
    }

    // If the new player is AI, trigger their turn
    if (!newCurrentPlayer.isHuman) {
        console.log(`New player ${newCurrentPlayer.name} is AI. Triggering AI turn.`);
        // Add a slight delay for better UX, feels less jarring
        console.log("Starting 2 second delay before AI turn...");
        await new Promise(resolve => setTimeout(resolve, 2000)); 
        console.log("...Delay finished.");
        await handleAITurn(newCurrentPlayer);
    } else {
        console.log(`New player ${newCurrentPlayer.name} is Human. Initializing human turn.`);
        // Force update UI for human player
        updatePlayerInfo(newCurrentPlayer.id);
        updateGameControls();
        updateGameState({ currentPhase: 'ROLLING' });

        // Additional UI feedback for human turn
        const message = `It's ${newCurrentPlayer.name}'s turn (${newCurrentPlayer.role})`;
        console.log(message);
    }
}