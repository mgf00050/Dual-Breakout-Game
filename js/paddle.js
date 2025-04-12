import { gameAreas } from './game.js';

export function movePaddles() {
    gameAreas.forEach(player => {
        if (player.gamePaused || player.gameEnded) {
            player.paddle.style.transform = 'scaleX(1)';
            return;
        }
        
        if (player.moveLeft && player.paddleX > 0) {
            player.paddleX -= 7;
            player.paddle.style.transform = 'scaleX(0.95)';
        } else if (player.moveRight && player.paddleX < player.area.clientWidth - player.paddle.clientWidth) {
            player.paddleX += 7;
            player.paddle.style.transform = 'scaleX(0.95)';
        } else {
            player.paddle.style.transform = 'scaleX(1)';
        }
        
        player.paddle.style.left = `${player.paddleX}px`;
    });
}