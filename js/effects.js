export function createLightImpact(x, y, color, container) {
    const light = document.createElement('div');
    light.className = 'light-impact';
    light.style.left = `${x}px`;
    light.style.top = `${y}px`;
    light.style.background = `radial-gradient(circle, ${color} 0%, rgba(255,255,255,0) 70%)`;
    container.appendChild(light);
    
    setTimeout(() => {
        light.remove();
    }, 300);
}

export function createWallWave(x, color, container, isLeftWall) {
    const wave = document.createElement('div');
    wave.className = 'wall-wave';
    wave.style.setProperty('--wave-color', color);
    wave.style.setProperty('--impact-x', `${x}px`);
    wave.style.setProperty('--wave-end', isLeftWall ? '0px' : `${container.clientWidth}px`);
    wave.style.left = `${x}px`;
    container.appendChild(wave);
    
    setTimeout(() => {
        wave.remove();
    }, 600);
}

export function paddleHitEffect(paddleElement) {
    paddleElement.classList.add('paddle-hit');
    setTimeout(() => {
        paddleElement.classList.remove('paddle-hit');
    }, 300);
}