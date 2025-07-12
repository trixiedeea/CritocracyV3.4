const DEBUG_MODE = true;

// Player Count Screen - Enforces exactly 6 total players
document.addEventListener("DOMContentLoaded", () => {
    console.log("Player count screen initializing");
    
  // Get references to the dropdown elements
const humanPlayerCount = document.getElementById('human-Player-Count');
const aiPlayerCount = document.getElementById('ai-Player-Count');
const playerCountConfirmButton = document.getElementById('player-Count-Confirm-Button');

// Function to update AI player options based on the number of human players selected
function updateAIOptions() {
    const humanPlayers = parseInt(humanPlayerCount.value);
    
    // Clear existing AI options
    aiPlayerCount.innerHTML = ''; // Clear the dropdown options

    let minAI, maxAI;

    // Set AI limits based on the number of human players
    if (humanPlayers === 6) {
        minAI = 0;
        maxAI = 0;
    } else if (humanPlayers === 1) {
        minAI = 3;
        maxAI = 5;
    } else if (humanPlayers === 2) {
        minAI = 2;
        maxAI = 4;
    } else if (humanPlayers === 3) {
        minAI = 1;
        maxAI = 3;
    } else if (humanPlayers === 4) {
        minAI = 0;
        maxAI = 2;
    } else if (humanPlayers === 5) {
        minAI = 0;
        maxAI = 1;
    }

    // Add the options for AI players based on the min and max values
    // The first option should always be 0 AI as a fallback.
    const defaultOption = document.createElement('option');
    defaultOption.value = 0;
    defaultOption.textContent = '0 AI';
    aiPlayerCount.appendChild(defaultOption);

    // Add new options for AI players within the valid range
    for (let i = minAI; i <= maxAI; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} AI`;
        aiPlayerCount.appendChild(option);
    }
}

// Initialize AI options based on the default human player selection
updateAIOptions();

// Listen for changes to the human players dropdown
humanPlayerCount.addEventListener('change', updateAIOptions);

// Get reference to screens
const playerCountScreen = document.getElementById('player-Count-Screen');
const roleSelectionScreen = document.getElementById('role-Selection-Screen');

// Handle confirm button click
playerCountConfirmButton.addEventListener("click", () => {
    // Get selected values
    const humanCount = parseInt(humanPlayerCount.value);
    const aiCount = parseInt(aiPlayerCount.value);
    const totalPlayers = humanCount + aiCount;
    
    // Validate the total is 6 players
    if (DEBUG_MODE) {
        if (totalPlayers < 1) {
            alert(`Total players must be at least 1. Current: ${totalPlayers}`);
            return;
        }
    } else if (totalPlayers <=4) {
        alert(`Total players must be at least 4. Current: ${totalPlayers}`);
        return;
    }
    
    // Create player array
    const playerArray = [];
    
    // Add human players
    for (let i = 0; i < humanCount; i++) {
        playerArray.push({
            id: `player_${i + 1}`,
            type: "human",
            role: null, // Will be assigned in role selection
            name: `Human Player ${i+1}`
        });
    }
    
    // Add AI players
    for (let i = 0; i < aiCount; i++) {
        playerArray.push({
            id: `ai_${i + 1}`,
            type: "ai",
            role: null, // Will be assigned in role selection
            name: `AI Player ${i+1}`
        });
    }
    
    // Update game state
    window.gameState = window.gameState || {};
    gameState.humanPlayerCount = humanCount;
    gameState.aiPlayerCount = aiCount;
    gameState.playerArray = playerArray;
    gameState.currentPhase = "ROLE_SELECTION";
    
    console.log(`Created player array with ${humanCount} humans and ${aiCount} AI:`, playerArray);
    
    // Move to role selection screen
    playerCountScreen.style.display = "none";
    roleSelectionScreen.style.display = "block";
    
    // Dispatch event to notify role selection screen
    const playersSelectedEvent = new CustomEvent("playersSelected", {
        detail: playerArray
    });
    window.dispatchEvent(playersSelectedEvent);
    console.log("Dispatched playersSelected event with player array:", playerArray);
    
    // Call role selection setup if it exists
    if (typeof setupRoleSelectionUI === 'function') {
        setupRoleSelectionUI(humanCount);
    }
});

});
    
