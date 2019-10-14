import { MixType } from './enums/mixType';
import { MixComponent } from './mixComponent';
import { Glize } from './enums/glize'

export interface PaintMix {
    _id?: string;
    code: string;
    type: MixType | '';
    glize: Glize | '';
    components?: Array<MixComponent>;
    createdAt?: string;
}
