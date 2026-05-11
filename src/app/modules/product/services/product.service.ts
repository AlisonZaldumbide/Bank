import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { ApiResponse } from '../models/api-response.model';
import { mapHttpError } from '../../../core/utils/http-error.util';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly _baseUrl = 'http://localhost:3002/bp/products';

  constructor(private readonly _http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this._http.get<ApiResponse<Product[]>>(this._baseUrl).pipe(
      map(res => res.data ?? []),
      catchError(this.handleError)
    );
  }

  getIdExists(id: string): Observable<boolean> {
    return this._http.get<boolean>(`${this._baseUrl}/verification/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createProduct(product: Product): Observable<ApiResponse<Product>> {
    return this._http.post<ApiResponse<Product>>(this._baseUrl, product).pipe(
      catchError(error => this.handleError(error))
    );
  }

  readProduct(id: string): Observable<Product | null> {
    const url = `${this._baseUrl}/${id}`;
    return this._http.get<Product>(url).pipe(
      catchError(this.handleError)
    );
  }

  updateProduct(id: string, product: Omit<Product, 'id'>): Observable<ApiResponse<Product>> {
    return this._http.put<ApiResponse<Product>>(`${this._baseUrl}/${id}`, product).pipe(
      catchError(error => this.handleError(error))
    );
  }

  deleteProduct(id: string): Observable<ApiResponse<null>> {
    return this._http.delete<ApiResponse<null>>(`${this._baseUrl}/${id}`).pipe(
      catchError(error => this.handleError(error))
    );
  }


  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(() => mapHttpError(error));
  }

}
