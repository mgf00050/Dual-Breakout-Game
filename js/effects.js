export function createLightImpact(x, y, color, area) {
    const light = document.createElement('div');
    light.className = 'light-impact';
    light.style.left = `${x}px`;
    light.style.top = `${y}px`;
    light.style.background = `radial-gradient(circle, ${color} 0%, rgba(255,255,255,0) 70%)`;
    area.appendChild(light);
    
    setTimeout(() => {
        light.remove();
    }, 300);
}

export function createWallWave(x, color, area, isLeftWall) {
    const wave = document.createElement('div');
    wave.className = 'wall-wave';
    wave.style.setProperty('--wave-color', color);
    wave.style.setProperty('--impact-x', `${x}px`);
    wave.style.setProperty('--wave-end', isLeftWall ? '0px' : `${area.clientWidth}px`);
    wave.style.left = `${x}px`;
    area.appendChild(wave);
    
    setTimeout(() => {
        wave.remove();
    }, 600);
}

export function createBrickPieces(brick, area) {
    const color = brick.className.includes('player1') ? '#00F' : '#F00';
    const rect = brick.getBoundingClientRect();
    const areaRect = area.getBoundingClientRect();
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
        
        area.appendChild(piece);
        
        setTimeout(() => {
            piece.remove();
        }, 600);
    }
}

export function createParticles(x, y, color, count = 10, container) {
    for (let i = 0; i < count; i++) {
        if (Math.random() > 0.5) {
            const particle = document.createElement('div');
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
            
            container.appendChild(particle);
            setTimeout(() => particle.remove(), 800);
        } else {
            const energyParticle = document.createElement('div');
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
            
            container.appendChild(energyParticle);
            setTimeout(() => energyParticle.remove(), 600);
        }
    }
}

export function createStars(container, count = 100) {
    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        container.appendChild(star);
    }
}

export function paddleHitEffect(paddleElement) {
    paddleElement.classList.add('paddle-hit');
    setTimeout(() => {
        paddleElement.classList.remove('paddle-hit');
    }, 300);
}

document.addEventListener('DOMContentLoaded', () => {
    const gameArea1 = document.getElementById('gameArea1');
    const gameArea2 = document.getElementById('gameArea2');
    if (gameArea1 && gameArea2) {
        createStars(gameArea1, 50);
        createStars(gameArea2, 50);
    }
});