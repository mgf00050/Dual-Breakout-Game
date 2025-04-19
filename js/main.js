import { GameManager } from './gameManager.js';

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const gameManager = new GameManager();
    
    // Make gameManager available globally for debugging
    window.gameManager = gameManager;
});