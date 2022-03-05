import { Point } from "./types"

export class City {
    position: Point;
    angle: number;
    name: string;
    radius: number;
    ctx: CanvasRenderingContext2D | null | undefined;
    constructor(position:Point, name:string, angle: number, ctx:CanvasRenderingContext2D | null | undefined){
        this.angle = angle;
        this.position = position;
        this.name = name;
        this.ctx = ctx;
        this.radius = 20;
    }

    draw() {
        const textMeasurements = this.ctx?.measureText(this.name) || {width: 0};
        this.ctx?.beginPath();
        this.ctx?.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        this.ctx?.stroke();
        this.ctx?.fill();
        this.ctx?.fillText(this.name, this.position.x - textMeasurements.width/2, this.position.y + this.radius * 2)   
    }
}