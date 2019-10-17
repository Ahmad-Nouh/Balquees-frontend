import { MixType } from "./enums/mixType"

import { Glize } from "./enums/glize"

import { MixComponent } from "./mixComponent"

export interface EngobMix {
    _id?: string;
    code: string;
    type: MixType | '';
    glize: Glize | '';
    components?: Array<MixComponent>;
    createdAt?: string;
}