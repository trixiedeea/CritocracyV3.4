// Main entry point for Critocracy game
import { initGame, startGame } from './game.js';
import { drawBoard } from './board.js';
import { initializeUI } from './ui.js';
import { state, updateGameState } from './state.js';

// Import initialization screen modules
import './startScreen.js';
import './playerCountScreen.js';
import './roleSelectScreen.js';
import './turnOrderScreen.js';
import './animations.js';
import './board.js';
import './cards.js';
import './players.js';
import './ui.js';
import './board-data.js';

export const DEBUG_MODE = false;

// Initialize the game when the DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    console.log("DOM fully loaded and parsed. Initializing Critocracy...");
    console.log("[Main] Starting game initialization sequence...");


document.addEventListener('DOMContentLoaded', async () => {
    try {
        await initGame();
    } catch (err) {
        console.error('Error initializing game:', err);
    }
});

    // Force-close all dialogs on load
    ['card-Popover', 'path-Choice-Popover', 'choicepoint-Popover'].forEach(id => {
        const dlg = document.getElementById(id);
        if (dlg && typeof dlg.close === 'function') dlg.close();
    });

    // Get UI elements
    const ui = {
        ageOfExpansionButton: document.getElementById('age-Of-Expansion-Button'),
        ageOfResistanceButton: document.getElementById('age-Of-Resistance-Button'),
        ageOfReckoningButton: document.getElementById('age-Of-Reckoning-Button'),
        ageOfLegacyButton: document.getElementById('age-Of-Legacy-Button'),
    };

    // Path coordinates from START_SPACE (these should match your board-data.js)
    const PATH_COORDINATES = {
        ageOfExpansionPath: [169, 466],
        ageOfResistancePath: [201, 498],
        ageOfReckoningPath: [205, 548],
        ageOfLegacyPath: [167, 579]
    };

    // Add click handlers for path choice buttons
    if (ui.ageOfExpansionButton) {
        ui.ageOfExpansionButton.addEventListener('click', () => {
            console.log('Age of Expansion button clicked');
            handlePathSelection(PATH_COORDINATES.ageOfExpansionPath, 'ageOfExpansionPath');
        });
    }

    if (ui.ageOfLegacyButton) {
        ui.ageOfLegacyButton.addEventListener('click', () => {
            console.log('Age of Legacy button clicked');
            handlePathSelection(PATH_COORDINATES.ageOfLegacyPath, 'ageOfLegacyPath');
        });
    }

    if (ui.ageOfResistanceButton) {
        ui.ageOfResistanceButton.addEventListener('click', () => {
            console.log('Age of Resistance button clicked');
            handlePathSelection(PATH_COORDINATES.ageOfResistancePath, 'ageOfResistancePath');
        });
    }

    if (ui.ageOfReckoningButton) {
        ui.ageOfReckoningButton.addEventListener('click', () => {
            console.log('Age of Reckoning button clicked');
            handlePathSelection(PATH_COORDINATES.ageOfReckoningPath, 'ageOfReckoningPath');
        });
    }

    // Handle path selection-
    function handlePathSelection(coords, pathName) {
        console.log(`Path selected: ${pathName} at`, coords);
        // Hide the path choice Popover
        if (ui.pathChoicePopover) {
            ui.pathChoicePopover.style.display = 'none';
        }

        // Dispatch an event that the path has been selected
        // The game logic will handle the actual movement and state updates
        const event = new CustomEvent('pathSelected', {
            detail: {
                coords,
                pathName
            }
        });
        document.dispatchEvent(event);
    }

    // Event listeners for game state updates
    window.addEventListener('playersSelected', event => {
        console.log("[Main] Received playerArray in main.js:", event.detail);
        updateGameState({
            playerArray: event.detail,
            humanPlayers: event.detail.filter(player => player.type === "human").length,
            aiPlayers: event.detail.filter(player => player.type === "ai").length
        });
    });

    window.addEventListener('rolesAssigned', event => {
        console.log("[Main] Roles assigned event received in main.js:", event.detail);
        // Update game state with player configurations including roles
        updateGameState({
            playerConfigs: event.detail
        });

        // Transition to the turn order screen
        console.log("[Main] Transitioning to Turn Order Screen...");
        showScreen('turnOrderScreen');
        if (window.turnOrderUI && window.turnOrderUI.initTurnOrderScreen) {
            window.turnOrderUI.initTurnOrderScreen(event.detail);
        } else {
            console.log("[Main] turnOrderUI.initTurnOrderScreen is not defined!");
        }
    });

    window.addEventListener('turnOrderDetermined', event => {
        console.log("[Main] Turn order determined event received in main.js:", event.detail);
        
        // Hide the turn order screen and show the game board
        showScreen('gameBoardScreen');

        // Start the game logic
        startGame(state.playerConfigs, event.detail);
    });

    // Initialize UI screens directly
    const screens = {
        start: document.getElementById('start-Screen'),
        playerCountScreen: document.getElementById('player-Count-Screen'),
        roleSelectionScreen: document.getElementById('role-Selection-Screen'),
        turnOrderScreen: document.getElementById('turn-Order-Screen'),
        gameBoardScreen: document.getElementById('game-Board-Screen'),
        endGameScreen: document.getElementById('end-Game-Screen')
    };

    // Function to show a specific screen and hide others
    function showScreen(screenName) {
        console.log(`--- showScreen called with: ${screenName} ---`);
        Object.entries(screens).forEach(([name, screen]) => {
            if (screen) {
                if (name === screenName) {
                    console.log(`  Showing screen element: ${name}`);
                    screen.style.display = 'block';
                    if (name === 'turnOrderScreen') {
                        console.log('  Turn Order Screen is now visible. Checking for dice elements...');
                        setTimeout(() => {
                            const diceElements = document.querySelectorAll('.dice');
                            console.log('  Found dice elements after screen display:', diceElements.length);
                            if (diceElements.length > 0) {
                                const dice = diceElements[0];
                                const style = window.getComputedStyle(dice);
                                console.log('  Dice animation-related styles - animation:', style.animation, 'animation-name:', style.animationName);
                            }
                        }, 100);
                    }
                    if (name === 'gameBoard') {
                        setTimeout(() => {
                            // board redraw logic can be added here if needed
                        }, 100);
                    }
                } else {
                    screen.style.display = 'none';
                }
            } else {
                console.log(`Screen element ${name} not found during showScreen.`);
            }
        });
    }

    // Initially show only the start screen
    showScreen('start');

    try {
        // 1. Initialize UI Module
        if (!initializeUI()) {
            throw new Error("UI module failed to initialize. Check console for details.");
        }

        // 2. Initialize Game Logic (Cards, Board spaces, Players)
        const gameReady = await initGame();
        if (!gameReady) {
            throw new Error("Core game logic failed to initialize.");
        }

        // 2. Board Canvas check for drawing
        const Canvas = document.getElementById('board-Canvas');
        if (Canvas) {
            drawBoard(); 
        } else {
            console.log("Board Canvas element not found! Cannot perform initial draw.");
            throw new Error("Board Canvas missing.");
        }
        
        console.log("Critocracy initialization sequence complete. Ready for user interaction.");
        
    } catch (error) {
        console.error("CRITICAL ERROR during game initialization:", error);
        // Display a user-friendly error message on the page
        const body = document.querySelector('body');
        if (body) {
            body.innerHTML = '<div style="color: red; padding: 20px;"><h1>Initialization Error</h1><p>Could not start the game. Please check the console (F12) for details and try refreshing.</p></div>';
        }
    }
});


// Initialize UI state when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // The UI initialization is already handled by the main game initialization
    // No need to call initializeUiState() separately as it's handled by initializeUI()
    console.log('DOM fully loaded and parsed');
});

