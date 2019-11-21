import { WarehouseService } from './warehouse.service';
import { Material } from './../models/material';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaterialsService {
  materials: Array<Material> = [];
  warehouseMaterials: any = {};

  constructor(private http: HttpClient,
              private warehouseService: WarehouseService) { }

  getMaterials(): Promise<any> {
    return this.http.get(`${environment.backend}/api/material`).toPromise();
  }

  createMaterial(newMaterial: Material): Observable<any> {
    return this.http.post(`${environment.backend}/api/material`, newMaterial);
  }

  deleteMaterial(id: string): Observable<any> {
    return this.http.delete(`${environment.backend}/api/material/${id}`);
  }

  updateMaterial(id: string, newMaterial): Observable<any> {
    return this.http.put(`${environment.backend}/api/material/${id}`, newMaterial);
  }


  removeFromArray(item: any): void {
    const index = this.materials.findIndex((mat: Material) => mat._id === item._id);
    if (index >= 0) {
      this.materials.splice(index, 1);
    }
  }

  removeFromMap(id ,item: any): void {
    const index = this.warehouseMaterials[id].findIndex((mat: Material) => mat._id === item._id);
    if (index >= 0) {
      this.warehouseMaterials[id].splice(index, 1);
    }
  }

  updateInMap(id ,item: any): void {
    const index = this.warehouseMaterials[id].findIndex((mat: Material) => mat._id === item._id);
    if (index >= 0) {
      this.warehouseMaterials[id][index] = item;
    }
  }

  addToArray(item: any): void {
    this.materials.push(item);
  }

  addToWarehouseMap(warehouseID: string, item: any): void {
    if (this.warehouseMaterials[warehouseID]) {
      this.warehouseMaterials[warehouseID].push(item);
    } else {
      this.warehouseMaterials[warehouseID] = [item];
    }
  }

  splitMaterials(): any {
    const data = {};
    this.materials.forEach((mat: Material) => {
      // if key exist
      if (data[mat.warehouse._id]) {
        data[mat.warehouse._id].push(mat);
      } else {
        // if key not exist
        data[mat.warehouse._id] = [mat];
      }
    });

    return data;
  }

  getPaintMaterials(): Array<Material> {
    let index = 0;
    for (const item of this.warehouseService.warehouses) {
      if (item.order === 0) {
        break;
      }
      index++;
    }
    const paintID = this.warehouseService.warehouses[index]._id;
    const paintData = this.warehouseMaterials[paintID] ? this.warehouseMaterials[paintID].slice() : [];
    return paintData;
  }

  getClayMaterials(): Array<Material> {
    let index = 0;
    for (const item of this.warehouseService.warehouses) {
      if (item.order === 1) {
        break;
      }
      index++;
    }
    const clayID = this.warehouseService.warehouses[index]._id;
    const clayData = this.warehouseMaterials[clayID] ? this.warehouseMaterials[clayID].slice() : [];
    return clayData;
  }
}
