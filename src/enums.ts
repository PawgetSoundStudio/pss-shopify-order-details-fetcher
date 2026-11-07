export class MaterialType {
    static WHITE_VINYL = "white_vinyl";
    static HOLOGRAPHIC_VINYL = "holo_vinyl";
    static CLEAR_VINYL = "clear_vinyl";

    static fromAttribute(attr: string): MaterialType {
        switch (attr) {
            case "Custom Vinyl Sticker":
                return this.WHITE_VINYL;
            case "Custom Holographic Sticker":
                return this.HOLOGRAPHIC_VINYL;
            default:
                throw new Error(`Can't find material type for input ${attr}`);
        }
    }
}

export class LaminateType {
    static GLOSSY = "glossy";
    static MATTE = "matte";

    static fromAttribute(attr: string | undefined): LaminateType | undefined {
        if (attr == undefined) return undefined;
        switch (attr) {
            case "Glossy":
                return this.GLOSSY;
            case "Matte":
                return this.MATTE;
            default:
                throw new Error(`Can't find laminate type for input ${attr}`);
        }
    }
}

export class WhiteInkBehaviour {
    static NO_WHITE = "no_white";
    static WHITE_INFILL = "white_infill";
    static WHITE_BORDER = "white_border";

    static fromAttribute(attr: string | undefined): LaminateType | undefined {
        if (attr == undefined) return undefined;
        switch (attr) {
            case "No white":
                return this.NO_WHITE;
            case "Holo border (White Infill)":
                return this.WHITE_INFILL;
            case "White border":
                return this.WHITE_BORDER;
            default:
                throw new Error(`Can't find white ink type for input ${attr}`);
        }
    }
}