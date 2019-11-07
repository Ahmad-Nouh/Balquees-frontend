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

  constructor(private http: HttpClient) { }

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
}
