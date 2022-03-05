import { Point } from "./types"

export class City {
    position: Point;
    angle: number;
    name: string;
    radius: number;
    hoveredRadius: number;
    color: string;
    drawTravelLabel: boolean;
    ctx: CanvasRenderingContext2D | null | undefined;
    constructor(position:Point, name:string, angle: number, ctx:CanvasRenderingContext2D | null | undefined){
        this.color = 'white';
        this.drawTravelLabel = false;
        this.angle = angle;
        this.position = position;
        this.name = name;
        this.ctx = ctx;
        this.radius = 20;
        this.hoveredRadius = 20;
    }

    //todo: opacidade
    update(mousePosition: Point){
        const limit = this.drawTravelLabel ? 30 : 15;
        const deltaX = Math.abs(mousePosition.x - this.position.x);
        const deltaY =  Math.abs(mousePosition.y - this.position.y);
        const isHovering = (deltaX < limit && deltaY < limit);
        this.color = isHovering ? '#ffffbb' : 'white';
        this.drawTravelLabel = isHovering ? true : false;
        this.hoveredRadius = isHovering ? Math.min(this.hoveredRadius * 1.01, 25) : Math.max(this.radius, this.hoveredRadius *0.99);
    }

    draw() {
        if(!this.ctx) return;
        this.ctx.font = '1rem arial';
        const textMeasurements = this.ctx?.measureText(this.name) || {width: 0};
        this.ctx.strokeStyle = this.color;
        this.ctx.fillStyle = this.color;    
        this.ctx.beginPath();
        this.ctx.arc(this.position.x, this.position.y, this.hoveredRadius, 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.fillText(this.name, this.position.x - textMeasurements.width/2, this.position.y + this.hoveredRadius * 2) 
        if (this.drawTravelLabel) {
            this.ctx.font = '2rem arial';
            const drawTravelLabelMesaurements = this.ctx?.measureText("Viajar") || {width: 0};
            this.ctx.fillText("Viajar", this.position.x - drawTravelLabelMesaurements.width/2, this.position.y - this.hoveredRadius * 1.5) 
            this.ctx.font = '1rem arial';
        }
    }
}