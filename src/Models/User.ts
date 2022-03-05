export class User {
    money;
    location;
    constructor (initialMoney: number, initialLocation: number){
        this.money = initialMoney;
        this.location = initialLocation;
    }
}