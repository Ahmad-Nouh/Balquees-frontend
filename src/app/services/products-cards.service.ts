import { ProductCard } from './../models/productCard';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsCardsService {
  public productCards: Array<ProductCard> = [];

  public onProductCardsChange = new BehaviorSubject<any>([]);

  public selectedProduct: ProductCard;

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


  removeProductCard(productId): Observable<any> {
    return this.http.delete(`${environment.backend}/api/productCard/${productId}`);
  }

  editProductCard(productId, newVal): Observable<any> {
    return this.http.put(`${environment.backend}/api/productCard/${productId}`, newVal);
  }

  attachImage(productId, newVal): Observable<any> {
    return this.http.patch(`${environment.backend}/api/productCard/${productId}`, newVal);
  }
}
