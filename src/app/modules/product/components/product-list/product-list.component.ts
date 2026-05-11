import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { Subject, takeUntil } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ModalService } from '../../../main/services/modal.service';
import { ApiError } from '../../models/api-error.model';
import { ProductFacadeService } from '../../services/product-facade.service';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit, OnDestroy {

  private readonly _destroy$ = new Subject<void>();
  private readonly _searchTerm$ = new Subject<string>();
  private _list: Product[];

  public list: Product[];
  public dropdownOpen: string;
  public pageSize: number;
  public textFilter: string;
  public currentPage: number;
  public isLoading: boolean;

  constructor(
    private readonly _productFacade: ProductFacadeService,
    private readonly _changeDetector: ChangeDetectorRef,
    private readonly _router: Router,
    private readonly _modalSvc: ModalService
  ) {
    this._list = [];
    this.currentPage = 1;
    this.list = [];
    this.dropdownOpen = '';
    this.pageSize = 5;
    this.textFilter = '';
    this.isLoading = false;
  }


  ngOnInit() {
    this._initSearch();
    this.getProducts();
  }


  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  getProducts() {
    this._productFacade.products$
      .pipe(takeUntil(this._destroy$))
      .subscribe(products => {
        this._list = products;
        this.filterList();
        this._changeDetector.detectChanges();
      });

    this._productFacade.loading$
      .pipe(takeUntil(this._destroy$))
      .subscribe(loading => {
        this.isLoading = loading;
        this._changeDetector.detectChanges();
      });

    this._productFacade.error$
      .pipe(takeUntil(this._destroy$))
      .subscribe(error => {
        if (error) {
          this._openErrorModal(error);
        }
      });

    this._productFacade.loadProducts();
  }


  public toggleDropdown(id: string) {
    if (this.dropdownOpen == id) {
      this.dropdownOpen = '';
    } else {
      this.dropdownOpen = id;
    }
    this._changeDetector.detectChanges();
  }

  public filterList() {
    const term = this.textFilter.toLowerCase().trim();
    const filtered = this._list.filter(product =>
      product.id.toLowerCase().includes(term) ||
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term)
    );

    this.list = filtered;
    this.list = this.list.slice(0);
    this.currentPage = 1;
  }

  public onSearchChange(value: string): void {
    this.textFilter = value ?? '';
    this._searchTerm$.next(this.textFilter);
  }

  public clearSearch(): void {
    this.onSearchChange('');
  }

  public totalPages(): number {
    return Math.max(1, Math.ceil(this.list.length / this.pageSize));
  }

  public paginatedList() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.list.slice(start, start + this.pageSize);
  }

  public onPageSizeChange() {
    this.currentPage = 1;
    this.filterList();
  }

  public nextPage() {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
      this._changeDetector.detectChanges();
    }
  }

  public previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this._changeDetector.detectChanges();
    }
  }

  public addProduct() {
    this._router.navigate(['/products/new']);
  }

  public editProduct(id: string) {
    this._router.navigate(['/products/edit', id]);
  }

  public onDeleteProduct(product: Product) {
    this.toggleDropdown(product.id);
    this._modalSvc.open({
      title: '¿Estás seguro de que deseas eliminar el producto ' + product.name + '?',
      confirmTitle: 'Eliminar',
      cancelTitle: 'Cancelar',
      type: 'Info'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.deleteProduct(product.id);
      }
    });
  }

  public deleteProduct(id: string) {
    this._productFacade.deleteProduct(id)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: () => {
          this.currentPage = 1;
          this.filterList();
          this._modalSvc.open({
            title: 'Producto eliminado correctamente',
            confirmTitle: 'OK',
            type: 'Success'
          }).subscribe();
        },
        error: (error: ApiError) => {
          this._openErrorModal(error);
        }
      });
  }

  private _openErrorModal(error: ApiError): void {
    this._modalSvc.open({
      title: `Error: ${error.message || 'Ha ocurrido un error inesperado'}`,
      confirmTitle: 'OK',
      type: 'Error'
    }).subscribe();
  }

  private _initSearch(): void {
    this._searchTerm$
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        takeUntil(this._destroy$)
      )
      .subscribe(() => {
        this.filterList();
        this._changeDetector.detectChanges();
      });
  }

}
