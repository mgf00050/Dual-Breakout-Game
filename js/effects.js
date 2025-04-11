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