import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductFormComponent } from './product-form.component';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { expect } from '@jest/globals';
import { ModalService } from '../../../main/services/modal.service';

const mockRouter = {
  navigate: jest.fn()
};

const mockModalService = {
  open: jest.fn().mockReturnValue(of(true))
};

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let mockProductService: any;
  let mockActivatedRoute: any;

  const mockProduct = {
    id: '123',
    name: 'Producto prueba',
    description: 'Una descripción de prueba',
    logo: 'logo.png',
    date_release: '2025-07-16',
    date_revision: '2026-07-16'
  };

  const getValidDates = () => {
    const releaseDate = new Date();
    releaseDate.setDate(releaseDate.getDate() + 1);
    const revisionDate = new Date(releaseDate);
    revisionDate.setFullYear(releaseDate.getFullYear() + 1);

    return {
      release: releaseDate.toISOString().substring(0, 10),
      revision: revisionDate.toISOString().substring(0, 10)
    };
  };

  beforeEach(async () => {
    mockProductService = {
      readProduct: jest.fn().mockReturnValue(of(mockProduct)),
      createProduct: jest.fn().mockReturnValue(of({})),
      updateProduct: jest.fn().mockReturnValue(of({})),
      getIdExists: jest.fn().mockReturnValue(of(false))
    };

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jest.fn((key) => {
            if (key === 'id') return '123';
            return null;
          })
        }
      }
    };

    await TestBed.configureTestingModule({
      declarations: [ProductFormComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: ModalService, useValue: mockModalService },
        FormBuilder,
        ChangeDetectorRef
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should create the form on init', () => {
    expect(component.form.contains('id')).toBe(true);
    expect(component.form.contains('name')).toBe(true);
    expect(component.form.contains('description')).toBe(true);
    expect(component.form.contains('logo')).toBe(true);
    expect(component.form.contains('date_release')).toBe(true);
    expect(component.form.contains('date_revision')).toBe(true);
  });

  it('should set revision date one year after release date', () => {
    const releaseDate = new Date();
    const nextYear = new Date(releaseDate);
    nextYear.setFullYear(releaseDate.getFullYear() + 1);

    component.form.get('date_release')?.setValue(releaseDate.toISOString().substring(0, 10));
    component.setRevisionDate();

    expect(component.form.get('date_revision')?.value).toBe(nextYear.toISOString().substring(0, 10));
  });

  it('should load product if id is present in route', async () => {
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.form.get('id')?.value).toBe(mockProduct.id);
    expect(component.form.get('name')?.value).toBe(mockProduct.name);
  });

  it('should disable id field if editing existing product', async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.form.get('id')?.disabled).toBe(true);
  });

  it('should call addProduct when saving a new product', async () => {
    const spy = jest.spyOn(component, 'addProduct');
    component.id = null;
    const dates = getValidDates();
    const idControl = component.form.get('id');
    idControl?.enable();
    idControl?.clearAsyncValidators();
    idControl?.updateValueAndValidity();

    component.form.setValue({
      id: '123',
      name: 'Test Product',
      description: 'Test Description',
      logo: 'logo.png',
      date_release: dates.release,
      date_revision: dates.revision
    });

    component.saveProduct();
    expect(spy).toHaveBeenCalled();
  });

  it('should call updateProduct if id is present', async () => {
    const spy = jest.spyOn(component, 'updateProduct');
    const dates = getValidDates();

    component.id = '123';
    component.product = mockProduct;

    component.resetForm();
    component.form.get('id')?.disable();
    component.form.get('id')?.clearAsyncValidators();
    component.form.get('id')?.updateValueAndValidity();
    component.form.get('date_revision')?.enable();

    component.form.patchValue({
      name: 'Updated Product',
      description: 'Updated description',
      logo: 'logo.png',
      date_release: dates.release,
      date_revision: dates.revision
    });
    component.form.get('date_revision')?.disable();
    component.form.updateValueAndValidity();

    await fixture.whenStable();
    component.saveProduct();

    expect(spy).toHaveBeenCalledWith(expect.any(Object), '123');
  });


  it('should show errors if form is invalid on submit', () => {
    component.form.reset();
    component.saveProduct();
    expect(component.showErrors).toBe(true);
  });

  it('should reset the form if no id is present', () => {
    component.id = null;
    component.form.setValue({
      id: 'reset-id',
      name: 'Reset Name',
      description: 'Reset Desc',
      logo: 'logo.png',
      date_release: '2025-01-01',
      date_revision: '2026-01-01'
    });

    component.resetForm();

    expect(component.form.get('id')?.value).toBeFalsy();
    expect(component.form.get('name')?.value).toBeFalsy();
  });

  it('should restore product data when resetForm is called in edit mode', () => {
    component.id = '123';
    component.product = mockProduct;

    component.resetForm();
    expect(component.form.get('name')?.value).toBe(mockProduct.name);
  });
});
