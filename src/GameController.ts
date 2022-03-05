import { citiesList } from "./constants";
import { getRandomArbitrary } from "./helpers";
import { City } from "./Models/City";
import { Point } from "./Models/types";

export class GameController {
    canvas: HTMLCanvasElement | null;
    ctx: CanvasRenderingContext2D | null | undefined;
    mouse: Point;
    cities: City[];
    constructor(canvas:HTMLCanvasElement | null) {
        this.mouse = {x: 0, y: 0};
        this.canvas = canvas;   
        this.ctx = canvas?.getContext('2d');
        this.cities = this._generateStops();
        this.mouse = {x: 0, y: 0};
        this._setupMouseTracking();
        requestAnimationFrame(this.animate.bind(this));
    }

    animate(){
        this.ctx?.clearRect(0,0, this.canvas?.width || 0,this.canvas?.height || 0);
        var cursor = 'default';
        this.cities.forEach(city=>{
            city.update(this.mouse);
            city.draw();
            if(city.drawTravelLabel) {
                cursor = 'pointer';
            }
        });
        if(this.canvas) {
            this.canvas.style.cursor= cursor;
        }
        requestAnimationFrame(this.animate.bind(this));
    }

    _generateStops() {
        const cities: Array<City> = [];
        const citiesListFiltered = citiesList.sort(() => 0.5 - Math.random()).slice(0,10);
        //set points to be between 20% and 80% of total width/height of screen;
        const boundaries = {
            min: {x: 0, y:0}, 
            max: {x: this.canvas?.width,  y: this.canvas?.height}
        };
    
        //generate a random point for each city
        citiesListFiltered.forEach((cityName, idx) => {
            const angle = this._getRandomAngle(idx),
            points = this._getRandomPoints(boundaries, angle);
            cities.push(new City(points, cityName, angle, this.canvas?.getContext('2d')));
        });
        return cities;
    }

    _getRandomPoints = (boundaries: any, angle:number) => {
        const offsets = {
            x: boundaries.max.x - boundaries.min.x,
            y: boundaries.max.y - boundaries.min.y
        }, 
        middleScreen = {
            x: offsets.x/2, 
            y: offsets.y/2
        }, 
        radius = Math.min(middleScreen.x, middleScreen.y) * 0.8;
        return {
            x: radius * Math.cos(angle) + middleScreen.x, 
            y: radius * Math.sin(angle) + middleScreen.y,
            angle
        }
    }

    _getRandomAngle = (index: number) => {
        const min = (2 * Math.PI * (index/10)) * 1.1,
        max = (2 * Math.PI * ((index + 1) / 10)) * 0.9,
        angle = getRandomArbitrary(min, max);
        return angle;
    }

    _setupMouseTracking(){
        const callback = (event: MouseEvent) => {
            this.mouse.x = event.clientX;
            this.mouse.y = event.clientY;
        }
        window.addEventListener('mousemove', callback.bind(this));
    }
    
}