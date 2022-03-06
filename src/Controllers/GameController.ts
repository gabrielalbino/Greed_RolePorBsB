import { citiesList } from "../constants";
import { createGradient, getRandomArbitrary } from "../helpers";
import { City } from "../Models/City";
import { MoneyImages, Point } from "../Models/types";
import { User } from "../Models/User";

export class GameController {
    canvas: HTMLCanvasElement | null;
    ctx: CanvasRenderingContext2D | null | undefined;
    mouse: Point = {x: 0, y: 0};
    cities: City[];
    user: User;
    pathCoords:Array<Array<Point>> = [];
    numberOfCities = 10;
    cityInHover = -1;
    images;
    backgroundGradient;
    pathGradient: CanvasGradient | undefined;
    pathDefaultGradient: CanvasGradient | undefined;
    constructor(canvas:HTMLCanvasElement | null, images: MoneyImages) {
        this.canvas = canvas;   
        this.ctx = canvas?.getContext('2d');
        this.cities = this._generateStops();
        this.user = this._generateUser();
        this._setupMouseTracking();
        this._setupPathCoords();
        this._setupUserCityChanger();
        this.images = images;
        this.pathGradient = createGradient(this.ctx, '#2193b0', '#6dd5ed', 0, 0, this.canvas?.width, this.canvas?.height);
        this.pathDefaultGradient = createGradient(this.ctx, '#ee9ca7', '#ffdde1', 0, 0, this.canvas?.width, this.canvas?.height);
        this.backgroundGradient = createGradient(this.ctx, '#42275a', '#734b6d', 0, 0, this.canvas?.width, this.canvas?.height);
        requestAnimationFrame(this.animate.bind(this));
    }

    animate(){
        if(!this.ctx || !this.backgroundGradient || !this.canvas) return;
        const direction = this._getDirection();
        this.ctx.clearRect(0,0, this.canvas.width,this.canvas.height);
        this.ctx.fillStyle = this.backgroundGradient;
        this.ctx.fillRect(0,0, this.canvas.width,this.canvas.height);
        this._drawPaths(direction);
        this._drawImages();
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
        const moneyLabel = `Seu dinheiro: R$ ${this.user.money.toFixed(2).replace(".",",")}`;
        this.ctx.fillStyle = '#eee';    
        this.ctx.font = '2rem arial';
        this.ctx.fillText(moneyLabel, 50, 50);        
        if(this.cityInHover !== -1){
            this.ctx.fillText(`Viajar para ${this.cities[this.cityInHover].name}\nTroco: R$ ${(this.user.money - this.cities[this.cityInHover].currentTicketPrice).toFixed(2)}`, 50, 150);             
        }
            
        this.ctx.font = '1rem arial';
        if(this.canvas) {
            this.canvas.style.cursor= cursor;
        }
        requestAnimationFrame(this.animate.bind(this));
    }

    _drawImages(){
        if(!this.ctx) return;
        this._drawUserMoney();
    }

    _drawUserMoney(){
        var cumulativeOffset = 80;
        var colPos = 200;
        this.user.decomposedMoney.forEach((value: number, index:number) => {
            const imageToDraw = this.images[value.toFixed(2)];
            if(!imageToDraw.image) return;
            const imagesSize = {'Cell': 150,'Coin': 75},
            offset = {
                'Cell': {width: 30, heigth: 0},
                'Coin': {width: 100, heigth: 75}
            },
            type =  value < 2 ? 'Coin' : 'Cell',
            imageSize = imagesSize[type],
            imageOffset = offset[type];
            if(!this.ctx || !this.canvas) return;
            if(type === 'Cell'){
                const x = cumulativeOffset + index * imageOffset.width,
                y = colPos;
                this.ctx.save();
                this.ctx.translate(x, y);
                this.ctx.rotate((0 + 15*index*Math.PI)/180);
                this.ctx.drawImage(imageToDraw.image, x, y, imageSize, imageSize * imageToDraw.height / imageToDraw.width);
                this.ctx.restore();
            }
            else {
                const x = 20,
                y = colPos + index * imageOffset.heigth;
                this.ctx.drawImage(imageToDraw.image, x, y, imageSize, imageSize * imageToDraw.height / imageToDraw.width);
            }
        })
    }

    _setCityHovered(cityIndex: number){
        this.cityInHover = cityIndex;
    }

    _setupUserCityChanger(){
        document.addEventListener('click', () => {
            if(this.cityInHover !== -1 && this.user.money > this.cities[this.cityInHover].currentTicketPrice) {
                this.user.location = this.cityInHover;
                this.user.payTicket(this.cities[this.cityInHover].currentTicketPrice);
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
            if(!this.ctx || !this.pathGradient || !this.pathDefaultGradient) return;
            const isPathTravelPath = isTravelPath(idx, direction),
            startingPoint = pathCoord[0],
            endingPoint = pathCoord[1],
            controlPoint = pathCoord[2];
            this.ctx.beginPath();
            this.ctx.strokeStyle = isPathTravelPath ? this.pathGradient : this.pathDefaultGradient;
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
        const initialMoney = Math.round(getRandomArbitrary(800,1000)) * 0.05;
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