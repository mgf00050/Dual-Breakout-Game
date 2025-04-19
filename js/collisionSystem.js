export class CollisionSystem {
    constructor(gameArea) {
        this.gameArea = gameArea;
    }

    checkCollisions() {
        this.checkWallCollisions();
        this.checkPaddleCollision();
        this.checkBrickCollisions();
        this.checkBottomCollision();
    }

    checkWallCollisions() {
        if (this.gameArea.ballX <= 0 || 
            this.gameArea.ballX >= this.gameArea.area.clientWidth - this.gameArea.ball.clientWidth) {
            
            this.handleWallBounce(
                this.gameArea.ballX <= 0 ? 'left' : 'right',
                this.gameArea.ballY + this.gameArea.ball.clientHeight/2
            );
            this.gameArea.ballSpeedX = -this.gameArea.ballSpeedX * 1.02;
            this.gameArea.ballX = this.gameArea.ballX <= 0 ? 1 : 
                this.gameArea.area.clientWidth - this.gameArea.ball.clientWidth - 1;
        }
        
        if (this.gameArea.ballY <= 0) {
            this.handleWallBounce('top', this.gameArea.ballX + this.gameArea.ball.clientWidth/2);
            this.gameArea.ballSpeedY = -this.gameArea.ballSpeedY * 1.02;
            this.gameArea.ballY = 1;
        }
    }

    handleWallBounce(wallType, impactPosition) {
        const color = this.gameArea.id === 1 ? 'rgba(0, 255, 255, 0.9)' : 'rgba(255, 255, 0, 0.9)';
        
        if (wallType === 'left' || wallType === 'right') {
            const x = wallType === 'left' ? 0 : this.gameArea.area.clientWidth;
            this.gameArea.effects.createLightImpact(x, impactPosition, color);
            this.gameArea.effects.createWallWave(
                x, 
                color, 
                wallType === 'left'
            );
        } else {
            this.gameArea.effects.createLightImpact(impactPosition, 0, color);
        }
        
        this.gameArea.effects.createParticles(
            wallType === 'top' ? impactPosition : 
                (wallType === 'left' ? 0 : this.gameArea.area.clientWidth),
            wallType === 'top' ? 0 : impactPosition,
            color,
            8
        );
        
        this.triggerBallBounce();
    }

    checkPaddleCollision() {
        const paddleRect = this.gameArea.paddle.getBoundingClientRect();
        const ballRect = this.gameArea.ball.getBoundingClientRect();
        
        if (ballRect.bottom >= paddleRect.top &&
            ballRect.top <= paddleRect.bottom &&
            ballRect.right >= paddleRect.left &&
            ballRect.left <= paddleRect.right) {
            
            const color = this.gameArea.id === 1 ? 'rgba(0, 255, 255, 0.9)' : 'rgba(255, 255, 0, 0.9)';
            this.gameArea.effects.createLightImpact(
                ballRect.left + ballRect.width/2, 
                paddleRect.top, 
                color
            );
            this.gameArea.effects.createParticles(
                ballRect.left + ballRect.width/2, 
                paddleRect.top, 
                color, 
                12
            );
            
            this.triggerBallBounce();
            
            const hitPosition = (ballRect.left + ballRect.width/2) - (paddleRect.left + paddleRect.width/2);
            const normalizedHit = hitPosition / (paddleRect.width/2);
            this.gameArea.ballSpeedX = normalizedHit * 5;
            this.gameArea.ballSpeedY = -Math.abs(this.gameArea.ballSpeedY);
        }
    }

    checkBrickCollisions() {
        const ballRect = this.gameArea.ball.getBoundingClientRect();
        
        for (let i = 0; i < this.gameArea.bricks.length; i++) {
            const brick = this.gameArea.bricks[i];
            if (!brick.active) continue;
            
            const brickRect = brick.element.getBoundingClientRect();
            
            if (ballRect.right > brickRect.left &&
                ballRect.left < brickRect.right &&
                ballRect.bottom > brickRect.top &&
                ballRect.top < brickRect.bottom) {
                
                this.handleBrickCollision(brick, brickRect);
                break;
            }
        }
    }

    handleBrickCollision(brick, brickRect) {
        brick.active = false;
        this.gameArea.score += 10;
        this.gameArea.updateScore();
        
        // Añadir ladrillo al oponente
        this.gameArea.opponentArea.addRandomBrick();
        
        // Aumentar velocidad del oponente basado en el score
        const speedIncrease = Math.min(this.gameArea.score / 1000, 2);
        this.gameArea.opponentArea.updateBallSpeed(1 + speedIncrease);
        
        this.gameArea.effects.createBrickPieces(brick.element);
        const color = this.gameArea.id === 1 ? '#0FF' : '#FF0';
        this.gameArea.effects.createParticles(
            brickRect.left - this.gameArea.area.getBoundingClientRect().left + brickRect.width/2,
            brickRect.top - this.gameArea.area.getBoundingClientRect().top + brickRect.height/2,
            color,
            12
        );
        
        brick.element.style.animation = 'none';
        void brick.element.offsetWidth;
        brick.element.style.animation = 'brickHit 0.3s forwards';
        setTimeout(() => {
            brick.element.style.display = 'none';
        }, 300);
        
        const ballRect = this.gameArea.ball.getBoundingClientRect();
        const overlapLeft = ballRect.right - brickRect.left;
        const overlapRight = brickRect.right - ballRect.left;
        const overlapTop = ballRect.bottom - brickRect.top;
        const overlapBottom = brickRect.bottom - ballRect.top;
        
        const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
        
        if (minOverlap === overlapLeft || minOverlap === overlapRight) {
            this.gameArea.ballSpeedX = -this.gameArea.ballSpeedX * 1.02;
        } else {
            this.gameArea.ballSpeedY = -this.gameArea.ballSpeedY * 1.02;
        }
        
        this.triggerBallBounce();
    }

    checkBottomCollision() {
        if (this.gameArea.ballY >= this.gameArea.area.clientHeight) {
            this.gameArea.gameActive = false;
        }
    }

    triggerBallBounce() {
        this.gameArea.ball.style.animation = 'none';
        void this.gameArea.ball.offsetWidth;
        this.gameArea.ball.style.animation = 'ball-bounce 0.2s ease';
    }
}