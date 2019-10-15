import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BodyMix } from '../models/bodyMix';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class BodyMixesService {
  constructor(private http: HttpClient) { }

  getBodyMixes(): Promise<any> {
    return this.http.get(`${environment.backend}/api/body`).toPromise();
  }

  createBodyMix(newBodyMix: BodyMix): Observable<any> {
    return this.http.post(`${environment.backend}/api/body`, newBodyMix);
  }

  deleteBodyMix(id: string): Observable<any> {
    return this.http.delete(`${environment.backend}/api/body/${id}`);
  }

  updateBodyMix(id: string, newMix): Observable<any> {
    return this.http.put(`${environment.backend}/api/body/${id}`, newMix);
  }
}
