import { gameAreas } from './game.js';
import { createBrickPieces } from './effects.js';

const brickWidth = 80;
const brickHeight = 25;
const brickSpacing = 2;
const numCols = 6;
const numRows = 6;

export function createBricks(playerId) {
    const player = gameAreas[playerId - 1];
    player.bricksContainer.innerHTML = '';
    player.bricks = [];
    
    const totalBrickWidth = numCols * (brickWidth + brickSpacing);
    const bricksAreaLeft = (player.area.clientWidth - totalBrickWidth) / 2;
    
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const brick = document.createElement('div');
            brick.className = `brick player${playerId}-brick`;
            brick.style.left = `${bricksAreaLeft + col * (brickWidth + brickSpacing)}px`;
            brick.style.top = `${50 + row * (brickHeight + brickSpacing)}px`;
            brick.dataset.row = row;
            brick.dataset.col = col;
            
            const activeInitially = row < 3;
            if (activeInitially) {
                brick.style.animation = 'brick-spawn 0.2s ease-out';
            } else {
                brick.style.display = 'none';
            }
            
            player.bricksContainer.appendChild(brick);
            player.bricks.push({
                element: brick,
                active: activeInitially
            });
        }
    }
}

export function checkBrickCollisions(player) {
    const ballRect = player.ball.getBoundingClientRect();
    
    for (let i = 0; i < player.bricks.length; i++) {
        const brick = player.bricks[i];
        if (!brick.active) continue;
        
        const brickRect = brick.element.getBoundingClientRect();
        
        if (
            ballRect.right > brickRect.left &&
            ballRect.left < brickRect.right &&
            ballRect.bottom > brickRect.top &&
            ballRect.top < brickRect.bottom
        ) {
            brick.active = false;
            
            createBrickPieces(brick.element, player.area);
            brick.element.style.animation = 'none';
            void brick.element.offsetWidth;
            brick.element.style.animation = 'brick-crack 0.4s forwards';
            setTimeout(() => {
                brick.element.style.display = 'none';
            }, 400);
            
            const overlapLeft = ballRect.right - brickRect.left;
            const overlapRight = brickRect.right - ballRect.left;
            const overlapTop = ballRect.bottom - brickRect.top;
            const overlapBottom = brickRect.bottom - ballRect.top;
            
            const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
            
            if (minOverlap === overlapLeft || minOverlap === overlapRight) {
                player.ballSpeedX = -player.ballSpeedX * 1.02;
            } else {
                player.ballSpeedY = -player.ballSpeedY * 1.02;
            }
            
            const otherPlayerId = player.id === 1 ? 2 : 1;
            addBrickToPlayer(otherPlayerId);
            
            break;
        }
    }
}

export function addBrickToPlayer(playerId) {
    const player = gameAreas[playerId - 1];
    
    const availablePositions = [];
    
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const brickIndex = player.bricks.findIndex(b => 
                parseInt(b.element.dataset.col) === col &&
                parseInt(b.element.dataset.row) === row &&
                !b.active
            );
            
            if (brickIndex !== -1) {
                availablePositions.push({row, col, brickIndex});
            }
        }
    }
    
    if (availablePositions.length > 0) {
        const randomPos = availablePositions[Math.floor(Math.random() * availablePositions.length)];
        const brick = player.bricks[randomPos.brickIndex];
        brick.active = true;
        
        brick.element.style.display = 'block';
        brick.element.style.animation = 'none';
        void brick.element.offsetWidth;
        brick.element.style.animation = 'brick-spawn 0.2s ease-out';
    }
}