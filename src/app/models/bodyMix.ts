import { BodyMixComponent } from './bodyMixComponent';

export interface BodyMix {
    _id?: string;
    code: string;
    components?: Array<BodyMixComponent>;
    createdAt?: string;
}
