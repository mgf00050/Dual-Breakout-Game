import { CollisionSystem } from './collisionSystem.js';
import { EffectsManager } from './effectsManager.js';

export class GameArea {
    constructor(id, areaElement, opponentArea) {
        this.id = id;
        this.area = areaElement;
        this.opponentArea = opponentArea;
        this.paddle = areaElement.querySelector(`#paddle${id}`);
        this.ball = areaElement.querySelector(`#ball${id}`);
        this.bricksContainer = areaElement.querySelector(`#bricks${id}`);
        this.gameOver = areaElement.querySelector(`#gameOver${id}`);
        this.gameWin = areaElement.querySelector(`#gameWin${id}`);
        this.gameDraw = areaElement.querySelector(`#gameDraw${id}`);
        this.scoreElement = areaElement.querySelector(`#score${id}`);
        
        this.bricks = [];
        this.ballX = 0;
        this.ballY = 0;
        this.ballSpeedX = id === 1 ? 3 : -3;
        this.ballSpeedY = 3;
        this.paddleX = 0;
        this.score = 0;
        this.baseSpeed = 3;
        
        this.gameActive = false;
        this.moveLeft = false;
        this.moveRight = false;
        
        this.collisionSystem = new CollisionSystem(this);
        this.effects = new EffectsManager(this.area);
    }

    reset() {
        this.gameActive = true;
        this.score = 0;
        this.updateScore();
        
        this.ballSpeedX = this.id === 1 ? this.baseSpeed : -this.baseSpeed;
        this.ballSpeedY = this.baseSpeed;
        
        this.gameOver.style.display = 'none';
        this.gameWin.style.display = 'none';
        this.gameDraw.style.display = 'none';
        
        this.resetPositions();
        this.createBricks();
    }

    resetPositions() {
        this.paddleX = (this.area.clientWidth - this.paddle.clientWidth) / 2;
        this.paddle.style.left = `${this.paddleX}px`;
        
        this.ballX = this.area.clientWidth / 2 - this.ball.clientWidth / 2;
        this.ballY = this.area.clientHeight - 50;
        this.ball.style.left = `${this.ballX}px`;
        this.ball.style.top = `${this.ballY}px`;
    }

    createBricks() {
        this.bricksContainer.innerHTML = '';
        this.bricks = [];
        
        const brickWidth = 80;
        const brickHeight = 25;
        const brickSpacing = 2;
        const numCols = 6;
        const numRows = 6;
        
        const totalBrickWidth = numCols * (brickWidth + brickSpacing);
        const bricksAreaLeft = (this.area.clientWidth - totalBrickWidth) / 2;
        
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                const brick = document.createElement('div');
                brick.className = `brick player${this.id}-brick`;
                brick.style.left = `${bricksAreaLeft + col * (brickWidth + brickSpacing)}px`;
                brick.style.top = `${50 + row * (brickHeight + brickSpacing)}px`;
                brick.dataset.row = row;
                brick.dataset.col = col;
                
                const activeInitially = row < 3;
                if (activeInitially) {
                    brick.style.animation = 'brick-spawn 0.5s ease-out';
                } else {
                    brick.style.display = 'none';
                }
                
                this.bricksContainer.appendChild(brick);
                this.bricks.push({
                    element: brick,
                    active: activeInitially
                });
            }
        }
    }

    update() {
        this.movePaddle();
        this.moveBall();
        this.collisionSystem.checkCollisions();
    }

    render() {
        this.paddle.style.left = `${this.paddleX}px`;
        this.ball.style.left = `${this.ballX}px`;
        this.ball.style.top = `${this.ballY}px`;
    }

    movePaddle() {
        const paddleSpeed = 7;
        
        if (this.moveLeft && this.paddleX > 0) {
            this.paddleX -= paddleSpeed;
            this.paddle.style.transform = 'scaleX(0.95)';
        } else if (this.moveRight && this.paddleX < this.area.clientWidth - this.paddle.clientWidth) {
            this.paddleX += paddleSpeed;
            this.paddle.style.transform = 'scaleX(0.95)';
        } else {
            this.paddle.style.transform = 'scaleX(1)';
        }
    }

    moveBall() {
        this.ballX += this.ballSpeedX;
        this.ballY += this.ballSpeedY;
        
        if (Math.random() > 0.3) {
            this.effects.createTrail(this.ballX, this.ballY, this.ball.style.color);
        }
    }

    updateScore() {
        this.scoreElement.textContent = this.score;
    }

    showGameOverScreen() {
        this.gameOver.style.display = 'block';
    }

    showWinScreen() {
        this.gameWin.style.display = 'block';
    }

    showDrawScreen() {
        this.gameDraw.style.display = 'block';
    }

    addRandomBrick() {
        const inactiveBricks = this.bricks.filter(b => !b.active);
        
        if (inactiveBricks.length > 0) {
            const randomBrick = inactiveBricks[Math.floor(Math.random() * inactiveBricks.length)];
            randomBrick.active = true;
            
            randomBrick.element.style.display = 'block';
            randomBrick.element.style.animation = 'none';
            void randomBrick.element.offsetWidth;
            randomBrick.element.style.animation = 'brickSpawn 0.5s ease-out';
        }
    }

    updateBallSpeed(multiplier) {
        const directionX = Math.sign(this.ballSpeedX);
        const directionY = Math.sign(this.ballSpeedY);
        
        this.ballSpeedX = directionX * this.baseSpeed * multiplier;
        this.ballSpeedY = directionY * this.baseSpeed * multiplier;
    }
}