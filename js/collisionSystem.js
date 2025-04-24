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
            
            // Aplicar el aumento de velocidad pendiente si existe
            if (this.gameArea.pendingSpeedIncrease) {
                this.gameArea.updateBallSpeed(1 + this.gameArea.pendingSpeedMultiplier);
                this.gameArea.pendingSpeedIncrease = false;
            }
            
            const hitPosition = (ballRect.left + ballRect.width/2) - (paddleRect.left + paddleRect.width/2);
            const normalizedHit = hitPosition / (paddleRect.width/2);
            this.gameArea.ballSpeedX = normalizedHit * 5;
            this.gameArea.ballSpeedY = -Math.abs(this.gameArea.ballSpeedY);
        }
    }

    checkBrickCollisions() {
        const ballRect = this.gameArea.ball.getBoundingClientRect();
        const collidedBricks = [];
        
        for (let i = 0; i < this.gameArea.bricks.length; i++) {
            const brick = this.gameArea.bricks[i];
            if (!brick.active) continue;
            
            const brickRect = brick.element.getBoundingClientRect();
            
            if (ballRect.right > brickRect.left &&
                ballRect.left < brickRect.right &&
                ballRect.bottom > brickRect.top &&
                ballRect.top < brickRect.bottom) {
                
                collidedBricks.push({brick, brickRect});
            }
        }
        
        if (collidedBricks.length === 0) return;
        
        let horizontalCollision = false;
        let verticalCollision = false;
        
        for (const {brick, brickRect} of collidedBricks) {
            this.updateGameState(brick);
            
            this.handleOpponentEffects();
            
            this.createBrickCollisionEffects(brick, brickRect);
            
            // Determinar la dirección de la colisión
            const collisionDirection = this.determineCollisionDirection(ballRect, brickRect);
            
            if (collisionDirection === 'horizontal') {
                horizontalCollision = true;
            } else if (collisionDirection === 'vertical') {
                verticalCollision = true;
            }
        }
        
        if (horizontalCollision) {
            this.gameArea.ballSpeedX = -this.gameArea.ballSpeedX * 1.02;
        }
        
        if (verticalCollision) {
            this.gameArea.ballSpeedY = -this.gameArea.ballSpeedY * 1.02;
        }
        
        //Inversión de colisiones por seguridad
        if (!horizontalCollision && !verticalCollision && collidedBricks.length > 0) {
            this.gameArea.ballSpeedX = -this.gameArea.ballSpeedX * 1.02;
            this.gameArea.ballSpeedY = -this.gameArea.ballSpeedY * 1.02;
        }
        
        this.triggerBallBounce();
    }
    
    // Determinar la dirección de la colisión
    determineCollisionDirection(ballRect, brickRect) {
        const overlapLeft = ballRect.right - brickRect.left;
        const overlapRight = brickRect.right - ballRect.left;
        const overlapTop = ballRect.bottom - brickRect.top;
        const overlapBottom = brickRect.bottom - ballRect.top;
        
        const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
        
        if (minOverlap === overlapLeft || minOverlap === overlapRight) {
            return 'horizontal';
        } else {
            return 'vertical';
        }
    }

    calculateCollisionPhysics(brickRect) {
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

    handleBrickCollision(brick, brickRect) {
        this.updateGameState(brick);
        
        this.handleOpponentEffects();
        
        this.createBrickCollisionEffects(brick, brickRect);
        
        this.calculateCollisionPhysics(brickRect);
    }
    
    updateGameState(brick) {
        brick.active = false;
        this.gameArea.score += 10;
        this.gameArea.updateScore();
    }
    
    handleOpponentEffects() {
        this.gameArea.opponentArea.addRandomBrick();
        
        this.gameArea.opponentArea.pendingSpeedIncrease = true;
        this.gameArea.opponentArea.pendingSpeedMultiplier = Math.min(this.gameArea.score / 1000, 2);
    }
    
    createBrickCollisionEffects(brick, brickRect) {
        const color = this.gameArea.id === 1 ? '#0FF' : '#FF0';
        
        this.gameArea.effects.createBrickPieces(brick.element);
        
        const relativeX = brickRect.left - this.gameArea.area.getBoundingClientRect().left + brickRect.width/2;
        const relativeY = brickRect.top - this.gameArea.area.getBoundingClientRect().top + brickRect.height/2;
        this.gameArea.effects.createParticles(relativeX, relativeY, color, 12);
        
        this.animateBrickHit(brick);
    }
    
    animateBrickHit(brick) {
        brick.element.style.animation = 'none';
        void brick.element.offsetWidth;
        brick.element.style.animation = 'brickHit 0.3s forwards';
        setTimeout(() => {
            brick.element.style.display = 'none';
        }, 300);
    }
    
    calculateCollisionPhysics(brickRect) {
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