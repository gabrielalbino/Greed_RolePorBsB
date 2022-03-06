import { createGradient, getRandomArbitrary } from "../helpers";
import { Point } from "./types"

export class City {
    position;
    angle;
    name;
    radius = 20;
    dynamicRadius = 20;
    color: string | CanvasGradient | undefined = 'white';
    isInHover = false;
    drawUserIsHereLabel = false;
    currentTicketPrice = 0.0;
    ticketBasePrice;
    ctx;
    idx;
    setHovered;
    hoverGradient;
    userGradient;
    defaultGradient;
    constructor(
        position:Point, 
        name:string, 
        angle: number, 
        ctx:CanvasRenderingContext2D | null | undefined, 
        idx: number,
        setHovered: Function,
    ){
        this.angle = angle;
        this.position = position;
        this.name = name;
        this.ctx = ctx;
        this.idx = idx;
        this.setHovered = setHovered;
        this.hoverGradient = createGradient(ctx, '#2193b0', '#6dd5ed', this.position.x, this.position.y, this.dynamicRadius * 2, this.dynamicRadius * 2);
        this.userGradient = createGradient(ctx, '#bdc3c7', '#2c3e50', this.position.x, this.position.y, this.dynamicRadius * 2, this.dynamicRadius * 2);
        this.defaultGradient = createGradient(this.ctx, '#ee9ca7', '#ffdde1', this.position.x, this.position.y, this.dynamicRadius * 2, this.dynamicRadius * 2);
        //ticket base price for nice random prices
        this.ticketBasePrice = Math.round(getRandomArbitrary(30,50)) * 0.05;
    }

    //todo: opacidade
    update(mousePosition: Point, userIsHere: boolean, currentDistanceFromUser: number){
        const limit = this.isInHover ? 30 : 15;
        const deltaX = Math.abs(mousePosition.x - this.position.x);
        const deltaY =  Math.abs(mousePosition.y - this.position.y);
        const isHovering = (deltaX < limit && deltaY < limit);
        this._handleHover(isHovering);
        let color: CanvasGradient | undefined | string = this.defaultGradient;
        if (isHovering) color = this.hoverGradient;
        if (userIsHere) color = this.userGradient;
        this.color = color;
        this.drawUserIsHereLabel = userIsHere;
        this.currentTicketPrice = currentDistanceFromUser * this.ticketBasePrice;
        this.dynamicRadius = isHovering ? Math.min(this.dynamicRadius * 1.01, 25) : Math.max(this.radius, this.dynamicRadius *0.99);
    }

    _handleHover(isHovering: boolean){
        if(isHovering){
            this.setHovered(this.idx);
        }
        else if (isHovering !== this.isInHover){
            this.setHovered(-1);
        }
        this.isInHover = isHovering;
    }

    draw() {
        if(!this.ctx || !this.color) return;
        this.ctx.font = '1.25rem arial bold';
        const text = `${this.name}`;
        const textMeasurements = this.ctx?.measureText(text) || {width: 0};
        this.ctx.strokeStyle = this.color;
        this.ctx.fillStyle = this.color;    
        this.ctx.beginPath();
        this.ctx.arc(this.position.x, this.position.y, this.dynamicRadius, 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.fillStyle = 'white';    
        this.ctx.fillText(text, this.position.x - textMeasurements.width/2, this.position.y + this.dynamicRadius * 2) 
        if (this.isInHover || this.drawUserIsHereLabel) {
            const text = this.drawUserIsHereLabel ? "Você" : `Tarifa: R$ ${this.currentTicketPrice.toFixed(2).toString().replace(".",",")}`;
            this.ctx.font = '1.5rem arial';
            const drawLabelMesaurements = this.ctx?.measureText(text) || {width: 0};
            this.ctx.fillText(text, this.position.x - drawLabelMesaurements.width / 2, this.position.y - this.dynamicRadius * 1.5) 
            this.ctx.font = '1rem arial';
        }
    }
}