export class EffectsManager {
    constructor(container) {
        this.container = container;
        this.particlePool = [];
        this.initStars();
    }

    initStars() {
        for (let i = 0; i < 50; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 3}s`;
            this.container.appendChild(star);
        }
    }

    createTrail(x, y, color) {
        const trail = this.getParticle();
        trail.className = 'ball-trail';
        trail.style.left = `${x}px`;
        trail.style.top = `${y}px`;
        trail.style.color = color;
        this.container.appendChild(trail);
        
        if (Math.random() > 0.7) {
            this.createGlow(x, y, color);
        }
        
        setTimeout(() => this.releaseParticle(trail), 600);
    }

    createGlow(x, y, color) {
        const glow = this.getParticle();
        glow.className = 'particle';
        glow.style.left = `${x}px`;
        glow.style.top = `${y}px`;
        glow.style.backgroundColor = color;
        glow.style.setProperty('--tx', `${(Math.random() - 0.5) * 5}px`);
        glow.style.setProperty('--ty', `${(Math.random() - 0.5) * 5}px`);
        this.container.appendChild(glow);
        setTimeout(() => this.releaseParticle(glow), 400);
    }

    createLightImpact(x, y, color) {
        const light = this.getParticle();
        light.className = 'light-impact';
        light.style.left = `${x}px`;
        light.style.top = `${y}px`;
        light.style.background = `radial-gradient(circle, ${color} 0%, rgba(255,255,255,0) 70%)`;
        this.container.appendChild(light);
        
        setTimeout(() => this.releaseParticle(light), 300);
    }

    createWallWave(x, color, isLeftWall) {
        const wave = document.createElement('div');
        wave.className = 'wall-wave';
        wave.style.setProperty('--wave-color', color);
        wave.style.setProperty('--impact-x', `${x}px`);
        wave.style.setProperty('--wave-end', isLeftWall ? '0px' : `${this.container.clientWidth}px`);
        wave.style.left = `${x}px`;
        this.container.appendChild(wave);
        
        setTimeout(() => wave.remove(), 600);
    }

    createBrickPieces(brick) {
        const color = brick.className.includes('player1') ? '#00F' : '#F00';
        const rect = brick.getBoundingClientRect();
        const areaRect = this.container.getBoundingClientRect();
        const x = rect.left - areaRect.left + rect.width/2;
        const y = rect.top - areaRect.top + rect.height/2;
        
        for (let i = 0; i < 4; i++) {
            const piece = document.createElement('div');
            piece.className = 'brick-piece';
            piece.style.backgroundColor = color;
            piece.style.left = `${x}px`;
            piece.style.top = `${y}px`;
            
            let px, py, rotation;
            switch(i) {
                case 0:
                    px = -15 + Math.random() * 5;
                    py = -20 - Math.random() * 10;
                    rotation = -10 - Math.random() * 10;
                    break;
                case 1:
                    px = 15 + Math.random() * 5;
                    py = -20 - Math.random() * 10;
                    rotation = 10 + Math.random() * 10;
                    break;
                case 2:
                    px = -15 + Math.random() * 5;
                    py = 10 + Math.random() * 10;
                    rotation = -5 - Math.random() * 5;
                    break;
                case 3:
                    px = 15 + Math.random() * 5;
                    py = 10 + Math.random() * 10;
                    rotation = 5 + Math.random() * 5;
                    break;
            }
            
            piece.style.setProperty('--px', `${px}px`);
            piece.style.setProperty('--py', `${py}px`);
            piece.style.setProperty('--pr', `${rotation}deg`);
            
            this.container.appendChild(piece);
            setTimeout(() => piece.remove(), 600);
        }
    }

    createParticles(x, y, color, count = 10) {
        for (let i = 0; i < count; i++) {
            if (Math.random() > 0.5) {
                const particle = this.getParticle();
                particle.className = 'particle';
                particle.style.backgroundColor = color;
                particle.style.left = `${x}px`;
                particle.style.top = `${y}px`;
                
                const angle = Math.random() * Math.PI * 2;
                const distance = 5 + Math.random() * 25;
                const tx = Math.cos(angle) * distance;
                const ty = Math.sin(angle) * distance;
                
                particle.style.setProperty('--tx', `${tx}px`);
                particle.style.setProperty('--ty', `${ty}px`);
                
                this.container.appendChild(particle);
                setTimeout(() => this.releaseParticle(particle), 800);
            } else {
                const energyParticle = this.getParticle();
                energyParticle.className = 'energy-particle';
                energyParticle.style.backgroundColor = color;
                energyParticle.style.left = `${x}px`;
                energyParticle.style.top = `${y}px`;
                
                const angle = Math.random() * Math.PI * 2;
                const distance = 10 + Math.random() * 40;
                const etx = Math.cos(angle) * distance;
                const ety = Math.sin(angle) * distance;
                
                energyParticle.style.setProperty('--etx', `${etx}px`);
                energyParticle.style.setProperty('--ety', `${ety}px`);
                
                this.container.appendChild(energyParticle);
                setTimeout(() => this.releaseParticle(energyParticle), 600);
            }
        }
    }

    paddleHitEffect(paddleElement) {
        paddleElement.classList.add('paddle-hit');
        setTimeout(() => {
            paddleElement.classList.remove('paddle-hit');
        }, 300);
    }

    getParticle() {
        if (this.particlePool.length > 0) {
            return this.particlePool.pop();
        }
        return document.createElement('div');
    }

    releaseParticle(particle) {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
        this.particlePool.push(particle);
    }
}

export function initEffects(area1, area2) {
    new EffectsManager(area1);
    new EffectsManager(area2);
}