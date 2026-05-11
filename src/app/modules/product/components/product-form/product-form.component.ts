import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { catchError, delay, finalize, of, Subject, takeUntil, tap } from 'rxjs';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { minDateValidator } from '../../validators/min-date.validator';
import { existsValidator } from '../../validators/exists.validator';
import { revisionDateValidator } from '../../validators/revision-date.validator';
import { ApiError } from '../../models/api-error.model';
import { ModalService } from '../../../main/services/modal.service';

@Component({
  selector: 'app-product-form',
  standalone: false,
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit, OnDestroy {
  private readonly _destroy$ = new Subject<void>();

  public product: Product | null;
  public id: string | null;
  public form: FormGroup;
  public showErrors: boolean;
  public minDate: string;
  public isLoading: boolean;

  constructor(
    private readonly _productSvc: ProductService,
    private readonly _route: ActivatedRoute,
    private readonly _fb: FormBuilder,
    private readonly _router: Router,
    private readonly _changeDetector: ChangeDetectorRef,
    private readonly _modalSvc: ModalService
  ) {
    this.product = null;
    this.id = null;
    this.showErrors = false;
    this.form = new FormGroup({});
    this.minDate = '';
    this.isLoading = false;
  }


  ngOnInit() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    this.minDate = `${yyyy}-${mm}-${dd}`;
    this.id = this._route.snapshot.paramMap.get('id');
    this._createForm();
    if (this.id) {
      this._getProduct(this.id);
    }
  }


  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _createForm() {
    this.form = this._fb.group({
      id: this._fb.control(null, [Validators.required, Validators.minLength(3), Validators.maxLength(10)], [existsValidator(this._productSvc)]),
      name: this._fb.control(null, [Validators.required, Validators.minLength(6), Validators.maxLength(100)]),
      description: this._fb.control(null, [Validators.required, Validators.minLength(10), Validators.maxLength(200)]),
      logo: this._fb.control(null, Validators.required),
      date_release: this._fb.control(null, [Validators.required, minDateValidator]),
      date_revision: this._fb.control(null, Validators.required)
    }, { validators: revisionDateValidator });
  }

  private _setForm() {
    this.form.get('id')?.setValue(this.product?.id);
    this.form.get('name')?.setValue(this.product?.name);
    this.form.get('description')?.setValue(this.product?.description);
    this.form.get('logo')?.setValue(this.product?.logo);
    this.form.get('date_release')?.setValue(this.product?.date_release);
    this.form.get('date_revision')?.setValue(this.product?.date_revision);
    this.form.get('date_revision')?.disable();
    if (this.id) {
      this.form.get('id')?.disable();
      this.form.get('id')?.clearAsyncValidators();
      this.form.get('id')?.updateValueAndValidity();
    }
    this.form.updateValueAndValidity();
  }


  private _getProduct(id: string) {
    this.isLoading = true;
    this._productSvc.readProduct(id)
      .pipe(
        delay(1000),
        tap(x => {
          this.product = x;
          this._setForm();
        }),
        finalize(() => {
          this.isLoading = false;
          this._changeDetector.detectChanges();
        }),
        catchError((err) => {
          this._openErrorModal(err as ApiError);
          return of(null);
        }),
        takeUntil(this._destroy$)
      ).subscribe();
  }

  public getErrors(control: string): boolean {
    const ctrl = this.form.get(control);
    return (ctrl && ctrl.errors?.['required'] && this.showErrors);
  }

  public getPatternError(control: string) {
    const ctrl = this.form.get(control);
    return (ctrl && (ctrl.errors?.['minlength'] || ctrl.errors?.['maxlength']) && this.showErrors);
  }

  public verifyAlreadyExists(control: string) {
    const ctrl = this.form.get(control);
    return (ctrl && ctrl.errors?.['idExists'] && this.showErrors);
  }

  public getMinDateError(control: string) {
    const ctrl = this.form.get(control);
    return (ctrl && ctrl.errors?.['minDate'] && this.showErrors);
  }

  public getRevisionDateError(): boolean {
    return !!this.form.errors?.['revisionDateInvalid'] && this.showErrors;
  }

  public setRevisionDate() {
    const release = this.form.get('date_release')?.value;
    if (release) {
      const releaseDate = new Date(release);
      const revisionDate = new Date(releaseDate);
      revisionDate.setFullYear(releaseDate.getFullYear() + 1);

      this.form.get('date_revision')?.setValue(revisionDate.toISOString().substring(0, 10));
    }
  }


  public saveProduct() {
    if (this.form.valid) {
      const request = this._buildRequest();
      if (this.id) {
        this.updateProduct(request, this.id);
      } else {
        this.addProduct(request);
      }
    } else {
      this.showErrors = true;
      this.form.markAllAsTouched();
    }
  }

  public resetForm() {
    if (this.id) {
      this._setForm();
    } else {
      this.form.reset();
    }
  }

  public addProduct(request: Product) {
    this._productSvc.createProduct(request).pipe(
      tap(x => {
        this._modalSvc.open({
          title: 'Producto agregado correctamente',
          confirmTitle: 'OK',
          type: 'Success'
        }).subscribe(() => {
          this._router.navigate(['/products']);
        });
      }),
      catchError((err: ApiError) => {
        this._openErrorModal(err);
        return of(null);
      }),
      takeUntil(this._destroy$)
    ).subscribe();
  }

  public updateProduct(request: Product, id: string) {
    this._productSvc.updateProduct(id, request).pipe(
      tap(x => {
        this._modalSvc.open({
          title: 'Producto actualizado correctamente',
          confirmTitle: 'OK',
          type: 'Success'
        }).subscribe(() => {
          this._router.navigate(['/products']);
        });
      }),
      catchError((err: ApiError) => {
        this._openErrorModal(err);
        return of(null);
      }),
      takeUntil(this._destroy$)
    ).subscribe();
  }

  private _buildRequest(): Product {
    const rawValue = this.form.getRawValue();
    return {
      id: rawValue.id,
      name: rawValue.name,
      description: rawValue.description,
      logo: rawValue.logo,
      date_release: rawValue.date_release,
      date_revision: rawValue.date_revision
    };
  }

  private _openErrorModal(error: ApiError): void {
    this._modalSvc.open({
      title: `Error: ${error.message || 'Ha ocurrido un error inesperado'}`,
      confirmTitle: 'OK',
      type: 'Error'
    }).subscribe();
  }
}
