import { decomposeMoney } from "../Controllers/GreedController";

export class User {
    money;
    location;
    decomposedMoney;
    constructor (initialMoney: number, initialLocation: number){
        this.money = Number.parseFloat(initialMoney.toFixed(2));
        this.location = initialLocation;
        this.decomposedMoney = decomposeMoney(initialMoney);
    }

    payTicket(fee: number){
        this.money -= fee;
        this.decomposedMoney = decomposeMoney(this.money);
    }
}