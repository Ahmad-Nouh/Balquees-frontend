import { Material } from './material';

export interface Warehouse {
    _id?: string,
    name_en: string;
    name_ar: string;
    materials: Array<Material>;
    order?: number;
}
