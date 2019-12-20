import { MixType } from "./enums/mixType";
import { Glize } from "./enums/glize";

export interface ProductCard {
    _id?: string;
    productName: string,
    code: string,
    type: MixType | '',
    glize: Glize | '',
    productionDate: string,
    dimensions: { width: number, height: number},

    bOvenHeat: { low: number, high: number},
    pOvenHeat: { low: number, high: number},
    bOvenPeriod: number
    pOvenPeriod: number
    engobFactors: { weight: number, density: number, viscosity: number },
    paintFactors: { weight: number, density: number, viscosity: number },
    pistonPressure: number,
    thickness: number,
    breakingForce: number,
    radiation: number,
    imageUrl?: string,
    paintMix: string,
    engobMix: string,
    bodyMix: string,
    createdAt?: string
}