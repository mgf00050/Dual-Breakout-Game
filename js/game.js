import { createBricks } from './brick.js';
import { movePaddles } from './paddle.js';
import { moveBalls } from './ball.js';

const INITIAL_BALL_SPEED = 3;
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
        gameActive: false,
        gamePaused: true,
        gameEnded: false,
        keyState: { left: false, right: false }
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
        gameEnded: false,
        keyState: { left: false, right: false }
    }
];

export function initGame() {
    stopGameLoop();
    
    gameAreas.forEach(player => {
        // Reset completo del estado
        player.gameActive = true;
        player.gamePaused = false;
        player.gameEnded = false;
        player.moveLeft = false;
        player.moveRight = false;
        player.keyState = { left: false, right: false };
        player.ballSpeedX = player.id === 1 ? INITIAL_BALL_SPEED : -INITIAL_BALL_SPEED;
        player.ballSpeedY = INITIAL_BALL_SPEED;
        
        // Reset visual
        player.gameOver.style.display = 'none';
        player.gameWin.style.display = 'none';
        player.gameDraw.style.display = 'none';
        player.paddle.style.transform = 'scaleX(1)';
        
        // Limpiar ladrillos
        player.bricksContainer.innerHTML = '';
        player.bricks = [];
    });

    createBricks(1);
    createBricks(2);
    resetPositions(1);
    resetPositions(2);
    startGameLoop();
}

function resetPositions(playerId) {
    const player = gameAreas[playerId - 1];
    player.paddleX = (player.area.clientWidth - player.paddle.clientWidth) / 2;
    player.paddle.style.left = `${player.paddleX}px`;
    
    player.ballX = player.area.clientWidth / 2 - player.ball.clientWidth / 2;
    player.ballY = player.area.clientHeight - 50;
    player.ball.style.left = `${player.ballX}px`;
    player.ball.style.top = `${player.ballY}px`;
}

function startGameLoop() {
    if (!gameAnimationId) {
        const loop = () => {
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
    if (gameAnimationId) {
        cancelAnimationFrame(gameAnimationId);
        gameAnimationId = null;
    }
}

export function showEndGameScreens() {
    const activePlayers = gameAreas.filter(p => p.gameActive).length;
    
    gameAreas.forEach(player => {
        player.gamePaused = true;
        player.gameEnded = true;
        player.moveLeft = false;
        player.moveRight = false;
        
        // Ocultar todas las pantallas primero
        player.gameOver.style.display = 'none';
        player.gameWin.style.display = 'none';
        player.gameDraw.style.display = 'none';
    });

    if (activePlayers === 0) {
        // Empate
        gameAreas.forEach(p => p.gameDraw.style.display = 'block');
    } else {
        // Hay un ganador y un perdedor
        const winner = gameAreas.find(p => p.gameActive);
        const loser = gameAreas.find(p => !p.gameActive);
        
        winner.gameWin.style.display = 'block';
        loser.gameOver.style.display = 'block';
    }
}