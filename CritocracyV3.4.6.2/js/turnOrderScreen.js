
// Ensure global turnOrderUI namespace
window.turnOrderUI = window.turnOrderUI || {};

// Main init function called from main.js with playerConfigs from roleSelectionScreen
window.turnOrderUI.initTurnOrderScreen = function(playerConfigs) {
    console.log('[TurnOrder] Initializing turn order screen with configs:', playerConfigs);
    
    if (!Array.isArray(playerConfigs)) {
        console.log("initTurnOrderScreen expects an array of playerConfigs");
        return;
    }

    // Store players
    window.turnOrderUI.players = [...playerConfigs];
    window.turnOrderUI.diceResult = {};
    window.turnOrderUI.orderedPlayerIds = [];
    window.turnOrderUI.currentRollIndex = 0;
    window.turnOrderUI.hasCompletedRolls = false;
    window.turnOrderUI.isRolling = false;

    console.log('[TurnOrder] Initialized state:', {
        playerCount: window.turnOrderUI.players.length,
        currentRollIndex: window.turnOrderUI.currentRollIndex,
        hasCompletedRolls: window.turnOrderUI.hasCompletedRolls
    });

    // Get required DOM elements
    const turnOrderScreen = document.getElementById("turn-Order-Screen");
    const turnOrderDiceContainer = document.getElementById("turn-Order-Dice-Container");
    const turnOrderGridContainer = document.getElementById("turn-Order-Grid-Container");
    const startGameButton = document.getElementById("start-Game-Button");

    // Check if all required elements exist
    if (!turnOrderScreen || !turnOrderGridContainer || !startGameButton) {
        console.log("Required DOM elements not found for turn order screen");
        return;
    }

    // Show turn order screen, hide others
    turnOrderScreen.style.display = "block";
    turnOrderDiceContainer.style.display = "block";
    turnOrderGridContainer.classList.add("hidden");
    startGameButton.classList.add("hidden");

    console.log('[TurnOrder] UI elements initialized and displayed');
    renderTurnOrderUI();
};

async function handleTurnOrderRoll() {
    if (window.turnOrderUI.isRolling || window.turnOrderUI.hasCompletedRolls) {
        console.log('[TurnOrder] Roll skipped - isRolling:', window.turnOrderUI.isRolling, 'hasCompletedRolls:', window.turnOrderUI.hasCompletedRolls);
        return;
    }

    const players = window.turnOrderUI.players;
    const idx = window.turnOrderUI.currentRollIndex;
    if (!players || idx >= players.length) return;

    const player = players[idx];
    console.log('[TurnOrder] Processing roll for player:', { id: player.id, name: player.name, index: idx });

    window.turnOrderUI.isRolling = true;

    const dice = document.getElementById("turn-Order-Dice");
    if (!dice) {
        console.log('[TurnOrder] Error: Dice element not found');
        return;
    }

    // Animate dice
    dice.style.display = "block";
    dice.classList.remove("rolling");
    void dice.offsetWidth; // Force reflow
    dice.classList.add("rolling");

    // Wait for animation to complete
    await new Promise(resolve => setTimeout(resolve, 1500));

    dice.classList.remove("rolling");

    // Generate dice roll
    const roll = Math.floor(Math.random() * 6) + 1;

    // After animation, rotate the dice to show the correct face via CSS classes
    // Remove any existing show-face classes first.
    for (let i = 1; i <= 6; i++) {
        dice.classList.remove(`show-${i}`);
    }
    // Add the new class to trigger the rotation.
    dice.classList.add(`show-${roll}`);
    console.log(`[TurnOrder] Showing face ${roll} by rotating the dice.`);

    // Store roll result
    window.turnOrderUI.diceResult[player.id] = roll;
    console.log('[TurnOrder] Roll result:', { playerId: player.id, roll });

    // Update UI with roll number
    const rollCell = document.getElementById(`roll-cell-${player.id}`);
    if (rollCell) {
        rollCell.textContent = roll;
    } else {
        console.log('[TurnOrder] Roll cell not found for player:', player.id);
    }

    // Wait briefly before advancing turn
    await new Promise(resolve => setTimeout(resolve, 600));

    window.turnOrderUI.currentRollIndex++;
    window.turnOrderUI.isRolling = false;

    console.log('[TurnOrder] Roll completed, current index:', window.turnOrderUI.currentRollIndex);

    // Move to next player or finalize turn order
    if (window.turnOrderUI.currentRollIndex < players.length) {
        if (!players[window.turnOrderUI.currentRollIndex].isHuman) {
            console.log('[TurnOrder] Auto-rolling for next AI player');
            handleTurnOrderRoll();
        }
    } else {
        console.log('[TurnOrder] All players have rolled, finalizing order');
        finalizeTurnOrder();
    }
}

function renderTurnOrderUI() {
    console.log('[TurnOrder] Rendering turn order UI');
    
    const table = document.getElementById("turn-Order-Table");
    const tbody = document.getElementById("turn-Order-Table-Body");
    const dice = document.getElementById("turn-Order-Dice");

    if (!table || !tbody || !dice) {
        console.log("Missing required DOM elements for turn order UI");
        return;
    }

    // Clear existing content
    table.innerHTML = `<thead><tr><th>Order</th><th>Player</th><th>Role</th><th>Roll</th></tr></thead><tbody id="turn-Order-Table-Body"></tbody>`;
    
    // Re-get tbody after clearing
    const newTbody = document.getElementById("turn-Order-Table-Body");
    if (!newTbody) {
        console.log("[TurnOrder] Error: Failed to create table body");
        return;
    }

    window.turnOrderUI.players.forEach((player, idx) => {
        const row = document.createElement("tr");
        row.id = `player-row-${player.id}`;
        row.innerHTML = `<td>${idx + 1}</td><td>${player.name}</td><td>${player.role}</td><td id="roll-cell-${player.id}"></td>`;
        newTbody.appendChild(row);
    });
    
    console.log('[TurnOrder] Rendered player table with', window.turnOrderUI.players.length, 'players');
    
    dice.style.display = "block";
    dice.classList.remove("rolling");
    dice.style.cursor = "pointer";
    dice.onclick = handleTurnOrderRoll;

    // Add event listener for start game button
    const startGameButton = document.getElementById("start-Game-Button");
    if (startGameButton) {
        startGameButton.onclick = window.turnOrderUI.handleStartGame;
        console.log('[TurnOrder] Start game button initialized');
    } else {
        console.log('[TurnOrder] Start game button not found');
    }
}

function finalizeTurnOrder() {
    console.log('[TurnOrder] Finalizing turn order');
    
    const sorted = [...window.turnOrderUI.players].sort((a, b) => {
        const rollA = window.turnOrderUI.diceResult[a.id] || 0;
        const rollB = window.turnOrderUI.diceResult[b.id] || 0;
        
        // First sort by roll value (descending)
        if (rollB !== rollA) return rollB - rollA;
        
        // In case of tie, human players go before AI players
        if (a.isHuman !== b.isHuman) {
            return a.isHuman ? -1 : 1;
        }
        
        // If both are the same type (both human or both AI), sort by name
        return a.name.localeCompare(b.name);
    });

    window.turnOrderUI.orderedPlayerIds = sorted.map(p => p.id);
    console.log('[TurnOrder] Final player order:', window.turnOrderUI.orderedPlayerIds);

    const tbody = document.getElementById("turn-Order-Table-Body");
    tbody.innerHTML = "";
    sorted.forEach((player, idx) => {
        const row = document.createElement("tr");
        row.id = `player-row-${player.id}`;
        row.innerHTML = `<td>${idx + 1}</td><td>${player.name}</td><td>${player.role}</td><td>${window.turnOrderUI.diceResult[player.id]}</td>`;
        tbody.appendChild(row);
    });

    document.getElementById("turn-Order-Dice").style.display = "none";
    document.getElementById("turn-Order-Grid-Container").classList.remove("hidden");
    document.getElementById("start-Game-Button").classList.remove("hidden");

    window.turnOrderUI.hasCompletedRolls = true;
    console.log('[TurnOrder] Turn order finalized and UI updated');
}

// Start game handler
window.turnOrderUI.handleStartGame = async function () {
    console.log('[TurnOrder] Starting game with player order:', window.turnOrderUI.orderedPlayerIds);
    
    document.getElementById("turn-Order-Screen").style.display = "none";
    document.getElementById("game-Board-Screen").style.display = "block";

    // Notify main.js
    window.dispatchEvent(new CustomEvent("turnOrderDetermined", {
        detail: window.turnOrderUI.orderedPlayerIds
    }));
    
    console.log('[TurnOrder] Game started, turn order event dispatched');
};
