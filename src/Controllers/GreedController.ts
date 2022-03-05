//decompose user money into a set of possible values using greed algorithm.
export const decomposeMoney = (quantity: number) => {
    console.log({quantity});
    const set: Array<number> = [],
    possibleValues = [50, 20, 10, 5, 2, 1, 0.5, 0.25, 0.1, 0.05];
    var idx = 0;
    while(quantity){
        console.log(quantity);
        while(possibleValues[idx] > quantity){
            idx++;
        }
        quantity -= possibleValues[idx];
        //deal with js float point precision ;S
        quantity = Number.parseFloat(quantity.toFixed(2));
        set.push(possibleValues[idx]);
    }
    return set;
}