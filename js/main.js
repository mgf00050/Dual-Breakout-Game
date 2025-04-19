import { GameManager } from './gameManager.js';

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const gameManager = new GameManager();
    
    window.gameManager = gameManager;
});