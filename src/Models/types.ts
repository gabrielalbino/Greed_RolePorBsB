
export interface Point {
    x: number,
    y: number,
}

export class Image {
    image;
    width;
    height;
    constructor(image: HTMLImageElement | null, width: number, height: number){
        this.image = image;
        this.width = width;
        this.height = height;
    }
}

export interface MoneyImages {
    '0.05': Image,
    '0.10': Image,
    '0.25': Image,
    '0.50': Image,
    '1.00': Image,
    '2.00': Image,
    '5.00': Image,
    '10.00': Image,
    '20.00': Image,
    '50.00': Image,
    [key: string]: Image;
}