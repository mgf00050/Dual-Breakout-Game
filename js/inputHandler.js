export function setupInputHandlers(gameManager) {
    const startButton = document.getElementById('startButton');
    const soundToggle = document.getElementById('soundToggle');
    const startScreen = document.getElementById('startScreen');
    const gameContainer = document.querySelector('.gameContainer');
    const bgMusic = document.getElementById('bgMusic');
    const menuMusic = document.getElementById('menuMusic');
    
    let soundEnabled = true;

    // Start game button
    startButton.addEventListener('click', () => {
        startScreen.style.display = 'none';
        gameContainer.style.display = 'flex';
        menuMusic.pause();
        bgMusic.play().catch(e => console.log("Audio blocked:", e));
        gameManager.startGame();
    });

    // Sound toggle button
    soundToggle.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        soundToggle.textContent = `SOUND: ${soundEnabled ? 'ON' : 'OFF'}`;
        bgMusic.muted = !soundEnabled;
        menuMusic.muted = !soundEnabled;
    });

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        // Reset game
        if ((e.key === 'r' || e.key === 'R') && gameManager.gameState === 'GAME_OVER') {
            gameManager.resetGame();
            return;
        }

        // Pause game
        if (e.key === 'Escape') {
            if (gameManager.gameState === 'PLAYING') {
                gameManager.gameState = 'PAUSED';
                bgMusic.pause();
            } else if (gameManager.gameState === 'PAUSED') {
                gameManager.gameState = 'PLAYING';
                bgMusic.play();
            }
            return;
        }

        if (gameManager.gameState !== 'PLAYING') return;
        
        // Player 1 controls (A/D)
        if (e.key === 'a' || e.key === 'A') {
            gameManager.players[0].moveLeft = true;
            gameManager.players[0].moveRight = false;
        } else if (e.key === 'd' || e.key === 'D') {
            gameManager.players[0].moveRight = true;
            gameManager.players[0].moveLeft = false;
        }
        
        // Player 2 controls (Arrow keys)
        if (e.key === 'ArrowLeft') {
            gameManager.players[1].moveLeft = true;
            gameManager.players[1].moveRight = false;
        } else if (e.key === 'ArrowRight') {
            gameManager.players[1].moveRight = true;
            gameManager.players[1].moveLeft = false;
        }
    });

    document.addEventListener('keyup', (e) => {
        if (gameManager.gameState !== 'PLAYING') return;
        
        // Player 1
        if (e.key === 'a' || e.key === 'A') {
            gameManager.players[0].moveLeft = false;
        } else if (e.key === 'd' || e.key === 'D') {
            gameManager.players[0].moveRight = false;
        }
        
        // Player 2
        if (e.key === 'ArrowLeft') {
            gameManager.players[1].moveLeft = false;
        } else if (e.key === 'ArrowRight') {
            gameManager.players[1].moveRight = false;
        }
    });

    // Initialize menu music
    menuMusic.loop = true;
    menuMusic.play().catch(e => console.log("Autoplay blocked:", e));
}