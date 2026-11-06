import { MaterialType } from "./enums.ts";

export interface Order {
    id: string;
    date: string;
    discountCodes: string[];
    customer: Customer;
    items: {[id: string]: Item};
}

export interface Customer {
    name: string;
    email: string;
    numberOfOrders: number;
}
export interface Item {
    width: number;
    height: number;
    itemQuantity: number;
    stickerQuantity?: number;
    originalImageUrls: string[];
    baseMaterial: string;
    laminateMaterial?: string;
    //TODO
    //border
    //shape
    //pull tab/accessibility options
    //extra instructions
    //social media
}