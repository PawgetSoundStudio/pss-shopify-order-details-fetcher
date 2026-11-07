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
    baseMaterial: MaterialType;
    laminateMaterial?: string;
    shape: string;
    borderSize: string;
    //TODO pull tab/accessibility options
    whiteInkBehaviour?: WhiteInkBehaviour;
    instructions?: string;
    socialMediaPosting: boolean;
    socialMediaHandle?: string;
}