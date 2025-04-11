import { gameAreas, showEndGameScreens } from './game.js';
import { createLightImpact, createWallWave } from './effects.js';
import { checkBrickCollisions } from './brick.js';

export function moveBalls() {
    if (gameAreas[0].gamePaused) return;
    
    gameAreas.forEach(player => {
        if (!player.gameActive) return;
        
        player.ballX += player.ballSpeedX;
        player.ballY += player.ballSpeedY;
        player.ball.style.left = `${player.ballX}px`;
        player.ball.style.top = `${player.ballY}px`;
        
        // Colisión con pared izquierda
        if (player.ballX <= 0) {
            player.ballX = 1;
            player.ballSpeedX = -player.ballSpeedX * 1.02;
            
            const impactColor = player.id === 1 ? 'rgba(0, 255, 255, 0.9)' : 'rgba(255, 255, 0, 0.9)';
            const waveColor = player.id === 1 ? 'rgba(0, 255, 255, 0.5)' : 'rgba(255, 255, 0, 0.5)';
            
            createLightImpact(0, player.ballY + player.ball.clientHeight/2, impactColor, player.area);
            createWallWave(0, waveColor, player.area, true);
            
            player.ball.style.animation = 'none';
            void player.ball.offsetWidth;
            player.ball.style.animation = 'ball-bounce 0.2s ease';
        } 
        // Colisión con pared derecha
        else if (player.ballX >= player.area.clientWidth - player.ball.clientWidth) {
            player.ballX = player.area.clientWidth - player.ball.clientWidth - 1;
            player.ballSpeedX = -player.ballSpeedX * 1.02;
            
            const impactColor = player.id === 1 ? 'rgba(0, 255, 255, 0.9)' : 'rgba(255, 255, 0, 0.9)';
            const waveColor = player.id === 1 ? 'rgba(0, 255, 255, 0.5)' : 'rgba(255, 255, 0, 0.5)';
            
            createLightImpact(player.area.clientWidth, player.ballY + player.ball.clientHeight/2, impactColor, player.area);
            createWallWave(player.area.clientWidth, waveColor, player.area, false);
            
            player.ball.style.animation = 'none';
            void player.ball.offsetWidth;
            player.ball.style.animation = 'ball-bounce 0.2s ease';
        }
        
        // Colisión con techo
        if (player.ballY <= 0) {
            player.ballY = 1;
            player.ballSpeedY = -player.ballSpeedY * 1.02;
            
            const impactColor = player.id === 1 ? 'rgba(0, 255, 255, 0.9)' : 'rgba(255, 255, 0, 0.9)';
            createLightImpact(player.ballX + player.ball.clientWidth/2, 0, impactColor, player.area);
            
            player.ball.style.animation = 'none';
            void player.ball.offsetWidth;
            player.ball.style.animation = 'ball-bounce 0.2s ease';
        }
        
        // Colisión con paleta
        const paddleRect = player.paddle.getBoundingClientRect();
        const ballRect = player.ball.getBoundingClientRect();
        
        if (
            ballRect.bottom >= paddleRect.top &&
            ballRect.top <= paddleRect.bottom &&
            ballRect.right >= paddleRect.left &&
            ballRect.left <= paddleRect.right
        ) {
            const impactColor = player.id === 1 ? 'rgba(0, 255, 255, 0.9)' : 'rgba(255, 255, 0, 0.9)';
            createLightImpact(ballRect.left + ballRect.width/2, paddleRect.top, impactColor, player.area);
            
            player.ball.style.animation = 'none';
            void player.ball.offsetWidth;
            player.ball.style.animation = 'ball-bounce 0.2s ease';
            
            const hitPosition = (ballRect.left + ballRect.width/2) - (paddleRect.left + paddleRect.width/2);
            const normalizedHit = hitPosition / (paddleRect.width/2);
            player.ballSpeedX = normalizedHit * 5;
            player.ballSpeedY = -Math.abs(player.ballSpeedY);
        }
        
        checkBrickCollisions(player);
        
        if (player.ballY >= player.area.clientHeight) {
            player.gameActive = false;
            showEndGameScreens(player.id);
        }
    });
}