/* ========================= */
/*        JAVASCRIPT         */
/* ========================= */

document.addEventListener("DOMContentLoaded", () => {
    // Get references to start screen and player count screen
    const startScreen = document.getElementById("start-Screen"); 
    const startButton = document.getElementById("start-Button");
    const playerCountScreen = document.getElementById("player-Count-Screen");  
    // Hide the player count screen initially
    playerCountScreen.style.display = "none";

    startButton.addEventListener("click", () => {
        startScreen.style.display = "none";
        playerCountScreen.style.display = "block";
    });
});

