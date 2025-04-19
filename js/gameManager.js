import { GameArea } from './gameObjects.js';
import { initEffects } from './effectsManager.js';
import { setupInputHandlers } from './inputHandler.js';

export class GameManager {
    constructor() {
        this.players = [];
        this.gameState = 'MENU';
        this.animationId = null;
        this.init();
    }

    init() {
        const area1 = document.getElementById('gameArea1');
        const area2 = document.getElementById('gameArea2');
        
        this.players = [
            new GameArea(1, area1, null),
            new GameArea(2, area2, null)
        ];
        
        // Establecer referencias cruzadas
        this.players[0].opponentArea = this.players[1];
        this.players[1].opponentArea = this.players[0];
        
        initEffects(area1, area2);
        setupInputHandlers(this);
        
        document.querySelector('.gameContainer').style.display = 'none';
    }

    startGame() {
        this.gameState = 'PLAYING';
        this.players.forEach(player => player.reset());
        this.startGameLoop();
    }

    startGameLoop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        const gameLoop = () => {
            if (this.gameState === 'PLAYING') {
                this.update();
                this.render();
            }
            this.animationId = requestAnimationFrame(gameLoop);
        };

        this.animationId = requestAnimationFrame(gameLoop);
    }

    update() {
        this.players.forEach(player => {
            if (player.gameActive) {
                player.update();
            }
        });

        this.checkGameOver();
    }

    render() {
        this.players.forEach(player => {
            player.render();
        });
    }

    checkGameOver() {
        const activePlayers = this.players.filter(p => p.gameActive).length;
        
        if (activePlayers < this.players.length) {
            this.gameState = 'GAME_OVER';
            this.showEndGameScreens();
        }
    }

    showEndGameScreens() {
        const activePlayers = this.players.filter(p => p.gameActive).length;
        
        if (activePlayers === 0) {
            this.players.forEach(p => p.showDrawScreen());
        } else {
            const winner = this.players.find(p => p.gameActive);
            const loser = this.players.find(p => !p.gameActive);
            
            winner.showWinScreen();
            loser.showGameOverScreen();
        }
    }

    resetGame() {
        if (this.gameState === 'GAME_OVER') {
            this.startGame();
        }
    }
}