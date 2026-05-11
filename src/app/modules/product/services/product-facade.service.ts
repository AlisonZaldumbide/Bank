import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, EMPTY, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { ProductService } from './product.service';
import { ApiError } from '../models/api-error.model';

@Injectable({
  providedIn: 'root'
})
export class ProductFacadeService {
  private readonly _productsSubject = new BehaviorSubject<Product[]>([]);
  private readonly _loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly _errorSubject = new BehaviorSubject<ApiError | null>(null);

  readonly products$: Observable<Product[]> = this._productsSubject.asObservable();
  readonly loading$: Observable<boolean> = this._loadingSubject.asObservable();
  readonly error$: Observable<ApiError | null> = this._errorSubject.asObservable();

  constructor(private readonly _productService: ProductService) { }

  loadProducts(): void {
    this._loadingSubject.next(true);
    this._errorSubject.next(null);

    this._productService.getProducts().pipe(
      tap(products => this._productsSubject.next(products)),
      catchError((error: ApiError) => {
        this._productsSubject.next([]);
        this._errorSubject.next(error);
        return EMPTY;
      }),
      finalize(() => this._loadingSubject.next(false))
    ).subscribe();
  }

  deleteProduct(id: string): Observable<unknown> {
    this._loadingSubject.next(true);
    this._errorSubject.next(null);

    return this._productService.deleteProduct(id).pipe(
      tap(() => {
        const current = this._productsSubject.getValue();
        this._productsSubject.next(current.filter(product => product.id !== id));
      }),
      catchError((error: ApiError) => {
        this._errorSubject.next(error);
        return throwError(() => error);
      }),
      finalize(() => this._loadingSubject.next(false))
    );
  }
}
