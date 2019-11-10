import { Warehouse } from "./Warehouse";

export interface Material {
    _id?: string,
    name: string;
    quantity: number;
    warehouse: any;
    createdAt?: string;
    updatedAt?: string;
}