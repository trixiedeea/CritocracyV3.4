// Game Module for Critocracy
// Handles core game logic, game flow, and state management

// ===== Imports =====
import { START_SPACE } from './board-data.js';
import { 
    boardState, 
    drawBoard, 
    scaleCoordinates,           // New scaling function
    unscaleCoordinates,         // New scaling function
    startMoveAnimation,
    setupBoard,                  // Added missing import
    animateTokenToPosition,
    findSpaceDetailsByCoords,
    getNextStepOptions
} from './board.js';
import { START_SPACE as oldSTART_SPACE, FINISH_SPACE, purplePath, bluePath, cyanPath, pinkPath } from './board-data.js';
import { 
    setupDecks, 
    drawCard, 
    applyCardEffect,
    applyEndOfTurnCardEffects,
    applySinglePlayerEOTEffect,
    DECK_TYPES
} from './cards.js';
import { 
    createPlayer, 
    updatePlayerResources, 
    allPlayersFinished,
    markPlayerFinished, 
    getPlayerRanking,
    getPlayers, 
    getPlayerScore,
    PLAYER_ROLES, 
    resetPlayers,
    setPlayerSkipTurn,
    hasImmunity,
    useSpecialAbility,
    decrementImmunityTurns
} from './players.js';

// Direct UI imports are necessary for prompts and direct feedback
import { 
    showCard, 
    hideCard, 
    showEndGameScreen, 
    promptForPathChoice, 
    promptForJunctionChoice, 
    updatePlayerInfo, 
    updateGameControls,
    promptForTradeResponse,
    logMessage,
    clearMessages,
    highlightDeckRegions,
    stopDeckHighlight,
    enableEndTurnButton,
    DECK_REGIONS,
    REGION_TO_DECK_TYPE,
    highlightClickedDeckRegion,
    highlightCyanDeck
} from './ui.js';

// ===== Game State =====
let gameState = {
    started: false,
    ended: false,
    currentPhase: 'SETUP', // SETUP, ROLE_SELECTION, TURN_ORDER, PLAYING, AWAITING_PATH_CHOICE, AWAITING_JUNCTION_CHOICE, GAME_OVER
    players: [],          // Array of player objects
    totalPlayerCount: 0, // Renamed from playerCount
    humanPlayerCount: 0, // Added for clarity
    currentPlayerIndex: -1, 
    turnOrder: [], 
    pendingActionData: null, // Used to store data like dice roll during choices
    currentDiceRoll: 0 // Added to store the current roll temporarily
};

// ===== Game Functions =====

/**
 * Initializes the core game modules (Board, Cards, Players).
 */
export async function initGame() {
    try {
        console.log("Initializing game...");
        resetPlayers(); 
        await setupBoard();
        await setupDecks();
        
        // Reset internal game state
        gameState = {
            started: false,
            ended: false,
            currentPhase: 'SETUP',
            players: [],
            totalPlayerCount: 0,
            humanPlayerCount: 0,
            currentPlayerIndex: -1,
            turnOrder: [],
            pendingActionData: null, // Reset pending data too
            currentDiceRoll: 0 // Reset dice roll
        };
        console.log("Game initialization complete.");
        return true;
    } catch (error) {
        console.error('Error initializing game:', error);
        return false;
    }
}

/**
 * Moves game state to role selection phase after player count is confirmed.
 * Distinguishes between total and human players.
 */
export function setupRoleSelectionPhase(totalCount, humanCount) {
    if (gameState.currentPhase !== 'SETUP') return false;
    if (humanCount < 1 || humanCount > totalCount || totalCount > 6) {
         console.error(`Invalid player counts: Total=${totalCount}, Human=${humanCount}`);
         return false;
    }
    console.log(`Setting up for ${totalCount} total players (${humanCount} human).`);
    gameState.totalPlayerCount = totalCount;
    gameState.humanPlayerCount = humanCount;
    gameState.players = []; 
    gameState.currentPhase = 'ROLE_SELECTION';
    return true;
}

/**
 * Adds a player during the Role Selection phase.
 * Now expects addPlayer to be called only for human players from UI.
 */
export function addPlayer(name, role, isHuman) {
    // Allow adding players only up to the expected *total* count
    if (gameState.currentPhase !== 'ROLE_SELECTION' || gameState.players.length >= gameState.totalPlayerCount) {
        console.error("Cannot add player: Incorrect phase or total player limit reached.");
        return null;
    }
    if (!name || !role || !PLAYER_ROLES[role]) {
         console.error("Cannot add player: Invalid name or role.");
         return null;
    }
    if (gameState.players.some(p => p.role === role)) {
         console.error(`Cannot add player: Role ${role} is already taken.`);
         return null;
    }
    
    console.log(`Adding player ${gameState.players.length + 1}/${gameState.totalPlayerCount}: ${name} (${role}), Human: ${isHuman}`);
    const player = createPlayer(name, role, isHuman);
    if (player) {
        gameState.players.push(player);
    } else {
         console.error("Failed to create player instance.");
         return null;
    }

    // Don't transition phase here; wait for assignRemainingCpuRoles if needed
    return player;
}

/**
 * Assigns roles automatically to remaining CPU player slots.
 * Should be called after all human players have selected roles.
 * @returns {Promise<void>}
 */
export async function assignRemainingCpuRoles() {
    const currentPlayers = getPlayers();
    const humansAdded = currentPlayers.filter(p => p.isHuman).length;
    const cpusToAdd = gameState.totalPlayerCount - humansAdded;

    if (cpusToAdd <= 0) {
        console.log("No CPU players to add.");
        return Promise.resolve(); // Nothing to do
    }

    console.log(`Assigning roles for ${cpusToAdd} CPU players...`);

    const assignedRoles = new Set(currentPlayers.map(p => p.role));
    const availableRoles = Object.keys(PLAYER_ROLES).filter(role => !assignedRoles.has(role));

    // Shuffle available roles for randomness
    for (let i = availableRoles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableRoles[i], availableRoles[j]] = [availableRoles[j], availableRoles[i]];
    }

    for (let i = 0; i < cpusToAdd; i++) {
        if (availableRoles.length === 0) {
             console.error("Ran out of available roles while assigning CPUs!");
             return Promise.reject(new Error("Not enough roles for CPU assignment")); 
        }
        const cpuRole = availableRoles.pop();
        const cpuName = `CPU ${i + 1} (${cpuRole.substring(0,3)})`;
        
        // Add CPU player directly using addPlayer logic
        const addedCpu = addPlayer(cpuName, cpuRole, false); 
        if (!addedCpu) {
             // This shouldn't happen if logic is correct, but handle defensively
             console.error(`Failed to add CPU player ${cpuName} with role ${cpuRole}.`);
             // Attempt to continue with next CPU?
             return Promise.reject(new Error(`Failed to add CPU ${cpuName}`)); 
        }
    }
    gameState.players = getPlayers(); // Update local copy
    console.log("Finished assigning CPU roles.");
    return Promise.resolve();
}

/**
 * Transitions the game state to the TURN_ORDER phase.
 * Should be called after all roles (human + CPU) are assigned.
 */
export function advanceToTurnOrderPhase() {
    if (gameState.currentPhase !== 'ROLE_SELECTION') {
        console.error("Cannot advance to turn order: Not in role selection phase.");
        return false;
    }
    if (gameState.players.length !== gameState.totalPlayerCount) {
        console.error(`Cannot advance to turn order: Player count mismatch (${gameState.players.length}/${gameState.totalPlayerCount}).`);
        return false;
    }
    console.log("Advancing game state to TURN_ORDER phase.");
    gameState.currentPhase = 'TURN_ORDER';
    gameState.players = getPlayers(); // Ensure local list is up-to-date
    return true;
}

/**
 * Determines the turn order based on dice rolls and tiebreakers.
 */
export function determineTurnOrder() {
    // Check against total player count
    if (gameState.currentPhase !== 'TURN_ORDER' || gameState.players.length !== gameState.totalPlayerCount) {
        console.error("Cannot determine turn order: Incorrect phase or total player count mismatch.");
        return false;
    }
    
    console.log("Determining turn order...");
    const rolls = gameState.players.map((player, index) => ({
        index,
        player,
        roll: Math.floor(Math.random() * 6) + 1
    }));

    console.log("Initial rolls:", rolls.map(r => `${r.player.name}: ${r.roll}`));

    // Sort: Highest roll first. Tiebreaker: Alphabetical role name.
    rolls.sort((a, b) => {
        if (b.roll !== a.roll) {
            return b.roll - a.roll;
        }
        const roleNameA = PLAYER_ROLES[a.player.role].name;
        const roleNameB = PLAYER_ROLES[b.player.role].name;
        return roleNameA.localeCompare(roleNameB);
    });

    gameState.turnOrder = rolls.map(r => r.index); 
    gameState.currentPlayerIndex = 0; 
    gameState.currentPhase = 'PLAYING';
    gameState.started = true;

    console.log("Turn order determined:", gameState.turnOrder.map(i => gameState.players[i].name));
    console.log(`Starting game. Current player: ${getCurrentPlayer().name}`);
    
    // Start the first player's turn automatically
    setTimeout(() => {
        const firstPlayer = getCurrentPlayer();
        if (firstPlayer && !firstPlayer.isHuman) {
            console.log(`First player is AI. Automatically starting their turn...`);
            handleAITurn(firstPlayer);
        }
    }, 1000);
    
    return true;
}

/**
 * Gets the player object whose turn it currently is.
 */
export function getCurrentPlayer() {
    if (gameState.currentPlayerIndex < 0 || gameState.currentPlayerIndex >= gameState.turnOrder.length) {
        console.error("Invalid currentPlayerIndex:", gameState.currentPlayerIndex);
        return null; // Or handle appropriately
    }
    const playerIndexInMainArray = gameState.turnOrder[gameState.currentPlayerIndex];
    return gameState.players[playerIndexInMainArray];
}

/**
 * Handles the main action for the current player's turn (usually rolling and moving).
 * This is the central function driving a player's turn.
 * @param {number} [diceRoll] - Optional pre-determined dice roll (for testing or specific cards).
 */
export async function handlePlayerAction(diceRoll) {
    console.log("--- handlePlayerAction ---");
    if (gameState.currentPhase !== 'PLAYING' || gameState.ended) {
        console.warn("handlePlayerAction called in incorrect phase or game ended:", gameState.currentPhase);
        return;
    }

    const player = getCurrentPlayer();
    if (!player) {
        console.error("handlePlayerAction: Could not get current player.");
        return;
    }
     console.log(`Player ${player.name}'s turn (Index: ${gameState.currentPlayerIndex}, Actual Index: ${gameState.turnOrder[gameState.currentPlayerIndex]})`);


    // 0. Check if player turn should be skipped
    if (player.skipTurns > 0) {
        console.log(`Player ${player.name} skips turn (${player.skipTurns} remaining).`);
        player.skipTurns--;
        updatePlayerInfo(); // Update UI potentially
        await endPlayerTurn(true); // Skip card draw phase for skipped turn
        return;
    }

    // 1. Roll the Dice (if not provided)
    const roll = diceRoll !== undefined ? diceRoll : Math.floor(Math.random() * 6) + 1;
    gameState.currentDiceRoll = roll; // Store roll for potential later use (like after path choice)
    console.log(`Player ${player.name} rolled a ${roll}`);
    // TODO: Update UI to show dice roll

    // 2. Check if player is at the start
    const startX = START_SPACE.coordinates[0][0];
    const startY = START_SPACE.coordinates[0][1];
    if (player.currentCoords.x === startX && player.currentCoords.y === startY) {
        console.log(`Player ${player.name} is at Start. Needs to choose a path.`);
        gameState.currentPhase = 'AWAITING_PATH_CHOICE';
        gameState.pendingActionData = { roll }; // Store roll needed after choice

        // Map path objects to options for the UI
        const pathObjects = { purple: purplePath, blue: bluePath, cyan: cyanPath, pink: pinkPath };
        const options = Object.entries(START_SPACE.nextCoordOptions).map(([pathColorKey, coordsArray]) => {
            const pathData = pathObjects[pathColorKey];
            return {
                text: pathData.name, // Use the name from board-data.js
                coords: { x: coordsArray[0], y: coordsArray[1] },
                color: pathData.color, // Pass the color key
                pathName: pathColorKey // Add pathName for path tracking
            };
        });

        // Display options to the human player
        if (player.isHuman) {
            console.log("Prompting human for start path choice with options:", options);
            promptForPathChoice(options, (chosenCoords, pathName) => {
                // Store the pathName for validation in handlePathChoice
                gameState.pendingActionData.pathName = pathName;
                handlePathChoice(chosenCoords);
            });
        } else {
            // AI choice is now handled by simulateCpuChoicepoint
            simulateCpuChoicepoint(player);
        }
        return; // Wait for choice
    }

    // 3. Player is NOT at start, proceed with normal movement
    console.log(`Player ${player.name} starting move from:`, player.currentCoords, `with roll: ${roll}`);

    // Ensure the player object passed to animation has up-to-date coords
     const playerIndex = gameState.players.findIndex(p => p.id === player.id);
     if (playerIndex === -1) {
         console.error("Critical error: Current player not found in gameState.players");
         return;
     }

    // Trigger animation directly
    startMoveAnimation(gameState.players[playerIndex], roll, handleEndOfMove); // Pass the index

}

/**
 * Callback function invoked when a player chooses a starting path.
 * @param {object} chosenCoords - The coordinates {x, y} of the first step onto the chosen path.
 */
export async function handlePathChoice(chosenCoords) {
    console.log("--- handlePathChoice ---");
    if (gameState.currentPhase !== 'AWAITING_PATH_CHOICE') {
         console.error("handlePathChoice called in incorrect phase:", gameState.currentPhase);
         return;
    }

    const player = getCurrentPlayer();
    if (!player || !gameState.pendingActionData) {
         console.error("handlePathChoice: Player or pending data missing.");
         gameState.currentPhase = 'PLAYING'; // Reset phase on error
         return;
    }
    const roll = gameState.pendingActionData.roll;
    console.log(`Player ${player.name} chose path starting at:`, chosenCoords, `Continuing with roll: ${roll}`);

    // FIXED: Validate coordinates before setting
    // First ensure the coordinates are valid numbers
    if (typeof chosenCoords.x !== 'number' || typeof chosenCoords.y !== 'number' || 
        isNaN(chosenCoords.x) || isNaN(chosenCoords.y)) {
        
        console.error(`Invalid path coordinates: (${chosenCoords.x}, ${chosenCoords.y}). Using direct board-data.js values.`);
        
        // Use already imported START_SPACE
        // Get the specific path coordinates based on the user's choice
        let pathName = gameState.pendingActionData.pathName;
        let validPathCoords = null;
        
        if (pathName && START_SPACE.nextCoordOptions[pathName.toLowerCase()]) {
            // Convert the array to an object with x,y properties
            const pathArray = START_SPACE.nextCoordOptions[pathName.toLowerCase()];
            validPathCoords = { x: pathArray[0], y: pathArray[1] };
            console.log(`Using hardcoded path coordinates for ${pathName}: (${validPathCoords.x}, ${validPathCoords.y})`);
        } else {
            // Fallback to start space
            validPathCoords = { x: START_SPACE.coordinates[0], y: START_SPACE.coordinates[1] };
            console.log(`Using fallback START coordinates: (${validPathCoords.x}, ${validPathCoords.y})`);
        }
        
        // Update chosen coordinates
        chosenCoords = validPathCoords;
    }

    // Update player's position *before* starting animation
    player.currentCoords = { x: chosenCoords.x, y: chosenCoords.y };

    // Update UI to show player moved to the first space? (Optional)
    // It might look smoother to just let the animation handle it.

    gameState.currentPhase = 'PLAYING'; // Resume normal play
    gameState.pendingActionData = null; // Clear pending data

    // Start the movement animation FROM THE NEW COORDS, but for the *remaining* steps
    // The choice itself counts as the first step.
    const remainingSteps = roll - 1;

     // Ensure the player object passed to animation has up-to-date coords
     const playerIndex = gameState.players.findIndex(p => p.id === player.id);
     if (playerIndex === -1) {
         console.error("Critical error: Current player not found in gameState.players");
         return;
     }

    // Draw board to show the updated player position
    drawBoard();

    if (remainingSteps > 0) {
        console.log(`Starting animation for remaining ${remainingSteps} steps.`);
        startMoveAnimation(gameState.players[playerIndex], remainingSteps, handleEndOfMove);
    } else {
        console.log("Roll was 1, move ends immediately after path choice.");
        // Need to trigger end-of-move logic directly since animation won't run
        await handleEndOfMove();
    }
}

/**
 * Handles clicks on the board, currently ONLY used for manual movement selection
 * (e.g., when a human lands on a Junction and needs to choose).
 * This is NOT used for the initial path choice from Start.
 * @param {object} clickedCoords - The {x, y} coordinates derived from the click event.
 */
export async function handleHumanMoveClick(clickedCoords) {
    console.log("--- handleHumanMoveClick ---", clickedCoords);
    if (gameState.currentPhase !== 'AWAITING_JUNCTION_CHOICE' || gameState.ended) {
         console.warn("handleHumanMoveClick called in incorrect phase:", gameState.currentPhase);
         return;
    }

    const player = getCurrentPlayer();
    // Check if data exists and if the player is human OR if this is an AI simulating the click
    if (!player || !gameState.pendingActionData || (!player.isHuman && !clickedCoords)) { 
         console.error("handleHumanMoveClick: Invalid state, missing data, or AI call missing coords.");
         return;
    }

    const { validNextCoords, remainingSteps } = gameState.pendingActionData;
    console.log("Available choices:", validNextCoords);

    // --- VALIDATION ADDED BACK --- 
    // Find if the clicked coordinates match one of the valid options
    // Need a tolerance check for floating point comparisons if coords aren't exact
    const tolerance = 1; // Pixel tolerance
    const chosenOption = validNextCoords.find(coord =>
        Math.abs(coord.x - clickedCoords.x) < tolerance && 
        Math.abs(coord.y - clickedCoords.y) < tolerance
    );
    // --- END VALIDATION --- 

    if (chosenOption) {
         console.log(`Player ${player.name} chose valid junction option:`, chosenOption);
         hideCard(); // Hide any junction prompt if shown (though prompt hides itself now)

         // Move the player token to the chosen space
         gameState.pendingActionData = null; // Clear pending state *before* animation
         gameState.currentPhase = 'PLAYING'; // Set phase before animation starts

         // Use animateTokenToPosition for the single step choice
         // Pass the actual chosenOption coordinates
         await animateTokenToPosition(player, chosenOption, 500, async () => {
             // Update player's logical coordinates AFTER animation step
             player.currentCoords = { ...chosenOption }; 
             console.log(`Player ${player.name} moved to junction choice:`, player.currentCoords);
             updatePlayerInfo(); // Update UI

             // Continue movement if steps remain
             if (remainingSteps > 0) {
                 console.log(`Continuing movement with ${remainingSteps} steps remaining.`);
                 // Phase is already PLAYING
                 startMoveAnimation(player, remainingSteps, handleEndOfMove);
             } else {
                 console.log("Move ends after junction choice.");
                 // Phase is already PLAYING
                 await handleEndOfMove({ reason: 'junction_choice_complete', stepsTaken: 0 }); // Pass reason 
             }
         });

    } else {
         console.log("Invalid move clicked:", clickedCoords);
         // For human players, provide feedback
         if (player.isHuman) {
              // TODO: Add UI feedback (e.g., shake, message via ui.js)
              // showMessage("Invalid Choice!"); // Example using ui.js function if available
              console.warn("UI TODO: Provide feedback for invalid junction click.");
         }
         // Don't change phase, wait for a valid click.
    }
}

/**
 * Handles the logic that occurs after a player's token finishes its movement sequence.
 * This is called as the onComplete callback from startMoveAnimation or after manual moves.
 * @param {object} completionData - Object containing { reason, stepsTaken }
 */
async function handleEndOfMove(completionData = { reason: 'unknown', stepsTaken: 0 }) {
    const { reason, stepsTaken } = completionData;
    const player = getCurrentPlayer();
    console.log(`--- handleEndOfMove --- Reason: ${reason}, Steps Taken: ${stepsTaken}`);
    console.log(`Player ${player.name} finished movement at coords:`, player.currentCoords);
    
    // --- Handle Choicepoint Interruption ---  
    if (reason === 'interrupt_choicepoint') {
        // Present path choice to player
        showUiControls({roll: false, endTurn: false, phase: 'CHOOSE_PATH'});
        if (player.isHuman) {
            logMessage(`Your piece reached a junction. Choose your path.`);
            // Wait for human player to click on UI representing path choice
            // See handlePathChoice() invoked on UI click
        } else {
            // AI choice simulation
            // This will eventually call handlePathChoice()
            simulateCpuChoicepoint(player);
        }
        return; // Stop processing here, wait for choice
    }
    // --- End Choicepoint Handling ---

    // --- Handle Regular End of Move (steps_complete, other interrupts) --- 
    const spaceDetails = findSpaceDetailsByCoords(player.currentCoords);
    if (!spaceDetails) {
        console.error(`Could not find space details for final coords:`, player.currentCoords);
        
        // IMPROVED: Handle invalid position by properly resetting player to a valid position
        console.warn("Attempting to recover from invalid player position...");
        
        // Using the already imported START_SPACE object
        // Create a proper coordinate object using the START_SPACE data
        if (START_SPACE && START_SPACE.coordinates && Array.isArray(START_SPACE.coordinates)) {
            player.currentCoords = { 
                x: START_SPACE.coordinates[0], 
                y: START_SPACE.coordinates[1] 
            };
            
            logMessage(`${player.name}'s position was invalid and has been reset to the Start space.`);
            console.log(`Player position reset to Start space at (${player.currentCoords.x}, ${player.currentCoords.y})`);
            
            // Redraw the board to update player position
            drawBoard();
        } else {
            console.error("Failed to reset player position - START_SPACE data is invalid:", START_SPACE);
        }
        
        await endPlayerTurn(true); // Skip card draw on error
        return;
    }

    // ADDED Detailed Log
    console.log(`Landed on space:`, spaceDetails);
    const landedType = spaceDetails.Type; 
    console.log(`Landed on space type: ${landedType}`);

    let skipCardDraw = false;
    // Check if the *reason* implies skipping draw, otherwise check space type
    if (reason === 'interrupt_finish') {
         skipCardDraw = true;
         console.log(`Player ${player.name} reached the Finish!`);
         markPlayerFinished(player);
         if (allPlayersFinished(gameState.players)) {
             await triggerGameOver();
             return; 
         }
    } else if (reason && reason.startsWith('error')) { // Check for any error reason
         console.warn(`Ending turn due to error reason: ${reason}`);
         skipCardDraw = true; // Skip card draw if move ended due to error
    } else {
         // Apply normal space effects based on landed space type
         // SAFELY handle potentially missing type property
         switch ((landedType || '').toLowerCase()) { 
             case 'draw':
                 console.log("Landed on Draw space. Determining Age deck...");
                 // Debug the space details more thoroughly
                 console.log(`Space details:`, JSON.stringify(spaceDetails, null, 2));
                 
                 // Get path color and normalize it - handle both direct color and pathColor property
                 let pathColor = (spaceDetails.pathColor || spaceDetails.color || '').toUpperCase();
                 if (!pathColor) {
                     // Try to determine color from the coordinates
                     if (player.currentCoords) {
                         // Log each path to see which contains this space
                         console.log("Attempting to determine path color from coordinates:", player.currentCoords);
                         if (isPointOnPath(player.currentCoords, purplePath)) {
                             pathColor = 'PURPLE';
                             console.log("Found coordinates on PURPLE path");
                         } else if (isPointOnPath(player.currentCoords, bluePath)) {
                             pathColor = 'BLUE';
                             console.log("Found coordinates on BLUE path");
                         } else if (isPointOnPath(player.currentCoords, cyanPath)) {
                             pathColor = 'CYAN';
                             console.log("Found coordinates on CYAN path");
                         } else if (isPointOnPath(player.currentCoords, pinkPath)) {
                             pathColor = 'PINK';
                             console.log("Found coordinates on PINK path");
                         }
                     }
                 }
                 
                 console.log(`Path color determined: "${pathColor}" (from "${spaceDetails.pathColor || ''}")`);
                 
                 // Look up the corresponding deck type
                 const deckType = DECK_TYPES[pathColor];
                 console.log(`Mapped to deck type: ${deckType} (null/undefined means not found)`);
                 
                 if (deckType && deckType !== DECK_TYPES.END_OF_TURN) { // Check if it's a valid Age deck
                     console.log(`Drawing from Age deck: ${deckType}`);
                     const ageCard = drawCard(deckType);
                     if (ageCard) {
                         logMessage(`${player.role} landed on Draw and drew: ${ageCard.name}`);
                         showCard(ageCard, deckType, player);
                         applyCardEffect(ageCard, player); // Apply effect immediately
                         skipCardDraw = true; // Ensure we don't draw another card in endPlayerTurn
                     } else {
                         logMessage(`No cards left in the ${deckType} deck.`);
                         console.warn(`Could not draw card from ${deckType} deck.`);
                     }
                 } else {
                     console.warn(`Landed on Draw space but couldn't determine valid Age deck from pathColor: ${pathColor}`);
                     console.warn(`Available DECK_TYPES:`, Object.keys(DECK_TYPES));
                     // Fallback: draw an End Of Turn card since we couldn't determine the Age
                     console.log(`Falling back to END_OF_TURN deck.`);
                     const fallbackCard = drawCard(DECK_TYPES.END_OF_TURN);
                     if (fallbackCard) {
                         logMessage(`${player.role} drew a fallback card: ${fallbackCard.name}`);
                         showCard(fallbackCard, DECK_TYPES.END_OF_TURN, player);
                         applyCardEffect(fallbackCard, player);
                     }
                 }
                 break;
             case 'finish':
                 console.warn("Landed on Finish, but reason was not interrupt_finish? Handling anyway.");
                 skipCardDraw = true;
                 markPlayerFinished(player);
                 if (allPlayersFinished(gameState.players)) {
                     await triggerGameOver();
                     return;
                 }
                 break;
            case 'start':
                 console.warn("Landed back on Start space?");
                 skipCardDraw = true;
                 break;
            case 'penalty':
                 console.log(`Landed on Penalty: ${spaceDetails.details?.description || 'Generic Penalty'}`);
                 if (spaceDetails.details?.effect === 'skipTurn') {
                      setPlayerSkipTurn(player, 1);
                      console.log(`${player.name} must skip their next turn.`);
                 }
                 if (spaceDetails.details?.resources) {
                      updatePlayerResources(player, spaceDetails.details.resources);
                      console.log(`${player.name} loses resources:`, spaceDetails.details.resources);
                 }
                 updatePlayerInfo();
                 break;
            case 'reward':
                 console.log(`Landed on Reward: ${spaceDetails.details?.description || 'Generic Reward'}`);
                 if (spaceDetails.details?.resources) {
                      updatePlayerResources(player, spaceDetails.details.resources);
                      console.log(`${player.name} gains resources:`, spaceDetails.details.resources);
                      updatePlayerInfo();
                 }
                 break;
            case 'choicepoint': // Should have been handled by interrupt reason
                 console.error("Landed on Choicepoint, but reason was not interrupt_choicepoint?");
                 skipCardDraw = true;
                 break;
             // Handle other specific space types from INTERRUPTING_TYPES if they need actions here
             case 'event': 
             case 'special_event':
                 console.log(`Landed on Event space: ${spaceDetails.details?.description || 'Generic Event'}`);
                 // Maybe draw special card? For now, just log.
                 // skipCardDraw might depend on the specific event
                 break;
             case 'immunity':
                 console.log(`Landed on Immunity: ${spaceDetails.details?.description || 'Gained Immunity'}`);
                 // grantImmunity(player.id, spaceDetails.details?.duration || 1); // Needs player id? Check players.js
                 break;
             case 'trap':
                  console.log(`Landed on Trap: ${spaceDetails.details?.description || 'Generic Trap'}`);
                  // Apply trap effect
                  break;
             default:
                 console.log("Landed on a regular path space.");
                 break;
        }
    }

    // Proceed to end the player's turn
    endPlayerTurn();
}

/**
 * Handle the action a player takes after landing on a space.
 * May include drawing cards, getting bonuses, etc.
 * @param {object} player - The player who landed
 * @param {object} space - The space object where they landed
 */
export async function handleSpaceAction(player, space) {
    console.log(`--- handleSpaceAction for ${player.name} on spaceType ${space?.type} ---`);
    
    if (!space) {
        console.warn("No space object provided to handleSpaceAction!");
        return;
    }
    
    // Update player position if needed
    if (player.currentSpace !== space.id) {
        player.currentSpace = space.id;
    }
    
    // Apply effect based on space type
    switch (space.type) {
        case 'START':
            console.log("Player landed on START space");
            // Nothing special at the moment, maybe resource bonus?
            break;
            
        case 'FINISH':
            console.log("Player reached FINISH!");
            player.finished = true; // Mark player as finished
            // Award bonus points for finishing?
            break;
            
        case 'PURPLE':
        case 'BLUE':
        case 'CYAN':
        case 'PINK':
            console.log(`Player landed on ${space.type} space - setting up card draw`);
            // Set game state to wait for card draw
            gameState.currentPhase = 'AWAITING_CARD_CLICK';
            gameState.pendingActionData = { 
                requiredDeckType: space.type,
                playerId: player.id
            };
            
            if (player.isHuman) {
                // Human player - wait for user to click a card
                logMessage(`Click on the ${space.type} deck to draw a card.`);
                // Highlight the appropriate deck
                if (space.type === 'CYAN') {
                    // Special handling for cyan deck to make it more visible
                    highlightCyanDeck();
                } else {
                    highlightDeckRegions(space.type);
                }
            } else {
                // AI player - visibly simulate deck click after a short delay
                await delay(1200); // Wait a moment before AI acts
                logMessage(`${player.name} is drawing a ${space.type} card...`);
                highlightDeckRegions(space.type); // Show deck highlight
                
                // Simulate AI clicking on the deck
                await delay(800);
                const card = await simulateCpuDeckClick(space.type);
                
                if (card) {
                    // Show card briefly (for human players to see)
                    showCard(card, space.type, player, () => {
                        // This callback is when card is dismissed
                        applyCardEffect(card, player);
                        gameState.currentPhase = 'PLAYING';
                        updatePlayerInfo();
                        // Enable End Turn button
                        enableEndTurnButton();
                    });
                } else {
                    console.warn(`No ${space.type} cards left in deck.`);
                    gameState.currentPhase = 'PLAYING';
                    enableEndTurnButton();
                }
            }
            break;
            
        // Add more space types as needed
        default:
            console.log(`Unhandled space type: ${space.type}`);
    }
}

/**
 * Ends the current player's turn, handles card drawing, and advances to the next player.
 */
export function endPlayerTurn() {
    const currentPlayer = getCurrentPlayer();
    console.log(`GAME: Ending turn for Player ${currentPlayer.id} (${currentPlayer.role}).`);
    logMessage(`Turn ended for ${currentPlayer.role}.`);

    // Set up to draw End of Turn card
    gameState.currentPhase = 'AWAITING_CARD_CLICK';
    gameState.pendingActionData = { 
        requiredDeckType: 'END_OF_TURN',
        playerId: currentPlayer.id
    };

    if (currentPlayer.isHuman) {
        // Human player - wait for user to click a card
        logMessage(`Click on an End of Turn deck to draw a card.`);
        // Highlight the End of Turn decks
        highlightDeckRegions('END_OF_TURN');
    } else {
        // AI player - visibly simulate deck click after a short delay
        setTimeout(async () => {
            logMessage(`${currentPlayer.name} is drawing an End of Turn card...`);
            highlightDeckRegions('END_OF_TURN'); // Show deck highlight
            
            await delay(1000); // Wait before simulating click
            const card = await simulateCpuDeckClick('END_OF_TURN');
            
            if (card) {
                // Show card briefly (for human players to see)
                showCard(card, 'END_OF_TURN', currentPlayer, () => {
                    // This callback is when card is dismissed
                    applyCardEffect(card, currentPlayer);
                    updatePlayerInfo();
                    advanceToNextPlayer();
                });
            } else {
                logMessage("No End of Turn cards left to draw.");
                advanceToNextPlayer();
            }
        }, 1200);
    }
}

/**
 * Handles the player acknowledging the drawn card (e.g., clicking 'OK').
 * Applies card effects and then advances the turn.
 * @param {object} drawnCard - The card object that was shown.
 * @param {string} deckType - The type of deck the card came from.
 */
export async function handleHumanCardClick(drawnCard, deckType) {
    console.log("--- handleHumanCardClick ---");
    hideCard(); // Hide the card display

    const player = getCurrentPlayer();
    if (!player || !drawnCard) {
        console.error("handleHumanCardClick: Missing player or card data.");
        await advanceToNextPlayer(); // Attempt to recover
        return;
    }

    console.log(`Player ${player.name} acknowledged card: ${drawnCard.title}`);

    // Apply card effect
    try {
        console.log("Applying card effect...");
        await applyCardEffect(drawnCard, player); 
        updatePlayerInfo();
        console.log("Card effect applied.");
    } catch (error) {
        console.error(`Error applying card effect for ${drawnCard.title}:`, error);
        // Decide how to handle errors - maybe show a message to the user?
    }

    // Advance to the next player AFTER card effect is resolved
    await advanceToNextPlayer();
}

/**
 * Advances the game state to the next player in the turn order.
 * Handles skipping finished players and looping back.
 */
async function advanceToNextPlayer() {
    console.log("--- advanceToNextPlayer ---");
    
    // Decrement temporary statuses / clear alliances at the start of the round
    if (gameState.currentPlayerIndex === gameState.totalPlayerCount - 1) {
        console.log("End of round reached, decrementing/clearing statuses.");
        decrementImmunityTurns();
        // Clear all alliances
        gameState.players.forEach(p => { p.currentAlliancePartnerId = null; });
        console.log("All temporary alliances cleared.");
        // decrementTradeBlockTurns(); // Add if implemented
    }

    if (gameState.ended) {
        console.log("Game has ended, not advancing player.");
        return;
    }

    // Check for game over condition *before* advancing (in case last player finished)
    if (allPlayersFinished(gameState.players)) {
        await triggerGameOver();
        return;
    }

    let nextPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.totalPlayerCount;
    let loopCheck = 0; // Prevent infinite loops if all remaining players are finished (should be caught by allPlayersFinished, but safety first)

    // Find the *actual* index in the players array for the next turn
    let nextPlayerActualIndex = gameState.turnOrder[nextPlayerIndex];

    // Skip players who have finished
    while (gameState.players[nextPlayerActualIndex].finished && loopCheck < gameState.totalPlayerCount) {
         console.log(`Player ${gameState.players[nextPlayerActualIndex].name} has finished, skipping.`);
         nextPlayerIndex = (nextPlayerIndex + 1) % gameState.totalPlayerCount;
         nextPlayerActualIndex = gameState.turnOrder[nextPlayerIndex];
         loopCheck++;
    }

    // If loopCheck reaches totalPlayerCount, it means everyone left is finished - trigger game over again just in case.
    if (loopCheck >= gameState.totalPlayerCount) {
         console.warn("Advanced player logic found only finished players. Triggering game over.");
         await triggerGameOver();
         return;
    }

    gameState.currentPlayerIndex = nextPlayerIndex;
    const newCurrentPlayer = getCurrentPlayer();

    console.log(`Advancing turn. New current player: ${newCurrentPlayer.name} (Index: ${gameState.currentPlayerIndex}, Actual Index: ${nextPlayerActualIndex})`);
    gameState.currentPhase = 'PLAYING'; // Ensure phase is PLAYING for the new turn
    gameState.pendingActionData = null; // Clear any pending data from previous turn
    gameState.currentDiceRoll = 0; // Clear dice roll

    updatePlayerInfo(); // Update UI for all players (highlights current)
    updateGameControls(newCurrentPlayer); // Update buttons based on player type etc.

    // If the new player is AI, trigger their turn
    if (!newCurrentPlayer.isHuman) {
        console.log(`New player ${newCurrentPlayer.name} is AI. Triggering AI turn.`);
        // Add a slight delay for better UX, feels less jarring
        console.log("Starting 1 second delay before AI turn...");
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        console.log("...Delay finished.");
        await handleAITurn(newCurrentPlayer);
    } else {
        console.log(`New player ${newCurrentPlayer.name} is Human. Waiting for action.`);
        // UI should now enable controls for the human player
    }
}

/**
 * Ends the game and displays the results.
 */
async function triggerGameOver() {
    console.log("--- triggerGameOver ---");
    if (gameState.ended) return; // Prevent multiple calls

    gameState.ended = true;
    gameState.currentPhase = 'GAME_OVER';
    console.log("Game Over!");

    // Calculate final scores/rankings
    const finalRankings = getPlayerRanking();
    console.log("Final Rankings:", finalRankings);

    // Display end game screen
    showEndGameScreen(finalRankings);
}

/**
 * Handles the complete turn logic for an AI player.
 * @param {object} aiPlayer - The AI player object.
 */
async function handleAITurn(aiPlayer) {
    console.log(`--- handleAITurn for ${aiPlayer.name} ---`);
    if (gameState.currentPhase !== 'PLAYING' || gameState.ended || getCurrentPlayer().id !== aiPlayer.id) {
        console.warn(`handleAITurn called incorrectly. Phase: ${gameState.currentPhase}, Ended: ${gameState.ended}, Current: ${getCurrentPlayer()?.id}, AI: ${aiPlayer.id}`);
        return;
    }

    // AI Decision Making (Simplified for now)

    // 1. Use Special Ability? (Simple logic: use if available and maybe beneficial?)
    //    For now, let's skip complex AI ability usage.

    // 2. Roll dice and trigger standard player action
    console.log(`AI ${aiPlayer.name} rolling dice...`);
    // const diceRoll = Math.floor(Math.random() * 6) + 1; // Roll handled within handlePlayerAction
    await handlePlayerAction(); // Let handlePlayerAction roll and manage the turn flow


    // OLD AI Logic Below - Replaced by calling handlePlayerAction

    // // Simple AI: Roll dice and move.
    // const diceRoll = Math.floor(Math.random() * 6) + 1;
    // console.log(`AI ${aiPlayer.name} rolled a ${diceRoll}`);

    // // If at start, choose first path (handled by handlePlayerAction now)
    // // if (aiPlayer.currentCoords.x === START_SPACE.coords.x && aiPlayer.currentCoords.y === START_SPACE.coords.y) {
    // //     const chosenCoords = START_SPACE.nextCoordOptions[0].coords;
    // //     console.log(`AI ${aiPlayer.name} is at Start, choosing first path:`, chosenCoords);
    // //     aiPlayer.currentCoords = chosenCoords; // Move to first step
    // //     const remainingSteps = diceRoll - 1;
    // //     if (remainingSteps > 0) {
    // //         startMoveAnimation(aiPlayer, remainingSteps, handleEndOfMove);
    // //     } else {
    // //         await handleEndOfMove(); // Move ended immediately
    // //     }
    // // } else {
    // //     // Normal move
    // //     console.log(`AI ${aiPlayer.name} starting move from:`, aiPlayer.currentCoords);
    // //     startMoveAnimation(aiPlayer, diceRoll, handleEndOfMove);
    // // }

    console.log(`--- End handleAITurn for ${aiPlayer.name} ---`);
}

/**
 * Returns a copy of the current game state.
 */
export function getGameState() {
    // Return a deep copy if modification is a concern, otherwise shallow is fine for reads
    return { ...gameState, players: [...gameState.players] };
}

// Example placeholder functions for future features
export function formAlliance(player1, player2, duration) {
    console.warn("formAlliance not implemented yet.");
}
export function makeTrade(player1, player2, resources1, resources2, duration) {
    console.warn("makeTrade not implemented yet.");
}

// Ensure all necessary functions used internally are defined or imported.
// Make sure UI interaction points (promptForPathChoice, showCard, etc.) correctly call back into game logic (handlePathChoice, handleHumanCardClick).

// ===== Card Effect Handling =====

/**
 * Handles movement effects triggered by cards.
 * This function interprets the card effect and calls the appropriate board functions.
 * Exported for use by cards.js
 * @param {object} player - The player object to move.
 * @param {object} effect - The movement effect details from the card.
 */
export function handleCardMovement(player, effect) {
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
        startMoveAnimation(player, steps, (result) => {
            console.log(`GAME: Card movement (spaces: ${steps}) animation completed for ${player.name}. Reason: ${result.reason}`);
            // No extra action needed here, startMoveAnimation handles end state.
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
            logMessage(`${player.role} moves directly to ${spaceId}!`);
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
        logMessage(`${player.role} jumps to ${effect.moveToAge}!`);
        
        // Debug log the actual path names
        console.log("Available path names:", {
            purple: purplePath.name,
            blue: bluePath.name,
            cyan: cyanPath.name,
            pink: pinkPath.name
        });
        
        let targetPath = null;
        // Case-insensitive matching for more robustness
        const ageNameLower = effect.moveToAge.toLowerCase();
        if (ageNameLower.includes("expansion")) {
            targetPath = purplePath;
        } else if (ageNameLower.includes("resistance") || ageNameLower.includes("resistence")) {
            targetPath = bluePath;
        } else if (ageNameLower.includes("reckoning")) {
            targetPath = cyanPath;
        } else if (ageNameLower.includes("legacy")) {
            targetPath = pinkPath;
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
}

/**
 * Establishes a temporary (one round) alliance between two players.
 * Sets the alliance partner ID on both player objects.
 * Exported for use by cards.js
 * @param {object} playerA - The player initiating the alliance (usually drawer of card).
 * @param {object} playerB - The player targeted for the alliance.
 */
export function initiateAlliance(playerA, playerB) {
    if (!playerA || !playerB || playerA.id === playerB.id) {
        console.error("initiateAlliance: Invalid player objects received.");
        return;
    }

    // Clear any previous alliances first?
    // playerA.currentAlliancePartnerId = null;
    // playerB.currentAlliancePartnerId = null;

    playerA.currentAlliancePartnerId = playerB.id;
    playerB.currentAlliancePartnerId = playerA.id;

    console.log(`GAME: Alliance formed between ${playerA.name} and ${playerB.name} for this round.`);

    // TODO: Add UI update/message to inform players
    // showMessage(`${playerA.name} and ${playerB.name} have formed a temporary alliance!`);
}

/**
 * Initiates a trade sequence between two players based on a card effect.
 * Handles feasibility checks, AI acceptance, and prompting humans.
 * Exported for use by cards.js
 * @param {object} sourcePlayer - Player initiating the trade.
 * @param {object} targetPlayer - Player receiving the trade offer.
 * @param {object} offerDetails - { resource, amount } being offered by source.
 * @param {object} requestDetails - { resource, amount } requested from target.
 * @param {boolean} isSwap - If true, ignore offer/request and swap resource/amount directly.
 */
export function initiateTrade(sourcePlayer, targetPlayer, offerDetails, requestDetails, isSwap = false) {
    console.log(`Initiating trade: ${sourcePlayer.role} -> ${targetPlayer.role}`);
    console.log('Offer:', offerDetails, 'Request:', requestDetails, 'Swap:', isSwap);

    // 1. Check Feasibility (Already implemented, checking again for safety)
    const canSourceAfford = checkResourceAvailability(sourcePlayer, offerDetails);
    const canTargetAfford = checkResourceAvailability(targetPlayer, requestDetails);

    if (isSwap) {
        if (!canSourceAfford || !canTargetAfford) {
            logMessage(`${sourcePlayer.role} cannot initiate swap with ${targetPlayer.role}: Insufficient resources for one or both parties.`);
            console.log("Swap failed: Insufficient resources.");
            // TODO: Consider if game should proceed differently here
            return; // Trade cannot happen
        }
    } else {
        if (!canSourceAfford) {
            logMessage(`${sourcePlayer.role} cannot make offer to ${targetPlayer.role}: Insufficient resources.`);
            console.log("Trade failed: Source cannot afford offer.");
            return; // Trade cannot happen
        }
        // Target affordability is checked *after* acceptance for non-swaps
    }

    // 2. Handle AI vs Human
    if (targetPlayer.isAI) {
        // Simple AI: Accepts if it can afford its side of the deal (for swaps) or if it's just receiving (non-swap)
        const aiAccepts = isSwap ? canTargetAfford : true; // AI always accepts non-swap offers for now if target can afford
        console.log(`AI ${targetPlayer.role} decision: ${aiAccepts}`);
        if (aiAccepts) {
            handleTradeResponse(true, sourcePlayer, targetPlayer, offerDetails, requestDetails, isSwap);
        } else {
             handleTradeResponse(false, sourcePlayer, targetPlayer, offerDetails, requestDetails, isSwap);
             logMessage(`${targetPlayer.role} (AI) rejected the trade offer from ${sourcePlayer.role}.`);
        }
    } else {
        // Human Player: Show prompt
        console.log(`Prompting human player ${targetPlayer.role} for trade...`);
        promptForTradeResponse(sourcePlayer, targetPlayer, offerDetails, requestDetails, isSwap, (accepted) => {
            // This callback is executed when the human clicks Accept or Reject in the UI
            handleTradeResponse(accepted, sourcePlayer, targetPlayer, offerDetails, requestDetails, isSwap);
        });
    }
}

/**
 * Handles the response from a trade prompt (either AI decision or Human UI interaction).
 */
function handleTradeResponse(accepted, sourcePlayer, targetPlayer, offerDetails, requestDetails, isSwap) {
    console.log(`Handling trade response: Accepted = ${accepted}`);
    if (accepted) {
        // Double-check target affordability *now* for non-swaps before executing
        if (!isSwap && !checkResourceAvailability(targetPlayer, requestDetails)) {
             logMessage(`${targetPlayer.role} accepted the trade but cannot afford their part. Trade cancelled.`);
             console.log("Trade cancelled post-acceptance: Target cannot afford.");
             // TODO: Decide how game proceeds. Maybe notify source?
             return;
        }

        logMessage(`${targetPlayer.role} accepted the trade offer from ${sourcePlayer.role}.`);
        executeTrade(sourcePlayer, targetPlayer, offerDetails, requestDetails);
    } else {
        logMessage(`${targetPlayer.role} rejected the trade offer from ${sourcePlayer.role}.`);
        // No resource change, game proceeds
    }
    // TODO: Ensure game flow continues correctly after trade resolution (e.g., next action, end turn)
    // This might involve calling another function or setting a state variable.
    // For now, assuming the game flow continues from where the card effect was processed.
}

/**
 * Executes the actual resource exchange for a trade.
 * Assumes feasibility has already been checked.
 * @param {object} playerA
 * @param {object} playerB
 * @param {object} detailsA - { resource, amount } transferred FROM A TO B
 * @param {object} detailsB - { resource, amount } transferred FROM B TO A
 */
function executeTrade(playerA, playerB, detailsA, detailsB) {
    console.log(`Executing trade: ${playerA.name} gives ${detailsA.amount} ${detailsA.resource}, ${playerB.name} gives ${detailsB.amount} ${detailsB.resource}`);
    
    // Player A gives to Player B
    updatePlayerResources(playerA, { [detailsA.resource]: -detailsA.amount });
    updatePlayerResources(playerB, { [detailsA.resource]: detailsA.amount });
    
    // Player B gives to Player A
    updatePlayerResources(playerB, { [detailsB.resource]: -detailsB.amount });
    updatePlayerResources(playerA, { [detailsB.resource]: detailsB.amount });
    
    console.log("Trade complete.");
    updatePlayerInfo();
}

/**
 * Helper function to determine if a point (player coordinates) is on a specific path
 * @param {object} point - The {x, y} coordinates to check
 * @param {object} path - The path object to check against
 * @returns {boolean} - True if the point is on the path
 */
function isPointOnPath(point, path) {
    if (!path || !path.segments || !point) return false;
    
    // Check proximity to each segment in the path
    for (const segment of path.segments) {
        if (!segment.coordinates || !Array.isArray(segment.coordinates)) continue;
        
        // For coordinate arrays, check first element
        if (Array.isArray(segment.coordinates[0])) {
            const coords = segment.coordinates[0];
            const tolerance = 15; // Use a larger tolerance for matching
            if (Math.abs(point.x - coords[0]) < tolerance && 
                Math.abs(point.y - coords[1]) < tolerance) {
                return true;
            }
        }
    }
    
    return false;
}

/**
 * Helper function to create a delay using Promises
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise} - Promise that resolves after the delay
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Simulates a CPU player clicking on a deck
 * @param {string} deckType - The type of deck to draw from
 * @returns {Promise} - Promise that resolves when the card is drawn
 */
async function simulateCpuDeckClick(deckType) {
    console.log(`CPU simulating click on ${deckType} deck`);
    const player = getCurrentPlayer();
    
    // Get deck region coordinates based on deckType
    let regionKey = '';
    
    // Map deck type to region key
    if (deckType === 'END_OF_TURN') {
        // Randomly select between EOT1 and EOT2
        regionKey = Math.random() < 0.5 ? 'EOT1' : 'EOT2';
    } else {
        // For other deck types, find the matching region key
        for (const [key, value] of Object.entries(REGION_TO_DECK_TYPE)) {
            if (value === deckType) {
                regionKey = key;
                break;
            }
        }
    }
    
    if (!regionKey) {
        console.error(`Could not find region key for deck type: ${deckType}`);
        return null;
    }
    
    // Get coordinates from UI module
    const regions = await import('./ui.js').then(ui => ui.DECK_REGIONS);
    if (!regions || !regions[regionKey]) {
        console.error(`Could not find deck region coordinates for: ${regionKey}`);
        return null;
    }
    
    // Visually highlight the deck being clicked
    import('./ui.js').then(ui => {
        ui.highlightClickedDeckRegion(regionKey);
    });
    
    // Add a delay to make the CPU card drawing more visible
    await delay(800);
    
    // Draw the card
    const card = drawCard(deckType);
    return card;
}

/**
 * Simulates an AI player making a choicepoint decision.
 * Called when an AI player lands on a choicepoint or starts from the beginning.
 * @param {object} player - The AI player making the choice
 */
function simulateCpuChoicepoint(player) {
    console.log(`Simulating choicepoint choice for AI player ${player.name}`);
    
    if (!player || player.isHuman) {
        console.error("simulateCpuChoicepoint called with invalid player:", player);
        return;
    }
    
    if (gameState.currentPhase === 'AWAITING_PATH_CHOICE') {
        // This is a path choice from the Start space
        
        // Map path objects to options
        const pathObjects = { purple: purplePath, blue: bluePath, cyan: cyanPath, pink: pinkPath };
        const options = Object.entries(START_SPACE.nextCoordOptions).map(([pathColorKey, coordsArray]) => {
            const pathData = pathObjects[pathColorKey];
            return {
                text: pathData.name, // Use the name from board-data.js
                coords: { x: coordsArray[0], y: coordsArray[1] },
                color: pathData.color, // Pass the color key
                pathName: pathColorKey // Add pathName for validation
            };
        });
        
        // AI selects the first path option
        const firstOption = options[0];
        if (!firstOption || !firstOption.coords) {
            console.error("AI Error: Could not determine first start path option!");
            endPlayerTurn(true); // End turn on error
            return;
        }
        
        // Store the path name so it can be used for validation in handlePathChoice
        gameState.pendingActionData.pathName = firstOption.pathName;
        
        console.log(`AI ${player.name} chooses path: ${firstOption.text} with coordinates:`, firstOption.coords);
        setTimeout(() => handlePathChoice(firstOption.coords), 500); // Small delay for visual effect
    }
    else if (gameState.currentPhase === 'AWAITING_JUNCTION_CHOICE') {
        // This is a mid-path junction/choicepoint
        if (!gameState.pendingActionData || !gameState.pendingActionData.validNextCoords) {
            console.error("simulateCpuChoicepoint: Missing validNextCoords in pendingActionData");
            endPlayerTurn(true);
            return;
        }
        
        const { validNextCoords } = gameState.pendingActionData;
        // AI always chooses the first option
        const firstOption = validNextCoords[0];
        
        console.log(`AI ${player.name} chooses junction option:`, firstOption);
        setTimeout(() => handleHumanMoveClick(firstOption), 500); // Use the same function human clicks use
    }
    else {
        console.error(`simulateCpuChoicepoint called in incorrect phase: ${gameState.currentPhase}`);
    }
}