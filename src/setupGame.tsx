
const setupGame = (canvasObject: HTMLCanvasElement) => {
    if (!canvasObject) return;
    setupDimensions(canvasObject);
    setupStyle(canvasObject);
}

const setDimensions = (canvasObject: HTMLCanvasElement) => {
    canvasObject.height = window.innerHeight;
    canvasObject.width = window.innerWidth;
}

const setupStyle = (canvasObject: HTMLCanvasElement) => {
    const ctx = canvasObject.getContext('2d');
    if(!ctx) return;
    ctx.strokeStyle = 'red';
    ctx.fillStyle = 'red';
    ctx.font = '1rem arial';
}

// Set canvas to full screen and handles resize
const setupDimensions = (canvasObject: HTMLCanvasElement) => {
    setDimensions(canvasObject);
    window.addEventListener('resize', function(){
        setDimensions(canvasObject);
    });
}

export default setupGame;