import { Observable } from 'rxjs';
import { Warehouse } from './../models/Warehouse';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
  warehouses: any = [];

  constructor(private http: HttpClient) { }

  getWarehouses(): Promise<any> {
    return this.http.get(`${environment.backend}/api/warehouse`).toPromise();
  }

  updateWarehouse(id: string, newWarehouse): Observable<any> {
    return this.http.put(`${environment.backend}/api/warehouse/${id}`, newWarehouse);
  }

  sortWareHouses(): void {
    if (this.warehouses[0].order > 0) {
      const temp = {...this.warehouses[0]};
      this.warehouses[0] = {...this.warehouses[1]};
      this.warehouses[1] = temp
    }

    console.log('after sort ', this.warehouses);
  }
}
