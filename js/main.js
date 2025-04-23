// Main entry point for Critocracy game

import { initUI } from './ui.js';
import { initGame } from './game.js';
import { drawBoard } from './board.js'; 


// Initialize the game when the DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    console.log("DOM fully loaded and parsed. Initializing Critocracy...");


    try {
        // 1. Initialize Game Logic (Cards, Board spaces, Players)
        const gameReady = await initGame();
        if (!gameReady) {
            throw new Error("Core game logic failed to initialize.");
        }

        // 2. Initialize UI (Setup screens, event listeners)
        const uiReady = initUI();
        if (!uiReady) {
            throw new Error("UI failed to initialize.");
        }

        // 3. Initial Board Draw (Needs canvas element to exist first)
        // Ensure the canvas exists and board setup is complete before drawing
        const canvas = document.getElementById('board-canvas');
        if (canvas) {
             drawBoard(); // Perform the initial draw
        } else {
             console.error("Board canvas element not found! Cannot perform initial draw.");
             throw new Error("Board canvas missing.");
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