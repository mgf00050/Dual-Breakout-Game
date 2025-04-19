export function setupInputHandlers(gameManager) {
    const startButton = document.getElementById('startButton');
    const soundToggle = document.getElementById('soundToggle');
    const startScreen = document.getElementById('startScreen');
    const gameContainer = document.querySelector('.gameContainer');
    const bgMusic = document.getElementById('bgMusic');
    const menuMusic = document.getElementById('menuMusic');
   
    let soundEnabled = true;
    
    // Setup DOM event listeners
    setupButtonListeners();
    setupKeyboardListeners();
    initializeMenuMusic();
    
    function setupButtonListeners() {
        // Start game button
        startButton.addEventListener('click', handleStartButtonClick);
        
        // Sound toggle button
        soundToggle.addEventListener('click', handleSoundToggleClick);
    }
    
    function setupKeyboardListeners() {
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
    }
    
    function handleStartButtonClick() {
        startScreen.style.display = 'none';
        gameContainer.style.display = 'flex';
        menuMusic.pause();
        bgMusic.play().catch(e => console.log("Audio blocked:", e));
        gameManager.startGame();
    }
    
    function handleSoundToggleClick() {
        soundEnabled = !soundEnabled;
        soundToggle.textContent = `SOUND: ${soundEnabled ? 'ON' : 'OFF'}`;
        bgMusic.muted = !soundEnabled;
        menuMusic.muted = !soundEnabled;
    }
    
    function handleKeyDown(e) {
        // Game control keys
        if (handleGameControlKeys(e)) return;
        
        if (gameManager.gameState !== 'PLAYING') return;
        
        // Player movement keys
        handlePlayerMovementKeyDown(e);
    }
    
    function handleKeyUp(e) {
        if (gameManager.gameState !== 'PLAYING') return;
        
        handlePlayerMovementKeyUp(e);
    }
    
    function handleGameControlKeys(e) {
        // Reset game
        if ((e.key === 'r' || e.key === 'R') && gameManager.gameState === 'GAME_OVER') {
            gameManager.resetGame();
            return true;
        }
        
        // Pause game
        if (e.key === 'Escape') {
            togglePauseGame();
            return true;
        }
        
        return false;
    }
    
    function togglePauseGame() {
        if (gameManager.gameState === 'PLAYING') {
            gameManager.gameState = 'PAUSED';
            bgMusic.pause();
        } else if (gameManager.gameState === 'PAUSED') {
            gameManager.gameState = 'PLAYING';
            bgMusic.play();
        }
    }
    
    function handlePlayerMovementKeyDown(e) {
        // Player 1 controls (A/D)
        handlePlayer1KeyDown(e);
        
        // Player 2 controls (Arrow keys)
        handlePlayer2KeyDown(e);
    }
    
    function handlePlayer1KeyDown(e) {
        if (e.key === 'a' || e.key === 'A') {
            gameManager.players[0].moveLeft = true;
            gameManager.players[0].moveRight = false;
        } else if (e.key === 'd' || e.key === 'D') {
            gameManager.players[0].moveRight = true;
            gameManager.players[0].moveLeft = false;
        }
    }
    
    function handlePlayer2KeyDown(e) {
        if (e.key === 'ArrowLeft') {
            gameManager.players[1].moveLeft = true;
            gameManager.players[1].moveRight = false;
        } else if (e.key === 'ArrowRight') {
            gameManager.players[1].moveRight = true;
            gameManager.players[1].moveLeft = false;
        }
    }
    
    function handlePlayerMovementKeyUp(e) {
        // Player 1
        handlePlayer1KeyUp(e);
        
        // Player 2
        handlePlayer2KeyUp(e);
    }
    
    function handlePlayer1KeyUp(e) {
        if (e.key === 'a' || e.key === 'A') {
            gameManager.players[0].moveLeft = false;
        } else if (e.key === 'd' || e.key === 'D') {
            gameManager.players[0].moveRight = false;
        }
    }
    
    function handlePlayer2KeyUp(e) {
        if (e.key === 'ArrowLeft') {
            gameManager.players[1].moveLeft = false;
        } else if (e.key === 'ArrowRight') {
            gameManager.players[1].moveRight = false;
        }
    }
    
    function initializeMenuMusic() {
        menuMusic.loop = true;
        menuMusic.play().catch(e => console.log("Autoplay blocked:", e));
    }
}