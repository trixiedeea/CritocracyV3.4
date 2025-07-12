import { state, updateGameState, getCurrentPlayer } from './state.js';

import { 
    ageOfExpansionPath, ageOfResistancePath, ageOfReckoningPath, ageOfLegacyPath, 
    START_SPACE, FINISH_SPACE,
    ORIGINAL_WIDTH, ORIGINAL_HEIGHT,
    PATH_COLORS,
    choicepoints
} 
from './board-data.js'; 

import { handleSpaceAction, handleEndTurn } from './game.js';


// ===== Board Constants =====
const BOARD_IMAGE_PATH = '/assets/board.png';
const TOKEN_DIR = 'assets/tokens'; 
const TOKEN_SIZE = 40; 
// Removed SPACE_RADIUS, choicepoint_RADIUS as clicks/drawing might use different logic

// ===== Debug Mode =====
const DEBUG_MODE = false; // Set to true for debug visualization

// ===== Board State =====
export const boardState = {
    canvas: null,
    ctx: null,
    tokenCanvas: null,
    tokenCtx: null,
    scale: 1,
    lastDrawTime: 0,
    lastTokenDrawTime: 0,
    needsRedraw: true,
    needsTokenRedraw: true,
    boardImage: null,
    boardDrawn: false,
    playerTokenImages: {},
    clickableSpaces: []
};

// ===== NEW Coordinate Helper Functions (To be implemented later) ======

/**
 * Finds the path a given coordinate belongs to.
 * @param {object} coords - The {x, y} coordinates.
 * @returns {object|null} - The path object or null if not found.
 */
export function findPathForCoordinate(coords) {
    console.log('---------findPathForCoordinate---------');
    const allPaths = {
        ageOfExpansion: ageOfExpansionPath,
        ageOfResistance: ageOfResistancePath,
        ageOfReckoning: ageOfReckoningPath,
        ageOfLegacy: ageOfLegacyPath
    };

    for (const pathName in allPaths) {
        const path = allPaths[pathName];
        for (const segment of path.segments) {
            if (segment.coordinates.some(c => c[0] === coords.x && c[1] === coords.y)) {
                return path;
            }
        }
    }
    return null;
};

/**
 * Calculates the destination coordinates after a certain number of steps,
 * stopping if a choicepoint is encountered.
 * @param {object} startCoords - The starting {x, y} coordinates.
 * @param {number} steps - The number of steps to move.
 * @returns {object} - An object { destination, reason, remainingSteps }.
 */
export function calculateDestination(startCoords, steps) {
    console.log('---------calculateDestination---------');
    let currentCoords = { ...startCoords };
    let remainingSteps = steps;
    let stepsTaken = 0;

    while (remainingSteps > 0) {
        const moveInfo = getNextStepOptions(currentCoords);
        let nextOptions = [];

        // Process the result from getNextStepOptions
        if (moveInfo && moveInfo.type) {
            switch (moveInfo.type) {
                case 'Regular':
                case 'Finish':
                    if (moveInfo.nextCoords) {
                        nextOptions.push({ coords: { x: moveInfo.nextCoords[0], y: moveInfo.nextCoords[1] } });
                    }
                    break;
                case 'choicepoint':
                    if (moveInfo.options && Array.isArray(moveInfo.options)) {
                        nextOptions = moveInfo.options.map(coord => ({ coords: { x: coord[0], y: coord[1] } }));
                    }
                    break;
                // For 'Start', 'LandedOnFinish', and 'Error', nextOptions remains empty, handled by the 'blocked' logic below.
            }
        }

        // Stop if no more options are available.
        if (nextOptions.length === 0) {
            return { destination: currentCoords, reason: 'blocked', remainingSteps: remainingSteps };
        }

        // Stop if a choicepoint is reached (but not at the start of the move).
        if (nextOptions.length > 1 && stepsTaken > 0) {
            return { destination: currentCoords, reason: 'choicepoint', remainingSteps: remainingSteps };
        }

        // Simple move: take the first available option.
        currentCoords = nextOptions[0].coords;
        remainingSteps--;
        stepsTaken++;
    }

    // Completed all steps without interruption.
    return { destination: currentCoords, reason: 'complete', remainingSteps: 0 };
};

/** 
 * Scale coordinates from original board coordinates to Canvas display coordinates
 * @param {number} x - Original x coordinate
 * @param {number} y - Original y coordinate
 * @returns {[number, number]} Scaled coordinates
 */
export function scaleCoordinates(x, y) {
    const layer = document.getElementById('token-layer'); // <- not the canvas
    if (!layer) return [x, y];

    // Use imported ORIGINAL_WIDTH and ORIGINAL_HEIGHT
    const rect = layer.getBoundingClientRect();
    const layerWidth = rect.width;
    const layerHeight = rect.height;

    const scale = Math.min(
        layerWidth / ORIGINAL_WIDTH,
        layerHeight / ORIGINAL_HEIGHT
    );

    const offsetX = (layerWidth - (ORIGINAL_WIDTH * scale)) / 2;
    const offsetY = (layerHeight - (ORIGINAL_HEIGHT * scale)) / 2;

    const scaledX = (x * scale) + offsetX;
    const scaledY = (y * scale) + offsetY;

    console.log(`Scaling coords (${x},${y}) with scale ${scale} -> (${scaledX},${scaledY})`);
    return [scaledX, scaledY];
};

/** 
 * Unscale coordinates from Canvas display coordinates to original board coordinates
 * @param {number} x - Canvas x coordinate
 * @param {number} y - Canvas y coordinate
 * @returns {[number, number]} Original coordinates
 */
export function unscaleCoordinates(x, y) {
    const Canvas = document.getElementById('board-Canvas');
    if (!Canvas) return [x, y];
    
    const scaleX = 1536 / Canvas.width; // Original board width
    const scaleY = 1024 / Canvas.height; // Original board height
    
    return [x * scaleX, y * scaleY];

};

/**
 * Loads player token images.
*/
export async function loadTokenImages() {
    console.log('---------loadTokenImages---------');
    const roles = ['H', 'E', 'A', 'P', 'R', 'C']; // Example roles
    const promises = roles.map(role => new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            updateGameState({
                board: {
                    ...state.board,
                    playerTokenImages: {
                        ...state.board?.playerTokenImages,
                        [role]: img
                    }
                }
            });
            console.log(` Loaded token: ${img.src}`);
            resolve();
        };
        img.onerror = () => {
            console.warn(`Failed to load token: ${role}.png`);
            reject(new Error(`Failed to load token ${role}`));
        };
        img.src = `${TOKEN_DIR}/${role}.png`;
    }));
    await Promise.all(promises);
    console.log("All player token images loaded.");
};

/**
 * Draws rectangles for the card spaces with specified colors
 */
function drawCardRectangles() {
    console.log('---------drawCardRectangles---------');
    if (!state.board.ctx) return;
    const ctx = state.board.ctx;
    
    // Set global alpha for transparency
    ctx.globalAlpha = 0.3; // 50% transparency
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    
    // Gold rectangles for End of Turn cards
    ctx.fillStyle = "Gold"; // Gold color
    
    // First gold rectangle
    ctx.beginPath();
    ctx.moveTo(306, 448);
    ctx.lineTo(384, 448);
    ctx.lineTo(384, 579);
    ctx.lineTo(306, 579);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Second gold rectangle
    ctx.beginPath();
    ctx.moveTo(1130, 461);
    ctx.lineTo(1207, 461);
    ctx.lineTo(1207, 591);
    ctx.lineTo(1130, 591);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Purple card rectangle
    ctx.fillStyle = "Purple"; // Purple hex color
    ctx.beginPath();
    ctx.moveTo(567, 475);
    ctx.lineTo(652, 475);
    ctx.lineTo(652, 617);
    ctx.lineTo(567, 617);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Pink card rectangle
    ctx.fillStyle = "Pink"; // Pink hex color
    ctx.beginPath();
    ctx.moveTo(692, 254);
    ctx.lineTo(804, 254);
    ctx.lineTo(804, 395);
    ctx.lineTo(692, 395);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Blue card rectangle
    ctx.fillStyle = "Blue"; // Blue hex color
    ctx.beginPath();
    ctx.moveTo(845, 475);
    ctx.lineTo(939, 475);
    ctx.lineTo(939, 617);
    ctx.lineTo(845, 617);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Cyan card rectangle
    ctx.fillStyle = "Cyan";
    ctx.globalAlpha = 0.4; // Make it more opaque than other cards
    ctx.beginPath();
    ctx.moveTo(693, 699);
    ctx.lineTo(803, 699);
    ctx.lineTo(803, 865);
    ctx.lineTo(693, 865);
    ctx.closePath();
    ctx.fill();
    
    // Reset line width for other elements
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000000";
    ctx.globalAlpha = 0.3;
    
    // Add white labels to identify the card types
    ctx.fillStyle = "white";
    ctx.font = "bold 8px Arial";
    ctx.textAlign = "center";
    
    // Reset global alpha for labels
    ctx.globalAlpha = 0.8;
    
    // EOT labels
    ctx.fillText("END OF TURN", 347,519);
    ctx.fillText("END OF TURN", 1168, 530);
    
    // Age/color labels
    ctx.fillText("AGE OF EXPANSION", 611, 550);
    ctx.fillText("AGE OF LEGACY", 748, 325);
    ctx.fillText("AGE OF RESISTANCE", 893, 550);
    ctx.fillText("AGE OF RECKONING", 748, 785);
    
    // Reset global alpha
    ctx.globalAlpha = 1.0;
};

export function findSpaceDetailsByCoords(targetCoords, tolerance = 10, player = null) {
    console.log('---------findSpaceDetailsByCoords---------');
    console.log('Searching for coords:', targetCoords);
  
    if (!targetCoords || typeof targetCoords.x !== 'number' || typeof targetCoords.y !== 'number') {
      console.error('Invalid or missing targetCoords:', targetCoords);
      return null;
    }
  
    const allPaths = [
      ageOfExpansionPath,
      ageOfResistancePath,
      ageOfReckoningPath,
      ageOfLegacyPath
    ];
  
    // Check START space
    const startCoord = START_SPACE.coordinates[0];
    if (
      Math.abs(targetCoords.x - startCoord[0]) <= tolerance &&
      Math.abs(targetCoords.y - startCoord[1]) <= tolerance
    ) {
      console.log('Found START space at:', targetCoords);
      const space = {
        ...START_SPACE,
        pathName: 'none',
        pathColor: 'none',
        Type: 'start',
        Next: Object.values(START_SPACE.nextCoordOptions)
      };
  
      updateSpaceInState(space, targetCoords);
      return space;
    }
  
    // Check FINISH space
    const finishCoord = FINISH_SPACE.coordinates[0];
    if (
      Math.abs(targetCoords.x - finishCoord[0]) <= tolerance &&
      Math.abs(targetCoords.y - finishCoord[1]) <= tolerance
    ) {
      console.log('Found FINISH space at:', targetCoords);
      const space = {
        ...FINISH_SPACE,
        pathName: 'none',
        pathColor: 'none',
        Type: 'finish',
        Next: []
      };
  
      updateSpaceInState(space, targetCoords);
      return space;
    }
  
    // Search through each path
    for (const path of allPaths) {
      if (!path || !path.segments) continue;
      
      for (const segment of path.segments) {
        if (!segment || !segment.coordinates || !segment.coordinates[0]) continue;
        
        const coords = segment.coordinates[0];
        if (coords.length < 2) continue;
  
        const dx = Math.abs(targetCoords.x - coords[0]);
        const dy = Math.abs(targetCoords.y - coords[1]);
  
        if (dx <= tolerance && dy <= tolerance) {
          console.log(`Found matching space at (${coords[0]},${coords[1]}) in path ${path.name || 'unknown'}`);
          const space = {
            ...segment,
            pathName: segment.pathName || path.pathName || path.name,
            pathColor: segment.pathColor || path.color,
            Type: segment.Type || 'regular', 
            coordinates: [coords] // Ensure coordinates are properly set
          };
        if (space.Type === 'draw') {
            handleSpaceAction(player, spaceType, pathName);
        }else{(space.Type === 'regular')
            handleEndTurn(player, space);
        }
  
          updateSpaceInState(space, targetCoords);
          return space;
        }
      }
    }
    
    console.warn(`No space found near (${targetCoords.x}, ${targetCoords.y}) within tolerance ${tolerance}`);
    return null;
};

function updateSpaceInState(space, coords) {
    console.log('---------updateSpaceInState---------');
    gameState.currentPath = space.pathName;
    gameState.currentCoords = coords;
    gameState.pathColorKey = space.pathColor;
    gameState.spaceType = space.Type;
};

/**
 * Determines the next coordinate options based on the current coordinates.
 */
export function getNextStepOptions(currentCoords) {
    console.log("---------getNextStepOptions---------");
    console.log(`PATH DEBUG: Finding next step from (${currentCoords.Thex.toFixed(1)}, ${currentCoords.y.toFixed(1)})`);
    
    // Find current space details
    const spaceDetails = findSpaceDetailsByCoords(currentCoords);
    if (!spaceDetails) {
        console.error(`PATH ERROR: No space found at (${currentCoords.x.toFixed(1)}, ${currentCoords.y.toFixed(1)})`);
        return { type: 'Error', message: 'Current space not found' };
    }

    // Log what we found to aid debugging
    console.log(`PATH DEBUG: Found space with pathColor "${spaceDetails.pathColor || 'none'}", Type "${spaceDetails.Type || 'unknown'}"`);
    
    const currentType = (spaceDetails.Type );

    // SPECIAL CASE: Start space handling
    if (currentType === 'start') {
        console.log(`PATH DEBUG: On Start space. Available paths:`, Object.keys(START_SPACE.nextCoordOptions));
        // For debugging only - don't return options since this should be handled by path choice UI
        return { type: 'Start', message: 'At Start - path choice needed' };
    }

    if (currentType === 'choicepoint' || currentType === 'junction') {
        console.log(`PATH DEBUG: On Choicepoint/Junction with ${(spaceDetails.Next || []).length} options`);
        
        // Validate Next is actually populated
        if (!spaceDetails.Next || !Array.isArray(spaceDetails.Next) || spaceDetails.Next.length === 0) {
            console.error(`PATH ERROR: Choicepoint at (${currentCoords.x.toFixed(1)}, ${currentCoords.y.toFixed(1)}) has no Next options defined!`);
            return { type: 'Error', message: 'Choicepoint has no Next options defined' };
        }
        
        // Return the array of next coordinate options directly
        return { type: 'Choicepoint', options: spaceDetails.Next };
    } 
    else if (spaceDetails.Next && spaceDetails.Next.length > 0) {
        // Regular space with a defined Next step
        const nextCoords = spaceDetails.Next[0];
        console.log(`PATH DEBUG: Regular space with Next: [${nextCoords[0]}, ${nextCoords[1]}]`);
        
        // Safety check for valid coordinates
        if (!Array.isArray(nextCoords) || nextCoords.length < 2) {
            console.error(`PATH ERROR: Invalid Next coordinates format:`, nextCoords);
            return { type: 'Error', message: 'Invalid Next coordinates format' };
        }
        
        // Check if this next step *is* the finish space
        const finishCoords = FINISH_SPACE.coordinates[0];
        const tolerance = 10; // Increased tolerance for matching finish
        if (Math.abs(nextCoords[0] - finishCoords[0]) < tolerance && Math.abs(nextCoords[1] - finishCoords[1]) < tolerance) {
            console.log(`PATH DEBUG: Next step leads to Finish`);
            return { type: 'Finish', nextCoords: nextCoords }; 
        }
        
        // Check for loops - if next coords are same as current
        const currentDistToNext = Math.sqrt(
            Math.pow(currentCoords.x - nextCoords[0], 2) + 
            Math.pow(currentCoords.y - nextCoords[1], 2)
        );
        
        if (currentDistToNext < 0.1) {
            console.error(`PATH ERROR: Next coordinates are too close to current coordinates. Current: (${currentCoords.x.toFixed(1)}, ${currentCoords.y.toFixed(1)}), Next: [${nextCoords[0]}, ${nextCoords[1]}]`);
            // Try to find an alternative path by checking other paths
            const alternativePath = findAlternativePathFrom(currentCoords);
            if (alternativePath) {
                console.log(`PATH DEBUG: Found alternative path: [${alternativePath[0]}, ${alternativePath[1]}]`);
                return { type: 'Regular', nextCoords: alternativePath };
            }
            
            return { type: 'Error', message: 'Next coordinates too close to current' };
        }
        
        // Otherwise, it's a regular next step
        return { type: 'Regular', nextCoords: nextCoords };
    } 
    else {
        // No 'Next' defined. Check if we are *already* at the finish space.
        const finishCoords = FINISH_SPACE.coordinates[0];
        const tolerance = 10; // Increased tolerance
        if (currentType === 'finish' || (Math.abs(currentCoords.x - finishCoords[0]) < tolerance && Math.abs(currentCoords.y - finishCoords[1]) < tolerance)) {
            console.log(`PATH DEBUG: Already on Finish space.`);
            return { type: 'LandedOnFinish' }; // Indicate currently at finish
        }
        
        // Try to find an alternative path by checking other paths
        const alternativePath = findAlternativePathFrom(currentCoords);
        if (alternativePath) {
            console.log(`PATH DEBUG: Found alternative path: [${alternativePath[0]}, ${alternativePath[1]}]`);
            return { type: 'Regular', nextCoords: alternativePath };
        }
        
        // Otherwise, it's potentially the end of a path without a defined next step
        console.warn(`PATH ERROR: Space at (${currentCoords.x.toFixed(1)}, ${currentCoords.y.toFixed(1)}) has no Next defined and isn't Finish.`);
        return { type: 'End', message: 'No next step defined' }; 
    }
};

/**
 * Sets up the canvas and loads board/token images.
 * REMOVED calls to initializeSpaces and board data setup.
 */
export async function setupBoard() {
    console.log("Setting up board...");
    state.board.Canvas = document.getElementById('board-Canvas');
    if (!state.board.Canvas) {
        console.error("Board setup failed - could not find canvas element");
        return false;
    }
    state.board.ctx = state.board.Canvas.getContext('2d');
    if (!state.board.ctx) {
        console.error("Board setup failed - could not get 2d context");
        return false;
    }

    await Promise.all([
        // Load board image
        new Promise((resolve, reject) => {
            // ... (Keep existing board image loading logic) ...
            const boardImg = new Image();
            state.board.boardImage = boardImg;
            console.log("Loading board image from:", BOARD_IMAGE_PATH);
            boardImg.onload = () => {
                console.log("✓ Successfully loaded board image (", boardImg.naturalWidth, "x", boardImg.naturalHeight, ")");
                state.board.Canvas.width = boardImg.naturalWidth;
                state.board.Canvas.height = boardImg.naturalHeight;
                console.log(`Canvas size set to: ${state.board.Canvas.width}x${state.board.Canvas.height}`);
                resolve(); 
            };
            boardImg.onerror = () => {
                 console.error("Board image failed to load:", BOARD_IMAGE_PATH);
                 // Set default size if image fails
                 state.board.Canvas.width = ORIGINAL_WIDTH;
                 state.board.Canvas.height = ORIGINAL_HEIGHT;
                 reject(new Error('Failed to load board image.'));
            };
            boardImg.src = BOARD_IMAGE_PATH;
        }),
        loadTokenImages()
    ]).catch(error => {
        console.error("Error during image loading:", error);
        return false; // Indicate failure
    });

    // No more initializeSpaces() call here
    
    drawBoard(); // Initial draw
    console.log("Board setup complete.");
    return true;
};

/**
 * Draws the game board, spaces, connections, and player tokens.
 */
export function drawBoard() {
    console.log('---------drawBoard---------');
    // ... (ctx check) ...
    if (!state.board.ctx) { /* ... */ return; }
    const ctx = state.board.ctx;
    ctx.clearRect(0, 0, state.board.Canvas.width, state.board.Canvas.height);
    if (state.board.boardImage) {
        ctx.drawImage(state.board.boardImage, 0, 0, state.board.Canvas.width, state.board.Canvas.height);
    } else {
        // Fallback drawing
        ctx.fillStyle = "#ccc";
        ctx.fillRect(0, 0, state.board.Canvas.width, state.board.Canvas.height);
        ctx.fillStyle = "black";
        ctx.fillText("Board image not loaded", 50, 50);
    }
    // Call new/modified drawing functions
    drawCardRectangles(); // Draw card deck rectangles
    drawPathSpaces(); // New function to draw spaces from path arrays
    drawPathConnections(); // New function to draw connections from path arrays
    drawTokens(); // Needs modification to use player.currentCoords
    
    // Draw debug overlay if debug mode is enabled
    drawDebugOverlay();
};

/**
 * Draws connections between spaces defined in the path arrays.
 */
function drawPathConnections() {
    console.log('---------drawPathConnections---------');
    if (!state.board.ctx) return;
    const ctx = state.board.ctx;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.0)'; // Faint black lines
    ctx.lineWidth = .5;
    const allPaths = [ageOfExpansionPath, ageOfResistancePath, ageOfReckoningPath, ageOfLegacyPath];

    for (const path of allPaths) {
        // Iterate over the segments array within the path object
        for (const space of path.segments) {
            if (!space.coordinates || !space.Next) continue;
            
            // Use first coordinate as source for drawing line
            const srcX = space.coordinates[0][0];
            const srcY = space.coordinates[0][1];

            // Draw line to each coordinate in Next array
            for (const nextCoord of space.Next) {
                if (!Array.isArray(nextCoord) || nextCoord.length < 2) continue;
                const nextX = nextCoord[0];
                const nextY = nextCoord[1];
                ctx.beginPath();
                ctx.moveTo(srcX, srcY);
                ctx.lineTo(nextX, nextY);
                ctx.stroke();
            }
        }
    }
};

/**
 * Draws spaces defined in the path arrays.
 */
function drawPathSpaces() {
    console.log('---------drawPathSpaces---------');
    if (!state.board.ctx) return;
    const ctx = state.board.ctx;
    const allPaths = [ageOfExpansionPath, ageOfResistancePath, ageOfReckoningPath, ageOfLegacyPath];
    const drawnCoords = new Set(); // Prevent drawing overlapping choicepoint coords multiple times

    // Draw START and FINISH explicitly
    ctx.fillStyle = 'rgba(0, 255, 0, 0.0)'; // Semi-transparent green for start
    ctx.beginPath();
    ctx.arc(START_SPACE.coordinates[0][0], START_SPACE.coordinates[0][1], 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    ctx.fillStyle = 'rgba(255, 0, 0, 0.0)'; // Semi-transparent red for finish
    ctx.beginPath();
    ctx.arc(FINISH_SPACE.coordinates[0][0], FINISH_SPACE.coordinates[0][1], 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Store all space coordinates for click detection
    if (!state.board.clickableSpaces) {
        state.board.clickableSpaces = [];
    } else {
        state.board.clickableSpaces.length = 0; // Clear previous spaces
    }
    
    // Add START and FINISH to clickable spaces
    state.board.clickableSpaces.push({
        x: START_SPACE.coordinates[0][0],
        y: START_SPACE.coordinates[0][1],
        type: 'start',
        pathColor: 'START'
    });
    
    state.board.clickableSpaces.push({
        x: FINISH_SPACE.coordinates[0][0],
        y: FINISH_SPACE.coordinates[0][1],
        type: 'finish',
        pathColor: 'FINISH'
    });

    for (const path of allPaths) {
        // Iterate over the segments array within the path object
        for (const space of path.segments) {
            if (!space.coordinates) continue;

            const type = (space.Type);
            const color = PATH_COLORS[space.pathColor.toLowerCase()] || 'transparent'; // Default transparent
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1;

            if (type === 'choicepoint') {
                // Draw polygon for choicepoint
                ctx.fillStyle = 'rgba(128, 128, 128, 0.3)'; // Semi-transparent grey
                ctx.beginPath();
                ctx.moveTo(space.coordinates[0][0], space.coordinates[0][1]);
                for (let i = 1; i < space.coordinates.length; i++) {
                    ctx.lineTo(space.coordinates[i][0], space.coordinates[i][1]);
                }
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                
                // Add each vertex to clickable spaces
                for (let i = 0; i < space.coordinates.length; i++) {
                    const x = space.coordinates[i][0];
                    const y = space.coordinates[i][1];
                    state.board.clickableSpaces.push({
                        x: x,
                        y: y,
                        type: 'choicepoint',
                        pathColor: space.pathColor
                    });
                }
            } else {
                // Draw simple circle/point for regular space
                const x = space.coordinates[0][0];
                const y = space.coordinates[0][1];
                const coordKey = `${x},${y}`;
                
                if (!drawnCoords.has(coordKey)) {
                    ctx.fillStyle = 'transparent'; // Make circles transparent
                    ctx.strokeStyle = 'transparent'; // Transparent stroke
                    ctx.beginPath();
                    ctx.arc(x, y, 7, 0, Math.PI * 2); // 7px radius for visibility and clicking
                    ctx.fill();
                    ctx.stroke();
                    drawnCoords.add(coordKey);
                    
                    // Add to clickable spaces
                    state.board.clickableSpaces.push({
                        x: x, 
                        y: y,
                        type: type || 'regular',
                        pathColor: space.pathColor
                    });
                }
            }
        }
    }
}

setTimeout(() => {
    drawTokens();
}, 5000); // 100ms just to confirm it's a render timing issue

export function drawTokens() {
    console.log('--------- drawTokens ---------');

    const tokenLayer = document.getElementById('token-Layer');
    if (!tokenLayer) {
        console.error('[drawTokens] #token-Layer not found in DOM. Skipping.');
        return;
    }

    const players = state.players;
    tokenLayer.innerHTML = ''; // Clear existing tokens
    console.log('[drawTokens] Drawing tokens for', players.length, 'players');

    players.forEach(player => {
        if (!player || !player.currentCoords || player.currentCoords.x == null || player.currentCoords.y == null) {
            console.warn(`[drawTokens] Skipping ${player?.name || 'unknown player'} — missing currentCoords`);
            return;
        }

        const roleInitial = player.role?.[0]?.toUpperCase(); // Uppercase to match filenames like "A.png"
        if (!roleInitial) {
            console.warn(`[drawTokens] Skipping ${player.name} — invalid role`);
            return;
        }

        const [scaledX, scaledY] = scaleCoordinates(player.currentCoords.x, player.currentCoords.y);
      //  console.log(`[drawTokens] ${player.name} scaled to [${scaledX}, ${scaledY}]`);

        const token = document.createElement('img');
        token.src = `assets/tokens/${roleInitial}.png`; // Ensure this path works
        token.alt = `${player.name}'s token`;
        token.style.position = 'absolute';
        token.style.width = '40px';
        token.style.height = '40px';
        token.classList.add('token', 'normal');
        token.dataset.playerId = player.id;

        window.addEventListener('resize', () => {
            updateAllTokenPositions();
          });

        token.style.transform = `translate(${scaledX}px, ${scaledY}px)`;

        function updateAllTokenPositions() {
            const tokens = document.querySelectorAll('.token');
          
            tokens.forEach(token => {
              const playerId = token.dataset.playerId;
              const player = state.players.find(p => p.id === playerId);
              if (!player) return;
          
              const [scaledX, scaledY] = scaleCoordinates(player.currentCoords.x, player.currentCoords.y);
              token.style.transform = `translate(${scaledX}px, ${scaledY}px)`;
            });
          }
          

        tokenLayer.appendChild(token);
    });
};

/**
 * Debug function to draw all path spaces and deck regions when DEBUG_MODE is true
 * Draws colored circles for spaces and rectangles for deck regions
 */
export function drawDebugOverlay() {
    if (!DEBUG_MODE) return;
    
    console.log('---------drawDebugOverlay---------');
    const ctx = state.board.ctx;
    if (!ctx) {
        console.warn('No canvas context available for debug overlay');
        return;
    }

    // Import the fullDeckRegionPathMap
    import('./board-data.js').then(({ fullDeckRegionPathMap }) => {
        // Draw path spaces
        const allPaths = [ageOfExpansionPath, ageOfResistancePath, ageOfReckoningPath, ageOfLegacyPath];
        
        for (const path of allPaths) {
            const pathKey = path.pathName; // e.g., 'ageOfExpansionPath'
            const deckInfo = fullDeckRegionPathMap[pathKey.replace('Path', '')];
            const pathColor = deckInfo?.cssClass || 'path-purple'; // Default color
            
            // Convert CSS class to canvas color
            let canvasColor;
            switch (pathColor) {
                case 'path-purple': canvasColor = 'rgba(128, 0, 128, 0.8)'; break;
                case 'path-blue': canvasColor = 'rgba(0, 0, 255, 0.8)'; break;
                case 'path-cyan': canvasColor = 'rgba(0, 255, 255, 0.8)'; break;
                case 'path-pink': canvasColor = 'rgba(255, 192, 203, 0.8)'; break;
                default: canvasColor = 'rgba(128, 128, 128, 0.0)'; break;
            }
            
            for (const segment of path.segments) {
                if (!segment.coordinates || segment.coordinates.length === 0) continue;
                
                const x = segment.coordinates[0][0];
                const y = segment.coordinates[0][1];
                const type = (segment.Type || '').toLowerCase();
                
                // Draw colored circle
                ctx.fillStyle = canvasColor;
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, Math.PI * 2); // 10px diameter
                ctx.fill();
                
                // Draw letter in white
                ctx.fillStyle = 'white';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                let letter;
                switch (type) {
                    case 'regular': letter = 'R'; break;
                    case 'draw': letter = 'D'; break;
                    case 'choicepoint': letter = 'C'; break;
                    case 'start': letter = 'S'; break;
                    case 'finish': letter = 'F'; break;
                    default: letter = '?'; break;
                }
                
                ctx.fillText(letter, x, y);
            }
        }
        
        // Draw deck region rectangles
        for (const [key, deckInfo] of Object.entries(fullDeckRegionPathMap)) {
            if (!deckInfo.positions || deckInfo.positions.length === 0) continue;
            
            // Convert CSS class to canvas color
            let canvasColor;
            switch (deckInfo.cssClass) {
                case 'path-purple': canvasColor = 'rgba(128, 0, 128, 0.3)'; break;
                case 'path-blue': canvasColor = 'rgba(0, 0, 255, 0.3)'; break;
                case 'path-cyan': canvasColor = 'rgba(0, 255, 255, 0.3)'; break;
                case 'path-pink': canvasColor = 'rgba(255, 192, 203, 0.3)'; break;
                default: canvasColor = 'rgba(128, 128, 128, 0.3)'; break;
            }
            
            for (const position of deckInfo.positions) {
                ctx.fillStyle = canvasColor;
                ctx.fillRect(
                    position.topleft,
                    position.toplefty,
                    position.toprightx - position.topleft,
                    position.bottomleft - position.toplefty
                );
            }
        }
        
        // Draw choicepoints as semi-transparent black rectangles
        for (const cp of choicepoints) {
            if (!cp.coords || typeof cp.coords !== 'object') continue;
            
            // Extract rectangle coordinates from new object format
            const coords = cp.coords;
            const minX = Math.min(coords.topleft, coords.toprightx, coords.bottomrightx, coords.bottomleftx);
            const maxX = Math.max(coords.topleft, coords.toprightx, coords.bottomrightx, coords.bottomleftx);
            const minY = Math.min(coords.toplefty, coords.topright, coords.bottomright, coords.bottomleft);
            const maxY = Math.max(coords.toplefty, coords.topright, coords.bottomright, coords.bottomleft);
            
            // Draw semi-transparent black rectangle
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(minX, minY, maxX - minX, maxY - minY);
            
            // Draw choicepoint ID in white
            ctx.fillStyle = 'white';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(cp.id, (minX + maxX) / 2, (minY + maxY) / 2);
        }
        
        console.log('Debug overlay drawn');
    }).catch(error => {
        console.error('Error importing board data for debug overlay:', error);
    });
}

