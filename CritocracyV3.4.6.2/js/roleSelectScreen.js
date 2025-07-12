
// =========================
//   ROLE SELECTION LOGIC
// =========================
// Global game state
let roleConfirmButton = null;
let selectedRole = null;
let selectedRoles = [];
let currentHumanPlayer = 0;

let totalPlayers = 0;
let humanPlayers = 0;
let aiPlayers = 0;
let playerArray = [];


// Setup role selection immediately when imported
// No need to wait for DOMContentLoaded since main.js already does this
(function setupRoleSelection() {
    const roleSelectionScreen = document.getElementById("role-Selection-Screen");
    const turnOrderScreen = document.getElementById("turn-Order-Screen");
    roleConfirmButton = document.getElementById("role-Confirm-Button"); // Use the global variable, not a new local one


    // Initialize global game state
    window.gameState = window.gameState || {};
    gameState.currentPhase = "ROLE_SELECTION";

    // Custom player setup event
    window.addEventListener("playersSelected", (event) => {
        console.log("Role selection received player array:", event.detail);
        playerArray = event.detail;

        gameState.humanPlayerCount = playerArray.filter(p => p.type === "human").length;
        gameState.aiPlayerCount = playerArray.filter(p => p.type === "ai").length;
        gameState.playerArray = playerArray;

        initializeRoleSelection();
        if (typeof setupRoleSelectionUI === 'function') {
            setupRoleSelectionUI(gameState.humanPlayerCount);
        }
    });

    if (roleConfirmButton) {
        console.log("Found role confirm button:", roleConfirmButton);
        roleConfirmButton.addEventListener("click", () => {
            confirmRoleSelection();
        });
    } else {
        console.log("Role confirm button not found");
    }

    // ========================
    //     Helper Functions
    // ========================

    function initializeRoleSelection() {
        humanPlayers = gameState.humanPlayerCount;
        aiPlayers = gameState.aiPlayerCount;
        totalPlayers = humanPlayers + aiPlayers;

        console.log(`Initializing role selection with ${humanPlayers} human players and ${aiPlayers} AI players`);

        attachRoleSelectionHandlers();
        updatePlayerPrompt();
        resetRoleSelectionScreen();
    }

    function attachRoleSelectionHandlers() {
        console.log("Attaching role selection handlers");
        
        // First log the elements we find to debug
        const roleCards = document.querySelectorAll(".role-Card");
        console.log("Found role cards:", roleCards.length);
        
        const roleSelectButtons = document.querySelectorAll(".role-Select");
        console.log("Found role select buttons:", roleSelectButtons.length);
        
        // Also check the Button element (uppercase B) which might be the issue
        const buttonElements = document.querySelectorAll("Button.role-Select");
        console.log("Found Button.role-Select elements:", buttonElements.length);

        // Attach handlers to role cards
        roleCards.forEach(card => {
            card.addEventListener("click", () => {
                console.log("Role card clicked");
                const roleElement = card.querySelector("[data-role]");
                const role = roleElement?.getAttribute("data-role");
                console.log("Role element found:", roleElement, "with role:", role);
                if (role) handleRoleSelection(role);
            });
        });

        // Try both lowercase and uppercase Button elements to be safe
        buttonElements.forEach(button => {
            console.log("Attaching to Button:", button, "with role:", button.getAttribute("data-role"));
            button.addEventListener("click", (event) => {
                event.stopPropagation();
                console.log("Role select button clicked");
                const role = button.getAttribute("data-role");
                if (role) handleRoleSelection(role);
            });
        });
    }

    function handleRoleSelection(role) {
        console.log(`Role selected: ${role}`);
        selectedRole = role;

        // Log all buttons for debugging
        console.log("Role buttons found:", document.querySelectorAll(".role-Select").length);
        console.log("Button elements found:", document.querySelectorAll("Button.role-Select").length);
        
        // Remove 'selected' class from all role cards and grid items
        document.querySelectorAll(".role-Card, .grid-item").forEach(element => {
            element.classList.remove("selected");
        });
        
        // Remove 'selected' class from all buttons
        document.querySelectorAll(".role-Select").forEach(button => {
            button.classList.remove("selected");
        });
        
        document.querySelectorAll("Button.role-Select").forEach(button => {
            button.classList.remove("selected");
        });

        // Try to find the selected button with multiple selectors
        let selectedButton = document.querySelector(`.role-Select[data-role="${role}"]`);
        if (!selectedButton) {
            selectedButton = document.querySelector(`Button.role-Select[data-role="${role}"]`);
            console.log("Found selected button using Button.role-Select:", selectedButton);
        }
        
        if (selectedButton) {
            // Add selected class to the button
            selectedButton.classList.add("selected");
            
            // Add selected class to parent role-card and grid-item elements
            const roleCard = selectedButton.closest('.role-Card');
            if (roleCard) {
                roleCard.classList.add('selected');
                console.log('Added selected class to role-Card:', roleCard);
            }
            
            const gridItem = selectedButton.closest('.grid-item');
            if (gridItem) {
                gridItem.classList.add('selected');
                console.log('Added selected class to grid-item:', gridItem);
            }
        }

        if (roleConfirmButton) roleConfirmButton.disabled = false;
    }

    function confirmRoleSelection() {
        if (!selectedRole) {
            alert("Please select a role to continue.");
            return;
        }

        // Store the role assignment
        gameState.playerRoleAssignments = gameState.playerRoleAssignments || {};
        gameState.playerRoleAssignments[currentHumanPlayer] = selectedRole;
        
        // Mark the card as selected and update UI
        const selectButton = document.querySelector(`Button.role-Select[data-role="${selectedRole}"]`);
        const cardElement = selectButton ? selectButton.closest('.role-Card') : null;
        
        if (cardElement) {
            cardElement.classList.add('role-selected');
            
            // Update the select button
            if (selectButton) {
                selectButton.disabled = true;
                selectButton.textContent = `Selected by Player ${currentHumanPlayer + 1}`;
            }
            
            // Disable other role select buttons
            document.querySelectorAll('.role-Card:not(.role-selected) .role-Select').forEach(button => {
                button.disabled = true;
            });
        }

        selectedRoles.push(selectedRole);
        console.log(`Added ${selectedRole} to selected roles: ${selectedRoles.join(', ')}`);

        if (currentHumanPlayer < humanPlayers - 1) {
            currentHumanPlayer++;
            selectedRole = null;
            resetRoleSelectionScreen();
            updatePlayerPrompt();
        } else {
            assignAiRoles();
            finalizePlayerConfigs();
        }
    }

    function resetRoleSelectionScreen() {
        const roleCards = document.querySelectorAll(".role-Card");

        roleCards.forEach(card => {
            const roleButton = card.querySelector("[data-role]");
            const role = roleButton?.getAttribute("data-role");

            card.classList.remove("selected", "role-card-selected");

            if (role && selectedRoles.includes(role)) {
                card.classList.add("role-card-selected");
                if (roleButton) roleButton.disabled = true;
            } else {
                if (roleButton) roleButton.disabled = false;
            }
        });

        if (roleConfirmButton) {
            roleConfirmButton.disabled = true;
        }
    }

    function updatePlayerPrompt() {
        const prompt = document.getElementById("role-prompt");
        if (prompt) {
            prompt.textContent = `Human Player ${currentHumanPlayer + 1}, choose your role:`;
        }
    }

    function assignAiRoles() {
        const roleButtons = document.querySelectorAll("[data-role]");
        const allRoles = Array.from(roleButtons).map(btn => btn.getAttribute("data-role"));
        const availableRoles = allRoles.filter(role => !selectedRoles.includes(role));

        const aiAssignedRoles = [];

        for (let i = 0; i < aiPlayers; i++) {
            if (availableRoles.length === 0) break;
            const randomIndex = Math.floor(Math.random() * availableRoles.length);
            const role = availableRoles.splice(randomIndex, 1)[0];
            aiAssignedRoles.push(role);
        }

        console.log(`AI-assigned Roles: ${aiAssignedRoles.join(', ')}`);
        selectedRoles.push(...aiAssignedRoles);
    }

    function finalizePlayerConfigs() {
        const playerConfigs = [];

        for (let i = 0; i < totalPlayers; i++) {
            const isHuman = i < humanPlayers;
            playerConfigs.push({
                id: isHuman ? `player_${i + 1}` : `ai_${i - humanPlayers + 1}`,
                name: isHuman ? `Human Player ${i + 1}` : `AI Player ${i - humanPlayers + 1}`,
                role: selectedRoles[i],
                isHuman
            });
        }

        localStorage.setItem("playerConfigs", JSON.stringify(playerConfigs));
        console.log("Finalizing player configs in roleSelectScreen.js and dispatching 'rolesAssigned' event with:", playerConfigs);
        
        // Ensure turn order screen is ready before dispatching event
        const turnOrderScreen = document.getElementById("turn-Order-Screen");
        if (!turnOrderScreen) {
            console.log("Turn order screen not found in DOM");
            return;
        }

        // Dispatch event to initialize turn order
        window.dispatchEvent(new CustomEvent("rolesAssigned", { 
            detail: playerConfigs 
        }));
    }
})();
