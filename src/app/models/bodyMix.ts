import { BodyMixComponent } from './bodyMixComponent';
import { MixType } from './enums/mixType';

export interface BodyMix {
    _id?: string;
    code: string;
    type: MixType | '';
    components?: Array<BodyMixComponent>;
    createdAt?: string;
}
