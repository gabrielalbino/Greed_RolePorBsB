import { citiesList } from "./constants";
import { getRandomArbitrary } from "./helpers";
import { City } from "./Models/City";
import { Point } from "./Models/types";
import { User } from "./Models/User";

export class GameController {
    canvas: HTMLCanvasElement | null;
    ctx: CanvasRenderingContext2D | null | undefined;
    mouse: Point = {x: 0, y: 0};
    cities: City[];
    user: User;
    pathCoords:Array<Array<Point>> = [];
    numberOfCities = 10;
    cityInHover = -1;
    constructor(canvas:HTMLCanvasElement | null) {
        this.canvas = canvas;   
        this.ctx = canvas?.getContext('2d');
        this.cities = this._generateStops();
        this.user = this._generateUser();
        this._setupMouseTracking();
        this._setupPathCoords();
        this._setupUserCityChanger();
        requestAnimationFrame(this.animate.bind(this));
    }

    animate(){
        if(!this.ctx) return;
        const direction = this._getDirection();
        this.ctx.clearRect(0,0, this.canvas?.width || 0,this.canvas?.height || 0);
        this._drawPaths(direction);
        var cursor = 'default';
        this.cities.forEach((city, cityIndex)=>{
            const { location } = this.user;
            const isInCity = cityIndex === location;
            const currentDistanceFromUser = this._getDistance(cityIndex);
            city.update(this.mouse, isInCity, currentDistanceFromUser);
            city.draw();
            if(city.isInHover) {
                cursor = 'pointer';
            }
        });
        const moneyLabel = `Seu dinheiro: R$ ${this.user.money.toFixed(2).toString().replace(".",",")}`;
        this.ctx.fillStyle = 'white';    
        this.ctx.font = '2rem arial';
        this.ctx.fillText(moneyLabel, 50, 50);        
        if(this.cityInHover !== -1){
            this.ctx.fillText(`Viajar para ${this.cities[this.cityInHover].name}`, 50, 150);             
        }
            
        if(direction !== 0){
            this.ctx.fillText(`Direção: ${direction === -1 ? 'direita' : 'esquerda'}`, 50, 250);             
        }
        
        this.ctx.font = '1rem arial';
        if(this.canvas) {
            this.canvas.style.cursor= cursor;
        }
        requestAnimationFrame(this.animate.bind(this));
    }

    _setCityHovered(cityIndex: number){
        this.cityInHover = cityIndex;
    }

    _setupUserCityChanger(){
        document.addEventListener('click', () => {
            if(this.cityInHover !== -1 && this.user.money > this.cities[this.cityInHover].currentTicketPrice) {
                this.user.location = this.cityInHover;
                this.user.money -= this.cities[this.cityInHover].currentTicketPrice;
            }
        });
    }

    _setupPathCoords(){
        this.cities.forEach((city, index) => {
            var neighboorIndex = index + 1;
            if(neighboorIndex >= this.numberOfCities) neighboorIndex = 0;
            const pointA = city.position,
            pointB = this.cities[neighboorIndex].position,
            controlPoint = this._getControlPoint(pointA, pointB);
            this.pathCoords.push([pointA, pointB, controlPoint]);
        });
    }

    _drawPaths(direction: number){
        const isTravelPath = (idx: number, direction: number) => {
            if(!this.ctx) return;
            const { location: source } = this.user,
            destination = this.cityInHover;
            if(source === destination) return false;
            if(direction === -1){
                if(source > destination) return (idx < source && idx >= destination);
                else return (idx < source || idx >= destination);
            }
            else if (direction === 1) {
                if(destination > source) return (idx >= source && idx < destination);
                else return (idx >= source || idx < destination);
            }
        }
        if(!this.ctx) return;
        this.ctx.lineWidth = 5;
        this.pathCoords.forEach((pathCoord, idx) => {
            if(!this.ctx) return;
            const isPathTravelPath = isTravelPath(idx, direction),
            startingPoint = pathCoord[0],
            endingPoint = pathCoord[1],
            controlPoint = pathCoord[2];
            this.ctx.beginPath();
            this.ctx.strokeStyle = isPathTravelPath ? 'yellow' : 'white';
            this.ctx.moveTo(startingPoint.x, startingPoint.y);
            this.ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, endingPoint.x, endingPoint.y);
            this.ctx.stroke();
        });
    }

    _getControlPoint(pointA: Point, pointB: Point){
        const variation = 1,
        direction = getRandomArbitrary(-1,1) >= 0 ? 1 : -1,
        variationX = 1 + Math.round(direction * getRandomArbitrary(0.3,variation)) * 0.1,
        variationY = 1 + Math.round(direction * getRandomArbitrary(0.3,variation)) * 0.1,
        midPointX = Math.abs(pointA.x +  pointB.x ) / 2,
        midPointY = Math.abs(pointA.y +  pointB.y ) / 2;
        return {x: midPointX * variationX, y: midPointY * variationY};
    }

    _getDirection(){
        var source = this.user.location,
        destintation = this.cityInHover;
        if(destintation === -1 ) return 0;
        //forwared distance
        const dist = Math.abs(destintation - source),
        //reverse distace
        reverseDist = this.numberOfCities - dist;
        if(dist <= reverseDist){
            return (source < destintation) ? 1 : -1;
        } else {
            return (source > destintation) ? 1 : -1;
        }
    }

    _getDistance(cityIndex: number){
        var { location: source } = this.user,
        destintation = cityIndex;
        //forwared distance
        const dist = Math.abs(destintation - source),
        //reverse distace
        reverseDist = this.numberOfCities - dist;
        return Math.min(dist,reverseDist);
    }

    _generateUser(){
        const initialMoney = Math.round(getRandomArbitrary(400,600)) * 0.05;
        const initialLocation = Math.round(getRandomArbitrary(0,this.numberOfCities - 1));
        return new User(initialMoney, initialLocation);
    }

    _generateStops() {
        const cities: Array<City> = [];
        const citiesListFiltered = citiesList.sort(() => 0.5 - Math.random()).slice(0, this.numberOfCities);
        //set points to be between 20% and 80% of total width/height of screen;
        const boundaries = {
            min: {x: 0, y:0}, 
            max: {x: this.canvas?.width,  y: this.canvas?.height}
        };
    
        //generate a random point for each city
        citiesListFiltered.forEach((cityName, idx) => {
            const angle = this._getRandomAngle(idx),
            points = this._getRandomPoints(boundaries, angle);
            cities.push(new City(points, cityName, angle, this.canvas?.getContext('2d'), idx, this._setCityHovered.bind(this)));
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
        const min = (2 * Math.PI * (index / this.numberOfCities)) * 1.1,
        max = (2 * Math.PI * ((index + 1) / this.numberOfCities)) * 0.9,
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