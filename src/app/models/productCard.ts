import { BodyMix } from './bodyMix';
import { MixType } from "./enums/mixType";
import { Glize } from "./enums/glize";
import { PaintMix } from './paintMix';
import { EngobMix } from './engobMix';

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
    paintMix: any,
    engobMix: any,
    bodyMix: any,
    createdAt?: string
}