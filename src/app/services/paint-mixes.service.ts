import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PaintMix } from '../models/paintMix';


@Injectable({
  providedIn: 'root'
})
export class PaintMixesService {

  constructor(private http: HttpClient) { }

  getPaintMixes(): Promise<any> {
    return this.http.get(`${environment.backend}/api/paint`).toPromise();
  }

  createPaintMix(newPaintMix: PaintMix): Observable<any> {
    return this.http.post(`${environment.backend}/api/paint`, newPaintMix);
  }

  deletePaintMix(id: string): Observable<any> {
    return this.http.delete(`${environment.backend}/api/paint/${id}`);
  }

  updatePaintMix(id: string, newMix): Observable<any> {
    return this.http.put(`${environment.backend}/api/paint/${id}`, newMix);
  }
}
