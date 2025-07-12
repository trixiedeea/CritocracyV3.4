// js/ui.js

// --- Imports ---
import { getPlayers } from './players.js';
import { 
    animateDiceRoll, 
    clearHighlights, 
    startDiceShake, 
    stopDiceShake,
    clearDeckHighlights,
} from './animations.js';

import { 
    state,
    updateGameState,
    updateUIState,
} from './state.js';

import { 
    getCurrentPlayer, 
    advanceToNextPlayer,
    handlePathChoice,
    handlePlayerAction,
} from './game.js';

import { drawCard, applyCardEffect, applyAgeCardEffect } from './cards.js';

import { 
    fullDeckRegionPathMap, 
    choicepoints
} from './board-data.js';
import { ageOfExpansionDeck } from '../assets/Cards/AgeOfExpansionCards.js';

/**
 * Initializes the entire UI module. Should be called once the DOM is fully loaded.
 */
export function initializeUI() {
    console.log("Initializing UI module...");

    // Ensure state.ui is initialized
    if (!state.ui) {
        state.ui = {};
    }

    // 1. Init dynamic state holder
    updateUIState({
        dynamic: state.ui.dynamic || {}
    });

    // 2. Set up all DOM references
    initializeElementReferences();

    // 3. Validate required elements
    if (!validateElements()) {
        console.error("UI initialization failed: one or more critical elements are missing from the DOM.");
        return false;
    }

    // 4. Set up event listeners
    setupEventListeners();

    // 5. Canvas context
    const boardCanvas = state.ui.elements.gameBoard?.boardCanvas;
    if (!boardCanvas) {
        console.error("Canvas element 'boardCanvas' not found.");
        return false;
    }

    const boardCtx = boardCanvas.getContext('2d');
    updateUIState({
        dynamic: {
            ...state.ui.dynamic,
            boardCtx
        }
    });
    if (!boardCtx) {
        console.error("Could not get canvas context for the board.");
        return false;
    }

    console.log("UI Initialized Successfully.");
    return true;
};

/**
 * Caches references to all required DOM elements into the state.ui object.
 */
function initializeElementReferences() {
    console.log("Caching DOM references...");

    updateGameState({
        ui: {
            ...state.ui,
            elements: {
                deckType: {
                    ageOfExpansionDeck: document.getElementById('age-Of-Expansion-Deck'),
                    ageOfResistanceDeck: document.getElementById('age-Of-Resistance-Deck'),
                    ageOfReckoningDeck: document.getElementById('age-Of-Reckoning-Deck'),
                    ageOfLegacyDeck: document.getElementById('age-Of-Legacy-Deck'),
                    endOfTurnDeck: document.getElementById('end-Of-Turn-Deck'),
                },
                gameBoard: {
                    boardCanvas: document.getElementById('board-Canvas'),
                    boardTokenCanvas: document.getElementById('board-Token-Canvas'),
                    tokenLayer: document.getElementById('token-Layer'),
                    boardContainerWrapper: document.getElementById('board-Container-Wrapper'),
                    boardContainer: document.getElementById('board-Container'),
                    playerInfoPanel: document.getElementById('player-Info-Panel'),
                    resourceDisplayContainer: document.getElementById('resource-Display-Container'),
                    currentPlayer: document.getElementById('current-Player'),
                    knowledgeCount: document.getElementById('knowledge-Count'),
                    moneyCount: document.getElementById('money-Count'),
                    influenceCount: document.getElementById('influence-Count'),
                    diceAnimationArea: document.getElementById('dice-Animation-Area'),
                    dice: document.getElementById('dice'),
                    endTurnButton: document.getElementById('end-Turn-Button'),
                },
                popovers: {
                    choicepointPopover: document.getElementById('choicepoint-Popover'),
                    closeAgeCardButtons: document.querySelectorAll('.close-Age-Card-Button'),
                    choicepointPopoverContainer: document.getElementById('choicepoint-Popover-Container'),
                    pathChoicePopoverContainer: document.getElementById('path-Choice-Popover-Container'),
                    cardPopoverContainer: document.getElementById('card-Popover-Container'),
                    pathChoiceOptions: document.getElementById('path-Choice-Options'),
                    choicepointOptions: document.getElementById('choicepoint-Options'),
                    pathChoicePopover: document.getElementById('path-Choice-Popover'),
                    cardPopover: document.getElementById('card-Popover'),
                    cardTitle: document.getElementById('card-Title'),
                    cardDescription: document.getElementById('card-Description'),
                    ageOfExpansionDeck: document.getElementById('age-Of-Expansion-Deck'),
                    ageOfResistanceDeck: document.getElementById('age-Of-Resistance-Deck'),
                    ageOfReckoningDeck: document.getElementById('age-Of-Reckoning-Deck'),
                    ageOfLegacyDeck: document.getElementById('age-Of-Legacy-Deck'),
                    endOfTurnDeck: document.getElementById('end-Of-Turn-Deck'),
                    cardEffects: document.getElementById('card-Effects'),
                    popoverContainer: document.querySelectorAll('.popover-Container'),
                    cardPopoverContainer: document.querySelectorAll('.card-Popover-Container'),
                    showCardDetailsButton: document.getElementById('show-Card-Details-Button'),
                    closeCardButton: document.getElementById('close-Card-Button'),
                },
                endGame: {
                    endGameScreen: document.getElementById('end-Game-Screen'),
                    winnerDisplay: document.getElementById('winner-Display'),
                    finalScores: document.getElementById('final-Scores'),
                    newGameButton: document.getElementById('new-Game-Button'),
                }
            }
        }
    });

    console.log("UI elements cached:", state.ui.elements);
    return true;
};

/**
 * Validates that all critical DOM elements have been found.
 * @returns {boolean} - True if all elements are present, false otherwise.
 */
function validateElements() {
    let allFound = true;
    for (const group in state.ui.elements) {
        for (const key in state.ui.elements[group]) {
            if (!state.ui.elements[group][key]) {
                console.error(`UI element not found: ${group}.${key}`);
                allFound = false;
            }
        }
    }
    return allFound;
};

/**
 * Sets up all necessary event listeners for UI interactions.
 */
function setupEventListeners() {
    console.log("Setting up event listeners...");
    const { gameBoard, popovers, endGame } = state.ui.elements;

    // --- Game Board Buttons ---
    gameBoard.endTurnButton.addEventListener('click', () => {
        console.log("End Turn button clicked.");
        startDiceShake();
        advanceToNextPlayer();
    });

 // Attach once — during game init or when board screen loads
gameBoard.dice.addEventListener('click', () => {
    if (state.currentPhase !== 'ROLLING') return; // Only act during ROLLING phase
  
    console.log('🎯 Dice clicked in ROLLING phase');
  
    stopDiceShake?.(); // Optional: stops visual shake
    updateGameState({ currentPhase: 'PLAYING' }); // Phase gating
    animateDiceRoll(2000); // Your full animation + logic
  });
  
      
      
    popovers.showCardDetailsButton?.addEventListener('click', () => {
        if (popovers.cardEffects) {
            const currentDisplay = popovers.cardEffects.style.display;
            popovers.cardEffects.style.display = currentDisplay === 'none' ? 'block' : 'none';
        }
    });

    // Set up event listeners for all close age card buttons
    if (popovers.closeAgeCardButtons) {
        popovers.closeAgeCardButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Clear deck highlights
                clearDeckHighlights();
                
                // Close the dialog
                const dialog = button.closest('dialog');
                if (dialog) {
                    dialog.close();
                }
                
                // Apply age card effects
                const currentPlayer = getCurrentPlayer();
                if (currentPlayer) {
                    // Get the original card data from the dialog
                    const cardData = dialog?.dataset?.cardData;
                    if (cardData) {
                        try {
                            const card = JSON.parse(cardData);
                            // Apply the age card effects
                            applyAgeCardEffect(card.effects, currentPlayer, currentPlayer);
                        } catch (error) {
                            console.error('Error parsing card data:', error);
                        }
                    } else {
                        console.error('No card data found in dialog');
                    }
                }
            });
        });
    }



    

    // --- End Game Screen Button ---
    endGame.newGameButton.addEventListener('click', () => {
        console.log("New Game button clicked. Reloading page.");
        window.location.reload();
    });

    // --- Canvas Click Listener ---
    gameBoard.boardCanvas.addEventListener('click', (event) => {
        const player = getCurrentPlayer();
        
        if (state.currentPhase === 'AWAITING_CARD_CLICK' && player?.isHuman) {
            handleCanvasCardClick(event);
        } else {
            console.log(`Canvas click ignored in phase: ${state.currentPhase}`);
        }
    });

    gameBoard.boardTokenCanvas.addEventListener('click', (event) => {
    });

    // Set up end turn button
    const endTurnButton = document.getElementById('end-Turn-Button');
    if (endTurnButton) {
        console.log("Setting up End Turn button event listener");
        endTurnButton.onclick = null; // Clear any existing handlers
        endTurnButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("End turn button clicked - DEBUG START");
            console.log("Button disabled state:", endTurnButton.disabled);
            console.log("Current game phase:", state.currentPhase);
            console.log("Current player:", getCurrentPlayer());
            
            // Play sound effect
            //playSound('endTurn');
            
            // Remove shake animation
            endTurnButton.style.animation = '';
            
            // Call advance to next player
            console.log("About to call advanceToNextPlayer()");
            advanceToNextPlayer();
            console.log("advanceToNextPlayer() called - DEBUG END");
        });
        console.log("End Turn button event listener attached successfully");
    } else {
        console.error("End Turn button not found!");
    }

    // --- Close Card Button (End of Turn Cards Only) ---
    if (popovers.closeCardButton) {
        console.log("Setting up Close Card button event listener");
        popovers.closeCardButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("Close card button clicked");
            
            // Clear deck highlights
            clearDeckHighlights();
            
            // Close the dialog
            const dialog = popovers.closeCardButton.closest('dialog');
            if (dialog) {
                dialog.close();
            }
            
            // Apply card effects
            const currentPlayer = getCurrentPlayer();
            if (currentPlayer) {
                // Get the original card data from the dialog
                const cardData = dialog?.dataset?.cardData;
                if (cardData) {
                    try {
                        const card = JSON.parse(cardData);
                        // Apply the card effects
                        applyCardEffect(card, currentPlayer);
                    } catch (error) {
                        console.error('Error parsing card data:', error);
                    }
                } else {
                    console.error('No card data found in dialog');
                }
            }
        });
        console.log("Close Card button event listener attached successfully");
    } else {
        console.error("Close Card button not found!");
    }
};

/**
 * Handles the logic for when the canvas is clicked during the AWAITING_CARD_CLICK phase.
 * @param {MouseEvent} event - The click event.
 * @param {Object} coords - Optional coordinates object {x, y} for programmatic calls
 * @param {Object} player - Optional player object for programmatic calls
 */
export function handleCanvasCardClick(event, coords = null, player = null) {
    const { boardCanvas } = state.ui.elements.gameBoard;
    
    // Use provided player or get current player
    const currentPlayer = player || getCurrentPlayer();
    
    if (!currentPlayer || !currentPlayer.isHuman) {
        return; // Only human players should handle card clicks this way
    }

    let boardX, boardY;

    if (event) {
        // Handle mouse event
        const rect = boardCanvas.getBoundingClientRect();
        const scaleX = boardCanvas.width / rect.width;
        const scaleY = boardCanvas.height / rect.height;
        boardX = (event.clientX - rect.left) * scaleX;
        boardY = (event.clientY - rect.top) * scaleY;
    } else if (coords) {
        // Use provided coordinates
        boardX = coords.x;
        boardY = coords.y;
    } else {
        console.error('handleCanvasCardClick called without event or coordinates');
        return;
    }

    console.log(`Canvas clicked for card draw at board coords: (${boardX.toFixed(0)}, ${boardY.toFixed(0)})`);

    // Check which deck region was clicked using fullDeckRegionPathMap positions.
    let clickedDeckType = null;

    for (const [key, region] of Object.entries(fullDeckRegionPathMap)) {
        if (region.positions && region.positions.length > 0) {
            // Check each position in the region
            for (const pos of region.positions) {
                if (boardX >= pos.topleft && boardX <= pos.bottomrightx && 
                    boardY >= pos.toplefty && boardY <= pos.bottomright) {
                    clickedDeckType = region.deckType;
                    console.log(`Clicked on ${region.pathName} deck: ${clickedDeckType}`);
                    break;
                }
            }
            if (clickedDeckType) break;
        }
    }

    if (clickedDeckType) {
        console.log(`Drawing from deck: ${clickedDeckType}`);
        clearHighlights();
        drawCard(clickedDeckType);
    } else {
        console.log(`No valid deck region clicked at coordinates (${boardX}, ${boardY})`);
    }
};

/**
 * Enables the End Turn button after a player has taken their action
 */
export function enableEndTurnButton() {
    console.log("enableEndTurnButton called");
    if (state.ui.elements.endTurnButton) {
        state.ui.elements.endTurnButton.disabled = false;
        console.log("End Turn button enabled");
    } else {
        console.error("End Turn button not found in state.ui.elements");
    }
};

// --- UI Update Functions ---

/**
 * Updates the player information panel with the current player's stats.
 * @param {string|Object} playerId - The ID of the player to display, or a player object.
 */
export function updatePlayerInfo(playerId) {
    console.log('---------updatePlayerInfo---------');
    console.log('[UI] updatePlayerInfo called with:', playerId);
    
    try {
        // Handle case where playerId is an object (should be string)
        const playerIdStr = typeof playerId === 'object' ? (playerId.id || '') : (playerId || '');
        
        if (!playerIdStr) {
            console.error('updatePlayerInfo: Invalid player ID provided:', playerId);
            return;
        }

        const players = getPlayers();
        console.log('[UI] All players:', players);
        
        if (!Array.isArray(players)) {
            console.error('updatePlayerInfo: Players data is not an array');
            return;
        }

        const player = players.find(p => p && p.id === playerIdStr);
        if (!player) {
            console.error(`updatePlayerInfo: Player with ID ${playerIdStr} not found. Available players:`, 
                players.map(p => p ? p.id : 'null'));
            return;
        }
        
        console.log('[UI] Found player:', {
            id: player.id,
            name: player.name,
            role: player.role,
            resources: player.resources,
            isHuman: player.isHuman
        });

        const { currentPlayer, knowledgeCount, moneyCount, influenceCount } = state.ui.elements.gameBoard || {};
        
        // Log the UI elements for debugging
        console.log('[UI] UI Elements:', {
            currentPlayer: !!currentPlayer,
            knowledgeCount: !!knowledgeCount,
            moneyCount: !!moneyCount,
            influenceCount: !!influenceCount
        });
        
        if (!currentPlayer || !knowledgeCount || !moneyCount || !influenceCount) {
            console.error('updatePlayerInfo: Missing required UI elements');
            // Try to re-initialize UI elements if they're missing
            if (initializeElementReferences) {
                console.log('Attempting to re-initialize UI elements...');
                initializeElementReferences();
            }
            return;
        }

        // Ensure resources exist, default to 0 if not
        const resources = player.resources || {};
        const knowledge = resources.knowledge ?? 0;
        const money = resources.money ?? 0;
        const influence = resources.influence ?? 0;
        
        console.log('[UI] Updating UI with resources:', { knowledge, money, influence });
        
        // Update the UI elements
        currentPlayer.textContent = `${player.name} (${player.role || 'No Role'})`;
        knowledgeCount.textContent = knowledge;
        moneyCount.textContent = money;
        influenceCount.textContent = influence;
        
        // Force a reflow to ensure the UI updates
        void currentPlayer.offsetHeight;
        
        console.log(`[UI] Successfully updated UI for ${player.name}'s turn`);
        
    } catch (error) {
        console.error('Error in updatePlayerInfo:', error);
        // Try a full UI refresh on error
        try {
            console.log('Attempting full UI refresh...');
            if (initializeUI) initializeUI();
            if (updateGameControls) updateGameControls();
        } catch (e) {
            console.error('Failed to refresh UI:', e);
        }
    }
};  

/**
 * Displays a message to the user in the message log.
 * @param {string} message - The message to display.
 */
export function showMessage(message) {
}; 

export function promptForPathChoice(pathOptions, player, aiChosenOption = null) {
    if (!state) {
        console.error('Game state not initialized');
        return;
    }

    if (state.currentPhase !== 'AWAITING_PATH_CHOICE') {
        updateGameState({ currentPhase: 'AWAITING_PATH_CHOICE' });
    }

    console.log('---------promptForPathChoice---------');
    console.log('Path options:', pathOptions);
    console.log('Player:', player);
    
    updateGameControls(); // Sync UI with game state

    // Update phase if needed
    if (state.currentPhase !== 'AWAITING_PATH_CHOICE') {
        updateGameState({ currentPhase: 'AWAITING_PATH_CHOICE' });
        console.warn('GAMEPHASE UPDATED TO AWAITING_PATH_CHOICE');
    }

    const popover = document.getElementById('path-Choice-Popover');
    if (!popover) {
        console.error('Path-choice pop-over not found');
        return;
    }

    const idMap = {
        ageOfExpansion: 'age-Of-Expansion-Path',
        ageOfResistance: 'age-Of-Resistance-Path',
        ageOfReckoning: 'age-Of-Reckoning-Path',
        ageOfLegacy: 'age-Of-Legacy-Path',
    };

    // Store the original button references before cloning
    const originalButtons = {};
    Object.entries(idMap).forEach(([key, id]) => {
        const button = document.getElementById(id);
        if (button) {
            originalButtons[key] = button;
        }
    });

    // Clone and replace buttons
    Object.entries(idMap).forEach(([key, id]) => {
        const oldButton = document.getElementById(id);
        if (oldButton) {
            try {
                const newButton = oldButton.cloneNode(true);
                oldButton.replaceWith(newButton);
                
                // Reattach click handler
                newButton.onclick = () => {
                    const option = pathOptions.find(opt => opt.pathName === key);
                    if (option) {
                        console.log(`Path chosen: ${key}`, option);
                        popover.close();
                        handlePathChoice(option.coords, key);
                    }
                };
            } catch (err) {
                console.error(`Failed to clone button with id ${id}:`, err);
            }
        }
    });

    if (player && !player.isHuman && aiChosenOption) {
        // AI Logic: Show popover and run the 8-second animation sequence
        console.log('Showing modal for AI player');
        try {
            popover.showModal();
        } catch (err) {
            console.error('Failed to show modal:', err);
            return;
        }

        // 2.5s delay to identify the button
        setTimeout(() => {
            const chosenButton = document.getElementById(idMap[aiChosenOption.pathName]);
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
                    handlePathChoice(aiChosenOption.coords, aiChosenOption.pathName);
                }, 2500);
            }, 2500);
        }, 2500);

    } else if (player && player.isHuman) {
        // Human Logic: Attach listeners and show popover
        if (Array.isArray(pathOptions) && pathOptions.length > 0) {
            console.log('Setting up path choice buttons for human player');
            
            // Clear any existing event listeners first
            Object.values(idMap).forEach(id => {
                const button = document.getElementById(id);
                if (button) {
                    const newButton = button.cloneNode(true);
                    button.parentNode.replaceChild(newButton, button);
                }
            });
            
            // Set up new event listeners
            pathOptions.forEach((option) => {
                if (!option || !option.pathName) {
                    console.error('Invalid path option:', option);
                    return;
                }
                
                // Remove 'Path' suffix if present for the ID lookup
                const pathKey = option.pathName.replace(/Path$/, '');
                const button = document.getElementById(idMap[pathKey]);
                
                if (button) {
                    console.log(`Setting up button for ${option.pathName}`);
                    button.addEventListener('click', () => {
                        console.log(`Path chosen: ${option.pathName}`, option.coords);
                        try {
                            if (typeof popover.close === 'function') {
                                popover.close();
                            }
                            handlePathChoice(option.coords, option.pathName);
                        } catch (err) {
                            console.error('Error handling path choice:', err);
                        }
                    }, { once: true });
                } else {
                    console.error(`Button not found for path: ${option.pathName} (looked for ID: ${idMap[pathKey]})`);
                }
            });
            
            // Show the modal after setting up the buttons
            try {
                console.log('Showing path choice modal');
                popover.showModal();
            } catch (err) {
                console.error('Failed to show path choice modal:', err);
            }
        } else {
            console.error('promptForPathChoice called with invalid pathOptions:', pathOptions);
        }
        try {
            popover.showModal();
        } catch (err) {
            console.error('Failed to show modal:', err);
        }
    }
};

export function promptForChoicepoint(options, callback) {
    console.log('--- promptForChoicepoint ---');
  
    const popup = document.getElementById('choicepoint-Popover');
    const optionsContainer = document.getElementById('choicepoint-Options');
  
    // First, hide all buttons by default
    const allButtons = optionsContainer.querySelectorAll('button');
    allButtons.forEach(button => {
      button.classList.add('display-none');
      button.disabled = true;
      button.removeEventListener('click', button._choiceHandler); // Remove old handlers if any
    });
  
    // Display only buttons relevant to the current options
    options.forEach(option => {
      const pathKey = option.pathName; // e.g. "age-Of-Resistance-Path"
      const button = document.getElementById(pathKey);
  
      if (!button) {
        console.warn(`No button found for path: ${pathKey}`);
        return;
      }
  
      // Reset and show the button
      button.classList.remove('display-none');
      button.disabled = false;
  
      // Update the color class dynamically
      button.className = 'path-Choice-Button'; // Reset classes
      if (option.color) {
        button.classList.add(`path-${option.color}`);
      }
  
      // Add click handler
      const handler = () => {
        playClickSound();
        popup.close();
        callback({
          coords: option.coords,
          pathName: option.pathName
        });
      };
  
      button._choiceHandler = handler;
      button.addEventListener('click', handler);
    });
  
    // Show the popover
    popup.showModal();
};
  
export function updateGameControls() {
    const player = getCurrentPlayer();
    let rollEnabled = false;
    let endTurnEnabled = false;

    if (player && player.isHuman && !state.ended) {
        switch (state.currentPhase) {
            case 'ROLLING':
                rollEnabled = true;
                break;
            case 'PLAYING':
                rollEnabled = false;
                break;
            case 'AWAITING_CARD_CLICK':
            case 'AWAITING_PATH_CHOICE':
                // Disable both during these phases
                break;
            case 'MOVE_COMPLETE':
                endTurnEnabled = true;
                break;
            default:
                console.warn(`Unknown game phase: ${state.currentPhase}`);
        }
    }

    const dice = state.ui.elements.gameBoard?.dice;
    if (dice) {
        dice.style.pointerEvents = rollEnabled ? 'auto' : 'none';
        if (rollEnabled) {
            startDiceShake();
        } else {
            stopDiceShake();
        }
    }

    const endTurnButton = state.ui.elements.gameBoard?.endTurnButton;
    if (endTurnButton) {
        endTurnButton.disabled = !endTurnEnabled;
    }

    console.log(`UI Controls Updated: Roll=${rollEnabled}, EndTurn=${endTurnEnabled}, Phase=${state.currentPhase}`);
};
        
/**
 * Update player's resource panel with current values.
 * Expected HTML structure:
 * <div id="player-resource-panel-p1">
 *   <span class="player-name">Alice</span>
 *   <span class="money">💰 10</span>
 *   <span class="knowledge">📚 5</span>
 *   <span class="influence">🗳️ 3</span>
 *   <div class="resource-feedback"></div>
 * </div>
 */
export function updateResourcePanel(player) {
    console.log('---------updateResourcePanel---------');
    const panel = document.getElementById(`player-resource-panel-${player.id}`);
    if (!panel) {
      console.error(`No resource panel found for player ID: ${player.id}`);
      return;
    }
  
    panel.querySelector('.player-name').textContent = player.name;
    panel.querySelector('.money').textContent = `💰 ${player.resources.money}`;
    panel.querySelector('.knowledge').textContent = `📚 ${player.resources.knowledge}`;
    panel.querySelector('.influence').textContent = `🗳️ ${player.resources.influence}`;
};
  
  /**
   * Flash a feedback animation near the resource panel for the player
   */
export function showResourceChangeFeedback(playerId, resourceType, amount) {
    console.log('---------showResourceChangeFeedback---------');
    const panel = document.getElementById(`player-resource-panel-${playerId}`);
    if (!panel) return;
  
    const feedbackEl = panel.querySelector('.resource-feedback');
    if (!feedbackEl) return;
  
    const sign = amount > 0 ? '+' : '';
    const emoji = {
      money: '💰',
      knowledge: '📚',
      influence: '🗳️'
    }[resourceType] || '';
  
    feedbackEl.textContent = `${emoji} ${sign}${amount}`;
    feedbackEl.style.opacity = '1';
    feedbackEl.style.transform = 'translateY(-10px)';
    feedbackEl.style.transition = 'all 0.6s ease';
  
    // Fade out after a moment
    setTimeout(() => {
      feedbackEl.style.opacity = '0';
      feedbackEl.style.transform = 'translateY(0px)';
    }, 1000);
}
  