export function getRandomArbitrary(min: number, max:number) {
    return Math.random() * (max - min) + min;
}

export function createGradient(ctx: CanvasRenderingContext2D | null | undefined,color1: string, color2: string, sX = 0, sY = 0, width = 0, height = 0){
    if(!ctx) return;
    const gradient = ctx.createLinearGradient(sX,sY,width, height);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    return gradient;
}