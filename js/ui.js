// UI Module for Critocracy
// Handles all visual elements and user interactions

// Game Logic Imports (Trigger actions)
import {
    setupRoleSelectionPhase,
    addPlayer,
    assignRemainingCpuRoles,
    determineTurnOrder,
    handlePlayerAction,
    handleHumanMoveClick,
    handleHumanCardClick,
    endPlayerTurn, // Still needed for UI updates
    getCurrentPlayer, // Still needed for UI updates
    getGameState, // Import the function
    advanceToTurnOrderPhase,
    handlePathChoice
} from './game.js';

// Player Data Imports (For display)
import { getPlayers, PLAYER_ROLES } from './players.js'; 

// Board Helper Imports
import {
    drawBoard,
    unscaleCoordinates,
    setupBoard,
    boardState,
    scaleCoordinates
} from './board.js';

// Card/Board Imports (If UI needs to directly interact - currently not needed)
import { drawCard } from './cards.js';

// Additional imports
import { ORIGINAL_WIDTH, ORIGINAL_HEIGHT } from './board-data.js';

// ===== UI State (Matching index.html IDs) =====
let uiState = {
    screens: {
        start: document.getElementById('start-screen'),
        playerCount: document.getElementById('player-count-screen'),
        roleSelection: document.getElementById('role-selection-screen'),
        turnOrder: document.getElementById('turn-order-screen'),
        gameBoard: document.getElementById('game-board-screen'),
        endGame: document.getElementById('end-game-screen')
    },
    elements: {
        // Setup Screens
        startGameBtn: document.getElementById('start-game-btn'),
        totalPlayerCountSelect: document.getElementById('total-player-count'),
        humanPlayerCountSelect: document.getElementById('human-player-count'),
        confirmPlayerCountBtn: document.getElementById('player-count-confirm'),
        roleSelectionContainer: document.getElementById('role-selection-container'),
        turnOrderContainer: document.getElementById('turn-order-container'),
        rollTurnOrderBtn: document.getElementById('roll-turn-order-btn'),
        
        // Game Board Screen
        currentPlayerName: document.getElementById('current-player'), // Span for name
        knowledgeCount: document.getElementById('knowledge-count'),
        moneyCount: document.getElementById('money-count'),
        influenceCount: document.getElementById('influence-count'),
        rollDiceBtn: document.getElementById('roll-dice-btn'),
        // abilityBtn: document.getElementById('use-ability-btn'), // Add if implementing ability button
        diceRollDisplay: document.getElementById('dice-roll'), // Div to show roll
        endTurnBtn: document.getElementById('end-turn-btn'), // Corrected ID
        
        // Popups / Other
        cardPopup: document.getElementById('card-popup'),
        cardTitle: document.getElementById('card-title'),
        cardDescription: document.getElementById('card-description'),
        cardEffects: document.getElementById('card-effects'), // Div for effects text
        showCardDetailsBtn: document.getElementById('show-card-details-btn'), // Added button
        closeCardBtn: document.getElementById('close-card-btn'),
        pathChoicePopup: document.getElementById('path-choice-popup'), // Assuming exists for initial choice
        pathChoiceOptions: document.getElementById('path-choice-options'),// Assuming exists
        junctionChoicePopup: document.getElementById('junction-choice-popup'), // Needs adding to index.html
        junctionChoiceOptions: document.getElementById('junction-choice-options'),// Needs adding
        endGameContainer: document.getElementById('end-game-container'),
        newGameBtn: document.getElementById('new-game-btn'),
        boardCanvas: document.getElementById('board-canvas'),
        diceAnimationArea: document.getElementById('dice-animation-area'),
        diceFace: document.getElementById('dice-face')
    },
    dynamic: {
        playerRoleAssignments: {},
        highlightedSpaces: new Set(),
        animationId: null,
        diceAnimationInterval: null,
        deckHighlightInterval: null,
        cyanHighlightInterval: null
    }
};

// ===== Card Deck Click Regions =====
// Define rectangles [minX, minY, maxX, maxY] for click detection
export const DECK_REGIONS = {
    PURPLE: [559, 469, 659, 624],      // Purple deck
    PINK:   [685, 246, 812, 404],      // Pink deck
    BLUE:   [841, 468, 948, 622],      // Blue deck
    CYAN:   [686, 694, 811, 870],      // Cyan deck
    EOT1:   [299, 441, 392, 585],      // End Of Turn Box 1 (Gold)
    EOT2:   [1124, 454, 1217, 600]     // End Of Turn Box 2 (Gold)
};

// Map region keys to deck types used in game logic
export const REGION_TO_DECK_TYPE = {
    PURPLE: 'PURPLE',
    PINK:   'PINK',
    BLUE:   'BLUE',
    CYAN:   'CYAN',
    EOT1:   'END_OF_TURN',
    EOT2:   'END_OF_TURN'
};

// Color mapping for buttons (using CSS color names)
const PATH_COLORS = {
    purple: '#800080', // Purple
    blue: '#0000FF',   // Blue
    cyan: '#00FFFF',   // Cyan
    pink: '#FFC0CB'    // Pink
};

// ===== UI Functions =====

// Initialize UI
export function initUI() {
    console.log("Initializing UI...");
    if (!validateElementsExist()) return false; // Check if essential elements were found
    setupEventListeners();
    showScreen('start');
    console.log("UI Initialized.");
    return true;
}

/**
 * Updates the human player count dropdown options based on total player count
 * @param {number} totalPlayers - The total number of players selected
 */
function updateHumanPlayerOptions(totalPlayers) {
    const humanSelect = uiState.elements.humanPlayerCountSelect;
    if (!humanSelect) {
        console.error("Human player select element not found!");
        return;
    }
    
    // Clear existing options
    humanSelect.innerHTML = '';
    
    // Add options from 1 to totalPlayers
    for (let i = 1; i <= totalPlayers; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        // Select the first option by default
        if (i === 1) option.selected = true;
        humanSelect.appendChild(option);
    }
    
    console.log(`Updated human player options for ${totalPlayers} total players`);
}

function validateElementsExist() {
     let allFound = true;
     // Check screens
     for (const [name, element] of Object.entries(uiState.screens)) {
         if (!element) {
             console.error(`UI Error: Screen element not found: ${name}`);
             allFound = false;
         }
     }
     // Check specific essential elements needed early
     const essential = ['startGameBtn', 'totalPlayerCountSelect', 'confirmPlayerCountBtn', 'rollTurnOrderBtn', 'rollDiceBtn', 'endTurnBtn'];
     for (const name of essential) {
         if (!uiState.elements[name]) {
             console.error(`UI Error: Control element not found: ${name}`);
             allFound = false;
         }
     }
     return allFound;
}

// Setup event listeners for buttons etc.
function setupEventListeners() {
    console.log("Setting up UI event listeners...");
    // Start screen
    uiState.elements.startGameBtn.addEventListener('click', () => {
        console.log("Start Game button clicked");
        // Populate human player options initially based on default total (2)
        updateHumanPlayerOptions(2); 
        showScreen('playerCount');
    });

    // Update human player options when total players changes
    uiState.elements.totalPlayerCountSelect.addEventListener('change', (event) => {
         const totalPlayers = parseInt(event.target.value);
         updateHumanPlayerOptions(totalPlayers);
    });

    // Player count screen confirm button
    uiState.elements.confirmPlayerCountBtn.addEventListener('click', () => {
        const totalCount = parseInt(uiState.elements.totalPlayerCountSelect.value);
        const humanCount = parseInt(uiState.elements.humanPlayerCountSelect.value);
        console.log(`Player count confirm: Total=${totalCount}, Human=${humanCount}`);
        
        // Basic validation (more happens in game.js)
        if (humanCount < 1 || humanCount > totalCount) {
             alert("Number of human players must be between 1 and the total number of players.");
             return;
        }
        
        if (setupRoleSelectionPhase(totalCount, humanCount)) { 
            setupRoleSelectionUI(humanCount); // Pass HUMAN count to UI setup
            showScreen('roleSelection');
        } else {
             console.error("Failed to set up role selection phase in game logic.");
             alert("Invalid player configuration. Please try again.");
        }
    });

    // Turn order screen
    uiState.elements.rollTurnOrderBtn.addEventListener('click', async () => {
         console.log("Roll Turn Order button clicked");
         // Disable button immediately
         uiState.elements.rollTurnOrderBtn.disabled = true;
         uiState.elements.rollTurnOrderBtn.textContent = 'Rolling...';
         
         // TODO: Add visual dice roll animation here if desired
         
         // Call game logic to determine order
         const orderDetermined = determineTurnOrder();

         if (orderDetermined) {
             console.log("Turn order determined. Starting game.");
             await delay(500); // Short delay for visual effect
             showScreen('gameBoard');
             drawBoard();
             updatePlayerInfo(); // Update display for the first player
             updateGameControls(); // Enable/disable controls for first player
         } else {
             console.error("Failed to determine turn order in game logic.");
             alert("Error determining turn order. Please check console and refresh.");
             // Re-enable button maybe?
             uiState.elements.rollTurnOrderBtn.disabled = false;
             uiState.elements.rollTurnOrderBtn.textContent = 'Roll Dice for Order'; // Reset text
         }
    });

    // Game controls
    uiState.elements.rollDiceBtn.addEventListener('click', async () => {
        console.log("Roll Dice button clicked");
        const player = getCurrentPlayer();
        if (!player || !player.isHuman) return;

        // Disable buttons during action
        uiState.elements.rollDiceBtn.disabled = true;
        uiState.elements.endTurnBtn.disabled = true; 

        // --- UI Dice Roll --- 
        const roll = Math.floor(Math.random() * 6) + 1;
        animateDiceRoll(roll); // Show animation
        await delay(3000); // Wait for animation to complete (3 seconds)

        // --- Call Game Logic --- 
        hideDiceAnimation(); // Hide dice when player starts to move
        await handlePlayerAction(roll);

        // --- Update UI AFTER action setup (check if waiting for click) --- 
        updatePlayerInfo();
        updateGameControls();
    });

    uiState.elements.endTurnBtn.addEventListener('click', async () => {
        console.log("End Turn button clicked");
        const player = getCurrentPlayer();
        if (!player || !player.isHuman) return;

        // Disable buttons
        uiState.elements.rollDiceBtn.disabled = true;
        uiState.elements.endTurnBtn.disabled = true;

        // --- Call Game Logic to end turn and advance --- 
        uiState.dynamic.highlightedSpaces.clear(); // Clear highlights on end turn
        endPlayerTurn(); // Call the function directly

        // --- Update UI for the *new* current player --- 
        // updatePlayerInfo and updateGameControls will be called by advanceToNextPlayer
        // No explicit call needed here.
        // updatePlayerInfo(); 
        // updateGameControls();
    });

    // Card popup
    uiState.elements.closeCardBtn.addEventListener('click', () => {
        hideCard();
        // Re-enable End Turn button after closing card if it was disabled during action?
        const player = getCurrentPlayer();
        if (player?.isHuman) {
            uiState.elements.endTurnBtn.disabled = false; 
        }
    });

     // New Game button (on end screen)
     uiState.elements.newGameBtn.addEventListener('click', () => {
         console.log("New Game button clicked");
         location.reload(); // Simple way to restart
     });

    // ===== Canvas Click Listener for Junction Choices & Card Decks =====
    const canvas = uiState.elements.boardCanvas;
    if (canvas) {
        canvas.addEventListener('click', (event) => {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const currentGameState = getGameState();
            const player = getCurrentPlayer();

            console.log(`Canvas clicked at (${x.toFixed(0)}, ${y.toFixed(0)}). Current Phase: ${currentGameState.currentPhase}`);

            // Handle Junction Choice Click (Replaces Move Click)
            if (currentGameState.currentPhase === 'AWAITING_JUNCTION_CHOICE') {
                if (!player || !player.isHuman) return; // Only human players click
                console.log(` --> Handling as junction choice click for ${player.name}`);

                // Unscale click coordinates to match board data coordinates
                const [unscaledX, unscaledY] = unscaleCoordinates(x, y);
                const clickedCoords = { x: unscaledX, y: unscaledY };

                console.log(`  --> Clicked Coords (unscaled):`, clickedCoords);

                // Hide dice animation if it's still visible
                hideDiceAnimation();

                // Call game logic directly with the clicked coordinates
                // game.js/handleHumanMoveClick will validate against pendingActionData.validNextCoords
                handleHumanMoveClick(clickedCoords);

                // Optional: Play sound / give visual feedback immediately?
                // Or wait for game logic to confirm valid move?
                // playClickSound();
                // flashSpace(x, y);

            } 
            // Handle Card Deck Click
            else if (currentGameState.currentPhase === 'AWAITING_CARD_CLICK') {
                if (!player || !player.isHuman) return;
                const requiredDeckType = currentGameState.pendingActionData?.requiredDeckType;
                console.log(` --> Handling as card click. Required type: ${requiredDeckType}`);

                // Get click coordinates relative to canvas
                const rect = canvas.getBoundingClientRect();
                const canvasX = event.clientX - rect.left;
                const canvasY = event.clientY - rect.top;
                
                // Convert to board coordinates
                const [boardX, boardY] = unscaleCoordinates(canvasX, canvasY);
                console.log(` --> Canvas coords: (${canvasX.toFixed(0)}, ${canvasY.toFixed(0)})`);
                console.log(` --> Board coords: (${boardX.toFixed(0)}, ${boardY.toFixed(0)})`);
                
                const clickedDeckKey = getClickedDeckRegionKey(boardX, boardY);
                console.log(`  --> Click registered in deck region: ${clickedDeckKey}`);

                // Debug - Show clicked region visually
                highlightClickedDeckRegion(clickedDeckKey);

                if (clickedDeckKey) {
                    const clickedDeckType = REGION_TO_DECK_TYPE[clickedDeckKey];
                    console.log(`  --> Mapped to deck type: ${clickedDeckType}`);
                    // Check if clicked deck matches required type (or if any EOT is ok)
                    const isValidClick = (requiredDeckType === 'END_OF_TURN' && clickedDeckType === 'END_OF_TURN') || 
                                         (clickedDeckType === requiredDeckType);

                    if (isValidClick) {
                        console.log(`  --> Valid card deck clicked (${clickedDeckType}). Drawing card...`);
                        
                        // Stop the deck highlighting effect
                        stopDeckHighlight();
                        
                        const card = drawCard(clickedDeckType); // Draw from the actual deck type
                        if (card) {
                            showCard(card, clickedDeckType, player, handleHumanCardClick); // Show card, pass game handler for close button
                        } else {
                            console.warn(`  --> Clicked valid deck ${clickedDeckType}, but no card drawn (empty?).`);
                            showMessage(`Deck ${clickedDeckType} is empty!`); // Inform user
                            playErrorSound();
                        }
                    } else {
                        console.log(`  --> Clicked deck ${clickedDeckType} does not match required ${requiredDeckType}. Ignoring.`);
                        showMessage(`Please click the correct deck: ${requiredDeckType}`);
                        playErrorSound();
                    }
                } else {
                    console.log(`  --> Click was not in any defined deck region.`);
                }
            }
            // Ignore clicks in other phases
            else {
                console.log(` --> Click ignored in phase: ${currentGameState.currentPhase}`);
            }
        });
    } else {
        console.error("Board canvas element not found! Cannot add click listener.");
    }
}

/**
 * Checks if click coordinates fall within a defined card deck region.
 * Uses ORIGINAL board coordinates.
 * @param {number} x - Unscaled click x-coordinate.
 * @param {number} y - Unscaled click y-coordinate.
 * @returns {string | null} The region key (e.g., 'PURPLE', 'EOT1') or null if no region hit.
 */
function getClickedDeckRegionKey(x, y) {
    console.log(`Checking deck region click at unscaled [${x.toFixed(0)}, ${y.toFixed(0)}]`);

    for (const regionKey in DECK_REGIONS) {
        const [minX, minY, maxX, maxY] = DECK_REGIONS[regionKey];
        if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
            console.log(`Hit detected in region ${regionKey}`);
            return regionKey; // Return the key ('PURPLE', 'EOT1', etc.)
        }
    }
    return null; // Click was not inside any defined deck region
}

// Show/hide screens
export function showScreen(screenName) {
    console.log(`--- showScreen called with: ${screenName} ---`);
    Object.entries(uiState.screens).forEach(([name, screen]) => {
        if (screen) {
             if (name === screenName) {
                 console.log(`  Showing screen element: ${name}`);
                 screen.style.display = 'block'; // Or flex, grid, etc.
                 
                 // Special logic for game board screen
                 if (name === 'gameBoard') {
                     // Force board redraw when showing game board
                     setTimeout(() => {
                         try {
                             console.log("Forcing board redraw on gameBoard show");
                             // Make sure the canvas is ready
                             const canvas = document.getElementById('board-canvas');
                             if (!canvas) {
                                 console.error("Board canvas not found when showing game board!");
                                 return;
                             }
                             
                             // Ensure the board setup has been initialized
                             setupBoard().then(() => {
                                 drawBoard();
                                 updatePlayerInfo();
                                 updateGameControls();
                             }).catch(err => {
                                 console.error("Error setting up board:", err);
                             });
                         } catch (error) {
                             console.error("Error in gameBoard screen initialization:", error);
                         }
                     }, 100);
                 }
             } else {
                 screen.style.display = 'none';
             }
        } else {
             console.warn(`Screen element ${name} not found during showScreen.`);
        }
    });
}

/** Sets up the role selection cards based on player count */
function setupRoleSelectionUI(playerCount) {
    const container = uiState.elements.roleSelectionContainer;
    container.innerHTML = `<h2>Player ${Object.keys(uiState.dynamic.playerRoleAssignments).length + 1} / ${playerCount}: Choose Your Role</h2>`;
    uiState.dynamic.playerRoleAssignments = {};
    const availableRoles = Object.keys(PLAYER_ROLES);

    const cardGrid = document.createElement('div');
    cardGrid.classList.add('role-card-grid');

    availableRoles.forEach(roleKey => {
        const roleData = PLAYER_ROLES[roleKey];
        const card = document.createElement('div');
        card.classList.add('role-card');
        card.dataset.roleKey = roleKey;

        // --- Accessibility Fix: Add unique ID and 'for' attribute --- 
        const inputId = `player-name-${roleKey}`; // Create unique ID
        card.innerHTML = `\n            <h3>${roleData.name}</h3>\n            <div class=\"role-description\">\n                 <strong>Starting Resources:</strong><br>\n                 &nbsp;&nbsp;Knowledge: ${roleData.startingResources.knowledge}<br>\n                 &nbsp;&nbsp;Money: ${roleData.startingResources.money}<br>\n                 &nbsp;&nbsp;Influence: ${roleData.startingResources.influence}<br>\n                 <strong>Ability:</strong> ${roleData.abilityDescription}<br>\n                 <strong>Opposes:</strong> ${roleData.opposingRole}\n            </div>\n            <div class=\"player-input-area\">\n                 <label for=\"${inputId}\">Player Name:</label> \n                 <input type=\"text\" placeholder=\"Player Name\" class=\"player-name\" id=\"${inputId}\">\n            </div>\n            <button class=\"confirm-role-btn\">Select This Role</button>\n        `;
        // --- End Accessibility Fix ---

        const confirmBtn = card.querySelector('.confirm-role-btn');
        confirmBtn.addEventListener('click', () => handleRoleCardConfirm(roleKey, card));

        cardGrid.appendChild(card);
    });
    container.appendChild(cardGrid);
}

/** Handles clicking the confirm button on a role card */
function handleRoleCardConfirm(roleKey, cardElement) {
    const currentAssignments = uiState.dynamic.playerRoleAssignments;
    const gameState = getGameState();
    const humanPlayerCount = gameState.humanPlayerCount;
    const currentSelectionPlayerIndex = Object.keys(currentAssignments).length;

    if (currentSelectionPlayerIndex >= humanPlayerCount) {
        console.warn("Attempted to select role after all human players assigned.");
        return;
    }

    const nameInput = cardElement.querySelector('.player-name');
    const name = nameInput.value.trim() || `Player ${currentSelectionPlayerIndex + 1}`;
    const isHuman = true;

    console.log(`Player ${currentSelectionPlayerIndex + 1} attempting to select ${roleKey}`);

    const addedPlayer = addPlayer(name, roleKey, isHuman);

    if (addedPlayer) {
        uiState.dynamic.playerRoleAssignments[currentSelectionPlayerIndex] = roleKey;
        cardElement.classList.add('role-selected');
        cardElement.querySelector('.confirm-role-btn').disabled = true;
        cardElement.querySelector('.confirm-role-btn').textContent = `Selected by Player ${currentSelectionPlayerIndex + 1}`;
        nameInput.disabled = true;

        document.querySelectorAll('.role-card:not(.role-selected) .confirm-role-btn').forEach(btn => btn.disabled = true);

        const nextPlayerIndex = Object.keys(uiState.dynamic.playerRoleAssignments).length;
        if (nextPlayerIndex >= humanPlayerCount) {
            console.log("All human roles selected. Triggering CPU assignment...");
            assignRemainingCpuRoles().then(() => {
                console.log("CPU assignment complete. Attempting to advance to turn order phase...");
                if (advanceToTurnOrderPhase()) {
                    console.log("Successfully advanced to TURN_ORDER phase. Setting up UI.");
                    setupTurnOrderUI();
                    showScreen('turnOrder');
                } else {
                    console.error("Failed to advance game state to TURN_ORDER phase.");
                    alert("Error preparing for turn order. Please check console.");
                }
            }).catch(err => {
                console.error("Error during CPU assignment or UI transition:", err);
                alert("Error setting up CPU players. Please check console.");
            });
        } else {
            const titleElement = uiState.elements.roleSelectionContainer.querySelector('h2');
            if (titleElement) {
                titleElement.textContent = `Player ${nextPlayerIndex + 1} / ${humanPlayerCount}: Choose Your Role`;
            }
            document.querySelectorAll('.role-card:not(.role-selected) .confirm-role-btn').forEach(btn => btn.disabled = false);
        }
    } else {
        alert(`Could not select role ${PLAYER_ROLES[roleKey].name}. Is it already taken?`);
    }
}

// Setup turn order UI (Placeholder - just shows player names initially)
function setupTurnOrderUI() {
     const container = uiState.elements.turnOrderContainer;
     container.innerHTML = '<h3>Roll for Turn Order</h3>'; // Clear previous, add title
     const players = getPlayers(); // Use the function from players.js
     
     players.forEach(player => {
         const p = document.createElement('p');
         p.textContent = `${player.name} (${player.role})`;
         // Add placeholder for roll result if needed later
         container.appendChild(p);
     });
     // Ensure the roll button is visible and enabled
     uiState.elements.rollTurnOrderBtn.disabled = false;
     uiState.elements.rollTurnOrderBtn.textContent = 'Roll Dice for Order';
     container.appendChild(uiState.elements.rollTurnOrderBtn); // Append button if not already there
}

// Update player info display (resources, current player name)
export function updatePlayerInfo() {
    const player = getCurrentPlayer();
    if (!player) {
        // Clear display if no current player (e.g., before game start)
        if(uiState.elements.currentPlayerName) uiState.elements.currentPlayerName.textContent = '-';
        if(uiState.elements.knowledgeCount) uiState.elements.knowledgeCount.textContent = '0';
        if(uiState.elements.moneyCount) uiState.elements.moneyCount.textContent = '0';
        if(uiState.elements.influenceCount) uiState.elements.influenceCount.textContent = '0';
        return;
    }

    console.log(`Updating UI for current player: ${player.name}`);
    if(uiState.elements.currentPlayerName) {
         uiState.elements.currentPlayerName.textContent = `${player.name} (${player.role})`;
    }
    // Use knowledge, money, influence as per players.js and outline
    if(uiState.elements.knowledgeCount) {
         uiState.elements.knowledgeCount.textContent = player.resources.knowledge ?? 0;
    }
     if(uiState.elements.moneyCount) {
         uiState.elements.moneyCount.textContent = player.resources.money ?? 0;
     }
    if(uiState.elements.influenceCount) {
        uiState.elements.influenceCount.textContent = player.resources.influence ?? 0;
    }
    
    // TODO: Add display for special ability used status if needed
    // TODO: Update player token position on the board canvas (requires board drawing logic)
}

/**
 * Displays a card popup with card details.
 * @param {object} card - The card object to display.
 * @param {string} deckType - The type of deck the card came from (e.g., 'PURPLE', 'END_OF_TURN').
 * @param {object} player - The player who drew the card (needed for role-specific effects).
 * @param {function} closeCallback - Function to call when the popup is closed.
 */
export function showCard(card, deckType, player, closeCallback) { 
    console.log("Showing card:", card, "Deck:", deckType, "Player:", player);
    const popup = uiState.elements.cardPopup;
    const titleEl = uiState.elements.cardTitle;
    const descEl = uiState.elements.cardDescription;
    const effectsEl = uiState.elements.cardEffects;
    const showDetailsBtn = uiState.elements.showCardDetailsBtn;
    const closeBtn = uiState.elements.closeCardBtn;

    if (!popup || !titleEl || !descEl || !effectsEl || !showDetailsBtn || !closeBtn) {
        console.error("Card popup elements missing in uiState! Check HTML and element IDs.");
        return;
    }
    console.log("Showing card popup for:", card.name); // Use name

    // 1. Populate static content
    titleEl.textContent = card.name || 'Card';
    
    // --- Display Resource Changes --- 
    let resourceChangesHTML = '';
    if (Array.isArray(card.effects)) { // Special Event Card Effects
        card.effects.forEach(effect => {
            if (effect.type === 'RESOURCE_CHANGE' && effect.changes) {
                const formattedChanges = formatResourceChanges(effect.changes);
                if (formattedChanges) {
                     // Indicate target if not SELF (or implied SELF)
                     let targetText = '';
                     if (effect.target === 'OTHER') {
                         targetText = ' (Target: Other)';
                     } else if (effect.target && effect.target !== 'SELF') {
                         targetText = ` (Target: ${effect.target})`; // For future target types
                     }
                     resourceChangesHTML += `<p><span class="effect-icon">💰</span> <strong>Effect${targetText}:</strong> ${formattedChanges}</p>`;
                }
            } 
            // Add handling for other effect types with corresponding icons
            else if (effect.type === 'MOVEMENT' && effect.spaces) {
                resourceChangesHTML += `<p><span class="effect-icon">🚶</span> <strong>Effect:</strong> Move ${effect.spaces > 0 ? '+' : ''}${effect.spaces} spaces${effect.target === 'OTHER' ? ' (Target: Other)' : ''}</p>`;
            } else if (effect.type === 'SKIP_TURN') {
                resourceChangesHTML += `<p><span class="effect-icon">⏭️</span> <strong>Effect:</strong> Skip Turn${effect.target === 'OTHER' ? ' (Target: Other)' : ''}</p>`;
            } else if (effect.type === 'STEAL') {
                resourceChangesHTML += `<p><span class="effect-icon">🔄</span> <strong>Effect:</strong> Steal ${effect.amount} ${effect.resource}${effect.target === 'OTHER' ? ' (Target: Other)' : ''}</p>`;
            } else if (effect.type === 'ALLIANCE_OFFER') {
                resourceChangesHTML += `<p><span class="effect-icon">🤝</span> <strong>Effect:</strong> Alliance Offer</p>`;
            }
        });
    } else if (typeof card.effects === 'object') { // End of Turn Card Effects (Show general idea, details on click)
        resourceChangesHTML += `<p><span class="effect-icon">💡</span><i>(Resource effects vary by role - click below for details)</i></p>`;
    }
    
    // Format the description with both the card description and effects
    descEl.innerHTML = `<div class="card-description">${card.description || ''}</div>
                        <div class="card-effects-summary">${resourceChangesHTML}</div>`;

    // 2. Set initial visibility state for Explanation
    effectsEl.innerHTML = ''; // Clear previous effects/explanation
    effectsEl.style.display = 'none';
    showDetailsBtn.style.display = 'block'; 
    showDetailsBtn.disabled = false;

    // 3. Add listener for the 'Show Details' button (handles explanations)
    // Remove previous listener first
    const newShowDetailsBtn = showDetailsBtn.cloneNode(true);
    showDetailsBtn.parentNode.replaceChild(newShowDetailsBtn, showDetailsBtn);
    uiState.elements.showCardDetailsBtn = newShowDetailsBtn;

    newShowDetailsBtn.addEventListener('click', () => {
        console.log("Show Card Details button clicked.");
        // Generate and display explanation HTML
        let explanationHTML = '';
        if (card.effects) {
             if (deckType === 'END_OF_TURN' && player && player.role) {
                // End of Turn Card: Show explanations AND resource changes for ALL roles, highlight current player's
                explanationHTML += "<p><strong>Role Effects:</strong></p><ul>";
                for (const roleName in card.effects) {
                    if (card.effects.hasOwnProperty(roleName)) {
                        const roleEffect = card.effects[roleName];
                        const explanation = roleEffect.explanation || 'No explanation provided.';
                        let resourceChangeText = '';
                        
                        // Format resource changes if they exist
                        if (roleEffect.changes) {
                             const formattedChanges = formatResourceChanges(roleEffect.changes);
                             if (formattedChanges) {
                                 resourceChangeText = `(${formattedChanges}) `; 
                             }
                        }
                        
                        // Combine role, changes, and explanation
                        const fullText = `${roleName}: ${resourceChangeText}${explanation}`;
                        
                        // Highlight the current player's role
                        if (roleName === player.role) {
                            explanationHTML += `<li class="current-role"><strong>${fullText}</strong></li>`;
                        } else {
                            explanationHTML += `<li>${fullText}</li>`;
                        }
                    }
                }
                explanationHTML += "</ul>";
             } else {
                  // Special Event Card: Show standardized effect explanation
                  explanationHTML = `<p><i>This card applies the effects described above.</i></p>`;
             }
        } else {
             explanationHTML = '(No effects listed)';
        }
        // Use the card-effects div, but the content is now explanation-focused
        effectsEl.innerHTML = explanationHTML; 
        effectsEl.style.display = 'block'; // Show explanation area
        newShowDetailsBtn.style.display = 'none'; // Hide button
    }, { once: true }); // Only trigger once per showing

    // 4. Set card style class
    popup.className = 'popup card-popup'; // Reset classes
    if (deckType) { 
        popup.classList.add(`card-${deckType.toLowerCase()}`);
    } else if (card.color) {
        console.warn("showCard called without deckType, falling back to card.color");
        popup.classList.add(`card-${card.color.toLowerCase()}`);
    }
    
    // 5. Setup Close button callback
    const newCloseButton = closeBtn.cloneNode(true);
    closeBtn.parentNode.replaceChild(newCloseButton, closeBtn);
    uiState.elements.closeCardBtn = newCloseButton; // Update reference

    newCloseButton.addEventListener('click', () => {
        hideCard();
        if (closeCallback) {
            console.log("Close card button clicked, invoking callback...");
            closeCallback(card, deckType, player); 
        }
    }, { once: true }); 

    // 6. Show the popup with animation
    popup.style.display = 'flex';
    const popupContent = popup.querySelector('.popup-content');
    if (popupContent) {
        // Remove any existing animation class first
        popupContent.classList.remove('card-flip');
        
        // Force a reflow to ensure the animation plays again
        void popupContent.offsetWidth;
        
        // Add the animation class
        popupContent.classList.add('card-flip');
        
        // Remove animation class after it completes to allow future animations
        setTimeout(() => {
            popupContent.classList.remove('card-flip');
        }, 500);
    }
}

// Hide card popup
export function hideCard() {
    const popup = uiState.elements.cardPopup;
    const effectsEl = uiState.elements.cardEffects;
    const showDetailsBtn = uiState.elements.showCardDetailsBtn;

    if (!popup) return;
    console.log("Hiding card popup");
    
    // Add reverse animation
    const popupContent = popup.querySelector('.popup-content');
    if (popupContent) {
        popupContent.style.animation = 'cardFlip 0.3s reverse';
        // Wait for animation to complete before hiding
        setTimeout(() => {
            popup.style.display = 'none';
            // Reset animation for next time
            popupContent.style.animation = '';
        }, 300);
    } else {
        popup.style.display = 'none';
    }
    
    // Reset effects visibility for next time
    if (effectsEl) {
        effectsEl.style.display = 'none';
        effectsEl.innerHTML = '';
    }
    if (showDetailsBtn) {
        showDetailsBtn.style.display = 'block'; // Or 'inline-block'
    }
    
    // Stop any deck highlighting
    stopDeckHighlight();
}

// Show end game screen
export function showEndGameScreen(rankings) {
    if (!uiState.elements.endGameContainer) return;
    console.log("Showing end game screen.");

    let rankingHTML = '';
    if (rankings && rankings.length > 0) {
         rankingHTML = rankings
            .filter(player => player && player.name) // Add filter to skip invalid entries
            .map((player, index) => {
             // Now 'player' is guaranteed to be a valid object with a name
             // const score = getPlayerScore(player); // Recalculate score if needed, or assume it's done elsewhere
             const score = player.score ?? 0; // Assuming score is calculated and added before this point
             const isFinished = player.finished; 

             return `
                <div class="ranking-item ${isFinished ? 'finished' : ''}">
                    <h3>#${index + 1}: ${player.name} (${player.role}) ${isFinished ? '(Finished)': ''}</h3>
                    <p>Score: ${score}</p> 
                    <p>Knowledge: ${player.resources.knowledge ?? 0}</p>
                    <p>Money: ${player.resources.money ?? 0}</p>
                    <p>Influence: ${player.resources.influence ?? 0}</p>
                </div>
            `;
         }).join('');
    } else {
        rankingHTML = '<p>Could not determine rankings.</p>';
    }

    uiState.elements.endGameContainer.innerHTML = `
        <h2>Game Over!</h2>
        <div class="rankings">
            ${rankingHTML}
        </div>
    `; // Note: newGameBtn is separate in the HTML, no need to add it here.
    
    showScreen('endGame');
}

// Update game controls (enable/disable based on current player)
export function updateGameControls() {
    const currentGameState = getGameState();
    const player = getCurrentPlayer();
    
    // Default state: disable everything
    let rollEnabled = false;
    let endTurnEnabled = false;
    let abilityEnabled = false; // Placeholder

    if (player && player.isHuman && !currentGameState.ended) {
        switch (currentGameState.currentPhase) {
            case 'PLAYING': // ONLY enable roll in PLAYING phase
                rollEnabled = true;
                endTurnEnabled = false; // End turn is only enabled after card interaction (via callback)
                // abilityEnabled = canUseAbility(player); // Need ability logic
                break;
            // If waiting for a human action, disable roll/end turn
            case 'AWAITING_PATH_CHOICE':
            case 'AWAITING_JUNCTION_CHOICE':
                 rollEnabled = false;
                 endTurnEnabled = false;
                 break;
            case 'AWAITING_CARD_CLICK': // Disable controls while card is shown
                 rollEnabled = false;
                 endTurnEnabled = false;
                 break;
        }
        
        // Special case: If player finished, disable controls
        if (player.finished) {
            rollEnabled = false;
            endTurnEnabled = false;
        }
        
    } else {
        // AI turn or game ended, disable controls
        rollEnabled = false;
        endTurnEnabled = false;
        abilityEnabled = false;
    }
    
    uiState.elements.rollDiceBtn.disabled = !rollEnabled;
    uiState.elements.endTurnBtn.disabled = !endTurnEnabled; // End turn button is generally disabled unless explicitly enabled
    // uiState.elements.abilityBtn.disabled = !abilityEnabled; // Uncomment if ability button exists

    console.log(`UI Controls Updated: Roll=${rollEnabled}, EndTurn=${endTurnEnabled}, Phase=${currentGameState.currentPhase}`);

    // Remove old highlighting call
    // highlightEOTDeckRegions(); 
}

/**
 * Fallback to render a text-based die with the given value if images fail to load
 * @param {HTMLElement} diceElement - The dice DOM element
 * @param {number} value - The dice value to show (1-6)
 */
function renderTextDice(diceElement, value) {
    // Clear any existing content
    diceElement.innerHTML = '';
    diceElement.style.backgroundImage = 'none';
    diceElement.style.backgroundColor = 'white';
    diceElement.style.color = 'black';
    diceElement.style.fontSize = '60px';
    diceElement.style.fontWeight = 'bold';
    diceElement.style.display = 'flex';
    diceElement.style.justifyContent = 'center';
    diceElement.style.alignItems = 'center';
    
    // Create a text node with the value
    const textNode = document.createTextNode(value);
    diceElement.appendChild(textNode);
    
    console.log(`Rendered text-based die with value ${value}`);
}

/**
 * Check if we can load the dice images, with error handling
 */
function checkDiceImagesExist() {
    return new Promise((resolve) => {
        const testImg = new Image();
        testImg.onload = () => {
            console.log("Dice images verified to exist!");
            resolve(true);
        };
        testImg.onerror = () => {
            console.error("Cannot load dice images - will use text fallback!");
            resolve(false);
        };
        testImg.src = 'assets/dice/dice-1.png';
        
        // Set a timeout in case the image neither loads nor errors out
        setTimeout(() => {
            console.warn("Dice image load timed out - using text fallback");
            resolve(false);
        }, 1000);
    });
}

/**
 * Animates a dice roll by changing the image of a dice element.
 * @param {number} finalRoll - The final roll value (1-6) to display.
 */
function animateDiceRoll(finalRoll) {
    console.log(`Animating dice roll, final value: ${finalRoll}`);
    const diceAnimationArea = uiState.elements.diceAnimationArea;
    const diceFace = uiState.elements.diceFace;
    const diceRollDisplay = uiState.elements.diceRollDisplay;
    
    if (!diceAnimationArea || !diceFace) {
        console.error("Dice animation elements not found!", diceAnimationArea, diceFace);
        // Fallback to just showing text
        if (diceRollDisplay) {
            diceRollDisplay.textContent = `You rolled a ${finalRoll}`;
            diceRollDisplay.style.display = 'block';
        }
        return;
    }
    
    // Remove any existing class except 'dice'
    diceFace.className = 'dice';
    
    // Position the dice animation area in the center of the game board
    positionDiceAnimationInCenter();
    
    // Show the animation area
    diceAnimationArea.style.display = 'block';
    console.log("Dice animation area display set to:", diceAnimationArea.style.display);
    
    // Define animation duration and frames
    const animationDuration = 3000; // 3 seconds animation
    const frames = 20; // More frames for a longer animation
    const frameDelay = animationDuration / frames; // ms between frames
    
    // Check if images exist and animate accordingly
    checkDiceImagesExist().then(imagesExist => {
        let currentFrame = 0;
        
        const animationInterval = setInterval(() => {
            // For all but the last frame, show a random roll
            if (currentFrame < frames - 1) {
                const randomRoll = Math.floor(Math.random() * 6) + 1;
                if (imagesExist) {
                    // Use image-based dice
                    diceFace.style.backgroundImage = `url('assets/dice/dice-${randomRoll}.png')`;
                    diceFace.style.backgroundSize = 'contain';
                    diceFace.style.backgroundRepeat = 'no-repeat';
                } else {
                    // Use text-based dice
                    renderTextDice(diceFace, randomRoll);
                }
                console.log(`Dice animation frame ${currentFrame}, showing value ${randomRoll}`);
            } else {
                // Last frame shows the actual roll result
                if (imagesExist) {
                    // Use image-based dice
                    diceFace.style.backgroundImage = `url('assets/dice/dice-${finalRoll}.png')`;
                    diceFace.style.backgroundSize = 'contain';
                    diceFace.style.backgroundRepeat = 'no-repeat';
                } else {
                    // Use text-based dice
                    renderTextDice(diceFace, finalRoll);
                }
                console.log(`Dice animation completed, showing final value ${finalRoll}`);
                
                // Clear the interval
                clearInterval(animationInterval);
                
                // Update the roll text for accessibility
                if (diceRollDisplay) {
                    diceRollDisplay.textContent = `You rolled a ${finalRoll}`;
                    diceRollDisplay.style.display = 'block';
                }
            }
            currentFrame++;
        }, frameDelay);
        
        // Store the current animation interval ID so it can be cleared if needed
        uiState.dynamic.diceAnimationInterval = animationInterval;
    });
}

/**
 * Positions the dice animation area in the center of the game board
 */
function positionDiceAnimationInCenter() {
    const diceAnimationArea = uiState.elements.diceAnimationArea;
    const boardContainer = document.getElementById('board-container');
    
    if (!diceAnimationArea) {
        console.error("Dice animation area element not found!");
        return;
    }
    
    if (!boardContainer) {
        console.error("Board container element not found! Using body as parent.");
        // If board container not found, append to body instead
        document.body.appendChild(diceAnimationArea);
    } else {
        // Remove it from its current position in the DOM
        if (diceAnimationArea.parentNode) {
            diceAnimationArea.parentNode.removeChild(diceAnimationArea);
        }
        
        // Add it to the board container
        boardContainer.appendChild(diceAnimationArea);
    }
    
    // Style it for center positioning with high z-index
    diceAnimationArea.style.position = 'absolute';
    diceAnimationArea.style.left = '50%';
    diceAnimationArea.style.top = '50%';
    diceAnimationArea.style.transform = 'translate(-50%, -50%)';
    diceAnimationArea.style.zIndex = '9999'; // Very high z-index to ensure visibility
    diceAnimationArea.style.width = '150px';  // Make it larger
    diceAnimationArea.style.height = '150px';
    
    // Debug output to help diagnose visibility issues
    console.log("Positioned dice animation in center. Styles:", 
        diceAnimationArea.style.position,
        diceAnimationArea.style.zIndex,
        diceAnimationArea.style.width,
        diceAnimationArea.style.height);
}

/**
 * Hides the dice animation
 */
function hideDiceAnimation() {
    const diceAnimationArea = uiState.elements.diceAnimationArea;
    if (diceAnimationArea) {
        diceAnimationArea.style.display = 'none';
    }
    
    // Clear any ongoing animation interval
    if (uiState.dynamic.diceAnimationInterval) {
        clearInterval(uiState.dynamic.diceAnimationInterval);
        uiState.dynamic.diceAnimationInterval = null;
    }
}

// Simple delay helper
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// --- Choice Popups --- 

/**
 * Prompts the player to choose a path.
 * @param {Array<Object>} pathOptions - Array of path options with text, coords, color properties
 * @param {Function} callback - Function to call with the selected option's coordinates
 */
export function promptForPathChoice(pathOptions, callback) {
    console.log("Prompting for path choice with options:", pathOptions);
    const popup = uiState.elements.pathChoicePopup;
    const optionsContainer = uiState.elements.pathChoiceOptions;

    if (!popup || !optionsContainer) {
        console.error("Path choice popup or options container not found!");
        callback(null); // Indicate error or cancellation
        return;
    }

    optionsContainer.innerHTML = ''; // Clear previous options

    // Create buttons for each option
    pathOptions.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option.text; // Use the path name
        
        // Add path-specific color class
        button.classList.add('path-choice-btn');
        
        // Add color-specific class
        if (option.color) {
            button.classList.add(`path-${option.color}`);
        }
        
        button.addEventListener('click', () => {
            playClickSound();
            console.log(`Path choice selected: ${option.text}, Coords:`, option.coords);
            popup.style.display = 'none'; // Hide popup
            // Pass both coordinates and pathName to the callback
            callback(option.coords, option.pathName); 
        });
        optionsContainer.appendChild(button);
    });

    popup.style.display = 'flex'; // Show popup
}

/**
 * Displays a junction choice popup to let the player select their path.
 * 
 * @param {Array<object>} options - Array of path options
 * @param {function} callback - Function to call with the selected option
 */
export function promptForJunctionChoice(options, callback) {
    console.log("Prompting for junction choice with options:", options);
    const popup = uiState.elements.junctionChoicePopup;
    const optionsContainer = uiState.elements.junctionChoiceOptions;
    
    if (!popup || !optionsContainer) {
        console.error("Junction choice popup or options container not found!");
        callback(null);
        return;
    }
    
    optionsContainer.innerHTML = ''; // Clear previous options
    
    // Create buttons for each option
    options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option.text;
        
        // Add junction-specific styling
        button.classList.add('path-choice-btn');
        
        // Add color-specific class
        if (option.color) {
            button.classList.add(`path-${option.color}`);
        }
        
        button.addEventListener('click', () => {
            playClickSound();
            popup.style.display = 'none';
            callback(option);
        });
        
        optionsContainer.appendChild(button);
    });
    
    popup.style.display = 'flex';
}

/**
 * Plays a sound effect for valid clicks.
 */
function playClickSound() {
    // Simple beep using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = 800; // Higher pitch for valid moves
        gainNode.gain.value = 0.1; // Low volume
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1); // Short duration
    } catch (e) {
        console.warn("Could not play click sound", e);
    }
}

/**
 * Plays an error sound for invalid clicks.
 */
function playErrorSound() {
    // Simple error beep using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = 300; // Lower pitch for errors
        gainNode.gain.value = 0.1; // Low volume
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2); // Longer duration
    } catch (e) {
        console.warn("Could not play error sound", e);
    }
}

/**
 * Shows a temporary message on the screen.
 */
function showMessage(text) {
    // Create or reuse message element
    let messageEl = document.getElementById('game-message');
    
    if (!messageEl) {
        messageEl = document.createElement('div');
        messageEl.id = 'game-message';
        messageEl.style.position = 'fixed';
        messageEl.style.top = '50%';
        messageEl.style.left = '50%';
        messageEl.style.transform = 'translate(-50%, -50%)';
        messageEl.style.padding = '10px 20px';
        messageEl.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        messageEl.style.color = 'white';
        messageEl.style.borderRadius = '5px';
        messageEl.style.fontSize = '18px';
        messageEl.style.zIndex = '1000';
        document.body.appendChild(messageEl);
    }
    
    // Set message and animate
    messageEl.textContent = text;
    messageEl.style.opacity = '1';
    messageEl.style.display = 'block';
    
    // Fade out after delay
    setTimeout(() => {
        messageEl.style.transition = 'opacity 0.5s';
        messageEl.style.opacity = '0';
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 500);
    }, 1500);
}

/**
 * Provides visual feedback for a clicked space.
 */
function flashSpace(x, y, color = 'white') {
    const canvas = uiState.elements.boardCanvas;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Create and animate a flash effect
    let opacity = 1;
    let radius = 20;
    let startTime = Date.now();
    
    function animate() {
        const elapsed = Date.now() - startTime;
        if (elapsed > 300) return; // Stop after 300ms
        
        // Clear with transparent (to not affect the board)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBoard(); // Redraw the board
        
        // Draw flash circle
        opacity = 1 - (elapsed / 300);
        radius = 20 + (elapsed / 10);
        
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Function to display the trade prompt modal
export function promptForTradeResponse(sourcePlayer, targetPlayer, offerDetails, requestDetails, isSwap, callback) {
    console.log(`UI: Prompting ${targetPlayer.role} (Player ${targetPlayer.id}) for trade from ${sourcePlayer.role} (Player ${sourcePlayer.id})`);

    const modal = document.getElementById('trade-prompt-modal');
    const title = document.getElementById('trade-prompt-title');
    const details = document.getElementById('trade-prompt-details');
    const acceptBtn = document.getElementById('trade-accept-btn');
    const rejectBtn = document.getElementById('trade-reject-btn');

    title.textContent = `Trade Offer from ${sourcePlayer.role}`;

    // Helper to format resource details
    const formatResources = (resObj) => {
        if (!resObj || Object.keys(resObj).length === 0) return 'nothing';
        return Object.entries(resObj)
                     .map(([key, value]) => `${value} ${key}`)
                     .join(', ');
    };

    let detailsHTML;
    if (isSwap) {
        detailsHTML = `
            <p>${sourcePlayer.role} proposes swapping:</p>
            <p><strong>They give:</strong> ${formatResources(offerDetails)}</p>
            <p><strong>You give:</strong> ${formatResources(requestDetails)}</p>
        `;
    } else {
        detailsHTML = `
            <p>${sourcePlayer.role} offers:</p>
            <p><strong>They give:</strong> ${formatResources(offerDetails)}</p>
            <p><strong>In exchange for:</strong> ${formatResources(requestDetails)}</p>
        `;
    }
    details.innerHTML = detailsHTML;

    // Ensure buttons only trigger callback once
    const acceptHandler = () => {
        console.log("Trade Accepted by UI");
        cleanup();
        callback(true); // Call the game logic callback with true (accepted)
    };
    const rejectHandler = () => {
        console.log("Trade Rejected by UI");
        cleanup();
        callback(false); // Call the game logic callback with false (rejected)
    };

    const cleanup = () => {
        modal.style.display = 'none';
        acceptBtn.removeEventListener('click', acceptHandler);
        rejectBtn.removeEventListener('click', rejectHandler);
    };

    acceptBtn.addEventListener('click', acceptHandler);
    rejectBtn.addEventListener('click', rejectHandler);

    modal.style.display = 'block'; // Show the modal
}

// Ensure updatePlayerUI is exported if not already
// export function updatePlayerUI(player) { ... }

/**
 * Clears all messages from the game log area.
 */
export function clearMessages() {
    const messageContainer = document.getElementById('messageContainer'); // Get the container
    if (messageContainer) {
        messageContainer.innerHTML = ''; // Clear its content
        console.log("Message log cleared.");
    }
}

/**
 * Logs a message to the UI (e.g., in a scrolling text area).
 * Currently disabled from adding to DOM to prevent display on screen.
 * @param {string} message - The message to display.
 */
export function logMessage(message) {
    const messageContainer = document.getElementById('messageContainer');
    if (!messageContainer) {
        console.warn("Message container not found in UI, cannot log message:", message);
        return;
    }
    // --- DOM manipulation commented out to prevent display --- 
    // const messageElement = document.createElement('p');
    // messageElement.textContent = message;
    // messageContainer.appendChild(messageElement);
    // // Auto-scroll to the bottom
    // messageContainer.scrollTop = messageContainer.scrollHeight;
    // --- End commented out section ---
    
    // Still log to console for debugging
    console.log("Game Log Message (Hidden from UI):", message);
}

/**
 * Formats a resource changes object into a readable string.
 * Example: { money: 5, knowledge: -3 } -> "+5 Money, -3 Knowledge"
 * @param {object} changes - The resource changes object.
 * @returns {string} - A formatted string, or empty string if no changes.
 */
function formatResourceChanges(changes) {
    if (!changes || typeof changes !== 'object' || Object.keys(changes).length === 0) {
        return '';
    }

    return Object.entries(changes)
        .map(([resource, value]) => {
            const sign = value >= 0 ? '+' : ''; // Negative sign is automatic
            // Capitalize resource name
            const resourceName = resource.charAt(0).toUpperCase() + resource.slice(1);
            return `${sign}${value} ${resourceName}`;
        })
        .join(', ');
}

// Debug - Show clicked region visually
export function highlightClickedDeckRegion(clickedDeckKey) {
    const canvas = uiState.elements.boardCanvas;
    if (!canvas || !clickedDeckKey) return;
    
    const ctx = canvas.getContext('2d');
    
    // Draw a temporary highlight
    if (DECK_REGIONS[clickedDeckKey]) {
        const [minX, minY, maxX, maxY] = DECK_REGIONS[clickedDeckKey];
        // Scale the coordinates to match canvas size
        const [scaledMinX, scaledMinY] = scaleCoordinates(minX, minY);
        const [scaledMaxX, scaledMaxY] = scaleCoordinates(maxX, maxY);
        
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = 'yellow';
        ctx.fillRect(scaledMinX, scaledMinY, scaledMaxX - scaledMinX, scaledMaxY - scaledMinY);
        ctx.restore();
        
        // Clear the highlight after a short delay
        setTimeout(() => {
            drawBoard(); // Redraw the board
        }, 300);
    }
}

/**
 * Highlight deck regions when the player needs to draw a card
 * @param {string} requiredDeckType - The type of deck that needs to be drawn (e.g., 'PURPLE', 'END_OF_TURN')
 */
export function highlightDeckRegions(requiredDeckType) {
    const canvas = uiState.elements.boardCanvas;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.save();
    
    // Determine which regions to highlight
    const regionsToHighlight = [];
    
    if (requiredDeckType === 'END_OF_TURN') {
        // Highlight both EOT regions
        regionsToHighlight.push('EOT1', 'EOT2');
    } else {
        // Find the deck region matching the required deck type
        for (const regionKey in DECK_REGIONS) {
            if (REGION_TO_DECK_TYPE[regionKey] === requiredDeckType) {
                regionsToHighlight.push(regionKey);
                break;
            }
        }
    }
    
    // Apply pulsing highlight effect
    let opacity = 0.3;
    let increasing = true;
    const pulseInterval = setInterval(() => {
        // Clear previous highlighting
        drawBoard();
        
        // Apply current opacity
        ctx.globalAlpha = opacity;
        ctx.fillStyle = 'yellow';
        
        // Draw all regions to highlight
        regionsToHighlight.forEach(regionKey => {
            if (DECK_REGIONS[regionKey]) {
                const [minX, minY, maxX, maxY] = DECK_REGIONS[regionKey];
                // Scale the coordinates to match canvas size
                const [scaledMinX, scaledMinY] = scaleCoordinates(minX, minY);
                const [scaledMaxX, scaledMaxY] = scaleCoordinates(maxX, maxY);
                
                ctx.fillRect(scaledMinX, scaledMinY, scaledMaxX - scaledMinX, scaledMaxY - scaledMinY);
            }
        });
        
        // Update opacity for next pulse
        if (increasing) {
            opacity += 0.03;
            if (opacity >= 0.5) increasing = false;
        } else {
            opacity -= 0.03;
            if (opacity <= 0.2) increasing = true;
        }
    }, 100);
    
    // Store the interval ID for later cleanup
    uiState.dynamic.deckHighlightInterval = pulseInterval;
    
    // Reset state after a short duration
    setTimeout(() => {
        clearInterval(pulseInterval);
        uiState.dynamic.deckHighlightInterval = null;
        drawBoard(); // Restore normal board
    }, 5000); // Stop highlighting after 5 seconds
    
    ctx.restore();
}

/**
 * Stop highlighting deck regions
 */
export function stopDeckHighlight() {
    if (uiState.dynamic.deckHighlightInterval) {
        clearInterval(uiState.dynamic.deckHighlightInterval);
        uiState.dynamic.deckHighlightInterval = null;
    }
    
    if (uiState.dynamic.cyanHighlightInterval) {
        clearInterval(uiState.dynamic.cyanHighlightInterval);
        uiState.dynamic.cyanHighlightInterval = null;
    }
    
    drawBoard(); // Restore normal board
}

/**
 * Enables the End Turn button after a player has taken their action
 */
export function enableEndTurnButton() {
    if (uiState.elements.endTurnBtn) {
        uiState.elements.endTurnBtn.disabled = false;
    }
}

/**
 * Specifically highlight the cyan deck region to make it more visible to players
 */
export function highlightCyanDeck() {
    const canvas = uiState.elements.boardCanvas;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.save();
    
    // Get cyan deck coordinates
    const [minX, minY, maxX, maxY] = DECK_REGIONS.CYAN;
    
    // Create a pulsing animation specifically for the cyan deck
    let opacity = 0.4; // Start with higher opacity
    let increasing = true;
    const pulseInterval = setInterval(() => {
        // Clear previous highlighting but maintain the board
        drawBoard();
        
        // Draw a more vibrant highlight for the cyan deck
        ctx.globalAlpha = opacity;
        ctx.fillStyle = '#00FFFF'; // Use cyan color for better visibility
        ctx.fillRect(minX, minY, maxX - minX, maxY - minY);
        
        // Add a glowing border
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
        
        // Add label for better identification
        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('CYAN DECK', (minX + maxX) / 2, (minY + maxY) / 2);
        
        // Update opacity for next pulse
        if (increasing) {
            opacity += 0.03;
            if (opacity >= 0.7) increasing = false;
        } else {
            opacity -= 0.03;
            if (opacity <= 0.3) increasing = true;
        }
    }, 100);
    
    // Store the interval ID for later cleanup
    uiState.dynamic.cyanHighlightInterval = pulseInterval;
    
    // Reset state after a longer duration (8 seconds)
    setTimeout(() => {
        clearInterval(pulseInterval);
        uiState.dynamic.cyanHighlightInterval = null;
        drawBoard(); // Restore normal board
    }, 8000);
    
    ctx.restore();
}

function setupTurnOrderScreen() {
    const turnOrderContainer = document.getElementById('turn-order-container');
    turnOrderContainer.innerHTML = '';
    
    const header = document.createElement('h3');
    header.textContent = 'Roll for Turn Order';
    turnOrderContainer.appendChild(header);
    
    // Create player rows
    GAME_DATA.players.forEach(player => {
        const playerDiv = document.createElement('div');
        playerDiv.className = 'turn-order-player';
        playerDiv.id = `turn-order-player-${player.id}`;
        
        const nameSpan = document.createElement('span');
        nameSpan.className = 'player-name';
        nameSpan.textContent = player.name;
        
        const rollResult = document.createElement('span');
        rollResult.className = 'roll-result';
        rollResult.id = `roll-result-${player.id}`;
        rollResult.textContent = '-';
        
        playerDiv.appendChild(nameSpan);
        playerDiv.appendChild(rollResult);
        turnOrderContainer.appendChild(playerDiv);
    });
    
    // Create roll button
    const rollButton = document.createElement('button');
    rollButton.id = 'roll-turn-order-btn';
    rollButton.textContent = 'Roll the Dice';
    rollButton.onclick = rollForTurnOrder;
    turnOrderContainer.appendChild(rollButton);
}

function createDiceElement() {
    const dice = document.createElement('div');
    dice.className = 'dice';
    for (let i = 1; i <= 6; i++) {
        const face = document.createElement('div');
        face.className = `dice-face dice-${i}`;
        for (let d = 0; d < i; d++) {
            const dot = document.createElement('div');
            dot.className = 'dice-dot';
            face.appendChild(dot);
        }
        dice.appendChild(face);
    }
    return dice;
}

function rollForTurnOrder() {
    const rollButton = document.getElementById('roll-turn-order-btn');
    rollButton.disabled = true;
    rollButton.textContent = 'Rolling...';
    
    // Create dice container if not exists
    let diceContainer = document.getElementById('dice-container');
    if (!diceContainer) {
        diceContainer = document.createElement('div');
        diceContainer.id = 'dice-container';
        document.getElementById('turn-order-container').appendChild(diceContainer);
    } else {
        diceContainer.innerHTML = '';
    }
    
    const dice = createDiceElement();
    diceContainer.appendChild(dice);
    
    // Randomize rolls for each player
    const rolls = [];
    GAME_DATA.players.forEach(player => {
        rolls.push({
            playerId: player.id,
            roll: Math.floor(Math.random() * 6) + 1
        });
    });
    
    // Animate dice and reveal results one by one
    animateDiceRolls(dice, rolls, 0);
}

function animateDiceRolls(dice, rolls, index) {
    if (index >= rolls.length) {
        // All rolls done, determine turn order
        processTurnOrderRolls(rolls);
        return;
    }
    
    const currentRoll = rolls[index];
    const resultElement = document.getElementById(`roll-result-${currentRoll.playerId}`);
    const playerElement = document.getElementById(`turn-order-player-${currentRoll.playerId}`);
    
    // Highlight current player
    document.querySelectorAll('.turn-order-player').forEach(el => {
        el.classList.remove('active-roll');
    });
    playerElement.classList.add('active-roll');
    
    // Animate dice roll
    dice.classList.add('rolling');
    
    setTimeout(() => {
        dice.classList.remove('rolling');
        dice.setAttribute('data-face', currentRoll.roll);
        
        // Show result after brief delay
        setTimeout(() => {
            resultElement.textContent = currentRoll.roll;
            
            // Move to next player after a pause
            setTimeout(() => {
                animateDiceRolls(dice, rolls, index + 1);
            }, 800);
        }, 200);
    }, 1000);
}

function processTurnOrderRolls(rolls) {
    // Sort players by roll value (descending)
    rolls.sort((a, b) => b.roll - a.roll);
    
    // Handle ties by re-rolling
    const tiedRolls = findTiedRolls(rolls);
    if (tiedRolls.length > 0) {
        handleTiedRolls(tiedRolls);
        return;
    }
    
    // Set turn order based on roll results
    const turnOrder = rolls.map(roll => roll.playerId);
    GAME_DATA.turnOrder = turnOrder;
    
    // Update UI to show final order
    updateTurnOrderUI(rolls);
    
    // Enable continue button after short delay
    setTimeout(() => {
        const rollButton = document.getElementById('roll-turn-order-btn');
        rollButton.textContent = 'Continue to Game';
        rollButton.disabled = false;
        rollButton.onclick = () => {
            transitionToGameBoard();
        };
    }, 1500);
}

function findTiedRolls(rolls) {
    const tiedGroups = [];
    let currentGroup = [rolls[0]];
    
    for (let i = 1; i < rolls.length; i++) {
        if (rolls[i].roll === currentGroup[0].roll) {
            currentGroup.push(rolls[i]);
        } else {
            if (currentGroup.length > 1) {
                tiedGroups.push([...currentGroup]);
            }
            currentGroup = [rolls[i]];
        }
    }
    
    if (currentGroup.length > 1) {
        tiedGroups.push(currentGroup);
    }
    
    return tiedGroups;
}

function handleTiedRolls(tiedGroups) {
    // Handle tie breaking for each group of tied players
    const rollButton = document.getElementById('roll-turn-order-btn');
    rollButton.textContent = 'Roll Tiebreaker';
    rollButton.disabled = false;
    
    // Show tie message
    const tieMessage = document.createElement('div');
    tieMessage.className = 'tie-message';
    tieMessage.textContent = 'We have a tie! Click to roll again for the tied players.';
    document.getElementById('turn-order-container').insertBefore(
        tieMessage, 
        rollButton
    );
    
    // Highlight tied players
    tiedGroups.forEach(group => {
        group.forEach(roll => {
            const playerElement = document.getElementById(`turn-order-player-${roll.playerId}`);
            playerElement.classList.add('tied');
        });
    });
    
    // Set up tiebreaker roll
    rollButton.onclick = () => rollTiebreakers(tiedGroups);
}

function rollTiebreakers(tiedGroups) {
    // Remove tie message if exists
    const tieMessage = document.querySelector('.tie-message');
    if (tieMessage) {
        tieMessage.remove();
    }
    
    // Remove tied class from all players
    document.querySelectorAll('.turn-order-player').forEach(el => {
        el.classList.remove('tied');
    });
    
    // Disable button during roll
    const rollButton = document.getElementById('roll-turn-order-btn');
    rollButton.disabled = true;
    rollButton.textContent = 'Rolling Tiebreaker...';
    
    // Get all current rolls
    const allRolls = [];
    GAME_DATA.players.forEach(player => {
        const resultElement = document.getElementById(`roll-result-${player.id}`);
        const currentRoll = parseInt(resultElement.textContent);
        if (!isNaN(currentRoll)) {
            allRolls.push({
                playerId: player.id,
                roll: currentRoll
            });
        }
    });
    
    // Re-roll for tied groups
    tiedGroups.forEach(group => {
        group.forEach(roll => {
            const index = allRolls.findIndex(r => r.playerId === roll.playerId);
            if (index !== -1) {
                allRolls[index].roll = Math.floor(Math.random() * 6) + 1;
            }
        });
    });
    
    // Animate tie-breaking rolls
    const tieBreakerRolls = [];
    tiedGroups.forEach(group => {
        group.forEach(roll => {
            const newRoll = allRolls.find(r => r.playerId === roll.playerId);
            if (newRoll) {
                tieBreakerRolls.push(newRoll);
            }
        });
    });
    
    // Get dice container
    const diceContainer = document.getElementById('dice-container');
    const dice = diceContainer.querySelector('.dice') || createDiceElement();
    diceContainer.innerHTML = '';
    diceContainer.appendChild(dice);
    
    // Animate tiebreaker rolls
    animateDiceRolls(dice, tieBreakerRolls, 0);
    
    // After all tiebreaker rolls, determine final order
    setTimeout(() => {
        processTurnOrderRolls(allRolls);
    }, (tieBreakerRolls.length * 2000) + 500);
}

function updateTurnOrderUI(rolls) {
    // Visual indication of final order
    rolls.forEach((roll, index) => {
        const playerElement = document.getElementById(`turn-order-player-${roll.playerId}`);
        const orderIndicator = document.createElement('div');
        orderIndicator.className = 'order-indicator';
        orderIndicator.textContent = `#${index + 1}`;
        
        // Remove active-roll class
        playerElement.classList.remove('active-roll');
        
        // Add order class and adjust style
        playerElement.classList.add('order-set');
        playerElement.style.borderLeftColor = index === 0 ? '#FFD700' : 
                                            index === 1 ? '#C0C0C0' : 
                                            index === 2 ? '#CD7F32' : '#555';
        
        // Insert at beginning of div
        playerElement.insertBefore(orderIndicator, playerElement.firstChild);
    });
    
    // Remove dice animation
    const diceContainer = document.getElementById('dice-container');
    setTimeout(() => {
        diceContainer.classList.add('fade-out');
        setTimeout(() => {
            diceContainer.remove();
        }, 500);
    }, 1000);
}

function createPlayerToken(player, position) {
    const token = document.createElement('div');
    token.className = 'player-token';
    token.id = `player-token-${player.id}`;
    token.style.left = `${position.x}px`;
    token.style.top = `${position.y}px`;
    
    const avatar = document.createElement('div');
    avatar.className = 'player-avatar';
    avatar.style.backgroundColor = player.color;
    
    if (player.role) {
        avatar.classList.add(`role-${player.role.toLowerCase()}`);
    }
    
    const initial = document.createElement('div');
    initial.className = 'player-initial';
    initial.textContent = player.name.charAt(0).toUpperCase();
    
    // Add crown for leader
    if (player.role === 'leader') {
        const crown = document.createElement('div');
        crown.className = 'leader-crown';
        crown.textContent = '👑';
        avatar.appendChild(crown);
    }
    
    avatar.appendChild(initial);
    token.appendChild(avatar);
    
    // Add name tag that appears on hover
    const nameTag = document.createElement('div');
    nameTag.className = 'player-name-tag';
    nameTag.textContent = player.name;
    token.appendChild(nameTag);
    
    return token;
}

function showPathChoice(availablePaths, callback) {
    const pathChoicePopup = document.createElement('div');
    pathChoicePopup.className = 'path-choice-popup';
    
    const title = document.createElement('h3');
    title.textContent = 'Choose Your Starting Path';
    pathChoicePopup.appendChild(title);
    
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'path-buttons';
    
    // Map path colors to their class names and hex values
    const pathColorMap = {
        'purple': { class: 'purple', hex: '#9C54DE' },
        'pink': { class: 'pink', hex: '#FF66FF' },
        'blue': { class: 'blue', hex: '#1B3DE5' },
        'cyan': { class: 'cyan', hex: '#00FFFF' }
    };
    
    availablePaths.forEach(path => {
        const pathBtn = document.createElement('button');
        pathBtn.className = `path-button ${pathColorMap[path].class}`;
        pathBtn.textContent = path.charAt(0).toUpperCase() + path.slice(1);
        pathBtn.addEventListener('click', () => {
            document.body.removeChild(pathChoicePopup);
            callback(path);
        });
        buttonContainer.appendChild(pathBtn);
    });
    
    pathChoicePopup.appendChild(buttonContainer);
    document.body.appendChild(pathChoicePopup);
}

function showJunctionChoice(availablePaths, callback) {
    const junctionPopup = document.createElement('div');
    junctionPopup.className = 'path-choice-popup';
    
    const title = document.createElement('h3');
    title.textContent = 'Choose Your Path';
    junctionPopup.appendChild(title);
    
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'path-buttons';
    
    // Map path colors to their class names and hex values
    const pathColorMap = {
        'purple': { class: 'purple', hex: '#9C54DE' },
        'pink': { class: 'pink', hex: '#FF66FF' },
        'blue': { class: 'blue', hex: '#1B3DE5' },
        'cyan': { class: 'cyan', hex: '#00FFFF' }
    };
    
    availablePaths.forEach(path => {
        const pathBtn = document.createElement('button');
        pathBtn.className = `path-button ${pathColorMap[path].class}`;
        pathBtn.textContent = path.charAt(0).toUpperCase() + path.slice(1);
        pathBtn.addEventListener('click', () => {
            document.body.removeChild(junctionPopup);
            callback(path);
        });
        buttonContainer.appendChild(pathBtn);
    });
    
    junctionPopup.appendChild(buttonContainer);
    document.body.appendChild(junctionPopup);
}

function showCardModal(cardType, cardData, callback) {
    const modal = document.createElement('div');
    modal.className = 'end-turn-card';
    
    const header = document.createElement('h3');
    
    // Change header color to black for better visibility
    header.textContent = cardType === 'endTurn' ? 'End of Turn' : cardData.name;
    modal.appendChild(header);
    
    const content = document.createElement('div');
    content.className = 'end-turn-card-content';
    content.textContent = cardData.description || cardData.effect || '';
    modal.appendChild(content);
    
    const button = document.createElement('button');
    button.className = 'end-turn-button';
    button.textContent = 'Continue';
    button.addEventListener('click', () => {
        document.body.removeChild(modal);
        if (callback) callback();
    });
    modal.appendChild(button);
    
    document.body.appendChild(modal);
}
