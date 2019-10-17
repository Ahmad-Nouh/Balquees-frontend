import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { EngobMix } from '../models/engobMix';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EngobMixesService {

  constructor(private http: HttpClient) { }

  getEngobMixes(): Promise<any> {
    return this.http.get(`${environment.backend}/api/engob`).toPromise();
  }

  createEngobMix(newEngobMix: EngobMix): Observable<any> {
    return this.http.post(`${environment.backend}/api/engob`, newEngobMix);
  }

  deleteEngobMix(id: string): Observable<any> {
    return this.http.delete(`${environment.backend}/api/engob/${id}`);
  }

  updateEngobMix(id: string, newMix): Observable<any> {
    return this.http.put(`${environment.backend}/api/engob/${id}`, newMix);
  }

}
