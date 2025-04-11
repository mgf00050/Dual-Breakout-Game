import { createBricks } from './brick.js';
import { movePaddles } from './paddle.js';
import { moveBalls } from './ball.js';

// Constantes del juego
const INITIAL_BALL_SPEED = 3;
const BRICK_COLS = 6;
const BRICK_ROWS = 6;

// Control del juego
let gameAnimationId = null;
export const gameAreas = [
    {
        id: 1,
        area: document.getElementById('gameArea1'),
        paddle: document.getElementById('paddle1'),
        ball: document.getElementById('ball1'),
        bricksContainer: document.getElementById('bricks1'),
        gameOver: document.getElementById('gameOver1'),
        gameWin: document.getElementById('gameWin1'),
        gameDraw: document.getElementById('gameDraw1'),
        bricks: [],
        ballX: 0,
        ballY: 0,
        ballSpeedX: INITIAL_BALL_SPEED,
        ballSpeedY: INITIAL_BALL_SPEED,
        paddleX: 0,
        moveLeft: false,
        moveRight: false,
        gameActive: false, // Inicialmente inactivo
        gamePaused: true,  // Inicialmente pausado
        gameEnded: false
    },
    {
        id: 2,
        area: document.getElementById('gameArea2'),
        paddle: document.getElementById('paddle2'),
        ball: document.getElementById('ball2'),
        bricksContainer: document.getElementById('bricks2'),
        gameOver: document.getElementById('gameOver2'),
        gameWin: document.getElementById('gameWin2'),
        gameDraw: document.getElementById('gameDraw2'),
        bricks: [],
        ballX: 0,
        ballY: 0,
        ballSpeedX: -INITIAL_BALL_SPEED,
        ballSpeedY: -INITIAL_BALL_SPEED,
        paddleX: 0,
        moveLeft: false,
        moveRight: false,
        gameActive: false,
        gamePaused: true,
        gameEnded: false
    }
];

export function initGame() {
    console.log("Inicializando juego...");
    
    // Detener juego anterior si existe
    stopGameLoop();

    // Reiniciar estado del juego
    gameAreas.forEach(player => {
        player.gameActive = true;
        player.gamePaused = false;
        player.gameEnded = false;
        player.ballSpeedX = player.id === 1 ? INITIAL_BALL_SPEED : -INITIAL_BALL_SPEED;
        player.ballSpeedY = INITIAL_BALL_SPEED;
        
        // Resetear elementos visuales
        player.gameOver.style.display = 'none';
        player.gameWin.style.display = 'none';
        player.gameDraw.style.display = 'none';
        
        // Limpiar ladrillos anteriores
        player.bricksContainer.innerHTML = '';
        player.bricks = [];
    });

    // Crear nuevos ladrillos
    createBricks(1);
    createBricks(2);
    
    // Resetear posiciones
    resetPositions(1);
    resetPositions(2);

    // Iniciar bucle del juego
    startGameLoop();
}

function resetPositions(playerId) {
    const player = gameAreas[playerId - 1];
    const gameArea = player.area;
    
    // Posicionar paleta
    player.paddleX = (gameArea.clientWidth - player.paddle.clientWidth) / 2;
    player.paddle.style.left = `${player.paddleX}px`;
    
    // Posicionar pelota
    player.ballX = gameArea.clientWidth / 2 - player.ball.clientWidth / 2;
    player.ballY = gameArea.clientHeight - 50;
    player.ball.style.left = `${player.ballX}px`;
    player.ball.style.top = `${player.ballY}px`;
}

function startGameLoop() {
    console.log("Iniciando bucle del juego");
    if (!gameAnimationId) {
        const loop = (timestamp) => {
            if (!gameAreas[0].gamePaused) {
                movePaddles();
                moveBalls();
            }
            gameAnimationId = requestAnimationFrame(loop);
        };
        gameAnimationId = requestAnimationFrame(loop);
    }
}

export function stopGameLoop() {
    console.log("Deteniendo bucle del juego");
    if (gameAnimationId) {
        cancelAnimationFrame(gameAnimationId);
        gameAnimationId = null;
    }
}

export function showEndGameScreens(losingPlayerId) {
    gameAreas.forEach(player => {
        player.gamePaused = true;
        player.gameEnded = true;
    });

    // Verificar empate
    if (!gameAreas[0].gameActive && !gameAreas[1].gameActive) {
        gameAreas.forEach(player => {
            player.gameDraw.style.display = 'block';
        });
        return;
    }

    // Mostrar pantallas de fin de juego
    const losingPlayer = gameAreas[losingPlayerId - 1];
    const winningPlayer = gameAreas[losingPlayerId === 1 ? 1 : 0];
    
    losingPlayer.gameOver.style.display = 'block';
    winningPlayer.gameWin.style.display = 'block';
}