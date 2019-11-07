import { Material } from './material';
export interface BodyMixComponent {
    material: Material;
    quantity: number;
    moisture: number;
    dryRM: number;
    wetRM: number;
    wet: number;
}
