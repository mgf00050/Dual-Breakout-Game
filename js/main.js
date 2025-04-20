import { GameManager } from './gameManager.js';

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const gameManager = new GameManager();
    
    // Guarda la referencia global por si la necesitas
    window.gameManager = gameManager;
    
    // Configurar el evento para el botón de inicio
    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', () => {
        // Iniciamos el juego con la animación de cuenta regresiva
        gameManager.startGame();
    });
    
    // Configurar el botón de sonido (mantener funcionalidad existente)
    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            // Suponiendo que tienes alguna gestión de sonido
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
            // Intentamos reproducir la música automáticamente
            menuMusic.play().catch(error => {
                console.log('Reproducción automática bloqueada:', error);
                // La mayoría de navegadores necesitan interacción del usuario antes de reproducir audio
            });
        }
    }
});