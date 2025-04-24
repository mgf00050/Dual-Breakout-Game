import { GameManager } from './gameManager.js';

// Inicializar el juego cuando el DOM está cargado
document.addEventListener('DOMContentLoaded', () => {
    const gameManager = new GameManager();
    
    // Guarda la referencia global por si la necesitas
    window.gameManager = gameManager;
    
    // Configurar el evento para el botón de inicio
    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', () => {
        gameManager.startGame();
    });
    
    // Configurar el botón de sonido
    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            const bgMusic = document.getElementById('bgMusic');
            const menuMusic = document.getElementById('menuMusic');
            
            if (bgMusic && menuMusic) {
                if (bgMusic.muted) {
                    bgMusic.muted = false;
                    menuMusic.muted = false;
                    soundToggle.textContent = 'SOUND: ON';
                } else {
                    bgMusic.muted = true;
                    menuMusic.muted = true;
                    soundToggle.textContent = 'SOUND: OFF';
                }
            }
        });
        
        // Iniciar la música del menú automáticamente
        const menuMusic = document.getElementById('menuMusic');
        if (menuMusic) {
            menuMusic.play().catch(error => {
                console.log('Reproducción automática bloqueada:', error);
            });
        }
    }
});