import { initGame, gameAreas } from './game.js';

const bgMusic = document.getElementById('bgMusic');
const menuMusic = document.getElementById('menuMusic');
bgMusic.volume = 0.3;
menuMusic.volume = 0.4;

function setupControls() {
    const startButton = document.getElementById('startButton');
    const startScreen = document.getElementById('startScreen');
    const gameContainer = document.querySelector('.gameContainer');

    startButton.addEventListener('click', () => {
        startScreen.style.display = 'none';
        gameContainer.style.display = 'flex';
        initGame();
    });

    document.addEventListener('keydown', (e) => {
        // Reinicio solo cuando el juego ha terminado
        if ((e.key === 'r' || e.key === 'R') && gameAreas[0].gameEnded) {
            initGame();
            return;
        }
        
        if (gameAreas[0].gamePaused) return;
        
        // Jugador 1 (A/D)
        if (e.key === 'a' || e.key === 'A') {
            gameAreas[0].keyState.left = true;
        } else if (e.key === 'd' || e.key === 'D') {
            gameAreas[0].keyState.right = true;
        }
        
        // Jugador 2 (Flechas)
        if (e.key === 'ArrowLeft') {
            gameAreas[1].keyState.left = true;
        } else if (e.key === 'ArrowRight') {
            gameAreas[1].keyState.right = true;
        }
        
        // Actualizar estado de movimiento
        updatePaddleMovement();
    });

    document.addEventListener('keyup', (e) => {
        if (gameAreas[0].gamePaused) return;
        
        // Jugador 1
        if (e.key === 'a' || e.key === 'A') {
            gameAreas[0].keyState.left = false;
        } else if (e.key === 'd' || e.key === 'D') {
            gameAreas[0].keyState.right = false;
        }
        
        // Jugador 2
        if (e.key === 'ArrowLeft') {
            gameAreas[1].keyState.left = false;
        } else if (e.key === 'ArrowRight') {
            gameAreas[1].keyState.right = false;
        }
        
        // Actualizar estado de movimiento
        updatePaddleMovement();
    });
}

function updatePaddleMovement() {
    gameAreas.forEach(player => {
        player.moveLeft = player.keyState.left && !player.keyState.right;
        player.moveRight = player.keyState.right && !player.keyState.left;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    menuMusic.loop = true;
    menuMusic.play().catch(e => console.log("Autoplay bloqueado"));
    setupControls();
});