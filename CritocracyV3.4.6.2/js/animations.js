import { 
    getUIState, 
    updateUIState,
    state,
    updateGameState 
} from './state.js';

import {
    promptForChoicepoint,

} from './ui.js';

import { 
    getCurrentPlayer,
    handleEndOfMove,
    handlePlayerAction
} from './game.js';

import { 
    drawTokens, 
    scaleCoordinates,
    drawBoard
} from './board.js';

import { 
    fullDeckRegionPathMap, 
    ageOfExpansionPath, 
    ageOfResistancePath, 
    ageOfReckoningPath, 
    ageOfLegacyPath, 
    PATH_COLORS,
    choicepoints
} from './board-data.js';


import {drawCard } from './cards.js';

// Animation timing constants
export const TIMING = {
    // Card animations
    CARD_FLIP: 500,
    CARD_DISCARD: 1000,
    CARD_DRAW: 1000,
    
    // Player turns
    CPU_CARD_DISPLAY: 4000,
    CPU_DECK_FLASH: 4000,
    CPU_MOVE_DELAY: 1000,
    
    // Dice
    DICE_ROLL: 1000,
    DICE_SHAKE: 300,
    
    // UI effects
    FADE_IN: 300,
    FADE_OUT: 300,
    PULSE: 1500,
    TOKEN_MOVE: 1000
};

/**
 * Animates a value from start to end over a duration
 * @param {number} start - Starting value
 * @param {number} end - Ending value
 * @param {number} duration - Duration in milliseconds
 * @param {Function} callback - Callback function with current value
 */
export const animateValue = (start, end, duration, callback) => {
    const startTime = performance.now();
    
    const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease in-out cubic
        const eased = progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        const current = start + (end - start) * eased;
        callback(current);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    };
    
    // Update gameState references
    const { animation: { frameId: existingId } } = getUIState();
    if (existingId) {
        cancelAnimationFrame(existingId);
    }
    
    const newFrameId = requestAnimationFrame(update);
    updateUIState({
        animation: {
            ...getUIState().animation,
            frameId: newFrameId
        }
    });
};

/**
 * Animates a dice roll
 * @param {HTMLElement} diceElement - Dice element to animate
 * @param {number} finalValue - Final dice value
 * @param {number} duration - Duration in milliseconds
 * @returns {Promise} Resolves when animation completes
 */
export const animateDiceRoll = async (duration = 2000) => {
  console.log('---------animateDiceRoll---------');

  const player = getCurrentPlayer();

  // If not human, delay 2 seconds before continuing
  if (!player?.isHuman) {
      console.log('CPU player detected – auto-rolling in 2 seconds...');
      await new Promise(resolve => setTimeout(resolve, 2000));
  }

     const dice = document.getElementById('dice');
   if (!dice) return;

  // Disable interaction while rolling
  dice.style.pointerEvents = 'none';

  // Add rolling class to trigger animation
  dice.classList.add('rolling');

     // Use the provided finalValue or generate a random roll if not provided
   const result = Math.ceil(Math.random() * 6);
   
   // Store the roll result in state
   updateGameState({ rollResult: result });

  // After animation completes, show the result
  setTimeout(() => {
      dice.classList.remove('rolling');

             // Position the dice to show the result face
       let transform = '';
       switch(result) {
          case 1: transform = 'rotateX(0deg) rotateY(0deg)'; break;
          case 2: transform = 'rotateY(90deg) rotateX(0deg)'; break;
          case 3: transform = 'rotateX(90deg) rotateY(0deg)'; break;
          case 4: transform = 'rotateX(-90deg) rotateY(0deg)'; break;
          case 5: transform = 'rotateY(-90deg) rotateX(0deg)'; break;
          case 6: transform = 'rotateY(180deg) rotateX(0deg)'; break;
      }

      // Apply final transform and show face
      dice.style.transform = `${transform} scale(1.2)`;

      // Keep face visible for 1.5s before proceeding
      setTimeout(() => {
                     // Then enable interaction and trigger game logic
           dice.style.pointerEvents = 'auto';
           dice.classList.add('shake');
           
           // Set the roll result in state before calling handlePlayerAction
           updateGameState({ rollResult: result });
           handlePlayerAction();
      }, 1500);

  }, duration); // Match this with the CSS animation duration

  return result;
};

/**
 * Animates a card being drawn with proper timing for CPU vs Human
 * @param {HTMLElement} cardElement - Card element to animate
 * @param {Object} start - Starting position {x, y}
 * @param {Object} end - Ending position {x, y}
 * @param {boolean} isCPU - Whether this is a CPU player
 * @returns {Promise} Resolves when animation completes
 */
export function animateCardDraw(deckType) {
    console.log('---------animateCardDraw---------');
    const uiState = getUIState();
    if (!uiState.canvas || !uiState.ctx) {
        console.warn('No canvas or context available for animation');
        return;
    }

    // Get the deck region configuration
    let coords;
    if (deckType === 'endOfTurnDeck') {
        // For end of turn deck, randomly choose one of the two regions
        const regionId = Math.random() < 0.5 ? 'endOfTurnRegion1' : 'endOfTurnRegion2';
        coords = getRegionCoords(regionId);
    } else {
        // For age decks, find the matching region
        const region = Object.values(fullDeckRegionPathMap).find(r => r.deckType === deckType);
        if (region) {
            coords = getRegionCoords(region.regionId);
        }
    }

    if (!coords) {
        console.warn(`No deck configuration found for type: ${deckType}`);
        return;
    }

    // Calculate card dimensions and position
    const [x1, y1, x2, y2] = coords;
    const cardWidth = x2 - x1;
    const cardHeight = y2 - y1;
    const cardX = x1;
    const cardY = y1;

    // Create animation frames
    return new Promise((resolve) => {
        let startTime = null;
        
        function animate(currentTime) {
            if (!startTime) startTime = currentTime;
            const elapsed = currentTime - startTime;
            
            // Clear previous frame
            uiState.ctx.clearRect(cardX, cardY, cardWidth, cardHeight);
            
            if (elapsed < TIMING.CARD_DRAW) {
                // Calculate animation progress
                const progress = elapsed / TIMING.CARD_DRAW;
                
                // Draw card with scaling effect
                const scale = 1 + (0.2 * Math.sin(progress * Math.PI));
                const scaledWidth = cardWidth * scale;
                const scaledHeight = cardHeight * scale;
                const offsetX = (scaledWidth - cardWidth) / 2;
                const offsetY = (scaledHeight - cardHeight) / 2;
                
                uiState.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                uiState.ctx.fillRect(
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
    });
};

/**
 * Animates a deck flashing to indicate it's time to draw
 * @param {HTMLElement} deck - Deck element to animate
 * @param {boolean} isCPU - Whether this is a CPU player
 * @returns {Promise} Resolves when animation completes
 */
export const animateDeckFlash = (deck, isCPU = false) => {
    return new Promise(resolve => {
        let flashCount = 0;
        const maxFlashes = isCPU ? 4 : 999; // CPU: 4 seconds, Human: indefinite
        
        const flash = () => {
            if (flashCount >= maxFlashes) {
                deck.style.opacity = '1';
                resolve();
                return;
            }
            
            deck.style.opacity = flashCount % 2 === 0 ? '0.3' : '1';
            flashCount++;
            
            setTimeout(flash, isCPU ? 500 : 300); // Faster flash for human
        };
        
        flash();
    });
};

/**
 * Gets the path segments between two points
 * @param {Object} start - Starting coordinates {x, y}
 * @param {Object} end - Ending coordinates {x, y}
 * @param {Object} pathData - Path data containing segments
 * @returns {Array} Array of coordinates representing the path
 */
export function getPathSegments(start, end, pathData) {
    console.log('---------getPathSegments---------');
    // Find the closest segment to start
    let startSegment = null;
    let minStartDist = Infinity;
  
    for (const segment of pathData.segments) {
        const coords = segment.coordinates[0];
        const dist = Math.hypot(coords[0] - start.x, coords[1] - start.y);
        if (dist < minStartDist) {
            minStartDist = dist;
            startSegment = segment;
        }
    }
  
    // Find the closest segment to end
    let endSegment = null;
    let minEndDist = Infinity;
  
    for (const segment of pathData.segments) {
        const coords = segment.coordinates[0];
        const dist = Math.hypot(coords[0] - end.x, coords[1] - end.y);
        if (dist < minEndDist) {
            minEndDist = dist;
            endSegment = segment;
        }
    }
  
    if (!startSegment || !endSegment) {
        // Fallback to a direct path in the same format
        return [
            [start.x, start.y],
            [end.x, end.y]
        ];
    }
  
    // Build path segments
    const segments = [];
    let currentSegment = startSegment;
  
    while (currentSegment && currentSegment !== endSegment) {
        segments.push(currentSegment.coordinates[0]);
  
        // Find next segment
        if (currentSegment.Next && currentSegment.Next.length > 0) {
            const nextCoords = currentSegment.Next[0];
            currentSegment = pathData.segments.find(s =>
                s.coordinates[0][0] === nextCoords[0] &&
                s.coordinates[0][1] === nextCoords[1]
            );
        } else {
            break;
        }
    }
  
    if (endSegment) {
        segments.push(endSegment.coordinates[0]);
    }
  
    return segments;
};
  
export const ensurePlayerPath = (player) => {
    console.log('---------ensurePlayerPath---------');
    if (!player.currentPath) {
      player.currentPath = 'ageOfLegacyPath'; // or default based on your game state
    }
};  
  
/**
 * Animates the player's token forward based on the dice roll.
 *
 * @param {object} player - The player whose token is moving.
 * @param {object} newPosition - The destination (currently unused).
 * @param {number} duration - Animation duration in ms.
 * @param {boolean} skipSpaceAction - If true, bypass space actions at end.
 * @param {function|null} onComplete - Callback after animation finishes.
 */
export function animateTokenToPosition(player, newPosition, duration = 1000, skipSpaceAction = false, onComplete = null) {
  console.log(`----------animateTokenToPosition: ${player.name} moving ${state.rollResult} spaces -----------`);

  player = getCurrentPlayer();
  const rollResult = state.rollResult;
  console.log(`Moving ${rollResult} spaces for ${player.name}`);

  return new Promise(async (resolve) => {
    const token = document.querySelector(`[data-player-id="${player.id}"]`);
    if (!token) {
      console.warn("Token not found for player:", player);
      resolve();
      return;
    }

    const paths = [ageOfExpansionPath, ageOfResistancePath, ageOfReckoningPath, ageOfLegacyPath];
    let pathData = paths.find(path => path.pathName === player.currentPath);

    if (!pathData || !pathData.segments) {
      console.warn("No path data found for player's current path.");
      resolve();
      return;
    }

    let remainingSteps = rollResult;
    let currentCoord = { ...player.currentCoords };

    const findSegmentByCoord = (coord) => {
      return pathData.segments.find(segment => {
        const segCoord = segment.coordinates?.[0];
        return segCoord?.[0] === coord.x && segCoord?.[1] === coord.y;
      });
    };

    const animatePosition = (element, start, end, duration = 1000) => {
      return new Promise(resolve => {
        const startTime = performance.now();

        const update = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);

          const eased = progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

          const currentX = start.x + (end.x - start.x) * eased;
          const currentY = start.y + (end.y - start.y) * eased;

          const [scaledX, scaledY] = scaleCoordinates(currentX, currentY);
          element.style.transform = `translate(${scaledX}px, ${scaledY}px)`;

          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            resolve();
          }
        };

        requestAnimationFrame(update);
      });
    };

    async function animateNextSegment() {
      if (remainingSteps <= 0) {
        // Movement complete
        console.log(`[DEBUG] Movement complete. Final position: ${JSON.stringify(currentCoord)}`);
        token.classList.remove('enlarged');
        token.classList.add('normal');
        await handleEndOfMove();
        resolve();
        return;
      }
    
      const segment = findSegmentByCoord(currentCoord);
      if (!segment || !segment.Next || segment.Next.length === 0) {
        console.warn("Invalid or incomplete segment found at", currentCoord);
        resolve();
        return;
      }
    
      // Check if this is a choicepoint (multiple Next coordinates)
      if (segment.Next.length > 1) {
        console.log(`[DEBUG] Choicepoint detected at ${JSON.stringify(currentCoord)} with ${segment.Next.length} options`);
        
        // Store interrupted move data
        state.interruptedMove = {
          remainingSteps,
          duration,
          skipSpaceAction,
          onComplete
        };
        
        // Set game phase to await choicepoint choice
        updateGameState({
          currentPhase: 'AWAITING_CHOICEPOINT_CHOICE',
          pendingActionData: {
            choiceOptions: segment.Next
          }
        });
        
        // Prompt for choice based on player type
        if (player.isHuman) {
          console.log("Prompting human for choicepoint choice");
          promptForChoicepoint(segment.Next, (chosenOption) => {
            console.log("Human chose:", chosenOption);
            // Resume movement with chosen path
            player.currentCoords = chosenOption.coords;
            currentCoord = chosenOption.coords;
            remainingSteps--;
            
            // Clear the interrupted move data
            delete state.interruptedMove;
            updateGameState({
              currentPhase: 'PLAYING',
              pendingActionData: null
            });
            
            // Continue movement
            animateNextSegment();
          });
        } else {
          console.log("AI choicepoint - calling simulateCpuChoicepoint");
          // Set up callback for AI choice
          state.pendingActionData.onChoice = (chosenOption) => {
            console.log("AI chose:", chosenOption);
            // Resume movement with chosen path
            player.currentCoords = chosenOption.coords;
            currentCoord = chosenOption.coords;
            remainingSteps--;
            
            // Clear the interrupted move data
            delete state.interruptedMove;
            updateGameState({
              currentPhase: 'PLAYING',
              pendingActionData: null
            });
            
            // Continue movement
            animateNextSegment();
          };
          simulateCpuChoicepoint(player);
        }
        
        return; // Wait for choice before continuing
      }
    
      // Regular movement (single Next coordinate)
      const nextCoord = {
        x: segment.Next[0][0],
        y: segment.Next[0][1]
      };
    
      await animatePosition(token, currentCoord, nextCoord, duration);
      player.currentCoords = nextCoord;
      currentCoord = nextCoord;
      remainingSteps--;
    
      await animateNextSegment();
    }
    

    token.classList.add('animating-token', 'enlarged');
    token.classList.remove('normal');

    await animateNextSegment();
  });
};

export function getRectBounds(coordsObj) {
    // Handle new object format with named coordinates
    const xs = [coordsObj.topleft, coordsObj.toprightx, coordsObj.bottomrightx, coordsObj.bottomleftx];
    const ys = [coordsObj.toplefty, coordsObj.topright, coordsObj.bottomright, coordsObj.bottomleft];
    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys)
    };
};

/**
 * Clears all highlights including deck highlights and move highlights
 */
export function clearHighlights() {
    // Clear deck highlights
    clearDeckHighlights();
    
    // Clear any existing move highlights from the board
    const highlightElements = document.querySelectorAll('.highlight');
    highlightElements.forEach(el => {
        el.classList.remove('highlight');
    });
};

// Animations module for Critocracy
// Contains animations for various game elements and transitions

document.addEventListener('DOMContentLoaded', () => {
    // Initialize any animation-related UI elements
    const playerCountButtons = document.querySelectorAll('.player-count-Button');
    playerCountButtons.forEach(button => {
        pulseAnimation(button);
    });
});

/**
 * Starts the dice shake animation
 */

export let diceShakeInterval = null; // Holds the interval for the dice shake animation

export function startDiceShake() {
    const dice = document.getElementById('dice');
    if (!dice) return;
    
    // Clear any existing shake interval
    stopDiceShake();

    
    // Add shake class to start the CSS animation
    dice.classList.add('shake');
    
    // Set up interval to ensure the shake animation keeps running
    diceShakeInterval = setInterval(() => {
        // This forces the animation to restart if it gets stuck
        dice.classList.remove('shake');
        void dice.offsetWidth; // Trigger reflow
        dice.classList.add('shake');
    }, 1200); // Restart animation every second
};

/**
 * Stops the dice shake animation
 */
export function stopDiceShake() {
    const dice = document.getElementById('dice');
    if (!dice) return;
    
    // Clear the interval
    if (diceShakeInterval) {
        clearInterval(diceShakeInterval);
        diceShakeInterval = null;
    }
    
    // Remove shake class
    dice.classList.remove('shake');
};

/**
 * Animates a card flip to reveal content
 * @param {HTMLElement} cardElement - Card element to animate
 * @param {Function} onRevealed - Callback at mid-flip to update content
 * @param {Function} onComplete - Callback when animation completes
 */
export function animateCardFlip(cardElement, onRevealed, onComplete) {
    updateUIState({
        animation: {
            ...getUIState().animation,
            inProgress: true
        }
    });
    
    if (!cardElement) {
        if (onComplete) onComplete();
        return;
    }
    
    // Start the animation
    cardElement.style.transition = 'transform 0.5s ease-in-out';
    cardElement.style.transform = 'rotateY(90deg)';
    
    // At mid-point of flip, update content
    setTimeout(() => {
        if (onRevealed) onRevealed();
        cardElement.style.transform = 'rotateY(0deg)';
        
        // When flip completes
        const onTransitionEnd = () => {
            cardElement.removeEventListener('transitionend', onTransitionEnd);
            cardElement.style.transition = '';
            
            updateUIState({
                animation: {
                    ...getUIState().animation,
                    inProgress: false
                }
            });
            
            if (onComplete) onComplete();
        };
        
        cardElement.addEventListener('transitionend', onTransitionEnd);
    }, 250);
};
/**
 * Shows a visual effect for card being discarded
 * @param {HTMLElement} cardElement - Card to discard
 * @param {Function} onComplete - Callback when animation completes
 */
export function animateCardDiscard(cardElement, onComplete) {
    updateUIState({
        animation: {
            ...getUIState().animation,
            inProgress: true
        }
    });
    
    cardElement.style.transition = 'all 0.5s ease-in-out';
    cardElement.style.transform = 'scale(0.8) translateY(100px) rotate(10deg)';
    cardElement.style.opacity = '0';
    
    cardElement.addEventListener('transitionend', function onEnd() {
        cardElement.removeEventListener('transitionend', onEnd);
        cardElement.style.transition = '';
        cardElement.style.transform = '';
        cardElement.style.opacity = '';
        
        updateUIState({
            animation: {
                ...getUIState().animation,
                inProgress: false
            }
        });
        
        if (onComplete) onComplete();
    });
};

/**
 * Highlight the deck region for a player to draw from
 * 
 * @param {object} player - The player (must include `isAI` boolean).
 * @param {string} deckType - The deck to highlight (e.g., 'ageOfResistanceDeck').
 * @param {Array} positions - The region(s) to highlight (only used for decks like endOfTurnDeck).
 */
export function highlightDeckRegions(player, deckType, positions) {
  console.log('---------highlightDeckRegions---------');
  console.log('Highlighting deck regions for player:', player.name, 'deckType:', deckType, 'positions:', positions);

  const canvas = state.board?.Canvas || state.board?.canvas;
  if (!canvas || !deckType) {
    console.error('Missing canvas or deckType for highlightDeckRegions');
    return;
  }

  const ctx = canvas.getContext('2d');

  // Map proper highlight colors by deckType
  const colorMap = {
    ageOfExpansionDeck: '#800080',   // purple
    ageOfResistanceDeck: '#0000FF',  // blue
    ageOfReckoningDeck: '#00FFFF',   // cyan
    ageOfLegacyDeck: '#FF69B4',      // pink
    endOfTurnDeck: '#FFD700'         // gold/yellow
  };

  const highlightColor = colorMap[deckType] || '#FF0000'; // fallback to red

  // Remove any old highlights
  clearDeckHighlights();

  // Determine what region(s) to highlight
  let regionsToHighlight = [];

  if (deckType.startsWith('ageOf')) {
    // Only highlight the matching age deck region
    const region = Object.values(fullDeckRegionPathMap).find(r => r.deckType === deckType);
    if (!region || !region.positions) {
      console.error(`No matching region or position for deckType: ${deckType}`);
      return;
    }
    regionsToHighlight = region.positions;
  } else {
    // Highlight all given positions (e.g. end-of-turn)
    if (!positions?.length) {
      console.error('No positions provided for non-ageOf deckType');
      return;
    }
    regionsToHighlight = positions;
  }

  // Store highlight data for animation
  if (!state.ui.dynamic) state.ui.dynamic = {};
  if (!state.ui.dynamic.deckHighlights) state.ui.dynamic.deckHighlights = [];
  
  // Clear existing highlights
  state.ui.dynamic.deckHighlights = [];

  // Create canvas highlight data
  regionsToHighlight.forEach((pos, index) => {
    const highlightData = {
      type: 'canvas',
      position: pos,
      color: highlightColor,
      deckType: deckType,
      player: player,
      phase: 0,
      animationId: null
    };

    state.ui.dynamic.deckHighlights.push(highlightData);
  });

  // Single animation function for all highlights
  function animateHighlights() {
    // Redraw the board to clear previous highlights
    if (typeof drawBoard === 'function') {
      drawBoard();
    }
    
    // Draw all highlights
    state.ui.dynamic.deckHighlights.forEach(highlight => {
      highlight.phase = (highlight.phase + 0.02) % 1;
      
      const alpha = 0.3 + 0.3 * Math.sin(highlight.phase * 2 * Math.PI);
      const width = highlight.position.toprightx - highlight.position.topleft;
      const height = highlight.position.bottomleft - highlight.position.toplefty;
      
      ctx.save();
      ctx.fillStyle = `${highlight.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
      ctx.fillRect(highlight.position.topleft, highlight.position.toplefty, width, height);
      
      // Draw border
      ctx.strokeStyle = highlight.color;
      ctx.lineWidth = 3;
      ctx.strokeRect(highlight.position.topleft, highlight.position.toplefty, width, height);
      ctx.restore();
    });
    
    // Continue animation only if there are still highlights
    if (state.ui.dynamic.deckHighlights.length > 0) {
      requestAnimationFrame(animateHighlights);
    }
  }

  // Start the animation
  requestAnimationFrame(animateHighlights);

  // Add click handler to canvas for deck interaction
  const originalClickHandler = canvas.onclick;
  canvas.onclick = (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Check if click is within any highlighted region
    for (const highlight of state.ui.dynamic.deckHighlights) {
      const pos = highlight.position;
      if (x >= pos.topleft && x <= pos.toprightx && 
          y >= pos.toplefty && y <= pos.bottomleft) {
        clearDeckHighlights();
        drawCard(deckType, player);
        return;
      }
    }
    
    // If not clicking on a highlight, call original handler
    if (originalClickHandler) {
      originalClickHandler(event);
    }
  };

  // AI auto-draw after 5 seconds
  if (player.isAI) {
    setTimeout(() => {
      clearDeckHighlights();
      drawCard(deckType, player);
    }, 5000);
  }
}

export function highlightClickedDeckRegion({ SPACE_TYPE, pathName, deckType }) {
    console.log('-------------highlight clicked deck region ------------');
    let deckInfo = null;
  
    if (deckType) {
      // Called from applyCardEffects
      deckInfo = Object.values(fullDeckRegionPathMap).find(
        (entry) => entry.deckType === deckType
      );
    } else if (SPACE_TYPE && pathName) {
      if (SPACE_TYPE === "Draw") {
        // Called from handleEndOfMove, looking up by pathName
        deckInfo = Object.values(fullDeckRegionPathMap).find(
          (entry) => entry.pathName === pathName
        );
      } else if (SPACE_TYPE === "Regular") {
        deckInfo = fullDeckRegionPathMap["endOfTurnDeck"];
      }
    }
  
    if (!deckInfo) {
      console.warn(`highlightClickedDeckRegion: No deckInfo found`, {
        SPACE_TYPE,
        pathName,
        deckType,
      });
      return;
    }
  
    const positions = deckInfo.positions;
    const colorHex = PATH_COLORS[deckInfo.pathColorKey] || "#FFD700";
  
    if (!window.activeDeckHighlights) {
      window.activeDeckHighlights = new Map();
    }
  
    clearDeckHighlights();
  
    const animationKey = `deck-highlight-${Date.now()}`;
    window.activeDeckHighlights.set(animationKey, { phase: 0, animationId: null });
  
    function hexToRgba(hex, alpha) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r},${g},${b},${alpha})`;
    }
  
    function animate() {
      const highlight = window.activeDeckHighlights.get(animationKey);
      if (!highlight) return;
  
      highlight.phase = (highlight.phase + 0.02) % 1;
  
      const ctx = state.board.tokenCtx;
      const canvas = state.board.tokenCanvas;
      if (!ctx || !canvas) return;
  
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (typeof drawTokens === "function") drawTokens();
  
      const alpha = 0.5 + 0.5 * Math.sin(highlight.phase * 2 * Math.PI);
  
      positions.forEach((pos) => {
        const width = pos.toprightx - pos.topleft;
        const height = pos.bottomleft - pos.toplefty;
  
        ctx.save();
        ctx.fillStyle = hexToRgba(colorHex, alpha);
        ctx.fillRect(pos.topleft, pos.toplefty, width, height);
        ctx.restore();
      });
  
      highlight.animationId = requestAnimationFrame(animate);
    }
  
    window.activeDeckHighlights.get(animationKey).animationId = requestAnimationFrame(animate);
  
    // Keep UI state for deck highlights
    const uiState = getUIState?.() || { animation: { inProgress: false } };
    updateUIState({
        animation: {
            ...uiState.animation,
            inProgress: true,
            current: `highlight-${deckInfo.deckType}`,
            lastFrameTime: Date.now(),
        }
    });
  
    if (typeof onComplete === "function") {
      setTimeout(() => {
        clearDeckHighlights();
        onComplete(deckInfo.deckType);
      }, 5000);
    }
};
  
/**
 * Clears all active canvas-based deck highlights without affecting tokens.
 */
export function clearDeckHighlights() {
  console.log('---------clearDeckHighlights---------');

  // Clear all highlight data
  if (state.ui.dynamic?.deckHighlights) {
    state.ui.dynamic.deckHighlights = [];
  }

  // Clear highlight animation interval (e.g. pulsing)
  if (state.ui.dynamic?.deckHighlightInterval) {
      clearInterval(state.ui.dynamic.deckHighlightInterval);
      state.ui.dynamic.deckHighlightInterval = null;
  }

  // Redraw the board to clear any highlights drawn on the canvas
  if (typeof drawBoard === 'function') {
    drawBoard();
  }

  // Clear the highlight canvas if it's separate from token canvas
  if (state.board?.highlightCtx && state.board?.highlightCanvas) {
    const ctx = state.board.ctx;
      ctx.clearRect(0, 0, state.board.highlightCanvas.width, state.board.highlightCanvas.height);
      console.log('[CANVAS] Cleared highlight canvas');
  } else if (state.board?.mainCtx && state.board?.mainCanvas) {
      // If deck highlights were drawn directly on main board canvas
      const ctx = state.board.mainCtx;
      ctx.clearRect(0, 0, state.board.mainCanvas.width, state.board.mainCanvas.height);
      console.log('[CANVAS] Cleared main canvas highlight layer');
  } else {
      console.log('[CANVAS] No valid highlight or main canvas found to clear');
  }
}

// Function to get region coordinates from fullDeckRegionPathMap
function getRegionCoords(regionId) {
    console.log('---------getRegionCoords---------');
    // Handle end of turn regions
    if (regionId === 'endOfTurnDeck') {
        // Return both end of turn regions' coordinates
        const pos1 = fullDeckRegionPathMap.endOfTurn.positions[0];
        const pos2 = fullDeckRegionPathMap.endOfTurn.positions[1];
        return [
            [pos1.topleft, pos1.toplefty, pos1.bottomrightx, pos1.bottomright],
            [pos2.topleft, pos2.toplefty, pos2.bottomrightx, pos2.bottomright]
        ];
    }
    if (regionId === 'endOfTurnRegion1') {
        const pos = fullDeckRegionPathMap.endOfTurn.positions[0];
        return [pos.topleft, pos.toplefty, pos.bottomrightx, pos.bottomright];
    }
    if (regionId === 'endOfTurnRegion2') {
        const pos = fullDeckRegionPathMap.endOfTurn.positions[1];
        return [pos.topleft, pos.toplefty, pos.bottomrightx, pos.bottomright];
    }

    // Find the matching region in fullDeckRegionPathMap
    const region = Object.values(fullDeckRegionPathMap).find(r => 
        r.regionId === regionId || r.deckType === regionId
    );
    if (region && region.positions && region.positions[0]) {
        const pos = region.positions[0];
        return [pos.topleft, pos.toplefty, pos.bottomrightx, pos.bottomright];
    }
    return null;
}