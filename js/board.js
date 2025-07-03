// Board Module for Critocracy - Coordinate-Based System


// ===== Imports =====
import { getPlayers } from './players.js'; 
// Removed getCurrentPlayer import as game logic will handle turns
import { 
    // Import the raw path data and constants
    purplePath, bluePath, cyanPath, pinkPath, 
    START_SPACE, FINISH_SPACE,
    ORIGINAL_WIDTH, ORIGINAL_HEIGHT,
    PATH_COLORS
} from './board-data.js'; 

// ===== Board Constants =====
const BOARD_IMAGE_PATH = 'assets/board.png';
const TOKEN_DIR = 'assets/tokens'; 
const TOKEN_SIZE = 30; 
// Removed SPACE_RADIUS, JUNCTION_RADIUS as clicks/drawing might use different logic

// ===== Board State =====
let boardState = {
    canvas: null,
    ctx: null, 
    scale: 1, 
    // REMOVED spaces map: boardState.spaces = {},
    // REMOVED startSpaceId: 'START',
    // REMOVED finishSpaceId: 'FINISH',
    playerTokenImages: {}, 
    boardImage: null, 
    // REMOVED boardData
};

// ===== Animation State (Keep for now) =====
let animationState = {
    isAnimating: false,
    playerToAnimate: null,
    stepsToTake: 0,
    stepsTaken: 0,
    // REMOVED currentDisplaySpaceId
    durationPerStep: 50, // Faster animation step
    onCompleteCallback: null
};

// ===== DELETED FUNCTIONS =====
// - initializeSpaces()
// - findSpaceByExactCoordinates()
// - getStartSpaceId()
// - getSpaceById()
// - getValidNextSpaces()
// - getValidNextPositions()
// - getCurrentSpace()
// - findSpaceByCoords()


// ===== NEW Coordinate Helper Functions (To be implemented later) ===== 

/**
 * Finds the full details of a space object matching the given coordinates.
 * Searches through all path arrays, START_SPACE, and FINISH_SPACE.
 * Handles exact matches for regular spaces and point-in-polygon for choicepoints.
 * @param {object} targetCoords - {x, y} coordinates.
 * @param {number} [tolerance=5] - Pixel tolerance for matching regular space coordinates.
 * @returns {object|null} - The matching space object { pathColor, coordinates, Next, Type, ... } or null.
 */
export function findSpaceDetailsByCoords(targetCoords, tolerance = 5) {
    if (!targetCoords) return null;

    const allPaths = [purplePath, bluePath, cyanPath, pinkPath];

    // Check START space first
    const startCoord = START_SPACE.coordinates[0];
    if (Math.abs(targetCoords.x - startCoord[0]) < tolerance && Math.abs(targetCoords.y - startCoord[1]) < tolerance) {
        // Return a structure consistent with path spaces, adding pathColor and Next
        return { ...START_SPACE, pathColor: 'none', Next: Object.values(START_SPACE.nextCoordOptions) };
    }

    // Check FINISH space
    const finishCoord = FINISH_SPACE.coordinates[0];
    if (Math.abs(targetCoords.x - finishCoord[0]) < tolerance && Math.abs(targetCoords.y - finishCoord[1]) < tolerance) {
        return { ...FINISH_SPACE, pathColor: 'none', Next: [] }; // Finish has no Next
    }

    // Search through paths
    for (const path of allPaths) {
        // Corrected: Iterate over the segments array within the path object
        for (const space of path.segments) {
            const type = (space.Type || '').toLowerCase();

            if (type === 'choicepoint') {
                // Check if point is inside polygon OR very close to any vertex
                let foundChoicepoint = false;
                if (isPointInPolygon(targetCoords, space.coordinates)) {
                    foundChoicepoint = true;
                } else {
                    // Check proximity to vertices (using smaller tolerance)
                    const vertexTolerance = 2; // Allow small deviation from vertex
                    for (const vertex of space.coordinates) {
                        if (Math.abs(targetCoords.x - vertex[0]) < vertexTolerance && 
                            Math.abs(targetCoords.y - vertex[1]) < vertexTolerance) {
                            console.log(`Coords (${targetCoords.x},${targetCoords.y}) matched vertex ${vertex} of choicepoint.`);
                            foundChoicepoint = true;
                            break; // Found a matching vertex
                        }
                    }
                }
                
                if (foundChoicepoint) {
                    return space;
                }
            } else {
                // Exact coordinate match (within tolerance) for regular spaces
                if (space.coordinates && Array.isArray(space.coordinates[0])) {
                    const coords = space.coordinates[0];
                    // Use a larger tolerance for regular spaces
                    const regularSpaceTolerance = 10; // Increased again
                    if (Math.abs(targetCoords.x - coords[0]) < regularSpaceTolerance && 
                        Math.abs(targetCoords.y - coords[1]) < regularSpaceTolerance) {
                        // console.log(`Matched regular space: ${space.pathColor} at ${coords}`); // Debug log
                        return space;
                    }
                    
                    // REDUNDANT CHECK: Also check if this regular space IS the finish space coord
                    // This helps if the path definition accidentally includes the exact finish coord
                    // or if the dedicated finish check somehow fails.
                    const finishCoordCheck = FINISH_SPACE.coordinates[0]; // Use different var name
                    const finishTolerance = 5; // Use standard finish tolerance
                    if (Math.abs(targetCoords.x - finishCoordCheck[0]) < finishTolerance && 
                        Math.abs(targetCoords.y - finishCoordCheck[1]) < finishTolerance) {
                         console.log(`Regular space check found match for FINISH coords at (${targetCoords.x}, ${targetCoords.y})`);
                         // Return the FINISH_SPACE object structure
                         return { ...FINISH_SPACE, pathColor: 'none', Next: [] }; 
                    }
                }
            }
        }
    }

    // console.warn(`findSpaceDetailsByCoords: No space found near (${targetCoords.x}, ${targetCoords.y})`);
    return null; // Not found
}


/**
 * Helper function: Ray-casting algorithm to check if a point is inside a polygon.
 * @param {object} point - { x, y }
 * @param {Array<Array<number>>} polygon - Array of [x, y] vertex coordinates.
 * @returns {boolean} - True if the point is inside the polygon.
 */
function isPointInPolygon(point, polygon) {
    const x = point.x, y = point.y;
    let isInside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i][0], yi = polygon[i][1];
        const xj = polygon[j][0], yj = polygon[j][1];

        const intersect = ((yi > y) !== (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) isInside = !isInside;
    }
    return isInside;
}

/**
 * Determines the next coordinate options based on the current coordinates.
 */
export function getNextStepOptions(currentCoords) {
    console.log(------getnextstepoptions start----------)
    console.log(`PATH DEBUG: Finding next step from (${currentCoords.x.toFixed(1)}, ${currentCoords.y.toFixed(1)})`);
    
    // Find current space details
    const spaceDetails = findSpaceDetailsByCoords(currentCoords);
    if (!spaceDetails) {
        console.error(`PATH ERROR: No space found at (${currentCoords.x.toFixed(1)}, ${currentCoords.y.toFixed(1)})`);
        return { type: 'Error', message: 'Current space not found' };
    }

    // Log what we found to aid debugging
    console.log(`PATH DEBUG: Found space with pathColor "${spaceDetails.pathColor || 'none'}", Type "${spaceDetails.Type || 'unknown'}"`);
    
    const currentType = (spaceDetails.Type || '').toLowerCase();

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
}

/**
 * Helper function to find an alternative path from the current coordinates
 * Searches all path segments to find one close to current position
 */
function findAlternativePathFrom(currentCoords) {
    console.log(`PATH DEBUG: Searching for alternative path from (${currentCoords.x.toFixed(1)}, ${currentCoords.y.toFixed(1)})`);
    
    const tolerance = 20; // Wider tolerance for finding segments
    const allPaths = [purplePath, bluePath, cyanPath, pinkPath];
    let closestSegment = null;
    let minDistance = Infinity;
    
    // Look through all paths for closest segment
    for (const path of allPaths) {
        for (const segment of path.segments) {
            if (!segment.coordinates || !Array.isArray(segment.coordinates[0])) continue;
            
            // Calculate distance to this segment
            const segmentCoords = segment.coordinates[0];
            const distance = Math.sqrt(
                Math.pow(currentCoords.x - segmentCoords[0], 2) + 
                Math.pow(currentCoords.y - segmentCoords[1], 2)
            );
            
            // Skip exact match (that's our current position)
            if (distance < 0.1) continue;
            
            // If this segment is close enough and has a valid Next
            if (distance < tolerance && segment.Next && Array.isArray(segment.Next[0])) {
                // If closer than previous best match
                if (distance < minDistance) {
                    minDistance = distance;
                    closestSegment = segment;
                }
            }
        }
    }
    
    if (closestSegment && closestSegment.Next && Array.isArray(closestSegment.Next[0])) {
        console.log(`PATH DEBUG: Found alternative segment with distance ${minDistance.toFixed(1)}`);
        return closestSegment.Next[0];
    }
    
    return null; // No alternative found
}

// ===== Existing Drawing/Setup/Animation (Will need modification) =====

/**
 * Loads player token images.
 */
async function loadTokenImages() {
    console.log(----------loadtokenimages start---------)
    // ... (Keep existing implementation) ...
    const roles = ['H', 'E', 'A', 'P', 'R', 'C']; // Example roles
    const promises = roles.map(role => new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            boardState.playerTokenImages[role] = img;
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
}

/**
 * Sets up the canvas and loads board/token images.
 * REMOVED calls to initializeSpaces and board data setup.
 */
export async function setupBoard() {
    console.log("Setting up board...");
    boardState.canvas = document.getElementById('board-canvas');
    if (!boardState.canvas) {
        console.error("Board setup failed - could not find canvas element");
        return false;
    }
    boardState.ctx = boardState.canvas.getContext('2d');
    if (!boardState.ctx) {
        console.error("Board setup failed - could not get 2d context");
        return false;
    }

    await Promise.all([
        // Load board image
        new Promise((resolve, reject) => {
            // ... (Keep existing board image loading logic) ...
            const boardImg = new Image();
            boardState.boardImage = boardImg;
            console.log("Loading board image from:", BOARD_IMAGE_PATH);
            boardImg.onload = () => {
                console.log("✓ Successfully loaded board image (", boardImg.naturalWidth, "x", boardImg.naturalHeight, ")");
                boardState.canvas.width = boardImg.naturalWidth;
                boardState.canvas.height = boardImg.naturalHeight;
                console.log(`Canvas size set to: ${boardState.canvas.width}x${boardState.canvas.height}`);
                resolve(); 
            };
            boardImg.onerror = () => {
                 console.error("Board image failed to load:", BOARD_IMAGE_PATH);
                 // Set default size if image fails
                 boardState.canvas.width = ORIGINAL_WIDTH;
                 boardState.canvas.height = ORIGINAL_HEIGHT;
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
}


/**
 * Draws the game board, spaces, connections, and player tokens.
 */
export function drawBoard() {
    // ... (ctx check) ...
    if (!boardState.ctx) { /* ... */ return; }
    const ctx = boardState.ctx;
    ctx.clearRect(0, 0, boardState.canvas.width, boardState.canvas.height);
    if (boardState.boardImage) {
        ctx.drawImage(boardState.boardImage, 0, 0, boardState.canvas.width, boardState.canvas.height);
    } else {
        // Fallback drawing
        ctx.fillStyle = "#ccc";
        ctx.fillRect(0, 0, boardState.canvas.width, boardState.canvas.height);
        ctx.fillStyle = "black";
        ctx.fillText("Board image not loaded", 50, 50);
    }
    // Call new/modified drawing functions
    drawCardRectangles(); // Draw card deck rectangles
    drawPathSpaces(); // New function to draw spaces from path arrays
    drawPathConnections(); // New function to draw connections from path arrays
    drawPlayerTokens(); // Needs modification to use player.currentCoords
    // drawHighlighting(); // Will need modification
    console.log("Board drawing complete");
}

/**
 * Draws connections between spaces defined in the path arrays.
 */
function drawPathConnections() {
    console.log(--------drawpathconnections start--------)
    if (!boardState.ctx) return;
    const ctx = boardState.ctx;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.0)'; // Faint black lines
    ctx.lineWidth = .5;
    const allPaths = [purplePath, bluePath, cyanPath, pinkPath];

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
}

/**
 * Draws spaces defined in the path arrays.
 */
function drawPathSpaces() {
    console.log(-------drawpathspaces start--------)
    if (!boardState.ctx) return;
    const ctx = boardState.ctx;
    const allPaths = [purplePath, bluePath, cyanPath, pinkPath];
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
    if (!boardState.clickableSpaces) {
        boardState.clickableSpaces = [];
    } else {
        boardState.clickableSpaces.length = 0; // Clear previous spaces
    }
    
    // Add START and FINISH to clickable spaces
    boardState.clickableSpaces.push({
        x: START_SPACE.coordinates[0][0],
        y: START_SPACE.coordinates[0][1],
        type: 'start',
        pathColor: 'START'
    });
    
    boardState.clickableSpaces.push({
        x: FINISH_SPACE.coordinates[0][0],
        y: FINISH_SPACE.coordinates[0][1],
        type: 'finish',
        pathColor: 'FINISH'
    });

    for (const path of allPaths) {
        // Iterate over the segments array within the path object
        for (const space of path.segments) {
            if (!space.coordinates) continue;

            const type = (space.Type || '').toLowerCase();
            const color = PATH_COLORS[space.pathColor.toUpperCase()] || 'transparent'; // Default transparent
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
                    boardState.clickableSpaces.push({
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
                    boardState.clickableSpaces.push({
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

/**
 * Draw all player tokens based on their currentCoords.
 */
function drawPlayerTokens() {
    console.log(--------drawplayertokens start---------)
    if (!boardState.ctx) return;
    const ctx = boardState.ctx;
    const players = getPlayers(); // From players.js

    for (const player of players) {
        if (!player.currentCoords) continue; // Skip if no coords
        
        const x = player.currentCoords.x;
        const y = player.currentCoords.y;
        const role = player.role;
        const tokenImage = boardState.playerTokenImages[role[0]]; // Use first letter for image key

        if (tokenImage) {
            // Draw image centered
            ctx.drawImage(tokenImage, x - TOKEN_SIZE / 2, y - TOKEN_SIZE / 2, TOKEN_SIZE, TOKEN_SIZE);
        } else {
            // Fallback: Draw colored circle
            ctx.fillStyle = PATH_COLORS[role] || '#000'; // Use role color or black
            ctx.beginPath();
            ctx.arc(x, y, TOKEN_SIZE / 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Optional: Draw player name/initial slightly offset?
        // ctx.fillStyle = "white";
        // ctx.fillText(player.name[0], x, y + 5);
    }
}

// ===== Animation Functions (Coordinate based, keep existing structure) =====

/**
 * Animates a token moving from one position to another
 * @param {object} player - The player whose token is being moved
 * @param {object} newPosition - {x, y} coordinates of destination
 * @param {number} duration - Time in milliseconds for the animation
 * @param {function} onComplete - Callback function to run when animation completes
 */
export function animateTokenToPosition(player, newPosition, duration = 500, onComplete = null) {
    console.log(---------animatetokentoposition start---------)
    console.log(`TOKEN DEBUG: Animating player ${player.name || player.id} movement from (${player.currentCoords?.x?.toFixed(1) || "unknown"}, ${player.currentCoords?.y?.toFixed(1) || "unknown"}) to (${newPosition?.x?.toFixed(1) || "unknown"}, ${newPosition?.y?.toFixed(1) || "unknown"})`);
    
    if (!player || !newPosition) {
        console.error('TOKEN ERROR: animateTokenToPosition - Missing required parameters');
        if (onComplete) onComplete();
        return;
    }
    
    if (!player.currentCoords) {
        console.error('TOKEN ERROR: Player has no currentCoords property!');
        player.currentCoords = newPosition; // Force current position to new position
        if (onComplete) onComplete();
        return;
    }
    
    if (newPosition.x === undefined || newPosition.y === undefined) {
        console.error('TOKEN ERROR: Invalid newPosition provided:', newPosition);
        if (onComplete) onComplete();
        return;
    }

    // Check if new position is the same as current position (within a small tolerance)
    const samePosition = Math.abs(player.currentCoords.x - newPosition.x) < 0.1 && 
                         Math.abs(player.currentCoords.y - newPosition.y) < 0.1;
    
    if (samePosition) {
        console.warn('TOKEN WARNING: Attempting to animate to the same position. Skip animation.');
        if (onComplete) onComplete();
        return;
    }

    // Get a reference to the player object in the players array
    const gamePlayer = getPlayers().find(p => p.id === player.id);
    if (!gamePlayer) {
        console.error(`TOKEN ERROR: Could not find player ${player.id} in players array`);
        // Fallback to using the provided player object directly
        console.log('TOKEN DEBUG: Falling back to using provided player object');
        continueWithAnimation(player);
        return;
    }
    
    continueWithAnimation(gamePlayer);
    console.log (------continuewithanimation start-------)
    
    function continueWithAnimation(playerObj) {
        const startX = playerObj.currentCoords.x;
        const startY = playerObj.currentCoords.y;
        const endX = newPosition.x;
        const endY = newPosition.y;

        // Calculate distance for logging and duration adjustment
        const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        console.log(`TOKEN DEBUG: Distance to travel: ${distance.toFixed(1)} pixels`);
        
        // Make CPU movements visibly slower
        let actualDuration = duration;
        if (!playerObj.isHuman) {
            actualDuration = Math.max(800, Math.min(1500, distance * 8)); // Scale duration with distance
        }
        console.log(`TOKEN DEBUG: Animation duration: ${actualDuration}ms`);

        const startTime = Date.now();
        
        function animate() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / actualDuration, 1);
            
            // Easing function for smoother movement
            const easedProgress = progress < 0.5 
                ? 2 * progress * progress 
                : -1 + (4 - 2 * progress) * progress;
            
            const currentX = startX + (endX - startX) * easedProgress;
            const currentY = startY + (endY - startY) * easedProgress;
            
            // Update the player's visual position (not logical coords yet)
            playerObj.visualCoords = { x: currentX, y: currentY };
            
            // Redraw the board with the updated positions
            console.log(------redraw board------)
            drawBoard();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
                console.log(-------requestAnimationFrame start --------)
            } else {
                // Animation complete
                console.log(`TOKEN DEBUG: Animation complete for player ${playerObj.name || playerObj.id}`);
                
                // Update the player's logical position
                playerObj.currentCoords = { x: endX, y: endY };
                playerObj.visualCoords = null; // Clear visual coords
                
                // Validate the position was set correctly
                console.log(`TOKEN DEBUG: Player position updated to (${playerObj.currentCoords.x.toFixed(1)}, ${playerObj.currentCoords.y.toFixed(1)})`);
                
                // Redraw one final time
                drawBoard();
                
                // Call the completion callback if provided
                if (onComplete) {
                    console.log(`TOKEN DEBUG: Calling onComplete callback`);
                    onComplete();
                }
            }
        }
        
        animate();
    }
}

/**
 * Handles movement animation using coordinates.
 * Stops on interrupting spaces or when steps run out.
 */
export function startMoveAnimation(player, steps, onComplete) {
    console.log(--------------startmoveanimation start-------------------)
    let currentStep = 0;
    let currentCoords = { ...player.currentCoords }; 
    const INTERRUPTING_TYPES = ['draw', 'choicepoint', 'junction', 'finish', 'special_event']; 
    let totalStepsRequested = steps; // Keep original number of steps

    // IMPORTANT: Validate steps is a positive number
    if (typeof steps !== 'number' || steps <= 0 || isNaN(steps)) {
        console.error(`ANIMATE ERROR: Invalid steps value: ${steps}, type: ${typeof steps}. Must be positive number.`);
        if (onComplete) {
            onComplete({ reason: 'error_invalid_steps', stepsTaken: 0 });
        }
        return;
    }

    console.log(`ANIMATE: Starting move sequence for ${player.name} from (${currentCoords.x},${currentCoords.y}) for ${steps} steps.`);
    console.log(----------------move animatiion starting------------)
    
    // ADDED: Validate starting position before attempting to move
    if (!isValidPlayerPosition(currentCoords)) {
        console.error(`ANIMATE ERROR: Invalid starting position (${currentCoords.x},${currentCoords.y}). Resetting player to start space.`);
        // Reset player to Start space
        currentCoords = { x: START_SPACE.coordinates[0][0], y: START_SPACE.coordinates[0][1] };
        player.currentCoords = { ...currentCoords }; // Update player immediately
        // Draw the player at the correct position
        drawBoard();
        
        if (onComplete) {
            onComplete({ reason: 'error_invalid_position', stepsTaken: 0 });
        }
        return;
    }
    
    function completeAnimation(reason) {
        console.log(------------completeanimation start------------)
        console.log(`ANIMATE: Completing at (${currentCoords.x},${currentCoords.y}). Reason: ${reason}, Steps Taken: ${currentStep}/${totalStepsRequested}`);
        player.currentCoords = { ...currentCoords }; // Update player state *before* callback
        if (onComplete) {
            onComplete({ reason: reason, stepsTaken: currentStep });
            console.log(-------------oncomplete animation start----------)
        }
    }
    
    function moveNextStep() {
        console.log(-------movenextstep start----------)
        if (currentStep >= totalStepsRequested) {
            completeAnimation('steps_complete');
            return;
        }
        
        const nextOptions = getNextStepOptions(currentCoords);
        console.log(------------------getnextstepoptions start -------------------------)
        console.log(`ANIMATE DEBUG: Step ${currentStep+1}, nextOptions:`, nextOptions);

        if (!nextOptions || nextOptions.type === 'Error' || nextOptions.type === 'End') {
            console.warn(`ANIMATE: Cannot move further from (${currentCoords.x},${currentCoords.y}). Options:`, nextOptions);
            completeAnimation('error_blocked');
            return;
        }
        
        if (nextOptions.type === 'LandedOnFinish') {
             console.log(`ANIMATE: Already on Finish space. Stopping.`);
             completeAnimation('interrupt_finish'); // Consider this an interrupt finish
             return;
        }

        let nextCoordsArray = null;
        if (nextOptions.type === 'Choicepoint') {
            if (nextOptions.options && nextOptions.options.length > 0) {
                // AI/Test Strategy: Choose the first path option
                nextCoordsArray = nextOptions.options[0]; 
                console.log(`ANIMATE: At Choicepoint, AI/Test choosing first option -> [${nextCoordsArray[0]}, ${nextCoordsArray[1]}]`);
            } else {
                console.error(`ANIMATE: Choicepoint at (${currentCoords.x},${currentCoords.y}) has no Next options! Stopping.`);
                completeAnimation('error_no_choice_options');
                return;
            }
        } else if (nextOptions.type === 'Regular' || nextOptions.type === 'Finish') {
            nextCoordsArray = nextOptions.nextCoords;
            
            // CRITICAL FIX: Validate nextCoords exists
            if (!nextCoordsArray) {
                console.error(`ANIMATE: nextCoords missing for Regular/Finish type. Current position: (${currentCoords.x},${currentCoords.y})`);
                completeAnimation('error_missing_next_coords');
                return;
            }
        } else {
             console.error(`ANIMATE: Unexpected nextOptions type: ${nextOptions.type}. Stopping.`);
             completeAnimation('error_unexpected_option');
             return;
        }

        if (!nextCoordsArray || !Array.isArray(nextCoordsArray) || nextCoordsArray.length < 2) {
            console.error(`ANIMATE: Invalid nextCoordsArray determined: ${JSON.stringify(nextCoordsArray)}. Stopping.`);
            completeAnimation('error_invalid_coords');
            return;
        }

        const targetPos = { x: nextCoordsArray[0], y: nextCoordsArray[1] };
        
        // FIX: Validate target position is different from current position
        if (Math.abs(targetPos.x - currentCoords.x) < 0.1 && Math.abs(targetPos.y - currentCoords.y) < 0.1) {
            console.error(`ANIMATE: Target position same as current position! Current: (${currentCoords.x},${currentCoords.y}), Target: (${targetPos.x},${targetPos.y})`);
            completeAnimation('error_same_position');
            return;
        }
        
        const targetSpaceDetails = findSpaceDetailsByCoords(targetPos);
        const targetTypeLower = targetSpaceDetails ? (targetSpaceDetails.Type || '').toLowerCase() : 'unknown';
        const isChoicepoint = targetTypeLower === 'choicepoint' || targetTypeLower === 'junction';
        const isFinish = targetTypeLower === 'finish';
        const shouldInterrupt = isChoicepoint || isFinish || INTERRUPTING_TYPES.includes(targetTypeLower);

        console.log(`ANIMATE: Step ${currentStep+1}/${totalStepsRequested}: (${currentCoords.x},${currentCoords.y}) -> (${targetPos.x},${targetPos.y}) (Target Type: ${targetTypeLower}, Interrupt: ${shouldInterrupt})`);
        
        animateTokenToPosition(player, targetPos, animationState.durationPerStep, () => {
            console.log(-------animatetokentoposition start-----------)
            // Update currentCoords for the next step calculation
            // FIX: Use targetPos directly to avoid potential issues with player.x/y
            currentCoords = { ...targetPos };
            currentStep++; // Increment step count *after* successful move
            
            // 5. Check completion/interrupt conditions AFTER moving and updating step count
            if (isFinish) {
                 completeAnimation('interrupt_finish');
            } else if (isChoicepoint) {
                 completeAnimation('interrupt_choicepoint');
            } else if (shouldInterrupt) { // Other interrupting types (Draw, Event)
                 completeAnimation(`interrupt_${targetTypeLower}`);
            } else if (currentStep >= totalStepsRequested) {
                 completeAnimation('steps_complete');
            } else {
                 // Move continues: Recurse
                 setTimeout(moveNextStep, animationState.durationPerStep); 
            }
        });
    }
    
    moveNextStep(); 
}

/**
 * Helper function to validate if a position corresponds to a valid space on the board
 * @param {object} coords - {x, y} coordinates to check
 * @returns {boolean} - true if position is valid, false otherwise
 */
function isValidPlayerPosition(coords) {
    if (!coords || typeof coords.x !== 'number' || typeof coords.y !== 'number') {
        return false;
    }
    
    // Check if we can find a space at these coordinates
    const spaceDetails = findSpaceDetailsByCoords(coords);
    return spaceDetails !== null;
}

/** 
 * Scale coordinates from original board coordinates to canvas display coordinates
 * @param {number} x - Original x coordinate
 * @param {number} y - Original y coordinate
 * @returns {[number, number]} Scaled coordinates
 */
export function scaleCoordinates(x, y) {
    const canvas = document.getElementById('board-canvas');
    if (!canvas) return [x, y];
    
    const scaleX = canvas.width / 1500; // Original board width
    const scaleY = canvas.height / 1000; // Original board height
    
    return [x * scaleX, y * scaleY];
}

/** 
 * Unscale coordinates from canvas display coordinates to original board coordinates
 * @param {number} x - Canvas x coordinate
 * @param {number} y - Canvas y coordinate
 * @returns {[number, number]} Original coordinates
 */
export function unscaleCoordinates(x, y) {
    const canvas = document.getElementById('board-canvas');
    if (!canvas) return [x, y];
    
    const scaleX = 1500 / canvas.width; // Original board width
    const scaleY = 1000 / canvas.height; // Original board height
    
    return [x * scaleX, y * scaleY];
}

// --- REMOVED calculateReachableSpaces, findClosestSpace, etc. as they relied on old system ---
// Highlighting logic will need complete rewrite based on coordinate paths.

export { boardState }; // Export modified boardState

/**
 * Draws rectangles for the card spaces with specified colors
 */
function drawCardRectangles() {
    if (!boardState.ctx) return;
    const ctx = boardState.ctx;
    
    // Set global alpha for transparency
    ctx.globalAlpha = 0.3; // 50% transparency
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    
    // Gold rectangles for End of Turn cards
    ctx.fillStyle = "#FFD700"; // Gold color
    
    // First gold rectangle
    ctx.beginPath();
    ctx.moveTo(299, 441);
    ctx.lineTo(392, 441);
    ctx.lineTo(392, 585);
    ctx.lineTo(299, 585);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Second gold rectangle
    ctx.beginPath();
    ctx.moveTo(1124, 458);
    ctx.lineTo(1212, 458);
    ctx.lineTo(1212, 597);
    ctx.lineTo(1124, 597);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Purple card rectangle
    ctx.fillStyle = "#9C54DE"; // Purple hex color
    ctx.beginPath();
    ctx.moveTo(559, 469);
    ctx.lineTo(658, 468);
    ctx.lineTo(659, 624);
    ctx.lineTo(559, 624);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Pink card rectangle
    ctx.fillStyle = "#FF66FF"; // Pink hex color
    ctx.beginPath();
    ctx.moveTo(685, 246);
    ctx.lineTo(812, 246);
    ctx.lineTo(812, 404);
    ctx.lineTo(685, 404);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Blue card rectangle
    ctx.fillStyle = "#1B3DE5"; // Blue hex color
    ctx.beginPath();
    ctx.moveTo(841, 468);
    ctx.lineTo(948, 468);
    ctx.lineTo(948, 622);
    ctx.lineTo(841, 622);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Cyan card rectangle
    ctx.fillStyle = "#00FFFF"; // Cyan hex color
    ctx.globalAlpha = 0.4; // Make it more opaque than other cards
    ctx.beginPath();
    ctx.moveTo(686, 694);
    ctx.lineTo(811, 694);
    ctx.lineTo(811, 870);
    ctx.lineTo(686, 870);
    ctx.closePath();
    ctx.fill();
    
    // Add a more visible white border to cyan card
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 3;
    ctx.stroke();
    
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
    ctx.fillText("END OF TURN", 345, 515);
    ctx.fillText("END OF TURN", 1170, 530);
    
    // Age/color labels
    ctx.fillText("AGE OF EXPANSION", 609, 550);
    ctx.fillText("AGE OF LEGACY", 748, 325);
    ctx.fillText("AGE OF RECKONING", 894, 550);
    ctx.fillText("AGE OF RESISTANCE", 748, 785);
    
    // Reset global alpha
    ctx.globalAlpha = 1.0;
}
