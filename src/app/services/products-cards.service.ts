import { ProductCard } from './../models/productCard';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsCardsService {
  public productCards: Array<ProductCard> = [];

  constructor(private http: HttpClient) { }

  createProductCard(newProductCard: any): Observable<any> {
    const httpUploadOptions = {
      headers: new HttpHeaders({ "Accept": "application/json" })
    }
    return this.http.post(`${environment.backend}/api/productCard`, newProductCard, httpUploadOptions);
  }


  getProductCards(): Observable<any> {
    return this.http.get(`${environment.backend}/api/productCard`);
  }
}
