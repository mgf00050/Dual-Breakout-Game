import { initGame, gameAreas } from './game.js';

// Elementos de audio
const bgMusic = document.getElementById('bgMusic');
const menuMusic = document.getElementById('menuMusic');
bgMusic.volume = 0.3;
menuMusic.volume = 0.4;

// Iniciar música del menú
function startMenuMusic() {
    menuMusic.loop = true;
    menuMusic.play().catch(e => {
        console.log("Autoplay bloqueado, se requerirá interacción");
    });
}

// Configurar controles del juego
function setupControls() {
    const startButton = document.getElementById('startButton');
    const startScreen = document.getElementById('startScreen');
    const gameContainer = document.querySelector('.gameContainer');

    // Botón de inicio
    startButton.addEventListener('click', () => {
        console.log("Start Game clickeado");
        
        // Transición de audio
        menuMusic.pause();
        bgMusic.currentTime = 0;
        bgMusic.loop = true;
        bgMusic.play().catch(e => console.log("Error al iniciar música:", e));
        
        // Mostrar juego y ocultar menú
        startScreen.style.display = 'none';
        gameContainer.style.display = 'flex';
        
        // Iniciar juego
        initGame();
    });

    // Controles de teclado
    document.addEventListener('keydown', (e) => {
        // Reinicio con R cuando el juego está pausado
        if ((e.key === 'r' || e.key === 'R') && gameAreas[0].gamePaused) {
            initGame();
        }
        
        if (gameAreas[0].gamePaused) return;
        
        // Controles del jugador 1 (A/D)
        if (e.key === 'a' || e.key === 'A') {
            gameAreas[0].moveLeft = true;
            gameAreas[0].moveRight = false;
        } else if (e.key === 'd' || e.key === 'D') {
            gameAreas[0].moveRight = true;
            gameAreas[0].moveLeft = false;
        }
        // Controles del jugador 2 (Flechas)
        else if (e.key === 'ArrowLeft') {
            gameAreas[1].moveLeft = true;
            gameAreas[1].moveRight = false;
        } else if (e.key === 'ArrowRight') {
            gameAreas[1].moveRight = true;
            gameAreas[1].moveLeft = false;
        }
    });

    document.addEventListener('keyup', (e) => {
        if (gameAreas[0].gamePaused) return;
        
        // Jugador 1
        if (e.key === 'a' || e.key === 'A') {
            gameAreas[0].moveLeft = false;
        } else if (e.key === 'd' || e.key === 'D') {
            gameAreas[0].moveRight = false;
        }
        // Jugador 2
        else if (e.key === 'ArrowLeft') {
            gameAreas[1].moveLeft = false;
        } else if (e.key === 'ArrowRight') {
            gameAreas[1].moveRight = false;
        }
    });
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM cargado, iniciando configuración");
    startMenuMusic();
    setupControls();
});